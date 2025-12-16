from uuid import UUID, uuid4

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    company_id: UUID


class UserResponse(BaseModel):
    user_id: UUID
    company_id: UUID
    name: str
    email: EmailStr
    is_active: bool = True


router = APIRouter()


@router.post("/users", response_model=UserResponse)
def create_user(payload: UserCreate):
    """Create a placeholder user and return generated identifiers."""

    return UserResponse(
        user_id=uuid4(),
        company_id=payload.company_id,
        name=payload.name,
        email=payload.email,
        is_active=True,
    )


@router.get("/users", response_model=list[UserResponse])
def list_users():
    """Return an empty list for now; data persistence is not yet implemented."""

    return []
