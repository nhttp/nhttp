import { createHookLib } from "./hook.js";
import { internal } from "./render.js";
const useTwind = (opts = {}) => {
  if (internal.twind)
    return;
  internal.twind = true;
  opts.src ??= "//cdn.twind.style";
  createHookLib(opts);
};
const twind = (opts = {}) => {
  return (rev, next) => {
    opts.src ??= "//cdn.twind.style";
    createHookLib(opts, rev);
    return next();
  };
};
var twind_default = useTwind;
export {
  twind_default as default,
  twind,
  useTwind
};
