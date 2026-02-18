from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def record_terms_agreement(user: User, session: AsyncSession) -> User:
    """Record that the user has agreed to the WeWise Labs confidentiality terms."""
    user.terms_agreed_at = datetime.now(timezone.utc).replace(tzinfo=None)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
