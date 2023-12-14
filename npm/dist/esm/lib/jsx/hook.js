import {
  Helmet,
  n,
  toStyle
} from "./index.js";
const now = Date.now();
const hook = {
  ctx_i: 0,
  ctx: [],
  js_i: 0,
  id: 0
};
function createContext(initValue) {
  const i = hook.ctx_i++;
  return {
    Provider({ value, children }) {
      hook.ctx[i] = value !== void 0 ? value : initValue;
      return children;
    },
    i
  };
}
function useContext(context) {
  return hook.ctx[context.i];
}
const RevContext = createContext();
const RequestEventContext = (props) => {
  const elem = RevContext.Provider({
    value: props.rev,
    children: props.children
  });
  hook.js_i = 0;
  hook.id = 0;
  return elem;
};
const useRequestEvent = () => useContext(RevContext);
const useParams = () => useRequestEvent()?.params;
const useQuery = () => useRequestEvent()?.query;
const useBody = () => useRequestEvent()?.body;
const useResponse = () => useRequestEvent()?.response;
const useRequest = () => useRequestEvent()?.request;
function useScript(fn, params, options = {}) {
  const rev = useRequestEvent();
  if (rev !== void 0) {
    let js_string = "";
    if (typeof fn === "string") {
      js_string = fn;
    } else if (typeof fn === "function") {
      js_string = fn.toString();
    } else {
      return useScript(params, fn, options);
    }
    const i = hook.js_i;
    const app = rev.__app();
    const path = `/__JS__/${now}${i}.js`;
    hook.js_i--;
    const inline = options.inline;
    const toScript = () => {
      const src = `(${js_string})(${JSON.stringify(params ?? null)});`;
      const arr = src.split(/\n/);
      return arr.map(
        (str) => str.includes("//") || str.includes("*") ? `
${str}
` : str.replace(/\s\s+/g, " ")
      ).join("");
    };
    if (app.route.GET?.[path] === void 0 && !inline) {
      app.get(`${path}`, ({ response }) => {
        response.type("js");
        response.setHeader(
          "cache-control",
          "public, max-age=31536000, immutable"
        );
        return toScript();
      });
    }
    const isWrite = options.writeToHelmet ?? true;
    const pos = options.position === "head" ? "writeHeadTag" : "writeFooterTag";
    options.position = void 0;
    options.inline = void 0;
    options.type ??= "application/javascript";
    const last = Helmet[pos]?.() ?? [];
    const out = {};
    if (inline) {
      out.source = toScript();
      if (isWrite) {
        Helmet[pos] = () => [
          ...last,
          n("script", {
            ...options,
            dangerouslySetInnerHTML: {
              __html: out.source
            }
          })
        ];
      }
    } else {
      options.src = path;
      if (isWrite) {
        Helmet[pos] = () => [...last, n("script", options)];
        out.path = path;
      }
    }
    return out;
  }
  return {};
}
const cssToString = (css) => {
  let str = "";
  for (const k in css) {
    str += `${k}{${toStyle(css[k])}}`;
  }
  return str;
};
useStyle({
  ".selector": {
    backgroundColor: "red"
  },
  ".title": {
    color: "blue"
  }
});
function useStyle(css) {
  const str = typeof css === "string" ? css : cssToString(css);
  const last = Helmet.writeHeadTag?.() ?? [];
  Helmet.writeHeadTag = () => [
    ...last,
    n("style", { type: "text/css", dangerouslySetInnerHTML: { __html: str } })
  ];
}
const useId = () => `:${hook.id--}`;
export {
  RequestEventContext,
  createContext,
  useBody,
  useContext,
  useId,
  useParams,
  useQuery,
  useRequest,
  useRequestEvent,
  useResponse,
  useScript,
  useStyle
};
