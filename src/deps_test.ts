import { assertEquals } from "jsr:@std/assert";
import type { NHttp } from "./nhttp.ts";
import type { TRet } from "./types.ts";

const METHODS = ["GET", "PUT", "POST", "PATCH", "DELETE"] as const;
type Route = { method: string; path: string };

class InternalTest {
  private _r!: Route;
  private _headers!: TRet;
  private _body!: TRet;
  constructor(private app: NHttp) {
    METHODS.forEach((method) => {
      (this as TRet)[method.toLowerCase()] = (path: string) => {
        this._r = { path, method };
        return this;
      };
    });
  }

  get!: (path: string) => this;
  post!: (path: string) => this;
  patch!: (path: string) => this;
  delete!: (path: string) => this;
  put!: (path: string) => this;

  set(key: string, val: string) {
    this._headers ??= {};
    this._headers[key] = val;
    return this;
  }

  send<T>(data: T) {
    this._body = JSON.stringify(data);
    return this;
  }

  async expect<T>(data: T) {
    const { path, method } = this._r;
    const init = { method } as RequestInit;
    if (this._headers) init.headers = this._headers;
    if (this._body) init.body = this._body;
    const req = this.app.req(path, init);
    let exp!: TRet;
    if (typeof data === "string") {
      exp = req.text();
    } else if (typeof data === "number") {
      exp = req.status();
    } else if (typeof data === "boolean") {
      exp = req.ok();
    } else if (typeof data === "object") {
      exp = req.json();
    }
    assertEquals(data, await exp);
  }
}

export const intertest = (app: NHttp) => new InternalTest(app);

export { assertEquals };
