/*
 * Les figures communes aux générateurs de géométrie de 6ème : un angle, un
 * rapporteur posé sur un angle, et une configuration de droites codées.
 *
 * ---------------------------------------------------------------------------
 * Pourquoi un vrai rapporteur
 * ---------------------------------------------------------------------------
 * La difficulté de la 6ème n'est pas de lire un nombre, c'est de choisir ENTRE
 * DEUX nombres : le côté de l'angle croise le bord du rapporteur entre 50 et
 * 130, et il faut savoir lequel prendre. Un énoncé qui dirait « l'angle mesure
 * 50° » supprimerait justement la question. Le rapporteur est donc dessiné pour
 * de bon, avec ses DEUX graduations, et l'élève lit la figure — exactement
 * comme dans la leçon « Mesurer un angle au rapporteur ».
 *
 * ---------------------------------------------------------------------------
 * Repère
 * ---------------------------------------------------------------------------
 * Tout est en degrés et en orientation mathématique (0° vers la droite, les
 * angles tournent dans le sens inverse des aiguilles d'une montre). La
 * conversion vers le SVG, dont l'axe des y descend, est faite au dernier
 * moment et une seule fois.
 *
 * À charger APRÈS exos/outils.js.
 */
(function (global) {
  'use strict';
  var O = global.ExosOutils;

  var ENCRE = '#334155', GRIS = '#94a3b8', BLEU = '#2563eb';
  var VIOLET = '#7c3aed', ORANGE = '#ea580c', ROSE = '#e11d48';

  function rad(d) { return d * Math.PI / 180; }
  function n1(v) { return Math.round(v * 10) / 10; }
  function fr(v) { return O ? O.fr(v) : String(v); }

  // Un texte lisible même par-dessus un trait : liseré blanc.
  function texte(x, y, t, col, taille, gras) {
    return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + (taille || 15) +
           '" font-weight="' + (gras === false ? 400 : 700) +
           '" font-family="system-ui, sans-serif" fill="' + col +
           '" stroke="#fff" stroke-width="3" paint-order="stroke" text-anchor="middle">' +
           t + '</text>';
  }
  function svgOuvre(w, h, alt) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="max-width:' + w + 'px;width:100%;height:auto;display:block;margin:0.7rem auto" ' +
      'role="img" aria-label="' + alt + '">';
  }

  /* ===================================================================== */
  /* 1. Un angle : sommet, deux côtés, un arc                              */
  /* ===================================================================== */
  /*
   * o = {
   *   mesure  : la mesure de l'angle, en degrés ;
   *   depart  : la direction du premier côté (défaut : tirée pour être lisible) ;
   *   noms    : ['A','O','B'] — côté 1, sommet, côté 2 (facultatif) ;
   *   droit   : true pour coder l'angle droit par un petit carré ;
   *   valeur  : un texte à écrire dans l'angle (par exemple « ? »).
   * }
   */
  function angleFig(o) {
    var W = 400, H = 270, cx = W / 2, cy = H * 0.68, L = 118, R = 42;
    var a0 = o.depart === undefined ? 0 : o.depart, a1 = a0 + o.mesure;
    function P(a, r) { return [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))]; }

    var s = [svgOuvre(W, H, 'Un angle de sommet O et ses deux côtés.')];

    // l'arc de l'angle
    var arc = [];
    for (var t = 0; t <= 40; t++) {
      var p = P(a0 + (a1 - a0) * t / 40, R);
      arc.push(n1(p[0]) + ',' + n1(p[1]));
    }
    s.push('<polyline points="' + arc.join(' ') + '" fill="none" stroke="' + ORANGE +
           '" stroke-width="2.5"/>');

    // le codage de l'angle droit, à la place de l'arc
    if (o.droit) {
      var u = P(a0, 30), v = P(a1, 30), c = P(a0, 0);
      var q = [c, u, [u[0] + v[0] - c[0], u[1] + v[1] - c[1]], v];
      s.push('<polygon points="' + q.map(function (z) { return n1(z[0]) + ',' + n1(z[1]); })
             .join(' ') + '" fill="' + ORANGE + '" fill-opacity="0.3" stroke="' + ORANGE +
             '" stroke-width="2.5"/>');
    }

    // les deux côtés
    [a0, a1].forEach(function (a) {
      var p = P(a, L);
      s.push('<line x1="' + n1(cx) + '" y1="' + n1(cy) + '" x2="' + n1(p[0]) + '" y2="' +
             n1(p[1]) + '" stroke="' + BLEU + '" stroke-width="3" stroke-linecap="round"/>');
    });

    // le sommet, puis les noms
    s.push('<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="4.5" fill="' + ENCRE + '"/>');
    if (o.noms) {
      var e1 = P(a0, L + 18), e2 = P(a1, L + 18);
      s.push('<circle cx="' + n1(P(a0, L)[0]) + '" cy="' + n1(P(a0, L)[1]) + '" r="4" fill="' + BLEU + '"/>');
      s.push('<circle cx="' + n1(P(a1, L)[0]) + '" cy="' + n1(P(a1, L)[1]) + '" r="4" fill="' + BLEU + '"/>');
      s.push(texte(e1[0], e1[1] + 5, o.noms[0], BLEU, 17));
      s.push(texte(e2[0], e2[1] + 5, o.noms[2], BLEU, 17));
      s.push(texte(cx, cy + 24, o.noms[1], ENCRE, 17));
    }
    if (o.valeur) {
      var m = P((a0 + a1) / 2, R + 26);
      s.push(texte(m[0], m[1] + 5, o.valeur, ORANGE, 19));
    }

    s.push('</svg>');
    return s.join('');
  }

  /* ===================================================================== */
  /* 2. Un rapporteur posé sur un angle                                    */
  /* ===================================================================== */
  /*
   * o = {
   *   mesure : la MESURE de l'angle (ce qu'on cherche) ;
   *   base   : 'droite' (le 0 est à droite) ou 'gauche' ;
   *   deux   : afficher les deux graduations (défaut true).
   * }
   * Le côté de référence est posé sur le 0 ; l'autre côté est donc à l'angle
   * physique `mesure` si la base est à droite, et 180 − `mesure` sinon. Dans
   * les deux cas il croise le bord sur les nombres { mesure ; 180 − mesure } :
   * c'est tout le problème, et c'est ce que l'élève doit trancher.
   */
  function rapporteurFig(o) {
    var W = 430, H = 265, cx = W / 2, cy = 232, R = 170;
    var deux = o.deux !== false;
    var phys = o.base === 'gauche' ? 180 - o.mesure : o.mesure;
    var ref = o.base === 'gauche' ? 180 : 0;
    function P(a, r) { return [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))]; }

    var s = [svgOuvre(W, H, 'Un rapporteur posé sur un angle de sommet O.')];

    // le corps du rapporteur
    var demi = [];
    for (var t = 0; t <= 90; t++) {
      var p = P(180 * t / 90, R);
      demi.push(n1(p[0]) + ',' + n1(p[1]));
    }
    s.push('<path d="M ' + n1(cx - R) + ' ' + n1(cy) + ' L ' + demi.join(' L ') +
           ' Z" fill="#f8fafc" stroke="' + GRIS + '" stroke-width="2"/>');

    // les graduations : un petit trait tous les 5°, un grand tous les 10°
    var a;
    for (a = 0; a <= 180; a += 5) {
      var lg = (a % 10 === 0) ? 15 : 8;
      var p1 = P(a, R), p2 = P(a, R - lg);
      s.push('<line x1="' + n1(p1[0]) + '" y1="' + n1(p1[1]) + '" x2="' + n1(p2[0]) +
             '" y2="' + n1(p2[1]) + '" stroke="' + GRIS + '" stroke-width="' +
             (a % 10 === 0 ? 1.6 : 1) + '"/>');
    }
    // L'angle posé dessus : le côté de référence, puis l'autre. Ils sont tracés
    // AVANT les nombres, comme sur un vrai rapporteur transparent où les
    // graduations sont imprimées par-dessus le trait — sinon le trait barre les
    // nombres qu'on doit justement lire.
    [ref, phys].forEach(function (ang, i) {
      var p = P(ang, R + 14);
      s.push('<line x1="' + n1(cx) + '" y1="' + n1(cy) + '" x2="' + n1(p[0]) + '" y2="' +
             n1(p[1]) + '" stroke="' + (i ? VIOLET : ENCRE) + '" stroke-width="3.5" ' +
             'stroke-linecap="round"/>');
    });

    // les nombres : la graduation bleue (0 à droite) et, s'il y a lieu, la rose
    for (a = 0; a <= 180; a += 10) {
      var pb = P(a, R - 26);
      s.push(texte(pb[0], pb[1] + 4, String(a), BLEU, 11));
      if (deux) {
        var pr = P(a, R - 48);
        s.push(texte(pr[0], pr[1] + 4, String(180 - a), ROSE, 11));
      }
    }

    // le repère de lecture, là où le second côté croise le bord gradué
    var pl = P(phys, R);
    s.push('<circle cx="' + n1(pl[0]) + '" cy="' + n1(pl[1]) + '" r="5" fill="' + VIOLET + '"/>');
    s.push('<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="5" fill="' + ENCRE + '"/>');
    s.push(texte(cx, cy + 22, 'O', ENCRE, 16));

    s.push('</svg>');
    return s.join('');
  }

  /* ===================================================================== */
  /* 3. Une configuration de droites, avec son codage                      */
  /* ===================================================================== */
  /*
   * o = {
   *   lignes  : [{ p:[x,y], u:[dx,dy], nom:'(d_1)' }]  en repère mathématique ;
   *   equerres: [{ p:[x,y], u, v }]  le petit carré de l'angle droit ;
   *   chevrons: [{ p:[x,y], u, n }]  n chevrons, codage du parallélisme.
   * }
   * Le repère va de −10 à 10 en x et de −6,5 à 6,5 en y ; les droites sont
   * prolongées jusqu'au bord du cadre.
   */
  function droitesFig(o) {
    var W = 420, H = 280, X0 = -10, X1 = 10, Y0 = -6.5, Y1 = 6.5;
    var k = Math.min(W / (X1 - X0), H / (Y1 - Y0));
    function X(p) { return n1(W / 2 + p[0] * k); }
    function Y(p) { return n1(H / 2 - p[1] * k); }

    var s = [svgOuvre(W, H, 'Trois droites et leur codage.')];

    (o.lignes || []).forEach(function (l) {
      // On prolonge la droite bien au-delà du cadre : le rendu la coupe.
      var n = Math.sqrt(l.u[0] * l.u[0] + l.u[1] * l.u[1]);
      var u = [l.u[0] / n, l.u[1] / n], T = 30;
      var a = [l.p[0] - T * u[0], l.p[1] - T * u[1]];
      var b = [l.p[0] + T * u[0], l.p[1] + T * u[1]];
      s.push('<line x1="' + X(a) + '" y1="' + Y(a) + '" x2="' + X(b) + '" y2="' + Y(b) +
             '" stroke="' + (l.couleur || BLEU) + '" stroke-width="2.5" stroke-linecap="round"/>');
    });

    (o.equerres || []).forEach(function (e) {
      var r = 0.62;
      var un = norme(e.u, r), vn = norme(e.v, r);
      var q = [e.p, add(e.p, un), add(add(e.p, un), vn), add(e.p, vn)];
      s.push('<polygon points="' + q.map(function (z) { return X(z) + ',' + Y(z); }).join(' ') +
             '" fill="' + ORANGE + '" fill-opacity="0.3" stroke="' + ORANGE +
             '" stroke-width="2.5"/>');
    });

    (o.chevrons || []).forEach(function (c) {
      var u = norme(c.u, 1), nn = [-u[1], u[0]];
      for (var i = 0; i < (c.n || 1); i++) {
        var b = add(c.p, norme(u, i * 0.55));
        var pts = [add(add(b, norme(u, -0.28)), norme(nn, 0.34)), b,
                   add(add(b, norme(u, -0.28)), norme(nn, -0.34))];
        s.push('<polyline points="' + pts.map(function (z) { return X(z) + ',' + Y(z); })
               .join(' ') + '" fill="none" stroke="' + VIOLET + '" stroke-width="2.5"/>');
      }
    });

    // les noms des droites, posés près d'un bord du cadre
    (o.lignes || []).forEach(function (l) {
      if (!l.nom) return;
      var n = Math.sqrt(l.u[0] * l.u[0] + l.u[1] * l.u[1]);
      var u = [l.u[0] / n, l.u[1] / n];
      // on avance le long de la droite jusqu'à sortir presque du cadre
      var t = 0;
      while (t < 40) {
        var q = [l.p[0] + t * u[0], l.p[1] + t * u[1]];
        if (q[0] > X1 - 1.4 || q[0] < X0 + 1.4 || q[1] > Y1 - 0.9 || q[1] < Y0 + 0.9) break;
        t += 0.1;
      }
      var pos = [l.p[0] + t * u[0], l.p[1] + t * u[1]];
      var dec = [-0.7 * u[0] + 0.55 * -u[1], -0.7 * u[1] + 0.55 * u[0]];
      s.push(texte(X(add(pos, dec)), Y(add(pos, dec)) + 5, l.nom, l.couleur || BLEU, 15));
    });

    s.push('</svg>');
    return s.join('');
  }

  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function norme(u, r) {
    var n = Math.sqrt(u[0] * u[0] + u[1] * u[1]) || 1;
    return [u[0] / n * r, u[1] / n * r];
  }

  /* ===================================================================== */
  /* La nature d'un angle, d'après sa mesure                               */
  /* ===================================================================== */
  var NATURES = [
    { cle: 'nul', nom: 'nul', test: function (a) { return a === 0; } },
    { cle: 'aigu', nom: 'aigu', test: function (a) { return a > 0 && a < 90; } },
    { cle: 'droit', nom: 'droit', test: function (a) { return a === 90; } },
    { cle: 'obtus', nom: 'obtus', test: function (a) { return a > 90 && a < 180; } },
    { cle: 'plat', nom: 'plat', test: function (a) { return a === 180; } }
  ];
  function nature(a) {
    for (var i = 0; i < NATURES.length; i++) if (NATURES[i].test(a)) return NATURES[i];
    return NATURES[1];
  }

  global.GeoOutils = {
    angleFig: angleFig, rapporteurFig: rapporteurFig, droitesFig: droitesFig,
    nature: nature, NATURES: NATURES, texte: texte
  };

})(window);
