import { sendFile as sendFileEtag } from "./etag.js";
const sendFile = sendFileEtag;
function serveStatic(dir, opts = {}) {
  opts.index ??= "index.html";
  opts.redirect ??= true;
  return async (rev, next) => {
    try {
      const index = opts.redirect ? opts.index : "";
      let pathFile = dir + rev.path;
      if (opts.prefix) {
        if (opts.prefix[0] !== "/")
          opts.prefix = "/" + opts.prefix;
        if (!rev.url.startsWith(opts.prefix))
          return next();
        pathFile = pathFile.replace(opts.prefix, "");
      }
      if (pathFile.endsWith("/"))
        pathFile += index;
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
