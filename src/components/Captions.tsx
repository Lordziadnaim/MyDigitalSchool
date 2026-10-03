import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, radii } from "../brand/theme";
import { textFont } from "../brand/fonts";
import { mapRange } from "../lib/animation";

export type CaptionLine = {
  readonly text: string;
  readonly startMs: number;
  readonly endMs: number;
};

type Props = {
  readonly lines: CaptionLine[];
  /** Shift every caption by this many frames (e.g. voiceover start offset). */
  readonly offsetFrames?: number;
  readonly bottom?: number;
  readonly fontSize?: number;
};

/**
 * Burned-in subtitles. On LinkedIn most videos autoplay muted, so
 * captions are part of the design, not an afterthought.
 * Timings are in milliseconds relative to the audio clip start.
 */
export const Captions: React.FC<Props> = ({
  lines,
  offsetFrames = 0,
  bottom = 70,
  fontSize = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = ((frame - offsetFrames) / fps) * 1000;
  const current = lines.find((l) => ms >= l.startMs && ms < l.endMs);
  if (!current) return null;

  const local = ms - current.startMs;
  const opacity = mapRange(local, [0, 120], [0, 1]);
  const y = mapRange(local, [0, 200], [10, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          padding: "14px 28px",
          borderRadius: radii.md,
          backgroundColor: "rgba(20, 7, 26, 0.72)",
          border: `1px solid ${colors.inkLine}`,
          color: colors.white,
          fontFamily: textFont,
          fontWeight: 600,
          fontSize,
          lineHeight: 1.3,
          textAlign: "center",
          opacity,
          translate: `0px ${y}px`,
        }}
      >
        {current.text}
      </div>
    </div>
  );
};
