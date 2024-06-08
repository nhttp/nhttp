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

function joinProperty(target: TObject, prop: string, object: TObject): void {
  const metadata = Metadata.get();
  const className = target.constructor.name;
  metadata[className] = metadata[className] || {};
  const obj = metadata[className]["doc_paths"] || {};
  obj[prop] = obj[prop] || {};
  obj[prop]["property"] = obj[prop]["property"] || {};
  Object.assign(obj[prop]["property"], object);
  metadata[className]["doc_paths"] = obj;
}

function addSecurity(className: string, name: string, values: TRet): void {
  const metadata = Metadata.get();
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
/**
 * ApiOperation decorators.
 */
export function ApiOperation(object: TApiDoc): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const metadata = Metadata.get();
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
    const metadata = Metadata.get();
    const className = target.constructor.name;
    const obj = metadata[className]["doc_paths"] || {};
    obj[prop] = obj[prop] || {};
    obj[prop]["property"] = obj[prop]["property"] || {};
    obj[prop]["property"]["responses"][_status] = object;
    metadata[className]["doc_paths"] = obj;
    return des;
  };
}
/**
 * ApiParameter decorators.
 */
export function ApiParameter(object: TParameterObject): TDecorator {
  const parameters = [object];
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const metadata = Metadata.get();
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
/**
 * ApiSchema decorators.
 */
export function ApiSchema(name: string, object: TSchemaObject): TDecorator {
  return (_target: TObject, _prop: string, des: PropertyDescriptor) => {
    const metadata = Metadata.get();
    metadata["doc_schemas"] = metadata["doc_schemas"] || {};
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
/**
 * ApiDocument decorators.
 */
export function ApiDocument(objOrArr: TTagObject | TTagObject[]): TDecorator {
  const tags = Array.isArray(objOrArr) ? objOrArr : [objOrArr];
  return (target: TObject) => {
    const metadata = Metadata.get();
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
