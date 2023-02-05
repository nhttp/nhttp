import { nhttp } from "../mod.ts";

const app = nhttp();

app.use(({ request, response }, next) => {
  // example header
  response.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  });
  if (request.method == "OPTIONS") {
    return response.sendStatus(204);
  }
  return next();
});

app.get("/", () => "Hello Cors");

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
