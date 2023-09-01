var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var file_router_exports = {};
__export(file_router_exports, {
  generateRoute: () => generateRoute,
  getRouteFromDir: () => getRouteFromDir
});
module.exports = __toCommonJS(file_router_exports);
var import_node_path = require("node:path");
var import_promises = require("node:fs/promises");
async function readDir(dir) {
  const files = [];
  const getFiles = async (path) => {
    const dirs = await (0, import_promises.readdir)(path, { withFileTypes: true });
    for (const dirEntry of dirs) {
      if (dirEntry.isDirectory()) {
        await getFiles((0, import_node_path.join)(path, dirEntry.name));
      } else if (dirEntry.isFile()) {
        files.push((0, import_node_path.join)(path, dirEntry.name));
      }
    }
  };
  await getFiles(dir);
  return files;
}
const REG_SLUG = /\[\.\.\./gi;
const REG_PARAM = /\[/gi;
const REG_PATH = /\//gi;
function mutatePath(el) {
  let path = el.substring(0, el.lastIndexOf("."));
  if (path.endsWith("/index")) {
    path = path.substring(0, path.lastIndexOf("/index"));
  }
  if (path === "")
    path = "/";
  return path.split(REG_PATH).map((el2) => {
    if (REG_SLUG.test(el2)) {
      return el2.replace(REG_SLUG, ":").replace(/]/g, "*");
    }
    if (REG_PARAM.test(el2)) {
      return el2.replace(REG_PARAM, ":").replace(/]/g, "");
    }
    return el2;
  }).join("/");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateRoute,
  getRouteFromDir
});
