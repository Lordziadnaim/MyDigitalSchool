import React from "react";
import { staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import {
  getScene,
  OUTRO_FRAMES,
  speechWindows,
  TOTAL_FRAMES,
  TRANSITION_FRAMES,
} from "./timeline";
import { S1Reveil } from "./scenes/S1Reveil";
import { S2Routine } from "./scenes/S2Routine";
import { S3Talents } from "./scenes/S3Talents";
import { S4Declic } from "./scenes/S4Declic";
import { S5Croyance } from "./scenes/S5Croyance";
import { S6Virage } from "./scenes/S6Virage";
import { S7Ecole } from "./scenes/S7Ecole";
import { S8Question } from "./scenes/S8Question";
import { Outro } from "./scenes/Outro";
import { mapRange } from "../../lib/animation";

const T = TRANSITION_FRAMES;
const fadeT = linearTiming({ durationInFrames: T });
const springT = springTiming({ config: { damping: 200 }, durationInFrames: T });

const MUSIC_BED = 0.42;
const MUSIC_UNDER_VOICE = 0.13;
const DUCK_RAMP = 12;

/** Music volume: ducked under the narrator, fades in/out at the edges. */
const musicVolume = (f: number): number => {
  let distance = Infinity;
  for (const [a, b] of speechWindows) {
    if (f >= a && f <= b) {
      distance = 0;
      break;
    }
    distance = Math.min(distance, f < a ? a - f : f - b);
  }
  const duck = mapRange(
    distance,
    [0, DUCK_RAMP],
    [MUSIC_UNDER_VOICE, MUSIC_BED],
  );
  const edges = Math.min(
    mapRange(f, [0, 30], [0, 1]),
    mapRange(f, [TOTAL_FRAMES - 90, TOTAL_FRAMES], [1, 0]),
  );
  return duck * edges;
};

/**
 * "Ton talent existe déjà" — 3-minute storytelling film for LinkedIn,
 * written for an audience at Schwartz awareness level 1 (unaware).
 */
export const MainVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="1 · Le réveil"
          durationInFrames={getScene("s1").duration}
          premountFor={fps}
        >
          <S1Reveil />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeT} />
        <TransitionSeries.Sequence
          name="2 · Pilote automatique"
          durationInFrames={getScene("s2").duration}
          premountFor={fps}
        >
          <S2Routine />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={fadeT}
        />
        <TransitionSeries.Sequence
          name="3 · Ce que tu fais déjà"
          durationInFrames={getScene("s3").duration}
          premountFor={fps}
        >
          <S3Talents />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springT}
        />
        <TransitionSeries.Sequence
          name="4 · Le déclic"
          durationInFrames={getScene("s4").duration}
          premountFor={fps}
        >
          <S4Declic />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeT} />
        <TransitionSeries.Sequence
          name="5 · La croyance"
          durationInFrames={getScene("s5").duration}
          premountFor={fps}
        >
          <S5Croyance />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springT}
        />
        <TransitionSeries.Sequence
          name="6 · Le virage"
          durationInFrames={getScene("s6").duration}
          premountFor={fps}
        >
          <S6Virage />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={fadeT}
        />
        <TransitionSeries.Sequence
          name="7 · MyDigitalSchool"
          durationInFrames={getScene("s7").duration}
          premountFor={fps}
        >
          <S7Ecole />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeT} />
        <TransitionSeries.Sequence
          name="8 · La question"
          durationInFrames={getScene("s8").duration}
          premountFor={fps}
        >
          <S8Question />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeT} />
        <TransitionSeries.Sequence
          name="Outro"
          durationInFrames={OUTRO_FRAMES}
          premountFor={fps}
        >
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio
        name="Musique"
        src={staticFile("music/bed.mp3")}
        volume={musicVolume}
        premountFor={fps}
      />
    </>
  );
};
