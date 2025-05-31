from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class UserPrompt(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="The user's raw input prompt")
    style: Optional[str] = Field(default="balanced", description="Response style preference")
    skip_refinement: Optional[bool] = Field(default=False, description="Skip prompt refinement and use prompt directly")


class PromptResponse(BaseModel):
    response: str = Field(..., description="The final generated response")
    processing_time_ms: Optional[float] = None
    model_used: Optional[str] = None


class DebugPromptResponse(BaseModel):
    """Extended response for debugging/admin purposes"""
    model_config = ConfigDict(protected_namespaces=())
    
    raw_input: str
    refined_prompt: str
    final_response: str
    model_used: str
    processing_time_ms: Optional[float] = None
    refinement_time_ms: Optional[float] = None
    generation_time_ms: Optional[float] = None


class HealthResponse(BaseModel):
    status: str
    message: str
    uptime_seconds: Optional[float] = None 