import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo } from "../../../components/Logo";
import { colors, radii } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { fadeInOut, pop, progress } from "../../../lib/animation";

const ACTIONS = ["Brochure", "Portes ouvertes", "Candidature"];

/**
 * End card — light layout like the school website: colour logo, tagline,
 * purple call to action and the site's three actions.
 */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = fadeInOut(frame, -100, durationInFrames, 20);
  const cta = pop(frame, fps, 34, 14);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.blueLight} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          opacity: out,
        }}
      >
        <Logo width={640} variant="color" progress={progress(frame, 0, 36)} />
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 72,
            color: colors.greyDark,
            opacity: progress(frame, 18, 16),
            translate: `0px ${(1 - progress(frame, 18, 16)) * 20}px`,
          }}
        >
          Ton talent existe déjà.{" "}
          <span style={{ color: colors.purple }}>Donne-lui un métier.</span>
        </div>
        <div
          style={{
            padding: "24px 56px",
            borderRadius: radii.pill,
            backgroundColor: colors.purple,
            color: colors.white,
            fontFamily: textFont,
            fontWeight: 700,
            fontSize: 44,
            opacity: cta,
            scale: String(0.8 + 0.2 * cta),
          }}
        >
          Découvre les 20 formations → mydigitalschool.com
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {ACTIONS.map((a, i) => {
            const p = pop(frame, fps, 50 + i * 6, 16);
            return (
              <div
                key={a}
                style={{
                  padding: "12px 30px",
                  borderRadius: radii.pill,
                  border: `2px solid ${colors.purple}`,
                  color: colors.purple,
                  fontFamily: textFont,
                  fontWeight: 700,
                  fontSize: 30,
                  opacity: p,
                  translate: `0px ${(1 - p) * 20}px`,
                }}
              >
                {a}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 10,
            padding: "8px 18px",
            backgroundColor: colors.pink,
            color: colors.white,
            fontFamily: textFont,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: progress(frame, 70, 14),
          }}
        >
          Ici, les talents se connectent
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
