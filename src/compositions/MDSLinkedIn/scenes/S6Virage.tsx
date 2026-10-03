import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { SceneShell } from "../SceneShell";
import { Chip, CheckRow } from "../parts";
import { getScene } from "../timeline";
import { colors, radii } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { AnimatedText } from "../../../components/AnimatedText";
import { BriefcaseIcon, CapIcon } from "../../../components/Icons";
import { fadeInOut, pop, progress } from "../../../lib/animation";

const ROAD =
  "M 80 520 L 760 520 C 1000 520 1080 460 1180 330 C 1280 200 1420 140 1660 120";
const ROAD_LEN = getLength(ROAD);

/** Scene 6 — the turn: alternance, paid training, the weight disappears. */
export const S6Virage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cues } = getScene("s6");
  const [
    cThousands,
    cProjects,
    cPros,
    cAlternate,
    cPaid,
    cFunded,
    cCV,
    cWeight,
  ] = cues;

  const road = progress(frame, cThousands, 60);
  const phaseA = fadeInOut(frame, cThousands, cAlternate, 12);
  const phaseB = fadeInOut(frame, cAlternate - 4, cWeight + 6, 12);
  const phaseC = progress(frame, cWeight, 14);
  const toggle = Math.floor((frame - cAlternate) / 22) % 2 === 0;
  const lift = progress(frame, cWeight + 20, 50);

  return (
    <SceneShell id="s6" glow={0.6 + phaseC * 0.3}>
      {/* Phase A — the road that turns */}
      <AbsoluteFill style={{ opacity: phaseA }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 90 }}>
          <AnimatedText
            text="Des milliers de jeunes font ce virage."
            start={cThousands}
            fontSize={80}
            highlight={["virage."]}
          />
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 80, top: 260 }}>
          <svg width={1760} height={620} style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="road" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor={colors.grey} />
                <stop offset="45%" stopColor={colors.grey} />
                <stop offset="70%" stopColor={colors.blue} />
                <stop offset="100%" stopColor={colors.blueLight} />
              </linearGradient>
            </defs>
            <path
              d={ROAD}
              fill="none"
              stroke="url(#road)"
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={ROAD_LEN}
              strokeDashoffset={ROAD_LEN * (1 - road)}
            />
            {Array.from({ length: 14 }).map((_, i) => {
              const t =
                ((frame - cThousands - 20) * 2.6 + i * (ROAD_LEN / 14)) %
                ROAD_LEN;
              if (frame < cThousands + 20 || t < 0) return null;
              const pt = getPointAtLength(ROAD, t);
              if (!pt) return null;
              const onTurn = t > ROAD_LEN * 0.45;
              return (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={onTurn ? 13 : 10}
                  fill={onTurn ? colors.white : colors.greyLight}
                />
              );
            })}
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 840,
            display: "flex",
            gap: 30,
          }}
        >
          <Chip label="Projets concrets" delay={cProjects} active />
          <Chip label="Aux côtés de pros du secteur" delay={cPros} active />
        </div>
      </AbsoluteFill>

      {/* Phase B — alternance */}
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 140,
          paddingBottom: 120,
          opacity: phaseB,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 64,
              color: colors.white,
            }}
          >
            L'alternance
          </div>
          <div
            style={{
              position: "relative",
              width: 680,
              height: 150,
              borderRadius: radii.pill,
              backgroundColor: colors.inkSoft,
              border: `2px solid ${colors.inkLine}`,
              display: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                width: 330,
                height: 130,
                borderRadius: radii.pill,
                backgroundColor: colors.blue,
                translate: `${toggle ? 0 : 330}px 0px`,
              }}
            />
            {[
              {
                label: "École",
                icon: <CapIcon size={52} color={colors.white} />,
              },
              {
                label: "Entreprise",
                icon: <BriefcaseIcon size={52} color={colors.white} />,
              },
            ].map((o) => (
              <div
                key={o.label}
                style={{
                  flex: 1,
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  fontFamily: textFont,
                  fontWeight: 700,
                  fontSize: 38,
                  color: colors.white,
                }}
              >
                {o.icon}
                {o.label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <CheckRow
            label="Payé·e pendant ta formation"
            appearAt={cPaid}
            checkAt={cPaid + 14}
            fontSize={50}
          />
          <CheckRow
            label="Études financées"
            appearAt={cFunded}
            checkAt={cFunded + 12}
            fontSize={50}
          />
          <CheckRow
            label="Une vraie expérience sur le CV"
            appearAt={cCV}
            checkAt={cCV + 12}
            fontSize={50}
          />
        </div>
      </AbsoluteFill>

      {/* Phase C — the Sunday weight floats away */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 140,
          opacity: phaseC,
        }}
      >
        <div
          style={{
            width: 300,
            height: 170,
            borderRadius: 26,
            border: `3px solid ${colors.blue}`,
            backgroundColor: `${colors.blue}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: displayFont,
            fontWeight: 900,
            fontSize: 48,
            color: colors.white,
            translate: `0px ${-lift * 260}px`,
            opacity: 1 - lift,
            scale: String(1 + lift * 0.4),
            filter: `blur(${lift * 12}px)`,
          }}
        >
          LUNDI
        </div>
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const r = lift * (180 + (i % 3) * 60);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "45%",
                width: 12,
                height: 12,
                borderRadius: 12,
                backgroundColor: colors.blue,
                translate: `${Math.cos(a) * r}px ${Math.sin(a) * r - lift * 240}px`,
                opacity: lift > 0 ? 1 - lift : 0,
              }}
            />
          );
        })}
        <div
          style={{
            marginTop: 40,
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 90,
            color: colors.white,
            opacity: progress(frame, cWeight + 40, 16),
            translate: `0px ${(1 - pop(frame, fps, cWeight + 40)) * 30}px`,
          }}
        >
          …qui <span style={{ color: colors.blue }}>disparaît.</span>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
