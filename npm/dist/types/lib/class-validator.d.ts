import { ValidatorOptions } from "class-validator";
import { Handler, TRet } from "./deps";
import { TDecorator } from "./controller";
type Class = {
    new (...args: TRet[]): TRet;
};
type TOptions = ValidatorOptions & {
    plainToClass?: (...args: TRet) => TRet;
};
export declare function validate<S extends string = "body", T extends Class = Class>(cls: T, opts?: TOptions, target?: S): Handler<{
    [k in S]: InstanceType<T>;
}>;
export declare function Validate(cls: Class, opts?: TOptions, target?: string): TDecorator;
export * from "class-validator";
export default validate;
