import React, { useId } from "react";
import { colors } from "../brand/theme";
import { LOGO_PATHS, LOGO_RATIO, LOGO_VIEWBOX } from "../brand/logo-paths";
import { EASE_OUT, mapRange } from "../lib/animation";

type Props = {
  /** Rendered width in px. */
  readonly width?: number;
  /**
   * 0 → 1 build-in: the two brain halves slide in from the sides, then the
   * "MY DIGITAL SCHOOL" lettering is revealed. Use 1 for a static logo.
   */
  readonly progress?: number;
  /** "color" on light backgrounds, "white" on purple/dark backgrounds. */
  readonly variant?: "color" | "white";
  readonly style?: React.CSSProperties;
};

/**
 * Official MyDigitalSchool logo, drawn from vector paths so it stays crisp
 * at any size and can be animated part by part (left brain = expertise,
 * right brain = creativity). Static files: public/brand/logo.svg and
 * public/brand/logo-white.svg.
 */
export const Logo: React.FC<Props> = ({
  width = 600,
  progress = 1,
  variant = "white",
  style,
}) => {
  const clipId = `mds-logo-${useId().replace(/:/g, "")}`;
  const dark = variant === "white" ? colors.white : colors.greyDark;
  const halves = mapRange(progress, [0, 0.55], [0, 1], EASE_OUT);
  const text = mapRange(progress, [0.35, 1], [0, 1], EASE_OUT);
  const shift = (1 - halves) * 160;

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      width={width}
      height={width * LOGO_RATIO}
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={-20} width={1000 * text} height={420} />
        </clipPath>
      </defs>
      <g opacity={halves} transform={`translate(${-shift} 0)`}>
        {LOGO_PATHS.filter((p) => p.part === "left").map((p, i) => (
          <path key={i} d={p.d} fill={dark} />
        ))}
      </g>
      <g opacity={halves} transform={`translate(${shift} 0)`}>
        {LOGO_PATHS.filter((p) => p.part === "right").map((p, i) => (
          <path key={i} d={p.d} fill={colors.blue} />
        ))}
      </g>
      <g clipPath={`url(#${clipId})`}>
        {LOGO_PATHS.filter((p) => p.part === "text").map((p, i) => (
          <path key={i} d={p.d} fill={p.fill === "blue" ? colors.blue : dark} />
        ))}
      </g>
    </svg>
  );
};
