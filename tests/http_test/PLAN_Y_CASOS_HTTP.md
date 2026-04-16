# Plan De Pruebas HTTP Y Casos Ejecutados

Fecha: 2026-04-14  
Proyecto: `gadget-galaxy-backend`  
Tipo: pruebas HTTP a nivel endpoint (archivos `.http` para HTTP Client de JetBrains).

## 1) Objetivo

Validar el contrato HTTP de los endpoints expuestos por el backend (rutas, payloads, validaciones y errores esperados), usando requests reales contra un servidor en ejecucion.

## 2) Alcance

Base path: `/api/v1` (ver `src/app.ts`).

Endpoints cubiertos en los `.http` incluidos:

1. Auth: `/auth/*`
2. Users: `/user/*`
3. Products: `/product/*`
4. Address: `/address/*`
5. Orders: `/order/*`
6. Hot Offers: `/hot-offer/*`
7. Featured Products: `/featured-product/*`

Fuera de alcance (no hay `.http` aun en esta carpeta):

1. Profile: `/profile/me`
2. Review: `/review/*`
3. Checkout: `/checkout/`
4. Meta-data: `/meta-data/info`

Nota de codigo (para tenerlo presente en el plan):

1. Existe un modulo `productCuppon` en `src/app/modules/productCuppon`, pero **no esta montado** en `src/app/routes/routeArray.ts`, asi que no hay endpoint accesible bajo `/api/v1` con la configuracion actual.

## 3) Entorno Y Preconditions

1. Backend levantado en local con `PORT=5000` (por defecto los `.http` usan `http://localhost:5000`).
2. Base de datos MongoDB accesible con la URI configurada.
3. Variables de entorno:
   1. En el codigo, `src/config/index.ts` carga `.env.local`.
   2. En el repo existe `.env`. Para evitar confusion, se recomienda crear `.env.local` con los mismos valores de `.env`.
4. Herramienta: HTTP Client de WebStorm/IntelliJ (ejecuta `.http` y soporta variables y scripts `client.*`).

## 4) Estrategia De Datos

1. Cada archivo `.http` usa `{{$timestamp}}` para construir emails y nombres unicos y evitar colisiones.
2. Se guardan variables globales para encadenar pruebas (por ejemplo: `userId`, `customerToken`, `adminToken`, `productId`, `productSlug`, `orderId`).
3. Limpieza:
   1. Algunos flujos incluyen `DELETE` (por ejemplo users y orders).
   2. Otros recursos creados (productos) se eliminan cuando el endpoint lo permite.
4. Autenticacion:
   1. El backend espera `Authorization: <token>` (sin prefijo `Bearer`), ver `src/app/middleware/authGaurd.ts`.

## 5) Ejecucion (Plan)

Orden recomendado (para pruebas mas completas):

1. Ejecutar `tests/http_test/auth.http` para validar auth y dejar tokens listos.
2. Ejecutar `tests/http_test/users.http` si necesitas un `adminToken` para rutas protegidas.
3. Ejecutar `tests/http_test/products.http` para crear un producto y probar listados/slug/soft delete y las rutas protegidas.
4. Ejecutar `tests/http_test/address.http` para probar upsert de direccion por `userId`.
5. Ejecutar `tests/http_test/orders.http` para probar creacion de orden y casos de stock insuficiente.
6. Ejecutar `tests/http_test/hot-offers.http` y `tests/http_test/featured-products.http` para flujos de marketing (ofertas/destacados).

Como correr el backend para estas pruebas (local):

1. Instalar dependencias: `npm install`
2. Asegurar variables en `.env.local` (o ajustar `src/config/index.ts`).
3. Levantar servidor: `npm run dev`

## 6) Casos De Prueba (Detalle)

Convencion:

1. Los nombres de los casos corresponden al `# @name ...` dentro de cada `.http`.
2. Los checks se basan principalmente en `status code` y, cuando aplica, captura de variables (id/token/slug).

### 6.1) Auth (`tests/http_test/auth.http`)

1. `AuthRegister_201`
   1. Request: `POST /auth/register`
   2. Valida: `201`
   3. Guarda: `userId`, `userEmail`, `userPassword`
2. `AuthLogin_200`
   1. Request: `POST /auth/login`
   2. Valida: `200`
   3. Guarda: `customerToken`
3. `AuthChangePassword_401_NoAuth`
   1. Request: `POST /auth/change-password` sin header `Authorization`
   2. Valida: `401`
4. `AuthChangePassword_200`
   1. Request: `POST /auth/change-password` con `Authorization: {{customerToken}}`
   2. Valida: `200`
   3. Actualiza: `userPassword`
5. `AuthLogin_200_AfterPasswordChange`
   1. Request: `POST /auth/login` con la nueva password
   2. Valida: `200`
   3. Refresca: `customerToken`
6. `AuthForgotPassword_404_UserNotFound`
   1. Request: `POST /auth/forgot-password` con email inexistente
   2. Valida: `404`
7. `AuthResetPassword_400_MissingQuery`
   1. Request: `POST /auth/reset-password` sin `id` y `token` en query
   2. Valida: `400`

### 6.2) Users (`tests/http_test/users.http`)

1. `Users_Register_201`
   1. Request: `POST /auth/register`
   2. Valida: `201`
   3. Guarda: `userId`
2. `Users_GetAll_200`
   1. Request: `GET /user/`
   2. Valida: `200`
3. `Users_GetById_200`
   1. Request: `GET /user/:id`
   2. Valida: `200`
4. `Users_UpdateAvatar_200`
   1. Request: `PATCH /user/:id/update-avatar`
   2. Valida: `200`
5. `Users_UpdateRoleToAdmin_200`
   1. Request: `PATCH /user/:id` con `{ "role": "ADMIN" }`
   2. Valida: `200`
   3. Observacion de seguridad: en el codigo actual este endpoint no esta protegido por `authGaurd`.
6. `Users_LoginAsAdmin_200`
   1. Request: `POST /auth/login`
   2. Valida: `200`
   3. Guarda: `adminToken`
7. `Users_TopCustomer_200`
   1. Request: `GET /user/top-customer`
   2. Valida: `200`
8. `Users_Delete_200`
   1. Request: `DELETE /user/:id`
   2. Valida: `200`

### 6.3) Products (`tests/http_test/products.http`)

1. `Products_Register_201`
   1. Request: `POST /auth/register`
   2. Valida: `201`
   3. Guarda: `userId`
2. `Products_MakeAdmin_200`
   1. Request: `PATCH /user/:id` con role `ADMIN`
   2. Valida: `200`
3. `Products_Login_Admin_200`
   1. Request: `POST /auth/login`
   2. Valida: `200`
   3. Guarda: `adminToken`
4. `Products_Create_400_ValidationError`
   1. Request: `POST /product/` con payload incompleto (falta `name`)
   2. Valida: `400` (Zod validation)
5. `Products_Create_201`
   1. Request: `POST /product/`
   2. Valida: `201`
   3. Guarda: `productId`, `productSlug`
6. `Products_GetAll_200`
   1. Request: `GET /product/?page=1&limit=5`
   2. Valida: `200`
7. `Products_GetAll_FilterSearch_200`
   1. Request: `GET /product/?search=...`
   2. Valida: `200`
8. `Products_GetBySlug_200`
   1. Request: `GET /product/:slug`
   2. Valida: `200`
9. `Products_RelatedBySlug_200`
   1. Request: `GET /product/related-product/:slug`
   2. Valida: `200`
10. `Products_AdminGetById_200`
   1. Request: `GET /product/admin/:id`
   2. Valida: `200`
11. `Products_Update_401_NoAuth`
   1. Request: `PATCH /product/:slug` sin `Authorization`
   2. Valida: `401`
12. `Products_Update_BySlug_404`
   1. Request: `PATCH /product/:slug` usando slug real y con `Authorization`
   2. Valida: `404`
   3. Hallazgo: en `product.controller.ts` se pasa `req.params.slug` al service `updateIntoDB`, pero el service actualiza por `id`. Esto rompe el update por slug.
13. `Products_Update_ById_200`
   1. Request: `PATCH /product/:slug` pasando el `productId` como parametro y con `Authorization`
   2. Valida: `200`
14. `Products_SoftDelete_200`
   1. Request: `DELETE /product/soft/:id` con `Authorization`
   2. Valida: `200`
15. `Products_Delete_BySlug_404`
   1. Request: `DELETE /product/:slug` usando slug real y con `Authorization`
   2. Valida: `404`
   3. Hallazgo: mismo problema que update (service borra por `id`).
16. `Products_Delete_ById_200`
   1. Request: `DELETE /product/:slug` pasando `productId` como parametro y con `Authorization`
   2. Valida: `200`

### 6.4) Address (`tests/http_test/address.http`)

1. `Address_Register_201`
   1. Request: `POST /auth/register`
   2. Valida: `201`
   3. Guarda: `userId`
2. `Address_Upsert_Create_200`
   1. Request: `PATCH /address/:id` con payload de address
   2. Valida: `200`
   3. Nota: `:id` representa `userId` (ver `address.services.ts` hace upsert por `userId`).
3. `Address_GetByUserId_200`
   1. Request: `GET /address/:id`
   2. Valida: `200`
4. `Address_Upsert_Update_200`
   1. Request: `PATCH /address/:id` con nuevos valores
   2. Valida: `200`
5. `Address_GetByUserId_404_NotFound`
   1. Request: `GET /address/000000000000000000000000`
   2. Valida: `404`

### 6.5) Orders (`tests/http_test/orders.http`)

1. `Orders_Register_201`
   1. Request: `POST /auth/register`
   2. Valida: `201`
   3. Guarda: `userId`
2. `Orders_CreateProduct_201`
   1. Request: `POST /product/` (producto con `inStock: 1`)
   2. Valida: `201`
   3. Guarda: `productId`
3. `Orders_Create_400_InsufficientStock`
   1. Request: `POST /order/` con `quantity: 2`
   2. Valida: `400`
4. `Orders_Create_201`
   1. Request: `POST /order/` con `quantity: 1`
   2. Valida: `201`
   3. Guarda: `orderId`
5. `Orders_GetAll_200`
   1. Request: `GET /order/`
   2. Valida: `200`
6. `Orders_Latest_200`
   1. Request: `GET /order/latest-order`
   2. Valida: `200`
7. `Orders_GetByUserId_200`
   1. Request: `GET /order/:id` usando `userId`
   2. Valida: `200`
   3. Hallazgo/Nota: el service `getById` en realidad consulta `user` y devuelve sus `orders` (no busca la orden por `orderId`).
8. `Orders_Update_200`
   1. Request: `PATCH /order/:id` usando `orderId`
   2. Valida: `200`
9. `Orders_Delete_200`
   1. Request: `DELETE /order/:id` usando `orderId`
   2. Valida: `200`

### 6.6) Hot Offers (`tests/http_test/hot-offers.http`)

1. `HotOffers_CreateProduct_201`
   1. Request: `POST /product/`
   2. Valida: `201`
   3. Guarda: `productId`
2. `HotOffers_Create_201`
   1. Request: `POST /hot-offer/`
   2. Valida: `201`
   3. Guarda: `hotOfferId`
3. `HotOffers_Create_400_Duplicate`
   1. Request: `POST /hot-offer/` con el mismo `productId`
   2. Valida: `400`
4. `HotOffers_GetAll_200`
   1. Request: `GET /hot-offer/`
   2. Valida: `200`
5. `HotOffers_GetById_200`
   1. Request: `GET /hot-offer/:id`
   2. Valida: `200`
6. `HotOffers_Update_201`
   1. Request: `PATCH /hot-offer/:id`
   2. Valida: `201` (observacion: controller responde `201` en update)
7. `HotOffers_Delete_201`
   1. Request: `DELETE /hot-offer/:id`
   2. Valida: `201` (observacion: controller responde `201` en delete)

### 6.7) Featured Products (`tests/http_test/featured-products.http`)

1. `Featured_CreateProduct_201`
   1. Request: `POST /product/`
   2. Valida: `201`
   3. Guarda: `productId`
2. `Featured_Create_201`
   1. Request: `POST /featured-product/`
   2. Valida: `201`
   3. Guarda: `featuredId`
3. `Featured_Create_302_Duplicate`
   1. Request: `POST /featured-product/` con el mismo `productId`
   2. Valida: `302`
4. `Featured_GetAll_200`
   1. Request: `GET /featured-product/`
   2. Valida: `200`
5. `Featured_GetById_200`
   1. Request: `GET /featured-product/:id`
   2. Valida: `200`
6. `Featured_Update_200`
   1. Request: `PATCH /featured-product/:id`
   2. Valida: `200`
7. `Featured_Delete_200`
   1. Request: `DELETE /featured-product/:id`
   2. Valida: `200`

## 7) Hallazgos Y Riesgos (Desde Las Pruebas HTTP)

1. `product` update/delete: el router define `/:slug`, el controller usa `req.params.slug`, pero el service actualiza/elimina por `id`. Resultado: por slug real suele fallar con `404`. Esto se evidencio en los casos `Products_Update_BySlug_404` y `Products_Delete_BySlug_404`.
2. `order/:id` (GET): el service consulta `user` y devuelve `orders`. El nombre de la ruta sugiere "order by id", pero funciona como "orders by userId".
3. Seguridad: varias rutas de escritura no tienen `authGaurd` (por ejemplo `POST /product/`, `PATCH /user/:id`), lo que permite acciones administrativas sin token en el estado actual del codigo.
4. `checkout`: el service hace `console.log({error})` y puede devolver `undefined` sin error controlado si Stripe falla (esto afecta la prueba de ese endpoint cuando se agregue).

## 8) Despliegue (Ejecucion En Ambientes)

### Local (desarrollo)

1. Crear `.env.local` en la raiz (porque el codigo lo carga explicitamente).
2. Confirmar `PORT=5000` si vas a usar los `.http` sin cambios.
3. Levantar: `npm run dev`

### Build/produccion

1. Compilar: `npm run build`
2. Ejecutar: `npm start` (usa `dist/server.js`)

### Vercel

1. `vercel.json` apunta a `dist/server.js`, por lo que el deploy requiere build previo (o pipeline que ejecute `npm run build`).
2. Configurar variables de entorno en Vercel (equivalentes a las de `.env.local`).

