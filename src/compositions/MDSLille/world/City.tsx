import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  Color,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  QuadraticBezierCurve3,
  Vector3,
} from "three";
import { random } from "remotion";
import {
  CAMPUS,
  HOUSES,
  THREAD_SOURCES,
  WINDOWS,
  facingNormal,
  footprint,
  type CityWindow,
  type House,
} from "../city";
import { BEATS } from "../edit";
import { dayness, easeOut, lin, smooth } from "../time";
import { makeHaloMaterial, makePointsGeometry } from "./glow";

export const TURQUOISE = new Color("#3FE3F0");
const WARM = new Color("#FFC468");
const DARK_NIGHT = new Color("#0B0914");
const DARK_DAY = new Color("#6F8E9B");

const dummy = new Object3D();
const box = new BoxGeometry(1, 1, 1);
const plane = new PlaneGeometry(1, 1);

const rotY = (f: House["facing"]) =>
  f === 1 ? 0 : f === -1 ? Math.PI : f === 2 ? Math.PI / 2 : -Math.PI / 2;

/** Static instanced geometry: bodies, roofs, stepped gables, cornices. */
const useHouseParts = () =>
  useMemo(() => {
    type Part = { pos: number[]; scale: number[]; rot: number[]; color: Color };
    const bodies: Part[] = [];
    const roofs: Part[] = [];
    houses: for (const h of HOUSES) {
      const { sx, sz } = footprint(h);
      const base = new Color(h.color);
      bodies.push({
        pos: [h.x, h.h / 2, h.z],
        scale: [sx, h.h, sz],
        rot: [0, 0, 0],
        color: base,
      });
      const along = Math.abs(h.facing) === 1; // facade normal is ±z
      const n = facingNormal(h.facing);
      const dark = base.clone().multiplyScalar(0.62);
      if (h.gable === "flat") {
        roofs.push({
          pos: [h.x, h.h + 0.04, h.z],
          scale: [sx + 0.06, 0.08, sz + 0.06],
          rot: [0, 0, 0],
          color: dark,
        });
        continue houses;
      }
      // Pitched roof: a box rotated 45° around the depth axis (ridge ⟂ street).
      const s = (h.w * 0.94) / Math.SQRT2;
      roofs.push({
        pos: [h.x, h.h, h.z],
        scale: along ? [s, s, h.d * 0.98] : [h.d * 0.98, s, s],
        rot: along ? [0, 0, Math.PI / 4] : [Math.PI / 4, 0, 0],
        color: dark,
      });
      if (h.gable === "stepped") {
        // Flemish "pas de moineau" gable on the street facade.
        const steps = 4;
        for (let k = 0; k < steps; k++) {
          const w = h.w * (1 - k * 0.23);
          const y = h.h + 0.11 + k * 0.16;
          const off = h.d / 2 - 0.05;
          roofs.push({
            pos: [h.x + n[0] * off, y, h.z + n[2] * off],
            scale: along ? [w, 0.17, 0.1] : [0.1, 0.17, w],
            rot: [0, 0, 0],
            color: base,
          });
        }
      }
    }
    return { bodies, roofs };
  }, []);

const Instanced: React.FC<{
  readonly parts: {
    pos: number[];
    scale: number[];
    rot: number[];
    color: Color;
  }[];
}> = ({ parts }) => {
  const ref = useRef<InstancedMesh>(null);
  const mat = useMemo(() => new MeshLambertMaterial({ color: "#ffffff" }), []);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    parts.forEach((p, i) => {
      dummy.position.set(p.pos[0], p.pos[1], p.pos[2]);
      dummy.rotation.set(p.rot[0], p.rot[1], p.rot[2]);
      dummy.scale.set(p.scale[0], p.scale[1], p.scale[2]);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, p.color);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [parts]);
  return (
    <instancedMesh
      ref={ref}
      args={[box, mat, parts.length]}
      frustumCulled={false}
    />
  );
};

export const Houses: React.FC = () => {
  const { bodies, roofs } = useHouseParts();
  return (
    <>
      <Instanced parts={bodies} />
      <Instanced parts={roofs} />
    </>
  );
};

/** Light of a city window at time t: colour × intensity (0 = dark glass). */
export const windowLight = (w: CityWindow, t: number) => {
  const day = dayness(t);
  if (w.creatorAt !== null && t >= w.creatorAt) {
    const on = easeOut(t, w.creatorAt, 0.35);
    // Flicker on like a screen waking up.
    const flick = t - w.creatorAt < 0.12 ? 0.5 : 1;
    return { color: TURQUOISE, k: on * flick * (1 - day * 0.85) };
  }
  if (w.warm) {
    return { color: WARM, k: 1 - lin(t, w.offAt, w.offAt + 0.18) };
  }
  return { color: WARM, k: 0 };
};

const tmpC = new Color();

const haloPos = (w: CityWindow) => {
  const n = facingNormal(w.facing);
  return [w.pos[0] + n[0] * 0.06, w.pos[1], w.pos[2] + n[2] * 0.06];
};
const CREATORS = WINDOWS.filter((w) => w.creatorAt !== null);
const OTHERS = WINDOWS.filter((w) => w.creatorAt === null);

export const Windows: React.FC<{ readonly t: number }> = ({ t }) => {
  const ref = useRef<InstancedMesh>(null);
  const mat = useMemo(() => new MeshBasicMaterial({ toneMapped: false }), []);
  // Two halo layers: big turquoise glows for the "creators", smaller warm ones.
  const haloC = useMemo(() => makeHaloMaterial(5.2), []);
  const haloW = useMemo(() => makeHaloMaterial(3.2), []);
  const geoC = useMemo(() => makePointsGeometry(CREATORS.map(haloPos)), []);
  const geoW = useMemo(() => makePointsGeometry(OTHERS.map(haloPos)), []);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    WINDOWS.forEach((w, i) => {
      dummy.position.set(w.pos[0], w.pos[1], w.pos[2]);
      dummy.rotation.set(0, rotY(w.facing), 0);
      dummy.scale.set(w.w, w.h, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, []);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const day = dayness(t);
    const glass = DARK_NIGHT.clone().lerp(DARK_DAY, day);
    WINDOWS.forEach((w, i) => {
      const { color, k } = windowLight(w, t);
      tmpC.copy(glass).lerp(color, Math.min(1, k));
      m.setColorAt(i, tmpC);
    });
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    const fill = (
      list: readonly CityWindow[],
      geo: BufferGeometry,
      gain: number,
    ) => {
      const c = geo.getAttribute("color");
      list.forEach((w, i) => {
        const { color, k } = windowLight(w, t);
        const h = k * (1 - day * 0.75) * gain;
        c.setXYZ(i, color.r * h, color.g * h, color.b * h);
      });
      c.needsUpdate = true;
    };
    fill(CREATORS, geoC, 0.55);
    fill(OTHERS, geoW, 0.32);
  }, [t, geoC, geoW]);

  return (
    <>
      <instancedMesh
        ref={ref}
        args={[plane, mat, WINDOWS.length]}
        frustumCulled={false}
      />
      <points geometry={geoW} material={haloW} frustumCulled={false} />
      <points geometry={geoC} material={haloC} frustumCulled={false} />
    </>
  );
};

/** Ground, streets, Grand'Place paving and street lamps. */
const LAMPS: readonly [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let x = -9; x <= 7; x += 3.2) out.push([x, 12.2]);
  for (let x = 7.5; x <= 18; x += 2.6) out.push([x, 1.0]);
  for (let x = -5; x <= 5; x += 2.5) {
    out.push([x, -3.6]);
    out.push([x, 3.6]);
  }
  for (let z = -9; z <= 14; z += 3.4) out.push([-8.4, z]);
  return out;
})();

export const Ground: React.FC<{ readonly t: number }> = ({ t }) => {
  const day = dayness(t);
  const lampGeo = useMemo(
    () => makePointsGeometry(LAMPS.map(([x, z]) => [x, 0.95, z])),
    [],
  );
  const halo = useMemo(() => makeHaloMaterial(3.0), []);
  const bulbs = useRef<InstancedMesh>(null);
  const poles = useRef<InstancedMesh>(null);
  const bulbMat = useMemo(
    () => new MeshBasicMaterial({ color: "#FFD9A0", toneMapped: false }),
    [],
  );
  const poleMat = useMemo(
    () => new MeshLambertMaterial({ color: "#1B1820" }),
    [],
  );

  useLayoutEffect(() => {
    LAMPS.forEach(([x, z], i) => {
      dummy.rotation.set(0, 0, 0);
      dummy.position.set(x, 0.45, z);
      dummy.scale.set(0.035, 0.9, 0.035);
      dummy.updateMatrix();
      poles.current?.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 0.93, z);
      dummy.scale.set(0.08, 0.08, 0.08);
      dummy.updateMatrix();
      bulbs.current?.setMatrixAt(i, dummy.matrix);
    });
    if (poles.current) poles.current.instanceMatrix.needsUpdate = true;
    if (bulbs.current) bulbs.current.instanceMatrix.needsUpdate = true;
  }, []);

  useLayoutEffect(() => {
    const k = (1 - smooth(t, BEATS.dawnFrom + 1.5, BEATS.dawnTo)) * 0.42;
    const c = lampGeo.getAttribute("color");
    LAMPS.forEach((_, i) => c.setXYZ(i, 1 * k, 0.78 * k, 0.5 * k));
    c.needsUpdate = true;
    bulbMat.color.set("#FFD9A0").multiplyScalar(0.25 + 0.75 * (1 - day));
  }, [t, day, lampGeo, bulbMat]);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, 0, 2]}>
        <planeGeometry args={[120, 120]} />
        <meshLambertMaterial color="#2A2430" />
      </mesh>
      {/* Grand'Place paving. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[12.8, 9.2]} />
        <meshLambertMaterial color="#4A4048" />
      </mesh>
      {/* Place de la gare. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18.6, 0.005, 1.0]}>
        <planeGeometry args={[2.6, 12]} />
        <meshLambertMaterial color="#433A44" />
      </mesh>
      <instancedMesh
        ref={poles}
        args={[box, poleMat, LAMPS.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={bulbs}
        args={[box, bulbMat, LAMPS.length]}
        frustumCulled={false}
      />
      <points geometry={lampGeo} material={halo} frustumCulled={false} />
    </>
  );
};

/** Light threads: every "creator" window sends its light to the campus. */
const THREAD_POINTS = 40;
const SPARKS_PER_THREAD = 5;

export const Threads: React.FC<{ readonly t: number }> = ({ t }) => {
  const curves = useMemo(
    () =>
      THREAD_SOURCES.map((w) => {
        const a = new Vector3(...w.pos);
        const b = new Vector3(...CAMPUS.target);
        const mid = a.clone().lerp(b, 0.5);
        mid.y += 2.2 + a.distanceTo(b) * 0.18;
        return new QuadraticBezierCurve3(a, mid, b);
      }),
    [],
  );
  const lines = useMemo(
    () =>
      curves.map((c) => {
        const g = new BufferGeometry().setFromPoints(
          c.getPoints(THREAD_POINTS),
        );
        const m = new LineBasicMaterial({
          color: TURQUOISE,
          transparent: true,
          opacity: 0,
          blending: AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
          fog: false,
        });
        return new Line(g, m);
      }),
    [curves],
  );
  const sparkGeo = useMemo(
    () =>
      makePointsGeometry(
        new Array(curves.length * SPARKS_PER_THREAD).fill([0, 0, 0]),
      ),
    [curves],
  );
  const sparkMat = useMemo(() => makeHaloMaterial(1.1), []);

  useLayoutEffect(() => {
    const fadeOut = 1 - smooth(t, BEATS.threadsTo - 1.5, BEATS.threadsTo + 0.5);
    const pos = sparkGeo.getAttribute("position");
    const col = sparkGeo.getAttribute("color");
    const p = new Vector3();
    curves.forEach((c, i) => {
      const start = BEATS.threadsFrom + i * 0.06 + random(`th${i}`) * 0.4;
      const grow = easeOut(t, start, 1.8);
      const line = lines[i];
      line.geometry.setDrawRange(
        0,
        Math.max(0, Math.round(grow * (THREAD_POINTS + 1))),
      );
      (line.material as LineBasicMaterial).opacity =
        0.5 * fadeOut * (grow > 0 ? 1 : 0);
      for (let k = 0; k < SPARKS_PER_THREAD; k++) {
        const j = i * SPARKS_PER_THREAD + k;
        const s = ((((t - start) * 0.32 + k / SPARKS_PER_THREAD) % 1) + 1) % 1;
        const visible = t > start && s <= grow ? fadeOut : 0;
        c.getPoint(s, p);
        pos.setXYZ(j, p.x, p.y, p.z);
        const b = visible * 0.8;
        col.setXYZ(j, TURQUOISE.r * b, TURQUOISE.g * b, TURQUOISE.b * b);
      }
    });
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }, [t, curves, lines, sparkGeo]);

  if (t < BEATS.threadsFrom - 0.1 || t > BEATS.threadsTo + 0.6) return null;
  return (
    <>
      {lines.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
      <points geometry={sparkGeo} material={sparkMat} frustumCulled={false} />
    </>
  );
};
