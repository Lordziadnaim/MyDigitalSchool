import React from "react";
import { Composition, Folder } from "remotion";
import { VIDEO } from "./config/video";
import {
  SampleComposition,
  calculateSampleMetadata,
} from "./compositions/Sample/SampleComposition";
import { MainVideo } from "./compositions/MDSLinkedIn/MainVideo";
import {
  getScene,
  OUTRO_FRAMES,
  TOTAL_FRAMES,
} from "./compositions/MDSLinkedIn/timeline";
import { S1Reveil } from "./compositions/MDSLinkedIn/scenes/S1Reveil";
import { S2Routine } from "./compositions/MDSLinkedIn/scenes/S2Routine";
import { S3Talents } from "./compositions/MDSLinkedIn/scenes/S3Talents";
import { S4Declic } from "./compositions/MDSLinkedIn/scenes/S4Declic";
import { S5Croyance } from "./compositions/MDSLinkedIn/scenes/S5Croyance";
import { S6Virage } from "./compositions/MDSLinkedIn/scenes/S6Virage";
import { S7Ecole } from "./compositions/MDSLinkedIn/scenes/S7Ecole";
import { S8Question } from "./compositions/MDSLinkedIn/scenes/S8Question";
import { Outro } from "./compositions/MDSLinkedIn/scenes/Outro";

/**
 * Every renderable video is registered here.
 * Resolution and fps come from src/config/video.ts.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Demo of the toolkit — change durationInSeconds in the Studio props panel. */}
      <Composition
        id="Sample"
        component={SampleComposition}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 8}
        calculateMetadata={calculateSampleMetadata}
        defaultProps={{
          title: "Motion design avec Remotion",
          subtitle: "Texte animé, formes et transitions — 1920×1080 · 30 fps",
          durationInSeconds: 8,
        }}
      />

      {/* MyDigitalSchool — LinkedIn storytelling film (≈ 3 min). */}
      <Composition
        id="MDS-LinkedIn"
        component={MainVideo}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={TOTAL_FRAMES}
      />

      <Folder name="MDS-Scenes">
        <Composition
          id="MDS-S1-Reveil"
          component={S1Reveil}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={getScene("s1").duration}
        />
        <Composition
          id="MDS-S2-Routine"
          component={S2Routine}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={getScene("s2").duration}
        />
        <Composition
          id="MDS-S3-Talents"
          component={S3Talents}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={getScene("s3").duration}
        />
        <Composition
          id="MDS-S4-Declic"
          component={S4Declic}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={getScene("s4").duration}
        />
        <Composition
          id="MDS-S5-Croyance"
          component={S5Croyance}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={getScene("s5").duration}
        />
        <Composition
          id="MDS-S6-Virage"
          component={S6Virage}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={getScene("s6").duration}
        />
        <Composition
          id="MDS-S7-Ecole"
          component={S7Ecole}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={getScene("s7").duration}
        />
        <Composition
          id="MDS-S8-Question"
          component={S8Question}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={getScene("s8").duration}
        />
        <Composition
          id="MDS-Outro"
          component={Outro}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={OUTRO_FRAMES}
        />
      </Folder>
    </>
  );
};
