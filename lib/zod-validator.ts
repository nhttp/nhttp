import type { ZodType } from "npm:zod@3.25.74/v4";
import { joinHandlers, type TDecorator } from "./controller.ts";
import {
  type Handler,
  HttpError,
  type RequestEvent,
  type TRet,
} from "./deps.ts";

/**
 * validate using `zod`.
 * @example
 * app.post("/save", validate(ZodSchema), ...handlers);
 */
export function validate<
  S extends string = "body",
  T extends unknown = unknown,
>(
  type: ZodType<T>,
  target = <S> "body",
  onError?: (err: TRet, rev: RequestEvent) => TRet,
): Handler<{ [k in S]: T }> {
  return (rev, next) => {
    try {
      const tgt = rev[target];
      const res = type.parse(tgt);
      if (typeof res === "object") {
        (<TRet> rev)[target] = res;
      }
      return next();
    } catch (e: TRet) {
      if (onError) {
        return onError(e, rev as RequestEvent);
      }
      throw new HttpError(422, e.issues);
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
  type: ZodType,
  target = "body",
  onError?: (err: TRet, rev: RequestEvent) => TRet,
): TDecorator {
  return (tgt: TRet, prop: string, des: PropertyDescriptor) => {
    joinHandlers(tgt.constructor.name, prop, [
      validate(type, target, onError),
    ]);
    return des;
  };
}
export * from "npm:zod@3.25.74/v4";
export default validate;
