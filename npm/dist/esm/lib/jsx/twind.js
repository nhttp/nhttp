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
const useTwind = (opts) => {
  const hook = options.onRenderHtml;
  options.onRenderHtml = (html) => {
    return hook(inline(html, opts));
  };
};
var twind_default = useTwind;
export {
  twind_default as default,
  install,
  useTwind
};
