import { validateOrReject, ValidatorOptions } from "npm:class-validator";
import { Handler, HttpError, TRet } from "./deps.ts";
import { joinHandlers, TDecorator } from "./controller.ts";
export * from "npm:class-validator";
type Class = TRet;

export function validate(_class: Class, opts: ValidatorOptions = {}): Handler {
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

export function Validate(
  _class: Class,
  opts: ValidatorOptions = {},
): TDecorator {
  return (target: TRet, prop: string, des: PropertyDescriptor) => {
    const className = target.constructor.name;
    joinHandlers(className, prop, [validate(_class, opts)]);
    return des;
  };
}
