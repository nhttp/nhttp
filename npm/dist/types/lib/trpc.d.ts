import { AnyRouter, inferRouterContext } from "@trpc/server";
import { Handler, NextFunction, RequestEvent, TRet } from "./deps";
type TAnyRouter = TRet;
interface TOpts<TRouter extends AnyRouter> {
    prefix?: string;
    router: TAnyRouter;
    createContext?: (rev: RequestEvent, next: NextFunction) => inferRouterContext<TRouter>;
    batching?: {
        enabled: boolean;
    };
    responseMeta?: TRet;
    onError?: TRet;
}
export declare const trpc: <TRouter extends AnyRouter>(opts: TOpts<TRouter>) => Handler;
export default trpc;
