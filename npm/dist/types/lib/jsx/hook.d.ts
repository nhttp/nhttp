import { type HttpResponse, type RequestEvent, type TObject, type TRet } from "../deps";
import { type EObject, type JSXElement, type JSXProps, type NJSX } from "./index";
type TValue = string | number | TRet;
type TContext = {
    Provider: (props: JSXProps<{
        value?: TValue;
    }>) => Promise<TRet>;
    getValue: <T>() => T;
};
export declare const s_int: unique symbol;
export declare function checkHook(elem: TRet): boolean;
/**
 * createContext.
 * @example
 * ```tsx
 * const MyContext = createContext();
 *
 * app.get("/", () => {
 *   return (
 *     <MyContext.Provider value="foo">
 *       // element
 *     </MyContext.Provider>
 *   )
 * })
 * ```
 */
export declare function createContext<T extends unknown = unknown>(initValue?: T): TContext;
/**
 * useContext.
 * @example
 * ```tsx
 * const FooContext = createContext();
 *
 * const Home: FC = () => {
 *   const foo = useContext(FooContext);
 *   return <h1>{foo}</h1>
 * }
 *
 * app.get("/", () => {
 *   return (
 *     <FooContext.Provider value="foo">
 *       <Home/>
 *     </FooContext.Provider>
 *   )
 * })
 * ```
 */
export declare function useContext<T extends unknown = unknown>(context: TContext): T;
export declare const RevContext: TContext;
export declare function elemToRevContext(elem: TRet, rev: RequestEvent): Promise<JSXElement>;
/**
 * useRequestEvent. server-side only.
 * @example
 * ```tsx
 * const Home: FC = () => {
 *   const rev = useRequestEvent();
 *   return <h1>{rev.url}</h1>
 * }
 * ```
 */
export declare const useRequestEvent: <T extends EObject = EObject>() => RequestEvent<T>;
export type InternalHook = {
    sus: TRet[];
    sus_id: number;
};
export declare const useInternalHook: (rev?: RequestEvent) => InternalHook;
/**
 * useParams. server-side only.
 * @example
 * ```tsx
 * const User: FC = () => {
 *   const params = useParams<{ name: string }>();
 *   return <h1>{params.name}</h1>
 * }
 * ```
 */
export declare const useParams: <T = TObject>() => T;
/**
 * useQuery. server-side only.
 * @example
 * ```tsx
 * const User: FC = () => {
 *   const query = useQuery<{ name: string }>();
 *   return <h1>{query.name}</h1>
 * }
 * ```
 */
export declare const useQuery: <T = TObject>() => T;
/**
 * useBody. server-side only.
 * @example
 * ```tsx
 * const User: FC = async () => {
 *   const user = useBody<{ name: string }>();
 *   // example save user to db.
 *   await user_db.save(user);
 *   return <h1>{user.name}</h1>
 * }
 * ```
 */
export declare const useBody: <T = TObject>() => T;
/**
 * useResponse. server-side only.
 * @example
 * ```tsx
 * const User: FC = () => {
 *   const res = useResponse();
 *   res.setHeader("name", "john");
 *   return <h1>hello</h1>
 * }
 * ```
 */
export declare const useResponse: () => HttpResponse;
export declare const useRequest: () => Request;
interface AttrScript extends NJSX.ScriptHTMLAttributes {
    /**
     * position. default to `footer`
     */
    position?: "head" | "footer";
    /**
     * write script to Helmet. default to `true`
     */
    writeToHelmet?: boolean;
}
/**
 * useScript. add client script to the markup.
 * @example
 * ```tsx
 * // without params
 * const User: FC = () => {
 *
 *   useScript(() => {
 *      const title = document.getElementById("title") as HTMLElement;
 *      title.innerText = "bar";
 *   });
 *
 *   return <h1 id="title">foo</h1>
 * }
 *
 * // with params
 * const Home: FC = async () => {
 *   const state = {
 *      data: await db.getAll();
 *   }
 *
 *   useScript(state, (state) => {
 *      const title = document.getElementById("title") as HTMLElement;
 *      title.innerText = "bar";
 *      console.log("data from server =>", state.data);
 *   });
 *
 *   return <h1 id="title">foo</h1>
 * }
 * ```
 */
export declare function useScript<T>(params: T, js_string: string, options?: AttrScript): string;
export declare function useScript<T>(params: T, fn: (params: T) => void | Promise<void>, options?: AttrScript): string;
export declare function useScript<T>(fn: (params: T) => void | Promise<void>, params?: T, options?: AttrScript): string;
export declare function useScript<T>(js_string: string, params?: T, options?: AttrScript): string;
/**
 * useStyle. server-side only.
 * @example
 * ```tsx
 * const Home: FC = () => {
 *   useStyle({
 *     ".section": {
 *       backgroundColor: "red"
 *     },
 *     ".title": {
 *       color: "blue"
 *     }
 *   });
 *   return (
 *     <section className="section">
 *       <h1 className="title">title</h1>
 *     </section>
 *   )
 * }
 * ```
 */
export declare function useStyle(css: Record<string, NJSX.CSSProperties> | string, options?: {
    position?: "head" | "footer";
}): void;
/**
 * generate unique ID.
 */
export declare const useId: () => string;
export declare const createHookScript: (opts?: NJSX.ScriptHTMLAttributes, rev?: RequestEvent) => void;
export {};
