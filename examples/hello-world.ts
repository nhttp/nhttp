import { NHttp } from "../mod.ts";

const app = new NHttp();

app.get("/hello", (request, respondWith) => {
  respondWith(new Response("Hello"));
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
