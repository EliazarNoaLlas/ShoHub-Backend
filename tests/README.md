# Pruebas (Backend)

Este proyecto usa Jest + ts-jest para pruebas unitarias, de integracion y E2E (sin levantar el server en un puerto, salvo que un test lo requiera).

## Estructura

```text
tests/
|-- setup/
|   `-- env.ts              # carga variables para tests
|-- utils/
|   |-- prismaMock.ts       # mock de PrismaClient (jest.fn)
|   |-- testHelpers.ts      # factories, constantes
|   `-- types.ts            # enums/tipos de soporte (ej: Role)
|-- unit/                   # pruebas unitarias
|-- integration/            # pruebas de API con Supertest (app directo)
|-- e2e/                    # escenarios end-to-end (con mocks)
`-- fixtures/               # data fija para tests (si aplica)
```

## Requisitos / Variables de entorno

- Jest ejecuta `tests/setup/env.ts` antes de los tests.
- Si existe `.env.test`, se carga automaticamente.
- Si no existe `.env.test`, se usa `.env.example` como fallback para que tests unitarios corran sin configurar DB.

Recomendado para integracion con DB real:

1. Crea `.env.test` en la raiz (puedes copiar `.env.test.example` si existe).
2. Usa una base de datos exclusiva para tests en `DATABASE_URL`.

## Comandos

- `npm test`: corre toda la suite (`tests/**/*.test.ts`).
- `npm run test:unit`: solo unit (con coverage en `coverage/unit`).
- `npm run test:integration`: solo integration (con coverage en `coverage/integration`).
- `npm run test:e2e`: solo e2e (con coverage en `coverage/e2e`).
- `npm run test:all`: todo con coverage en `coverage/`.
- `npm run test:watch`: modo watch.
- `npm run test:ci`: modo CI (`--ci --coverage --forceExit`).

## Notas

- Unit tests: deben evitar dependencias externas (DB, red). Usa `tests/utils/prismaMock.ts`.
- Integration tests: idealmente prueban contratos HTTP via Supertest contra `app` (sin escuchar puerto).
- E2E tests: escenarios completos a nivel servicio, normalmente con mocks (Prisma/Stripe/etc).

