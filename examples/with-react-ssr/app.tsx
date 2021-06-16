import { React, ReactRouterDom } from "./deps-client.ts";
import { routes } from "./routes.tsx";
import { Navbar } from "./component/Navbar.tsx";

const { Switch, Route } = ReactRouterDom;

export const App = ({ isServer, Component, initData }: any) => {
  if (isServer) {
    return (
      <>
        <Navbar />
        <Component initData={initData} />
      </>
    );
  }

  return (
    // <Context
    <React.Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <Switch>
        {routes.map((el, x) => {
          return <Route
            {...el}
            key={x}
            component={(props: any) => {
              let _initData;
              if ((window as any).__INITIAL_DATA__) {
                _initData = initData;
                delete (window as any).__INITIAL_DATA__;
              }
              if (el.seo) {
                //@ts-ignore
                document.title = el.seo.title;
              }
              return <el.component {...props} initData={_initData} />;
            }}
          />;
        })}
      </Switch>
    </React.Suspense>
  );
};
