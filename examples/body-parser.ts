import { nhttp } from "../mod.ts";

const app = nhttp({ bodyParser: true });

app.post("/", (rev) => {
  return rev.body;
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
