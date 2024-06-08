import { join } from "node:path";
import { readdir } from "node:fs/promises";

const VERSION = await Deno.readTextFile("VERSION");

async function updateVersionNHttp() {
  const pkg = JSON.parse(await Deno.readTextFile("deno.json"));
  pkg.version = VERSION;
  await Deno.writeTextFile("deno.json", JSON.stringify(pkg, null, 2));
}

async function readDir(dir: string): Promise<string[]> {
  const files: string[] = [];
  const getFiles = async (path: string) => {
    const dirs = await readdir(path, { withFileTypes: true });
    for (const dirEntry of dirs) {
      if (dirEntry.isDirectory()) {
        await getFiles(join(path, dirEntry.name));
      } else if (dirEntry.isFile()) {
        const filename = join(path, dirEntry.name);
        if (filename.endsWith("deno.json")) {
          files.push(filename);
        }
      }
    }
  };
  await getFiles(dir);
  return files;
}

async function updateVersionExt() {
  const list = await readDir("ext");
  for (let i = 0; i < list.length; i++) {
    const path = list[i];
    const pkg = JSON.parse(await Deno.readTextFile(path));
    pkg.version = VERSION;
    pkg.imports["@nhttp/nhttp"] = `jsr:@nhttp/nhttp@^${VERSION}`;
    await Deno.writeTextFile(path, JSON.stringify(pkg, null, 2));
  }
}

await updateVersionNHttp();
await updateVersionExt();
