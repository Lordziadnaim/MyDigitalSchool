import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../brand/theme";
import { float } from "../lib/animation";

type Props = {
  /** 0 = no glow, 1 = full blue glow. Animate it to change the mood. */
  readonly glow?: number;
  /** 0 = colorful, 1 = fully desaturated ("grey routine"). */
  readonly desaturate?: number;
  /** Show the subtle "digital" dot grid. */
  readonly grid?: boolean;
  readonly base?: string;
};

/**
 * Brand background: near-black ink, dot grid, and two slowly drifting blue
 * glows. Purely decorative; place it as the first child of a scene.
 */
export const Background: React.FC<Props> = ({
  glow = 0.6,
  desaturate = 0,
  grid = true,
  base = colors.ink,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const dx = float(frame, 0.012, width * 0.04);
  const dy = float(frame, 0.009, height * 0.05, 1.3);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: base,
        filter: desaturate > 0 ? `grayscale(${desaturate})` : undefined,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: glow,
          background: `radial-gradient(circle at ${30 + dx / 20}% ${35 + dy / 20}%, ${colors.blue}55 0%, transparent 45%),
            radial-gradient(circle at ${78 - dx / 25}% ${75 - dy / 25}%, ${colors.blueDeep}44 0%, transparent 40%)`,
        }}
      />
      {grid ? (
        <AbsoluteFill
          style={{
            opacity: 0.22,
            backgroundImage: `radial-gradient(${colors.inkLine} 2px, transparent 2px)`,
            backgroundSize: "48px 48px",
            backgroundPosition: `${(frame * 0.3) % 48}px 0px`,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
