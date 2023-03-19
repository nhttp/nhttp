import nhttp from "../mod.ts";
import validate, { z } from "../lib/zod-validator.ts";

const User = z.object({
  username: z.string(),
  password: z.string(),
  user_info: z.object({
    name: z.string(),
    address: z.string(),
  }),
});

const app = nhttp();

// validate support all content-type (json, multipart, raw, urlencoded)
app.post("/", validate(User), (rev) => {
  return rev.body.user_info;
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
