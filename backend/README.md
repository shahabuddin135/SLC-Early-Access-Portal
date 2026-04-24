# SLC Early Access Portal — Backend

FastAPI backend for the SLC Early Access Portal.

## Setup

```bash
uv sync
cp .env.example .env
# Fill in .env values
uvicorn main:app --reload
```

## Stack
- FastAPI + SQLModel + asyncpg
- Neon PostgreSQL
- JWT auth (python-jose)
- Deployed on Vercel

## Password Reset

Password reset links are signed JWTs that expire automatically and are invalidated after a successful password change.

Emails are sent via [Resend](https://resend.com) from `noreply@wewiselabs.com`.

Required `.env` variable:
- `RESEND_API_KEY` — your Resend API key

Optional:
- `PASSWORD_RESET_TOKEN_EXPIRE_MINUTES` (default: 60)
