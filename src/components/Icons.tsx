import React from "react";
import { colors } from "../brand/theme";

/**
 * Minimal line icons (24×24 grid, scaled with `size`). Brand-neutral,
 * stroke-based so they inherit the DA colors.
 */

type IconProps = {
  readonly size?: number;
  readonly color?: string;
  readonly stroke?: number;
  readonly style?: React.CSSProperties;
};

const Svg: React.FC<IconProps & { readonly children: React.ReactNode }> = ({
  size = 96,
  color = colors.white,
  stroke = 1.8,
  style,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {children}
  </svg>
);

export const PlayIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="4" width="19" height="16" rx="3" />
    <path d="M10 9v6l5-3z" />
  </Svg>
);

export const TypeIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 19 9 5l5 14M6 14h6" />
    <path d="M15.5 13.5a2.5 2.5 0 1 1 5 0V19M20.5 16.5c-3 0-5 .4-5 1.6 0 1 1 1.2 1.8 1.2 1.6 0 3.2-1 3.2-2.8" />
  </Svg>
);

export const ChartIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3 20h18" />
    <path d="M4 16l5-5 4 3 7-8" />
    <path d="M15 6h5v5" />
  </Svg>
);

export const CodeIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
  </Svg>
);

export const CursorIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M5 3l14 7-6 2-2 6z" />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="m4 12.5 5 5L20 6.5" />
  </Svg>
);

export const MoonIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </Svg>
);

export const BriefcaseIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18" />
  </Svg>
);

export const CapIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="m2 9 10-5 10 5-10 5z" />
    <path d="M6 11v5c2 2 10 2 12 0v-5M22 9v6" />
  </Svg>
);

export const EuroIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M18 6.5A7 7 0 1 0 18 17.5M4 10.5h10M4 13.5h10" />
  </Svg>
);
