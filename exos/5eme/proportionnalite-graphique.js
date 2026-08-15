/*
 * proportionnalite-graphique — reconnaître la proportionnalité dans un tableau
 * ou sur un graphique (leçon 5ème du même nom).
 *
 *   intrus       une seule ligne empêche le tableau d'être proportionnel :
 *                laquelle ? — il faut calculer TOUS les quotients ;
 *   coefficient  un tableau proportionnel : quel est le coefficient ?
 *   completer    un tableau proportionnel troué : quelle valeur manque ?
 *   graphique    un nuage de points : proportionnel ou non, et POURQUOI ;
 *   lire         une droite passant par l'origine : lire une valeur ;
 *   point        lequel de ces points appartient à la droite ?
 *   proprietes   vrai/faux sur les deux conditions.
 *
 * ---------------------------------------------------------------------------
 * Ne pas poser de questions qui se devinent
 * ---------------------------------------------------------------------------
 * « Cette situation est-elle proportionnelle ? » se joue à pile ou face, et un
 * élève qui répond au hasard a une chance sur deux d'avoir raison sans rien
 * calculer. Aucune famille ne pose donc la question sous cette forme :
 *
 *   — « intrus » demande QUELLE ligne casse la proportionnalité : il faut les
 *     quatre quotients pour répondre ;
 *   — « graphique » propose trois réponses qui sont trois RAISONS — alignés et
 *     par l'origine, alignés sans passer par l'origine, pas alignés. Se tromper
 *     de raison, c'est se tromper de réponse, même quand on a deviné le oui/non.
 *
 * La famille « graphique » est le cœur du chapitre : le cas « alignés mais pas
 * par l'origine » y revient aussi souvent que les deux autres, parce que c'est
 * lui qu'on rate.
 *
 * ---------------------------------------------------------------------------
 * Des nombres qui tombent juste
 * ---------------------------------------------------------------------------
 * Le coefficient est une fraction de dénominateur 1 ou 2 ; quand il vaut une
 * demie de plus, les abscisses sont prises paires. Toutes les ordonnées sont
 * donc entières, et les quotients se comparent sans arrondi — jamais par des
 * divisions décimales, toujours par des produits en croix.
 *
 * Sur les graphiques, la valeur à lire tombe sur une graduation : on demande à
 * l'élève de lire, pas de deviner entre deux traits. Le pas de graduation est
 * calculé par le même code que celui qui dessine (`MathsGraphique.pas`), pour
 * que la question ne puisse pas se désaccorder de la figure.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var G = MathsGraphique;

  function fr(v) { return O.fr(v); }
  function couple(p) { return '(' + fr(p[0]) + ' ; ' + fr(p[1]) + ')'; }
  /* Un quotient ne tombe pas toujours juste — 11 ÷ 3 n'est pas 3,67. Écrire un
     signe « = » là où il faut un « ≈ » enseignerait le faux au moment même où
     l'on demande de comparer des quotients. */
  function quotientTxt(y, x) {
    var q = y / x;
    var juste = Math.abs(q * 1000 - Math.round(q * 1000)) < 1e-9;
    return fr(y) + ' ÷ ' + fr(x) + (juste ? ' = ' + fr(q)
                                          : ' ≈ ' + fr(Math.round(q * 100) / 100));
  }

  var RAPPEL = 'Une situation est <b>proportionnelle</b> si tous les quotients ' +
    '<b>y ÷ x</b> sont égaux. Sur un graphique, cela se voit : les points sont ' +
    '<b>alignés</b> <i>et</i> la droite <b>passe par l\'origine</b>.';

  /* ===================================================================== */
  /* Les contextes                                                         */
  /* ===================================================================== */
  /* Le coefficient est écrit [numérateur, dénominateur] : c'est lui qui permet
     de tout garder entier. Un dénominateur 2 impose des abscisses paires. */
  var CONTEXTES = [
    { gx: 'nombre de cahiers', gy: 'prix payé (€)', uy: ' €',
      dit: 'Le prix payé pour des cahiers identiques.', ks: [[2, 1], [3, 1], [3, 2], [5, 2]] },
    { gx: 'volume d\'essence (L)', gy: 'prix payé (€)', uy: ' €',
      dit: 'Le prix d\'un plein d\'essence.', ks: [[3, 2], [2, 1], [5, 2]] },
    { gx: 'longueur de tissu (m)', gy: 'prix payé (€)', uy: ' €',
      dit: 'Le prix d\'un tissu vendu au mètre.', ks: [[4, 1], [5, 1], [6, 1], [7, 1]] },
    { gx: 'nombre de parts', gy: 'farine (g)', uy: ' g',
      dit: 'La farine nécessaire pour un gâteau, selon le nombre de parts.',
      ks: [[25, 1], [30, 1], [40, 1]] },
    { gx: 'durée (h)', gy: 'distance (km)', uy: ' km',
      dit: 'La distance parcourue par un train roulant à vitesse constante.',
      ks: [[60, 1], [80, 1], [90, 1]] },
    { gx: 'nombre de photos', gy: 'prix payé (€)', uy: ' €',
      dit: 'Le prix d\'un tirage de photos.', ks: [[2, 1], [3, 1], [5, 2]] }
  ];

  /* Un tableau proportionnel : des abscisses distinctes, croissantes, et des
     ordonnées entières. */
  function tireTable(rnd, combien) {
    var c = rnd.choix(CONTEXTES);
    var k = rnd.choix(c.ks);
    var pasX = k[1];                       // 2 quand le coefficient est un « et demi »
    var xs = [], libres = [];
    for (var v = pasX; v <= 10; v += pasX) libres.push(v);
    libres = rnd.melange(libres).slice(0, combien).sort(function (a, b) { return a - b; });
    xs = libres;
    return { c: c, k: k, kv: k[0] / k[1],
             lignes: xs.map(function (x) { return [x, x * k[0] / k[1]]; }) };
  }

  /* Le tableau, en HTML. `trou` remplace une valeur par un point d'interrogation. */
  function tableHtml(t, trou) {
    var h = '<table class="exo-tab"><thead><tr><th>' + t.c.gx + '</th><th>' + t.c.gy +
            '</th></tr></thead><tbody>';
    t.lignes.forEach(function (l, i) {
      var vx = fr(l[0]), vy = fr(l[1]) + (t.c.uy || '');
      if (trou && trou.i === i) {
        if (trou.col === 0) vx = '<b>?</b>'; else vy = '<b>?</b>';
      }
      h += '<tr><td>' + vx + '</td><td>' + vy + '</td></tr>';
    });
    return h + '</tbody></table>';
  }

  /* ===================================================================== */
  /* 1. L'intrus                                                           */
  /* ===================================================================== */
  /* Une seule ligne est fausse : les trois autres ont le même quotient, elle
     non. La réponse est donc unique, et il faut avoir calculé les quatre
     quotients pour la désigner. */
  function qIntrus(rnd, palier) {
    var t = tireTable(rnd, 4);
    var i = rnd.entier(0, 3);
    var ecart = rnd.choix([1, 2, 3, 5]) * rnd.signe();
    var vraie = t.lignes[i][1];
    if (vraie + ecart <= 0) ecart = Math.abs(ecart);
    t.lignes[i] = [t.lignes[i][0], vraie + ecart];

    var props = t.lignes.map(function (l) {
      return { t: fr(l[0]) + ' → ' + fr(l[1]) + (t.c.uy || ''), bon: false };
    });
    props[i].bon = true;

    return {
      enonce: t.c.dit + '<br>' + tableHtml(t) +
        '<b>Une seule ligne empêche ce tableau d\'être un tableau de proportionnalité. ' +
        'Laquelle ?</b>',
      type: 'qcm',
      choix: props.map(function (p) { return p.t; }),
      correct: i,
      etapes: [RAPPEL,
        'On calcule le quotient de chaque ligne : ' +
          t.lignes.map(function (l) { return quotientTxt(l[1], l[0]); }).join(', ') + '.',
        'Trois valent <b>' + fr(t.kv) + '</b>, une seule non : c\'est la ligne <b>' +
          fr(t.lignes[i][0]) + ' → ' + fr(t.lignes[i][1]) + '</b>.',
        'Avec <b>' + fr(t.lignes[i][0] * t.kv) + '</b> à la place de <b>' +
          fr(t.lignes[i][1]) + '</b>, le tableau serait proportionnel, de coefficient <b>' +
          fr(t.kv) + '</b>.'],
      indices: ['Divise la seconde valeur par la première, sur <b>chaque</b> ligne.',
                'Trois quotients seront égaux : l\'intruse est la quatrième.'],
      duree: 110
    };
  }

  /* ===================================================================== */
  /* 2. Le coefficient                                                     */
  /* ===================================================================== */
  function qCoefficient(rnd, palier) {
    var t = tireTable(rnd, palier <= 2 ? 3 : 4);
    var l = t.lignes[0];
    return {
      enonce: t.c.dit + '<br>' + tableHtml(t) +
        '<b>Ce tableau est un tableau de proportionnalité. Quel est son coefficient ?</b>',
      type: 'nombre',
      reponse: t.kv,
      etapes: [RAPPEL,
        'Le coefficient est le quotient d\'une valeur de la seconde colonne par celle de ' +
          'la première : <b>' + fr(l[1]) + ' ÷ ' + fr(l[0]) + ' = ' + fr(t.kv) + '</b>.',
        'On vérifie sur une autre ligne : <b>' + fr(t.lignes[1][1]) + ' ÷ ' +
          fr(t.lignes[1][0]) + ' = ' + fr(t.kv) + '</b> — c\'est bien le même.',
        'On passe donc de la première colonne à la seconde en <b>multipliant par ' +
          fr(t.kv) + '</b>.'],
      indices: ['Divise la seconde valeur par la première.',
                'Le coefficient est le même sur toutes les lignes : une seule suffit.'],
      duree: 80
    };
  }

  /* ===================================================================== */
  /* 3. Compléter                                                          */
  /* ===================================================================== */
  function qCompleter(rnd, palier) {
    var t = tireTable(rnd, palier <= 2 ? 3 : 4);
    var i = rnd.entier(0, t.lignes.length - 1);
    // au palier 4, on cache parfois l'abscisse : il faut alors diviser, pas
    // multiplier — et c'est un autre geste
    var col = (palier >= 3 && rnd.booleen(0.4)) ? 0 : 1;
    var l = t.lignes[i];
    var autre = t.lignes[(i + 1) % t.lignes.length];

    return {
      enonce: t.c.dit + '<br>' + tableHtml(t, { i: i, col: col }) +
        '<b>Ce tableau est un tableau de proportionnalité. Quelle valeur remplace le ' +
        '« ? »</b>',
      type: 'nombre',
      reponse: col === 0 ? l[0] : l[1],
      etapes: [RAPPEL,
        'Le coefficient se lit sur une ligne complète : <b>' + fr(autre[1]) + ' ÷ ' +
          fr(autre[0]) + ' = ' + fr(t.kv) + '</b>.',
        col === 0
          ? 'On remonte donc en <b>divisant</b> par ' + fr(t.kv) + ' : <b>' + fr(l[1]) +
            ' ÷ ' + fr(t.kv) + ' = ' + fr(l[0]) + '</b>.'
          : 'On applique ce coefficient : <b>' + fr(l[0]) + ' × ' + fr(t.kv) + ' = ' +
            fr(l[1]) + '</b>.',
        'La valeur manquante est <b>' + fr(col === 0 ? l[0] : l[1]) + '</b>.'],
      indices: ['Commence par trouver le coefficient sur une ligne complète.',
                col === 0 ? 'Pour remonter de la seconde colonne à la première, on divise.'
                          : 'Pour aller de la première colonne à la seconde, on multiplie.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 4. Le graphique — et surtout POURQUOI                                 */
  /* ===================================================================== */
  /* Les trois réponses sont trois raisons, toujours les mêmes, dans un ordre
     mélangé. Répondre « non » sans la bonne raison ne rapporte rien : c'est la
     raison qu'on veut installer. */
  var RAISONS = [
    { cle: 'oui', t: 'Oui : les points sont alignés, et la droite passe par l\'origine.' },
    { cle: 'origine', t: 'Non : les points sont alignés, mais la droite ne passe pas par ' +
        'l\'origine.' },
    { cle: 'alignes', t: 'Non : les points ne sont pas alignés.' }
  ];

  function nuage(rnd, cas) {
    var k = rnd.choix([2, 3, 4, 5]);
    var xs = rnd.melange([1, 2, 3, 4, 5, 6]).slice(0, 4)
                .sort(function (a, b) { return a - b; });
    var pts;
    if (cas === 'oui') {
      pts = xs.map(function (x) { return [x, k * x]; });
    } else if (cas === 'origine') {
      var b = rnd.choix([2, 3, 4, 5]);
      pts = xs.map(function (x) { return [x, k * x + b]; });
    } else {
      // on décale un seul point : les trois autres restent alignés avec
      // l'origine, celui-là non — le coude se voit
      var j = rnd.entier(1, 3);
      var d = rnd.choix([2, 3, 4]) * rnd.signe();
      pts = xs.map(function (x) { return [x, k * x]; });
      if (pts[j][1] + d <= 0) d = Math.abs(d);
      pts[j] = [pts[j][0], pts[j][1] + d];
    }
    return pts;
  }

  /* Les deux tests, écrits ici pour de bon : c'est le générateur qui doit
     savoir ce qu'il a dessiné, et non se fier au cas qu'il a demandé. */
  function alignes(p) {
    for (var i = 2; i < p.length; i++) {
      if ((p[1][0] - p[0][0]) * (p[i][1] - p[0][1]) !==
          (p[1][1] - p[0][1]) * (p[i][0] - p[0][0])) return false;
    }
    return true;
  }
  function proportionnel(p) {
    for (var i = 1; i < p.length; i++) {
      if (p[0][0] === 0 || p[i][1] * p[0][0] !== p[0][1] * p[i][0]) return false;
    }
    return true;
  }

  function qGraphique(rnd, palier) {
    var cas = rnd.choix(['oui', 'origine', 'alignes', 'oui', 'origine', 'alignes']);
    var pts;
    for (var essai = 0; essai < 60; essai++) {
      pts = nuage(rnd, cas);
      var ali = alignes(pts), pro = proportionnel(pts);
      // le dessin doit être exactement le cas voulu, sinon on retire
      if (cas === 'oui' && pro) break;
      if (cas === 'origine' && ali && !pro) break;
      if (cas === 'alignes' && !ali) break;
    }
    var vrai = proportionnel(pts) ? 'oui' : alignes(pts) ? 'origine' : 'alignes';

    var props = rnd.melange(RAISONS.slice());
    var svg = G.repere({
      points: pts.map(function (p) { return { p: p }; }),
      joindre: palier <= 2, gx: 'x', gy: 'y'
    });

    var q = pts.map(function (p) { return quotientTxt(p[1], p[0]); });
    var etapes = [RAPPEL];
    if (vrai === 'oui') {
      etapes.push('Les points sont <b>alignés</b> : le tracé qui les relie ne fait aucun coude.');
      etapes.push('Et en prolongeant vers la gauche, la droite arrive <b>sur l\'origine</b> ' +
        '(0 ; 0). Les <b>deux</b> conditions sont remplies.');
      etapes.push('Les quotients le confirment : ' + q.join(', ') + ' — tous égaux.');
    } else if (vrai === 'origine') {
      etapes.push('Les points sont bien <b>alignés</b> — et c\'est là qu\'on se fait avoir.');
      etapes.push('Mais en prolongeant le tracé vers la gauche, il coupe l\'axe vertical ' +
        '<b>au-dessus de l\'origine</b> : la droite ne passe pas par (0 ; 0).');
      etapes.push('Les quotients le confirment : ' + q.join(', ') + ' — ils ne sont pas ' +
        'tous égaux. <b>Alignés ne suffit pas.</b>');
    } else {
      etapes.push('Le tracé qui relie les points fait un <b>coude</b> : les points ne sont ' +
        '<b>pas alignés</b>.');
      etapes.push('Aucune droite ne les contient tous — la première condition tombe, ' +
        'inutile de regarder l\'origine.');
      etapes.push('Les quotients le confirment : ' + q.join(', ') + '.');
    }

    return {
      enonce: 'Voici les points d\'une situation, portés dans un repère.' + svg +
        '<b>Cette situation est-elle une situation de proportionnalité ?</b>',
      type: 'qcm',
      choix: props.map(function (p) { return p.t; }),
      correct: props.map(function (p) { return p.cle; }).indexOf(vrai),
      etapes: etapes,
      indices: ['Deux choses à regarder, dans cet ordre : les points sont-ils alignés ?',
                'Puis : en prolongeant, la droite passerait-elle par l\'origine (0 ; 0) ?'],
      duree: 110
    };
  }

  /* ===================================================================== */
  /* 5. Lire une valeur sur la droite                                      */
  /* ===================================================================== */
  /* La valeur cherchée tombe sur une graduation : on demande de lire, pas
     d'estimer entre deux traits. Le pas de l'axe est demandé au module qui
     dessine — sinon la question pourrait se désaccorder de la figure. */
  /* Sur un graphique, un coefficient de 90 rendrait l'axe vertical illisible et
     aucune valeur ne tomberait sur une graduation. Les familles graphiques
     tirent donc leur coefficient ici, et leur contexte parmi ceux dont la
     seconde grandeur est un prix. */
  var KS_GRAPHE = [[2, 1], [3, 1], [4, 1], [5, 1], [3, 2], [5, 2]];
  function contexteGraphe(rnd) {
    return rnd.choix(CONTEXTES.filter(function (c) { return /prix/.test(c.gy); }));
  }

  function qLire(rnd, palier) {
    var c = contexteGraphe(rnd);
    var k = rnd.choix(KS_GRAPHE), kv = k[0] / k[1];
    var xmax = 8 * k[1];
    var ymax = kv * xmax;
    var py = G.pas(ymax);

    // les abscisses dont l'ordonnée tombe sur une graduation
    var bons = [];
    for (var x = k[1]; x <= xmax; x += k[1]) {
      if (Math.abs((kv * x) % py) < 1e-9) bons.push(x);
    }
    if (!bons.length) return qCoefficient(rnd, palier);
    var xq = rnd.choix(bons);

    /* Aux deux premiers paliers, les pointillés mènent l'œil de l'axe au point :
       on apprend le geste. Ensuite ils disparaissent, et c'est à l'élève de le
       faire. */
    var svg = G.repere({
      points: [], droite: { k: kv }, xmax: xmax, ymax: ymax, gx: c.gx, gy: c.gy,
      guides: palier <= 2 ? [{ x: xq, y: kv * xq }] : []
    });
    return {
      enonce: c.dit + ' La droite ci-dessous représente cette situation.' + svg +
        '<b>Lis sur le graphique la valeur qui correspond à ' + fr(xq) + '.</b> ' +
        '(donne le nombre seul)',
      type: 'nombre',
      reponse: kv * xq,
      etapes: [RAPPEL,
        'On part de <b>' + fr(xq) + '</b> sur l\'axe horizontal, on monte jusqu\'à la ' +
          'droite, puis on file vers l\'axe vertical.',
        'On lit <b>' + fr(kv * xq) + '</b>' + (c.uy || '') + '.',
        'Le calcul le confirme : la droite passe par l\'origine, le coefficient vaut <b>' +
          fr(kv) + '</b>, et <b>' + fr(xq) + ' × ' + fr(kv) + ' = ' + fr(kv * xq) + '</b>.'],
      indices: ['Monte depuis l\'axe horizontal jusqu\'à la droite, puis va vers la gauche.',
                'Tu peux aussi trouver le coefficient sur un point facile à lire, puis ' +
                'multiplier.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 6. Quel point appartient à la droite ?                                */
  /* ===================================================================== */
  function qPoint(rnd, palier) {
    var c = contexteGraphe(rnd);
    var k = rnd.choix(KS_GRAPHE), kv = k[0] / k[1];
    var xmax = 8 * k[1], ymax = kv * xmax;
    var py = G.pas(ymax);

    var x = rnd.entier(2, 7) * k[1];
    var bon = [x, kv * x];
    /* Les leurres : à côté verticalement (l'erreur de lecture), les deux nombres
       échangés (l'erreur de sens), et un pas plus loin en abscisse. */
    var faux = [[x, kv * x + py], [kv * x, x], [x + k[1], kv * x]];
    var vus = {}, props = [{ p: bon, bon: true }];
    vus[bon.join('/')] = 1;
    faux.forEach(function (p) {
      if (vus[p.join('/')]) return;
      if (p[1] === kv * p[0]) return;              // il serait sur la droite : pas un leurre
      if (p[0] <= 0 || p[1] <= 0) return;
      vus[p.join('/')] = 1;
      props.push({ p: p, bon: false });
    });
    if (props.length < 3) return qLire(rnd, palier);
    props = rnd.melange(props);

    var svg = G.repere({
      points: [], droite: { k: kv }, xmax: xmax, ymax: ymax, gx: c.gx, gy: c.gy
    });
    return {
      enonce: c.dit + ' La droite ci-dessous représente cette situation.' + svg +
        '<b>Lequel de ces points appartient à la droite ?</b>',
      type: 'qcm',
      choix: props.map(function (p) { return couple(p.p); }),
      correct: props.map(function (p) { return p.bon; }).indexOf(true),
      etapes: [RAPPEL,
        'La droite passe par l\'origine, et son coefficient vaut <b>' + fr(kv) + '</b> : ' +
          'un point (x ; y) lui appartient quand <b>y = ' + fr(kv) + ' × x</b>.',
        'Pour ' + couple(bon) + ' : <b>' + fr(x) + ' × ' + fr(kv) + ' = ' + fr(kv * x) +
          '</b> — c\'est bien lui.',
        'Attention à l\'ordre des deux nombres : ' + couple([kv * x, x]) + ' n\'est pas ' +
          couple([x, kv * x]) + '.'],
      indices: ['Multiplie l\'abscisse par le coefficient de la droite.',
                'Le premier nombre est l\'abscisse : on le lit sur l\'axe horizontal.'],
      duree: 100
    };
  }

  /* ===================================================================== */
  /* 7. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Si les points d\'une situation sont alignés, alors la situation est ' +
         'proportionnelle.', ok: false,
      d: 'Il manque une condition : la droite doit <b>aussi</b> passer par l\'origine. Le ' +
         'prix d\'une course de taxi avec prise en charge donne des points parfaitement ' +
         'alignés, et n\'est pas proportionnel.' },
    { t: 'Dans une situation de proportionnalité, les points sont alignés sur une droite ' +
         'qui passe par l\'origine.', ok: true,
      d: 'C\'est la reconnaissance graphique. Les deux conditions vont ensemble.' },
    { t: 'Si tous les quotients y ÷ x sont égaux, la situation est proportionnelle.',
      ok: true,
      d: 'C\'est la définition même, et ce quotient commun est le <b>coefficient</b>.' },
    { t: 'Pour montrer qu\'une situation n\'est pas proportionnelle, il suffit de trouver ' +
         'deux quotients différents.', ok: true,
      d: 'Un seul contre-exemple suffit. En revanche, pour montrer qu\'elle <b>l\'est</b>, ' +
         'il faut les vérifier tous.' },
    { t: 'Une droite qui passe par l\'origine peut représenter une situation qui n\'est pas ' +
         'proportionnelle.', ok: false,
      d: 'Non : passer par l\'origine et être une droite, c\'est exactement la ' +
         'proportionnalité. Il n\'y a pas d\'exception.' },
    { t: 'Dans un tableau de proportionnalité, si on double une valeur de la première ' +
         'colonne, la valeur correspondante de la seconde double aussi.', ok: true,
      d: 'Puisqu\'on multiplie toujours par le même coefficient : ' +
         '\\((2x) \\times k = 2 \\times (x \\times k)\\).' },
    { t: 'Un tableau où l\'on ajoute toujours le même nombre pour passer d\'une colonne à ' +
         'l\'autre est un tableau de proportionnalité.', ok: false,
      d: 'Ajouter n\'est pas multiplier. Avec « + 3 » : 1 → 4 et 2 → 5, or ' +
         '\\(4 \\div 1 = 4\\) et \\(5 \\div 2 = 2{,}5\\). Les quotients diffèrent.' },
    { t: 'Le point (0 ; 0) appartient toujours à la représentation graphique d\'une ' +
         'situation de proportionnalité.', ok: true,
      d: 'Oui : à une quantité nulle correspond toujours une quantité nulle. Zéro cahier ' +
         'coûte zéro euro.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d, RAPPEL],
      indices: ['Les deux conditions : <b>alignés</b>, <b>et</b> par l\'<b>origine</b>.'],
      duree: 60
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'proportionnalite-graphique', competence: 'proportionnalite-graphique',
    level: '5eme',
    titre: 'Reconnaître la proportionnalité : tableau et graphique', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['coefficient', 'graphique', 'completer', 'proprietes'] :
        palier === 2 ? ['coefficient', 'graphique', 'completer', 'lire', 'proprietes'] :
        palier === 3 ? ['graphique', 'intrus', 'completer', 'lire', 'point', 'graphique'] :
                       ['graphique', 'intrus', 'point', 'lire', 'intrus', 'graphique']);

      if (quoi === 'coefficient') return qCoefficient(rnd, palier);
      if (quoi === 'completer') return qCompleter(rnd, palier);
      if (quoi === 'intrus') return qIntrus(rnd, palier);
      if (quoi === 'lire') return qLire(rnd, palier);
      if (quoi === 'point') return qPoint(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qGraphique(rnd, palier);
    }
  });

})();
