import {
  inline,
  install as installOri
} from "@twind/core";
import TwindStream from "@twind/with-react/readableStream";
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
  const writeHtml = options.onRenderHtml;
  const writeStream = options.onRenderStream;
  options.onRenderHtml = (html, rev) => {
    return writeHtml(inline(html, opts), rev);
  };
  options.onRenderStream = (stream, rev) => {
    return writeStream(stream.pipeThrough(new TwindStream(opts)), rev);
  };
};
var twind_default = useTwind;
export {
  twind_default as default,
  install,
  useTwind
};
