import { NHttp } from "../mod.ts";

const app = new NHttp();

app.get("/", ({ response }) => {
  return response.sendFile("./public/test.css");
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info?.port}`);
});
