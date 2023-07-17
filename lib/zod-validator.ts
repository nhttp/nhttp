import { z, ZodSchema } from "https://esm.sh/zod@3.21.4";
import { joinHandlers, TDecorator } from "./controller.ts";
import { Handler, HttpError, TRet } from "./deps.ts";

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
): TDecorator {
  return (tgt: TRet, prop: string, des: PropertyDescriptor) => {
    joinHandlers(tgt.constructor.name, prop, [validate(schema, target)]);
    return des;
  };
}
export { z };
export default validate;
