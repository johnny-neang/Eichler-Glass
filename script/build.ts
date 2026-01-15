import { execSync } from "child_process";
import * as esbuild from "esbuild";

async function build() {
  console.log("Building frontend...");
  execSync("npx vite build", { stdio: "inherit" });

  console.log("Building server...");
  await esbuild.build({
    entryPoints: ["server/index.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "esm",
    outfile: "dist/index.mjs",
    banner: {
      js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`,
    },
    external: [
      "pg-native",
      "better-sqlite3",
      "@neondatabase/serverless",
      "lightningcss",
      "vite",
    ],
  });

  console.log("Build complete!");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
