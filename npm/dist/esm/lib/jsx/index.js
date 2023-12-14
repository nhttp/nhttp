import { Helmet } from "./helmet.js";
export * from "./render.js";
export * from "./helmet.js";
export * from "./hook.js";
export * from "./types.js";
const dangerHTML = "dangerouslySetInnerHTML";
const Fragment = ({ children }) => children;
function n(type, props, ...children) {
  if (children.length > 0) {
    return { type, props: { ...props, children }, key: null };
  }
  return { type, props, key: null };
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
export {
  Client,
  Fragment,
  dangerHTML,
  n as h,
  n
};
