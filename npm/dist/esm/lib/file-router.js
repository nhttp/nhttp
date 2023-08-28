import { join } from "node:path";
import { readdir } from "node:fs/promises";
async function readDir(dir) {
  const files = [];
  const getFiles = async (path) => {
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
function mutatePath(el) {
  let path = el.substring(0, el.lastIndexOf("."));
  if (path.endsWith("/index")) {
    path = path.substring(0, path.lastIndexOf("/index"));
  }
  if (path === "")
    path = "/";
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
async function getRouteFromDir(dir) {
  const dirs = await readDir(dir);
  const route = {};
  for (let i = 0; i < dirs.length; i++) {
    const file = dirs[i];
    const el = file.substring(dir.length);
    route[mutatePath(el)] = file;
  }
  return route;
}
async function generateRoute(app, dir, importer, printLog) {
  const route = await getRouteFromDir(dir);
  for (const key in route) {
    const mod = await importer(route[key]);
    for (const method in mod) {
      if (printLog)
        console.log(`${method} ${key}`);
      app.on(method, key, mod[method]);
    }
  }
}
export {
  generateRoute,
  getRouteFromDir
};
