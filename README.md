# Sistema de Gestión de Restaurante - Backend

API REST para la gestión completa de un restaurante, desarrollada con **Express** y **TypeScript**.

## 🚀 Características

- ✅ **CRUD completo** para todas las entidades
- ✅ **Arquitectura modular** con patrón Repository
- ✅ **TypeScript** para type safety
- ✅ **Express** como framework web
- ✅ **Datos en memoria** (listo para migrar a MySQL)

## 📦 Entidades Implementadas

### 1. **Platos** (`/api/platos`)
- Gestión de platos del menú
- Tipos de plato (Entrada, Principal, Postre, Bebida)
- Precio, ingredientes e imagen

### 2. **Mesas** (`/api/mesas`)
- Gestión de mesas del restaurante
- Estados: disponible, ocupada, reservada
- Número y capacidad

### 3. **Clientes** (`/api/clientes`)
- Registro de clientes
- Datos personales y de contacto

### 4. **Mozos** (`/api/mozos`)
- Gestión de personal
- Datos personales y de contacto

### 5. **Reservas** (`/api/reservas`)
- Sistema de reservas
- Relaciona cliente con mesa
- Fecha, hora y estado

### 6. **Pedidos** (`/api/pedidos`)
- Gestión de pedidos
- Relaciona mesa, cliente, mozo y platos
- Cálculo automático de totales
- Estados del pedido

## 🛠️ Instalación

```bash
# Instalar dependencias
pnpm install

# Compilar TypeScript
pnpm run build

# Modo desarrollo (con hot reload)
pnpm run start:dev
```

## 📡 Endpoints Disponibles

### Platos
- `GET /api/platos` - Listar todos los platos
- `GET /api/platos/:id` - Obtener un plato
- `POST /api/platos` - Crear plato
- `PUT /api/platos/:id` - Actualizar plato completo
- `PATCH /api/platos/:id` - Actualizar plato parcial
- `DELETE /api/platos/:id` - Eliminar plato

### Mesas
- `GET /api/mesas` - Listar todas las mesas
- `GET /api/mesas/:id` - Obtener una mesa
- `POST /api/mesas` - Crear mesa
- `PUT /api/mesas/:id` - Actualizar mesa
- `PATCH /api/mesas/:id` - Actualizar mesa parcial
- `DELETE /api/mesas/:id` - Eliminar mesa

### Clientes
- `GET /api/clientes` - Listar todos los clientes
- `GET /api/clientes/:id` - Obtener un cliente
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `PATCH /api/clientes/:id` - Actualizar cliente parcial
- `DELETE /api/clientes/:id` - Eliminar cliente

### Mozos
- `GET /api/mozos` - Listar todos los mozos
- `GET /api/mozos/:id` - Obtener un mozo
- `POST /api/mozos` - Crear mozo
- `PUT /api/mozos/:id` - Actualizar mozo
- `PATCH /api/mozos/:id` - Actualizar mozo parcial
- `DELETE /api/mozos/:id` - Eliminar mozo

### Reservas
- `GET /api/reservas` - Listar todas las reservas
- `GET /api/reservas/:id` - Obtener una reserva
- `POST /api/reservas` - Crear reserva
- `PUT /api/reservas/:id` - Actualizar reserva
- `PATCH /api/reservas/:id` - Actualizar reserva parcial
- `DELETE /api/reservas/:id` - Eliminar reserva

### Pedidos
- `GET /api/pedidos` - Listar todos los pedidos
- `GET /api/pedidos/:id` - Obtener un pedido
- `POST /api/pedidos` - Crear pedido
- `PUT /api/pedidos/:id` - Actualizar pedido
- `PATCH /api/pedidos/:id` - Actualizar pedido parcial
- `DELETE /api/pedidos/:id` - Eliminar pedido

## 🧪 Pruebas

Cada módulo incluye un archivo `.http` con ejemplos de peticiones:
- `src/plato/platos.http`
- `src/mesa/mesas.http`
- `src/cliente/clientes.http`
- `src/mozo/mozos.http`
- `src/reserva/reservas.http`
- `src/pedido/pedidos.http`

Usa la extensión **REST Client** de VSCode para ejecutarlas.

## 📁 Estructura del Proyecto

```
utnfrro-backend/
├── src/
│   ├── app.ts                 # Aplicación principal
│   ├── shared/
│   │   └── repository.ts      # Interface Repository
│   ├── plato/
│   │   ├── platoEntity.ts
│   │   ├── platoRepository.ts
│   │   ├── platoController.ts
│   │   ├── platoRoutes.ts
│   │   └── platos.http
│   ├── mesa/
│   │   ├── mesaEntity.ts
│   │   ├── mesaRepository.ts
│   │   ├── mesaController.ts
│   │   ├── mesaRoutes.ts
│   │   └── mesas.http
│   ├── cliente/
│   │   ├── clienteEntity.ts
│   │   ├── clienteRepository.ts
│   │   ├── clienteController.ts
│   │   ├── clienteRoutes.ts
│   │   └── clientes.http
│   ├── mozo/
│   │   ├── mozoEntity.ts
│   │   ├── mozoRepository.ts
│   │   ├── mozoController.ts
│   │   ├── mozoRoutes.ts
│   │   └── mozos.http
│   ├── reserva/
│   │   ├── reservaEntity.ts
│   │   ├── reservaRepository.ts
│   │   ├── reservaController.ts
│   │   ├── reservaRoutes.ts
│   │   └── reservas.http
│   └── pedido/
│       ├── pedidoEntity.ts
│       ├── pedidoRepository.ts
│       ├── pedidoController.ts
│       ├── pedidoRoutes.ts
│       └── pedidos.http
├── sql/
│   └── init.sql              # Script de base de datos
├── dist/                     # Código compilado
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Base de Datos

El archivo `sql/init.sql` contiene:
- ✅ Definición de todas las tablas
- ✅ Relaciones y constraints
- ✅ Datos de ejemplo

### Tablas:
- `TipoPlato`
- `Plato`
- `Mesa`
- `Cliente`
- `Mozo`
- `Reserva`
- `Pedido`
- `ItemPedido`

## 🔄 Próximos Pasos

1. **Conectar MySQL**
   - Instalar `mysql2`
   - Crear servicio de conexión
   - Migrar repositories a usar MySQL

2. **Validaciones**
   - Implementar validación de datos con Zod o class-validator
   - Manejo de errores centralizado

3. **Autenticación**
   - Integrar el sistema de login existente
   - JWT para autenticación

4. **Mejoras**
   - Agregar paginación
   - Filtros y búsqueda
   - Logging
   - Documentación con Swagger

## 📝 Notas

- Actualmente usa **datos en memoria** (se pierden al reiniciar)
- El servidor corre en `http://localhost:3000`
- Todos los endpoints retornan JSON

## 🤝 Contribuir

Este es un proyecto educativo para UTN FRRO.
