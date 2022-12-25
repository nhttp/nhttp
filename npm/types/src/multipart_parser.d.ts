interface FormFile {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    arrayBuffer: () => Uint8Array | Promise<Uint8Array>;
}
export declare function multiParser(req: Request): Promise<{
    [x: string]: string | FormFile | FormFile[];
}>;
export {};
