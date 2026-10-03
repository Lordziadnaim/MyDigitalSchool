import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { colors } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { BigWord, ease, slam, useTime } from "../fx";
import { Stage, type Tone } from "./Stage";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Outlined word repeated in a moving band — kinetic texture behind punches. */
const OutlineMarquee: React.FC<{
  readonly text: string;
  readonly y: number;
  readonly speed: number;
  readonly color: string;
}> = ({ text, y, speed, color }) => {
  const t = useTime();
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        whiteSpace: "nowrap",
        translate: `${-((t * speed) % 1400)}px 0px`,
        fontFamily: displayFont,
        fontWeight: 800,
        fontSize: 200,
        textTransform: "uppercase",
        color: "transparent",
        WebkitTextStroke: `3px ${color}`,
        opacity: 0.35,
      }}
    >
      {`${text} · `.repeat(8)}
    </div>
  );
};

const Punch: React.FC<{
  readonly tone: Tone;
  readonly kicker?: string;
  readonly kickerAt?: number;
  readonly words: { text: string; at: number; color?: string; size?: number }[];
  readonly marquee: string;
  readonly ink?: string;
}> = ({ tone, kicker, kickerAt = 0, words, marquee, ink = colors.white }) => (
  <Stage tone={tone}>
    <OutlineMarquee text={marquee} y={40} speed={420} color={ink} />
    <OutlineMarquee text={marquee} y={820} speed={-380} color={ink} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {kicker ? (
        <BigWord
          text={kicker}
          at={kickerAt}
          size={110}
          color={ink}
          style={{ marginBottom: 10 }}
        />
      ) : null}
      {words.map((w) => (
        <BigWord
          key={w.text}
          text={w.text}
          at={w.at}
          size={w.size ?? 230}
          color={w.color ?? ink}
        />
      ))}
    </AbsoluteFill>
  </Stage>
);

/** 19.70–28.50 — the drop: habits become job titles, one hit per beat. */
export const DropScene: React.FC = () => {
  const t = useTime();
  if (t < 21.6)
    return (
      <Punch
        tone="blue"
        kicker="Ça ? c'est du"
        kickerAt={19.75}
        words={[{ text: "montage.", at: 20.7, size: 300, color: colors.white }]}
        marquee="motion design"
        ink={colors.ink}
      />
    );
  if (t < 22.8)
    return (
      <Punch
        tone="pink"
        kicker="du"
        kickerAt={21.65}
        words={[{ text: "design.", at: 21.8, size: 320 }]}
        marquee="ui · ux · da"
      />
    );
  if (t < 24.6)
    return (
      <Punch
        tone="purple"
        kicker="du"
        kickerAt={22.85}
        words={[
          { text: "community", at: 22.95, size: 220 },
          { text: "management.", at: 23.4, size: 220, color: colors.blue },
        ]}
        marquee="social media"
      />
    );
  if (t < 25.95)
    return (
      <Punch
        tone="light"
        kicker="du"
        kickerAt={24.65}
        words={[
          { text: "développement.", at: 24.8, size: 190, color: colors.purple },
        ]}
        marquee="front · back · full stack"
        ink={colors.greyDark}
      />
    );
  const jobs = [
    "Motion designer",
    "UI designer",
    "Community manager",
    "Développeur·se web",
    "UX designer",
    "Social media manager",
    "Data analyst",
    "Directeur·rice artistique",
  ];
  return (
    <Stage tone="night">
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          style={{
            position: "absolute",
            top: 120 + row * 300,
            left: 0,
            display: "flex",
            gap: 30,
            whiteSpace: "nowrap",
            translate: `${(row % 2 ? 1 : -1) * ((t - 25.95) * 220) - 600}px 0px`,
            opacity: 0.16,
          }}
        >
          {[...jobs, ...jobs].map((j, i) => (
            <div
              key={i}
              style={{
                padding: "20px 40px",
                borderRadius: 999,
                border: `3px solid ${colors.blue}`,
                fontFamily: textFont,
                fontWeight: 700,
                fontSize: 44,
                color: colors.white,
              }}
            >
              {j}
            </div>
          ))}
        </div>
      ))}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <BigWord text="Des vrais" at={26.0} size={190} />
        <BigWord text="métiers." at={26.35} size={250} />
        <div
          style={{
            marginTop: 30,
            padding: "14px 44px",
            backgroundColor: colors.blue,
            color: colors.ink,
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 96,
            textTransform: "uppercase",
            opacity: t >= 27.39 ? 1 : 0,
            scale: String(interpolate(slam(t, 27.39, 0.3), [0, 1], [1.8, 1])),
          }}
        >
          Qui recrutent
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

const Bubble: React.FC<{
  readonly text: string;
  readonly at: number;
  readonly right?: boolean;
}> = ({ text, at, right }) => {
  const t = useTime();
  const p = slam(t, at, 0.35);
  return (
    <div
      style={{
        alignSelf: right ? "flex-end" : "flex-start",
        maxWidth: 820,
        padding: "26px 40px",
        borderRadius: 40,
        borderBottomLeftRadius: right ? 40 : 8,
        borderBottomRightRadius: right ? 8 : 40,
        backgroundColor: right ? "#5A5A5A" : "#ECECEC",
        color: right ? colors.white : "#222",
        fontFamily: textFont,
        fontWeight: 600,
        fontSize: 46,
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        scale: String(interpolate(p, [0, 1], [0.6, 1])),
        transformOrigin: right ? "right bottom" : "left bottom",
      }}
    >
      {text}
    </div>
  );
};

/** 28.50–35.15 — the limiting belief, in grey. */
export const BeliefScene: React.FC = () => {
  const t = useTime();
  const push = 1 + ease(t, 28.5, 6.6) * 0.1;
  const showForm = t >= 31.1;
  return (
    <Stage tone="grey">
      <AbsoluteFill style={{ scale: String(push) }}>
        {!showForm ? (
          <AbsoluteFill
            style={{
              padding: "140px 360px",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <Bubble text="Arrête de perdre ton temps sur ton tel." at={28.8} />
            <Bubble text="Trouve-toi un vrai métier." at={29.7} />
            <Bubble text="…" at={30.4} right />
          </AbsoluteFill>
        ) : (
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 140,
            }}
          >
            <div
              style={{
                width: 1000,
                padding: "50px 60px",
                borderRadius: 30,
                backgroundColor: "#F4F4F4",
                color: "#222",
                fontFamily: textFont,
                rotate: "-2deg",
                translate: `0px ${(1 - slam(t, 31.15, 0.45)) * 600}px`,
                boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  fontFamily: displayFont,
                  fontWeight: 800,
                  fontSize: 56,
                }}
              >
                FICHE D'ORIENTATION
              </div>
              <div style={{ marginTop: 26, fontSize: 34, color: "#777" }}>
                Âge
              </div>
              <div
                style={{
                  fontSize: 60,
                  fontWeight: 800,
                  color: t >= 32.0 ? colors.pink : "#222",
                }}
              >
                17 ans
              </div>
              <div style={{ marginTop: 22, fontSize: 34, color: "#777" }}>
                Ton métier pour toute ta vie
              </div>
              <div
                style={{
                  marginTop: 10,
                  height: 80,
                  borderRadius: 14,
                  border: `4px solid ${t >= 33.65 ? colors.pink : "#BBB"}`,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 24,
                  fontSize: 50,
                }}
              >
                <span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0 }}>
                  |
                </span>
              </div>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </Stage>
  );
};

/** 35.15–36.25 — "Faux." The form shatters. */
export const FauxScene: React.FC = () => {
  const t = useTime();
  const p = ease(t, 35.15, 0.9);
  return (
    <Stage tone="night">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i / 9) * Math.PI * 2 + 0.4;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 260,
                height: 180,
                backgroundColor: "#F4F4F4",
                clipPath: `polygon(${10 + ((i * 13) % 40)}% 0, 100% ${(i * 17) % 50}%, ${60 + ((i * 7) % 40)}% 100%, 0 ${40 + ((i * 11) % 60)}%)`,
                translate: `${Math.cos(a) * 900 * p}px ${Math.sin(a) * 600 * p}px`,
                rotate: `${(i % 2 ? 1 : -1) * 240 * p}deg`,
                opacity: 1 - p * 0.8,
              }}
            />
          );
        })}
        <BigWord
          text="Faux."
          at={35.18}
          size={460}
          color={colors.pink}
          style={{ textShadow: `0 0 120px ${colors.pink}` }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
