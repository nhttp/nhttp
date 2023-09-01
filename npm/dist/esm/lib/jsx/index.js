import { Helmet } from "./helmet.js";
export * from "./render.js";
export * from "./helmet.js";
const dangerHTML = "dangerouslySetInnerHTML";
const isValue = (val) => val != null;
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const toStyle = (val) => {
  return Object.keys(val).reduce(
    (a, b) => a + b.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + (typeof val[b] === "number" ? val[b] + "px" : val[b]) + ";",
    ""
  );
};
function n(type, props, ...args) {
  props ??= {};
  if (isValue(props.children))
    args = args.concat(props.children);
  const children = args.flat().map((el) => typeof el === "number" ? String(el) : el).filter(Boolean);
  if (typeof type === "function") {
    if (children.length) {
      props.children = children.join("");
    }
    return type(props);
  }
  let elem = `<${type}`;
  for (const k in props) {
    let val = props[k];
    if (isValue(val) && k !== dangerHTML && k !== "children" && typeof val !== "function") {
      val = typeof val === "object" ? toStyle(val) : val === true ? "" : val === false ? null : val;
      if (isValue(val)) {
        let key = k.toLowerCase();
        if (key === "classname")
          key = "class";
        elem += ` ${key}${val === "" ? "" : `="${escapeHtml(val)}"`}`;
      }
    }
  }
  elem += ">";
  if (/area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/.test(type))
    return elem;
  if (props[dangerHTML]) {
    const val = props[dangerHTML].__html;
    elem += val;
  } else {
    children.forEach((child) => {
      if (isValue(child)) {
        if (typeof child === "string")
          elem += child;
        else if (child.pop)
          elem += child.join("");
      }
    });
  }
  return elem += type ? `</${type}>` : "";
}
function h(type, props, ...args) {
  return n(type, props, ...args);
}
const Fragment = ({ children }) => children;
n.Fragment = Fragment;
h.Fragment = Fragment;
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
  h,
  n
};
