import {
  install as installOri
} from "@twind/core";
import TwindStream from "@twind/with-react/readableStream";
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
const useTwindStream = (opts) => {
  if (internal.twindStream)
    return;
  internal.twindStream = true;
  const writeStream = options.onRenderStream;
  options.onRenderStream = (stream, rev) => {
    return writeStream(stream.pipeThrough(new TwindStream(opts)), rev);
  };
};
const twindStream = (opts) => {
  useTwindStream(opts);
  return void 0;
};
var twind_stream_default = useTwindStream;
export {
  twind_stream_default as default,
  install,
  twindStream,
  useTwindStream
};
