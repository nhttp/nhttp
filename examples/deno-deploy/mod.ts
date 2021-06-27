import { NHttp } from "https://deno.land/x/nhttp@0.4.0/mod.ts";

const app = new NHttp();

app.get("/", ({response}) => {
    response.type("text/html").send(`
        <h1>Hello from <a href="https://deno.land/x/nhttp">NHttp</a></h1>
    `)
});

addEventListener("fetch", (event: any) => app.handleRequestEvent(event));

