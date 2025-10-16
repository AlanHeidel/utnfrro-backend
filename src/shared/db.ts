import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta a la base de datos
const dbPath = join(__dirname, "../../database.sqlite");

// Crear conexión a la base de datos
export const db = new Database(dbPath, { verbose: console.log });

// Habilitar foreign keys
db.pragma("foreign_keys = ON");

// Función para inicializar la base de datos
export function initializeDatabase() {
  try {
    // Leer el archivo SQL de inicialización
    const sqlPath = join(__dirname, "../../sql/init-sqlite.sql");
    const sql = readFileSync(sqlPath, "utf-8");

    // Ejecutar el script SQL
    db.exec(sql);

    console.log("✅ Base de datos inicializada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    throw error;
  }
}

// Función para cerrar la conexión
export function closeDatabase() {
  db.close();
  console.log("🔒 Conexión a la base de datos cerrada");
}

// Manejar el cierre de la aplicación
process.on("exit", () => closeDatabase());
process.on("SIGINT", () => {
  closeDatabase();
  process.exit(0);
});
process.on("SIGTERM", () => {
  closeDatabase();
  process.exit(0);
});
