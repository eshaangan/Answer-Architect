from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from datetime import datetime, timedelta
from sqlalchemy import func
import time

from app.models import UserPrompt, PromptResponse, DebugPromptResponse, HealthResponse
from app.gpt_service import gpt_service
from app.database import log_prompt_interaction, get_db, PromptLog
from app.auth import verify_token, get_client_ip
from app.rate_limiter import limiter, rate_limit_string
from app.config import settings

# Track startup time for uptime calculation
startup_time = time.time()

# Create FastAPI app
app = FastAPI(
    title="Answer Architect API",
    description="An AI system that refines user prompts before generating responses",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add rate limiter to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    uptime = time.time() - startup_time
    return HealthResponse(
        status="healthy", 
        message="API is running",
        uptime_seconds=uptime
    )


@app.post("/prompt", response_model=PromptResponse)
@limiter.limit(rate_limit_string)
async def handle_prompt(
    request: Request,
    input_data: UserPrompt,
    token: str = Depends(verify_token)
):
    """
    Main endpoint: Accept raw user input, refine it, and return the final answer
    """
    try:
        # Get client IP for logging
        client_ip = get_client_ip(request)
        
        # Process the user input through GPT refinement pipeline with style
        refined_prompt, final_answer, model_used, total_time, refinement_time, generation_time = gpt_service.process_user_input(
            input_data.text, 
            input_data.style or "balanced",
            input_data.skip_refinement or False
        )
        
        # Log the interaction
        log_prompt_interaction(
            raw_input=input_data.text,
            refined_prompt=refined_prompt,
            final_output=final_answer,
            user_ip=client_ip,
            model_used=model_used
        )
        
        # Return only the final answer to the user
        return PromptResponse(
            response=final_answer,
            processing_time_ms=total_time,
            model_used=model_used
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@app.post("/prompt/debug", response_model=DebugPromptResponse)
@limiter.limit("5/minute")  # More restrictive rate limit for debug endpoint
async def handle_prompt_debug(
    request: Request,
    input_data: UserPrompt,
    token: str = Depends(verify_token)
):
    """
    Debug endpoint: Returns raw input, refined prompt, and final answer
    For development and admin use only
    """
    try:
        # Get client IP for logging
        client_ip = get_client_ip(request)
        
        # Process the user input through GPT refinement pipeline with style
        refined_prompt, final_answer, model_used, total_time, refinement_time, generation_time = gpt_service.process_user_input(
            input_data.text, 
            input_data.style or "balanced",
            input_data.skip_refinement or False
        )
        
        # Log the interaction
        log_prompt_interaction(
            raw_input=input_data.text,
            refined_prompt=refined_prompt,
            final_output=final_answer,
            user_ip=client_ip,
            model_used=model_used
        )
        
        # Return detailed response for debugging
        return DebugPromptResponse(
            raw_input=input_data.text,
            refined_prompt=refined_prompt,
            final_response=final_answer,
            model_used=model_used,
            processing_time_ms=total_time,
            refinement_time_ms=refinement_time,
            generation_time_ms=generation_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@app.get("/analytics/stats")
async def get_analytics_stats(token: str = Depends(verify_token)):
    """Get basic analytics stats"""
    db = get_db()
    
    # Basic stats that work without database
    basic_stats = {
        "total_requests": 0,
        "requests_24h": 0,
        "unique_users": 0,
        "model_usage": [{"model": settings.default_model, "count": 0}],
        "mock_mode": settings.mock_mode,
        "uptime_seconds": time.time() - startup_time,
        "database_available": db is not None
    }
    
    if db is None:
        # Return basic stats when database is not available
        return basic_stats
    
    try:
        # Total requests
        total_requests = db.query(PromptLog).count()
        
        # Requests in last 24 hours
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_requests = db.query(PromptLog).filter(PromptLog.timestamp >= yesterday).count()
        
        # Most common models
        model_stats = db.query(
            PromptLog.model_used, 
            func.count(PromptLog.model_used).label('count')
        ).group_by(PromptLog.model_used).all()
        
        # Unique IPs
        unique_ips = db.query(PromptLog.user_ip).distinct().count()
        
        return {
            "total_requests": total_requests,
            "requests_24h": recent_requests,
            "unique_users": unique_ips,
            "model_usage": [{"model": stat[0], "count": stat[1]} for stat in model_stats] if model_stats else [{"model": settings.default_model, "count": total_requests}],
            "mock_mode": settings.mock_mode,
            "uptime_seconds": time.time() - startup_time,
            "database_available": True
        }
    except Exception as e:
        # Return basic stats if database query fails
        basic_stats["error"] = f"Database query failed: {str(e)}"
        return basic_stats
    finally:
        if db:
            db.close()


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Answer Architect API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "prompt": "/prompt", 
            "debug": "/prompt/debug",
            "analytics": "/analytics/stats"
        },
        "authentication": "Bearer token required",
        "model": settings.model_name,
        "mock_mode": settings.mock_mode,
        "uptime_seconds": time.time() - startup_time
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 