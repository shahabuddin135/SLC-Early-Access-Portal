from fastapi import Depends, HTTPException, status

from app.core.config import settings
from app.dependencies.auth import get_current_user
from app.models.user import User


async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that blocks non-admin users with 403.
    Admin emails are loaded from the ADMIN_EMAILS env var (comma-separated)."""
    if current_user.email.lower() not in settings.admin_emails_set:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return current_user
