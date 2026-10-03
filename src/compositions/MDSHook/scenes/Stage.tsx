import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../../../brand/theme";
import { useTime } from "../fx";

export type Tone = "purple" | "night" | "blue" | "pink" | "light" | "grey";

const BASES: Record<Tone, [string, string]> = {
  purple: [colors.purple, "#3A1150"],
  night: ["#1A0B22", "#0C0510"],
  blue: [colors.blue, "#16808A"],
  pink: [colors.pink, "#9E0F4C"],
  light: [colors.white, colors.blueLight],
  grey: ["#3C3C3B", "#1E1E1E"],
};

/**
 * Full-frame brand background with a slow light sweep and diagonal
 * stripes (a nod to the "We Tech / We Market" stripes of the website).
 */
export const Stage: React.FC<{
  readonly tone?: Tone;
  readonly stripes?: boolean;
  readonly children?: React.ReactNode;
}> = ({ tone = "purple", stripes = false, children }) => {
  const t = useTime();
  const [a, b] = BASES[tone];
  const sweep = (t * 12) % 200;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 30% 30%, ${a} 0%, ${b} 100%)`,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: `linear-gradient(115deg, transparent ${sweep - 40}%, rgba(255,255,255,0.08) ${sweep - 20}%, transparent ${sweep}%)`,
        }}
      />
      {stripes ? (
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -80,
            width: 520,
            height: 1300,
            rotate: "18deg",
            backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0 26px, transparent 26px 60px)`,
            translate: `0px ${-(t * 40) % 120}px`,
          }}
        />
      ) : null}
      <AbsoluteFill>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
