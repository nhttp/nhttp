import { TRet } from "../deps.ts";
import Helmet, { HelmetRewind } from "./helmet.ts";

type TOptionsRender = {
  onRenderElement: (elem: TRet) => string | Promise<string>;
  onRenderHtml: (html: string) => string | Promise<string>;
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
export const renderToHtml: RenderHTML = (elem) => {
  const body = options.onRenderElement(elem);
  const render = (str: string) => {
    return options.onRenderHtml(toHtml(str, Helmet.rewind()));
  };
  if (body instanceof Promise) return body.then(render);
  return render(body);
};

export const isValidElement = (elem: JSX.Element) => {
  if (typeof elem === "string" && elem[0] === "<") return true;
  if (typeof elem === "object") {
    if (typeof elem.type === "function") return true;
    const has = (k: string) => Object.hasOwn(elem, k);
    if (has("type") && has("props") && has("key")) return true;
  }
  return false;
};

renderToHtml.check = isValidElement;
