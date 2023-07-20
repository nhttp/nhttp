import type { FC } from "./index";
declare class Attr extends Map {
    toString(): string;
    toJSON(): any;
}
export type HelmetRewind = {
    head: string[];
    footer: string[];
    attr: {
        body: Attr;
        html: Attr;
    };
    body?: string;
};
type FCHelmet = FC<{
    footer?: boolean;
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
    render?: (elem: JSX.Element) => JSX.Element;
    /**
     * Write head tags.
     * @example
     * const current = Helmet.writeHeadTag?.() ?? [];
     * Helmet.writeHeadTag = () => [
     *   ...current,
     *   `<script src="/client.js"></script>`
     * ];
     */
    writeHeadTag?: () => string[];
    /**
     * Write body tags.
     * @example
     * const current = Helmet.writeFooterTag?.() ?? [];
     * Helmet.writeFooterTag = () => [
     *   ...current,
     *   `<script src="/client.js"></script>`
     * ];
     */
    writeFooterTag?: () => string[];
    writeHtmlAttr?: () => Attr;
    writeBodyAttr?: () => Attr;
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
export default Helmet;
