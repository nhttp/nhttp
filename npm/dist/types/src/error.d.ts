import type { TObject, TRet } from "./types";
/**
 * Genarete error message from class HttpError.
 * @example
 * throw new HttpError(status?: number, message?: string, name?: string);
 */
export declare class HttpError extends Error {
    status: number;
    constructor(status?: number, message?: TRet, name?: string);
}
/**
 * Give error object
 */
export declare function getError(err: TObject, isStack?: boolean): {
    status: number;
    message: string;
    name: string;
    stack: any;
};
