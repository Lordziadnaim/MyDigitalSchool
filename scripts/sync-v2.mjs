#!/usr/bin/env node
/**
 * V2 (« Stop. Ne scrolle pas. ») — measures every voice line in
 * public/v2/voice/*.mp3 and writes their durations to
 * src/compositions/MDSHook/voice.generated.json.
 *
 * Run after regenerating / re-trimming a line:  npm run sync:v2
 */
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public/v2/voice");
const out = join(root, "src/compositions/MDSHook/voice.generated.json");

const durations = {};
for (const f of readdirSync(dir).filter((f) => f.endsWith(".mp3")).sort()) {
  const d = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", join(dir, f)])
      .toString()
      .trim(),
  );
  durations[f.replace(".mp3", "")] = Math.round(d * 1000) / 1000;
}
writeFileSync(out, JSON.stringify(durations, null, 2) + "\n");
console.log(`Wrote ${out}`);
console.log(durations);
