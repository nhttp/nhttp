import { Fragment, n } from "./index.js";
const createElem = (name, props) => {
  const { children = [], ...rest } = props ?? {};
  const args = children.pop ? children : [children];
  return n(name, rest, ...args);
};
export {
  Fragment,
  createElem as jsx,
  createElem as jsxDev,
  createElem as jsxs
};
