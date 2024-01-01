import {
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
const useTwindStream = (opts) => {
  const writeStream = options.onRenderStream;
  options.onRenderStream = (stream, rev) => {
    return writeStream(stream.pipeThrough(new TwindStream(opts)), rev);
  };
  return writeStream;
};
const twindStream = (opts) => {
  return async (_rev, next) => {
    const last = useTwindStream(opts);
    await next();
    options.onRenderStream = last;
  };
};
var twind_stream_default = useTwindStream;
export {
  twind_stream_default as default,
  install,
  twindStream,
  useTwindStream
};
