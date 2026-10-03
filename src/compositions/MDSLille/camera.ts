import { CatmullRomCurve3, Vector3 } from "three";
import type { Vec3 } from "./city";

/**
 * The whole film is ONE camera move. Keys are in film seconds; the path
 * goes through every key position (Catmull-Rom) and time is mapped onto it
 * with a monotone cubic, so the camera never stops dead or jerks at a key.
 */
type Key = {
  readonly t: number;
  readonly pos: Vec3;
  readonly look: Vec3;
  readonly fov: number;
};

const KEYS: readonly Key[] = [
  // Over the sleeping city, the belfry clock in the distance.
  { t: 0, pos: [-6.5, 8.6, 25.5], look: [-1.5, 1.6, 2.0], fov: 38 },
  { t: 4.6, pos: [-4.8, 6.4, 20.5], look: [-2.2, 1.8, 8.0], fov: 36 },
  // Finding the only lit window.
  { t: 7.6, pos: [-3.1, 3.4, 14.6], look: [-2.4, 2.0, 10.0], fov: 34 },
  { t: 9.6, pos: [-2.42, 2.06, 10.85], look: [-2.45, 1.98, 9.2], fov: 40 },
  // Through the window.
  { t: 10.6, pos: [-2.45, 2.02, 9.82], look: [-2.75, 1.94, 9.0], fov: 52 },
  // Her face lit by the screen.
  { t: 13.6, pos: [-2.8, 1.98, 9.6], look: [-2.66, 1.94, 9.02], fov: 50 },
  // The things she makes, rising out of the laptop.
  { t: 16.8, pos: [-2.55, 2.08, 9.74], look: [-2.86, 2.06, 9.0], fov: 54 },
  { t: 21.4, pos: [-2.45, 2.1, 9.8], look: [-2.86, 2.08, 9.0], fov: 54 },
  // The phone, then doubt.
  { t: 24.2, pos: [-2.52, 2.0, 9.8], look: [-2.8, 1.88, 8.95], fov: 50 },
  { t: 26.6, pos: [-2.42, 2.03, 9.88], look: [-2.68, 1.93, 9.0], fov: 50 },
  // Back out of the window and up over Lille.
  { t: 27.9, pos: [-2.4, 2.06, 10.8], look: [-2.4, 2.0, 9.0], fov: 42 },
  { t: 30.2, pos: [-1.8, 5.6, 15.2], look: [2.4, 4.4, -3.0], fov: 38 },
  { t: 33.0, pos: [-0.6, 10.8, 19.6], look: [1.0, 0.6, 1.0], fov: 42 },
  // Towards Lille-Flandres and the campus.
  { t: 36.2, pos: [5.0, 8.0, 13.2], look: [11.5, 2.2, -0.8], fov: 38 },
  { t: 39.6, pos: [8.2, 5.4, 8.2], look: [12.6, 2.6, -1.0], fov: 36 },
  // Daylight: rise to the whole city.
  { t: 43.2, pos: [6.4, 9.4, 14.6], look: [7.0, 1.6, -0.8], fov: 40 },
  { t: 48.0, pos: [2.6, 12.0, 21.0], look: [4.2, 0.8, 0.0], fov: 40 },
  { t: 56, pos: [2.2, 13.2, 23.5], look: [4.2, 0.6, 0.0], fov: 40 },
];

const toV = (v: Vec3) => new Vector3(v[0], v[1], v[2]);
const posCurve = new CatmullRomCurve3(
  KEYS.map((k) => toV(k.pos)),
  false,
  "centripetal",
);
const lookCurve = new CatmullRomCurve3(
  KEYS.map((k) => toV(k.look)),
  false,
  "centripetal",
);

/** Fritsch–Carlson monotone cubic through (t_i, i). */
const N = KEYS.length;
const slopes: number[] = (() => {
  const d: number[] = [];
  for (let i = 0; i < N - 1; i++) d.push(1 / (KEYS[i + 1].t - KEYS[i].t));
  const m: number[] = [d[0]];
  for (let i = 1; i < N - 1; i++) {
    m.push(
      d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i]),
    );
  }
  m.push(d[N - 2]);
  // Ease in at the very start of the film.
  m[0] = d[0] * 0.5;
  return m;
})();

const keyIndexAt = (t: number) => {
  if (t <= KEYS[0].t) return 0;
  if (t >= KEYS[N - 1].t) return N - 1;
  let i = 0;
  while (KEYS[i + 1].t < t) i++;
  const h = KEYS[i + 1].t - KEYS[i].t;
  const s = (t - KEYS[i].t) / h;
  const h00 = 2 * s ** 3 - 3 * s ** 2 + 1;
  const h10 = s ** 3 - 2 * s ** 2 + s;
  const h01 = -2 * s ** 3 + 3 * s ** 2;
  const h11 = s ** 3 - s ** 2;
  return (
    h00 * i + h10 * h * slopes[i] + h01 * (i + 1) + h11 * h * slopes[i + 1]
  );
};

export const cameraAt = (t: number) => {
  const k = keyIndexAt(t);
  const u = Math.min(1, Math.max(0, k / (N - 1)));
  const i = Math.min(N - 2, Math.floor(k));
  const f = Math.min(1, Math.max(0, k - i));
  const sf = f * f * (3 - 2 * f);
  return {
    pos: posCurve.getPoint(u),
    look: lookCurve.getPoint(u),
    fov: KEYS[i].fov + (KEYS[i + 1].fov - KEYS[i].fov) * sf,
  };
};
