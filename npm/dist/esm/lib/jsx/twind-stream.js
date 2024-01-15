import TwindStream from "@twind/with-react/readableStream";
import { options } from "./render.js";
import {
  install,
  onRenderElement
} from "./twind-server.js";
install();
const useTwindStream = ({ htmx, ...opts } = {}) => {
  const writeStream = options.onRenderStream;
  options.onRenderStream = (stream, rev) => {
    return writeStream(stream.pipeThrough(new TwindStream(opts)), rev);
  };
  const writeElem = onRenderElement({ htmx, ...opts });
  return { writeStream, writeElem };
};
const twindStream = (opts) => {
  return async (_rev, next) => {
    const { writeStream, writeElem } = useTwindStream(opts);
    await next();
    options.onRenderStream = writeStream;
    options.onRenderElement = writeElem;
  };
};
var twind_stream_default = useTwindStream;
export {
  twind_stream_default as default,
  install,
  twindStream,
  useTwindStream
};
