import { NHttp, wrapMiddleware } from "../mod.ts";
import cors from "https://esm.sh/cors?no-check";

const app = new NHttp();

app.use(wrapMiddleware(
  cors(),
));

app.get("/hello", ({ response }) => {
  return response.send("Hello");
});

app.listen(3000);
