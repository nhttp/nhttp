import { NHttp } from "../mod.ts";

const app = new NHttp();

app.get("/send-file", async (request, respondWith) => {
  const pathfile = `${Deno.cwd()}/public/test.css`;
  const headers = new Headers();
  headers.set("Content-Type", "text/css");
  const readFile = await Deno.readFile(pathfile);
  respondWith(new Response(readFile, { headers }));
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
