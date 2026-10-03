import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Background } from "../../components/Background";
import { AnimatedText } from "../../components/AnimatedText";
import { Ring, GrowLine, Dot } from "../../components/Shapes";
import { Counter } from "../../components/Counter";
import { Wordmark } from "../../components/Wordmark";
import { colors } from "../../brand/theme";
import { VIDEO } from "../../config/video";
import { textFont } from "../../brand/fonts";
import { float, pop, progress, softSpring } from "../../lib/animation";

/**
 * Sample composition — demonstrates the toolkit:
 * kinetic typography, drawn shapes, counters and three kinds of
 * transitions. Its total length comes from the `durationInSeconds` prop
 * (see calculateMetadata), and every scene scales with it.
 */
export type SampleProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly durationInSeconds: number;
};

const TRANSITION = 15;

/** Split total frames into 3 scenes, accounting for 2 transition overlaps. */
const sceneLengths = (total: number) => {
  const sum = total + 2 * TRANSITION;
  const a = Math.round(sum * 0.36);
  const b = Math.round(sum * 0.32);
  return [a, b, sum - a - b] as const;
};

export const calculateSampleMetadata: CalculateMetadataFunction<
  SampleProps
> = ({ props }) => {
  return {
    durationInFrames: Math.max(
      60,
      Math.round(props.durationInSeconds * VIDEO.fps),
    ),
  };
};

const SceneTitle: React.FC<{
  readonly title: string;
  readonly subtitle: string;
}> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const ring = progress(frame, 0, 40);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Background is absolutely positioned: keep it first, and keep
          content in a positioned layer above it. */}
      <Background glow={0.8} />
      <Ring
        size={width * 0.36}
        progress={ring}
        stroke={4}
        color={colors.blue}
        style={{
          position: "absolute",
          opacity: 0.5,
          rotate: `${frame * 0.4}deg`,
        }}
      />
      <Dot
        size={28}
        style={{
          position: "absolute",
          left: width * 0.2,
          top: 260 + float(frame, 0.05, 20),
          scale: String(pop(frame, fps, 10)),
        }}
      />
      <Dot
        size={18}
        color={colors.white}
        style={{
          position: "absolute",
          right: width * 0.22,
          bottom: 280 + float(frame, 0.06, 16, 2),
          scale: String(pop(frame, fps, 16)),
        }}
      />
      <AnimatedText
        text={title}
        start={6}
        fontSize={120}
        highlight={["Remotion"]}
      />
      <div
        style={{
          marginTop: 28,
          fontFamily: textFont,
          fontSize: 44,
          color: colors.greyLight,
          opacity: progress(frame, 24, 20),
          translate: `0px ${(1 - softSpring(frame, fps, 24)) * 30}px`,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

const SceneShapes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bars = [0.45, 0.7, 0.55, 0.9, 0.75];
  return (
    <>
      <Background glow={0.4} />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 60 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 36,
            height: 420,
          }}
        >
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 110,
                height: 420 * h * pop(frame, fps, 6 + i * 5, 12, 110),
                borderRadius: 24,
                background: i === 3 ? colors.blue : colors.inkLine,
              }}
            />
          ))}
        </div>
        <GrowLine width={760} progress={progress(frame, 30, 30)} />
        <AnimatedText
          text="Formes, rythme, mouvement."
          start={34}
          fontSize={84}
          highlight={["mouvement."]}
        />
      </AbsoluteFill>
    </>
  );
};

const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Background glow={0.9} />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 40 }}
      >
        <Counter to={30} start={4} duration={30} suffix=" fps" fontSize={150} />
        <Wordmark size={90} progress={progress(frame, 20, 30)} />
      </AbsoluteFill>
    </>
  );
};

export const SampleComposition: React.FC<SampleProps> = ({
  title,
  subtitle,
}) => {
  const { durationInFrames, fps } = useVideoConfig();
  const [a, b, c] = sceneLengths(durationInFrames);
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence
        name="Title"
        durationInFrames={a}
        premountFor={fps}
      >
        <SceneTitle title={title} subtitle={subtitle} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({
          config: { damping: 200 },
          durationInFrames: TRANSITION,
        })}
      />
      <TransitionSeries.Sequence
        name="Shapes"
        durationInFrames={b}
        premountFor={fps}
      >
        <SceneShapes />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />
      <TransitionSeries.Sequence
        name="Outro"
        durationInFrames={c}
        premountFor={fps}
      >
        <SceneOutro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
