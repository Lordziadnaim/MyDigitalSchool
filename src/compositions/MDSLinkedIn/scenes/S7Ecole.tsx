import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../SceneShell";
import { Chip } from "../parts";
import { getScene } from "../timeline";
import { CAMPUSES, project } from "../campuses";
import { colors } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { Wordmark } from "../../../components/Wordmark";
import { Counter } from "../../../components/Counter";
import { Ring } from "../../../components/Shapes";
import { fadeInOut, mapRange, pop, progress } from "../../../lib/animation";

const MAP_W = 760;
const MAP_H = 720;

/** Scene 7 — the brand reveal: MyDigitalSchool, 17 campus, programs, 95 %. */
export const S7Ecole: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cues } = getScene("s7");
  const [
    cPropose,
    cSchool,
    cCampus,
    cPrograms,
    cTracks1,
    cTracks2,
    cInsertion,
  ] = cues;

  const reveal = progress(frame, cPropose + 34, 30);
  const burst = progress(frame, cPropose + 30, 40);
  const dock = progress(frame, cCampus - 10, 26);
  const campusCol = fadeInOut(frame, cCampus, cPrograms, 10);
  const programsCol = fadeInOut(frame, cPrograms, cInsertion, 10);
  const insertionCol = progress(frame, cInsertion, 10);

  return (
    <SceneShell id="s7" glow={0.9}>
      {/* Brand lockup: center, then docks at the top */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          translate: `0px ${mapRange(dock, [0, 1], [-60, -400])}px`,
          scale: String(mapRange(dock, [0, 1], [1, 0.55])),
        }}
      >
        <Ring
          size={900}
          progress={burst}
          stroke={4}
          style={{
            position: "absolute",
            opacity: (1 - burst) * 0.9,
            scale: String(0.6 + burst * 0.8),
          }}
        />
        <Wordmark size={150} progress={reveal} />
        <div
          style={{
            marginTop: 34,
            fontFamily: textFont,
            fontWeight: 600,
            fontSize: 54,
            letterSpacing: "0.04em",
            color: colors.greyLight,
            opacity: progress(frame, cSchool, 14) * (1 - dock),
          }}
        >
          L'école des métiers du digital
        </div>
      </AbsoluteFill>

      {/* Left: campus constellation */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 230,
          width: MAP_W,
          height: MAP_H,
          opacity: progress(frame, cCampus - 4, 12),
        }}
      >
        {CAMPUSES.map((c, i) => {
          const { x, y } = project(c.lat, c.lon, MAP_W, MAP_H);
          const p = pop(frame, fps, cCampus + i * 2, 12);
          return (
            <React.Fragment key={c.name}>
              <div
                style={{
                  position: "absolute",
                  left: x - 13,
                  top: y - 13,
                  width: 26,
                  height: 26,
                  borderRadius: 26,
                  backgroundColor: colors.blue,
                  boxShadow: `0 0 30px ${colors.blue}`,
                  scale: String(p),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: x + 20,
                  top: y - 16,
                  fontFamily: textFont,
                  fontWeight: 500,
                  fontSize: 22,
                  color: colors.greyLight,
                  whiteSpace: "nowrap",
                  opacity: mapRange(p, [0.5, 1], [0, 0.9]),
                }}
              >
                {c.name === "Saint-Quentin-en-Yvelines" ? "" : c.name}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Right column, three successive states */}
      <div style={{ position: "absolute", left: 1010, top: 300, width: 780 }}>
        <div style={{ position: "absolute", opacity: campusCol }}>
          <Counter to={17} start={cCampus} duration={30} fontSize={260} />
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 72,
              color: colors.white,
            }}
          >
            campus en France
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            opacity: programsCol,
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <div style={{ display: "flex", gap: 22 }}>
            <Chip
              label="Bachelors · Bac+3"
              delay={cPrograms}
              active
              fontSize={44}
            />
            <Chip
              label="MBA · Bac+5"
              delay={cPrograms + 10}
              active
              fontSize={44}
            />
          </div>
          <Chip
            label="En initial ou en alternance"
            delay={cPrograms + 34}
            fontSize={44}
            style={{ alignSelf: "flex-start" }}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              marginTop: 30,
              width: 760,
            }}
          >
            <Chip label="Développement web" delay={cTracks1} fontSize={36} />
            <Chip label="Webdesign" delay={cTracks1 + 12} fontSize={36} />
            <Chip
              label="Marketing digital"
              delay={cTracks1 + 26}
              fontSize={36}
            />
            <Chip label="Data" delay={cTracks2} fontSize={36} />
            <Chip
              label="Création numérique"
              delay={cTracks2 + 10}
              fontSize={36}
            />
          </div>
        </div>

        <div style={{ position: "absolute", opacity: insertionCol }}>
          <Counter
            to={95}
            start={cInsertion}
            duration={45}
            suffix=" %"
            fontSize={260}
          />
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 64,
              color: colors.white,
              lineHeight: 1.1,
            }}
          >
            d'insertion
            <br />
            professionnelle
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
