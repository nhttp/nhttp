import { nhttp } from "../mod.ts";
import pug from "npm:pug";

const app = nhttp();

app.engine(pug.renderFile, { base: "public", ext: "pug" });

app.get("/", async ({ response }) => {
  await response.render("index", { title: "Hello, World" });
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
