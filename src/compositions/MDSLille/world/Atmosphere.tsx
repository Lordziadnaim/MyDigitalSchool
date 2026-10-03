import React, { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  Fog,
  ShaderMaterial,
  Vector3,
} from "three";
import { random } from "remotion";
import { dawnGlow, dayness, mix3 } from "../time";

/**
 * Sky dome (gradient + sun glow), stars, fog and the two global lights.
 * Night → dawn → day is driven by `dayness(t)` (BEATS.dawnFrom → dawnTo).
 */

const SKY = {
  top: ["#07061A", "#3A3F7A", "#5FA9DA"],
  horizon: ["#2A1840", "#F2A27E", "#DDF1F4"],
  bottom: ["#120C1C", "#4A3550", "#B9D8E0"],
} as const;

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uBottom;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uSun;
  varying vec3 vDir;
  void main() {
    float h = vDir.y;
    vec3 col = h > 0.0
      ? mix(uHorizon, uTop, pow(clamp(h * 2.2, 0.0, 1.0), 0.7))
      : mix(uHorizon, uBottom, clamp(-h * 6.0, 0.0, 1.0));
    float s = max(dot(normalize(vDir), normalize(uSunDir)), 0.0);
    col += uSunColor * (pow(s, 24.0) * 0.9 + pow(s, 4.0) * 0.25) * uSun;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const SUN_DIR = new Vector3(1, 0.12, -0.35).normalize();

export const Atmosphere: React.FC<{ readonly t: number }> = ({ t }) => {
  const scene = useThree((s) => s.scene);
  const d = dayness(t);
  const glow = dawnGlow(t);

  const skyMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new Color() },
          uHorizon: { value: new Color() },
          uBottom: { value: new Color() },
          uSunDir: { value: SUN_DIR },
          uSunColor: { value: new Color("#FFB070") },
          uSun: { value: 0 },
        },
      }),
    [],
  );

  const stars = useMemo(() => {
    const n = 420;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = random(`sa${i}`) * Math.PI * 2;
      const y = 0.08 + random(`sy${i}`) * 0.92;
      const r = Math.sqrt(1 - y * y);
      pos[i * 3] = Math.cos(a) * r * 150;
      pos[i * 3 + 1] = y * 150;
      pos[i * 3 + 2] = Math.sin(a) * r * 150;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    return g;
  }, []);

  const horizon = mix3(SKY.horizon[0], SKY.horizon[1], SKY.horizon[2], t);

  useLayoutEffect(() => {
    skyMat.uniforms.uTop.value.copy(
      mix3(SKY.top[0], SKY.top[1], SKY.top[2], t),
    );
    skyMat.uniforms.uHorizon.value.copy(horizon);
    skyMat.uniforms.uBottom.value.copy(
      mix3(SKY.bottom[0], SKY.bottom[1], SKY.bottom[2], t),
    );
    skyMat.uniforms.uSun.value = glow * 1.2 + d * 0.5;
    if (!scene.fog) scene.fog = new Fog(horizon.clone(), 20, 75);
    const fog = scene.fog as Fog;
    fog.color.copy(horizon);
    fog.near = 20 + d * 10;
    fog.far = 70 + d * 40;
  }, [t, d, glow, horizon, scene, skyMat]);

  // Moon (night) → low warm sun from the east (dawn) → higher sun (day).
  const sunPos: [number, number, number] =
    d < 0.01 ? [-12, 22, 14] : [30, 6 + d * 20, -4 + d * 12];
  return (
    <>
      <mesh material={skyMat} renderOrder={-10}>
        <sphereGeometry args={[190, 32, 16]} />
      </mesh>
      <points geometry={stars} renderOrder={-9}>
        <pointsMaterial
          color="#DCE6FF"
          size={1.6}
          sizeAttenuation={false}
          transparent
          opacity={Math.max(0, 0.9 - d * 2.2)}
          depthWrite={false}
          blending={AdditiveBlending}
          fog={false}
        />
      </points>
      <hemisphereLight
        color={mix3("#6A6496", "#B48CA8", "#D6ECF5", t)}
        groundColor={mix3("#1A1024", "#4A3040", "#7A6A58", t)}
        intensity={0.85 + d * 0.8}
      />
      <directionalLight
        position={sunPos}
        color={mix3("#A9B4F0", "#FFB27A", "#FFF1DC", t)}
        intensity={0.7 + glow * 1.6 + d * 1.4}
      />
    </>
  );
};
