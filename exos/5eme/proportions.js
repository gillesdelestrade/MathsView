/*
 * proportions — déterminer une proportion, un pourcentage (leçon 5ème
 * « Déterminer une proportion, un pourcentage »).
 *
 *   pourcentage  la partie et le tout sont donnés : quel pourcentage ?
 *   fraction     la même chose, mais en fraction simplifiée ;
 *   sens         laquelle des deux fractions est la proportion ? — le piège du
 *                tout et de la partie échangés ;
 *   comparer     deux situations de totaux différents : laquelle l'emporte ?
 *   complement   si 35 % sont des filles, quel pourcentage de garçons ?
 *   ecritures    passer du pourcentage au décimal, et retour ;
 *   proprietes   vrai/faux sur ce qu'est une proportion.
 *
 * ---------------------------------------------------------------------------
 * Des totaux qui tombent juste
 * ---------------------------------------------------------------------------
 * Les totaux sont choisis parmi ceux qui divisent 100 ou lui donnent un seul
 * chiffre après la virgule — 4, 5, 10, 20, 25, 40, 50, 200. Le pourcentage est
 * alors exact, et l'exercice porte sur la notion, pas sur la division posée.
 *
 * ---------------------------------------------------------------------------
 * Le leurre qui compte
 * ---------------------------------------------------------------------------
 * Partout où c'est possible, la proportion INVERSÉE est proposée : 25/15 quand
 * la réponse est 15/25. C'est l'erreur de sens que la leçon vise, et une
 * proportion inversée dépasse 100 % — ce qui n'a aucun sens pour une part d'un
 * tout. La famille « comparer » sert d'ailleurs à cela : sans conversion, on ne
 * peut pas départager deux situations de totaux différents.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  /* Quatre décimales, pas deux : un pourcentage de 12,5 % s'écrit 0,125 en
     décimal, et arrondir au centième afficherait 0,13 dans l'énoncé alors que
     la réponse attendue serait 12,5. L'affichage ne doit jamais raboter ce que
     la question demande. */
  function fr(v) { return O.fr(Math.round(v * 10000) / 10000); }
  function tex(s) { return '\\(' + s + '\\)'; }
  function frac(a, b) { return '\\dfrac{' + a + '}{' + b + '}'; }

  /* ===================================================================== */
  /* Les situations                                                        */
  /* ===================================================================== */
  /* Chacune sait se raconter avec une partie et un tout. Les nombres viennent
     du tirage, jamais de la phrase : c'est la phrase qui s'adapte. */
  var SITUATIONS = [
    { quoi: 'élèves', part: 'filles',
      dit: function (p, n) { return 'Dans une classe de <b>' + n + ' élèves</b>, il y a <b>' +
        p + ' filles</b>.'; },
      demande: 'de filles' },
    { quoi: 'fruits', part: 'pommes',
      dit: function (p, n) { return 'Un cageot contient <b>' + n + ' fruits</b>, dont <b>' +
        p + ' pommes</b>.'; },
      demande: 'de pommes' },
    { quoi: 'tirs', part: 'réussis',
      dit: function (p, n) { return 'Sur <b>' + n + ' tirs au but</b>, <b>' + p +
        '</b> sont <b>réussis</b>.'; },
      demande: 'de tirs réussis' },
    { quoi: 'personnes', part: 'ont répondu oui',
      dit: function (p, n) { return 'On interroge <b>' + n + ' personnes</b> : <b>' + p +
        '</b> répondent <b>oui</b>.'; },
      demande: 'de « oui »' },
    { quoi: 'places', part: 'occupées',
      dit: function (p, n) { return 'Une salle a <b>' + n + ' places</b>, dont <b>' + p +
        '</b> sont <b>occupées</b>.'; },
      demande: 'de places occupées' }
  ];

  // Les totaux pour lesquels le pourcentage tombe juste.
  var TOTAUX = [4, 5, 10, 20, 25, 40, 50, 200];

  /* Une situation complète : le tout, la partie — jamais 0, jamais le tout
     entier, et une partie différente du reste pour que le complément ne soit
     pas la même valeur. */
  function tire(rnd, tousTotaux) {
    var n = rnd.choix(tousTotaux || TOTAUX);
    var p;
    do { p = rnd.entier(1, n - 1); } while (p * 2 === n);
    return { s: rnd.choix(SITUATIONS), n: n, p: p, pc: p * 100 / n };
  }
  function pgcd(a, b) { return b ? pgcd(b, a % b) : Math.abs(a); }
  function simplifie(a, b) { var g = pgcd(a, b) || 1; return [a / g, b / g]; }

  var RAPPEL = 'Une <b>proportion</b>, c\'est la <b>partie divisée par le tout</b>. Un ' +
    '<b>pourcentage</b> est cette même proportion écrite <b>sur 100</b>.';

  /* ===================================================================== */
  /* 1. Quel pourcentage ?                                                 */
  /* ===================================================================== */
  function qPourcentage(rnd, palier) {
    var t = tire(rnd, palier <= 2 ? [4, 5, 10, 20, 25, 50] : TOTAUX);
    return {
      enonce: t.s.dit(t.p, t.n) + '<br><b>Quel est le pourcentage ' + t.s.demande +
        ' ?</b> (donne le nombre, sans le signe %)',
      type: 'nombre',
      reponse: t.pc,
      etapes: [RAPPEL,
        'La proportion est ' + tex(frac(t.p, t.n)) + ' : la partie sur le tout.',
        'Pour l\'écrire sur 100, on multiplie par 100 : ' + tex(t.p + ' \\times 100 \\div ' +
          t.n + ' = ' + fr(t.pc)) + '.',
        'Le pourcentage est donc <b>' + fr(t.pc) + ' %</b> — autrement dit, si le total ' +
          'était 100, il y en aurait ' + fr(t.pc) + '.'],
      indices: ['Commence par écrire la proportion : la partie sur le tout.',
                'Puis ramène-la sur 100 : ' + tex('\\text{partie} \\times 100 \\div ' +
                  '\\text{tout}') + '.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 2. La proportion en fraction simplifiée                               */
  /* ===================================================================== */
  function qFraction(rnd, palier) {
    var t, s;
    for (var i = 0; i < 200; i++) {
      t = tire(rnd);
      s = simplifie(t.p, t.n);
      if (s[1] !== t.n && s[1] > 1) break;         // il doit y avoir à simplifier
    }
    /* Les leurres doivent être FAUX en valeur. La fraction non simplifiée ne
       l'est pas — c'est la même proportion, autrement écrite — et deux
       propositions seraient alors également justes. On prend donc l'inversée,
       la simplifiée inversée, et la proportion du RESTE. */
    var faux = [[t.n, t.p],                        // l'inversée : LE piège
                [s[1], s[0]],                      // la simplifiée, inversée
                simplifie(t.n - t.p, t.n)];        // celle du reste
    var vus = {}, props = [{ f: s, bon: true }];
    vus[s.join('/')] = 1;
    faux.forEach(function (q) {
      if (vus[q.join('/')]) return;
      vus[q.join('/')] = 1;
      props.push({ f: q, bon: false });
    });
    if (props.length < 3) return qPourcentage(rnd, palier);
    props = rnd.melange(props);

    return {
      enonce: t.s.dit(t.p, t.n) + '<br><b>Quelle est la proportion ' + t.s.demande +
        ', sous forme de fraction simplifiée ?</b>',
      type: 'qcm',
      choix: props.map(function (x) { return tex(frac(x.f[0], x.f[1])); }),
      correct: props.map(function (x) { return x.bon; }).indexOf(true),
      etapes: [RAPPEL,
        'La proportion est ' + tex(frac(t.p, t.n)) + ' — la <b>partie</b> ' + t.p +
          ' sur le <b>tout</b> ' + t.n + ', dans cet ordre.',
        'On simplifie en divisant les deux nombres par ' + pgcd(t.p, t.n) + ' : ' +
          tex(frac(t.p, t.n) + ' = ' + frac(s[0], s[1])) + '.',
        '<b>Le piège</b> : ' + tex(frac(t.n, t.p)) + ' est plus grand que 1. Une part d\'un ' +
          'tout ne peut pas dépasser le tout — une proportion est toujours entre 0 et 1.'],
      indices: ['La partie va au numérateur, le tout au dénominateur.',
                'Puis divise les deux nombres par leur plus grand diviseur commun.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 3. Dans quel sens ?                                                   */
  /* ===================================================================== */
  function qSens(rnd, palier) {
    var t = tire(rnd);
    var props = rnd.melange([
      { t: frac(t.p, t.n), bon: true },
      { t: frac(t.n, t.p), bon: false },
      { t: frac(t.p, t.n - t.p), bon: false },
      { t: frac(t.n - t.p, t.n), bon: false }
    ]);
    return {
      enonce: t.s.dit(t.p, t.n) + '<br><b>Quelle fraction donne la proportion ' +
        t.s.demande + ' ?</b>',
      type: 'qcm',
      choix: props.map(function (x) { return tex(x.t); }),
      correct: props.map(function (x) { return x.bon; }).indexOf(true),
      etapes: [
        'La proportion est toujours <b>la partie sur le tout</b> : ici ' +
          tex(frac(t.p, t.n)) + '.',
        tex(frac(t.n, t.p)) + ' serait le tout sur la partie — ce n\'est pas une ' +
          'proportion, et le résultat dépasserait 1.',
        tex(frac(t.p, t.n - t.p)) + ' compare la partie au <b>reste</b>, pas au tout : ' +
          'c\'est encore autre chose.',
        tex(frac(t.n - t.p, t.n)) + ' est la proportion du <b>reste</b> — celle qui complète ' +
          'la nôtre pour faire 1.'],
      indices: ['Que compare-t-on, et à quoi ?', 'Le dénominateur est toujours le TOUT.'],
      duree: 80
    };
  }

  /* ===================================================================== */
  /* 4. Comparer deux situations                                           */
  /* ===================================================================== */
  function qComparer(rnd, palier) {
    var a, b;
    for (var i = 0; i < 300; i++) {
      a = tire(rnd);
      b = tire(rnd);
      // deux totaux différents, sinon il n'y a rien à convertir ; et deux
      // pourcentages assez écartés pour qu'il y ait une vraie réponse
      if (a.n === b.n) continue;
      if (Math.abs(a.pc - b.pc) < 4) continue;
      // le piège doit exister : la plus grande PARTIE ne doit pas être la
      // meilleure proportion, sinon comparer les parties suffirait
      if ((a.p > b.p) === (a.pc > b.pc)) continue;
      break;
    }
    if (a.n === b.n || Math.abs(a.pc - b.pc) < 4) return qPourcentage(rnd, palier);
    var meilleur = a.pc > b.pc ? 'A' : 'B';
    var props = rnd.melange([
      { t: 'La situation A', cle: 'A' },
      { t: 'La situation B', cle: 'B' },
      { t: 'Les deux sont dans la même proportion', cle: '=' }
    ]);

    return {
      enonce: 'Deux situations :<br><b>A.</b> ' + a.p + ' sur ' + a.n + '.<br>' +
        '<b>B.</b> ' + b.p + ' sur ' + b.n + '.<br>' +
        '<b>Dans laquelle la proportion est-elle la plus grande ?</b>',
      type: 'qcm',
      choix: props.map(function (x) { return x.t; }),
      correct: props.map(function (x) { return x.cle; }).indexOf(meilleur),
      etapes: [
        'Les deux totaux sont différents : <b>on ne peut pas comparer ' + a.p + ' et ' +
          b.p + ' directement</b>. Il faut ramener les deux sur le même dénominateur — et ' +
          '100 est le plus commode.',
        'A : ' + tex(frac(a.p, a.n) + ' = ' + fr(a.pc) + '\\,\\%') + '.',
        'B : ' + tex(frac(b.p, b.n) + ' = ' + fr(b.pc) + '\\,\\%') + '.',
        'C\'est donc la situation <b>' + meilleur + '</b> qui l\'emporte, avec <b>' +
          fr(Math.max(a.pc, b.pc)) + ' %</b>.',
        '<b>Remarque.</b> Ici la plus grande <em>quantité</em> n\'est pas la plus grande ' +
          '<em>proportion</em> : ' + (a.p > b.p ? a.p + ' sur ' + a.n : b.p + ' sur ' + b.n) +
          ' fait pourtant moins bien. C\'est exactement à cela que sert un pourcentage.'],
      indices: ['On ne compare pas deux parts sans regarder leurs totaux.',
                'Ramène chaque situation sur 100.'],
      duree: 120
    };
  }

  /* ===================================================================== */
  /* 5. Le complément                                                      */
  /* ===================================================================== */
  function qComplement(rnd, palier) {
    var t = tire(rnd);
    var reste = t.n - t.p;
    return {
      enonce: t.s.dit(t.p, t.n) + '<br>Cela représente <b>' + fr(t.pc) + ' %</b>.<br>' +
        '<b>Quel pourcentage cela laisse-t-il pour le reste ?</b> (le nombre seul)',
      type: 'nombre',
      reponse: 100 - t.pc,
      etapes: [
        'La partie et le reste forment ensemble le <b>tout</b> : leurs deux proportions ' +
          'font donc <b>100 %</b> à elles deux.',
        'Il reste ' + tex('100 - ' + fr(t.pc) + ' = ' + fr(100 - t.pc)) + ', soit <b>' +
          fr(100 - t.pc) + ' %</b>.',
        'On peut le vérifier directement : le reste compte ' + t.n + ' − ' + t.p + ' = ' +
          reste + ', et ' + tex(reste + ' \\times 100 \\div ' + t.n + ' = ' +
          fr(100 - t.pc)) + '.'],
      indices: ['La partie et le reste font le tout.',
                'Deux proportions qui forment le tout font 100 % ensemble.'],
      duree: 80
    };
  }

  /* ===================================================================== */
  /* 6. Les trois écritures                                                */
  /* ===================================================================== */
  function qEcritures(rnd, palier) {
    var pcs = [5, 10, 12.5, 20, 25, 40, 50, 60, 75, 80, 90];
    var pc = rnd.choix(pcs);
    var versDecimal = rnd.booleen(0.5);
    return {
      enonce: versDecimal
        ? '<b>Écris ' + fr(pc) + ' % en nombre décimal.</b>'
        : 'Une proportion vaut <b>' + fr(pc / 100) + '</b> en écriture décimale.<br>' +
          '<b>Quel est le pourcentage correspondant ?</b> (le nombre seul)',
      type: 'nombre',
      reponse: versDecimal ? pc / 100 : pc,
      etapes: [
        tex(fr(pc) + '\\,\\% = ' + frac(fr(pc), 100)) + ' : « pour cent » veut dire ' +
          '« sur cent ».',
        versDecimal
          ? 'On <b>divise par 100</b> : ' + tex(fr(pc) + ' \\div 100 = ' + fr(pc / 100)) + '.'
          : 'On <b>multiplie par 100</b> : ' + tex(fr(pc / 100) + ' \\times 100 = ' + fr(pc)) +
            ', soit <b>' + fr(pc) + ' %</b>.',
        'Fraction, décimal et pourcentage sont <b>trois écritures du même nombre</b>. On ' +
          'passe de l\'une à l\'autre en multipliant ou en divisant par 100.'],
      indices: ['Un pourcentage, c\'est un nombre sur 100.',
                versDecimal ? 'Divise par 100.' : 'Multiplie par 100.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 7. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Une proportion est toujours comprise entre <b>0 et 1</b>.', ok: true,
      d: 'Oui : la partie ne peut pas dépasser le tout. En pourcentage, cela veut dire entre ' +
         '0 % et 100 %.' },
    { t: 'Sur 20 élèves, 8 sont des garçons : la proportion de garçons est \\(\\frac{20}{8}\\).',
      ok: false,
      d: 'Non, c\'est \\(\\frac{8}{20}\\) — la <b>partie sur le tout</b>. \\(\\frac{20}{8}\\) ' +
         'vaut 2,5, soit 250 % : une part ne peut pas valoir deux fois et demie le tout.' },
    { t: '\\(25\\,\\%\\) et \\(\\frac{1}{4}\\) sont la même proportion.', ok: true,
      d: 'Oui : \\(\\frac{25}{100} = \\frac{1}{4}\\). Fraction, décimal et pourcentage sont ' +
         'trois écritures du même nombre.' },
    { t: 'Si 30 % des élèves d\'une classe sont des filles, alors 70 % sont des garçons.',
      ok: true,
      d: 'Oui : les deux parts forment le tout, donc leurs pourcentages font 100 % ensemble.' },
    { t: '12 réussites sur 20 est une <b>meilleure</b> proportion que 15 sur 30.', ok: true,
      d: 'Oui : \\(\\frac{12}{20} = 60\\,\\%\\) contre \\(\\frac{15}{30} = 50\\,\\%\\). La ' +
         'plus grande quantité n\'est pas la meilleure proportion — c\'est pour cela qu\'on ' +
         'ramène sur 100.' },
    { t: '50 % d\'une classe de 20 élèves et 50 % d\'une classe de 30 élèves, c\'est le même ' +
         '<b>nombre</b> d\'élèves.', ok: false,
      d: 'Non : 10 d\'un côté, 15 de l\'autre. Un pourcentage se rapporte toujours à un tout ' +
         '— il compare des <em>proportions</em>, pas des quantités.' },
    { t: 'Simplifier une fraction change la proportion qu\'elle représente.', ok: false,
      d: 'Non : \\(\\frac{15}{25}\\) et \\(\\frac{3}{5}\\) sont le même nombre, donc la même ' +
         'proportion. Simplifier ne change que l\'écriture.' },
    { t: 'Pour obtenir un pourcentage, on divise la partie par le tout, puis on multiplie ' +
         'par 100.', ok: true,
      d: 'Oui, et l\'ordre des deux opérations est indifférent : on peut aussi multiplier ' +
         'd\'abord par 100, puis diviser.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d, RAPPEL],
      indices: ['Reviens à la définition : la partie sur le tout.'],
      duree: 55
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'proportions', competence: 'proportions', level: '5eme',
    titre: 'Proportions et pourcentages', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['proprietes', 'sens', 'pourcentage', 'ecritures'] :
        palier === 2 ? ['pourcentage', 'sens', 'fraction', 'ecritures', 'proprietes'] :
        palier === 3 ? ['pourcentage', 'fraction', 'complement', 'comparer', 'proprietes'] :
                       ['comparer', 'complement', 'pourcentage', 'fraction', 'comparer']);

      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      if (quoi === 'sens') return qSens(rnd, palier);
      if (quoi === 'fraction') return qFraction(rnd, palier);
      if (quoi === 'comparer') return qComparer(rnd, palier);
      if (quoi === 'complement') return qComplement(rnd, palier);
      if (quoi === 'ecritures') return qEcritures(rnd, palier);
      return qPourcentage(rnd, palier);
    }
  });

})();
