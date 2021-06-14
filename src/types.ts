export type NextFunction = (err?: any) => void;

export interface HttpResponse {
  header: (
    key?: { [k: string]: any } | string,
    value?: any,
  ) => this | (this & Headers) | (this & string);
  status: (code?: number) => this | (this & number);
  type: (contentType: string) => this;
  send: (body?: BodyInit | { [k: string]: any } | null) => Promise<void>;
  json: (body: { [k: string]: any } | null) => Promise<void>;
  redirect: (url: string, status?: number) => Promise<void>;
  [k: string]: any;
}

export type RequestEvent = Deno.RequestEvent & {
  body: { [k: string]: any };
  file: { [k: string]: any };
  responseInit: ResponseInit;
  response: HttpResponse;
  url: string;
  originalUrl: string;
  params: { [k: string]: any };
  path: string;
  query: { [k: string]: any };
  search: string | null;
  _parsedUrl: { [k: string]: any };
  [k: string]: any;
};

export type Handler<
  Rev extends RequestEvent = RequestEvent,
> = (
  rev: Rev,
  next: NextFunction,
) => any;

export type Handlers<
  Rev extends RequestEvent = RequestEvent,
> = Array<Handler<Rev> | Handler<Rev>[]>;

export type TBodyLimit = {
  json?: number | string;
  urlencoded?: number | string;
};

export type TWrapMiddleware = {
  beforeWrap: (rev: RequestEvent, res: HttpResponse) => void;
};
