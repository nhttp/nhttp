import { isValidElement } from "./is-valid-element.ts";

// deno-lint-ignore no-explicit-any
type TRet = any;
const dangerHTML = "dangerouslySetInnerHTML";
declare global {
  namespace JSX {
    // @ts-ignore: elem
    type Element = TRet;
    interface IntrinsicElements {
      // @ts-ignore: just any elem
      [k: string]: TRet;
    }
  }
}
type JsxProps = {
  children?: TRet;
};
export type FC<T extends unknown = unknown> = (
  props: JsxProps & T,
) => JSX.Element;

export { isValidElement };
const isValue = <T>(val: T) => val != null;
function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
const toStyle = (val: Record<string, TRet>) => {
  return Object.keys(val).reduce(
    (a, b) =>
      a +
      b
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase() +
      ":" +
      (typeof val[b] === "number" ? val[b] + "px" : val[b]) +
      ";",
    "",
  );
};
export function n(
  type: TRet,
  props: TRet | undefined | null,
  ...args: TRet[]
) {
  props ??= {};
  if (isValue(props.children)) args = args.concat(props.children);
  const children = args.flat().map((
    el: TRet,
  ) => (typeof el === "number" ? String(el) : el)).filter(Boolean);
  if (typeof type === "function") {
    if (children.length) {
      props.children = children.join("");
    }
    return type(props);
  }
  let elem = `<${type}`;
  for (const k in props) {
    let val = props[k];
    if (
      isValue(val) &&
      k !== dangerHTML &&
      k !== "children" &&
      typeof val !== "function"
    ) {
      val = typeof val === "object"
        ? toStyle(val)
        : val === true
        ? ""
        : val === false
        ? null
        : val;
      if (isValue(val)) {
        let key = k.toLowerCase();
        if (key === "classname") key = "class";
        elem += ` ${key}${val === "" ? "" : `="${escapeHtml(val)}"`}`;
      }
    }
  }
  elem += ">";
  if (
    /area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/
      .test(type)
  ) return elem;
  if (props[dangerHTML]) {
    const val = props[dangerHTML].__html;
    elem += val;
  } else {
    children.forEach((child: TRet) => {
      if (isValue(child)) {
        if (typeof child === "string") elem += child;
        else if (child.pop) elem += child.join("");
      }
    });
  }
  return (elem += type ? `</${type}>` : "");
}
export function h(type: TRet, props: TRet | undefined | null, ...args: TRet[]) {
  return n(type, props, ...args);
}
export const Fragment: FC = ({ children }) => children;
n.Fragment = Fragment;
h.Fragment = Fragment;
