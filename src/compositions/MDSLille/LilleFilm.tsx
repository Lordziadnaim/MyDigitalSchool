import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import { FilmFinish } from "../MDSHook/fx";
import { LINES, SFX, TOTAL_SECONDS } from "./edit";
import { Overlay } from "./Overlay";
import { World } from "./world/World";

/**
 * V3 — « Sauf une. » — 3D film for the Lille campus, 1080×1350, 60 fps.
 * Strategy & script: docs/v3-lille-sauf-une.md
 *
 * The film is a pure function of film time `t` (seconds). `FilmShot`
 * renders the 3D world + overlays from any start time, which is how the
 * 15 s cut re-uses the same shot.
 */

const SOFT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Canvas textures in the 3D scene need the brand fonts to be ready. */
const useCanvasFonts = () => {
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading fonts for 3D textures"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([
      document.fonts.load('800 150px "MDS Display"'),
      document.fonts.load('800 150px "MDS Text"'),
    ])
      .catch(() => undefined)
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [continueRender, handle]);
  return ready;
};

/** The 3D shot + 2D overlays, starting at film time `offset`. */
export const FilmShot: React.FC<{ readonly offset: number }> = ({ offset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = offset + frame / fps;
  const fontsReady = useCanvasFonts();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07061A" }}>
      {fontsReady ? (
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ fov: 38, near: 0.01, far: 400, position: [0, 5, 20] }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
        >
          <World t={t} />
        </ThreeCanvas>
      ) : null}
      <Overlay t={t} />
      <FilmFinish />
    </AbsoluteFill>
  );
};

const MUSIC_GAIN = 0.75;
const DUCK = 0.55;

/** 1 while the narrator speaks (smooth 0.2 s ramps). */
const voiceEnvelope = (t: number) => {
  let v = 0;
  for (const l of LINES) {
    const a = l.at - 0.2;
    const b = l.at + l.dur + 0.25;
    v = Math.max(
      v,
      Math.min(
        interpolate(t, [a, a + 0.2], [0, 1], SOFT),
        interpolate(t, [b - 0.25, b], [1, 0], SOFT),
      ),
    );
  }
  return v;
};

/**
 * Every sound of the film between film times `from` and `to`, placed so
 * that film time `from` is frame 0 of the parent sequence. Edges get short
 * fades so cut-downs don't click.
 */
export const FilmAudio: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly edgeFade?: number;
}> = ({ from, to, edgeFade = 0 }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const edges = (t: number) =>
    edgeFade > 0
      ? Math.min(
          interpolate(t, [from, from + edgeFade], [0, 1], SOFT),
          interpolate(t, [to - edgeFade, to], [1, 0], SOFT),
        )
      : 1;

  /** Clip starting at film time `at`, lasting `dur` seconds. */
  const place = (at: number, dur: number) => {
    if (at + dur <= from || at >= to) return null;
    const start = Math.max(at, from);
    return {
      from: f(start - from),
      trimBefore: f(start - at),
      durationInFrames: Math.max(1, f(Math.min(at + dur, to) - start)),
    };
  };

  return (
    <>
      {LINES.map((l) => {
        const p = place(l.at, l.dur + 0.1);
        if (!p) return null;
        return (
          <Audio
            key={l.id}
            name={`Voix ${l.id}`}
            src={staticFile(`v3/voice/${l.id}.mp3`)}
            {...p}
            premountFor={fps}
          />
        );
      })}
      {SFX.map((s, i) => {
        const dur = s.dur ?? 2.5;
        const p = place(s.at, dur);
        if (!p) return null;
        return (
          <Audio
            key={`${s.file}-${i}`}
            name={`SFX ${s.file}`}
            src={staticFile(`v3/sfx/${s.file}.mp3`)}
            {...p}
            premountFor={fps}
            volume={(local) => {
              const t = Math.max(s.at, from) + local / fps;
              const lt = t - s.at;
              // Long ambiences fade in/out; one-shots play as is.
              const amb = s.dur
                ? Math.min(
                    interpolate(lt, [0, 1.2], [0, 1], SOFT),
                    interpolate(lt, [dur - 1.5, dur], [1, 0], SOFT),
                  )
                : 1;
              // Night ambience fades out at dawn.
              const dawn =
                s.file === "night"
                  ? interpolate(t, [37.5, 41], [1, 0], SOFT)
                  : 1;
              return s.volume * amb * dawn * edges(t);
            }}
          />
        );
      })}
      {(() => {
        const p = place(0, TOTAL_SECONDS);
        if (!p) return null;
        return (
          <Audio
            name="Musique"
            src={staticFile("v3/music/score.mp3")}
            {...p}
            premountFor={fps}
            volume={(local) => {
              const t = Math.max(0, from) + local / fps;
              const end = interpolate(
                t,
                [TOTAL_SECONDS - 1.2, TOTAL_SECONDS],
                [1, 0],
                SOFT,
              );
              return (
                MUSIC_GAIN *
                (1 - (1 - DUCK) * voiceEnvelope(t)) *
                end *
                edges(t)
              );
            }}
          />
        );
      })()}
    </>
  );
};

/** Main film: 56 s, one shot. */
export const LilleFilm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <FilmShot offset={0} />
    <FilmAudio from={0} to={TOTAL_SECONDS} />
  </AbsoluteFill>
);

/**
 * 15 s cut (paid / stories): « Sauf une. » → « elle n'est pas la seule »
 * → closing line → brand. Same shot, four pieces.
 */
export const CUT_PIECES: readonly {
  readonly from: number;
  readonly to: number;
}[] = [
  { from: 3.25, to: 6.5 },
  { from: 27.62, to: 32.75 },
  { from: 43.3, to: 47.35 },
  { from: 48.3, to: 51.6 },
];
export const CUT_SECONDS = CUT_PIECES.reduce((s, p) => s + (p.to - p.from), 0);

export const LilleCut15: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  let start = 0;
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [0, 1],
    SOFT,
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {CUT_PIECES.map((p, i) => {
        const from = Math.round(start * fps);
        const dur = Math.round((p.to - p.from) * fps);
        start += p.to - p.from;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={dur}
            premountFor={fps}
            name={`Plan ${i + 1}`}
          >
            <FilmShot offset={p.from} />
            <FilmAudio from={p.from} to={p.to} edgeFade={0.12} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
