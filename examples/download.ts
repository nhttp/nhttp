import { NHttp } from "../mod.ts";

const app = new NHttp();

app.get("/download", ({ response }) => {
  return response.download("./public/test.css");
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
