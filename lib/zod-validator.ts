import { z, type ZodSchema } from "https://esm.sh/v132/zod@3.21.4";
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
