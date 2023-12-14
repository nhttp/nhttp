/* @jsx h */
import { h } from "https://esm.sh/stable/preact@10.15.0";
import nhttp from "../../mod.ts";
import Counter from "./pages/counter.tsx";
import useRenderSSR from "./helpers/render-ssr.ts";
import { renderToHtml } from "../../lib/jsx/render.ts";

const app = nhttp();

useRenderSSR(app);

app.engine(renderToHtml);

app.get("/", () => <Counter init={10} />);

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
