/* Inlines assets/photo-data.js into EyeMakkah-app.jsx as the PHOTO_DATA block, so
   the single-file JSX artifact and the zero-build bundle both carry their own
   photography and need no image host at runtime. */
import { readFile, writeFile } from "node:fs/promises";
const jsxPath = "EyeMakkah-app.jsx";
const src = await readFile(jsxPath, "utf8");
const data = (await readFile("assets/photo-data.js", "utf8")).trim();
const start = src.indexOf("const PHOTO_DATA = {");
if (start < 0) throw new Error("PHOTO_DATA block not found");
// the block is one object literal whose entries are single-line data URIs, so its
// closing brace is the first line that starts with "};"
const close = src.indexOf("\n};", start);
if (close < 0) throw new Error("PHOTO_DATA end not found");
await writeFile(jsxPath, src.slice(0, start) + data + src.slice(close + 3));
console.log("PHOTO_DATA:", (data.match(/data:image\/webp/g) || []).length, "photos inlined");
