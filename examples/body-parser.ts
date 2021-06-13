import { NHttp } from "../mod.ts";

const app = new NHttp();

app.post("/hello", ({ response, body }) => {
  response.send(body);
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
