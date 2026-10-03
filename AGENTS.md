# AGENTS.md — MyDigitalSchool motion design (Remotion)

Instructions for AI coding agents (Claude Code, Codex, Cursor…) working in
this repository. Videos are React components rendered frame by frame by
[Remotion](https://www.remotion.dev/docs) **4.0.532**.

Official Remotion agent skills are installed in `.agents/skills/` (linked in
`.claude/skills/`). Load `remotion-best-practices` first; it routes to the
right sub-guide (markup, transitions, audio, captions, render…).

## Commands

| Task | Command |
| --- | --- |
| Install | `npm i` |
| Open Remotion Studio (preview) | `npm run dev` → http://localhost:3000 |
| Render the V2 film (62 s, 60 fps) | `npm run render` → `out/MDS-Hook60.mp4` |
| Render the V3 Lille 3D film (56 s, 4:5, 60 fps) | `npm run render:lille` → `out/MDS-Lille.mp4` (+ `render:lille15` for the 15 s cut) |
| Render the V1 film (3 min, 30 fps) | `npm run render:v1` → `out/MDS-LinkedIn.mp4` |
| Render the sample | `npm run render:sample` → `out/sample.mp4` |
| Render any composition | `npx remotion render <CompositionId> out/<name>.mp4` |
| Render one frame | `npx remotion still <CompositionId> out/frame.png --frame=120` |
| New composition | `npm run new -- MyPromo 15` (name, seconds) |
| Re-sync voiceover/captions | `npm run sync:v2` (V2) · `npm run sync:voiceover` (V1) |
| Lint + typecheck | `npm run lint` |

Always run `npm run lint` after editing. To check visuals without opening
the Studio, render a few stills (`npx remotion still … --scale=0.5`) and
look at them.

## Project map

```
src/
  index.ts                 registerRoot()
  Root.tsx                 every <Composition> (ids, size, fps, duration)
  config/video.ts          VIDEO = { width, height, fps } + seconds()
  brand/theme.ts           MyDigitalSchool colors, radii, safe area
  brand/fonts.ts           self-hosted fonts (public/fonts) via @remotion/fonts
  lib/animation.ts         progress, fadeInOut, pop, softSpring, stagger, float…
  components/              reusable: Background, AnimatedText, Captions,
                           Counter, Card, Shapes (Ring, GrowLine, DrawPath, Dot),
                           Icons, Logo (official logo, animated)
  compositions/
    Sample/                toolkit demo (1920×1080, 30 fps, duration prop)
    MDSHook/               V2 — « Stop. Ne scrolle pas. » 62 s, 60 fps (main film)
      edit.ts              edit decision list in SECONDS: voice lines, scene cuts, SFX, hits
      fx.tsx               Camera shake, Flash, Glitch, FilmFinish (grain), KineticCaptions,
                           ProgressBar, BigWord, useTime() (absolute seconds in any scene)
      HookFilm.tsx         assembly: scenes, voice clips, SFX, music re-cut + ducking
      scenes/              Hook, Montage, Drop, Solution, Brand (+ Stage, Phone)
    MDSLille/              V3 — « Sauf une. » 3D one-shot film, campus de Lille, 1080×1350
      edit.ts              voice lines (+ subtitle chunks), story BEATS, SFX — all in seconds
      city.ts              procedural miniature Lille (houses, windows, Inès, campus, belfry, gare)
      camera.ts            the single camera move: keys in seconds, monotone-cubic timing
      world/               R3F scene: Atmosphere (sky/fog/lights), City (instanced houses,
                           windows, halos, light threads), Landmarks, InesRoom (her room)
      Overlay.tsx          location card, subtitles, phone notifications, end card
      LilleFilm.tsx        FilmShot (3D + overlays from any start time), FilmAudio, 15 s cut
    MDSLinkedIn/           V1 — the 3-min storytelling film (30 fps)
      script.json          voiceover text + caption lines per scene (source of truth)
      voiceover.generated.json  durations + caption timings (generated)
      timeline.ts          scene lengths, cues, total = 180 s
      SceneShell.tsx       background + voice clip + captions for a scene
      scenes/S1…S8, Outro  one file per scene
public/
  voiceover/sN.mp3         ElevenLabs v4 takes (loudness-normalized); raw/ = originals
  music/bed.mp3            ElevenLabs Music bed; raw/ = original
  brand/                   official logo: logo.svg (colour), logo-white.svg
  fonts/                   Bricolage Grotesque + Inter woff2 (same as the website)
scripts/
  sync-voiceover.mjs       ffprobe + silence detection → caption timings
  new-composition.mjs      scaffolds + registers a composition
```

## Changing resolution, frame rate, duration

- **Default frame rate is 60 fps** (`VIDEO.fps` in `src/config/video.ts`).
  Write new animations in **seconds** (see `MDSHook/fx.tsx` → `useTime()`,
  `ease()`, `slam()`), never in raw frames, so they work at any fps.
- V1 and Sample are pinned to `LEGACY_FPS` (30) because parts of them are
  written in frames.
- V2 length: `TOTAL_SECONDS` in `MDSHook/edit.ts`; move a voice line by
  editing its `at`; `edit.ts` throws if two lines overlap.
- Durations are written in seconds and converted with `seconds()` or
  `VIDEO.fps * n`, so changing fps keeps timing identical.
- Sample: change the `durationInSeconds` prop (Studio props panel or
  `--props='{"durationInSeconds":12}'`); `calculateMetadata` resizes it.
- LinkedIn film: total length is `TARGET_SECONDS` in `timeline.ts`; the
  outro absorbs the difference. Lead-in / tail per scene are also there.
- Square / portrait variant: register another `<Composition>` with other
  width/height. Layouts use the 1920×1080 safe area (`brand/theme.ts`);
  check stills when changing aspect ratio.

## How to build a scene

1. Create `src/compositions/<Video>/scenes/MyScene.tsx`; frame 0 is the
   start of the scene wherever it is placed.
2. Background first, content in a positioned layer above it
   (`<Background/>` then `<AbsoluteFill>…</AbsoluteFill>`). Absolutely
   positioned layers paint above in-flow elements, so never put content
   *inside the same flex container after* an absolute background.
3. Drive every animation from `useCurrentFrame()` with the helpers in
   `lib/animation.ts` or `interpolate()`/`spring()`. **Never** use CSS
   transitions, CSS animations, `setTimeout` or `Math.random()` (use
   `random(seed)` from `remotion`) — renders must be deterministic.
4. Prefer the `scale`, `translate`, `rotate` CSS properties over
   `transform` strings.
5. Chain scenes with `<TransitionSeries>` (`@remotion/transitions`: `fade`,
   `slide`, `wipe`…). A transition overlaps both scenes, so total duration
   = sum of scenes − sum of transitions.
6. Put `premountFor={fps}` on every Sequence / TransitionSeries.Sequence /
   media element.
7. Register substantial scenes as their own `<Composition>` (see the
   `MDS-Scenes` folder in `Root.tsx`) so they can be previewed alone.

## Typography

- `AnimatedText` = word-by-word kinetic reveal (spring + blur). Props:
  `text`, `start`, `stagger`, `highlight` (words colored blue), `fontSize`,
  `end` (fade out frame).
- Minimum sizes at 1920 px wide: headline ≥ 84 px, supporting text ≥ 44 px,
  captions 40 px. Keep text ≥ 120 px from the sides and ≥ 100 px from
  top/bottom.
- Fonts are local (`public/fonts`). To add a font: drop the woff2 there and
  add a face in `brand/fonts.ts`. Don't load fonts from the network at
  render time.

## Brand (DA MyDigitalSchool)

- Source: official homepage (PDF print, oct. 2026) + official logo.
- Colors (`brand/theme.ts`): purple `#662483` (blocks, buttons), turquoise
  `#2DB8C5` (logo right brain, "DIGITAL", highlights), pink `#E71D73` (tags),
  light cyan `#E0F5F7` (light sections), dark grey `#3C3C3B` (logo left
  brain, text). Video backgrounds use a deep purple (`colors.ink`). Grey
  desaturation is only for the "routine / before" mood.
- Typography: Bricolage Grotesque ExtraBold for titles, Inter for text —
  the same pairing as mydigitalschool.com.
- Logo: `<Logo width={600} progress={0→1} variant="white" | "color" />`
  (`components/Logo.tsx`). It is drawn from the official vector paths
  (`brand/logo-paths.ts`, also `public/brand/logo*.svg`); the two brain
  halves slide in, then the lettering is revealed. Use `white` on purple,
  `color` on white / light cyan. Never redraw or recolour the logo.
- Pink section tags = `Kicker` (`MDSLinkedIn/parts.tsx`), like the site's
  "TITRE RNCP" tags.
- Tone: tutoiement, warm, concrete, never pushy. Site taglines: « L'école des
  métiers du digital », « Ici, les talents se connectent », « Révèle ton
  potentiel dans les métiers du digital ».
- Official figures (homepage, oct. 2026): 17 campus, 20 formations du BTS au
  MBA certifiées par l'État (RNCP), +1800 entreprises partenaires (étude
  interne 2025), 82 % de taux d'insertion après un MBA (enquête France
  Compétences, promotion 2024), 5 000 alumni en poste. Don't invent others.

## Audio & sync

V2 (`MDSHook`): voice "Alexandre – Commercial & Brand Voice"
(`EGS8Z4YTFhSL6Mm6LpoK`, ElevenLabs `eleven_v4`, native Parisian accent —
the client explicitly wants 100 % France, no Canadian accent). One clip per
line in `public/v2/voice/` (silence-trimmed, loudness-normalized; originals in
`raw/`). After replacing a clip run `npm run sync:v2`. SFX in
`public/v2/sfx/`, music in `public/v2/music/` (re-cut in `HookFilm.tsx`).

V1:

- Use `<Audio>` from `@remotion/media` with `staticFile()`.
- Voiceover workflow (ElevenLabs, model `eleven_v4`, voice "Pierre"
  `sW4oAri1O4pOd4MpNWmn`):
  1. Edit the `tts` text and `captions` lines in `script.json`.
  2. Regenerate the clip (ElevenLabs MCP / API), save the raw take to
     `public/voiceover/raw/sN.mp3`, normalize:
     `ffmpeg -i public/voiceover/raw/sN.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11 public/voiceover/sN.mp3`
  3. `npm run sync:voiceover` → durations and caption timings update, and
     every scene re-times itself (scene cues come from caption starts).
- In a scene, `getScene("sN").cues[i]` is the frame where caption line *i*
  starts: use it to sync visuals to the voice.
- Music is ducked automatically under the voice (`musicVolume` in
  `MainVideo.tsx`).

## 3D (V3 / `@remotion/three`)

- `<ThreeCanvas>` from `@remotion/three` with React Three Fiber; no Blender.
  The world is a pure function of film time `t`, passed down as a prop.
- Never use R3F's `useFrame`. Update cameras, instanced meshes and buffer
  attributes in `useLayoutEffect` (it runs before ThreeCanvas renders the
  frame; `useEffect` would lag one frame).
- No GPU in the render container: renders use SwiftShader. Set
  `REMOTION_GL=swangle` (read by `remotion.config.ts`; already in the
  `render:lille*` scripts). `@react-three/postprocessing` (Bloom) renders
  blank under SwiftShader — fake glow with additive sprites (`world/glow.ts`).
- Canvas textures that draw text need the fonts first: `FilmShot` waits for
  `document.fonts.load()` before mounting the canvas.
- Voice for V3: "Kael – Professional Narrator" (`yG4Uc56cLYQyZFnWaYv2`,
  `eleven_v4`), clips in `public/v3/voice/`. After replacing a clip, update
  its `dur` (ffprobe) and caption offsets in `MDSLille/edit.ts`.

## Rendering

- Defaults in `remotion.config.ts`: H.264, CRF 18, yuv420p, AAC — fits
  LinkedIn (≤ 10 min, ≤ 5 GB, MP4).
- If Chrome Headless Shell can't be downloaded (restricted network), set
  `REMOTION_BROWSER_EXECUTABLE=/path/to/chrome` before rendering.
- Output goes to `out/` (git-ignored).

## Docs

- Fundamentals: https://www.remotion.dev/docs/the-fundamentals
- Compositions: https://www.remotion.dev/docs/composition
- Transitions: https://www.remotion.dev/docs/transitions/transitionseries
- Audio: https://www.remotion.dev/docs/media/audio
- CLI render: https://www.remotion.dev/docs/cli/render
- Studio: https://www.remotion.dev/docs/cli/studio
