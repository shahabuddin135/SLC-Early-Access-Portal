from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.review import ReviewRequest, ReviewResponse
from app.services.review_service import submit_review

router = APIRouter(tags=["review"])


@router.post("/review", response_model=ReviewResponse, status_code=201)
async def create_review(
    data: ReviewRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await submit_review(data=data, user=current_user, session=session)
    return ReviewResponse(
        id=result.id,
        user_id=result.user_id,
        project_link=result.project_link,
        review_text=result.review_text,
        submitted_at=result.submitted_at,
    )
