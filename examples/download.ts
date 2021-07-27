import { NHttp } from "../mod.ts";
import { contentType } from "https://deno.land/x/media_types@v2.7.1/mod.ts";

const app = new NHttp();

app.get("/download", ({ response }) => {
  const pathfile = Deno.cwd() + "/public/test.css";
  const filename = pathfile.substring(pathfile.lastIndexOf("/") + 1);
  const extension = pathfile.substring(pathfile.lastIndexOf(".") + 1);
  response.header({
    "content-type": contentType(extension) || "application/octet-stream",
    "content-disposition": "attachment; filename=" + filename,
  });
  return Deno.readFile(pathfile);
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
