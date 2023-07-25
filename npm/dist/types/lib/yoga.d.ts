import { Handler, TRet } from "./deps";
/**
 * Yoga graphql handler.
 * @example
 * import { createSchema, createYoga } from "npm:graphql-yoga";
 *
 * const yoga = createYoga({ schema: createSchema({...}) });
 *
 * app.any("/graphql", yogaHandler(yoga));
 */
export declare const yogaHandler: (handler: (...args: TRet) => TRet) => Handler;
export default yogaHandler;
