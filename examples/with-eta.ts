import nhttp from "../mod.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v2.0.1/mod.ts";

const app = nhttp();
const viewPath = `${Deno.cwd()}/public/`;
configure({ views: viewPath });
app.engine(renderFile, { ext: "eta" });

app.get("/", ({ response }) => {
  return response.render("index", { title: "Hello, Eta" });
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
