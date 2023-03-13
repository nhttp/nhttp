import nhttp from "../mod.ts";
import serveStatic from "../lib/serve-static.ts";

const app = nhttp();

app.use("/assets", serveStatic("public"));

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
