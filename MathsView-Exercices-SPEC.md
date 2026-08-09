# MathsView — Module « Exercices & Progression »

Spécification pour implémentation. Ce document décrit un **module parallèle** aux
leçons existantes de MathsView : un moteur d'exercices générés, un système de
progression par ceintures, des trophées, une boutique de récompenses et une page
d'administration multi-profils.

---

## 0. Contraintes à respecter absolument

Ces contraintes viennent du projet existant. Elles ne sont pas négociables.

1. **Aucune installation, aucun build.** JavaScript vanilla, chargé par balises
   `<script>`. Pas de npm, pas de bundler, pas de framework.
2. **Fonctionne hors-ligne.** Toute dépendance nouvelle se vendorise dans `vendor/`.
   Aucun appel réseau au runtime.
3. **`js/app.js` n'est pas modifié**, sauf pour un seul ajout décrit en §11.2.
   Le module exercices vit à côté du moteur de leçons, pas dedans.
4. **Persistance en `localStorage` uniquement.** Pas de serveur, `serve.sh` reste
   tel quel. Conséquence directe : l'export/import JSON de §7.5 est une
   fonctionnalité **critique**, pas un bonus.
5. **Le pool `js/fonctions-base.js` n'est pas modifié.** Il est consommé en
   lecture seule (§3).
6. Français partout : libellés, virgule décimale, vrai signe « − » (U+2212),
   intervalles à la française (`]−2 ; 2[`).

---

## 1. Vue d'ensemble

Trois couches indépendantes, à implémenter dans cet ordre :

| Couche | Rôle | Fichiers |
|---|---|---|
| **Générateurs** | Produisent énoncé + réponse + correction | `exos/<niveau>/*.js` |
| **Moteur** | Tirage, session, validation, scoring | `js/exos-base.js` |
| **Progression** | Maîtrise, ceintures, trophées, boutique, profils | `js/progression.js`, `js/profils.js`, `js/boutique.js` |

Principe directeur, hérité du pool de fonctions : **un générateur fournit le
strict minimum, le moteur déduit tout le reste.** Un générateur ne connaît ni les
points, ni les ceintures, ni le chrono, ni le profil courant.

### Arborescence cible

```
MathsView/
├── index.html              ← + balises <script> des nouveaux fichiers
├── exercices.html          ← page d'entraînement (nouvelle)
├── admin.html              ← page parent (nouvelle)
├── css/
│   ├── style.css           ← inchangé
│   ├── exos.css            ← nouveau
│   └── admin.css           ← nouveau
├── js/
│   ├── app.js              ← quasi inchangé (cf. §11.2)
│   ├── fonctions-base.js   ← INCHANGÉ, consommé en lecture
│   ├── exos-base.js        ← moteur d'exercices
│   ├── alea.js             ← générateur pseudo-aléatoire semé
│   ├── reponse.js          ← normalisation + comparaison des réponses
│   ├── profils.js          ← profils + stockage localStorage
│   ├── progression.js      ← maîtrise, ceintures, XP, trophées
│   ├── boutique.js         ← pièces, articles, demandes
│   └── admin.js            ← logique de la page parent
└── exos/
    ├── fonctions/          ← générateurs branchés sur le pool (§3)
    ├── 6eme/ … terminale/  ← générateurs classiques (§4)
    └── catalogue.js        ← liste des compétences et leur arbre de prérequis
```

---

## 2. Le moteur : `js/exos-base.js`

### 2.1 Aléatoire semé — `js/alea.js`

Indispensable : une **seed** doit permettre de régénérer exactement le même
énoncé (pour réafficher une correction, rejouer un exercice raté, ou qu'un défi
entre sœurs porte sur les mêmes questions).

Implémenter un PRNG déterministe simple (mulberry32 ou xorshift32) exposé ainsi :

```js
var rnd = MathsAlea(seed);

rnd.entier(a, b);          // entier dans [a ; b] inclus
rnd.entierNonNul(a, b);    // idem, jamais 0
rnd.choix(tableau);        // un élément au hasard
rnd.melange(tableau);      // copie mélangée (Fisher–Yates)
rnd.signe();               // −1 ou +1
rnd.booleen(p);            // vrai avec probabilité p (défaut 0.5)
rnd.fraction(maxNum, maxDen); // { n, d } irréductible, d ≠ 0, d ≠ 1
```

Aucun appel à `Math.random()` ailleurs que dans le tirage de la seed elle-même.

### 2.2 Enregistrement d'un générateur

```js
MathsExos.register({
  id:         'eq1-simple',        // unique, sert d'adresse #exo/eq1-simple
  competence: 'eq1',               // code de compétence (cf. catalogue §5.1)
  level:      '4eme',              // même clé que les leçons
  titre:      'Équations du premier degré',
  paliers:    4,                   // nombre de crans de difficulté

  // Optionnel : ne proposer cet exercice que si ces compétences sont acquises
  prerequis:  ['calcul-relatif'],

  genere: function (rnd, palier) {
    // …
    return { /* objet Question, cf. 2.3 */ };
  }
});
```

### 2.3 L'objet Question retourné par `genere`

```js
{
  enonce:  'Résous l\'équation suivante.',   // consigne, HTML
  tex:     '3x - 7 = 2x + 5',                // l'énoncé mathématique, LaTeX

  type:    'nombre',      // 'nombre' | 'texte' | 'intervalle' | 'qcm'
                          // | 'jsx' | 'vraifaux' | 'tableau'
  reponse: 12,            // la réponse attendue (forme selon le type)

  // Pour type 'qcm' uniquement
  choix:   ['x = 12', 'x = −12', 'x = 2', 'Aucune solution'],
  correct: 0,             // index dans choix

  // Pour type 'jsx' uniquement : construction de la figure + test de réussite
  figure:  function (board, ctx) { /* … */ },
  verifie: function (board, ctx) { return true|false; },

  etapes:  [              // correction pas-à-pas, affichée après coup
    'On soustrait \\(2x\\) aux deux membres : \\(x - 7 = 5\\)',
    'On ajoute 7 aux deux membres : \\(x = 12\\)'
  ],

  indices: [              // révélés un par un, à la demande, avec malus
    'Regroupe les termes en \\(x\\) du même côté.',
    'Puis isole \\(x\\).'
  ],

  unite:   null,          // ex. 'cm' — affiché à côté du champ de saisie
  duree:   90             // durée indicative en secondes (pour le chrono du boss)
}
```

Tout champ optionnel absent est simplement ignoré par le moteur.

### 2.4 Validation des réponses — `js/reponse.js`

**C'est le point qui fera ou cassera l'expérience.** Une bonne réponse refusée
pour une virgule est une source d'abandon immédiat. Normaliser avant de comparer :

- espaces (y compris insécables) supprimés ;
- `,` → `.` pour le parsing numérique ;
- préfixe `x=`, `y=`, `S=` toléré et retiré ;
- `−` (U+2212), `–`, `-` traités comme identiques ;
- majuscules/minuscules et accents ignorés pour le type `texte`.

Comparaison selon le type :

| Type | Règle |
|---|---|
| `nombre` | égalité à `1e-9` près. Si la réponse attendue est une fraction, accepter aussi la forme décimale **exacte** (`0.25` pour `1/4`) mais refuser une valeur arrondie (`0.33` pour `1/3`) — message dédié : « Donne la valeur exacte, pas une valeur approchée. » |
| `texte` | égalité après normalisation ; le générateur peut fournir `reponse` comme tableau de formes acceptées. |
| `intervalle` | comparer la **structure** (bornes + ouverture/fermeture + réunions), jamais la chaîne brute. Accepter `U`, `∪`, `u` ; accepter `;` ou `,` comme séparateur ; accepter `R`, `ℝ`, `IR`. |
| `qcm` / `vraifaux` | index. |
| `jsx` | appel à `verifie(board, ctx)`, avec une tolérance géométrique explicite. |
| `tableau` | comparer colonne à colonne (cf. `POOL.variations`). |

Retour de la validation :

```js
{ ok: true|false, forme: 'exacte'|'approchee'|'malformee', message: '…' }
```

`forme: 'malformee'` ne compte **pas** comme un échec : on affiche « Je n'ai pas
compris ta réponse » et on laisse réessayer sans pénalité. Ne jamais punir une
erreur de saisie.

### 2.5 Saisie

- `nombre`, `texte`, `intervalle` : champ HTML simple + une **palette de boutons**
  au-dessus (`−`, `√`, `/`, `∪`, `∞`, `[`, `]`, `π`) pour éviter d'avoir à
  expliquer une syntaxe. Sur mobile/tablette, `inputmode="decimal"`.
- `qcm`, `vraifaux` : boutons pleine largeur, ordre des choix mélangé par la seed.
- `jsx` : **privilégier ce type dès que c'est possible.** Déplacer un point sur la
  solution, cliquer la bonne courbe parmi trois, placer le sommet d'une parabole,
  tracer une médiatrice. C'est plus juste pédagogiquement, plus ludique, et ça
  supprime tout le problème du parsing.

### 2.6 Déroulé d'une session

Une session = une série de questions sur une ou plusieurs compétences.

```js
MathsExos.session({
  profil:      'lea',
  competences: ['eq1'],
  nb:          8,
  mode:        'entrainement'   // 'entrainement' | 'revision' | 'boss' | 'defi'
});
```

Règles de déroulé :

1. Le **palier** de chaque question est choisi autour de la maîtrise actuelle :
   70 % au palier courant, 20 % un cran au-dessus, 10 % un cran en dessous.
2. Une réponse fausse → afficher la correction (`etapes`), puis **reproposer une
   question du même type** en fin de série. On ne passe pas à autre chose sur un
   échec.
3. Les indices sont demandés explicitement par l'élève, un à la fois.
4. Pas de limite de temps en `entrainement`. Chrono visible uniquement en `boss`
   et `defi`.
5. Écran de fin : score, XP gagné, pièces gagnées, ceinture avant/après,
   trophées débloqués, et un bouton « Revoir mes erreurs ».

Modes :

- **entrainement** — choisi par l'élève, sur une compétence.
- **revision** — le moteur choisit les compétences dont la maîtrise a le plus
  décru (§5.3). C'est le bouton « Arroser mon jardin » de la page d'accueil.
- **boss** — 10 questions de fin de chapitre, en temps limité, **sans indices**,
  une seule tentative par question. Débloque le chapitre suivant. Gros lot.
- **defi** — série identique (même seed) proposée à une autre profil (§10).

---

## 3. Lot 1 — Les exercices « Fonctions » (priorité maximale)

Le pool `js/fonctions-base.js` **est déjà un générateur d'exercices**, pris à
l'envers : il donne la réponse *et* la correction. Aucun contenu à écrire à la
main, et toute fonction ajoutée au pool créera automatiquement des exercices dans
toutes les familles ci-dessous — exactement la propriété qu'ont déjà les leçons.

C'est le meilleur rapport effort/résultat du projet. **À faire en premier.**

Créer `exos/fonctions/` avec quatre générateurs :

### 3.1 `fn-image` — Calcul d'image

```js
genere: function (rnd, palier) {
  var FN = MathsView.fonctions.liste();
  var f  = rnd.choix(FN.slice(0, 2 + palier));      // palier ⇒ fonctions plus riches
  var p  = MathsView.fonctions.defauts(f);
  var x  = rnd.entier(-5, 5);
  while (!MathsView.fonctions.defini(f, x, p)) x = rnd.entier(-5, 5);

  return {
    enonce: 'Soit \\(f(x) = ' + f.tex(p) + '\\). Calcule \\(f(' + x + ')\\).',
    type:   'nombre',
    reponse: MathsView.fonctions.valeur(f, x, p),
    etapes: [ MathsView.fonctions.chaine(f.calcul(x, p)) ]
  };
}
```

### 3.2 `fn-domaine` — Ensemble de définition

Question fermée (`vraifaux`) aux paliers 1–2 : « \(f(−2)\) existe-t-il ? » —
verdict par `POOL.defini`. Question ouverte (`intervalle`) aux paliers 3–4 :
« Donne l'ensemble de définition de \(f\) » — attendu via `POOL.domaine`.

### 3.3 `fn-resolution` — Équations et inéquations

Le cœur du lot. Tirer `f`, `p`, une relation dans `POOL.relations` et une valeur
`k`. L'énoncé est « Résous \(f(x) \lt k\) ».

- `reponse` : `POOL.solutions(f, rel, k, p).txt`, type `intervalle`, comparé par
  structure (via le champ `morceaux`, pas la chaîne).
- `etapes` : `POOL.etapes(f, rel, k, p)` — la correction est déjà rédigée.
- Palier 1 : `=` seulement. Palier 2 : `<` et `>`. Palier 3 : ajout de `⩽`, `⩾`.
  Palier 4 : fonctions à domaine restreint ou à deux branches (`1/x`, `√x`).
- Cas `vide: true` : accepter `∅`, `vide`, `aucune solution`, `{}`.

### 3.4 `fn-parite` — Parité

QCM à trois choix (paire / impaire / ni l'une ni l'autre) ; le verdict vient de
`POOL.parite(f, p).type`. Écarter les fonctions dont le type est `'domaine'`
(la question ne se pose pas) et `'deux'` (la fonction nulle).
Après réponse, afficher `calcul` (l'écriture de \(f(−x)\) étape par étape) ou
`contre` (le contre-exemple) selon le cas — le pool fournit les deux.

### 3.5 `fn-variations` — Tableau de variations (palier avancé)

Type `tableau`. L'élève place les colonnes et choisit le sens de chaque flèche ;
comparaison colonne à colonne contre `POOL.variations(f, p, a, b)`. À traiter en
dernier : c'est le plus coûteux en interface.

---

## 4. Lot 2 — Générateurs classiques

Un fichier par compétence, dans `exos/<niveau>/`. Ordre suggéré (du plus utile au
moins urgent) :

| Niveau | Compétences |
|---|---|
| 6ᵉ | opérations posées, fractions simples, périmètres/aires, conversions d'unités |
| 5ᵉ | nombres relatifs, priorités opératoires, proportionnalité, symétrie centrale |
| 4ᵉ | équations 1er degré, Pythagore (direct + réciproque), Thalès, puissances |
| 3ᵉ | développement/factorisation, identités remarquables, systèmes, trigonométrie |
| 2ⁿᵈᵉ | (couvert par le lot Fonctions) + vecteurs, équations de droites |
| 1ʳᵉ | dérivation, second degré, suites |
| Tale | limites, intégrales, probabilités conditionnelles |

Pour chacun, **écrire les `etapes` avec le même soin que les leçons** : c'est la
correction qui fait apprendre, pas le verdict. Un générateur sans correction
détaillée est un générateur inachevé.

Exemple complet à produire comme référence pour les suivants :

```js
MathsExos.register({
  id: 'pythagore-direct', competence: 'pyth', level: '4eme',
  titre: 'Théorème de Pythagore', paliers: 3,

  genere: function (rnd, palier) {
    var triplets = [[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[7,24,25]];
    var t = rnd.choix(triplets), k = palier >= 2 ? rnd.entier(1, 4) : 1;
    var a = t[0]*k, b = t[1]*k, c = t[2]*k;

    return {
      enonce: 'Le triangle \\(ABC\\) est rectangle en \\(A\\), avec ' +
              '\\(AB = ' + a + '\\) cm et \\(AC = ' + b + '\\) cm. Calcule \\(BC\\).',
      type: 'nombre', reponse: c, unite: 'cm',
      etapes: [
        'Le triangle est rectangle en \\(A\\), donc \\(BC^2 = AB^2 + AC^2\\).',
        '\\(BC^2 = ' + a + '^2 + ' + b + '^2 = ' + a*a + ' + ' + b*b + ' = ' + c*c + '\\)',
        '\\(BC = \\sqrt{' + c*c + '} = ' + c + '\\) cm'
      ],
      indices: ['Quel côté est l\'hypoténuse ?',
                'L\'hypoténuse est le côté opposé à l\'angle droit : c\'est \\(BC\\).']
    };
  }
});
```

---

## 5. Progression — `js/progression.js`

### 5.1 Catalogue des compétences — `exos/catalogue.js`

```js
MathsExos.catalogue = [
  { code: 'eq1', libelle: 'Équations du 1er degré', niveau: '4eme',
    chapitre: 'calcul-litteral', prerequis: ['calcul-relatif'] },
  // …
];
```

Le champ `chapitre` sert au regroupement visuel et au déclenchement du **boss**
(toutes les compétences d'un chapitre en ceinture verte minimum).

### 5.2 Maîtrise

Chaque couple (profil, compétence) porte :

```js
{ score: 0..100, palier: 1..N, derniere: timestamp,
  serie: 0, tentatives: 0, reussites: 0 }
```

Mise à jour après chaque question :

- **Réussite** : `score += 8 × facteurPalier` où `facteurPalier` vaut
  `0.4 / 0.8 / 1.2 / 1.6` selon le palier de la question. Malus indices :
  `× (1 − 0.5 × indicesUtilisés / indicesDisponibles)`.
- **Échec** : `score −= 5`, plancher à 0. Un échec ne fait jamais perdre de
  ceinture déjà obtenue de plus d'un cran (voir 5.4).
- **Anti-farming** : si le palier de la question est inférieur de 2 crans ou plus
  au palier courant de l'élève, tous les gains sont multipliés par `0.2`.
  Enchaîner 50 additions faciles ne doit rien rapporter.
- `palier` monte d'un cran quand `score` franchit 25 / 50 / 75 avec au moins
  3 réussites consécutives à ce palier.

### 5.3 La maîtrise qui s'estompe

**Le mécanisme le plus important du système** : il fait de la répétition espacée
sans jamais prononcer le mot.

- Décroissance de **5 % par semaine** écoulée depuis `derniere`.
- Calculée **paresseusement à la lecture**, jamais par un timer :
  `scoreAffiché = score × Math.pow(0.95, semainesÉcoulées)`. Aucune tâche de fond.
- Plancher à 30 % du meilleur score jamais atteint : on ne redescend jamais à zéro
  sur une notion déjà maîtrisée. Le but est de rappeler, pas de décourager.
- Métaphore visuelle : **un jardin**. Une plante par compétence, qui fleurit avec
  la maîtrise et fane si on ne l'arrose pas. Le bouton principal de la page
  d'accueil est « Arroser mon jardin » → session en mode `revision`.

### 5.4 Ceintures

Dérivées du score courant :

| Score | Ceinture |
|---|---|
| 0–14 | blanche |
| 15–34 | jaune |
| 35–54 | orange |
| 55–74 | verte |
| 75–89 | bleue |
| ≥ 90 | noire |

La ceinture affichée est la **meilleure jamais atteinte**, avec un liseré grisé si
le score courant est descendu en dessous. On ne retire pas une ceinture obtenue :
on signale qu'elle a besoin d'être entretenue.

---

## 6. Trophées

Deux règles : ils sont **narratifs** (jamais « 100 exercices réussis »), et le
parent peut en attribuer à la main depuis l'admin (§9.4) — pour récompenser ce
qu'aucun algorithme ne voit.

```js
MathsExos.trophees = [
  { id: 'sans-filet',   nom: 'Sans filet',
    desc: '5 bonnes réponses d\'affilée sans utiliser d\'indice',
    pieces: 15, test: function (journal, etat) { … } },

  { id: 'revanche',     nom: 'Revanche',
    desc: 'Rater une notion, revenir le lendemain et la réussir', pieces: 20 },

  { id: 'archeologue',  nom: 'Archéologue',
    desc: 'Réviser une compétence laissée de côté depuis plus de 3 semaines',
    pieces: 15 },

  { id: 'le-pont',      nom: 'Le pont',
    desc: 'Réussir un exercice qui combine deux chapitres différents', pieces: 25 },

  { id: 'leve-tot',     nom: 'Lève-tôt',
    desc: 'Une session terminée avant 9 h', pieces: 10 },

  { id: 'marathon',     nom: 'Marathon',
    desc: 'Une session par jour pendant 5 jours', pieces: 30 },

  { id: 'ceinture-noire', nom: 'Ceinture noire',
    desc: 'Atteindre la ceinture noire sur une compétence', pieces: 40 },

  { id: 'le-prof',      nom: 'Le prof',
    desc: 'Expliquer une correction à sa sœur', pieces: 25, manuel: true },

  { id: 'sans-erreur',  nom: 'Parcours parfait',
    desc: 'Un boss de chapitre réussi sans aucune erreur', pieces: 50 }
];
```

Les trophées marqués `manuel: true` n'ont pas de `test` : ils apparaissent dans
l'admin avec un bouton « Attribuer ». Les autres sont évalués après chaque
session, contre le journal d'événements.

---

## 7. Données et stockage — `js/profils.js`

### 7.1 Clés `localStorage`

| Clé | Contenu |
|---|---|
| `mv.profils` | `[{ id, prenom, couleur, emoji, niveau, creeLe }]` |
| `mv.profil.<id>.etat` | `{ xp, pieces, maitrises, trophees, achats, reglages }` |
| `mv.profil.<id>.journal` | tableau d'événements (append-only, cf. 7.3) |
| `mv.admin` | `{ code, budgetMensuel, tauxPieces, boutique, defis, depenses }` |
| `mv.courant` | id du profil actif |
| `mv.version` | numéro de schéma, pour les migrations futures |

Tout passe par `MathsProfils.lire(cle)` / `.ecrire(cle, val)` — **jamais**
`localStorage` en direct dans le reste du code. Ça isole la persistance et
permettra de basculer vers une API serveur plus tard sans rien réécrire ailleurs.

### 7.2 État d'un profil

```js
{
  xp: 1240,
  pieces: 85,
  maitrises: { 'eq1': { score: 62, palier: 3, derniere: 1770000000000,
                        serie: 4, tentatives: 47, reussites: 38, meilleur: 71 } },
  trophees: [ { id: 'sans-filet', obtenuLe: 1769… } ],
  achats:   [ { article: 'cine', date: 1769…, statut: 'valide' } ],
  reglages: { son: true, clavierMaths: true }
}
```

### 7.3 Journal d'événements

Une ligne par tentative, **jamais de mutation**, plafonné aux 2000 dernières
entrées (au-delà, on agrège les plus anciennes en compteurs mensuels).

```js
{ t: 1770000000000, type: 'tentative', comp: 'eq1', gen: 'eq1-simple',
  seed: 48173, palier: 3, ok: true, duree: 34, indices: 1, xp: 9, pieces: 0 }
```

Ce journal permet : de recalculer toute la maîtrise si la formule de scoring
change, d'évaluer les trophées, d'alimenter le tableau de bord parent, et de
rejouer un exercice à l'identique via sa seed. **Le garder complet est ce qui
rend le système réversible.**

### 7.4 XP et pièces : deux monnaies distinctes

- **XP** : progression pure. Ne se dépense jamais, ne redescend jamais. C'est le
  sentiment d'avancer. Gagné à chaque bonne réponse.
- **Pièces** : dépensables à la boutique. **Jamais gagnées à la bonne réponse.**

  C'est une règle de conception, pas un détail : payer la bonne réponse transforme
  le système en optimisation, et l'élève cherchera le chemin le moins coûteux vers
  les pièces plutôt que vers la compréhension. Les pièces récompensent uniquement :

  | Source | Pièces |
  |---|---|
  | Nouvelle ceinture obtenue | 10 (jaune) → 40 (noire) |
  | 3 sessions dans la semaine | 15 |
  | Boss de chapitre réussi | 25 |
  | Trophée | 10 à 50 selon le trophée |
  | Coffre surprise (1 session sur 6, aléatoire) | 5 à 25 |

  Régularité et paliers de maîtrise : deux choses difficiles à truander et
  corrélées à ce qu'on veut vraiment.

### 7.5 Export / import

Avec `localStorage`, **une purge de navigateur efface tout**. Prévoir donc, dans
l'admin :

- **Export** : un bouton qui télécharge `mathsview-sauvegarde-AAAA-MM-JJ.json`
  contenant l'intégralité des clés `mv.*`.
- **Import** : relecture d'un fichier, avec écran de confirmation listant les
  profils trouvés et leur date.
- **Rappel automatique** : si le dernier export date de plus de 30 jours, afficher
  un bandeau discret dans l'admin.

À traiter comme une fonctionnalité de première classe, testée, pas comme un
utilitaire de coin d'écran.

---

## 8. Boutique — `js/boutique.js`

### 8.1 Articles

```js
{ id: 'cine', nom: 'Tu choisis le film du samedi soir',
  cout: 60, type: 'privilege', stock: 1, cooldownJours: 7 }
```

Types :

- `argent` — converti en euros selon `tauxPieces` (défaut : **100 pièces = 1 €**).
- `bon` — bon d'achat dans une enseigne (le parent saisit lui-même les enseignes).
- `privilege` — récompense non monétaire.

### 8.2 Catalogue par défaut à livrer

**Privilèges** (coût zéro euro, valeur souvent supérieure au cash) :

| Article | Coût |
|---|---|
| Tu choisis le film du samedi soir | 60 |
| Joker de corvée (une corvée sautée) | 80 |
| Tu choisis le menu du dimanche | 50 |
| 30 minutes de coucher décalé | 40 |
| Un après-midi en tête-à-tête avec papa ou maman | 150 |
| Choix de la musique en voiture pendant une semaine | 45 |

**Argent de poche** : 100 pièces = 1 €, par paliers de 200 pièces (2 €).

**Bons cadeaux** : à configurer par le parent, enseignes libres.

### 8.3 Budget plafonné

Le parent fixe un **plafond mensuel en euros** (défaut suggéré : 15 €). La
boutique affiche le budget restant du mois et refuse tout achat de type `argent`
ou `bon` qui le dépasserait — sans jamais bloquer les `privilege`, qui restent
toujours accessibles. `depenses` est remis à zéro au 1er de chaque mois
(paresseusement, à la lecture).

Sans plafond, le taux de conversion se renégocie tous les mois, et c'est le parent
qui perd.

### 8.4 Circuit d'achat

Un achat crée une **demande en attente**, jamais une transaction immédiate :

1. L'élève clique « Échanger » → les pièces sont mises en réserve, statut
   `en-attente`.
2. La demande apparaît dans l'admin avec un badge.
3. Le parent valide (statut `valide`, pièces débitées, budget mis à jour) ou
   refuse (statut `refuse`, pièces rendues, avec un mot d'explication).

### 8.5 Coffre surprise

Une session sur six environ (déterminé par la seed de session, pas par
`Math.random()` — sinon on peut le rejouer), un coffre apparaît à l'écran de fin
avec une animation d'ouverture et 5 à 25 pièces.

L'imprévisibilité vaut mieux qu'un tarif affiché : c'est ce qui garde la
récompense matérielle occasionnelle plutôt que contractuelle.

---

## 9. Page admin — `admin.html` + `js/admin.js`

Protégée par un **code parent** (4 chiffres, stocké haché en SHA-256 dans
`mv.admin.code`, avec un sel). Ce n'est pas de la sécurité sérieuse — c'est une
porte fermée, suffisante pour l'usage. Le noter en commentaire pour éviter toute
illusion.

Cinq onglets :

### 9.1 Profils

Créer, modifier, supprimer, archiver un profil. Prévoir **un nombre quelconque de
profils** (3 aujourd'hui). Chaque profil : prénom, emoji ou avatar, couleur, niveau
scolaire par défaut. La suppression demande confirmation et propose un export
préalable.

### 9.2 Tableau de bord

Pour chaque profil, et en comparaison :

- Le **jardin** : toutes les compétences, leur ceinture, leur score courant, la
  date de dernière pratique. Tri par « qui a le plus besoin d'arrosage ».
- Temps passé par semaine (histogramme sur 12 semaines).
- Taux de réussite par compétence, et **les 5 compétences où ça bloque le plus**
  — c'est l'information la plus utile pour toi comme enseignant.
- Les 20 dernières erreurs, avec l'énoncé rejoué depuis sa seed et la réponse
  donnée. Permet de voir *comment* elles se trompent, pas seulement qu'elles se
  trompent.

### 9.3 Boutique et budget

Éditer les articles, le taux de conversion, le plafond mensuel. Valider ou
refuser les demandes en attente. Historique des achats validés du mois avec le
total dépensé.

### 9.4 Trophées manuels

Liste des trophées `manuel: true`, avec bouton « Attribuer à … ». Plus un
formulaire de **trophée libre** : nom, description, pièces — pour inventer une
récompense sur le moment.

### 9.5 Données

Export, import, réinitialisation d'un profil, réinitialisation totale. Affichage
de la place occupée dans `localStorage` (le quota est d'environ 5 Mo ; avec
2000 événements par profil on est très loin du plafond, mais l'afficher évite les
surprises).

---

## 10. Émulation entre profils

Avec des niveaux scolaires différents, **la comparaison directe est injuste et
démotivante**. Ne jamais afficher de classement par score absolu.

- **Classement hebdomadaire par progression**, en pourcentage, chacune sur son
  propre programme. La question devient « qui a le plus progressé cette semaine »,
  pas « qui est la meilleure en maths ».
- **Le défi lancé** : une élève choisit une compétence qu'elle maîtrise et défie
  une autre — mais la série générée l'est **au palier de la défiée**, pas au sien.
  Si la défiée réussit, elle gagne double ; sinon la défieuse empoche la mise.
  Implémentation : le défi stocke la seed de session, ce qui garantit des questions
  identiques.
- **Objectif commun** : un trophée familial débloqué seulement si *les trois*
  atteignent leur objectif de la semaine. Récompense : une sortie. Ça crée de
  l'entraide au lieu de la rivalité — et c'est en pratique la mécanique la plus
  efficace du lot.

---

## 11. Interface

### 11.1 Pages et routage

- `exercices.html#accueil` — sélection du profil (grosses cartes colorées), puis
  tableau de bord élève : son jardin, sa prochaine session suggérée, ses trophées,
  son solde de pièces, les défis reçus.
- `exercices.html#exo/<id>` — session en cours.
- `exercices.html#boutique` — la boutique.
- `admin.html` — page parent.

Réutiliser `css/style.css` pour rester cohérent avec les leçons ; `exos.css`
n'ajoute que ce qui est spécifique.

### 11.2 Seule couture avec les leçons

Ajouter dans `MathsView.register({...})` un champ **optionnel** :

```js
exercices: ['eq1', 'eq1-parentheses']
```

Et dans `js/app.js`, à la fin du rendu d'une leçon, deux lignes : si le champ
existe et que `MathsExos` est chargé, afficher un bouton « S'entraîner sur cette
notion » qui pointe vers `exercices.html#exo/<premier id>`. Rien d'autre.

Une leçon sans ce champ fonctionne exactement comme avant. `MathsExos` absent →
aucune erreur.

### 11.3 Points d'attention

- **Écran de fin de session** : c'est le moment de récompense, il mérite du soin.
  Barre d'XP qui se remplit, ceinture qui change avec une animation, trophées qui
  apparaissent un par un, coffre le cas échéant.
- **Ton des messages d'erreur** : jamais « Faux ». Plutôt « Pas tout à fait —
  regarde la correction », puis la correction, puis « On réessaie ? ».
- **Aucun son par défaut**, activable dans les réglages du profil.
- Utilisable au doigt sur tablette : cibles de 44 px minimum.
- `mv.typeset()` doit être appelé après toute insertion de LaTeX dynamique.

---

## 12. Ordre d'implémentation

| Lot | Contenu | Pourquoi cet ordre |
|---|---|---|
| **1** | `alea.js`, `exos-base.js`, `reponse.js`, une page de session minimale, **un seul** générateur (`eq1-simple`) | Valide la fondation de bout en bout avant de la remplir |
| **2** | `profils.js`, `progression.js`, ceintures, maîtrise décroissante, jardin | La progression donne du sens aux exercices |
| **3** | Les 4 générateurs « Fonctions » branchés sur le pool (§3) | Meilleur rapport effort/résultat de tout le projet |
| **4** | `admin.html` : profils, tableau de bord, export/import | Rend le système utilisable à trois et sauvegardable |
| **5** | Trophées, XP, pièces, boutique, budget, coffre surprise | La couche ludique, une fois la base solide |
| **6** | Générateurs classiques par niveau (§4) | Remplissage progressif, sans fin |
| **7** | Boss de chapitre, défis, objectif commun | Mécaniques sociales, une fois qu'il y a du contenu |

Livrer chaque lot **fonctionnel et testable à la main** avant de passer au
suivant. Ne pas commencer le lot 5 avant que le lot 1 soit réellement agréable à
utiliser : un moteur d'exercices frustrant ne se rattrape pas avec des trophées.

---

## 13. Note pédagogique à garder en tête

Les récompenses matérielles peuvent éroder la motivation intrinsèque quand elles
deviennent *la raison* de faire l'activité — c'est l'effet de surjustification.
Le système ci-dessus est calibré en conséquence : les pièces sont occasionnelles,
imprévisibles et jamais liées à la bonne réponse, tandis que les ceintures, le
jardin et les trophées portent la motivation au quotidien.

Objectif à six mois : qu'elles fassent des maths sans regarder la boutique.
Si le jardin et les ceintures suffisent, la partie monétaire pourra s'effacer
d'elle-même — et l'architecture le permet, puisqu'il suffit de vider le catalogue
de la boutique.
