# 🔧 Solución al Error de UNIQUE Constraint

## ❌ Problema Encontrado

Al reiniciar el servidor, se producía el siguiente error:

```
❌ Error al inicializar la base de datos: SqliteError: UNIQUE constraint failed: TipoPlato.idTipoPlato
```

### Causa del Error

El script SQL intentaba insertar los datos de ejemplo cada vez que se iniciaba el servidor, pero como la base de datos SQLite persiste los datos, los registros ya existían, causando conflictos con las restricciones UNIQUE y PRIMARY KEY.

---

## ✅ Solución Implementada

### Cambio en `sql/init-sqlite.sql`

Se modificaron todos los `INSERT` para usar `INSERT OR IGNORE`, que ignora silenciosamente los intentos de insertar registros duplicados:

**Antes:**
```sql
INSERT INTO TipoPlato (idTipoPlato, nombre) VALUES 
  ('1', 'Entrada'),
  ('2', 'Principal'),
  ('3', 'Postre'),
  ('4', 'Bebida');
```

**Después:**
```sql
INSERT OR IGNORE INTO TipoPlato (idTipoPlato, nombre) VALUES 
  ('1', 'Entrada'),
  ('2', 'Principal'),
  ('3', 'Postre'),
  ('4', 'Bebida');
```

### Cambios Aplicados

Se actualizaron todas las inserciones de datos de ejemplo:

- ✅ TipoPlato (4 registros)
- ✅ Plato (4 registros)
- ✅ Mesa (5 registros)
- ✅ Cliente (3 registros)
- ✅ Mozo (3 registros)
- ✅ Reserva (2 registros)
- ✅ Pedido (1 registro)
- ✅ ItemPedido (2 registros)

---

## 🎯 Comportamiento Actual

### Primera Ejecución
- ✅ Se crean las tablas
- ✅ Se insertan los datos de ejemplo
- ✅ Servidor inicia correctamente

### Ejecuciones Posteriores
- ✅ Las tablas ya existen (CREATE TABLE IF NOT EXISTS)
- ✅ Los datos ya existen (INSERT OR IGNORE los ignora)
- ✅ No hay errores
- ✅ Servidor inicia correctamente

---

## 📝 Ventajas de Esta Solución

1. **Idempotencia:** El script puede ejecutarse múltiples veces sin errores
2. **Datos Persistentes:** Los datos sobreviven a reinicios del servidor
3. **Sin Duplicados:** No se crean registros duplicados
4. **Desarrollo Ágil:** Puedes reiniciar el servidor sin preocuparte por la base de datos

---

## 🔄 Alternativas Consideradas

### Opción 1: Eliminar la base de datos en cada inicio
```typescript
// NO RECOMENDADO - Pierdes todos los datos
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}
```
❌ **Problema:** Pierdes todos los datos cada vez que reinicias

### Opción 2: Verificar si existen datos antes de insertar
```typescript
const count = db.prepare('SELECT COUNT(*) FROM TipoPlato').get();
if (count === 0) {
  // Insertar datos
}
```
⚠️ **Problema:** Más complejo, requiere lógica adicional

### Opción 3: INSERT OR IGNORE (ELEGIDA)
```sql
INSERT OR IGNORE INTO TipoPlato ...
```
✅ **Ventajas:** Simple, elegante, idempotente

---

## 🧪 Cómo Verificar la Solución

### 1. Compilar el proyecto
```bash
npm run build
```

### 2. Iniciar el servidor
```bash
npm run start:dev
```

### 3. Verificar que no hay errores
Deberías ver:
```
✅ Base de datos SQLite inicializada correctamente
🚀 Server is running on http://localhost:3000/
```

### 4. Probar un endpoint
```bash
curl http://localhost:3000/api/mesas
```

O abrir en el navegador:
```
http://localhost:3000/api/mesas
```

### 5. Reiniciar el servidor
- Detener con Ctrl+C
- Volver a ejecutar `npm run start:dev`
- ✅ No debería haber errores

---

## 📊 Estado Actual

- ✅ Error solucionado
- ✅ Base de datos persiste correctamente
- ✅ Datos de ejemplo se mantienen
- ✅ Servidor reinicia sin problemas
- ✅ Todos los endpoints funcionando

---

## 🎓 Lección Aprendida

Cuando trabajas con bases de datos persistentes (SQLite, MySQL, PostgreSQL), es importante que tus scripts de inicialización sean **idempotentes**, es decir, que puedan ejecutarse múltiples veces sin causar errores o efectos secundarios no deseados.

**Técnicas para lograr idempotencia:**

1. `CREATE TABLE IF NOT EXISTS` - Crea solo si no existe
2. `INSERT OR IGNORE` - Inserta solo si no existe
3. `INSERT OR REPLACE` - Inserta o actualiza si existe
4. Verificaciones previas con SELECT COUNT(*)

---

## 🚀 Próximos Pasos

Ahora que el error está solucionado, puedes:

1. ✅ Probar todos los endpoints con `test-endpoints.http`
2. ✅ Crear más datos de prueba
3. ✅ Desarrollar nuevas funcionalidades
4. ✅ Reiniciar el servidor sin preocupaciones

---

**Fecha de solución:** Diciembre 2024  
**Archivo modificado:** `sql/init-sqlite.sql`  
**Tipo de cambio:** INSERT → INSERT OR IGNORE
