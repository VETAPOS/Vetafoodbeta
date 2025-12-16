from pydantic import BaseModel
from uuid import UUID

class RoleCreate(BaseModel):
    name: str

class RoleOut(BaseModel):
    role_id: UUID
    company_id: UUID
    name: str
    class Config:
        orm_mode = True
