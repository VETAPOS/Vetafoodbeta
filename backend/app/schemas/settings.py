from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class SettingsOut(BaseModel):
    settings_id: UUID
    company_id: UUID
    timezone: str
    currency: str
    allow_offline: bool
    offline_days_limit: int
    class Config:
        orm_mode = True

class SettingsUpdate(BaseModel):
    company_id: UUID
    timezone: Optional[str]
    currency: Optional[str]
    allow_offline: Optional[bool]
    offline_days_limit: Optional[int]
