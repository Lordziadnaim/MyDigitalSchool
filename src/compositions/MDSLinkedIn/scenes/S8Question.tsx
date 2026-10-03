import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../SceneShell";
import { Phone } from "../parts";
import { getScene } from "../timeline";
import { colors } from "../../../brand/theme";
import { displayFont } from "../../../brand/fonts";
import { AnimatedText } from "../../../components/AnimatedText";
import { Wordmark } from "../../../components/Wordmark";
import { fadeInOut, mapRange, pop, progress } from "../../../lib/animation";

/** Scene 8 — callback to the alarm, the question, the tagline. */
export const S8Question: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cues } = getScene("s8");
  const [cTomorrow, cThumb, cQuestion, cWhatIf, cBecome, cMDS, cTagline] = cues;

  const partA = fadeInOut(frame, cTomorrow, cWhatIf, 12);
  const partB = fadeInOut(frame, cWhatIf - 2, cMDS, 12);
  const partC = progress(frame, cMDS, 14);
  const phoneIn = pop(frame, fps, cThumb - 6, 16);
  const screenOn = progress(frame, cThumb + 10, 12);
  const qMark = pop(frame, fps, cQuestion + 6, 10, 150);

  return (
    <SceneShell id="s8" glow={0.4 + 0.5 * partC}>
      {/* A: tomorrow morning, again */}
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: "0 220px 120px",
          opacity: partA,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 900,
              fontSize: 140,
              color: colors.white,
              opacity: progress(frame, cTomorrow, 12),
            }}
          >
            Demain.
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 200,
              color: colors.blue,
              letterSpacing: "-0.05em",
              opacity: progress(frame, cTomorrow + 20, 12),
            }}
          >
            07:12
          </div>
        </div>
        <div
          style={{
            position: "relative",
            opacity: mapRange(phoneIn, [0, 0.4], [0, 1]),
            translate: `0px ${(1 - phoneIn) * 200}px`,
          }}
        >
          <Phone width={320}>
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `rgba(45,184,197,${0.15 * screenOn})`,
              }}
            >
              <div
                style={{
                  fontFamily: displayFont,
                  fontWeight: 900,
                  fontSize: 260,
                  color: colors.blue,
                  scale: String(qMark),
                  opacity: qMark,
                }}
              >
                ?
              </div>
            </AbsoluteFill>
          </Phone>
        </div>
      </AbsoluteFill>

      {/* B: the question */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 140,
          opacity: partB,
        }}
      >
        <AnimatedText
          text="Et si ce que tu fais pour passer le temps…"
          start={cWhatIf}
          fontSize={92}
          maxWidth={1500}
          color={colors.greyLight}
        />
        <AnimatedText
          text="…devenait ce que tu fais de ta vie ?"
          start={cBecome}
          fontSize={110}
          maxWidth={1600}
          highlight={["ta", "vie", "?"]}
          style={{ marginTop: 26 }}
        />
      </AbsoluteFill>

      {/* C: brand + tagline */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 140,
          opacity: partC,
        }}
      >
        <Wordmark size={120} progress={progress(frame, cMDS, 26)} />
        <AnimatedText
          text="Ton talent existe déjà."
          start={cTagline}
          fontSize={96}
          style={{ marginTop: 60 }}
        />
        <AnimatedText
          text="Donne-lui un métier."
          start={cTagline + 30}
          fontSize={96}
          highlight={["métier."]}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};
