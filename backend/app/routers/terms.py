from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.terms_service import record_terms_agreement

router = APIRouter(tags=["terms"])


@router.post("/terms/agree", status_code=200)
async def agree_to_terms(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Record that the authenticated user has agreed to the WeWise Labs
    confidentiality & non-disclosure terms. Timestamp is persisted for audit."""
    await record_terms_agreement(current_user, session)
    return {"agreed": True}
