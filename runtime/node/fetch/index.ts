// index.ts
import type { FetchHandler, ListenOptions, TRet } from "../../../src/types.ts";
import { Request, type Response } from "./fetch.ts";

const Buf = (globalThis as TRet).Buffer;
const isArray = Array.isArray;
const R_NO_STREAM = /\/json|\/plain|\/html|\/css|\/javascript/;
const toHeads = (headers: Headers) => Array.from(headers.entries());
async function sendStream(
  resWeb: TRet,
  res: TRet,
  heads?: TRet[],
  native?: boolean,
) {
  if (native) {
    resWeb = resWeb.clone();
    const headers = new Headers(resWeb.headers);
    const code = resWeb.status ?? 200;
    const type = headers.get("content-type");
    if (type && R_NO_STREAM.test(type)) {
      const body = await resWeb.text();
      headers.set("content-length", Buf.byteLength(body));
      res.writeHead(code, toHeads(headers));
      res.end(body);
    } else {
      res.writeHead(code, toHeads(headers));
      if (resWeb.body != null) {
        for await (const chunk of resWeb.body as TRet) res.write(chunk);
      }
      res.end();
    }
    return;
  }
  if (resWeb["__body"] instanceof ReadableStream) {
    if (resWeb["__body"].locked && resWeb["__body_clone"] != null) {
      resWeb["__body"] = resWeb["__body_clone"];
    }
    if (heads) {
      res.writeHead(res.statusCode, heads);
    }
    for await (const chunk of resWeb["__body"] as TRet) res.write(chunk);
    res.end();
    return;
  }
  if (resWeb.body == null) {
    if (heads) {
      res.writeHead(res.statusCode, heads);
    }
    res.end();
    return;
  }
  const chunks = [];
  for await (const chunk of resWeb.body as TRet) chunks.push(chunk);
  const data = Buf.concat(chunks);
  if (resWeb["__body"] instanceof FormData) {
    const type = `multipart/form-data;boundary=${
      data.toString().split("\r")[0]
    }`;
    if (heads) {
      heads.push(["Content-Type", type]);
      res.writeHead(res.statusCode, heads);
    } else {
      res.setHeader("Content-Type", type);
    }
  }
  res.end(data);
}
function handleResWeb(resWeb: TRet, res: TRet) {
  if (res.writableEnded) return;
  if (resWeb._nres) {
    let heads!: TRet[];
    if (resWeb["__init"]) {
      if (resWeb["__init"].status) {
        res.statusCode = resWeb["__init"].status;
      }
      if (resWeb["__init"].statusText) {
        res.statusMessage = resWeb["__init"].statusText;
      }
      if (resWeb["__init"].headers && !resWeb["__headers"]) {
        if (isArray(resWeb["__init"].headers)) {
          heads = resWeb["__init"].headers;
        } else {
          if (
            resWeb["__init"].headers.get &&
            typeof resWeb["__init"].headers.get === "function"
          ) {
            (<Headers> resWeb["__init"].headers).forEach((val, key) => {
              res.setHeader(key, val);
            });
          } else {
            for (const k in resWeb["__init"].headers) {
              res.setHeader(k, resWeb["__init"].headers[k]);
            }
          }
        }
      }
    }
    if (resWeb["__headers"]) {
      if (resWeb["__headers"].has("set-cookie")) {
        heads = Array.from(resWeb["__headers"].entries());
      } else {
        (<Headers> resWeb["__headers"]).forEach((val, key) => {
          res.setHeader(key, val);
        });
      }
    }
    if (
      typeof resWeb["__body"] === "string" ||
      resWeb["__body"] == null ||
      resWeb["__body"] instanceof Uint8Array
    ) {
      if (heads) {
        heads.push([
          "Content-Length",
          Buf.byteLength(resWeb["__body"] ?? ""),
        ]);
        res.writeHead(res.statusCode, heads);
      }
      res.end(resWeb["__body"]);
    } else {
      sendStream(resWeb, res, heads);
    }
  } else {
    sendStream(resWeb, res, void 0, true);
  }
}

async function asyncHandleResWeb(resWeb: Promise<Response>, res: TRet) {
  handleResWeb(await resWeb, res);
}
/**
 * Handle Edge style server.
 */
// deno-lint-ignore require-await
export async function handleNode(handler: FetchHandler, req: TRet, res: TRet) {
  const resWeb: TRet = handler(
    new Request(
      "http://" + req.headers.host + req.url,
      void 0,
      { req, res },
    ) as TRet,
  );
  if (resWeb?.then) asyncHandleResWeb(resWeb, res);
  else handleResWeb(resWeb, res);
}
/**
 * serve node-http with modern style (Edge-Runtime).
 */
export async function serveNode(
  handler: FetchHandler,
  opts: ListenOptions = {
    port: 3000,
  },
): Promise<TRet> {
  const immediate = opts.immediate ?? true;
  const port = opts.port;
  const isSecure = opts.certFile !== void 0 || opts.cert !== void 0;
  let createServer = opts.createServer;
  if (createServer === void 0) {
    let server: undefined | TRet;
    if (isSecure) server = await import("node:https");
    else server = await import("node:http");
    createServer = server.createServer;
  }
  return createServer(
    opts,
    immediate
      ? (req: TRet, res: TRet) => {
        // @ts-ignore: immediate for nodejs
        setImmediate(() => handleNode(handler, req, res));
      }
      : (req: TRet, res: TRet) => {
        handleNode(handler, req, res);
      },
  ).listen(port);
}
