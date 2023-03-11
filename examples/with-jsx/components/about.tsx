/** @jsx n */
/** @jsxFrag n.Fragment */

import { FC, Helmet, n } from "../deps.ts";
import Layout from "./layout.tsx";

const About: FC<{ title: string }> = (props) => {
  return (
    <>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <Layout id="about">
        <h1>About Page</h1>
      </Layout>
    </>
  );
};

export default About;
