import logger from "../lib/logger.ts";
import nhttp from "../mod.ts";

const app = nhttp();

app.use(logger());

app.get("/", (rev) => {
  rev.log("hello log from home");
  return "home";
});

// try this
app.get("/noop", (rev) => {
  rev.noop();
  return "noop";
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
