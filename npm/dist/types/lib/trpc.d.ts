import { AnyRouter, inferRouterContext } from "@trpc/server";
import { Handler, NextFunction, RequestEvent, TRet } from "./deps";
type TAnyRouter = TRet;
export interface TrpcOptions<TRouter extends AnyRouter> {
    /**
     * @deprecated
     * Use `endpoint` instead.
     */
    prefix?: string;
    endpoint?: string;
    router: TAnyRouter;
    createContext?: (rev: RequestEvent, next: NextFunction) => inferRouterContext<TRouter>;
    batching?: {
        enabled: boolean;
    };
    responseMeta?: TRet;
    onError?: TRet;
}
/**
 * tRPC middleware.
 * @example
 * app.use(trpc({ router: appRouter, endpoint: "/trpc" }));
 */
export declare const trpc: <TRouter extends AnyRouter>(opts: TrpcOptions<TRouter>) => Handler;
export default trpc;
