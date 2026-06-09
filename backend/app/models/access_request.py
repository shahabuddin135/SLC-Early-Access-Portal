from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class AccessRequest(SQLModel, table=True):
    __tablename__ = "access_requests"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    # Snapshot of the requester's details at request time (cheap to display
    # in the admin table without a join).
    email: str = Field(max_length=255, index=True)
    name: str = Field(max_length=100)
    github_id: str = Field(max_length=100)
    status: str = Field(default="pending", max_length=20, index=True)  # pending | granted | denied
    key_id: Optional[int] = Field(default=None, foreign_key="keys.id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None)
    )
    decided_at: Optional[datetime] = Field(default=None)
