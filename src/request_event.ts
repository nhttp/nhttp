import { HttpResponse } from "./http_response.ts";
import { TObject } from "./types.ts";

export class RequestEvent {
  readonly request!: Request;
  respondWith!: (r: Response | Promise<Response>) => Promise<void> | Response;
  body!: TObject;
  file!: TObject;
  responseInit!: ResponseInit;
  response!: HttpResponse;
  url!: string;
  originalUrl!: string;
  params!: TObject;
  path!: string;
  query!: TObject;
  search!: string | null;
  /**
  * get cookies from request
  * @example
  * const object = rev.getCookies();
  * const objectWithDecode = rev.getCookies(true);
  */
  getCookies!: (decode?: boolean) => Record<string, string>;
  _parsedUrl!: {
    _raw: string;
    href: string;
    path: string;
    pathname: string;
    query: string | null;
    search: string | null;
  };
  // deno-lint-ignore no-explicit-any
  [k: string]: any
}
