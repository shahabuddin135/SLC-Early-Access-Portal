from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class DownloadEvent(SQLModel, table=True):
    __tablename__ = "download_events"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    downloaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = Field(default=None, max_length=45)
