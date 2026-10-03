import React from "react";
import { colors } from "../brand/theme";

/**
 * Animated shape primitives. Each one takes a `progress` (0 → 1) so the
 * caller decides timing with `progress()`, `pop()` or `interpolate()`.
 */

type RingProps = {
  readonly size: number;
  readonly progress: number;
  readonly stroke?: number;
  readonly color?: string;
  readonly trackColor?: string;
  readonly style?: React.CSSProperties;
};

/** Circle drawn on with stroke-dashoffset. */
export const Ring: React.FC<RingProps> = ({
  size,
  progress,
  stroke = 6,
  color = colors.blue,
  trackColor = "transparent",
  style,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ overflow: "visible", ...style }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

type LineProps = {
  readonly width: number;
  readonly progress: number;
  readonly thickness?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
};

/** Horizontal line that grows from the left. */
export const GrowLine: React.FC<LineProps> = ({
  width,
  progress,
  thickness = 6,
  color = colors.blue,
  style,
}) => (
  <div
    style={{
      width: width * progress,
      height: thickness,
      borderRadius: thickness,
      backgroundColor: color,
      ...style,
    }}
  />
);

type DotProps = {
  readonly size: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
};

export const Dot: React.FC<DotProps> = ({
  size,
  color = colors.blue,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      backgroundColor: color,
      ...style,
    }}
  />
);

type PathProps = {
  readonly d: string;
  readonly length: number;
  readonly progress: number;
  readonly width: number;
  readonly height: number;
  readonly stroke?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
};

/** Any SVG path drawn on progressively (pass its approximate length). */
export const DrawPath: React.FC<PathProps> = ({
  d,
  length,
  progress,
  width,
  height,
  stroke = 8,
  color = colors.blue,
  style,
}) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    style={{ overflow: "visible", ...style }}
  >
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={length}
      strokeDashoffset={length * (1 - progress)}
    />
  </svg>
);
