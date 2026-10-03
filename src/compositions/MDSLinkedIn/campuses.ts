/**
 * MyDigitalSchool campuses in France (17), with approximate coordinates
 * used to plot them as a constellation. Source: school campus pages
 * (mydigitalschool.com/ecole-multimedia-<ville>). Update if the network changes.
 */
export const CAMPUSES: { name: string; lat: number; lon: number }[] = [
  { name: "Angers", lat: 47.47, lon: -0.55 },
  { name: "Annecy", lat: 45.9, lon: 6.13 },
  { name: "Bordeaux", lat: 44.84, lon: -0.58 },
  { name: "Caen", lat: 49.18, lon: -0.37 },
  { name: "Grenoble", lat: 45.19, lon: 5.72 },
  { name: "Lille", lat: 50.63, lon: 3.06 },
  { name: "Lyon", lat: 45.76, lon: 4.84 },
  { name: "Melun", lat: 48.54, lon: 2.66 },
  { name: "Montpellier", lat: 43.61, lon: 3.88 },
  { name: "Nancy", lat: 48.69, lon: 6.18 },
  { name: "Nantes", lat: 47.22, lon: -1.55 },
  { name: "Nice", lat: 43.7, lon: 7.27 },
  { name: "Paris", lat: 48.86, lon: 2.35 },
  { name: "Rennes", lat: 48.11, lon: -1.68 },
  { name: "Saint-Quentin-en-Yvelines", lat: 48.77, lon: 2.04 },
  { name: "Toulouse", lat: 43.6, lon: 1.44 },
  { name: "Vannes", lat: 47.66, lon: -2.76 },
];

/** Equirectangular projection of metropolitan France into a w×h box. */
export const project = (lat: number, lon: number, w: number, h: number) => {
  const minLon = -4.8;
  const maxLon = 8.2;
  const minLat = 42.3;
  const maxLat = 51.1;
  // Correct longitude scale at ~46.5°N.
  const kx = Math.cos((46.5 * Math.PI) / 180);
  const spanX = (maxLon - minLon) * kx;
  const spanY = maxLat - minLat;
  const scale = Math.min(w / spanX, h / spanY);
  const ox = (w - spanX * scale) / 2;
  const oy = (h - spanY * scale) / 2;
  return {
    x: ox + (lon - minLon) * kx * scale,
    y: oy + (maxLat - lat) * scale,
  };
};
