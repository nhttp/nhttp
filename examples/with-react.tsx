import React from "https://esm.sh/stable/react@18.2.0";
import nhttp from "../mod.ts";
import { FC } from "../lib/jsx.ts";
import { renderToString } from "https://esm.sh/stable/react-dom@18.2.0/server";
import { options, renderToHtml } from "../lib/jsx/render.ts";
import Helmet from "../lib/jsx/helmet.ts";

options.onRenderElement = (elem) => {
  Helmet.render = renderToString;
  const body = Helmet.render(elem);
  return body;
};

const Home: FC<{ title: string; name: string }> = (props) => {
  return (
    <>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <h1>Wellcome {props.name}</h1>
    </>
  );
};

const app = nhttp();

app.engine(renderToHtml);

app.get("/:name", (rev) => {
  return <Home title="home page" name={rev.params.name} />;
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
