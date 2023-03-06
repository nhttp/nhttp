import { emptyDir } from "https://deno.land/std@0.167.0/fs/empty_dir.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.14.25/mod.js";
import { getNames, replaceTs } from "./convert.ts";

await emptyDir("./npm");

const dir = Deno.cwd();

const fakeGlob = `declare global {
  export namespace Deno { 
    interface Conn { }
    interface HttpConn { }
  }
}`;

await Deno.mkdir("npm/src/src", { recursive: true });
await Deno.mkdir("npm/src/lib/swagger", { recursive: true });
await Deno.mkdir("npm/src/node", { recursive: true });
await replaceTs("index.ts", "npm/src/index.ts", fakeGlob);
const srcFiles = await getNames("src");
for (let i = 0; i < srcFiles.length; i++) {
  const path = srcFiles[i];
  if (!path.includes("test")) {
    await replaceTs(path, "npm/src/" + path);
  }
}
const libFiles = await getNames("lib");
for (let i = 0; i < libFiles.length; i++) {
  const path = libFiles[i];
  if (!path.includes("test")) {
    await replaceTs(path, "npm/src/" + path);
  }
}
const nodeFiles = await getNames("node");
for (let i = 0; i < nodeFiles.length; i++) {
  const path = nodeFiles[i];
  if (!path.includes("test")) {
    await replaceTs(path, "npm/src/" + path);
  }
}

const defObj: esbuild.BuildOptions = {
  platform: "node",
  absWorkingDir: dir,
  bundle: true,
  // minify: true,
  target: [
    "node18",
  ],
  entryPoints: ["npm/src/index.ts"],
};

// build cjs
await esbuild.build({
  ...defObj,
  format: "cjs",
  outfile: "npm/dist/cjs/index.js",
});
await Deno.writeTextFile(
  "npm/dist/cjs/package.json",
  JSON.stringify({ type: "commonjs" }),
);

// build esm
await esbuild.build({
  ...defObj,
  format: "esm",
  target: ["ES2020"],
  outfile: "npm/dist/esm/index.js",
});
await Deno.writeTextFile(
  "npm/dist/esm/package.json",
  JSON.stringify({ type: "module" }),
);

// build mod.js non npm
await esbuild.build({
  ...defObj,
  target: ["ES2020"],
  format: "esm",
  outfile: "mod.js",
});

function writeEsbuildFalse(dirFile: string, file: string, text: string) {
  try {
    Deno.writeTextFileSync(
      file,
      text.replaceAll(/(import[{}\sa-z,A-Z0-9,_]+from "\.\/[^"]+)"/gm, '$1.js"')
        .replaceAll(/(export[{}\sa-z,A-Z0-9,_]+from "\.\/[^"]+)"/gm, '$1.js"'),
    );
  } catch (_e) {
    Deno.mkdir(dirFile, { recursive: true });
    writeEsbuildFalse(dirFile, file, text);
  }
}

// build libs
const LIBS = await getNames("npm/src/lib");
for (let i = 0; i < LIBS.length; i++) {
  const path = LIBS[i];
  if (path.indexOf(".") != -1) {
    const out = path.replace(
      ".ts",
      ".js",
    );
    // esm
    const esm = await esbuild.build({
      ...defObj,
      bundle: false,
      format: "esm",
      entryPoints: [path],
      write: false,
    });
    const file = out.replace("npm/src/lib/", "npm/dist/esm/lib/");
    const dirFile = file.substring(0, file.lastIndexOf("/"));
    const { text } = esm.outputFiles[0];
    writeEsbuildFalse(dirFile, file, text);
    // cjs
    await esbuild.build({
      ...defObj,
      bundle: false,
      format: "cjs",
      entryPoints: [path],
      outfile: out.replace("npm/src/lib/", "npm/dist/cjs/lib/"),
    });
  }
}

await Deno.copyFile("LICENSE", "npm/LICENSE");
await Deno.copyFile("README.md", "npm/README.md");

esbuild.stop();

const pkg = {
  "name": "nhttp-land",
  "description": "An Simple http framework for Deno and Friends",
  "author": "Herudi",
  "version": "1.1.19",
  "module": "./dist/esm/index.js",
  "main": "./dist/cjs/index.js",
  "types": "./types/index.d.ts",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/nhttp/nhttp.git",
  },
  "bugs": {
    "url": "https://github.com/nhttp/nhttp/issues",
  },
  "engines": {
    "node": ">=18.14.0",
  },
  "keywords": [
    "nhttp",
    "nhttp-land",
    "deno",
    "nodejs",
    "bun",
    "cloudflare-workers",
    "router",
    "middleware",
    "framework",
  ],
} as any;
const EXP = await getNames("npm/dist/esm/lib");
pkg["exports"] = {};
pkg["exports"]["."] = {
  "types": "./types/index.d.ts",
  "require": "./dist/cjs/index.js",
  "import": "./dist/esm/index.js",
};
pkg["typesVersions"] = { "*": {} };
for (let i = 0; i < EXP.length; i++) {
  const path = EXP[i];
  if (path.indexOf(".") != -1) {
    const name = "." + path.replace("npm/dist/esm/lib", "").replace(".js", "");
    if (name.split("/").length < 3 && name !== "deps") {
      const _path = path.replace("npm/", "./");
      pkg["exports"][name] = {
        "types": _path.replace("/dist/esm/", "/types/").replace(".js", ".d.ts"),
        "require": _path.replace("/esm/", "/cjs/"),
        "import": _path,
      };
      pkg["typesVersions"]["*"][name] = [
        _path.replace("/dist/esm/", "/types/").replace(".js", ".d.ts"),
      ];
    }
  }
}
await Deno.writeTextFile(
  "npm/package.json",
  JSON.stringify(pkg, null, 2),
);
const p = new Deno.Command("tsc", {
  stderr: "null",
  stdout: "null",
});
await p.spawn().status;
await Deno.remove("npm/src", { recursive: true });
