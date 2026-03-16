import { app } from "./app.js";
import { syncSchema } from "./shared/db/orm.js";
import { ORM_SYNC_SCHEMA } from "./config/config.js";

const PORT = Number(process.env.PORT ?? 3000);

if (ORM_SYNC_SCHEMA) {
  await syncSchema();
} else {
  console.log("ORM schema sync disabled");
}

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});
