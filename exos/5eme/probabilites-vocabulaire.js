/*
 * probabilites-vocabulaire — expérience aléatoire, issue, événement (leçon 5ème
 * du même nom).
 *
 *   experience   parmi quatre actions, laquelle est une expérience aléatoire ?
 *   issues       combien d'issues cette expérience a-t-elle ?
 *   combien      combien d'issues cet événement regroupe-t-il ?
 *   realise      on a obtenu telle issue : quels événements sont réalisés ?
 *   nature       « obtenir un nombre pair » : issue, événement, ou expérience ?
 *   certain      cet événement est-il certain, impossible, ou entre les deux ?
 *   proprietes   vrai/faux sur le vocabulaire.
 *
 * ---------------------------------------------------------------------------
 * Le mot juste, et rien que le mot juste
 * ---------------------------------------------------------------------------
 * Une leçon de vocabulaire s'évalue mal en oui/non : « est-ce un événement ? »
 * se devine une fois sur deux. Les familles demandent donc de COMPTER ou de
 * CHOISIR le mot exact :
 *
 *   — « combien » oblige à énumérer les issues que la condition regroupe. On ne
 *     peut pas y répondre sans avoir compris qu'un événement est un paquet ;
 *   — « realise » coche plusieurs événements à la fois : il faut les tester
 *     tous, un par un, contre la même issue ;
 *   — « nature » met les trois mots en concurrence, et c'est le seul endroit
 *     où l'on peut les confondre pour de bon.
 *
 * ---------------------------------------------------------------------------
 * Ce que les univers ont de particulier
 * ---------------------------------------------------------------------------
 * Les expériences ne sont pas décoratives. « Deux pièces » a QUATRE issues,
 * parce que Pile-Face et Face-Pile ne sont pas la même chose ; « deux dés » en a
 * onze, dont on prend soin de ne jamais dire qu'elles sont équiprobables ;
 * « pierre-feuille-ciseaux » en a neuf, alors que le jeu n'a que trois issues
 * apparentes. Ce sont exactement les trois endroits où l'on se trompe en
 * comptant, et le générateur y revient.
 *
 * Tout est calculé : chaque événement est une LISTE d'issues, construite par un
 * filtre sur l'univers. Le nombre annoncé dans la correction est la longueur de
 * cette liste, jamais un nombre écrit à la main.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  function fr(v) { return O.fr(v); }
  function ens(t, max) {
    // l'univers en accolades, tronqué au-delà de dix issues : une liste de vingt
    // numéros n'apprend rien de plus que « … » et déborde de la ligne
    var l = t.map(String);
    if (l.length > (max || 10)) {
      l = l.slice(0, 4).concat(['…', l[l.length - 1]]);
    }
    return '{ ' + l.join(' ; ') + ' }';
  }

  var RAPPEL = 'Une <b>issue</b> est <b>un</b> résultat possible. Un <b>événement</b> est ' +
    'une <b>condition</b> qui <b>regroupe</b> plusieurs issues : il est <b>réalisé</b> quand ' +
    'l\'issue obtenue en fait partie.';

  /* ===================================================================== */
  /* Les expériences                                                       */
  /* ===================================================================== */
  /* Chacune se décrit d'une phrase, énumère son univers, et propose des
     événements sous forme de FILTRES — jamais de listes écrites à la main :
     c'est le filtre qui produit la liste, et la liste qui donne le nombre. */

  /* `action` décrit l'expérience à l'INFINITIF. Elle est écrite ici, à la main,
     et pas fabriquée en découpant la phrase : « On lance une pièce » dont on
     retire le « On » donne « lance une pièce », qui ne se dit pas. */
  function numerique(rnd, nom, n, phrase, action) {
    var issues = [];
    for (var i = 1; i <= n; i++) issues.push(i);
    var evts = [
      { t: 'obtenir un nombre pair', f: function (x) { return x % 2 === 0; } },
      { t: 'obtenir un nombre impair', f: function (x) { return x % 2 === 1; } }
    ];
    var k = rnd.choix([3, 4, 5]);
    if (k < n) {
      evts.push({ t: 'obtenir un multiple de ' + k,
                  f: function (x) { return x % k === 0; } });
    }
    var s = rnd.entier(2, n - 2);
    evts.push({ t: 'obtenir un nombre strictement plus grand que ' + s,
                f: function (x) { return x > s; } });
    evts.push({ t: 'obtenir un nombre inférieur ou égal à ' + s,
                f: function (x) { return x <= s; } });
    if (n >= 12) {
      evts.push({ t: 'obtenir un nombre à deux chiffres',
                  f: function (x) { return x >= 10; } });
    }
    return {
      nom: nom, phrase: phrase, action: action, issues: issues, evts: evts,
      certains: ['obtenir un nombre compris entre 1 et ' + n,
                 'obtenir un nombre plus grand que 0'],
      impossibles: ['obtenir ' + (n + 1), 'obtenir un nombre négatif']
    };
  }

  function tireExperience(rnd) {
    var quoi = rnd.choix(['de', 'sac', 'de', 'piece', 'deuxPieces', 'deuxDes', 'pfc',
                          'sac', 'carte']);

    if (quoi === 'de') {
      var f = rnd.choix([6, 6, 10, 12, 20]);
      return numerique(rnd, 'dé', f,
        'On lance un dé à <b>' + f + ' faces</b>, numérotées de 1 à ' + f +
        ', et on note le nombre obtenu.',
        'lancer le dé et noter le nombre obtenu');
    }
    if (quoi === 'sac') {
      var n = rnd.entier(8, 24);
      return numerique(rnd, 'sac', n,
        'Un sac contient <b>' + n + ' boules</b> numérotées de 1 à ' + n +
        '. On en tire une au hasard et on note son numéro.',
        'tirer une boule du sac et noter son numéro');
    }
    if (quoi === 'carte') {
      var c = rnd.choix([10, 15, 20]);
      return numerique(rnd, 'cartes', c,
        'On mélange <b>' + c + ' cartes</b> numérotées de 1 à ' + c +
        ', et on en retourne une au hasard.',
        'retourner une carte au hasard et noter son numéro');
    }
    if (quoi === 'piece') {
      return {
        nom: 'pièce',
        phrase: 'On lance une <b>pièce</b> et on note le côté obtenu.',
        action: 'lancer la pièce et noter le côté obtenu',
        issues: ['Pile', 'Face'],
        evts: [{ t: 'obtenir Pile', f: function (x) { return x === 'Pile'; } },
               { t: 'obtenir Face', f: function (x) { return x === 'Face'; } }],
        certains: ['obtenir Pile ou Face'],
        impossibles: ['obtenir la tranche', 'obtenir deux fois Pile']
      };
    }
    if (quoi === 'deuxPieces') {
      /* QUATRE issues, pas trois : Pile-Face et Face-Pile sont deux résultats
         distincts, et c'est l'erreur de comptage la plus fréquente. */
      return {
        nom: 'deux pièces',
        phrase: 'On lance <b>deux pièces</b>, une rouge et une bleue, et on note le côté ' +
          'de chacune — celui de la rouge d\'abord.',
        action: 'lancer les deux pièces et noter les deux côtés',
        issues: ['Pile-Pile', 'Pile-Face', 'Face-Pile', 'Face-Face'],
        evts: [
          { t: 'obtenir deux fois le même côté',
            f: function (x) { return x === 'Pile-Pile' || x === 'Face-Face'; } },
          { t: 'obtenir au moins un Pile',
            f: function (x) { return x.indexOf('Pile') >= 0; } },
          { t: 'obtenir exactement un Pile',
            f: function (x) { return x === 'Pile-Face' || x === 'Face-Pile'; } },
          { t: 'obtenir deux Faces', f: function (x) { return x === 'Face-Face'; } }
        ],
        certains: ['obtenir au moins un Pile ou au moins une Face'],
        impossibles: ['obtenir trois Piles']
      };
    }
    if (quoi === 'deuxDes') {
      var som = [];
      for (var s2 = 2; s2 <= 12; s2++) som.push(s2);
      return {
        nom: 'deux dés',
        phrase: 'On lance <b>deux dés</b> à six faces et on note la <b>somme</b> des deux ' +
          'nombres obtenus.',
        action: 'lancer les deux dés et noter la somme',
        issues: som,
        evts: [
          { t: 'obtenir une somme paire', f: function (x) { return x % 2 === 0; } },
          { t: 'obtenir 7', f: function (x) { return x === 7; } },
          { t: 'obtenir une somme supérieure ou égale à 10',
            f: function (x) { return x >= 10; } },
          { t: 'obtenir une somme inférieure ou égale à 4',
            f: function (x) { return x <= 4; } }
        ],
        certains: ['obtenir une somme comprise entre 2 et 12'],
        impossibles: ['obtenir 1', 'obtenir 13'],
        // la mise en garde de la leçon, rappelée dans les corrections
        note: 'Attention : ces onze issues ne sont <b>pas</b> également probables — il y a ' +
          'six façons de faire 7 et une seule d\'en faire 2. Cela ne change rien au nombre ' +
          'd\'issues, mais tout au reste.'
      };
    }
    // pierre-feuille-ciseaux : neuf issues, alors que le jeu n'a que trois
    // résultats apparents
    var mains = ['Pierre', 'Feuille', 'Ciseaux'];
    var couples = [];
    mains.forEach(function (a) {
      mains.forEach(function (b) { couples.push(a + '-' + b); });
    });
    var BAT = { Pierre: 'Ciseaux', Feuille: 'Pierre', Ciseaux: 'Feuille' };
    return {
      nom: 'pierre-feuille-ciseaux',
      phrase: 'Deux joueuses jouent à <b>pierre-feuille-ciseaux</b>. Une issue, c\'est le ' +
        '<b>couple</b> des deux mains : celle d\'Alice d\'abord, celle de Bob ensuite.',
      action: 'jouer une partie de pierre-feuille-ciseaux',
      issues: couples,
      evts: [
        { t: 'Alice gagne', f: function (x) {
            var p = x.split('-'); return BAT[p[0]] === p[1]; } },
        { t: 'Bob gagne', f: function (x) {
            var p = x.split('-'); return BAT[p[1]] === p[0]; } },
        { t: 'il y a égalité', f: function (x) {
            var p = x.split('-'); return p[0] === p[1]; } },
        { t: 'Alice joue Pierre', f: function (x) { return x.indexOf('Pierre-') === 0; } }
      ],
      certains: ['Alice gagne, ou Bob gagne, ou il y a égalité'],
      impossibles: ['Alice et Bob gagnent toutes les deux']
    };
  }

  // Un événement, avec la liste des issues qu'il regroupe — calculée, jamais écrite.
  function evenement(x, e) {
    return { t: e.t, a: x.issues.filter(e.f) };
  }
  // Un événement ni certain ni impossible : c'est la seule sorte qui serve à
  // compter, et le tirage doit donc l'imposer.
  function evtStrict(rnd, x) {
    for (var i = 0; i < 40; i++) {
      var e = evenement(x, rnd.choix(x.evts));
      if (e.a.length && e.a.length < x.issues.length) return e;
    }
    return null;
  }

  /* ===================================================================== */
  /* 1. Qu'est-ce qu'une expérience aléatoire ?                            */
  /* ===================================================================== */
  var ALEATOIRES = [
    'Lancer un dé et noter le nombre obtenu.',
    'Tirer une carte au hasard dans un jeu mélangé.',
    'Faire tourner une roue de loterie et noter la couleur.',
    'Tirer une boule dans un sac sans regarder.',
    'Lancer une pièce et noter le côté.'
  ];
  var CERTAINES = [
    'Mesurer la longueur de la table avec un mètre.',
    'Calculer 17 × 4.',
    'Compter le nombre d\'élèves présents dans la classe.',
    'Lire l\'heure sur l\'horloge.',
    'Peser un sac de farine sur une balance.',
    'Chercher la date d\'aujourd\'hui sur un calendrier.'
  ];

  function qExperience(rnd, palier) {
    var bonne = rnd.choix(ALEATOIRES);
    var faux = rnd.melange(CERTAINES.slice()).slice(0, 3);
    var props = rnd.melange([{ t: bonne, bon: true }].concat(
      faux.map(function (t) { return { t: t, bon: false }; })));
    return {
      enonce: '<b>Une seule de ces actions est une expérience aléatoire. Laquelle ?</b>',
      type: 'qcm',
      choix: props.map(function (p) { return p.t; }),
      correct: props.map(function (p) { return p.bon; }).indexOf(true),
      etapes: ['Une <b>expérience aléatoire</b> est une action dont on <b>ne peut pas ' +
        'prévoir</b> le résultat, mais dont on connaît <b>tous</b> les résultats possibles.',
        '« ' + bonne + ' » : impossible de dire à l\'avance ce qu\'on obtiendra, et pourtant ' +
        'on sait d\'avance quels résultats peuvent sortir. C\'est bien une expérience ' +
        'aléatoire.',
        'Les autres donnent un résultat <b>déterminé</b> : en les refaisant dans les mêmes ' +
        'conditions, on retrouve la même réponse. Mesurer, compter ou calculer n\'a rien ' +
        'd\'aléatoire.'],
      indices: ['Demande-toi : puis-je prévoir le résultat à coup sûr ?',
                'Si en refaisant l\'action on retrouve toujours la même réponse, ce n\'est ' +
                'pas du hasard.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 2. Combien d'issues ?                                                 */
  /* ===================================================================== */
  function qIssues(rnd, palier) {
    /* Aux paliers 3 et 4, on privilégie les univers qu'on compte mal : deux
       pièces, deux dés, pierre-feuille-ciseaux. */
    var x;
    for (var i = 0; i < 40; i++) {
      x = tireExperience(rnd);
      var dur = ['deux pièces', 'deux dés', 'pierre-feuille-ciseaux'].indexOf(x.nom) >= 0;
      if (palier <= 2 ? !dur : dur) break;
    }
    var detail = x.nom === 'deux pièces'
      ? 'Attention : <b>Pile-Face</b> et <b>Face-Pile</b> sont deux issues <b>différentes</b> ' +
        '— la rouge et la bleue ne montrent pas la même chose. On les compte toutes les deux.'
      : x.nom === 'pierre-feuille-ciseaux'
      ? 'Attention : le jeu n\'a que trois résultats (gagné, perdu, égalité), mais ce ne sont ' +
        'pas les issues. Une issue, c\'est un <b>couple</b> de mains : 3 choix pour Alice × 3 ' +
        'pour Bob = <b>9</b>.'
      : x.nom === 'deux dés'
      ? 'La plus petite somme est 2 (1 et 1), la plus grande est 12 (6 et 6). De 2 à 12, il y ' +
        'a <b>11</b> nombres — et non 12.'
      : 'On les compte simplement : il y en a <b>' + x.issues.length + '</b>.';

    return {
      enonce: x.phrase + '<br><b>Combien cette expérience a-t-elle d\'issues ?</b>',
      type: 'nombre',
      reponse: x.issues.length,
      etapes: [RAPPEL,
        'Les issues sont <b>tous les résultats possibles</b> : ' + ens(x.issues) + '.',
        detail].concat(x.note ? [x.note] : []),
      indices: ['Écris tous les résultats possibles, puis compte-les.',
                'Deux résultats qui ne se ressemblent pas sont deux issues différentes.'],
      duree: 80
    };
  }

  /* ===================================================================== */
  /* 3. Combien d'issues l'événement regroupe-t-il ?                       */
  /* ===================================================================== */
  /* La question centrale : on ne peut y répondre qu'en ayant compris qu'un
     événement est un paquet d'issues, et en les énumérant. */
  function qCombien(rnd, palier) {
    var x, e;
    for (var i = 0; i < 40; i++) {
      x = tireExperience(rnd);
      e = evtStrict(rnd, x);
      if (e && e.a.length >= 2) break;
    }
    if (!e) return qIssues(rnd, palier);

    return {
      enonce: x.phrase + '<br>On considère l\'événement <b>« ' + e.t + ' »</b>.' +
        '<br><b>Combien d\'issues cet événement regroupe-t-il ?</b>',
      type: 'nombre',
      reponse: e.a.length,
      etapes: [RAPPEL,
        'Les issues de l\'expérience sont ' + ens(x.issues) + '.',
        'On garde celles qui vérifient la condition « ' + e.t + ' » : ' + ens(e.a) + '.',
        'Il y en a <b>' + e.a.length + '</b>. L\'événement en regroupe donc ' + e.a.length +
          ' sur ' + x.issues.length + ' — un événement n\'est pas un résultat, c\'est un ' +
          '<b>paquet</b> de résultats.'],
      indices: ['Écris toutes les issues possibles.',
                'Entoure celles qui remplissent la condition, puis compte-les.'],
      duree: 100
    };
  }

  /* ===================================================================== */
  /* 4. Quels événements sont réalisés ?                                   */
  /* ===================================================================== */
  function qRealise(rnd, palier) {
    var x, lot, issue;
    for (var essai = 0; essai < 40; essai++) {
      x = tireExperience(rnd);
      if (x.evts.length < 3) continue;
      issue = rnd.choix(x.issues);
      lot = rnd.melange(x.evts.slice()).slice(0, Math.min(4, x.evts.length))
              .map(function (e) { return evenement(x, e); });
      var n = lot.filter(function (e) { return e.a.indexOf(issue) >= 0; }).length;
      // il en faut au moins un réalisé et au moins un non réalisé, sinon
      // « tout cocher » ou « ne rien cocher » suffirait
      if (n >= 1 && n < lot.length) break;
    }
    if (!lot) return qCombien(rnd, palier);

    var corrects = [];
    lot.forEach(function (e, k) { if (e.a.indexOf(issue) >= 0) corrects.push(k); });

    return {
      enonce: x.phrase + '<br>On a obtenu : <b>' + issue + '</b>.' +
        '<br><b>Coche tous les événements qui sont réalisés.</b>',
      type: 'qcm-multi',
      choix: lot.map(function (e) { return e.t; }),
      corrects: corrects,
      etapes: [RAPPEL,
        'Un événement est <b>réalisé</b> si l\'issue obtenue — ici <b>' + issue +
          '</b> — fait partie des issues qu\'il regroupe.'].concat(
        lot.map(function (e) {
          var dedans = e.a.indexOf(issue) >= 0;
          return (dedans ? '✔ ' : '✘ ') + '« ' + e.t +' » regroupe ' + ens(e.a) + ' : ' +
            issue + (dedans ? ' en fait partie, l\'événement est réalisé.'
                            : ' n\'en fait pas partie, il n\'est pas réalisé.');
        })).concat(['<b>À retenir :</b> plusieurs événements peuvent être réalisés par la ' +
          '<b>même</b> issue — ils se chevauchent, ce ne sont pas des cases séparées.']),
      indices: ['Pour chaque événement, écris les issues qu\'il regroupe.',
                'Puis regarde si l\'issue obtenue est dans la liste.'],
      duree: 120
    };
  }

  /* ===================================================================== */
  /* 5. Issue, événement ou expérience ?                                   */
  /* ===================================================================== */
  function qNature(rnd, palier) {
    var x = tireExperience(rnd);
    var quoi = rnd.choix(['issue', 'evenement', 'experience']);
    var sujet, expli;

    if (quoi === 'issue') {
      var i = rnd.choix(x.issues);
      sujet = 'obtenir ' + i;
      expli = '« ' + sujet + ' » désigne <b>un seul</b> résultat possible : c\'est une ' +
        '<b>issue</b>.';
    } else if (quoi === 'evenement') {
      var e = evtStrict(rnd, x);
      if (!e || e.a.length < 2) return qCombien(rnd, palier);
      sujet = e.t;
      expli = '« ' + sujet + ' » ne désigne pas un résultat unique : c\'est une ' +
        '<b>condition</b> qui regroupe ' + e.a.length + ' issues — ' + ens(e.a) +
        '. C\'est donc un <b>événement</b>.';
    } else {
      sujet = x.action;
      expli = 'Il s\'agit de l\'<b>action</b> elle-même, dont on ne peut pas prévoir le ' +
        'résultat : c\'est l\'<b>expérience aléatoire</b>.';
    }

    var props = rnd.melange([
      { t: 'une issue', cle: 'issue' },
      { t: 'un événement', cle: 'evenement' },
      { t: 'une expérience aléatoire', cle: 'experience' }
    ]);

    return {
      enonce: x.phrase + '<br>Dans cette situation, <b>« ' + sujet + ' »</b> est…' +
        '<br><b>Choisis le mot juste.</b>',
      type: 'qcm',
      choix: props.map(function (p) { return p.t; }),
      correct: props.map(function (p) { return p.cle; }).indexOf(quoi),
      etapes: [RAPPEL,
        'L\'<b>expérience aléatoire</b> est l\'action ; une <b>issue</b> est un résultat ' +
          'possible ; un <b>événement</b> est une condition qui en regroupe plusieurs.',
        expli],
      indices: ['Est-ce une action, un résultat unique, ou une condition ?',
                'Si cela peut se réaliser de plusieurs façons, c\'est un événement.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 6. Certain, impossible, ou entre les deux ?                           */
  /* ===================================================================== */
  function qCertain(rnd, palier) {
    var x = tireExperience(rnd);
    var quoi = rnd.choix(['certain', 'impossible', 'ni', 'ni']);
    var sujet, combien, expli;

    if (quoi === 'certain') {
      sujet = rnd.choix(x.certains);
      combien = x.issues.length;
      expli = 'Cette condition est vérifiée par <b>toutes</b> les issues : quoi qu\'il ' +
        'arrive, elle se réalise. L\'événement est <b>certain</b>.';
    } else if (quoi === 'impossible') {
      sujet = rnd.choix(x.impossibles);
      combien = 0;
      expli = 'Aucune issue ne vérifie cette condition : elle ne peut jamais se réaliser. ' +
        'L\'événement est <b>impossible</b>.';
    } else {
      var e = evtStrict(rnd, x);
      if (!e) return qCombien(rnd, palier);
      sujet = e.t;
      combien = e.a.length;
      expli = 'Cette condition regroupe ' + e.a.length + ' issue' +
        (e.a.length > 1 ? 's' : '') + ' sur ' + x.issues.length + ' — ' + ens(e.a) +
        '. Elle peut se réaliser, mais pas à tous les coups : l\'événement n\'est ' +
        '<b>ni certain, ni impossible</b>.';
    }

    var props = rnd.melange([
      { t: 'certain', cle: 'certain' },
      { t: 'impossible', cle: 'impossible' },
      { t: 'ni certain, ni impossible', cle: 'ni' }
    ]);

    return {
      enonce: x.phrase + '<br>On considère l\'événement <b>« ' + sujet + ' »</b>.' +
        '<br><b>Cet événement est-il certain, impossible, ou ni l\'un ni l\'autre ?</b>',
      type: 'qcm',
      choix: props.map(function (p) { return p.t; }),
      correct: props.map(function (p) { return p.cle; }).indexOf(quoi),
      etapes: [RAPPEL,
        'Les issues de l\'expérience sont ' + ens(x.issues) + ' : il y en a <b>' +
          x.issues.length + '</b>.',
        'Combien en regroupe l\'événement « ' + sujet + ' » ? <b>' + combien + '</b>.',
        expli,
        '<b>À retenir :</b> un événement qui regroupe <b>toutes</b> les issues est ' +
          '<b>certain</b>, celui qui n\'en regroupe <b>aucune</b> est <b>impossible</b>. ' +
          'Tous les autres sont entre les deux.'],
      indices: ['Compte les issues que l\'événement regroupe.',
                'Toutes → certain. Aucune → impossible. Entre les deux → ni l\'un ni l\'autre.'],
      duree: 100
    };
  }

  /* ===================================================================== */
  /* 7. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Dans une expérience aléatoire, on ne connaît pas les résultats possibles.',
      ok: false,
      d: 'Au contraire : on ne sait pas <b>lequel</b> sortira, mais on connaît d\'avance ' +
         '<b>tous</b> ceux qui peuvent sortir. C\'est ce qui distingue le hasard de ' +
         'l\'inconnu total.' },
    { t: 'Un événement peut regrouper plusieurs issues.', ok: true,
      d: 'C\'est même sa définition : « obtenir un nombre pair » regroupe 2, 4 et 6.' },
    { t: 'Un événement qui regroupe toutes les issues est certain.', ok: true,
      d: 'Quoi qu\'il arrive, il se réalise.' },
    { t: 'Un événement impossible regroupe une seule issue.', ok: false,
      d: 'Il n\'en regroupe <b>aucune</b>. Un événement qui regroupe une seule issue peut ' +
         'très bien se réaliser.' },
    { t: 'Lancer deux pièces donne trois issues : deux Piles, deux Faces, ou un de chaque.',
      ok: false,
      d: 'Il y en a <b>quatre</b> : Pile-Pile, Pile-Face, Face-Pile et Face-Face. ' +
         'Pile-Face et Face-Pile sont deux issues différentes.' },
    { t: 'Si on lance deux dés et qu\'on note la somme, il y a onze issues.', ok: true,
      d: 'De 2 à 12, cela fait onze nombres. Attention toutefois : elles ne sont ' +
         '<b>pas</b> également probables.' },
    { t: 'Deux événements différents ne peuvent pas être réalisés en même temps.',
      ok: false,
      d: 'Si on obtient 6 avec un dé, « obtenir un nombre pair » <b>et</b> « obtenir un ' +
         'multiple de 3 » sont tous les deux réalisés. Les événements se chevauchent.' },
    { t: 'Une issue est un des résultats possibles de l\'expérience.', ok: true,
      d: 'Un seul résultat à la fois — c\'est ce qui la distingue d\'un événement.' },
    { t: 'À pierre-feuille-ciseaux, « je gagne » est une issue.', ok: false,
      d: 'C\'est un <b>événement</b> : il regroupe les trois couples de mains qui te font ' +
         'gagner. Les issues sont les neuf couples possibles.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d, RAPPEL],
      indices: ['Repense aux trois mots : l\'action, un résultat, une condition.'],
      duree: 60
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'probabilites-vocabulaire', competence: 'probabilites-vocabulaire',
    level: '5eme',
    titre: 'Le vocabulaire des probabilités', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['experience', 'issues', 'nature', 'proprietes'] :
        palier === 2 ? ['issues', 'combien', 'nature', 'certain', 'proprietes'] :
        palier === 3 ? ['combien', 'realise', 'certain', 'nature', 'issues'] :
                       ['realise', 'combien', 'certain', 'realise', 'issues']);

      if (quoi === 'experience') return qExperience(rnd, palier);
      if (quoi === 'issues') return qIssues(rnd, palier);
      if (quoi === 'combien') return qCombien(rnd, palier);
      if (quoi === 'realise') return qRealise(rnd, palier);
      if (quoi === 'nature') return qNature(rnd, palier);
      if (quoi === 'certain') return qCertain(rnd, palier);
      return qProprietes(rnd, palier);
    }
  });

})();
