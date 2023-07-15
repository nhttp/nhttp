import { TObject, TRet } from "./../deps.ts";

export type GenHtmlOpts = {
  swaggerOptions?: TObject;
  customCss?: string;
  customJs?: string;
  customfavIcon?: string;
  swaggerUrl?: TRet;
  swaggerUrls?: TRet;
  explorer?: TRet;
  customSiteTitle?: string;
  customCssUrl?: string;
  baseUrlLibSwagger?: string;
  htmlTplString?: string;
  jsTplString?: string;
};
export type TOptionServe = GenHtmlOpts & {
  /**
   * @deprecated
   * Use `schemas` instead.
   * @example
   * const schemas = validationMetadatasToSchemas();
   * swagger(app, "/api-docs", document, { schemas });
   */
  validationMetadatasToSchemas?: (...args: TRet) => TRet;
  schemas?: TRet;
};
export type TInfo = {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
  version: string;
  [k: string]: TRet;
};
export type TOpenApi = {
  openapi?: string;
  swagger?: string;
  schemes?: string[];
  info: TInfo;
  servers: TObject[];
  components: TObject;
  security?: TObject[];
  tags: TTagObject[];
  externalDocs?: TExternalDocs;
  definitions?: TObject;
  paths?: TObject;
  [k: string]: TRet;
};

export type TExternalDocs = {
  description?: string;
  url: string;
  [k: string]: TRet;
};

export type TSecurity = {
  type: "apiKey" | "http" | "oauth2" | "openIdConnect";
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
  bearerFormat?: string;
  flows?: {
    implicit?: TOauthFlow;
    password?: TOauthFlow;
    clientCredentials?: TOauthFlow;
    authorizationCode?: TOauthFlow;
  };
  openIdConnectUrl?: string;
  [k: string]: TRet;
};

export type TOauthFlow = {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: TObject;
  [k: string]: TRet;
};
export type TExampleObject = {
  summary?: string;
  description?: string;
  value?: TRet;
  externalValue?: string;
  [k: string]: TRet;
};

export type TExamplesObject = Record<string, TExampleObject | TReferenceObject>;
export type TContentObject = Record<string, TMediaTypeObject>;
export type TMediaTypeObject = {
  schema?: TSchemaObject | TReferenceObject;
  examples?: TExamplesObject;
  example?: TRet;
  encoding?: TEncodingObject;
  [k: string]: TRet;
};
export type TEncodingObject = Record<string, TEncodingPropertyObject>;
export type THeaderObject = TBaseParameterObject;
export type TEncodingPropertyObject = {
  contentType?: string;
  headers?: Record<string, THeaderObject | TReferenceObject>;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  [k: string]: TRet;
};

export type TRequestBodyObject = {
  description?: string;
  content?: TContentObject;
  required?: boolean;
  schema?:
    | { new (...args: TRet): TRet }
    | Record<string, { new (...args: TRet): TRet }>;
  [k: string]: TRet;
};
export type TResponses = Record<string, TRequestBodyObject>;

export type TApiDoc = {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: TExternalDocs;
  operationId?: string;
  parameters?: (TParameterObject | TReferenceObject)[];
  requestBody?: TRequestBodyObject | TReferenceObject;
  responses?: TResponses;
  callbacks?: TCallbacksObject;
  deprecated?: boolean;
  security?: TObject[];
  servers?: TObject[];
  [k: string]: TRet;
};

export type TCallbacksObject = Record<
  string,
  TCallbackObject | TReferenceObject
>;
export type TCallbackObject = Record<string, TPathItemObject>;
export type THeadersObject = Record<string, THeaderObject | TReferenceObject>;

export type TPathItemObject = {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: TApiDoc;
  put?: TApiDoc;
  post?: TApiDoc;
  delete?: TApiDoc;
  options?: TApiDoc;
  head?: TApiDoc;
  patch?: TApiDoc;
  trace?: TApiDoc;
  servers?: TObject[];
  parameters?: (TParameterObject | TReferenceObject)[];
  [k: string]: TRet;
};

export type TParameterStyle =
  | "matrix"
  | "label"
  | "form"
  | "simple"
  | "spaceDelimited"
  | "pipeDelimited"
  | "deepObject";

type TBaseParameterObject = {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: TParameterStyle;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: TSchemaObject | TReferenceObject;
  examples?: Record<string, TExampleObject | TReferenceObject>;
  example?: TRet;
  content?: TContentObject;
  [k: string]: TRet;
};
export type TTagObject = {
  name: string;
  description?: string;
  externalDocs?: TExternalDocs;
  [k: string]: TRet;
};

export type TParameterLocation = "query" | "header" | "path" | "cookie";

export type TParameterObject = TBaseParameterObject & {
  name: string;
  in: TParameterLocation;
  [k: string]: TRet;
};

export type TDiscriminatorObject = {
  propertyName: string;
  mapping?: Record<string, string>;
  [k: string]: TRet;
};

export type TXmlObject = {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
  [k: string]: TRet;
};

export type TSchemaObject = {
  nullable?: boolean;
  discriminator?: TDiscriminatorObject;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: TXmlObject;
  externalDocs?: TExternalDocs;
  example?: TRet;
  deprecated?: boolean;
  type?: string;
  allOf?: (TSchemaObject | TReferenceObject)[];
  oneOf?: (TSchemaObject | TReferenceObject)[];
  anyOf?: (TSchemaObject | TReferenceObject)[];
  not?: TSchemaObject | TReferenceObject;
  items?: TSchemaObject | TReferenceObject;
  properties?: Record<string, TSchemaObject | TReferenceObject>;
  additionalProperties?: TSchemaObject | TReferenceObject | boolean;
  patternProperties?: TSchemaObject | TReferenceObject | TRet;
  description?: string;
  format?: string;
  default?: TRet;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: TRet[];
  [k: string]: TRet;
};

type TReferenceObject = {
  $ref?: string;
  [k: string]: TRet;
};
