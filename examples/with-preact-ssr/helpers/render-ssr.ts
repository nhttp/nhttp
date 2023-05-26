import { renderToString } from "https://esm.sh/preact-render-to-string@6.0.3?deps=preact@10.15.0";
import Helmet from "../../../lib/jsx/helmet.ts";
import bundle from "./bundle.ts";
import { NHttp } from "../../../mod.ts";
import { options } from "../../../lib/jsx/render.ts";

export default function useRenderSSR(app: NHttp) {
  options.onRenderElement = (elem) => {
    const clientPath = bundle(app, elem);
    Helmet.render = renderToString;
    const body = Helmet.render(elem);
    if (!clientPath) return body;
    const props = JSON.stringify(elem.props);
    const current = Helmet.writeBody?.() ?? [];
    Helmet.writeBody = () => {
      return [
        ...current,
        `<script>window.__INIT_PROPS__=${props}</script>`,
        `<script type="module" src="${clientPath}" async=""></script>`,
      ];
    };
    return body;
  };
}
