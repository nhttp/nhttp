import type { TRet } from "../deps.ts";
import { type JSXElement, type JSXProps, type NJSX } from "./index.ts";

export type HelmetRewind = {
  head: JSX.Element[];
  footer: JSX.Element[];
  attr: {
    body: NJSX.HTMLAttributes;
    html: NJSX.HTMLAttributes;
  };
  body?: JSX.Element;
};
function toHelmet(elems: JSX.Element[]) {
  const helmet: JSX.Element[] = [];
  let hasBase = false;
  let hasTitle = false;
  for (let i = elems.length - 1; i >= 0; i -= 1) {
    const elem = elems[i] as JSXElement;
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
// shiming for support preact/react.
type FCHelmet =
  & ((
    props: JSXProps<{
      footer?: boolean;
      children?: JSX.Element[] | JSX.Element | TRet;
    }>,
  ) => TRet)
  & {
    /**
     * Rewind Helmet.
     * @example
     * const { head, footer, body, attr } = Helmet.rewind(<App />);
     */
    rewind: (elem?: JSX.Element) => HelmetRewind;
    /**
     * Custom render.
     * @deprecated
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
    writeHtmlAttr?: () => NJSX.HTMLAttributes;
    writeBodyAttr?: () => NJSX.HTMLAttributes;
  };
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
      Helmet.writeHtmlAttr = () => (child.props ?? {}) as NJSX.HTMLAttributes;
    } else if (child.type === "body") {
      Helmet.writeBodyAttr = () => (child.props ?? {}) as NJSX.HTMLAttributes;
    } else elements.push(child);
  }
  if (footer) Helmet.writeFooterTag = () => toHelmet(elements.concat(bodys));
  else Helmet.writeHeadTag = () => toHelmet(elements.concat(heads));
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

Helmet.render = () => "";
