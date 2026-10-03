import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../brand/theme";
import { displayFont } from "../brand/fonts";
import { progress } from "../lib/animation";

type Props = {
  readonly to: number;
  readonly from?: number;
  readonly start?: number;
  readonly duration?: number;
  readonly suffix?: string;
  readonly prefix?: string;
  readonly fontSize?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
};

/** Number that counts up — for key figures. */
export const Counter: React.FC<Props> = ({
  to,
  from = 0,
  start = 0,
  duration = 40,
  suffix = "",
  prefix = "",
  fontSize = 160,
  color = colors.blue,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, duration);
  const value = Math.round(from + (to - from) * p);
  return (
    <div
      style={{
        fontFamily: displayFont,
        fontWeight: 900,
        fontSize,
        color,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        opacity: Math.min(1, p * 4),
        ...style,
      }}
    >
      {prefix}
      {value.toLocaleString("fr-FR")}
      {suffix}
    </div>
  );
};
