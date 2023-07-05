import { Fragment, n } from "./index.ts";
// deno-lint-ignore no-explicit-any
type TRet = any;

type CrateElement = (type: TRet, props: TRet, ...args: TRet) => TRet;
const createElement: CrateElement = (type, props) => {
  const hasChild = props.children != null;
  const children = hasChild ? props.children : [];
  if (hasChild) delete props.children;
  const arr = children.pop ? children : [children];
  return n(type, props, ...arr);
};
export { Fragment };
export { createElement as jsx };
export { createElement as jsxs };
export { createElement as jsxDev };
export { createElement as jsxDEV };
