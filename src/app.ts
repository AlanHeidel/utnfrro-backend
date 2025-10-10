import express from "express";
import { initializeDatabase } from "./shared/db.js";
import { platoRouter } from "./plato/platoRoutes.js";
import { mesaRouter } from "./mesa/mesaRoutes.js";
import { clienteRouter } from "./cliente/clienteRoutes.js";
import { mozoRouter } from "./mozo/mozoRoutes.js";
import { reservaRouter } from "./reserva/reservaRoutes.js";
import { pedidoRouter } from "./pedido/pedidoRoutes.js";

const app = express();

// Inicializar la base de datos SQLite
try {
  initializeDatabase();
  console.log("✅ Base de datos SQLite inicializada correctamente");
} catch (error) {
  console.error("❌ Error al inicializar la base de datos:", error);
  process.exit(1);
}

app.use(express.json());

// Rutas
app.use("/api/platos", platoRouter);
app.use("/api/mesas", mesaRouter);
app.use("/api/clientes", clienteRouter);
app.use("/api/mozos", mozoRouter);
app.use("/api/reservas", reservaRouter);
app.use("/api/pedidos", pedidoRouter);

// Manejo de rutas no encontradas
app.use((_, res) => {
  res.status(404).send({ message: "Endpoint not found" });
});

app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000/");
  console.log("📊 Database: SQLite (database.sqlite)");
});
