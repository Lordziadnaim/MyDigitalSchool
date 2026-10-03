# MyDigitalSchool — vidéos motion design (Remotion)

Projet [Remotion](https://www.remotion.dev/docs) **4.0.532** pour créer des
vidéos motion design programmatiques aux couleurs de MyDigitalSchool, pensé
pour être piloté par des agents IA (voir [`AGENTS.md`](AGENTS.md)).

Contenu :

- **`MDS-Hook60` (V2, film principal)** : « Stop. Ne scrolle pas. » — 62 s,
  1920×1080 à **60 fps**, hook dès la 1re seconde, montage nerveux calé sur la
  musique, voix française (accent parisien) ElevenLabs v4, sound design,
  sous-titres mot à mot. Stratégie : [`docs/v2-strategie-creative.md`](docs/v2-strategie-creative.md).
- **`MDS-LinkedIn` (V1)** : version storytelling de 3 min (30 fps).
  Brief : [`docs/brief-linkedin-icp-inconscient.md`](docs/brief-linkedin-icp-inconscient.md).
- **`Sample`** : composition de démonstration (texte animé, formes,
  transitions) dont la durée se règle par la prop `durationInSeconds`.
- Une boîte à outils réutilisable : charte (`src/brand`), utilitaires
  d'animation (`src/lib`), composants (`src/components`).

## Démarrer

```bash
git clone <ce dépôt> && cd MyDigitalSchool
npm i                       # installe Remotion et les dépendances
npm run dev                 # ouvre Remotion Studio → http://localhost:3000
```

Dans le Studio, choisissez `MDS-LinkedIn`, `Sample`, ou une scène du
dossier `MDS-Scenes` dans la barre latérale.

## Exporter en MP4

```bash
npm run render              # → out/MDS-Hook60.mp4 (V2, 62 s, 60 fps)
npm run render:v1           # → out/MDS-LinkedIn.mp4 (V1, 3:00, 30 fps)
npm run render:sample       # → out/sample.mp4
npx remotion render <Id> out/<fichier>.mp4      # n'importe quelle composition
npx remotion render Sample out/sample-12s.mp4 --props='{"durationInSeconds":12}'
```

Le rendu est aussi disponible depuis le bouton **Render** du Studio.

## Créer une nouvelle composition

```bash
npm run new -- MonPromo 15  # crée src/compositions/MonPromo/MonPromo.tsx (15 s) et l'enregistre dans Root.tsx
npm run dev                 # puis ouvrez "MonPromo" dans le Studio
```

## Modifier résolution / fps / durée

- `src/config/video.ts` : `width`, `height`, `fps` (60 par défaut).
- `src/compositions/MDSHook/edit.ts` : durée (`TOTAL_SECONDS`), placement de chaque réplique, coupes, effets sonores.
- `src/compositions/MDSLinkedIn/timeline.ts` : `TARGET_SECONDS` (durée totale du film).
- Prop `durationInSeconds` de `Sample`.

## Voix off

Script et sous-titres : `src/compositions/MDSLinkedIn/script.json`. Après
avoir régénéré un fichier dans `public/voiceover/`, lancez
`npm run sync:voiceover` : durées, sous-titres et synchronisation des
animations se recalculent seuls.

## Charte graphique

Reprise de la home page officielle et du logo : violet `#662483`, turquoise
`#2DB8C5`, rose `#E71D73`, cyan clair `#E0F5F7`, gris `#3C3C3B` ;
Bricolage Grotesque + Inter ; logo vectoriel officiel dans `public/brand/`
et composant animé `src/components/Logo.tsx`.

## Avant publication

- Faire valider par l'école les chiffres utilisés (17 campus, 20 formations
  certifiées, +1800 entreprises partenaires, 82 % d'insertion après un MBA)
  et la formulation « payé·e pendant ta formation / études financées ».
