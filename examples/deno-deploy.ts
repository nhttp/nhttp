import { NHttp } from "https://deno.land/x/nhttp@0.7.0/mod.ts";

const app = new NHttp();

app.get("/", ({ response }) => {
    response.send("Hello deploy")
});

addEventListener("fetch", app.fetchEventHandler());
