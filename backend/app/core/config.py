from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    DOWNLOAD_KEY: str = ""  # Legacy — kept for any existing tokens
    DOWNLOAD_FILE_URL: str = ""  # File path or HTTP URL to the distributable ZIP
    SUPABASE_SERVICE_KEY: str = ""  # Service role key for private Supabase Storage
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    FRONTEND_URL: str = "http://localhost:3000"
    ENVIRONMENT: str = "development"

    model_config = {"env_file": ".env"}


settings = Settings()
