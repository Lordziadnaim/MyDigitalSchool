import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../SceneShell";
import { Chip } from "../parts";
import { getScene } from "../timeline";
import { CAMPUSES, project } from "../campuses";
import { colors } from "../../../brand/theme";
import { displayFont, textFont } from "../../../brand/fonts";
import { Logo } from "../../../components/Logo";
import { Counter } from "../../../components/Counter";
import { Ring } from "../../../components/Shapes";
import { fadeInOut, mapRange, pop, progress } from "../../../lib/animation";

const MAP_W = 760;
const MAP_H = 720;

/**
 * Scene 7 — the brand reveal. Figures come from the official homepage
 * (see script.json → sources): 17 campus, 20 formations certified by the
 * State, +1800 partner companies, 82 % employment rate after an MBA.
 */
export const S7Ecole: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cues } = getScene("s7");
  const [
    cPropose,
    cSchool,
    cCampus,
    cPrograms,
    cCertified,
    cSectors1,
    cSectors2,
    cPartners,
    cInsertion,
  ] = cues;

  const reveal = progress(frame, cPropose + 30, 40);
  const burst = progress(frame, cPropose + 34, 40);
  const dock = progress(frame, cCampus - 10, 26);
  const campusCol = fadeInOut(frame, cCampus, cPrograms, 10);
  const programsCol = fadeInOut(frame, cPrograms, cPartners, 10);
  const partnersCol = fadeInOut(frame, cPartners, cInsertion, 10);
  const insertionCol = progress(frame, cInsertion, 10);

  return (
    <SceneShell id="s7" glow={0.95}>
      {/* Logo: center, then docks at the top */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          translate: `0px ${mapRange(dock, [0, 1], [-70, -415])}px`,
          scale: String(mapRange(dock, [0, 1], [1, 0.42])),
        }}
      >
        <Ring
          size={1000}
          progress={burst}
          stroke={4}
          style={{
            position: "absolute",
            opacity: (1 - burst) * 0.9,
            scale: String(0.6 + burst * 0.8),
          }}
        />
        <Logo width={820} progress={reveal} />
        <div
          style={{
            marginTop: 40,
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 60,
            color: colors.white,
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

      {/* Right column, successive states */}
      <div style={{ position: "absolute", left: 1010, top: 290, width: 800 }}>
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
            gap: 24,
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 76,
              color: colors.white,
              opacity: progress(frame, cPrograms, 12),
            }}
          >
            <span style={{ color: colors.blue }}>20</span> formations
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <Chip
              label="BTS · Bac+2"
              delay={cPrograms + 10}
              active
              fontSize={34}
            />
            <Chip
              label="Bachelor · Bac+3"
              delay={cPrograms + 18}
              active
              fontSize={34}
            />
            <Chip
              label="MBA · Bac+5"
              delay={cPrograms + 26}
              active
              fontSize={34}
            />
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <Chip
              label="Certifiées par l'État"
              delay={cCertified}
              fontSize={36}
              style={{ backgroundColor: colors.pink, borderColor: colors.pink }}
            />
            <Chip
              label="Initial ou alternance"
              delay={cCertified + 30}
              fontSize={36}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              marginTop: 24,
              width: 800,
            }}
          >
            <Chip label="Marketing digital" delay={cSectors1} fontSize={36} />
            <Chip
              label="Design & création web"
              delay={cSectors1 + 26}
              fontSize={36}
            />
            <Chip
              label="Informatique & développement"
              delay={cSectors2}
              fontSize={36}
            />
          </div>
        </div>

        <div style={{ position: "absolute", opacity: partnersCol }}>
          <Counter
            to={1800}
            start={cPartners}
            duration={45}
            prefix="+"
            fontSize={220}
          />
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 60,
              color: colors.white,
              lineHeight: 1.1,
            }}
          >
            entreprises partenaires
            <br />
            qui recrutent en alternance
          </div>
        </div>

        <div style={{ position: "absolute", opacity: insertionCol }}>
          <Counter
            to={82}
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
            de taux d'insertion
            <br />
            après un MBA
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: textFont,
              fontSize: 26,
              color: colors.greyLight,
            }}
          >
            Enquête France Compétences, promotion 2024
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
