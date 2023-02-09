import { Handler, TObject } from "./../deps";
import { GenHtmlOpts } from "./types";
export declare const swaggerUi: {
    setup: (swaggerDoc: TObject, opts?: GenHtmlOpts) => Handler;
    serveInitAssets: () => Handler;
};
