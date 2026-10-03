import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { LINES, SCENES, SFX, lineDuration, type SceneId } from "./edit";
import {
  Camera,
  FilmFinish,
  Flash,
  Glitch,
  KineticCaptions,
  ProgressBar,
  SceneClock,
} from "./fx";
import { NoScrollScene, StopScene, ThumbScene } from "./scenes/Hook";
import {
  CodeScene,
  FontScene,
  MontageScene,
  PostsScene,
  RiserScene,
} from "./scenes/Montage";
import { BeliefScene, DropScene, FauxScene } from "./scenes/Drop";
import {
  AlternanceScene,
  PartnersScene,
  StatsScene,
  TalentScene,
} from "./scenes/Solution";
import { BrandScene, CtaScene } from "./scenes/Brand";

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  stop: StopScene,
  noScroll: NoScrollScene,
  thumb: ThumbScene,
  montage: MontageScene,
  font: FontScene,
  posts: PostsScene,
  code: CodeScene,
  riser: RiserScene,
  drop: DropScene,
  belief: BeliefScene,
  faux: FauxScene,
  talent: TalentScene,
  alternance: AlternanceScene,
  stats: StatsScene,
  partners: PartnersScene,
  brand: BrandScene,
  cta: CtaScene,
};

/**
 * Music edit: the generated track (75 s) is re-cut into 4 segments so its
 * structure lands on the story beats.
 *   film time  → music time
 *   0.0–3.7    → 0.0–3.7   (intro)
 *   3.7–28.5   → 0.0–24.8  (build, pre-drop gap at 17.7, DROP at 19.7)
 *   28.5–35.15 → 32.0–38.65 (breakdown under the limiting belief)
 *   35.15–62   → 46.7–73.55 (re-entry on « Faux. », finale)
 */
const MUSIC_SEGMENTS = [
  { film: 0, music: 0, dur: 3.7, gain: 0.55 },
  { film: 3.7, music: 0, dur: 24.8, gain: 0.55 },
  { film: 28.5, music: 32.0, dur: 6.65, gain: 0.95 },
  { film: 35.15, music: 46.7, dur: 26.85, gain: 0.55 },
];

const DUCK = 0.5; // music level while the narrator speaks (relative)

/** 1 while the narrator speaks, ramping smoothly over 0.15 s around each line. */
const voiceEnvelope = (t: number) => {
  let v = 0;
  for (const l of LINES) {
    const a = l.at - 0.15;
    const b = l.at + lineDuration(l.id) + 0.15;
    const ramp = Math.min(
      interpolate(t, [a, a + 0.15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      interpolate(t, [b - 0.15, b], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
    v = Math.max(v, ramp);
  }
  return v;
};

/**
 * « Stop. Ne scrolle pas. » — 62 s hook-driven film for LinkedIn, 60 fps.
 * Strategy & script: docs/v2-strategie-creative.md
 */
export const HookFilm: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Camera>
        {(Object.keys(SCENES) as SceneId[]).map((id) => {
          const [from, to] = SCENES[id];
          const Scene = SCENE_COMPONENTS[id];
          return (
            <Sequence
              key={id}
              name={id}
              from={f(from)}
              durationInFrames={f(to) - f(from)}
              premountFor={fps}
            >
              <SceneClock start={from}>
                <Glitch at={from} duration={0.12}>
                  <Scene />
                </Glitch>
              </SceneClock>
            </Sequence>
          );
        })}
        <KineticCaptions />
      </Camera>
      <Flash />
      <FilmFinish />
      <ProgressBar />

      {/* Voice — one clip per line */}
      {LINES.map((l) => (
        <Audio
          key={l.id}
          name={`Voix ${l.id}`}
          src={staticFile(`v2/voice/${l.id}.mp3`)}
          from={f(l.at)}
          premountFor={fps}
        />
      ))}

      {/* Sound design */}
      {SFX.map((s, i) => (
        <Audio
          key={`${s.file}-${i}`}
          name={`SFX ${s.file}`}
          src={staticFile(`v2/sfx/${s.file}.mp3`)}
          from={f(s.at)}
          volume={s.volume}
          premountFor={fps}
        />
      ))}

      {/* Music, re-cut on the story beats and ducked under the voice */}
      {MUSIC_SEGMENTS.map((m, i) => (
        <Audio
          key={i}
          name={`Musique ${i + 1}`}
          src={staticFile("v2/music/bed.mp3")}
          from={f(m.film)}
          trimBefore={f(m.music)}
          durationInFrames={f(m.dur)}
          premountFor={fps}
          volume={(local) => {
            const t = m.film + local / fps;
            const edgeIn = interpolate(local, [0, f(0.06)], [0, 1], {
              extrapolateRight: "clamp",
            });
            const edgeOut = interpolate(
              local,
              [f(m.dur) - f(0.12), f(m.dur)],
              [1, 0],
              { extrapolateLeft: "clamp" },
            );
            const end = interpolate(t, [60.6, 62], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              m.gain *
              (1 - (1 - DUCK) * voiceEnvelope(t)) *
              Math.min(edgeIn, edgeOut) *
              end
            );
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
