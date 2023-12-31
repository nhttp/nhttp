import {
  inline,
  install as installOri
} from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";
import { internal, options } from "./render.js";
const install = (config = {}, isProduction) => {
  return installOri({
    presets: [presetAutoprefix(), presetTailwind()],
    ...config
  }, isProduction);
};
install();
const useTwindServer = (opts) => {
  if (internal.twindServer)
    return;
  internal.twindServer = true;
  const writeHtml = options.onRenderHtml;
  options.onRenderHtml = (html, rev) => {
    return writeHtml(inline(html, opts), rev);
  };
};
const twindServer = (opts) => {
  useTwindServer(opts);
  return void 0;
};
var twind_server_default = useTwindServer;
export {
  twind_server_default as default,
  install,
  twindServer,
  useTwindServer
};
