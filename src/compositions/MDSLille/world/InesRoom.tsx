import React, { useLayoutEffect, useMemo } from "react";
import {
  CanvasTexture,
  Color,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from "three";
import { colors } from "../../../brand/theme";
import { FLOOR, INES } from "../city";
import { BEATS } from "../edit";
import { cameraAt } from "../camera";
import { dayness, easeOut, smooth } from "../time";
import { TURQUOISE } from "./City";
import { makeHaloMaterial, makePointsGeometry } from "./glow";

type V3 = [number, number, number];

const Box: React.FC<{
  readonly p: V3;
  readonly s: V3;
  readonly c: string;
  readonly r?: V3;
}> = ({ p, s, c, r }) => (
  <mesh position={p} rotation={r}>
    <boxGeometry args={s} />
    <meshLambertMaterial color={c} />
  </mesh>
);

const BRICK = "#7A3A2C";
const { room } = INES;
const ROOM_W = room.x1 - room.x0;
const ROOM_H = room.y1 - room.y0;
const ROOM_D = room.z1 - room.z0;
const RX = (room.x0 + room.x1) / 2;
const RY = (room.y0 + room.y1) / 2;
const RZ = (room.z0 + room.z1) / 2;

/** Her house: a hollow shell with a real opening, so the camera can fly in. */
const HouseShell: React.FC = () => {
  const x0 = INES.x - INES.w / 2;
  const x1 = INES.x + INES.w / 2;
  const z0 = INES.z - INES.d / 2;
  const z1 = INES.z + INES.d / 2;
  const H = INES.floors * FLOOR;
  const [wx, wy] = [INES.window[0], INES.window[1]];
  const wl = wx - INES.windowW / 2;
  const wr = wx + INES.windowW / 2;
  const wb = wy - INES.windowH / 2;
  const wt = wy + INES.windowH / 2;
  const th = 0.06;
  const fz = z1 - th / 2;
  return (
    <group>
      {/* Front facade around the opening. */}
      <Box p={[(x0 + wl) / 2, H / 2, fz]} s={[wl - x0, H, th]} c={BRICK} />
      <Box p={[(wr + x1) / 2, H / 2, fz]} s={[x1 - wr, H, th]} c={BRICK} />
      <Box p={[wx, wb / 2, fz]} s={[wr - wl, wb, th]} c={BRICK} />
      <Box p={[wx, (wt + H) / 2, fz]} s={[wr - wl, H - wt, th]} c={BRICK} />
      {/* Sides, back, floor slab, ceiling slab. */}
      <Box p={[x0 + th / 2, H / 2, INES.z]} s={[th, H, INES.d]} c={BRICK} />
      <Box p={[x1 - th / 2, H / 2, INES.z]} s={[th, H, INES.d]} c={BRICK} />
      <Box p={[INES.x, H / 2, z0 + th / 2]} s={[INES.w, H, th]} c={BRICK} />
      <Box
        p={[INES.x, room.y0 - 0.02, INES.z]}
        s={[INES.w, 0.04, INES.d]}
        c="#2A2228"
      />
      <Box
        p={[INES.x, room.y1 + 0.02, INES.z]}
        s={[INES.w, 0.04, INES.d]}
        c="#2A2228"
      />
      <Box
        p={[INES.x, H - 0.02, INES.z]}
        s={[INES.w, 0.04, INES.d]}
        c={BRICK}
      />
      {/* Stone sill + lintel and a thin frame around her window. */}
      <Box
        p={[wx, wb - 0.02, z1 + 0.02]}
        s={[INES.windowW + 0.1, 0.035, 0.08]}
        c="#CDBE9C"
      />
      <Box
        p={[wx, wt + 0.03, z1 + 0.005]}
        s={[INES.windowW + 0.08, 0.05, 0.05]}
        c="#CDBE9C"
      />
      <Box
        p={[wl + 0.008, wy, z1 - 0.01]}
        s={[0.016, INES.windowH, 0.05]}
        c="#E8E2D6"
      />
      <Box
        p={[wr - 0.008, wy, z1 - 0.01]}
        s={[0.016, INES.windowH, 0.05]}
        c="#E8E2D6"
      />
      {/* Pitched roof + stepped gable. */}
      <mesh position={[INES.x, H, INES.z]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry
          args={[
            (INES.w * 0.94) / Math.SQRT2,
            (INES.w * 0.94) / Math.SQRT2,
            INES.d * 0.98,
          ]}
        />
        <meshLambertMaterial color="#4B241C" />
      </mesh>
      {[0, 1, 2, 3].map((k) => (
        <Box
          key={k}
          p={[INES.x, H + 0.11 + k * 0.16, z1 - 0.05]}
          s={[INES.w * (1 - k * 0.23), 0.17, 0.1]}
          c={BRICK}
        />
      ))}
      {/* Her neighbours' (dark) windows on the same facade. */}
      {[0, 1, 3].flatMap((f) =>
        [-0.32, 0.32].map((dx) => (
          <mesh
            key={`${f}${dx}`}
            position={[wx + dx, f * FLOOR + 0.42, z1 + 0.012]}
          >
            <planeGeometry args={[0.22, 0.34]} />
            <meshBasicMaterial color="#0B0914" />
          </mesh>
        )),
      )}
    </group>
  );
};

/** Laptop screen: a small video-editing UI in brand colours. */
const useScreenTexture = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 336;
    const g = c.getContext("2d")!;
    g.fillStyle = "#16121D";
    g.fillRect(0, 0, 512, 336);
    const grad = g.createLinearGradient(40, 30, 470, 200);
    grad.addColorStop(0, colors.purple);
    grad.addColorStop(1, colors.blue);
    g.fillStyle = grad;
    g.fillRect(40, 26, 300, 170);
    g.fillStyle = "rgba(255,255,255,0.9)";
    g.beginPath();
    g.moveTo(175, 80);
    g.lineTo(215, 111);
    g.lineTo(175, 142);
    g.fill();
    g.fillStyle = "#2A2433";
    g.fillRect(356, 26, 120, 170);
    ["#E71D73", "#2DB8C5", "#8E4BAE", "#F4C04E"].forEach((col, i) => {
      g.fillStyle = col;
      g.fillRect(370, 40 + i * 38, 90, 24);
    });
    const tracks = [
      [colors.purpleLight, 40, 150],
      [colors.blue, 200, 120],
      [colors.pink, 90, 210],
    ] as const;
    tracks.forEach(([col, x, w], i) => {
      g.fillStyle = "#221C2A";
      g.fillRect(20, 218 + i * 36, 472, 28);
      g.fillStyle = col;
      g.fillRect(x, 220 + i * 36, w, 24);
    });
    g.fillStyle = "#FFFFFF";
    g.fillRect(250, 210, 3, 118);
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, []);

/** "Aa" specimens: she tries font after font. */
const FONT_FAMILIES = [
  '"MDS Text"',
  "Georgia, serif",
  '"Courier New", monospace',
  "Impact, sans-serif",
  '"MDS Display"',
];
const useFontTextures = () =>
  useMemo(
    () =>
      FONT_FAMILIES.map((family) => {
        const c = document.createElement("canvas");
        c.width = 256;
        c.height = 192;
        const g = c.getContext("2d")!;
        g.fillStyle = "rgba(0,0,0,0)";
        g.clearRect(0, 0, 256, 192);
        g.font = `800 150px ${family}`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = "#FFFFFF";
        g.fillText("Aa", 128, 104);
        const tex = new CanvasTexture(c);
        tex.colorSpace = SRGBColorSpace;
        return tex;
      }),
    [],
  );

/** Phone notification screen. */
const usePhoneTexture = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#0E0C14";
    g.fillRect(0, 0, 128, 256);
    g.fillStyle = "#EDEDF2";
    g.fillRect(10, 40, 108, 46);
    g.fillRect(10, 96, 108, 46);
    g.fillStyle = "#9A98A6";
    g.fillRect(18, 50, 60, 8);
    g.fillRect(18, 106, 50, 8);
    g.fillStyle = "#4C4A57";
    g.fillRect(18, 66, 88, 8);
    g.fillRect(18, 122, 80, 8);
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, []);

const UP = new Vector3(0, 1, 0);
/** Capsule between two points (local coords of the parent group). */
const Limb: React.FC<{
  readonly a: V3;
  readonly b: V3;
  readonly r: number;
  readonly c: string;
}> = ({ a, b, r, c }) => {
  const va = new Vector3(...a);
  const vb = new Vector3(...b);
  const dir = vb.clone().sub(va);
  const len = dir.length();
  const q = new Quaternion().setFromUnitVectors(UP, dir.normalize());
  const mid = va.add(vb).multiplyScalar(0.5);
  return (
    <mesh position={mid} quaternion={q}>
      <capsuleGeometry args={[r, Math.max(0.001, len - r * 2), 4, 10]} />
      <meshLambertMaterial color={c} />
    </mesh>
  );
};

const SKIN = "#C98F6E";
const HAIR = "#1C1418";
const HOODIE = colors.purple;
const JEANS = "#2C3550";

/** Inès, stylised: built facing local +z, sitting on a chair. */
const Ines: React.FC<{ readonly t: number }> = ({ t }) => {
  const typing = t > 11 && t < 22.6 ? 1 : 0;
  const doubt = smooth(t, BEATS.doubt, BEATS.doubt + 1.4);
  const phoneLook = smooth(t, 23.0, 23.5) * (1 - smooth(t, 24.4, 25.0));
  const breathe = Math.sin(t * 2.1) * 0.004;
  const lean = 0.12 - doubt * 0.16;
  const headPitch = 0.08 + doubt * 0.32 + phoneLook * 0.2;
  const headYaw = -phoneLook * 0.6 + Math.sin(t * 0.5) * 0.04 * (1 - doubt);
  const tap = (s: number) => typing * Math.max(0, Math.sin(t * 19 + s)) * 0.008;
  // Hands: on the keyboard, or resting on her lap when she gives up.
  const hand = (side: 1 | -1): V3 => {
    const kb: V3 = [side * 0.032, 0.236 + tap(side * 1.7), 0.16];
    const lap: V3 = [side * 0.04, 0.19, 0.08];
    const k = doubt;
    return [
      kb[0] + (lap[0] - kb[0]) * k,
      kb[1] + (lap[1] - kb[1]) * k,
      kb[2] + (lap[2] - kb[2]) * k,
    ];
  };
  const shoulder = (side: 1 | -1): V3 => [
    side * 0.052,
    0.292 + breathe,
    0.012 + lean * 0.12,
  ];
  const elbow = (side: 1 | -1): V3 => {
    const h = hand(side);
    const s = shoulder(side);
    return [side * 0.066, (h[1] + s[1]) / 2 - 0.03, (h[2] + s[2]) / 2 - 0.01];
  };
  return (
    <group position={[-2.68, room.y0, 9.0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Chair. */}
      <Box p={[0, 0.135, -0.005]} s={[0.13, 0.016, 0.13]} c="#2B2633" />
      <Box p={[0, 0.23, -0.07]} s={[0.12, 0.17, 0.014]} c="#2B2633" />
      <Box p={[0, 0.065, -0.005]} s={[0.018, 0.13, 0.018]} c="#1B1820" />
      {/* Legs. */}
      {([1, -1] as const).map((s) => (
        <React.Fragment key={s}>
          <Limb
            a={[s * 0.026, 0.165, 0.0]}
            b={[s * 0.03, 0.165, 0.12]}
            r={0.022}
            c={JEANS}
          />
          <Limb
            a={[s * 0.03, 0.165, 0.12]}
            b={[s * 0.032, 0.02, 0.13]}
            r={0.019}
            c={JEANS}
          />
          <Box
            p={[s * 0.032, 0.01, 0.145]}
            s={[0.03, 0.02, 0.05]}
            c="#E8E4EA"
          />
        </React.Fragment>
      ))}
      {/* Torso (hoodie), slightly leaning towards the screen. */}
      <group position={[0, 0.17, 0]} rotation={[lean, 0, 0]}>
        <mesh
          position={[0, 0.068 + breathe, 0]}
          scale={[1, 1 + breathe * 4, 0.85]}
        >
          <capsuleGeometry args={[0.046, 0.06, 4, 12]} />
          <meshLambertMaterial color={HOODIE} />
        </mesh>
        {/* Hood bunched at the back of the neck. */}
        <mesh position={[0, 0.125, -0.028]}>
          <sphereGeometry args={[0.03, 12, 8]} />
          <meshLambertMaterial color={HOODIE} />
        </mesh>
      </group>
      {/* Head. */}
      <group
        position={[0, 0.335 + breathe, 0.03 + lean * 0.15]}
        rotation={[headPitch, headYaw, 0]}
      >
        <mesh>
          <sphereGeometry args={[0.036, 20, 16]} />
          <meshLambertMaterial color={SKIN} />
        </mesh>
        <mesh position={[0, 0.008, -0.008]} scale={[1.05, 1.02, 1]}>
          <sphereGeometry
            args={[0.038, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.62]}
          />
          <meshLambertMaterial color={HAIR} />
        </mesh>
        <mesh position={[0, 0.035, -0.03]}>
          <sphereGeometry args={[0.018, 12, 10]} />
          <meshLambertMaterial color={HAIR} />
        </mesh>
        {/* Eyes. */}
        {[-1, 1].map((e) => (
          <mesh key={e} position={[e * 0.013, 0.004, 0.033]}>
            <sphereGeometry args={[0.0042, 8, 6]} />
            <meshBasicMaterial color="#15101A" />
          </mesh>
        ))}
        {/* Glasses bridge. */}
        <mesh position={[0, 0.002, 0.034]}>
          <boxGeometry args={[0.05, 0.004, 0.004]} />
          <meshBasicMaterial color="#1A1420" />
        </mesh>
      </group>
      {/* Arms. */}
      {([1, -1] as const).map((s) => (
        <React.Fragment key={`arm${s}`}>
          <Limb a={shoulder(s)} b={elbow(s)} r={0.017} c={HOODIE} />
          <Limb a={elbow(s)} b={hand(s)} r={0.015} c={HOODIE} />
          <mesh position={hand(s)}>
            <sphereGeometry args={[0.012, 10, 8]} />
            <meshLambertMaterial color={SKIN} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
};

/** Billboard yaw so a flat object faces the camera. */
const faceCamera = (t: number, p: V3) => {
  const cam = cameraAt(t).pos;
  return Math.atan2(cam.x - p[0], cam.z - p[2]);
};

/** The things she makes at night, rising out of the laptop. */
const Creations: React.FC<{ readonly t: number }> = ({ t }) => {
  const fonts = useFontTextures();
  const doubt = smooth(t, BEATS.doubt, BEATS.doubt + 1.6);
  const rise = (at: number) => easeOut(t, at, 1.1);
  const place = (
    base: V3,
    at: number,
    wobble: number,
  ): { p: V3; s: number; o: number } => {
    const k = rise(at);
    const y =
      base[1] -
      (1 - k) * 0.13 -
      doubt * 0.09 +
      Math.sin(t * 1.3 + wobble) * 0.006;
    return {
      p: [base[0], y, base[2]],
      s: Math.max(0.001, k * (1 - doubt * 0.45)),
      o: k * (1 - doubt * 0.85),
    };
  };
  if (t < BEATS.video - 0.2 || t > BEATS.exitRoom + 0.5) return null;

  const video = place([-2.86, 2.05, 8.86], BEATS.video, 0);
  const logo = place([-2.9, 2.13, 9.02], BEATS.logo, 1.5);
  const font = place([-2.85, 2.06, 9.19], BEATS.font, 3);
  const arc = Math.max(0.01, easeOut(t, BEATS.logo + 0.2, 1.4) * Math.PI * 2);
  const fontIdx = Math.min(
    FONT_FAMILIES.length - 1,
    Math.max(0, Math.floor((t - BEATS.font) / 0.32)) %
      (FONT_FAMILIES.length + 3),
  );
  const playhead = ((t - BEATS.video) * 0.04) % 0.12;
  const mat = (color: string, o: number) => (
    <meshBasicMaterial
      color={color}
      transparent
      opacity={o}
      toneMapped={false}
      depthWrite={false}
    />
  );

  return (
    <group>
      {/* Video: timeline clips + play button. */}
      <group
        position={video.p}
        rotation={[0, faceCamera(t, video.p), 0]}
        scale={video.s}
      >
        {[
          [colors.purpleLight, -0.012, 0.1, 0.024],
          [colors.blue, 0.02, 0.07, 0],
          [colors.pink, -0.02, 0.085, -0.024],
        ].map(([c, x, w, y], i) => (
          <mesh
            key={i}
            position={[
              (x as number) + Math.sin(t * 0.8 + i) * 0.006,
              y as number,
              0,
            ]}
          >
            <planeGeometry args={[w as number, 0.016]} />
            {mat(c as string, video.o)}
          </mesh>
        ))}
        <mesh position={[-0.06 + playhead, 0, 0.002]}>
          <planeGeometry args={[0.003, 0.08]} />
          {mat("#FFFFFF", video.o)}
        </mesh>
        <mesh position={[0, 0.062, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <circleGeometry args={[0.022, 3]} />
          {mat(colors.white, video.o)}
        </mesh>
      </group>
      {/* Logo being redrawn. */}
      <group
        position={logo.p}
        rotation={[0, faceCamera(t, logo.p), 0]}
        scale={logo.s}
      >
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.036, 0.0045, 6, 48, arc]} />
          {mat(colors.blue, logo.o)}
        </mesh>
        <mesh rotation={[0, 0, -t * 0.6]}>
          <torusGeometry
            args={[0.02, 0.004, 6, 32, Math.min(arc, Math.PI * 1.3)]}
          />
          {mat(colors.pink, logo.o)}
        </mesh>
        <mesh>
          <circleGeometry args={[0.008, 16]} />
          {mat(colors.white, logo.o)}
        </mesh>
      </group>
      {/* Font specimens. */}
      <group
        position={font.p}
        rotation={[0, faceCamera(t, font.p), 0]}
        scale={font.s}
      >
        <mesh>
          <planeGeometry args={[0.1, 0.075]} />
          <meshBasicMaterial
            map={fonts[fontIdx]}
            transparent
            opacity={font.o}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

/** Desk, laptop, phone, bed, posters, fairy lights. */
const Furniture: React.FC<{ readonly t: number }> = ({ t }) => {
  const screenTex = useScreenTexture();
  const phoneTex = usePhoneTexture();
  const doubt = smooth(t, BEATS.doubt, BEATS.doubt + 1.4);
  const screen = 1 - doubt * 0.5;
  const phoneOn =
    smooth(t, BEATS.phone, BEATS.phone + 0.15) * (1 - smooth(t, 26.4, 26.9));
  const buzz =
    (t > BEATS.phone && t < BEATS.phone + 0.45) || (t > 23.9 && t < 24.3)
      ? Math.sin(t * 160) * 0.0025
      : 0;
  const deskTop = 1.846;
  const garland = useMemo(() => {
    const pts: V3[] = [];
    for (let i = 0; i < 12; i++) {
      const u = i / 11;
      pts.push([
        room.x0 + 0.06 + u * (ROOM_W - 0.12),
        room.y1 - 0.06 - Math.sin(u * Math.PI) * 0.06,
        room.z0 + 0.03,
      ]);
    }
    return pts;
  }, []);
  const garlandHalo = useMemo(() => makeHaloMaterial(0.07), []);
  const garlandGeo = useMemo(() => makePointsGeometry(garland), [garland]);
  useLayoutEffect(() => {
    const col = garlandGeo.getAttribute("color");
    garland.forEach((_, i) => {
      const k = 0.5 + 0.15 * Math.sin(t * 1.5 + i);
      col.setXYZ(i, k, k * 0.7, k * 0.4);
    });
    col.needsUpdate = true;
  }, [t, garland, garlandGeo]);

  return (
    <group>
      {/* Interior walls. */}
      <mesh position={[RX, RY, room.z0 + 0.021]}>
        <planeGeometry args={[ROOM_W, ROOM_H]} />
        <meshLambertMaterial color="#4A3D55" />
      </mesh>
      <mesh position={[room.x0 + 0.021, RY, RZ]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshLambertMaterial color="#45394F" />
      </mesh>
      <mesh
        position={[room.x1 - 0.021, RY, RZ]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshLambertMaterial color="#45394F" />
      </mesh>
      <mesh
        position={[RX, room.y0 + 0.001, RZ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshLambertMaterial color="#5C4234" />
      </mesh>
      {/* Rug. */}
      <mesh
        position={[-2.45, room.y0 + 0.002, 8.95]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.45, 0.6]} />
        <meshLambertMaterial color="#6E3A5E" />
      </mesh>
      {/* Desk against the left wall. */}
      <Box
        p={[-2.88, deskTop - 0.006, 9.0]}
        s={[0.2, 0.012, 0.62]}
        c="#B98E64"
      />
      {[8.72, 9.28].map((z) => (
        <Box
          key={z}
          p={[-2.88, (room.y0 + deskTop) / 2, z]}
          s={[0.18, deskTop - room.y0 - 0.012, 0.012]}
          c="#9A7552"
        />
      ))}
      {/* Laptop. */}
      <Box
        p={[-2.885, deskTop + 0.003, 9.0]}
        s={[0.075, 0.006, 0.11]}
        c="#B9BCC4"
      />
      <group
        position={[-2.922, deskTop + 0.006, 9.0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <group rotation={[-0.22, 0, 0]}>
          <mesh position={[0, 0.036, -0.002]}>
            <boxGeometry args={[0.11, 0.074, 0.003]} />
            <meshLambertMaterial color="#9EA2AC" />
          </mesh>
          <mesh position={[0, 0.036, 0.0005]}>
            <planeGeometry args={[0.102, 0.066]} />
            <meshBasicMaterial
              map={screenTex}
              color={new Color(screen, screen, screen)}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
      <pointLight
        position={[-2.84, 1.9, 9.0]}
        color="#CFF7FF"
        intensity={0.11 * screen}
        distance={1.6}
        decay={2}
      />
      {/* Mug + plant. */}
      <mesh position={[-2.86, deskTop + 0.018, 9.2]}>
        <cylinderGeometry args={[0.012, 0.011, 0.034, 12]} />
        <meshLambertMaterial color={colors.pink} />
      </mesh>
      <mesh position={[-2.9, deskTop + 0.02, 8.76]}>
        <cylinderGeometry args={[0.018, 0.014, 0.04, 10]} />
        <meshLambertMaterial color="#C9B892" />
      </mesh>
      <mesh position={[-2.9, deskTop + 0.075, 8.76]}>
        <coneGeometry args={[0.035, 0.09, 7]} />
        <meshLambertMaterial color="#3E6B4A" />
      </mesh>
      {/* Phone (her right side), lights up with her friends' messages. */}
      <group
        position={[-2.84 + buzz, deskTop + 0.004, 8.86]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2 + 0.3]}
      >
        <mesh>
          <boxGeometry args={[0.036, 0.072, 0.005]} />
          <meshLambertMaterial color="#15131B" />
        </mesh>
        <mesh position={[0, 0, 0.0028]}>
          <planeGeometry args={[0.032, 0.066]} />
          <meshBasicMaterial
            map={phoneTex}
            color={new Color(phoneOn, phoneOn, phoneOn)}
            toneMapped={false}
          />
        </mesh>
      </group>
      {phoneOn > 0.01 ? (
        <pointLight
          position={[-2.82, deskTop + 0.06, 8.86]}
          color="#F2F4FF"
          intensity={0.03 * phoneOn}
          distance={0.6}
          decay={2}
        />
      ) : null}
      {/* Bed in the back corner. */}
      <Box
        p={[-2.06, room.y0 + 0.055, 8.48]}
        s={[0.4, 0.11, 0.66]}
        c="#2E3550"
      />
      <Box p={[-2.06, room.y0 + 0.115, 8.5]} s={[0.4, 0.02, 0.6]} c="#5E4C82" />
      <Box
        p={[-2.06, room.y0 + 0.14, 8.24]}
        s={[0.26, 0.04, 0.1]}
        c="#D8D4E0"
      />
      {/* Posters (her work) on the right wall. */}
      {[
        [9.32, 2.08, 0.14, 0.2, colors.pink],
        [9.12, 2.12, 0.12, 0.16, colors.blue],
        [8.95, 2.04, 0.1, 0.13, colors.purpleLight],
        [9.5, 2.15, 0.09, 0.09, "#F4C04E"],
      ].map(([z, y, w, h, c]) => (
        <mesh
          key={String(z)}
          position={[room.x1 - 0.024, y as number, z as number]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[w as number, h as number]} />
          <meshLambertMaterial color={c as string} />
        </mesh>
      ))}
      {/* Sketches pinned above the desk. */}
      {[8.82, 8.96, 9.1].map((z, i) => (
        <mesh
          key={z}
          position={[room.x0 + 0.024, 2.17 + (i % 2) * 0.03, z]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.09, 0.11]} />
          <meshLambertMaterial color="#E6E1D8" />
        </mesh>
      ))}
      {/* Fairy lights. */}
      {garland.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.006, 8, 6]} />
          <meshBasicMaterial color="#FFC77A" toneMapped={false} />
        </mesh>
      ))}
      <points
        geometry={garlandGeo}
        material={garlandHalo}
        frustumCulled={false}
      />
      <pointLight
        position={[RX, room.y1 - 0.1, room.z0 + 0.15]}
        color="#FFB36B"
        intensity={0.035}
        distance={1.4}
        decay={2}
      />
    </group>
  );
};

/**
 * Her window seen from outside: an emissive pane that fades as the camera
 * gets close (so we can fly through), plus its halo.
 */
const WindowGlow: React.FC<{ readonly t: number }> = ({ t }) => {
  const halo = useMemo(() => makeHaloMaterial(1.6), []);
  const [wx, wy, wz] = INES.window;
  const geo = useMemo(
    () => makePointsGeometry([[wx, wy, wz + 0.12]]),
    [wx, wy, wz],
  );
  const cam = cameraAt(t).pos;
  const dist = cam.distanceTo(new Vector3(wx, wy, wz));
  const inside = cam.z < wz;
  const pane = inside ? 0 : smooth(dist, 1.6, 3.6);
  const flare =
    Math.exp(-Math.max(0, t - BEATS.onlyOne) * 2.2) *
    (t >= BEATS.onlyOne ? 1 : 0);
  const creator = smooth(t, BEATS.othersFrom - 0.2, BEATS.othersFrom + 0.3);
  const day = dayness(t);
  const base = new Color("#CDEFF5").lerp(TURQUOISE, creator);
  const k = (0.85 + flare * 0.6) * (1 - day * 0.6);
  useLayoutEffect(() => {
    const h = (0.62 + flare * 0.9) * pane * (1 - day * 0.7);
    geo.getAttribute("color").setXYZ(0, base.r * h, base.g * h, base.b * h);
    geo.getAttribute("color").needsUpdate = true;
  }, [geo, base, flare, pane, day]);
  return (
    <>
      {pane > 0.001 ? (
        <mesh position={[wx, wy, wz + 0.004]}>
          <planeGeometry args={[INES.windowW, INES.windowH]} />
          <meshBasicMaterial
            color={base.clone().multiplyScalar(k)}
            transparent
            opacity={pane * 0.92}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      ) : null}
      <points geometry={geo} material={halo} frustumCulled={false} />
    </>
  );
};

/** Only build the interior while the camera can see it (cheaper renders). */
export const InesHouse: React.FC<{ readonly t: number }> = ({ t }) => {
  const interior = t > 6 && t < 31;
  return (
    <group>
      <HouseShell />
      {interior ? (
        <>
          <Furniture t={t} />
          <Ines t={t} />
          <Creations t={t} />
        </>
      ) : null}
      <WindowGlow t={t} />
    </group>
  );
};
