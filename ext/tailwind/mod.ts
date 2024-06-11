// mod.ts
/**
 * @module
 *
 * This module contains tailwind middleware and tailwind builder for NHttp.
 */
import tailwindCss, { type Config } from "tailwindcss";
import postcss, {
  type Plugin,
  type ProcessOptions,
  type Processor,
  type Result,
} from "postcss";
import autoprefixer, { type Options as ConfigAutoprefixer } from "autoprefixer";
import cssnano, { type Options as ConfigCssnano } from "cssnano";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Handler, NHttp } from "@nhttp/nhttp";

const def_tailwind = "@tailwind base;@tailwind components;@tailwind utilities;";

/**
 * `interface` PostcssOptions.
 */
interface PostcssOptions extends ProcessOptions {
  /**
   * callback onProcess.
   */
  onProcess?: (postcss: Processor) => void | Promise<void>;
  /**
   * add more plugins postcss.
   */
  plugins?: Plugin[];
}
/**
 * `interface` TailwindConfig.
 */
export interface TailwindConfig extends Config {
  /**
   * path input tailwindcss
   */
  input?: string;
  /**
   * path output tailwindcss
   */
  output?: string;
  /**
   * minify the output. default to `false`.
   */
  minify?: boolean;
  /**
   * autoprefixer config.
   */
  autoprefixer?: ConfigAutoprefixer;
  /**
   * postcss config.
   */
  postcss?: PostcssOptions;
  /**
   * cssnano config.
   */
  cssnano?: ConfigCssnano;
}

/**
 * Build tailwindcss using postcss.
 *
 * @example
 * ```ts
 * import { build } from "@nhttp/tailwind";
 *
 * const isDev = Deno.args.includes("--dev");
 * const isBuild = Deno.args.includes("--build");
 *
 * if (isDev || isBuild) {
 *   await build({
 *     input: "./tailwind.css",
 *     output: "./public/css/style.css",
 *     content: ["./src/*%2A/*.tsx"],
 *     minify: isBuild,
 *   });
 * }
 * ```
 */
export async function build(opts: TailwindConfig): Promise<Result> {
  const {
    input,
    output,
    postcss: postcssConfig = {},
    cssnano: cssnanoConfig,
    minify,
    autoprefixer: autoprefixerConfig,
    ...tailwindConfig
  } = opts;
  let plugins = [
    tailwindCss(tailwindConfig as Config),
    autoprefixer(autoprefixerConfig),
  ];
  if (minify) plugins.push(cssnano(cssnanoConfig));
  if (postcssConfig.plugins) plugins = plugins.concat(postcssConfig.plugins);
  const post = postcss(plugins);
  if (postcssConfig.onProcess) postcssConfig.onProcess(post);
  const from = input ? readFileSync(input, "utf-8") : def_tailwind;
  postcssConfig.from ??= input ?? undefined;
  if (output) postcssConfig.to = output;
  const proc = await post.process(from, postcssConfig);
  if (output) {
    const css = proc.toString();
    const dir = dirname(output);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(output, css, "utf-8");
    if (proc.map) {
      writeFileSync(output + ".map", proc.map.toString(), "utf-8");
    }
  }
  return proc;
}
const cache: Record<string, string> = {};
function addRoute(app: NHttp, cache: Record<string, string>): void {
  app.get(cache.path, (rev) => {
    rev.response.type("css", "UTF-8");
    rev.response.setHeader(
      "cache-control",
      "public, max-age=31536000, immutable",
    );
    return cache.content;
  });
}
/**
 * tailwind middleware.
 *
 * @example
 * ```tsx
 * import nhttp from "@nhttp/nhttp";
 * import { renderToHtml } from "@nhttp/nhttp/jsx";
 * import { tailwind } from "@nhttp/tailwind";
 *
 * const app = nhttp();
 *
 * const tw = await tailwind(app, {
 *   content: ["./src/*%2A/*.tsx"],
 *   minify: isProd
 * });
 *
 * app.engine(renderToHtml).use(tw);
 *
 * app.get("/", () => {
 *   return <div className="text-4xl mt-10">Hello Tailwind</div>;
 * });
 *
 * app.listen(8000);
 * ```
 */
export const tailwind = async (
  app: NHttp,
  opts: Partial<TailwindConfig> = {},
): Promise<Handler> => {
  if (opts.content) {
    cache.path = `/style.${Date.now()}.css`;
    cache.content = (await build(opts as TailwindConfig)).toString();
    addRoute(app, cache);
  }
  return async (rev, next) => {
    const res = await next();
    const type = res.headers.get("content-type");
    if (type?.includes("text/html")) {
      const clone = res.clone();
      const text = await clone.text();
      if (cache.path === void 0) {
        cache.path = `/style.${Date.now()}.css`;
        opts.content ??= [{ raw: text }];
        cache.content = (await build(opts as TailwindConfig)).toString();
        addRoute(app, cache);
      }
      rev.respondWith(
        new Response(
          text.replace(
            "</head>",
            `<link rel="stylesheet" href="${cache.path}"></link></head>`,
          ),
          {
            headers: clone.headers,
            status: clone.status,
            statusText: clone.statusText,
          },
        ),
      );
    }
  };
};
