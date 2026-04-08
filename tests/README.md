# Pruebas (Backend)

Este proyecto usa Jest + ts-jest para pruebas unitarias y Supertest para pruebas de integración de la API (sin levantar el servidor en un puerto).

## Estructura

```text
tests/
|-- setup/
|   `-- env.ts
|-- unit/
|-- integration/
`-- fixtures/
```

## Requisitos

1. Crea `.env.test` en la raíz (puedes copiar `.env.test.example`).
2. Asegúrate de usar una base de datos exclusiva para tests (`DATABASE_URL`).

## Comandos

- `npm test`: ejecuta la suite completa.
- `npm run test:watch`: modo watch.
- `npm run test:coverage`: genera cobertura en `coverage/`.

## Notas

- Los tests unitarios no deben depender de base de datos.
- Los tests de integración pueden requerir DB. Si no tienes DB de test lista, mantén esos tests en `describe.skip(...)` hasta configurar el ambiente.

