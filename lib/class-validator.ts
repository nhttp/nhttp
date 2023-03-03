import { validateOrReject, ValidatorOptions } from "npm:class-validator";
import { Handler, HttpError, TRet } from "./deps.ts";
import { joinHandlers, TDecorator } from "./controller.ts";
export * from "npm:class-validator";
type Class = TRet;
type TOptions = ValidatorOptions & {
  plainToClass?: (...args: TRet) => TRet;
};
export function validate(cls: Class, opts: TOptions = {}): Handler {
  return async (rev, next) => {
    try {
      let obj: TRet;
      if (opts.plainToClass) {
        obj = opts.plainToClass(cls, rev.body);
        delete opts.plainToClass;
      } else {
        obj = new cls();
        Object.assign(obj, rev.body);
      }
      await validateOrReject(obj, <TRet> opts);
    } catch (error) {
      throw new HttpError(422, error);
    }
    return next();
  };
}

export function Validate(
  cls: Class,
  opts: TOptions = {},
): TDecorator {
  return (target: TRet, prop: string, des: PropertyDescriptor) => {
    const className = target.constructor.name;
    joinHandlers(className, prop, [validate(cls, opts)]);
    return des;
  };
}
