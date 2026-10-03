#!/usr/bin/env node
/**
 * Syncs voiceover clips with the video.
 *
 * For every scene in src/compositions/MDSLinkedIn/script.json it:
 *   1. measures the clip duration (ffprobe),
 *   2. detects pauses (ffmpeg silencedetect),
 *   3. distributes caption lines over the speech proportionally to their
 *      length and snaps each boundary to the closest detected pause.
 *
 * Output: src/compositions/MDSLinkedIn/voiceover.generated.json, imported
 * by the composition (durations + caption timings in ms).
 *
 * Run after regenerating any voiceover file:  npm run sync:voiceover
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const scriptPath = join(root, "src/compositions/MDSLinkedIn/script.json");
const outPath = join(
  root,
  "src/compositions/MDSLinkedIn/voiceover.generated.json",
);
const script = JSON.parse(readFileSync(scriptPath, "utf8"));

const probeDuration = (file) =>
  Number(
    execFileSync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "csv=p=0",
      file,
    ])
      .toString()
      .trim(),
  );

const parseSilences = (file, duration) => {
  // ffmpeg logs silencedetect results on stderr.
  const { stderr } = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-nostats",
      "-i",
      file,
      "-af",
      "silencedetect=noise=-38dB:d=0.2",
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf8" },
  );
  const starts = [...stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) =>
    Number(m[1]),
  );
  const ends = [...stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) =>
    Number(m[1]),
  );
  return starts.map((s, i) => ({ start: s, end: ends[i] ?? duration }));
};

const weight = (text) => text.replace(/[^\p{L}\p{N}]/gu, "").length + 4;

const scenes = script.scenes.map((scene) => {
  const file = join(root, "public", scene.audio);
  const duration = probeDuration(file);
  // Detect pauses on the un-normalized take when available (cleaner floor).
  const raw = join(dirname(file), "raw", basename(file));
  const silences = parseSilences(existsSync(raw) ? raw : file, duration);

  // Speech starts after a leading silence and ends before a trailing one.
  const speechStart =
    silences[0] && silences[0].start < 0.05 ? silences[0].end : 0;
  const last = silences[silences.length - 1];
  const speechEnd = last && last.end >= duration - 0.05 ? last.start : duration;
  const inner = silences.filter(
    (s) => s.start > speechStart && s.end < speechEnd,
  );
  const speechTime =
    speechEnd - speechStart - inner.reduce((a, s) => a + (s.end - s.start), 0);

  // Map "speech-only" time → absolute clip time.
  const toAbsolute = (t) => {
    let abs = speechStart;
    let remaining = t;
    for (const s of inner) {
      const segment = s.start - abs;
      if (remaining <= segment) return abs + remaining;
      remaining -= segment;
      abs = s.end;
    }
    return abs + remaining;
  };

  const weights = scene.captions.map(weight);
  const total = weights.reduce((a, b) => a + b, 0);
  const pauses = inner.map((s) => (s.start + s.end) / 2);
  // Longer pauses are much more likely to be sentence boundaries.
  const cost = (j, ideal) =>
    Math.abs(pauses[j] - ideal) - 2.5 * (inner[j].end - inner[j].start - 0.2);
  const used = new Set();
  const boundaries = [speechStart];
  let acc = 0;
  for (let i = 0; i < weights.length - 1; i++) {
    acc += weights[i];
    const ideal = toAbsolute((acc / total) * speechTime);
    let best = null;
    for (let j = 0; j < pauses.length; j++) {
      if (used.has(j) || pauses[j] <= boundaries[boundaries.length - 1])
        continue;
      if (best === null || cost(j, ideal) < cost(best, ideal)) best = j;
    }
    if (best !== null && Math.abs(pauses[best] - ideal) < 1.4) {
      used.add(best);
      boundaries.push(pauses[best]);
    } else {
      boundaries.push(Math.max(ideal, boundaries[boundaries.length - 1] + 0.3));
    }
  }
  boundaries.push(speechEnd + 0.25);

  const captions = scene.captions.map((text, i) => ({
    text,
    startMs: Math.round(boundaries[i] * 1000),
    endMs: Math.round(boundaries[i + 1] * 1000),
  }));

  return {
    id: scene.id,
    audio: scene.audio,
    durationMs: Math.round(duration * 1000),
    captions,
  };
});

writeFileSync(outPath, JSON.stringify({ scenes }, null, 2) + "\n");
console.log(`Wrote ${outPath}`);
for (const s of scenes)
  console.log(
    `  ${s.id}: ${(s.durationMs / 1000).toFixed(2)}s, ${s.captions.length} captions`,
  );
