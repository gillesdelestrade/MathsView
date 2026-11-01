/*
 * angle-inscrit — angle inscrit et angle au centre (2nde, leçon « Angle
 * inscrit et angle au centre »).
 *
 * Sept familles, qui suivent la leçon dans l'ordre :
 *   — ASSOCIER (palier 1-2) : la figure montre O, A, B et M. Quel angle au
 *     centre intercepte le même arc que l'angle inscrit AMB (ou l'inverse) ?
 *     C'est le vocabulaire : le sommet sur le cercle, le sommet au centre, et
 *     l'arc commun ;
 *   — DU CENTRE À L'INSCRIT et DE L'INSCRIT AU CENTRE (palier 1-2) : une
 *     mesure est écrite sur la figure, l'autre est demandée. Le double, ou la
 *     moitié. Au palier 1 l'angle au centre est pair (la moitié tombe sur un
 *     entier) ; ensuite il peut être impair, la réponse est alors en demi ;
 *   — MÊME ARC (palier 2-3) : M et N sur le même arc, AMB est donné, on
 *     cherche ANB. Il est égal — le piège est de le doubler ;
 *   — RENTRANT (palier 3-4) : M est sur le PETIT arc. L'angle inscrit
 *     intercepte le grand arc, donc l'angle au centre à prendre est le
 *     rentrant, 360 − AOB. Soit on donne AOB (saillant) et on cherche AMB,
 *     soit on donne AMB (obtus) et on cherche AOB saillant ou rentrant ;
 *   — ISOCÈLE (palier 3-4) : OA = OB, le triangle OAB est isocèle. AMB donné,
 *     on cherche OAB = (180 − 2·AMB)/2 = 90 − AMB ; au palier 4, l'inverse ;
 *   — OPPOSÉS (palier 4) : M et N de part et d'autre de [AB]. AMB donné,
 *     ANB = 180 − AMB : les deux angles au centre font 360° à eux deux.
 *   Le cas du diamètre (AOB = 180°, AMB = 90°) se glisse dans « du centre à
 *   l'inscrit » au palier 3.
 *
 * La figure est un SVG maison : un cercle, des points nommés, des segments,
 * l'arc intercepté en rouge, des marques d'angle (qui peuvent dépasser 180°).
 * Chaque point porte son nom en `data-nom`, le cercle sa classe « cercle »,
 * chaque mesure écrite est un `text` près de son sommet : le contrôle relit
 * les positions, remesure les angles dessinés et recalcule chaque réponse.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var INK = '#334155', BLEU = '#1d4ed8', AMBRE = '#d97706', ROUGE = '#dc2626', VIOLET = '#7c3aed';
  var DEG = Math.PI / 180;

  /* ===================================================================== */
  /* Un peu de géométrie                                                   */
  /* ===================================================================== */
  function pt(deg) { return [Math.cos(deg * DEG), Math.sin(deg * DEG)]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function len(a) { return Math.hypot(a[0], a[1]); }
  function unit(a) { var n = len(a); return n < 1e-9 ? [1, 0] : [a[0] / n, a[1] / n]; }
  function mod360(x) { x = x % 360; if (x < 0) x += 360; return x; }
  function rot(u, deg) { var c = Math.cos(deg * DEG), sn = Math.sin(deg * DEG); return [u[0] * c - u[1] * sn, u[0] * sn + u[1] * c]; }
  // Le balayage d (radians, signé) depuis le cap a1 contient-il la direction du point E vu de V ?
  function contient(V, a1, d, E) {
    var e = Math.atan2(E[1] - V[1], E[0] - V[0]) - a1;
    e = ((e % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    if (d < 0) e = e === 0 ? 0 : 2 * Math.PI - e;
    return e < Math.abs(d);
  }
  function grandCote(d) { return d - (d > 0 ? 2 : -2) * Math.PI; }
  // Le plus court chemin angulaire de [VP) à [VQ), signé, en radians.
  function balayage(V, P, Q) {
    var u = unit(sub(P, V)), w = unit(sub(Q, V));
    var d = Math.atan2(w[1], w[0]) - Math.atan2(u[1], u[0]);
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return d;
  }

  /* ===================================================================== */
  /* Le dessin                                                             */
  /* ===================================================================== */
  var W = 340, H = 300, K = 108;
  function r1(v) { return Math.round(v * 10) / 10; }
  function X(p) { return r1(W / 2 + p[0] * K); }
  function Y(p) { return r1(H / 2 - p[1] * K); }
  function texte(x, y, t, col, taille) {
    return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + (taille || 16) +
           '" font-weight="700" font-family="system-ui, sans-serif" fill="' + col +
           '" stroke="#fff" stroke-width="3.5" paint-order="stroke" text-anchor="middle">' +
           t + '</text>';
  }
  function cheminArc(cx, cy, r, a1, d, n) {
    var pts = [];
    for (var k = 0; k <= n; k++) {
      var a = a1 + d * k / n;
      pts.push(X([cx + r * Math.cos(a), cy + r * Math.sin(a)]) + ',' + Y([cx + r * Math.cos(a), cy + r * Math.sin(a)]));
    }
    return pts.join(' ');
  }
  /*
   * o = {
   *   points   : [{ p, nom, couleur, dir }]       dir : direction du nom (unitaire)
   *   segments : [{ de, a, couleur, ep }]
   *   arc      : { de, a, evite }                  l'arc intercepté (rouge) de A à B,
   *                                                 du côté où n'est pas le point `evite`
   *   marques  : [{ V, P, Q, txt, couleur, rentrant, evite, r, gap, dirTxt }]
   *              un arc en V, de [VP) vers [VQ) ; `rentrant` : par le grand côté ;
   *              `evite` : par le côté qui ne contient pas ce point ;
   *              `gap` : distance du texte au-delà de l'arc (0,24 par défaut) ;
   *              `dirTxt` : direction du texte depuis V (la bissectrice sinon)
   * }
   * Le cercle est toujours celui de centre O (l'origine) et de rayon 1.
   */
  function dessin(o) {
    var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="max-width:' + W + 'px;width:100%;height:auto;display:block;margin:0.7rem auto" ' +
      'role="img" aria-label="Un cercle de centre O, des points sur le cercle et des angles.">'];
    s.push('<circle class="cercle" cx="' + X([0, 0]) + '" cy="' + Y([0, 0]) + '" r="' + K +
           '" fill="#2563eb" fill-opacity="0.04" stroke="' + INK + '" stroke-width="2"/>');
    if (o.arc) {
      var a0 = Math.atan2(o.arc.de[1], o.arc.de[0]), d0 = balayage([0, 0], o.arc.de, o.arc.a);
      if (o.arc.evite && contient([0, 0], a0, d0, o.arc.evite)) d0 = grandCote(d0);
      s.push('<polyline class="arc-intercepte" points="' + cheminArc(0, 0, 1, a0, d0, 48) +
             '" fill="none" stroke="' + ROUGE + '" stroke-width="4.5" stroke-linecap="round"/>');
    }
    (o.segments || []).forEach(function (t) {
      s.push('<line x1="' + X(t.de) + '" y1="' + Y(t.de) + '" x2="' + X(t.a) + '" y2="' + Y(t.a) +
             '" stroke="' + (t.couleur || BLEU) + '" stroke-width="' + (t.ep || 2.5) +
             '" stroke-linecap="round"/>');
    });
    (o.marques || []).forEach(function (m) {
      var u = unit(sub(m.P, m.V)), a1 = Math.atan2(u[1], u[0]), d = balayage(m.V, m.P, m.Q);
      if (m.rentrant || (m.evite && contient(m.V, a1, d, m.evite))) d = grandCote(d);
      var r = m.r || 0.28, coul = m.couleur || ROUGE;
      s.push('<polyline class="marque" points="' + cheminArc(m.V[0], m.V[1], r, a1, d, 24) +
             '" fill="' + coul + '" fill-opacity="0.12" stroke="' + coul + '" stroke-width="2.2" stroke-linejoin="round"/>');
      if (m.txt) {
        // Le texte sur la bissectrice, sauf direction imposée (quand deux
        // étiquettes se feraient face sur la même ligne : M sur le petit arc).
        var am = m.dirTxt ? Math.atan2(m.dirTxt[1], m.dirTxt[0]) : a1 + d / 2;
        var g = r + (m.gap || 0.24);
        var e = [m.V[0] + g * Math.cos(am), m.V[1] + g * Math.sin(am)];
        s.push(texte(X(e), Y(e) + 6, m.txt, coul, 15));
      }
    });
    (o.points || []).forEach(function (q) {
      var col = q.couleur || INK;
      s.push('<circle class="pt" data-nom="' + q.nom + '" cx="' + X(q.p) + '" cy="' + Y(q.p) +
             '" r="4.5" fill="' + col + '"/>');
      var dd = q.dir || (len(q.p) > 0.2 ? unit(q.p) : [0.35, -0.9]);
      s.push(texte(X(q.p) + 16 * dd[0], Y(q.p) - 16 * dd[1] + 6, q.nom, col, 17));
    });
    s.push('</svg>');
    return s.join('');
  }

  // La figure standard : O, A, B, M sur le cercle, l'arc AB (du côté opposé à M)
  // en rouge, les côtés des deux angles. `extra` : points supplémentaires.
  function figure(A, B, M, marques, opts) {
    opts = opts || {};
    var pts = [{ p: [0, 0], nom: 'O' }, { p: A, nom: 'A', couleur: ROUGE }, { p: B, nom: 'B', couleur: ROUGE },
               { p: M, nom: 'M', couleur: BLEU }].concat(opts.points || []);
    var segs = [{ de: M, a: A }, { de: M, a: B }, { de: [0, 0], a: A, couleur: AMBRE }, { de: [0, 0], a: B, couleur: AMBRE }]
      .concat(opts.segments || []);
    return dessin({ arc: { de: A, a: B, evite: M }, segments: segs, marques: marques || [], points: pts });
  }
  // Une orientation au hasard du dessin.
  function orientation(rnd) { return rnd.entier(0, 23) * 15 + rnd.entier(-7, 7); }
  // A et B tels que l'angle au centre saillant vaille c, et M sur le grand arc
  // (angle inscrit c/2) ou sur le petit arc (angle inscrit 180 − c/2).
  function placer(rnd, c, surPetitArc) {
    var th = orientation(rnd);
    var A = pt(th), B = pt(th + c);
    var m = surPetitArc ? th + rnd.entier(Math.round(c * 0.3), Math.round(c * 0.7))
                        : th + c + rnd.entier(Math.round((360 - c) * 0.25), Math.round((360 - c) * 0.75));
    return { A: A, B: B, M: pt(m), th: th, m: m, t: (m - th) / c };
  }
  function autreSurGrandArc(rnd, f, c) {
    // Un second point N sur le grand arc, à bonne distance de M, A et B.
    var essais = 0, n;
    do {
      n = f.th + c + rnd.entier(Math.round((360 - c) * 0.2), Math.round((360 - c) * 0.8));
      essais++;
    } while (Math.abs(mod360(n - f.m + 180) - 180) < 50 && essais < 60);
    return pt(n);
  }
  function wh(s) { return '\\(\\widehat{' + s + '}\\)'; }
  function demiTex(v) { return O.tex(v); }
  function demiTxt(v) { return O.fr(v); }

  /* ===================================================================== */
  /* 1. Associer : quel angle intercepte le même arc ?                     */
  /* ===================================================================== */
  function associer(rnd) {
    var c = rnd.entier(70, 150), f = placer(rnd, c, false);
    var A = f.A, B = f.B, M = f.M;
    var versCentre = rnd.booleen(0.5);
    var bon, choix, question, etapes;
    if (versCentre) {
      bon = wh('AOB');
      choix = rnd.melange([bon, wh('AOM'), wh('MOB'), wh('OAB')]);
      question = 'Sur la figure, ' + wh('AMB') + ' est un angle inscrit. Quel <b>angle au centre</b> intercepte le même arc que lui ?';
      etapes = [
        'Un angle au centre a pour sommet le centre ' + '\\(O\\)' + ' du cercle : il s\'écrit ' + wh('\\ldots O \\ldots') + '.',
        'L\'angle inscrit ' + wh('AMB') + ' intercepte l\'arc ' + '\\(AB\\)' + ' (en rouge), celui qui n\'est pas du côté de ' + '\\(M\\)' + '.',
        'L\'angle au centre qui s\'ouvre sur ce même arc a pour côtés ' + '\\([OA)\\)' + ' et ' + '\\([OB)\\)' + ' : c\'est <b>' + bon + '</b>, et il vaut le double de ' + wh('AMB') + '.'
      ];
    } else {
      bon = wh('AMB');
      choix = rnd.melange([bon, wh('MAB'), wh('AOM'), wh('OMB')]);
      question = 'Sur la figure, ' + wh('AOB') + ' est un angle au centre. Quel <b>angle inscrit</b> intercepte le même arc que lui ?';
      etapes = [
        'Un angle inscrit a son sommet <b>sur le cercle</b> ; ici le seul sommet possible est ' + '\\(M\\)' + '.',
        'L\'angle au centre ' + wh('AOB') + ' intercepte l\'arc ' + '\\(AB\\)' + ' en rouge.',
        'L\'angle de sommet ' + '\\(M\\)' + ' dont les côtés passent par ' + '\\(A\\)' + ' et ' + '\\(B\\)' + ' est <b>' + bon + '</b> : il vaut la moitié de ' + wh('AOB') + '.'
      ];
    }
    return {
      enonce: figure(A, B, M, [versCentre ? { V: M, P: A, Q: B, couleur: BLEU } : { V: [0, 0], P: A, Q: B, couleur: AMBRE, evite: M }]) +
              '\\(A\\), \\(B\\) et \\(M\\) sont trois points du cercle de centre \\(O\\). ' + question,
      type: 'qcm', choix: choix, correct: choix.indexOf(bon),
      etapes: etapes,
      indices: ['Angle au centre : sommet en \\(O\\). Angle inscrit : sommet sur le cercle.',
                'Les deux angles doivent s\'ouvrir sur le même arc \\(AB\\), celui en rouge.'],
      duree: 35
    };
  }

  /* ===================================================================== */
  /* 2. De l'inscrit au centre, du centre à l'inscrit                      */
  /* ===================================================================== */
  function inscritVersCentre(rnd) {
    var a = rnd.entier(15, 80), f = placer(rnd, 2 * a, false);
    return {
      enonce: figure(f.A, f.B, f.M, [{ V: f.M, P: f.A, Q: f.B, txt: a + '°', couleur: BLEU },
                                      { V: [0, 0], P: f.A, Q: f.B, txt: '?', couleur: AMBRE, evite: f.M }]) +
              '\\(A\\), \\(B\\) et \\(M\\) sont trois points du cercle de centre \\(O\\), et ' + wh('AMB') + ' mesure ' + a + '°. ' +
              'Calcule l\'angle au centre ' + wh('AOB') + '.',
      type: 'nombre', reponse: 2 * a, unite: '°',
      etapes: [
        wh('AMB') + ' est un angle <b>inscrit</b> (sommet sur le cercle) et ' + wh('AOB') + ' un angle <b>au centre</b> ; tous deux interceptent l\'arc \\(AB\\).',
        'L\'angle au centre vaut le <b>double</b> de l\'angle inscrit : \\(\\widehat{AOB} = 2 \\times \\widehat{AMB} = 2 \\times ' + a + ' = \\mathbf{' + (2 * a) + '}°\\).'
      ],
      indices: ['Lequel des deux est l\'angle inscrit, lequel est l\'angle au centre ?',
                'L\'angle au centre est le double de l\'angle inscrit.'],
      duree: 40
    };
  }
  function centreVersInscrit(rnd, palier) {
    var c, diametre = palier >= 3 && rnd.booleen(0.2);
    if (diametre) c = 180;
    else if (palier <= 2) c = rnd.entier(15, 80) * 2;
    else c = rnd.entier(31, 169);
    var f = placer(rnd, c, false), rep = c / 2;
    var enonce = diametre
      ? '\\([AB]\\) est un diamètre du cercle de centre \\(O\\) et \\(M\\) est un point du cercle. Calcule l\'angle inscrit ' + wh('AMB') + '.'
      : '\\(A\\), \\(B\\) et \\(M\\) sont trois points du cercle de centre \\(O\\), et l\'angle au centre ' + wh('AOB') + ' mesure ' + c + '°. ' +
        'Calcule l\'angle inscrit ' + wh('AMB') + '.';
    return {
      enonce: figure(f.A, f.B, f.M, [{ V: [0, 0], P: f.A, Q: f.B, txt: c + '°', couleur: AMBRE, evite: f.M },
                                      { V: f.M, P: f.A, Q: f.B, txt: '?', couleur: BLEU }]) + enonce,
      type: 'nombre', reponse: rep, unite: '°',
      etapes: (diametre ? ['\\([AB]\\) est un diamètre : l\'angle au centre ' + wh('AOB') + ' est <b>plat</b>, il mesure 180°.'] : []).concat([
        wh('AOB') + ' est un angle <b>au centre</b> et ' + wh('AMB') + ' un angle <b>inscrit</b> ; tous deux interceptent l\'arc \\(AB\\) (en rouge).',
        'L\'angle inscrit vaut la <b>moitié</b> de l\'angle au centre : \\(\\widehat{AMB} = \\dfrac{\\widehat{AOB}}{2} = \\dfrac{' + c + '}{2} = \\mathbf{' + demiTex(rep) + '}°\\).'
      ]).concat(diametre ? ['On retrouve le triangle inscrit dans un demi-cercle : \\(AMB\\) est rectangle en \\(M\\).'] : []),
      indices: ['Lequel des deux est l\'angle au centre ?',
                'L\'angle inscrit est la moitié de l\'angle au centre.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 3. Même arc : M et N du même côté                                     */
  /* ===================================================================== */
  function memeArc(rnd) {
    var a = rnd.entier(20, 80), c = 2 * a, f = placer(rnd, c, false), N = autreSurGrandArc(rnd, f, c);
    var demandeCentre = rnd.booleen(0.25);
    var marques = [{ V: f.M, P: f.A, Q: f.B, txt: a + '°', couleur: BLEU },
                   demandeCentre ? { V: [0, 0], P: f.A, Q: f.B, txt: '?', couleur: AMBRE, evite: f.M } : { V: N, P: f.A, Q: f.B, txt: '?', couleur: VIOLET }];
    var fig = figure(f.A, f.B, f.M, marques, { points: [{ p: N, nom: 'N', couleur: VIOLET }],
                                                segments: [{ de: N, a: f.A, couleur: VIOLET }, { de: N, a: f.B, couleur: VIOLET }] });
    var debut = '\\(A\\), \\(B\\), \\(M\\) et \\(N\\) sont quatre points du cercle de centre \\(O\\) ; \\(M\\) et \\(N\\) sont du même côté de \\([AB]\\). ' +
                wh('AMB') + ' mesure ' + a + '°. ';
    if (demandeCentre) {
      return {
        enonce: fig + debut + 'Calcule l\'angle au centre ' + wh('AOB') + '.',
        type: 'nombre', reponse: c, unite: '°',
        etapes: [
          wh('AMB') + ' est un angle inscrit qui intercepte l\'arc \\(AB\\) ; ' + wh('AOB') + ' est l\'angle au centre qui intercepte le même arc.',
          '\\(\\widehat{AOB} = 2 \\times \\widehat{AMB} = 2 \\times ' + a + ' = \\mathbf{' + c + '}°\\). Le point \\(N\\) ne sert pas ici.'
        ],
        indices: ['L\'angle au centre est le double de l\'angle inscrit.'],
        duree: 40
      };
    }
    return {
      enonce: fig + debut + 'Calcule ' + wh('ANB') + '.',
      type: 'nombre', reponse: a, unite: '°',
      etapes: [
        wh('AMB') + ' et ' + wh('ANB') + ' sont deux angles <b>inscrits</b> qui interceptent le <b>même arc</b> \\(AB\\) (en rouge).',
        'Chacun vaut la moitié du même angle au centre ' + wh('AOB') + ' : ils sont donc <b>égaux</b>.',
        '\\(\\widehat{ANB} = \\widehat{AMB} = \\mathbf{' + a + '}°\\). (On peut vérifier : \\(\\widehat{AOB} = 2 \\times ' + a + ' = ' + c + '°\\), et \\(' + c + ' \\div 2 = ' + a + '\\).)'
      ],
      indices: ['Les deux angles ont leur sommet sur le cercle : ce sont deux angles inscrits.',
                'Deux angles inscrits qui interceptent le même arc sont égaux.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 4. Rentrant : M sur le petit arc                                      */
  /* ===================================================================== */
  function rentrant(rnd, palier) {
    var c = rnd.entier(50, 85) * 2;                   // l'angle au centre saillant, pair
    var f = placer(rnd, c, true), a = 180 - c / 2;    // l'angle inscrit, obtus
    var forme = palier >= 4 ? rnd.choix(['inscrit', 'saillant', 'rentrant']) : 'inscrit';
    // M est sur le petit arc : les étiquettes en O et en M se feraient face sur
    // la ligne (OM). On les écarte explicitement de part et d'autre de cette
    // ligne — celle de O vers le bout de l'arc le plus éloigné de M, celle de
    // M vers l'autre bout — et on les serre contre leur arc, pour dire à qui
    // elles appartiennent.
    var u = unit(f.M), versA = f.t >= 0.5;                 // A est-il le bout le plus loin de M ?
    var sO = Math.sign(u[0] * (versA ? f.A : f.B)[1] - u[1] * (versA ? f.A : f.B)[0]) || 1;
    var dirO = rot(u, sO * 30);
    var autre = versA ? f.B : f.A, mo = [-u[0], -u[1]];
    var beta = (180 - c * (versA ? 1 - f.t : f.t)) / 2;      // l'angle entre [MO) et le côté vers « autre »
    var sM = Math.sign(mo[0] * (autre[1] - f.M[1]) - mo[1] * (autre[0] - f.M[0])) || 1;
    var dirM = rot(mo, sM * Math.min(30, 0.6 * beta));
    var GAP = 0.14, fig;
    if (forme === 'inscrit') {
      fig = figure(f.A, f.B, f.M, [{ V: [0, 0], P: f.A, Q: f.B, txt: c + '°', couleur: AMBRE, dirTxt: dirO, gap: GAP },
                                    { V: f.M, P: f.A, Q: f.B, txt: '?', couleur: BLEU, dirTxt: dirM, gap: GAP }]);
      return {
        enonce: fig + '\\(A\\), \\(B\\) et \\(M\\) sont trois points du cercle de centre \\(O\\), et ' + wh('AOB') + ' mesure ' + c + '°. ' +
                'Calcule l\'angle inscrit ' + wh('AMB') + '.',
        type: 'nombre', reponse: a, unite: '°',
        etapes: [
          'Attention : \\(M\\) est sur le <b>petit</b> arc \\(AB\\). L\'angle inscrit ' + wh('AMB') + ' intercepte donc le <b>grand</b> arc (en rouge), celui qui n\'est pas de son côté.',
          'L\'angle au centre qui s\'ouvre sur ce grand arc est l\'angle <b>rentrant</b> : \\(360 - ' + c + ' = ' + (360 - c) + '°\\).',
          'L\'angle inscrit en est la moitié : \\(\\widehat{AMB} = \\dfrac{' + (360 - c) + '}{2} = \\mathbf{' + a + '}°\\). Il est obtus, comme la figure le montre — ' +
            '\\(' + c + ' \\div 2 = ' + (c / 2) + '°\\) serait l\'angle inscrit d\'un point de l\'autre arc.'
        ],
        indices: ['Sur quel arc est \\(M\\) ? Quel arc l\'angle ' + wh('AMB') + ' intercepte-t-il ?',
                  'L\'angle au centre qui s\'ouvre sur le grand arc vaut \\(360 - ' + c + '\\).'],
        duree: 70
      };
    }
    var saillant = forme === 'saillant';
    fig = figure(f.A, f.B, f.M, [{ V: f.M, P: f.A, Q: f.B, txt: a + '°', couleur: BLEU, dirTxt: dirM, gap: GAP },
                                  saillant ? { V: [0, 0], P: f.A, Q: f.B, txt: '?', couleur: AMBRE, dirTxt: dirO, gap: GAP }
                                           : { V: [0, 0], P: f.A, Q: f.B, txt: '?', couleur: AMBRE, rentrant: true }]);
    return {
      enonce: fig + '\\(A\\), \\(B\\) et \\(M\\) sont trois points du cercle de centre \\(O\\), et ' + wh('AMB') + ' mesure ' + a + '°. ' +
              'Calcule l\'angle ' + (saillant ? 'saillant ' : 'rentrant ') + wh('AOB') + ' marqué sur la figure.',
      type: 'nombre', reponse: saillant ? c : 360 - c, unite: '°',
      etapes: [
        wh('AMB') + ' est obtus : \\(M\\) est sur le <b>petit</b> arc, et l\'angle inscrit intercepte le <b>grand</b> arc \\(AB\\) (en rouge).',
        'L\'angle au centre qui s\'ouvre sur ce grand arc est <b>rentrant</b> et vaut le double : \\(2 \\times ' + a + ' = ' + (360 - c) + '°\\).'
      ].concat(saillant
        ? ['L\'angle saillant marqué est son complément à 360° : \\(360 - ' + (360 - c) + ' = \\mathbf{' + c + '}°\\).']
        : ['C\'est l\'angle marqué : \\(\\widehat{AOB} = \\mathbf{' + (360 - c) + '}°\\).']),
      indices: ['Quel arc l\'angle inscrit intercepte-t-il ? Le double de ' + a + ' dépasse 180°.',
                saillant ? 'Le rentrant vaut \\(2 \\times ' + a + '\\) ; le saillant, ce qui manque pour faire 360°.' : 'Le rentrant vaut \\(2 \\times ' + a + '\\).'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 5. Isocèle : OA = OB                                                  */
  /* ===================================================================== */
  function isocele(rnd, palier) {
    var a = rnd.entier(20, 80), c = 2 * a, b = 90 - a, f = placer(rnd, c, false);
    var inverse = palier >= 4 && rnd.booleen(0.5);
    var marques = inverse
      ? [{ V: f.A, P: f.B, Q: [0, 0], txt: b + '°', couleur: AMBRE, r: 0.22 }, { V: f.M, P: f.A, Q: f.B, txt: '?', couleur: BLEU }]
      : [{ V: f.M, P: f.A, Q: f.B, txt: a + '°', couleur: BLEU }, { V: f.A, P: f.B, Q: [0, 0], txt: '?', couleur: AMBRE, r: 0.22 }];
    var fig = figure(f.A, f.B, f.M, marques, { segments: [{ de: f.A, a: f.B, couleur: AMBRE }] });
    var debut = '\\(A\\), \\(B\\) et \\(M\\) sont trois points du cercle de centre \\(O\\). ';
    if (inverse) {
      return {
        enonce: fig + debut + wh('OAB') + ' mesure ' + b + '°. Calcule l\'angle inscrit ' + wh('AMB') + '.',
        type: 'nombre', reponse: a, unite: '°',
        etapes: [
          '\\(OA = OB\\) (deux rayons) : le triangle \\(OAB\\) est <b>isocèle en \\(O\\)</b>, donc \\(\\widehat{OBA} = \\widehat{OAB} = ' + b + '°\\).',
          'La somme des angles du triangle fait 180° : \\(\\widehat{AOB} = 180 - 2 \\times ' + b + ' = ' + c + '°\\).',
          wh('AOB') + ' est l\'angle au centre qui intercepte l\'arc \\(AB\\), et ' + wh('AMB') + ' l\'angle inscrit : ' +
            '\\(\\widehat{AMB} = \\dfrac{' + c + '}{2} = \\mathbf{' + a + '}°\\).'
        ],
        indices: ['Que dire du triangle \\(OAB\\) ? (\\(OA\\) et \\(OB\\) sont des rayons.)',
                  'Trouve d\'abord l\'angle au centre, puis divise par 2.'],
        duree: 90
      };
    }
    return {
      enonce: fig + debut + wh('AMB') + ' mesure ' + a + '°. Calcule ' + wh('OAB') + '.',
      type: 'nombre', reponse: b, unite: '°',
      etapes: [
        wh('AMB') + ' est un angle inscrit, ' + wh('AOB') + ' l\'angle au centre qui intercepte le même arc : \\(\\widehat{AOB} = 2 \\times ' + a + ' = ' + c + '°\\).',
        '\\(OA = OB\\) (deux rayons) : le triangle \\(OAB\\) est <b>isocèle en \\(O\\)</b>, ses angles en \\(A\\) et en \\(B\\) sont égaux.',
        'La somme des angles du triangle fait 180° : \\(\\widehat{OAB} = \\dfrac{180 - ' + c + '}{2} = \\dfrac{' + (180 - c) + '}{2} = \\mathbf{' + b + '}°\\).'
      ],
      indices: ['Commence par l\'angle au centre ' + wh('AOB') + '.',
                'Le triangle \\(OAB\\) est isocèle en \\(O\\) : ses deux angles à la base sont égaux.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 6. Opposés : M et N de part et d'autre de [AB]                        */
  /* ===================================================================== */
  function opposes(rnd) {
    var a = rnd.entier(30, 80), c = 2 * a, f = placer(rnd, c, false);
    var N = pt(f.th + rnd.entier(Math.round(c * 0.3), Math.round(c * 0.7)));   // sur le petit arc
    var fig = figure(f.A, f.B, f.M, [{ V: f.M, P: f.A, Q: f.B, txt: a + '°', couleur: BLEU },
                                      { V: N, P: f.A, Q: f.B, txt: '?', couleur: VIOLET }],
      { points: [{ p: N, nom: 'N', couleur: VIOLET }], segments: [{ de: N, a: f.A, couleur: VIOLET }, { de: N, a: f.B, couleur: VIOLET }] });
    return {
      enonce: fig + '\\(A\\), \\(B\\), \\(M\\) et \\(N\\) sont quatre points du cercle de centre \\(O\\) ; \\(M\\) et \\(N\\) sont de part et d\'autre de \\([AB]\\). ' +
              wh('AMB') + ' mesure ' + a + '°. Calcule ' + wh('ANB') + '.',
      type: 'nombre', reponse: 180 - a, unite: '°',
      etapes: [
        wh('AMB') + ' intercepte l\'arc \\(AB\\) du côté de \\(N\\) (en rouge) : l\'angle au centre correspondant vaut \\(2 \\times ' + a + ' = ' + c + '°\\).',
        wh('ANB') + ' intercepte l\'<b>autre</b> arc \\(AB\\), celui du côté de \\(M\\) : son angle au centre est ce qui reste du tour, \\(360 - ' + c + ' = ' + (360 - c) + '°\\).',
        '\\(\\widehat{ANB} = \\dfrac{' + (360 - c) + '}{2} = \\mathbf{' + (180 - a) + '}°\\). Deux angles inscrits de part et d\'autre d\'une corde sont <b>supplémentaires</b> : \\(' + a + ' + ' + (180 - a) + ' = 180\\).'
      ],
      indices: ['Les deux angles n\'interceptent pas le même arc : \\(M\\) et \\(N\\) ne sont pas du même côté.',
                'Les deux angles au centre font 360° à eux deux.'],
      duree: 80
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'angle-inscrit', competence: 'angle-inscrit', level: '2nde',
    titre: 'Angle inscrit et angle au centre', paliers: 4,

    genere: function (rnd, palier) {
      var r = rnd.entier(1, 100);
      if (palier <= 1) {
        if (r <= 35) return associer(rnd);
        if (r <= 70) return inscritVersCentre(rnd);
        return centreVersInscrit(rnd, palier);
      }
      if (palier === 2) {
        if (r <= 35) return memeArc(rnd);
        if (r <= 55) return inscritVersCentre(rnd);
        if (r <= 80) return centreVersInscrit(rnd, palier);
        return associer(rnd);
      }
      if (palier === 3) {
        if (r <= 35) return rentrant(rnd, palier);
        if (r <= 60) return isocele(rnd, palier);
        if (r <= 80) return centreVersInscrit(rnd, palier);
        return memeArc(rnd);
      }
      if (r <= 30) return opposes(rnd);
      if (r <= 60) return rentrant(rnd, palier);
      if (r <= 85) return isocele(rnd, palier);
      return memeArc(rnd);
    }
  });
})();
