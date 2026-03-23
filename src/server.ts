import { app } from "./app.js";
import { createServer } from "http";
import { syncSchema } from "./shared/db/orm.js";
import { ORM_SYNC_SCHEMA } from "./config/config.js";
import { initSocket } from "./shared/socket/socket.js";

const PORT = Number(process.env.PORT ?? 3000);

if (ORM_SYNC_SCHEMA) {
  await syncSchema();
} else {
  console.log("ORM schema sync disabled");
}

const server = createServer(app);

await initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});
