import { build } from "esbuild";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const checkOnly = process.argv.includes("--check");

mkdirSync(dist, { recursive: true });

await build({
  entryPoints: [resolve(root, "src/main.jsx")],
  bundle: true,
  minify: !checkOnly,
  format: "iife",
  target: ["es2019"],
  jsx: "automatic",
  loader: { ".js": "jsx", ".jsx": "jsx" },
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: resolve(dist, "app.js"),
  write: !checkOnly,
  logLevel: "info",
  metafile: true,
});

if (!checkOnly) {
  const biOut = resolve(dist, "bi");
  rmSync(biOut, { recursive: true, force: true });
  cpSync(resolve(root, "bi"), biOut, { recursive: true });

  const staticVercel = {
    $schema: "https://openapi.vercel.sh/vercel.json",
    cleanUrls: true,
    trailingSlash: false,
    rewrites: [{ source: "/bi", destination: "/bi/index.html" }],
    headers: [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      },
      { source: "/app.js", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/bi/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=3600" }] }
    ]
  };
  writeFileSync(resolve(dist, "vercel.json"), JSON.stringify(staticVercel, null, 2) + "\n");

  const bytes = readFileSync(resolve(dist, "app.js")).length;
  writeFileSync(
    resolve(dist, "BUILD_INFO.txt"),
    "EyeMakkah bundle\n" +
      "built: " + new Date().toISOString() + "\n" +
      "consumer bundle bytes: " + bytes + "\n" +
      "BI: static /bi (no server runtime)\n"
  );
  console.log("dist/app.js — " + (bytes / 1024).toFixed(1) + " KB");
  console.log("dist/bi — static BI platform copied");
} else {
  const { execFileSync } = await import("node:child_process");
  execFileSync(process.execPath, ["--check", resolve(root, "bi/app.js")], { stdio: "inherit" });
  console.log("syntax + import checks passed");
}
