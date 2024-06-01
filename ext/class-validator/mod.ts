// mod.ts
import {
  validateOrReject,
  type ValidatorOptions,
} from "npm:class-validator@0.14.1";
import {
  type Handler,
  HttpError,
  type RequestEvent,
  type TRet,
} from "jsr:@nhttp/nhttp@^0.0.2";
import {
  joinHandlers,
  type TDecorator,
} from "jsr:@nhttp/nhttp@^0.0.2/controller";
export * from "npm:class-validator@0.14.1";

/**
 * `type` Class.
 */
export type Class = { new (...args: TRet[]): TRet };

/**
 * ClassValidatorOptions. options for validate using `class-validator`
 * @example
 * ```ts
 * app.post("/user", validate(User, { onError: () => {...}, plainToClass: () => {...} }), ...handlers);
 * ```
 */
export type ClassValidatorOptions = ValidatorOptions & {
  /**
   * fn paint to class.
   */
  plainToClass?: (...args: TRet) => TRet;
  /**
   * custom error.
   */
  onError?: (err: TRet, rev: RequestEvent) => TRet;
};
/**
 * validate using `class-validator`.
 * @example
 * app.post("/save", validate(UserDto), ...handlers);
 */
export function validate<
  S extends string = "body",
  T extends Class = Class,
>(
  cls: T,
  opts: ClassValidatorOptions = {},
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
      if (opts.onError) {
        return opts.onError(error, rev);
      }
      throw new HttpError(422, error);
    }
    return next();
  };
}

/**
 * validate using `class-validator` for decorators.
 * @example
 * ```ts
 * class UserController {
 *
 *    ⁤@Validate(User)
 *    ⁤@Post()
 *    save() {...}
 * }
 * ```
 */
export function Validate(
  cls: Class,
  opts: ClassValidatorOptions = {},
  target = "body",
): TDecorator {
  return (tgt: TRet, prop: string, des: PropertyDescriptor) => {
    joinHandlers(tgt.constructor.name, prop, [validate(cls, opts, target)]);
    return des;
  };
}

export default validate;
