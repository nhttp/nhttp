export * from "class-validator";
import { Validate as ValidateOriginal, validate as validateOriginal, ValidatorOptions } from "class-validator";
import { Handler, TRet } from "./deps";
import { TDecorator } from "./controller";
export { ValidateOriginal, validateOriginal };
type Class = TRet;
export declare function validate(_class: Class, opts?: ValidatorOptions): Handler;
export declare function Validate(_class: Class, opts?: ValidatorOptions): TDecorator;
