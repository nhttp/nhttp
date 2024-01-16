import type { HttpResponse } from "./http_response";
import type { RequestEvent } from "./request_event";
import type { TObject } from "./types";
export declare function revInspect(rev: RequestEvent): TObject;
export declare function resInspect(res: HttpResponse): TObject;
export declare const deno_inspect: unique symbol;
export declare const node_inspect: unique symbol;
