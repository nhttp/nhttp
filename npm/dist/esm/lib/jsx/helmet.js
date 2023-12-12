function toHelmet(elems) {
  const helmet = [];
  let hasBase = false;
  let hasTitle = false;
  for (let i = elems.length - 1; i >= 0; i -= 1) {
    const elem = elems[i];
    if (elem.type === "base") {
      if (hasBase)
        continue;
      hasBase = true;
    } else if (elem.type === "title") {
      if (hasTitle)
        continue;
      hasTitle = true;
    }
    helmet.push(elem);
  }
  return helmet.reverse();
}
const Helmet = ({ children, footer }) => {
  if (children == null)
    return null;
  if (!Array.isArray(children))
    children = [children];
  const heads = Helmet.writeHeadTag ? Helmet.writeHeadTag() : [];
  const bodys = Helmet.writeFooterTag ? Helmet.writeFooterTag() : [];
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
  Helmet.writeHeadTag = void 0;
  Helmet.writeFooterTag = void 0;
  Helmet.writeHtmlAttr = void 0;
  Helmet.writeBodyAttr = void 0;
  return data;
};
Helmet.render = () => "";
export {
  Helmet
};
