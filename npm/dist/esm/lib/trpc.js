import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
const trpc = (opts) => {
  return async (rev, next) => {
    try {
      const ctx = opts.createContext?.(rev, next) ?? rev;
      const endpoint = opts.endpoint ?? opts.prefix ?? rev.__prefix ?? rev.path.substring(0, rev.path.lastIndexOf("/")) ?? "";
      return await fetchRequestHandler({
        endpoint,
        req: rev.newRequest,
        router: opts.router,
        createContext: () => ctx,
        batching: opts.batching,
        responseMeta: opts.responseMeta,
        onError: opts.onError
      });
    } catch {
      return next();
    }
  };
};
var trpc_default = trpc;
export {
  trpc_default as default,
  trpc
};
