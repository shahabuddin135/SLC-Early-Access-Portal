import hashlib
import hmac
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.download import DownloadEvent
from app.models.user import User


def _keys_match(user_key: str, expected: str) -> bool:
    """Constant-time comparison — hash both to prevent length-timing leaks."""
    a = hashlib.sha256(user_key.encode("utf-8")).digest()
    b = hashlib.sha256(expected.encode("utf-8")).digest()
    return hmac.compare_digest(a, b)


async def record_download(
    session: AsyncSession,
    user: User,
    key: str = "",
    ip: Optional[str] = None,
) -> User:
    expected = settings.DOWNLOAD_KEY
    if not expected or not _keys_match(key, expected):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid download key. Contact the portal creator to obtain your key.",
        )

    event = DownloadEvent(user_id=user.id, ip_address=ip)
    session.add(event)

    if not user.has_downloaded:
        user.has_downloaded = True
        session.add(user)

    await session.commit()
    await session.refresh(user)
    return user
