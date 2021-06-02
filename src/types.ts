export type NextFunction = (err?: any) => void;

export type RequestEvent = Deno.RequestEvent & {
  body: { [k: string]: any };
  file: { [k: string]: any };
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
