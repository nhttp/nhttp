import { validateOrReject } from "class-validator";
import { HttpError } from "./deps.js";
import { joinHandlers } from "./controller.js";
export * from "class-validator";
function validate(cls, opts = {}) {
  return async (rev, next) => {
    try {
      let obj;
      if (opts.plainToClass) {
        obj = opts.plainToClass(cls, rev.body);
        delete opts.plainToClass;
      } else {
        obj = new cls();
        Object.assign(obj, rev.body);
      }
      await validateOrReject(obj, opts);
    } catch (error) {
      throw new HttpError(422, error);
    }
    return next();
  };
}
function Validate(cls, opts = {}) {
  return (target, prop, des) => {
    const className = target.constructor.name;
    joinHandlers(className, prop, [validate(cls, opts)]);
    return des;
  };
}
export {
  Validate,
  validate
};
