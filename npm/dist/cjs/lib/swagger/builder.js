var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var builder_exports = {};
__export(builder_exports, {
  DocumentBuilder: () => DocumentBuilder
});
class DocumentBuilder {
  constructor() {
    this._doc = {
      openapi: "3.0.0",
      info: {
        title: "",
        description: "",
        version: "1.0.0",
        contact: {}
      },
      tags: [],
      servers: [],
      components: {
        schemas: {}
      },
      definitions: {}
    };
  }
  setHost(str) {
    this._doc.host = str;
    return this;
  }
  addSchemes(str) {
    this._doc.schemes = (this._doc.schemes || []).concat([str]);
    return this;
  }
  addTags(object) {
    this._doc.tags = (this._doc.tags || []).concat([object]);
    return this;
  }
  useSwagger(version = "2.0.0") {
    this._doc.swagger = version;
    if (this._doc.openapi) {
      delete this._doc.openapi;
    }
    return this;
  }
  useOpenApi(version = "3.0.0") {
    this._doc.openapi = version;
    if (this._doc.swagger) {
      delete this._doc.swagger;
    }
    return this;
  }
  setInfo(info) {
    this._doc.info = info;
    return this;
  }
  addServer(url, description, variables) {
    this._doc.servers.push({ url, description, variables });
    return this;
  }
  setExternalDoc(description, url) {
    this._doc.externalDocs = { description, url };
    return this;
  }
  addSecurity(name, opts) {
    this._doc.components.securitySchemes = __spreadProps(__spreadValues({}, this._doc.components.securitySchemes || {}), {
      [name]: opts
    });
    return this;
  }
  addSecurityRequirements(name, requirements = []) {
    let obj;
    if (typeof name === "string") {
      obj = { [name]: requirements };
    } else {
      obj = name;
    }
    this._doc.security = (this._doc.security || []).concat(__spreadValues({}, obj));
    return this;
  }
  addBearerAuth(options = {
    type: "http"
  }, name = "bearerAuth") {
    this.addSecurity(name, __spreadValues({
      scheme: "bearer",
      bearerFormat: "JWT"
    }, options));
    return this;
  }
  addOAuth2(options = {
    type: "oauth2"
  }, name = "oauth2") {
    this.addSecurity(name, __spreadValues({
      flows: {}
    }, options));
    return this;
  }
  addApiKey(options = {
    type: "apiKey"
  }, name = "api_key") {
    this.addSecurity(name, __spreadValues({
      in: "header",
      name
    }, options));
    return this;
  }
  addBasicAuth(options = {
    type: "http"
  }, name = "basicAuth") {
    this.addSecurity(name, __spreadValues({
      scheme: "basic"
    }, options));
    return this;
  }
  addCookieAuth(cookieName = "connect.sid", options = {
    type: "apiKey"
  }, name = "cookieAuth") {
    this.addSecurity(name, __spreadValues({
      in: "cookie",
      name: cookieName
    }, options));
    return this;
  }
  build() {
    return this._doc;
  }
}
module.exports = __toCommonJS(builder_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DocumentBuilder
});
