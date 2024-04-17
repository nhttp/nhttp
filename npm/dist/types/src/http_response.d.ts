import { deno_inspect, node_inspect } from "./inspect";
import type { Cookie, TObject, TRet, TSendBody } from "./types";
export type ResInit = {
    headers?: TRet;
    status?: number;
    statusText?: string;
};
export declare const headerToArr: (obj?: TObject) => string[][];
type RetHeaders = {
    append: (key: string, value: string) => HttpResponse;
    delete: (key: string) => void;
    toJSON: () => TObject;
};
export interface HttpResponse extends NHTTP.HttpResponse {
    /**
     * render `requires app.engine configs`
     * @example
     * await response.render("index", {
     *   key: "value"
     * });
     * await response.render(<h1>Hello Jsx</h1>);
     */
    render: (fileOrElem: TRet, params?: TObject, ...args: TRet) => Promise<void>;
}
export declare class HttpResponse {
    /**
     * send response body
     * @example
     * response.send("hello");
     * response.send({ name: "john" });
     */
    send: (body?: TSendBody) => void;
    init: ResInit;
    constructor(
    /**
     * send response body
     * @example
     * response.send("hello");
     * response.send({ name: "john" });
     */
    send: (body?: TSendBody) => void, init: ResInit);
    /**
     * setHeader
     * @example
     * response.setHeader("key", "value");
     */
    setHeader(key: string, value: string | string[]): this;
    /**
     * getHeader
     * @example
     * const str = response.getHeader("key");
     */
    getHeader(key: string): string | string[] | undefined;
    /**
     * set header or get header
     * @example
     * // set header
     * response.header("content-type", "text/css");
     * response.header({ "content-type": "text/css" });
     *
     * // get header
     * const type = response.header("content-type");
     *
     * // delete header
     * response.header().delete("content-type");
     *
     * // append header
     * response.header().append("key", "other-value");
     *
     * // get all header
     * const headers = response.header().toJSON();
     */
    header(key: string, value: string | string[]): this;
    header(key: string): string | string[] | undefined;
    header(key: TObject): this;
    header(): RetHeaders;
    /**
     * set status or get status
     * @example
     * // set status
     * response.status(200);
     *
     * // get status
     * const status = response.status();
     */
    status(code: number): this;
    status(): number;
    /**
     * sendStatus
     * @example
     * response.sendStatus(204);
     */
    sendStatus(code: number): void;
    /**
     * attachment. create header content-disposition
     * @example
     * response.attachment("my_file.txt");
     * // or
     * response.attachment();
     */
    attachment(filename?: string): this;
    /**
     * set/get statusCode
     * @example
     * // set status
     * response.statusCode = 200;
     *
     * // get status
     * const status = response.statusCode;
     */
    get statusCode(): number;
    set statusCode(val: number);
    /**
     * params as json object for `response.render`.
     * @example
     * app.get("/", async ({ response } ) => {
     *   response.params = { title: "Home" };
     *   await response.render("index");
     * });
     */
    get params(): TObject;
    set params(val: TObject);
    /**
     * shorthand for content-type headers
     * @example
     * response.type("html").send("<h1>hello, world</h1>");
     *
     * // with charset
     * response.type("html", "utf-8").send("<h1>hello, world</h1>");
     */
    type(contentType: string, charset?: string): this;
    /**
     * shorthand for send html body
     * @example
     * response.html("<h1>Hello World</h1>");
     */
    html(html: string | Uint8Array): void;
    /**
     * shorthand for send json body
     * @example
     * response.json({ name: "john" });
     */
    json(body: TObject): void;
    /**
     * redirect url
     * @example
     * response.redirect("/home");
     * response.redirect("/home", 301);
     * response.redirect("http://google.com");
     */
    redirect(url: string, status?: number): void;
    /**
     * add headers. send multiple headers to response.
     * @example
     * response.addHeader("name", "john");
     * response.addHeader("name", "doe");
     */
    addHeader(key: string, value: string | string[]): this;
    /**
     * cookie
     * @example
     * response.cookie("key", "value" , {
     *    httpOnly: true
     * });
     */
    cookie(name: string, value: string | string[] | number | number[] | TObject | undefined, opts?: Cookie): this;
    /**
     * clear cookie
     * @example
     * response.clearCookie("name");
     */
    clearCookie(name: string, opts?: Cookie): void;
    [deno_inspect](inspect: TRet, opts: TRet): string;
    [node_inspect](depth: number, opts: TRet, inspect: TRet): string;
    [k: string | symbol]: TRet;
}
export declare function oldSchool(): void;
export declare class JsonResponse extends Response {
    constructor(body: unknown, init?: ResponseInit);
}
export {};
