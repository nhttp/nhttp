import { Fragment } from "./index";
type TRet = any;
type CE = (name: TRet, props: TRet, ...args: TRet) => TRet;
declare const createElem: CE;
export { Fragment };
export { createElem as jsx };
export { createElem as jsxs };
export { createElem as jsxDev };
