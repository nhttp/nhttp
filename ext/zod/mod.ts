// mod.ts
import { z, type ZodSchema } from "npm:zod@3.23.8";
import {
  joinHandlers,
  type TDecorator,
} from "jsr:@nhttp/nhttp@^0.0.2/controller";
import {
  type Handler,
  HttpError,
  type RequestEvent,
  type TRet,
} from "jsr:@nhttp/nhttp@^0.0.2";

/**
 * validate using `zod`.
 * @example
 * app.post("/save", validate(ZodSchema), ...handlers);
 */
export function validate<
  S extends string = "body",
  T extends unknown = unknown,
>(
  schema: ZodSchema<T>,
  target = <S> "body",
  onError?: (err: TRet, rev: RequestEvent) => TRet,
): Handler<{ [k in S]: T }> {
  return (rev, next) => {
    try {
      const tgt = rev[target];
      const res = schema.parse(tgt);
      if (typeof res === "object") {
        (<TRet> rev)[target] = res;
      }
      return next();
    } catch (e) {
      if (onError) {
        return onError(e, rev as RequestEvent);
      }
      throw new HttpError(422, e.errors);
    }
  };
}
/**
 * validate using `zod` for decorators.
 * @example
 * ```ts
 * class UserController {
 *
 *    ⁤@Validate(UserSchema)
 *    ⁤@Post()
 *    save() {...}
 * }
 * ```
 */
export function Validate(
  schema: ZodSchema,
  target = "body",
  onError?: (err: TRet, rev: RequestEvent) => TRet,
): TDecorator {
  return (tgt: TRet, prop: string, des: PropertyDescriptor) => {
    joinHandlers(tgt.constructor.name, prop, [
      validate(schema, target, onError),
    ]);
    return des;
  };
}
export { z };
export default validate;
