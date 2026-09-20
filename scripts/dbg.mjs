/* headless reasoning check on the pure functions, run through esbuild */
import { build } from "esbuild";
import { writeFileSync } from "node:fs";
const r = await build({
  entryPoints: ["scripts/dbg-entry.jsx"], bundle: true, format: "esm", jsx: "automatic",
  loader: { ".jsx": "jsx" }, write: false, target: ["es2020"], packages: "bundle",
});
writeFileSync("/tmp/claude-0/-home-user-EyeMakkah/bdda0f4a-9b40-5755-97f3-db2bbfc5eb30/scratchpad/dbg.mjs", r.outputFiles[0].text);
