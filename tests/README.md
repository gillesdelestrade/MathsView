# Les contrôles

```sh
./tests/lancer.sh              # tout
./tests/lancer.sh compas       # ceux dont le nom contient « compas »
./tests/lancer.sh lecon        # toutes les leçons
```

Rien à installer. Tout tourne sous **`jsc`**, le moteur JavaScript livré avec
macOS ; seul `python-conformite.py` demande en plus le `python3` du système.
Les contrôles s'exécutent depuis la racine du dépôt et chargent `js/`, `exos/`
et `lessons/` exactement comme le fait le navigateur.

## Ce qu'ils cherchent

Un exercice de maths a une propriété inhabituelle : **on peut vérifier sa
justesse sans le regarder**. Un tableau de valeurs, une figure, une réponse
annoncée — tout cela se recalcule. Ces contrôles refont donc systématiquement le
travail *à côté*, à partir des seules données de l'énoncé, plutôt que de relire
ce que le générateur affirme. Une réponse juste par accident — parce que
l'énoncé et la correction partagent la même variable fausse — ne passe pas.

Là où il y a une figure, c'est le **SVG produit** qui est relu : on remesure les
angles du triangle dessiné, on retrouve la droite tracée dans le repère, on
vérifie que deux côtés portant le même codage ont vraiment la même longueur. Là
où il y a une animation, elle est **rejouée plusieurs fois** : les étapes doivent
être idempotentes, sans quoi le mode pas-à-pas empile les phrases.

Un contrôle est en **échec** si sa sortie contient le mot `ÉCHEC` ou une
exception JavaScript. C'est la convention que suivent tous les fichiers : ils
décrivent ce qu'ils ont vérifié, puis concluent.

## Le site

| | |
|---|---|
| `site-chargement` | La page charge-t-elle vraiment tous ses générateurs ? Les `<script>` de `exercices.html` sont rejoués **dans l'ordre** : un fichier placé avant le module dont il dépend lève une `ReferenceError` silencieuse, le générateur ne s'enregistre jamais, et le bouton « S'entraîner » de la leçon retombe sur l'accueil sans message. Vérifie aussi que chaque compétence du catalogue a son générateur et que chaque lien de leçon tombe juste. |
| `site-jardin` | Le jardin et la révision : une compétence d'un niveau supérieur n'apparaît jamais, mais ce qui a déjà été travaillé reste visible. |
| `site-tableau-de-bord` | L'espace parent : autant de colonnes dans l'en-tête que dans chaque ligne, et les totaux affichés sont ceux du niveau du profil. |
| `site-bandeau-profil` | Le bandeau de profil sur toutes les pages, et son menu. |
| `site-pas-a-pas` | Le mode pas-à-pas rejoue les étapes précédentes après une remise à zéro : rien ne doit se dupliquer. |

## Le mini-Python

| | |
|---|---|
| `python-conformite` | Chaque programme est exécuté **deux fois** — par le `python3` de la machine, puis par `js/python-mini.js` — et les deux sorties doivent être identiques au caractère près. C'est ce contrôle qui garantit les pièges : `7/2`, `-7//2`, `-2**2`, `round(2.5)`, l'écriture des flottants. |
| `python-erreurs` | Les garde-fous : boucle infinie, récursion sans fin, division par zéro, syntaxe non gérée. Chacun doit s'arrêter avec un message français et un numéro de ligne, jamais figer la page. |
| `python-tableau-de-valeurs` | Le script produit par `scriptPython()`, **exécuté**, affiche exactement le tableau annoncé par `tableauPython()`. |

## Les leçons

| | |
|---|---|
| `lecon-somme-angles` | Les trois copies d'angles pavent le demi-tour sans trou ni chevauchement, et la démonstration par la parallèle tient. |
| `lecon-construire-triangles` | Le troisième sommet est calculé de trois façons ; on relit sa position et on vérifie que les trois données de départ s'y retrouvent, que les demi-droites tracées passent bien par lui, et que les cas impossibles sont expliqués. |
| `lecon-hauteurs`, `lecon-medianes` | Les droites tracées sont bien des hauteurs, des médianes, et les points de concours ne sont pas confondus avec leurs voisins. |
| `lecon-mediane-aires` | Les deux moitiés du triangle ont bien la même aire. |
| `lecon-somme-relatifs`, `lecon-comparer-fractions`, `lecon-parentheses`, `lecon-puissances`, `lecon-fraction-pourcentage` | L'animation est rejouée entièrement dans un DOM simulé : les calculs affichés sont justes, et le rejeu redonne le même écran. |
| `lecon-variations-python` | La phrase écrite sous la console décrit ce que les nombres montrent vraiment, pour les neuf fonctions du pool. |

## Les exercices

| | |
|---|---|
| `exos-somme-angles` | Chaque figure dit exactement ce que la réponse suppose : angles remesurés sur le polygone, codages confrontés aux longueurs réelles. |
| `exos-compas` | La construction est **réellement faisable** : de vrais gestes de souris sont rejoués, et la droite obtenue passe bien par les points annoncés. |
| `exos-construire-triangles` | Même exigence, avec le rapporteur en plus : la construction est rejouée à la souris, et le sommet cherché doit vraiment apparaître comme point d'accroche — dans le cadre, sans quoi l'exercice serait infaisable. |
| `exos-symetrie-axiale`, `exos-symetrie-centrale` | Le symétrique annoncé est celui de l'axe (ou du centre) **dessiné**, et les figures proposées sont superposables à celle de départ. |
| `exos-fonction-affine` | La droite est relue dans le SVG et confrontée à l'équation annoncée. |
| `exos-variations` | Le script de chaque énoncé est exécuté, et la réponse recalculée sur sa sortie. |
| `exos-hauteurs-medianes`, `exos-angles-6e`, `exos-angles-paralleles` | Les propriétés géométriques annoncées sont vérifiées sur la figure, et les leurres n'en vérifient aucune. |
| `exos-comparer-fractions`, `exos-parentheses`, `exos-puissances`, `exos-fraction-pourcentage`, `exos-somme-relatifs` | Tous les calculs sont refaits en arithmétique exacte — entiers, centièmes, produits en croix — jamais en flottants. |

## Les accessoires

Les fichiers en `-decor.js` ne sont pas des contrôles : ce sont les DOM et
tableaux JSXGraph simulés que partagent plusieurs d'entre eux. Le lanceur les
ignore, comme `python-conformite-pont.js` et `python-conformite-cas.py`, qui
appartiennent à `python-conformite.py`.
