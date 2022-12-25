import { HttpError, NHttp } from "../mod.ts";
import { body, validationResult } from "npm:express-validator";

const app = new NHttp();

app.post(
  "/",
  body("username").isString(),
  body("username2").isString(),
  body("username3").isString(),
  body("username4").isString(),
  body("username5").isString(),
  body("username6").isString(),
  body("username7").isString(),
  body("username8").isString(),
  body("username12").isString(),
  body("username123").isString(),
  body("username23").isString(),
  body("username34").isString(),
  body("username45").isString(),
  body("password").isLength({ min: 6 }),
  body("email").isEmail(),
  function (rev) {
    const errors = validationResult(rev);
    if (!errors.isEmpty()) {
      throw new HttpError(422, errors.array());
    }
    return rev.body;
  },
);

app.listen(3000);
