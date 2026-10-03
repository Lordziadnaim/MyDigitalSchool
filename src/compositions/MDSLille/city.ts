import { random } from "remotion";

/**
 * Procedural, deterministic miniature of central Lille (1 unit ≈ 3 m).
 *
 *   x → east, z → south (towards the opening camera), y → up.
 *   Grand'Place at the origin, the belfry on its south-east corner,
 *   Inès's street north-west (z = 10), rue Pierre Mauroy running east
 *   to the campus (x ≈ 12) and Gare Lille-Flandres (x ≈ 19).
 */

export type Vec3 = readonly [number, number, number];

export type House = {
  readonly x: number;
  readonly z: number;
  readonly w: number;
  readonly d: number;
  readonly h: number;
  /** +1 = front faces +z, -1 = faces -z, +2 = faces +x, -2 = faces -x. */
  readonly facing: 1 | -1 | 2 | -2;
  readonly color: string;
  readonly gable: "stepped" | "roof" | "flat";
};

export type CityWindow = {
  readonly pos: Vec3;
  readonly facing: House["facing"];
  readonly w: number;
  readonly h: number;
  /** Warm light at the start of the film (switched off during n02). */
  readonly warm: boolean;
  /** Switch-off time of a warm window (s). */
  readonly offAt: number;
  /** Turquoise "other creators" window: lights up at this time (s), or null. */
  readonly creatorAt: number | null;
};

export const FLOOR = 0.8;

const BRICKS = ["#7A3A2C", "#8A4433", "#6B3226", "#94523C", "#5E2C22"];
const PAINTS = ["#C9B892", "#B9A27A", "#B8AFA4", "#C7A46A", "#D3C7AE"];

/** Inès's house (built by hand in InesRoom.tsx, so not in HOUSES). */
export const INES = {
  x: -2.4,
  z: 9.0,
  w: 1.3,
  d: 2.0,
  floors: 4,
  /** Centre of her window (outer face of the facade). */
  window: [-2.4, 2.0, 10.0] as Vec3,
  windowW: 0.34,
  windowH: 0.46,
  /** Interior box of her room. */
  room: { x0: -3.0, x1: -1.8, y0: 1.62, y1: 2.38, z0: 8.1, z1: 9.95 },
} as const;

/** Campus building (57 rue Pierre Mauroy, 3 min from Lille-Flandres). */
export const CAMPUS = {
  x: 12.0,
  z: -1.4,
  w: 3.2,
  d: 2.4,
  floors: 5,
  /** Point the light threads converge to. */
  target: [12.0, 3.0, 0.1] as Vec3,
} as const;

export const BELFRY = { x: 3.6, z: -4.6, h: 9.5 } as const;
export const GARE = { x: 21.0, z: 0.6, w: 2.6, len: 9.0 } as const;

type Row = {
  readonly from: number;
  readonly to: number;
  readonly at: number;
  /** "x" = row runs along x (houses face ±z); "z" = runs along z. */
  readonly axis: "x" | "z";
  readonly facing: House["facing"];
  readonly seed: string;
};

/** Street rows (both sides of each street). */
const ROWS: readonly Row[] = [
  // Inès's street (front facades on z = 10, facing the opening camera).
  { axis: "x", at: 10.0, from: -10.2, to: 8, facing: 1, seed: "r1" },
  { axis: "x", at: 14.4, from: -10.2, to: 8, facing: -1, seed: "r2" },
  // Grand'Place, north and south sides.
  { axis: "x", at: 4.6, from: -9, to: 6.4, facing: -1, seed: "r3" },
  { axis: "x", at: -4.6, from: -9, to: 2.4, facing: 1, seed: "r4" },
  { axis: "x", at: -4.6, from: 4.8, to: 6.4, facing: 1, seed: "r4b" },
  // Behind the square.
  { axis: "x", at: -9.6, from: -10.2, to: 9, facing: -1, seed: "r5" },
  { axis: "x", at: -12.0, from: -10.2, to: 9, facing: 1, seed: "r5b" },
  // West side.
  { axis: "z", at: -6.4, from: -3.4, to: 3.4, facing: 2, seed: "r6" },
  { axis: "z", at: -10.5, from: -14, to: 14, facing: 2, seed: "r7" },
  // East side of the square, south of rue Pierre Mauroy.
  { axis: "z", at: 6.4, from: -4.4, to: -0.4, facing: -2, seed: "r12" },
  // Rue Pierre Mauroy (z ≈ 1), from the square to the station.
  { axis: "x", at: 2.2, from: 6.6, to: 18, facing: -1, seed: "r8" },
  { axis: "x", at: -0.2, from: 9.0, to: 10.3, facing: 1, seed: "r9" },
  { axis: "x", at: -0.2, from: 13.7, to: 18, facing: 1, seed: "r9b" },
  { axis: "x", at: 6.8, from: 8.8, to: 18, facing: 1, seed: "r11" },
];

const pick = <T>(arr: readonly T[], r: number) =>
  arr[Math.floor(r * arr.length) % arr.length];

const buildHouses = (): House[] => {
  const out: House[] = [];
  for (const row of ROWS) {
    let p = row.from;
    let i = 0;
    while (p < row.to - 0.6) {
      const s = `${row.seed}-${i}`;
      const w = 0.9 + random(`${s}w`) * 0.55;
      const floors = 2 + Math.floor(random(`${s}f`) * 3);
      const brick = random(`${s}b`) < 0.68;
      const color = brick
        ? pick(BRICKS, random(`${s}c`))
        : pick(PAINTS, random(`${s}c`));
      const g = random(`${s}g`);
      const gable = g < 0.55 ? "stepped" : g < 0.85 ? "roof" : "flat";
      const centre = p + w / 2;
      const d = 1.8 + random(`${s}d`) * 0.5;
      // The house is set back so its front face sits on the street line.
      const back = row.facing === 1 || row.facing === 2 ? -d / 2 : d / 2;
      const house: House =
        row.axis === "x"
          ? {
              x: centre,
              z: row.at + back,
              w,
              d,
              h: floors * FLOOR,
              facing: row.facing,
              color,
              gable,
            }
          : {
              x: row.at + back,
              z: centre,
              w,
              d,
              h: floors * FLOOR,
              facing: row.facing,
              color,
              gable,
            };
      const overlapsIness =
        Math.abs(house.x - INES.x) < (house.w + INES.w) / 2 + 0.02 &&
        Math.abs(house.z - INES.z) < 1.2;
      const overlapsBelfry =
        Math.abs(house.x - BELFRY.x) < 1.6 &&
        Math.abs(house.z - BELFRY.z) < 1.6;
      const overlapsCampus =
        Math.abs(house.x - CAMPUS.x) < CAMPUS.w / 2 + house.w / 2 &&
        Math.abs(house.z - CAMPUS.z) < CAMPUS.d / 2 + 0.6;
      if (!overlapsIness && !overlapsBelfry && !overlapsCampus) out.push(house);
      p += w + 0.02;
      i++;
    }
  }
  return out;
};

export const HOUSES: readonly House[] = buildHouses();

/** Outward normal of a facade. */
export const facingNormal = (f: House["facing"]): Vec3 =>
  f === 1
    ? [0, 0, 1]
    : f === -1
      ? [0, 0, -1]
      : f === 2
        ? [1, 0, 0]
        : [-1, 0, 0];

/** Width along the street / depth across it, whatever the orientation. */
export const footprint = (h: House) =>
  Math.abs(h.facing) === 1 ? { sx: h.w, sz: h.d } : { sx: h.d, sz: h.w };

const buildWindows = (): CityWindow[] => {
  const out: CityWindow[] = [];
  HOUSES.forEach((h, hi) => {
    const n = facingNormal(h.facing);
    const half = Math.abs(h.facing) === 1 ? h.d / 2 : h.d / 2;
    const cols = h.w > 1.2 ? 3 : 2;
    const floors = Math.round(h.h / FLOOR);
    for (let f = 0; f < floors; f++) {
      for (let c = 0; c < cols; c++) {
        const s = `w${hi}-${f}-${c}`;
        const along = (c - (cols - 1) / 2) * (h.w / cols);
        const y = f * FLOOR + (f === 0 ? 0.38 : 0.42);
        const ww = f === 0 ? 0.3 : 0.22;
        const wh = f === 0 ? 0.44 : 0.34;
        const fx = h.x + n[0] * (half + 0.012);
        const fz = h.z + n[2] * (half + 0.012);
        const pos: Vec3 =
          Math.abs(h.facing) === 1 ? [fx + along, y, fz] : [fx, y, fz + along];
        const warm = f > 0 && random(`${s}warm`) < 0.16;
        out.push({
          pos,
          facing: h.facing,
          w: ww,
          h: wh,
          warm,
          offAt: 2.4 + random(`${s}off`) * 2.8,
          creatorAt: null,
        });
      }
    }
  });

  // Pick the "other creators": upper-floor windows, ordered by distance from
  // Inès so the light spreads out from her across the city.
  const ix = INES.window[0];
  const iz = INES.window[2];
  const candidates = out
    .map((w, i) => ({ w, i, r: random(`creator${i}`) }))
    // Facades that face the camera during the pull-back (south / west).
    .filter(
      ({ w, r }) =>
        w.pos[1] > 0.9 && (w.facing === 1 || w.facing === -2) && r < 0.55,
    )
    .map(({ w, i, r }) => ({
      i,
      dist: Math.hypot(w.pos[0] - ix, w.pos[2] - iz) + r * 3,
    }))
    .sort((a, b) => a.dist - b.dist);
  const maxDist = candidates.length
    ? candidates[candidates.length - 1].dist
    : 1;
  candidates.forEach(({ i, dist }) => {
    const k = dist / maxDist;
    // Ease-in: first ones appear one by one, then they multiply.
    const at = 31.7 + Math.pow(k, 0.65) * 2.6;
    out[i] = { ...out[i], creatorAt: at, warm: false };
  });
  return out;
};

export const WINDOWS: readonly CityWindow[] = buildWindows();

/** Windows whose light travels to the campus (a subset, for performance). */
export const THREAD_SOURCES: readonly CityWindow[] = WINDOWS.filter(
  (w, i) => w.creatorAt !== null && random(`thread${i}`) < 0.36,
);
