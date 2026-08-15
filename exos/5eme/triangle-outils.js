/*
 * Les outils communs aux générateurs « hauteurs » et « médianes » (5ème),
 * sur le modèle de exos/2nde/vecteurs-outils.js.
 *
 * Les deux chapitres posent la même question de fond — quelle droite est-ce,
 * et par où passe-t-elle ? — et ne s'apprennent qu'en LISANT une figure. Ce
 * fichier fournit donc une seule chose, mais bien : un dessin de triangle en
 * SVG, avec ce qu'on veut poser dessus (des segments, des points, le codage
 * d'un angle droit, celui de deux longueurs égales).
 *
 * ---------------------------------------------------------------------------
 * Le cadrage est automatique
 * ---------------------------------------------------------------------------
 * Un générateur travaille en coordonnées mathématiques, dans l'unité qui
 * l'arrange, et sans se demander si son triangle tiendra dans l'image : la
 * fonction `figure` calcule l'emprise de TOUT ce qu'on lui donne à dessiner —
 * sommets, extrémités des traits, points isolés, y compris ce qui sort du
 * triangle comme un orthocentre à l'extérieur — puis met le tout à l'échelle
 * et le centre. On peut donc tirer des triangles au hasard sans jamais
 * craindre qu'un morceau dépasse.
 *
 * Le repère est retourné en y (l'axe des ordonnées du SVG descend), ce dont
 * aucun appelant n'a à s'occuper.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est volontairement absent
 * ---------------------------------------------------------------------------
 * Aucun codage n'est ajouté tout seul. Si l'exercice demande « laquelle de ces
 * trois droites est la hauteur ? », dessiner le petit carré de l'angle droit
 * donnerait la réponse ; c'est au générateur de décider ce qu'il montre et ce
 * qu'il cache. L'outil dessine ce qu'on lui demande, rien de plus.
 *
 * À charger APRÈS exos/outils.js.
 */
(function (global) {
  'use strict';

  var W = 430, H = 310, MARGE = 40;      // taille du dessin et marge intérieure
  var INK = '#334155', SOM = '#2563eb';

  /* ===================================================================== */
  /* Un peu d'algèbre vectorielle                                          */
  /* ===================================================================== */
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
  function len(a) { return Math.sqrt(dot(a, a)); }
  function unit(a) { var n = len(a); return n < 1e-9 ? [1, 0] : [a[0] / n, a[1] / n]; }
  function mil(a, b) { return mul(add(a, b), 0.5); }

  // Le projeté orthogonal de p sur la droite (uv) : le pied de la hauteur.
  function projete(p, u, v) {
    var d = sub(v, u), den = dot(d, d);
    if (den < 1e-9) return u.slice();
    return add(u, mul(d, dot(sub(p, u), d) / den));
  }
  // L'aire d'un triangle, et le double du déterminant (son signe dit le sens).
  function det2(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
  }
  function aire(a, b, c) { return Math.abs(det2(a, b, c)) / 2; }

  // Les trois angles du triangle, en degrés, dans l'ordre des sommets.
  function angles(P) {
    return [0, 1, 2].map(function (i) {
      var u = sub(P[(i + 1) % 3], P[i]), v = sub(P[(i + 2) % 3], P[i]);
      var d = len(u) * len(v);
      if (d < 1e-9) return 0;
      return Math.acos(Math.max(-1, Math.min(1, dot(u, v) / d))) * 180 / Math.PI;
    });
  }
  // « acutangle » | « rectangle » | « obtusangle », et le sommet en cause.
  function nature(P) {
    var a = angles(P), max = Math.max(a[0], a[1], a[2]), i = a.indexOf(max);
    if (Math.abs(max - 90) < 0.5) return { type: 'rectangle', sommet: i, max: max };
    if (max > 90) return { type: 'obtusangle', sommet: i, max: max };
    return { type: 'acutangle', sommet: i, max: max };
  }

  /* ===================================================================== */
  /* Le dessin                                                             */
  /* ===================================================================== */
  function n1(v) { return Math.round(v * 10) / 10; }

  /*
   * o = {
   *   P        : [[x,y],[x,y],[x,y]]  les trois sommets, en repère math ;
   *   noms     : ['A','B','C']  (facultatif : rien n'est écrit sans noms) ;
   *   remplir  : true pour teinter l'intérieur du triangle ;
   *   traits   : [{ de, a, couleur, dash, ep, num, pos }]  segments posés dessus.
   *              `pos` dit OÙ écrire le numéro le long du trait (0 au départ,
   *              1 à l'arrivée ; 0,62 par défaut). Deux droites qui se croisent
   *              verraient sinon leurs numéros se poser l'un sur l'autre ;
   *   points   : [{ p, nom, couleur, place }]  place = 'haut'|'bas'|'auto' ;
   *   equerres : [{ pied, vers, base }]  le petit carré de l'angle droit ;
   *   codes    : [{ a, b, n }]  n traits en travers, au milieu de [ab].
   *   marques  : [{ i, txt, couleur }]  un arc au sommet i, et ce qui est écrit
   *              dedans — une mesure, un point d'interrogation. C'est ce qui
   *              permet à une figure de porter TOUTE la question, sans que
   *              l'énoncé ait à répéter les données.
   * }
   */
  function figure(o) {
    var P = o.P, traits = o.traits || [], points = o.points || [];
    var equerres = o.equerres || [], codes = o.codes || [];

    // 1. l'emprise de tout ce qu'on va dessiner, sommets ET dépendances
    var tous = P.slice();
    traits.forEach(function (t) { tous.push(t.de, t.a); });
    points.forEach(function (q) { tous.push(q.p); });
    var xs = tous.map(function (q) { return q[0]; });
    var ys = tous.map(function (q) { return q[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var k = Math.min((W - 2 * MARGE) / Math.max(x1 - x0, 1e-6),
                     (H - 2 * MARGE) / Math.max(y1 - y0, 1e-6));
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    function X(p) { return n1(W / 2 + (p[0] - cx) * k); }
    function Y(p) { return n1(H / 2 - (p[1] - cy) * k); }   // le SVG descend
    function XY(p) { return X(p) + ',' + Y(p); }

    var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="max-width:' + W + 'px;width:100%;height:auto;display:block;margin:0.7rem auto" ' +
      'role="img" aria-label="Un triangle et les droites tracées dessus.">'];

    // 2. le triangle
    if (o.remplir !== false) {
      s.push('<polygon points="' + P.map(XY).join(' ') + '" fill="#2563eb" ' +
             'fill-opacity="0.07" stroke="none"/>');
    }
    s.push('<polygon points="' + P.map(XY).join(' ') + '" fill="none" stroke="' + INK +
           '" stroke-width="2.5" stroke-linejoin="round"/>');

    // 3. les segments posés dessus
    traits.forEach(function (t) {
      s.push('<line x1="' + X(t.de) + '" y1="' + Y(t.de) + '" x2="' + X(t.a) + '" y2="' +
             Y(t.a) + '" stroke="' + (t.couleur || '#7c3aed') + '" stroke-width="' +
             (t.ep || 2.5) + '"' + (t.dash ? ' stroke-dasharray="7 5"' : '') +
             ' stroke-linecap="round"/>');
    });

    // 4. le codage des longueurs égales : n traits en travers du segment
    codes.forEach(function (c) {
      var L = len(sub(c.b, c.a)), nb = c.n || 1;
      var m = mil(c.a, c.b), d = unit(sub(c.b, c.a)), nn = [-d[1], d[0]];
      for (var i = 0; i < nb; i++) {
        var q = add(m, mul(d, (i - (nb - 1) / 2) * 0.05 * L));
        var q1 = add(q, mul(nn, 0.055 * L)), q2 = add(q, mul(nn, -0.055 * L));
        s.push('<line x1="' + X(q1) + '" y1="' + Y(q1) + '" x2="' + X(q2) + '" y2="' +
               Y(q2) + '" stroke="' + (c.couleur || '#ea580c') + '" stroke-width="2.5"/>');
      }
    });

    // 4 bis. les angles marqués : un arc au sommet, et la mesure dedans
    (o.marques || []).forEach(function (m) {
      var i = m.i, V = P[i], A = P[(i + 1) % 3], B = P[(i + 2) % 3];
      var u = unit(sub(A, V)), w = unit(sub(B, V));
      var a1 = Math.atan2(u[1], u[0]), a2 = Math.atan2(w[1], w[0]);
      var d = a2 - a1;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      var taille = Math.max(x1 - x0, y1 - y0);
      var r = 0.11 * taille;
      // l'arc, en ligne brisée : douze segments suffisent à faire un arc rond
      var pts = [];
      for (var k = 0; k <= 12; k++) {
        var a = a1 + d * k / 12;
        pts.push([V[0] + Math.cos(a) * r, V[1] + Math.sin(a) * r]);
      }
      var coul = m.couleur || '#dc2626';
      s.push('<polyline points="' + pts.map(XY).join(' ') + '" fill="none" stroke="' +
             coul + '" stroke-width="2.2" stroke-linejoin="round"/>');
      if (m.txt) {
        // juste au-delà de l'arc : plus loin, l'étiquette se met à flotter entre
        // deux sommets et on ne sait plus de quel angle elle parle
        var e = add(V, mul(unit(add(u, w)), 1.55 * r));
        s.push(texte(X(e), Y(e) + 6, m.txt, coul, 16));
      }
    });

    // 5. le codage de l'angle droit : le petit carré, posé au pied
    equerres.forEach(function (e) {
      var r = 0.055 * Math.max(x1 - x0, y1 - y0);
      var u = mul(unit(sub(e.base, e.pied)), r), v = mul(unit(sub(e.vers, e.pied)), r);
      var q = [e.pied, add(e.pied, u), add(add(e.pied, u), v), add(e.pied, v)];
      s.push('<polygon points="' + q.map(XY).join(' ') + '" fill="' + (e.couleur || '#ea580c') +
             '" fill-opacity="0.35" stroke="' + (e.couleur || '#ea580c') + '" stroke-width="2.5"/>');
    });

    // 6. les points isolés (milieux, pieds, points de concours…)
    points.forEach(function (q) {
      s.push('<circle cx="' + X(q.p) + '" cy="' + Y(q.p) + '" r="4" fill="' +
             (q.couleur || '#ea580c') + '"/>');
      if (q.nom) s.push(texte(X(q.p), Y(q.p) + (q.place === 'haut' ? -13 : 21), q.nom,
                              q.couleur || '#ea580c', 15));
    });

    // 7. les sommets et leurs noms, écartés du centre du triangle
    var g = mul(add(add(P[0], P[1]), P[2]), 1 / 3);
    P.forEach(function (p, i) {
      s.push('<circle cx="' + X(p) + '" cy="' + Y(p) + '" r="4.5" fill="' + SOM + '"/>');
      if (o.noms) {
        var d = unit(sub(p, g));
        s.push(texte(X(p) + 17 * d[0], Y(p) - 17 * d[1] + 5, o.noms[i], SOM, 17));
      }
    });

    // 8. les numéros des traits, posés au tiers du segment côté extérieur
    traits.forEach(function (t) {
      if (!t.num) return;
      var m = add(t.de, mul(sub(t.a, t.de), t.pos === undefined ? 0.62 : t.pos));
      var d = unit(sub(t.a, t.de)), nn = [-d[1], d[0]];
      var ecart = 0.05 * Math.max(x1 - x0, y1 - y0);
      s.push(texte(X(add(m, mul(nn, ecart))), Y(add(m, mul(nn, ecart))) + 5, t.num,
                   t.couleur || '#7c3aed', 17));
    });

    s.push('</svg>');
    return s.join('');
  }

  // Un texte lisible même par-dessus un trait : liseré blanc.
  function texte(x, y, t, col, taille) {
    return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + (taille || 15) +
           '" font-weight="700" font-family="system-ui, sans-serif" fill="' + col +
           '" stroke="#fff" stroke-width="3.5" paint-order="stroke" text-anchor="middle">' +
           t + '</text>';
  }

  /* ===================================================================== */
  /* Tirage de triangles                                                   */
  /* ===================================================================== */
  // Un triangle ni trop plat ni trop pointu, dont on maîtrise la nature.
  // `veut` vaut 'acutangle', 'rectangle', 'obtusangle' ou rien.
  function triangle(rnd, veut) {
    for (var essai = 0; essai < 400; essai++) {
      var P = [[rnd.entier(-9, 9), rnd.entier(2, 9)],
               [rnd.entier(-10, -3), rnd.entier(-8, -3)],
               [rnd.entier(3, 10), rnd.entier(-8, -3)]];
      var a = angles(P), min = Math.min(a[0], a[1], a[2]), max = Math.max(a[0], a[1], a[2]);
      if (min < 28) continue;                       // trop pointu : illisible
      if (aire(P[0], P[1], P[2]) < 30) continue;    // trop plat
      if (veut === 'acutangle' && max > 82) continue;
      if (veut === 'obtusangle' && (max < 100 || max > 145)) continue;
      if (!veut && Math.abs(max - 90) < 4) continue; // pas de faux triangle rectangle
      return P;
    }
    // Repli, du bon type : un tirage ne doit jamais rendre autre chose que ce
    // qu'on lui a demandé. (Les triangles RECTANGLES, eux, ne se tirent pas au
    // hasard : ils se construisent, voir `rectangle` ci-dessous.)
    return veut === 'obtusangle' ? [[-2, 2], [-9, -4], [9, -4]]
                                 : [[0, 6], [-7, -4], [7, -4]];
  }

  // Un vrai triangle rectangle : l'angle droit est construit, pas espéré.
  function rectangle(rnd) {
    var b = rnd.entier(5, 10), h = rnd.entier(5, 10);
    var forme = [[0, 0], [b, 0], [0, h]];           // l'angle droit est en forme[0]
    var i = rnd.entier(0, 2);                       // le sommet qui le portera
    var P = [];
    P[i] = forme[0]; P[(i + 1) % 3] = forme[1]; P[(i + 2) % 3] = forme[2];
    return { P: P, droit: i };
  }

  // Un couple (triangle, sommet) où la hauteur et la médiane issues de ce
  // sommet sont franchement DISTINCTES. Sans cette précaution, un triangle
  // isocèle depuis le sommet tiré ferait coïncider les deux : « laquelle de ces
  // droites est la hauteur ? » aurait alors deux bonnes réponses, et « hauteur
  // ou médiane ? » n'en aurait aucune.
  function trianglePlusSommet(rnd, veut, ecart) {
    var seuil = ecart || 0.16;
    for (var essai = 0; essai < 80; essai++) {
      var P = triangle(rnd, veut);
      var bons = [0, 1, 2].filter(function (k) {
        var u = P[(k + 1) % 3], v = P[(k + 2) % 3];
        return len(sub(projete(P[k], u, v), mil(u, v))) > seuil * len(sub(v, u));
      });
      if (bons.length) return { P: P, i: rnd.choix(bons) };
    }
    return { P: [[-4, 6], [-7, -4], [7, -4]], i: 0 };
  }

  global.TriOutils = {
    sub: sub, add: add, mul: mul, dot: dot, len: len, unit: unit, mil: mil,
    projete: projete, aire: aire, det2: det2, angles: angles, nature: nature,
    figure: figure, triangle: triangle, rectangle: rectangle,
    trianglePlusSommet: trianglePlusSommet
  };

})(window);
