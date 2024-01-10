import { type RequestEvent } from "../deps";
import { FC } from "./index";
import { type RenderHTML } from "./render";
export declare function toStream(body: string, write: (data: string) => void, rev: RequestEvent, initHead?: string): Promise<void>;
/**
 * render to ReadableStream in `app.engine`.
 * @example
 * ```tsx
 * const app = nhttp();
 *
 * app.engine(renderToReadableStream);
 *
 * app.get("/", () => {
 *   return <h1>hello</h1>;
 * });
 * ```
 */
export declare const renderToReadableStream: RenderHTML;
/**
 * Suspense for renderToReadableStream.
 * @unsupported
 * - Helmet => please use Helmet outside `Suspense`.
 * - twindStream => please use twind instead.
 * @example
 * ```tsx
 * app.engine(renderToReadableStream);
 *
 * app.get("/", () => {
 *   return (
 *     <Suspense fallback={<span>loading...</span>}>
 *       <Home/>
 *     </Suspense>
 *   )
 * })
 * ```
 */
export declare const Suspense: FC<{
    fallback?: JSX.Element;
}>;
