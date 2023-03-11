import { ValidatorOptions } from "class-validator";
import { Handler, TRet } from "./deps";
import { TDecorator } from "./controller";
export * from "class-validator";
type Class = TRet;
type TOptions = ValidatorOptions & {
    plainToClass?: (...args: TRet) => TRet;
};
export declare function validate(cls: Class, opts?: TOptions): Handler;
export declare function Validate(cls: Class, opts?: TOptions): TDecorator;
