import Application from "./Application.ts";

const app = new Application();

await app.listen(3000, () => {
  console.log("> Running on port 3000");
});
