import { Handler, TRet } from "./deps.ts";

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
