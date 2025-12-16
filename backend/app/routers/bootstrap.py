from uuid import UUID, uuid4

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr


class BootstrapRequest(BaseModel):
    company_name: str
    admin_name: str
    admin_email: EmailStr
    admin_password: str


class BootstrapResponse(BaseModel):
    company_id: UUID
    user_id: UUID


router = APIRouter()


@router.post("/bootstrap", response_model=BootstrapResponse)
def bootstrap(payload: BootstrapRequest):
    """Placeholder bootstrap endpoint that returns generated IDs."""

    company_id = uuid4()
    user_id = uuid4()
    return BootstrapResponse(company_id=company_id, user_id=user_id)
