import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../SceneShell";
import { Phone, Kicker } from "../parts";
import { getScene } from "../timeline";
import { colors, radii } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { fadeInOut, mapRange, pop, progress } from "../../../lib/animation";
import { Ring } from "../../../components/Shapes";

const FEED = [
  { label: "story", tone: colors.blue },
  { label: "vidéo", tone: colors.blueDeep },
  { label: "vidéo", tone: colors.grey },
  { label: "reel", tone: colors.blueLight },
  { label: "story", tone: colors.inkLine },
  { label: "vidéo", tone: colors.blue },
  { label: "post", tone: colors.grey },
  { label: "vidéo", tone: colors.blueDeep },
];

/** Scene 1 — "Lundi. 7h12." The alarm, the thumb, the endless scroll. */
export const S1Reveil: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cues } = getScene("s1");
  const [cLundi, cHour, cAlarm, cThumb, cSnooze, cFeed, cNumb] = cues;

  // Alarm shake between "Le réveil sonne" and the thumb.
  const ringing = frame >= cAlarm && frame < cSnooze;
  const shake = ringing ? Math.sin(frame * 2.2) * 6 : 0;
  // Feed scroll speeds up after "Une story. Une vidéo."
  const scrollStart = cSnooze + 10;
  const scrollT = Math.max(0, frame - scrollStart);
  const scroll = scrollT * 6 + Math.max(0, frame - cFeed) ** 1.6 * 0.35;
  const numb = progress(frame, cNumb, 30);
  const phoneIn = pop(frame, fps, cAlarm - 6, 15);

  return (
    <SceneShell id="s1" glow={0.35 * (1 - numb)} desaturate={numb * 0.9}>
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: "0 180px 120px",
        }}
      >
        {/* Left: day + time */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}
        >
          <Kicker text="Une histoire que tu connais" start={0} />
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 900,
              fontSize: 150,
              color: colors.white,
              letterSpacing: "-0.04em",
              opacity: progress(frame, cLundi, 10),
              translate: `0px ${(1 - pop(frame, fps, cLundi)) * 60}px`,
            }}
          >
            Lundi.
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 220,
              lineHeight: 0.95,
              color: colors.blue,
              letterSpacing: "-0.05em",
              fontVariantNumeric: "tabular-nums",
              opacity: progress(frame, cHour, 10) * (1 - numb * 0.6),
              scale: String(0.85 + 0.15 * pop(frame, fps, cHour)),
              transformOrigin: "left center",
            }}
          >
            07
            <span
              style={{ opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.25 }}
            >
              :
            </span>
            12
          </div>
          <div
            style={{
              marginTop: 30,
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 76,
              color: colors.white,
              opacity: fadeInOut(frame, cSnooze, cNumb, 8),
            }}
          >
            Snooze. <span style={{ color: colors.blue }}>Scroll.</span>
          </div>
          <div
            style={{
              marginTop: -70,
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 76,
              color: colors.greyLight,
              opacity: progress(frame, cNumb, 14),
            }}
          >
            Tu ne le remarques même plus.
          </div>
        </div>

        {/* Right: phone */}
        <div
          style={{
            position: "relative",
            width: 520,
            display: "flex",
            justifyContent: "center",
            opacity: mapRange(phoneIn, [0, 0.4], [0, 1]),
            translate: `${shake}px ${(1 - phoneIn) * 200}px`,
            rotate: `${shake * 0.4}deg`,
          }}
        >
          {[0, 1, 2].map((i) => {
            const t = ((frame - cAlarm - i * 10) % 30) / 30;
            return ringing ? (
              <Ring
                key={i}
                size={420 + t * 260}
                progress={1}
                stroke={3}
                color={colors.blue}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  translate: "-50% -50%",
                  opacity: (1 - t) * 0.7,
                }}
              />
            ) : null;
          })}
          <Phone width={330}>
            {/* Alarm screen */}
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "center",
                gap: 30,
                opacity: 1 - progress(frame, cSnooze, 8),
              }}
            >
              <div
                style={{
                  fontFamily: displayFont,
                  fontWeight: 800,
                  fontSize: 84,
                  color: colors.white,
                }}
              >
                07:12
              </div>
              <div
                style={{
                  fontFamily: textFont,
                  fontSize: 26,
                  color: colors.greyLight,
                }}
              >
                Réveil
              </div>
              <div
                style={{
                  marginTop: 80,
                  padding: "18px 46px",
                  borderRadius: radii.pill,
                  backgroundColor:
                    frame >= cThumb + 30 ? colors.blue : colors.inkLine,
                  fontFamily: textFont,
                  fontWeight: 700,
                  fontSize: 30,
                  color: colors.white,
                  scale: String(
                    1 -
                      0.12 *
                        pop(frame, fps, cThumb + 30) *
                        (frame < cThumb + 40 ? 1 : 0),
                  ),
                }}
              >
                Snooze
              </div>
            </AbsoluteFill>
            {/* Thumb */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: mapRange(frame, [cThumb, cThumb + 28], [720, 470]),
                width: 90,
                height: 90,
                borderRadius: 90,
                translate: "-50% 0px",
                backgroundColor: "rgba(255,255,255,0.25)",
                border: "3px solid rgba(255,255,255,0.6)",
                opacity: fadeInOut(frame, cThumb, cSnooze + 6, 8),
              }}
            />
            {/* Feed */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "60px 18px",
                opacity: progress(frame, cSnooze, 10),
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  translate: `0px ${-(scroll % 1840)}px`,
                }}
              >
                {[...FEED, ...FEED, ...FEED].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      height: 210,
                      flexShrink: 0,
                      borderRadius: 22,
                      backgroundColor: item.tone,
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 18,
                      fontFamily: textFont,
                      fontWeight: 700,
                      fontSize: 26,
                      color: colors.ink,
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </Phone>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
