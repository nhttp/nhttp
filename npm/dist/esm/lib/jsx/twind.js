import { internal, options } from "./render.js";
const useTwind = (opts = {}) => {
  if (internal.twind)
    return;
  internal.twind = true;
  opts.src ??= "//cdn.twind.style";
  options.initHead += `<script src="${opts.src}" crossorigin></script>`;
};
const twind = (opts = {}) => {
  useTwind(opts);
  return void 0;
};
var twind_default = useTwind;
export {
  twind_default as default,
  twind,
  useTwind
};
