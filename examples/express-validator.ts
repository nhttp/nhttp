import nhttp, { HttpError } from "../mod.ts";
import { body, validationResult } from "npm:express-validator";

const app = nhttp({ bodyParser: true });

app.post(
  "/",
  body("username").isString(),
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

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
