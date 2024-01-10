import {
  type HttpResponse,
  type NHttp,
  type RequestEvent,
  type TObject,
  type TRet,
} from "../deps.ts";
import {
  type EObject,
  Helmet,
  type JSXElement,
  type JSXProps,
  n,
  type NJSX,
  options,
  toStyle,
} from "./index.ts";
import { renderToString, toAttr } from "./render.ts";

const now = Date.now();
type TValue = string | number | TRet;
type TContext = {
  Provider: (props: JSXProps<{ value?: TValue }>) => Promise<TRet>;
  getValue: <T>() => T;
};
export const s_int = Symbol("internal_hook");
const isArray = Array.isArray;
let HAS_CHECK_HOOK: boolean;
export function checkHook(elem: TRet) {
  return HAS_CHECK_HOOK ??= (() => {
    if (isArray(elem)) elem = elem[0];
    return options.requestEventContext && elem?.__n__ !== void 0;
  })();
}
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
export function createContext<T extends unknown = unknown>(
  initValue?: T,
): TContext {
  const arr = [] as TRet[];
  let idx = 0;
  const reset = (last: number, i = 0, len = arr.length) => {
    while (i < len) {
      if (arr[i].i === last) {
        arr.splice(i, 1);
        break;
      }
      i++;
    }
    if (arr.length === 0) idx = 0;
  };
  return {
    getValue: () => arr[arr.length - 1]?.v?.(),
    async Provider({ value, children }) {
      const i = idx--;
      arr.push({ i, v: () => value ?? initValue });
      const child = await renderToString(children);
      reset(i);
      return n("", {
        dangerouslySetInnerHTML: { __html: child },
      });
    },
  };
}
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
export function useContext<T extends unknown = unknown>(context: TContext): T {
  return context.getValue();
}

export const RevContext = createContext();
export function elemToRevContext(
  elem: TRet,
  rev: RequestEvent,
): Promise<JSXElement> {
  if (checkHook(elem)) {
    return RevContext.Provider({ value: rev, children: elem });
  }
  return elem;
}
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
export const useRequestEvent = <T extends EObject = EObject>(): RequestEvent<
  T
> => useContext(RevContext);
export const useInternalHook = (
  rev?: RequestEvent,
): { id: number; js_id: number; sus: TRet[]; sus_id: number } => {
  rev ??= useRequestEvent();
  return rev[s_int] ??= {
    id: 0,
    js_id: 0,
    sus: [],
    sus_id: 0,
  };
};
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
export const useParams = <T = TObject>(): T => useRequestEvent()?.params as T;
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
export const useQuery = <T = TObject>(): T => useRequestEvent()?.query as T;
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
export const useBody = <T = TObject>(): T => useRequestEvent()?.body as T;
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
export const useResponse = (): HttpResponse => useRequestEvent()?.response;
export const useRequest = (): Request => useRequestEvent()?.request;

interface AttrScript extends NJSX.ScriptHTMLAttributes {
  /**
   * position. default to `footer`
   */
  position?: "head" | "footer";
  /**
   * inline script. default to `false`
   */
  inline?: boolean;
  /**
   * write script to Helmet. default to `true`
   */
  writeToHelmet?: boolean;
}
type OutScript = { path?: string; source?: string };
const cst = {} as Record<string, string | boolean>;
/**
 * useScript. simple client-script from server-side.
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
export function useScript<T>(
  params: T,
  js_string: string,
  options?: AttrScript,
): OutScript;
export function useScript<T>(
  params: T,
  fn: (params: T) => void | Promise<void>,
  options?: AttrScript,
): OutScript;
export function useScript<T>(
  fn: (params: T) => void | Promise<void>,
  params?: T,
  options?: AttrScript,
): OutScript;
export function useScript<T>(
  js_string: string,
  params?: T,
  options?: AttrScript,
): OutScript;
export function useScript<T>(
  fn: ((params: T) => void | Promise<void>) | string | T,
  params?: T | ((params: T) => void | Promise<void>) | string,
  options: AttrScript = {},
) {
  const rev = useRequestEvent();
  const hook = useInternalHook(rev);
  if (rev !== void 0) {
    let js_string = "";
    if (typeof fn === "string") {
      js_string = fn;
    } else if (typeof fn === "function") {
      js_string = fn.toString();
    } else {
      return useScript(params as TRet, fn, options);
    }
    const i = hook.js_id;
    const app = rev.__app() as NHttp;
    const id = `${now}${i}`;
    const path = `/__JS__/${id}.js`;
    hook.js_id--;
    const inline = options.inline;
    const toScript = () => {
      const src = `(${js_string})`;
      const arr = src.split(/\n/);
      return arr.map((str) =>
        str.includes("//") || str.includes("*")
          ? `\n${str}\n`
          : str.replace(/\s\s+/g, " ")
      ).join("");
    };
    if (cst[path] === void 0 && !inline) {
      cst[path] = true;
      app.get(`${path}`, ({ response }) => {
        response.type("js");
        response.setHeader(
          "cache-control",
          "public, max-age=31536000, immutable",
        );
        return ((cst[path + "_sc"] as string) ??= toScript()) +
          `(window.__INIT_${id});`;
      });
    }
    const isWrite = options.writeToHelmet ?? true;
    const pos = options.position === "head" ? "writeHeadTag" : "writeFooterTag";
    options.position = void 0;
    options.inline = void 0;
    options.type ??= "application/javascript";
    const last = Helmet[pos]?.() ?? [];
    const out = {} as OutScript;
    const init = params !== void 0
      ? n("script", {
        dangerouslySetInnerHTML: {
          __html: `window.__INIT_${id}=${JSON.stringify(params)}`,
        },
      })
      : void 0;
    if (inline) {
      out.source = toScript();
      if (isWrite) {
        Helmet[pos] = () =>
          [
            ...last,
            init as JSXElement<EObject>,
            n("script", {
              ...options,
              dangerouslySetInnerHTML: {
                __html: out.source as string,
              },
            }),
          ].filter(Boolean);
      }
    } else {
      options.src = path;
      if (isWrite) {
        Helmet[pos] = () =>
          [...last, init as JSXElement<EObject>, n("script", options)].filter(
            Boolean,
          );
        out.path = path;
      }
    }
    return out;
  }
  return {};
}

const cssToString = (css: Record<string, NJSX.CSSProperties>) => {
  let str = "";
  for (const k in css) {
    str += `${k}{${toStyle(css[k])}}`;
  }
  return str;
};
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
export function useStyle(css: Record<string, NJSX.CSSProperties> | string) {
  const str = typeof css === "string" ? css : cssToString(css);
  const last = Helmet.writeHeadTag?.() ?? [];
  Helmet.writeHeadTag = () => [
    ...last,
    n("style", { type: "text/css", dangerouslySetInnerHTML: { __html: str } }),
  ];
}
/**
 * generate unique ID.
 */
export const useId = () => `:${useInternalHook().id--}`;

export const createHookScript = (
  opts: NJSX.ScriptHTMLAttributes = {},
  rev?: RequestEvent,
) => {
  const script = `<script${toAttr(opts)}></script>`;
  if (rev !== void 0) {
    rev.__init_head ??= "";
    rev.__init_head += script;
    return;
  }
  options.initHead ??= "";
  options.initHead += script;
};
