import Helmet from "./helmet.js";
const renderToString = (elem) => elem;
const options = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString
};
const toHtml = (body, { bodyTag, headTag, htmlAttr, bodyAttr }) => {
  return `<!DOCTYPE html><html${htmlAttr ? ` ${htmlAttr}` : ""}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${headTag ? `${headTag.join("")}` : ""}</head><body${bodyAttr ? ` ${bodyAttr}` : ""}>${body}${bodyTag ? `${bodyTag.join("")}` : ""}</body></html>`;
};
const renderToHtml = (elem) => {
  const body = options.onRenderElement(elem);
  return options.onRenderHtml(toHtml(body, Helmet.rewind()));
};
const isValidElement = (elem) => {
  if (typeof elem === "string" && elem[0] === "<")
    return true;
  if (typeof elem === "object") {
    if (typeof elem.type === "function")
      return true;
    const has = (k) => Object.hasOwn(elem, k);
    if (has("type") && has("props") && has("key"))
      return true;
  }
  return false;
};
renderToHtml.check = isValidElement;
export {
  isValidElement,
  options,
  renderToHtml,
  renderToString
};
