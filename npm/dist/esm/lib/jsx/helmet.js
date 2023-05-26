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
export {
  Helmet,
  helmet_default as default
};
