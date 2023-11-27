import { renderToString, type Attributes, type FC } from "./index.ts";

export type HelmetRewind = {
  head: JSX.Element[];
  footer: JSX.Element[];
  attr: {
    body: Attributes;
    html: Attributes;
  };
  body?: JSX.Element;
};
type FCHelmet = FC<{
  footer?: boolean;
  children?: JSX.Element[] | JSX.Element;
}> & {
  /**
   * Rewind Helmet.
   * @example
   * const { head, footer, body, attr } = Helmet.rewind(<App />);
   */
  rewind: (elem?: JSX.Element) => HelmetRewind;
  /**
   * Custom render.
   */
  render: (elem: JSX.Element) => string;
  /**
   * Write head tags.
   * @example
   * const current = Helmet.writeHeadTag?.() ?? [];
   * Helmet.writeHeadTag = () => [
   *   ...current,
   *   <script src="/client.js"></script>
   * ];
   */
  writeHeadTag?: () => JSX.Element[];
  /**
   * Write body tags.
   * @example
   * const current = Helmet.writeFooterTag?.() ?? [];
   * Helmet.writeFooterTag = () => [
   *   ...current,
   *   <script src="/client.js"></script>
   * ];
   */
  writeFooterTag?: () => JSX.Element[];
  writeHtmlAttr?: () => Attributes;
  writeBodyAttr?: () => Attributes;
};

function toHelmet(elems: JSX.Element[]) {
  const helmet: JSX.Element[] = [];
  let hasBase = false;
  let hasTitle = false;
  for (let i = elems.length - 1; i >= 0; i -= 1) {
    const elem = elems[i];
    if (elem.type === "base") {
      if (hasBase) continue;
      hasBase = true;
    } else if (elem.type === "title") {
      if (hasTitle) continue;
      hasTitle = true;
    }
    helmet.push(elem);
  }
  return helmet.reverse();
}

/**
 * Simple SSR Helmet for SEO
 * @example
 * const Home: FC = (props) => {
 *   return  (
 *     <>
 *       <Helmet>
 *         <title>Home Title</title>
 *       </Helmet>
 *       <h1>Home Page</h1>
 *     </>
 *   )
 * }
 */
export const Helmet: FCHelmet = ({ children, footer }) => {
  if (children == null) return null;
  if (!Array.isArray(children)) children = [children];
  const heads = Helmet.writeHeadTag ? Helmet.writeHeadTag() : [];
  const bodys = Helmet.writeFooterTag ? Helmet.writeFooterTag() : [];
  const elements: JSX.Element[] = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === "html") {
      Helmet.writeHtmlAttr = () => child.props ?? {};
    } else if (child.type === "body") {
      Helmet.writeBodyAttr = () => child.props ?? {};
    } else elements.push(child);
  }
  if (footer) Helmet.writeFooterTag = () => toHelmet(bodys.concat(elements));
  else Helmet.writeHeadTag = () => toHelmet(heads.concat(elements));
  return null;
};

Helmet.rewind = (elem) => {
  const data = {
    attr: { body: {}, html: {} },
    head: [],
    footer: [],
    body: elem,
  } as HelmetRewind;
  if (Helmet.writeHeadTag) data.head = Helmet.writeHeadTag();
  if (Helmet.writeFooterTag) data.footer = Helmet.writeFooterTag();
  if (Helmet.writeHtmlAttr) data.attr.html = Helmet.writeHtmlAttr();
  if (Helmet.writeBodyAttr) data.attr.body = Helmet.writeBodyAttr();
  Helmet.writeHeadTag = void 0;
  Helmet.writeFooterTag = void 0;
  Helmet.writeHtmlAttr = void 0;
  Helmet.writeBodyAttr = void 0;
  return data;
};

Helmet.render = (val) => renderToString(val);
