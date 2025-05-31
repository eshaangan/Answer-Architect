from datetime import datetime
from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings

Base = declarative_base()


class PromptLog(Base):
    __tablename__ = "prompt_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    raw_input = Column(Text, nullable=False)
    refined_prompt = Column(Text, nullable=False)
    final_output = Column(Text, nullable=False)
    user_ip = Column(String(45), nullable=True)  # For rate limiting
    model_used = Column(String(50), nullable=True)


# Database setup
engine = None
SessionLocal = None

def initialize_database():
    """Initialize database connection if configured"""
    global engine, SessionLocal
    
    if settings.database_url and engine is None:
        try:
            engine = create_engine(settings.database_url)
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            Base.metadata.create_all(bind=engine)
            return True
        except Exception as e:
            print(f"Warning: Could not connect to database: {e}")
            print("Falling back to file logging...")
            engine = None
            SessionLocal = None
            return False
    return engine is not None


def get_db() -> Optional[Session]:
    """Get database session if database is configured"""
    if not initialize_database():
        return None
    
    if SessionLocal is None:
        return None
    
    try:
        db = SessionLocal()
        return db
    except Exception:
        return None


def log_prompt_interaction(
    raw_input: str,
    refined_prompt: str,
    final_output: str,
    user_ip: Optional[str] = None,
    model_used: Optional[str] = None
) -> bool:
    """Log prompt interaction to database if available"""
    db = get_db()
    if db is None:
        # Fallback to file logging if no database
        try:
            with open("prompt_logs.txt", "a") as f:
                f.write(f"[{datetime.utcnow()}] RAW: {raw_input[:100]}... | "
                       f"REFINED: {refined_prompt[:100]}... | "
                       f"OUTPUT: {final_output[:100]}...\n")
            return True
        except Exception:
            return False
    
    try:
        log_entry = PromptLog(
            raw_input=raw_input,
            refined_prompt=refined_prompt,
            final_output=final_output,
            user_ip=user_ip,
            model_used=model_used
        )
        db.add(log_entry)
        db.commit()
        return True
    except Exception:
        db.rollback()
        return False
    finally:
        db.close() 