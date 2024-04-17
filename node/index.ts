// deno-lint-ignore-file
import { TRet } from "../index.ts";
import { FetchHandler, ListenOptions } from "../src/types.ts";
import { NodeRequest } from "./request.ts";
import { NodeResponse } from "./response.ts";
import { s_body, s_body_clone, s_headers, s_init } from "./symbol.ts";
export function mutateResponse() {
  if ((<TRet> globalThis).NativeResponse === undefined) {
    (<TRet> globalThis).NativeResponse = Response;
    (<TRet> globalThis).NativeRequest = Request;
    (<TRet> globalThis).Response = NodeResponse;
    (<TRet> globalThis).Request = NodeRequest;
  }
}
const toHeads = (headers: Headers) => Array.from(headers.entries());
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore: Buffer for nodejs
const Buf = globalThis.Buffer;
const isArray = Array.isArray;
const R_NO_STREAM = /\/json|\/plain|\/html|\/css|\/javascript/;
async function sendStream(
  resWeb: TRet,
  res: TRet,
  ori = false,
  heads?: TRet[],
) {
  if (ori) {
    resWeb = resWeb.clone();
    const headers = new Headers(resWeb.headers);
    headers.delete("content-encoding");
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
        for await (const chunk of resWeb.body) res.write(chunk);
      }
      res.end();
    }
    return;
  }
  if (resWeb[s_body] instanceof ReadableStream) {
    if (resWeb[s_body].locked && resWeb[s_body_clone] != null) {
      resWeb[s_body] = resWeb[s_body_clone];
    }
    if (heads) {
      res.writeHead(res.statusCode, heads);
    }
    for await (const chunk of resWeb[s_body] as TRet) res.write(chunk);
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
  if (resWeb[s_body] instanceof FormData) {
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
    let heads: TRet;
    if (resWeb[s_init]) {
      if (resWeb[s_init].status) {
        res.statusCode = resWeb[s_init].status;
      }
      if (resWeb[s_init].statusText) {
        res.statusMessage = resWeb[s_init].statusText;
      }
      if (resWeb[s_init].headers) {
        if (isArray(resWeb[s_init].headers)) {
          heads = resWeb[s_init].headers;
        } else {
          if (
            resWeb[s_init].headers.get &&
            typeof resWeb[s_init].headers.get === "function"
          ) {
            (<Headers> resWeb[s_init].headers).forEach((val, key) => {
              res.setHeader(key, val);
            });
          } else {
            for (const k in resWeb[s_init].headers) {
              res.setHeader(k, resWeb[s_init].headers[k]);
            }
          }
        }
      }
    }
    if (resWeb[s_headers]) {
      if (heads) {
        heads = toHeads(resWeb[s_headers]);
      } else {
        (<Headers> resWeb[s_headers]).forEach((val, key) => {
          res.setHeader(key, val);
        });
      }
    }
    if (
      typeof resWeb[s_body] === "string" ||
      resWeb[s_body] == null ||
      resWeb[s_body] instanceof Uint8Array
    ) {
      if (heads) {
        heads.push([
          "Content-Length",
          Buf.byteLength(resWeb[s_body] ?? ""),
        ]);
        res.writeHead(res.statusCode, heads);
      }
      res.end(resWeb[s_body]);
    } else {
      sendStream(resWeb, res, false, heads);
    }
  } else {
    sendStream(resWeb, res, true);
  }
}

async function asyncHandleResWeb(resWeb: Promise<Response>, res: TRet) {
  handleResWeb(await resWeb, res);
}
export async function handleNode(handler: FetchHandler, req: TRet, res: TRet) {
  const resWeb: TRet = handler(
    new NodeRequest(
      "http://" + req.headers.host + req.url,
      void 0,
      { req, res },
    ) as unknown as Request,
  );
  if (resWeb?.then) asyncHandleResWeb(resWeb, res);
  else handleResWeb(resWeb, res);
}
export async function serveNode(
  handler: FetchHandler,
  opts: ListenOptions = {
    port: 3000,
  },
) {
  mutateResponse();
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
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore: immediate for nodejs
        setImmediate(() => handleNode(handler, req, res));
      }
      : (req: TRet, res: TRet) => {
        handleNode(handler, req, res);
      },
  ).listen(port);
}
