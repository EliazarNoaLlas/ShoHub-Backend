# HTTP Tests (.http)

Estos archivos estan pensados para el **HTTP Client de JetBrains** (WebStorm/IntelliJ).

## Requisitos

- Backend levantado en `http://localhost:5000` (ver `.env` -> `PORT=5000`).
- Base path: `/api/v1` (ver `src/app.ts`).

## Como usarlos

1. Abre cualquier `.http` dentro de `tests/http_test/`.
2. Ejecuta las requests en orden (de arriba hacia abajo) para que se creen los datos y se seteen variables (tokens/ids).

Notas:
- El backend usa `Authorization: <token>` (sin `Bearer`), ver `src/app/middleware/authGaurd.ts`.
- Algunos endpoints "admin" dependen de tener un usuario con rol `ADMIN`. En los `.http` se hace un `PATCH /user/:id` para subir el rol (en el codigo actual ese endpoint no esta protegido).

