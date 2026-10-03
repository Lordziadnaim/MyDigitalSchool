import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Typography — self-hosted variable fonts in public/fonts/ (no network
 * needed at render time).
 * Same pairing as the official homepage (mydigitalschool.com):
 * - Display: Bricolage Grotesque 500–800 (ExtraBold for titles).
 * - Text: Inter 400–700, for captions and supporting copy.
 *
 * To add or swap a font, drop its files in public/fonts/ and edit the
 * `faces` list below. `loadFont()` blocks rendering until
 * the font is ready, so frames never render with a fallback font.
 */
const DISPLAY_FAMILY = "MDS Display";
const TEXT_FAMILY = "MDS Text";

/** CSS font stacks to use in `fontFamily`. */
export const displayFont = `"${DISPLAY_FAMILY}", "Bricolage Grotesque", Arial, sans-serif`;
export const textFont = `"${TEXT_FAMILY}", Inter, Arial, sans-serif`;

const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT =
  "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";

const faces = [
  {
    family: DISPLAY_FAMILY,
    file: "fonts/BricolageGrotesque-latin.woff2",
    range: LATIN,
    weight: "500 800",
  },
  {
    family: DISPLAY_FAMILY,
    file: "fonts/BricolageGrotesque-latin-ext.woff2",
    range: LATIN_EXT,
    weight: "500 800",
  },
  {
    family: TEXT_FAMILY,
    file: "fonts/Inter-latin.woff2",
    range: LATIN,
    weight: "400 700",
  },
  {
    family: TEXT_FAMILY,
    file: "fonts/Inter-latin-ext.woff2",
    range: LATIN_EXT,
    weight: "400 700",
  },
];

for (const f of faces) {
  loadFont({
    family: f.family,
    url: staticFile(f.file),
    weight: f.weight,
    unicodeRange: f.range,
    display: "block",
  }).catch((err) => {
    console.error(`Could not load font ${f.file}`, err);
  });
}
