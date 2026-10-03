import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../SceneShell";
import { Kicker } from "../parts";
import { getScene } from "../timeline";
import { CodeViz, MontageViz, SkillCard, SocialViz, TypeViz } from "../skills";
import { colors } from "../../../brand/theme";
import { AnimatedText } from "../../../components/AnimatedText";
import { mapRange, pop, progress } from "../../../lib/animation";

/** Scene 3 — what you do at night when nobody asks anything. Color comes back. */
export const S3Talents: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cues } = getScene("s3");
  const [cLook, cNobody, cVideo, cBeat, cFont, cTop, cFlop, cCode] = cues;

  const color = progress(frame, cLook, 60);
  const titleUp = progress(frame, cVideo - 10, 24);
  const cards = [
    {
      at: cVideo,
      label: "Monter une vidéo sur le beat",
      viz: (t: number) => <MontageViz t={t} active={frame > cBeat} />,
    },
    {
      at: cFont,
      label: "Choisir LA bonne police",
      viz: (t: number) => <TypeViz t={t} />,
    },
    {
      at: cTop,
      label: "Sentir ce qui va cartonner",
      viz: (t: number) => <SocialViz t={t} flopAt={cFlop - cTop} />,
    },
    {
      at: cCode,
      label: "Ouvrir le code d'une page",
      viz: (t: number) => <CodeViz t={t} />,
    },
  ];

  return (
    <SceneShell
      id="s3"
      glow={0.15 + 0.6 * color}
      desaturate={0.85 * (1 - color)}
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: mapRange(titleUp, [0, 1], [330, 110]),
        }}
      >
        <Kicker text="Le soir" start={cLook} style={{ alignSelf: "center" }} />
        <AnimatedText
          text="Quand personne ne te demande rien…"
          start={cNobody - 6}
          fontSize={mapRange(titleUp, [0, 1], [104, 64])}
          highlight={["rien…"]}
          style={{ marginTop: 18 }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 46,
          paddingTop: 90,
        }}
      >
        {cards.map((c, i) => {
          const p = pop(frame, fps, c.at - 4, 15);
          return (
            <SkillCard
              key={i}
              label={c.label}
              accent={frame > c.at && frame < c.at + 70}
              style={{
                opacity: mapRange(p, [0, 0.4], [0, 1]),
                translate: `0px ${(1 - p) * 140}px`,
              }}
            >
              {c.viz(Math.max(0, frame - c.at))}
            </SkillCard>
          );
        })}
      </AbsoluteFill>
      {/* Accent dots */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 140 + i * 310,
              top: 860 + Math.sin(frame * 0.04 + i) * 14,
              width: 10,
              height: 10,
              borderRadius: 10,
              backgroundColor: colors.blue,
              opacity: color * 0.5,
            }}
          />
        ))}
      </AbsoluteFill>
    </SceneShell>
  );
};
