// deno-lint-ignore-file
import { TRet } from "../index.ts";
import { s_body, s_body_used, s_def, s_init } from "./symbol.ts";

const typeError = (m: string) => Promise.reject(new TypeError(m));
const consumed = "body already consumed";
const misstype = "missing content-type";
const mnotbody = "GET/HEAD cannot have body";
const notBody = (raw: TRet) => raw.method === "GET" || raw.method === "HEAD";
function reqBody(
  url: string,
  body: Uint8Array,
  raw: TRet,
): Request {
  return new (<TRet> globalThis).NativeRequest(url, {
    method: raw.method,
    headers: raw.headers,
    body: notBody(raw) ? void 0 : body,
  });
}
export class NodeRequest {
  constructor(input: RequestInfo, init?: RequestInit);
  constructor(input: RequestInfo, init?: RequestInit, raw?: TRet);
  constructor(input: RequestInfo, init?: RequestInit, public raw?: TRet) {
    this[s_body] = input;
    this[s_init] = init;
  }
  private get rawBody(): Promise<Uint8Array> {
    if (this[s_body_used]) return typeError(consumed);
    this[s_body_used] = true;
    if (!this.raw.req.headers["content-type"]) return typeError(misstype);
    if (notBody(this.raw.req)) return typeError(mnotbody);
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      this.raw.req.on("data", (buf: Uint8Array) => chunks.push(buf))
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore: Buffer for nodejs
        .on("end", () => resolve(Buffer.concat(chunks)))
        .on("error", (err: Error) => reject(err));
    });
  }
  private get req(): Request {
    return this[s_def] ??= new (<TRet> globalThis).NativeRequest(
      this[s_body],
      this[s_init],
    );
  }
  get cache() {
    return this.req.cache;
  }
  get credentials() {
    return this.req.credentials;
  }
  get destination() {
    return this.req.destination;
  }
  get headers() {
    return this.raw ? new Headers(this.raw.req.headers) : this.req.headers;
  }
  get integrity() {
    return this.req.integrity;
  }
  get keepalive() {
    return this.req.keepalive;
  }
  get method() {
    return this.raw ? this.raw.req.method : this.req.method;
  }
  get mode() {
    return this.req.mode;
  }
  get redirect() {
    return this.req.redirect;
  }
  get referrer() {
    return this.req.referrer;
  }
  get referrerPolicy() {
    return this.req.referrerPolicy;
  }
  get signal() {
    return this.req.signal;
  }
  get url() {
    if (typeof this[s_body] === "string") {
      return this[s_body];
    }
    return this.req.url;
  }
  clone(): Request {
    const req = new NodeRequest(
      this[s_body],
      this[s_init],
      this.raw,
    );
    return req as unknown as Request;
  }
  get body() {
    if (this.raw) {
      if (notBody(this.raw.req)) return null;
      if (!this.raw.req.headers["content-type"]) return null;
      return new ReadableStream({
        start: async (ctrl) => {
          try {
            const body = await this.rawBody;
            ctrl.enqueue(body);
            ctrl.close();
          } catch (e) {
            ctrl.close();
            throw e;
          }
        },
      });
    }
    return this.req.body;
  }
  get bodyUsed() {
    if (this.raw) {
      return this[s_body_used] ?? false;
    }
    return this.req.bodyUsed;
  }
  arrayBuffer(): Promise<ArrayBuffer> {
    return (async () => {
      if (this.raw) {
        return await this.rawBody;
      }
      return await this.req.arrayBuffer();
    })();
  }
  blob(): Promise<Blob> {
    return (async () => {
      if (this.raw) {
        const req = reqBody(
          this[s_body],
          await this.rawBody,
          this.raw.req,
        );
        return await req.blob();
      }
      return await this.req.blob();
    })();
  }
  formData(): Promise<FormData> {
    return (async () => {
      if (this.raw) {
        const req = reqBody(
          this[s_body],
          await this.rawBody,
          this.raw.req,
        );
        return await req.formData();
      }
      return await this.req.formData();
    })();
  }
  json(): Promise<TRet> {
    return (async () => {
      if (this.raw) {
        return JSON.parse((await this.rawBody).toString());
      }
      return await this.req.json();
    })();
  }
  text(): Promise<string> {
    return (async () => {
      if (this.raw) {
        return (await this.rawBody).toString();
      }
      return await this.req.text();
    })();
  }
  get [Symbol.hasInstance]() {
    return "Request";
  }
  [Symbol.for("nodejs.util.inspect.custom")](
    depth: number,
    opts: TRet,
    inspect: TRet,
  ) {
    if (depth < 0) {
      return opts.stylize("[Request]", "special");
    }
    const newOpts = Object.assign({}, opts, {
      depth: opts.depth === null ? null : opts.depth - 1,
    });
    const ret = {
      bodyUsed: this.bodyUsed,
      headers: this.headers,
      method: this.method,
      redirect: this.redirect,
      url: this.url,
    };
    return `${opts.stylize("Request", "special")} ${inspect(ret, newOpts)}`;
  }
  [k: string | symbol]: TRet;
}
