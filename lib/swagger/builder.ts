import { TObject } from "./../deps.ts";
import { TInfo, TOpenApi, TSecurity, TTagObject } from "./types.ts";

export class DocumentBuilder {
  private _doc: TOpenApi = {
    openapi: "3.0.0",
    info: {
      title: "",
      description: "",
      version: "1.0.0",
      contact: {},
    },
    tags: [],
    servers: [],
    components: {
      schemas: {},
    },
    definitions: {},
  };
  public setHost(str: string) {
    this._doc.host = str;
    return this;
  }
  public addSchemes(str: string) {
    this._doc.schemes = (this._doc.schemes || []).concat([str]);
    return this;
  }
  public addTags(object: TTagObject) {
    this._doc.tags = (this._doc.tags || []).concat([object]);
    return this;
  }
  public useSwagger(version = "2.0.0") {
    this._doc.swagger = version;
    if (this._doc.openapi) {
      delete this._doc.openapi;
    }
    return this;
  }
  public useOpenApi(version = "3.0.0") {
    this._doc.openapi = version;
    if (this._doc.swagger) {
      delete this._doc.swagger;
    }
    return this;
  }
  public setInfo(info: TInfo) {
    this._doc.info = info;
    return this;
  }
  public addServer(
    url: string,
    description?: string,
    variables?: TObject,
  ) {
    this._doc.servers.push({ url, description, variables });
    return this;
  }
  public setExternalDoc(description: string, url: string) {
    this._doc.externalDocs = { description, url };
    return this;
  }
  public addSecurity(name: string, opts: TSecurity) {
    this._doc.components.securitySchemes = {
      ...(this._doc.components.securitySchemes || {}),
      [name]: opts,
    };
    return this;
  }
  public addSecurityRequirements(
    name: string | TObject,
    requirements: string[] = [],
  ) {
    let obj: TObject;
    if (typeof name === "string") {
      obj = { [name]: requirements };
    } else {
      obj = name;
    }

    this._doc.security = (this._doc.security || []).concat({
      ...obj,
    });
    return this;
  }
  public addBearerAuth(
    options: TSecurity = {
      type: "http",
    },
    name = "bearerAuth",
  ) {
    this.addSecurity(name, {
      scheme: "bearer",
      bearerFormat: "JWT",
      ...options,
    });
    return this;
  }

  public addOAuth2(
    options: TSecurity = {
      type: "oauth2",
    },
    name = "oauth2",
  ) {
    this.addSecurity(name, {
      flows: {},
      ...options,
    });
    return this;
  }

  public addApiKey(
    options: TSecurity = {
      type: "apiKey",
    },
    name = "api_key",
  ) {
    this.addSecurity(name, {
      in: "header",
      name,
      ...options,
    });
    return this;
  }

  public addBasicAuth(
    options: TSecurity = {
      type: "http",
    },
    name = "basicAuth",
  ) {
    this.addSecurity(name, {
      scheme: "basic",
      ...options,
    });
    return this;
  }

  public addCookieAuth(
    cookieName = "connect.sid",
    options: TSecurity = {
      type: "apiKey",
    },
    name = "cookieAuth",
  ) {
    this.addSecurity(name, {
      in: "cookie",
      name: cookieName,
      ...options,
    });
    return this;
  }
  public build() {
    return this._doc;
  }
}
