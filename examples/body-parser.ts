import { NHttp } from "../mod.ts";

const app = new NHttp();

app.post("/", ({ body }) => {
  return body;
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info?.port}`);
});
