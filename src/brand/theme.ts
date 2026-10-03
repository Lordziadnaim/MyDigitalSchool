/**
 * MyDigitalSchool art direction (DA) tokens.
 *
 * Sampled from the official homepage (mydigitalschool.com, oct. 2026) and
 * the official logo:
 * - Purple #662483 — hero blocks, buttons, links.
 * - Turquoise #2DB8C5 — right half of the logo brain, "DIGITAL", bands.
 * - Pink #E71D73 — tags ("TITRE RNCP", "DEV & CODE"), ratings.
 * - Light cyan #E0F5F7 — light sections.
 * - Dark grey #3C3C3B — left half of the logo brain, text, footer.
 *
 * Every component reads from this file.
 */
export const colors = {
  /** Brand purple. */
  purple: "#662483",
  purpleLight: "#8E4BAE",
  /** Brand turquoise ("DIGITAL" + right brain). Kept as `blue` for brevity. */
  blue: "#2DB8C5",
  blueDeep: "#1F8F99",
  /** Light cyan section background. */
  blueLight: "#E0F5F7",
  /** Brand pink used for tags. */
  pink: "#E71D73",
  /** Logo dark grey. */
  greyDark: "#3C3C3B",
  /** Video background: very deep version of the brand purple. */
  ink: "#24102F",
  inkSoft: "#351747",
  inkLine: "#55306A",
  white: "#FFFFFF",
  /** Neutral used for the "grey routine" part of the story. */
  grey: "#8C8A8F",
  greyLight: "#CFCCD2",
} as const;

export const radii = {
  sm: 12,
  md: 24,
  lg: 40,
  pill: 999,
} as const;

/** Safe area for 1920×1080 (scale with width for other formats). */
export const safeArea = {
  x: 120,
  y: 100,
} as const;
