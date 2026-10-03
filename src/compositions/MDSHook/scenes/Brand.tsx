import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { colors, radii } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { Logo } from "../../../components/Logo";
import { BigWord, ease, slam, useTime } from "../fx";
import { Stage } from "./Stage";
import { FeedPhone, Thumb } from "./Phone";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 51.00–55.30 — the official logo slams together. */
export const BrandScene: React.FC = () => {
  const t = useTime();
  const build = interpolate(t, [50.95, 51.75], [0, 1], clamp);
  return (
    <Stage tone="purple">
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, rgba(45,184,197,${0.35 * (1 - ease(t, 51, 1.2))}) 0%, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 50 }}
      >
        <Logo
          width={980}
          progress={build}
          variant="white"
          style={{ scale: String(1 + (t - 51) * 0.012) }}
        />
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 70,
            color: colors.white,
            opacity: ease(t, 53.0, 0.3),
            translate: `0px ${(1 - ease(t, 53.0, 0.3)) * 30}px`,
          }}
        >
          L'école des métiers du{" "}
          <span style={{ color: colors.blue }}>digital</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** 55.30–62.00 — callback to the hook, then the end card. */
export const CtaScene: React.FC = () => {
  const t = useTime();
  const end = t >= 59.3;
  if (!end) {
    const scrolling = t < 57.6;
    const press = slam(t, 58.75, 0.25);
    return (
      <Stage tone="night">
        <AbsoluteFill
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 140,
          }}
        >
          <div style={{ position: "relative" }}>
            <FeedPhone
              scroll={scrolling ? (t - 55.3) * 900 : (57.6 - 55.3) * 900}
              width={400}
              blur={scrolling ? 4 : 0}
            />
            <Thumb
              size={140}
              style={{
                position: "absolute",
                left: 140,
                top: 520 + Math.sin(t * 8) * (scrolling ? 40 : 4),
                rotate: "-10deg",
              }}
            />
          </div>
          <div style={{ width: 900 }}>
            <BigWord
              text="Alors…"
              at={55.4}
              size={110}
              color={colors.greyLight}
              style={{ textAlign: "left" }}
            />
            <BigWord
              text="tu continues"
              at={56.37}
              size={130}
              style={{ textAlign: "left" }}
            />
            <BigWord
              text="de scroller ?"
              at={56.8}
              size={130}
              style={{ textAlign: "left" }}
            />
            <BigWord
              text="Ou tu commences ?"
              at={58.15}
              size={100}
              color={colors.blue}
              style={{ textAlign: "left", marginTop: 20 }}
            />
            <div
              style={{
                marginTop: 40,
                display: "inline-block",
                padding: "26px 60px",
                borderRadius: radii.pill,
                backgroundColor: colors.pink,
                color: colors.white,
                fontFamily: textFont,
                fontWeight: 800,
                fontSize: 50,
                opacity: ease(t, 58.2, 0.2),
                scale: String(
                  t >= 58.75 ? interpolate(press, [0, 1], [0.85, 1]) : 1,
                ),
                boxShadow: `0 0 ${40 * press}px ${colors.pink}`,
              }}
            >
              Je commence →
            </div>
          </div>
        </AbsoluteFill>
      </Stage>
    );
  }
  const p = ease(t, 59.3, 0.5);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.blueLight} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 44 }}
      >
        <Logo
          width={700}
          progress={interpolate(t, [59.3, 59.9], [0.3, 1], clamp)}
          variant="color"
        />
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 64,
            color: colors.greyDark,
            opacity: p,
          }}
        >
          Ton talent existe déjà.{" "}
          <span style={{ color: colors.purple }}>Donne-lui un métier.</span>
        </div>
        <div
          style={{
            padding: "24px 60px",
            borderRadius: radii.pill,
            backgroundColor: colors.purple,
            color: colors.white,
            fontFamily: textFont,
            fontWeight: 800,
            fontSize: 46,
            opacity: ease(t, 59.6, 0.3),
          }}
        >
          mydigitalschool.com
        </div>
        <div style={{ display: "flex", gap: 20, opacity: ease(t, 59.9, 0.3) }}>
          {["Brochure", "Portes ouvertes", "Candidature"].map((a) => (
            <div
              key={a}
              style={{
                padding: "12px 30px",
                borderRadius: radii.pill,
                border: `3px solid ${colors.purple}`,
                color: colors.purple,
                fontFamily: textFont,
                fontWeight: 800,
                fontSize: 32,
              }}
            >
              {a}
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "8px 18px",
            backgroundColor: colors.pink,
            color: colors.white,
            fontFamily: textFont,
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: ease(t, 60.2, 0.3),
          }}
        >
          Ici, les talents se connectent
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
