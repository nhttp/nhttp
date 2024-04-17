import type { Handler, TObject } from "./../deps";
import type { GenHtmlOpts } from "./types";
export declare const swaggerUi: {
    setup: (swaggerDoc: TObject, opts?: GenHtmlOpts) => Handler;
    serveInitAssets: () => Handler;
};
