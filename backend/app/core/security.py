from fastapi import Header, HTTPException, Depends
from uuid import UUID
from app.services.rbac_service import has_permission
from app.core.db import get_db

# Dependency to get user and company from headers (placeholder auth)
def get_current_user(x_user_id: str = Header(None), x_company_id: str = Header(None)):
    if not x_user_id or not x_company_id:
        raise HTTPException(status_code=401, detail="Missing X-User-Id or X-Company-Id headers")
    try:
        user_id = UUID(x_user_id)
        company_id = UUID(x_company_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid UUID in headers")
    return {"user_id": user_id, "company_id": company_id}

# Permission checker dependency
def check_permission(permission_code: str):
    def checker(current: dict = Depends(get_current_user), db=Depends(get_db)):
        user_id = current["user_id"]
        company_id = current["company_id"]
        if not has_permission(db, user_id, company_id, permission_code):
            raise HTTPException(status_code=403, detail="Forbidden")
        return True
    return checker
