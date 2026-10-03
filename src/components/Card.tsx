import React from "react";
import { colors, radii } from "../brand/theme";

type Props = {
  readonly children?: React.ReactNode;
  readonly width?: number;
  readonly height?: number;
  readonly accent?: string;
  readonly glow?: number;
  readonly style?: React.CSSProperties;
};

/** Rounded glassy panel used for UI-like illustrations. */
export const Card: React.FC<Props> = ({
  children,
  width = 360,
  height = 360,
  accent = colors.blue,
  glow = 0,
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radii.lg,
        background: `linear-gradient(160deg, ${colors.inkSoft} 0%, ${colors.ink} 100%)`,
        border: `2px solid ${glow > 0 ? accent : colors.inkLine}`,
        boxShadow:
          glow > 0
            ? `0 0 ${60 * glow}px ${accent}${Math.round(glow * 120)
                .toString(16)
                .padStart(2, "0")}`
            : "0 30px 60px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
