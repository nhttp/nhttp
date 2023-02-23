import { Handler, TQueryFunc } from "./types";
export type TMultipartUpload = {
    name: string;
    maxCount?: number;
    maxSize?: number | string;
    accept?: string;
    callback?: (file: File & {
        filename: string;
    }) => void | Promise<void>;
    dest?: string;
    required?: boolean;
    /**
     * writeFile. default `Deno.writeFile`.
     * @example
     * // example upload with Bun.
     * const upload = multipart.upload({
     *    name: "image",
     *    writeFile: Bun.write
     * });
     * app.post("/hello", upload, (rev) => {
     *    console.log(rev.file);
     *    console.log(rev.body);
     *    return "success upload";
     * });
     */
    writeFile?: (pathfile: string, data: Uint8Array) => void | Promise<void>;
};
type TMultipartHandler = {
    parse?: TQueryFunc;
};
declare class Multipart {
    createBody(formData: FormData, { parse }?: TMultipartHandler): any;
    private isFile;
    private cleanUp;
    private validate;
    private privUpload;
    private mutateBody;
    private handleArrayUpload;
    private handleSingleUpload;
    /**
     * upload handler multipart/form-data.
     * @example
     * const upload = multipart.upload({ name: "image" });
     *
     * app.post("/save", upload, (rev) => {
     *    console.log("file", rev.file.image);
     *    console.log(rev.body);
     *    return "success upload";
     * });
     */
    upload(options: TMultipartUpload | TMultipartUpload[]): Handler;
}
export declare const multipart: Multipart;
export {};
