import { NHttp } from "../mod.ts";

const app = new NHttp();

app.get("/download", async (request, respondWith) => {
  const pathfile = `${Deno.cwd()}/public/test.css`;
  const filename = pathfile.substring(pathfile.lastIndexOf("/") + 1);
  const headers = new Headers();
  headers.set("Content-Disposition", "attachment; filename=" + filename);
  const readFile = await Deno.readFile(pathfile);
  respondWith(new Response(readFile, { headers }));
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
