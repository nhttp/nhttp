import { type RequestEvent, TRet } from "../deps.ts";
import Helmet, { HelmetRewind } from "./helmet.ts";
import { n } from "./index.ts";
import { isValidElement } from "./is-valid-element.ts";

type TOptionsRender = {
  onRenderElement: (elem: TRet, rev: RequestEvent) => string | Promise<string>;
  onRenderHtml: (html: string, rev: RequestEvent) => string | Promise<string>;
};

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
export const renderToHtml: RenderHTML = (elem, rev) => {
  const body = options.onRenderElement(elem, rev);
  const render = (str: string) => {
    return options.onRenderHtml(toHtml(str, Helmet.rewind()), rev);
  };
  if (body instanceof Promise) return body.then(render);
  return render(body);
};

renderToHtml.check = isValidElement;
