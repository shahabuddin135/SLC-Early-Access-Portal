from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.review import PublicReview, ReviewRequest, ReviewResponse
from app.services.review_service import list_public_reviews, submit_review

router = APIRouter(tags=["review"])


@router.get("/reviews", response_model=list[PublicReview])
async def get_reviews(session: AsyncSession = Depends(get_session)):
    """Public — powers the Builder Archive on the landing page."""
    return await list_public_reviews(session=session)


@router.post("/review", response_model=ReviewResponse, status_code=201)
async def create_review(
    data: ReviewRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Signed-in submission — the account is the author, one review per user."""
    result = await submit_review(data=data, user=current_user, session=session)
    return ReviewResponse(
        id=result.id,
        user_id=result.user_id,
        name=current_user.name,
        project_link=result.project_link,
        review_text=result.review_text,
        submitted_at=result.submitted_at,
    )
