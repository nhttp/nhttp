import { createHookScript } from "./hook.js";
const htmx = (opts = {}) => {
  opts.src ??= "https://unpkg.com/htmx.org@1.9.10";
  return (rev, next) => {
    rev.hxRequest = rev.headers.has("hx-request");
    createHookScript(opts, rev);
    return next();
  };
};
export {
  htmx
};
