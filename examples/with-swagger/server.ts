import Application from "./Application.ts";

const app = new Application();

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
