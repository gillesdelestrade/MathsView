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
| `site-chargement` | La page charge-t-elle vraiment tous ses générateurs ? Les `<script>` de `exercices.html` sont rejoués **dans l'ordre** : un fichier placé avant le module dont il dépend lève une `ReferenceError` silencieuse, le générateur ne s'enregistre jamais, et le bouton « S'entraîner » de la leçon retombe sur l'accueil sans message. Vérifie aussi que chaque compétence du catalogue a son générateur, que chaque lien de leçon tombe juste,, que chaque chapitre du catalogue a un libellé (sinon son code s'affiche tel quel en titre de section), et qu'aucun script **en ligne** d'une page HTML n'écrit `global.` — ce nom n'y est lié à rien, et la garde censée protéger d'un module absent lèverait elle-même une `ReferenceError` qui tuerait la page. |
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
| `lecon-mediatrices` | Chaque médiatrice passe par le milieu de son côté et lui est perpendiculaire, les trois se coupent en O, le cercle tracé passe par les trois sommets — et le bandeau dit vrai sur la position de O selon la forme du triangle. |
| `lecon-mediane-aires` | Les deux moitiés du triangle ont bien la même aire. |
| `lecon-reperage` | Les zones du plan et leurs signes se montrent et se masquent, et le bandeau dit dans laquelle tombe le point. Les bonds tracés sont relus dans l'ordre : autant que la valeur absolue de la coordonnée, d'un carreau chacun, dans le bon sens, et l'horizontale avant la verticale — le trajet doit aller de l'origine au point. Le bandeau est confronté au même trajet. |
| `flash-ecran` | Monte l'écran de la séance dans un DOM qui sait se relire, répond aux vingt questions et confronte le récapitulatif à ce qui a été saisi : question, bonne réponse, réponse donnée, temps, ligne à ligne. L'horloge est simulée et **dix secondes s'écoulent entre la première frappe et la validation** — le temps relu doit ignorer ces dix secondes, sans quoi le seuil de trois secondes serait inatteignable. C'est le seul contrôle qui éprouve la mesure de bout en bout. |
| `flash-fondamentaux` | Le barème est vérifié aux bornes exactes (2999 / 3000 / 5999 / 6000 ms). Les 145 faits déclarés doivent être du rappel pur et arithmétiquement justes, sans clé en double, et rester dans les bornes que le nom de la compétence promet. Le tirage est sans remise et pondéré : les faits ratés doivent ressortir au moins trois fois plus souvent que le hasard, et l'ordre des poids (jamais vu > faux > lent > moyen > su) est exigé strictement. Enfin le cloisonnement : une empreinte de la maîtrise, des ceintures et de l'XP est prise avant une séance entière, et doit être identique après. |
| `lecon-probabilites-vocabulaire` | Les issues affichées doivent être exactement celles que l'expérience peut produire, vérifié par les deux bouts : aucune issue tirée ne manque à la liste (sinon les fréquences ne feraient plus 100 %), aucune issue listée ne reste à zéro sur 300 lancers. Chaque événement doit être une partie **stricte** de l'univers — ni vide ni pleine — et le verdict « réalisé » suivre l'appartenance de l'issue tirée. Le piège des deux dés est éprouvé statistiquement : 7 doit sortir près de trois fois plus souvent que 2, faute de quoi le tirage passerait par la somme et la leçon enseignerait le contraire de ce qu'elle affirme. |
| `lecon-probabilites-equiprobabilite` | Cette leçon annonce des nombres que personne ne peut contredire en classe : le contrôle les recalcule tous. Les probabilités des issues sont relues une à une dans les étiquettes affichées et additionnées **en fractions** — elles doivent faire exactement 1, pas 100,2 % de décimaux arrondis. La barre doit dire la même chose : autant de cellules que de parts, des groupes à l'échelle des poids, et les parts mises en avant exactement celles de l'événement. Sa probabilité est refaite, simplifiée et exigée irréductible. Puis on lance pour de bon — 30 séries de 300 — et la fréquence de chaque issue doit rejoindre le nombre annoncé sous elle : c'est ce qui attraperait un tirage qui ne correspond pas au partage affiché. Enfin, pour « Deux dés », le partage en onze parts égales doit être **montré puis barré** : donner d'emblée la bonne réponse laisserait l'erreur intacte. |
| `lecon-proportionnalite-graphique` | Chaque ligne du tableau doit être posée sur le graphique au point exact qu'elle décrit, les pointillés aller d'un axe à l'autre, le tracé relier les points consécutifs, et le prolongement aboutir sur l'axe vertical à l'ordonnée recalculée par le contrôle. Le verdict est refait par produits en croix : proportionnel équivaut à « alignés **et** par l'origine ». Les trois cas doivent être proposés, sinon le piège de la leçon ne serait jamais montré. |
| `lecon-proportions` | Le pourcentage, la fraction simplifiée, l'écriture décimale et le complément sont recalculés indépendamment, pour les quatre situations et toutes les valeurs de la partie. Les deux grilles doivent dire la même chose que le calcul : autant de carreaux que le tout, exactement cent pour la seconde. Le passage sur 100 est vérifié pas à pas : la multiplication quand le dénominateur divise 100 (avec le **même** facteur en haut et en bas), le produit en croix sinon — et les deux chemins doivent être empruntés. |
| `lecon-substitution` | Les six formules sont recalculées indépendamment et confrontées à la dernière ligne affichée ; les valeurs négatives doivent apparaître entre parenthèses, et aucune lettre ne doit survivre à la substitution. |
| `lecon-somme-relatifs`, `lecon-comparer-fractions`, `lecon-parentheses`, `lecon-puissances`, `lecon-fraction-pourcentage` | L'animation est rejouée entièrement dans un DOM simulé : les calculs affichés sont justes, et le rejeu redonne le même écran. Chacun vérifie aussi le bouton **◀ Précédent** — il remet à zéro puis rejoue, et l'écran doit se reconstruire à l'identique. |
| `lecon-variations-python` | La phrase écrite sous la console décrit ce que les nombres montrent vraiment, pour toutes les fonctions du pool. |

## Les exercices

| | |
|---|---|
| `exos-somme-angles` | Chaque figure dit exactement ce que la réponse suppose : angles remesurés sur le polygone, codages confrontés aux longueurs réelles. |
| `exos-compas` | La construction est **réellement faisable** : de vrais gestes de souris sont rejoués, et la droite obtenue passe bien par les points annoncés. |
| `exos-construire-triangles` | Même exigence, avec le rapporteur en plus : la construction est rejouée à la souris, et le sommet cherché doit vraiment apparaître comme point d'accroche — dans le cadre, sans quoi l'exercice serait infaisable. |
| `exos-symetrie-axiale`, `exos-symetrie-centrale` | Le symétrique annoncé est celui de l'axe (ou du centre) **dessiné**, et les figures proposées sont superposables à celle de départ. |
| `exos-fonction-affine` | La droite est relue dans le SVG et confrontée à l'équation annoncée. |
| `exos-variations` | Le script de chaque énoncé est exécuté, et la réponse recalculée sur sa sortie. |
| `exos-mediatrices` | Chaque droite tracée est mesurée : angle avec le côté, écart au milieu. Exactement une vérifie les deux conditions, et les deux leurres échouent chacun sur une seule — franchement, jamais à un millimètre près. Les numéros ne doivent pas se chevaucher. |
| `exos-hauteurs-medianes`, `exos-angles-6e`, `exos-angles-paralleles` | Les propriétés géométriques annoncées sont vérifiées sur la figure, et les leurres n'en vérifient aucune. |
| `exos-reperage` | Le repère est relu dans le SVG — axes, quadrillage, points — et les coordonnées de chaque point sont retrouvées d'après son emplacement réel. Le couple inversé doit toujours figurer parmi les propositions : c'est l'erreur qu'on veut débusquer. |
| `exos-probabilites-vocabulaire` | L'univers est reconstruit à partir de l'énoncé — nombre de faces, de boules, de cartes — et tous les comptages sont refaits. Les trois univers qu'on compte mal doivent être rencontrés et comptés juste : deux pièces valent **4**, deux dés **11**, pierre-feuille-ciseaux **9**. Dans « realise », il faut toujours au moins un événement réalisé **et** un non réalisé, sinon tout cocher suffirait ; et chaque ligne de correction doit s'accorder avec la case attendue. |
| `exos-probabilites-equiprobabilite` | La situation est reconstruite à partir de l'énoncé — nombre de faces, de secteurs, effectif de chaque couleur — et toutes les probabilités sont recalculées **en fractions** : 0,167 n'est pas 1/6, et une réponse attendue arrondie serait refusée à qui écrit la valeur exacte. Chaque condition d'événement est **rejouée** par le contrôle sur l'univers de l'énoncé, au lieu de croire la liste affichée. Un sac dont toutes les couleurs auraient le même effectif est refusé : « 1 sur le nombre de couleurs » deviendrait juste et le piège de la famille disparaîtrait. La somme de deux dés est recomptée sur les **36 couples** réénumérés, jamais sur onze issues. Refuse enfin toute probabilité hors de ]0 ; 1[, toute réponse non irréductible, et tout « undefined » glissé dans une phrase — un champ mal nommé ne plante pas, il part tel quel à l'élève. |
| `exos-proportionnalite-graphique` | Les couples sont relus dans le tableau de l'énoncé, et les points **dans le SVG produit** — reconvertis en coordonnées à partir des axes et des graduations. La réponse doit correspondre à ce qui est réellement dessiné, jamais au cas que le générateur croit avoir tiré. Pour « intrus », la ligne à part doit être unique. Les trois cas graphiques doivent tous sortir. |
| `exos-proportions` | La partie et le tout sont relus dans l'énoncé et tout est recalculé : pourcentage, fraction simplifiée, complément, comparaison. La proportion inversée doit être proposée sans jamais être juste, et dans la famille « comparer » la plus grande quantité ne doit pas être la meilleure proportion — sinon le pourcentage ne servirait à rien. |
| `exos-substitution` | L'expression est relue dans l'énoncé et évaluée par un petit évaluateur indépendant du générateur ; les valeurs négatives doivent être entre parenthèses, et chaque proposition du QCM est calculée pour qu'une seule tombe juste. |
| `exos-comparer-fractions`, `exos-parentheses`, `exos-puissances`, `exos-fraction-pourcentage`, `exos-somme-relatifs` | Tous les calculs sont refaits en arithmétique exacte — entiers, centièmes, produits en croix — jamais en flottants. |

## Les accessoires

Les fichiers en `-decor.js` ne sont pas des contrôles : ce sont les DOM et
tableaux JSXGraph simulés que partagent plusieurs d'entre eux. Le lanceur les
ignore, comme `python-conformite-pont.js` et `python-conformite-cas.py`, qui
appartiennent à `python-conformite.py`.
