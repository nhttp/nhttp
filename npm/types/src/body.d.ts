import { Handler, TBodyParser, TQueryFunc } from "./types";
export declare function bodyParser(opts?: TBodyParser | boolean, parseQuery?: TQueryFunc, parseMultipart?: TQueryFunc): Handler<import("./request_event").RequestEvent>;
