import express from "express";
import { platoRouter } from "./plato/platoRoutes.js";

const app = express();

app.use(express.json());
app.use("/api/platos", platoRouter);
app.use((_, res) => {
  res.status(404).send("Endpoint not found");
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000/");
});
