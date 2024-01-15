var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var helmet_exports = {};
__export(helmet_exports, {
  Helmet: () => Helmet
});
module.exports = __toCommonJS(helmet_exports);
function toHelmet(elems) {
  const helmet = [];
  let hasBase = false;
  let hasTitle = false;
  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    if (elem.type === "base") {
      if (hasBase)
        continue;
      hasBase = true;
    } else if (elem.type === "title") {
      if (hasTitle)
        continue;
      hasTitle = true;
      Helmet.title = elem.props.children[0];
    }
    helmet.push(elem);
  }
  return helmet;
}
const isArray = Array.isArray;
const Helmet = ({ children, footer }) => {
  if (children == null)
    return null;
  if (!isArray(children))
    children = [children];
  const heads = Helmet.writeHeadTag?.() ?? [];
  const bodys = Helmet.writeFooterTag?.() ?? [];
  const elements = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === "html") {
      Helmet.writeHtmlAttr = () => child.props ?? {};
    } else if (child.type === "body") {
      Helmet.writeBodyAttr = () => child.props ?? {};
    } else
      elements.push(child);
  }
  if (footer)
    Helmet.writeFooterTag = () => toHelmet(elements.concat(bodys));
  else
    Helmet.writeHeadTag = () => toHelmet(elements.concat(heads));
  return null;
};
Helmet.reset = () => {
  Helmet.writeHeadTag = void 0;
  Helmet.writeFooterTag = void 0;
  Helmet.writeHtmlAttr = void 0;
  Helmet.writeBodyAttr = void 0;
  Helmet.title = void 0;
};
Helmet.rewind = (elem) => {
  const data = {
    attr: { body: {}, html: {} },
    head: [],
    footer: [],
    body: elem
  };
  if (Helmet.writeHeadTag)
    data.head = Helmet.writeHeadTag();
  if (Helmet.writeFooterTag)
    data.footer = Helmet.writeFooterTag();
  if (Helmet.writeHtmlAttr)
    data.attr.html = Helmet.writeHtmlAttr();
  if (Helmet.writeBodyAttr)
    data.attr.body = Helmet.writeBodyAttr();
  if (Helmet.title !== void 0)
    data.title = Helmet.title;
  Helmet.reset();
  return data;
};
Helmet.render = () => "";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Helmet
});
