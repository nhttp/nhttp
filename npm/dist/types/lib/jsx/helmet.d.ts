import { TRet } from "../deps";
export type HelmetRewind = {
    headTag?: string[];
    bodyTag?: string[];
    htmlAttr?: string;
    bodyAttr?: string;
};
type FCHelmet = ((props: TRet) => TRet) & {
    rewind: () => HelmetRewind;
    render?: (elem: TRet) => string;
    writeHead?: () => string[];
    writeBody?: () => string[];
    htmlAttr?: () => string;
    bodyAttr?: () => string;
    setHead?: () => void;
};
export declare const Helmet: FCHelmet;
export default Helmet;
