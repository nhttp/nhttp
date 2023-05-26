import { Handler, NFile, TQueryFunc } from "./types";
export type TMultipartUpload = {
    /**
     * fieldName.
     * @requires
     */
    name: string;
    /**
     * maxCount.
     * @default
     * not_set
     */
    maxCount?: number;
    /**
     * maxSize.
     * @default
     * not_set
     */
    maxSize?: number | string;
    /**
     * accept content-type.
     * @default
     * not_set
     */
    accept?: string | string[];
    /**
     * callback when upload.
     * @default
     * not_set
     */
    callback?: (file: File & {
        filename: string;
    }) => void | Promise<void>;
    /**
     * destination folder uploads.
     * @default
     * "/"
     */
    dest?: string;
    /**
     * required fieldName.
     * @default
     * false
     */
    required?: boolean;
    /**
     * writeFile.
     * @default
     * true
     */
    writeFile?: boolean | ((pathfile: string, data: Uint8Array) => void | Promise<void>);
    /**
     * custom storage function. (s3, supabase, gdrive, etc).
     * @default
     * not_set
     */
    storage?: (file: NFile) => void | Promise<void>;
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
