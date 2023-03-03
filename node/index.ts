// deno-lint-ignore-file
import { TRet } from "../index.ts";
import { NodeRequest } from "./request.ts";
import { NodeResponse } from "./response.ts";
import { s_body, s_init } from "./symbol.ts";

type FetchHandler = (req: TRet) => Promise<TRet>;
async function sendStream(resWeb: NodeResponse, res: TRet) {
  if (resWeb[s_body] instanceof ReadableStream) {
    for await (const chunk of resWeb[s_body] as TRet) res.write(chunk);
    res.end();
    return;
  }
  const chunks = [];
  for await (const chunk of resWeb.body as TRet) chunks.push(chunk);
  // @ts-ignore
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
    (req: TRet, res: TRet) =>
      handler(
        new NodeRequest(
          `http://${req.headers.host}${req.url}`,
          void 0,
          { req, res },
        ),
      ).then((data) => {
        if (res.writableEnded) return;
        return send(data, res);
      }).catch((e) => {
        throw e;
      }),
  ).listen(port);
}
