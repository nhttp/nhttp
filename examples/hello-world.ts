import { NHttp } from "../mod.ts";

const app = new NHttp();

app.get("/", () => "Hello World");

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info?.port}`);
});
