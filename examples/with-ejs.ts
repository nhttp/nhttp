import nhttp from "../mod.ts";
import ejs from "npm:ejs";

const app = nhttp();

app.engine(ejs.renderFile, { base: "public", ext: "ejs" });

app.get("/", ({ response }) => {
  return response.render("index", { title: "Hello, Ejs" });
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
