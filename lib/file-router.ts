// file-router.ts
/**
 * @module
 *
 * This module contains file-router for NHttp.
 *
 * @example
 * ```tsx
 * import nhttp from "@nhttp/nhttp";
 * import { generateRoute } from "@nhttp/nhttp/file-router";
 *
 * const app = nhttp();
 *
 * await generateRoute(app, "my_dir", (file) => import("./" + file));
 *
 * app.listen(8000);
 * ```
 */
import { join } from "node:path";
import { readdir } from "node:fs/promises";
import type { NHttp } from "./deps.ts";
import type { TRet } from "../mod.ts";

async function readDir(dir: string): Promise<string[]> {
  const files: string[] = [];
  const getFiles = async (path: string) => {
    const dirs = await readdir(path, { withFileTypes: true });
    for (const dirEntry of dirs) {
      if (dirEntry.isDirectory()) {
        await getFiles(join(path, dirEntry.name));
      } else if (dirEntry.isFile()) {
        files.push(join(path, dirEntry.name));
      }
    }
  };
  await getFiles(dir);
  return files;
}
const REG_SLUG = /\[\.\.\./gi;
const REG_PARAM = /\[/gi;
const REG_PATH = /\//gi;
function mutatePath(el: string): string {
  let path = el.substring(0, el.lastIndexOf("."));
  if (path.endsWith("/index")) {
    path = path.substring(0, path.lastIndexOf("/index"));
  }
  if (path === "") path = "/";
  return path.split(REG_PATH).map((el) => {
    if (REG_SLUG.test(el)) {
      return el.replace(REG_SLUG, ":").replace(/]/g, "*");
    }
    if (REG_PARAM.test(el)) {
      return el.replace(REG_PARAM, ":").replace(/]/g, "");
    }
    return el;
  }).join("/");
}
/**
 * getRouteFromDir. Lookup route from dir.
 * @example
 * const route = await getRouteFromDir("my_dir");
 *
 * console.log(route);
 */
export async function getRouteFromDir(
  dir: string,
): Promise<Record<string, string>> {
  const dirs = await readDir(dir);
  const route = {} as Record<string, string>;
  for (let i = 0; i < dirs.length; i++) {
    const file = dirs[i];
    const el = file.substring(dir.length);
    route[mutatePath(el)] = file;
  }
  return route;
}
/**
 * `generateRoute` from file.
 * @example
 * const app = nhttp();
 *
 * await generateRoute(app, "my_dir", (file) => import("./" + file));
 */
export async function generateRoute(
  app: NHttp,
  dir: string,
  importer: (file: string) => Promise<TRet>,
  printLog?: boolean,
): Promise<void> {
  const route = await getRouteFromDir(dir);
  for (const key in route) {
    const mod = await importer(route[key]);
    for (const method in mod) {
      if (printLog) console.log(`${method} ${key}`);
      app.on(method, key, mod[method]);
    }
  }
}
