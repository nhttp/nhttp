import { NHttp } from "../mod.ts";
import { contentType } from "https://deno.land/x/media_types/mod.ts";

class FileResponse extends Response {
  constructor(
    pathFile: string,
    opts: ResponseInit & { baseDir?: string } = {},
  ) {
    opts.baseDir = (opts.baseDir || Deno.cwd()) as string;
    opts.headers = (opts.headers || new Headers()) as Headers;
    const extension = pathFile.substring(pathFile.lastIndexOf(".") + 1);
    opts.headers.set(
      "content-type",
      contentType(extension) || "application/octet-stream",
    );
    super(Deno.readFileSync(opts.baseDir + pathFile), opts);
  }
}

const app = new NHttp();

app.get("/send-file", (request, respondWith) => {
  respondWith(new FileResponse("/public/test.css"));
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
