import { decURIComponent } from "./deps.js";
import { sendFile as sendFileEtag } from "./etag.js";
const sendFile = sendFileEtag;
function serveStatic(dir, opts = {}) {
  opts.index ??= "index.html";
  opts.redirect ??= true;
  if (dir.endsWith("/"))
    dir = dir.slice(0, -1);
  const index = opts.redirect ? opts.index : "";
  return async (rev, next) => {
    if (rev.method !== "GET" && rev.method !== "HEAD") {
      return next();
    }
    try {
      let pathFile = dir + rev.path;
      if (pathFile.startsWith("file://")) {
        pathFile = new URL(pathFile).pathname;
      }
      if (opts.prefix) {
        if (opts.prefix !== "/") {
          if (opts.prefix[0] !== "/")
            opts.prefix = "/" + opts.prefix;
          if (!rev.path.startsWith(opts.prefix))
            return next();
          pathFile = pathFile.replace(opts.prefix, "");
        }
      }
      const idx = pathFile.lastIndexOf(".");
      if (pathFile.slice((idx - 1 >>> 0) + 2) === "") {
        if (pathFile.endsWith("/"))
          pathFile += index;
        else
          pathFile += "/" + index;
      }
      return await sendFile(rev, decURIComponent(pathFile), opts);
    } catch {
      return next();
    }
  };
}
var serve_static_default = serveStatic;
export {
  serve_static_default as default,
  sendFile,
  serveStatic
};
