import nhttp from "../mod.ts";
import cors from "../lib/cors.ts";

const app = nhttp();

app.use(cors());

app.get("/", () => "Hello Cors");

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
