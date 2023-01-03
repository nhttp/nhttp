import { RequestEvent } from "./request_event";
import { Handler, Handlers, RouterOrWare, TObject } from "./types";
export declare function concatRegexp(prefix: string | RegExp, path: RegExp): RegExp;
export declare function findParams(el: TObject, url: string): any;
export declare function base(url: string): string;
type TRouter = {
    base?: string;
};
/**
 * Router
 * @example
 * const router = new Router();
 * const router = new Router({ base: '/items' });
 */
export default class Router<Rev extends RequestEvent = RequestEvent> {
    route: TObject;
    c_routes: TObject[];
    midds: Handler<Rev>[];
    pmidds: TObject | undefined;
    private base;
    constructor({ base }?: TRouter);
    /**
     * add middlware or router.
     * @example
     * app.use(...middlewares);
     * app.use('/api/v1', routers);
     */
    use<T>(prefix: string | RouterOrWare<Rev & T> | RouterOrWare<Rev & T>[], ...routerOrMiddleware: Array<RouterOrWare<Rev & T> | RouterOrWare<Rev & T>[]>): this;
    /**
     * build handlers (app or router)
     * @example
     * app.on("GET", "/", ...handlers);
     */
    on<T>(method: string, path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * method GET (app or router)
     * @example
     * app.get("/", ...handlers);
     */
    get<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * method POST (app or router)
     * @example
     * app.post("/", ...handlers);
     */
    post<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * method PUT (app or router)
     * @example
     * app.put("/", ...handlers);
     */
    put<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * method PATCH (app or router)
     * @example
     * app.patch("/", ...handlers);
     */
    patch<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * method DELETE (app or router)
     * @example
     * app.delete("/", ...handlers);
     */
    delete<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * method ANY (allow all method directly) (app or router)
     * @example
     * app.any("/", ...handlers);
     */
    any<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * method HEAD (app or router)
     * @example
     * app.head("/", ...handlers);
     */
    head<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * method OPTIONS (app or router)
     * @example
     * app.options("/", ...handlers);
     */
    options<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * method TRACE (app or router)
     * @example
     * app.trace("/", ...handlers);
     */
    trace<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    /**
     * method CONNECT (app or router)
     * @example
     * app.connect("/", ...handlers);
     */
    connect<T>(path: string | RegExp, ...handlers: Handlers<Rev & T>): this;
    private extractAsset;
    find(method: string, path: string, getPath: (path: string) => string, fn404: Handler<Rev>, setParam: (p: () => TObject) => void, mutate?: () => undefined | string): Handler<Rev>[];
}
export {};
