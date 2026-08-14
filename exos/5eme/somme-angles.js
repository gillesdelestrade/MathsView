/*
 * somme-angles — retrouver un angle manquant dans un triangle (5ème, leçon
 * « La somme des angles d'un triangle »).
 *
 * ---------------------------------------------------------------------------
 * C'est la FIGURE qui pose la question
 * ---------------------------------------------------------------------------
 * L'énoncé ne dit jamais « ce triangle est isocèle » : il montre un triangle
 * dont deux côtés portent le même codage, et c'est à l'élève de le lire. De
 * même, le petit carré dit l'angle droit, et les mesures connues sont écrites
 * dans les angles eux-mêmes, pas recopiées dans le texte. Un point
 * d'interrogation marque celui qu'on cherche.
 *
 * Lire un codage est une compétence à part entière, et c'est celle qui sert
 * ensuite partout — en géométrie, on ne redit pas en toutes lettres ce que la
 * figure porte déjà.
 *
 * ---------------------------------------------------------------------------
 * Deux situations, comme demandé
 * ---------------------------------------------------------------------------
 *   — un triangle QUELCONQUE : deux angles sont écrits, on cherche le
 *     troisième. C'est la soustraction 180 − a − b, rien de plus ;
 *   — un triangle REMARQUABLE : on en dit le MINIMUM, et le codage complète.
 *       équilatéral       trois côtés codés, aucune mesure   → 60°
 *       rectangle isocèle un carré, deux côtés codés, rien   → 45°
 *       rectangle         un carré et UN angle               → le complément
 *       isocèle           deux côtés codés et UN angle       → selon lequel
 *
 * ---------------------------------------------------------------------------
 * Les nombres tombent juste, et la figure ne ment pas
 * ---------------------------------------------------------------------------
 * Les angles sont choisis ENTIERS d'abord ; le triangle est ensuite construit
 * à partir d'eux (loi des sinus), puis tourné et mis à l'échelle au hasard. Le
 * dessin porte donc exactement les angles annoncés — ce que le test vérifie en
 * remesurant les sommets du polygone tracé.
 *
 * Deux précautions de fond :
 *   — dans un triangle quelconque, aucun angle ne vaut 90° et les trois sont
 *     distincts : un angle droit non codé, ou deux angles égaux sans codage,
 *     laisseraient croire à une figure remarquable qu'on aurait oublié de
 *     marquer ;
 *   — dans un triangle isocèle, l'angle donné et l'angle cherché ne sont
 *     jamais les deux angles égaux entre eux, sinon la question se répondrait
 *     sans utiliser la somme des angles.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var T = TriOutils;

  var ROUGE = '#dc2626', ORANGE = '#ea580c';

  /* ===================================================================== */
  /* Construire un triangle à partir de ses trois angles                   */
  /* ===================================================================== */
  /* Loi des sinus : un côté est proportionnel au sinus de l'angle opposé. On
     pose donc a = sin(Â), etc., on place deux sommets, et le troisième se
     déduit. Le triangle obtenu a EXACTEMENT les angles voulus, à la précision
     du calcul près — c'est la seule façon d'être sûr que la figure dit la même
     chose que l'énoncé. */
  function triangleDAngles(rnd, deg) {
    var r = deg.map(function (d) { return d * Math.PI / 180; });
    var c = Math.sin(r[2]);                       // le côté [AB], opposé à Ĉ
    var b = Math.sin(r[1]);                       // le côté [AC], opposé à B̂
    var A = [0, 0], B = [c, 0];
    var C = [b * Math.cos(r[0]), b * Math.sin(r[0])];
    // une rotation quelconque, pour que la base ne soit pas toujours horizontale
    var t = rnd.entier(0, 35) * Math.PI / 18;
    var k = 1;
    function tourne(p) {
      return [k * (p[0] * Math.cos(t) - p[1] * Math.sin(t)),
              k * (p[0] * Math.sin(t) + p[1] * Math.cos(t))];
    }
    return [A, B, C].map(tourne);
  }

  /* Le nom d'un angle : Â, B̂, Ĉ — écrit en LaTeX pour l'énoncé. */
  var NOMS = ['A', 'B', 'C'];
  function chapeau(i) { return '\\(\\widehat{' + NOMS[i] + '}\\)'; }

  /* ===================================================================== */
  /* La figure                                                             */
  /* ===================================================================== */
  /*
   * `donnees` : { P, connus: {i: valeur}, cherche: i, droit: i|null,
   *               egaux: [[i,j], …] } — egaux liste les PAIRES DE SOMMETS dont
   * les côtés issus sont égaux ; on code alors les deux côtés concernés.
   */
  function dessine(d) {
    var marques = [], codes = [], equerres = [];
    for (var i = 0; i < 3; i++) {
      if (i === d.droit) continue;                // le carré suffit, pas d'arc
      if (d.connus[i] !== undefined) marques.push({ i: i, txt: d.connus[i] + '°' });
      else if (i === d.cherche) marques.push({ i: i, txt: '?', couleur: '#7c3aed' });
    }
    if (d.droit !== null && d.droit !== undefined) {
      var j = (d.droit + 1) % 3, k = (d.droit + 2) % 3;
      equerres.push({ pied: d.P[d.droit], vers: d.P[j], base: d.P[k] });
    }
    (d.cotes || []).forEach(function (c, n) {
      codes.push({ a: d.P[c[0]], b: d.P[c[1]], n: c[2] || 1, couleur: ORANGE });
    });
    return T.figure({
      P: d.P, noms: NOMS, marques: marques, codes: codes, equerres: equerres
    });
  }

  /* La question, une fois la situation posée. */
  function question(d, etapes, indices, duree) {
    return {
      enonce: 'Voici un triangle \\(ABC\\).<br><b>Quelle est la mesure de l\'angle ' +
        chapeau(d.cherche) + ', en degrés ?</b>' + dessine(d),
      type: 'nombre',
      reponse: d.vraies[d.cherche],
      etapes: etapes,
      indices: indices,
      duree: duree || 120
    };
  }

  /* Le rappel qui ouvre toutes les corrections. */
  var RAPPEL = 'Dans <b>tout</b> triangle, la somme des trois angles vaut ' +
    '<b>180°</b> : \\(\\widehat{A} + \\widehat{B} + \\widehat{C} = 180°\\).';

  /* ===================================================================== */
  /* 1. Triangle quelconque : deux angles donnés                           */
  /* ===================================================================== */
  function qQuelconque(rnd, palier) {
    var a, b, c;
    do {
      a = rnd.entier(25, 100);
      b = rnd.entier(25, 100);
      c = 180 - a - b;
    } while (c < 25 || c > 110 ||
             a === b || b === c || a === c ||      // deux angles égaux sans codage
             a === 90 || b === 90 || c === 90);    // un angle droit non codé
    var deg = rnd.melange([a, b, c]);
    var i = rnd.entier(0, 2);                      // l'angle cherché
    var connus = {};
    [0, 1, 2].forEach(function (k) { if (k !== i) connus[k] = deg[k]; });
    var autres = [0, 1, 2].filter(function (k) { return k !== i; });

    var d = { P: triangleDAngles(rnd, deg), connus: connus, cherche: i,
              droit: null, cotes: [], vraies: deg };
    return question(d, [
      RAPPEL,
      'On connaît deux angles : ' + chapeau(autres[0]) + ' = ' + deg[autres[0]] + '° et ' +
        chapeau(autres[1]) + ' = ' + deg[autres[1]] + '°. Leur somme vaut ' +
        deg[autres[0]] + ' + ' + deg[autres[1]] + ' = <b>' +
        (deg[autres[0]] + deg[autres[1]]) + '°</b>.',
      'Il reste donc pour ' + chapeau(i) + ' : \\(180 - ' +
        (deg[autres[0]] + deg[autres[1]]) + ' = <b>' + deg[i] + '</b>\\), soit <b>' +
        deg[i] + '°</b>.',
      'Pour vérifier : ' + deg[0] + ' + ' + deg[1] + ' + ' + deg[2] + ' = 180 ✓.'
    ], ['La somme des trois angles fait 180°.',
        'Additionne les deux angles connus, puis retire le résultat de 180.'], 110);
  }

  /* ===================================================================== */
  /* 2. Triangle rectangle : le carré, et un angle aigu                    */
  /* ===================================================================== */
  function qRectangle(rnd, palier) {
    var aigu;
    do { aigu = rnd.entier(20, 70); } while (aigu === 45);   // sinon il est isocèle
    var ordre = rnd.melange([0, 1, 2]);
    var iD = ordre[0], iCon = ordre[1], iCh = ordre[2];
    var deg = [];
    deg[iD] = 90; deg[iCon] = aigu; deg[iCh] = 90 - aigu;
    var connus = {}; connus[iCon] = aigu;

    var d = { P: triangleDAngles(rnd, deg), connus: connus, cherche: iCh,
              droit: iD, cotes: [], vraies: deg };
    return question(d, [
      RAPPEL,
      'Le petit carré au sommet ' + NOMS[iD] + ' signale un <b>angle droit</b> : ' +
        chapeau(iD) + ' = <b>90°</b>. C\'est une donnée de la figure, il ne faut pas ' +
        'l\'oublier dans le calcul.',
      'Donc \\(90 + ' + aigu + ' + \\widehat{' + NOMS[iCh] + '} = 180\\), d\'où ' +
        '\\(\\widehat{' + NOMS[iCh] + '} = 180 - 90 - ' + aigu + ' = <b>' + (90 - aigu) +
        '</b>\\), soit <b>' + (90 - aigu) + '°</b>.',
      '<b>À retenir.</b> Dans un triangle rectangle, les deux angles aigus font ensemble ' +
        '\\(180 - 90 = 90°\\) : ils sont <b>complémentaires</b>. On peut donc aller droit ' +
        'au but : ' + (90 - aigu) + '° = 90° − ' + aigu + '°.'
    ], ['Le petit carré vaut 90° : c\'est un angle comme les autres dans la somme.',
        'Les deux angles aigus d\'un triangle rectangle font ensemble 90°.'], 120);
  }

  /* ===================================================================== */
  /* 3. Triangle isocèle : deux côtés codés, et un angle                   */
  /* ===================================================================== */
  /* Le sommet PRINCIPAL est celui d'où partent les deux côtés égaux ; les deux
     autres sont les angles « à la base », égaux entre eux. Deux questions
     possibles, et une seule interdite : donner un angle de base et demander
     l'autre, qui se lirait sans rien calculer. */
  function qIsocele(rnd, palier) {
    var donneSommet = rnd.booleen(0.5);
    var sommet, base;
    if (donneSommet) {
      do { sommet = rnd.entier(20, 140); } while (sommet % 2 !== 0 || sommet === 60);
      base = (180 - sommet) / 2;
    } else {
      do { base = rnd.entier(25, 80); } while (base === 60 || 180 - 2 * base < 15);
      sommet = 180 - 2 * base;
    }
    var ordre = rnd.melange([0, 1, 2]);
    var iS = ordre[0], iB1 = ordre[1], iB2 = ordre[2];
    var deg = [];
    deg[iS] = sommet; deg[iB1] = base; deg[iB2] = base;

    var connus = {}, cherche;
    if (donneSommet) { connus[iS] = sommet; cherche = iB1; }
    else { connus[iB1] = base; cherche = iS; }

    // les deux côtés égaux partent du sommet principal
    var d = {
      P: triangleDAngles(rnd, deg), connus: connus, cherche: cherche, droit: null,
      cotes: [[iS, iB1, 1], [iS, iB2, 1]], vraies: deg
    };
    var lecture = 'Les deux traits sur \\([' + NOMS[iS] + NOMS[iB1] + ']\\) et \\([' +
      NOMS[iS] + NOMS[iB2] + ']\\) disent que ces côtés ont la <b>même longueur</b> : ' +
      'le triangle est <b>isocèle en ' + NOMS[iS] + '</b>. Les deux angles à la base, ' +
      chapeau(iB1) + ' et ' + chapeau(iB2) + ', sont donc <b>égaux</b>.';

    return question(d, donneSommet ? [
      RAPPEL, lecture,
      'Il reste \\(180 - ' + sommet + ' = ' + (180 - sommet) + '\\) degrés à partager en ' +
        '<b>deux parts égales</b> : \\(' + (180 - sommet) + ' \\div 2 = <b>' + base +
        '</b>\\). Donc ' + chapeau(cherche) + ' = <b>' + base + '°</b>.',
      'Vérification : ' + sommet + ' + ' + base + ' + ' + base + ' = 180 ✓.'
    ] : [
      RAPPEL, lecture,
      'On connaît donc <b>deux</b> angles, et pas un seul : ' + chapeau(iB1) + ' = ' +
        base + '° et ' + chapeau(iB2) + ' = ' + base + '° aussi, puisqu\'ils sont égaux.',
      'D\'où ' + chapeau(cherche) + ' = \\(180 - ' + base + ' - ' + base + ' = 180 - ' +
        (2 * base) + ' = <b>' + sommet + '</b>\\), soit <b>' + sommet + '°</b>.'
    ], ['Regarde les petits traits sur les côtés : que disent-ils ?',
        'Deux côtés égaux ⇒ les deux angles qui leur font face sont égaux.'], 150);
  }

  /* ===================================================================== */
  /* 4. Triangle rectangle isocèle : aucune mesure donnée                  */
  /* ===================================================================== */
  function qRectIsocele(rnd, palier) {
    var ordre = rnd.melange([0, 1, 2]);
    var iD = ordre[0], iB1 = ordre[1], iB2 = ordre[2];
    var deg = [];
    deg[iD] = 90; deg[iB1] = 45; deg[iB2] = 45;
    var cherche = rnd.booleen(0.5) ? iB1 : iB2;

    var d = { P: triangleDAngles(rnd, deg), connus: {}, cherche: cherche, droit: iD,
              cotes: [[iD, iB1, 1], [iD, iB2, 1]], vraies: deg };
    return question(d, [
      RAPPEL,
      'La figure donne <b>deux</b> renseignements, et il faut les lire tous les deux : ' +
        'le petit carré dit que ' + chapeau(iD) + ' = <b>90°</b>, et les traits sur ' +
        '\\([' + NOMS[iD] + NOMS[iB1] + ']\\) et \\([' + NOMS[iD] + NOMS[iB2] + ']\\) ' +
        'disent que ces deux côtés sont <b>égaux</b>.',
      'Le triangle est donc <b>rectangle et isocèle en ' + NOMS[iD] + '</b> : les deux ' +
        'autres angles sont égaux. Appelons \\(x\\) leur mesure commune.',
      '\\(90 + x + x = 180\\), donc \\(2x = 90\\) et \\(x = <b>45</b>\\). Les deux angles ' +
        'aigus mesurent <b>45°</b> chacun.',
      '<b>Ce triangle est toujours le même</b> : 90°, 45°, 45°. Sa forme ne dépend pas de ' +
        'sa taille — c\'est la moitié d\'un carré coupé par sa diagonale.'
    ], ['Deux choses sont codées sur la figure : le carré, et les côtés égaux.',
        'Les deux angles inconnus sont égaux : appelle-les \\(x\\) et écris la somme.'], 150);
  }

  /* ===================================================================== */
  /* 5. Triangle équilatéral : rien d'autre que le codage                  */
  /* ===================================================================== */
  function qEquilateral(rnd, palier) {
    var deg = [60, 60, 60];
    var cherche = rnd.entier(0, 2);
    var d = { P: triangleDAngles(rnd, deg), connus: {}, cherche: cherche, droit: null,
              cotes: [[0, 1, 1], [1, 2, 1], [0, 2, 1]], vraies: deg };
    return question(d, [
      RAPPEL,
      'Les <b>trois</b> côtés portent le même codage : ils ont la même longueur, le ' +
        'triangle est <b>équilatéral</b>. Ses trois angles sont donc <b>égaux</b>.',
      'Trois angles égaux dont la somme fait 180° : chacun vaut \\(180 \\div 3 = <b>60' +
        '</b>\\), soit <b>60°</b>.',
      '<b>À retenir.</b> Un triangle équilatéral a toujours trois angles de <b>60°</b>, ' +
        'quelle que soit sa taille. Aucune mesure n\'est nécessaire pour le savoir.'
    ], ['Compte les côtés qui portent le même codage.',
        'Trois angles égaux, et leur somme vaut 180°.'], 90);
  }

  /* ===================================================================== */
  /* 6. Est-ce possible ?                                                  */
  /* ===================================================================== */
  var IMPOSSIBLES = [
    { t: 'Un triangle peut avoir deux angles droits.', ok: false,
      d: 'Non : deux angles droits font déjà \\(90 + 90 = 180°\\), il ne resterait rien ' +
         'pour le troisième. Un triangle a <b>au plus un</b> angle droit.' },
    { t: 'Un triangle peut avoir deux angles obtus (plus grands que 90°).', ok: false,
      d: 'Non : leur somme dépasserait déjà 180°. Un triangle a <b>au plus un</b> angle ' +
         'obtus.' },
    { t: 'Il existe un triangle dont les angles mesurent 60°, 60° et 60°.', ok: true,
      d: 'Oui : \\(60 + 60 + 60 = 180\\). C\'est le triangle <b>équilatéral</b>.' },
    { t: 'Il existe un triangle dont les angles mesurent 100°, 50° et 40°.', ok: false,
      d: 'Non : \\(100 + 50 + 40 = 190\\), et non 180. Ce triangle ne peut pas exister.' },
    { t: 'Il existe un triangle dont les angles mesurent 90°, 45° et 45°.', ok: true,
      d: 'Oui : \\(90 + 45 + 45 = 180\\). C\'est le triangle <b>rectangle isocèle</b>.' },
    { t: 'Dans un triangle rectangle, les deux angles aigus font ensemble 90°.', ok: true,
      d: 'Oui : il reste \\(180 - 90 = 90°\\) à se partager. On dit qu\'ils sont ' +
         '<b>complémentaires</b>.' },
    { t: 'Un triangle isocèle a forcément deux angles égaux.', ok: true,
      d: 'Oui : les deux angles opposés aux côtés de même longueur sont égaux. C\'est même ' +
         'ce qui permet de trouver les deux d\'un coup.' },
    { t: 'Si un triangle a un angle de 120°, il peut aussi avoir un angle de 70°.',
      ok: false,
      d: 'Non : \\(120 + 70 = 190\\), c\'est déjà plus que 180°. Le deuxième angle doit ' +
         'être inférieur à \\(180 - 120 = 60°\\).' },
    { t: 'Deux triangles de tailles différentes peuvent avoir exactement les mêmes angles.',
      ok: true,
      d: 'Oui : agrandir un triangle ne change pas ses angles. Un petit et un grand ' +
         'triangle équilatéral ont tous les deux trois angles de 60°.' }
  ];

  function qPossible(rnd, palier) {
    var a = rnd.choix(IMPOSSIBLES);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d,
               'Le contrôle est toujours le même : les trois angles doivent faire ' +
               '<b>exactement 180°</b>, et chacun être strictement positif.'],
      indices: ['Additionne, et compare à 180.'],
      duree: 60
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'somme-angles', competence: 'somme-angles', level: '5eme',
    titre: 'La somme des angles d\'un triangle', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['quelconque', 'quelconque', 'equilateral', 'possible'] :
        palier === 2 ? ['quelconque', 'rectangle', 'equilateral', 'isocele', 'possible'] :
        palier === 3 ? ['rectangle', 'isocele', 'isocele', 'rect-isocele', 'quelconque',
                        'possible'] :
                       ['isocele', 'rect-isocele', 'rectangle', 'isocele', 'quelconque']);

      if (quoi === 'quelconque') return qQuelconque(rnd, palier);
      if (quoi === 'rectangle') return qRectangle(rnd, palier);
      if (quoi === 'isocele') return qIsocele(rnd, palier);
      if (quoi === 'rect-isocele') return qRectIsocele(rnd, palier);
      if (quoi === 'equilateral') return qEquilateral(rnd, palier);
      return qPossible(rnd, palier);
    }
  });

})();
