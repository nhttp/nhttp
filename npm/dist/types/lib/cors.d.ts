import { Handler } from "./deps";
type TOptions = {
    origin?: string | string[] | boolean;
    credentials?: boolean;
    allowHeaders?: string | string[];
    allowMethods?: string | string[];
    customHeaders?: Record<string, string>;
    optionsStatus?: number;
};
export declare const cors: (opts?: TOptions) => Handler;
export default cors;
