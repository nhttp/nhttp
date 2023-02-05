import { nhttp } from "../mod.ts";

const app = nhttp();

app.get("/", () => "Hello World");

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
