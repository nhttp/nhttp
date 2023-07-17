import { ValidatorOptions } from "class-validator";
import { Handler, TRet } from "./deps";
import { TDecorator } from "./controller";
export * from "class-validator";
type Class = {
    new (...args: TRet[]): TRet;
};
type TOptions = ValidatorOptions & {
    plainToClass?: (...args: TRet) => TRet;
};
/**
 * validate using `class-validator`.
 * @example
 * app.post("/save", validate(UserDto), ...handlers);
 */
export declare function validate<S extends string = "body", T extends Class = Class>(cls: T, opts?: TOptions, target?: S): Handler<{
    [k in S]: InstanceType<T>;
}>;
/**
 * validate using `class-validator` for decorators.
 */
export declare function Validate(cls: Class, opts?: TOptions, target?: string): TDecorator;
export default validate;
