import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../SceneShell";
import { getScene } from "../timeline";
import {
  CodeViz,
  MontageViz,
  SkillCard,
  SocialViz,
  TypeViz,
  UXViz,
} from "../skills";
import { colors, radii } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { AnimatedText } from "../../../components/AnimatedText";
import { fadeInOut, mapRange, pop, progress } from "../../../lib/animation";

/** Scene 4 — the reframe: "traîner sur ton téléphone" becomes real jobs. */
export const S4Declic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cues } = getScene("s4");
  const [cCall, cPro, cMontage, cCM, cUX, cJobs, cHiring, cYou] = cues;

  const quoteOut = progress(frame, cMontage - 8, 14);
  const strike = progress(frame, cPro + 10, 20);
  const cardsOut = progress(frame, cJobs - 6, 16);

  const jobs = [
    {
      at: cMontage,
      label: "Monteur·se / Motion designer",
      viz: (t: number) => <MontageViz t={t} />,
    },
    {
      at: cMontage + 18,
      label: "Designer graphique",
      viz: (t: number) => <TypeViz t={t} />,
    },
    {
      at: cCM,
      label: "Community manager",
      viz: (t: number) => <SocialViz t={t} flopAt={9999} />,
    },
    { at: cUX, label: "UX / UI designer", viz: (t: number) => <UXViz t={t} /> },
    {
      at: cUX + 34,
      label: "Développeur·se web",
      viz: (t: number) => <CodeViz t={t + 40} />,
    },
  ];

  return (
    <SceneShell id="s4" glow={0.75}>
      {/* The quote that gets crossed out */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 120,
          opacity: 1 - quoteOut,
          scale: String(1 - 0.1 * quoteOut),
        }}
      >
        <div
          style={{
            position: "relative",
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 100,
            color: colors.greyLight,
            opacity: progress(frame, cCall, 12),
          }}
        >
          « traîner sur ton téléphone »
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "52%",
              height: 10,
              borderRadius: 10,
              width: `${strike * 104}%`,
              backgroundColor: colors.blue,
            }}
          />
        </div>
        <AnimatedText
          text="Le monde pro appelle ça autrement."
          start={cPro}
          fontSize={64}
          fontWeight={700}
          highlight={["autrement."]}
          style={{ marginTop: 40 }}
        />
      </AbsoluteFill>

      {/* Habits flip into jobs */}
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          paddingBottom: 60,
          opacity: 1 - cardsOut,
          translate: `0px ${-cardsOut * 80}px`,
        }}
      >
        {jobs.map((j, i) => {
          const flip = pop(frame, fps, j.at - 4, 14, 110);
          return (
            <SkillCard
              key={i}
              width={300}
              label={j.label}
              accent={frame > j.at}
              style={{
                opacity: mapRange(flip, [0, 0.3], [0, 1]),
                rotate: `y ${(1 - flip) * 90}deg`,
              }}
            >
              <div style={{ scale: "0.85" }}>
                {j.viz(Math.max(0, frame - j.at))}
              </div>
            </SkillCard>
          );
        })}
      </AbsoluteFill>

      {/* Real jobs, hiring, people like you */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 140,
          opacity: progress(frame, cJobs, 8),
        }}
      >
        <AnimatedText
          text="Des métiers."
          start={cJobs}
          fontSize={140}
          fontWeight={900}
        />
        <AnimatedText
          text="De vrais métiers."
          start={cJobs + 22}
          fontSize={140}
          fontWeight={900}
          highlight={["vrais"]}
        />
        <div style={{ display: "flex", gap: 30, marginTop: 50 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px 36px",
              borderRadius: radii.pill,
              backgroundColor: colors.blue,
              color: colors.ink,
              fontFamily: textFont,
              fontWeight: 700,
              fontSize: 42,
              opacity: fadeInOut(frame, cHiring, undefined, 10),
              scale: String(0.7 + 0.3 * pop(frame, fps, cHiring)),
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 18,
                backgroundColor: colors.ink,
                opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.15)),
              }}
            />
            Qui recrutent
          </div>
          <div
            style={{
              padding: "18px 36px",
              borderRadius: radii.pill,
              border: `3px solid ${colors.blue}`,
              color: colors.white,
              fontFamily: textFont,
              fontWeight: 700,
              fontSize: 42,
              opacity: progress(frame, cYou, 10),
              scale: String(0.7 + 0.3 * pop(frame, fps, cYou)),
            }}
          >
            et qui ont besoin de{" "}
            <span style={{ color: colors.blue }}>profils comme le tien</span>
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
