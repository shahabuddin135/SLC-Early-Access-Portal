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
