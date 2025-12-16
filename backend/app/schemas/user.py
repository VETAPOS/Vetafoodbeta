from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    user_id: UUID
    company_id: UUID
    name: str
    email: EmailStr
    is_active: bool
    class Config:
        orm_mode = True
