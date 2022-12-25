import { emptyDir } from "https://deno.land/std@0.167.0/fs/empty_dir.ts";
import { join, resolve } from "https://deno.land/std@0.167.0/path/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.14.25/mod.js";
import { getNames, replaceTs } from "./convert.ts";

await emptyDir("./npm");

const dir = Deno.cwd();

const fakeGlob = `declare global {
  export namespace Deno { }
}`;

await Deno.mkdir("npm/src/src", { recursive: true });
await replaceTs("mod.ts", fakeGlob);
const arrFiles = await getNames("src");
for (let i = 0; i < arrFiles.length; i++) {
  const src = arrFiles[i];
  if (!src.includes("test")) {
    await replaceTs(src);
  }
}

await Deno.writeTextFile(
  "npm/package.json",
  `{
  "name": "nhttp-land",
  "description": "An Simple http framework for Deno and Friends",
  "author": "Herudi",
  "version": "0.0.2",
  "module": "./dist/mod.esm.js",
  "main": "./dist/mod.js",
  "types": "./types/mod.d.ts",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/nhttp/nhttp.git"
  },
  "bugs": {
    "url": "https://github.com/nhttp/nhttp/issues"
  }
}`,
);

const defObj: esbuild.BuildOptions = {
  platform: "node",
  absWorkingDir: dir,
  bundle: true,
  minify: true,
  entryPoints: [join(resolve(dir, "mod.ts"))],
};

await esbuild.build({
  ...defObj,
  format: "cjs",
  outfile: join(resolve(dir, "npm", "dist", "mod.js")),
});
await esbuild.build({
  ...defObj,
  format: "esm",
  outfile: join(resolve(dir, "npm", "dist", "mod.esm.js")),
});
await esbuild.build({
  ...defObj,
  format: "esm",
  outfile: join(resolve(dir, "mod.js")),
});

await Deno.copyFile("LICENSE", "npm/LICENSE");
await Deno.copyFile("README.MD", "npm/README.MD");

esbuild.stop();

const p = Deno.run({ cmd: ["tsc"] });
await p.status();
await Deno.remove("npm/src", { recursive: true });
