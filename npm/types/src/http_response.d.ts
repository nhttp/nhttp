import { TResp } from "./request_event";
import { Cookie, TObject, TRet } from "./types";
export declare const JSON_TYPE_CHARSET = "application/json; charset=UTF-8";
export type ResInit = {
    headers?: TObject;
    status?: number;
};
export declare class HttpResponse {
    resp: TResp;
    request: Request;
    constructor(resp: TResp, request: Request);
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
     * response.headers.delete("content-type");
     *
     * // append header
     * response.headers.append("key", "other-value");
     */
    header(key: string, value: string | string[]): this;
    header(key: string): string;
    header(key: TObject): this;
    header(): Headers;
    /**
     * headers instanceof Headers
     * @example
     * // delete
     * response.headers.delete("key");
     *
     * // append
     * response.headers.append("key", "val");
     */
    get headers(): Headers;
    set headers(val: Headers);
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
     * return response.sendStatus(500);
     */
    sendStatus(code: number): Promise<void> | Response;
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
     * sendFile
     * @example
     * return response.sendFile("folder/file.txt");
     * return response.sendFile("folder/file.txt", { etag: false });
     */
    sendFile(pathFile: string, opts?: {
        etag?: boolean;
        readFile?: (pathFile: string) => TRet;
        stat?: (pathFile: string) => TRet;
    }): Promise<void | Response>;
    /**
     * download
     * @example
     * return response.download("folder/file.txt");
     * return response.download("folder/file.txt", "filename.txt", { etag: false });
     */
    download(pathFile: string, filename?: string, opts?: {
        etag?: boolean;
        readFile?: (pathFile: string) => TRet;
        stat?: (pathFile: string) => TRet;
    }): Promise<void | Response>;
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
     * shorthand for content-type headers
     * @example
     * return response.type("html").send("<h1>hello, world</h1>");
     */
    type(contentType: string): this;
    /**
     * send response body
     * @example
     * return response.send("hello");
     */
    send(body?: BodyInit | TObject | null): Promise<void> | Response;
    /**
     * shorthand for send json body
     * @example
     * return response.json({ name: "john" });
     */
    json(body: TObject | null): Promise<void> | Response;
    /**
     * redirect url
     * @example
     * return response.redirect("/home");
     * return response.redirect("/home", 301);
     * return response.redirect("http://google.com");
     */
    redirect(url: string, status?: number): Promise<void> | Response;
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
    [k: string]: TRet;
}
export declare class JsonResponse extends Response {
    constructor(body: TObject | null, resInit?: ResponseInit);
}
