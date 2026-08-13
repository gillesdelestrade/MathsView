/*
 * comparer-fractions — comparer et ranger des fractions (leçon 5ème
 * « Comparer deux fractions »).
 *
 * Toute la difficulté tient en une phrase : comparer les numérateurs n'a de
 * sens que si les dénominateurs sont égaux. Les familles de questions
 * découpent la méthode en ses trois gestes, puis la remettent bout à bout :
 *
 *   denominateur  quel dénominateur commun prendre ? On ne calcule rien, on
 *                 choisit — et le plus simple n'est pas toujours le produit ;
 *   amplifier     écrire une fraction donnée avec un dénominateur imposé.
 *                 C'est le geste isolé, avant de s'en servir ;
 *   comparer      les deux fractions, et le signe. Un tirage sur six donne
 *                 deux fractions ÉGALES : sans cela, l'élève apprend qu'il y
 *                 a toujours un gagnant ;
 *   ranger        trois fractions à mettre dans l'ordre. Les mauvaises
 *                 réponses proposées sont l'ordre des numérateurs et celui
 *                 des dénominateurs — les deux erreurs qu'on veut voir ;
 *   sansCalcul    les deux cas qui se lisent sans rien réduire : numérateurs
 *                 égaux (c'est le plus petit dénominateur qui gagne), et la
 *                 comparaison à 1 ;
 *   proprietes    vrai/faux, dont le piège des numérateurs.
 *
 * Aucune division nulle part : deux fractions se comparent par un PRODUIT EN
 * CROIX sur des entiers. Comparer a/b et c/d en virgule flottante mettrait
 * 1/3 et 2/6 à un cheveu l'un de l'autre, et l'exercice refuserait « = ».
 */
(function () {
  'use strict';
  var O = ExosOutils;

  function fr(a, b) { return '\\dfrac{' + a + '}{' + b + '}'; }
  function m(s) { return '\\(' + s + '\\)'; }
  function mf(a, b) { return m(fr(a, b)); }

  // a/b comparé à c/d, sans jamais diviser.
  function cmp(a, b, c, d) { var g = a * d, h = c * b; return g > h ? 1 : (g < h ? -1 : 0); }
  function signe(a, b, c, d) { var s = cmp(a, b, c, d); return s > 0 ? '>' : (s < 0 ? '<' : '='); }
  function pgcd(x, y) { x = Math.abs(x); y = Math.abs(y); while (y) { var t = y; y = x % y; x = t; } return x; }
  function ppcm(x, y) { return x / pgcd(x, y) * y; }

  /* ===================================================================== */
  /* Le tirage des fractions                                               */
  /* ===================================================================== */
  // Une fraction propre, jamais nulle et jamais entière.
  function frac(rnd, bmin, bmax) {
    var b = rnd.entier(bmin || 2, bmax || 12);
    return { a: rnd.entier(1, b - 1), b: b };
  }
  // Deux fractions selon le cas voulu, de valeurs distinctes sauf si `egales`.
  function couple(rnd, palier, egales) {
    var i, f, g;
    if (egales) {
      f = frac(rnd, 2, 6);
      var k = rnd.entier(2, 4);
      return [f, { a: f.a * k, b: f.b * k }];
    }
    var mode = rnd.choix(palier <= 2 ? ['meme', 'multiple', 'multiple']
                                     : ['meme', 'multiple', 'quelconque', 'quelconque']);
    if (mode === 'meme') {
      var b = rnd.entier(4, 12);
      f = { a: rnd.entier(1, b - 1), b: b };
      g = { a: rnd.entier(1, b - 1), b: b };
      for (i = 0; i < 40 && g.a === f.a; i++) g.a = rnd.entier(1, b - 1);
      return [f, g];
    }
    if (mode === 'multiple') {
      var b1 = rnd.entier(2, 6), k2 = rnd.entier(2, 4);
      var b2 = Math.min(b1 * k2, 20);
      f = { a: rnd.entier(1, b1 - 1 || 1), b: b1 };
      g = { a: rnd.entier(1, b2 - 1), b: b2 };
      for (i = 0; i < 60 && cmp(f.a, f.b, g.a, g.b) === 0; i++) g.a = rnd.entier(1, b2 - 1);
      return rnd.booleen(0.5) ? [f, g] : [g, f];
    }
    var PAIRES = [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [3, 7], [4, 7], [5, 6], [2, 7], [5, 8]];
    var p = rnd.choix(PAIRES);
    f = { a: rnd.entier(1, p[0] - 1 || 1), b: p[0] };
    g = { a: rnd.entier(1, p[1] - 1), b: p[1] };
    for (i = 0; i < 60 && cmp(f.a, f.b, g.a, g.b) === 0; i++) g.a = rnd.entier(1, p[1] - 1);
    return rnd.booleen(0.5) ? [f, g] : [g, f];
  }

  // Le dénominateur commun le plus simple : l'un des deux s'il fait l'affaire,
  // sinon le plus petit multiple commun.
  function commun(b, d) {
    if (b === d) return b;
    if (d % b === 0) return d;
    if (b % d === 0) return b;
    return ppcm(b, d);
  }

  /* ===================================================================== */
  /* 1. Quel dénominateur commun ?                                         */
  /* ===================================================================== */
  function qDenominateur(rnd, palier) {
    var t = couple(rnd, palier), f = t[0], g = t[1];
    while (f.b === g.b) { t = couple(rnd, palier); f = t[0]; g = t[1]; }
    var bon = commun(f.b, g.b);
    var prop = [{ cle: 'bon', v: bon }];
    var vus = {}; vus[bon] = 1;
    [f.b * g.b, f.b + g.b, Math.max(f.b, g.b), Math.min(f.b, g.b), bon * 2].forEach(function (v) {
      if (!vus[v] && v > 1 && prop.length < 4) { vus[v] = 1; prop.push({ cle: 'faux', v: v }); }
    });
    var k = 2;
    while (prop.length < 4) { var v2 = bon + k; if (!vus[v2]) { vus[v2] = 1; prop.push({ cle: 'faux', v: v2 }); } k++; }
    prop = rnd.melange(prop);

    var pourquoi = g.b % f.b === 0 || f.b % g.b === 0
      ? m(String(bon)) + ' est un <b>multiple</b> de ' + m(String(Math.min(f.b, g.b))) +
        ' : il suffit donc de transformer une seule des deux fractions.'
      : 'Aucun des deux dénominateurs n\'est un multiple de l\'autre. Le <b>produit</b> ' +
        m(f.b + ' \\times ' + g.b + ' = ' + (f.b * g.b)) + ' conviendrait toujours' +
        (bon === f.b * g.b ? ', et c\'est ici le plus petit possible.'
                           : ', mais ' + m(String(bon)) + ' est un multiple commun <b>plus ' +
                             'petit</b> : ' + m(bon + ' = ' + f.b + ' \\times ' + (bon / f.b)) +
                             ' et ' + m(bon + ' = ' + g.b + ' \\times ' + (bon / g.b)) + '.');

    return {
      enonce: 'On veut comparer ' + mf(f.a, f.b) + ' et ' + mf(g.a, g.b) + '.<br>' +
        'Quel est le <b>dénominateur commun le plus simple</b> à utiliser ?',
      type: 'qcm',
      choix: prop.map(function (p) { return m(String(p.v)); }),
      correct: prop.map(function (p) { return p.cle; }).indexOf('bon'),
      etapes: [
        'Un dénominateur commun doit être un <b>multiple des deux</b> dénominateurs, ici ' +
          m(String(f.b)) + ' et ' + m(String(g.b)) + '.',
        pourquoi,
        'On prendra donc <b>' + O.fr(bon) + '</b> : ' + mf(f.a, f.b) + ' = ' +
          mf(f.a * (bon / f.b), bon) + ' et ' + mf(g.a, g.b) + ' = ' +
          mf(g.a * (bon / g.b), bon) + '.'
      ],
      indices: ['Commence par regarder si l\'un des deux dénominateurs est déjà un multiple de ' +
                  'l\'autre : ce serait le plus simple.',
                'Sinon, le produit des deux marche toujours.'],
      duree: 50
    };
  }

  /* ===================================================================== */
  /* 2. Amplifier : écrire une fraction avec un dénominateur imposé        */
  /* ===================================================================== */
  function qAmplifier(rnd, palier) {
    var b = rnd.entier(2, 9);
    var a = rnd.entier(1, b - 1 || 1);
    var k = rnd.entier(2, palier >= 3 ? 8 : 5);
    var den = b * k;

    return {
      enonce: 'Complète l\'égalité : ' + m(fr(a, b) + ' = \\dfrac{\\ldots}{' + den + '}') +
        '<br>Quel numérateur faut-il écrire ?',
      type: 'nombre', reponse: a * k,
      etapes: [
        'Pour passer du dénominateur ' + m(String(b)) + ' au dénominateur ' + m(String(den)) +
          ', on multiplie par ' + m(String(k)) + ' : ' + m(b + ' \\times ' + k + ' = ' + den) + '.',
        'Une fraction ne change pas de valeur si on multiplie le numérateur <b>et</b> le ' +
          'dénominateur par le même nombre : il faut donc multiplier le numérateur par ' +
          m(String(k)) + ' lui aussi.',
        m(fr(a, b) + ' = ' + fr(a + ' \\times ' + k, b + ' \\times ' + k) + ' = ' + fr(a * k, den)),
        'Le numérateur cherché est <b>' + O.fr(a * k) + '</b>.'
      ],
      indices: ['Par combien faut-il multiplier ' + m(String(b)) + ' pour obtenir ' +
                  m(String(den)) + ' ?',
                'Ce qu\'on fait en bas, on le fait en haut.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 3. Comparer deux fractions                                            */
  /* ===================================================================== */
  function qComparer(rnd, palier) {
    // Un tirage sur six donne deux fractions égales : « = » doit rester une
    // réponse possible, sinon on apprend qu'il y a toujours un gagnant.
    var egales = rnd.booleen(1 / 6);
    var t = couple(rnd, palier, egales), f = t[0], g = t[1];
    var s = signe(f.a, f.b, g.a, g.b);
    var den = commun(f.b, g.b);
    var na = f.a * (den / f.b), nc = g.a * (den / g.b);
    var ordre = rnd.melange(['<', '>', '=']);

    var etapes = [];
    if (f.b === g.b) {
      etapes.push('Les deux fractions ont <b>déjà le même dénominateur</b> : les parts ont la ' +
        'même taille, il suffit de comparer les numérateurs.');
    } else {
      etapes.push('On ne compare jamais les numérateurs de fractions qui n\'ont pas le même ' +
        'dénominateur : les parts n\'ont pas la même taille.');
      etapes.push('Dénominateur commun : <b>' + O.fr(den) + '</b>. ' +
        m(fr(f.a, f.b) + ' = ' + fr(na, den)) + ' et ' + m(fr(g.a, g.b) + ' = ' + fr(nc, den)) + '.');
    }
    etapes.push('On compare les numérateurs : ' + m(na + (na > nc ? ' > ' : (na < nc ? ' < ' : ' = ')) + nc) +
      ', donc ' + m(fr(na, den) + ' ' + (s === '<' ? '<' : (s === '>' ? '>' : '=')) + ' ' + fr(nc, den)) + '.');
    etapes.push('En revenant aux fractions de départ : ' +
      m(fr(f.a, f.b) + ' ' + s + ' ' + fr(g.a, g.b)) + '.');
    if (egales) {
      etapes.push('Ces deux écritures désignent donc le <b>même nombre</b> — c\'est possible, et ' +
        'c\'est même fréquent : ' + m(fr(f.a, f.b) + ' = ' + fr(g.a, g.b)) + '.');
    }

    return {
      enonce: 'Compare ces deux fractions :<br>' + mf(f.a, f.b) + ' &nbsp;…&nbsp; ' + mf(g.a, g.b),
      type: 'qcm',
      choix: ordre.map(function (x) { return m(fr(f.a, f.b) + ' ' + x + ' ' + fr(g.a, g.b)); }),
      correct: ordre.indexOf(s),
      etapes: etapes,
      indices: ['Mets-les d\'abord au <b>même dénominateur</b>.',
                'Ensuite seulement, compare les numérateurs.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 4. Ranger trois fractions                                             */
  /* ===================================================================== */
  function qRanger(rnd, palier) {
    // Trois fractions de dénominateurs qui admettent un petit multiple commun.
    var LOTS = [[2, 4, 8], [2, 3, 6], [3, 6, 12], [2, 5, 10], [4, 6, 12], [3, 4, 12],
                [2, 4, 6], [5, 10, 20], [2, 3, 4], [3, 5, 15]];
    var dens, fr3, i, essai;
    for (essai = 0; essai < 60; essai++) {
      dens = rnd.melange(rnd.choix(LOTS).slice());
      fr3 = dens.map(function (b) { return { a: rnd.entier(1, b - 1), b: b }; });
      // Trois valeurs deux à deux distinctes, sinon le rangement est ambigu.
      var ok = true;
      for (i = 0; i < 3; i++) {
        for (var j = i + 1; j < 3; j++) {
          if (cmp(fr3[i].a, fr3[i].b, fr3[j].a, fr3[j].b) === 0) ok = false;
        }
      }
      if (ok) break;
    }
    var tri = fr3.slice().sort(function (x, y) { return cmp(x.a, x.b, y.a, y.b); });
    function ecrire(liste) {
      return m(liste.map(function (x) { return fr(x.a, x.b); }).join(' < '));
    }
    // Les leurres : l'ordre des numérateurs, celui des dénominateurs, l'inverse.
    var parNum = fr3.slice().sort(function (x, y) { return x.a - y.a; });
    var parDen = fr3.slice().sort(function (x, y) { return x.b - y.b; });
    var envers = tri.slice().reverse();
    var vus = {}, prop = [];
    [{ c: 'bon', l: tri }, { c: 'num', l: parNum }, { c: 'den', l: parDen },
     { c: 'envers', l: envers }].forEach(function (x) {
      var cle = x.l.map(function (y) { return y.a + '/' + y.b; }).join();
      if (!vus[cle]) { vus[cle] = 1; prop.push(x); }
    });
    // S'il manque des propositions (deux leurres identiques), on complète.
    while (prop.length < 3) {
      var perm = rnd.melange(fr3.slice());
      var cle2 = perm.map(function (y) { return y.a + '/' + y.b; }).join();
      if (!vus[cle2]) { vus[cle2] = 1; prop.push({ c: 'faux', l: perm }); }
    }
    prop = rnd.melange(prop);

    var ppc = dens.reduce(function (x, y) { return ppcm(x, y); });
    return {
      enonce: 'Range ces trois fractions dans l\'ordre <b>croissant</b> :<br>' +
        fr3.map(function (x) { return mf(x.a, x.b); }).join(' &nbsp;·&nbsp; '),
      type: 'qcm',
      choix: prop.map(function (p) { return ecrire(p.l); }),
      correct: prop.map(function (p) { return p.c; }).indexOf('bon'),
      etapes: [
        'On met les trois fractions au <b>même dénominateur</b>. Un multiple commun à ' +
          dens.join(', ') + ' est <b>' + O.fr(ppc) + '</b>.',
        fr3.map(function (x) {
          return m(fr(x.a, x.b) + ' = ' + fr(x.a * (ppc / x.b), ppc));
        }).join(' &nbsp;·&nbsp; '),
        'Il n\'y a plus qu\'à ranger les numérateurs : ' +
          tri.map(function (x) { return O.fr(x.a * (ppc / x.b)); }).join(' < ') + '.',
        'D\'où l\'ordre : ' + ecrire(tri) + '.',
        '<b>Attention :</b> ranger d\'après les numérateurs seuls, ou d\'après les ' +
          'dénominateurs seuls, donne un autre ordre — et c\'est faux.'
      ],
      indices: ['Un seul dénominateur commun pour les trois : cherche un multiple des trois ' +
                  'dénominateurs.',
                'Une fois les trois écrites avec ce dénominateur, range les numérateurs.'],
      duree: 100
    };
  }

  /* ===================================================================== */
  /* 5. Sans calcul : numérateurs égaux, et comparaison à 1                */
  /* ===================================================================== */
  function qSansCalcul(rnd, palier) {
    if (rnd.booleen(0.5)) {
      // Même numérateur : c'est le plus petit dénominateur qui gagne.
      var a = rnd.entier(2, 7);
      var b = rnd.entier(a + 1, a + 6), d = rnd.entier(a + 1, a + 9);
      for (var i = 0; i < 40 && d === b; i++) d = rnd.entier(a + 1, a + 9);
      var s = signe(a, b, a, d);
      var ordre = rnd.melange(['<', '>', '=']);
      return {
        enonce: 'Compare ces deux fractions <b>sans les réduire au même dénominateur</b> :<br>' +
          mf(a, b) + ' &nbsp;…&nbsp; ' + mf(a, d),
        type: 'qcm',
        choix: ordre.map(function (x) { return m(fr(a, b) + ' ' + x + ' ' + fr(a, d)); }),
        correct: ordre.indexOf(s),
        etapes: [
          'Les deux fractions ont le <b>même numérateur</b> : on prend le même nombre de parts ' +
            'de chaque côté.',
          'Mais partager l\'unité en ' + m(String(Math.min(b, d))) + ' donne des parts ' +
            '<b>plus grosses</b> que la partager en ' + m(String(Math.max(b, d))) + '.',
          'À numérateurs égaux, la plus grande fraction est donc celle qui a le <b>plus petit ' +
            'dénominateur</b> : ' + m(fr(a, b) + ' ' + s + ' ' + fr(a, d)) + '.'
        ],
        indices: ['Même nombre de parts des deux côtés : ce sont les parts elles-mêmes qui ' +
                    'diffèrent.',
                  'Plus on coupe en morceaux, plus les morceaux sont petits.'],
        duree: 45
      };
    }
    // Comparaison à 1 : on coche celles qui dépassent l'unité.
    var lot = [], vus = {};
    while (lot.length < 5) {
      var bb = rnd.entier(2, 9);
      var aa = rnd.entier(1, bb + 5);
      if (aa === bb && lot.some(function (x) { return x.a === x.b; })) continue;
      var cle = aa + '/' + bb;
      if (vus[cle]) continue;
      vus[cle] = 1;
      lot.push({ a: aa, b: bb });
    }
    // Il faut des deux : au moins une plus grande que 1, au moins une plus petite.
    if (!lot.some(function (x) { return x.a > x.b; })) lot[0] = { a: lot[0].b + 2, b: lot[0].b };
    if (!lot.some(function (x) { return x.a < x.b; })) lot[1] = { a: 1, b: lot[1].b };
    var corrects = [];
    lot.forEach(function (x, k) { if (x.a > x.b) corrects.push(k); });

    return {
      enonce: 'Coche <b>toutes</b> les fractions qui sont <b>plus grandes que 1</b>.',
      type: 'qcm-multi',
      choix: lot.map(function (x) { return mf(x.a, x.b); }),
      corrects: corrects,
      etapes: ['Une fraction vaut <b>1</b> quand son numérateur est <b>égal</b> à son ' +
        'dénominateur : ' + m(fr(4, 4) + ' = 1') + '.']
        .concat(lot.map(function (x) {
          return (x.a > x.b ? '✔ ' : '✘ ') + mf(x.a, x.b) + ' — ' + O.fr(x.a) +
            (x.a > x.b ? ' > ' : (x.a < x.b ? ' < ' : ' = ')) + O.fr(x.b) + ', donc ' +
            (x.a > x.b ? 'plus grande' : (x.a < x.b ? 'plus petite' : 'égale')) + ' que 1.';
        }))
        .concat(['<b>À retenir :</b> numérateur plus grand que le dénominateur → la fraction ' +
                 'dépasse 1. C\'est la comparaison la plus rapide qui existe.']),
      indices: ['Compare simplement le numérateur et le dénominateur de chacune.',
                'Si le numérateur est le plus grand, il y a plus d\'une unité.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 6. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Comme \\(5 > 3\\), on a \\(\\dfrac{5}{8} > \\dfrac{3}{4}\\).', ok: false,
      d: 'Non : les parts n\'ont pas la même taille. Au même dénominateur, ' +
         '\\(\\dfrac{3}{4} = \\dfrac{6}{8}\\), et \\(6 > 5\\) : c\'est ' +
         '\\(\\dfrac{3}{4}\\) qui est la plus grande.' },
    { t: 'À dénominateurs égaux, la plus grande fraction est celle qui a le plus grand ' +
         'numérateur.', ok: true,
      d: 'Oui : les parts ont la même taille, il n\'y a plus qu\'à les compter.' },
    { t: 'À numérateurs égaux, la plus grande fraction est celle qui a le plus grand ' +
         'dénominateur.', ok: false,
      d: 'Non, c\'est l\'inverse : plus le dénominateur est grand, plus les parts sont ' +
         '<b>petites</b>. \\(\\dfrac{3}{5} > \\dfrac{3}{8}\\).' },
    { t: 'Deux fractions différentes peuvent désigner le même nombre.', ok: true,
      d: 'Oui : \\(\\dfrac{3}{4} = \\dfrac{6}{8}\\). C\'est même ce qui permet de les réduire ' +
         'au même dénominateur.' },
    { t: 'Une fraction est plus grande que 1 quand son numérateur est plus grand que son ' +
         'dénominateur.', ok: true,
      d: 'Oui : il y a plus d\'une unité. \\(\\dfrac{7}{5} > 1\\).' },
    { t: 'Pour comparer deux fractions, il faut toujours prendre le produit des deux ' +
         'dénominateurs.', ok: false,
      d: 'Non : le produit marche toujours, mais il n\'est pas toujours le plus simple. Si un ' +
         'dénominateur est déjà un multiple de l\'autre, il suffit. Pour \\(\\dfrac{3}{4}\\) et ' +
         '\\(\\dfrac{5}{8}\\), on prend 8, pas 32.' },
    { t: 'Multiplier le numérateur et le dénominateur par un même nombre ne change pas la ' +
         'valeur de la fraction.', ok: true,
      d: 'Oui : on coupe simplement l\'unité plus finement, la longueur ne bouge pas. C\'est ce ' +
         'qui autorise la mise au même dénominateur.' },
    { t: 'On peut comparer \\(\\dfrac{2}{3}\\) et \\(\\dfrac{5}{7}\\) en comparant seulement ' +
         'leurs dénominateurs.', ok: false,
      d: 'Non : ni les numérateurs seuls ni les dénominateurs seuls ne suffisent quand les deux ' +
         'diffèrent. Au même dénominateur : \\(\\dfrac{14}{21}\\) et \\(\\dfrac{15}{21}\\), donc ' +
         '\\(\\dfrac{2}{3} < \\dfrac{5}{7}\\).' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Les numérateurs ne se comparent que si les dénominateurs sont égaux.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'comparer-fractions', competence: 'comparer-fractions', level: '5eme',
    titre: 'Comparer des fractions', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['amplifier', 'amplifier', 'comparer', 'sansCalcul', 'proprietes'] :
        palier === 2 ? ['amplifier', 'denominateur', 'comparer', 'comparer', 'sansCalcul',
                        'proprietes'] :
        palier === 3 ? ['denominateur', 'comparer', 'comparer', 'ranger', 'sansCalcul',
                        'proprietes'] :
                       ['comparer', 'ranger', 'ranger', 'denominateur', 'sansCalcul',
                        'proprietes']);

      if (quoi === 'denominateur') return qDenominateur(rnd, palier);
      if (quoi === 'amplifier') return qAmplifier(rnd, palier);
      if (quoi === 'ranger') return qRanger(rnd, palier);
      if (quoi === 'sansCalcul') return qSansCalcul(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qComparer(rnd, palier);
    }
  });

})();
