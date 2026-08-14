/*
 * fraction-pourcentage — prendre une fraction ou un pourcentage d'une quantité
 * (leçon 5ème « Fraction et pourcentage d'une quantité »).
 *
 * Deux formes pour chaque question, tirées à pile ou face :
 *
 *   BRUT      « Calcule les 3/4 de 48. »
 *   SITUATION « Dans une classe de 30 élèves, 40 % font de l'allemand.
 *               Combien d'élèves cela fait-il ? »
 *
 * Ce n'est pas de la décoration. En situation, l'élève doit d'abord repérer
 * QUELLE est la quantité totale — c'est là que ça coince, plus souvent que dans
 * le calcul lui-même — et l'unité de la réponse fait partie de la réponse. Le
 * moteur affiche d'ailleurs cette unité à côté du champ de saisie.
 *
 * Les familles :
 *
 *   fraction    a/b d'une quantité, brut ou en situation ;
 *   pourcent    t % d'une quantité, idem. Le pourcentage est toujours présenté
 *               comme la fraction t/100 dans la correction ;
 *   ecrire      t % s'écrit t/100 : la conversion, prise seule, dans les deux
 *               sens (25 % ↔ 1/4) ;
 *   inverse     on donne le résultat, on cherche le total. « 12 élèves, c'est
 *               les 2/5 de la classe : combien d'élèves ? » — la question qui
 *               montre si la relation est comprise ou seulement appliquée ;
 *   comparer    deux offres, deux remises : laquelle donne le plus ? ;
 *   proprietes  vrai/faux, dont l'erreur de l'unité et celle du « % de quoi ».
 *
 * Toutes les valeurs sont des CENTIÈMES entiers : les énoncés sont tirés de
 * façon qu'aucun résultat ne dépasse deux décimales, et rien n'est jamais
 * calculé en virgule flottante.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  function m(s) { return '\\(' + s + '\\)'; }
  function fr(a, b) { return '\\dfrac{' + a + '}{' + b + '}'; }
  function pgcd(x, y) { x = Math.abs(x); y = Math.abs(y); while (y) { var t = y; y = x % y; x = t; } return x; }
  // Un centième entier → « 14,4 »
  function fmt(c) {
    var e = Math.floor(Math.abs(c) / 100), d = Math.abs(c) % 100;
    var t = String(e);
    if (d) t += ',' + (d % 10 === 0 ? String(d / 10) : (d < 10 ? '0' + d : String(d)));
    return (c < 0 ? '−' : '') + t;
  }

  /* ===================================================================== */
  /* Les situations                                                        */
  /* ===================================================================== */
  // `entier` : la réponse doit être un nombre entier (des élèves, des pages…).
  var CONTEXTES = [
    { unite: 'élèves', entier: true,
      dit: function (n, q) { return 'Dans une classe de <b>' + n + ' élèves</b>, ' + q +
        ' sont demi-pensionnaires.'; },
      quest: 'Combien d\'élèves cela fait-il ?' },
    { unite: 'élèves', entier: true,
      dit: function (n, q) { return 'Un collège compte <b>' + n + ' élèves</b>, dont ' + q +
        ' en sixième.'; },
      quest: 'Combien y a-t-il d\'élèves de sixième ?' },
    { unite: '€', entier: false,
      dit: function (n, q) { return 'Un jeu coûte <b>' + n + ' €</b>. On en paie ' + q + '.'; },
      quest: 'Quelle somme paie-t-on ?' },
    { unite: '€', entier: false,
      dit: function (n, q) { return 'Un vélo coûte <b>' + n + ' €</b>. Le magasin fait une ' +
        'remise de ' + q + ' du prix.'; },
      quest: 'De combien d\'euros est la remise ?' },
    { unite: 'pages', entier: true,
      dit: function (n, q) { return 'Un livre a <b>' + n + ' pages</b>. Léa en a lu ' + q + '.'; },
      quest: 'Combien de pages a-t-elle lues ?' },
    { unite: 'billes', entier: true,
      dit: function (n, q) { return 'Un sachet contient <b>' + n + ' billes</b>, dont ' + q +
        ' sont rouges.'; },
      quest: 'Combien y a-t-il de billes rouges ?' },
    { unite: 'km', entier: false,
      dit: function (n, q) { return 'Un parcours mesure <b>' + n + ' km</b>. On en a fait ' +
        q + '.'; },
      quest: 'Quelle distance a-t-on parcourue ?' },
    { unite: 'L', entier: false,
      dit: function (n, q) { return 'Un bidon contient <b>' + n + ' L</b> d\'eau. On en verse ' +
        q + '.'; },
      quest: 'Quel volume a-t-on versé ?' }
  ];

  /* ===================================================================== */
  /* Le tirage : une fraction (ou un pourcentage) et une quantité          */
  /* ===================================================================== */
  // Renvoie { a, b, n, t } : a/b de n, et t si c'est un pourcentage.
  function tire(rnd, palier, pourcent, ctx) {
    var a, b, n, t, i;
    if (pourcent) {
      t = rnd.choix(palier <= 2 ? [10, 25, 50, 20, 75] : [10, 15, 20, 25, 30, 40, 50, 60, 75, 80]);
      var g = pgcd(t, 100);
      a = t / g; b = 100 / g;
    } else {
      b = rnd.choix(palier <= 2 ? [2, 3, 4, 5] : [2, 3, 4, 5, 6, 8, 10]);
      a = rnd.entier(1, b - 1);
      for (i = 0; i < 40 && pgcd(a, b) !== 1; i++) a = rnd.entier(1, b - 1);
    }
    // La quantité : un multiple de b, pour que tout tombe juste. En situation
    // « non entière » on s'autorise un résultat décimal, mais jamais au-delà
    // de deux décimales.
    var libre = ctx && !ctx.entier && palier >= 3;
    for (i = 0; i < 200; i++) {
      n = libre ? rnd.entier(2, 90) : b * rnd.entier(2, Math.max(2, Math.floor(60 / b)));
      if ((n * a * 100) % b === 0) break;
    }
    if ((n * a * 100) % b !== 0) n = b * rnd.entier(2, 9);
    return { a: a, b: b, n: n, t: t };
  }

  function valeur(x) { return x.n * x.a * 100 / x.b; }   // en centièmes

  // La correction commune : partager, puis prendre.
  function etapesCalcul(x, unite) {
    var part = x.n * 100 / x.b, res = valeur(x);
    var e = [];
    if (x.t !== undefined) {
      e.push(m(x.t + '\\,\\%') + ' veut dire « ' + x.t + ' sur 100 », c\'est-à-dire la fraction ' +
        m(fr(x.t, 100)) + (x.b !== 100 ? ', qui se simplifie en ' + m(fr(x.a, x.b)) : '') + '.');
    }
    e.push('Prendre ' + m(fr(x.a, x.b)) + ' d\'une quantité, c\'est la partager en <b>' + x.b +
      '</b> parts égales et en prendre <b>' + x.a + '</b>.');
    e.push('Une part vaut ' + m(x.n + ' \\div ' + x.b + ' = ' + O.tex(part / 100)) + ' ' + unite + '.');
    e.push(x.a === 1
      ? 'On n\'en prend qu\'une : le résultat est <b>' + fmt(res) + '</b> ' + unite + '.'
      : 'On en prend ' + x.a + ' : ' + m(O.tex(part / 100) + ' \\times ' + x.a + ' = ' +
        O.tex(res / 100)) + ', soit <b>' + fmt(res) + '</b> ' + unite + '.');
    if (x.a > 1) {
      e.push('On pouvait aussi multiplier d\'abord : ' +
        m(x.n + ' \\times ' + x.a + ' = ' + (x.n * x.a)) + ', puis ' +
        m((x.n * x.a) + ' \\div ' + x.b + ' = ' + O.tex(res / 100)) + '. Même résultat.');
    }
    return e;
  }

  /* ===================================================================== */
  /* 1 et 2. Une fraction, ou un pourcentage — brut ou en situation        */
  /* ===================================================================== */
  function qCalcul(rnd, palier, pourcent) {
    // Une question sur deux est posée en situation : c'est là qu'il faut
    // repérer soi-même la quantité totale.
    var situation = rnd.booleen(palier === 1 ? 0.4 : 0.55);
    var ctx = situation ? rnd.choix(CONTEXTES) : null;
    var x = tire(rnd, palier, pourcent, ctx);
    var res = valeur(x);
    var quoi = pourcent ? m(x.t + '\\,\\%') : 'les ' + m(fr(x.a, x.b));

    if (!situation) {
      return {
        enonce: 'Calcule ' + (pourcent ? m(x.t + '\\,\\% \\text{ de } ' + x.n)
                                       : m(fr(x.a, x.b) + ' \\text{ de } ' + x.n)) + '.',
        type: 'nombre', reponse: res / 100,
        etapes: etapesCalcul(x, ''),
        indices: ['Partage d\'abord ' + m(String(x.n)) + ' en ' + m(String(x.b)) + ' parts égales.',
                  'Puis prends-en ' + m(String(x.a)) + '.'],
        duree: 55
      };
    }
    return {
      enonce: ctx.dit(x.n, quoi) + '<br>' + ctx.quest,
      type: 'nombre', reponse: res / 100, unite: ctx.unite,
      etapes: ['La quantité <b>totale</b> est ' + m(String(x.n)) + ' ' + ctx.unite +
        ' : c\'est d\'elle qu\'on prend ' + quoi + '.']
        .concat(etapesCalcul(x, ctx.unite))
        .concat([ctx.entier
          ? 'On compte des ' + ctx.unite + ' : la réponse doit être un nombre <b>entier</b>, et ' +
            'elle l\'est — <b>' + fmt(res) + '</b>. C\'est un bon moyen de se relire.'
          : 'La réponse s\'exprime en <b>' + ctx.unite + '</b> : ' + fmt(res) + ' ' + ctx.unite +
            '. Un résultat non entier n\'a rien d\'anormal ici.']),
      indices: ['Commence par repérer la quantité totale dans l\'énoncé.',
                'Puis partage-la en ' + m(String(x.b)) + ' et prends-en ' + m(String(x.a)) + '.'],
      duree: 75
    };
  }

  /* ===================================================================== */
  /* 3. Écrire un pourcentage comme fraction (et l'inverse)                */
  /* ===================================================================== */
  var USUELS = [
    { t: 10, a: 1, b: 10 }, { t: 20, a: 1, b: 5 }, { t: 25, a: 1, b: 4 },
    { t: 50, a: 1, b: 2 }, { t: 75, a: 3, b: 4 }, { t: 40, a: 2, b: 5 },
    { t: 60, a: 3, b: 5 }, { t: 80, a: 4, b: 5 }, { t: 30, a: 3, b: 10 }
  ];

  function qEcrire(rnd, palier) {
    var u = rnd.choix(USUELS);
    var versFraction = rnd.booleen(0.5);
    var prop, bon;

    if (versFraction) {
      bon = fr(u.a, u.b);
      var faux = [fr(u.t, 10), fr(u.b, u.a), fr(u.a + 1, u.b)];
      prop = rnd.melange([{ c: 'bon', tex: bon }].concat(faux.map(function (f) {
        return { c: 'faux', tex: f };
      })));
      // On écarte un leurre qui vaudrait la même chose que la bonne réponse.
      prop = prop.filter(function (p, i) {
        if (p.c === 'bon') return true;
        var mm = p.tex.match(/\{(\d+)\}\{(\d+)\}/);
        return !(mm && +mm[1] * u.b === u.a * +mm[2]);
      });
      while (prop.length < 3) prop.push({ c: 'faux', tex: fr(u.t, 100 + prop.length) });
      return {
        enonce: 'Sous quelle forme simplifiée peut-on écrire ' + m(u.t + '\\,\\%') + ' ?',
        type: 'qcm',
        choix: prop.map(function (p) { return m(p.tex); }),
        correct: prop.map(function (p) { return p.c; }).indexOf('bon'),
        etapes: [
          m(u.t + '\\,\\%') + ' veut dire « ' + u.t + ' sur 100 » : c\'est ' + m(fr(u.t, 100)) + '.',
          'On simplifie en divisant le numérateur et le dénominateur par ' +
            m(String(pgcd(u.t, 100))) + ' : ' + m(fr(u.t, 100) + ' = ' + fr(u.a, u.b)) + '.',
          'À connaître par cœur : ' + m('50\\,\\% = ' + fr(1, 2)) + ', ' +
            m('25\\,\\% = ' + fr(1, 4)) + ', ' + m('20\\,\\% = ' + fr(1, 5)) + ', ' +
            m('10\\,\\% = ' + fr(1, 10)) + '.'
        ],
        indices: ['Un pourcentage, c\'est une fraction de dénominateur 100.',
                  'Simplifie ' + m(fr(u.t, 100)) + '.'],
        duree: 40
      };
    }
    var faux2 = [u.a * 10, u.b * 10, u.a + u.b].filter(function (v) { return v !== u.t; });
    prop = rnd.melange([{ c: 'bon', v: u.t }].concat(faux2.slice(0, 3).map(function (v) {
      return { c: 'faux', v: v };
    })));
    return {
      enonce: 'À quel pourcentage correspond ' + m(fr(u.a, u.b)) + ' ?',
      type: 'qcm',
      choix: prop.map(function (p) { return m(p.v + '\\,\\%'); }),
      correct: prop.map(function (p) { return p.c; }).indexOf('bon'),
      etapes: [
        'Un pourcentage est une fraction de dénominateur <b>100</b> : il faut donc écrire ' +
          m(fr(u.a, u.b)) + ' avec 100 en bas.',
        'On multiplie le numérateur et le dénominateur par ' + m(String(100 / u.b)) + ' : ' +
          m(fr(u.a, u.b) + ' = ' + fr(u.t, 100)) + '.',
        'Donc ' + m(fr(u.a, u.b) + ' = ' + u.t + '\\,\\%') + '.'
      ],
      indices: ['Par combien faut-il multiplier ' + m(String(u.b)) + ' pour obtenir 100 ?',
                'Ce qu\'on fait en bas, on le fait en haut.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 4. La question à l'envers : on cherche le total                       */
  /* ===================================================================== */
  function qInverse(rnd, palier) {
    var ctx = rnd.choix(CONTEXTES.filter(function (c) { return c.entier; }));
    var pourcent = rnd.booleen(0.5);
    var x = tire(rnd, palier, pourcent, ctx);
    var res = valeur(x) / 100;
    var quoi = pourcent ? m(x.t + '\\,\\%') : 'les ' + m(fr(x.a, x.b));

    return {
      enonce: 'Dans un groupe, ' + quoi + ' des ' + ctx.unite + ' font partie du club de maths, ' +
        'ce qui représente <b>' + O.fr(res) + ' ' + ctx.unite + '</b>.<br>' +
        'Combien y a-t-il de ' + ctx.unite + ' en tout ?',
      type: 'nombre', reponse: x.n, unite: ctx.unite,
      etapes: [
        'Attention au sens de la question : cette fois on connaît la <b>partie</b>, et on ' +
          'cherche le <b>tout</b>.',
        quoi + ' du total font ' + O.fr(res) + ' ' + ctx.unite + ' : ' + x.a + ' parts valent ' +
          O.fr(res) + '.',
        'Une part vaut donc ' + m(O.tex(res) + ' \\div ' + x.a + ' = ' + O.tex(res / x.a)) + '.',
        'Le total, c\'est ' + x.b + ' parts : ' +
          m(O.tex(res / x.a) + ' \\times ' + x.b + ' = ' + O.tex(x.n)) + '.',
        'Vérification : ' + quoi + ' de ' + O.fr(x.n) + ', c\'est bien ' + O.fr(res) + ' ' +
          ctx.unite + '.'
      ],
      indices: ['Ici on connaît la partie, pas le tout : le calcul se fait à l\'envers.',
                'Cherche d\'abord combien vaut <b>une</b> part.'],
      duree: 95
    };
  }

  /* ===================================================================== */
  /* 5. Deux offres : laquelle donne le plus ?                             */
  /* ===================================================================== */
  function qComparer(rnd, palier) {
    // Deux remises sur deux prix : c'est le calcul qui tranche, pas l'allure.
    var t1 = rnd.choix([10, 20, 25, 30, 40, 50]);
    var t2 = rnd.choix([10, 20, 25, 30, 40, 50]);
    var n1 = rnd.entier(2, 12) * 10, n2 = rnd.entier(2, 12) * 10;
    var r1 = n1 * t1, r2 = n2 * t2;                    // en centièmes d'euro
    var i;
    for (i = 0; i < 60 && r1 === r2; i++) { n2 = rnd.entier(2, 12) * 10; r2 = n2 * t2; }
    if (r1 === r2) { n2 = n1 + 10; r2 = n2 * t2; }
    var ordre = rnd.melange([
      { c: 'a', txt: 'La première : ' + fmt(r1) + ' €' },
      { c: 'b', txt: 'La seconde : ' + fmt(r2) + ' €' }
    ]);
    var bon = r1 > r2 ? 'a' : 'b';

    return {
      enonce: 'Deux magasins soldent le même article.<br>' +
        '• Le premier : <b>' + t1 + ' %</b> sur un prix de <b>' + n1 + ' €</b>.<br>' +
        '• Le second : <b>' + t2 + ' %</b> sur un prix de <b>' + n2 + ' €</b>.<br>' +
        'Quelle remise fait économiser le plus ?',
      type: 'qcm',
      choix: ordre.map(function (x) { return x.txt; }),
      correct: ordre.map(function (x) { return x.c; }).indexOf(bon),
      etapes: [
        'Un pourcentage ne se compare pas tout seul : ' + t1 + ' % et ' + t2 + ' % ne portent ' +
          'pas sur la même somme. Il faut <b>calculer les deux remises</b>.',
        'Première : ' + m(t1 + '\\,\\% \\text{ de } ' + n1 + ' = ' + fr(t1, 100) + ' \\times ' +
          n1 + ' = ' + O.tex(r1 / 100)) + ' €.',
        'Seconde : ' + m(t2 + '\\,\\% \\text{ de } ' + n2 + ' = ' + fr(t2, 100) + ' \\times ' +
          n2 + ' = ' + O.tex(r2 / 100)) + ' €.',
        'C\'est donc la <b>' + (bon === 'a' ? 'première' : 'seconde') + '</b> qui fait ' +
          'économiser le plus : ' + fmt(Math.max(r1, r2)) + ' € contre ' +
          fmt(Math.min(r1, r2)) + ' €.' +
          ((bon === 'a') !== (t1 > t2)
            ? ' <b>Et ce n\'est pas celle qui affiche le plus gros pourcentage</b> : c\'est bien ' +
              'pour cela qu\'il faut calculer.'
            : '')
      ],
      indices: ['Calcule chaque remise en euros avant de comparer.',
                'Le plus gros pourcentage ne donne pas toujours la plus grosse remise : tout ' +
                  'dépend du prix de départ.'],
      duree: 100
    };
  }

  /* ===================================================================== */
  /* 6. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: '\\(50\\,\\%\\) d\'une quantité, c\'est la <b>moitié</b> de cette quantité.', ok: true,
      d: 'Oui : \\(50\\,\\% = \\dfrac{50}{100} = \\dfrac{1}{2}\\).' },
    { t: '\\(10\\,\\%\\) d\'un nombre, c\'est ce nombre <b>divisé par 10</b>.', ok: true,
      d: 'Oui : \\(10\\,\\% = \\dfrac{1}{10}\\). C\'est le pourcentage le plus rapide à calculer.' },
    { t: '\\(25\\,\\%\\) d\'un nombre, c\'est ce nombre <b>divisé par 25</b>.', ok: false,
      d: 'Non : \\(25\\,\\% = \\dfrac{25}{100} = \\dfrac{1}{4}\\), donc c\'est le nombre divisé ' +
         'par <b>4</b>.' },
    { t: 'Prendre \\(\\dfrac{3}{4}\\) d\'un nombre, c\'est le diviser par 4 puis multiplier ' +
         'par 3.', ok: true,
      d: 'Oui — et l\'on peut aussi multiplier par 3 d\'abord, puis diviser par 4 : même ' +
         'résultat.' },
    { t: 'Une remise de \\(30\\,\\%\\) est toujours plus intéressante qu\'une remise de ' +
         '\\(20\\,\\%\\).', ok: false,
      d: 'Non : tout dépend du <b>prix</b> sur lequel elle porte. \\(20\\,\\%\\) de 100 € font ' +
         '20 €, alors que \\(30\\,\\%\\) de 50 € n\'en font que 15.' },
    { t: 'Le résultat d\'un pourcentage est toujours un nombre entier.', ok: false,
      d: 'Non : \\(30\\,\\%\\) de 48 € font 14,40 €. En revanche, un nombre d\'élèves, lui, est ' +
         'forcément entier — c\'est un bon moyen de se relire.' },
    { t: '\\(\\dfrac{2}{5}\\) des élèves et \\(40\\,\\%\\) des élèves, ce n\'est pas la même ' +
         'chose.', ok: false,
      d: 'Si : \\(\\dfrac{2}{5} = \\dfrac{40}{100} = 40\\,\\%\\). Un pourcentage n\'est qu\'une ' +
         'autre écriture de la fraction.' },
    { t: 'Pour prendre \\(\\dfrac{a}{b}\\) d\'une quantité, on peut la multiplier par ' +
         '\\(a\\) puis diviser par \\(b\\).', ok: true,
      d: 'Oui : \\((N \\times a) \\div b\\) et \\((N \\div b) \\times a\\) donnent le même ' +
         'résultat. On choisit l\'ordre le plus commode.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Repense à la définition : \\(t\\,\\%\\) veut dire \\(\\dfrac{t}{100}\\), et ' +
                'prendre \\(\\dfrac{a}{b}\\), c\'est partager en \\(b\\) et prendre \\(a\\).'],
      duree: 40
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'fraction-pourcentage', competence: 'fraction-pourcentage', level: '5eme',
    titre: 'Fraction et pourcentage d\'une quantité', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['fraction', 'fraction', 'ecrire', 'pourcent', 'proprietes'] :
        palier === 2 ? ['fraction', 'pourcent', 'pourcent', 'ecrire', 'proprietes'] :
        palier === 3 ? ['fraction', 'pourcent', 'comparer', 'inverse', 'ecrire', 'proprietes'] :
                       ['pourcent', 'inverse', 'inverse', 'comparer', 'comparer', 'fraction',
                        'proprietes']);

      if (quoi === 'pourcent') return qCalcul(rnd, palier, true);
      if (quoi === 'ecrire') return qEcrire(rnd, palier);
      if (quoi === 'inverse') return qInverse(rnd, palier);
      if (quoi === 'comparer') return qComparer(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qCalcul(rnd, palier, false);
    }
  });

})();
