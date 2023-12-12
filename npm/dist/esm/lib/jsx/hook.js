import {
  Helmet,
  n
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
      useScript(params, fn, options);
      return;
    }
    const i = hook.js_i;
    const app = rev.__app();
    const path = `/__JS__/${now}${i}.js`;
    hook.js_i--;
    if (app.route.GET?.[path] === void 0) {
      app.get(`${path}`, ({ response }) => {
        response.type("js");
        response.setHeader(
          "cache-control",
          "public, max-age=31536000, immutable"
        );
        return `(${js_string})(${JSON.stringify(params ?? null)});`.replace(
          /\s\s+/g,
          " "
        );
      });
    }
    const pos = options.position === "head" ? "writeHeadTag" : "writeFooterTag";
    options.position = void 0;
    options.type ??= "application/javascript";
    options.src = path;
    const last = Helmet[pos]?.() ?? [];
    Helmet[pos] = () => [...last, n("script", options)];
  }
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
  useScript
};
