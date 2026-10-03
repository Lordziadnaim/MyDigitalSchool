import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../SceneShell";
import { getScene } from "../timeline";
import { colors, radii } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { AnimatedText } from "../../../components/AnimatedText";
import { mapRange, pop, progress } from "../../../lib/animation";

const WEEKS = 52;
const YEARS = 10;

/** Scene 5 — the limiting belief, then the flip: 10 years = 520 Fridays. */
export const S5Croyance: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cues } = getScene("s5");
  const [cWhy, cTaught, cForm, cLate, cLuxury, cInverse, cRisk] = cues;

  const formIn = pop(frame, fps, cTaught - 4, 16);
  const flip = progress(frame, cInverse - 4, 22);
  const part1 = 1 - flip;
  const gridFill = progress(frame, cRisk + 10, 150, (t) => t);
  const filled = Math.floor(gridFill * WEEKS * YEARS);

  return (
    <SceneShell id="s5" glow={0.35 + flip * 0.4}>
      {/* Part 1: the belief */}
      <AbsoluteFill style={{ opacity: part1, rotate: `x ${flip * 90}deg` }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
          <AnimatedText
            text="Pourquoi personne ne te l'a dit ?"
            start={cWhy}
            fontSize={84}
            highlight={["dit"]}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 120,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 860,
              padding: "44px 56px",
              borderRadius: radii.lg,
              backgroundColor: colors.white,
              color: colors.ink,
              fontFamily: textFont,
              opacity: mapRange(formIn, [0, 0.4], [0, 1]),
              translate: `0px ${(1 - formIn) * 120}px`,
              rotate: `${-2 * formIn}deg`,
              boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
            }}
          >
            <div
              style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 44 }}
            >
              Fiche d'orientation
            </div>
            <div style={{ marginTop: 26, fontSize: 34, color: colors.inkLine }}>
              Âge
            </div>
            <div style={{ fontSize: 44, fontWeight: 700 }}>17 ans</div>
            <div style={{ marginTop: 22, fontSize: 34, color: colors.inkLine }}>
              Ton métier pour la vie
            </div>
            <div
              style={{
                marginTop: 8,
                height: 64,
                borderRadius: 14,
                border: `3px solid ${frame >= cForm && frame < cLate ? colors.blue : colors.greyLight}`,
                display: "flex",
                alignItems: "center",
                paddingLeft: 20,
                fontSize: 40,
              }}
            >
              <span style={{ opacity: Math.floor(frame / 12) % 2 ? 1 : 0 }}>
                |
              </span>
            </div>
            {/* Stamp */}
            <div
              style={{
                position: "absolute",
                right: -70,
                bottom: 40,
                padding: "14px 30px",
                border: `6px solid ${colors.blueDeep}`,
                borderRadius: 16,
                color: colors.blueDeep,
                fontFamily: displayFont,
                fontWeight: 900,
                fontSize: 54,
                rotate: "12deg",
                opacity: progress(frame, cLate, 4),
                scale: String(
                  mapRange(pop(frame, fps, cLate, 10, 200), [0, 1], [2.2, 1]),
                ),
              }}
            >
              TROP TARD ?
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 30,
              marginTop: 50,
              opacity: progress(frame, cLuxury, 10),
            }}
          >
            {["un luxe", "un risque"].map((w, i) => (
              <div
                key={w}
                style={{
                  padding: "14px 34px",
                  borderRadius: radii.pill,
                  border: `2px solid ${colors.grey}`,
                  color: colors.greyLight,
                  fontFamily: textFont,
                  fontWeight: 600,
                  fontSize: 40,
                  scale: String(pop(frame, fps, cLuxury + i * 30)),
                }}
              >
                Changer de voie = {w}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Part 2: the inversion */}
      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: 90, opacity: flip }}
      >
        <AnimatedText
          text="Et si c'était l'inverse ?"
          start={cInverse}
          fontSize={100}
          highlight={["l'inverse"]}
        />
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 70,
            opacity: progress(frame, cRisk, 12),
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${WEEKS}, 14px)`,
              gap: 5,
            }}
          >
            {Array.from({ length: WEEKS * YEARS }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  backgroundColor: i < filled ? colors.grey : colors.inkLine,
                }}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 24,
            marginTop: 34,
            opacity: progress(frame, cRisk + 20, 14),
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 900,
              fontSize: 96,
              color: colors.white,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {filled}
          </div>
          <div
            style={{
              fontFamily: textFont,
              fontWeight: 600,
              fontSize: 44,
              color: colors.greyLight,
            }}
          >
            vendredis attendus en 10 ans.
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
