import { Helmet } from "./helmet.js";
import {
  escapeHtml,
  isValidElement,
  options,
  renderToHtml,
  renderToString,
  toStyle
} from "./render.js";
import { Helmet as Helmet2 } from "./helmet.js";
export * from "./hook.js";
export * from "./types.js";
export * from "./htmx.js";
export * from "./stream.js";
const dangerHTML = "dangerouslySetInnerHTML";
const Fragment = ({ children }) => children;
function n(type, props, ...children) {
  return {
    type,
    props: children.length > 0 ? { ...props, children } : props,
    key: null,
    // fast check nhttp jsx
    __n__: true
  };
}
n.Fragment = Fragment;
const Client = (props) => {
  props.footer ??= true;
  return n(Fragment, {}, [
    n(
      Helmet,
      { footer: props.footer },
      n(
        "script",
        { src: props.src }
      )
    ),
    n(props.type ?? "div", { id: props.id }, props.children)
  ]);
};
const Script = ({ children, ...props }) => {
  props.dangerouslySetInnerHTML = { __html: children ?? "" };
  return n("script", props);
};
const Style = ({ children, ...props }) => {
  props.dangerouslySetInnerHTML = { __html: children ?? "" };
  return n("style", props);
};
export {
  Client,
  Fragment,
  Helmet2 as Helmet,
  Script,
  Style,
  dangerHTML,
  escapeHtml,
  n as h,
  isValidElement,
  n,
  options,
  renderToHtml,
  renderToString,
  toStyle
};
