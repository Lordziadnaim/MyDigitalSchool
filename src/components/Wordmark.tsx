import React from "react";
import { Img } from "remotion";
import { colors } from "../brand/theme";
import { displayFont } from "../brand/fonts";

type Props = {
  readonly size?: number;
  /** 0 → 1 reveal. */
  readonly progress?: number;
  /** Text color of "My" + "School" (use colors.ink on light backgrounds). */
  readonly color?: string;
  /**
   * Official logo file (e.g. staticFile("brand/logo.svg")). When provided,
   * it replaces the typographic placeholder below.
   */
  readonly logoSrc?: string;
  readonly style?: React.CSSProperties;
};

/**
 * Typographic placeholder for the MyDigitalSchool logo, built on the
 * brand principle "black of IT expertise + blue of creative freedom".
 * It is NOT the official logo.
 * Drop the official SVG in `public/brand/` and pass `logoSrc` to use it.
 */
export const Wordmark: React.FC<Props> = ({
  size = 96,
  progress = 1,
  color = colors.white,
  logoSrc,
  style,
}) => {
  if (logoSrc) {
    return (
      <Img
        src={logoSrc}
        style={{ height: size * 1.2, opacity: progress, ...style }}
      />
    );
  }

  const clip = `inset(0 ${100 - progress * 100}% 0 0)`;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: size * 0.12,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: size * 0.72,
          letterSpacing: "-0.03em",
          color,
          clipPath: clip,
          whiteSpace: "nowrap",
        }}
      >
        My<span style={{ color: colors.blue }}>Digital</span>School
      </div>
      <div
        style={{
          width: `${progress * 100}%`,
          height: Math.max(4, size * 0.06),
          borderRadius: size,
          backgroundColor: colors.blue,
        }}
      />
    </div>
  );
};
