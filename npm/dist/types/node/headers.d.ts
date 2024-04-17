import { s_inspect } from "./symbol";
import type { TRet } from "../index";
export declare class NodeHeaders {
    headers: Headers;
    constructor(headers: Headers);
    [s_inspect](depth: number, opts: TRet, inspect: TRet): string;
}
