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
    packages: "external",
  });

  console.log("Build complete!");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
