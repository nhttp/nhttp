import nhttp from "../mod.ts";

const app = nhttp();

app.get("/", () => {
  return "Hello deploy";
});

app.listen(8080);
