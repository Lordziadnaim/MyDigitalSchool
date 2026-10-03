import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { colors } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { BriefcaseIcon, CapIcon } from "../../../components/Icons";
import { CAMPUSES, project } from "../../MDSLinkedIn/campuses";
import { BEAT } from "../edit";
import { BigWord, ease, slam, useTime } from "../fx";
import { Stage } from "./Stage";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 36.25–39.95 — "Ton talent existe déjà. Il lui manque juste un métier." */
export const TalentScene: React.FC = () => {
  const t = useTime();
  const second = t >= 38.3;
  return (
    <Stage tone="purple" stripes>
      <AbsoluteFill
        style={{
          background: `conic-gradient(from ${t * 20}deg at 50% 50%, transparent 0deg, rgba(45,184,197,0.18) 20deg, transparent 40deg, transparent 120deg, rgba(231,29,115,0.14) 140deg, transparent 160deg)`,
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {!second ? (
          <>
            <BigWord text="Ton talent" at={36.3} size={210} />
            <BigWord
              text="existe déjà."
              at={36.85}
              size={210}
              color={colors.blue}
            />
          </>
        ) : (
          <>
            <BigWord text="Il lui manque juste" at={38.33} size={130} />
            <BigWord
              text="un métier."
              at={39.0}
              size={280}
              color={colors.blue}
            />
          </>
        )}
      </AbsoluteFill>
    </Stage>
  );
};

/** 39.95–42.95 — alternance: school ⇄ company, and you get paid. */
export const AlternanceScene: React.FC = () => {
  const t = useTime();
  const beat = Math.floor((t - 40) / BEAT);
  const split = interpolate(
    Math.sin((t - 40) * Math.PI * 2),
    [-1, 1],
    [42, 58],
  );
  const paid = t >= 41.9;
  return (
    <Stage tone="night">
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${split}%`,
          backgroundColor: colors.purple,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <CapIcon
          size={170}
          color={colors.white}
          style={{ scale: beat % 2 === 0 ? "1.1" : "1" }}
        />
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 110,
            color: colors.white,
          }}
        >
          ÉCOLE
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: `${100 - split}%`,
          backgroundColor: colors.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <BriefcaseIcon
          size={170}
          color={colors.ink}
          style={{ scale: beat % 2 === 1 ? "1.1" : "1" }}
        />
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 110,
            color: colors.ink,
          }}
        >
          ENTREPRISE
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 70,
          left: "50%",
          translate: "-50% 0px",
          padding: "10px 30px",
          backgroundColor: colors.pink,
          color: colors.white,
          fontFamily: textFont,
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          opacity: ease(t, 40.0, 0.2),
        }}
      >
        En alternance
      </div>
      {paid ? (
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              padding: "30px 70px",
              borderRadius: 30,
              backgroundColor: colors.white,
              color: colors.pink,
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 140,
              rotate: "-4deg",
              boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
              scale: String(interpolate(slam(t, 41.93, 0.3), [0, 1], [2.2, 1])),
            }}
          >
            + T'ES PAYÉ
          </div>
        </AbsoluteFill>
      ) : null}
    </Stage>
  );
};

const MAP_W = 640;
const MAP_H = 620;

/** 42.95–47.60 — 17 campus, 20 formations, du BTS au MBA. */
export const StatsScene: React.FC = () => {
  const t = useTime();
  const phase2 = t >= 44.5;
  const steps = [
    { label: "BTS", sub: "Bac+2", at: 45.7 },
    { label: "Bachelor", sub: "Bac+3", at: 46.1 },
    { label: "MBA", sub: "Bac+5", at: 46.5 },
  ];
  return (
    <Stage tone="purple">
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 180,
          width: MAP_W,
          height: MAP_H,
        }}
      >
        {CAMPUSES.map((c, i) => {
          const { x, y } = project(c.lat, c.lon, MAP_W, MAP_H);
          const p = slam(t, 43.05 + i * 0.035, 0.3);
          return (
            <div
              key={c.name}
              style={{
                position: "absolute",
                left: x - 15,
                top: y - 15,
                width: 30,
                height: 30,
                borderRadius: 30,
                backgroundColor: colors.blue,
                boxShadow: `0 0 34px ${colors.blue}`,
                scale: String(Math.max(0, p)),
              }}
            />
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 900, top: 200, width: 900 }}>
        {!phase2 ? (
          <>
            <BigWord
              text="17"
              at={43.0}
              size={360}
              color={colors.blue}
              style={{ textAlign: "left" }}
            />
            <BigWord
              text="campus"
              at={43.25}
              size={150}
              style={{ textAlign: "left" }}
            />
            <BigWord
              text="en France"
              at={43.5}
              size={80}
              color={colors.blue}
              style={{ textAlign: "left", marginTop: 10 }}
            />
          </>
        ) : (
          <>
            <BigWord
              text="20"
              at={44.54}
              size={300}
              color={colors.blue}
              style={{ textAlign: "left" }}
            />
            <BigWord
              text="formations"
              at={44.8}
              size={130}
              style={{ textAlign: "left" }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 20,
                marginTop: 40,
              }}
            >
              {steps.map((s, i) => {
                const p = slam(t, s.at, 0.3);
                return (
                  <div
                    key={s.label}
                    style={{
                      width: 240,
                      height: 110 + i * 70,
                      borderRadius: 20,
                      backgroundColor: i === 2 ? colors.pink : colors.white,
                      color: i === 2 ? colors.white : colors.purple,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: 20,
                      opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
                      translate: `0px ${(1 - p) * 120}px`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: displayFont,
                        fontWeight: 800,
                        fontSize: 46,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontFamily: textFont,
                        fontWeight: 700,
                        fontSize: 28,
                      }}
                    >
                      {s.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

/** 47.60–51.00 — +1 800 partner companies that recruit. */
export const PartnersScene: React.FC = () => {
  const t = useTime();
  const n = Math.round(1800 * ease(t, 47.7, 1.3));
  return (
    <Stage tone="blue" stripes>
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 130,
          display: "grid",
          gridTemplateColumns: "repeat(6, 90px)",
          gap: 18,
        }}
      >
        {Array.from({ length: 48 }).map((_, i) => {
          const on = t >= 47.8 + ((i * 37) % 48) * 0.05;
          return (
            <div
              key={i}
              style={{
                width: 90,
                height: 90,
                borderRadius: 18,
                backgroundColor: on ? colors.white : "rgba(255,255,255,0.18)",
                boxShadow: on ? "0 10px 30px rgba(0,0,0,0.2)" : undefined,
              }}
            />
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 130, top: 250 }}>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 300,
            color: colors.ink,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          +{n.toLocaleString("fr-FR")}
        </div>
        <BigWord
          text="entreprises"
          at={48.3}
          size={120}
          color={colors.white}
          style={{ textAlign: "left" }}
        />
        <BigWord
          text="qui recrutent"
          at={49.4}
          size={120}
          color={colors.ink}
          style={{ textAlign: "left" }}
        />
      </div>
    </Stage>
  );
};
