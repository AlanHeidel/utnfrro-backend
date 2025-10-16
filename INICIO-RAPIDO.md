# 🚀 Inicio Rápido - Backend Restaurante

## ⚡ 3 Pasos para Empezar

### 1️⃣ Instalar Dependencias (si no lo hiciste)
```bash
pnpm install
```

### 2️⃣ Iniciar el Servidor
```bash
npm run start:dev
```

Verás algo como:
```
✅ Base de datos inicializada correctamente
✅ Base de datos SQLite inicializada correctamente
🚀 Server is running on http://localhost:3000/
📊 Database: SQLite (database.sqlite)
```

### 3️⃣ Probar la API

#### Opción A: Usar archivos .http (Recomendado)
1. Abre `test-endpoints.http`
2. Haz clic en "Send Request" sobre cualquier endpoint
3. ¡Listo! 🎉

#### Opción B: Usar el navegador
```
http://localhost:3000/api/mesas
http://localhost:3000/api/platos
http://localhost:3000/api/clientes
```

#### Opción C: Usar cURL
```bash
curl http://localhost:3000/api/mesas
```

---

## 📋 Endpoints Disponibles

### Mesas
- `GET http://localhost:3000/api/mesas` - Ver todas
- `GET http://localhost:3000/api/mesas/1` - Ver una
- `POST http://localhost:3000/api/mesas` - Crear
- `PUT http://localhost:3000/api/mesas/1` - Actualizar
- `DELETE http://localhost:3000/api/mesas/1` - Eliminar

### Clientes
- `GET http://localhost:3000/api/clientes`
- `GET http://localhost:3000/api/clientes/1`
- `POST http://localhost:3000/api/clientes`
- `PUT http://localhost:3000/api/clientes/1`
- `DELETE http://localhost:3000/api/clientes/1`

### Mozos
- `GET http://localhost:3000/api/mozos`
- `GET http://localhost:3000/api/mozos/1`
- `POST http://localhost:3000/api/mozos`
- `PUT http://localhost:3000/api/mozos/1`
- `DELETE http://localhost:3000/api/mozos/1`

### Platos
- `GET http://localhost:3000/api/platos`
- `GET http://localhost:3000/api/platos/1`
- `POST http://localhost:3000/api/platos`
- `PUT http://localhost:3000/api/platos/1`
- `DELETE http://localhost:3000/api/platos/1`

### Reservas
- `GET http://localhost:3000/api/reservas`
- `GET http://localhost:3000/api/reservas/1`
- `POST http://localhost:3000/api/reservas`
- `PUT http://localhost:3000/api/reservas/1`
- `DELETE http://localhost:3000/api/reservas/1`

### Pedidos
- `GET http://localhost:3000/api/pedidos`
- `GET http://localhost:3000/api/pedidos/1`
- `POST http://localhost:3000/api/pedidos`
- `PUT http://localhost:3000/api/pedidos/1`
- `DELETE http://localhost:3000/api/pedidos/1`

---

## 💡 Ejemplos Rápidos

### Crear una Mesa
```bash
curl -X POST http://localhost:3000/api/mesas \
  -H "Content-Type: application/json" \
  -d '{"numero":10,"capacidad":4,"estado":"disponible"}'
```

### Crear un Cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","apellido":"García","telefono":"3515555555","email":"ana@example.com","dni":"40123456"}'
```

### Crear un Plato
```bash
curl -X POST http://localhost:3000/api/platos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Pizza","precio":1800,"ingredientes":["masa","tomate","queso"],"tipoPlato":{"idTipoPlato":"2","nombre":"Principal"},"imagen":"pizza.jpg"}'
```

---

## 📁 Archivos Importantes

- **test-endpoints.http** - Todas las pruebas de API
- **RESUMEN-COMPLETO.md** - Documentación completa
- **MIGRACION-SQLITE.md** - Detalles de SQLite
- **database.sqlite** - Base de datos (se crea automáticamente)

---

## 🔄 Comandos Útiles

```bash
# Iniciar en desarrollo (con auto-reload)
npm run start:dev

# Solo compilar
npm run build

# Iniciar en producción
node dist/app.js

# Resetear base de datos
rm database.sqlite
npm run start:dev
```

---

## ❓ Problemas Comunes

### Puerto 3000 ocupado
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Luego reinicia
npm run start:dev
```

### Error de compilación
```bash
rm -rf dist
npm run build
npm run start:dev
```

### Base de datos corrupta
```bash
rm database.sqlite
npm run start:dev
```

---

## 📚 Más Información

- **RESUMEN-COMPLETO.md** - Documentación detallada
- **MIGRACION-SQLITE.md** - Guía de SQLite
- Archivos `.http` en cada carpeta de entidad

---

## ✨ Datos de Ejemplo Incluidos

Al iniciar, ya tienes:
- ✅ 4 tipos de plato
- ✅ 4 platos
- ✅ 5 mesas
- ✅ 3 clientes
- ✅ 3 mozos
- ✅ 2 reservas
- ✅ 1 pedido

**¡Todo listo para probar!** 🎉

---

## 🎯 Siguiente Paso

1. Inicia el servidor: `npm run start:dev`
2. Abre `test-endpoints.http`
3. Prueba los endpoints
4. ¡Empieza a desarrollar! 🚀

**¿Necesitas ayuda?** Lee **RESUMEN-COMPLETO.md** para más detalles.
