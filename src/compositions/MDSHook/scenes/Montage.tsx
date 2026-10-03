import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { colors } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { BEAT } from "../edit";
import { ease, slam, useTime } from "../fx";
import { Stage } from "./Stage";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Title: React.FC<{
  readonly text: string;
  readonly at: number;
  readonly accent?: string;
}> = ({ text, at, accent = colors.blue }) => {
  const t = useTime();
  const p = ease(t, at, 0.3);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 90,
        fontFamily: displayFont,
        fontWeight: 800,
        fontSize: 84,
        color: colors.white,
        opacity: p,
        translate: `${(1 - p) * -60}px 0px`,
      }}
    >
      <span
        style={{
          backgroundColor: accent,
          color: colors.ink,
          padding: "0 18px",
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** 6.30–8.75 — video editing timeline snapping on the beat. */
export const MontageScene: React.FC = () => {
  const t = useTime();
  const local = t - 6.3;
  const beatPulse = 1 - (t % BEAT) / BEAT;
  const clips = [
    { w: 260, c: colors.blue },
    { w: 180, c: colors.pink },
    { w: 320, c: colors.purpleLight },
    { w: 220, c: "#F2B84B" },
    { w: 280, c: colors.blue },
  ];
  let x = 0;
  return (
    <Stage tone="night">
      <Title text="pile sur le beat" at={6.45} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 120px" }}>
        <div
          style={{
            position: "relative",
            height: 520,
            borderRadius: 30,
            backgroundColor: "#1B1222",
            border: "2px solid #3a2b45",
            padding: 40,
          }}
        >
          {/* waveform */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 120,
            }}
          >
            {Array.from({ length: 96 }).map((_, i) => {
              const onBeat = i % 8 === 0;
              const h =
                (onBeat ? 100 : 30 + 40 * Math.abs(Math.sin(i * 1.7))) *
                (onBeat ? 0.6 + 0.4 * beatPulse : 1);
              return (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: h,
                    borderRadius: 6,
                    backgroundColor: onBeat ? colors.blue : "#4a3a55",
                  }}
                />
              );
            })}
          </div>
          {/* beat markers */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 40 + i * 136,
                top: 30,
                bottom: 30,
                width: 3,
                backgroundColor: `rgba(45,184,197,${0.25 + 0.5 * beatPulse})`,
              }}
            />
          ))}
          {/* clips snapping */}
          <div style={{ position: "relative", height: 150, marginTop: 60 }}>
            {clips.map((c, i) => {
              const p = slam(t, 6.45 + i * 0.28, 0.3);
              const left = x;
              x += c.w + 12;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: left + (1 - p) * 400,
                    top: 0,
                    width: c.w,
                    height: 150,
                    borderRadius: 18,
                    backgroundColor: c.c,
                    opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
                    boxShadow:
                      p > 0.95 && p < 1.05 ? `0 0 30px ${c.c}` : undefined,
                  }}
                />
              );
            })}
          </div>
          {/* playhead */}
          <div
            style={{
              position: "absolute",
              top: 10,
              bottom: 10,
              left: 40 + local * 640,
              width: 6,
              backgroundColor: colors.white,
              boxShadow: "0 0 20px white",
            }}
          />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

const FONTS: React.CSSProperties[] = [
  { fontFamily: displayFont, fontWeight: 800 },
  { fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700 },
  { fontFamily: "monospace", fontWeight: 700, letterSpacing: "-0.04em" },
];

/** 8.75–11.25 — a story where the font changes three times. */
export const FontScene: React.FC = () => {
  const t = useTime();
  const idx = t < 9.45 ? 0 : t < 10.1 ? 1 : 2;
  const bump = slam(t, [8.85, 9.45, 10.1][idx], 0.25);
  return (
    <Stage tone="pink" stripes>
      <Title text="3 polices pour 1 story" at={8.9} accent={colors.white} />
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 120,
          paddingTop: 80,
        }}
      >
        <div
          style={{
            width: 400,
            height: 711,
            borderRadius: 40,
            background: `linear-gradient(160deg, ${colors.purple}, ${colors.blue})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
            border: "8px solid white",
          }}
        >
          <div
            style={{
              ...FONTS[idx],
              fontSize: 76,
              color: "white",
              textAlign: "center",
              lineHeight: 1,
              scale: String(0.7 + 0.3 * bump),
            }}
          >
            JOYEUX
            <br />
            ANNIV
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {["Bricolage", "Serif italique", "Mono"].map((name, i) => (
            <div
              key={name}
              style={{
                padding: "18px 36px",
                borderRadius: 999,
                backgroundColor:
                  i === idx ? colors.white : "rgba(255,255,255,0.15)",
                color: i === idx ? colors.pink : colors.white,
                fontFamily: textFont,
                fontWeight: 800,
                fontSize: 44,
                scale: i === idx ? "1.08" : "1",
              }}
            >
              {i === idx ? "✓ " : ""}
              {name}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** 11.25–15.60 — one post explodes, the other flops. */
export const PostsScene: React.FC = () => {
  const t = useTime();
  const up = ease(t, 11.5, 1.6);
  const down = ease(t, 13.5, 1.2);
  const likesA = Math.round(12400 * up);
  const likesB = Math.max(3, Math.round(84 * (1 - down)));
  const card = (good: boolean) => {
    const p = slam(t, good ? 11.35 : 13.4, 0.35);
    const w = 300;
    const h = 150;
    const path = good
      ? `M0 ${h} C ${w * 0.4} ${h} ${w * 0.55} ${h * 0.5} ${w} 0`
      : `M0 ${h * 0.3} C ${w * 0.4} ${h * 0.25} ${w * 0.6} ${h * 0.8} ${w} ${h}`;
    const draw = good ? up : down;
    return (
      <div
        style={{
          width: 640,
          padding: 40,
          borderRadius: 36,
          backgroundColor: colors.white,
          color: colors.ink,
          opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
          scale: String(interpolate(p, [0, 1], [0.6, 1])),
          boxShadow: "0 40px 90px rgba(0,0,0,0.35)",
          position: "relative",
        }}
      >
        <div
          style={{
            height: 250,
            borderRadius: 20,
            background: good
              ? `linear-gradient(135deg, ${colors.blue}, ${colors.purple})`
              : "#D9D6DC",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 72,
              color: good ? colors.pink : "#8C8A8F",
            }}
          >
            ♥ {(good ? likesA : likesB).toLocaleString("fr-FR")}
          </div>
          <svg width={w} height={h} style={{ overflow: "visible" }}>
            <path
              d={path}
              fill="none"
              stroke={good ? colors.blue : "#8C8A8F"}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={500}
              strokeDashoffset={500 * (1 - draw)}
            />
          </svg>
        </div>
        {!good ? (
          <div
            style={{
              position: "absolute",
              right: -30,
              top: 40,
              padding: "10px 30px",
              border: `8px solid ${colors.pink}`,
              color: colors.pink,
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 90,
              rotate: "-12deg",
              opacity: t >= 14.9 ? 1 : 0,
              scale: String(interpolate(slam(t, 14.9, 0.25), [0, 1], [2.5, 1])),
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          >
            FLOP
          </div>
        ) : null}
      </div>
    );
  };
  return (
    <Stage tone="purple">
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          paddingBottom: 90,
        }}
      >
        {card(true)}
        {card(false)}
      </AbsoluteFill>
    </Stage>
  );
};

const CODE = [
  ["<", "button", ' class="cta"', ">"],
  ["  Juste pour voir", "", "", ""],
  ["</", "button", "", ">"],
  [".cta", " {", "", ""],
  ["  background:", " #2DB8C5;", "", ""],
  ["}", "", "", ""],
];

/** 15.60–18.60 — opening the code of a website, "juste pour voir". */
export const CodeScene: React.FC = () => {
  const t = useTime();
  const chars = Math.floor((t - 15.7) * 45);
  let left = chars;
  const built = ease(t, 17.2, 0.4);
  return (
    <Stage tone="night">
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
          paddingBottom: 100,
        }}
      >
        <div
          style={{
            width: 860,
            height: 560,
            borderRadius: 26,
            backgroundColor: "#15101A",
            border: "2px solid #3a2b45",
            padding: "70px 50px",
            position: "relative",
            fontFamily: "monospace",
            fontSize: 40,
            lineHeight: 1.5,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 22,
              left: 26,
              display: "flex",
              gap: 12,
            }}
          >
            {[colors.pink, "#F2B84B", colors.blue].map((c) => (
              <div
                key={c}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 18,
                  backgroundColor: c,
                }}
              />
            ))}
          </div>
          {CODE.map((parts, i) => {
            const line = parts.join("");
            const shown = line.slice(0, Math.max(0, left));
            left -= line.length;
            let cursor = 0;
            return (
              <div key={i} style={{ whiteSpace: "pre", minHeight: 60 }}>
                {parts.map((p, j) => {
                  const seg = shown.slice(cursor, cursor + p.length);
                  cursor += p.length;
                  const col =
                    j === 1 ? colors.pink : j === 2 ? colors.blue : "#E8E3EC";
                  return (
                    <span key={j} style={{ color: col }}>
                      {seg}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div
          style={{
            width: 560,
            height: 560,
            borderRadius: 26,
            backgroundColor: colors.white,
            padding: 30,
            position: "relative",
          }}
        >
          <div
            style={{
              height: 40,
              borderRadius: 12,
              backgroundColor: "#EEE",
              fontFamily: textFont,
              fontSize: 22,
              color: "#888",
              paddingLeft: 16,
              display: "flex",
              alignItems: "center",
            }}
          >
            monsite.fr
          </div>
          <div
            style={{
              marginTop: 40,
              height: 26,
              width: "70%",
              borderRadius: 8,
              backgroundColor: "#DDD",
            }}
          />
          <div
            style={{
              marginTop: 16,
              height: 18,
              width: "90%",
              borderRadius: 8,
              backgroundColor: "#EEE",
            }}
          />
          <div
            style={{
              marginTop: 60,
              display: "inline-block",
              padding: "26px 44px",
              borderRadius: 999,
              backgroundColor: built > 0 ? colors.blue : "#DDD",
              color: colors.white,
              fontFamily: textFont,
              fontWeight: 800,
              fontSize: 40,
              scale: String(0.8 + 0.2 * built),
            }}
          >
            Juste pour voir
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** 18.60–19.70 — riser: everything rushes into the centre. */
export const RiserScene: React.FC = () => {
  const t = useTime();
  const p = ease(t, 18.6, 1.1);
  return (
    <Stage tone="night">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const s = ((p * 2 + i / 10) % 1) * 3;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 600 * s,
                height: 600 * s,
                borderRadius: "50%",
                border: `6px solid ${i % 2 ? colors.blue : colors.pink}`,
                opacity: (1 - s / 3) * 0.8,
              }}
            />
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
