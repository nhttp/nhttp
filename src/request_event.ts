import { HttpResponse } from "./http_response.ts";

export class RequestEvent {
  readonly request!: Request;
  respondWith!: (r: Response | Promise<Response>) => Promise<void>;
  body!: { [k: string]: any };
  file!: { [k: string]: any };
  responseInit!: ResponseInit;
  response!: HttpResponse;
  url!: string;
  originalUrl!: string;
  params!: { [k: string]: any };
  path!: string;
  query!: { [k: string]: any };
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
  [k: string]: any
}
