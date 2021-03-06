import { HttpResponse } from "./http_response.ts";
import { TObject, TRet } from "./types.ts";

export class RequestEvent {
  readonly request!: Request;
  respondWith!: (r: Response | Promise<Response>) => Promise<void> | Response;
  body!: TObject;
  file!: TObject;
  responseInit!: ResponseInit;
  response!: HttpResponse;
  url!: string;
  params!: TObject;
  path!: string;
  conn!: Deno.Conn;
  query!: TObject;
  search!: string | null;
  /**
   * get cookies from request
   * @example
   * const object = rev.getCookies();
   * const objectWithDecode = rev.getCookies(true);
   */
  getCookies!: (decode?: boolean) => Record<string, string>;
  [k: string]: TRet
}
