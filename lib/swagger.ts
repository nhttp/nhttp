// swagger.ts
/**
 * @module
 *
 * This module contains swagger-UI in decorators for NHttp.
 *
 * @example
 * ```tsx
 * import nhttp from "@nhttp/nhttp";
 * import { Controller, Post, Get, Status } from "@nhttp/nhttp/controller";
 * import {
 *   ApiDocument,
 *   ApiOperation,
 *   ApiResponse,
 *   DocumentBuilder,
 *   swagger,
 * } from "@nhttp/nhttp/swagger";
 *
 * ⁤@ApiDocument({
 *   name: "Doc user 1.0",
 *   description: "doc user description",
 * })
 * ⁤@Controller("/user")
 * class UserController {
 *
 *    ⁤@ApiResponse(200, { description: "OK" })
 *    ⁤@ApiOperation({ summary: "get user" })
 *    ⁤@Get()
 *    findAll() {...}
 * }
 *
 * const app = nhttp();
 *
 * app.use("/api/v1", new UserController());
 * // or multi controllers
 * // app.use("/api/v1", [new UserController(), new HomeController()]);
 *
 * const document = new DocumentBuilder().setInfo({
 *   title: "Rest APIs for amazing app",
 *   version: "1.0.0",
 *   description: "This is the amazing app",
 * }).addServer("http://localhost:8000").build();
 *
 * // serve swagger
 * swagger(app, "/api-docs", document);
 *
 * app.listen(8000);
 * ```
 */
import type { TDecorator } from "./controller.ts";
import type { TObject, TRet } from "./deps.ts";
import { Metadata } from "./metadata.ts";
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

const assign = Object.assign;
const isObject = (v: TRet) => v && typeof v === "object";

function deepMerge(target: TRet = {}, source: TRet = {}) {
  const output = assign({}, target);
  for (const key in source) {
    if (isObject(source[key]) && !Array.isArray(source[key])) {
      if (!(key in target)) {
        assign(output, { [key]: source[key] });
      } else {
        output[key] = deepMerge(target[key], source[key]);
      }
    } else {
      assign(output, { [key]: source[key] });
    }
  }
  return output;
}

type CreateProperty = {
  target: TObject;
  prop: string;
  property: TObject;
  modify?: (obj: TObject) => void;
};
function createProps({ target, prop, property, modify }: CreateProperty): void {
  const metadata = Metadata.get();
  const className = target.constructor.name;
  metadata[className] ??= {};
  const obj = metadata[className]["route"] ?? {};
  obj[prop] ??= {};
  obj[prop].property = deepMerge(property, obj[prop].property);
  modify?.(obj[prop]);
  metadata[className]["route"] = obj;
}

function addSecurity(className: string, name: string, values: TRet): void {
  const metadata = Metadata.get();
  const security = [
    {
      [name]: values || [],
    },
  ];
  metadata[className] ??= {};
  const route = metadata[className]["route"] ?? {};
  for (const key in route) {
    route[key] ??= {};
    route[key].property ??= {};
    const prev = route[key].property.security ?? [];
    route[key].property.security = prev.concat(security);
  }
  metadata[className]["route"] = route;
}
/**
 * ApiOperation decorators.
 */
export function ApiOperation(object: TApiDoc): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    createProps({ target, prop, property: object });
    return des;
  };
}
/**
 * ApiResponse decorators.
 */
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
    createProps({
      target,
      prop,
      property: { responses: { [_status]: object } },
    });
    return des;
  };
}
/**
 * ApiParameter decorators.
 */
export function ApiParameter(object: TParameterObject): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    createProps({
      target,
      prop,
      property: { parameters: [] },
      modify: (obj) => {
        obj.property.parameters.unshift(object);
      },
    });
    return des;
  };
}
/**
 * ApiSchema decorators.
 */
export function ApiSchema(name: string, object: TSchemaObject): TDecorator {
  return (_target: TObject, _prop: string, des: PropertyDescriptor) => {
    const metadata = Metadata.get();
    metadata["doc_schemas"] ??= {};
    metadata["doc_schemas"][name] = object;
    return des;
  };
}
/**
 * ApiBearerAuth decorators.
 */
export function ApiBearerAuth(name = "bearerAuth", values?: TRet): TDecorator {
  return (target: TObject) => {
    addSecurity(target.name, name, values);
  };
}
/**
 * ApiOAuth2 decorators.
 */
export function ApiOAuth2(name = "oauth2", values?: TRet): TDecorator {
  return (target: TObject) => {
    addSecurity(target.name, name, values);
  };
}
/**
 * ApiApiKey decorators.
 */
export function ApiApiKey(name = "api_key", values?: TRet): TDecorator {
  return (target: TObject) => {
    addSecurity(target.name, name, values);
  };
}
/**
 * ApiBasicAuth decorators.
 */
export function ApiBasicAuth(name = "basicAuth", values?: TRet): TDecorator {
  return (target: TObject) => {
    addSecurity(target.name, name, values);
  };
}
/**
 * ApiCookieAuth decorators.
 */
export function ApiCookieAuth(name = "cookieAuth", values?: TRet): TDecorator {
  return (target: TObject) => {
    addSecurity(target.name, name, values);
  };
}
/**
 * ApiRequestBody decorators.
 */
export function ApiRequestBody(object: TRequestBodyObject): TDecorator {
  if (object.content) {
    if (object.schema) {
      delete object.schema;
    }
    return (target: TObject, prop: string, des: PropertyDescriptor) => {
      createProps({ target, prop, property: { requestBody: object } });
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
    createProps({
      target,
      prop,
      property: {
        requestBody: {
          description: object.description,
          required: object.required,
          content: content,
        },
      },
    });
    return des;
  };
}
/**
 * ApiDocument decorators.
 */
export function ApiDocument(objOrArr: TTagObject | TTagObject[]): TDecorator {
  const tags = Array.isArray(objOrArr) ? objOrArr : [objOrArr];
  return (target: TObject) => {
    const metadata = Metadata.get();
    const className = target.name;
    const route = metadata[className]?.["route"] ?? {};
    const doc_paths = [] as TRet;
    const tagsName = tags.map((el: TRet) => el.name);
    for (const key in route) {
      if (route[key]) {
        const props = route[key]["property"];
        if (isObject(props)) {
          if (!props.responses) {
            throw new Error("@ApiResponse is required !");
          }
          route[key]["property"]["tags"] = tagsName;
        }
        if (route[key]?.["path"]) {
          const newPath = route[key]["path"].split("/").map((el: string) => {
            if (el.startsWith(":")) {
              el = `{${el.substring(1)}}`;
            }
            return el;
          }).join("/");
          doc_paths.push({
            ...route[key],
            path: newPath,
          });
        }
      }
    }
    metadata["doc_paths"] = (metadata["doc_paths"] ?? []).concat(doc_paths);
    metadata["doc_tags"] = (metadata["doc_tags"] ?? []).concat(
      tags,
    );
  };
}

export { DocumentBuilder } from "./swagger/builder.ts";
/**
 * swagger init.
 */
export function swagger<T = TRet>(
  app: T,
  docUrl: string,
  document: TOpenApi,
  opts: TOptionServe = {},
): void {
  const metadata = Metadata.get();
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
  const self_app = app as TRet;
  self_app.get(docUrl + "/swagger-ui-init.js", swaggerUi.serveInitAssets());
  self_app.get(docUrl, swaggerUi.setup(document, opts));
  self_app.get(docUrl + "/json", () => document);
}
