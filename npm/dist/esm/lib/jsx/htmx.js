import { internal } from "./render.js";
import { createHookLib } from "./hook.js";
const useHtmx = (opts = {}) => {
  if (internal.htmx)
    return;
  internal.htmx = true;
  opts.src ??= "//unpkg.com/htmx.org";
  createHookLib(opts);
};
const htmx = (opts = {}) => {
  internal.htmx = true;
  return (rev, next) => {
    opts.src ??= "//unpkg.com/htmx.org";
    createHookLib(opts, rev);
    return next();
  };
};
export {
  htmx,
  useHtmx
};
