import { renderToString } from "https://esm.sh/stable/preact-render-to-string@6.0.3?deps=preact@10.15.0";
import { Helmet, n } from "../../../lib/jsx.ts";
import bundle from "./bundle.ts";
import { NHttp } from "../../../mod.ts";
import { options } from "../../../lib/jsx/render.ts";

export default function useRenderSSR(app: NHttp) {
  options.onRenderElement = (elem) => {
    const clientPath = bundle(app, elem);
    const body = renderToString(elem);
    if (!clientPath) return body;
    const props = JSON.stringify(elem.props);
    const current = Helmet.writeFooterTag?.() ?? [];
    Helmet.writeFooterTag = () => {
      return [
        ...current,
        n("script", {
          dangerouslySetInnerHTML: {
            __html: `window.__INIT_PROPS__=${props}`.replace(/</g, "\\u003c"),
          },
        }),
        n("script", { type: "module", src: clientPath, async: true }),
      ];
    };
    return body;
  };
}
