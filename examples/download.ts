import { NHttp } from "../mod.ts";
import { contentType } from "https://deno.land/x/media_types/mod.ts";

class DownloadResponse extends Response {
    constructor(pathFile: string, opts: ResponseInit & { baseDir?: string; filename?: string } = {}) {
        opts.baseDir = (opts.baseDir || Deno.cwd()) as string;
        opts.headers = (opts.headers || new Headers()) as Headers;
        const filename = (opts.filename || pathFile.substring(pathFile.lastIndexOf("/") + 1)) as string;
        const extension = pathFile.substring(pathFile.lastIndexOf('.') + 1);
        opts.headers.set('content-type', contentType(extension) || "application/octet-stream");
        opts.headers.set("Content-Disposition", "attachment; filename=" + filename);
        super(Deno.readFileSync(opts.baseDir + pathFile), opts);
    }
}

const app = new NHttp();

app.get("/download", async (request, respondWith) => {
    respondWith(new DownloadResponse('/public/test.css'));
});

app.listen(3000, () => {
    console.log("> Running on port 3000");
});
