import { Color } from "three";
import { BEATS } from "./edit";

/** Pure timing helpers (film seconds). */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Linear 0→1 between a and b. */
export const lin = (t: number, a: number, b: number) =>
  clamp01((t - a) / (b - a));

/** Smooth 0→1 between a and b. */
export const smooth = (t: number, a: number, b: number) => {
  const x = lin(t, a, b);
  return x * x * (3 - 2 * x);
};

/** Ease-out cubic 0→1 starting at `start` for `dur` seconds. */
export const easeOut = (t: number, start: number, dur: number) =>
  1 - Math.pow(1 - lin(t, start, start + dur), 3);

/** 0 = night, 1 = full daylight. */
export const dayness = (t: number) => smooth(t, BEATS.dawnFrom, BEATS.dawnTo);

/** 0→1→0 bump around dawn (pink/orange sky in between). */
export const dawnGlow = (t: number) => {
  const d = dayness(t);
  return Math.sin(d * Math.PI) * (d < 0.5 ? 1 : 1 - (d - 0.5) * 0.8);
};

const tmp = new Color();
/** Mix of colour stops, returns a new Color. */
export const mix3 = (night: string, dawn: string, day: string, t: number) => {
  const d = dayness(t);
  const c = new Color(night);
  if (d < 0.5) return c.lerp(tmp.set(dawn), d * 2);
  return c.set(dawn).lerp(tmp.set(day), (d - 0.5) * 2);
};
