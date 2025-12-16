from uuid import UUID, uuid4

from fastapi import APIRouter
from pydantic import BaseModel


class PermissionCreate(BaseModel):
    code: str
    description: str | None = None


class PermissionResponse(BaseModel):
    permission_id: UUID
    code: str
    description: str | None = None


router = APIRouter()


@router.post("/permissions", response_model=PermissionResponse)
def create_permission(payload: PermissionCreate):
    """Create a placeholder permission."""

    return PermissionResponse(permission_id=uuid4(), code=payload.code, description=payload.description)


@router.get("/permissions", response_model=list[PermissionResponse])
def list_permissions():
    """Return no permissions yet; persistence is not implemented."""

    return []
