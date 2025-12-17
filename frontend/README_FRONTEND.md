Frontend - Configuración (v1)

Este repositorio contiene una interfaz mínima (React + Vite) para el módulo de Configuración del POS. El frontend es solo la capa visual: no debe contener lógica de negocio crítica.

Estructura mínima (creada)

frontend/
  package.json
  vite.config.js
  index.html
  src/
    main.jsx
    App.jsx
    pages/
      SettingsPage.jsx
    components/
      IdHeaderForm.jsx
      SettingsForm.jsx
    api/
      client.js
      settingsApi.js

Conectar con el backend

- Usa `.env` o `.env.local` con VITE_BACKEND_URL para configurar la URL del backend.
- El frontend envía headers `X-Company-Id` y `X-User-Id` en cada petición.

Ejecutar (local)

1. npm install
2. npm run dev

(No ejecutar esto en el repo hasta que instales dependencias localmente.)

Ejecutar BE + FE juntos (pruebas en vivo)

- En la carpeta `backend/`: instala dependencias y levanta el backend:
  - npm install
  - npm run dev

- En la carpeta `frontend/`: instala dependencias y levanta el frontend:
  - npm install
  - npm run dev

Ambos servidores en dev (nodemon + vite) permiten iterar y ver cambios en caliente. Asegúrate de configurar `VITE_BACKEND_URL` en `frontend/.env` o usar la sección de Conexión de la UI.
