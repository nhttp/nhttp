import { Handler } from "./deps";
type TOptions = {
    origin?: string | string[] | boolean;
    credentials?: boolean;
    allowHeaders?: string | string[];
    allowMethods?: string | string[];
    exposeHeaders?: string | string[];
    customHeaders?: Record<string, string>;
    optionsStatus?: number;
    maxAge?: number;
    preflight?: boolean;
};
export declare const cors: (opts?: TOptions) => Handler;
export default cors;
