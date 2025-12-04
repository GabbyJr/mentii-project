import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Mentii"
    secret_key: str = "mentii-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    database_url: str = "sqlite:///./mentii.db"
    
    class Config:
        env_file = ".env"

settings = Settings()