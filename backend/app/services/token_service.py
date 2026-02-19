import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.constants import DOWNLOAD_TOKEN_TTL
from app.models.download_token import DownloadToken


async def create_download_token(user_id: int, session: AsyncSession) -> str:
    """Create a single-use download token valid for DOWNLOAD_TOKEN_TTL seconds."""
    token_value = str(uuid.uuid4())
    token = DownloadToken(token_value=token_value, user_id=user_id)
    session.add(token)
    await session.commit()
    return token_value


async def validate_and_use_token(
    token_value: str, session: AsyncSession
) -> DownloadToken:
    """Validate the token and atomically mark it used. Raises 403 on any failure."""
    result = await session.execute(
        select(DownloadToken)
        .where(DownloadToken.token_value == token_value)
        .with_for_update()
    )
    token = result.scalar_one_or_none()

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or expired download token.",
        )
    if token.used:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This download token has already been used.",
        )

    # Check expiry
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if now > token.created_at + timedelta(seconds=DOWNLOAD_TOKEN_TTL):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Download token expired. Tokens are valid for {DOWNLOAD_TOKEN_TTL} seconds.",
        )

    token.used = True
    session.add(token)
    await session.commit()
    return token
