/*
 * Un repère de GRANDEURS, en SVG — pour la proportionnalité (5ème).
 *
 * ---------------------------------------------------------------------------
 * Pourquoi pas `repere-outils.js`
 * ---------------------------------------------------------------------------
 * L'autre module dessine des repères à carreaux carrés, et il a raison : une
 * symétrie centrale doit ressembler à une symétrie centrale. Ici, on porte des
 * grandeurs — 8 litres d'un côté, 21 euros de l'autre. Imposer la même unité
 * aux deux axes donnerait une figure trois fois plus haute que large, illisible.
 * Les deux échelles sont donc INDÉPENDANTES, comme sur les graphiques des
 * manuels, et chaque axe porte le nom de sa grandeur.
 *
 * Cela ne change rien à ce que la figure prouve : l'alignement et le passage
 * par l'origine se conservent quand on étire un axe. Une droite reste une
 * droite, l'origine reste l'origine. Seule l'inclinaison apparente change —
 * c'est dit dans les notes de la leçon.
 *
 * ---------------------------------------------------------------------------
 * Le premier quadrant, et rien d'autre
 * ---------------------------------------------------------------------------
 * Les situations de proportionnalité de cinquième portent sur des quantités
 * positives. L'origine est donc toujours en bas à gauche, et TOUJOURS visible :
 * c'est elle qu'on doit pouvoir regarder pour trancher.
 *
 * Le pas de graduation n'est pas choisi par l'appelant mais calculé, dans la
 * suite 1, 2, 5, 10, 20, 50… de façon à obtenir entre cinq et douze divisions.
 * Un axe gradué de 1 en 1 jusqu'à 21 serait une bouillie de chiffres.
 *
 * À charger APRÈS exos/outils.js, et AVANT les générateurs qui s'en servent.
 */
(function (global) {
  'use strict';
  var O = global.ExosOutils;

  var W = 420, H = 330;
  var MG = 46, MD = 18, MH = 20, MB = 44;      // marges gauche, droite, haut, bas
  var GRILLE = '#e2e8f0', AXE = '#94a3b8', NOM = '#475569';

  function fr(v) { return O ? O.fr(v) : String(v); }
  function n1(v) { return Math.round(v * 10) / 10; }

  /* Le pas de graduation : le premier de 1, 2, 5, 10, 20, 50… qui donne au plus
     douze divisions. En dessous de cinq divisions l'axe paraît vide, on redescend
     donc d'un cran tant que c'est possible. */
  function pas(max) {
    var bases = [1, 2, 5], k = 1, i = 0, p;
    for (var essai = 0; essai < 40; essai++) {
      p = bases[i] * k;
      if (max / p <= 12) break;
      i++;
      if (i === 3) { i = 0; k *= 10; }
    }
    return p;
  }

  /*
   * o = {
   *   points   : [{ p:[x,y], couleur, nom }]
   *   joindre  : true    relie les points consécutifs, dans l'ordre donné
   *   droite   : { k }   la droite y = kx, tracée depuis l'origine
   *   guides   : [x]     les pointillés qui mènent de l'axe au point d'abscisse x
   *   gx, gy   : les noms des deux grandeurs, écrits le long des axes
   *   xmax, ymax : le haut des axes (sinon calculé à partir des points)
   * }
   */
  function repere(o) {
    var pts = (o.points || []).map(function (q) { return q.p; });
    var xm = o.xmax, ym = o.ymax;
    if (xm === undefined) {
      xm = Math.max.apply(null, pts.map(function (p) { return p[0]; }).concat([1]));
    }
    if (ym === undefined) {
      ym = Math.max.apply(null, pts.map(function (p) { return p[1]; }).concat([1]));
    }
    var px = pas(xm), py = pas(ym);
    // on monte jusqu'à la graduation suivante, pour que le dernier point ne
    // touche pas le bord
    var x1 = Math.ceil((xm + px * 0.35) / px) * px;
    var y1 = Math.ceil((ym + py * 0.35) / py) * py;

    function X(x) { return n1(MG + x / x1 * (W - MG - MD)); }
    function Y(y) { return n1(H - MB - y / y1 * (H - MB - MH)); }

    var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="max-width:' + W + 'px;width:100%;height:auto;display:block;margin:0.7rem auto" ' +
      'role="img" aria-label="Un graphique portant des points dans un repère.">'];

    // 1. le quadrillage
    var i;
    for (i = 0; i <= x1 + 1e-9; i += px) {
      s.push('<line x1="' + X(i) + '" y1="' + Y(0) + '" x2="' + X(i) + '" y2="' + Y(y1) +
             '" stroke="' + GRILLE + '" stroke-width="1"/>');
    }
    for (i = 0; i <= y1 + 1e-9; i += py) {
      s.push('<line x1="' + X(0) + '" y1="' + Y(i) + '" x2="' + X(x1) + '" y2="' + Y(i) +
             '" stroke="' + GRILLE + '" stroke-width="1"/>');
    }

    // 2. les axes, et leurs graduations
    s.push('<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(x1) + '" y2="' + Y(0) +
           '" stroke="' + AXE + '" stroke-width="1.8"/>');
    s.push('<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(0) + '" y2="' + Y(y1) +
           '" stroke="' + AXE + '" stroke-width="1.8"/>');
    for (i = px; i <= x1 + 1e-9; i += px) {
      s.push(texte(X(i), Y(0) + 16, fr(i), AXE, 11));
    }
    for (i = py; i <= y1 + 1e-9; i += py) {
      s.push(texte(X(0) - 15, Y(i) + 4, fr(i), AXE, 11, 'end'));
    }
    s.push(texte(X(0) - 10, Y(0) + 16, '0', AXE, 11));

    // 3. les noms des grandeurs
    if (o.gx) s.push(texte(X(x1), Y(0) + 33, o.gx, NOM, 12, 'end'));
    if (o.gy) s.push(texte(X(0) - 38, Y(y1) - 8, o.gy, NOM, 12, 'start'));

    // 4. la droite passant par l'origine, sous les points
    if (o.droite) {
      var k = o.droite.k;
      // on l'arrête au bord du cadre, quel que soit celui qu'elle atteint d'abord
      var xf = Math.min(x1, y1 / k);
      s.push('<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(xf) + '" y2="' +
             Y(k * xf) + '" stroke="' + (o.droite.couleur || '#2563eb') +
             '" stroke-width="2.4"/>');
    }

    // 5. les pointillés de lecture
    (o.guides || []).forEach(function (g) {
      s.push('<path d="M ' + X(g.x) + ' ' + Y(0) + ' L ' + X(g.x) + ' ' + Y(g.y) + ' L ' +
             X(0) + ' ' + Y(g.y) + '" fill="none" stroke="' + (g.couleur || '#94a3b8') +
             '" stroke-width="1.6" stroke-dasharray="5 4"/>');
    });

    // 6. le tracé qui relie les points
    if (o.joindre && pts.length > 1) {
      s.push('<polyline points="' + pts.map(function (p) { return X(p[0]) + ',' + Y(p[1]); })
             .join(' ') + '" fill="none" stroke="' + (o.couleurJoint || '#2563eb') +
             '" stroke-width="2.4" stroke-linejoin="round"/>');
    }

    // 7. les points
    (o.points || []).forEach(function (q) {
      var c = q.couleur || '#dc2626';
      s.push('<circle cx="' + X(q.p[0]) + '" cy="' + Y(q.p[1]) + '" r="4.5" fill="' + c + '"/>');
      if (q.nom) s.push(texte(X(q.p[0]) + 12, Y(q.p[1]) - 10, q.nom, c, 14));
    });

    s.push('</svg>');
    return s.join('');
  }

  // Un texte lisible même par-dessus la grille : liseré blanc.
  function texte(x, y, t, col, taille, ancre) {
    return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + (taille || 13) +
           '" font-weight="700" font-family="system-ui, sans-serif" fill="' + col +
           '" stroke="#fff" stroke-width="3.5" paint-order="stroke" text-anchor="' +
           (ancre || 'middle') + '">' + t + '</text>';
  }

  global.MathsGraphique = { repere: repere, pas: pas };
})(this);
