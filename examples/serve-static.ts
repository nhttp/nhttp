import { NHttp } from "../mod.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.4/mod.ts";

const app = new NHttp();

app.use("/assets", staticFiles("public"));

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
