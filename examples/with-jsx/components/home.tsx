/** @jsx n */
/** @jsxFrag n.Fragment */

import { FC, Helmet, n, useScript } from "../deps.ts";
import Layout from "./layout.tsx";

const Counter = () => {
  const state = { count: 0 };

  useScript(state, (state) => {
    const $ = (id: string) => {
      const c = document.querySelector("#counter_app");
      return c?.querySelector(`#${id}`) as HTMLElement;
    };

    $("plus").onclick = () => {
      $("count").innerText = String(state.count += 1);
    };

    $("min").onclick = () => {
      $("count").innerText = String(state.count -= 1);
    };
  });

  return (
    <div id="counter_app" style={{ marginBottom: 40 }}>
      <button id="plus">+ Increment</button>
      <h1 id="count">{state.count}</h1>
      <button id="min">- Decrement</button>
    </div>
  );
};

const Home: FC<{ title: string }> = (props) => {
  return (
    <>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <Layout id="home">
        <h1>Home Page</h1>
        <h2>Counter App</h2>
        <Counter />
      </Layout>
    </>
  );
};

export default Home;
