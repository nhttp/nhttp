import { z, ZodSchema } from "zod";
import { TDecorator } from "./controller";
import { Handler, RequestEvent, TRet } from "./deps";
/**
 * validate using `zod`.
 * @example
 * app.post("/save", validate(ZodSchema), ...handlers);
 */
export declare function validate<S extends string = "body", T extends unknown = unknown>(schema: ZodSchema<T>, target?: S, onError?: (err: TRet, rev: RequestEvent) => TRet): Handler<{
    [k in S]: T;
}>;
/**
 * validate using `zod` for decorators.
 */
export declare function Validate(schema: ZodSchema, target?: string, onError?: (err: TRet, rev: RequestEvent) => TRet): TDecorator;
export { z };
export default validate;
