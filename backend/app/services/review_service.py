from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.review import ReviewSubmission
from app.models.user import User
from app.schemas.review import ReviewRequest


async def submit_review(
    data: ReviewRequest,
    user: User,
    session: AsyncSession,
) -> ReviewSubmission:
    if not user.has_downloaded:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must download the SLC files before submitting a review",
        )

    result = await session.execute(
        select(ReviewSubmission).where(ReviewSubmission.user_id == user.id)
    )
    existing = result.scalar_one_or_none()

    project_link_str = str(data.project_link)

    if existing:
        existing.project_link = project_link_str
        existing.review_text = data.review_text
        existing.submitted_at = datetime.utcnow()
        session.add(existing)
        await session.commit()
        await session.refresh(existing)
        return existing

    review = ReviewSubmission(
        user_id=user.id,
        project_link=project_link_str,
        review_text=data.review_text,
    )
    session.add(review)
    await session.commit()
    await session.refresh(review)
    return review
