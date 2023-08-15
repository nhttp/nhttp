import type { Handler, RequestEvent } from "./deps";
type TOptions = {
    origin?: string | string[] | boolean | ((rev: RequestEvent) => Promise<boolean | string> | boolean | string);
    credentials?: boolean;
    allowHeaders?: string | string[];
    allowMethods?: string | string[];
    exposeHeaders?: string | string[];
    customHeaders?: Record<string, string>;
    optionsStatus?: number;
    maxAge?: number;
    /**
     * @deprecated use `preflightNext` instead
     */
    preflight?: boolean;
    preflightNext?: boolean;
};
/**
 * Cors middleware.
 * @example
 * app.use(cors());
 */
export declare const cors: (opts?: TOptions) => Handler;
export default cors;
