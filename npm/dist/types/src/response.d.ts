import { deno_inspect } from "./inspect";
import { TRet } from "./types";
export declare class NHttpResponse {
    constructor(body?: TRet | null, init?: TRet);
    static json(body?: TRet | null, init?: TRet): any;
    static error(): any;
    static redirect(url: string | URL, status?: number): Response;
    private get res();
    get headers(): any;
    get ok(): boolean;
    get redirected(): boolean;
    get status(): number;
    get statusText(): string;
    get type(): ResponseType;
    get url(): string;
    get body(): ReadableStream<Uint8Array>;
    get bodyUsed(): boolean;
    clone(): Response;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    json(): Promise<any>;
    text(): Promise<string>;
    [deno_inspect](inspect: TRet, opts: TRet): string;
    [k: string | symbol]: TRet;
}
export declare function initMyRes(): void;
