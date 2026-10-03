import React from "react";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Background } from "../../components/Background";
import { Captions } from "../../components/Captions";
import { getScene, type SceneId } from "./timeline";

type Props = {
  readonly id: SceneId;
  readonly glow?: number;
  readonly desaturate?: number;
  readonly children: React.ReactNode;
};

/**
 * Wraps a scene with its brand background, its voiceover clip and burned-in
 * captions. Because audio + captions live inside the scene, every scene can
 * also be previewed on its own in the Studio (folder "MDS-Scenes").
 */
export const SceneShell: React.FC<Props> = ({
  id,
  glow,
  desaturate,
  children,
}) => {
  const { fps } = useVideoConfig();
  const scene = getScene(id);
  return (
    <AbsoluteFill>
      <Background glow={glow} desaturate={desaturate} />
      <AbsoluteFill>{children}</AbsoluteFill>
      <Audio
        name={`Voix ${id}`}
        src={staticFile(scene.audio)}
        from={scene.lead}
        premountFor={fps}
      />
      <Captions lines={scene.captions} offsetFrames={scene.lead} />
    </AbsoluteFill>
  );
};
