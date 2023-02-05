import { nhttp } from "../mod.ts";
import njk from "npm:nunjucks";

const app = nhttp();

app.engine(njk.render, { base: "public", ext: "html" });

app.get("/", async ({ response }) => {
  await response.render("index", { title: "Hello, World" });
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
