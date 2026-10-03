import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { colors } from "../../../brand/theme";
import { displayFont } from "../../../brand/fonts";
import { BigWord, ease, slam, useTime } from "../fx";
import { Stage } from "./Stage";
import { FeedPhone, Thumb } from "./Phone";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0.00–1.00 — "Stop." The feed is flying, then freezes on a slam. */
export const StopScene: React.FC = () => {
  const t = useTime();
  const frozen = t >= 0.12;
  const scroll = frozen ? 0.12 * 4200 : t * 4200;
  return (
    <Stage tone="night">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <FeedPhone
          scroll={scroll}
          width={430}
          blur={frozen ? 6 : 14}
          style={{
            opacity: frozen ? 0.45 : 1,
            scale: String(frozen ? 1.06 : 1),
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <BigWord
          text="Stop."
          at={0.12}
          size={440}
          color={colors.white}
          style={{ textShadow: `0 0 80px ${colors.pink}` }}
        />
      </AbsoluteFill>
    </Stage>
  );
};

/** 1.00–2.40 — "Ne scrolle pas tout de suite." Thumb hovering, frozen. */
export const NoScrollScene: React.FC = () => {
  const t = useTime();
  const hover = Math.sin(t * 9) * 10;
  return (
    <Stage tone="purple" stripes>
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 120,
        }}
      >
        <div style={{ position: "relative" }}>
          <FeedPhone scroll={500} width={380} />
          <Thumb
            size={150}
            style={{
              position: "absolute",
              left: 120,
              top: 470 + hover,
              rotate: "-12deg",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 56,
              border: `10px solid ${colors.pink}`,
              opacity: Math.floor(t * 6) % 2 === 0 ? 1 : 0.35,
            }}
          />
        </div>
        <div style={{ width: 860 }}>
          <BigWord
            text="Ne scrolle"
            at={1.05}
            size={150}
            style={{ textAlign: "left" }}
          />
          <BigWord
            text="pas tout"
            at={1.35}
            size={150}
            style={{ textAlign: "left" }}
          />
          <BigWord
            text="de suite."
            at={1.6}
            size={150}
            color={colors.blue}
            style={{ textAlign: "left" }}
          />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** 2.40–6.30 — "Ce que ton pouce fait tous les jours… c'est un métier." */
export const ThumbScene: React.FC = () => {
  const t = useTime();
  const cycle = ((t - 2.4) * 2.2) % 1;
  const swipe = interpolate(cycle, [0, 0.6, 1], [0, -260, -260], clamp);
  const reveal = 5.2;
  const after = t >= reveal;
  return (
    <Stage tone={after ? "blue" : "purple"}>
      {!after ? (
        <AbsoluteFill
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 140,
          }}
        >
          <div style={{ position: "relative", width: 260, height: 520 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 70,
                  top: 260 + swipe + i * 40,
                  width: 120,
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: colors.blue,
                  opacity: (1 - cycle) * (0.6 - i * 0.18),
                }}
              />
            ))}
            <Thumb
              size={200}
              style={{
                position: "absolute",
                left: 30,
                top: 140 + swipe * 0.5,
                rotate: "-8deg",
              }}
            />
          </div>
          <div
            style={{
              width: 980,
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 112,
              lineHeight: 1,
              color: colors.white,
            }}
          >
            {["Ce que ton pouce", "fait tous", "les jours…"].map((l, i) => {
              const p = ease(t, 2.45 + i * 0.45, 0.35);
              return (
                <div
                  key={l}
                  style={{ opacity: p, translate: `${(1 - p) * 80}px 0px` }}
                >
                  {l}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <BigWord text="c'est un" at={reveal} size={150} color={colors.ink} />
          <BigWord
            text="métier."
            at={reveal + 0.3}
            size={330}
            color={colors.white}
            style={{
              textShadow: `0 20px 60px rgba(0,0,0,0.25)`,
              scale: String(1 + (t - reveal) * 0.04),
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle, rgba(255,255,255,${0.5 * (1 - slam(t, reveal, 0.5))}) 0%, transparent 60%)`,
            }}
          />
        </AbsoluteFill>
      )}
    </Stage>
  );
};
