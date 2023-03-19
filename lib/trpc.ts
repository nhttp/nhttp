import { fetchRequestHandler } from "npm:@trpc/server/adapters/fetch";
import { AnyRouter, inferRouterContext } from "npm:@trpc/server";
import { Handler, NextFunction, RequestEvent, TRet } from "./deps.ts";

interface TOpts<TRouter extends AnyRouter> {
  prefix?: string;
  router: TRouter;
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
export const trpc =
  <TRouter extends AnyRouter>(opts: TOpts<TRouter>): Handler =>
  async (rev, next) => {
    try {
      const ctx = opts.createContext?.(rev, next) ?? rev;
      return await fetchRequestHandler({
        endpoint: opts.prefix ?? rev.__prefix ?? "",
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

export default trpc;
