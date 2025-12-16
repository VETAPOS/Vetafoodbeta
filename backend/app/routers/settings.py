from uuid import UUID, uuid4

from fastapi import APIRouter
from pydantic import BaseModel


class SettingsPayload(BaseModel):
    timezone: str | None = None
    currency: str | None = None
    allow_offline: bool | None = None
    offline_days_limit: int | None = None


class SettingsResponse(BaseModel):
    settings_id: UUID
    company_id: UUID
    timezone: str
    currency: str
    allow_offline: bool
    offline_days_limit: int


router = APIRouter()


@router.get("/settings/{company_id}", response_model=SettingsResponse)
def get_settings(company_id: UUID):
    """Return placeholder settings for the given company."""

    return SettingsResponse(
        settings_id=uuid4(),
        company_id=company_id,
        timezone="America/Mexico_City",
        currency="MXN",
        allow_offline=True,
        offline_days_limit=3,
    )


@router.put("/settings/{company_id}", response_model=SettingsResponse)
def update_settings(company_id: UUID, payload: SettingsPayload):
    """Update settings with provided values and return the merged result."""

    defaults = get_settings(company_id)
    data = defaults.dict()
    for key, value in payload.dict(exclude_unset=True).items():
        data[key] = value
    return SettingsResponse(**data)
