import nhttp, { Handler, HttpError } from "../mod.ts";
import validate, { z } from "../lib/zod-validator.ts";
import jwt from "../lib/jwt.ts";

const JWT_SECRET = "myjwtsecret";
const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const handleAuth: Handler = (rev, next) => {
  if (rev.auth.user === "john") return next();
  throw new HttpError(401);
};

const app = nhttp();

app.post("/login", validate(LoginSchema), (rev) => {
  // example payload.
  const payload = {
    iat: Math.round(Date.now() / 1000),
    // expires 1 hours
    exp: Math.round(Date.now() / 1000 + (1 * 60 * 60)),
    user: rev.body.username,
  };
  return { token: jwt.encode(payload, JWT_SECRET) };
});

app.get("/admin/home", jwt(JWT_SECRET, handleAuth), (rev) => {
  return `Welcome ${rev.auth.user}`;
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
