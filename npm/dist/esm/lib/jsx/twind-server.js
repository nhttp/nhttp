import {
  extract,
  inline,
  install as installOri
} from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";
import { options } from "./render.js";
function onRenderElement({ htmx, ...opts } = {}) {
  const hxRequest = htmx ?? true;
  const writeElem = options.onRenderElement;
  options.onRenderElement = async (elem, rev) => {
    let str = await writeElem(elem, rev);
    if (hxRequest && rev.hxRequest) {
      const { html, css } = extract(str, opts.tw);
      str = `<style>${css}</style>${html}`;
    }
    return str;
  };
  return writeElem;
}
const install = (config = {}, isProduction) => {
  return installOri({
    presets: [presetAutoprefix(), presetTailwind()],
    ...config
  }, isProduction);
};
install();
const useTwindServer = ({ htmx, ...opts } = {}) => {
  const hxRequest = htmx ?? true;
  const writeHtml = options.onRenderHtml;
  const writeElem = onRenderElement({ htmx: hxRequest, ...opts });
  options.onRenderHtml = (html, rev) => {
    return writeHtml(
      hxRequest && rev.hxRequest ? html : inline(html, opts),
      rev
    );
  };
  return { writeHtml, writeElem };
};
const twindServer = (opts) => {
  return async (_rev, next) => {
    const { writeElem, writeHtml } = useTwindServer(opts);
    await next();
    options.onRenderHtml = writeHtml;
    options.onRenderElement = writeElem;
  };
};
var twind_server_default = useTwindServer;
export {
  twind_server_default as default,
  install,
  onRenderElement,
  twindServer,
  useTwindServer
};
