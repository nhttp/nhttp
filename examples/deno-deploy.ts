import { NHttp, fetchEventHandler } from "https://deno.land/x/nhttp@0.6.0/mod.ts";

const app = new NHttp();

app.get("/", ({ response }) => {
    response.type("text/html").send(`
        <h1>Hello from <a href="https://deno.land/x/nhttp">NHttp</a></h1>
    `)
});

addEventListener("fetch", fetchEventHandler(app));
