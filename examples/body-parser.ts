import { NHttp } from "../mod.ts";

const app = new NHttp();

app.post("/hello", (rev) => {
  console.log(rev.body);
  rev.respondWith(new Response("Hello"));
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
