import { NHttp } from "../mod.ts";

const app = new NHttp();

app.use(({ response, request }, next) => {
  // example header
  response.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  });
  if (request.method === "OPTIONS") {
    return response.send();
  }
  return next();
});

app.get("/hello", ({ response }) => {
  return response.send("Hello");
});

app.listen(3000);
