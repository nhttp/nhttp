import type { RequestEvent } from "./request_event";
import type { Handler, Handlers, NextFunction, RouterOrWare, TObject, TRet } from "./types";
export declare function findParams(el: TObject, url: string): any;
export type TRouter = {
    base?: string;
};
export declare const ANY_METHODS: readonly ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"];
/**
 * Router
 * @example
 * const router = new Router();
 * const router = new Router({ base: '/items' });
 */
export default class Router<Rev extends RequestEvent = RequestEvent> {
    route: TObject;
    fn: TObject;
    c_routes: TObject[];
    midds: TRet[];
    pmidds?: TRet[];
    private base;
    constructor({ base }?: TRouter);
    /**
     * add middlware or router.
     * @example
     * app.use(...middlewares);
     * app.use('/api/v1', routers);
     */
    use<T extends unknown = unknown>(prefix: string | RouterOrWare<T, Rev> | RouterOrWare<T, Rev>[], ...routerOrMiddleware: Array<RouterOrWare<T, Rev> | RouterOrWare<T, Rev>[]>): this;
    /**
     * build handlers (app or router)
     * @example
     * app.on("GET", "/", ...handlers);
     */
    on<T extends unknown = unknown>(method: string, path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * method GET (app or router)
     * @example
     * app.get("/", ...handlers);
     */
    get<T extends unknown = unknown>(path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * method POST (app or router)
     * @example
     * app.post("/", ...handlers);
     */
    post<T extends unknown = unknown>(path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * method PUT (app or router)
     * @example
     * app.put("/", ...handlers);
     */
    put<T extends unknown = unknown>(path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * method PATCH (app or router)
     * @example
     * app.patch("/", ...handlers);
     */
    patch<T extends unknown = unknown>(path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * method DELETE (app or router)
     * @example
     * app.delete("/", ...handlers);
     */
    delete<T extends unknown = unknown>(path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * method ANY (allow all method directly) (app or router)
     * @example
     * app.any("/", ...handlers);
     */
    any<T extends unknown = unknown>(path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * method HEAD (app or router)
     * @example
     * app.head("/", ...handlers);
     */
    head<T extends unknown = unknown>(path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * method OPTIONS (app or router)
     * @example
     * app.options("/", ...handlers);
     */
    options<T extends unknown = unknown>(path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * method TRACE (app or router)
     * @example
     * app.trace("/", ...handlers);
     */
    trace<T extends unknown = unknown>(path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    /**
     * method CONNECT (app or router)
     * @example
     * app.connect("/", ...handlers);
     */
    connect<T extends unknown = unknown>(path: string | RegExp, ...handlers: Handlers<T, Rev>): this;
    find(method: string, path: string, setParam: (obj: TObject) => void, notFound: (rev: Rev, next: NextFunction) => TRet): Handler<Rev>[];
}
