from fastapi import FastAPI
from app.routers import health, bootstrap, settings, users, roles, permissions, auth

app = FastAPI(title="Veta POS - Backend (esqueleto)")

app.include_router(health.router, prefix="/api/v1")
app.include_router(bootstrap.router, prefix="/api/v1")
app.include_router(settings.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(roles.router, prefix="/api/v1")
app.include_router(permissions.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"status": "backend ready"}
