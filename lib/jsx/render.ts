import type { RequestEvent, TRet } from "../deps.ts";
import { Helmet, type HelmetRewind } from "./helmet.ts";
import { dangerHTML, JSXNode, n } from "./index.ts";
import { isValidElement } from "./is-valid-element.ts";

export { isValidElement };

const voidTags: Record<string, boolean> = Object.assign(Object.create(null), {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
});

type TOptionsRender = {
  /**
   * Attach on render element.
   * @example
   * options.onRenderElement = (elem, rev) => {
   *   const str = renderToString(elem);
   *   return str;
   * }
   */
  onRenderElement: (
    elem: JSX.Element,
    rev: RequestEvent,
  ) => string | Promise<string>;
  /**
   * Attach on render html.
   * @example
   * options.onRenderHtml = (html, rev) => {
   *   // code here
   *   return html;
   * }
   */
  onRenderHtml: (html: string, rev: RequestEvent) => string | Promise<string>;
};

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function kebab(camelCase: string) {
  return camelCase.replace(/[A-Z]/g, "-$&").toLowerCase();
}

const toStyle = (val: Record<string, string | number>) => {
  return Object.keys(val).reduce(
    (a, b) =>
      a +
      kebab(b) +
      ":" +
      (typeof val[b] === "number" ? val[b] + "px" : val[b]) +
      ";",
    "",
  );
};

/**
 * renderToString.
 * @example
 * const str = renderToString(<App />);
 */
// deno-lint-ignore no-explicit-any
export const renderToString = (elem: JSXNode<any>): string => {
  if (elem == null || typeof elem === "boolean") return "";
  if (typeof elem === "number") return String(elem);
  if (typeof elem === "string") return escapeHtml(elem);
  if (Array.isArray(elem)) return elem.map(renderToString).join("");
  const { type, props } = elem;
  if (typeof type === "function") {
    return renderToString(type(props ?? {}));
  }
  let attributes = "";
  for (const k in props) {
    let val = props[k];
    if (
      val == null ||
      val === false ||
      k === dangerHTML ||
      k === "children" ||
      typeof val === "function"
    ) {
      continue;
    }
    const key = k === "className" ? "class" : kebab(k);
    if (val === true) {
      attributes += ` ${key}`;
    } else {
      if (key === "style" && typeof val === "object") val = toStyle(val);
      attributes += ` ${key}="${escapeHtml(String(val))}"`;
    }
  }
  if (type in voidTags) {
    return `<${type}${attributes}>`;
  }
  if (props?.[dangerHTML] != null) {
    return `<${type}${attributes}>${props[dangerHTML].__html}</${type}>`;
  }
  return `<${type}${attributes}>${
    renderToString(props?.["children"])
  }</${type}>`;
};
export const options: TOptionsRender = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString,
};
export type RenderHTML = ((...args: TRet) => TRet) & {
  check: (elem: TRet) => boolean;
};
const toHtml = (body: string, { head, footer, attr }: HelmetRewind) => {
  const bodyWithFooter = body + renderToString(footer);
  return (
    "<!DOCTYPE html>" +
    renderToString(
      n("html", { lang: "en", ...attr.html }, [
        n("head", {}, [
          n("meta", { charset: "utf-8" }),
          n("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          }),
          head,
        ]),
        n("body", {
          ...attr.body,
          dangerouslySetInnerHTML: { __html: bodyWithFooter },
        }),
      ]),
    )
  );
};

/**
 * render to html in `app.engine`.
 * @example
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 */
export const renderToHtml: RenderHTML = (elem, rev) => {
  const body = options.onRenderElement(elem, rev);
  const render = (str: string) => {
    return options.onRenderHtml(toHtml(str, Helmet.rewind()), rev);
  };
  if (body instanceof Promise) return body.then(render);
  return render(body);
};

renderToHtml.check = isValidElement;
