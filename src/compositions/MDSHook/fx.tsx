import React, { createContext, useContext } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../../brand/theme";
import { displayFont, textFont } from "../../brand/fonts";
import { HITS, LINES, TOTAL_SECONDS, lineDuration } from "./edit";

/**
 * Cinematic finishing layers for the V2 film. All effects are pure
 * functions of the frame (deterministic renders), and time is handled in
 * seconds so they look identical at 30 or 60 fps.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const SceneStart = createContext(0);

/** Gives a scene's children the absolute time of the scene start. */
export const SceneClock: React.FC<{
  readonly start: number;
  readonly children: React.ReactNode;
}> = ({ start, children }) => (
  <SceneStart.Provider value={start}>{children}</SceneStart.Provider>
);

/**
 * Absolute film time in seconds, even inside a <Sequence>: every cue in
 * edit.ts can be used as-is in any scene.
 */
export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = useContext(SceneStart);
  return start + frame / fps;
};

/** 0→1 over [start, start+dur] seconds with an ease-out curve. */
export const ease = (t: number, start: number, dur: number) => {
  const p = interpolate(t, [start, start + dur], [0, 1], clamp);
  return 1 - Math.pow(1 - p, 3);
};

/** Overshooting "slam" 0→1 (back-out). */
export const slam = (t: number, start: number, dur = 0.35) => {
  const p = interpolate(t, [start, start + dur], [0, 1], clamp);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

/** Intensity 0→1 of the most recent hit, decaying over `decay` seconds. */
const hitEnvelope = (t: number, decay: number) => {
  let v = 0;
  for (const h of HITS) {
    if (t >= h && t < h + decay) v = Math.max(v, 1 - (t - h) / decay);
  }
  return v;
};

/** Camera: hit shake + slow global push. Wrap the whole film in it. */
export const Camera: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const t = useTime();
  const k = hitEnvelope(t, 0.35);
  const x = (random(`sx${frame}`) - 0.5) * 36 * k;
  const y = (random(`sy${frame}`) - 0.5) * 36 * k;
  return (
    <AbsoluteFill
      style={{ translate: `${x}px ${y}px`, scale: String(1 + 0.04 * k) }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** White flash on every hit. */
export const Flash: React.FC = () => {
  const t = useTime();
  const k = hitEnvelope(t, 0.18);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.white,
        opacity: k * 0.85,
        pointerEvents: "none",
      }}
    />
  );
};

/** Animated film grain + vignette for a filmic texture. */
export const FilmFinish: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", opacity: 0.09, mixBlendMode: "overlay" }}
      >
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** RGB-split + slice glitch on its children for a short window. */
export const Glitch: React.FC<{
  readonly at: number;
  readonly duration?: number;
  readonly children: React.ReactNode;
}> = ({ at, duration = 0.25, children }) => {
  const frame = useCurrentFrame();
  const t = useTime();
  const active = t >= at && t < at + duration;
  if (!active) return <>{children}</>;
  const k = 1 - (t - at) / duration;
  const off = (random(`g${frame}`) - 0.5) * 60 * k;
  const band = 20 + random(`b${frame}`) * 60;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          translate: `${off}px 0px`,
          filter: "drop-shadow(-8px 0 0 rgba(231,29,115,0.8))",
        }}
      >
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `inset(${band}% 0 ${100 - band - 12}% 0)`,
          translate: `${-off * 2}px 0px`,
          filter: "drop-shadow(8px 0 0 rgba(45,184,197,0.9))",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Thin progress bar: tells LinkedIn viewers the film is short. */
export const ProgressBar: React.FC = () => {
  const t = useTime();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 8,
        width: `${Math.min(1, t / TOTAL_SECONDS) * 100}%`,
        background: `linear-gradient(90deg, ${colors.blue}, ${colors.pink})`,
      }}
    />
  );
};

/**
 * Word-by-word captions. Word timings are spread across each line's clip
 * duration by word length (lines are short, so this tracks speech well).
 */
export const KineticCaptions: React.FC = () => {
  const t = useTime();
  const line = LINES.find(
    (l) => t >= l.at - 0.05 && t < l.at + lineDuration(l.id) + 0.25,
  );
  if (!line || !line.captions) return null;
  const words = line.text.split(" ");
  const weights = words.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  const dur = lineDuration(line.id);
  let acc = 0;
  const starts = weights.map((w) => {
    const s = line.at + (acc / total) * dur;
    acc += w;
    return s;
  });
  const appear = ease(t, line.at - 0.05, 0.15);
  return (
    <div
      style={{
        position: "absolute",
        left: 160,
        right: 160,
        bottom: 70,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 16,
        rowGap: 4,
        opacity: appear,
        translate: `0px ${(1 - appear) * 20}px`,
      }}
    >
      {words.map((w, i) => {
        const spoken = t >= starts[i];
        const current = spoken && (i === words.length - 1 || t < starts[i + 1]);
        return (
          <span
            key={i}
            style={{
              fontFamily: textFont,
              fontWeight: 800,
              fontSize: 50,
              lineHeight: 1.25,
              color: current
                ? colors.ink
                : spoken
                  ? colors.white
                  : "rgba(255,255,255,0.45)",
              backgroundColor: current ? colors.blue : "transparent",
              padding: "0 10px",
              borderRadius: 10,
              textShadow: current ? "none" : "0 3px 12px rgba(0,0,0,0.6)",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Giant word that slams in at `at` (seconds). `style` applies to an outer
 * wrapper, so callers can add their own scale/opacity on top of the slam.
 */
export const BigWord: React.FC<{
  readonly text: string;
  readonly at: number;
  readonly color?: string;
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ text, at, color = colors.white, size = 260, style }) => {
  const t = useTime();
  const s = slam(t, at, 0.3);
  return (
    <div style={{ textAlign: "center", ...style }}>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          textTransform: "uppercase",
          color,
          opacity: t >= at ? 1 : 0,
          scale: String(interpolate(s, [0, 1], [2.2, 1])),
          filter: `blur(${Math.max(0, 1 - s * 1.5) * 18}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
