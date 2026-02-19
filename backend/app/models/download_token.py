from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class DownloadToken(SQLModel, table=True):
    __tablename__ = "download_tokens"

    id: Optional[int] = Field(default=None, primary_key=True)
    token_value: str = Field(max_length=36, unique=True, index=True)
    user_id: int = Field(foreign_key="users.id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None)
    )
    used: bool = Field(default=False)
