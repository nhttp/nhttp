import { Fragment } from "./index";
type TRet = any;
type CE = (name: TRet, props: TRet, ...args: TRet) => TRet;
declare const createElement: CE;
export { Fragment };
export { createElement as jsx };
export { createElement as jsxs };
export { createElement as jsxDev };
