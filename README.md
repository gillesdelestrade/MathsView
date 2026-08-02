# MathsView

Un site pour **programmer des illustrations interactives de cours de mathématiques**
(de la 6ème à la Terminale), conçu pour renforcer l'apprentissage.

Construit avec [JSXGraph](https://jsxgraph.org) (géométrie/fonctions interactives) et
[MathJax](https://www.mathjax.org) (formules). **Aucune installation requise** : tout
est en local, ça marche hors-ligne.

## Lancer le site

Dans un terminal, à la racine du projet :

```bash
./serve.sh
```

Puis ouvre <http://localhost:8000> dans ton navigateur.

(Le script utilise le serveur web intégré de Python 3, déjà présent sur ton Mac.)

## Ajouter une nouvelle illustration

C'est le cœur du projet : **une illustration = un fichier JS**.

1. Copie un fichier existant, par exemple `lessons/4eme/pythagore.js`, dans le
   dossier du niveau voulu (`lessons/6eme/`, `lessons/5eme/`, … `lessons/terminale/`)
   et renomme-le.
2. Change le contenu de `MathsView.register({ ... })` :
   - `id` : identifiant unique (sans espace), sert aussi d'adresse `#mon-id`.
   - `title`, `level`, `theme`. `level` est l'une des clés :
     `'6eme'`, `'5eme'`, `'4eme'`, `'3eme'`, `'2nde'`, `'1ere'`, `'terminale'`
     (et doit correspondre au dossier). Un niveau inconnu fait disparaître la
     leçon du menu — un avertissement s'affiche alors dans la console.
   - `description` / `notes` : texte HTML, avec formules LaTeX entre `\( … \)` ou `\[ … \]`.
   - `board` : options du repère JSXGraph (fenêtre, axes…).
   - `setup(board, mv)` : le code qui construit l'illustration.
3. Ajoute la ligne `<script src="lessons/…/mon-fichier.js"></script>` dans `index.html`
   (section « Catalogue »).
4. Recharge la page. C'est tout.

### Aides fournies à `setup(board, mv)`

- `board` : le tableau JSXGraph. Utilise `board.create('point', …)`, `'functiongraph'`,
  `'slider'`, `'polygon'`, etc. Voir la [doc JSXGraph](https://jsxgraph.org/docs/).
- `mv.addControls([...])` : ajoute des curseurs/boutons/cases HTML sous le tableau.
- `mv.extras` : conteneur HTML sous le tableau où insérer tes propres panneaux
  (ex. la liste de propriétés de la leçon quadrilatères). **Il est vidé
  automatiquement** quand on change de leçon — insère toujours tes éléments
  dedans plutôt qu'après le `#board`, sinon ils restent affichés sur les autres leçons.
- `mv.typeset()` : re-rend les formules LaTeX si tu ajoutes du texte dynamiquement.
- `mv.hideBoard()` : masque le repère JSXGraph pour une leçon **sans figure**
  (ex. le tableau de conversion, entièrement en HTML dans `mv.extras`). Le repère
  est réaffiché automatiquement à la leçon suivante.

### Le pool de fonctions (leçons « Fonctions »)

Les leçons sur les fonctions n'écrivent **pas** leurs propres formules : elles piochent
dans le pool commun `js/fonctions-base.js` (identité, affine `ax + b`, valeur absolue,
carré, racine carrée, inverse `1/x`). Ajouter une fonction **là-bas** la fait apparaître, avec ses
paramètres, son domaine et ses calculs détaillés, dans **toutes** les leçons qui
utilisent le pool — sans toucher aux leçons.

```js
var POOL = MathsView.fonctions;
var FN = POOL.liste();            // toutes les fonctions, dans l'ordre pédagogique
var f  = FN[0];
var p  = POOL.defauts(f);         // { a: 2, b: -1 } pour l'affine, {} sinon
POOL.valeur(f, 3, p);             // f(3)
POOL.defini(f, -2, p);            // −2 a-t-il une image ? (√ : non)
POOL.domaine(f, -5, 5);           // la portion de [−5 ; 5] où f est définie
POOL.branches(f, -5, 5);          // cette portion en morceaux d'un seul tenant :
                                  // une courbe par morceau (1/x : deux branches)
f.expr(p);                        // « 2x − 1 » (HTML)   f.tex(p) → LaTeX
POOL.chaine(f.calcul(3, p));      // « 2 × 3 − 1 = 6 − 1 = 5 »
POOL.nb(1.4142);                  // « 1,41 »  (virgule française, vrai signe −)
```

Le pool sait aussi **résoudre** \(f(x) = k\) et les quatre inéquations, exactement et
sur tout l'ensemble de définition :

```js
POOL.solutions(f, '<', 4, p);     // { txt: ']−2 ; 2[', morceaux: [...], points, vide }
POOL.etapes(f, '<', 4, p);        // le raisonnement algébrique, ligne à ligne
POOL.relations;                   // ['=', '<', '⩽', '>', '⩾']
POOL.relHtml('<');                // « &lt; » : à utiliser dans un innerHTML
```

Une fonction n'a pour cela qu'une chose à fournir — `antec(k, p)`, ses antécédents de
`k` avec leur écriture exacte (`−√5` et non `−2,24`) : le découpage du domaine, le
choix des crochets et la réunion des intervalles sont déduits tout seuls.

Le format complet d'une fonction du pool est documenté en tête de `js/fonctions-base.js`.

## Structure

```
MathsView/
├── index.html          ← page + catalogue des illustrations
├── css/style.css
├── js/app.js           ← moteur (menu, recherche, routage). À ne pas modifier.
├── js/fonctions-base.js ← pool de fonctions partagé par les leçons « Fonctions »
├── vendor/             ← JSXGraph + MathJax (locaux)
└── lessons/           ← un dossier par niveau
    ├── 6eme/
    ├── 5eme/
    ├── 4eme/
    ├── 3eme/
    ├── 2nde/
    ├── 1ere/
    └── terminale/
```
