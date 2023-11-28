/** @jsx n */
/** @jsxFrag n.Fragment */

import { JSXNode } from "../../../lib/jsx.ts";
import { FC, n } from "../deps.ts";

const Link: FC<{
  id: string;
  href: string;
  children: string;
}> = ({ href, id, children }) => {
  return (
    <a
      href={href}
      style={{
        color: id === (href.slice(1) || "home") ? "red" : "blue",
        margin: 5,
      }}
    >
      {children}
    </a>
  );
};

const Layout: FC<{ id: string; children: JSXNode }> = ({ id, children }) => {
  return (
    <>
      <nav>
        <Link href="/" id={id}>Home</Link>
        <Link href="/about" id={id}>About</Link>
        <Link href="/contact" id={id}>Contact</Link>
      </nav>
      <div>{children}</div>
      <footer>Made with {"<3"} using nhttp</footer>
    </>
  );
};

export default Layout;
