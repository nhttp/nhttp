/** @jsx n */
/** @jsxFrag n.Fragment */

import nhttp from "./../mod.ts";
import { htmx, n, renderToHtml } from "./../lib/jsx.ts";

const app = nhttp();

app.engine(renderToHtml).use(htmx());

app.get("/", () => {
  return (
    <button hx-post="/clicked" hx-swap="outerHTML">
      Click Me
    </button>
  );
});

app.post("/clicked", () => {
  return <span>It's Me</span>;
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
