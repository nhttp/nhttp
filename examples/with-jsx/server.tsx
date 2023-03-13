/** @jsx n */
/** @jsxFrag  n.Fragment */

import About from "./components/about.tsx";
import Contact from "./components/contact.tsx";
import Home from "./components/home.tsx";
import { n, nhttp, renderToHtml } from "./deps.ts";

const app = nhttp();

app.engine(renderToHtml);

app.get("/", () => <Home title="welcome home" />);
app.get("/about", () => <About title="welcome about" />);
app.get("/contact", () => <Contact title="welcome contact" />);

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
