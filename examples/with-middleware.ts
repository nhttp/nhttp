import nhttp from "../mod.ts";

const app = nhttp();

app.use((rev, next) => {
  rev.user = "John";
  return next();
});

app.get("/", ({ user }) => user);

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
