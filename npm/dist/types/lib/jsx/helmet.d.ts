import { FC } from "./index";
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
    rewind: (elem?: JSX.Element) => HelmetRewind;
    render?: (elem: JSX.Element) => JSX.Element;
    writeHeadTag?: () => string[];
    writeFooterTag?: () => string[];
    writeHtmlAttr?: () => Attr;
    writeBodyAttr?: () => Attr;
};
export declare const Helmet: FCHelmet;
export default Helmet;
