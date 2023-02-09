import { nhttp } from "../mod.ts";
import { etag } from "../lib/etag.ts";

const app = nhttp();

app.use(etag());

app.get("/", () => "Hello With Etag");

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
