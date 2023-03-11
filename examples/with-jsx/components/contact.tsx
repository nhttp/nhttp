/** @jsx n */
/** @jsxFrag n.Fragment */

import { FC, Helmet, n } from "../deps.ts";
import Layout from "./layout.tsx";

const Contact: FC<{ title: string }> = (props) => {
  return (
    <>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <Layout id="contact">
        <h1>Contact Page</h1>
      </Layout>
    </>
  );
};

export default Contact;
