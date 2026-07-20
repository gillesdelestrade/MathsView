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

## Structure

```
MathsView/
├── index.html          ← page + catalogue des illustrations
├── css/style.css
├── js/app.js           ← moteur (menu, recherche, routage). À ne pas modifier.
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
