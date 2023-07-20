export * from "./render";
export * from "./helmet";
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
/**
 * Function Component (FC).
 * @example
 * const Home: FC<{ title: string; }> = (props) => {
 *   return <h1>{props.title}</h1>
 * }
 */
export type FC<T extends unknown = unknown> = (props: JsxProps & T) => JSX.Element;
export declare function n(type: TRet, props: TRet | undefined | null, ...args: TRet[]): any;
export declare namespace n {
    var Fragment: FC<unknown>;
}
export declare function h(type: TRet, props: TRet | undefined | null, ...args: TRet[]): any;
export declare namespace h {
    var Fragment: FC<unknown>;
}
/**
 * Fragment.
 * @example
 * const Home: FC<{ title: string; }> = (props) => {
 *   return <Fragment><h1>{props.title}</h1></Fragment>
 * }
 */
export declare const Fragment: FC;
/**
 * Client interactive.
 * @example
 * ```jsx
 * const Home = () => {
 *   return (
 *     <Client src="/assets/js/home.js">
 *       <h1 id="text">hey</h1>
 *     </Client>
 *   )
 * }
 * ```
 */
export declare const Client: FC<{
    src: string;
    id?: string;
    type?: string;
}>;
