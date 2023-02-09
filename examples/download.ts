import { nhttp } from "../mod.ts";

const app = nhttp();

app.get("/", ({ response }) => {
  response.type("css").attachment();
  return Deno.readFile("./public/test.css");
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
