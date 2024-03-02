import { createHookScript } from "./hook.js";
import { internal } from "./render.js";
const useTwind = (opts = {}) => {
  if (internal.twind)
    return;
  internal.twind = true;
  opts.src ??= "https://cdn.twind.style";
  opts.crossOrigin ??= "";
  createHookScript(opts);
};
const twind = (opts = {}) => {
  opts.src ??= "//cdn.twind.style";
  return (rev, next) => {
    createHookScript(opts, rev);
    return next();
  };
};
var twind_default = useTwind;
export {
  twind_default as default,
  twind,
  useTwind
};
