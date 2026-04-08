# Pruebas de integración

Estas pruebas validan la API como un conjunto (rutas + middleware + controller + service), normalmente usando Supertest.

Recomendación:
- Mantener las pruebas que golpean DB en una base dedicada (`DATABASE_URL` en `.env.test`).
- Limpieza de datos: usar scripts/fixtures y borrar datos por colección entre tests si es necesario.

