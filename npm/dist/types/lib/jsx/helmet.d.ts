import type { TRet } from "../deps";
import { type JSXProps, type NJSX } from "./index";
export type HelmetRewind = {
    head: JSX.Element[];
    footer: JSX.Element[];
    attr: {
        body: NJSX.HTMLAttributes;
        html: NJSX.HTMLAttributes;
    };
    body?: JSX.Element;
};
type FCHelmet = ((props: JSXProps<{
    footer?: boolean;
    children?: JSX.Element[] | JSX.Element | TRet;
}>) => TRet) & {
    /**
     * Rewind Helmet.
     * @example
     * const { head, footer, body, attr } = Helmet.rewind(<App />);
     */
    rewind: (elem?: JSX.Element) => HelmetRewind;
    /**
     * Custom render.
     * @deprecated
     */
    render: (elem: JSX.Element) => string;
    /**
     * Write head tags.
     * @example
     * const current = Helmet.writeHeadTag?.() ?? [];
     * Helmet.writeHeadTag = () => [
     *   ...current,
     *   <script src="/client.js"></script>
     * ];
     */
    writeHeadTag?: () => JSX.Element[];
    /**
     * Write body tags.
     * @example
     * const current = Helmet.writeFooterTag?.() ?? [];
     * Helmet.writeFooterTag = () => [
     *   ...current,
     *   <script src="/client.js"></script>
     * ];
     */
    writeFooterTag?: () => JSX.Element[];
    writeHtmlAttr?: () => NJSX.HTMLAttributes;
    writeBodyAttr?: () => NJSX.HTMLAttributes;
};
/**
 * Simple SSR Helmet for SEO
 * @example
 * const Home: FC = (props) => {
 *   return  (
 *     <>
 *       <Helmet>
 *         <title>Home Title</title>
 *       </Helmet>
 *       <h1>Home Page</h1>
 *     </>
 *   )
 * }
 */
export declare const Helmet: FCHelmet;
export {};
