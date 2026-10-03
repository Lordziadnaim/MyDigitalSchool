/**
 * MyDigitalSchool art direction (DA) tokens.
 *
 * Sources:
 * - Brand colors published for mydigitalschool.com (Brandfetch):
 *   Scooter blue #2DB8C5, Haiti #14071A, white #FFFFFF.
 * - Logo principle stated by the school: "le noir de l'expertise
 *   informatique s'associe au bleu de la liberté de créer et d'entreprendre".
 *
 * The tints below are derived from those three colors. If the school
 * provides an official brand book, update the values here: every
 * component reads from this file.
 */
export const colors = {
  /** Primary brand blue ("le bleu de la liberté de créer"). */
  blue: "#2DB8C5",
  blueLight: "#7FD6DE",
  blueDeep: "#1A8C97",
  /** Brand near-black ("le noir de l'expertise"). */
  ink: "#14071A",
  inkSoft: "#22142A",
  inkLine: "#3A2C42",
  white: "#FFFFFF",
  /** Neutral used for the "grey routine" part of the story. */
  grey: "#8A8190",
  greyLight: "#C9C4CC",
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
