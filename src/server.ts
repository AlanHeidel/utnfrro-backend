import { app } from "./app.js";
import { syncSchema } from "./shared/db/orm.js";

const PORT = Number(process.env.PORT ?? 3000);

await syncSchema();

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});

