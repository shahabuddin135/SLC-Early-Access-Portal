import asyncio
from sqlalchemy import text
from app.core.database import engine
from app.core.security import hash_password

async def reset():
    new_hash = hash_password("Adm1n!SLC2026")
    async with engine.begin() as conn:
        r = await conn.execute(
            text("UPDATE users SET password_hash=:h WHERE email='voyagersvrs135@gmail.com' RETURNING id"),
            {"h": new_hash}
        )
        row = r.fetchone()
        print("Updated user id:", row[0] if row else "NOT FOUND — will register fresh")

asyncio.run(reset())
