import type { NHttp } from "../../../mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.17.19/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.7.0/mod.ts";

const map = new Map();
const BUILD_ID = Date.now();
export default (app: NHttp, elem: JSX.Element) => {
  // deno-lint-ignore no-explicit-any
  const url = (elem?.type as any)?.meta_url;
  if (!url) return void 0;
  const hash = btoa(url.slice(-32)).replace(/=/g, "");
  const clientPath = `/${hash}.${BUILD_ID}.js`;
  if (!map.has(url)) {
    app.get(clientPath, async (rev) => {
      if (!map.has(clientPath)) {
        const res = await esbuild.build({
          format: "esm",
          bundle: true,
          minify: true,
          entryPoints: [url],
          plugins: denoPlugins(),
          write: false,
        });
        map.set(clientPath, res.outputFiles[0].contents);
      }
      rev.response.type("js");
      rev.response.setHeader(
        "cache-control",
        "public, max-age=604800, immutable",
      );
      return map.get(clientPath);
    });
    map.set(url, true);
  }
  return clientPath;
};
