import nhttp from "../mod.ts";

const app = nhttp();

app.get("/", ({ response }) => {
  response.header("name", "john").send("hello, john");
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
