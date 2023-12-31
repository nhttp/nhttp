import { internal, options } from "./render.js";
const useHtmx = (opts = {}) => {
  if (internal.htmx)
    return;
  internal.htmx = true;
  opts.src ??= "//unpkg.com/htmx.org";
  options.initHead += `<script src="${opts.src}"></script>`;
};
const htmx = (opts = {}) => {
  useHtmx(opts);
  return void 0;
};
export {
  htmx,
  useHtmx
};
