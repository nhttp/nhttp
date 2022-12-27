import Application from "./Application.ts";

const app = new Application();

await app.listen(8000, () => {
  console.log("> Running on port 8000");
});
