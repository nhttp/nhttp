import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
const trpc = (opts) => async (rev, next) => {
  try {
    const ctx = opts.createContext?.(rev, next) ?? rev;
    return await fetchRequestHandler({
      endpoint: opts.prefix ?? rev.__prefix ?? "",
      req: rev.request,
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
var trpc_default = trpc;
export {
  trpc_default as default,
  trpc
};
