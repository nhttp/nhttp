import { Fragment, n } from "./index.ts";
// deno-lint-ignore no-explicit-any
type TRet = any;
type CE = (name: TRet, props: TRet, ...args: TRet) => TRet;
const createElement: CE = (name: TRet, props: TRet) => {
  const { children = [], ...rest } = props ?? {};
  const args = children.pop ? children : [children];
  return n(name, rest, ...args);
};
export { Fragment };
export { createElement as jsx };
export { createElement as jsxs };
export { createElement as jsxDev };
