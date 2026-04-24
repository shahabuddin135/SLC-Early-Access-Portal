import asyncio
from uuid import uuid4

import httpx

TEST_ID = uuid4().hex[:10]
ADMIN_EMAIL = f"admin_{TEST_ID}@example.com"
USER_EMAIL = f"smoke_{TEST_ID}@example.com"
ADMIN_PASS = "Adm1n!SLC2026"
USER_PASS = "pass123!"
RESET_PASS = "pass123!!"

async def test():
    transport = httpx.ASGITransport(app=__import__("main").app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as c:
        await c.post("/api/v1/auth/register", json={"name": "Admin", "email": ADMIN_EMAIL, "github_id": "gh", "password": ADMIN_PASS})
        await c.post("/api/v1/auth/register", json={"name": "User",  "email": USER_EMAIL,  "github_id": "gh", "password": USER_PASS})
        r = await c.post("/api/v1/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
        if r.status_code != 200:
            print("SMOKE admin login failed:", r.status_code, r.text[:200]); return
        admin_token = r.json()["access_token"]
        r = await c.post("/api/v1/auth/login", json={"email": USER_EMAIL, "password": "pass123!"})
        user_token = r.json()["access_token"]

        # Generate 3 keys (admin)
        r = await c.post("/api/v1/admin/keys/generate", json={"count": 3}, headers={"Authorization": f"Bearer {admin_token}"})
        print("SMOKE generate 3 keys:", r.status_code)
        if r.status_code == 200:
            keys = r.json()
            key1 = keys[0]["key_value"]

            # List keys (admin)
            r = await c.get("/api/v1/admin/keys", headers={"Authorization": f"Bearer {admin_token}"})
            d = r.json()
            print("SMOKE list keys:", r.status_code, "total=" + str(d["total"]) + " unused=" + str(d["unused"]) + " used=" + str(d["used"]))

            # Non-admin list keys -> 403
            r = await c.get("/api/v1/admin/keys", headers={"Authorization": f"Bearer {user_token}"})
            print("SMOKE non-admin list:", r.status_code)

            # Redeem key (user)
            r = await c.post("/api/v1/redeem", json={"key_value": key1}, headers={"Authorization": f"Bearer {user_token}"})
            dl_token = r.json().get("download_token", "")
            print("SMOKE redeem:", r.status_code, "token_len=" + str(len(dl_token)))

            # Redeem same key again -> 400
            r = await c.post("/api/v1/redeem", json={"key_value": key1}, headers={"Authorization": f"Bearer {user_token}"})
            print("SMOKE redeem used key:", r.status_code, r.json().get("detail", ""))

            # Unauthenticated redeem -> 401
            r = await c.post("/api/v1/redeem", json={"key_value": keys[1]["key_value"]})
            print("SMOKE unauth redeem:", r.status_code)

            # Admin sees key as used
            r = await c.get("/api/v1/admin/keys", headers={"Authorization": f"Bearer {admin_token}"})
            d = r.json()
            print("SMOKE after redeem: used=" + str(d["used"]) + " unused=" + str(d["unused"]))

            # Generate > 100 -> 422
            r = await c.post("/api/v1/admin/keys/generate", json={"count": 101}, headers={"Authorization": f"Bearer {admin_token}"})
            print("SMOKE generate 101 keys:", r.status_code)
        else:
            print("SMOKE admin-only flow skipped: generated account is not configured as admin")

        # Forgot password — with Resend (no local URL fallback), 200 with generic message
        r = await c.post("/api/v1/auth/forgot-password", json={"email": USER_EMAIL})
        print("SMOKE forgot password:", r.status_code, r.json().get("message", "")[:60])

        # Unknown email is also 200 (no user enumeration)
        r = await c.post("/api/v1/auth/forgot-password", json={"email": "nobody@example.com"})
        print("SMOKE forgot unknown email:", r.status_code)

        # Build a reset token directly from the security layer to test the reset endpoint
        from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
        from sqlmodel import select
        from app.models.user import User as UserModel
        from app.core.security import create_password_reset_token
        from urllib.parse import quote as url_quote
        from app.core.config import settings as _settings

        engine = create_async_engine(_settings.DATABASE_URL)
        async with AsyncSession(engine) as s:
            row = (await s.execute(select(UserModel).where(UserModel.email == USER_EMAIL))).scalar_one()
            direct_token = create_password_reset_token(
                user_id=row.id, email=row.email, password_hash=row.password_hash
            )

        r = await c.post("/api/v1/auth/reset-password", json={"token": direct_token, "new_password": RESET_PASS})
        print("SMOKE reset password:", r.status_code)
        r = await c.post("/api/v1/auth/login", json={"email": USER_EMAIL, "password": USER_PASS})
        print("SMOKE old password rejected:", r.status_code)
        r = await c.post("/api/v1/auth/login", json={"email": USER_EMAIL, "password": RESET_PASS})
        print("SMOKE new password accepted:", r.status_code)

        # Used reset token becomes invalid after password change
        r = await c.post("/api/v1/auth/reset-password", json={"token": direct_token, "new_password": "pass123!!!"})
        print("SMOKE reused reset token:", r.status_code, r.json().get("detail", ""))

asyncio.run(test())
