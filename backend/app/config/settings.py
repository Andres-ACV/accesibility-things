from pydantic_settings import BaseSettings
from typing import Optional
import os
from pydantic import Field

class Settings(BaseSettings):
    # Database
    database_url: str = Field(..., env="DATABASE_URL")
    
    # JWT
    secret_key: str = "your-super-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Email (for password reset)
    smtp_server: Optional[str] = None
    smtp_port: int = 587
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    
    class Config:
        # Buscar el archivo .env en el directorio raíz del proyecto (un nivel arriba de backend/)
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
        # If you want to allow extra fields, set this to "allow"
        extra = "forbid"

settings = Settings() 