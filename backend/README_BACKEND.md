README - Backend

Cómo configurar

1. Definir la variable de entorno DATABASE_URL con la cadena de conexión a PostgreSQL.
   Ejemplo en `.env` o en tu entorno:
   DATABASE_URL=postgresql://postgres:password@localhost:5432/veta_db

Migraciones

- Las migraciones están en `backend/migrations/`. Usa Alembic para generar/aplicar migraciones apuntando al mismo `DATABASE_URL`.

Correr el servidor (desarrollo)

- Ejecuta el servidor FastAPI con Uvicorn apuntando al `app.main:app`.

Ejemplo de request de bootstrap (inicializar un negocio)

POST /api/v1/bootstrap
Body JSON de ejemplo:
{
  "company_name": "Mi Restaurante",
  "admin_name": "Admin",
  "admin_email": "admin@rest.com",
  "admin_password": "cambiar"
}

El endpoint de bootstrap devolverá `company_id` y `user_id` creados.
