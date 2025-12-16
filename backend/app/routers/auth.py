from uuid import UUID, uuid4

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: UUID
    company_id: UUID


router = APIRouter()


@router.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    """Return a placeholder token for development purposes."""

    return LoginResponse(
        access_token="placeholder-token",
        token_type="bearer",
        user_id=uuid4(),
        company_id=uuid4(),
    )
