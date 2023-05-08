import nhttp from "../mod.ts";
import pug from "npm:pug";

const app = nhttp();

app.engine(pug.renderFile, { base: "public", ext: "pug" });

app.get("/", ({ response }) => {
  return response.render("index", { title: "Hello, Pug" });
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
