import { TObject } from "./../deps";
import { TInfo, TOpenApi, TSecurity, TTagObject } from "./types";
export declare class DocumentBuilder {
    private _doc;
    setHost(str: string): this;
    addSchemes(str: string): this;
    addTags(object: TTagObject): this;
    useSwagger(version?: string): this;
    useOpenApi(version?: string): this;
    setInfo(info: TInfo): this;
    addServer(url: string, description?: string, variables?: TObject): this;
    setExternalDoc(description: string, url: string): this;
    addSecurity(name: string, opts: TSecurity): this;
    addSecurityRequirements(name: string | TObject, requirements?: string[]): this;
    addBearerAuth(options?: TSecurity, name?: string): this;
    addOAuth2(options?: TSecurity, name?: string): this;
    addApiKey(options?: TSecurity, name?: string): this;
    addBasicAuth(options?: TSecurity, name?: string): this;
    addCookieAuth(cookieName?: string, options?: TSecurity, name?: string): this;
    build(): TOpenApi;
}
