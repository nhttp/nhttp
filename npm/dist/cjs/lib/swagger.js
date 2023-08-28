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
var swagger_exports = {};
__export(swagger_exports, {
  ApiApiKey: () => ApiApiKey,
  ApiBasicAuth: () => ApiBasicAuth,
  ApiBearerAuth: () => ApiBearerAuth,
  ApiCookieAuth: () => ApiCookieAuth,
  ApiDocument: () => ApiDocument,
  ApiOAuth2: () => ApiOAuth2,
  ApiOperation: () => ApiOperation,
  ApiParameter: () => ApiParameter,
  ApiRequestBody: () => ApiRequestBody,
  ApiResponse: () => ApiResponse,
  ApiSchema: () => ApiSchema,
  DocumentBuilder: () => import_builder.DocumentBuilder,
  swagger: () => swagger
});
module.exports = __toCommonJS(swagger_exports);
var import_swagger_ui = require("./swagger/swagger_ui");
var import_builder = require("./swagger/builder");
function joinProperty(target, prop, object) {
  const metadata = globalThis.NHttpMetadata;
  const className = target.constructor.name;
  metadata[className] = metadata[className] || {};
  const obj = metadata[className]["doc_paths"] || {};
  obj[prop] = obj[prop] || {};
  obj[prop]["property"] = obj[prop]["property"] || {};
  Object.assign(obj[prop]["property"], object);
  metadata[className]["doc_paths"] = obj;
}
function addSecurity(className, name, values) {
  const metadata = globalThis.NHttpMetadata;
  const security = [
    {
      [name]: values || []
    }
  ];
  const paths = metadata[className]["doc_paths"];
  for (const key in paths) {
    if (paths[key]) {
      paths[key]["property"]["security"] = (paths[key]["property"]["security"] || []).concat(security);
    }
  }
  metadata[className]["doc_paths"] = paths;
}
function ApiOperation(object) {
  return (target, prop, des) => {
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
      property: object
    };
    metadata[className]["doc_paths"] = obj;
    return des;
  };
}
function ApiResponse(status, object) {
  if (object.schema) {
    object.content = {};
    if (typeof object.schema === "function") {
      object.content = {
        "application/json": {
          schema: {
            "$ref": "#/components/schemas/" + object.schema.name
          }
        }
      };
    } else if (typeof object.schema === "object") {
      const obj = object.schema;
      for (const g in obj) {
        object.content[g] = {
          schema: {
            "$ref": "#/components/schemas/" + obj[g].name
          }
        };
      }
    }
  }
  const _status = status.toString();
  return (target, prop, des) => {
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
function ApiParameter(object) {
  const parameters = [object];
  return (target, prop, des) => {
    const metadata = globalThis.NHttpMetadata;
    const className = target.constructor.name;
    const obj = metadata[className]["doc_paths"] || {};
    obj[prop] = obj[prop] || {};
    obj[prop]["property"] = obj[prop]["property"] || {};
    obj[prop]["property"]["parameters"] = (obj[prop]["property"]["parameters"] || []).concat(parameters);
    metadata[className]["doc_paths"] = obj;
    return des;
  };
}
function ApiSchema(name, object) {
  return (_target, _prop, des) => {
    const metadata = globalThis.NHttpMetadata;
    metadata["doc_schemas"] = metadata["doc_schemas"] || {};
    metadata["doc_schemas"][name] = object;
    return des;
  };
}
function ApiBearerAuth(name = "bearerAuth", values) {
  return (target) => {
    addSecurity(target.name, name, values);
  };
}
function ApiOAuth2(name = "oauth2", values) {
  return (target) => {
    addSecurity(target.name, name, values);
  };
}
function ApiApiKey(name = "api_key", values) {
  return (target) => {
    addSecurity(target.name, name, values);
  };
}
function ApiBasicAuth(name = "basicAuth", values) {
  return (target) => {
    addSecurity(target.name, name, values);
  };
}
function ApiCookieAuth(name = "cookieAuth", values) {
  return (target) => {
    addSecurity(target.name, name, values);
  };
}
function ApiRequestBody(object) {
  if (object.content) {
    if (object.schema) {
      delete object.schema;
    }
    return (target, prop, des) => {
      joinProperty(target, prop, { requestBody: object });
      return des;
    };
  }
  return (target, prop, des) => {
    let content = {};
    if (typeof object.schema === "function") {
      content = {
        "application/json": {
          schema: {
            "$ref": "#/components/schemas/" + object.schema.name
          }
        }
      };
    } else {
      const obj = object.schema;
      for (const k in obj) {
        content[k] = {
          schema: {
            "$ref": "#/components/schemas/" + obj[k].name
          }
        };
      }
    }
    joinProperty(target, prop, {
      requestBody: {
        description: object.description,
        required: object.required,
        content
      }
    });
    return des;
  };
}
function ApiDocument(objOrArr) {
  const tags = Array.isArray(objOrArr) ? objOrArr : [objOrArr];
  return (target) => {
    const metadata = globalThis.NHttpMetadata;
    const className = target.name;
    const route = metadata[className]["route"];
    const paths = metadata[className]["doc_paths"];
    const doc_paths = [];
    const tagsName = tags.map((el) => el.name);
    for (const key in paths) {
      if (paths[key]) {
        paths[key]["property"]["tags"] = tagsName;
        paths[key]["path"] = route[key]["path"];
        const newPath = paths[key]["path"].split("/").map((el) => {
          if (el.startsWith(":")) {
            el = `{${el.substring(1)}}`;
          }
          return el;
        }).join("/");
        doc_paths.push({
          ...paths[key],
          path: newPath
        });
      }
    }
    metadata["doc_paths"] = (metadata["doc_paths"] || []).concat(doc_paths);
    metadata["doc_tags"] = (metadata["doc_tags"] || []).concat(
      tags
    );
  };
}
function swagger(app, docUrl, document, opts = {}) {
  const metadata = globalThis.NHttpMetadata;
  const schemas = opts.schemas ?? opts.validationMetadatasToSchemas?.() ?? {};
  const doc_paths = metadata["doc_paths"];
  const schemasOri = metadata["doc_schemas"] || {};
  let i = 0;
  const paths = {};
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
    ...schemas
  };
  app.get(docUrl + "/swagger-ui-init.js", import_swagger_ui.swaggerUi.serveInitAssets());
  app.get(docUrl, import_swagger_ui.swaggerUi.setup(document, opts));
  app.get(docUrl + "/json", () => document);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApiApiKey,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiDocument,
  ApiOAuth2,
  ApiOperation,
  ApiParameter,
  ApiRequestBody,
  ApiResponse,
  ApiSchema,
  DocumentBuilder,
  swagger
});
