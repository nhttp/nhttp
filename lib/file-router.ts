import { join } from "node:path";
import { readdir } from "node:fs/promises";
import { NHttp } from "./deps.ts";
import { TRet } from "../mod.ts";

async function readDir(dir: string) {
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

function mutatePath(el: string) {
  let path = el.substring(0, el.lastIndexOf("."));
  if (path.endsWith("/index")) {
    path = path.substring(0, path.lastIndexOf("/index"));
  }
  if (path === "") path = "/";
  path = "/" + path.split("/").reduce((curr, val) => {
    if (val.startsWith("[...") && val.endsWith("]")) {
      return curr + "/:" + val.slice(4, val.length - 1) + "*";
    }
    if (val.startsWith("[") && val.endsWith("]")) {
      return curr + "/:" + val.slice(1, val.length - 1);
    }
    return val;
  }, "");
  return path;
}
/**
 * getRouteFromDir. Lookup route from dir.
 * @example
 * const route = await getRouteFromDir("my_dir");
 *
 * console.log(route);
 */
export async function getRouteFromDir(dir: string) {
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
) {
  const route = await getRouteFromDir(dir);
  for (const key in route) {
    const mod = await importer(route[key]);
    for (const method in mod) {
      if (printLog) console.log(`${method} ${key}`);
      app.on(method, key, mod[method]);
    }
  }
}
