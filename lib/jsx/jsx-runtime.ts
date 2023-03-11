import { Fragment, n } from "./index.ts";
// deno-lint-ignore no-explicit-any
type TRet = any;
type CE = (name: TRet, props: TRet, ...args: TRet) => TRet;
const createElem: CE = (name: TRet, props: TRet) => {
  const { children = [], ...rest } = props ?? {};
  const args = children.pop ? children : [children];
  return n(name, rest, ...args);
};
export { Fragment };
export { createElem as jsx };
export { createElem as jsxs };
export { createElem as jsxDev };
