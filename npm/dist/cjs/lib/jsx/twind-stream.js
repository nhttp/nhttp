var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var twind_stream_exports = {};
__export(twind_stream_exports, {
  default: () => twind_stream_default,
  install: () => import_twind_server.install,
  twindStream: () => twindStream,
  useTwindStream: () => useTwindStream
});
module.exports = __toCommonJS(twind_stream_exports);
var import_readableStream = __toESM(require("@twind/with-react/readableStream"), 1);
var import_render = require("./render");
var import_twind_server = require("./twind-server");
(0, import_twind_server.install)();
const useTwindStream = ({ htmx, ...opts } = {}) => {
  const writeStream = import_render.options.onRenderStream;
  import_render.options.onRenderStream = (stream, rev) => {
    return writeStream(stream.pipeThrough(new import_readableStream.default(opts)), rev);
  };
  const writeElem = (0, import_twind_server.onRenderElement)({ htmx, ...opts });
  return { writeStream, writeElem };
};
const twindStream = (opts) => {
  return async (_rev, next) => {
    const { writeStream, writeElem } = useTwindStream(opts);
    await next();
    import_render.options.onRenderStream = writeStream;
    import_render.options.onRenderElement = writeElem;
  };
};
var twind_stream_default = useTwindStream;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install,
  twindStream,
  useTwindStream
});
