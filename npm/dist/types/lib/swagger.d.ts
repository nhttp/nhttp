import type { TDecorator } from "./controller";
import type { TRet } from "./deps";
import type { TApiDoc, TOpenApi, TOptionServe, TParameterObject, TRequestBodyObject, TSchemaObject, TTagObject } from "./swagger/types";
declare global {
    var NHttpMetadata: TRet;
}
export declare function ApiOperation(object: TApiDoc): TDecorator;
export declare function ApiResponse(status: number, object: TRequestBodyObject): TDecorator;
export declare function ApiParameter(object: TParameterObject): TDecorator;
export declare function ApiSchema(name: string, object: TSchemaObject): TDecorator;
export declare function ApiBearerAuth(name?: string, values?: TRet): TDecorator;
export declare function ApiOAuth2(name?: string, values?: TRet): TDecorator;
export declare function ApiApiKey(name?: string, values?: TRet): TDecorator;
export declare function ApiBasicAuth(name?: string, values?: TRet): TDecorator;
export declare function ApiCookieAuth(name?: string, values?: TRet): TDecorator;
export declare function ApiRequestBody(object: TRequestBodyObject): TDecorator;
export declare function ApiDocument(objOrArr: TTagObject | TTagObject[]): TDecorator;
export { DocumentBuilder } from "./swagger/builder";
export declare function swagger(app: TRet, docUrl: string, document: TOpenApi, opts?: TOptionServe): void;
