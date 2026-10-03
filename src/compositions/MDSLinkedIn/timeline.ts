import voiceover from "./voiceover.generated.json";
import { LEGACY_FPS } from "../../config/video";
import type { CaptionLine } from "../../components/Captions";

/**
 * Single source of truth for the LinkedIn video timing.
 *
 * Scene length = lead-in + voiceover clip + tail. Voiceover durations and
 * caption timings come from `voiceover.generated.json` (run
 * `npm run sync:voiceover` after changing an audio file), so the video
 * re-times itself automatically.
 */
export const FPS = LEGACY_FPS;
export const TARGET_SECONDS = 180;
export const TRANSITION_FRAMES = 20;

const LEAD_SECONDS: Record<string, number> = { s1: 1.0 };
const DEFAULT_LEAD = 0.6;
const TAIL_SECONDS = 2.8;

export type SceneId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8";

export type SceneTiming = {
  readonly id: SceneId;
  readonly audio: string;
  /** Frame (scene-local) at which the voiceover starts. */
  readonly lead: number;
  readonly voFrames: number;
  readonly duration: number;
  /** Absolute start frame in the main composition. */
  readonly start: number;
  readonly captions: CaptionLine[];
  /** Scene-local frame at which each caption line starts. */
  readonly cues: number[];
};

const toFrames = (s: number) => Math.round(s * FPS);

let cursor = 0;
export const scenes: SceneTiming[] = voiceover.scenes.map((s) => {
  const lead = toFrames(LEAD_SECONDS[s.id] ?? DEFAULT_LEAD);
  const voFrames = Math.ceil((s.durationMs / 1000) * FPS);
  const duration = lead + voFrames + toFrames(TAIL_SECONDS);
  const timing: SceneTiming = {
    id: s.id as SceneId,
    audio: s.audio,
    lead,
    voFrames,
    duration,
    start: cursor,
    captions: s.captions,
    cues: s.captions.map((c) => lead + Math.round((c.startMs / 1000) * FPS)),
  };
  cursor += duration - TRANSITION_FRAMES;
  return timing;
});

/** Outro fills the remaining time so the film lasts TARGET_SECONDS. */
export const OUTRO_START = cursor;
export const OUTRO_FRAMES = Math.max(
  toFrames(6),
  toFrames(TARGET_SECONDS) - OUTRO_START,
);
export const TOTAL_FRAMES = OUTRO_START + OUTRO_FRAMES;

export const getScene = (id: SceneId): SceneTiming => {
  const s = scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
};

/** Absolute [start, end] frames where the narrator is speaking. */
export const speechWindows: [number, number][] = scenes.map((s) => [
  s.start + s.lead,
  s.start + s.lead + s.voFrames,
]);
