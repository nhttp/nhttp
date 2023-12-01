import { Helmet } from "./helmet.js";
export * from "./render.js";
export * from "./helmet.js";
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
  return n(Fragment, {}, [
    n(
      Helmet,
      { footer: true },
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
