/*
 * perp-para — droites perpendiculaires et droites parallèles (6ème).
 *
 * Le chapitre où l'on apprend, souvent pour la première fois, à DÉDUIRE :
 * on ne regarde plus si deux droites « ont l'air » parallèles, on l'établit à
 * partir de ce qu'on sait déjà. Trois propriétés suffisent, et le générateur
 * tourne autour d'elles :
 *
 *     si (d1) ⊥ (d) et (d2) ⊥ (d)   alors (d1) ∥ (d2)
 *     si (d1) ∥ (d2) et (d) ⊥ (d1)  alors (d) ⊥ (d2)
 *     si (d1) ∥ (d) et (d2) ∥ (d)   alors (d1) ∥ (d2)
 *
 *   deduire     on donne deux informations, on demande la conclusion. Un cas
 *               sur plusieurs est un cas où l'on ne peut RIEN conclure : sans
 *               lui, l'élève apprend qu'il y a toujours une réponse ;
 *   figure      lire un codage (petits carrés, chevrons) et dire ce qui est
 *               perpendiculaire ou parallèle ;
 *   notation    les symboles ⊥ et ∥, qui s'échangent facilement ;
 *   unicite     par un point donné, combien de parallèles à une droite ? Une
 *               seule — et c'est ce qui rend la construction possible ;
 *   proprietes  vrai/faux, dont les pièges classiques.
 *
 * Ce générateur n'a pas encore de leçon associée : il se suffit à lui-même,
 * chaque correction rappelant la propriété utilisée avant de l'appliquer.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var G = GeoOutils;

  var BLEU = '#2563eb', VIOLET = '#7c3aed', VERT = '#059669';
  var D = ['(d_1)', '(d_2)', '(d_3)'];

  function m(s) { return '\\(' + s + '\\)'; }
  function dr(i) { return m(D[i]); }

  /* ===================================================================== */
  /* 1. Déduire                                                            */
  /* ===================================================================== */
  // Chaque cas : ce qu'on sait, ce qu'on peut conclure, et pourquoi.
  var CAS = [
    { su: ['perp', 'perp'], rep: 'para',
      loi: 'Si deux droites sont <b>perpendiculaires à une même droite</b>, alors elles sont ' +
           '<b>parallèles</b> entre elles.' },
    { su: ['para', 'perp'], rep: 'perp',
      loi: 'Si une droite est <b>perpendiculaire à l\'une de deux droites parallèles</b>, alors ' +
           'elle est <b>perpendiculaire à l\'autre</b>.' },
    { su: ['para', 'para'], rep: 'para',
      loi: 'Si deux droites sont <b>parallèles à une même droite</b>, alors elles sont ' +
           '<b>parallèles</b> entre elles.' },
    { su: ['secante', 'secante'], rep: 'rien',
      loi: 'Savoir que deux droites se coupent ne dit rien de leur direction : on ne peut ' +
           '<b>rien conclure</b>.' }
  ];

  var REPONSES = [
    { cle: 'para', txt: 'Elles sont parallèles' },
    { cle: 'perp', txt: 'Elles sont perpendiculaires' },
    { cle: 'rien', txt: 'On ne peut rien conclure' }
  ];

  function qDeduire(rnd, palier) {
    // Le cas « on ne peut rien conclure » n'apparaît qu'à partir du palier 2 :
    // il faut d'abord connaître les propriétés pour comprendre qu'ici il n'y en
    // a aucune qui s'applique.
    var cas = rnd.choix(palier === 1 ? CAS.slice(0, 3)
            : palier >= 3 ? CAS.concat([CAS[3]]) : CAS);
    var ordre = rnd.melange(REPONSES.slice());

    // On énonce toujours par rapport à une troisième droite, (d_3).
    var phrase = {
      perp: function (i) { return dr(i) + ' est <b>perpendiculaire</b> à ' + dr(2); },
      para: function (i) { return dr(i) + ' est <b>parallèle</b> à ' + dr(2); },
      secante: function (i) { return dr(i) + ' est <b>sécante</b> à ' + dr(2); }
    };

    return {
      enonce: 'On sait que :<br>• ' + phrase[cas.su[0]](0) + ' ;<br>• ' +
        phrase[cas.su[1]](1) + '.<br>Que peut-on dire de ' + dr(0) + ' et ' + dr(1) + ' ?',
      type: 'qcm',
      choix: ordre.map(function (r) { return r.txt; }),
      correct: ordre.map(function (r) { return r.cle; }).indexOf(cas.rep),
      etapes: [
        '<b>Propriété.</b> ' + cas.loi,
        cas.rep === 'rien'
          ? 'Ici, aucune des propriétés du cours ne s\'applique : deux droites peuvent couper ' +
            'une même droite sans avoir le moindre rapport entre elles. Elles peuvent être ' +
            'parallèles, perpendiculaires, ou ni l\'un ni l\'autre.'
          : 'Ici on applique la propriété avec ' + dr(2) + ' comme droite de référence : on ' +
            'conclut que ' + dr(0) + ' et ' + dr(1) + ' sont <b>' +
            (cas.rep === 'para' ? 'parallèles' : 'perpendiculaires') + '</b>.',
        cas.rep === 'para'
          ? 'On l\'écrit ' + m(D[0] + ' \\parallel ' + D[1]) + '.'
          : cas.rep === 'perp'
            ? 'On l\'écrit ' + m(D[0] + ' \\perp ' + D[1]) + '.'
            : 'Un dessin ne suffirait pas à trancher : il faudrait une information de plus.'
      ],
      indices: [
        'Fais un petit croquis : place d\'abord ' + dr(2) + ', puis les deux autres droites en ' +
          'respectant ce qu\'on sait.',
        'Deux droites perpendiculaires à une même droite sont parallèles ; une perpendiculaire ' +
          'à l\'une de deux parallèles est perpendiculaire à l\'autre.'
      ],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 2. Lire un codage sur une figure                                      */
  /* ===================================================================== */
  function qFigure(rnd, palier) {
    // Deux droites parallèles coupées par une troisième, perpendiculaire aux
    // deux. Le codage dit tout : deux petits carrés, ou des chevrons.
    var a = rnd.entier(-25, 25) * Math.PI / 180;         // inclinaison générale
    var u = [Math.cos(a), Math.sin(a)];                  // direction des parallèles
    var v = [-u[1], u[0]];                               // direction de la perpendiculaire
    var e = rnd.entier(3, 5);                            // écart entre les parallèles

    var p1 = [-v[0] * e / 2, -v[1] * e / 2];
    var p2 = [v[0] * e / 2, v[1] * e / 2];
    var dec = rnd.entier(-3, 3);
    var p3 = [u[0] * dec, u[1] * dec];

    var lignes = [
      { p: p1, u: u, nom: '(d₁)', couleur: BLEU },
      { p: p2, u: u, nom: '(d₂)', couleur: BLEU },
      { p: p3, u: v, nom: '(d₃)', couleur: VERT }
    ];
    // Le codage : un petit carré à chacun des deux croisements. Comme (d3) est
    // dirigée par v, elle rencontre (d1) au point p3 + ((p1 − p3)·v)·v.
    var I1 = inter(p3, v, p1), I2 = inter(p3, v, p2);
    var equerres = [{ p: I1, u: u, v: v },                  // le carré pointe vers (d2)
                    { p: I2, u: u, v: [-v[0], -v[1]] }];    // celui-ci, vers (d1)

    var ordre = rnd.melange([
      { cle: 'd1d2-para', txt: m(D[0] + ' \\parallel ' + D[1]) },
      { cle: 'd1d3-perp', txt: m(D[0] + ' \\perp ' + D[2]) },
      { cle: 'd2d3-perp', txt: m(D[1] + ' \\perp ' + D[2]) },
      { cle: 'd1d2-perp', txt: m(D[0] + ' \\perp ' + D[1]) },
      { cle: 'd1d3-para', txt: m(D[0] + ' \\parallel ' + D[2]) }
    ]);
    var justes = ['d1d2-para', 'd1d3-perp', 'd2d3-perp'];
    var corrects = [];
    ordre.forEach(function (r, i) { if (justes.indexOf(r.cle) >= 0) corrects.push(i); });

    return {
      enonce: 'Observe le <b>codage</b> de cette figure : les petits carrés signalent des ' +
        '<b>angles droits</b>.' +
        G.droitesFig({ lignes: lignes, equerres: equerres }) +
        'Coche <b>toutes</b> les affirmations vraies.',
      type: 'qcm-multi',
      choix: ordre.map(function (r) { return r.txt; }),
      corrects: corrects,
      etapes: [
        'Les deux petits carrés disent que ' + dr(2) + ' est <b>perpendiculaire</b> à ' + dr(0) +
          ' et à ' + dr(1) + '.',
        '<b>Propriété.</b> Si deux droites sont perpendiculaires à une même droite, alors elles ' +
          'sont <b>parallèles</b> entre elles. Donc ' + m(D[0] + ' \\parallel ' + D[1]) + '.',
        '✘ ' + m(D[0] + ' \\perp ' + D[1]) + ' est faux : elles sont parallèles, elles ne se ' +
          'coupent même pas.',
        '✘ ' + m(D[0] + ' \\parallel ' + D[2]) + ' est faux : ' + dr(0) + ' et ' + dr(2) +
          ' se coupent, et à angle droit.'
      ],
      indices: ['Commence par les petits carrés : ils donnent deux affirmations directement.',
                'Ensuite, sers-toi de la propriété : deux droites perpendiculaires à une même ' +
                  'droite sont parallèles.'],
      duree: 75
    };
  }
  // L'intersection de la droite (q ; v) avec la droite passant par p et
  // PERPENDICULAIRE à v : c'est le projeté de p, et v est unitaire ici.
  function inter(q, v, p) {
    var t = (p[0] - q[0]) * v[0] + (p[1] - q[1]) * v[1];
    return [q[0] + v[0] * t, q[1] + v[1] * t];
  }

  /* ===================================================================== */
  /* 3. La notation                                                        */
  /* ===================================================================== */
  function qNotation(rnd, palier) {
    var perp = rnd.booleen(0.5);
    var prop = rnd.melange([
      { cle: 'perp', txt: m(D[0] + ' \\perp ' + D[1]) },
      { cle: 'para', txt: m(D[0] + ' \\parallel ' + D[1]) },
      { cle: 'egal', txt: m(D[0] + ' = ' + D[1]) },
      { cle: 'appart', txt: m(D[0] + ' \\in ' + D[1]) }
    ]);
    return {
      enonce: 'Comment écrit-on, en langage mathématique, que ' + dr(0) + ' est ' +
        (perp ? '<b>perpendiculaire</b>' : '<b>parallèle</b>') + ' à ' + dr(1) + ' ?',
      type: 'qcm',
      choix: prop.map(function (p) { return p.txt; }),
      correct: prop.map(function (p) { return p.cle; }).indexOf(perp ? 'perp' : 'para'),
      etapes: [
        'Le symbole ' + m('\\perp') + ' se lit « est <b>perpendiculaire</b> à » : il ressemble ' +
          'à deux traits qui se coupent à angle droit.',
        'Le symbole ' + m('\\parallel') + ' se lit « est <b>parallèle</b> à » : ce sont deux ' +
          'traits qui ne se rencontrent jamais.',
        'Ici, la bonne écriture est ' +
          m(D[0] + (perp ? ' \\perp ' : ' \\parallel ') + D[1]) + '.',
        '✘ ' + m(D[0] + ' = ' + D[1]) + ' voudrait dire que c\'est la <b>même</b> droite, et ' +
          m(D[0] + ' \\in ' + D[1]) + ' se lit « appartient à », ce qui ne s\'emploie que pour ' +
          'un <b>point</b>.'
      ],
      indices: ['Regarde la forme du symbole : deux traits qui se coupent, ou deux traits qui ' +
                'restent côte à côte ?'],
      duree: 30
    };
  }

  /* ===================================================================== */
  /* 4. Combien y en a-t-il ?                                              */
  /* ===================================================================== */
  function qUnicite(rnd, palier) {
    var para = rnd.booleen(0.5);
    var prop = rnd.melange([
      { cle: 'une', txt: 'Une seule' },
      { cle: 'deux', txt: 'Exactement deux' },
      { cle: 'infini', txt: 'Une infinité' },
      { cle: 'aucune', txt: 'Aucune' }
    ]);
    return {
      enonce: 'Soit une droite ' + dr(0) + ' et un point ' + m('A') + ' qui n\'est pas sur ' +
        dr(0) + '.<br>Combien peut-on tracer de droites passant par ' + m('A') + ' et ' +
        (para ? '<b>parallèles</b>' : '<b>perpendiculaires</b>') + ' à ' + dr(0) + ' ?',
      type: 'qcm',
      choix: prop.map(function (p) { return p.txt; }),
      correct: prop.map(function (p) { return p.cle; }).indexOf('une'),
      etapes: [
        'Par un point donné, il passe <b>une seule</b> droite ' +
          (para ? 'parallèle' : 'perpendiculaire') + ' à une droite donnée.',
        para
          ? 'Si on en traçait deux, elles passeraient toutes les deux par ' + m('A') + ' — elles ' +
            'se couperaient donc — tout en étant parallèles à ' + dr(0) + ', donc parallèles ' +
            'entre elles. C\'est impossible.'
          : 'C\'est ce qui rend la construction possible à l\'équerre : on pose l\'équerre sur ' +
            dr(0) + ', on la fait glisser jusqu\'à ' + m('A') + ', et il n\'y a qu\'un seul ' +
            'trait à tracer.',
        'Cette unicité est ce qui permet de parler de <b>la</b> parallèle et de <b>la</b> ' +
          'perpendiculaire à ' + dr(0) + ' passant par ' + m('A') + '.'
      ],
      indices: ['Essaie d\'en tracer deux différentes : que se passerait-il ?'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 5. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Deux droites <b>perpendiculaires à une même droite</b> sont parallèles entre elles.',
      ok: true, d: 'C\'est l\'une des trois propriétés du cours.' },
    { t: 'Deux droites <b>parallèles à une même droite</b> sont parallèles entre elles.',
      ok: true, d: 'C\'est une autre des trois propriétés.' },
    { t: 'Deux droites <b>perpendiculaires à une même droite</b> sont perpendiculaires entre ' +
         'elles.', ok: false,
      d: 'Non : elles sont <b>parallèles</b>. Fais le croquis : deux traits verticaux posés sur ' +
         'un même trait horizontal ne se rencontrent jamais.' },
    { t: 'Si ' + m('(d_1) \\parallel (d_2)') + ' et ' + m('(d_3) \\perp (d_1)') + ', alors ' +
         m('(d_3) \\perp (d_2)') + '.', ok: true,
      d: 'Oui : une droite perpendiculaire à l\'une de deux parallèles est perpendiculaire à ' +
         'l\'autre.' },
    { t: 'Deux droites qui ne se coupent pas sur la feuille sont forcément parallèles.',
      ok: false,
      d: 'Non : elles peuvent se couper <b>en dehors</b> de la feuille. Deux droites sont ' +
         'parallèles quand elles ne se coupent <b>jamais</b>, même prolongées à l\'infini — et ' +
         'c\'est pour cela qu\'on le démontre au lieu de le regarder.' },
    { t: 'Deux droites parallèles restent toujours à la <b>même distance</b> l\'une de l\'autre.',
      ok: true, d: 'Oui, c\'est une autre façon de les décrire — comme deux rails.' },
    { t: 'Une droite est parallèle à <b>elle-même</b>.', ok: true,
      d: 'Oui, par convention : c\'est pratique, et ça évite d\'avoir à écarter ce cas dans les ' +
         'propriétés.' },
    { t: 'Si deux droites se coupent, alors elles sont perpendiculaires.', ok: false,
      d: 'Non : deux droites qui se coupent sont <b>sécantes</b>. Elles ne sont ' +
         '<b>perpendiculaires</b> que si elles forment un <b>angle droit</b>.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['En cas de doute, fais un croquis rapide : place la droite de référence, puis ' +
                'les deux autres.'],
      duree: 35
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'perp-para', competence: 'perp-para', level: '6eme',
    titre: 'Droites perpendiculaires et parallèles', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['notation', 'notation', 'deduire', 'proprietes'] :
        palier === 2 ? ['deduire', 'deduire', 'notation', 'unicite', 'proprietes'] :
        palier === 3 ? ['deduire', 'deduire', 'figure', 'unicite', 'proprietes'] :
                       ['deduire', 'figure', 'figure', 'unicite', 'proprietes', 'proprietes']);

      if (quoi === 'figure') return qFigure(rnd, palier);
      if (quoi === 'notation') return qNotation(rnd, palier);
      if (quoi === 'unicite') return qUnicite(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qDeduire(rnd, palier);
    }
  });

})();
