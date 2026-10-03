import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../../../components/Background";
import { Wordmark } from "../../../components/Wordmark";
import { colors, radii } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { fadeInOut, pop, progress } from "../../../lib/animation";
import { CAMPUSES } from "../campuses";

/** End card — logo, tagline, call to action. No voiceover; music resolves. */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = fadeInOut(frame, 0, durationInFrames, 20);
  const cta = pop(frame, fps, 30, 14);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Background glow={1} />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 46 }}
      >
        <Wordmark size={130} progress={progress(frame, 0, 26)} />
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 72,
            color: colors.white,
            opacity: progress(frame, 14, 16),
          }}
        >
          Ton talent existe déjà.{" "}
          <span style={{ color: colors.blue }}>Donne-lui un métier.</span>
        </div>
        <div
          style={{
            padding: "26px 56px",
            borderRadius: radii.pill,
            backgroundColor: colors.blue,
            color: colors.ink,
            fontFamily: textFont,
            fontWeight: 700,
            fontSize: 48,
            opacity: cta,
            scale: String(0.8 + 0.2 * cta),
            boxShadow: `0 0 ${40 + 20 * Math.sin(frame * 0.12)}px ${colors.blue}88`,
          }}
        >
          Découvre les formations → mydigitalschool.com
        </div>
        <div
          style={{
            marginTop: 30,
            maxWidth: 1500,
            textAlign: "center",
            fontFamily: textFont,
            fontSize: 28,
            lineHeight: 1.6,
            color: colors.grey,
            opacity: progress(frame, 50, 20),
          }}
        >
          {CAMPUSES.map((c) => c.name).join(" · ")}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
