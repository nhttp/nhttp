import nhttp from "../mod.ts";
import serveStatic from "../lib/serve-static.ts";

const app = nhttp();

// access static files via : http://localhost:8000/assets/myfile.txt
app.use(serveStatic("./public", { prefix: "/assets" }));

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
