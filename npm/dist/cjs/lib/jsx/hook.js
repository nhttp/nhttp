var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var hook_exports = {};
__export(hook_exports, {
  RevContext: () => RevContext,
  checkHook: () => checkHook,
  createContext: () => createContext,
  createHookScript: () => createHookScript,
  elemToRevContext: () => elemToRevContext,
  s_int: () => s_int,
  useBody: () => useBody,
  useContext: () => useContext,
  useId: () => useId,
  useInternalHook: () => useInternalHook,
  useParams: () => useParams,
  useQuery: () => useQuery,
  useRequest: () => useRequest,
  useRequestEvent: () => useRequestEvent,
  useResponse: () => useResponse,
  useScript: () => useScript,
  useStyle: () => useStyle
});
module.exports = __toCommonJS(hook_exports);
var import_index = require("./index");
var import_render = require("./render");
const s_int = Symbol("internal_hook");
const isArray = Array.isArray;
let HAS_CHECK_HOOK;
function checkHook(elem) {
  return HAS_CHECK_HOOK ??= (() => {
    if (isArray(elem))
      elem = elem[0];
    return import_index.options.requestEventContext && elem?.__n__ !== void 0;
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
      const child = await (0, import_render.renderToString)(children);
      reset(i);
      return (0, import_index.n)("", {
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
    js_string = `function(){${fn}}`;
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
  const last = import_index.Helmet[pos]?.() ?? [];
  const src = toScript() + `(${JSON.stringify(params ?? {})});`;
  if (isWrite) {
    import_index.Helmet[pos] = () => [
      ...last,
      (0, import_index.n)("script", {
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
    str += `${k}{${(0, import_index.toStyle)(css[k])}}`;
  }
  return str;
};
function useStyle(css, options2 = {}) {
  const rev = useRequestEvent();
  if (rev.hxRequest)
    options2.position = "footer";
  const str = typeof css === "string" ? css : cssToString(css);
  const pos = options2.position === "footer" ? "writeFooterTag" : "writeHeadTag";
  const last = import_index.Helmet[pos]?.() ?? [];
  import_index.Helmet[pos] = () => [
    ...last,
    (0, import_index.n)("style", { type: "text/css", dangerouslySetInnerHTML: { __html: str } })
  ];
}
const useId = () => performance.now().toString(36).replace(".", "").slice(3);
const createHookScript = (opts = {}, rev) => {
  const script = `<script${(0, import_render.toAttr)(opts)}></script>`;
  if (rev !== void 0) {
    rev.__init_head ??= "";
    rev.__init_head += script;
    return;
  }
  import_index.options.initHead ??= "";
  import_index.options.initHead += script;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
