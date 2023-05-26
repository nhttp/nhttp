import { Fragment, n } from "./index.js";
const createElement = (name, props) => {
  const { children = [], ...rest } = props ?? {};
  const args = children.pop ? children : [children];
  return n(name, rest, ...args);
};
export {
  Fragment,
  createElement as jsx,
  createElement as jsxDev,
  createElement as jsxs
};
