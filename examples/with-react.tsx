import React from "https://esm.sh/stable/react@18.2.0";
import nhttp from "../mod.ts";
import { FC, Helmet, options, renderToHtml } from "../lib/jsx.ts";
import { renderToString } from "https://esm.sh/stable/react-dom@18.2.0/server";

options.onRenderElement = (elem) => {
  return renderToString(elem);
};

const Home: FC<{ title: string }> = (props) => {
  return (
    <>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <h1>Wellcome Home</h1>
    </>
  );
};

const app = nhttp();

app.engine(renderToHtml);

app.get("/", () => {
  return <Home title="home page" />;
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
