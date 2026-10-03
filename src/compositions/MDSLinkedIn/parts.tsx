import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, radii } from "../../brand/theme";
import { displayFont, textFont } from "../../brand/fonts";
import { mapRange, pop, progress } from "../../lib/animation";
import { CheckIcon } from "../../components/Icons";

/** Smartphone outline with an arbitrary screen. */
export const Phone: React.FC<{
  readonly width?: number;
  readonly screenColor?: string;
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ width = 340, screenColor = colors.inkSoft, children, style }) => {
  const height = width * 2.05;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.16,
        border: `${width * 0.03}px solid ${colors.greyLight}`,
        backgroundColor: screenColor,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: width * 0.04,
          left: "50%",
          translate: "-50% 0px",
          width: width * 0.3,
          height: width * 0.07,
          borderRadius: 99,
          backgroundColor: colors.ink,
          zIndex: 2,
        }}
      />
      {children}
    </div>
  );
};

/** Rounded label that pops in at `delay`. */
export const Chip: React.FC<{
  readonly label: string;
  readonly delay: number;
  readonly active?: boolean;
  readonly icon?: React.ReactNode;
  readonly fontSize?: number;
  readonly style?: React.CSSProperties;
}> = ({ label, delay, active = false, icon, fontSize = 40, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: `${fontSize * 0.4}px ${fontSize * 0.8}px`,
        borderRadius: radii.pill,
        border: `2px solid ${active ? colors.blue : colors.inkLine}`,
        backgroundColor: active ? `${colors.blue}22` : colors.inkSoft,
        color: colors.white,
        fontFamily: textFont,
        fontWeight: 600,
        fontSize,
        whiteSpace: "nowrap",
        opacity: mapRange(p, [0, 0.5], [0, 1]),
        scale: String(0.6 + 0.4 * p),
        ...style,
      }}
    >
      {icon}
      {label}
    </div>
  );
};

/** Checkbox row that gets ticked at `checkAt`. */
export const CheckRow: React.FC<{
  readonly label: string;
  readonly appearAt: number;
  readonly checkAt: number;
  readonly fontSize?: number;
  readonly color?: string;
}> = ({ label, appearAt, checkAt, fontSize = 52, color = colors.white }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = pop(frame, fps, appearAt, 18);
  const c = pop(frame, fps, checkAt, 12, 160);
  const box = fontSize * 1.15;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        opacity: mapRange(a, [0, 0.5], [0, 1]),
        translate: `${(1 - a) * -60}px 0px`,
      }}
    >
      <div
        style={{
          width: box,
          height: box,
          borderRadius: 14,
          border: `3px solid ${c > 0.1 ? colors.blue : colors.grey}`,
          backgroundColor: c > 0.1 ? colors.blue : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon
          size={box * 0.8}
          color={colors.ink}
          stroke={3}
          style={{ scale: String(c) }}
        />
      </div>
      <div
        style={{ fontFamily: displayFont, fontWeight: 700, fontSize, color }}
      >
        {label}
      </div>
    </div>
  );
};

/** "Day" card for the routine conveyor. */
export const DayCard: React.FC<{
  readonly day: string;
  readonly highlight?: number;
  readonly style?: React.CSSProperties;
}> = ({ day, highlight = 0, style }) => (
  <div
    style={{
      width: 230,
      height: 300,
      borderRadius: radii.md,
      backgroundColor: colors.inkSoft,
      border: `2px solid ${highlight > 0 ? colors.white : colors.inkLine}`,
      boxShadow:
        highlight > 0
          ? `0 0 ${50 * highlight}px rgba(255,255,255,${0.35 * highlight})`
          : undefined,
      display: "flex",
      flexDirection: "column",
      padding: 26,
      gap: 18,
      ...style,
    }}
  >
    <div
      style={{
        fontFamily: displayFont,
        fontWeight: 800,
        fontSize: 44,
        color: colors.greyLight,
      }}
    >
      {day}
    </div>
    {[0.9, 0.7, 0.8, 0.5].map((w, i) => (
      <div
        key={i}
        style={{
          width: `${w * 100}%`,
          height: 16,
          borderRadius: 8,
          backgroundColor: colors.inkLine,
        }}
      />
    ))}
    <div
      style={{
        marginTop: "auto",
        fontFamily: textFont,
        fontSize: 26,
        color: colors.grey,
      }}
    >
      09:00 — 18:00
    </div>
  </div>
);

/** Section label in small caps, e.g. "Chapitre 1". */
export const Kicker: React.FC<{
  readonly text: string;
  readonly start?: number;
  readonly style?: React.CSSProperties;
}> = ({ text, start = 0, style }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, 18);
  return (
    <div
      style={{
        fontFamily: textFont,
        fontWeight: 600,
        fontSize: 28,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: colors.blue,
        opacity: p,
        translate: `0px ${(1 - p) * 16}px`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
