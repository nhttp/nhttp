import { NHttp } from "../mod.ts";
import helmet from "npm:helmet";

const app = new NHttp();

app.use(helmet());

app.get("/", () => "hello with helmet");

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info?.port}`);
});
