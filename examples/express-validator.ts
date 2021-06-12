import { Handler, NHttp, UnprocessableEntityError } from "../mod.ts";
import { body, validationResult } from "https://esm.sh/express-validator";

function withExpressValidator(arr: any[]): Handler {
  return (rev, next) => {
    let i = 0, len = arr.length;
    while (i < len) arr[i++](rev, void 0, next);
  };
}

const validator: Handler[] = [
  withExpressValidator([
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
