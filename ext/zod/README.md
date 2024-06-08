## Lib zod-validator

> this libs for [@nhttp/nhttp](https://jsr.io/@nhttp/nhttp)

## Usage

```ts
import nhttp from "@nhttp/nhttp";
import validate, { z } from "@nhttp/zod";

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

const userId = z.object({
  userId: z.number(),
});

// validate path params
app.get("/users/:userId", validate(userId, "params"), (rev) => {
  return rev.params;
});

const category = z.object({
  category: z.string(),
});

// validate query params
app.get("/posts/:postId", validate(category, "query"), (rev) => {
  return rev.query;
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
```
