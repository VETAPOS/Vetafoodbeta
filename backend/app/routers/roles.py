from uuid import UUID, uuid4

from fastapi import APIRouter
from pydantic import BaseModel


class RoleCreate(BaseModel):
    name: str
    company_id: UUID


class RoleResponse(BaseModel):
    role_id: UUID
    company_id: UUID
    name: str


router = APIRouter()


@router.post("/roles", response_model=RoleResponse)
def create_role(payload: RoleCreate):
    """Create a placeholder role."""

    return RoleResponse(role_id=uuid4(), company_id=payload.company_id, name=payload.name)


@router.get("/roles", response_model=list[RoleResponse])
def list_roles():
    """Return no roles yet; persistence is not implemented."""

    return []
