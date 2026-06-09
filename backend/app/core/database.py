from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from app.core.config import settings

# All models must be imported here so SQLModel.metadata knows about them
# before create_db_and_tables() calls create_all()
from app.models.access_request import AccessRequest  # noqa: F401
from app.models.download import DownloadEvent  # noqa: F401
from app.models.download_token import DownloadToken  # noqa: F401
from app.models.key import Key  # noqa: F401
from app.models.review import ReviewSubmission  # noqa: F401
from app.models.user import User  # noqa: F401

# Neon PostgreSQL requires SSL — pass via connect_args for asyncpg
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
    connect_args={"ssl": "require"},
)

async_session_maker = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def get_session():
    async with async_session_maker() as session:
        yield session


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        # Idempotent migrations — safe to run on every startup
        for stmt in (
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP",
            "ALTER TABLE keys ADD COLUMN IF NOT EXISTS assigned_email VARCHAR(255)",
            "ALTER TABLE keys ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP",
        ):
            await conn.execute(text(stmt))
        # Note: the legacy `users.terms_agreed_at` column is intentionally left in
        # place (dropping it is destructive). Remove it manually if desired:
        #   ALTER TABLE users DROP COLUMN terms_agreed_at;
