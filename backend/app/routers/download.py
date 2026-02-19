import os
from urllib.parse import parse_qs, urlparse

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_session
from app.models.download import DownloadEvent
from app.models.user import User
from app.services.token_service import validate_and_use_token

router = APIRouter(tags=["download"])


def _is_presigned_url(url: str) -> bool:
    """Return True if the URL is a Supabase pre-signed URL (/object/sign/ path
    or has a ?token= query param). Pre-signed URLs carry their own auth and
    must NOT receive an extra Authorization header."""
    parsed = urlparse(url)
    if "/object/sign/" in parsed.path:
        return True
    if "token" in parse_qs(parsed.query):
        return True
    return False


@router.get("/download")
async def download_file(
    token: str = Query(..., description="Single-use download token from /redeem"),
    session: AsyncSession = Depends(get_session),
):
    """
    Validate a single-use download token, mark it used, then stream the
    distributable ZIP. The file URL is never sent to the client — it lives
    exclusively in DOWNLOAD_FILE_URL on the server.
    """
    dl_token = await validate_and_use_token(token, session)

    # Update user.has_downloaded and record download event
    user: User | None = await session.get(User, dl_token.user_id)
    if user and not user.has_downloaded:
        user.has_downloaded = True
        session.add(user)
        event = DownloadEvent(user_id=user.id)
        session.add(event)
        await session.commit()

    # Stream the file ─────────────────────────────────────────────────────────
    url = settings.DOWNLOAD_FILE_URL
    if not url:
        raise HTTPException(status_code=503, detail="Download file not configured.")

    if url.startswith(("http://", "https://")):
        # Pre-signed URLs already carry auth in ?token= — adding a service key
        # header alongside will cause Supabase to reject the request.
        # Only add the header for plain private-bucket paths.
        headers = {}
        if settings.SUPABASE_SERVICE_KEY and not _is_presigned_url(url):
            headers["Authorization"] = f"Bearer {settings.SUPABASE_SERVICE_KEY}"
        async with httpx.AsyncClient(timeout=60) as client:
            file_resp = await client.get(url, headers=headers)
            if file_resp.status_code != 200:
                raise HTTPException(
                    status_code=503,
                    detail=(
                        f"File storage returned {file_resp.status_code}. "
                        "Ensure DOWNLOAD_FILE_URL is correctly set on the backend host."
                    ),
                )
        return Response(
            content=file_resp.content,
            media_type="application/zip",
            headers={
                "Content-Disposition": 'attachment; filename="slc-framework.zip"',
                "Cache-Control": "no-store, no-cache, must-revalidate",
                "X-Content-Type-Options": "nosniff",
            },
        )
    else:
        # Local file path (dev only)
        if not os.path.isfile(url):
            raise HTTPException(status_code=503, detail="File not found on server.")
        return FileResponse(
            path=url,
            filename="slc-framework.zip",
            media_type="application/zip",
            headers={
                "Cache-Control": "no-store, no-cache, must-revalidate",
                "X-Content-Type-Options": "nosniff",
            },
        )
