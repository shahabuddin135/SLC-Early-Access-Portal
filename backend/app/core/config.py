from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    DOWNLOAD_KEY: str = ""  # Legacy — kept for any existing tokens
    DOWNLOAD_FILE_URL: str = ""  # File path or HTTP URL to the distributable ZIP
    SUPABASE_SERVICE_KEY: str = ""  # Service role key for private Supabase Storage
    ADMIN_EMAILS: str = ""  # Comma-separated list of admin/creator emails
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 60
    EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES: int = 1440
    FRONTEND_URL: str = "http://localhost:3000"
    # Extra comma-separated hostnames allowed in emailed links (besides FRONTEND_URL's
    # host, *.vercel.app and localhost). Usually unnecessary.
    ALLOWED_REDIRECT_HOSTS: str = ""
    ENVIRONMENT: str = "development"
    RESEND_API_KEY: str = ""

    @property
    def admin_emails_set(self) -> frozenset[str]:
        """Parse the comma-separated ADMIN_EMAILS env var into a frozenset."""
        return frozenset(
            e.strip().lower() for e in self.ADMIN_EMAILS.split(",") if e.strip()
        )

    @property
    def resend_enabled(self) -> bool:
        return bool(self.RESEND_API_KEY)

    model_config = {"env_file": ".env"}


settings = Settings()
