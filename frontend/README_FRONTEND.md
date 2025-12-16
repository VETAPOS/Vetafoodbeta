Frontend - Configuración (v1)

Qué hace

Este frontend es una interfaz mínima (React + Vite) para el módulo de Configuración. No contiene lógica de negocio: solo muestra datos y envía requests al backend.

Cómo usar

1. Copia `.env.example` a `.env` si quieres cambiar la URL del backend.
2. Instala dependencias y corre en modo desarrollo (ejemplo):

   npm install
   npm run dev

3. En la pantalla principal captura:
   - BACKEND_URL (por defecto: http://127.0.0.1:8000)
   - company_id (UUID)
   - user_id (UUID)

   Presiona "Guardar" para mantener esos valores en localStorage.

4. Usa "Cargar configuración" para llamar a GET /api/v1/settings?company_id=... y visualizar los campos.
5. Edita y presiona "Guardar cambios" para hacer PATCH /api/v1/settings (el body incluye company_id).

Notas importantes

- El frontend usa los headers `X-Company-Id` y `X-User-Id` en cada request (toma los valores de localStorage o los que guardes en la UI).
- Valida que `company_id` y `user_id` parezcan UUID antes de llamar al backend.
- No genera ni maneja IDs: los IDs deben venir del backend o del usuario.
