# V3 — « Sauf une. » · Campus de Lille · Stratégie créative

Film 3D de **56 s**, **1080×1350 (4:5) à 60 fps**, pour le fil LinkedIn mobile,
plus un **cut de 15 s** (publicité / stories).
Compositions Remotion : `MDS-Lille` et `MDS-Lille-Cut15`.
Rendu : `npm run render:lille` · `npm run render:lille15`.

## 1. L'intention : un film, pas une pub

Cible au **niveau 1 de Schwartz (inconscient)** : elle ne cherche pas d'école
et zappe tout ce qui ressemble à de la publicité. Donc :

- **aucun logo, aucun chiffre, aucun « inscris-toi »** pendant 48 s ;
- un **personnage** (Inès) et une **situation vraie** : créer la nuit, en
  cachette, en pensant que c'est du temps perdu ;
- **un seul plan-séquence** en 3D, comme une ouverture de film : on survole
  Lille, on entre par la seule fenêtre allumée, on ressort, la ville
  s'allume ;
- la marque n'apparaît qu'en **signature**, avec la phrase officielle de
  l'école qui devient la morale de l'histoire : « Ici, les talents se
  connectent. »

Références de mise en scène : les plans-séquences d'ouverture (*Fenêtre sur
cour*, *Amélie*, le survol de Paris de *Ratatouille*), le dispositif « une
fenêtre allumée dans une ville endormie », le rythme d'une bande-annonce
indé : silence → intimité → révélation → lumière.

## 2. Ce qui retient l'attention (rétention)

| Temps | Mécanisme |
| --- | --- |
| 0–6 s | **Hook par le mystère** : « Deux heures dix-sept. Lille. Toutes les fenêtres sont éteintes. » Les fenêtres s'éteignent une à une → « Sauf une. » (son cristallin). Une question s'ouvre : *qui ?* |
| 6–10 s | **Mouvement continu** : la caméra plonge vers la fenêtre et la traverse. Aucune coupe, le pouce n'a pas de « point de sortie ». |
| 10–22 s | **Miroir** : ce qu'elle fait la nuit (montage, logos, typo) jaillit de l'écran en objets 3D. Le spectateur se reconnaît. |
| 23–27 s | **Tension** : notifications de ses potes (« tu perds ton temps »), sa lumière baisse. « Et elle… elle les croit. » |
| 27–34 s | **Révélation** : on ressort, l'horloge du beffroi indique 2 h 17, et des dizaines de fenêtres turquoise s'allument dans toute la ville. « Elle n'est pas la seule. » |
| 34–42 s | **Connexion** : leurs lumières filent vers un bâtiment près de Lille-Flandres ; l'aube se lève, ce bâtiment reste allumé « en plein jour ». |
| 43–48 s | **Interpellation** : « Si la tienne est encore allumée à deux heures… c'est peut-être pas du temps perdu. » |
| 48–56 s | **Signature** : « Ici, les talents se connectent. » + logo + Campus de Lille, 57 rue Pierre Mauroy. |

## 3. Ancrage local (Lille)

Ville miniature procédurale inspirée de Lille : maisons flamandes en brique
à **pignons à pas de moineau**, **Grand'Place** et colonne de la **Déesse**,
**beffroi** de la Chambre de commerce (horloge figée sur 2 h 17), **gare
Lille-Flandres** (grande verrière, horloge) et, entre les deux, le campus
**57 rue Pierre Mauroy, à 3 min à pied de la gare** (adresse publique de
l'école). Le bâtiment du campus est stylisé, sans enseigne : on ne
reproduit pas un lieu réel à l'identique.

## 4. Son et voix

- Voix off **« Kael – Professional Narrator »** (ElevenLabs `eleven_v4`),
  française, grave et posée : un narrateur de film, pas un vendeur.
  Une prise par réplique (`public/v3/voice/n01…n09.mp3`, silences coupés,
  normalisées à −16 LUFS par gain linéaire + limiteur ; originaux dans `raw/`).
- Musique originale ElevenLabs Music v2.5 (56 s) : piano feutré → cordes →
  montée → résolution majeure à l'aube → piano seul
  (`public/v3/music/score.mp3`), baissée automatiquement sous la voix.
- Clavier, chimes cristallins à chaque fenêtre clé, souffle de caméra,
  oiseaux et tram à l'aube (`public/v3/sfx/`). Pas d'ambiance continue la
  nuit : celle générée n'était qu'un grondement grave (effet « ventilation »).
- Normalisation par gain linéaire uniquement (voir AGENTS.md › 3D).
- Sous-titres « film » (lecture sans le son, majoritaire sur LinkedIn).

## 5. DA

Nuit violet profond (`colors.ink`), turquoise de la marque `#2DB8C5` pour
**toutes les lumières des créatifs** (le fil rouge visuel : la couleur de
« DIGITAL » et du cerveau droit du logo), violet `#662483` pour le sweat
d'Inès, rose `#E71D73` pour l'étiquette « Campus de Lille ». Typo Bricolage
Grotesque + Inter, logo officiel animé. Grain argentique et vignette.

## 6. Technique

- 3D en **React Three Fiber** via `@remotion/three` (pas de Blender) ; tout
  est une fonction pure du temps `t` (rendu déterministe).
- Pas de post-processing (non supporté en rendu logiciel) : les halos sont
  des sprites additifs (`world/glow.ts`).
- Rendu en WebGL logiciel : `REMOTION_GL=swangle` (déjà dans les scripts
  npm). Compter ~0,5–1 s par image sur 4 cœurs.
- Timeline : `src/compositions/MDSLille/edit.ts` (répliques, beats, SFX) ;
  caméra : `camera.ts` (clés en secondes) ; ville : `city.ts`.

## 7. Cut 15 s

« Toutes les fenêtres sont éteintes. Sauf une. » → « Ce qu'elle ne sait
pas… elle n'est pas la seule. » → « Si la tienne est encore allumée à deux
heures… c'est peut-être pas du temps perdu. » → signature. Mêmes plans,
quatre morceaux (`CUT_PIECES` dans `LilleFilm.tsx`).

## 8. Texte de post suggéré

> 2 h 17, Lille. Toutes les fenêtres sont éteintes. Sauf une.
> (Et si la tienne aussi était allumée ?)

## 9. À valider avant diffusion

- Accord de l'école pour l'usage du logo et de l'adresse du campus.
- Prénom « Inès » et messages des amis : fictifs.
