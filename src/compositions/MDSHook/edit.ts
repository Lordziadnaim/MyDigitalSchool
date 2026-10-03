import durations from "./voice.generated.json";

/**
 * V2 — « Stop. Ne scrolle pas. » — the edit decision list.
 *
 * Everything is expressed in SECONDS so the film is frame-rate independent
 * (rendered at 60 fps by default, see src/config/video.ts). Convert with
 * `Math.round(seconds * fps)`.
 *
 * Voice: ElevenLabs Eleven v4, voice "Alexandre – Commercial & Brand Voice"
 * (EGS8Z4YTFhSL6Mm6LpoK, native Parisian French), one clip per line so each
 * line can be placed on the music grid (120 BPM → one beat = 0.5 s).
 */

export const TOTAL_SECONDS = 62;
export const BEAT = 0.5;

export type LineId = keyof typeof durations;

export type Line = {
  readonly id: LineId;
  /** Start time in seconds. */
  readonly at: number;
  /** On-screen caption text (may differ slightly from the spoken text). */
  readonly text: string;
  /** Hide the bottom captions when the scene already shows the words big. */
  readonly captions: boolean;
};

export const LINES: Line[] = [
  // HOOK — pattern interrupt aimed at someone who is literally scrolling.
  { id: "l01", at: 0.15, text: "Stop.", captions: false },
  {
    id: "l02",
    at: 1.05,
    text: "Ne scrolle pas tout de suite.",
    captions: false,
  },
  {
    id: "l03",
    at: 2.45,
    text: "Ce que ton pouce fait tous les jours… c'est un métier.",
    captions: true,
  },
  // IDENTIFICATION — fast montage of things the ICP already does.
  {
    id: "l04",
    at: 6.4,
    text: "Tu montes des vidéos pile sur le beat.",
    captions: true,
  },
  {
    id: "l05",
    at: 8.85,
    text: "Tu changes trois fois de police pour une story.",
    captions: true,
  },
  {
    id: "l06",
    at: 11.35,
    text: "Tu sais pourquoi un post cartonne… et pourquoi l'autre fait un flop.",
    captions: true,
  },
  {
    id: "l07",
    at: 15.7,
    text: "T'as déjà ouvert le code d'un site. Juste pour voir.",
    captions: true,
  },
  // REFRAME — the drop.
  { id: "l08", at: 19.75, text: "Ça ? C'est du montage.", captions: false },
  { id: "l09", at: 21.65, text: "Du design.", captions: false },
  { id: "l10", at: 22.85, text: "Du community management.", captions: false },
  { id: "l11", at: 24.65, text: "Du développement.", captions: false },
  {
    id: "l12",
    at: 26.0,
    text: "Des vrais métiers. Qui recrutent.",
    captions: false,
  },
  // TENSION — the limiting belief.
  {
    id: "l13",
    at: 28.8,
    text: "Mais on t'a dit que c'était « perdre ton temps ».",
    captions: true,
  },
  {
    id: "l14",
    at: 31.2,
    text: "Que ton avenir se jouait à 17 ans… sur un formulaire.",
    captions: true,
  },
  { id: "l15", at: 35.2, text: "Faux.", captions: false },
  // SOLUTION + PROOF (figures from the official homepage).
  {
    id: "l16",
    at: 36.3,
    text: "Ton talent existe déjà. Il lui manque juste un métier.",
    captions: true,
  },
  {
    id: "l17",
    at: 40.0,
    text: "En alternance, tu te formes… et t'es payé.",
    captions: true,
  },
  {
    id: "l18",
    at: 43.0,
    text: "17 campus. 20 formations, du BTS au MBA.",
    captions: true,
  },
  {
    id: "l19",
    at: 47.7,
    text: "Plus de 1 800 entreprises partenaires qui recrutent.",
    captions: true,
  },
  // BRAND + CTA — loops back to the hook (scrolling).
  {
    id: "l20",
    at: 51.3,
    text: "MyDigitalSchool. L'école des métiers du digital.",
    captions: true,
  },
  {
    id: "l21",
    at: 55.4,
    text: "Alors… tu continues de scroller ? Ou tu commences ?",
    captions: true,
  },
];

export const lineEnd = (l: Line) => l.at + durations[l.id];
export const lineDuration = (id: LineId) => durations[id];
export const getLine = (id: LineId) => {
  const l = LINES.find((x) => x.id === id);
  if (!l) throw new Error(`Unknown line ${id}`);
  return l;
};

// Fail fast if a re-generated line now overlaps the next one.
LINES.forEach((l, i) => {
  const next = LINES[i + 1];
  if (next && lineEnd(l) > next.at - 0.05) {
    throw new Error(
      `Voice line ${l.id} ends at ${lineEnd(l).toFixed(2)}s, after ${next.id} starts (${next.at}s). Move ${next.id} later in edit.ts.`,
    );
  }
});

/** Scene cuts (seconds). Each scene is a <Sequence> in HookFilm.tsx. */
export const SCENES = {
  stop: [0, 1.0],
  noScroll: [1.0, 2.4],
  thumb: [2.4, 6.3],
  montage: [6.3, 8.75],
  font: [8.75, 11.25],
  posts: [11.25, 15.6],
  code: [15.6, 18.6],
  riser: [18.6, 19.7],
  drop: [19.7, 28.5],
  belief: [28.5, 35.15],
  faux: [35.15, 36.25],
  talent: [36.25, 39.95],
  alternance: [39.95, 42.95],
  stats: [42.95, 47.6],
  partners: [47.6, 51.0],
  brand: [51.0, 55.3],
  cta: [55.3, 62.0],
} as const satisfies Record<string, readonly [number, number]>;

export type SceneId = keyof typeof SCENES;

/** Sound design cues (seconds). */
export const SFX: { file: string; at: number; volume: number }[] = [
  { file: "impact", at: 0.1, volume: 0.9 },
  { file: "glitch", at: 0.95, volume: 0.45 },
  { file: "notif", at: 1.0, volume: 0.35 },
  { file: "glitch", at: 6.2, volume: 0.5 },
  { file: "whoosh", at: 8.65, volume: 0.6 },
  { file: "whoosh", at: 11.15, volume: 0.6 },
  { file: "whoosh", at: 15.5, volume: 0.6 },
  { file: "riser", at: 18.65, volume: 0.8 },
  { file: "impact", at: 19.7, volume: 1 },
  { file: "impact", at: 21.6, volume: 0.6 },
  { file: "impact", at: 22.8, volume: 0.6 },
  { file: "impact", at: 24.6, volume: 0.6 },
  { file: "impact", at: 25.95, volume: 0.8 },
  { file: "whoosh", at: 28.4, volume: 0.5 },
  { file: "impact", at: 35.12, volume: 1 },
  { file: "glitch", at: 35.15, volume: 0.6 },
  { file: "whoosh", at: 39.85, volume: 0.6 },
  { file: "whoosh", at: 42.85, volume: 0.6 },
  { file: "whoosh", at: 47.5, volume: 0.6 },
  { file: "impact", at: 51.0, volume: 0.9 },
  { file: "click", at: 58.75, volume: 0.8 },
  { file: "impact", at: 59.3, volume: 0.7 },
];

/** Moments that get a white flash + camera shake. */
export const HITS = [
  0.12, 19.7, 21.62, 22.82, 24.62, 25.97, 35.14, 51.02, 59.3,
];
