import { NHttp } from "../mod.ts";
import helmet from "npm:helmet";

const app = new NHttp();

app.use(helmet());

app.get("/hello", () => "hello with helmet");

app.listen(3000);
