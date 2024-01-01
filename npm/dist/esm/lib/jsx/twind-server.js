import {
  inline,
  install as installOri
} from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";
import { options } from "./render.js";
const install = (config = {}, isProduction) => {
  return installOri({
    presets: [presetAutoprefix(), presetTailwind()],
    ...config
  }, isProduction);
};
install();
const useTwindServer = (opts) => {
  const writeHtml = options.onRenderHtml;
  options.onRenderHtml = (html, rev) => {
    return writeHtml(inline(html, opts), rev);
  };
  return writeHtml;
};
const twindServer = (opts) => {
  return async (_rev, next) => {
    const last = useTwindServer(opts);
    await next();
    options.onRenderHtml = last;
  };
};
var twind_server_default = useTwindServer;
export {
  twind_server_default as default,
  install,
  twindServer,
  useTwindServer
};
