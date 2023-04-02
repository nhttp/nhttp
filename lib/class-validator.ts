import { validateOrReject, ValidatorOptions } from "npm:class-validator";
import { Handler, HttpError, TRet } from "./deps.ts";
import { joinHandlers, TDecorator } from "./controller.ts";

type Class = { new (...args: TRet[]): TRet };

type TOptions = ValidatorOptions & {
  plainToClass?: (...args: TRet) => TRet;
};
export function validate<
  S extends string = "body",
  T extends Class = Class,
>(
  cls: T,
  opts: TOptions = {},
  target = <S> "body",
): Handler<{ [k in S]: InstanceType<T> }> {
  return async (rev, next) => {
    try {
      let obj;
      if (opts.plainToClass) {
        obj = opts.plainToClass(cls, rev[target]);
        delete opts.plainToClass;
      } else {
        obj = new cls();
        Object.assign(obj, rev[target]);
      }
      await validateOrReject(obj, opts);
    } catch (error) {
      throw new HttpError(422, error);
    }
    return next();
  };
}

export function Validate(
  cls: Class,
  opts: TOptions = {},
  target = "body",
): TDecorator {
  return (tgt: TRet, prop: string, des: PropertyDescriptor) => {
    joinHandlers(tgt.constructor.name, prop, [validate(cls, opts, target)]);
    return des;
  };
}
export * from "npm:class-validator";
export default validate;
