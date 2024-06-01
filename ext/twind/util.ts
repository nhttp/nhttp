import type { RequestEvent, TRet } from "jsr:@nhttp/nhttp@^0.0.2";
import type { JSX } from "jsr:@nhttp/nhttp@^0.0.2/jsx";
import type { InlineOptions } from "npm:@twind/core@1.1.3";
import type { TOptionsRender } from "jsr:@nhttp/nhttp@^0.0.2/jsx";
import { extract } from "npm:@twind/core@1.1.3";

export const getOptions = (): TOptionsRender =>
  (globalThis as TRet).NHttpJSXOptions;
/**
 * onRenderElement.
 */
export function onRenderElement(
  { htmx, ...opts }: InlineOptions & { htmx?: boolean } = {},
): (elem: JSX.Element, rev: RequestEvent) => string | Promise<string> {
  const opt = getOptions();
  const hxRequest = htmx ?? true;
  const writeElem = opt.onRenderElement;
  opt.onRenderElement = async (elem, rev) => {
    let str = await writeElem(elem, rev);
    if (hxRequest && rev.hxRequest) {
      const { html, css } = extract(str, opts.tw);
      if (css !== "") str = `<style>${css}</style>${html}`;
    }
    return str;
  };
  return writeElem;
}
