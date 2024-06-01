// builder.ts
import type { TObject } from "./../deps.ts";
import type { TInfo, TOpenApi, TSecurity, TTagObject } from "./types.ts";
/**
 * swagger DocumentBuilder.
 */
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
  /**
   * swagger set host.
   */
  public setHost(str: string): this {
    this._doc.host = str;
    return this;
  }
  /**
   * swagger set schema.
   */
  public addSchemes(str: string): this {
    this._doc.schemes = (this._doc.schemes || []).concat([str]);
    return this;
  }
  /**
   * swagger set tag.
   */
  public addTags(object: TTagObject): this {
    this._doc.tags = (this._doc.tags || []).concat([object]);
    return this;
  }
  /**
   * hook. use swagger versions.
   */
  public useSwagger(version = "2.0.0"): this {
    this._doc.swagger = version;
    if (this._doc.openapi) {
      delete this._doc.openapi;
    }
    return this;
  }
  /**
   * hook. use open-api versions.
   */
  public useOpenApi(version = "3.0.0"): this {
    this._doc.openapi = version;
    if (this._doc.swagger) {
      delete this._doc.swagger;
    }
    return this;
  }
  /**
   * swagger set info.
   */
  public setInfo(info: TInfo): this {
    this._doc.info = info;
    return this;
  }
  /**
   * swagger add server.
   */
  public addServer(
    url: string,
    description?: string,
    variables?: TObject,
  ): this {
    this._doc.servers.push({ url, description, variables });
    return this;
  }
  /**
   * swagger set external docs.
   */
  public setExternalDoc(description: string, url: string): this {
    this._doc.externalDocs = { description, url };
    return this;
  }
  /**
   * swagger add security.
   */
  public addSecurity(name: string, opts: TSecurity): this {
    this._doc.components.securitySchemes = {
      ...(this._doc.components.securitySchemes || {}),
      [name]: opts,
    };
    return this;
  }
  /**
   * swagger add security requirements.
   */
  public addSecurityRequirements(
    name: string | TObject,
    requirements: string[] = [],
  ): this {
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
  /**
   * swagger add bearer authentication.
   */
  public addBearerAuth(
    options: TSecurity = {
      type: "http",
    },
    name = "bearerAuth",
  ): this {
    this.addSecurity(name, {
      scheme: "bearer",
      bearerFormat: "JWT",
      ...options,
    });
    return this;
  }
  /**
   * swagger add OAuth2.
   */
  public addOAuth2(
    options: TSecurity = {
      type: "oauth2",
    },
    name = "oauth2",
  ): this {
    this.addSecurity(name, {
      flows: {},
      ...options,
    });
    return this;
  }
  /**
   * swagger add api-key.
   */
  public addApiKey(
    options: TSecurity = {
      type: "apiKey",
    },
    name = "api_key",
  ): this {
    this.addSecurity(name, {
      in: "header",
      name,
      ...options,
    });
    return this;
  }
  /**
   * swagger add Basic-Auth.
   */
  public addBasicAuth(
    options: TSecurity = {
      type: "http",
    },
    name = "basicAuth",
  ): this {
    this.addSecurity(name, {
      scheme: "basic",
      ...options,
    });
    return this;
  }
  /**
   * swagger add Cookie-Auth.
   */
  public addCookieAuth(
    cookieName = "connect.sid",
    options: TSecurity = {
      type: "apiKey",
    },
    name = "cookieAuth",
  ): this {
    this.addSecurity(name, {
      in: "cookie",
      name: cookieName,
      ...options,
    });
    return this;
  }
  /**
   * swagger build.
   */
  public build(): TOpenApi {
    return this._doc;
  }
}
