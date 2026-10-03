/**
 * Global video settings.
 *
 * Change these values to change the resolution / frame rate of new
 * compositions registered in `src/Root.tsx` (default: 1920×1080 @ 60 fps).
 * The V1 film and the Sample are pinned to 30 fps (LEGACY_FPS) because
 * some of their animations are written in frames. Durations are expressed in
 * seconds and converted to frames with `seconds()` so that changing FPS
 * keeps timings identical.
 */
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 60,
} as const;

/** Frame rate of the V1 film and the Sample composition. */
export const LEGACY_FPS = 30;

/** Convert seconds to a whole number of frames at the given fps. */
export const seconds = (s: number, fps: number = VIDEO.fps): number =>
  Math.round(s * fps);
