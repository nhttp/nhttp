var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var helmet_exports = {};
__export(helmet_exports, {
  Helmet: () => Helmet,
  default: () => helmet_default
});
class Attr extends Map {
  toString() {
    let str = "";
    this.forEach((v, k) => str += ` ${k}="${v}"`);
    return str.trim();
  }
  toJSON() {
    return Object.fromEntries(this.entries());
  }
}
function toHelmet(olds, childs) {
  const idx = olds.findIndex((el) => el.startsWith("<title>"));
  const latest = childs.map((item) => {
    if (item.startsWith("<title>") && idx !== -1)
      olds.splice(idx, 1);
    return item;
  });
  const arr = latest.concat(olds);
  const res = arr.filter((item, i) => arr.indexOf(item) === i).filter((el) => el[1] !== "/");
  return res;
}
function toAttr(regex, child) {
  const arr = regex.exec(child) ?? [];
  const map = new Attr();
  if (arr[1]) {
    arr[1].split(/\s+/).forEach((el) => {
      if (el.includes("=")) {
        const [k, v] = el.split(/\=/);
        map.set(k, v.replace(/\"/g, ""));
      } else {
        map.set(el, true);
      }
    });
  }
  return map;
}
const Helmet = ({ children, footer }) => {
  children = Helmet.render?.(children) ?? children;
  if (typeof children !== "string")
    return null;
  const arr = children.replace(/></g, ">#$n$#<").split("#$n$#");
  const heads = Helmet.writeHeadTag ? Helmet.writeHeadTag() : [];
  const bodys = Helmet.writeFooterTag ? Helmet.writeFooterTag() : [];
  const childs = [];
  for (let i = 0; i < arr.length; i++) {
    const child = arr[i];
    if (child.startsWith("<html")) {
      Helmet.writeHtmlAttr = () => toAttr(/<html\s([^>]+)>/gm, child);
    } else if (child.startsWith("<body")) {
      Helmet.writeBodyAttr = () => toAttr(/<body\s([^>]+)>/gm, child);
    } else
      childs.push(child);
  }
  if (footer)
    Helmet.writeFooterTag = () => toHelmet(bodys, childs);
  else
    Helmet.writeHeadTag = () => toHelmet(heads, childs);
  return null;
};
Helmet.rewind = (elem) => {
  const data = {
    attr: { body: new Attr(), html: new Attr() },
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
  Helmet.writeHeadTag = void 0;
  Helmet.writeFooterTag = void 0;
  Helmet.writeHtmlAttr = void 0;
  Helmet.writeBodyAttr = void 0;
  return data;
};
var helmet_default = Helmet;
module.exports = __toCommonJS(helmet_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Helmet
});
