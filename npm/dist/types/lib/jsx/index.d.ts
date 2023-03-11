type TRet = any;
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [k: string]: TRet;
        }
    }
}
type JsxProps = {
    children?: TRet;
};
export type FC<T extends unknown = unknown> = (props: JsxProps & T) => TRet;
export declare function n(name: TRet, props: TRet | undefined | null, ...args: TRet[]): any;
export declare namespace n {
    var Fragment: FC<unknown>;
}
export declare const Fragment: FC;
type FCHelmet = ((props: TRet) => TRet) & {
    head?: () => string[];
    body?: () => string[];
    htmlAttr?: () => string;
    bodyAttr?: () => string;
};
export declare const Helmet: FCHelmet;
export declare const renderToString: (elem: TRet) => any;
export declare const renderToHtml: (elem: TRet) => string;
export {};
