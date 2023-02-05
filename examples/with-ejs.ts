import { nhttp } from "../mod.ts";
import ejs from "npm:ejs";

const app = nhttp();

app.engine(ejs.renderFile, { base: "public", ext: "ejs" });

app.get("/", async ({ response }) => {
  await response.render("index", { title: "Hello, World" });
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
