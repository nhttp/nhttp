import { type RequestEvent, TRet } from "../deps.ts";
import Helmet, { HelmetRewind } from "./helmet.ts";
import { n } from "./index.ts";
import { isValidElement } from "./is-valid-element.ts";

type TOptionsRender = {
  /**
   * Attach on render element.
   * @example
   * options.onRenderElement = (elem, rev) => {
   *   Helmet.render = renderToString;
   *   const str = Helmet.render(elem);
   *   return str;
   * }
   */
  onRenderElement: (elem: TRet, rev: RequestEvent) => string | Promise<string>;
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

/**
 * renderToString.
 * @example
 * const str = renderToString(<App />);
 */
export const renderToString = (elem: JSX.Element): string => <TRet> elem;
export const options: TOptionsRender = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString,
};
export type RenderHTML = ((...args: TRet) => TRet) & {
  check: (elem: TRet) => boolean;
};
const toHtml = (
  body: TRet,
  { head, footer, attr }: HelmetRewind,
) => {
  return "<!DOCTYPE html>" + n("html", { lang: "en", ...attr.html.toJSON() }, [
    n("head", {}, [
      n("meta", { charset: "utf-8" }),
      n("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      }),
      head,
    ]),
    n("body", attr.body.toJSON(), [body, footer]),
  ]);
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
