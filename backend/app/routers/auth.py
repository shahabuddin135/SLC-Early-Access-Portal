from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.limiter import limiter
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.services.auth_service import login_user, register_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
@limiter.limit("5/minute")
async def register(
    request: Request,
    data: RegisterRequest,
    session: AsyncSession = Depends(get_session),
):
    user = await register_user(data, session)
    return UserResponse(id=user.id, name=user.name, email=user.email)


@router.post("/login", response_model=TokenResponse, status_code=200)
@limiter.limit("10/minute")
async def login(
    request: Request,
    data: LoginRequest,
    session: AsyncSession = Depends(get_session),
):
    return await login_user(data, session)


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
    )
