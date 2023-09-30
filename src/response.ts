import { deno_inspect } from "./inspect.ts";
import { s_headers, s_res } from "./symbol.ts";
import { TRet } from "./types.ts";

const n_res: TRet = globalThis.Reflect?.ownKeys(new Response()).find((s) => {
  return String(s) === "Symbol(response)";
});

export class NHttpResponse {
  constructor(body?: TRet | null, init: TRet = {}) {
    if (init.headers === void 0 && typeof body === "string") {
      this[n_res] = {
        body: { streamOrStatic: { body } },
        status: init.status ?? 200,
        headerList: [],
      };
    } else {
      this[s_res] = new NativeResponse(body, init);
      this[n_res] = this[s_res][n_res];
    }
  }
  static json(body?: TRet | null, init?: TRet) {
    return NativeResponse.json(body, init);
  }
  static error() {
    return NativeResponse.error();
  }
  static redirect(url: string | URL, status?: number): Response {
    return NativeResponse.redirect(url, status);
  }
  private get res(): Response {
    return this[s_res] ??= new NativeResponse(
      this[n_res]["body"]["streamOrStatic"]["body"],
    );
  }
  get headers() {
    return this[s_headers] ??= this.res.headers;
  }
  get ok() {
    return this.res.ok;
  }
  get redirected() {
    return this.res.redirected;
  }
  get status() {
    return this.res.status;
  }
  get statusText() {
    return this.res.statusText;
  }
  get type() {
    return this.res.type;
  }
  get url() {
    return this.res.url;
  }
  get body() {
    return this.res.body;
  }
  get bodyUsed() {
    return this.res.bodyUsed;
  }
  clone() {
    return this.res.clone();
  }
  arrayBuffer() {
    return this.res.arrayBuffer();
  }
  blob() {
    return this.res.blob();
  }
  formData() {
    return this.res.formData();
  }
  json() {
    return this.res.json();
  }
  text() {
    return this.res.text();
  }
  [deno_inspect](inspect: TRet, opts: TRet) {
    const ret = {
      body: this.body,
      bodyUsed: this.bodyUsed,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
    };
    return `Response ${inspect(ret, opts)}`;
  }
  [k: string | symbol]: TRet;
}

export function initMyRes() {
  if (n_res !== void 0) {
    globalThis.NativeResponse = Response;
    globalThis.Response = NHttpResponse;
  }
}
