/**
 * V3 — « Sauf une. » (campus de Lille). Edit decision list, in SECONDS.
 *
 * One continuous 3D shot over Lille at night: every window is off except
 * Inès's. We fly into her room, watch what she does at 2:17 a.m., pull
 * back out, and discover that dozens of other windows are lit too. Their
 * light converges on one building near Lille-Flandres, and dawn breaks.
 * The school is only named on screen, at the very end.
 *
 * Everything (camera, lights, captions, audio) reads its timing from here.
 */

export const TOTAL_SECONDS = 56;

export type LineId =
  | "n01"
  | "n02"
  | "n03"
  | "n04"
  | "n05"
  | "n06"
  | "n07"
  | "n08"
  | "n09";

type Line = {
  readonly id: LineId;
  /** Film time (s) where the clip starts. */
  readonly at: number;
  /** Clip length (s), measured on public/v3/voice/<id>.mp3. */
  readonly dur: number;
  /** Subtitle chunks; `at` is relative to the clip start (pauses in the take). */
  readonly captions: readonly { readonly text: string; readonly at: number }[];
};

export const LINES: readonly Line[] = [
  {
    id: "n01",
    at: 1.0,
    dur: 1.83,
    captions: [{ text: "Deux heures dix-sept. Lille.", at: 0 }],
  },
  {
    id: "n02",
    at: 3.4,
    dur: 1.54,
    captions: [{ text: "Toutes les fenêtres sont éteintes.", at: 0 }],
  },
  { id: "n03", at: 5.6, dur: 0.65, captions: [{ text: "Sauf une.", at: 0 }] },
  {
    id: "n04",
    at: 10.4,
    dur: 3.58,
    captions: [
      { text: "Elle, c'est Inès.", at: 0 },
      { text: "Le jour, elle fait ce qu'on attend d'elle.", at: 1.65 },
    ],
  },
  {
    id: "n05",
    at: 14.6,
    dur: 7.44,
    captions: [
      { text: "Mais la nuit…", at: 0 },
      { text: "elle monte des vidéos.", at: 1.3 },
      { text: "Elle redessine des logos qui existent déjà.", at: 2.67 },
      { text: "Elle passe trois heures sur une seule police.", at: 5.17 },
    ],
  },
  {
    id: "n06",
    at: 22.9,
    dur: 3.76,
    captions: [
      { text: "Ses potes disent qu'elle perd son temps.", at: 0 },
      { text: "Et elle… elle les croit.", at: 2.02 },
    ],
  },
  {
    id: "n07",
    at: 27.7,
    dur: 4.91,
    captions: [
      { text: "Ce qu'elle ne sait pas…", at: 0 },
      { text: "c'est qu'à Lille, à deux heures dix-sept…", at: 1.46 },
      { text: "elle n'est pas la seule.", at: 4.0 },
    ],
  },
  {
    id: "n08",
    at: 33.6,
    dur: 6.3,
    captions: [
      { text: "Et qu'il existe un endroit,", at: 0 },
      { text: "à trois minutes de la gare Lille-Flandres…", at: 1.47 },
      { text: "où cette lumière-là reste allumée en plein jour.", at: 3.9 },
    ],
  },
  {
    id: "n09",
    at: 43.4,
    dur: 3.81,
    captions: [
      { text: "Si la tienne est encore allumée à deux heures…", at: 0 },
      { text: "c'est peut-être pas du temps perdu.", at: 2.38 },
    ],
  },
];

// Lines must never overlap.
LINES.forEach((l, i) => {
  const next = LINES[i + 1];
  if (next && l.at + l.dur > next.at) {
    throw new Error(`Voice line ${l.id} overlaps ${next.id}`);
  }
});

/** Story beats (film seconds) shared by the 3D world and the overlays. */
export const BEATS = {
  /** City windows switch off one by one ("Toutes les fenêtres…"). */
  lightsOutFrom: 2.4,
  lightsOutTo: 5.2,
  /** "Sauf une." — Inès's window flares. */
  onlyOne: 5.65,
  /** Camera crosses the window frame (in, then out). */
  enterRoom: 10.2,
  exitRoom: 27.5,
  /** Creative objects rising out of the laptop. */
  video: 15.9,
  logo: 17.3,
  font: 19.8,
  /** Friends' messages on the phone. */
  phone: 22.95,
  /** "elle les croit" — her light dims. */
  doubt: 24.9,
  /** "elle n'est pas la seule" — other windows light up. */
  othersFrom: 31.65,
  othersTo: 34.2,
  /** Light threads converge on the campus. */
  threadsFrom: 34.0,
  threadsTo: 41.0,
  /** "en plein jour" — dawn. */
  dawnFrom: 37.4,
  dawnTo: 42.5,
  /** End card. */
  tagline: 48.0,
  logo2: 48.8,
  address: 50.2,
  fadeOut: 55.2,
} as const;

/** Sound design, film seconds. */
export const SFX: readonly {
  readonly file: "night" | "dawn" | "typing" | "swoosh" | "chime";
  readonly at: number;
  readonly volume: number;
  readonly dur?: number;
}[] = [
  { file: "night", at: 0, volume: 0.55, dur: 20 },
  { file: "night", at: 19.5, volume: 0.55, dur: 20 },
  { file: "chime", at: 5.6, volume: 0.5 },
  { file: "swoosh", at: 8.6, volume: 0.5 },
  { file: "typing", at: 11.0, volume: 0.35, dur: 8 },
  { file: "swoosh", at: 27.0, volume: 0.55 },
  { file: "chime", at: 31.7, volume: 0.35 },
  { file: "chime", at: 32.5, volume: 0.25 },
  { file: "chime", at: 33.3, volume: 0.2 },
  { file: "dawn", at: 38.5, volume: 0.6, dur: 12 },
];
