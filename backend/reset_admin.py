"""One-off ops script: reset a user's password.

Usage (never hardcode credentials — they end up in git history):
    ADMIN_RESET_EMAIL=admin@yourdomain.com ADMIN_RESET_PASSWORD='new-password' python reset_admin.py
"""
import asyncio
import os
import sys

from sqlalchemy import text

from app.core.database import engine
from app.core.security import hash_password

EMAIL = os.environ.get("ADMIN_RESET_EMAIL", "")
PASSWORD = os.environ.get("ADMIN_RESET_PASSWORD", "")

if not EMAIL or not PASSWORD:
    print("Set ADMIN_RESET_EMAIL and ADMIN_RESET_PASSWORD in the environment. Refusing to run.")
    sys.exit(1)


async def reset():
    new_hash = hash_password(PASSWORD)
    async with engine.begin() as conn:
        r = await conn.execute(
            text("UPDATE users SET password_hash=:h WHERE email=:e RETURNING id"),
            {"h": new_hash, "e": EMAIL},
        )
        row = r.fetchone()
        print("Updated user id:", row[0] if row else "NOT FOUND")


asyncio.run(reset())
