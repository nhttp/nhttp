import nhttp from "../mod.ts";

const app = nhttp();

app.get("/", () => "Hello deploy");

app.listen(8080);
