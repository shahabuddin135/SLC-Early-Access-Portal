from fastapi import Depends, HTTPException, status

from app.constants import ADMIN_EMAILS
from app.dependencies.auth import get_current_user
from app.models.user import User


async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that blocks non-admin users with 403.
    Admin emails are hardcoded in app/constants.py and cannot be overridden
    via environment variables."""
    if current_user.email not in ADMIN_EMAILS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return current_user
