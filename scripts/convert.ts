const flag = "https://esm.sh/";
const reg = /https:\/\/esm\.sh\/v132\/|@([0-9\.]+)/g;

function urlToNpm(source: string) {
  const arr = source.split("\n");
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].includes(flag)) {
      arr[i] = arr[i].replace(reg, "");
    }
  }
  return arr.join("\n");
}

export async function replaceTs(source: string, dest: string, prefix?: string) {
  try {
    const stat = await Deno.stat(source);
    if (stat.isFile) {
      const str = await Deno.readTextFile(source);
      let str2 = str.replaceAll(".ts", "");
      if (str2.includes(flag)) str2 = urlToNpm(str2);
      await Deno.writeTextFile(dest, (prefix || "") + str2);
    }
  } catch (_error) {
  }
}

export async function getNames(currentPath: string) {
  const names: string[] = [];
  for await (const dirEntry of Deno.readDir(currentPath)) {
    const entryPath = `${currentPath}/${dirEntry.name}`;
    names.push(entryPath);
    if (dirEntry.isDirectory) {
      const arr = await getNames(entryPath);
      names.push(arr as unknown as string);
    }
  }
  return names.flat();
}
