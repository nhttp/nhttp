import { isValidElement } from "./is-valid-element";
type TRet = any;
declare global {
    namespace JSX {
        type Element = TRet;
        interface IntrinsicElements {
            [k: string]: TRet;
        }
    }
}
type JsxProps = {
    children?: TRet;
};
export type FC<T extends unknown = unknown> = (props: JsxProps & T) => JSX.Element;
export { isValidElement };
export declare function n(type: TRet, props: TRet | undefined | null, ...args: TRet[]): any;
export declare namespace n {
    var Fragment: FC<unknown>;
}
export declare function h(type: TRet, props: TRet | undefined | null, ...args: TRet[]): any;
export declare namespace h {
    var Fragment: FC<unknown>;
}
export declare const Fragment: FC;
