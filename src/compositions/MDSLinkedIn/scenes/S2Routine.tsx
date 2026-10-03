import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../SceneShell";
import { Chip, DayCard, CheckRow } from "../parts";
import { getScene } from "../timeline";
import { colors } from "../../../brand/theme";
import { displayFont } from "../../../brand/fonts";
import { AnimatedText } from "../../../components/AnimatedText";
import { MoonIcon } from "../../../components/Icons";
import { fadeInOut, mapRange, pop, progress } from "../../../lib/animation";

const DAYS = ["LUN", "MAR", "MER", "JEU", "VEN"];

/** Scene 2 — autopilot: identical days, ticked boxes, the Sunday-night weight. */
export const S2Routine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cues } = getScene("s2");
  const [cCommute, cSame, cBlur, cFine, cAdult, , cBoxes, cSunday, cNoWarning] =
    cues;

  const conveyor = fadeInOut(frame, cSame, cFine + 4, 12);
  const merge = progress(frame, cBlur, 40);
  const adult = fadeInOut(frame, cFine, cBoxes, 10);
  const boxes = fadeInOut(frame, cBoxes, cSunday, 10);
  const sunday = progress(frame, cSunday, 20);
  const weightDrop = pop(frame, fps, cNoWarning - 6, 9, 180);

  return (
    <SceneShell id="s2" glow={0.15} desaturate={0.85}>
      {/* Commute chips */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 40,
          paddingBottom: 140,
          opacity: fadeInOut(frame, cCommute, cSame + 6, 10),
        }}
      >
        <Chip label="Métro" delay={cCommute} fontSize={56} />
        <Chip label="Bureau" delay={cCommute + 22} fontSize={56} />
        <Chip label="ou amphi" delay={cCommute + 48} fontSize={56} />
      </AbsoluteFill>

      {/* Identical days that merge */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 140,
          opacity: conveyor,
        }}
      >
        <div style={{ position: "relative", width: 1500, height: 300 }}>
          {DAYS.map((d, i) => {
            const spread = (i - 2) * 290;
            const drift = Math.sin((frame - cSame) * 0.05 + i) * 6;
            return (
              <DayCard
                key={d}
                day={d}
                style={{
                  position: "absolute",
                  left: 635 + spread * (1 - merge) + drift,
                  top: 0,
                  opacity:
                    mapRange(pop(frame, fps, cSame + i * 5), [0, 0.5], [0, 1]) *
                    (1 - merge * 0.55),
                  rotate: `${(i - 2) * 3 * merge}deg`,
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>

      {/* "La vie d'adulte" */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 140,
          opacity: adult,
        }}
      >
        <AnimatedText
          text="Rien de grave."
          start={cFine}
          fontSize={110}
          color={colors.greyLight}
        />
        <AnimatedText
          text="C'est juste… la vie d'adulte."
          start={cAdult}
          fontSize={110}
          color={colors.white}
          style={{ marginTop: 10 }}
        />
      </AbsoluteFill>

      {/* Ticked boxes */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 140,
          opacity: boxes,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <CheckRow
            label="Se lever"
            appearAt={cBoxes}
            checkAt={cBoxes + 8}
            color={colors.greyLight}
          />
          <CheckRow
            label="Valider la journée"
            appearAt={cBoxes + 6}
            checkAt={cBoxes + 18}
            color={colors.greyLight}
          />
          <CheckRow
            label="Recommencer"
            appearAt={cBoxes + 12}
            checkAt={cBoxes + 28}
            color={colors.greyLight}
          />
          <CheckRow
            label="Attendre le vendredi"
            appearAt={cBoxes + 30}
            checkAt={cBoxes + 50}
          />
        </div>
      </AbsoluteFill>

      {/* Sunday night */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 140,
          opacity: sunday,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <MoonIcon size={110} color={colors.greyLight} />
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 96,
              color: colors.white,
            }}
          >
            Dimanche, 21h47
          </div>
        </div>
        <div
          style={{
            position: "relative",
            width: 900,
            height: 330,
            marginTop: 30,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 330,
              top: mapRange(weightDrop, [0, 1], [-420, 120]),
              width: 300,
              height: 170,
              borderRadius: 26,
              backgroundColor: colors.inkLine,
              border: `3px solid ${colors.grey}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: displayFont,
              fontWeight: 900,
              fontSize: 48,
              color: colors.greyLight,
              opacity: weightDrop > 0.01 ? 1 : 0,
            }}
          >
            LUNDI
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 292,
              height: 6,
              borderRadius: 6,
              backgroundColor: colors.grey,
            }}
          />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
