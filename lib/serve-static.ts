import { NextFunction, RequestEvent } from "./deps.ts";
import { sendFile as sendFileEtag, TOptsSendFile } from "./etag.ts";

interface StaticOptions extends TOptsSendFile {
  index?: string;
  redirect?: boolean;
  prefix?: string;
}
export const sendFile = sendFileEtag;
export function serveStatic(dir: string, opts: StaticOptions = {}) {
  opts.index ??= "index.html";
  opts.redirect ??= true;
  return async (rev: RequestEvent, next: NextFunction) => {
    const index = opts.redirect ? opts.index : "";
    let pathFile = dir + rev.url;
    if (opts.prefix) {
      if (opts.prefix[0] !== "/") opts.prefix = "/" + opts.prefix;
      if (!rev.url.startsWith(opts.prefix)) return next();
      pathFile = pathFile.replace(opts.prefix, "");
    }
    try {
      if (pathFile.endsWith("/")) pathFile += index;
      return await sendFile(rev, pathFile, opts);
    } catch {
      return next();
    }
  };
}
