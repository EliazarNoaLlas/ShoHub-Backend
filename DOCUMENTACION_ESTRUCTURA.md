# Gadget Galaxy Backend: Estructura Del Proyecto

Este documento describe la estructura de carpetas/archivos del repositorio y la responsabilidad de cada parte (en especial `src/`, que es el código fuente). El backend está construido con Node.js + Express + TypeScript, usa Prisma con MongoDB, JWT para auth y Stripe para pagos.

## Cómo se ejecuta

- `npm run dev`: levanta el servidor con recarga (entrada: `src/server.ts`).
- `npm run build`: compila TypeScript a JavaScript (salida: `dist/`).
- `npm start`: ejecuta producción desde `dist/server.js`.

## Árbol de carpetas (resumen útil)

Nota: se excluyen `node_modules/` y `.git/` porque son dependencias/metadata generadas y no forman parte del código del proyecto.

```text
.
|-- .env.example
|-- .gitignore
|-- index.d.ts
|-- package-lock.json
|-- package.json
|-- README.md
|-- tsconfig.json
|-- vercel.json
|-- .idea/
|-- prisma/
|   `-- schema.prisma
|-- src/
|   |-- app.ts
|   |-- server.ts
|   |-- app/
|   |   |-- middleware/
|   |   |-- modules/
|   |   |-- routes/
|   |   `-- types/
|   |-- config/
|   |-- db/
|   |-- globalTypes/
|   |-- helpers/
|   `-- utils/
`-- dist/
```

## Carpetas generadas (no se documentan archivo por archivo)

### `.git/`
- Metadata interna de Git (historial, referencias, objetos). No es código de la app.

### `node_modules/`
- Dependencias instaladas por npm. No se modifica manualmente y se regenera con `npm install`.

## Carpetas y archivos en la raíz

### `.env` (local)
- Archivo local con variables de entorno. Está en `.gitignore`, por lo que no debería versionarse.
- Importante: el código carga variables desde `.env.local` (ver `src/config/index.ts`), pero también existe `.env.example` y un `.env` local. Si tu entorno no lee `.env.local`, ajusta o crea el archivo que corresponda.

### `.env.example`
- Plantilla de variables de entorno necesarias para levantar el proyecto:
  - `PORT`, `DATABASE_URL` (Prisma/MongoDB), `SALT_ROUND`, `JWT_SECTET`, `JWT_EXPIRES`,
  - Cloudinary (`CLOUD_NAME`, `API_KEY`, `API_SECRET`),
  - Stripe (`STRIPE_API_KEY`),
  - `DOMAIN_URL` (URL del frontend),
  - credenciales de email (`EMAIL`, `PASSWORD`) para reset de password.

### `.gitignore`
- Ignora `node_modules/`, `.env` y `.env*.local`.

### `index.d.ts`
- Extiende el tipo de Express para agregar `req.user`.
- Se usa con el middleware [`src/app/middleware/authGaurd.ts`](#srcappmiddlewareauthgaurdts) para poder setear `req.user` (payload del JWT) sin errores de TypeScript.

### `package.json`
- Scripts:
  - `postinstall`: `prisma generate` (genera el Prisma Client).
  - `dev`: `ts-node-dev ... src/server.ts`.
  - `build`: `tsc` (compila a `dist/`).
  - `start`: `node dist/server.js`.
- Dependencias relevantes:
  - `express`, `cors`, `dotenv`
  - `@prisma/client` + `prisma`
  - `jsonwebtoken`, `bcrypt`
  - `stripe`, `nodemailer`
  - `zod` (validación)
  - `cloudinary`, `multer` (subida de archivos, ver nota en helpers)

### `package-lock.json`
- Lockfile de npm. Congela versiones exactas de dependencias para reproducibilidad.

### `README.md`
- Descripción general, tech stack y guía de instalación.
- Ejemplo de variables de entorno (muy alineado con `.env.example`), aunque el código actualmente carga `.env.local`.

### `tsconfig.json`
- Configura el compilador TypeScript:
  - `rootDir: ./src`
  - `module: commonjs`, `target: es2016`
  - `strict: true`
- La compilación generada cae en `dist/` (por default de `tsc` cuando no se define `outDir`, o por configuración implícita del proyecto).

### `vercel.json`
- Config de deploy en Vercel usando `@vercel/node`, apuntando a `dist/server.js` como entrypoint.

### `.idea/`
- Configuración de WebStorm/JetBrains.
- Archivos típicos: `.idea/workspace.xml`, `.idea/modules.xml`, etc. No afectan runtime; se pueden regenerar.
- Archivos presentes:
  - `.idea/.gitignore`: ignore específico del IDE.
  - `.idea/gadget-galaxy-backend.iml`: metadata del módulo/proyecto para JetBrains.
  - `.idea/modules.xml`: definición de módulos del IDE.
  - `.idea/vcs.xml`: configuración de VCS (Git) para el IDE.
  - `.idea/workspace.xml`: estado local del workspace (ventanas, run configs, etc). Suele ser específico de cada máquina.

## `prisma/`

### `prisma/schema.prisma`
- Define el datasource `mongodb` y el `PrismaClient`.
- Enum `Role`: `SUPER_ADMIN`, `ADMIN`, `CUSTOMER`, `VIEWER`.
- Modelos principales:
  - `User`: usuario del sistema; relación 1-1 con `Address`, 1-N con `Order` y `Review`.
  - `Address`: dirección del usuario (clave `userId` única).
  - `Product`: producto del catálogo; incluye atributos (brand, specs, features, rating, stock, slug, etc).
  - `Review`: reseñas por usuario y producto (relaciones opcionales).
  - `Order` y `OrderedProduct`: órdenes y productos dentro de cada orden.
  - `Cuppon`: cupones (código, descuento, expiración, `isActive`).
  - `HotOffers`: ofertas con descuento asociadas a un `Product`.
  - `FeaturedProduct`: lista de productos destacados.
- Prisma usa `DATABASE_URL` como variable de conexión (ojo: el `src/config/index.ts` también define `db_uri` desde `process.env.URI`, pero esa variable no se usa en el código).

## `src/` (código fuente)

### `src/server.ts`
- Punto de entrada del servidor en desarrollo.
- Importa `app` desde `src/app.ts` y hace `app.listen(config.port, ...)`.
- `config.port` viene de variables de entorno (`PORT`), por lo que debe estar definido.

### `src/app.ts`
- Crea la app Express y configura:
  - `express.json()` para parsear JSON.
  - `cors` con `origin` permitido (frontend en Vercel y `http://localhost:3000`) y `credentials: true`.
  - Monta el router raíz: `app.use("/api/v1", rootRouter)`.
  - Middleware `notFound` y `globalErrorHandler`.

### `src/config/index.ts`
- Carga variables con `dotenv` desde `.env.local`:
  - `dotenv.config({ path: path.join(process.cwd(), ".env.local") });`
- Exporta un objeto `config` con:
  - `port`, `salt_round`, `jwt_secret`, `jwt_expires`, `stripe_api_key`, etc.
  - Cloudinary y credenciales de email.
- Observación importante:
  - `db_uri: process.env.URI` existe, pero el proyecto usa Prisma con `DATABASE_URL` (schema Prisma) y no hay referencias a `config.db_uri` en el código.

### `src/db/db.ts`
- Inicializa y exporta una instancia singleton de `PrismaClient` (`export const prisma`).
- En dev reutiliza la instancia en `globalThis` para evitar múltiples conexiones durante hot-reload.

### `src/globalTypes/index.ts`
- Define `TJwtPayload` usado por `authGaurd` y servicios:
  - `{ id, name, email, role }`.

### `src/app/types/index.ts`
- Define `TQuery` como `Record<string, string>`.
- Se usa para tipar `req.query` (ej. en productos).

## `src/utils/`

### `src/utils/appError.ts`
- Clase `AppError` (extiende `Error`) con `statusCode`.
- Se usa para lanzar errores controlados (ej. `401`, `400`, `404`).

### `src/utils/catchAsync.ts`
- Helper para envolver handlers async de Express y enviar errores a `next(err)`.

### `src/utils/sendResponse.ts`
- Helper para estandarizar la respuesta JSON:
  - `{ success: true, message, meta?, result }`.
- `meta` se usa especialmente en paginación.

## `src/helpers/`

### `src/helpers/pagination.ts`
- Calcula `page`, `limit` y `skip` para queries paginadas.
- Default: `page=1`, `limit=18`.

### `src/helpers/orderBy.ts`
- Helper simple para construir un `orderBy` por precio (no se ve usado en el código actual).

### `src/helpers/sendEmail.ts`
- Envía correo con nodemailer vía Gmail SMTP.
- Usado en `auth.services.ts` para “forgot password” (manda link de reset).

### `src/helpers/fileUploader.ts`
- Configura Cloudinary + `multer-storage-cloudinary` y exporta `fileUploader`.
- Observación: el `CloudinaryStorage` se instancia sin `params` (carpeta/transformaciones), lo cual puede estar incompleto según el uso esperado.

## `src/app/middleware/`

### `src/app/middleware/authGaurd.ts`
- Middleware de autorización:
  - Lee `req.headers.authorization` como token.
  - Verifica JWT con `config.jwt_secret`.
  - Busca el usuario en DB con Prisma (`email` + `id`).
  - Si se pasan roles, valida que `role` esté permitido.
  - Setea `req.user` con el payload decodificado.

### `src/app/middleware/validateRequest.ts`
- Middleware de validación con Zod:
  - `schema.parseAsync(req.body)`.
  - Se combina con `catchAsync` para enviar errores al handler global.

### `src/app/middleware/notFound.ts`
- Responde 404 cuando no hay rutas que matcheen.

### `src/app/middleware/globalErrorHandler.ts`
- Manejo centralizado de errores:
  - Errores Zod: responde 400 con lista `{ path, message }`.
  - Errores Prisma:
    - `P2002` (unique constraint): responde 302 con “Duplicate Key error”.
    - `P2025` (record not found): responde 404.
  - Default: 500.

## `src/app/routes/`

### `src/app/routes/routeArray.ts`
- Lista de rutas montadas bajo `/api/v1`.
- Estructura: `{ path: string, route: Router }[]`.
- Paths actuales:
  - `/user`, `/address`, `/product`, `/hot-offer`, `/featured-product`, `/order`, `/auth`, `/profile`, `/checkout`, `/review`, `/meta-data`.

### `src/app/routes/index.ts`
- Crea `rootRouter` y monta cada ruta de `routeArray`.

## `src/app/modules/` (módulos de dominio)

Cada módulo sigue el patrón:
- `*.route.ts`: define endpoints Express.
- `*.controller.ts`: adapta `req/res` y llama al service.
- `*.services.ts`: lógica de negocio y acceso a DB (Prisma).
- `*.validation.ts` (si existe): validaciones Zod para `req.body`.

### `src/app/modules/auth/`

Archivos:
- `auth.route.ts`
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/forgot-password`
  - `POST /api/v1/auth/change-password` (protegida con `authGaurd(Role.ADMIN, Role.CUSTOMER, Role.SUPER_ADMIN)`)
  - `POST /api/v1/auth/reset-password` (usa `token` e `id` vía querystring)
- `auth.controller.ts`: envuelve services y responde usando `sendResponse`.
- `auth.services.ts`
  - `register`: hashea password (bcrypt) y crea usuario en Prisma.
  - `login`: verifica credenciales y retorna JWT (`authToken`) + `avatar`.
  - `forgotPassword`: genera JWT (10m) y envía link de reset por email.
  - `changePassword`: valida old/new, compara bcrypt, actualiza password hasheado.
  - `resetPassword`: valida confirmación, verifica token, actualiza password.

### `src/app/modules/user/`

Archivos:
- `user.route.ts`
  - `GET /api/v1/user/`
  - `GET /api/v1/user/top-customer`
  - `GET /api/v1/user/:id`
  - `PATCH /api/v1/user/:id`
  - `DELETE /api/v1/user/:id`
  - `PATCH /api/v1/user/:id/update-avatar`
- `user.controller.ts`: llama a services y devuelve respuestas estándar.
- `user.services.ts`
  - `getAllFromDB`: lista usuarios (select sin password).
  - `getById`: trae un usuario por `id`.
  - `updateIntoDB`: actualiza datos de usuario.
  - `deleteFromDB`: elimina usuario.
  - `updateUserAvatar`: actualiza el `avatar`.
  - `topCustomer`: usuarios con órdenes (toma 10, `createdAt desc`).
- `user.validation.ts`: actualmente está vacío (placeholder).

### `src/app/modules/profile/`

Archivos:
- `profile.route.ts`
  - `GET /api/v1/profile/me` (protegida con `authGaurd(Role.ADMIN, Role.CUSTOMER)`)
- `profile.controller.ts`: expone `profile`.
- `profile.services.ts`: consulta el usuario autenticado por `email + id`, incluye `address` y `orders`.

### `src/app/modules/address/`

Archivos:
- `address.route.ts`
  - `GET /api/v1/address/:id` (interpreta `:id` como `userId`)
  - `PATCH /api/v1/address/:id` (upsert por `userId`)
- `address.controller.ts`: `getById` y `updateIntoDB`.
- `address.services.ts`
  - `getById`: `findUniqueOrThrow` por `userId`.
  - `updateIntoDB`: `upsert` por `userId` (update o create).

### `src/app/modules/product/`

Archivos:
- `product.route.ts`
  - `POST /api/v1/product/` (valida con Zod; el `authGaurd` para admin está comentado)
  - `GET /api/v1/product/`
  - `GET /api/v1/product/related-product/:slug`
  - `GET /api/v1/product/admin/:id`
  - `DELETE /api/v1/product/soft/:id` (protegida con roles admin/super)
  - `GET /api/v1/product/:slug`
  - `PATCH /api/v1/product/:slug` (protegida)
  - `DELETE /api/v1/product/:slug` (protegida)
- `product.controller.ts`: mapea HTTP -> services.
- `product.services.ts`
  - `insertIntoDB`: crea producto con `slug` a partir del `name` (slugify).
  - `getAllFromDB`: filtros por `search`, `price`, y otros campos; paginación y orden por precio o `createdAt`.
  - `getById`: busca por `id`.
  - `getBySlug`: busca por `slug` e incluye reviews + info mínima del usuario en cada review.
  - `updateIntoDB`, `deleteFromDB`, `softDeleteFromDB`.
  - `relatedProduct`: busca productos con precio similar al actual (0.8x a 1.5x), excluyendo el mismo slug.
- `product.validation.ts`: Zod schema `createProduct`.

### `src/app/modules/review/`

Archivos:
- `review.route.ts`
  - `POST /api/v1/review/` (valida con Zod)
  - `GET /api/v1/review/`
  - `GET /api/v1/review/:id`
  - `PATCH /api/v1/review/:id`
  - `DELETE /api/v1/review/:id`
- `review.controller.ts`: CRUD.
- `review.services.ts`
  - `insertIntoDB`: transacción:
    - trae producto + reviews,
    - crea review,
    - recalcula y guarda `product.rating` como promedio.
  - `getAllFromDB`: incluye `product.name` y `user.name`.
  - `getById`, `updateIntoDB`, `deleteFromDB`.
- `review.validation.ts`: Zod schema `createReview`.

### `src/app/modules/order/`

Archivos:
- `order.route.ts`
  - `POST /api/v1/order/`
  - `GET /api/v1/order/`
  - `GET /api/v1/order/latest-order`
  - `GET /api/v1/order/:id`
  - `PATCH /api/v1/order/:id`
  - `DELETE /api/v1/order/:id`
- `order.controller.ts`: CRUD + latest.
- `order.services.ts`
  - `insertIntoDB`: transacción:
    - valida stock por cada item,
    - decrementa `product.inStock`,
    - crea `order` y `OrderedProduct` embebidos.
  - `getAllFromDB`: lista órdenes (`createdAt desc`).
  - `getById`: trae un usuario por id y selecciona sus `orders` (nota: el endpoint se llama “order/:id” pero busca en `user`; el `:id` se interpreta como `userId`).
  - `getLatestOrder`: top 5 órdenes con `user(email,name)` para panel admin.

### `src/app/modules/offeredProduct/` (Hot Offers)

Archivos:
- `op.route.ts`
  - `POST /api/v1/hot-offer/`
  - `GET /api/v1/hot-offer/`
  - `GET /api/v1/hot-offer/:id`
  - `PATCH /api/v1/hot-offer/:id`
  - `DELETE /api/v1/hot-offer/:id`
- `op.controller.ts`: CRUD.
- `op.services.ts`
  - `insertIntoDB`: transacción:
    - valida que el producto exista,
    - calcula `finalPrice` según `% discount`,
    - evita duplicados por `productId`,
    - crea registro en `hotOffers`.
  - `getAllFromDB`: incluye `product` y filtra `product.isDeleted=false`.
  - `getById`: incluye `product` con `reviews`.

### `src/app/modules/featuredProduct/`

Archivos:
- `fp.route.ts`
  - `POST /api/v1/featured-product/`
  - `GET /api/v1/featured-product/`
  - `GET /api/v1/featured-product/:id`
  - `PATCH /api/v1/featured-product/:id`
  - `DELETE /api/v1/featured-product/:id`
- `fp.controller.ts`: CRUD.
- `fp.services.ts`
  - `insertIntoDB`: evita duplicados por `productId` y crea `featuredProduct`.
  - `getAllFromDB`: incluye `product` y filtra `product.isDeleted=false`.

### `src/app/modules/checkout/` (Stripe)

Archivos:
- `checkout.route.ts`
  - `POST /api/v1/checkout/`
- `checkout.controller.ts`: llama `makeCheckout`.
- `checkout.services.ts`
  - `makeCheckout`: crea una sesión de Stripe Checkout con `line_items` (currency `usd`).
  - `success_url` / `cancel_url` apuntan al frontend (`DOMAIN_URL`).
  - Nota: si Stripe falla, actualmente hace `console.log({error})` y no lanza un error controlado.

### `src/app/modules/adminData/` (meta-data para admin)

Archivos:
- `adminData.route.ts`
  - `GET /api/v1/meta-data/info`
- `adminData.controller.ts`: responde con “meta data”.
- `adminData.services.ts`
  - `metaData`: cuenta órdenes, suma `totalPrice` y cuenta productos.

### `src/app/modules/productCuppon/` (cupones)

Archivos:
- `pc.route.ts`
  - Endpoints CRUD típicos bajo el router del módulo.
  - Observación: exporta `subCategoryRoutes` (nombre inconsistente; debería ser algo como `productCupponRoutes`/`pcRoutes`).
  - Observación: este router no está montado en `routeArray.ts`, por lo que no queda accesible desde `/api/v1` con la config actual.
- `pc.controller.ts`: CRUD para `Cuppon`.
- `pc.services.ts`: CRUD Prisma para `cuppon`.

## `dist/` (salida compilada)

`dist/` contiene el JavaScript generado por `tsc` desde `src/` y se usa en producción (`npm start` y `vercel.json`).

Reglas prácticas:
- No se edita a mano. Se regenera con `npm run build`.
- La estructura replica `src/` (mismos módulos, pero en `.js`).

Archivos principales:
- `dist/server.js`: entrypoint compilado equivalente a `src/server.ts`.
- `dist/app.js`: app Express compilada equivalente a `src/app.ts`.
- `dist/config/index.js`: config compilado equivalente a `src/config/index.ts`.
- `dist/db/db.js`: Prisma client singleton compilado equivalente a `src/db/db.ts`.
- `dist/globalTypes/index.js`: tipos compartidos compilados.
- `dist/helpers/*.js`: helpers compilados.
- `dist/utils/*.js`: utilidades compiladas.
- `dist/app/routes/*.js`: root router compilado.
- `dist/app/middleware/*.js`: middlewares compilados.
- `dist/app/modules/*/*.js`: módulos de dominio compilados (controllers/routes/services/validations).

Observación importante:
- En `dist/app/modules/` existen carpetas como `brand/`, `category/`, `field/`, `specialCuppon/`, `subCategory/` que no existen en `src/app/modules/` actualmente. Esto sugiere que `dist/` puede contener artefactos de builds anteriores o código que ya no está en el source. Si quieres que `dist/` refleje exactamente el estado actual, conviene reconstruir (`npm run build`) y revisar qué archivos quedan.
