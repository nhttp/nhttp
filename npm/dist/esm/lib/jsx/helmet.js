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
export {
  Helmet
};
