import { TRet } from "../index";
export declare class NodeResponse {
    constructor(body?: BodyInit | null, init?: ResponseInit);
    static error(): Response;
    static redirect(url: string | URL, status?: number): Response;
    static json(data: unknown, init?: ResponseInit): Response;
    private get res();
    get headers(): any;
    get ok(): boolean;
    get redirected(): boolean;
    get status(): any;
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
    get [Symbol.hasInstance](): string;
    [k: string | symbol]: TRet;
}
