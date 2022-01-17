import { NHttp } from "../mod.ts";

const app = new NHttp();

app.get("/send-file", async ({ response }) => {
  response.type("text/css");
  return await Deno.readFile("./public/test.css");
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
