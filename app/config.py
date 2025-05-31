import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str
    database_url: Optional[str] = None
    api_secret_key: str = "default-secret-key-change-in-production"
    rate_limit_per_minute: int = 10
    default_model: str = "gpt-4o-mini"
    refinement_model: str = "gpt-4o-mini"
    mock_mode: bool = False  # Toggle to use mock GPT responses
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings() 