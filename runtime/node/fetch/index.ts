// index.ts
import type {
  FetchHandler,
  ListenOptions,
  TObject,
  TRet,
} from "../../../src/types.ts";
import { isNode } from "../../runtime.ts";
import { install } from "./fetch.ts";
import { C_TYPE, R_NO_STREAM } from "./util.ts";
if (isNode()) install();
const Buf = (globalThis as TRet).Buffer;
const isArray = Array.isArray;
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
    const type = headers.get(C_TYPE);
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
  if (resWeb["_body"] instanceof ReadableStream) {
    if (resWeb["_body"].locked && resWeb["_body_clone"] != null) {
      resWeb["_body"] = resWeb["_body_clone"];
    }
    if (heads) {
      res.writeHead(res.statusCode, heads);
    }
    for await (const chunk of resWeb["_body"] as TRet) res.write(chunk);
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
  if (resWeb["_body"] instanceof FormData) {
    const type = `multipart/form-data;boundary=${
      data.toString().split("\r")[0]
    }`;
    if (heads) {
      heads.push([C_TYPE, type]);
      res.writeHead(res.statusCode, heads);
    } else {
      res.setHeader(C_TYPE, type);
    }
  }
  res.end(data);
}
function handleResWeb(resWeb: TRet, res: TRet) {
  if (res.writableEnded) return;
  if (resWeb._nres) {
    let heads!: TRet[];
    if (resWeb["_init"]) {
      if (resWeb["_init"].status) {
        res.statusCode = resWeb["_init"].status;
      }
      if (resWeb["_init"].statusText) {
        res.statusMessage = resWeb["_init"].statusText;
      }
      if (resWeb["_init"].headers && !resWeb["_headers"]) {
        if (isArray(resWeb["_init"].headers)) {
          heads = resWeb["_init"].headers;
        } else {
          if (
            resWeb["_init"].headers.get &&
            typeof resWeb["_init"].headers.get === "function"
          ) {
            const headers = <Headers> resWeb["_init"].headers;
            if (headers.has("set-cookie")) {
              heads = toHeads(headers);
            } else {
              headers.forEach((val, key) => {
                res.setHeader(key, val);
              });
            }
          } else {
            for (const k in resWeb["_init"].headers) {
              res.setHeader(k, resWeb["_init"].headers[k]);
            }
          }
        }
      }
    }
    if (resWeb["_headers"]) {
      const headers = <Headers> resWeb["_headers"];
      if (headers.has("set-cookie")) {
        heads = toHeads(headers);
      } else {
        headers.forEach((val, key) => {
          res.setHeader(key, val);
        });
      }
    }
    if (
      typeof resWeb["_body"] === "string" ||
      resWeb["_body"] == null ||
      resWeb["_body"] instanceof Uint8Array
    ) {
      if (heads) {
        heads.push([
          "Content-Length",
          Buf.byteLength(resWeb["_body"] ?? ""),
        ]);
        res.writeHead(res.statusCode, heads);
      }
      res.end(resWeb["_body"]);
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
      { _raw: { req, res } } as TObject,
    ),
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
        // deno-lint-ignore no-node-globals
        setImmediate(() => handleNode(handler, req, res));
      }
      : (req: TRet, res: TRet) => {
        handleNode(handler, req, res);
      },
  ).listen(port);
}
