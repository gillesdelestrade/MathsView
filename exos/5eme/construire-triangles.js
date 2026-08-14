/*
 * construire-triangles — construire un triangle à partir de trois données
 * (5ème, leçon « Construire un triangle »).
 *
 * ---------------------------------------------------------------------------
 * On construit vraiment, puis on mesure ce qu'on a construit
 * ---------------------------------------------------------------------------
 * Le côté [AB] est déjà tracé — c'est toujours par lui qu'on commence, et le
 * poser à la souris n'apprendrait rien. À l'élève de trouver le troisième
 * sommet avec les instruments, exactement comme sur son cahier :
 *
 *   trois longueurs            deux arcs de compas, leur croisement est C ;
 *   deux longueurs et l'angle  le rapporteur ouvre l'angle, le compas reporte
 *   entre elles                la longueur sur la demi-droite ;
 *   une longueur et les deux   deux coups de rapporteur, les demi-droites se
 *   angles adjacents           coupent en C.
 *
 * La question porte ensuite sur ce qui a été construit : une longueur qu'on
 * relève à la règle, un angle qu'on lit au rapporteur. Les deux instruments
 * affichent leur mesure pendant qu'on tire — ils servent donc aussi bien à
 * tracer qu'à mesurer, comme les vrais.
 *
 * ---------------------------------------------------------------------------
 * Une mesure n'est pas un calcul : la réponse est tolérante
 * ---------------------------------------------------------------------------
 * Une longueur relevée sur une figure ne tombe jamais au millimètre exact.
 * Ces questions-là déclarent donc une `tolerance` — deux degrés pour un angle,
 * deux millimètres pour une longueur. C'est assez large pour qu'une
 * construction soignée passe, assez serré pour qu'une construction fausse ne
 * passe pas : les mauvaises réponses typiques (confondre deux côtés, lire le
 * mauvais angle) en sont toujours à plus de dix degrés.
 *
 * Les questions qui relèvent du RAISONNEMENT — le troisième angle, l'inégalité
 * triangulaire — restent exactes : il n'y a rien à mesurer, tout se déduit.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var RAD = Math.PI / 180;
  function fr(v) { return O.fr(Math.round(v * 10) / 10); }
  function deg(v) { return Math.round(v); }

  /* ===================================================================== */
  /* Les données, et le triangle qu'elles décrivent                        */
  /* ===================================================================== */
  /* Comme dans la leçon : A à l'origine, B sur l'horizontale, C au-dessus.
     Le triangle est CALCULÉ à partir des données — jamais l'inverse. */
  function sommetC(d) {
    if (d.type === 'lll') {
      var x = (d.b * d.b - d.a * d.a + d.c * d.c) / (2 * d.c);
      var h2 = d.b * d.b - x * x;
      if (h2 <= 0) return null;
      return [x, Math.sqrt(h2)];
    }
    if (d.type === 'lal') {
      return [Math.cos(d.alpha * RAD) * d.b, Math.sin(d.alpha * RAD) * d.b];
    }
    if (d.alpha + d.beta >= 180) return null;
    var t = Math.tan(d.alpha * RAD), u = Math.tan(d.beta * RAD);
    var xx = u * d.c / (t + u);
    return [xx, t * xx];
  }
  function mesures(d) {
    var A = [0, 0], B = [d.c, 0], C = sommetC(d);
    if (!C) return null;
    function di(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
    function an(s, u, v) {
      var p = [u[0] - s[0], u[1] - s[1]], q = [v[0] - s[0], v[1] - s[1]];
      var k = (p[0] * q[0] + p[1] * q[1]) / (Math.hypot(p[0], p[1]) * Math.hypot(q[0], q[1]));
      return Math.acos(Math.max(-1, Math.min(1, k))) / RAD;
    }
    return { A: A, B: B, C: C,
             AB: d.c, AC: di(A, C), BC: di(B, C),
             angA: an(A, B, C), angB: an(B, A, C), angC: an(C, A, B) };
  }

  /* La figure de départ : le premier côté, déjà tracé. */
  function figure(d, outils) {
    var A = [0, 0], B = [d.c, 0];
    return MathsInstruments.figure({
      points: [{ nom: 'A', p: A, offset: [-16, -14] },
               { nom: 'B', p: B, offset: [12, -14] }],
      traits: [[A, B]]
    }, { outils: outils });
  }
  function cadre() {
    // 1 unité = 1 cm ; on laisse de la place au-dessus pour la construction
    return { boundingbox: [-2.5, 9.5, 13.5, -2.5], keepaspectratio: true };
  }
  function rappelDonnees(d) {
    if (d.type === 'lll') {
      return '\\(AB = ' + fr(d.c) + '\\) cm, \\(AC = ' + fr(d.b) + '\\) cm et \\(BC = ' +
             fr(d.a) + '\\) cm';
    }
    if (d.type === 'lal') {
      return '\\(AB = ' + fr(d.c) + '\\) cm, \\(\\widehat{A} = ' + deg(d.alpha) +
             '°\\) et \\(AC = ' + fr(d.b) + '\\) cm';
    }
    return '\\(AB = ' + fr(d.c) + '\\) cm, \\(\\widehat{A} = ' + deg(d.alpha) +
           '°\\) et \\(\\widehat{B} = ' + deg(d.beta) + '°\\)';
  }
  function commentFaire(d) {
    if (d.type === 'lll') {
      return 'Trace l\'arc de centre \\(A\\) et de rayon ' + fr(d.b) + ' cm, puis l\'arc de ' +
             'centre \\(B\\) et de rayon ' + fr(d.a) + ' cm : ils se croisent en \\(C\\).';
    }
    if (d.type === 'lal') {
      return 'Ouvre un angle de ' + deg(d.alpha) + '° en \\(A\\) au rapporteur, puis reporte ' +
             fr(d.b) + ' cm au compas depuis \\(A\\) sur cette demi-droite : c\'est \\(C\\).';
    }
    return 'Ouvre un angle de ' + deg(d.alpha) + '° en \\(A\\) et un angle de ' + deg(d.beta) +
           '° en \\(B\\) au rapporteur : les deux demi-droites se coupent en \\(C\\).';
  }

  /* -- des données qui donnent un triangle bien proportionné ------------ */
  /* Le sommet C doit tomber DANS le cadre, et pas au ras du bord : un point
     hors champ ne peut pas être accroché, et la construction devient
     infaisable — même si les nombres, eux, sont irréprochables. */
  function dansLeCadre(d) {
    var C = sommetC(d);
    return !!C && C[0] > -1.2 && C[0] < 12.2 && C[1] > 1.5 && C[1] < 8.6;
  }
  function tireLLL(rnd) {
    var c, b, a, m;
    for (var i = 0; i < 200; i++) {
      c = rnd.entier(10, 16) / 2;              // le côté déjà tracé
      b = rnd.entier(6, 15) / 2;
      a = rnd.entier(6, 15) / 2;
      if (b + a <= c + 0.6 || c + a <= b + 0.6 || c + b <= a + 0.6) continue;
      m = mesures({ type: 'lll', c: c, b: b, a: a });
      // un triangle trop plat ne se construit pas proprement : les arcs se
      // croisent sous un angle rasant et le point est illisible
      if (!m || m.C[1] < 1.6) continue;
      if (Math.min(m.angA, m.angB, m.angC) < 22) continue;
      if (!dansLeCadre({ type: 'lll', c: c, b: b, a: a })) continue;
      return { type: 'lll', c: c, b: b, a: a };
    }
    return { type: 'lll', c: 7, b: 5, a: 4 };
  }
  function tireLAL(rnd) {
    var d;
    for (var i = 0; i < 200; i++) {
      d = { type: 'lal', c: rnd.entier(10, 16) / 2, alpha: rnd.entier(5, 22) * 5,
            b: rnd.entier(6, 15) / 2 };
      if (dansLeCadre(d)) return d;
    }
    return { type: 'lal', c: 7, alpha: 50, b: 5 };
  }
  function tireALA(rnd) {
    var d;
    for (var i = 0; i < 200; i++) {
      var al = rnd.entier(5, 16) * 5, be = rnd.entier(5, 16) * 5;
      if (al + be > 145 || al + be < 55) continue;
      d = { type: 'ala', c: rnd.entier(10, 16) / 2, alpha: al, beta: be };
      if (dansLeCadre(d)) return d;
    }
    return { type: 'ala', c: 7, alpha: 50, beta: 65 };
  }

  /* ===================================================================== */
  /* 1. Construire, puis mesurer                                           */
  /* ===================================================================== */
  function qMesure(rnd, palier) {
    var d = palier <= 1 ? tireLLL(rnd)
          : rnd.choix([tireLLL, tireLAL, tireALA])(rnd);
    var m = mesures(d);

    /* Ce qu'on demande est toujours une donnée qui MANQUE : sinon il suffirait
       de recopier l'énoncé au lieu de construire. */
    var possibles = [];
    if (d.type === 'lll') {
      possibles = [{ q: 'angle', k: 'A', v: m.angA }, { q: 'angle', k: 'B', v: m.angB },
                   { q: 'angle', k: 'C', v: m.angC }];
    } else if (d.type === 'lal') {
      possibles = [{ q: 'longueur', k: 'BC', v: m.BC }, { q: 'angle', k: 'B', v: m.angB }];
    } else {
      possibles = [{ q: 'longueur', k: 'AC', v: m.AC }, { q: 'longueur', k: 'BC', v: m.BC }];
    }
    var cible = rnd.choix(possibles);
    var estAngle = cible.q === 'angle';
    var outils = d.type === 'lll' ? ['compas', 'regle', 'rapporteur']
                                  : ['rapporteur', 'compas', 'regle'];

    return {
      enonce: 'Construis le triangle \\(ABC\\) tel que ' + rappelDonnees(d) + '.<br>' +
        'Le côté \\([AB]\\) est déjà tracé — place le point \\(C\\) avec les ' +
        'instruments.<br><b>' + (estAngle
          ? 'Quelle est alors la mesure de l\'angle \\(\\widehat{' + cible.k + '}\\), ' +
            'en degrés ?'
          : 'Quelle est alors la longueur \\(' + cible.k + '\\), en cm ?') + '</b>',
      type: 'nombre',
      figure: figure(d, outils),
      board: cadre(),
      consigneFig: estAngle
        ? 'Le rapporteur affiche la mesure pendant que tu tournes : pose-le sur le sommet, ' +
          'pars le long d\'un côté, et lis.'
        : 'La règle affiche la longueur pendant que tu tires : va d\'un point à l\'autre et lis.',
      reponse: Math.round(cible.v * 10) / 10,
      tolerance: estAngle ? 2 : 0.2,
      etapes: [
        '<b>La construction.</b> ' + commentFaire(d),
        '<b>La mesure.</b> Une fois \\(C\\) placé, on ' + (estAngle
          ? 'pose le rapporteur sur le sommet \\(' + cible.k + '\\), on aligne son zéro sur ' +
            'un côté, et on lit : environ <b>' + deg(cible.v) + '°</b>.'
          : 'relève la distance à la règle : environ <b>' + fr(cible.v) + ' cm</b>.'),
        'Le triangle construit mesure \\(AB = ' + fr(m.AB) + '\\) cm, \\(AC = ' + fr(m.AC) +
          '\\) cm, \\(BC = ' + fr(m.BC) + '\\) cm, et ses angles ' + deg(m.angA) + '°, ' +
          deg(m.angB) + '° et ' + deg(m.angC) + '°. Les trois données de départ s\'y ' +
          'retrouvent bien.',
        '<b>Une mesure n\'est pas un calcul</b> : à ' + (estAngle ? 'deux degrés' :
          'deux millimètres') + ' près, ta réponse est acceptée. Ce qui compte est que la ' +
          'construction soit juste.'
      ],
      indices: [commentFaire(d),
                estAngle ? 'Le rapporteur part d\'un côté déjà tracé : c\'est son zéro.'
                         : 'La règle affiche la longueur pendant que tu tires.'],
      duree: 300
    };
  }

  /* ===================================================================== */
  /* 2. Ce triangle existe-t-il ?                                          */
  /* ===================================================================== */
  function qConstructible(rnd, palier) {
    var possible = rnd.booleen(0.5);
    var c, b, a;
    if (possible) {
      do {
        c = rnd.entier(6, 16) / 2; b = rnd.entier(4, 15) / 2; a = rnd.entier(4, 15) / 2;
      } while (b + a <= c + 0.4 || c + a <= b + 0.4 || c + b <= a + 0.4);
    } else {
      // un côté qui dépasse à lui seul la somme des deux autres
      b = rnd.entier(4, 12) / 2; a = rnd.entier(4, 12) / 2;
      c = b + a + rnd.entier(0, 5) / 2;         // 0 : le cas limite, plat
    }
    var vraiment = b + a > c && c + a > b && c + b > a;
    var mauvais = [{ n: 'AB', v: c, s: b + a }, { n: 'AC', v: b, s: c + a },
                   { n: 'BC', v: a, s: c + b }].filter(function (x) { return x.v >= x.s; })[0];

    return {
      enonce: 'Vrai ou faux ?<br>Il existe un triangle \\(ABC\\) tel que \\(AB = ' + fr(c) +
        '\\) cm, \\(AC = ' + fr(b) + '\\) cm et \\(BC = ' + fr(a) + '\\) cm.',
      type: 'vraifaux',
      correct: vraiment ? 0 : 1,
      etapes: vraiment
        ? ['<b>Vrai.</b> On vérifie que chaque côté est plus court que la somme des deux ' +
             'autres : ' + fr(c) + ' &lt; ' + fr(b) + ' + ' + fr(a) + ' = ' + fr(b + a) +
             ', ' + fr(b) + ' &lt; ' + fr(c + a) + ' et ' + fr(a) + ' &lt; ' + fr(c + b) +
             '. Les deux arcs de compas se croisent : le triangle existe.',
           'Il suffit d\'ailleurs de vérifier pour le <b>plus grand</b> côté : si lui passe, ' +
             'les deux autres passent forcément.']
        : ['<b>Faux.</b> Le côté <b>' + mauvais.n + '</b> mesure ' + fr(mauvais.v) +
             ' cm, et les deux autres réunis n\'en font que ' + fr(mauvais.s) + '. ' +
             (mauvais.v === mauvais.s
               ? 'Les deux arcs se touchent tout juste, en un point de \\([AB]\\) : les ' +
                 'trois sommets seraient alignés, il n\'y a pas de triangle.'
               : 'Les deux arcs ne se croisent jamais.'),
           '<b>L\'inégalité triangulaire.</b> Dans un triangle, chaque côté est plus court ' +
             'que la somme des deux autres — le chemin direct est toujours le plus court.'],
      indices: ['Compare le plus grand côté à la somme des deux autres.',
                'Deux arcs de compas ne se croisent que si leurs rayons sont assez grands.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 3. Le troisième angle : rien à mesurer                                */
  /* ===================================================================== */
  function qTroisieme(rnd, palier) {
    var d = tireALA(rnd);
    var troisieme = 180 - d.alpha - d.beta;
    return {
      enonce: 'On veut construire le triangle \\(ABC\\) tel que ' + rappelDonnees(d) + '.<br>' +
        '<b>Sans rien construire : quelle sera la mesure de l\'angle \\(\\widehat{C}\\), ' +
        'en degrés ?</b>',
      type: 'nombre',
      reponse: troisieme,
      etapes: [
        'Les trois angles d\'un triangle font <b>180°</b> à eux trois.',
        'Les deux angles connus font ' + deg(d.alpha) + ' + ' + deg(d.beta) + ' = <b>' +
          deg(d.alpha + d.beta) + '°</b>.',
        'Il reste donc \\(180 - ' + deg(d.alpha + d.beta) + ' = <b>' + troisieme +
          '</b>\\), soit <b>' + troisieme + '°</b>.',
        'Ici il n\'y a <b>rien à mesurer</b> : le troisième angle se déduit des deux autres. ' +
          'La construction ne servirait qu\'à le vérifier.'
      ],
      indices: ['La somme des angles d\'un triangle vaut 180°.',
                'Additionne les deux angles connus, puis retire de 180.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 4. Par quoi commencer ?                                               */
  /* ===================================================================== */
  function qProgramme(rnd, palier) {
    var d = rnd.choix([tireLLL, tireLAL, tireALA])(rnd);
    var bonnes = {
      lll: 'Tracer l\'arc de centre A et de rayon ' + fr(d.b) + ' cm, puis l\'arc de centre ' +
           'B et de rayon ' + fr(d.a) + ' cm.',
      lal: 'Ouvrir un angle de ' + deg(d.alpha) + '° en A au rapporteur, puis reporter ' +
           fr(d.b) + ' cm au compas sur la demi-droite.',
      ala: 'Ouvrir un angle de ' + deg(d.alpha) + '° en A et un angle de ' + deg(d.beta) +
           '° en B au rapporteur.'
    };
    var fausses = {
      lll: ['Ouvrir un angle de 60° en A au rapporteur.',
            'Tracer l\'arc de centre A et de rayon ' + fr(d.a) + ' cm, puis l\'arc de centre ' +
              'B et de rayon ' + fr(d.b) + ' cm.',
            'Placer C au milieu de [AB], puis mesurer.'],
      lal: ['Tracer deux arcs de compas depuis A et B.',
            'Reporter ' + fr(d.b) + ' cm au compas depuis B.',
            'Ouvrir un angle de ' + deg(d.alpha) + '° en B au rapporteur.'],
      ala: ['Tracer deux arcs de compas depuis A et B.',
            'Ouvrir les deux angles en A, l\'un après l\'autre.',
            'Reporter ' + fr(d.c) + ' cm au compas depuis A.']
    };
    /* Quand deux longueurs sont égales, « échanger les rayons » redonne la
       bonne réponse : la proposition disparaît d'elle-même plutôt que de
       figurer deux fois. */
    var vues = {};
    vues[bonnes[d.type]] = 1;
    var props = [{ t: bonnes[d.type], bon: true }];
    fausses[d.type].forEach(function (t) {
      if (vues[t]) return;
      vues[t] = 1;
      props.push({ t: t, bon: false });
    });
    if (props.length < 3) return qMesure(rnd, palier);
    props = rnd.melange(props);

    return {
      enonce: 'Le côté \\([AB]\\) est tracé. On veut le triangle \\(ABC\\) tel que ' +
        rappelDonnees(d) + '.<br><b>Que fait-on ensuite ?</b>',
      type: 'qcm',
      choix: props.map(function (p) { return p.t; }),
      correct: props.map(function (p) { return p.bon; }).indexOf(true),
      etapes: [
        '<b>' + commentFaire(d) + '</b>',
        d.type === 'lll'
          ? 'Attention à ne pas échanger les rayons : l\'arc centré sur \\(A\\) a pour rayon ' +
            '\\(AC\\), pas \\(BC\\). Chaque arc porte la longueur qui part de SON centre.'
          : d.type === 'lal'
            ? 'L\'angle donné est en \\(A\\), <b>entre</b> les deux côtés \\([AB]\\) et ' +
              '\\([AC]\\) : c\'est donc en \\(A\\) qu\'on pose le rapporteur, et c\'est ' +
              'depuis \\(A\\) qu\'on reporte la longueur.'
            : 'Les deux angles sont <b>adjacents</b> au côté connu : un à chaque extrémité. ' +
              'Les ouvrir tous les deux au même sommet ne construirait rien.'
      ],
      indices: ['Regarde où se trouve chaque donnée : à quel sommet, entre quels côtés.',
                'Un arc centré sur un sommet a pour rayon une longueur qui part de ce sommet.'],
      duree: 120
    };
  }

  /* ===================================================================== */
  /* 5. Ces données suffisent-elles ?                                      */
  /* ===================================================================== */
  var SUFFISENT = [
    { t: 'Connaître les <b>trois longueurs</b> des côtés suffit à construire le triangle.',
      ok: true,
      d: 'Oui — à condition qu\'elles vérifient l\'inégalité triangulaire. Deux arcs de ' +
         'compas donnent alors le troisième sommet, et tous les triangles obtenus sont ' +
         'superposables.' },
    { t: 'Connaître les <b>trois angles</b> suffit à construire le triangle.', ok: false,
      d: 'Non : les trois angles fixent la <b>forme</b>, pas la <b>taille</b>. On peut en ' +
         'construire une infinité, tous de tailles différentes. Il faut au moins une ' +
         'longueur.' },
    { t: 'Connaître <b>deux longueurs et l\'angle entre elles</b> suffit.', ok: true,
      d: 'Oui : on trace un côté, on ouvre l\'angle au rapporteur, on reporte la seconde ' +
         'longueur au compas. Le troisième sommet est fixé.' },
    { t: 'Connaître <b>une longueur et les deux angles à ses extrémités</b> suffit.',
      ok: true,
      d: 'Oui, si les deux angles font moins de 180° : les deux demi-droites se coupent en ' +
         'un seul point.' },
    { t: 'Connaître seulement <b>deux longueurs</b> suffit.', ok: false,
      d: 'Non : il manque une troisième donnée. Le troisième sommet peut se placer partout ' +
         'sur un arc de cercle, et on obtient une infinité de triangles différents.' },
    { t: 'Si les deux angles donnés font ensemble <b>180°</b>, on peut quand même ' +
         'construire le triangle.', ok: false,
      d: 'Non : il ne resterait rien pour le troisième angle. Les deux demi-droites sont ' +
         'parallèles et ne se coupent jamais.' },
    { t: 'Deux élèves qui construisent le triangle de côtés 5 cm, 6 cm et 7 cm obtiennent ' +
         'des triangles <b>superposables</b>.', ok: true,
      d: 'Oui : les trois longueurs déterminent le triangle. Il peut être posé autrement ' +
         'sur la feuille, ou retourné, mais c\'est le même triangle.' }
  ];

  function qDonnees(rnd, palier) {
    var a = rnd.choix(SUFFISENT);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d,
               'Il faut <b>trois</b> données, et il faut qu\'au moins une soit une ' +
               '<b>longueur</b> : sans elle, la taille du triangle reste libre.'],
      indices: ['Trois données bien choisies suffisent — mais lesquelles ?'],
      duree: 70
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'construire-triangles', competence: 'construire-triangles', level: '5eme',
    titre: 'Construire un triangle', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['donnees', 'constructible', 'mesure', 'programme'] :
        palier === 2 ? ['constructible', 'mesure', 'programme', 'troisieme', 'donnees'] :
        palier === 3 ? ['mesure', 'mesure', 'programme', 'troisieme', 'constructible'] :
                       ['mesure', 'mesure', 'mesure', 'programme', 'troisieme']);

      if (quoi === 'donnees') return qDonnees(rnd, palier);
      if (quoi === 'constructible') return qConstructible(rnd, palier);
      if (quoi === 'troisieme') return qTroisieme(rnd, palier);
      if (quoi === 'programme') return qProgramme(rnd, palier);
      return qMesure(rnd, palier);
    }
  });

})();
