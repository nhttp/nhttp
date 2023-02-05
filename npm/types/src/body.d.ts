import { Handler, TBodyParser, TQueryFunc } from "./types";
type CType = "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
export declare function acceptContentType(headers: Headers, cType: CType): any;
export declare function bodyParser(opts?: TBodyParser | boolean, parseQuery?: TQueryFunc, parseMultipart?: TQueryFunc): Handler<import("./request_event").RequestEvent>;
export {};
