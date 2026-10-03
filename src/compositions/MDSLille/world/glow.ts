import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  PointsMaterial,
} from "three";

/**
 * Bloom substitute: post-processing renders blank under SwiftShader, so
 * glows are additive sprites (THREE.Points) with a soft radial texture.
 */
let haloTexture: CanvasTexture | null = null;

export const getHaloTexture = () => {
  if (haloTexture) return haloTexture;
  const size = 128;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.16)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  haloTexture = new CanvasTexture(c);
  return haloTexture;
};

export const makeHaloMaterial = (size: number) =>
  new PointsMaterial({
    size,
    map: getHaloTexture(),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
    fog: false,
  });

/** Points geometry with `n` positions and per-point colours (filled later). */
export const makePointsGeometry = (
  positions: readonly (readonly number[])[],
) => {
  const g = new BufferGeometry();
  const pos = new Float32Array(positions.length * 3);
  positions.forEach((p, i) => {
    pos[i * 3] = p[0];
    pos[i * 3 + 1] = p[1];
    pos[i * 3 + 2] = p[2];
  });
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(positions.length * 3), 3),
  );
  return g;
};
