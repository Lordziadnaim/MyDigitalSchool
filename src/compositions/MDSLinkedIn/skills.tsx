import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../../brand/theme";
import { displayFont, textFont } from "../../brand/fonts";
import { mapRange, progress } from "../../lib/animation";
import { CursorIcon } from "../../components/Icons";

/**
 * Small looping illustrations of "things you already do", reused in
 * scene 3 (habits) and scene 4 (the same habits revealed as jobs).
 * `t` is the local frame since the card appeared.
 */
type VizProps = { readonly t: number; readonly active?: boolean };

export const MontageViz: React.FC<VizProps> = ({ t, active = true }) => {
  const clips = [
    { w: 70, c: colors.blue },
    { w: 46, c: colors.blueLight },
    { w: 90, c: colors.blueDeep },
    { w: 60, c: colors.blue },
  ];
  const snap = progress(t, 40, 20);
  const head = (t * 3) % 260;
  return (
    <div
      style={{ width: 280, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div
        style={{ display: "flex", gap: 14, height: 50, alignItems: "flex-end" }}
      >
        {Array.from({ length: 18 }).map((_, i) => {
          const beat = i % 4 === 0;
          return (
            <div
              key={i}
              style={{
                width: 8,
                height:
                  (beat ? 46 : 18) *
                  (0.7 + 0.3 * Math.abs(Math.sin(t * 0.2 + i))),
                borderRadius: 4,
                backgroundColor: beat && active ? colors.blue : colors.inkLine,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "relative",
          height: 60,
          display: "flex",
          gap: 6 + (1 - snap) * 14,
        }}
      >
        {clips.map((c, i) => (
          <div
            key={i}
            style={{
              width: c.w,
              height: 60,
              borderRadius: 10,
              backgroundColor: active ? c.c : colors.grey,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: head,
            top: -80,
            width: 3,
            height: 150,
            backgroundColor: colors.white,
          }}
        />
      </div>
    </div>
  );
};

const STYLES: React.CSSProperties[] = [
  { fontWeight: 900, fontStyle: "normal" },
  { fontWeight: 500, fontStyle: "italic" },
  { fontWeight: 800, fontStyle: "normal", letterSpacing: "-0.08em" },
  { fontWeight: 700, fontStyle: "italic" },
];

export const TypeViz: React.FC<VizProps> = ({ t, active = true }) => {
  const idx = Math.floor(t / 12) % STYLES.length;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          fontFamily: idx % 2 === 0 ? displayFont : textFont,
          fontSize: 150,
          lineHeight: 1,
          color: active ? colors.white : colors.greyLight,
          ...STYLES[idx],
        }}
      >
        Aa
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {STYLES.map((_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 14,
              backgroundColor:
                i === idx && active ? colors.blue : colors.inkLine,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const SocialViz: React.FC<VizProps & { readonly flopAt?: number }> = ({
  t,
  active = true,
  flopAt = 60,
}) => {
  const up = progress(t, 0, 50);
  const down = progress(t, flopAt, 40);
  const w = 260;
  const h = 170;
  const upPath = `M0 ${h} C ${w * 0.4} ${h} ${w * 0.5} ${h * 0.6} ${w * 0.7} ${h * 0.35} S ${w} ${h * 0.05} ${w} 0`;
  const downPath = `M0 ${h * 0.4} C ${w * 0.3} ${h * 0.3} ${w * 0.5} ${h * 0.5} ${w * 0.7} ${h * 0.8} S ${w} ${h} ${w} ${h}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <path
        d={upPath}
        fill="none"
        stroke={active ? colors.blue : colors.grey}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={420}
        strokeDashoffset={420 * (1 - up)}
      />
      <path
        d={downPath}
        fill="none"
        stroke={colors.grey}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={420}
        strokeDashoffset={420 * (1 - down)}
        opacity={0.8}
      />
      <circle
        cx={w}
        cy={0}
        r={12 * up}
        fill={active ? colors.blue : colors.grey}
      />
    </svg>
  );
};

const CODE = [
  "<header>",
  "  <h1>Hello</h1>",
  "</header>",
  ".btn {",
  "  color: #2DB8C5;",
  "}",
];

export const CodeViz: React.FC<VizProps> = ({ t, active = true }) => {
  const chars = Math.floor(t * 1.4);
  let remaining = chars;
  return (
    <div
      style={{
        width: 290,
        fontFamily: "monospace",
        fontSize: 26,
        lineHeight: 1.45,
      }}
    >
      {CODE.map((line, i) => {
        const shown = line.slice(0, Math.max(0, remaining));
        remaining -= line.length;
        const isTag = line.trim().startsWith("<");
        return (
          <div
            key={i}
            style={{
              color: isTag && active ? colors.blue : colors.greyLight,
              whiteSpace: "pre",
              minHeight: 37,
            }}
          >
            {shown}
            {remaining > -line.length &&
            remaining <= 0 &&
            Math.floor(t / 8) % 2 === 0 ? (
              <span style={{ color: colors.white }}>▍</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export const UXViz: React.FC<VizProps> = ({ t, active = true }) => {
  const x = mapRange(t % 90, [0, 45], [30, 170]);
  const y = mapRange(t % 90, [0, 45], [150, 90]);
  const clicked = t % 90 > 45 && t % 90 < 60;
  return (
    <div style={{ position: "relative", width: 260, height: 200 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          border: `3px solid ${colors.inkLine}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          width: 140,
          height: 16,
          borderRadius: 8,
          backgroundColor: colors.inkLine,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 48,
          width: 200,
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.inkLine,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 100,
          width: 120,
          height: 48,
          borderRadius: 24,
          backgroundColor: clicked && active ? colors.blue : colors.blueDeep,
          scale: clicked ? "0.94" : "1",
        }}
      />
      <CursorIcon
        size={52}
        color={colors.white}
        stroke={2}
        style={{ position: "absolute", left: x, top: y }}
      />
    </div>
  );
};

/** Card wrapper: fixed size, label underneath. */
export const SkillCard: React.FC<{
  readonly children: React.ReactNode;
  readonly label: string;
  readonly accent?: boolean;
  readonly width?: number;
  readonly style?: React.CSSProperties;
}> = ({ children, label, accent = false, width = 340, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        ...style,
      }}
    >
      <div
        style={{
          width,
          height: width,
          borderRadius: 36,
          backgroundColor: colors.inkSoft,
          border: `2px solid ${accent ? colors.blue : colors.inkLine}`,
          boxShadow: accent
            ? `0 0 ${40 + Math.sin(frame * 0.1) * 10}px ${colors.blue}55`
            : "0 30px 60px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      <div
        style={{
          fontFamily: textFont,
          fontWeight: 600,
          fontSize: 34,
          color: accent ? colors.white : colors.greyLight,
          textAlign: "center",
          maxWidth: width + 20,
        }}
      >
        {label}
      </div>
    </div>
  );
};
