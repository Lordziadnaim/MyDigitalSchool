import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { colors } from "../../brand/theme";
import { displayFont, textFont } from "../../brand/fonts";
import { Logo } from "../../components/Logo";
import { BEATS, LINES, TOTAL_SECONDS } from "./edit";
import { easeOut, lin, smooth } from "./time";

/**
 * 2D layers over the 3D shot. Kept deliberately sparse and "film-like":
 * a location card, subtitles, two phone notifications, and the brand only
 * at the very end.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** « Lille, 2 h 17 » — film location card. */
const LocationCard: React.FC<{ readonly t: number }> = ({ t }) => {
  const o = smooth(t, 0.5, 1.3) * (1 - smooth(t, 4.2, 5.0));
  const spacing = interpolate(t, [0.5, 5], [0.32, 0.42], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 118,
        opacity: o,
        color: "rgba(255,255,255,0.92)",
        fontFamily: textFont,
        fontWeight: 500,
        fontSize: 34,
        letterSpacing: `${spacing}em`,
        textTransform: "uppercase",
        textShadow: "0 2px 18px rgba(0,0,0,0.6)",
      }}
    >
      Lille
      <span style={{ color: colors.blue, margin: "0 0.5em" }}>·</span>2 h 17
    </div>
  );
};

/** Film subtitles, one chunk at a time. */
const Subtitles: React.FC<{ readonly t: number }> = ({ t }) => {
  let current: { text: string; o: number } | null = null;
  for (const line of LINES) {
    line.captions.forEach((c, i) => {
      const start = line.at + c.at;
      const next = line.captions[i + 1];
      const end = next ? line.at + next.at - 0.04 : line.at + line.dur + 0.35;
      if (t >= start - 0.05 && t < end) {
        const o =
          lin(t, start - 0.05, start + 0.12) * (1 - lin(t, end - 0.12, end));
        current = { text: c.text, o };
      }
    });
  }
  if (!current) return null;
  const { text, o } = current as { text: string; o: number };
  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        right: 100,
        bottom: 132,
        textAlign: "center",
        opacity: o,
        color: colors.white,
        fontFamily: textFont,
        fontWeight: 600,
        fontSize: 42,
        lineHeight: 1.3,
        textShadow: "0 2px 4px rgba(0,0,0,0.65), 0 0 28px rgba(0,0,0,0.55)",
      }}
    >
      {text}
    </div>
  );
};

/** Two notifications from her friends (n06). */
const MESSAGES = [
  {
    from: "Lucas",
    text: "t'es encore sur tes trucs à 2h ?",
    at: BEATS.phone + 0.05,
  },
  { from: "Sarah", text: "sérieux, tu perds ton temps", at: 23.95 },
];

const Notifications: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < BEATS.phone - 0.1 || t > 27) return null;
  const out = smooth(t, 25.7, 26.5);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        top: 150,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {MESSAGES.map((m) => {
        const p = easeOut(t, m.at, 0.4);
        if (p <= 0) return null;
        return (
          <div
            key={m.from}
            style={{
              opacity: p * (1 - out),
              translate: `0px ${(1 - p) * -26 - out * 18}px`,
              padding: "22px 30px",
              borderRadius: 30,
              backgroundColor: "rgba(28,24,36,0.72)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: colors.white,
              fontFamily: textFont,
              filter: `blur(${out * 4}px)`,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.6 }}>
              {m.from} · maintenant
            </div>
            <div style={{ fontSize: 38, fontWeight: 500, marginTop: 4 }}>
              {m.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** The only branded moment: tagline, logo, campus. */
const EndCard: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < BEATS.tagline - 0.6) return null;
  const veil = smooth(t, BEATS.tagline - 0.6, BEATS.tagline + 0.8);
  const tag = easeOut(t, BEATS.tagline, 1.0);
  const logo = lin(t, BEATS.logo2, BEATS.logo2 + 1.6);
  const kicker = easeOut(t, BEATS.address, 0.6);
  const address = easeOut(t, BEATS.address + 0.4, 0.8);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: veil,
          background: `linear-gradient(to top, ${colors.ink} 0%, rgba(36,16,47,0.88) 42%, rgba(36,16,47,0.35) 68%, rgba(36,16,47,0) 85%)`,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 150,
          gap: 34,
        }}
      >
        <div
          style={{
            opacity: tag,
            translate: `0px ${(1 - tag) * 30}px`,
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 74,
            lineHeight: 1.05,
            color: colors.white,
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          Ici, les talents
          <br />
          <span style={{ color: colors.blue }}>se connectent.</span>
        </div>
        <div style={{ marginTop: 26, opacity: logo > 0 ? 1 : 0 }}>
          <Logo width={600} progress={logo} variant="white" />
        </div>
        <div
          style={{
            opacity: kicker,
            scale: String(0.9 + kicker * 0.1),
            padding: "10px 26px",
            backgroundColor: colors.pink,
            color: colors.white,
            fontFamily: textFont,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Campus de Lille
        </div>
        <div
          style={{
            opacity: address,
            fontFamily: textFont,
            fontWeight: 500,
            fontSize: 32,
            color: "rgba(255,255,255,0.86)",
            textAlign: "center",
          }}
        >
          57 rue Pierre Mauroy · à 3 min de Lille-Flandres
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Fade from / to black. */
const Fades: React.FC<{ readonly t: number }> = ({ t }) => {
  const o = Math.max(
    1 - lin(t, 0, 0.9),
    lin(t, BEATS.fadeOut, TOTAL_SECONDS - 0.05),
  );
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity: o }} />;
};

export const Overlay: React.FC<{ readonly t: number }> = ({ t }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <LocationCard t={t} />
    <Notifications t={t} />
    <Subtitles t={t} />
    <EndCard t={t} />
    <Fades t={t} />
  </AbsoluteFill>
);
