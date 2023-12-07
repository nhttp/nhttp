import { type FC, type HTMLAttributes } from "./index";
export type HelmetRewind = {
    head: JSX.Element[];
    footer: JSX.Element[];
    attr: {
        body: HTMLAttributes;
        html: HTMLAttributes;
    };
    body?: JSX.Element;
};
type FCHelmet = FC<{
    footer?: boolean;
    children?: JSX.Element[] | JSX.Element | any;
}> & {
    /**
     * Rewind Helmet.
     * @example
     * const { head, footer, body, attr } = Helmet.rewind(<App />);
     */
    rewind: (elem?: JSX.Element) => HelmetRewind;
    /**
     * Custom render.
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
    writeHtmlAttr?: () => HTMLAttributes;
    writeBodyAttr?: () => HTMLAttributes;
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
