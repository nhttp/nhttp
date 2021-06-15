export type NextFunction = (err?: any) => void;

export interface HttpResponse {
  /**
   * set header or get header
   * @example
   * // set headers
   * response.header("content-type", "text/css");
   * response.header({"content-type": "text/css"});
   * // get headers
   * response.header("content-type");
   * // get all headers
   * response.header();
   * // delete headers
   * response.header().delete("content-type");
   */
  header: (
    key?: { [k: string]: any } | string,
    value?: any,
  ) => this | (this & Headers) | (this & string);
  /**
   * set status or get status
   * @example
   * // set status
   * response.status(200);
   * // get status
   * response.status();
   */
  status: (code?: number) => this | (this & number);
  /**
   * shorthand for content-type headers
   * @example
   * response.type("text/html");
   */
  type: (contentType: string) => this;
  /**
   * send response body
   * @example
   * // send text
   * response.send("hello");
   * response.status(201).send("Created");
   * // send json
   * response.send({ name: "john" });
   * // simple send file
   * response.type("text/css").send(await Deno.readFile("./path/file"));
   */
  send: (body?: BodyInit | { [k: string]: any } | null) => Promise<void>;
  /**
   * shorthand for send json body
   * @example
   * response.json({ name: "john" });
   */
  json: (body: { [k: string]: any } | null) => Promise<void>;
  /**
   * redirect url
   * @example
   * response.redirect("/home");
   * response.redirect("/home", 301);
   */
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
  /**
   * modify RequestEvent or HttpResponse before wrap middleware
   */
  beforeWrap: (rev: RequestEvent, res: HttpResponse) => void;
};
