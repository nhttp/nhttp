import { ValidatorOptions } from "class-validator";
import { Handler, RequestEvent, TRet } from "./deps";
import { TDecorator } from "./controller";
export * from "class-validator";
type Class = {
    new (...args: TRet[]): TRet;
};
export type ClassValidatorOptions = ValidatorOptions & {
    plainToClass?: (...args: TRet) => TRet;
    onError?: (err: TRet, rev: RequestEvent) => TRet;
};
/**
 * validate using `class-validator`.
 * @example
 * app.post("/save", validate(UserDto), ...handlers);
 */
export declare function validate<S extends string = "body", T extends Class = Class>(cls: T, opts?: ClassValidatorOptions, target?: S): Handler<{
    [k in S]: InstanceType<T>;
}>;
/**
 * validate using `class-validator` for decorators.
 */
export declare function Validate(cls: Class, opts?: ClassValidatorOptions, target?: string): TDecorator;
export default validate;
