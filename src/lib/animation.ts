import { Easing, interpolate, spring } from "remotion";

/**
 * Small, frame-driven animation helpers.
 *
 * Every helper is a pure function of `frame` so it renders identically in
 * Studio, in the Player and in `remotion render`. Never use CSS
 * transitions/animations in Remotion — they don't render deterministically.
 */

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Smooth "ease out expo"-like curve used across the project. */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 between `start` and `start + duration` (frames). */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = EASE_OUT,
): number =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
    ...clamp,
    easing,
  });

/** Fade in at `start`, optionally fade out ending at `end`. */
export const fadeInOut = (
  frame: number,
  start: number,
  end?: number,
  fade = 12,
): number => {
  const inP = progress(frame, start, fade);
  if (end === undefined) return inP;
  const outP = 1 - progress(frame, end - fade, fade, EASE_IN_OUT);
  return Math.min(inP, outP);
};

/** Physically based 0 → 1 pop starting at `delay`. */
export const pop = (
  frame: number,
  fps: number,
  delay = 0,
  damping = 14,
  stiffness = 120,
): number =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness, mass: 0.8 },
  });

/** Gentle 0 → 1 with no overshoot. */
export const softSpring = (frame: number, fps: number, delay = 0): number =>
  spring({ frame: frame - delay, fps, config: { damping: 200 } });

/** Linear map with clamping, shortcut for interpolate(). */
export const mapRange = (
  value: number,
  input: [number, number],
  output: [number, number],
  easing?: (t: number) => number,
): number => interpolate(value, input, output, { ...clamp, easing });

/** Delay (in frames) for the n-th item of a staggered list. */
export const stagger = (index: number, step = 4, offset = 0): number =>
  offset + index * step;

/** Slow ambient oscillation, useful for floating shapes. */
export const float = (frame: number, speed = 0.03, amplitude = 10, phase = 0) =>
  Math.sin(frame * speed + phase) * amplitude;
