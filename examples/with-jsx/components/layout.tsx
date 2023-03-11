/** @jsx n */
/** @jsxFrag n.Fragment */

import { FC, n } from "../deps.ts";

const Link: FC<{
  id: string;
  href: string;
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

const Layout: FC<{ id: string }> = ({ id, children }) => {
  return (
    <>
      <nav>
        <Link href="/" id={id}>Home</Link>
        <Link href="/about" id={id}>About</Link>
        <Link href="/contact" id={id}>Contact</Link>
      </nav>
      <div>{children}</div>
    </>
  );
};

export default Layout;
