import ReactClient from "https://dev.jspm.io/react@17.0.2";
import ReactDOMClient from "https://dev.jspm.io/react-dom@17.0.2";
import ReactRouterDomClient from "https://dev.jspm.io/react-router-dom@5.2.0";

const React = ReactClient as any;
const ReactDOM = ReactDOMClient as any;
const ReactRouterDom = ReactRouterDomClient as any;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [k: string]: any;
    }
  }
}

export { React, ReactDOM, ReactRouterDom };
