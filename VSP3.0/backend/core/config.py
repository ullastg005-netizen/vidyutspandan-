import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Vidyut Spandan API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Supabase credentials (loaded from env)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://placeholder.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "placeholder-key")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY", None)
    
    # JWT & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "vidyut-spandan-bescom-secret-key-32chars")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
