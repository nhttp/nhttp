## Lib jwt

> this libs for [@nhttp/nhttp](https://jsr.io/@nhttp/nhttp)

## Usage

```tsx
import nhttp from "@nhttp/nhttp";
import jwt from "@nhttp/jwt";

const app = nhttp();

app.post("/sign", (rev) => {
  // example payload.
  const payload = {
    iat: Math.round(Date.now() / 1000),
    // expires 1 hours
    exp: Math.round(Date.now() / 1000 + (1 * 60 * 60)),
    user: rev.body.username,
  };
  return { token: jwt.encode(payload, JWT_SECRET) };
});

const jwtAuth = () => {
  return jwt({
    secret: JWT_SECRET,
    onAuth: (rev, next) => {
      if (rev.auth.user) return next();
      throw new HttpError(401);
    },
  });
};

app.get("/admin/home", jwtAuth(), (rev) => {
  return `Welcome ${rev.auth.user}`;
});
```
