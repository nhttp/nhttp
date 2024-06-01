// yoga.ts
/**
 * @module
 *
 * This module contains yogaHandler for NHttp.
 *
 * @example
 * ```ts
 * import nhttp from "@nhttp/nhttp";
 * import { createSchema, createYoga } from "npm:graphql-yoga";
 *
 * const app = nhttp();
 *
 * const yoga = createYoga({ schema: createSchema({...}) });
 *
 * app.any("/graphql", yogaHandler(yoga));
 *
 * app.listen(8000);
 * ```
 */
import type { Handler, TRet } from "./deps.ts";

/**
 * Yoga graphql handler.
 * @example
 * import { createSchema, createYoga } from "npm:graphql-yoga";
 *
 * const yoga = createYoga({ schema: createSchema({...}) });
 *
 * app.any("/graphql", yogaHandler(yoga));
 */
export const yogaHandler =
  (handler: (...args: TRet) => TRet): Handler => async (rev) => {
    const resp = await handler(rev.newRequest, rev);
    if ((rev.request as TRet).raw === void 0) return resp;
    return new Response(resp.body, resp);
  };

export default yogaHandler;
