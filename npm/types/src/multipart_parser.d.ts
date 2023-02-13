import { TObject } from "./types";
export declare function getType(headers: TObject): any;
export declare function multiParser(request: TObject): Promise<any>;
export declare function byteIndexOf(source: string | Uint8Array, pattern: string | Uint8Array, fromIndex?: number): number;
