import { Handler, TBodyParser, TQueryFunc } from "./types";
export declare const isTypeBody: (a: string, b: string) => boolean;
export declare function bodyParser(opts?: TBodyParser | boolean, parseQuery?: TQueryFunc): Handler;
