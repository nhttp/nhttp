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
var twind_server_exports = {};
__export(twind_server_exports, {
  default: () => twind_server_default,
  install: () => install,
  onRenderElement: () => onRenderElement,
  twindServer: () => twindServer,
  useTwindServer: () => useTwindServer
});
module.exports = __toCommonJS(twind_server_exports);
var import_core = require("@twind/core");
var import_preset_autoprefix = __toESM(require("@twind/preset-autoprefix"), 1);
var import_preset_tailwind = __toESM(require("@twind/preset-tailwind"), 1);
var import_render = require("./render");
function onRenderElement({ htmx, ...opts } = {}) {
  const hxRequest = htmx ?? true;
  const writeElem = import_render.options.onRenderElement;
  import_render.options.onRenderElement = async (elem, rev) => {
    let str = await writeElem(elem, rev);
    if (hxRequest && rev.hxRequest) {
      const { html, css } = (0, import_core.extract)(str, opts.tw);
      str = `<style>${css}</style>${html}`;
    }
    return str;
  };
  return writeElem;
}
const install = (config = {}, isProduction) => {
  return (0, import_core.install)({
    presets: [(0, import_preset_autoprefix.default)(), (0, import_preset_tailwind.default)()],
    ...config
  }, isProduction);
};
install();
const useTwindServer = ({ htmx, ...opts } = {}) => {
  const hxRequest = htmx ?? true;
  const writeHtml = import_render.options.onRenderHtml;
  const writeElem = onRenderElement({ htmx: hxRequest, ...opts });
  import_render.options.onRenderHtml = (html, rev) => {
    return writeHtml(
      hxRequest && rev.hxRequest ? html : (0, import_core.inline)(html, opts),
      rev
    );
  };
  return { writeHtml, writeElem };
};
const twindServer = (opts) => {
  return async (_rev, next) => {
    const { writeElem, writeHtml } = useTwindServer(opts);
    await next();
    import_render.options.onRenderHtml = writeHtml;
    import_render.options.onRenderElement = writeElem;
  };
};
var twind_server_default = useTwindServer;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install,
  onRenderElement,
  twindServer,
  useTwindServer
});
