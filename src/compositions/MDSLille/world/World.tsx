import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { cameraAt } from "../camera";
import { Atmosphere } from "./Atmosphere";
import { Ground, Houses, Threads, Windows } from "./City";
import { Belfry, Campus, Deesse, Gare } from "./Landmarks";
import { InesHouse } from "./InesRoom";

/**
 * Camera rig. useLayoutEffect (not useEffect) so the camera is updated
 * before <ThreeCanvas> renders the frame.
 */
const CameraRig: React.FC<{ readonly t: number }> = ({ t }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  useLayoutEffect(() => {
    const { pos, look, fov } = cameraAt(t);
    camera.position.copy(pos);
    camera.lookAt(look);
    camera.fov = fov;
    camera.near = 0.01;
    camera.far = 400;
    camera.updateProjectionMatrix();
  }, [t, camera]);
  return null;
};

/** The whole miniature Lille, as a pure function of film time `t` (s). */
export const World: React.FC<{ readonly t: number }> = ({ t }) => (
  <>
    <CameraRig t={t} />
    <Atmosphere t={t} />
    <Ground t={t} />
    <Houses />
    <Windows t={t} />
    <Belfry t={t} />
    <Deesse />
    <Gare t={t} />
    <Campus t={t} />
    <InesHouse t={t} />
    <Threads t={t} />
  </>
);
