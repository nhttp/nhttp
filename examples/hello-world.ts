import { NHttp } from "../mod.ts";

const app = new NHttp();

app.get("/hello", () => "Hello World");

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
