/*
 * reperage — lire et placer un point dans un repère orthogonal (leçon 5ème
 * « Lire et placer un point dans un repère »).
 *
 *   coord       un point est dessiné : on demande son abscisse, ou son ordonnée ;
 *   paire       le même point, mais on choisit le couple complet — et le couple
 *               INVERSÉ figure toujours parmi les propositions ;
 *   placer      des coordonnées sont données, quel point du dessin est-ce ?
 *   deplacement on part d'un point, on fait des bonds, où arrive-t-on ?
 *   axes        un point posé sur un axe : une de ses coordonnées est nulle ;
 *   proprietes  vrai/faux sur les signes, l'ordre et l'origine.
 *
 * ---------------------------------------------------------------------------
 * Le leurre qui compte
 * ---------------------------------------------------------------------------
 * Dans toutes les familles à choix, le couple INVERSÉ est proposé : (−2 ; 3)
 * quand la réponse est (3 ; −2). C'est l'erreur de la leçon, celle que l'ordre
 * d'écriture doit empêcher, et la seule façon de vérifier qu'elle est comprise
 * est de la rendre disponible. On écarte donc les points dont l'abscisse et
 * l'ordonnée sont égales : pour eux, inverser ne change rien, et la question
 * perdrait tout son sel.
 *
 * Les points ont des coordonnées ENTIÈRES, sur les nœuds du quadrillage : il
 * n'y a rien à estimer, seulement à compter.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var R = RepereOutils;

  var BLEU = '#2563eb', ROUGE = '#dc2626', VERT = '#059669', ORANGE = '#ea580c';
  var COULEURS = [ROUGE, BLEU, VERT, ORANGE];

  function nb(v) { return O.fr(v); }
  function couple(p) { return '(' + nb(p[0]) + ' ; ' + nb(p[1]) + ')'; }
  function tex(s) { return '\\(' + s + '\\)'; }

  /* Un point dont l'inversion se voit : abscisse ≠ ordonnée, et au moins une
     des deux non nulle — sinon « inverser » ne veut rien dire. */
  function tirePoint(rnd, max) {
    var m = max || 6, p;
    do {
      p = [rnd.entier(-m, m), rnd.entier(-m, m)];
    } while (p[0] === p[1]);
    return p;
  }
  /* Plusieurs points bien séparés, pour qu'on ne les confonde pas à l'œil. */
  function tirePoints(rnd, n, max) {
    var out = [];
    for (var essai = 0; essai < 400 && out.length < n; essai++) {
      var p = tirePoint(rnd, max);
      var loin = out.every(function (q) {
        return Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) >= 3;
      });
      if (loin) out.push(p);
    }
    return out;
  }

  var RAPPEL = 'On lit toujours l\'<b>abscisse en premier</b> : le nombre de pas vers la ' +
    'droite (positif) ou vers la gauche (négatif), puis le nombre de pas vers le haut ' +
    '(positif) ou vers le bas (négatif).';

  /* ===================================================================== */
  /* 1. Lire une coordonnée                                                */
  /* ===================================================================== */
  function qCoord(rnd, palier) {
    var p = tirePoint(rnd, 6);
    var abscisse = rnd.booleen(0.5);
    var v = abscisse ? p[0] : p[1];
    return {
      enonce: 'Voici le point ' + tex('A') + ' dans un repère.' +
        R.repere({ points: [{ p: p, nom: 'A', couleur: ROUGE }] }) +
        '<b>Quelle est ' + (abscisse ? 'l\'abscisse' : 'l\'ordonnée') + ' de ' + tex('A') +
        ' ?</b>',
      type: 'nombre',
      reponse: v,
      etapes: [RAPPEL,
        abscisse
          ? 'L\'<b>abscisse</b> se lit sur l\'axe <b>horizontal</b> : on descend (ou on monte) ' +
            'du point jusqu\'à cet axe. On tombe sur <b>' + nb(p[0]) + '</b>.'
          : 'L\'<b>ordonnée</b> se lit sur l\'axe <b>vertical</b> : on va du point jusqu\'à ' +
            'cet axe, horizontalement. On tombe sur <b>' + nb(p[1]) + '</b>.',
        'Autrement dit, depuis l\'origine il faut ' + Math.abs(p[0]) + ' pas vers ' +
          (p[0] >= 0 ? 'la droite' : 'la gauche') + ', puis ' + Math.abs(p[1]) + ' pas vers ' +
          (p[1] >= 0 ? 'le haut' : 'le bas') + ' : ' + tex('A' + couple(p)) + '.'],
      indices: [abscisse ? 'L\'abscisse, c\'est le déplacement horizontal.'
                         : 'L\'ordonnée, c\'est le déplacement vertical.',
                'Compte les carreaux depuis l\'origine, en faisant attention au sens.'],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 2. Le couple complet, avec l'inversé parmi les leurres                */
  /* ===================================================================== */
  function qPaire(rnd, palier) {
    var p = tirePoint(rnd, 6);
    var faux = [[p[1], p[0]],                       // l'inversé : LE leurre
                [-p[0], p[1]],                      // le signe de l'abscisse
                [p[0], -p[1]]];                     // le signe de l'ordonnée
    var vus = {}, props = [{ p: p, bon: true }];
    vus[couple(p)] = 1;
    faux.forEach(function (q) {
      if (vus[couple(q)]) return;
      vus[couple(q)] = 1;
      props.push({ p: q, bon: false });
    });
    props = rnd.melange(props);

    return {
      enonce: 'Voici le point ' + tex('A') + ' dans un repère.' +
        R.repere({ points: [{ p: p, nom: 'A', couleur: ROUGE }] }) +
        '<b>Quelles sont les coordonnées de ' + tex('A') + ' ?</b>',
      type: 'qcm',
      choix: props.map(function (x) { return tex('A' + couple(x.p).replace(/−/g, '-')); }),
      correct: props.map(function (x) { return x.bon; }).indexOf(true),
      etapes: [RAPPEL,
        'Depuis l\'origine : ' + Math.abs(p[0]) + ' pas vers ' +
          (p[0] >= 0 ? 'la droite' : 'la gauche') + ' — l\'abscisse vaut <b>' + nb(p[0]) +
          '</b> — puis ' + Math.abs(p[1]) + ' pas vers ' + (p[1] >= 0 ? 'le haut' : 'le bas') +
          ' — l\'ordonnée vaut <b>' + nb(p[1]) + '</b>.',
        'On écrit donc <b>' + tex('A' + couple(p)) + '</b>.',
        '<b>Le piège</b> : ' + tex(couple([p[1], p[0]])) + ' utilise les mêmes nombres dans ' +
          'l\'autre ordre — c\'est un <b>autre point</b>, situé ailleurs. L\'abscisse se ' +
          'donne toujours en premier.'],
      indices: ['Compte d\'abord horizontalement, puis verticalement.',
                'Attention à l\'ordre : abscisse, puis ordonnée.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 2 bis. Écrire soi-même les coordonnées                                */
  /* ===================================================================== */
  /* La même question que ci-dessus, mais sans propositions : on tape le couple.
     C'est ce qu'on demande sur un cahier, et c'est le seul format où l'on voit
     si l'élève écrit vraiment l'abscisse en premier — le moteur le lui dira
     s'il inverse. */
  function qEcrire(rnd, palier) {
    var p = tirePoint(rnd, 6);
    return {
      enonce: 'Voici le point ' + tex('A') + ' dans un repère.' +
        R.repere({ points: [{ p: p, nom: 'A', couleur: ROUGE }] }) +
        '<b>Écris les coordonnées de ' + tex('A') + '</b>, sous la forme ' +
        tex('(x\\,;\\,y)') + '.',
      type: 'couple',
      reponse: p,
      etapes: [RAPPEL,
        'Depuis l\'origine : ' + Math.abs(p[0]) + ' pas vers ' +
          (p[0] >= 0 ? 'la droite' : 'la gauche') + ', donc l\'abscisse vaut <b>' + nb(p[0]) +
          '</b> ; puis ' + Math.abs(p[1]) + ' pas vers ' + (p[1] >= 0 ? 'le haut' : 'le bas') +
          ', donc l\'ordonnée vaut <b>' + nb(p[1]) + '</b>.',
        'On écrit <b>' + tex('A' + couple(p)) + '</b> — les deux nombres séparés par un ' +
          'point-virgule, l\'abscisse en premier.'],
      indices: ['Compte d\'abord les pas horizontaux, puis les pas verticaux.',
                'Écris les deux nombres entre parenthèses, séparés par un point-virgule : ' +
                  tex('(x\\,;\\,y)') + '.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 3. Placer : lequel de ces points ?                                    */
  /* ===================================================================== */
  function qPlacer(rnd, palier) {
    var pts = tirePoints(rnd, 4, 6);
    if (pts.length < 4) return qPaire(rnd, palier);
    var i = rnd.entier(0, 3);
    var noms = ['A', 'B', 'C', 'D'];
    // le point cherché ne doit pas être confondu avec son inversé s'il est là
    var cible = pts[i];

    return {
      enonce: '<b>Lequel de ces points a pour coordonnées ' + tex(couple(cible)) + ' ?</b>' +
        R.repere({ points: pts.map(function (p, k) {
          return { p: p, nom: noms[k], couleur: COULEURS[k] };
        }) }),
      type: 'qcm',
      choix: noms.map(function (n) { return 'Le point ' + n; }),
      correct: i,
      etapes: [RAPPEL,
        'On part de l\'origine, on fait ' + Math.abs(cible[0]) + ' pas vers ' +
          (cible[0] >= 0 ? 'la droite' : 'la gauche') + ', puis ' + Math.abs(cible[1]) +
          ' pas vers ' + (cible[1] >= 0 ? 'le haut' : 'le bas') + ' : on arrive sur <b>' +
          noms[i] + '</b>.',
        'Les autres points ont pour coordonnées ' +
          pts.map(function (p, k) { return k === i ? null : noms[k] + couple(p); })
             .filter(Boolean).join(', ') + '.'],
      indices: ['Fais le trajet depuis l\'origine : d\'abord horizontalement, puis ' +
                  'verticalement.',
                'Le premier nombre est l\'abscisse — le déplacement horizontal.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 4. Des bonds, et où l'on arrive                                       */
  /* ===================================================================== */
  function qDeplacement(rnd, palier) {
    var dep = tirePoint(rnd, 4);
    var dx = rnd.entier(-5, 5), dy = rnd.entier(-4, 4);
    if (dx === 0 && dy === 0) dx = 3;
    var arr = [dep[0] + dx, dep[1] + dy];
    // on reste dans un repère lisible
    if (Math.abs(arr[0]) > 7 || Math.abs(arr[1]) > 7) return qCoord(rnd, palier);

    var faux = [[dep[0] + dy, dep[1] + dx],                 // les deux bonds échangés
                [dep[0] - dx, dep[1] + dy],                 // le sens horizontal inversé
                [dep[0] + dx, dep[1] - dy]];                // le sens vertical inversé
    var vus = {}, props = [{ p: arr, bon: true }];
    vus[couple(arr)] = 1;
    faux.forEach(function (q) {
      if (vus[couple(q)]) return;
      vus[couple(q)] = 1;
      props.push({ p: q, bon: false });
    });
    if (props.length < 3) return qPaire(rnd, palier);
    props = rnd.melange(props);

    function motH(d) {
      return d === 0 ? 'aucun pas horizontal'
                     : Math.abs(d) + ' pas vers ' + (d > 0 ? 'la droite' : 'la gauche');
    }
    function motV(d) {
      return d === 0 ? 'aucun pas vertical'
                     : Math.abs(d) + ' pas vers ' + (d > 0 ? 'le haut' : 'le bas');
    }

    return {
      enonce: 'On part du point ' + tex('A' + couple(dep)) + '.<br>On fait <b>' + motH(dx) +
        '</b>, puis <b>' + motV(dy) + '</b>.' +
        R.repere({ points: [{ p: dep, nom: 'A', couleur: ROUGE }],
                   cadre: [arr] }) +
        '<b>Où arrive-t-on ?</b>',
      type: 'qcm',
      choix: props.map(function (x) { return tex(couple(x.p).replace(/−/g, '-')); }),
      correct: props.map(function (x) { return x.bon; }).indexOf(true),
      etapes: [
        'Se déplacer horizontalement change <b>l\'abscisse</b>, et elle seule : ' +
          nb(dep[0]) + (dx >= 0 ? ' + ' + dx : ' − ' + (-dx)) + ' = <b>' + nb(arr[0]) + '</b>.',
        'Se déplacer verticalement change <b>l\'ordonnée</b>, et elle seule : ' +
          nb(dep[1]) + (dy >= 0 ? ' + ' + dy : ' − ' + (-dy)) + ' = <b>' + nb(arr[1]) + '</b>.',
        'On arrive donc en <b>' + tex(couple(arr)) + '</b>.',
        'Un pas vers la droite ou vers le haut <b>ajoute</b> ; un pas vers la gauche ou vers ' +
          'le bas <b>retire</b>. Le signe est la direction.'],
      indices: ['Le déplacement horizontal ne touche que l\'abscisse.',
                'Vers la gauche ou vers le bas, on retire.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 5. Un point sur un axe                                                */
  /* ===================================================================== */
  function qAxes(rnd, palier) {
    var surX = rnd.booleen(0.5);                 // sur l'axe horizontal ?
    var v = rnd.entier(1, 6) * (rnd.booleen(0.5) ? 1 : -1);
    var p = surX ? [v, 0] : [0, v];
    var faux = [surX ? [0, v] : [v, 0], [v, v], [-v, 0]];
    var vus = {}, props = [{ p: p, bon: true }];
    vus[couple(p)] = 1;
    faux.forEach(function (q) {
      if (vus[couple(q)]) return;
      vus[couple(q)] = 1;
      props.push({ p: q, bon: false });
    });
    props = rnd.melange(props);

    return {
      enonce: 'Le point ' + tex('A') + ' est posé <b>sur un axe</b>.' +
        R.repere({ points: [{ p: p, nom: 'A', couleur: ROUGE }] }) +
        '<b>Quelles sont ses coordonnées ?</b>',
      type: 'qcm',
      choix: props.map(function (x) { return tex('A' + couple(x.p).replace(/−/g, '-')); }),
      correct: props.map(function (x) { return x.bon; }).indexOf(true),
      etapes: [
        surX
          ? 'Le point est sur l\'axe <b>horizontal</b> : depuis l\'origine, il n\'y a ' +
            '<b>aucun</b> pas vertical à faire. Son <b>ordonnée est nulle</b>.'
          : 'Le point est sur l\'axe <b>vertical</b> : depuis l\'origine, il n\'y a ' +
            '<b>aucun</b> pas horizontal à faire. Son <b>abscisse est nulle</b>.',
        'Il reste ' + Math.abs(v) + ' pas vers ' +
          (surX ? (v > 0 ? 'la droite' : 'la gauche') : (v > 0 ? 'le haut' : 'le bas')) +
          ' : ' + tex('A' + couple(p)) + '.',
        '<b>À retenir.</b> Un point de l\'axe horizontal s\'écrit ' + tex('(x\\,;\\,0)') +
          ', un point de l\'axe vertical ' + tex('(0\\,;\\,y)') + '. Et l\'origine, qui est ' +
          'sur les deux, est ' + tex('O(0\\,;\\,0)') + '.'],
      indices: ['Sur un axe, une des deux coordonnées est nulle. Laquelle ?',
                'Compte les pas depuis l\'origine : dans une direction, il n\'y en a aucun.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 6. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Dans un couple de coordonnées, on écrit l\'<b>abscisse en premier</b>.', ok: true,
      d: 'Oui : \\(A(3\\,;\\,-2)\\) veut dire abscisse 3, ordonnée −2. C\'est une convention, ' +
         'mais elle n\'est pas négociable — sans elle, personne ne saurait de quel point on ' +
         'parle.' },
    { t: 'Les points \\((3\\,;\\,-2)\\) et \\((-2\\,;\\,3)\\) sont le <b>même point</b>.',
      ok: false,
      d: 'Non : mêmes nombres, mais dans l\'autre ordre, donc deux points différents. Le ' +
         'premier est en bas à droite, le second en haut à gauche.' },
    { t: 'Un point d\'abscisse <b>négative</b> se trouve à <b>gauche</b> de l\'axe vertical.',
      ok: true,
      d: 'Oui : l\'abscisse compte les pas horizontaux depuis l\'origine, et un nombre ' +
         'négatif veut dire « vers la gauche ».' },
    { t: 'Un point d\'ordonnée <b>négative</b> se trouve <b>au-dessus</b> de l\'axe horizontal.',
      ok: false,
      d: 'Non : une ordonnée négative veut dire « vers le bas ». Le point est <b>en dessous</b> ' +
         'de l\'axe horizontal.' },
    { t: 'L\'origine du repère a pour coordonnées \\((0\\,;\\,0)\\).', ok: true,
      d: 'Oui : c\'est le point de départ, aucun pas dans aucune direction.' },
    { t: 'Un point situé sur l\'axe horizontal a une <b>ordonnée nulle</b>.', ok: true,
      d: 'Oui : il n\'y a aucun pas vertical à faire pour l\'atteindre. Il s\'écrit ' +
         '\\((x\\,;\\,0)\\).' },
    { t: 'Deux points différents peuvent avoir exactement les mêmes coordonnées.', ok: false,
      d: 'Non : c\'est tout l\'intérêt d\'un repère. Un couple de nombres désigne <b>un seul</b> ' +
         'point, et un point n\'a qu\'un seul couple de coordonnées.' },
    { t: 'Si deux points ont la <b>même abscisse</b>, ils sont l\'un au-dessus de l\'autre.',
      ok: true,
      d: 'Oui : même déplacement horizontal, donc même position gauche-droite. Ils sont sur ' +
         'une même verticale.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d, RAPPEL],
      indices: ['Repense au trajet depuis l\'origine : d\'abord horizontalement, puis ' +
                'verticalement.'],
      duree: 50
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'reperage', competence: 'reperage', level: '5eme',
    titre: 'Lire et placer un point dans un repère', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['proprietes', 'coord', 'coord', 'placer'] :
        palier === 2 ? ['coord', 'paire', 'placer', 'axes', 'proprietes'] :
        palier === 3 ? ['ecrire', 'paire', 'placer', 'deplacement', 'axes', 'coord'] :
                       ['ecrire', 'deplacement', 'ecrire', 'placer', 'axes']);

      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      if (quoi === 'coord') return qCoord(rnd, palier);
      if (quoi === 'paire') return qPaire(rnd, palier);
      if (quoi === 'ecrire') return qEcrire(rnd, palier);
      if (quoi === 'placer') return qPlacer(rnd, palier);
      if (quoi === 'axes') return qAxes(rnd, palier);
      return qDeplacement(rnd, palier);
    }
  });

})();
