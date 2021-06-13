import { NHttp, wrapMiddleware } from "../mod.ts";
import helmet from "https://esm.sh/helmet?no-check";

const app = new NHttp();

app.use(wrapMiddleware(
  helmet(),
));

app.get("/hello", ({ response }) => {
  response.send("Hello");
});

app.listen(3000);
