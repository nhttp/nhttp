import { z } from "zod";
import { joinHandlers } from "./controller.js";
import {
  HttpError
} from "./deps.js";
function validate(schema, target = "body", onError) {
  return (rev, next) => {
    try {
      const tgt = rev[target];
      const res = schema.parse(tgt);
      if (typeof res === "object") {
        rev[target] = res;
      }
      return next();
    } catch (e) {
      if (onError) {
        return onError(e, rev);
      }
      throw new HttpError(422, e.errors);
    }
  };
}
function Validate(schema, target = "body", onError) {
  return (tgt, prop, des) => {
    joinHandlers(tgt.constructor.name, prop, [
      validate(schema, target, onError)
    ]);
    return des;
  };
}
var zod_validator_default = validate;
export {
  Validate,
  zod_validator_default as default,
  validate,
  z
};
