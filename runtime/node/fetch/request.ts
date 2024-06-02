// request.ts
import type { TRet } from "../../../src/types.ts";
import { NodeBody } from "./body.ts";
import { NodeHeaders } from "./headers.ts";
import { s_inspect } from "./symbol.ts";

/**
 * NodeRequest web-api
 */
export class NodeRequest extends NodeBody<Request> {
  /**
   * flag node request.
   */
  _nreq = 1;
  constructor(input: RequestInfo, init?: RequestInit);
  constructor(input: RequestInfo, init?: RequestInit, raw?: TRet);
  constructor(
    input: RequestInfo,
    init?: RequestInit,
    raw?: TRet,
    reqClone?: Request,
  );
  constructor(
    private __input: RequestInfo,
    private __init?: RequestInit,
    /**
     * raw node http request.
     */
    public raw?: TRet,
    /**
     * clone request
     */
    public reqClone?: Request,
  ) {
    super("Request", __input, __init as RequestInit, reqClone, raw);
  }
  /**
   * Returns the cache mode associated with request, which is a string indicating how the request will interact with the browser's cache when fetching.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/cache)
   */
  get cache(): RequestCache {
    return this.target.cache;
  }
  /**
   * Returns the credentials mode associated with request, which is a string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/credentials)
   */
  get credentials(): RequestCredentials {
    return this.target.credentials;
  }
  /**
   * Returns the kind of resource requested by request, e.g., "document" or "script".
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/destination)
   */
  get destination(): RequestDestination {
    return this.target.destination;
  }
  /**
   * Returns a Headers object consisting of the headers associated with request. Note that headers added in the network layer by the user agent will not be accounted for in this object, e.g., the "Host" header.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/headers)
   */
  get headers(): Headers {
    return this.raw ? new Headers(this.raw.req.headers) : this.target.headers;
  }
  /**
   * Returns request's subresource integrity metadata, which is a cryptographic hash of the resource being fetched. Its value consists of multiple hashes separated by whitespace. [SRI]
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/integrity)
   */
  get integrity(): string {
    return this.target.integrity;
  }
  /**
   * Returns a boolean indicating whether or not request can outlive the global in which it was created.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/keepalive)
   */
  get keepalive(): boolean {
    return this.target.keepalive;
  }
  /**
   * Returns request's HTTP method, which is "GET" by default.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/method)
   */
  get method(): string {
    return this.raw ? this.raw.req.method : this.target.method;
  }
  /**
   * Returns the mode associated with request, which is a string indicating whether the request will use CORS, or will be restricted to same-origin URLs.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/mode)
   */
  get mode(): RequestMode {
    return this.target.mode;
  }
  /**
   * Returns the redirect mode associated with request, which is a string indicating how redirects for the request will be handled during fetching. A request will follow redirects by default.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/redirect)
   */
  get redirect(): RequestRedirect {
    return this.target.redirect;
  }
  /**
   * Returns the referrer of request. Its value can be a same-origin URL if explicitly set in init, the empty string to indicate no referrer, and "about:client" when defaulting to the global's default. This is used during fetching to determine the value of the `Referer` header of the request being made.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/referrer)
   */
  get referrer(): string {
    return this.target.referrer;
  }
  /**
   * Returns the referrer policy associated with request. This is used during fetching to compute the value of the request's referrer.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/referrerPolicy)
   */
  get referrerPolicy(): ReferrerPolicy {
    return this.target.referrerPolicy;
  }
  /**
   * Returns the signal associated with request, which is an AbortSignal object indicating whether or not request has been aborted, and its abort event handler.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/signal)
   */
  get signal(): AbortSignal {
    return this.target.signal;
  }
  /**
   * Returns the URL of request as a string.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/url)
   */
  get url(): string {
    if (typeof this.__input === "string") {
      return this.__input;
    }
    return this.target.url;
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/clone) */
  clone(): Request {
    return new (<TRet> globalThis).Request(
      this.__input,
      this.__init,
      this.raw,
      this.target.clone(),
    );
  }
  /**
   * Node custom inspect
   */
  [s_inspect](
    depth: number,
    opts: TRet,
    inspect: TRet,
  ): string {
    opts.depth = depth;
    const ret = {
      bodyUsed: this.bodyUsed,
      headers: new NodeHeaders(this.headers),
      method: this.method,
      redirect: this.redirect,
      url: this.url,
    };
    return `Request ${inspect(ret, opts)}`;
  }
}
