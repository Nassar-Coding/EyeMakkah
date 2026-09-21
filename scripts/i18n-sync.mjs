/* Inlines i18n/en.json into the single-file app, so the artifact stays self-contained. */
import { readFile, writeFile } from "node:fs/promises";
const dict = JSON.parse(await readFile("i18n/en.json", "utf8"));
const src = await readFile("EyeMakkah-app.jsx", "utf8");
const start = src.indexOf("const EN_TXT = {");
const end = src.indexOf("\nconst D = (v)");
if (start < 0 || end < 0) throw new Error("EN_TXT block not found");
const body = Object.entries(dict)
  .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
  .join("\n");
const block = `const EN_TXT = {\n${body}\n};`;
await writeFile("EyeMakkah-app.jsx", src.slice(0, start) + block + src.slice(end));
console.log(`EN_TXT: ${Object.keys(dict).length} entries inlined`);
