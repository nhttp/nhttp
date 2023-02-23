import { ValidatorOptions } from "class-validator";
import { Handler, TRet } from "./deps";
import { TDecorator } from "./controller";
export * from "class-validator";
type Class = TRet;
export declare function validate(_class: Class, opts?: ValidatorOptions): Handler;
export declare function Validate(_class: Class, opts?: ValidatorOptions): TDecorator;
