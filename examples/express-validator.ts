import { expressMiddleware, Handler, HttpError, NHttp } from "../mod.ts";
import { body, validationResult } from "https://esm.sh/express-validator";

const validator: Handler[] = [
  expressMiddleware([
    body("username").isString(),
    body("password").isLength({ min: 6 }),
    body("email").isEmail(),
  ]),
  (rev, next) => {
    const errors = validationResult(rev);
    if (!errors.isEmpty()) {
      throw new HttpError(422, errors.array());
    }
    return next();
  },
];

const app = new NHttp();

app.post("/user", validator, ({ response, body }) => {
  return response.send(body);
});

app.listen(3000);
