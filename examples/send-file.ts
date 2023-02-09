import { nhttp } from "../mod.ts";

const app = nhttp();

app.get("/", ({ response }) => {
  response.type("css");
  return Deno.readFile("./public/test.css");
});

app.get("/stream", async () => {
  const stream = await Deno.open("./public/test.css");
  return stream.readable;
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
