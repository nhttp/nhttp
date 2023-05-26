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
function toHelmet(olds, childs) {
  const idx = olds.findIndex((el) => el.startsWith("<title>"));
  const latest = childs.map((item) => {
    if (item.startsWith("<title>") && idx !== -1)
      olds.splice(idx, 1);
    return item;
  });
  const arr = latest.concat(olds);
  return arr.filter((item, i) => arr.indexOf(item) === i);
}
function toAttr(regex, child) {
  const arr = regex.exec(child) ?? [];
  return arr.length === 2 ? arr[1] : "";
}
const Helmet = ({ children, body }) => {
  children = Helmet.render?.(children) ?? children;
  if (typeof children !== "string")
    return null;
  const arr = children.replace(/></g, ">#$n$#<").split("#$n$#");
  const heads = Helmet.writeHead?.() ?? [];
  const bodys = Helmet.writeBody?.() ?? [];
  const childs = [];
  for (let i = 0; i < arr.length; i++) {
    const child = arr[i];
    if (child.startsWith("<html")) {
      Helmet.htmlAttr = () => toAttr(/<html\s([^>]+)><\/html>/gm, child);
    } else if (child.startsWith("<body")) {
      Helmet.bodyAttr = () => toAttr(/<body\s([^>]+)><\/body>/gm, child);
    } else
      childs.push(child);
  }
  if (body)
    Helmet.writeBody = () => toHelmet(bodys, childs);
  else
    Helmet.writeHead = () => toHelmet(heads, childs);
  return null;
};
Helmet.rewind = () => {
  const headTag = Helmet.writeHead?.();
  const bodyTag = Helmet.writeBody?.();
  const htmlAttr = Helmet.htmlAttr?.() ?? `lang="en"`;
  const bodyAttr = Helmet.bodyAttr?.() ?? "";
  Helmet.writeHead = void 0;
  Helmet.writeBody = void 0;
  Helmet.htmlAttr = void 0;
  Helmet.bodyAttr = void 0;
  return { headTag, bodyTag, htmlAttr, bodyAttr };
};
var helmet_default = Helmet;
module.exports = __toCommonJS(helmet_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Helmet
});
