// body.ts
import type { TObject, TRet } from "../../../src/types.ts";
import { getClassRequest, getClassResponse } from "./util.ts";

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
  const Req = getClassRequest();
  return new Req(url, {
    method: raw.method,
    headers: raw.headers,
    body: notBody(raw) ? void 0 : body,
  });
}

/**
 * Node body
 */
export class NodeBody<T extends Response | Request> {
  #init!: TObject;
  #name: string;
  #input!: BodyInit | null | RequestInfo | undefined;
  #isBodyUsed!: boolean;
  #req!: Request;
  #res!: Response;
  constructor(
    name: string,
    input?: BodyInit | null | RequestInfo,
    init: TObject = {},
  ) {
    this.#name = name;
    this.#input = input;
    this.#init = init;
  }
  /**
   * given target request/response are using.
   */
  get target(): T {
    if (this.#name === "Request") {
      if (this.#init._clone !== void 0) return this.#init._clone as T;
      const Req = getClassRequest();
      return (this.#req ??= new Req(
        this.#input as RequestInfo,
        this.#init,
      )) as T;
    }
    if (this.#init._clone !== void 0) return this.#init._clone as T;
    if (this.#init._url !== void 0) return this.#init as T;
    const Res = getClassResponse();
    return (this.#res ??= new Res(
      this.#input as BodyInit | null,
      this.#init,
    )) as T;
  }
  #rawBody(): Promise<Uint8Array> {
    if (this.#isBodyUsed) return typeError(consumed);
    this.#isBodyUsed = true;
    if (!this.#init._raw.req.headers["content-type"]) {
      return typeError(misstype);
    }
    if (notBody(this.#init._raw.req)) return typeError(mnotbody);
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      this.#init._raw.req.on("data", (buf: Uint8Array) => chunks.push(buf))
        // @ts-ignore: Buffer for nodejs
        // deno-lint-ignore no-node-globals
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
    if (this.#init._raw !== void 0) {
      if (notBody(this.#init._raw.req)) return null;
      if (!this.#init._raw.req.headers["content-type"]) return null;
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
  get bodyUsed(): boolean {
    if (this.#init._raw !== void 0) {
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
    if (this.#init._raw === void 0) {
      return this.target.arrayBuffer();
    }
    return this.#rawBody() as TRet;
  }
  /**
   * get blob from body.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/blob)
   */
  blob(): Promise<Blob> {
    if (this.#init._raw === void 0) {
      return this.target.blob();
    }
    return (async () => {
      const req = reqBody(
        this.#input as string,
        await this.#rawBody(),
        this.#init._raw.req,
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
    if (this.#init._raw === void 0) {
      return this.target.formData();
    }
    return (async () => {
      const req = reqBody(
        this.#input as string,
        await this.#rawBody(),
        this.#init._raw.req,
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
    if (this.#init._raw === void 0) {
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
    if (this.#init._raw === void 0) {
      return this.target.text();
    }
    return (async () => {
      return (await this.#rawBody()).toString();
    })();
  }
}
