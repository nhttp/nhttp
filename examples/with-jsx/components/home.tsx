/** @jsx n */
/** @jsxFrag n.Fragment */

import { FC, Helmet, n } from "../deps.ts";
import Layout from "./layout.tsx";

const Home: FC<{ title: string }> = (props) => {
  return (
    <>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <Layout id="home">
        <h1>Home Page</h1>
      </Layout>
    </>
  );
};

export default Home;
