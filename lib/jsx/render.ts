import { type RequestEvent, TRet } from "../deps.ts";
import Helmet, { HelmetRewind } from "./helmet.ts";
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
  { bodyTag, headTag, htmlAttr, bodyAttr }: HelmetRewind,
) => {
  // deno-fmt-ignore
  return `<!DOCTYPE html><html${htmlAttr ? ` ${htmlAttr}` : ""}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${headTag ? `${headTag.join("")}` : ""}</head><body${bodyAttr ? ` ${bodyAttr}` : ""}>${body}${bodyTag ? `${bodyTag.join("")}` : ""}</body></html>`;
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
