from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class CompanyCreate(BaseModel):
    name: str

class CompanyOut(BaseModel):
    company_id: UUID
    name: str
    class Config:
        orm_mode = True
