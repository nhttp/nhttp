import { TResp } from "./request_event";
import { Cookie, TObject, TRet, TSendBody } from "./types";
export declare const JSON_TYPE_CHARSET = "application/json; charset=UTF-8";
export declare const HTML_TYPE_CHARSET = "text/html; charset=UTF-8";
export type ResInit = {
    headers?: TObject;
    status?: number;
};
export declare class HttpResponse {
    private _send;
    constructor(_send: TResp);
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
     */
    header(key: string, value: string | string[]): this;
    header(key: string): string;
    header(key: TObject): this;
    header(): Headers;
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
    getHeader(key: string): string;
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
     */
    type(contentType: string): this;
    /**
     * render `requires app.engine configs`
     * @example
     * await response.render("index.html");
     * await response.render("index.ejs", {
     *   key: "value"
     * });
     * await response.render(<h1>Hello Jsx</h1>);
     */
    render: (fileOrElem: TRet, params?: TObject, ...args: TRet) => Promise<void | Response>;
    /**
     * send response body
     * @example
     * response.send("hello");
     * response.send({ name: "john" });
     */
    send(body?: TSendBody): void;
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
    [k: string | symbol]: TRet;
}
export declare class JsonResponse extends Response {
    constructor(body: TObject | null, resInit?: ResponseInit);
}
