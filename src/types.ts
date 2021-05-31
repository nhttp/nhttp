export type NextFunction = (err?: any) => void;
export type RespondWith = (r: Response | Promise<Response>) => Promise<void>;
export type HttpRequest = Request & {
  pond: (
    body?: string | { [k: string]: any } | null | undefined,
    opts?: { status?: number; headers?: Headers },
  ) => Promise<void>;
  originalUrl: string;
  params: { [k: string]: any };
  path: string;
  query: { [k: string]: any };
  parsedBody: { [k: string]: any };
  file: { [k: string]: any };
  search: string | null;
  [k: string]: any;
};
export type THandler = (
  request: HttpRequest,
  respondWith: RespondWith,
  next: NextFunction,
) => any;
export type THandlers = Array<THandler | THandler[]>;
