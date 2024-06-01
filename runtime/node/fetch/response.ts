// response.ts
import type { TRet } from "../../../src/types.ts";
import { NodeBody } from "./body.ts";
import { NodeHeaders } from "./headers.ts";
import { s_inspect } from "./symbol.ts";

const C_TYPE = "Content-Type";
const JSON_TYPE = "application/json";
/**
 * Node Response Web-Api
 */
export class NodeResponse extends NodeBody<Response> {
  /**
   * Node Response flags.
   */
  _nres: number | undefined = 1;
  /**
   * body clone
   */
  __body_clone!: ReadableStream<Uint8Array> | null | undefined;
  /**
   * response headers cache.
   */
  __headers!: Headers | undefined;
  constructor(body?: BodyInit | null, init?: ResponseInit);
  constructor(
    body?: BodyInit | null,
    init?: ResponseInit,
    clone?: Response,
    url?: string,
  );
  constructor(
    private __body?: BodyInit | null,
    private __init?: ResponseInit,
    /**
     * response clone.
     */
    public resClone?: Response,
    /**
     * response url.
     */
    public resUrl?: string,
  ) {
    super("Response", __body, __init as ResponseInit, resClone, void 0, resUrl);
  }
  /**
   * `static` error response.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/error_static)
   */
  static error(): Response {
    return (<TRet> globalThis).NativeResponse.error();
  }
  /**
   * `static` redirect response.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/redirect_static)
   */
  static redirect(url: string | URL, status?: number): Response {
    return (<TRet> globalThis).NativeResponse.redirect(url, status);
  }
  /**
   * `static` json response.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/json_static)
   */
  static json(
    data: unknown,
    init: ResponseInit = {},
  ): Response {
    if (init.headers) {
      if (
        (<TRet> init.headers).get &&
        typeof (<TRet> init.headers).get === "function"
      ) {
        (<Headers> init.headers).set(
          C_TYPE,
          (<Headers> init.headers).get(C_TYPE) ?? JSON_TYPE,
        );
      } else {
        (<TRet> init.headers)[C_TYPE] ??= JSON_TYPE;
      }
    } else {
      init.headers = { [C_TYPE]: JSON_TYPE };
    }
    return new NodeResponse(JSON.stringify(data), init) as TRet;
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/headers) */
  get headers(): Headers {
    return this.__headers ??= new Headers(this.__init?.headers);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/ok) */
  get ok(): boolean {
    return this.target.ok;
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/redirected) */
  get redirected(): boolean {
    return this.target.redirected;
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/status) */
  get status(): number {
    return this.__init?.status ?? 200;
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/statusText) */
  get statusText(): string {
    return this.target.statusText;
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/type) */
  get type(): ResponseType {
    return this.target.type;
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/url) */
  get url(): string {
    return this.resUrl ?? this.target.url;
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/clone) */
  clone(): Response {
    if (this.__body instanceof ReadableStream) {
      this.__body_clone = this.target.clone().body;
    }
    return new NodeResponse(
      this.__body,
      this.__init,
      this.target.clone(),
    ) as TRet;
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
      body: this.body,
      bodyUsed: this.bodyUsed,
      headers: new NodeHeaders(this.headers),
      status: this.status,
      statusText: this.statusText,
      redirected: this.redirected,
      ok: this.ok,
      url: this.url,
    };
    return `Response ${inspect(ret, opts)}`;
  }
}
