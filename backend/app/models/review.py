from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class ReviewSubmission(SQLModel, table=True):
    __tablename__ = "review_submissions"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", unique=True)
    project_link: str = Field(max_length=500)
    review_text: str = Field(max_length=2000)
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
