import { type Cookie, type Handler, type RequestEvent, type TRet } from "./deps";
declare global {
    namespace NHTTP {
        interface RequestEvent {
            /**
             * generate token CSRF.
             */
            csrfToken: () => string;
            /**
             * verify token CSRF.
             */
            csrfVerify: (value?: string) => boolean;
        }
    }
}
export type CSRFOptions = {
    /**
     * cookie. default to `false`.
     */
    cookie?: boolean | Cookie;
    /**
     * secret. default to random per-request.
     */
    secret?: string | (() => string);
    /**
     * Salt length. default `8`
     */
    salt?: number;
    /**
     * Custom get value
     */
    getValue?: (rev: RequestEvent) => string | undefined | null;
    /**
     * Custom Error.
     */
    onError?: (error: Error, rev: RequestEvent) => TRet;
    /**
     * ignore methods. default to `["GET", "HEAD", "OPTIONS", "TRACE"]`.
     */
    ignoreMethods?: string[];
    /**
     * auto verify csrf. default to `true`.
     */
    autoVerify?: boolean;
    /**
     * algorithm when creating CSRF. default to `SHA1`.
     */
    algo?: "MD5" | "SHA" | "SHA1" | "SHA256" | "SHA512";
    /**
     * config origin. default to `true`.
     */
    origin?: string | string[] | boolean;
};
/**
 * Cross-Site Request Forgery (CSRF) protected middleware.
 * @example
 * const MyForm: FC<{ csrf: string }> = (props) => {
 *   return (
 *     <form method="POST" action="/">
 *       <input name="_csrf" type="hidden" value={props.csrf} />
 *       <input name="name" />
 *       <button type="submit">Submit</button>
 *     </form>
 *   )
 * }
 *
 * const csrfProtect = csrf();
 *
 * app.get("/", csrfProtect, (rev) => {
 *   return <MyForm csrf={rev.csrfToken()}/>
 * });
 *
 * app.post("/", csrfProtect, (rev) => {
 *   return <MyForm csrf={rev.csrfToken()}/>
 * });
 */
export declare const csrf: (opts?: CSRFOptions) => Handler;
export default csrf;
