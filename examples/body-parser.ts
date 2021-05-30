import { jsonBody, NHttp, urlencodedBody } from "../mod.ts";

const app = new NHttp();

app.use(jsonBody(), urlencodedBody());

app.post("/hello", (request, respondWith) => {
  console.log(request.parsedBody);
  respondWith(new Response("Hello"));
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
