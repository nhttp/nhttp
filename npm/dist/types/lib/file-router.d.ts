import type { NHttp } from "./deps";
import type { TRet } from "../mod";
/**
 * getRouteFromDir. Lookup route from dir.
 * @example
 * const route = await getRouteFromDir("my_dir");
 *
 * console.log(route);
 */
export declare function getRouteFromDir(dir: string): Promise<Record<string, string>>;
/**
 * `generateRoute` from file.
 * @example
 * const app = nhttp();
 *
 * await generateRoute(app, "my_dir", (file) => import("./" + file));
 */
export declare function generateRoute(app: NHttp, dir: string, importer: (file: string) => Promise<TRet>, printLog?: boolean): Promise<void>;
