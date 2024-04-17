import type { Cookie } from "./types";
export declare function serializeCookie(name: string, value: string, cookie?: Cookie): string;
export declare function getReqCookies(headers: Headers, decode?: boolean, i?: number): Record<string, string>;
