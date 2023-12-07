import { Helmet } from "./helmet.js";
import { dangerHTML, n } from "./index.js";
import { isValidElement } from "./is-valid-element.js";
const voidTags = Object.assign(/* @__PURE__ */ Object.create(null), {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
});
const REG_HTML = /["'&<>]/;
function escapeHtml(str, force) {
  return options.precompile && !force || !REG_HTML.test(str) ? str : (() => {
    let esc = "", i = 0, l = 0, html = "";
    for (; i < str.length; i++) {
      switch (str.charCodeAt(i)) {
        case 34:
          esc = "&quot;";
          break;
        case 38:
          esc = "&amp;";
          break;
        case 39:
          esc = "&#39;";
          break;
        case 60:
          esc = "&lt;";
          break;
        case 62:
          esc = "&gt;";
          break;
        default:
          continue;
      }
      if (i !== l)
        html += str.substring(l, i);
      html += esc;
      l = i + 1;
    }
    if (i !== l)
      html += str.substring(l, i);
    return html;
  })();
}
function kebab(camelCase) {
  return camelCase.replace(/[A-Z]/g, "-$&").toLowerCase();
}
const kebabList = {
  acceptCharset: "accept-charset",
  httpEquiv: "http-equiv"
};
function withKebabCheck(key) {
  if (kebabList[key] !== void 0)
    return kebab(key);
  return key.toLowerCase();
}
const toStyle = (val) => {
  return Object.keys(val).reduce(
    (a, b) => a + kebab(b) + ":" + (typeof val[b] === "number" ? val[b] + "px" : val[b]) + ";",
    ""
  );
};
const renderToString = (elem) => {
  if (elem == null || typeof elem === "boolean")
    return "";
  if (typeof elem === "number")
    return String(elem);
  if (typeof elem === "string")
    return escapeHtml(elem);
  if (Array.isArray(elem))
    return elem.map(renderToString).join("");
  const { type, props } = elem;
  if (typeof type === "function")
    return renderToString(type(props ?? {}));
  let attributes = "";
  for (const k in props) {
    let val = props[k];
    if (val == null || val === false || k === dangerHTML || k === "children" || typeof val === "function") {
      continue;
    }
    const key = k === "className" ? "class" : withKebabCheck(k);
    if (val === true) {
      attributes += ` ${key}`;
    } else {
      if (key === "style" && typeof val === "object")
        val = toStyle(val);
      attributes += ` ${key}="${escapeHtml(String(val))}"`;
    }
  }
  if (type in voidTags) {
    return `<${type}${attributes}>`;
  }
  if (props?.[dangerHTML] != null) {
    return `<${type}${attributes}>${props[dangerHTML].__html}</${type}>`;
  }
  return `<${type}${attributes}>${renderToString(props?.["children"])}</${type}>`;
};
const options = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString
};
const toHtml = (body, { head, footer, attr }) => {
  const bodyWithFooter = body + renderToString(footer);
  return "<!DOCTYPE html>" + renderToString(
    n("html", { lang: "en", ...attr.html }, [
      n("head", {}, [
        n("meta", { charset: "utf-8" }),
        n("meta", {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0"
        }),
        head
      ]),
      n("body", {
        ...attr.body,
        dangerouslySetInnerHTML: { __html: bodyWithFooter }
      })
    ])
  );
};
const renderToHtml = (elem, rev) => {
  const body = options.onRenderElement(elem, rev);
  const render = (str) => {
    return options.onRenderHtml(toHtml(str, Helmet.rewind()), rev);
  };
  if (body instanceof Promise)
    return body.then(render);
  return render(body);
};
renderToHtml.check = isValidElement;
export {
  escapeHtml,
  isValidElement,
  options,
  renderToHtml,
  renderToString,
  toStyle
};
