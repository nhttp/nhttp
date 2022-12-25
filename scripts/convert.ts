export async function replaceTs(source: string, prefix?: string) {
  const str = await Deno.readTextFile(source);
  await Deno.writeTextFile(
    "npm/src/" + source,
    (prefix || "") + str.replaceAll(".ts", ""),
  );
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
  return names;
}
