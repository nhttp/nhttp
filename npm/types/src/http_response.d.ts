import { RespondWith } from "./request_event";
import { Cookie, TObject, TRet } from "./types";
export declare const JSON_TYPE_CHARSET = "application/json; charset=UTF-8";
export type ResInit = {
    headers?: TObject;
    status?: number;
};
export declare class HttpResponse {
    resp: RespondWith;
    constructor(resp: RespondWith);
    /**
     * set header or get header
     * @example
     * // set header
     * response.header("content-type", "text/css");
     * response.header({ "content-type": "text/css" });
     *
     * // get header
     * const type = response.header("content-type");
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
     * response.sendStatus(200);
     */
    sendStatus(code: number): Promise<void> | Response;
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
     * response.type("text/html");
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
