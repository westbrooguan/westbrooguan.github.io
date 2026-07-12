import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("src", "dist", { recursive: true });
process.argv[2] = "dist";
await import("./validate-site.mjs");
console.log("Built dist");
