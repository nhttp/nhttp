// body.ts
import type { TRet } from "../../../src/types.ts";

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

/**
 * Node body
 */
export class NodeBody<T extends Response | Request> {
  #init!: RequestInit | ResponseInit | undefined;
  #name: string;
  #raw!: TRet;
  #input!: BodyInit | null | RequestInfo | undefined;
  #isBodyUsed!: boolean;
  #clone!: Request | Response | undefined;
  #req!: Request;
  #res!: Response;
  #resUrl!: string | undefined;
  constructor(
    name: string,
    input?: BodyInit | null | RequestInfo,
    init?: RequestInit | ResponseInit,
    clone?: Request | Response,
    raw?: TRet,
    resUrl?: string,
  ) {
    this.#name = name;
    this.#raw = raw;
    this.#input = input;
    this.#init = init;
    this.#clone = clone;
    this.#resUrl = resUrl;
  }
  /**
   * given target request/response are using.
   */
  get target(): T {
    if (this.#name === "Request") {
      if (this.#clone !== void 0) return this.#clone as T;
      return (this.#req ??= new (<TRet> globalThis).NativeRequest(
        this.#input,
        this.#init,
      )) as T;
    }
    if (this.#clone !== void 0) return this.#clone as T;
    if (
      this.#resUrl !== void 0 &&
      this.#init instanceof (<TRet> globalThis).NativeResponse
    ) {
      return this.#init as T;
    }
    return (this.#res ??= new (<TRet> globalThis).NativeResponse(
      this.#input,
      this.#init,
    )) as T;
  }
  #rawBody(): Promise<Uint8Array> {
    if (this.#isBodyUsed) return typeError(consumed);
    this.#isBodyUsed = true;
    if (!this.#raw.req.headers["content-type"]) return typeError(misstype);
    if (notBody(this.#raw.req)) return typeError(mnotbody);
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      this.#raw.req.on("data", (buf: Uint8Array) => chunks.push(buf))
        // @ts-ignore: Buffer for nodejs
        .on("end", () => resolve(Buffer.concat(chunks)))
        .on("error", reject);
    });
  }
  /**
   * get body.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/body)
   */
  get body(): ReadableStream<Uint8Array> | null {
    if (this.#raw !== void 0) {
      if (notBody(this.#raw.req)) return null;
      if (!this.#raw.req.headers["content-type"]) return null;
      return new ReadableStream({
        start: async (ctrl) => {
          try {
            const body = await this.#rawBody();
            ctrl.enqueue(body);
            ctrl.close();
          } catch (e) {
            ctrl.close();
            throw e;
          }
        },
      });
    }
    return this.target.body;
  }
  /**
   * body is used or not.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/bodyUsed)
   */
  get bodyUsed() {
    if (this.#raw !== void 0) {
      return this.#isBodyUsed ?? false;
    }
    return this.target.bodyUsed;
  }
  /**
   * get arrayBuffer from body.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/arrayBuffer)
   */
  arrayBuffer(): Promise<ArrayBuffer> {
    if (this.#raw === void 0) {
      return this.target.arrayBuffer();
    }
    return this.#rawBody();
  }
  /**
   * get blob from body.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/blob)
   */
  blob(): Promise<Blob> {
    if (this.#raw === void 0) {
      return this.target.blob();
    }
    return (async () => {
      const req = reqBody(
        this.#input as string,
        await this.#rawBody(),
        this.#raw.req,
      );
      return await req.blob();
    })();
  }
  /**
   * get formdata from body.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/formData)
   */
  formData(): Promise<FormData> {
    if (this.#raw === void 0) {
      return this.target.formData();
    }
    return (async () => {
      const req = reqBody(
        this.#input as string,
        await this.#rawBody(),
        this.#raw.req,
      );
      return await req.formData();
    })();
  }
  /**
   * get json from body.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json)
   */
  json(): Promise<TRet> {
    if (this.#raw === void 0) {
      return this.target.json();
    }
    return (async () => {
      return JSON.parse((await this.#rawBody()).toString());
    })();
  }
  /**
   * get text from body.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/text)
   */
  text(): Promise<string> {
    if (this.#raw === void 0) {
      return this.target.text();
    }
    return (async () => {
      return (await this.#rawBody()).toString();
    })();
  }
}
