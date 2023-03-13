// deno-lint-ignore-file
import { TRet } from "../index.ts";
import { FetchHandler } from "../src/types.ts";
import { NodeRequest } from "./request.ts";
import { s_body, s_headers, s_init } from "./symbol.ts";

async function handleRequest(handler: FetchHandler, req: TRet, res: TRet) {
  const resWeb: TRet = await handler(
    new NodeRequest(
      `http://${req.headers.host}${req.url}`,
      void 0,
      { req, res },
    ) as unknown as Request,
  );
  if (res.writableEnded) return;
  if (resWeb[s_init]) {
    if (resWeb[s_init].headers) {
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
    if (resWeb[s_init].status) res.statusCode = resWeb[s_init].status;
  }
  if (resWeb[s_headers]) {
    (<Headers> resWeb[s_headers]).forEach((val, key) => {
      res.setHeader(key, val);
    });
  }
  if (
    typeof resWeb[s_body] === "string" ||
    resWeb[s_body] === void 0 ||
    resWeb[s_body] === null ||
    resWeb[s_body] instanceof Uint8Array
  ) {
    res.end(resWeb[s_body]);
  } else {
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
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore: immediate for nodejs
      setImmediate(() => handleRequest(handler, req, res));
    },
  ).listen(port);
}
