/*
 * Un repère quadrillé en SVG, pour les générateurs de géométrie de 5ème
 * (à commencer par la symétrie centrale).
 *
 * Une symétrie centrale ne se raconte pas, elle se lit sur un quadrillage :
 * « O est le milieu de [MM'] » devient « je compte 3 carreaux à droite, donc
 * j'en compte 3 à gauche ». Ce module fournit donc le décor complet — grille,
 * axes, graduations — et de quoi poser dessus des points, des segments et des
 * polygones.
 *
 * ---------------------------------------------------------------------------
 * La fenêtre se calcule toute seule
 * ---------------------------------------------------------------------------
 * L'appelant travaille en coordonnées ; c'est `repere` qui regarde tout ce
 * qu'on lui donne à dessiner, ajoute une marge, arrondit aux entiers et
 * s'assure que l'ORIGINE reste visible — un repère dont on ne voit pas le
 * point (0 ; 0) est illisible pour un élève de cinquième. Les carreaux restent
 * carrés quoi qu'il arrive : sans cela, un demi-tour aurait l'air d'une
 * déformation.
 *
 * À charger APRÈS exos/outils.js.
 */
(function (global) {
  'use strict';
  var O = global.ExosOutils;

  var W = 430, H = 350, MARGE = 24;
  var GRILLE = '#e2e8f0', AXE = '#94a3b8', ENCRE = '#334155';

  function fr(v) { return O ? O.fr(v) : String(v); }
  function n1(v) { return Math.round(v * 10) / 10; }

  /*
   * o = {
   *   points    : [{ p, nom, couleur, place }]   place = 'haut'|'bas'|'gauche'|'droite'
   *   segments  : [{ de, a, couleur, dash, ep }]
   *   polygones : [{ pts, couleur, remplir, num, dash }]
   *   cadre     : [[x,y], …]  points pris en compte pour la FENÊTRE seulement,
   *               sans être dessinés — de quoi garantir que la réponse
   *               attendue, et même les réponses proposées, tiennent dans le
   *               repère : un élève doit pouvoir aller y voir.
   *   marge     : nombre d'unités à laisser autour (défaut 1)
   * }
   */
  function repere(o) {
    var pts = o.points || [], segs = o.segments || [], polys = o.polygones || [];

    // 1. la fenêtre : tout ce qu'on dessine, plus une marge, plus l'origine
    var tous = [[0, 0]];
    pts.forEach(function (q) { tous.push(q.p); });
    segs.forEach(function (s) { tous.push(s.de, s.a); });
    polys.forEach(function (p) { p.pts.forEach(function (q) { tous.push(q); }); });
    (o.cadre || []).forEach(function (q) { tous.push(q); });
    var m = o.marge === undefined ? 1 : o.marge;
    var x0 = Math.floor(Math.min.apply(null, tous.map(function (q) { return q[0]; })) - m);
    var x1 = Math.ceil(Math.max.apply(null, tous.map(function (q) { return q[0]; })) + m);
    var y0 = Math.floor(Math.min.apply(null, tous.map(function (q) { return q[1]; })) - m);
    var y1 = Math.ceil(Math.max.apply(null, tous.map(function (q) { return q[1]; })) + m);

    // Un repère de trois carreaux de côté ne ressemble pas à un repère : on
    // impose une taille minimale, en s'écartant de part et d'autre.
    var MINI = 6;
    while (x1 - x0 < MINI) { x0 -= 1; if (x1 - x0 < MINI) x1 += 1; }
    while (y1 - y0 < MINI) { y0 -= 1; if (y1 - y0 < MINI) y1 += 1; }

    // Des carreaux carrés : un demi-tour doit ressembler à un demi-tour.
    var k = Math.min((W - 2 * MARGE) / (x1 - x0), (H - 2 * MARGE) / (y1 - y0));
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    function X(p) { return n1(W / 2 + (p[0] - cx) * k); }
    function Y(p) { return n1(H / 2 - (p[1] - cy) * k); }
    function XY(p) { return X(p) + ',' + Y(p); }

    var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="max-width:' + W + 'px;width:100%;height:auto;display:block;margin:0.7rem auto" ' +
      'role="img" aria-label="Un repère quadrillé avec des points et des figures.">'];

    // 2. le quadrillage
    var i;
    for (i = x0; i <= x1; i++) {
      s.push('<line x1="' + X([i, 0]) + '" y1="' + Y([0, y0]) + '" x2="' + X([i, 0]) +
             '" y2="' + Y([0, y1]) + '" stroke="' + GRILLE + '" stroke-width="1"/>');
    }
    for (i = y0; i <= y1; i++) {
      s.push('<line x1="' + X([x0, 0]) + '" y1="' + Y([0, i]) + '" x2="' + X([x1, 0]) +
             '" y2="' + Y([0, i]) + '" stroke="' + GRILLE + '" stroke-width="1"/>');
    }

    // 3. les axes et leurs graduations
    s.push('<line x1="' + X([x0, 0]) + '" y1="' + Y([0, 0]) + '" x2="' + X([x1, 0]) +
           '" y2="' + Y([0, 0]) + '" stroke="' + AXE + '" stroke-width="1.8"/>');
    s.push('<line x1="' + X([0, 0]) + '" y1="' + Y([0, y0]) + '" x2="' + X([0, 0]) +
           '" y2="' + Y([0, y1]) + '" stroke="' + AXE + '" stroke-width="1.8"/>');
    var pas = Math.max(x1 - x0, y1 - y0) > 13 ? 2 : 1;
    for (i = x0; i <= x1; i++) {
      if (i === 0 || i % pas) continue;
      s.push(texte(X([i, 0]), Y([0, 0]) + 15, fr(i), AXE, 11));
    }
    for (i = y0; i <= y1; i++) {
      if (i === 0 || i % pas) continue;
      s.push(texte(X([0, 0]) - 13, Y([0, i]) + 4, fr(i), AXE, 11));
    }
    s.push(texte(X([0, 0]) - 11, Y([0, 0]) + 15, '0', AXE, 11));

    // 4. les polygones
    polys.forEach(function (p) {
      var d = p.pts.map(XY).join(' ');
      s.push('<polygon points="' + d + '" fill="' + (p.remplir === false ? 'none' : p.couleur) +
             '" fill-opacity="' + (p.remplir === false ? 0 : 0.18) + '" stroke="' + p.couleur +
             '" stroke-width="2.5" stroke-linejoin="round"' +
             (p.dash ? ' stroke-dasharray="7 5"' : '') + '/>');
      if (p.num) {
        var g = p.pts.reduce(function (a, q) { return [a[0] + q[0], a[1] + q[1]]; }, [0, 0]);
        g = [g[0] / p.pts.length, g[1] / p.pts.length];
        s.push(texte(X(g), Y(g) + 6, p.num, p.couleur, 18));
      }
    });

    // 5. les segments
    segs.forEach(function (t) {
      s.push('<line x1="' + X(t.de) + '" y1="' + Y(t.de) + '" x2="' + X(t.a) + '" y2="' +
             Y(t.a) + '" stroke="' + (t.couleur || ENCRE) + '" stroke-width="' + (t.ep || 2) +
             '"' + (t.dash ? ' stroke-dasharray="7 5"' : '') + ' stroke-linecap="round"/>');
    });

    // 6. les points nommés
    pts.forEach(function (q) {
      var col = q.couleur || '#2563eb';
      s.push('<circle cx="' + X(q.p) + '" cy="' + Y(q.p) + '" r="4.5" fill="' + col + '"/>');
      if (!q.nom) return;
      var dx = 0, dy = -13;
      if (q.place === 'bas') dy = 21;
      else if (q.place === 'gauche') { dx = -15; dy = 5; }
      else if (q.place === 'droite') { dx = 15; dy = 5; }
      s.push(texte(X(q.p) + dx, Y(q.p) + dy, q.nom, col, 16));
    });

    s.push('</svg>');
    return s.join('');
  }

  // Un texte lisible même par-dessus la grille : liseré blanc.
  function texte(x, y, t, col, taille) {
    return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + (taille || 15) +
           '" font-weight="700" font-family="system-ui, sans-serif" fill="' + col +
           '" stroke="#fff" stroke-width="3.5" paint-order="stroke" text-anchor="middle">' +
           t + '</text>';
  }

  /* ===================================================================== */
  /* Écriture des coordonnées, à la française                              */
  /* ===================================================================== */
  function coord(p) { return '(' + fr(p[0]) + ' ; ' + fr(p[1]) + ')'; }

  /* ===================================================================== */
  /* Les transformations dont on a besoin ici                              */
  /* ===================================================================== */
  function sym(p, c) { return [2 * c[0] - p[0], 2 * c[1] - p[1]]; }      // centrale
  function symH(p, c) { return [p[0], 2 * c[1] - p[1]]; }   // axiale, axe horizontal
  function symV(p, c) { return [2 * c[0] - p[0], p[1]]; }   // axiale, axe vertical
  function trans(p, v) { return [p[0] + v[0], p[1] + v[1]]; }
  function boite(pts) {
    return { x0: Math.min.apply(null, pts.map(function (q) { return q[0]; })),
             x1: Math.max.apply(null, pts.map(function (q) { return q[0]; })),
             y0: Math.min.apply(null, pts.map(function (q) { return q[1]; })),
             y1: Math.max.apply(null, pts.map(function (q) { return q[1]; })) };
  }
  // Deux figures se chevauchent-elles ? (test des boîtes, largement suffisant
  // pour éviter un dessin illisible)
  function chevauche(a, b, jeu) {
    var A = boite(a), B = boite(b), j = jeu === undefined ? 0.5 : jeu;
    return !(A.x1 + j < B.x0 || B.x1 + j < A.x0 || A.y1 + j < B.y0 || B.y1 + j < A.y0);
  }

  global.RepereOutils = {
    repere: repere, coord: coord, sym: sym, symH: symH, symV: symV, trans: trans,
    boite: boite, chevauche: chevauche
  };

})(window);
