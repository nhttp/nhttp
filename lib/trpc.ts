import { fetchRequestHandler } from "https://esm.sh/@trpc/server@10.25.0/adapters/fetch";
import {
  AnyRouter,
  inferRouterContext,
} from "https://esm.sh/@trpc/server@10.25.0";
import { Handler, NextFunction, RequestEvent, TRet } from "./deps.ts";

type TAnyRouter = TRet;
interface TOpts<TRouter extends AnyRouter> {
  prefix?: string;
  router: TAnyRouter;
  createContext?: (
    rev: RequestEvent,
    next: NextFunction,
  ) => inferRouterContext<TRouter>;
  batching?: {
    enabled: boolean;
  };
  responseMeta?: TRet;
  onError?: TRet;
}
export const trpc = <TRouter extends AnyRouter>(
  opts: TOpts<TRouter>,
): Handler => {
  return async (rev, next) => {
    try {
      const ctx = opts.createContext?.(rev, next) ?? rev;
      const endpoint = opts.prefix ?? rev.__prefix ??
        rev.path.substring(0, rev.path.lastIndexOf("/")) ??
        "";
      return await fetchRequestHandler({
        endpoint,
        req: rev.request,
        router: opts.router,
        createContext: () => ctx,
        batching: opts.batching,
        responseMeta: opts.responseMeta,
        onError: opts.onError,
      });
    } catch {
      return next();
    }
  };
};

export default trpc;
