import type { TDecorator } from "./controller.ts";
import type { TObject, TRet } from "./deps.ts";
import { swaggerUi } from "./swagger/swagger_ui.ts";
import type {
  TApiDoc,
  TOpenApi,
  TOptionServe,
  TParameterObject,
  TRequestBodyObject,
  TSchemaObject,
  TTagObject,
} from "./swagger/types.ts";
declare global {
  // deno-lint-ignore no-var
  var NHttpMetadata: TRet;
}
function joinProperty(target: TObject, prop: string, object: TObject) {
  const metadata = globalThis.NHttpMetadata;
  const className = target.constructor.name;
  metadata[className] = metadata[className] || {};
  const obj = metadata[className]["doc_paths"] || {};
  obj[prop] = obj[prop] || {};
  obj[prop]["property"] = obj[prop]["property"] || {};
  Object.assign(obj[prop]["property"], object);
  metadata[className]["doc_paths"] = obj;
}

function addSecurity(className: string, name: string, values: TRet) {
  const metadata = globalThis.NHttpMetadata;
  const security = [
    {
      [name]: values || [],
    },
  ];
  const paths = metadata[className]["doc_paths"];
  for (const key in paths) {
    if (paths[key]) {
      paths[key]["property"]["security"] =
        (paths[key]["property"]["security"] || []).concat(security);
    }
  }
  metadata[className]["doc_paths"] = paths;
}
export function ApiOperation(object: TApiDoc): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const metadata = globalThis.NHttpMetadata;
    if (!object.responses) {
      object.responses = {};
    }
    const className = target.constructor.name;
    const info = metadata[className]["route"][prop];
    const obj = metadata[className]["doc_paths"] || {};
    obj[prop] = {
      path: info.path,
      method: info.method,
      property: object,
    };
    metadata[className]["doc_paths"] = obj;
    return des;
  };
}
export function ApiResponse(
  status: number,
  object: TRequestBodyObject,
): TDecorator {
  if (object.schema) {
    object.content = {};
    if (typeof object.schema === "function") {
      object.content = {
        "application/json": {
          schema: {
            "$ref": "#/components/schemas/" + object.schema.name,
          },
        },
      };
    } else if (typeof object.schema === "object") {
      const obj = object.schema as Record<string, new (...args: TRet) => TRet>;
      for (const g in obj) {
        object.content[g] = {
          schema: {
            "$ref": "#/components/schemas/" + obj[g].name,
          },
        };
      }
    }
  }
  const _status = status.toString();
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const metadata = globalThis.NHttpMetadata;
    const className = target.constructor.name;
    const obj = metadata[className]["doc_paths"] || {};
    obj[prop] = obj[prop] || {};
    obj[prop]["property"] = obj[prop]["property"] || {};
    obj[prop]["property"]["responses"][_status] = object;
    metadata[className]["doc_paths"] = obj;
    return des;
  };
}
export function ApiParameter(object: TParameterObject): TDecorator {
  const parameters = [object];
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const metadata = globalThis.NHttpMetadata;
    const className = target.constructor.name;
    const obj = metadata[className]["doc_paths"] || {};
    obj[prop] = obj[prop] || {};
    obj[prop]["property"] = obj[prop]["property"] || {};
    obj[prop]["property"]["parameters"] =
      (obj[prop]["property"]["parameters"] || []).concat(parameters);
    metadata[className]["doc_paths"] = obj;
    return des;
  };
}
export function ApiSchema(name: string, object: TSchemaObject): TDecorator {
  return (_target: TObject, _prop: string, des: PropertyDescriptor) => {
    const metadata = globalThis.NHttpMetadata;
    metadata["doc_schemas"] = metadata["doc_schemas"] || {};
    metadata["doc_schemas"][name] = object;
    return des;
  };
}
export function ApiBearerAuth(name = "bearerAuth", values?: TRet): TDecorator {
  return (target: TObject) => {
    addSecurity(target.name, name, values);
  };
}
export function ApiOAuth2(name = "oauth2", values?: TRet): TDecorator {
  return (target: TObject) => {
    addSecurity(target.name, name, values);
  };
}
export function ApiApiKey(name = "api_key", values?: TRet): TDecorator {
  return (target: TObject) => {
    addSecurity(target.name, name, values);
  };
}
export function ApiBasicAuth(name = "basicAuth", values?: TRet): TDecorator {
  return (target: TObject) => {
    addSecurity(target.name, name, values);
  };
}
export function ApiCookieAuth(name = "cookieAuth", values?: TRet): TDecorator {
  return (target: TObject) => {
    addSecurity(target.name, name, values);
  };
}
export function ApiRequestBody(object: TRequestBodyObject): TDecorator {
  if (object.content) {
    if (object.schema) {
      delete object.schema;
    }
    return (target: TObject, prop: string, des: PropertyDescriptor) => {
      joinProperty(target, prop, { requestBody: object });
      return des;
    };
  }
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    let content = {} as TRet;
    if (typeof object.schema === "function") {
      content = {
        "application/json": {
          schema: {
            "$ref": "#/components/schemas/" + object.schema.name,
          },
        },
      };
    } else {
      const obj = object.schema;
      for (const k in obj) {
        content[k] = {
          schema: {
            "$ref": "#/components/schemas/" + obj[k].name,
          },
        };
      }
    }
    joinProperty(target, prop, {
      requestBody: {
        description: object.description,
        required: object.required,
        content: content,
      },
    });
    return des;
  };
}
export function ApiDocument(objOrArr: TTagObject | TTagObject[]): TDecorator {
  const tags = Array.isArray(objOrArr) ? objOrArr : [objOrArr];
  return (target: TObject) => {
    const metadata = globalThis.NHttpMetadata;
    const className = target.name;
    const route = metadata[className]["route"];
    const paths = metadata[className]["doc_paths"];
    const doc_paths = [] as TRet;
    const tagsName = tags.map((el: TRet) => el.name);
    for (const key in paths) {
      if (paths[key]) {
        paths[key]["property"]["tags"] = tagsName;
        paths[key]["path"] = route[key]["path"];
        const newPath = paths[key]["path"].split("/").map((el: string) => {
          if (el.startsWith(":")) {
            el = `{${el.substring(1)}}`;
          }
          return el;
        }).join("/");
        doc_paths.push({
          ...paths[key],
          path: newPath,
        });
      }
    }
    metadata["doc_paths"] = (metadata["doc_paths"] || []).concat(doc_paths);
    metadata["doc_tags"] = (metadata["doc_tags"] || []).concat(
      tags,
    );
  };
}

export { DocumentBuilder } from "./swagger/builder.ts";

export function swagger(
  app: TRet,
  docUrl: string,
  document: TOpenApi,
  opts: TOptionServe = {},
) {
  const metadata = globalThis.NHttpMetadata;
  const schemas = opts.schemas ?? opts.validationMetadatasToSchemas?.() ?? {};
  const doc_paths = metadata["doc_paths"];
  const schemasOri = metadata["doc_schemas"] || {};
  let i = 0;
  const paths = {} as TRet;
  const len = doc_paths.length;
  for (; i < len; i++) {
    const doc = doc_paths[i];
    paths[doc.path] ??= {};
    paths[doc.path][doc.method.toLowerCase()] = doc.property;
  }
  document.paths = paths;
  document.tags = metadata["doc_tags"];
  document.components["schemas"] = {
    ...schemasOri,
    ...schemas,
  };
  app.get(docUrl + "/swagger-ui-init.js", swaggerUi.serveInitAssets());
  app.get(docUrl, swaggerUi.setup(document, opts));
  app.get(docUrl + "/json", () => document);
}
