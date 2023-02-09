export * from "class-validator";
import {
  Validate as ValidateOriginal,
  validate as validateOriginal,
  validateOrReject
} from "class-validator";
import { HttpError } from "./deps.js";
import { joinHandlers } from "./controller.js";
function validate(_class, opts = {}) {
  return async (rev, next) => {
    const obj = new _class();
    Object.assign(obj, rev.body);
    try {
      await validateOrReject(obj, opts);
    } catch (error) {
      throw new HttpError(422, error);
    }
    return next();
  };
}
function Validate(_class, opts = {}) {
  return (target, prop, des) => {
    const className = target.constructor.name;
    joinHandlers(className, prop, [validate(_class, opts)]);
    return des;
  };
}
export {
  Validate,
  ValidateOriginal,
  validate,
  validateOriginal
};
