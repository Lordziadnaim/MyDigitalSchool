#!/usr/bin/env node
/**
 * Scaffold a new composition and register it in src/Root.tsx.
 *
 *   npm run new -- MyPromo            # 1920×1080 · 30 fps · 10 s
 *   npm run new -- MyPromo 15         # 15 seconds
 *
 * Creates src/compositions/<Name>/<Name>.tsx from a template that already
 * uses the brand Background, AnimatedText and a TransitionSeries.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [name, secondsArg] = process.argv.slice(2);

if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error("Usage: npm run new -- <PascalCaseName> [durationInSeconds]");
  process.exit(1);
}
const seconds = Number(secondsArg ?? 10);
const dir = join(root, "src/compositions", name);
const file = join(dir, `${name}.tsx`);
if (existsSync(file)) {
  console.error(`${file} already exists`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });
writeFileSync(
  file,
  `import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Background } from "../../components/Background";
import { AnimatedText } from "../../components/AnimatedText";

export type ${name}Props = {
  readonly title: string;
};

const SceneOne: React.FC<{ readonly title: string }> = ({ title }) => (
  <>
    <Background glow={0.7} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <AnimatedText text={title} start={6} fontSize={110} />
    </AbsoluteFill>
  </>
);

const SceneTwo: React.FC = () => (
  <>
    <Background glow={0.4} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <AnimatedText text="Deuxième scène" start={6} fontSize={96} highlight={["scène"]} />
    </AbsoluteFill>
  </>
);

export const ${name}: React.FC<${name}Props> = ({ title }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const transition = 15;
  const first = Math.round((durationInFrames + transition) / 2);
  const second = durationInFrames + transition - first;
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Scene 1" durationInFrames={first} premountFor={fps}>
        <SceneOne title={title} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: transition })} />
      <TransitionSeries.Sequence name="Scene 2" durationInFrames={second} premountFor={fps}>
        <SceneTwo />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
`,
);

const rootFile = join(root, "src/Root.tsx");
let rootSrc = readFileSync(rootFile, "utf8");
const importLine = `import { ${name} } from "./compositions/${name}/${name}";\n`;
const imports = [...rootSrc.matchAll(/^import .*;$/gm)];
const afterImports = imports.length
  ? imports[imports.length - 1].index +
    imports[imports.length - 1][0].length +
    1
  : 0;
rootSrc =
  rootSrc.slice(0, afterImports) + importLine + rootSrc.slice(afterImports);
const registration = `      <Composition
        id="${name}"
        component={${name}}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * ${seconds}}
        defaultProps={{ title: "${name}" }}
      />
`;
const closing = rootSrc.lastIndexOf("    </>");
rootSrc = rootSrc.slice(0, closing) + registration + rootSrc.slice(closing);
writeFileSync(rootFile, rootSrc);

console.log(`Created ${file}`);
console.log(`Registered <Composition id="${name}"> in src/Root.tsx`);
console.log(`Preview:  npm run dev   → open "${name}" in the sidebar`);
console.log(`Render:   npx remotion render ${name} out/${name}.mp4`);
