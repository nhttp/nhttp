import { NHttp } from "../mod.ts";

const app = new NHttp();

app.get("/download", async ({ response }) => {
  response.header({
    "content-type": "text/css",
    "content-disposition": "attachment; filename=myfile.css",
  });
  return await Deno.readFile("./public/test.css");
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
