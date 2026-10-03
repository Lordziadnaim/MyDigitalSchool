import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../brand/theme";
import { displayFont } from "../brand/fonts";
import { fadeInOut, mapRange, pop } from "../lib/animation";

type Props = {
  readonly text: string;
  /** Frame (relative to the parent sequence) where the first word appears. */
  readonly start?: number;
  /** Frame where the whole line fades out. Omit to keep it on screen. */
  readonly end?: number;
  /** Frames between two words. */
  readonly stagger?: number;
  /** Words (case-insensitive, punctuation ignored) to color in brand blue. */
  readonly highlight?: string[];
  readonly fontSize?: number;
  readonly fontWeight?: number;
  readonly color?: string;
  readonly highlightColor?: string;
  readonly align?: "left" | "center" | "right";
  readonly lineHeight?: number;
  readonly maxWidth?: number;
  readonly style?: React.CSSProperties;
};

const normalize = (w: string) =>
  w.toLowerCase().replace(/[.,!?;:«»"'…()]/g, "");

/**
 * Kinetic typography: each word rises, un-blurs and fades in with a
 * spring, staggered. The workhorse for titles and key phrases.
 */
export const AnimatedText: React.FC<Props> = ({
  text,
  start = 0,
  end,
  stagger = 3,
  highlight = [],
  fontSize = 96,
  fontWeight = 800,
  color = colors.white,
  highlightColor = colors.blue,
  align = "center",
  lineHeight = 1.08,
  maxWidth,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  const hl = highlight.map(normalize);
  const exit = end === undefined ? 1 : fadeInOut(frame, -100, end, 10);

  return (
    <div
      style={{
        fontFamily: displayFont,
        fontSize,
        fontWeight,
        color,
        lineHeight,
        letterSpacing: "-0.02em",
        textAlign: align,
        maxWidth,
        opacity: exit,
        display: "flex",
        flexWrap: "wrap",
        justifyContent:
          align === "center"
            ? "center"
            : align === "right"
              ? "flex-end"
              : "flex-start",
        columnGap: fontSize * 0.26,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const p = pop(frame, fps, start + i * stagger, 16, 140);
        const isHl = hl.includes(normalize(word));
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              color: isHl ? highlightColor : undefined,
              opacity: mapRange(p, [0, 0.6], [0, 1]),
              translate: `0px ${(1 - p) * fontSize * 0.45}px`,
              filter: `blur(${(1 - Math.min(1, p)) * 8}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
