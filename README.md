# MathsView

Un site pour **apprendre les mathématiques du collège et du lycée en les voyant**.

Trois choses, dans cet ordre :

1. **Des leçons illustrées** — pas des textes avec un schéma, mais des figures qu'on
   manipule et des animations qui montrent le raisonnement se dérouler. Une idée par
   leçon, et la figure *est* la démonstration.
2. **Des exercices générés** — jamais deux fois les mêmes, avec une correction rédigée
   pas à pas. C'est la correction qui fait apprendre, pas le verdict.
3. **Une progression qui donne envie d'y revenir** — ceintures, jardin à arroser,
   trophées, pièces et boutique, boss de chapitre et défis entre sœurs.

Construit avec [JSXGraph](https://jsxgraph.org) (figures interactives) et
[MathJax](https://www.mathjax.org) (formules), **tous deux embarqués en local**.
Aucune installation, aucun build, aucun appel réseau : ça marche hors-ligne.

État actuel : **51 leçons**, **45 générateurs d'exercices** couvrant 45 compétences,
dont **46 leçons mènent directement à un entraînement**.

---

## Lancer le site

```bash
./serve.sh
```

puis <http://localhost:8000>. Le script lance `serveur/dev.py` : les fichiers du site
**et** le stockage de la progression, dans un seul processus Python 3 (déjà présent sur
macOS, aucune dépendance). La base de test est `serveur/mathsview.sqlite3` — l'effacer
remet la progression locale à zéro.

Pour l'installation sur un serveur de la maison, voir [Le serveur](#le-serveur).

## Les trois pages

| page | pour qui | ce qu'on y fait |
|---|---|---|
| `index.html` | l'élève | les leçons, rangées par niveau et par domaine |
| `exercices.html` | l'élève | son jardin, ses séries d'exercices, ses trophées, la boutique |
| `admin.html` | le parent | suivi, profils, boutique et budget, sauvegarde |

Les leçons qui déclarent le champ `exercices:` affichent un bouton **« S'entraîner sur
cette notion »** qui mène droit à la série correspondante.

---

## Partie 1 — Les leçons

**Une leçon = un fichier JS.** C'est le cœur du projet.

1. Copie un fichier existant — par exemple `lessons/4eme/pythagore.js` — dans le dossier
   du niveau voulu, et renomme-le.
2. Adapte l'appel à `MathsView.register({ … })` :

| champ | rôle |
|---|---|
| `id` | identifiant unique, sert d'adresse `#mon-id` |
| `title`, `theme` | le titre, et la phrase de la carte d'accueil |
| `level` | `'6eme'` … `'terminale'` — **doit correspondre au dossier** (un niveau inconnu fait disparaître la leçon du menu, avec un avertissement en console) |
| `category` | `'calcul'`, `'algebre'`, `'geometrie'` ou `'analyse'` |
| `subcategory` | libre — deux leçons qui écrivent la même chaîne se retrouvent groupées |
| `exercices` | *(optionnel)* les identifiants de générateurs associés |
| `description`, `notes` | HTML, formules LaTeX entre `\( … \)` |
| `board` | options du repère JSXGraph |
| `setup(board, mv)` | le code qui construit la figure |

3. Ajoute la balise `<script src="lessons/…/mon-fichier.js"></script>` dans `index.html`
   (l'ordre y est celui des cartes d'accueil, par niveau croissant).

### Ce que `mv` fournit à `setup`

- **`mv.addControls([…])`** — curseurs, boutons et cases à cocher sous la figure.
- **`mv.createAnimator()`** — le moteur d'animation partagé. Il ajoute tout seul la barre
  « ☑ Pas à pas · ◀ Précédent · Suivante ▶ » (cochée par défaut, pilotable à la barre
  espace), ce qui permet de commenter une figure en direct.
  Règle à respecter : **chaque étape doit régler un état ABSOLU**, jamais un incrément —
  c'est ce qui permet à « Précédent » de rejouer exactement la même figure.
- **`mv.extras`** — conteneur HTML sous la figure pour tes propres panneaux. Il est vidé
  au changement de leçon : insère toujours dedans, jamais après `#board`.
- **`mv.typeset()`** — re-rend le LaTeX ajouté dynamiquement.
- **`mv.onCleanup(fn)`** — pour libérer ce qui doit l'être en quittant la leçon.
- **`mv.hideBoard()`** — masque le repère pour une leçon sans figure (tableau HTML pur).

### Ce qui fait une bonne leçon ici

Les leçons existantes suivent quelques principes, visibles dans leur en-tête de fichier :

- **une seule idée**, montrée plutôt qu'énoncée. « Encadrement décimal » n'explique pas
  la troncature : elle zoome ×10, cinq fois de suite ;
- **des couleurs qui portent du sens** et pas de la décoration — dans `|x − a| ⩽ r`,
  rouge = le réel cherché, violet = les décimaux qui l'encadrent ;
- **aucune image figée qui soit fausse.** Dans la même leçon, quand une seule borne a
  glissé, la barre de l'intervalle s'efface : un intervalle à moitié translaté n'a pas
  de sens, et le mode pas à pas s'arrête dessus ;
- **les cas particuliers traités**, pas ignorés : `3 + 4` ne fabrique pas d'étape de
  retenue inutile, `10 + 5` dit qu'il n'y a rien à compléter.

### Le pool de fonctions

Les leçons « Fonctions » n'écrivent pas leurs formules : elles piochent dans
`js/fonctions-base.js` (identité, `−x`, `ax + b`, `|x|`, `x²`, `x³`, `√x`, `1/x`,
`x³ − 3x`). **Ajouter une fonction là-bas la fait apparaître dans toutes les leçons ET
dans les quatre générateurs d'exercices**, sans toucher à rien d'autre.

```js
var POOL = MathsView.fonctions;
POOL.liste();                     // les 9 fonctions, dans l'ordre pédagogique
POOL.valeur(f, 3, p);             // f(3)
POOL.defini(f, -2, p);            // −2 a-t-il une image ?
POOL.branches(f, -5, 5);          // les morceaux traçables (1/x : deux branches)
POOL.solutions(f, '<', 4, p);     // { txt: ']−2 ; 2[', morceaux, points, vide }
POOL.etapes(f, '<', 4, p);        // le raisonnement algébrique, ligne à ligne
POOL.parite(f, p);                // paire / impaire / aucune / domaine — établi seul
POOL.variations(f, p, -5, 5);     // { cols, arcs } : le tableau de variations
POOL.chaine(f.calcul(3, p));      // « 2 × 3 − 1 = 6 − 1 = 5 »
```

Le principe : **une fonction ne déclare que le strict minimum, le pool déduit le reste.**

| ce que la fonction fournit | ce que le pool en tire |
|---|---|
| `antec(k, p)` — les antécédents de `k`, en écriture **exacte** (`−√5`, pas `−2,24`) | la résolution de `f(x) = k` **et des quatre inéquations**, découpage du domaine et sens des crochets compris |
| `sommets(p)` — les abscisses où elle change de sens | le tableau de variations complet |
| `oppose(p)` — l'écriture de `f(−x)` | le calcul montré à l'élève ; le **verdict** de parité, lui, est constaté numériquement |
| `defini`, `xmin`/`xmax`, `trous` | l'ensemble de définition, et les branches à tracer séparément |

Une fonction qui ne sait pas résoudre (`x³ − 3x`, qui demanderait Cardan) omet
simplement `antec` : `solutions()` renvoie `null` et les leçons se rabattent sur la
**lecture graphique** — ce qui est la bonne pédagogie à ce niveau.

Le format complet est documenté en tête de `js/fonctions-base.js`.

---

## Partie 2 — Les exercices

Un générateur produit un énoncé, une réponse et une correction. **Il ne connaît ni les
points, ni le chrono, ni les ceintures, ni le profil** : le moteur déduit tout le reste.

```js
MathsExos.register({
  id: 'pythagore', competence: 'pyth', level: '4eme',
  titre: 'Théorème de Pythagore', paliers: 4,

  genere: function (rnd, palier) {
    // rnd est SEMÉ : la même graine régénère exactement le même énoncé
    return {
      enonce: 'Le triangle ABC est rectangle en A…',   // HTML
      tex:    'BC^2 = AB^2 + AC^2',                     // LaTeX, optionnel
      type:   'nombre',
      reponse: 25, unite: 'cm',
      etapes:  ['…', '…'],        // la correction, affichée après coup
      indices: ['…'],             // révélés un par un, à la demande
      duree:   75                 // secondes indicatives (chrono des boss)
    };
  }
});
```

Puis : une ligne dans `exos/catalogue.js` (la compétence), une balise `<script>` dans
`exercices.html` **et** `admin.html`, et le champ `exercices:` de la leçon.

### Les types de question

| type | réponse attendue | comparaison |
|---|---|---|
| `nombre` | `12`, `−2,5`, `3/4`, `√5`, `∛5` | valeur, à 1e-9 près |
| `texte` | `reponse` peut être un tableau de formes acceptées | accents et casse ignorés |
| `intervalle` | `]−2 ; 5]`, `[0 ; +∞[`, `∅`, `{−2 ; 2}` | **par structure**, jamais par la chaîne |
| `qcm` | un index | — |
| `qcm-multi` | plusieurs cases à cocher | comparaison d'**ensembles** |
| `vraifaux` | `0` (vrai) ou `1` (faux) | — |

La validation (`js/reponse.js`) tolère largement : espaces insécables, virgule décimale,
les trois sortes de tirets, les préfixes `x =` ou `S =`, `U` pour `∪`, `R` pour `ℝ`. Une
saisie **incomprise n'est jamais comptée comme une faute** — on le dit, et on laisse
réessayer. Une bonne réponse refusée pour une virgule, c'est un élève qui abandonne.

### Ce que le moteur gère tout seul

- le **palier** de chaque question, tiré autour de la maîtrise courante (70 % au palier,
  20 % au-dessus, 10 % en dessous) ;
- **aucune question répétée** dans une même série — le moteur garde la signature de ce
  qui a été posé et retire tant qu'il tombe sur du déjà-vu ;
- une **question ratée est reproposée en fin de série**, avec un nouvel énoncé du même
  type ;
- les **indices** à la demande, avec malus — et jamais en mode boss ou défi ;
- le **rejeu à l'identique** d'un exercice depuis sa graine : c'est ce qui permet au
  parent de revoir exactement l'énoncé qu'une élève a raté.

### Écrire une bonne correction

Le SPEC est catégorique et l'expérience le confirme : *un générateur sans correction
détaillée est un générateur inachevé.* Les corrections existantes suivent le
raisonnement de la leçon correspondante — les relatifs se déplacent sur la droite
graduée, les priorités font **une opération par ligne**, Thalès écrit la triple égalité
avant le produit en croix, la trigonométrie nomme les côtés avant de choisir la ligne.

Deux pièges à éviter, tous deux rencontrés :

- **une réponse qui ne s'écrit pas.** Si le résultat est irrationnel, demande un arrondi
  et **dis-le dans l'énoncé** ; sinon l'élève n'a aucun moyen de répondre ;
- **une question qui se gagne sans réfléchir.** Un QCM dont toutes les cases sont bonnes,
  ou dont la bonne réponse figure deux fois, ne mesure rien.

---

## Partie 3 — La progression

C'est ce qui transforme une série d'exercices en habitude. Chaque mécanique répond à un
problème précis, et plusieurs sont calibrées **contre** l'intuition.

### La maîtrise qui s'estompe

Chaque compétence porte un score de 0 à 100 qui **perd 5 % par semaine** sans pratique.
C'est de la répétition espacée sans jamais prononcer le mot : la décroissance est
calculée *à la lecture* (aucune tâche de fond), et **plancher à 30 % du meilleur score
jamais atteint** — on rappelle, on ne décourage pas.

La métaphore est un **jardin** : une plante par compétence, qui fleurit avec la maîtrise
et fane si on ne l'arrose pas. Le bouton principal de la page d'accueil est
**« 💧 Arroser mon jardin »** : le moteur choisit alors les trois compétences qui ont le
plus fané.

### Les ceintures

| score | 0–14 | 15–34 | 35–54 | 55–74 | 75–89 | ≥ 90 |
|---|---|---|---|---|---|---|
| ceinture | blanche | jaune | orange | verte | bleue | noire |

La ceinture affichée est la **meilleure jamais obtenue**. On ne retire jamais une
ceinture : quand le score retombe, un point signale simplement qu'elle demande à être
entretenue.

### Les trophées

Dix trophées, **narratifs** — jamais « 100 exercices réussis », qui est un compteur et ne
raconte rien : *Revanche* (rater une notion, revenir un autre jour et la réussir),
*Archéologue*, *Le pont*, *Marathon*, *Parcours parfait*… Chacun est évalué contre le
**journal** plutôt que contre un compteur : si une règle change, on relance l'évaluation
et tout l'historique est réexaminé.

*Le prof* (« expliquer une correction à sa sœur ») est **manuel** : aucun algorithme ne
le verra jamais. Le parent peut aussi inventer un trophée sur le moment.

### Les pièces — la règle la plus contre-intuitive

**Une bonne réponse ne rapporte jamais une seule pièce.** Elle rapporte de l'XP.

C'est délibéré : payer la bonne réponse transforme le travail en optimisation, et
l'élève cherche alors le chemin le moins coûteux vers les pièces plutôt que vers la
compréhension. Les pièces récompensent donc uniquement ce qui est difficile à truander :

| source | montant |
|---|---|
| nouvelle ceinture | 10 (jaune) → 40 (noire), une seule fois |
| 3 séries dans la semaine | 15 |
| coffre surprise (1 série sur 6) | 5 à 25 |
| trophée | 10 à 50 |
| boss de chapitre réussi | 25, une seule fois par chapitre |
| défi gagné par la défiée | le double de la mise |

Le coffre est tiré de la **graine de la série**, pas de `Math.random()` : recharger la
page de fin n'en fait pas réapparaître un.

### La boutique

Un achat n'est **jamais une transaction** : c'est une **demande**. Les pièces partent en
réserve, la demande remonte à l'admin avec un badge, et le parent valide ou refuse — sur
un refus, les pièces reviennent avec un mot d'explication.

Le **budget mensuel est plafonné en euros** (15 € par défaut, 100 pièces = 1 €) et ne
bloque que l'argent et les bons : **les privilèges restent toujours accessibles**. « Tu
choisis le film du samedi » coûte zéro euro et se négocie très cher.

### Boss et défis

Le **boss de chapitre** ne s'ouvre que lorsque toutes les compétences du chapitre sont au
moins ceinture verte : 10 questions chronométrées, **sans indice**, une seule tentative.
Il valide le chapitre sans en verrouiller aucun autre.

Le **défi** entre profils est généré **au palier de la défiée**, jamais à celui de la
défieuse — sinon une grande sœur écraserait la petite sans effort. Les deux jouent
exactement la même série (même graine).

Et surtout, l'**objectif commun** : il n'est atteint que si **toutes** y arrivent. C'est
la seule mécanique qui crée de l'entraide plutôt que de la rivalité. Dans le même esprit,
le classement hebdomadaire se fait en **points de progression, chacune sur son propre
programme** — jamais en score absolu, ce qui n'aurait aucun sens entre une 6ème et une
2nde.

---

## Les données

La progression vit **sur le serveur**, et **rien ne touche au stockage en dehors de
`js/profils.js`** — c'est cette règle, tenue depuis le début, qui a permis d'y passer
sans réécrire une ligne ailleurs. Un élève retrouve donc son jardin en changeant
d'appareil.

`localStorage` n'a pas disparu : il est devenu un **miroir**. Le site démarre dessus
quand le serveur est éteint, continue de fonctionner, et rattrape la synchronisation
tout seul au retour. Le format des clés (`mv.*`) n'a pas bougé, si bien que la
progression déjà présente dans un navigateur est reprise telle quelle à la première
connexion — et que l'export JSON de l'espace parent marche toujours.

Le point délicat, c'est **deux appareils sur le même profil**. Fusionner deux
progressions divergentes serait de la devinette, et de la devinette sur les pièces d'un
enfant, ça se remarque. On l'évite plutôt : un profil est « tenu » par un appareil à la
fois (un bail de 90 secondes, renouvelé tant que la page est ouverte), et l'autre
appareil propose franchement « reprendre ici ». En dernier recours, chaque clé porte un
numéro de version et le serveur refuse une écriture partie d'une version périmée.

Le **code parent** (4 chiffres, haché avec un sel) n'est pas de la sécurité : c'est une
porte fermée. La console l'ouvre en dix secondes, et c'est écrit dans le fichier. Le
service de stockage, lui, n'a **aucune authentification** : il est fait pour le réseau
de la maison, pas pour Internet.

---

## Le serveur

Un Raspberry Pi suffit largement — le site fait 8 Mo de fichiers statiques et le
stockage est un SQLite de quelques centaines de Ko.

```bash
sudo apt install -y nginx git python3
sudo git clone https://github.com/gillesdelestrade/MathsView.git /var/www/mathsview
sudo useradd --system --no-create-home --shell /usr/sbin/nologin mathsview

cd /var/www/mathsview
sudo cp deploy/mathsview-api.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now mathsview-api

sudo cp deploy/nginx.conf /etc/nginx/sites-available/mathsview
sudo ln -sf /etc/nginx/sites-available/mathsview /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Le site est alors sur `http://mathsview.local` depuis n'importe quelle machine de la
maison (donne ce nom d'hôte au Pi avec `raspi-config`).

**Mise à jour à chaque push.** `deploy/pull.sh` aligne le Pi sur `origin/main` et
redémarre le service si le code serveur a changé. Rien à exposer sur Internet, aucun
port à ouvrir : c'est le Pi qui va chercher. Dans `sudo crontab -e` :

```cron
*  *    * * *  /var/www/mathsview/deploy/pull.sh      >> /var/log/mathsview-deploy.log 2>&1
17 3    * * *  /var/www/mathsview/deploy/sauvegarde.sh >> /var/log/mathsview-deploy.log 2>&1
```

Le dépôt est un **miroir** : toute modification faite sur le Pi est écrasée. La
progression, elle, vit hors du dépôt (`/var/lib/mathsview/`) — un `git reset --hard` ne
peut pas l'atteindre.

**La carte SD est désormais le seul point de panne du projet.** `deploy/sauvegarde.sh`
en fait une copie quotidienne dans `/var/backups/mathsview/`, ce qui protège d'une base
corrompue mais pas d'une carte morte : copie ce dossier ailleurs de temps en temps. Le
bouton « Sauvegarder » d'`admin.html` reste, lui aussi, une vraie sauvegarde.

---

## Structure

```
MathsView/
├── index.html              ← les leçons + le catalogue
├── exercices.html          ← l'entraînement (élève)
├── admin.html              ← l'espace parent
├── css/                    style · exos · admin
├── js/
│   ├── app.js              moteur des leçons (menu, routage). Ne pas modifier.
│   ├── fonctions-base.js   le pool de fonctions de référence
│   ├── alea.js             aléatoire semé — le seul Math.random() du module
│   ├── reponse.js          normalisation et comparaison des réponses
│   ├── exos-base.js        moteur d'exercices (session, paliers, correction)
│   ├── profils.js          profils, stockage et synchronisation — SEUL à y toucher
│   ├── sync-ui.js          le bandeau « hors ligne » / « déjà ouvert ailleurs »
│   ├── progression.js      maîtrise, ceintures, jardin, boss
│   ├── trophees.js         les dix trophées et leur évaluation
│   ├── boutique.js         articles, budget plafonné, circuit de demande
│   ├── defis.js            défis, objectif commun, classement
│   └── admin.js            la page parent
├── serveur/
│   ├── mathsview_api.py    le stockage : ~250 lignes, stdlib seule, SQLite
│   └── dev.py              le site + le stockage en local, un seul processus
├── deploy/                 nginx, systemd, mise à jour par git, sauvegarde
├── vendor/                 JSXGraph + MathJax, en local
├── lessons/<niveau>/       une leçon = un fichier
└── exos/
    ├── catalogue.js        les compétences et leurs prérequis
    ├── fonctions/          les générateurs branchés sur le pool
    └── <niveau>/           les générateurs classiques
```

`MathsView-Exercices-SPEC.md` est la spécification d'origine du module exercices : elle
explique les **pourquoi** que ce README résume.

## Contraintes tenues

- **aucune installation, aucun build** — que des balises `<script>` ;
- **hors-ligne** — toute dépendance est vendorisée dans `vendor/` ;
- **français partout** : virgule décimale, vrai signe « − » (U+2212), intervalles à la
  française (`]−2 ; 2[`) ;
- la logique se teste **hors navigateur** avec `jsc` (fourni par macOS), en chargeant le
  vrai JSXGraph avec le renderer `no` et un shim DOM minimal — c'est ainsi qu'ont été
  vérifiées les figures, les 5460 questions produites par les générateurs et la
  cohérence du pool.
