import {
  Helmet,
  n,
  options,
  toStyle
} from "./index.js";
import { renderToString, toAttr } from "./render.js";
const s_int = Symbol("internal_hook");
const isArray = Array.isArray;
let HAS_CHECK_HOOK;
function checkHook(elem) {
  return HAS_CHECK_HOOK ??= (() => {
    if (isArray(elem))
      elem = elem[0];
    return options.requestEventContext && elem?.__n__ !== void 0;
  })();
}
function createContext(initValue) {
  const arr = [];
  let idx = 0;
  const reset = (last, i = 0, len = arr.length) => {
    while (i < len) {
      if (arr[i].i === last) {
        arr.splice(i, 1);
        break;
      }
      i++;
    }
    if (arr.length === 0)
      idx = 0;
  };
  return {
    getValue: () => arr[arr.length - 1]?.v?.(),
    async Provider({ value, children }) {
      const i = idx--;
      arr.push({ i, v: () => value ?? initValue });
      const child = await renderToString(children);
      reset(i);
      return n("", {
        dangerouslySetInnerHTML: { __html: child }
      });
    }
  };
}
function useContext(context) {
  return context.getValue();
}
const RevContext = createContext();
function elemToRevContext(elem, rev) {
  if (checkHook(elem)) {
    return RevContext.Provider({ value: rev, children: elem });
  }
  return elem;
}
const useRequestEvent = () => useContext(RevContext);
const useInternalHook = (rev) => {
  rev ??= useRequestEvent();
  return rev[s_int] ??= {
    id: 0,
    js_id: 0,
    sus: [],
    sus_id: 0
  };
};
const useParams = () => useRequestEvent()?.params;
const useQuery = () => useRequestEvent()?.query;
const useBody = () => useRequestEvent()?.body;
const useResponse = () => useRequestEvent()?.response;
const useRequest = () => useRequestEvent()?.request;
function useScript(fn, params, options2 = {}) {
  let js_string = "";
  if (typeof fn === "string") {
    js_string = fn;
  } else if (typeof fn === "function") {
    js_string = fn.toString();
  } else {
    return useScript(params, fn, options2);
  }
  options2.writeToHelmet ??= true;
  const { position, writeToHelmet: isWrite, ...rest } = options2;
  const toScript = () => {
    const src2 = `(${js_string})`;
    const arr = src2.split(/\n/);
    let str = "", i = 0;
    while (i < arr.length) {
      const line = arr[i];
      if (line.includes("//") || line.includes("*"))
        str += `
${line}
`;
      else
        str += line.replace(/\s\s+/g, " ");
      i++;
    }
    return str;
  };
  const pos = position === "head" ? "writeHeadTag" : "writeFooterTag";
  const last = Helmet[pos]?.() ?? [];
  const src = toScript() + `(${JSON.stringify(params ?? {})});`;
  if (isWrite) {
    Helmet[pos] = () => [
      ...last,
      n("script", {
        ...rest,
        dangerouslySetInnerHTML: {
          __html: src
        }
      })
    ];
  }
  return src;
}
const cssToString = (css) => {
  let str = "";
  for (const k in css) {
    str += `${k}{${toStyle(css[k])}}`;
  }
  return str;
};
function useStyle(css, options2 = {}) {
  const rev = useRequestEvent();
  if (rev.hxRequest)
    options2.position = "footer";
  const str = typeof css === "string" ? css : cssToString(css);
  const pos = options2.position === "footer" ? "writeFooterTag" : "writeHeadTag";
  const last = Helmet[pos]?.() ?? [];
  Helmet[pos] = () => [
    ...last,
    n("style", { type: "text/css", dangerouslySetInnerHTML: { __html: str } })
  ];
}
const useId = () => performance.now().toString(36).replace(".", "").slice(3);
const createHookScript = (opts = {}, rev) => {
  const script = `<script${toAttr(opts)}></script>`;
  if (rev !== void 0) {
    rev.__init_head ??= "";
    rev.__init_head += script;
    return;
  }
  options.initHead ??= "";
  options.initHead += script;
};
export {
  RevContext,
  checkHook,
  createContext,
  createHookScript,
  elemToRevContext,
  s_int,
  useBody,
  useContext,
  useId,
  useInternalHook,
  useParams,
  useQuery,
  useRequest,
  useRequestEvent,
  useResponse,
  useScript,
  useStyle
};
