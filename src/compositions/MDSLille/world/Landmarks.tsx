import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  Color,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
} from "three";
import { random } from "remotion";
import { BELFRY, CAMPUS, FLOOR, GARE } from "../city";
import { BEATS } from "../edit";
import { dayness, easeOut, mix3, smooth } from "../time";
import { TURQUOISE } from "./City";
import { makeHaloMaterial, makePointsGeometry } from "./glow";

const BRICK = "#8A4433";
const STONE = "#CDBE9C";
const SLATE = "#2C2A36";
const GOLD = "#C9A24A";

/** Clock face showing 2:17 (the film's time, frozen). */
const Clock: React.FC<{
  readonly position: [number, number, number];
  readonly rotationY: number;
  readonly r: number;
  readonly glow: number;
}> = ({ position, rotationY, r, glow }) => {
  const hour = ((2 + 17 / 60) / 12) * Math.PI * 2;
  const minute = (17 / 60) * Math.PI * 2;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <circleGeometry args={[r * 1.12, 32]} />
        <meshLambertMaterial color={STONE} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <circleGeometry args={[r, 32]} />
        <meshBasicMaterial
          color={new Color("#FFE3A6").multiplyScalar(0.35 + glow * 0.75)}
          toneMapped={false}
        />
      </mesh>
      <group position={[0, 0, 0.012]} rotation={[0, 0, -hour]}>
        <mesh position={[0, r * 0.27, 0]}>
          <planeGeometry args={[r * 0.1, r * 0.6]} />
          <meshBasicMaterial color="#1A1420" />
        </mesh>
      </group>
      <group position={[0, 0, 0.014]} rotation={[0, 0, -minute]}>
        <mesh position={[0, r * 0.4, 0]}>
          <planeGeometry args={[r * 0.07, r * 0.86]} />
          <meshBasicMaterial color="#1A1420" />
        </mesh>
      </group>
    </group>
  );
};

/** Belfry of the Chambre de commerce on Grand'Place. */
export const Belfry: React.FC<{ readonly t: number }> = ({ t }) => {
  const glow = 1 - dayness(t);
  const { x, z, h } = BELFRY;
  const halo = useMemo(() => makeHaloMaterial(4.5), []);
  const haloGeo = useMemo(
    () => makePointsGeometry([[x, 6.55, z + 0.75]]),
    [x, z],
  );
  useLayoutEffect(() => {
    const k = 0.35 * glow;
    haloGeo.getAttribute("color").setXYZ(0, k, k * 0.85, k * 0.55);
    haloGeo.getAttribute("color").needsUpdate = true;
  }, [glow, haloGeo]);
  return (
    <group>
      {/* Hall below the tower. */}
      <mesh position={[x, 1.3, z]}>
        <boxGeometry args={[3.2, 2.6, 2.2]} />
        <meshLambertMaterial color={BRICK} />
      </mesh>
      <mesh position={[x, 2.75, z]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[3.1, 0.9, 0.9]} />
        <meshLambertMaterial color={SLATE} />
      </mesh>
      {/* Tower. */}
      <mesh position={[x, 3.4, z]}>
        <boxGeometry args={[1.4, 6.8, 1.4]} />
        <meshLambertMaterial color={BRICK} />
      </mesh>
      {[2.4, 4.2, 5.9].map((y) => (
        <mesh key={y} position={[x, y, z]}>
          <boxGeometry args={[1.46, 0.08, 1.46]} />
          <meshLambertMaterial color={STONE} />
        </mesh>
      ))}
      <mesh position={[x, 7.15, z]}>
        <boxGeometry args={[1.1, 0.7, 1.1]} />
        <meshLambertMaterial color={STONE} />
      </mesh>
      {/* Spire. */}
      <mesh position={[x, 8.35, z]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.78, 1.7, 4]} />
        <meshLambertMaterial color={SLATE} />
      </mesh>
      <mesh position={[x, h - 0.15, z]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshLambertMaterial color={GOLD} />
      </mesh>
      <Clock
        position={[x, 6.55, z + 0.705]}
        rotationY={0}
        r={0.4}
        glow={glow}
      />
      <Clock
        position={[x + 0.705, 6.55, z]}
        rotationY={Math.PI / 2}
        r={0.4}
        glow={glow}
      />
      <Clock
        position={[x - 0.705, 6.55, z]}
        rotationY={-Math.PI / 2}
        r={0.4}
        glow={glow}
      />
      <points geometry={haloGeo} material={halo} frustumCulled={false} />
    </group>
  );
};

/** Column of the Déesse, centre of Grand'Place. */
export const Deesse: React.FC = () => (
  <group position={[0, 0, 0]}>
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[0.7, 0.6, 0.7]} />
      <meshLambertMaterial color={STONE} />
    </mesh>
    <mesh position={[0, 2.1, 0]}>
      <cylinderGeometry args={[0.12, 0.15, 3.0, 12]} />
      <meshLambertMaterial color={STONE} />
    </mesh>
    <mesh position={[0, 3.65, 0]}>
      <boxGeometry args={[0.36, 0.1, 0.36]} />
      <meshLambertMaterial color={STONE} />
    </mesh>
    <mesh position={[0, 3.92, 0]}>
      <coneGeometry args={[0.1, 0.42, 8]} />
      <meshLambertMaterial color={GOLD} />
    </mesh>
    <mesh position={[0, 4.18, 0]}>
      <sphereGeometry args={[0.055, 12, 8]} />
      <meshLambertMaterial color={GOLD} />
    </mesh>
  </group>
);

/** Gare Lille-Flandres: long facade facing west, central pavilion, clock. */
export const Gare: React.FC<{ readonly t: number }> = ({ t }) => {
  const glow = 1 - dayness(t);
  const { x, z, w, len } = GARE;
  const front = x - w / 2;
  return (
    <group>
      <mesh position={[x, 1.25, z]}>
        <boxGeometry args={[w, 2.5, len]} />
        <meshLambertMaterial color="#C9B48E" />
      </mesh>
      <mesh position={[x, 2.6, z]} rotation={[0, 0, 0]}>
        <boxGeometry args={[w * 0.9, 0.3, len]} />
        <meshLambertMaterial color={SLATE} />
      </mesh>
      {/* Central pavilion. */}
      <mesh position={[x - 0.1, 1.9, z]}>
        <boxGeometry args={[w + 0.2, 3.8, 3.2]} />
        <meshLambertMaterial color="#D4C29C" />
      </mesh>
      <mesh position={[x - 0.1, 4.0, z]}>
        <boxGeometry args={[w, 0.5, 3.0]} />
        <meshLambertMaterial color={SLATE} />
      </mesh>
      {/* Great arched window. */}
      <group position={[front - 0.21, 1.7, z]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, -0.45, 0]}>
          <planeGeometry args={[1.8, 1.4]} />
          <meshBasicMaterial
            color={new Color("#FFD48A").multiplyScalar(0.18 + glow * 0.6)}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <circleGeometry args={[0.9, 32, 0, Math.PI]} />
          <meshBasicMaterial
            color={new Color("#FFD48A").multiplyScalar(0.18 + glow * 0.6)}
            toneMapped={false}
          />
        </mesh>
      </group>
      <Clock
        position={[front - 0.215, 3.2, z]}
        rotationY={-Math.PI / 2}
        r={0.28}
        glow={glow}
      />
      {/* Arcade windows along the wings. */}
      {[-3.6, -2.6, 2.6, 3.6].map((dz) => (
        <mesh
          key={dz}
          position={[front - 0.01, 1.1, z + dz]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.5, 1.1]} />
          <meshBasicMaterial
            color={new Color("#FFD48A").multiplyScalar(0.08 + glow * 0.35)}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

/** The campus: modern block, its windows light up as the threads arrive. */
const COLS = 6;
const campusWindows = (() => {
  const out: { x: number; y: number; at: number }[] = [];
  for (let f = 0; f < CAMPUS.floors; f++) {
    for (let c = 0; c < COLS; c++) {
      const x = CAMPUS.x + (c - (COLS - 1) / 2) * (CAMPUS.w / COLS);
      const y = f * FLOOR + 0.42;
      out.push({ x, y, at: 35.2 + random(`cw${f}-${c}`) * 2.6 });
    }
  }
  return out;
})();

const dummy = new Object3D();
const pane = new PlaneGeometry(1, 1);

export const Campus: React.FC<{ readonly t: number }> = ({ t }) => {
  const front = CAMPUS.z + CAMPUS.d / 2;
  const height = CAMPUS.floors * FLOOR;
  const ref = useRef<InstancedMesh>(null);
  const mat = useMemo(() => new MeshBasicMaterial({ toneMapped: false }), []);
  const halo = useMemo(() => makeHaloMaterial(2.6), []);
  const haloGeo = useMemo(
    () =>
      makePointsGeometry(campusWindows.map((w) => [w.x, w.y, front + 0.08])),
    [front],
  );

  useLayoutEffect(() => {
    campusWindows.forEach((w, i) => {
      dummy.position.set(w.x, w.y, front + 0.012);
      dummy.scale.set((CAMPUS.w / COLS) * 0.78, 0.5, 1);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [front]);

  useLayoutEffect(() => {
    const day = dayness(t);
    const glass = new Color("#151320").lerp(new Color("#7E9BA6"), day);
    const tmp = new Color();
    const col = haloGeo.getAttribute("color");
    // Final state ("en plein jour"): the whole facade glows turquoise.
    const allOn = smooth(t, BEATS.dawnFrom, BEATS.dawnFrom + 1.6);
    campusWindows.forEach((w, i) => {
      const k = Math.max(easeOut(t, w.at, 0.4), allOn);
      tmp.copy(glass).lerp(TURQUOISE, k);
      ref.current?.setColorAt(i, tmp);
      const h = k * (0.42 - day * 0.22);
      col.setXYZ(i, TURQUOISE.r * h, TURQUOISE.g * h, TURQUOISE.b * h);
    });
    if (ref.current?.instanceColor)
      ref.current.instanceColor.needsUpdate = true;
    col.needsUpdate = true;
  }, [t, haloGeo]);

  return (
    <group>
      <mesh position={[CAMPUS.x, height / 2, CAMPUS.z]}>
        <boxGeometry args={[CAMPUS.w, height, CAMPUS.d]} />
        <meshLambertMaterial color={mix3("#5E5A66", "#A79AA6", "#D9D6DC", t)} />
      </mesh>
      {/* Floor slabs (horizontal bands). */}
      {Array.from({ length: CAMPUS.floors + 1 }).map((_, f) => (
        <mesh key={f} position={[CAMPUS.x, f * FLOOR + 0.02, front + 0.02]}>
          <boxGeometry args={[CAMPUS.w + 0.06, 0.06, 0.06]} />
          <meshLambertMaterial color="#E8E4EA" />
        </mesh>
      ))}
      <instancedMesh
        ref={ref}
        args={[pane, mat, campusWindows.length]}
        frustumCulled={false}
      />
      <points geometry={haloGeo} material={halo} frustumCulled={false} />
    </group>
  );
};
