import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

mkdirSync(resolve(root, "dist"), { recursive: true });

const result = await build({
  entryPoints: [resolve(root, "src/main.jsx")],
  bundle: true,
  minify: !checkOnly,
  format: "iife",
  target: ["es2019"],
  jsx: "automatic",
  loader: { ".js": "jsx", ".jsx": "jsx" },
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: resolve(root, "dist/app.js"),
  write: !checkOnly,
  logLevel: "info",
  metafile: true,
});

if (!checkOnly) {
  const bytes = readFileSync(resolve(root, "dist/app.js")).length;
  writeFileSync(
    resolve(root, "dist/BUILD_INFO.txt"),
    `EyeMakkah bundle\nbuilt: ${new Date().toISOString()}\nbundle bytes: ${bytes}\n`
  );
  console.log(`dist/app.js — ${(bytes / 1024).toFixed(1)} KB`);
} else {
  console.log("syntax + import check passed");
}
