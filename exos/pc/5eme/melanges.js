/*
 * Exercices « Mélanges homogènes et hétérogènes » (5ème, physique-chimie).
 *
 * Cinq familles :
 *   - reconnaître : un bécher dessiné (un dépôt, une couche, un trouble, ou
 *     rien) ou un mélange de la vie courante, homogène ou hétérogène ? Un
 *     mélange coloré mais limpide est homogène : la couleur n'est pas un
 *     indice ;
 *   - vocabulaire : solvant, soluté, solution, soluble, insoluble, miscible ;
 *   - saturation : 36 g de sel au plus pour 100 mL d'eau — ce qui reste au
 *     fond, ce qu'on peut dissoudre au plus, saturée ou non ; avec un volume
 *     d'eau différent de 100 mL aux paliers hauts (proportionnalité) ;
 *   - séparer : filtration, décantation, évaporation — laquelle, et ce qu'on
 *     obtient (le filtrat d'une eau salée est toujours salé) ;
 *   - masse : la masse se conserve, la solution pèse l'eau plus le soluté.
 *
 * La figure est un SVG maison, relu par le contrôle : des grains ou une
 * couche dessinés, c'est hétérogène, quelle que soit la légende.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var SEL = 36;                      // solubilité du sel, en g pour 100 mL d'eau

  /* Ce qu'on peut verser dans l'eau, et ce qu'on voit après agitation et repos. */
  var SUBS = [
    { nom: 'du sel', nature: 'H', aspect: 'limpide', mot: 'le sel se dissout : il est soluble' },
    { nom: 'du sucre', nature: 'H', aspect: 'limpide', mot: 'le sucre se dissout : il est soluble' },
    { nom: 'du sirop de menthe', nature: 'H', aspect: 'colore', teinte: '#4ade80', mot: 'le sirop et l\'eau sont miscibles : le mélange est coloré mais a le même aspect partout' },
    { nom: 'du sirop de grenadine', nature: 'H', aspect: 'colore', teinte: '#fb7185', mot: 'le sirop et l\'eau sont miscibles : le mélange est coloré mais a le même aspect partout' },
    { nom: 'de l\'alcool', nature: 'H', aspect: 'limpide', mot: 'l\'alcool et l\'eau sont miscibles' },
    { nom: 'du vinaigre', nature: 'H', aspect: 'limpide', mot: 'le vinaigre et l\'eau sont miscibles' },
    { nom: 'de l\'huile', nature: 'X', aspect: 'couche', mot: 'l\'huile et l\'eau ne sont pas miscibles : l\'huile forme une couche au-dessus' },
    { nom: 'du sable', nature: 'X', aspect: 'depot', mot: 'le sable est insoluble : il se dépose au fond' },
    { nom: 'de la craie en poudre', nature: 'X', aspect: 'depot', mot: 'la craie est insoluble : elle se dépose au fond' },
    { nom: 'de la terre', nature: 'X', aspect: 'trouble', mot: 'la terre est insoluble : l\'eau devient trouble et un dépôt se forme' },
    { nom: 'de la farine', nature: 'X', aspect: 'trouble', mot: 'la farine est insoluble : l\'eau devient trouble' },
    { nom: 'des copeaux de bois', nature: 'X', aspect: 'flotte', mot: 'le bois est insoluble : les copeaux flottent' }
  ];
  /* Des mélanges tout faits, sans figure. */
  var TOUT_FAITS = [
    { nom: 'l\'eau de mer', nature: 'H', mot: 'le sel est dissous, on ne le voit pas' },
    { nom: 'l\'air', nature: 'H', mot: 'c\'est un mélange de gaz (diazote, dioxygène…) qui a le même aspect partout' },
    { nom: 'une vinaigrette au repos', nature: 'X', mot: 'l\'huile et le vinaigre se séparent en deux couches' },
    { nom: 'un jus d\'orange avec sa pulpe', nature: 'X', mot: 'on distingue la pulpe dans le jus' },
    { nom: 'de l\'eau gazeuse avec ses bulles', nature: 'X', mot: 'on distingue les bulles de gaz dans le liquide' },
    { nom: 'de l\'eau boueuse', nature: 'X', mot: 'on distingue la terre en suspension, l\'eau est trouble' },
    { nom: 'du thé sans ses feuilles', nature: 'H', mot: 'il est coloré, mais a le même aspect partout' },
    { nom: 'une eau sucrée', nature: 'H', mot: 'le sucre est dissous, on ne le voit pas' },
    { nom: 'du sable mouillé', nature: 'X', mot: 'on distingue les grains de sable et l\'eau' },
    { nom: 'une soupe avec des morceaux de légumes', nature: 'X', mot: 'on distingue les morceaux' }
  ];

  /* ------------------------------------------------------------------ */
  /* Le bécher dessiné                                                   */
  /* ------------------------------------------------------------------ */
  var W = 200, H = 180, X1 = 50, X2 = 150, FOND = 160, HAUT = 30, NIVEAU = 70;
  function grain(x, y, col, r) { return '<circle class="grain" cx="' + x + '" cy="' + y + '" r="' + (r || 3) + '" fill="' + col + '"/>'; }
  function dessin(rnd, s) {
    var out = ['<svg class="exo-figure" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg">'];
    var col = s.aspect === 'colore' ? s.teinte : s.aspect === 'trouble' ? '#b08968' : '#bfdbfe';
    var op = s.aspect === 'trouble' ? 0.95 : s.aspect === 'colore' ? 0.8 : 0.7;
    var niveau = s.aspect === 'couche' ? NIVEAU + 18 : NIVEAU;
    out.push('<rect class="liquide" x="' + X1 + '" y="' + niveau + '" width="' + (X2 - X1) + '" height="' + (FOND - niveau) + '" fill="' + col + '" fill-opacity="' + op + '"/>');
    if (s.aspect === 'couche') out.push('<rect class="couche" x="' + X1 + '" y="' + NIVEAU + '" width="' + (X2 - X1) + '" height="18" fill="#facc15" fill-opacity="0.9"/>');
    var n = rnd.entier(10, 16), i;
    if (s.aspect === 'depot' || s.aspect === 'trouble') {
      for (i = 0; i < n; i++) out.push(grain(X1 + 6 + rnd.entier(0, X2 - X1 - 12), FOND - 4 - rnd.entier(0, 8), s.aspect === 'depot' ? '#a16207' : '#78350f', s.aspect === 'depot' ? 3 : 2.2));
    }
    if (s.aspect === 'flotte') {
      for (i = 0; i < n; i++) out.push(grain(X1 + 6 + rnd.entier(0, X2 - X1 - 12), niveau + 2 + rnd.entier(0, 4), '#92400e', 3));
    }
    out.push('<path class="becher" d="M' + (X1 - 6) + ' ' + HAUT + ' L' + X1 + ' ' + HAUT + ' L' + X1 + ' ' + FOND + ' L' + X2 + ' ' + FOND + ' L' + X2 + ' ' + HAUT + ' L' + (X2 + 6) + ' ' + HAUT +
             '" fill="none" stroke="#334155" stroke-width="2.5"/>');
    out.push('</svg>');
    return out.join('');
  }

  /* ------------------------------------------------------------------ */
  /* Reconnaître                                                         */
  /* ------------------------------------------------------------------ */
  function reconnaitre(rnd, palier) {
    var avecFigure = palier <= 2 ? rnd.booleen(0.65) : rnd.booleen(0.3);
    var vf = rnd.booleen(0.4), homogene, enonce, etapes, famille;
    if (avecFigure) {
      var s = rnd.choix(SUBS);
      homogene = s.nature === 'H';
      enonce = dessin(rnd, s) +
        '<p>On a versé ' + s.nom + ' dans de l\'eau, agité, puis laissé reposer. Voici le bécher.</p>';
      etapes = ['Regarde le bécher : ' + (homogene ? 'le liquide a le même aspect partout, on ne distingue qu\'un seul constituant.' :
                 s.aspect === 'couche' ? 'on distingue deux couches : deux constituants.' :
                 s.aspect === 'flotte' ? 'on distingue des morceaux qui flottent : deux constituants.' :
                 'on distingue un dépôt' + (s.aspect === 'trouble' ? ' et une eau trouble' : '') + ' : deux constituants.'),
                'Donc ' + s.mot + ' : le mélange est <b>' + (homogene ? 'homogène' : 'hétérogène') + '</b>.'];
      famille = 'figure';
    } else {
      var m = rnd.choix(palier >= 2 ? TOUT_FAITS : TOUT_FAITS.slice(0, 6).concat(SUBS.filter(function (x) { return x.aspect !== 'flotte'; }).map(function (x) {
        return { nom: 'de l\'eau avec ' + x.nom + ', après agitation et repos', nature: x.nature, mot: x.mot };
      })));
      homogene = m.nature === 'H';
      enonce = '<p>Considère ' + m.nom + '.</p>';
      etapes = ['Un mélange est <b>homogène</b> si on ne distingue pas ses constituants à l\'œil nu, <b>hétérogène</b> si on en distingue au moins deux.',
                'Ici, ' + m.mot + ' : le mélange est <b>' + (homogene ? 'homogène' : 'hétérogène') + '</b>.'];
      famille = 'texte';
    }
    if (vf) {
      var affirme = rnd.booleen(0.5) ? 'homogène' : 'hétérogène';
      return { famille: 'reconnaitre-' + famille, enonce: enonce + '<p>Vrai ou faux : ce mélange est <b>' + affirme + '</b>.</p>',
               type: 'vraifaux', correct: (affirme === 'homogène') === homogene ? 0 : 1, etapes: etapes,
               indices: ['Peux-tu distinguer deux choses différentes à l\'œil nu ?'], duree: 30 };
    }
    return { famille: 'reconnaitre-' + famille, enonce: enonce + '<p>Ce mélange est-il homogène ou hétérogène ?</p>',
             type: 'qcm', choix: ['homogène', 'hétérogène'], correct: homogene ? 0 : 1, etapes: etapes,
             indices: ['Homogène : un seul aspect partout. Hétérogène : on distingue au moins deux constituants.'], duree: 30 };
  }

  /* ------------------------------------------------------------------ */
  /* Vocabulaire                                                         */
  /* ------------------------------------------------------------------ */
  var VOCAB = [
    { q: 'Dans de l\'eau salée, comment appelle-t-on l\'<b>eau</b>, le liquide qui dissout le sel ?', rep: 'le solvant', autres: ['le soluté', 'la solution', 'le filtrat'],
      why: 'Le liquide qui dissout est le <b>solvant</b> ; ce qui est dissous est le soluté ; l\'ensemble est la solution.' },
    { q: 'Dans de l\'eau sucrée, comment appelle-t-on le <b>sucre</b>, une fois dissous ?', rep: 'le soluté', autres: ['le solvant', 'la solution', 'le résidu'],
      why: 'Ce qui est dissous est le <b>soluté</b> ; le liquide qui le dissout est le solvant.' },
    { q: 'Comment appelle-t-on le mélange homogène obtenu en dissolvant du sel dans de l\'eau ?', rep: 'une solution', autres: ['un solvant', 'un soluté', 'un dépôt'],
      why: 'Solvant + soluté dissous = une <b>solution</b> (ici une solution d\'eau salée).' },
    { q: 'Le sucre disparaît quand on l\'agite dans l\'eau. On dit que le sucre est…', rep: 'soluble dans l\'eau', autres: ['insoluble dans l\'eau', 'miscible à l\'eau', 'saturé'],
      why: 'Un solide qui se dissout est <b>soluble</b>. Il est toujours là, dissous : on ne le voit plus, mais la masse est conservée.' },
    { q: 'Le sable reste au fond, même après agitation. On dit que le sable est…', rep: 'insoluble dans l\'eau', autres: ['soluble dans l\'eau', 'non miscible à l\'eau', 'saturé'],
      why: 'Un solide qui ne se dissout pas est <b>insoluble</b>. « Miscible » ne se dit que de deux liquides.' },
    { q: 'Le sirop et l\'eau donnent un mélange homogène. On dit que ces deux liquides sont…', rep: 'miscibles', autres: ['non miscibles', 'solubles', 'saturés'],
      why: 'Deux liquides qui se mélangent en un mélange homogène sont <b>miscibles</b>.' },
    { q: 'L\'huile et l\'eau forment deux couches. On dit que ces deux liquides sont…', rep: 'non miscibles', autres: ['miscibles', 'insolubles', 'homogènes'],
      why: 'Deux liquides qui ne se mélangent pas sont <b>non miscibles</b> : le moins dense (l\'huile) reste au-dessus.' },
    { q: 'On ajoute du sel dans l\'eau et il ne se dissout plus : il reste au fond. On dit que la solution est…', rep: 'saturée', autres: ['insoluble', 'homogène', 'filtrée'],
      why: 'Quand le solvant ne peut plus dissoudre de soluté, la solution est <b>saturée</b>.' }
  ];
  var MOTS_TEXTE = [
    { q: 'Dans une eau salée, l\'eau est le <b>solvant</b> et le sel est le… (un seul mot)', rep: ['soluté', 'le soluté'], mot: 'soluté' },
    { q: 'Dans une eau sucrée, le sucre est le soluté et l\'eau est le… (un seul mot)', rep: ['solvant', 'le solvant'], mot: 'solvant' },
    { q: 'Un solide qui se dissout dans l\'eau est dit… (un seul mot)', rep: ['soluble'], mot: 'soluble' },
    { q: 'Un solide qui ne se dissout pas dans l\'eau est dit… (un seul mot)', rep: ['insoluble'], mot: 'insoluble' },
    { q: 'Deux liquides qui se mélangent en un mélange homogène sont dits… (un seul mot)', rep: ['miscibles', 'miscible'], mot: 'miscibles' },
    { q: 'Le liquide qui a traversé le filtre s\'appelle le… (un seul mot)', rep: ['filtrat', 'le filtrat'], mot: 'filtrat' },
    { q: 'Une solution qui ne peut plus dissoudre de soluté est dite… (un seul mot)', rep: ['saturée', 'saturee'], mot: 'saturée' }
  ];
  function vocabulaire(rnd, palier) {
    if (palier >= 3 && rnd.booleen(0.5)) {
      var t = rnd.choix(MOTS_TEXTE);
      return { famille: 'vocabulaire-texte', enonce: '<p>' + t.q + '</p>', type: 'texte', reponse: t.rep,
               etapes: ['Le mot attendu est <b>' + t.mot + '</b>.', 'Solvant (ce qui dissout), soluté (ce qui est dissous), solution (le mélange) ; soluble / insoluble pour un solide, miscible / non miscible pour deux liquides ; saturée quand on ne peut plus dissoudre ; filtrat, ce qui passe le filtre.'],
               indices: ['Relis la liste : solvant, soluté, solution, soluble, insoluble, miscible, saturée, filtrat.'], duree: 35 };
    }
    var v = rnd.choix(VOCAB);
    var choix = rnd.melange([v.rep].concat(v.autres));
    return { famille: 'vocabulaire-qcm', enonce: '<p>' + v.q + '</p>', type: 'qcm', choix: choix, correct: choix.indexOf(v.rep),
             etapes: [v.why, 'Réponse : <b>' + v.rep + '</b>.'],
             indices: ['Solvant : ce qui dissout. Soluté : ce qui est dissous. Solution : le mélange obtenu.'], duree: 30 };
  }

  /* ------------------------------------------------------------------ */
  /* Saturation                                                          */
  /* ------------------------------------------------------------------ */
  function saturation(rnd, palier) {
    var V = palier >= 4 ? rnd.choix([50, 200, 250, 300, 500]) : palier === 3 ? rnd.choix([100, 200, 50]) : 100;
    var seuil = SEL * V / 100;
    var forme = palier === 2 ? rnd.choix(['reste', 'reste', 'vf']) : rnd.choix(['reste', 'maxi', 'vf']);
    var rappel = '<p>On peut dissoudre <b>au maximum 36 g de sel dans 100 mL d\'eau</b>.</p>';
    var regle = V === 100 ? '100 mL d\'eau dissolvent au plus 36 g de sel.' :
      V + ' mL d\'eau dissolvent au plus 36 × ' + O.fr(V / 100) + ' = <b>' + O.fr(seuil) + ' g</b> de sel (proportionnalité).';
    if (forme === 'maxi') {
      return { famille: 'saturation-maxi', enonce: rappel + '<p>Quelle masse de sel, au maximum, peut-on dissoudre dans <b>' + V + ' mL</b> d\'eau ?</p>',
               type: 'nombre', reponse: seuil, unite: 'g', etapes: [regle, 'Au-delà, le sel ne se dissout plus : la solution est saturée.'],
               indices: [V === 100 ? 'C\'est écrit dans l\'énoncé !' : 'Combien de fois 100 mL dans ' + V + ' mL ?'], duree: 45 };
    }
    var m;
    if (forme === 'vf') {
      do { m = rnd.entier(1, 10) * Math.max(5, Math.round(seuil / 8)); } while (m === seuil);
      var saturee = m > seuil;
      return { famille: 'saturation-vf', enonce: rappel + '<p>On verse <b>' + m + ' g</b> de sel dans <b>' + V + ' mL</b> d\'eau et on agite longtemps.</p><p>Vrai ou faux : la solution obtenue est saturée (il reste du sel au fond).</p>',
               type: 'vraifaux', correct: saturee ? 0 : 1,
               etapes: [regle, m + ' g, c\'est ' + (saturee ? 'plus' : 'moins') + ' que ' + O.fr(seuil) + ' g : ' + (saturee ? 'le surplus reste au fond, la solution est <b>saturée</b>.' : 'tout le sel se dissout, la solution n\'est <b>pas saturée</b>.')],
               indices: ['Compare la masse versée à la masse maximale qu\'on peut dissoudre dans ' + V + ' mL.'], duree: 45 };
    }
    m = seuil + rnd.choix([-10, -5, 0, 4, 9, 14, 20, 24, 30]);
    if (m < 5) m = seuil + 4;
    var reste = Math.max(0, m - seuil);
    return { famille: 'saturation-reste', enonce: rappel + '<p>On verse <b>' + O.fr(m) + ' g</b> de sel dans <b>' + V + ' mL</b> d\'eau et on agite longtemps. Quelle masse de sel reste au fond, non dissoute ?</p>',
             type: 'nombre', reponse: reste, unite: 'g',
             etapes: [regle, reste === 0 ? O.fr(m) + ' g ⩽ ' + O.fr(seuil) + ' g : tout le sel se dissout, il reste <b>0 g</b> au fond.' :
                      O.fr(m) + ' − ' + O.fr(seuil) + ' = <b>' + O.fr(reste) + ' g</b> restent au fond : la solution est saturée.'],
             indices: ['Combien de sel l\'eau peut-elle dissoudre au plus ? Le reste ne se dissout pas.'], duree: 50 };
  }

  /* ------------------------------------------------------------------ */
  /* Séparer                                                             */
  /* ------------------------------------------------------------------ */
  var SEPARER = [
    { q: 'Pour retirer le sable d\'un mélange eau + sable, vite et complètement, quelle technique utilise-t-on ?', rep: 'la filtration', autres: ['l\'évaporation', 'l\'agitation'],
      why: 'Le filtre retient le solide insoluble (le sable) et laisse passer l\'eau : c\'est la <b>filtration</b>.' },
    { q: 'Pour récupérer le sel dissous dans de l\'eau salée, quelle technique utilise-t-on ?', rep: 'l\'évaporation', autres: ['la filtration', 'la décantation'],
      why: 'Le sel est dissous : il passe à travers le filtre et ne se dépose pas. Il faut faire <b>évaporer</b> l\'eau pour le récupérer.' },
    { q: 'Pour séparer l\'huile de l\'eau dans une vinaigrette, quelle technique utilise-t-on ?', rep: 'la décantation', autres: ['la filtration', 'l\'évaporation'],
      why: 'L\'huile et l\'eau ne sont pas miscibles : au repos, elles se séparent en deux couches que l\'on peut séparer, c\'est la <b>décantation</b> (dans une ampoule à décanter). Un filtre laisserait passer les deux liquides.' },
    { q: 'On laisse reposer de l\'eau boueuse : la terre se dépose au fond. Comment s\'appelle cette technique ?', rep: 'la décantation', autres: ['la filtration', 'la dissolution'],
      why: 'Laisser reposer pour que le solide se dépose, c\'est la <b>décantation</b>.' },
    { q: 'On filtre de l\'eau salée. Que contient le filtrat ?', rep: 'de l\'eau salée, limpide', autres: ['de l\'eau pure', 'du sel seulement'],
      why: 'Le sel dissous passe à travers le filtre : le filtrat est limpide mais toujours <b>salé</b>. La filtration ne sépare pas un mélange homogène.' },
    { q: 'On filtre de l\'eau mélangée à du sable. Que reste-t-il sur le filtre ?', rep: 'le sable', autres: ['l\'eau', 'rien'],
      why: 'Le sable, insoluble, est retenu par le filtre : c\'est le <b>résidu</b>. Le filtrat est de l\'eau limpide.' },
    { q: 'On filtre de l\'eau mélangée à de la terre. Qu\'obtient-on comme filtrat ?', rep: 'de l\'eau limpide', autres: ['de l\'eau trouble', 'de la terre'],
      why: 'Le filtre retient la terre, même ses particules fines : le filtrat est <b>limpide</b>.' }
  ];
  var SEPARER_VF = [
    { q: 'La filtration permet de séparer le sel de l\'eau salée.', vrai: false, why: 'Le sel dissous traverse le filtre : la filtration ne sépare pas un mélange homogène. Il faut faire évaporer l\'eau.' },
    { q: 'Après filtration d\'une eau salée, le filtrat est encore salé.', vrai: true, why: 'Le sel dissous passe avec l\'eau : le filtrat est limpide mais salé.' },
    { q: 'La filtration permet de séparer le sable de l\'eau.', vrai: true, why: 'Le sable est insoluble : le filtre le retient, l\'eau passe.' },
    { q: 'Un filtre retient l\'huile et laisse passer l\'eau.', vrai: false, why: 'Les deux liquides passent à travers le filtre. Pour les séparer, on décante.' },
    { q: 'La décantation consiste à laisser reposer le mélange pour que le solide se dépose.', vrai: true, why: 'C\'est la définition de la décantation.' },
    { q: 'Pour récupérer le sel de l\'eau de mer, on peut faire évaporer l\'eau.', vrai: true, why: 'L\'eau s\'évapore, le sel reste : c\'est ainsi qu\'on le récolte dans les marais salants.' }
  ];
  function separer(rnd, palier) {
    if (rnd.booleen(0.4)) {
      var v = rnd.choix(SEPARER_VF);
      return { famille: 'separer-vf', enonce: '<p>Vrai ou faux : ' + v.q + '</p>', type: 'vraifaux', correct: v.vrai ? 0 : 1,
               etapes: [v.why, 'Donc c\'est <b>' + (v.vrai ? 'vrai' : 'faux') + '</b>.'],
               indices: ['Le filtre retient un solide insoluble ; ce qui est dissous passe.'], duree: 35 };
    }
    var s = rnd.choix(SEPARER);
    var choix = rnd.melange([s.rep].concat(s.autres));
    return { famille: 'separer-qcm', enonce: '<p>' + s.q + '</p>', type: 'qcm', choix: choix, correct: choix.indexOf(s.rep),
             etapes: [s.why, 'Réponse : <b>' + s.rep + '</b>.'],
             indices: ['Filtration : retenir un solide insoluble. Décantation : laisser reposer. Évaporation : faire partir l\'eau.'], duree: 35 };
  }

  /* ------------------------------------------------------------------ */
  /* La masse se conserve                                                */
  /* ------------------------------------------------------------------ */
  function masse(rnd, palier) {
    var solute = rnd.choix(['sel', 'sucre']);
    var V = rnd.choix([100, 150, 200, 250, 300, 500]);
    var m = rnd.entier(2, 9) * 5;
    if (palier >= 4 && rnd.booleen(0.5)) {
      return { famille: 'masse-inverse', enonce: '<p>Une solution d\'eau ' + (solute === 'sel' ? 'salée' : 'sucrée') + ' pèse <b>' + (V + m) + ' g</b>. Elle a été préparée en dissolvant <b>' + m + ' g</b> de ' + solute + ' dans de l\'eau. Quelle masse d\'eau a-t-on utilisée ?</p>',
               type: 'nombre', reponse: V, unite: 'g',
               etapes: ['La masse se conserve : masse de la solution = masse d\'eau + masse de ' + solute + '.', 'Masse d\'eau = ' + (V + m) + ' − ' + m + ' = <b>' + V + ' g</b>.'],
               indices: ['Dissous ou pas, le ' + solute + ' pèse toujours ' + m + ' g.'], duree: 45 };
    }
    return { famille: 'masse', enonce: '<p>On dissout <b>' + m + ' g</b> de ' + solute + ' dans <b>' + V + ' g</b> d\'eau. Une fois le ' + solute + ' entièrement dissous, quelle est la masse de la solution ?</p>',
             type: 'nombre', reponse: V + m, unite: 'g',
             etapes: ['Le ' + solute + ' dissous est invisible, mais il est toujours là : la <b>masse se conserve</b>.', 'Masse de la solution = ' + V + ' + ' + m + ' = <b>' + (V + m) + ' g</b>.'],
             indices: ['Le ' + solute + ' a-t-il disparu, ou est-il seulement devenu invisible ?'], duree: 40 };
  }

  /* ------------------------------------------------------------------ */
  MathsExos.register({
    id: 'pc-melanges',
    competence: 'pc-melanges',
    level: '5eme',
    titre: 'Mélanges homogènes et hétérogènes',
    paliers: 4,
    genere: function (rnd, palier) {
      var r = rnd.entier(1, 100);
      if (palier === 1) return reconnaitre(rnd, 1);
      if (palier === 2) return r <= 35 ? reconnaitre(rnd, 2) : r <= 65 ? vocabulaire(rnd, 2) : r <= 85 ? saturation(rnd, 2) : separer(rnd, 2);
      if (palier === 3) return r <= 20 ? vocabulaire(rnd, 3) : r <= 50 ? saturation(rnd, 3) : r <= 75 ? separer(rnd, 3) : r <= 90 ? masse(rnd, 3) : reconnaitre(rnd, 3);
      return r <= 35 ? saturation(rnd, 4) : r <= 60 ? masse(rnd, 4) : r <= 80 ? separer(rnd, 4) : vocabulaire(rnd, 4);
    }
  });
})();
