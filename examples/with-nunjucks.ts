import nhttp from "../mod.ts";
import njk from "npm:nunjucks";

const app = nhttp();

app.engine(njk.render, { base: "public", ext: "html" });

app.get("/", ({ response }) => {
  return response.render("index", { title: "Hello, Nunjucks" });
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
