import { sendFile as sendFileEtag } from "./etag.js";
const sendFile = sendFileEtag;
function serveStatic(dir, opts = {}) {
  opts.index ??= "index.html";
  opts.redirect ??= true;
  if (dir.endsWith("/"))
    dir = dir.slice(0, -1);
  const index = opts.redirect ? opts.index : "";
  return async (rev, next) => {
    try {
      let pathFile = dir + rev.path;
      if (pathFile.startsWith("file://")) {
        pathFile = new URL(pathFile).pathname;
      }
      if (opts.prefix) {
        if (opts.prefix[0] !== "/")
          opts.prefix = "/" + opts.prefix;
        if (!rev.path.startsWith(opts.prefix))
          return next();
        pathFile = pathFile.replace(opts.prefix, "");
      }
      const idx = pathFile.lastIndexOf(".");
      if (pathFile.slice((idx - 1 >>> 0) + 2) === "") {
        if (pathFile.endsWith("/"))
          pathFile += index;
        else
          pathFile += "/" + index;
      }
      return await sendFile(rev, pathFile, opts);
    } catch {
      return next();
    }
  };
}
export {
  sendFile,
  serveStatic
};
