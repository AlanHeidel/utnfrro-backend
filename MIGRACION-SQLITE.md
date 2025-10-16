# 🔄 Migración a SQLite - Guía Completa

## ✅ Cambios Realizados

### 1. **Dependencias Instaladas**
```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

### 2. **Archivos Creados**

#### Base de Datos
- ✅ `sql/init-sqlite.sql` - Schema SQLite con datos de ejemplo
- ✅ `src/shared/db.ts` - Servicio de conexión a SQLite
- ✅ `.gitignore` - Actualizado para excluir archivos `.sqlite`

#### Repositories SQLite
- ✅ `src/mesa/mesaRepository.sqlite.ts`
- ✅ `src/cliente/clienteRepository.sqlite.ts`
- ✅ `src/mozo/mozoRepository.sqlite.ts`
- ✅ `src/plato/platoRepository.sqlite.ts`
- ✅ `src/reserva/reservaRepository.sqlite.ts`
- ✅ `src/pedido/pedidoRepository.sqlite.ts`

### 3. **Archivos Modificados**

#### Controllers (actualizados para usar repositories SQLite)
- ✅ `src/mesa/mesaController.ts`
- ✅ `src/cliente/clienteController.ts`
- ✅ `src/mozo/mozoController.ts`
- ✅ `src/plato/platoController.ts`
- ✅ `src/reserva/reservaController.ts`
- ✅ `src/pedido/pedidoController.ts`

#### Aplicación Principal
- ✅ `src/app.ts` - Inicializa la base de datos al arrancar

---

## 🗄️ Estructura de la Base de Datos

### Tablas Creadas

1. **TipoPlato** - Tipos de platos (Entrada, Principal, Postre, Bebida)
2. **Plato** - Platos del menú
3. **Mesa** - Mesas del restaurante
4. **Cliente** - Clientes registrados
5. **Mozo** - Personal del restaurante
6. **Reserva** - Reservas de mesas
7. **Pedido** - Pedidos realizados
8. **ItemPedido** - Items individuales de cada pedido

### Relaciones

```
TipoPlato (1) ──→ (N) Plato
Cliente (1) ──→ (N) Reserva
Mesa (1) ──→ (N) Reserva
Cliente (1) ──→ (N) Pedido
Mesa (1) ──→ (N) Pedido
Mozo (1) ──→ (N) Pedido
Pedido (1) ──→ (N) ItemPedido
Plato (1) ──→ (N) ItemPedido
```

---

## 🚀 Cómo Usar

### 1. Compilar el Proyecto
```bash
npm run build
```

### 2. Iniciar el Servidor
```bash
npm run start:dev
```

Al iniciar, verás:
```
✅ Base de datos inicializada correctamente
✅ Base de datos SQLite inicializada correctamente
🚀 Server is running on http://localhost:3000/
📊 Database: SQLite (database.sqlite)
```

### 3. La Base de Datos se Crea Automáticamente

- **Ubicación:** `database.sqlite` (en la raíz del proyecto)
- **Inicialización:** Automática al arrancar el servidor
- **Datos de ejemplo:** Se cargan automáticamente

---

## 📊 Datos de Ejemplo Incluidos

### TipoPlato (4 registros)
- Entrada
- Principal
- Postre
- Bebida

### Plato (4 registros)
- Milanesa Napolitana ($1500)
- Ensalada Caesar ($1200)
- Tira de Asado ($2500)
- Flan con Dulce de Leche ($800)

### Mesa (5 registros)
- Mesa 1: 4 personas (disponible)
- Mesa 2: 2 personas (disponible)
- Mesa 3: 6 personas (disponible)
- Mesa 4: 4 personas (ocupada)
- Mesa 5: 8 personas (reservada)

### Cliente (3 registros)
- Juan Pérez
- María González
- Carlos Rodríguez

### Mozo (3 registros)
- Roberto Fernández
- Laura Sánchez
- Diego López

### Reserva (2 registros)
- Reserva para 4 personas (confirmada)
- Reserva para 6 personas (pendiente)

### Pedido (1 registro)
- Pedido en preparación con 2 items

---

## 🔧 Características de SQLite

### Ventajas
✅ **Sin instalación** - No requiere servidor de base de datos  
✅ **Portátil** - Un solo archivo `.sqlite`  
✅ **Rápido** - Excelente para desarrollo  
✅ **ACID compliant** - Transacciones seguras  
✅ **Foreign Keys** - Integridad referencial habilitada  

### Configuración Aplicada
```typescript
db.pragma("foreign_keys = ON"); // Integridad referencial
```

---

## 🧪 Testing

### Probar Endpoints

Todos los endpoints funcionan igual que antes:

```bash
# Obtener todas las mesas
curl http://localhost:3000/api/mesas

# Obtener mesa específica
curl http://localhost:3000/api/mesas/1

# Crear nueva mesa
curl -X POST http://localhost:3000/api/mesas \
  -H "Content-Type: application/json" \
  -d '{"numero":10,"capacidad":4,"estado":"disponible"}'

# Actualizar mesa
curl -X PUT http://localhost:3000/api/mesas/1 \
  -H "Content-Type: application/json" \
  -d '{"numero":1,"capacidad":6,"estado":"disponible"}'

# Eliminar mesa
curl -X DELETE http://localhost:3000/api/mesas/1
```

### Usar Archivos .http

Todos los archivos `.http` siguen funcionando:
- `src/plato/platos.http`
- `src/mesa/mesas.http`
- `src/cliente/clientes.http`
- `src/mozo/mozos.http`
- `src/reserva/reservas.http`
- `src/pedido/pedidos.http`

---

## 🔄 Diferencias con la Versión en Memoria

### Antes (In-Memory)
```typescript
// Los datos se perdían al reiniciar
const platos = [
  new Plato(...),
  new Plato(...)
];
```

### Ahora (SQLite)
```typescript
// Los datos persisten en database.sqlite
const stmt = db.prepare("SELECT * FROM Plato");
const rows = stmt.all();
```

### Persistencia
- ✅ **Los datos se guardan** en `database.sqlite`
- ✅ **Sobreviven a reinicios** del servidor
- ✅ **Se pueden respaldar** copiando el archivo `.sqlite`

---

## 🗑️ Resetear la Base de Datos

Si quieres empezar de cero:

```bash
# Detener el servidor (Ctrl+C)

# Eliminar la base de datos
rm database.sqlite

# Reiniciar el servidor
npm run start:dev
```

La base de datos se recreará automáticamente con los datos de ejemplo.

---

## 📝 Notas Importantes

### IDs Autoincrementales
- SQLite usa `INTEGER PRIMARY KEY AUTOINCREMENT`
- Los IDs se generan automáticamente
- No es necesario el contador estático en las entidades

### Tipos de Datos
- `TEXT` para strings
- `INTEGER` para números enteros
- `REAL` para números decimales
- `TEXT` para fechas (formato ISO 8601)

### JSON en SQLite
- Los arrays se guardan como JSON strings
- Se parsean automáticamente en los repositories
- Ejemplo: `ingredientes` en la tabla `Plato`

### Transacciones
- SQLite maneja transacciones automáticamente
- Cada operación es atómica
- Los errores hacen rollback automático

---

## 🔜 Próximos Pasos Sugeridos

1. **Agregar Validaciones**
   - Validar datos antes de insertar
   - Usar Zod o class-validator

2. **Manejo de Errores Mejorado**
   - Capturar errores específicos de SQLite
   - Mensajes de error más descriptivos

3. **Índices**
   - Agregar índices para búsquedas frecuentes
   - Mejorar performance

4. **Migraciones**
   - Sistema de migraciones para cambios de schema
   - Versionado de base de datos

5. **Backup Automático**
   - Script para respaldar `database.sqlite`
   - Restauración de backups

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'better-sqlite3'"
```bash
npm install better-sqlite3
```

### Error: "SQLITE_ERROR: no such table"
- Eliminar `database.sqlite`
- Reiniciar el servidor

### Error: "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed"
- Verificar que los IDs de las relaciones existan
- Revisar el orden de inserción de datos

### Base de datos bloqueada
- Cerrar todas las conexiones
- Reiniciar el servidor

---

## ✨ Resumen

✅ **SQLite integrado** - Base de datos funcional  
✅ **6 entidades** - Todas con CRUD completo  
✅ **Datos persistentes** - Sobreviven a reinicios  
✅ **Relaciones complejas** - Foreign keys funcionando  
✅ **Datos de ejemplo** - Listos para probar  
✅ **Sin cambios en la API** - Endpoints iguales  

**¡Tu sistema de gestión de restaurante ahora tiene persistencia de datos! 🎉**
