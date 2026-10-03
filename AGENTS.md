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
| Render the LinkedIn film | `npm run render` → `out/MDS-LinkedIn.mp4` |
| Render the sample | `npm run render:sample` → `out/sample.mp4` |
| Render any composition | `npx remotion render <CompositionId> out/<name>.mp4` |
| Render one frame | `npx remotion still <CompositionId> out/frame.png --frame=120` |
| New composition | `npm run new -- MyPromo 15` (name, seconds) |
| Re-sync voiceover/captions | `npm run sync:voiceover` |
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
                           Icons, Wordmark
  compositions/
    Sample/                toolkit demo (1920×1080, 30 fps, duration prop)
    MDSLinkedIn/           the 3-min LinkedIn film
      script.json          voiceover text + caption lines per scene (source of truth)
      voiceover.generated.json  durations + caption timings (generated)
      timeline.ts          scene lengths, cues, total = 180 s
      SceneShell.tsx       background + voice clip + captions for a scene
      scenes/S1…S8, Outro  one file per scene
public/
  voiceover/sN.mp3         ElevenLabs v4 takes (loudness-normalized); raw/ = originals
  music/bed.mp3            ElevenLabs Music bed; raw/ = original
  fonts/                   Montserrat + Inter woff2
scripts/
  sync-voiceover.mjs       ffprobe + silence detection → caption timings
  new-composition.mjs      scaffolds + registers a composition
```

## Changing resolution, frame rate, duration

- Global size / fps: edit `src/config/video.ts`. Every composition reads it.
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

- Colors (`brand/theme.ts`): blue `#2DB8C5`, ink `#14071A`, white. Grey
  tones are only for the "routine / before" mood.
- Principle from the school: black = IT expertise, blue = freedom to create.
- `Wordmark` is a **typographic placeholder**, not the official logo. Put
  the official SVG in `public/brand/logo.svg` and pass
  `logoSrc={staticFile("brand/logo.svg")}`.
- Tone: tutoiement, warm, concrete, never pushy. Facts used in the film
  (17 campus, Bachelors/MBA, initial or alternance, 95 % insertion) must be
  re-validated with the school before publishing.

## Audio & sync

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
