import type { TRet } from "../../src/types.ts";

let fs_glob: TRet;
export const writeFile = async (...args: TRet): Promise<TRet> => {
  try {
    if (fs_glob) return fs_glob?.writeFileSync(...args);
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    fs_glob = await import("node:fs");
    return fs_glob.writeFileSync(...args);
  } catch (_e) { /* noop */ }
  fs_glob = {};
  return void 0;
};
