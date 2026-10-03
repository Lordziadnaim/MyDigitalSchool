/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// LinkedIn-friendly MP4 defaults: H.264, good quality, AAC audio.
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");

// Optional: use an already-installed Chrome/Chromium instead of letting
// Remotion download "Chrome Headless Shell" (useful on locked-down networks).
// export REMOTION_BROWSER_EXECUTABLE=/path/to/chrome
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}

// 3D (WebGL) renderer. On a machine with a GPU the default ("angle") is
// best. On a server without GPU use software rendering:
// export REMOTION_GL=swangle
if (process.env.REMOTION_GL) {
  Config.setChromiumOpenGlRenderer(
    process.env.REMOTION_GL as "swangle" | "angle" | "egl" | "swiftshader" | "vulkan",
  );
}
