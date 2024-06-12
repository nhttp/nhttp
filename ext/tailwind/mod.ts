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
 * `type` HandlerPath.
 */
type HandlerPath = Handler & { path: string };

/**
 * `type` MinifyHandler.
 */
type MinifyHandler = (css: string) => string | Promise<string>;

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
  minify?: boolean | MinifyHandler;
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
 * `interface` Tailwind.
 */
export interface TailwindOptions extends TailwindConfig {
  /**
   * cache route
   */
  cache?: boolean;
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
  if (minify === true) plugins.push(cssnano(cssnanoConfig));
  if (postcssConfig.plugins) plugins = plugins.concat(postcssConfig.plugins);
  const post = postcss(plugins);
  if (postcssConfig.onProcess) postcssConfig.onProcess(post);
  const from = input ? readFileSync(input, "utf-8") : def_tailwind;
  postcssConfig.from ??= input ?? undefined;
  if (output) postcssConfig.to = output;
  const proc = await post.process(from, postcssConfig);
  if (typeof minify === "function") {
    const str = await minify(proc.toString());
    proc.css = str;
  }
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
/**
 * tailwind middleware.
 *
 * @example
 * ```tsx
 * import nhttp from "@nhttp/nhttp";
 * import tailwind from "@nhttp/tailwind";
 * import { renderToHtml } from "@nhttp/nhttp/jsx";
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
  options: TailwindOptions,
): Promise<HandlerPath> => {
  const { cache, ...opts } = options;
  const path = `/style.${Date.now()}.css`;
  const content = (await build(opts)).toString();
  app.get(path, (rev) => {
    rev.response.type("css", "UTF-8");
    if (cache !== false) {
      rev.response.setHeader(
        "cache-control",
        "public, max-age=31536000, immutable",
      );
    }
    return content;
  });
  const tw: HandlerPath = async (rev, next) => {
    const res = await next();
    const type = res.headers.get("content-type");
    if (type?.includes("text/html")) {
      const clone = res.clone();
      const text = await clone.text();
      rev.respondWith(
        new Response(
          text.replace(
            "</head>",
            `<link rel="stylesheet" href="${path}"></head>`,
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
  tw.path = path;
  return tw;
};

export default tailwind;
