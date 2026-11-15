/*
 * Jeu — Rendez-vous à Marseille (2nde) : les points remarquables du triangle
 * sur un plan de la ville.
 *
 * Trois amis sont en A, B et C, quelque part dans un quartier de Marseille.
 * La mission donne le lieu du rendez-vous par une propriété géométrique ;
 * l'élève trace sur le plan avec une règle graduée, une équerre et un compas
 * (ou estime à l'œil), pose le point RDV, puis valide :
 *
 *   - « au centre de gravité du triangle ABC »        → concours des médianes
 *   - « à l'orthocentre du triangle ABC »             → concours des hauteurs
 *   - « au centre du cercle circonscrit… »            → concours des médiatrices
 *     ou « à égale distance des points A, B et C »
 *   - « au centre du cercle inscrit… »                → concours des bissectrices
 *     ou « à égale distance des côtés du triangle ABC »
 *
 * Les six formulations passent toutes avant de revenir (un sac mélangé, pas
 * un tirage indépendant). À la validation, le jeu mesure l'écart EN MÈTRES
 * (le plan a une échelle), donne de zéro à trois étoiles, trace la
 * construction — les trois droites, et le cercle s'il y en a un — et montre
 * les trois autres points remarquables : si l'élève est tombé plus près de
 * l'un d'eux, le jeu le lui dit (« tu as peut-être confondu médianes et
 * médiatrices »). Un indice rappelle quelles droites tracer et en dessine
 * une, contre une étoile.
 *
 * LES OUTILS. La règle trace la droite passant par deux points cliqués et
 * marque le milieu du segment (elle est graduée) ; l'équerre trace la
 * perpendiculaire à un côté ou à une droite, par un point ; le compas trace
 * un cercle (centre, puis un point), dont le rayon est tracé et coté en
 * mètres, et peut garder son écartement. Chaque
 * clic s'accroche aux sommets, aux milieux marqués et aux intersections des
 * tracés ; le point RDV aussi. De quoi construire : une médiane (règle sur
 * un côté → milieu, règle du sommet au milieu), une hauteur (équerre), une
 * médiatrice (deux cercles de même rayon, règle par leurs intersections),
 * une bissectrice (un cercle au sommet, deux cercles de même écartement sur
 * les côtés, règle).
 *
 * Le triangle est tiré au hasard, mais pas n'importe comment : jamais
 * rectangle (aucun angle à moins de 10° de l'angle droit), ni trop plat,
 * ni presque équilatéral (les quatre points y seraient confondus et le jeu
 * ne distinguerait plus rien) — les quatre points sont dans le plan et à
 * bonne distance les uns des autres.
 *
 * LE PLAN. Huit quartiers, chacun fait de 4 × 3 tuiles OpenStreetMap de
 * 256 px (zoom 16) rangées dans cartes/marseille/<quartier>/ : rien n'est
 * demandé au réseau. Les coordonnées de la figure sont les pixels du plan
 * (1024 × 768) ; `mpp` est le nombre de mètres par pixel à cette latitude.
 * © les contributeurs d'OpenStreetMap — la mention est affichée sur le plan.
 */
MathsView.register({
  id: 'rendez-vous-marseille',
  title: 'Jeu — Rendez-vous à Marseille',
  level: '2nde',
  category: 'geometrie',
  subcategory: 'Figures planes',
  theme: 'Jeu de repérage — les points remarquables du triangle sur un plan de Marseille',
  description:
    'Trois amis sont en <strong>A</strong>, <strong>B</strong> et <strong>C</strong>, dans un ' +
    'quartier de Marseille. La mission dit où ils se retrouvent : au <strong>centre de ' +
    'gravité</strong>, à l\'<strong>orthocentre</strong>, au centre du <strong>cercle ' +
    'circonscrit</strong> ou du <strong>cercle inscrit</strong> du triangle ABC — parfois ' +
    'sans le nommer : « à égale distance des points A, B et C », « à égale distance des ' +
    'côtés du triangle ».' +
    '<br>Tu as une <strong>règle graduée</strong> (elle trace la droite et marque le milieu), une ' +
    '<strong>équerre</strong> (la perpendiculaire à un côté, par un point) et un <strong>compas</strong> ' +
    '(qui peut garder son écartement) pour tracer sur le plan médianes, hauteurs, médiatrices ou bissectrices.' +
    '<br><strong>Déplace ensuite le point RDV</strong> — il s\'accroche aux intersections de tes tracés — ' +
    'puis <strong>valide</strong> : le jeu mesure ton écart en mètres, montre la construction et te donne ' +
    'jusqu\'à trois étoiles. Un <strong>indice</strong> coûte une étoile.',
  notes:
    '<ul>' +
    '<li><strong>Centre de gravité G</strong> : point de concours des <strong>médianes</strong> ' +
    '(sommet → milieu du côté opposé). Il est aux deux tiers de chaque médiane en partant du sommet, ' +
    'toujours à l\'intérieur. Voir <a href="#medianes-triangle">Les médianes d\'un triangle</a>.</li>' +
    '<li><strong>Orthocentre H</strong> : point de concours des <strong>hauteurs</strong> ' +
    '(sommet → perpendiculaire au côté opposé). Il sort du triangle quand un angle est obtus. ' +
    'Voir <a href="#hauteurs-triangle">Les hauteurs d\'un triangle</a>.</li>' +
    '<li><strong>Centre du cercle circonscrit O</strong> : point de concours des ' +
    '<strong>médiatrices</strong> des côtés. C\'est le point <strong>à égale distance des trois ' +
    'sommets</strong> — le cercle passe par A, B et C. ' +
    'Voir <a href="#mediatrices-triangle">Les médiatrices et le cercle circonscrit</a>.</li>' +
    '<li><strong>Centre du cercle inscrit I</strong> : point de concours des ' +
    '<strong>bissectrices</strong> des angles. C\'est le point <strong>à égale distance des trois ' +
    'côtés</strong> — le cercle touche chaque côté. ' +
    'Voir <a href="#bissectrices-triangle">Les bissectrices et le cercle inscrit</a>.</li>' +
    '<li><strong>Ne pas confondre</strong> : médiane et médiatrice passent toutes deux par le ' +
    'milieu d\'un côté, mais la médiane part du sommet opposé, la médiatrice est perpendiculaire au côté.</li>' +
    '<li>Les plans sont ceux d\'<strong>OpenStreetMap</strong> (© les contributeurs d\'OpenStreetMap).</li>' +
    '</ul>',
  board: {
    boundingbox: [0, 768, 1024, 0], keepaspectratio: true,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Les points remarquables du triangle',
    figures: [{
      legende: 'G médianes · H hauteurs · O médiatrices · I bissectrices.',
      boundingbox: [-0.6, 6.6, 9.6, -0.8],
      keepaspectratio: true,
      largeur: 60, hauteur: 44,
      dessine: function (board) {
        var g = '#334155', A = [0.4, 0.2], B = [8.6, 0.6], C = [1.6, 5.8];
        board.create('polygon', [A, B, C], { fillColor: '#e2e8f0', fillOpacity: 0.4, fixed: true, highlight: false,
          vertices: { visible: false }, borders: { strokeColor: g, strokeWidth: 1.4, fixed: true, highlight: false } });
        function t(x, y, s, col) { board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: col || g, cssStyle: 'font-weight:800', fixed: true, highlight: false }); }
        t(A[0] - 0.3, A[1] - 0.3, 'A'); t(B[0] + 0.35, B[1] - 0.25, 'B'); t(C[0] - 0.1, C[1] + 0.4, 'C');
        var a = Math.hypot(B[0] - C[0], B[1] - C[1]), b = Math.hypot(A[0] - C[0], A[1] - C[1]), c = Math.hypot(A[0] - B[0], A[1] - B[1]);
        var G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
        var I = [(a * A[0] + b * B[0] + c * C[0]) / (a + b + c), (a * A[1] + b * B[1] + c * C[1]) / (a + b + c)];
        var d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
        var sa = A[0] * A[0] + A[1] * A[1], sb = B[0] * B[0] + B[1] * B[1], sc = C[0] * C[0] + C[1] * C[1];
        var O = [(sa * (B[1] - C[1]) + sb * (C[1] - A[1]) + sc * (A[1] - B[1])) / d, (sa * (C[0] - B[0]) + sb * (A[0] - C[0]) + sc * (B[0] - A[0])) / d];
        var H = [A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]];
        [[G, 'G', '#2563eb'], [H, 'H', '#ea580c'], [O, 'O', '#0d9488'], [I, 'I', '#7c3aed']].forEach(function (p) {
          board.create('point', p[0], { name: '', size: 2.5, fillColor: p[2], strokeColor: p[2], fixed: true, highlight: false, showInfobox: false });
          t(p[0][0] + 0.32, p[0][1] + 0.32, p[1], p[2]);
        });
      }
    }],
    points: [
      '<b>Centre de gravité G</b> : concours des <b>médianes</b> (sommet → milieu du côté opposé).',
      '<b>Orthocentre H</b> : concours des <b>hauteurs</b> (sommet → perpendiculaire au côté opposé).',
      '<b>Centre du cercle circonscrit O</b> : concours des <b>médiatrices</b> — <b>à égale distance des trois sommets</b>.',
      '<b>Centre du cercle inscrit I</b> : concours des <b>bissectrices</b> — <b>à égale distance des trois côtés</b>.',
      'Médiane ≠ médiatrice : toutes deux passent par le milieu d\'un côté, seule la médiatrice lui est perpendiculaire.'
    ],
    exemples: [
      '« À égale distance de A, B et C » : c\'est O, le centre du cercle qui passe par les trois sommets.',
      '« À égale distance des côtés » : c\'est I, le centre du cercle qui touche les trois côtés.',
      'G et I sont toujours dans le triangle ; O et H en sortent quand un angle est obtus.'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Les plans, les missions                                               */
    /* ==================================================================== */
    var W = 1024, Hh = 768;
    var CARTES = [
      { slug: 'vieux-port', nom: 'Le Vieux-Port', mpp: 1.7385 },
      { slug: 'panier', nom: 'Le Panier et la Joliette', mpp: 1.7384 },
      { slug: 'garde', nom: 'Notre-Dame de la Garde', mpp: 1.7389 },
      { slug: 'cours-julien', nom: 'Le cours Julien et la Plaine', mpp: 1.7385 },
      { slug: 'castellane', nom: 'Castellane et la Préfecture', mpp: 1.7388 },
      { slug: 'endoume', nom: 'Endoume et le vallon des Auffes', mpp: 1.7388 },
      { slug: 'longchamp', nom: 'Longchamp et les Cinq-Avenues', mpp: 1.7383 },
      { slug: 'prado', nom: 'Le Prado', mpp: 1.7392 }
    ];
    // les six formulations : `cle` est le point attendu, `nomme` dit si la mission le nomme
    var FORMULES = [
      { cle: 'G', nomme: true, lieu: 'au <b>centre de gravité</b> du triangle ABC' },
      { cle: 'H', nomme: true, lieu: 'à l\'<b>orthocentre</b> du triangle ABC' },
      { cle: 'O', nomme: true, lieu: 'au <b>centre du cercle circonscrit</b> au triangle ABC' },
      { cle: 'O', nomme: false, lieu: '<b>à égale distance des points A, B et C</b>' },
      { cle: 'I', nomme: true, lieu: 'au <b>centre du cercle inscrit</b> dans le triangle ABC' },
      { cle: 'I', nomme: false, lieu: '<b>à égale distance des côtés</b> du triangle ABC' }
    ];
    var POINTS = {
      G: { nom: 'le centre de gravité', droites: 'médianes', col: '#2563eb',
           rappel: 'Le centre de gravité est le point de concours des <b>médianes</b> : chacune joint un sommet au milieu du côté opposé.' },
      H: { nom: 'l\'orthocentre', droites: 'hauteurs', col: '#ea580c',
           rappel: 'L\'orthocentre est le point de concours des <b>hauteurs</b> : chacune part d\'un sommet, perpendiculairement au côté opposé.' },
      O: { nom: 'le centre du cercle circonscrit', droites: 'médiatrices', col: '#0d9488',
           rappel: 'Le point à égale distance des trois sommets est le centre du cercle circonscrit : le point de concours des <b>médiatrices</b> des côtés.' },
      I: { nom: 'le centre du cercle inscrit', droites: 'bissectrices', col: '#7c3aed',
           rappel: 'Le point à égale distance des trois côtés est le centre du cercle inscrit : le point de concours des <b>bissectrices</b> des angles.' }
    };
    var AMIS = ['Amina', 'Lucas', 'Chloé', 'Mehdi', 'Inès', 'Hugo', 'Sarah', 'Nolan', 'Léa', 'Yanis', 'Jade', 'Enzo'];
    var C_RDV = '#db2777', INK = '#0f172a', C_OK = '#16a34a', C_NO = '#dc2626';
    var HALO = 'font-weight:800;background:rgba(255,255,255,.93);padding:0 5px;border-radius:6px;white-space:nowrap;box-shadow:0 0 0 1px rgba(15,23,42,.18)';

    function alea(n) { return Math.floor(Math.random() * n); }
    function melange(t) { t = t.slice(); for (var i = t.length - 1; i > 0; i--) { var j = alea(i + 1), x = t[i]; t[i] = t[j]; t[j] = x; } return t; }
    function fmt(v) { return String(v).replace('-', '−').replace('.', ','); }

    /* ==================================================================== */
    /* La géométrie du triangle                                              */
    /* ==================================================================== */
    function dist(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
    function milieu(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }
    // le pied de la perpendiculaire abaissée de v sur (pq)
    function pied(v, p, q) {
      var dx = q[0] - p[0], dy = q[1] - p[1], t = ((v[0] - p[0]) * dx + (v[1] - p[1]) * dy) / (dx * dx + dy * dy);
      return [p[0] + t * dx, p[1] + t * dy];
    }
    function centres(A, B, C) {
      var a = dist(B, C), b = dist(A, C), c = dist(A, B);
      var d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
      var sa = A[0] * A[0] + A[1] * A[1], sb = B[0] * B[0] + B[1] * B[1], sc = C[0] * C[0] + C[1] * C[1];
      var O = [(sa * (B[1] - C[1]) + sb * (C[1] - A[1]) + sc * (A[1] - B[1])) / d,
               (sa * (C[0] - B[0]) + sb * (A[0] - C[0]) + sc * (B[0] - A[0])) / d];
      return {
        G: [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3],
        O: O,
        H: [A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]],
        I: [(a * A[0] + b * B[0] + c * C[0]) / (a + b + c), (a * A[1] + b * B[1] + c * C[1]) / (a + b + c)],
        R: dist(O, A), r: Math.abs(d) / 2 / (a + b + c), L: Math.max(a, b, c)
      };
    }
    // un triangle jouable : ni plat, ni presque équilatéral, les quatre points dans le plan et bien séparés
    function jouable(A, B, C) {
      var a = dist(B, C), b = dist(A, C), c = dist(A, B), L = Math.max(a, b, c), l = Math.min(a, b, c);
      if (l < 260 || L > 720) return false;
      // les trois angles, en degrés : aucun à moins de 10° de l'angle droit (dans un
      // triangle rectangle, l'orthocentre est un sommet et O le milieu de l'hypoténuse :
      // il n'y a plus rien à construire), et pas d'angle trop obtus
      var ang = [[a, b, c], [b, c, a], [c, a, b]].map(function (s) {
        return Math.acos((s[1] * s[1] + s[2] * s[2] - s[0] * s[0]) / (2 * s[1] * s[2])) * 180 / Math.PI;
      });
      if (ang.some(function (g) { return Math.abs(g - 90) < 10 || g > 112; })) return false;
      var aire = Math.abs(A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])) / 2;
      if (2 * aire / L < 200) return false;                                            // hauteur minimale : pas de triangle plat
      var K = centres(A, B, C), P = [K.G, K.H, K.O, K.I];
      for (var i = 0; i < 4; i++) {
        if (P[i][0] < 45 || P[i][0] > W - 45 || P[i][1] < 60 || P[i][1] > Hh - 45) return false;
        for (var j = i + 1; j < 4; j++) if (dist(P[i], P[j]) < 0.11 * L) return false;
      }
      return true;
    }
    function tireTriangle() {
      for (var n = 0; n < 4000; n++) {
        var T = [0, 1, 2].map(function () { return [90 + Math.random() * (W - 180), 95 + Math.random() * (Hh - 190)]; });
        if (jouable(T[0], T[1], T[2])) return T;
      }
      return [[190, 170], [840, 250], [430, 650]];                                    // un triangle sûr (acutangle), au cas où
    }
    // les trois droites de la construction du point `cle` : des couples d'extrémités
    function construction(cle, A, B, C, K) {
      var S = [[A, B, C], [B, C, A], [C, A, B]];                                     // [sommet, côté opposé]
      return S.map(function (s) {
        var v = s[0], p = s[1], q = s[2];
        if (cle === 'G') return [v, milieu(p, q)];
        if (cle === 'I') { var u = dist(v, p), w = dist(v, q); return [v, [(w * p[0] + u * q[0]) / (u + w), (w * p[1] + u * q[1]) / (u + w)]]; }
        if (cle === 'H') {
          var f = pied(v, p, q), pts = [v, f, K.H], dx = f[0] - v[0], dy = f[1] - v[1];
          pts.sort(function (m, n) { return (m[0] * dx + m[1] * dy) - (n[0] * dx + n[1] * dy); });
          return [pts[0], pts[2]];
        }
        var m = milieu(p, q), len = Math.max(dist(m, K.O) + 45, 130), nx = -(q[1] - p[1]) / dist(p, q), ny = (q[0] - p[0]) / dist(p, q);
        return [[m[0] - nx * len, m[1] - ny * len], [m[0] + nx * len, m[1] + ny * len]];
      });
    }

    /* ==================================================================== */
    /* L'état d'une mission                                                  */
    /* ==================================================================== */
    var E = { n: 0, etoiles: 0, jouees: 0, carte: CARTES[0], T: [[190, 170], [840, 250], [430, 650]], K: null,
              formule: FORMULES[0], amis: ['Amina', 'Lucas', 'Chloé'], phase: 'jeu', indice: false, rdv: [W / 2, 70], verdict: null };
    E.K = centres(E.T[0], E.T[1], E.T[2]);
    var sacFormules = [], sacCartes = [];
    function cible() { return E.K[E.formule.cle]; }
    function traits() { return construction(E.formule.cle, E.T[0], E.T[1], E.T[2], E.K); }

    /* ==================================================================== */
    /* La figure                                                             */
    /* ==================================================================== */
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) { o._mv[key] = val; var t = {}; t[key] = val; o.setAttribute(t); }
    }
    function show(o, v) { attr(o, 'visible', !!v); }
    function pt(fx, fy) { return board.create('point', [fx, fy], { visible: false, fixed: true, name: '', withLabel: false }); }
    function etiq(fx, fy, txt, col, taille, opts) {
      var o = { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 13, color: col, cssStyle: HALO, fixed: true, highlight: false, layer: 9 };
      for (var k in (opts || {})) o[k] = opts[k];
      return board.create('text', [fx, fy, txt], o);
    }

    // Le plan : 4 × 3 tuiles de 256 px.
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) (function (r, c) {
      var im = board.create('image', [function () { return 'cartes/marseille/' + E.carte.slug + '/r' + r + 'c' + c + '.png'; },
                                      [c * 256, Hh - (r + 1) * 256], [256, 256]], { fixed: true, highlight: false, layer: 0 });
      im.mvRole = 'tuile';
    })(r, c);
    etiq(W - 8, 12, '© les contributeurs d\'OpenStreetMap', '#475569', 9, { anchorX: 'right', cssStyle: 'background:rgba(255,255,255,.85);padding:0 4px;border-radius:4px;white-space:nowrap' });
    // l'échelle : 200 m
    var eA = pt(18, 30), eB = pt(function () { return 18 + 200 / E.carte.mpp; }, 30);
    board.create('segment', [eA, eB], { strokeColor: INK, strokeWidth: 4, fixed: true, highlight: false, layer: 8 });
    etiq(function () { return 18 + 100 / E.carte.mpp; }, 48, '200 m', INK, 11);

    // Le triangle ABC.
    var SOM = [0, 1, 2].map(function (i) {
      return board.create('point', [function () { return E.T[i][0]; }, function () { return E.T[i][1]; }],
        { name: '', size: 7, face: 'o', fillColor: INK, strokeColor: '#fff', strokeWidth: 2.5, fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8 });
    });
    SOM.forEach(function (p, i) { p.mvRole = 'sommet-' + 'ABC'.charAt(i); });
    [[0, 1], [1, 2], [2, 0]].forEach(function (s) {
      board.create('segment', [SOM[s[0]], SOM[s[1]]], { strokeColor: INK, strokeWidth: 2.5, strokeOpacity: 0.85, fixed: true, highlight: false, layer: 5 });
    });
    // Les lettres, poussées vers l'extérieur du triangle. L'étiquette est ancrée par le
    // bord qui regarde le sommet (à gauche du sommet : ancrée à droite, etc.) : quelle
    // que soit sa largeur, elle ne recouvre jamais le point.
    function versDehors(i) { var g = E.K.G, p = E.T[i], d = dist(p, g) || 1; return [(p[0] - g[0]) / d, (p[1] - g[1]) / d]; }
    var NOMS = [0, 1, 2].map(function (i) {
      return etiq(function () { return E.T[i][0] + versDehors(i)[0] * 20; }, function () { return E.T[i][1] + versDehors(i)[1] * 20; },
                  function () { return 'ABC'.charAt(i) + ' · ' + E.amis[i]; }, INK, 14);
    });
    function ancreNoms() {
      NOMS.forEach(function (t, i) {
        var u = versDehors(i);
        attr(t, 'anchorX', u[0] > 0.38 ? 'left' : u[0] < -0.38 ? 'right' : 'middle');
        attr(t, 'anchorY', u[1] > 0.38 ? 'bottom' : u[1] < -0.38 ? 'top' : 'middle');
      });
    }

    // La correction : trois droites, un cercle, les quatre points.
    var TR = [0, 1, 2].map(function (i) {
      var s = board.create('segment', [pt(function () { return traits()[i][0][0]; }, function () { return traits()[i][0][1]; }),
                                       pt(function () { return traits()[i][1][0]; }, function () { return traits()[i][1][1]; })],
        { strokeColor: function () { return POINTS[E.formule.cle].col; }, strokeWidth: 2.5, dash: 2, fixed: true, highlight: false, layer: 6, visible: false });
      s.mvRole = 'trait';
      return s;
    });
    var centreCible = pt(function () { return cible()[0]; }, function () { return cible()[1]; });
    var CERCLE = board.create('circle', [centreCible, function () { return E.formule.cle === 'O' ? E.K.R : E.K.r; }],
      { strokeColor: function () { return POINTS[E.formule.cle].col; }, strokeWidth: 2, fillColor: 'none', fixed: true, highlight: false, layer: 6, visible: false });
    CERCLE.mvRole = 'cercle';
    var REP = {}, REPT = {};
    ['G', 'H', 'O', 'I'].forEach(function (k) {
      REP[k] = board.create('point', [function () { return E.K[k][0]; }, function () { return E.K[k][1]; }],
        { name: '', size: function () { return E.formule.cle === k ? 7 : 4; }, face: 'o', fillColor: POINTS[k].col, strokeColor: '#fff', strokeWidth: 2,
          fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false });
      REP[k].mvRole = 'repere-' + k;
      REPT[k] = etiq(function () { return E.K[k][0] + 13; }, function () { return E.K[k][1] + 13; }, k, POINTS[k].col, 13, { anchorX: 'left', anchorY: 'bottom' });
    });
    // l'écart entre le point de l'élève et le bon
    var ECART = board.create('segment', [pt(function () { return E.rdv[0]; }, function () { return E.rdv[1]; }), centreCible],
      { strokeColor: C_RDV, strokeWidth: 2, dash: 1, fixed: true, highlight: false, layer: 7, visible: false });

    // Le point de rendez-vous, à déplacer.
    var RDV = board.create('point', [E.rdv[0], E.rdv[1]], { name: '', size: 9, face: 'o', fillColor: C_RDV, strokeColor: '#fff', strokeWidth: 3,
      fixed: false, withLabel: false, showInfobox: false, layer: 9 });
    RDV.mvRole = 'rdv';
    etiq(function () { return E.rdv[0]; }, function () { return E.rdv[1] - 22; }, function () { return E.phase === 'jeu' ? 'RDV — déplace-moi' : 'ton RDV'; }, C_RDV, 12, { anchorY: 'top' });
    RDV.on('drag', function () {
      if (E.phase !== 'jeu') { RDV.setPosition(JXG.COORDS_BY_USER, E.rdv); return; }
      E.rdv = accroche([Math.max(10, Math.min(W - 10, RDV.X())), Math.max(10, Math.min(Hh - 10, RDV.Y()))], 14);
      RDV.setPosition(JXG.COORDS_BY_USER, E.rdv);
    });

    function refresh() {
      var fini = E.phase === 'corrige';
      TR.forEach(function (s, i) { show(s, fini || (E.indice && i === 0)); });
      show(CERCLE, fini && (E.formule.cle === 'O' || E.formule.cle === 'I'));
      ['G', 'H', 'O', 'I'].forEach(function (k) { show(REP[k], fini); show(REPT[k], fini); });
      show(ECART, fini);
      attr(RDV, 'fixed', fini || O.outil !== 'main');
      RDV.setPosition(JXG.COORDS_BY_USER, E.rdv);
    }

    /* ==================================================================== */
    /* Le panneau : la mission, le verdict, le score                         */
    /* ==================================================================== */
    function el(tag, cls, css) { var e = document.createElement(tag); if (cls) e.className = cls; if (css) e.style.cssText = css; return e; }
    var root = el('div', 'rdv-ui');
    var scoreEl = el('div', 'rdv-score', 'font-weight:700;color:#475569;margin:.2rem 0 .5rem');
    var missionEl = el('div', 'rdv-mission', 'background:#fff;border:1px solid #e2e8f0;border-left:5px solid ' + C_RDV + ';border-radius:12px;padding:.8rem 1rem;font-size:1.08rem;line-height:1.5;max-width:640px');
    var indiceEl = el('div', 'rdv-indice', 'margin:.6rem 0 0;max-width:640px;color:#92400e');
    var verdictEl = el('div', 'rdv-verdict', 'margin:.7rem 0 0;max-width:640px');
    root.appendChild(scoreEl); root.appendChild(missionEl); root.appendChild(indiceEl); root.appendChild(verdictEl);
    mv.extras.appendChild(root);

    /* ==================================================================== */
    /* La boîte à outils : règle graduée, équerre, compas                    */
    /* ==================================================================== */
    // Les tracés de l'élève sont un petit modèle — des droites { t:'d', p, q }
    // et des cercles { t:'c', c, r } — doublé des objets JSXGraph qui les
    // dessinent. Les points d'accroche sont recalculés à chaque tracé : les
    // sommets, les milieux marqués par la règle, et toutes les intersections
    // (côtés du triangle compris). On clique donc « sur » une intersection
    // sans avoir à viser au pixel.
    var ACCROCHE = 18;                                   // en pixels du plan
    var C_TRACE = '#1d4ed8';
    var O = { outil: 'main', attente: null, souris: null, ecart: null, memeEcart: false, actions: [], accroches: [], message: '' };

    function cotes() { return [[0, 1], [1, 2], [2, 0]].map(function (s) { return { t: 'd', p: E.T[s[0]], q: E.T[s[1]], cote: true }; }); }
    function modeles() { var m = cotes(); O.actions.forEach(function (a) { m = m.concat(a.objs); }); return m; }
    function interDD(u, v) {
      var x1 = u.p[0], y1 = u.p[1], x2 = u.q[0], y2 = u.q[1], x3 = v.p[0], y3 = v.p[1], x4 = v.q[0], y4 = v.q[1];
      var den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      if (Math.abs(den) < 1e-9) return [];
      var a = x1 * y2 - y1 * x2, b = x3 * y4 - y3 * x4;
      return [[(a * (x3 - x4) - (x1 - x2) * b) / den, (a * (y3 - y4) - (y1 - y2) * b) / den]];
    }
    function interDC(d, k) {
      var f = pied(k.c, d.p, d.q), h = dist(f, k.c);
      if (h > k.r + 1e-9) return [];
      var l = Math.sqrt(Math.max(0, k.r * k.r - h * h)), n = dist(d.p, d.q), ux = (d.q[0] - d.p[0]) / n, uy = (d.q[1] - d.p[1]) / n;
      return [[f[0] + ux * l, f[1] + uy * l], [f[0] - ux * l, f[1] - uy * l]];
    }
    function interCC(k1, k2) {
      var d = dist(k1.c, k2.c);
      if (d < 1e-9 || d > k1.r + k2.r + 1e-9 || d < Math.abs(k1.r - k2.r) - 1e-9) return [];
      var a = (k1.r * k1.r - k2.r * k2.r + d * d) / (2 * d), h = Math.sqrt(Math.max(0, k1.r * k1.r - a * a));
      var ux = (k2.c[0] - k1.c[0]) / d, uy = (k2.c[1] - k1.c[1]) / d, mx = k1.c[0] + a * ux, my = k1.c[1] + a * uy;
      return [[mx - uy * h, my + ux * h], [mx + uy * h, my - ux * h]];
    }
    function inter(u, v) {
      if (u.t === 'd' && v.t === 'd') return interDD(u, v);
      if (u.t === 'd') return interDC(u, v);
      if (v.t === 'd') return interDC(v, u);
      return interCC(u, v);
    }
    function recalculeAccroches() {
      var pts = E.T.slice(), M = modeles();
      O.actions.forEach(function (a) { pts = pts.concat(a.marques); });
      for (var i = 0; i < M.length; i++) for (var j = i + 1; j < M.length; j++) {
        if (M[i].cote && M[j].cote) continue;                                         // ce sont les sommets
        inter(M[i], M[j]).forEach(function (p) { if (p[0] > -40 && p[0] < W + 40 && p[1] > -40 && p[1] < Hh + 40) pts.push(p); });
      }
      O.accroches = pts;
    }
    // le point d'accroche le plus proche, sinon le point lui-même
    function accroche(p, tol) {
      var best = null, bd = tol == null ? ACCROCHE : tol;
      O.accroches.forEach(function (q) { var d = dist(p, q); if (d < bd) { bd = d; best = q; } });
      return best ? best.slice() : p;
    }
    // la droite (côté ou tracé) la plus proche du clic
    function droiteProche(p) {
      var best = null, bd = ACCROCHE;
      modeles().forEach(function (m) { if (m.t !== 'd') return; var d = dist(p, pied(p, m.p, m.q)); if (d < bd) { bd = d; best = m; } });
      return best;
    }
    // une droite dessinée d'un bord à l'autre du plan
    function dessineDroite(p, q) {
      var n = dist(p, q), ux = (q[0] - p[0]) / n, uy = (q[1] - p[1]) / n, far = 2500;
      var s = board.create('segment', [[p[0] - ux * far, p[1] - uy * far], [p[0] + ux * far, p[1] + uy * far]],
        { strokeColor: C_TRACE, strokeWidth: 1.6, fixed: true, highlight: false, layer: 6 });
      s.point1.setAttribute({ visible: false }); s.point2.setAttribute({ visible: false });
      s.mvRole = 'trace-droite';
      return [s, s.point1, s.point2];
    }
    // un cercle, avec son centre marqué et un rayon coté en mètres ; `vers` est le point
    // qui a fixé l'écartement (à défaut, le rayon repart dans la direction du précédent)
    function dessineCercle(c, r, vers) {
      var k = board.create('circle', [c, r], { strokeColor: C_TRACE, strokeWidth: 1.4, fillColor: 'none', fixed: true, highlight: false, layer: 6 });
      k.center.setAttribute({ visible: false });
      k.mvRole = 'trace-cercle';
      if (vers && dist(c, vers) > 1e-9) O.dirEcart = [(vers[0] - c[0]) / dist(c, vers), (vers[1] - c[1]) / dist(c, vers)];
      var u = O.dirEcart || [1, 0], bout = [c[0] + u[0] * r, c[1] + u[1] * r];
      var ray = board.create('segment', [c, bout], { strokeColor: C_TRACE, strokeWidth: 1.6, dash: 2, fixed: true, highlight: false, layer: 6 });
      ray.point1.setAttribute({ visible: false }); ray.point2.setAttribute({ visible: false });
      ray.mvRole = 'trace-rayon';
      var centre = board.create('point', c, { name: '', size: 3, face: 'x', strokeColor: C_TRACE, strokeWidth: 2, fixed: true,
        withLabel: false, showInfobox: false, highlight: false, layer: 8 });
      // la cote est posée à côté du rayon (décalée perpendiculairement), pas dessus
      var cote = etiq((c[0] + bout[0]) / 2 - u[1] * 16, (c[1] + bout[1]) / 2 + u[0] * 16, 'r = ' + Math.round(r * E.carte.mpp) + ' m', C_TRACE, 10);
      cote.mvRole = 'trace-cote-rayon';
      return [k, k.center, ray, ray.point1, ray.point2, centre, cote];
    }
    function dessineMarque(p, txt) {
      var m = board.create('point', p, { name: '', size: 3, face: '<>', fillColor: '#fff', strokeColor: C_TRACE, strokeWidth: 2, fixed: true,
        withLabel: false, showInfobox: false, highlight: false, layer: 8 });
      m.mvRole = 'trace-milieu';
      var out = [m];
      if (txt) out.push(etiq(p[0], p[1] - 12, txt, C_TRACE, 10, { anchorY: 'top' }));              // sous la marque, jamais dessus
      return out;
    }
    function ajoute(action) { O.actions.push(action); recalculeAccroches(); }

    // L'aperçu : ce que donnerait le prochain clic, suivi à la souris.
    function apercuFin() { return O.souris ? accroche(O.souris) : (O.attente && O.attente.p) || [0, 0]; }
    var apA = pt(function () { return O.attente && O.attente.p ? O.attente.p[0] : 0; }, function () { return O.attente && O.attente.p ? O.attente.p[1] : 0; });
    var apB = pt(function () { return apercuFin()[0]; }, function () { return apercuFin()[1]; });
    var AP_SEG = board.create('segment', [apA, apB], { strokeColor: C_TRACE, strokeWidth: 1.4, dash: 2, fixed: true, highlight: false, layer: 7, visible: false });
    var AP_CER = board.create('circle', [apA, function () { return O.attente && O.attente.p ? Math.max(1, dist(O.attente.p, apercuFin())) : 1; }],
      { strokeColor: C_TRACE, strokeWidth: 1.2, dash: 2, fillColor: 'none', fixed: true, highlight: false, layer: 7, visible: false });
    // la droite choisie par l'équerre, surlignée
    var apD1 = pt(function () { return O.attente && O.attente.d ? O.attente.d.p[0] : 0; }, function () { return O.attente && O.attente.d ? O.attente.d.p[1] : 0; });
    var apD2 = pt(function () { return O.attente && O.attente.d ? O.attente.d.q[0] : 0; }, function () { return O.attente && O.attente.d ? O.attente.d.q[1] : 0; });
    var AP_DRO = board.create('line', [apD1, apD2], { strokeColor: '#f59e0b', strokeWidth: 5, strokeOpacity: 0.55, fixed: true, highlight: false, layer: 4, visible: false });
    function refreshOutils() {
      var a = O.attente, actif = E.phase === 'jeu';
      show(AP_SEG, actif && O.outil === 'regle' && a && O.souris);
      show(AP_CER, actif && O.outil === 'compas' && a && O.souris);
      show(AP_DRO, actif && O.outil === 'equerre' && a);
    }

    var CONSIGNES = {
      main: 'Déplace le point RDV : il s\'accroche aux intersections de tes tracés.',
      regle: 'Règle : clique deux points. Elle trace la droite et marque le <b>milieu</b> du segment.',
      equerre: 'Équerre : clique un côté ou une droite, puis le point par où doit passer la <b>perpendiculaire</b>.',
      compas: 'Compas : clique le centre, puis un point pour fixer l\'écartement. Le <b>rayon</b> s\'affiche en mètres.'
    };
    function consigne() {
      if (O.message) return O.message;
      if (O.outil === 'regle' && O.attente) return 'Règle : clique le second point.';
      if (O.outil === 'equerre' && O.attente) return 'Équerre : clique maintenant le point par où passe la perpendiculaire.';
      if (O.outil === 'compas' && O.memeEcart && O.ecart) return 'Compas, même écartement (' + Math.round(O.ecart * E.carte.mpp) + ' m) : clique un centre.';
      if (O.outil === 'compas' && O.attente) return 'Compas : clique un point pour fixer l\'écartement.';
      return CONSIGNES[O.outil];
    }

    // Un clic sur le plan, en coordonnées du plan.
    function clicPlan(brut) {
      if (E.phase !== 'jeu' || O.outil === 'main') return;
      O.message = '';
      if (O.actions.length >= 30) { O.message = 'Le plan est plein : annule ou efface des tracés.'; majOutils(); return; }
      var p = accroche(brut), a = O.attente;
      if (O.outil === 'regle') {
        if (!a) O.attente = { p: p };
        else if (dist(a.p, p) < 4) O.message = 'Il faut deux points distincts.';
        else {
          var mil = milieu(a.p, p), jsx = dessineDroite(a.p, p).concat(dessineMarque(mil, Math.round(dist(a.p, p) * E.carte.mpp) + ' m'));
          ajoute({ objs: [{ t: 'd', p: a.p, q: p }], marques: [mil], jsx: jsx });
          O.attente = null;
        }
      } else if (O.outil === 'equerre') {
        if (!a) {
          var d = droiteProche(brut);
          if (d) O.attente = { d: d }; else O.message = 'Équerre : clique d\'abord <b>sur</b> un côté du triangle ou sur une droite tracée.';
        } else {
          var n = dist(a.d.p, a.d.q), q = [p[0] - (a.d.q[1] - a.d.p[1]) / n * 100, p[1] + (a.d.q[0] - a.d.p[0]) / n * 100];
          ajoute({ objs: [{ t: 'd', p: p, q: q }], marques: [], jsx: dessineDroite(p, q) });
          O.attente = null;
        }
      } else if (O.outil === 'compas') {
        if (O.memeEcart && O.ecart) ajoute({ objs: [{ t: 'c', c: p, r: O.ecart }], marques: [], jsx: dessineCercle(p, O.ecart) });
        else if (!a) O.attente = { p: p };
        else if (dist(a.p, p) < 4) O.message = 'L\'écartement est nul : clique un autre point.';
        else {
          O.ecart = dist(a.p, p);
          ajoute({ objs: [{ t: 'c', c: a.p, r: O.ecart }], marques: [], jsx: dessineCercle(a.p, O.ecart, p) });
          O.attente = null;
        }
      }
      majOutils();
    }
    function annuler() {
      if (O.attente) O.attente = null;
      else {
        var a = O.actions.pop();
        if (a) a.jsx.forEach(function (o) { board.removeObject(o); });
      }
      O.message = ''; recalculeAccroches(); majOutils();
    }
    function effacerTout() {
      O.actions.forEach(function (a) { a.jsx.forEach(function (o) { board.removeObject(o); }); });
      O.actions = []; O.attente = null; O.message = ''; O.ecart = null; O.dirEcart = null;
      recalculeAccroches(); majOutils();
    }
    function choisir(outil) { O.outil = outil; O.attente = null; O.message = ''; majOutils(); }

    // Les clics et la souris sur le plan.
    function positionPlan(e) {
      var pos = board.getMousePosition(e, e && e[JXG.touchProperty] ? 0 : undefined);
      var c = new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, board);
      return [c.usrCoords[1], c.usrCoords[2]];
    }
    board.on('down', function (e) { if (O.outil !== 'main' && E.phase === 'jeu') clicPlan(positionPlan(e)); });
    board.on('move', function (e) {
      if (O.outil === 'main' || !O.attente || E.phase !== 'jeu') return;
      O.souris = positionPlan(e); refreshOutils(); board.update();
    });
    // pour les contrôles : jouer un clic sans souris, lire l'état
    board.mvOutils = { clic: clicPlan, choisir: choisir, annuler: annuler, effacer: effacerTout, etat: O,
                       memeEcart: function (v) { O.memeEcart = !!v; majOutils(); } };

    // La barre d'outils.
    var barre = el('div', 'rdv-outils', 'display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;margin:.1rem 0 .4rem;max-width:640px');
    var OUTILS = [['main', '✋ Déplacer RDV'], ['regle', '📏 Règle graduée'], ['equerre', '📐 Équerre'], ['compas', '⭕ Compas']];
    var boutons = OUTILS.map(function (o) {
      var b = el('button', 'ineq-preset rdv-outil'); b.type = 'button'; b.textContent = o[1];
      b.onclick = function () { choisir(o[0]); };
      barre.appendChild(b); return b;
    });
    var bMeme = el('button', 'ineq-preset rdv-meme'); bMeme.type = 'button';
    bMeme.onclick = function () { O.memeEcart = !O.memeEcart; choisir('compas'); };
    var bAnnul = el('button', 'ineq-preset rdv-annuler'); bAnnul.type = 'button'; bAnnul.textContent = '↩ Annuler';
    bAnnul.onclick = annuler;
    var bEfface = el('button', 'ineq-preset rdv-effacer'); bEfface.type = 'button'; bEfface.textContent = '✖ Tout effacer';
    bEfface.onclick = effacerTout;
    barre.appendChild(bMeme); barre.appendChild(bAnnul); barre.appendChild(bEfface);
    var consigneEl = el('div', 'rdv-consigne', 'color:#1d4ed8;font-size:.95rem;margin:0 0 .5rem;max-width:640px;min-height:1.4em');
    function majOutils() {
      boutons.forEach(function (b, i) { b.className = 'ineq-preset rdv-outil' + (OUTILS[i][0] === O.outil ? ' active' : ''); });
      bMeme.textContent = (O.memeEcart ? '☑' : '☐') + ' Garder l\'écartement' + (O.ecart ? ' (' + Math.round(O.ecart * E.carte.mpp) + ' m)' : '');
      bMeme.className = 'ineq-preset rdv-meme' + (O.memeEcart ? ' active' : '');
      consigneEl.innerHTML = E.phase === 'jeu' ? consigne() : '';
      if (!O.attente) O.souris = null;
      refresh(); refreshOutils(); board.update();
    }
    root.insertBefore(consigneEl, root.firstChild);
    root.insertBefore(barre, root.firstChild);

    function etoilesTxt(n) { return '★★★'.slice(0, n) + '☆☆☆'.slice(0, 3 - n); }
    function render() {
      scoreEl.innerHTML = 'Mission ' + E.n + ' · ' + E.carte.nom + ' &nbsp;—&nbsp; score : <span style="color:#d97706">' + E.etoiles + ' ★</span> sur ' + (3 * E.jouees);
      missionEl.innerHTML = '📍 <b>' + E.amis[0] + '</b> est en A, <b>' + E.amis[1] + '</b> en B et <b>' + E.amis[2] + '</b> en C. ' +
        'Ils se donnent rendez-vous ' + E.formule.lieu + '.' +
        (E.phase === 'jeu' ? '<br><span style="color:#64748b;font-size:.95rem">Trace avec les outils si tu veux, place le point <b style="color:' + C_RDV + '">RDV</b>, puis valide.</span>'
                           : '<br><span style="color:#64748b;font-size:.95rem">Clique sur « Mission suivante » pour un autre quartier.</span>');
      indiceEl.innerHTML = E.indice ? '💡 ' + POINTS[E.formule.cle].rappel + ' Une des trois ' + POINTS[E.formule.cle].droites + ' est tracée sur le plan.' : '';
      var v = E.verdict;
      if (!v) { verdictEl.innerHTML = ''; return; }
      var P = POINTS[E.formule.cle];
      var tete = v.etoiles === 3 ? 'Pile au rendez-vous !' : v.etoiles === 2 ? 'Presque : ils se retrouvent sans peine.' : v.etoiles === 1 ? 'Pas loin, mais il faudra s\'appeler.' : 'Rendez-vous manqué.';
      verdictEl.innerHTML =
        '<div style="font-size:1.15rem;font-weight:800;color:' + (v.etoiles ? C_OK : C_NO) + '">' +
          '<span style="color:#d97706">' + etoilesTxt(v.etoiles) + '</span> ' + tete + '</div>' +
        '<p style="margin:.3rem 0">Tu es à <b>' + fmt(v.metres) + ' m</b> du point de rendez-vous' +
          (E.indice ? ' (l\'indice a coûté une étoile)' : '') + '.</p>' +
        '<p style="margin:.3rem 0">Il fallait trouver <b style="color:' + P.col + '">' + P.nom + '</b>, point de concours des <b>' + P.droites + '</b>' +
          (E.formule.nomme ? '' : (E.formule.cle === 'O' ? ' : c\'est lui qui est à égale distance des trois sommets — le cercle circonscrit passe par A, B et C'
                                                         : ' : c\'est lui qui est à égale distance des trois côtés — le cercle inscrit touche chaque côté')) + '.</p>' +
        (v.confusion ? '<p style="margin:.3rem 0;color:' + C_NO + '">Ton point est plus près de <b>' + POINTS[v.confusion].nom + '</b> : tu as peut-être tracé les <b>' +
                       POINTS[v.confusion].droites + '</b> au lieu des <b>' + P.droites + '</b>.</p>' : '');
    }

    /* ==================================================================== */
    /* Le déroulement                                                        */
    /* ==================================================================== */
    function nouvelle() {
      if (!sacFormules.length) sacFormules = melange(FORMULES);
      if (!sacCartes.length) sacCartes = melange(CARTES);
      E.formule = sacFormules.pop(); E.carte = sacCartes.pop();
      E.T = tireTriangle(); E.K = centres(E.T[0], E.T[1], E.T[2]);
      E.amis = melange(AMIS).slice(0, 3);
      E.n++; E.phase = 'jeu'; E.indice = false; E.verdict = null;
      E.rdv = [W / 2, 70];
      ancreNoms(); O.outil = 'main'; effacerTout();
      render(); board.update();
    }
    function valider() {
      if (E.phase !== 'jeu') return;
      var d = dist(E.rdv, cible()), rel = d / E.K.L;
      var etoiles = rel <= 0.04 ? 3 : rel <= 0.08 ? 2 : rel <= 0.14 ? 1 : 0;
      if (E.indice && etoiles > 0) etoiles--;
      // plus près d'un autre point remarquable ?
      var confusion = null, best = d;
      ['G', 'H', 'O', 'I'].forEach(function (k) {
        if (k === E.formule.cle) return;
        var dk = dist(E.rdv, E.K[k]);
        if (dk < best && dk <= 0.08 * E.K.L) { best = dk; confusion = k; }
      });
      E.verdict = { metres: Math.round(d * E.carte.mpp), etoiles: etoiles, confusion: rel > 0.04 ? confusion : null };
      E.etoiles += etoiles; E.jouees++; E.phase = 'corrige';
      O.attente = null; majOutils(); render(); board.update();
    }
    function indice() {
      if (E.phase !== 'jeu' || E.indice) return;
      E.indice = true;
      refresh(); render(); board.update();
    }

    mv.addControls([
      { type: 'button', id: 'valider', label: '✔ Valider le rendez-vous', onClick: valider },
      { type: 'button', id: 'indice', label: '💡 Indice (−1 ★)', onClick: indice },
      { type: 'button', id: 'suivante', label: '➜ Mission suivante', onClick: nouvelle }
    ]);
    nouvelle();
  }
});
