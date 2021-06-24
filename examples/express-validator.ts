import { Handler, NHttp, wrapMiddleware } from "../mod.ts";
import { body, validationResult } from "https://esm.sh/express-validator";
import { UnprocessableEntityError } from "../error.ts";

const validator: Handler[] = [
  wrapMiddleware([
    body("username").isString(),
    body("password").isLength({ min: 6 }),
    body("email").isEmail(),
  ]),
  (rev, next) => {
    const errors = validationResult(rev);
    if (!errors.isEmpty()) {
      throw new UnprocessableEntityError(errors.array());
    }
    next();
  },
];

const app = new NHttp();

app.post("/user", validator, ({ response, body }) => {
  response.send(body);
});

app.listen(3000);
