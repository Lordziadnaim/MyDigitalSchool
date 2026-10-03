/**
 * Global video settings.
 *
 * Change these values to change the resolution / frame rate of every
 * composition registered in `src/Root.tsx`. Durations are expressed in
 * seconds and converted to frames with `seconds()` so that changing FPS
 * keeps timings identical.
 */
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

/** Convert seconds to a whole number of frames at the given fps. */
export const seconds = (s: number, fps: number = VIDEO.fps): number =>
  Math.round(s * fps);
