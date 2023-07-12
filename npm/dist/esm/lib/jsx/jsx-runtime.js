import { Fragment, n } from "./index.js";
const createElement = (type, props) => {
  const hasChild = props.children != null;
  const children = hasChild ? props.children : [];
  if (hasChild)
    delete props.children;
  const arr = children.pop ? children : [children];
  return n(type, props, ...arr);
};
export {
  Fragment,
  createElement as jsx,
  createElement as jsxDEV,
  createElement as jsxDev,
  createElement as jsxs
};
