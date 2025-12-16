import uuid
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.db import Base

class Settings(Base):
    __tablename__ = "settings"

    settings_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.company_id"), unique=True, nullable=False)
    timezone = Column(String, default="America/Mexico_City")
    currency = Column(String, default="MXN")
    allow_offline = Column(Boolean, default=True)
    offline_days_limit = Column(Integer, default=3)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
