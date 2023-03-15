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
const emreg =
  /area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
export function n(
  type: TRet,
  props: TRet | undefined | null,
  ...args: TRet[]
) {
  props ??= { children: "" };
  if (!type) return "";
  const children = args.map((el) => {
    return typeof el === "number" ? String(el) : el;
  }).filter(Boolean);
  if (typeof type === "function") {
    if (type.name === "Helmet") props.h_children = children;
    else props.children = children.join("");
    return type(props);
  }
  let str = `<${type}`;
  for (const k in props) {
    const val = props[k];
    if (
      val !== undefined &&
      val !== null &&
      k !== dangerHTML &&
      k !== "children"
    ) {
      const type = typeof val;
      if (type === "boolean" || type === "object") {
        if (type === "object") {
          str += ` ${k}="${
            Object.keys(val).reduce(
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
            )
          }"`;
        } else if (val === true) str += ` ${k}`;
        else if (val === false) str += "";
      } else str += ` ${k}="${escapeHtml(val.toString())}"`;
    }
  }
  str += ">";
  if (emreg.test(type)) return str;
  if (props[dangerHTML]) {
    str += props[dangerHTML].__html;
  } else {
    children.forEach((child) => {
      if (typeof child === "string") str += child;
      else if (Array.isArray(child)) str += child.join("");
      else str += String(child);
    });
  }
  return (str += type ? `</${type}>` : "");
}

export const Fragment: FC = ({ children }) => children;
n.Fragment = Fragment;
type FCHelmet = ((props: TRet) => TRet) & {
  head?: () => string[];
  body?: () => string[];
  htmlAttr?: () => string;
  bodyAttr?: () => string;
};

function toHelmet(olds: string[], childs: string[]) {
  const idx = olds.findIndex((el) => el.startsWith("<title>"));
  const latest = childs.map((item: string) => {
    if (item.startsWith("<title>") && idx !== -1) olds.splice(idx, 1);
    return item;
  }) as string[];
  const arr = latest.concat(olds);
  return arr.filter((item, i) => arr.indexOf(item) === i);
}
function toAttr(regex: RegExp, child: string) {
  const arr = regex.exec(child) ?? [];
  return arr.length === 2 ? arr[1] : "";
}
export const Helmet: FCHelmet = ({ h_children, body }) => {
  const heads = Helmet.head?.() ?? [];
  const bodys = Helmet.body?.() ?? [];
  const childs: string[] = [];
  for (let i = 0; i < h_children.length; i++) {
    const child = h_children[i];
    if (child.startsWith("<html")) {
      Helmet.htmlAttr = () => toAttr(/<html\s([^>]+)><\/html>/gm, child);
    } else if (child.startsWith("<body")) {
      Helmet.bodyAttr = () => toAttr(/<body\s([^>]+)><\/body>/gm, child);
    } else childs.push(child);
  }
  if (body) Helmet.body = () => toHelmet(bodys, childs);
  else Helmet.head = () => toHelmet(heads, childs);
  return null;
};
const tt = "\n\t";
const resetHelmet = () => {
  Helmet.head = void 0;
  Helmet.body = void 0;
  Helmet.htmlAttr = void 0;
  Helmet.bodyAttr = void 0;
};
export const renderToString = (elem: JSX.Element): string => elem;
export const renderToHtml = (elem: JSX.Element) => {
  const head = Helmet.head?.();
  const body = Helmet.body?.();
  const htmlAttr = Helmet.htmlAttr?.() ?? `lang="en"`;
  const bodyAttr = Helmet.bodyAttr?.() ?? "";
  resetHelmet();
  // deno-fmt-ignore
  return `<!DOCTYPE html>
<html${htmlAttr ? ` ${htmlAttr}` : ""}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">${head ? `${tt}${head.join(tt)}` : ""}
  </head>
  <body${bodyAttr ? ` ${bodyAttr}` : ""}>
    ${elem}${body ? `${tt}${body.join(tt)}` : ""}
  </body>
</html>`;
};

renderToHtml.directly = true;
