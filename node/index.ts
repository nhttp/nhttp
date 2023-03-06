// deno-lint-ignore-file
import { TRet } from "../index.ts";
import { FetchHandler } from "../src/types.ts";
import { NodeRequest } from "./request.ts";
import { NodeResponse } from "./response.ts";
import { s_body, s_headers, s_init } from "./symbol.ts";

async function sendStream(resWeb: NodeResponse, res: TRet) {
  if (resWeb[s_body] instanceof ReadableStream) {
    for await (const chunk of resWeb[s_body] as TRet) res.write(chunk);
    res.end();
    return;
  }
  const chunks = [];
  for await (const chunk of resWeb.body as TRet) chunks.push(chunk);
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore: Buffer for nodejs
  const data = Buffer.concat(chunks);
  if (
    resWeb[s_body] instanceof FormData && !res.getHeader("Content-Type")
  ) {
    const type = `multipart/form-data;boundary=${
      data.toString().split("\r")[0]
    }`;
    res.setHeader("Content-Type", type);
  }
  res.end(data);
}
function send(resWeb: NodeResponse, res: TRet) {
  if (resWeb[s_init]) {
    if (resWeb[s_init].headers) {
      if (resWeb[s_init].headers instanceof Headers) {
        (<Headers> resWeb[s_init].headers).forEach((val, key) => {
          res.setHeader(key, val);
        });
      } else {
        for (const k in resWeb[s_init].headers) {
          res.setHeader(k, resWeb[s_init].headers[k]);
        }
      }
    }
    if (resWeb[s_init].status) res.statusCode = resWeb[s_init].status;
  }
  if (resWeb[s_headers]) {
    (<Headers> resWeb[s_headers]).forEach((val, key) => {
      res.setHeader(key, val);
    });
  }
  if (
    typeof resWeb[s_body] === "string" ||
    resWeb[s_body] instanceof Uint8Array ||
    resWeb[s_body] === null ||
    resWeb[s_body] === undefined
  ) {
    res.end(resWeb[s_body]);
  } else {
    return sendStream(resWeb, res).catch((e) => {
      throw e;
    });
  }
}
export function serveNode(
  handler: FetchHandler,
  createServer: TRet,
  config: TRet = {},
) {
  const port = config.port ?? 3000;
  return createServer(
    config,
    (req: TRet, res: TRet) => {
      const ret = handler(
        new NodeRequest(
          `http://${req.headers.host}${req.url}`,
          void 0,
          { req, res },
        ) as unknown as Request,
      );
      if (ret instanceof Promise) {
        return ret.then((data) => {
          if (res.writableEnded) return;
          return send(data as NodeResponse, res);
        }).catch((e) => {
          throw e;
        });
      }
      if (res.writableEnded) return;
      return send(ret as NodeResponse, res);
    },
  ).listen(port);
}
