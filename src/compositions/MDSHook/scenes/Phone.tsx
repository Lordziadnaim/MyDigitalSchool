import React from "react";
import { colors } from "../../../brand/theme";
import { textFont } from "../../../brand/fonts";

const TILES = [
  colors.blue,
  colors.pink,
  colors.purpleLight,
  "#F2B84B",
  colors.blueDeep,
  "#FF7A59",
];
const LABELS = ["story", "reel", "post", "vidéo", "reel", "story"];

/** Phone with a scrolling social feed. `scroll` is in px. */
export const FeedPhone: React.FC<{
  readonly scroll: number;
  readonly width?: number;
  readonly blur?: number;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({ scroll, width = 420, blur = 0, style, children }) => {
  const h = width * 2.05;
  const tileH = width * 0.62;
  const loop = (tileH + 18) * TILES.length;
  return (
    <div
      style={{
        position: "relative",
        width,
        height: h,
        borderRadius: width * 0.15,
        border: `${width * 0.028}px solid #ECECEC`,
        backgroundColor: "#111",
        overflow: "hidden",
        boxShadow: "0 50px 120px rgba(0,0,0,0.55)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 16px",
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            paddingTop: 60,
            translate: `0px ${-(scroll % loop)}px`,
          }}
        >
          {[...TILES, ...TILES, ...TILES].map((c, i) => (
            <div
              key={i}
              style={{
                height: tileH,
                flexShrink: 0,
                borderRadius: 24,
                background: `linear-gradient(140deg, ${c}, ${c}99)`,
                display: "flex",
                alignItems: "flex-end",
                padding: 20,
                fontFamily: textFont,
                fontWeight: 700,
                fontSize: width * 0.07,
                color: "rgba(0,0,0,0.6)",
              }}
            >
              {LABELS[i % LABELS.length]}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: width * 0.04,
          left: "50%",
          translate: "-50% 0px",
          width: width * 0.3,
          height: width * 0.075,
          borderRadius: 99,
          backgroundColor: "#000",
        }}
      />
      {children}
    </div>
  );
};

/** Simple thumb glyph (rounded capsule + nail). */
export const Thumb: React.FC<{
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ size = 160, style }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 100 160" style={style}>
    <rect
      x="18"
      y="8"
      width="64"
      height="150"
      rx="32"
      fill="#F4C7A1"
      stroke="#D9A57E"
      strokeWidth="3"
    />
    <rect
      x="30"
      y="18"
      width="40"
      height="44"
      rx="18"
      fill="#FBE3D0"
      stroke="#E7BFA0"
      strokeWidth="2"
    />
  </svg>
);
