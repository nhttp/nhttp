import { NHttp } from "../mod.ts";

const app = new NHttp();

app.get("/", () => {
  return "Hello deploy";
});

addEventListener("fetch", app.fetchEventHandler());
