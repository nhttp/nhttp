import { decURIComponent } from "./deps.js";
import { sendFile as sendFileEtag } from "./etag.js";
const sendFile = sendFileEtag;
function serveStatic(dir, opts = {}) {
  opts.index ??= "index.html";
  opts.redirect ??= true;
  opts.etag ??= false;
  if (dir instanceof URL)
    dir = dir.pathname;
  if (dir.endsWith("/"))
    dir = dir.slice(0, -1);
  const hasFileUrl = dir.startsWith("file://");
  const index = opts.redirect ? opts.index : "";
  let prefix = opts.prefix;
  const hasPrefix = prefix !== void 0 && prefix !== "/";
  if (hasPrefix) {
    if (prefix[0] !== "/")
      prefix = "/" + prefix;
    if (prefix.endsWith("/"))
      prefix = prefix.slice(0, -1);
  }
  if (hasFileUrl)
    dir = new URL(dir).pathname;
  return async (rev, next) => {
    if (rev.method === "GET" || rev.method === "HEAD") {
      try {
        let path = rev.path;
        if (hasPrefix) {
          if (path.startsWith(prefix) === false)
            return next();
          path = path.substring(prefix.length);
        }
        let pathFile = dir + path;
        if (opts.redirect) {
          const idx = pathFile.lastIndexOf(".");
          if (pathFile.slice((idx - 1 >>> 0) + 2) === "") {
            if (pathFile.endsWith("/"))
              pathFile += index;
            else
              pathFile += "/" + index;
          }
        }
        return await sendFile(rev, decURIComponent(pathFile), opts);
      } catch {
        if (opts.spa && opts.redirect) {
          return await sendFile(rev, decURIComponent(dir + "/" + index), opts);
        }
      }
    }
    return next();
  };
}
var serve_static_default = serveStatic;
export {
  serve_static_default as default,
  sendFile,
  serveStatic
};
