import { React, ReactDOM, ReactRouterDom } from "./deps-client.ts";
import { App } from "./app.tsx";

const { BrowserRouter } = ReactRouterDom;

// need hydrate when SSR
ReactDOM.hydrate(
  <BrowserRouter>
    <App initData={(window as any).__INITIAL_DATA__} />
  </BrowserRouter>,
  //@ts-ignore
  document.getElementById("root"),
);
