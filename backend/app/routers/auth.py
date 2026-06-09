from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.limiter import limiter
from app.core.urls import base_url_from_request
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
    VerifyEmailRequest,
)
from app.services.auth_service import (
    login_user,
    register_user,
    request_password_reset,
    reset_password,
    send_email_verification,
    verify_email,
)

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


@router.post("/forgot-password", response_model=ForgotPasswordResponse, status_code=200)
@limiter.limit("5/minute")
async def forgot_password(
    request: Request,
    data: ForgotPasswordRequest,
    session: AsyncSession = Depends(get_session),
):
    return await request_password_reset(data, session, base_url_from_request(request))


@router.post("/reset-password", response_model=MessageResponse, status_code=200)
@limiter.limit("10/minute")
async def reset_password_route(
    request: Request,
    data: ResetPasswordRequest,
    session: AsyncSession = Depends(get_session),
):
    return await reset_password(data, session)


@router.post("/send-verification", response_model=MessageResponse, status_code=200)
@limiter.limit("5/minute")
async def send_verification(
    request: Request,
    current_user: User = Depends(get_current_user),
):
    return await send_email_verification(current_user, base_url_from_request(request))


@router.post("/verify-email", response_model=MessageResponse, status_code=200)
@limiter.limit("10/minute")
async def verify_email_route(
    request: Request,
    data: VerifyEmailRequest,
    session: AsyncSession = Depends(get_session),
):
    return await verify_email(data.token, session)


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
    )
