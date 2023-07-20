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
  const res = arr.filter((item, i) => arr.indexOf(item) === i).filter((el) => {
    return el !== "</html>" && el !== "</body>";
  });
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
export {
  Helmet,
  helmet_default as default
};
