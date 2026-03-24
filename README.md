<p align="center">
<img src="https://img.shields.io/badge/UTN-FRRo-purple?style=for-the-badge&logo=googleclassroom&logoColor=white" />
<img src="https://img.shields.io/badge/Backend-Node.js-white?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/github/last-commit/AlanHeidel/utnfrro-backend?style=for-the-badge&logo=git&logoColor=white&color=purple"> 
<img src="https://img.shields.io/github/repo-size/AlanHeidel/utnfrro-backend?style=for-the-badge&logo=github&logoColor=white&color=white">
</p>

Backend del trabajo práctico de **Desarrollo de Software** de **UTN FRRo**.  
Este proyecto contiene la API REST y la lógica de negocio de la aplicación.

---

<p>
	<img src="https://img.shields.io/badge/Descripción-333333?style=for-the-badge">
</p>

La aplicación backend provee endpoints para autenticación, gestión de datos y comunicación con la base de datos.  
Está diseñada siguiendo una arquitectura modular con separación de responsabilidades.

---

<p>
  <img src="https://img.shields.io/badge/Tecnologías%20utilizadas-333333?style=for-the-badge">
</p>

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/MikroORM-FEE685?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-A684FF?style=for-the-badge&logo=jsonwebtokens"/>
  <img src="https://img.shields.io/badge/Bcrypt-003A70?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/PNPM-F69220?style=for-the-badge&logo=pnpm&logoColor=white"/>
  <img src="https://img.shields.io/badge/Socket.IO-EC253F?style=for-the-badge&logo=socketdotio&logoColor=white"/>
</p>

---

<p>
	<img src="https://img.shields.io/badge/Instalación-333333?style=for-the-badge">
</p>

```bash
git clone https://github.com/AlanHeidel/utnfrro-backend.git
cd utnfrro-backend
pnpm install
```
---
<p> <img src="https://img.shields.io/badge/Variables%20de%20entorno-333333?style=for-the-badge"> </p>

Crear archivo .env:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=database
DB_USER=root
DB_PASSWORD=password

JWT_SECRET=secret
JWT_EXPIRATION=1d
```

---
<p> <img src="https://img.shields.io/badge/Base%20de%20datos-333333?style=for-the-badge"> </p>

Levantar MySQL con Docker (ejemplo):
```bash
docker run -d \
  --name mysql-utn \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=database \
  mysql:8
```
---
<p> <img src="https://img.shields.io/badge/Ejecución-333333?style=for-the-badge"> </p>

```bash
pnpm start:dev
```

---
<p> <img src="https://img.shields.io/badge/Build-333333?style=for-the-badge"> </p>

```bash
pnpm build
```
---

<p> <img src="https://img.shields.io/badge/Estructura-333333?style=for-the-badge"> </p>

```bash
src/
├── config/
├── modules/
├── shared/
├── app.ts
└── server.ts
```
---

<p> <img src="https://img.shields.io/badge/Endpoints-333333?style=for-the-badge"> </p>

##### Accounts (`/api/accounts`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/accounts/register` | Public | Registro de cuenta cliente (`email`, `password`, `nombre?`) |
| POST | `/api/accounts/login` | Public | Login por `identifier` + `password` (account o table-device) |
| GET | `/api/accounts` | Admin | Listado de cuentas `Account` |
| GET | `/api/accounts/:id` | Admin | Obtener cuenta por id |
| POST | `/api/accounts/table-device` | Admin | Crear cuenta de mesa (`mesaId`, `password`, `identifier?`, `nombre?`) |
| GET | `/api/accounts/table-device` | Admin | Listado de cuentas de mesa |
<br/>

##### Platos (`/api/platos`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/platos` | Admin | Lista todos los platos (incluye agotados) |
| GET | `/api/platos/destacados` | Public | Lista hasta 6 platos destacados |
| GET | `/api/platos/menu` | Table-device | Lista menú (excluye agotados) |
| GET | `/api/platos/:id` | Public | Obtener plato por id |
| POST | `/api/platos` | Admin | Crear plato |
| PUT | `/api/platos/:id` | Admin | Actualizar plato |
| PATCH | `/api/platos/:id` | Admin | Actualizar plato parcial |
| DELETE | `/api/platos/:id` | Admin | Baja lógica (estado `AGOTADO`) |
<br/>

##### TipoPlato (`/api/tipoPlatos`)

> Actualmente públicos (sin middleware)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tipoPlatos` | Public | Listar tipos |
| GET | `/api/tipoPlatos/:id` | Public | Obtener tipo por id |
| POST | `/api/tipoPlatos` | Public | Crear tipo |
| PUT | `/api/tipoPlatos/:id` | Public | Actualizar tipo |
| DELETE | `/api/tipoPlatos/:id` | Public | Eliminar tipo |
<br/>

##### Mesas (`/api/mesas`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/mesas` | Admin | Listar mesas activas (`deleted=false`) |
| GET | `/api/mesas/:id` | Table-device | Obtener mesa por id |
| POST | `/api/mesas` | Admin | Crear/restaurar mesa (puede crear table-account) |
| PUT | `/api/mesas/:id` | Admin | Actualizar mesa |
| DELETE | `/api/mesas/:id` | Admin | Baja lógica de mesa (`deleted=true`) |
<br/>

##### Mozos (`/api/mozos`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/mozos` | Admin | Listar mozos activos |
| GET | `/api/mozos/:id` | Admin | Obtener mozo |
| POST | `/api/mozos` | Admin | Crear mozo |
| PUT | `/api/mozos/:id` | Admin | Actualizar mozo |
| DELETE | `/api/mozos/:id` | Admin | Baja lógica + desasigna mozo de mesas |
<br/>

##### Pedidos (`/api/pedidos`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/pedidos` | Admin | Listar todos los pedidos |
| GET | `/api/pedidos/:id` | Admin | Obtener pedido por id |
| POST | `/api/pedidos/table` | Table-device | Crear pedido desde mesa (`items[]`, `nota?`) |
| PATCH | `/api/pedidos/:id/estado` | Admin | Cambiar estado del pedido (`estado`) |
| GET | `/api/pedidos/table/:id/recibidos` | Table-device | Pedidos `pending` de esa mesa |
| GET | `/api/pedidos/table/:id/en-cocina` | Table-device | Pedidos `in_progress` de esa mesa |
| GET | `/api/pedidos/table/:id/pendientes-pago` | Table-device | Pedidos `pending_payment` de esa mesa |
<br/>

##### Reservas (`/api/reservas`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/reservas/disponibilidad?fecha=YYYY-MM-DD&personas=N` | Public | Slots/mesas disponibles |
| GET | `/api/reservas` | Account | Lista reservas (admin: todas, cliente: propias) |
| GET | `/api/reservas/:id` | Account | Obtener reserva (cliente solo la suya) |
| POST | `/api/reservas` | Account | Crear reserva (`mesaId`, `inicio`, `observacion?`) |
| DELETE | `/api/reservas/:id` | Account | Cancelar reserva |
| PATCH | `/api/reservas/:id/finalizar` | Account | Finalizar reserva (admin habilitado) |
<br/>

##### Payments (`/api/payments`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/payments/public-key` | Public | Devuelve config pública de MP |
| POST | `/api/payments/table/preference` | Table-device | Crea preference MP para pedido nuevo |
| POST | `/api/payments/table/pedidos/:pedidoId/preference?recreate=true|false` | Table-device | Recupera/recrea preference para pedido pendiente de pago |
| POST | `/api/payments/table/confirm` | Table-device | Confirma pago (usa `paymentId` en body/query) |
| POST | `/api/payments/webhook` | Public (MP) | Webhook de Mercado Pago |
<br/>

##### Admin Dashboard (`/api/admin`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/metricas/pedidos-hoy` | Admin | Cantidad de pedidos confirmados de hoy |
| GET | `/api/admin/metricas/ingresos-hoy` | Admin | Ingresos de hoy (pedidos entregados) |
| GET | `/api/admin/metricas/mesas-ocupadas` | Admin | Mesas ocupadas y total |
| GET | `/api/admin/metricas/cuentas-usuarios` | Admin | Métricas de cuentas |
| GET | `/api/admin/dashboard/mensual?month=YYYY-MM` | Admin | Dashboard mensual completo |
| GET | `/api/admin/dashboard/objetivos?month=YYYY-MM` | Admin | Objetivos mensuales |
| PUT | `/api/admin/dashboard/objetivos?month=YYYY-MM` | Admin | Crear/actualizar objetivos mensuales |
| GET | `/api/admin/dashboard/top-productos?month=YYYY-MM&limit=N` | Admin | Top productos vendidos del mes |
<br/>

##### Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/notifications/table/mozo-call` | Table-device | Crear solicitud de mozo (evita duplicado `pending`) |
| GET | `/api/notifications?estado=pending|attended|canceled&mesaId=ID&limit=N` | Admin | Listar notificaciones |
| PATCH | `/api/notifications/:id/estado` | Admin | Actualizar estado de notificación (`estado`) |

---



