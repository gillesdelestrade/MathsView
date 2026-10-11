/*
 * Les trois états de l'eau (5ème, physique-chimie).
 *
 * À gauche, le triangle des états — SOLIDE, LIQUIDE, GAZ — et ses six flèches :
 * fusion, solidification, vaporisation, liquéfaction, sublimation, condensation.
 * À droite, une boîte de molécules d'eau (les mêmes dans les trois états, seuls
 * leur arrangement et leur agitation changent), un thermomètre et la courbe de
 * chauffage avec ses deux paliers : 0 °C tant qu'il reste de la glace, 100 °C
 * tant qu'il reste de l'eau liquide.
 *
 * Trois façons de jouer : cliquer une flèche (ou sa pastille) pour voir ce seul
 * changement d'état, « Chauffer » pour suivre la courbe de −20 °C à 120 °C en
 * cinq étapes, « Refroidir » pour la redescendre. Pendant un changement d'état,
 * les molécules passent une à une d'un arrangement à l'autre tandis que le
 * thermomètre ne bouge pas : c'est le palier.
 *
 * Tout le dessin découle d'un ÉTAT (état de départ, état d'arrivée, fraction
 * déjà passée, température, position sur la courbe) que refresh() traduit en
 * positions et attributs AVANT board.update(). Les molécules sont une réserve
 * fixe de points ; leurs places dans chaque état viennent d'un générateur à
 * graine fixe, et un petit tic les fait vibrer — à peine en solide, beaucoup
 * en gaz.
 */
MathsView.register({
  id: 'etats-eau',
  title: 'Les trois états de l\'eau',
  level: '5eme',
  matiere: 'pc',
  category: 'chimie',
  subcategory: 'États de la matière',
  exercices: ['pc-etats-eau'],
  theme: 'Solide, liquide, gaz : les six changements d\'état, et la température qui fait un palier',
  description:
    'L\'eau existe sous <strong>trois états</strong> : la glace (solide), l\'eau liquide, la vapeur ' +
    'd\'eau (gaz, invisible). Le triangle montre les <strong>six changements d\'état</strong> : ' +
    'clique une flèche pour le voir sur les molécules. ' +
    '<br><strong>« Chauffer »</strong> suit la courbe de chauffage de −20 °C à 120 °C : regarde le ' +
    'thermomètre s\'arrêter à <strong>0 °C</strong> pendant toute la fusion, puis à ' +
    '<strong>100 °C</strong> pendant toute la vaporisation. <strong>« Refroidir »</strong> fait le ' +
    'chemin inverse.',
  notes:
    '<ul>' +
    '<li><strong>Trois états, une seule eau.</strong> Les molécules d\'eau sont les mêmes dans la ' +
    'glace, l\'eau liquide et la vapeur. Ce qui change : leur arrangement et leur agitation. ' +
    'Solide : ordonnées, serrées, elles vibrent sur place. Liquide : désordonnées, serrées, elles ' +
    'glissent les unes sur les autres. Gaz : désordonnées, dispersées, très agitées.</li>' +
    '<li><strong>Les six changements d\'état.</strong> Solide → liquide : <strong>fusion</strong>. ' +
    'Liquide → solide : <strong>solidification</strong>. Liquide → gaz : <strong>vaporisation</strong>. ' +
    'Gaz → liquide : <strong>liquéfaction</strong>. Solide → gaz : <strong>sublimation</strong>. ' +
    'Gaz → solide : <strong>condensation</strong> (on dit parfois « condensation solide »).</li>' +
    '<li><strong>Vaporisation : deux façons.</strong> L\'<strong>ébullition</strong>, à 100 °C, dans ' +
    'toute l\'eau (les bulles) ; l\'<strong>évaporation</strong>, à n\'importe quelle température, ' +
    'à la surface (la flaque qui sèche, le linge qui sèche).</li>' +
    '<li><strong>Le palier.</strong> Pour l\'eau pure, la fusion se fait à <strong>0 °C</strong> et ' +
    'l\'ébullition à <strong>100 °C</strong> (à la pression normale). Pendant tout le changement ' +
    'd\'état, la température <strong>ne change pas</strong> : la chaleur sert à changer d\'état, ' +
    'pas à chauffer. Sur la courbe, c\'est un palier horizontal.</li>' +
    '<li><strong>La masse se conserve</strong> : 20 g de glace donnent 20 g d\'eau. Le ' +
    '<strong>volume</strong>, lui, change : la glace prend plus de place que l\'eau liquide ' +
    '(la bouteille pleine qui éclate au congélateur), et la vapeur énormément plus.</li>' +
    '<li><strong>Attention aux mots.</strong> La vapeur d\'eau est invisible ; la buée, le ' +
    'brouillard, le nuage, le « panache » de la casserole sont déjà de l\'eau liquide en fines ' +
    'gouttelettes (une liquéfaction).</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6.4, 8, -5.6], keepaspectratio: true, axis: false },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Les trois états de l\'eau',
    figures: [{
      legende: 'Rouge : en chauffant. Bleu : en refroidissant.',
      boundingbox: [-7.6, 4.6, 7.6, -3.6],
      largeur: 50, hauteur: 32,
      dessine: function (board) {
        var S = [-3.4, -2.0], L = [3.4, -2.0], G = [0, 3.0], R = 1.3, C = [0, -0.3];
        function noeud(P, nom, col, fond) {
          board.create('circle', [P, R], { strokeColor: col, strokeWidth: 1.2, fillColor: fond, fillOpacity: 1, fixed: true, highlight: false });
          board.create('text', [P[0], P[1], nom], { anchorX: 'middle', anchorY: 'middle', fontSize: 6.5, color: col, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        // Même logique que la figure de la leçon : deux flèches par paire, les
        // étiquettes des paires obliques étagées à l'extérieur.
        function fleche(P, Q, cote, along, nom, col) {
          var ux = Q[0] - P[0], uy = Q[1] - P[1], n = Math.hypot(ux, uy); ux /= n; uy /= n;
          var nx = -uy, ny = ux, mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2;
          if ((mx - C[0]) * nx + (my - C[1]) * ny < 0) { nx = -nx; ny = -ny; }
          var d = cote === 'ext' ? 0.25 : -0.25;
          var a = [P[0] + ux * (R + 0.1) + nx * d, P[1] + uy * (R + 0.1) + ny * d];
          var b = [Q[0] - ux * (R + 0.1) + nx * d, Q[1] - uy * (R + 0.1) + ny * d];
          board.create('arrow', [a, b], { strokeColor: col, strokeWidth: 1.2, lastArrow: { type: 2, size: 4 }, fixed: true, highlight: false });
          var horizontal = Math.abs(ny) > 0.9, m, anchorX;
          if (horizontal) { m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + ny * (cote === 'ext' ? 0.42 : -0.42)]; anchorX = 'middle'; }
          else { m = [P[0] + (Q[0] - P[0]) * along + nx * 0.7, P[1] + (Q[1] - P[1]) * along + ny * 0.7]; anchorX = nx < 0 ? 'right' : 'left'; }
          board.create('text', [m[0], m[1], nom], { anchorX: anchorX, anchorY: 'middle', fontSize: 6.5, color: col, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        noeud(S, 'SOLIDE', '#1d4ed8', '#dbeafe'); noeud(L, 'LIQUIDE', '#0369a1', '#bae6fd'); noeud(G, 'GAZ', '#475569', '#f1f5f9');
        fleche(S, L, 'int', 0, 'fusion', '#c2410c'); fleche(L, S, 'ext', 0, 'solidification', '#1d4ed8');
        fleche(L, G, 'int', 0.3, 'vaporisation', '#c2410c'); fleche(G, L, 'ext', 0.62, 'liquéfaction', '#1d4ed8');
        fleche(S, G, 'ext', 0.62, 'sublimation', '#c2410c'); fleche(G, S, 'int', 0.3, 'condensation', '#1d4ed8');
      }
    }, {
      legende: 'Courbe de chauffage de l\'eau : deux paliers.',
      boundingbox: [-2.4, 150, 11.6, -48],
      keepaspectratio: false,
      largeur: 50, hauteur: 30,
      dessine: function (board) {
        board.create('arrow', [[0, -20], [11, -20]], { strokeColor: '#334155', strokeWidth: 1, fixed: true, highlight: false });
        board.create('arrow', [[0, -20], [0, 140]], { strokeColor: '#334155', strokeWidth: 1, fixed: true, highlight: false });
        board.create('curve', [[0, 1.2, 3.2, 6, 8.8, 10], [-20, 0, 0, 100, 100, 120]], { strokeColor: '#dc2626', strokeWidth: 1.6, fixed: true, highlight: false });
        [[0, '0 °C'], [100, '100 °C']].forEach(function (g) {
          board.create('segment', [[0, g[0]], [8.8, g[0]]], { strokeColor: '#94a3b8', strokeWidth: 0.6, dash: 2, fixed: true, highlight: false });
          board.create('text', [-0.2, g[0], g[1]], { anchorX: 'right', anchorY: 'middle', fontSize: 7, color: '#334155', fixed: true, highlight: false });
        });
        function nom(x, y, s, col, taille) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 6.5, color: col || '#334155', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        nom(2.2, 14, 'fusion', '#c2410c'); nom(7.4, 114, 'vaporisation', '#c2410c');
        nom(0.9, -32, 'glace', '#1d4ed8'); nom(4.6, 42, 'eau liquide', '#0369a1'); nom(9.6, 134, 'vapeur', '#475569');
        nom(10.2, -31, 'temps', '#334155'); nom(0.6, 143, 'T', '#334155');
      }
    }],
    points: [
      'L\'eau a trois états : <b>solide</b> (glace), <b>liquide</b>, <b>gaz</b> (vapeur d\'eau, invisible). Buée, brouillard, nuage : de l\'eau liquide en gouttelettes.',
      'Solide → liquide : <b>fusion</b>. Liquide → solide : <b>solidification</b>.',
      'Liquide → gaz : <b>vaporisation</b> (ébullition à 100 °C, ou évaporation à toute température). Gaz → liquide : <b>liquéfaction</b>.',
      'Solide → gaz : <b>sublimation</b>. Gaz → solide : <b>condensation</b>. Sans passer par l\'état liquide.',
      'Eau pure : fusion à <b>0 °C</b>, ébullition à <b>100 °C</b>. Pendant le changement d\'état, la température reste constante : un <b>palier</b>.',
      'La <b>masse</b> ne change pas ; le <b>volume</b>, si : la glace prend plus de place que l\'eau liquide.',
      'Mêmes molécules : ordonnées et serrées (solide), désordonnées et serrées (liquide), désordonnées et dispersées (gaz).'
    ],
    exemples: [
      'Un glaçon de 20 g fond : 20 g d\'eau liquide, et le thermomètre reste à 0 °C tant qu\'il fond.',
      'Buée sur la vitre : liquéfaction. Givre : condensation. Flaque qui sèche : vaporisation (évaporation).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Les états et les changements d'état                                   */
    /* ==================================================================== */
    var ETATS = {
      solide:  { nom: 'SOLIDE', objet: 'la glace', col: '#1d4ed8', fond: '#dbeafe', amp: 0.05,
                 molecules: 'ordonnées, serrées, elles vibrent sur place' },
      liquide: { nom: 'LIQUIDE', objet: 'l\'eau liquide', col: '#0369a1', fond: '#bae6fd', amp: 0.13,
                 molecules: 'désordonnées, serrées, elles glissent les unes sur les autres' },
      gaz:     { nom: 'GAZ', objet: 'la vapeur d\'eau', col: '#475569', fond: '#f1f5f9', amp: 0.32,
                 molecules: 'désordonnées, dispersées, très agitées' }
    };
    var TRANS = {
      fusion:         { de: 'solide', a: 'liquide', T: 0, chaud: true,
                        ex: 'le glaçon qui fond dans le verre, la neige qui fond au soleil' },
      solidification: { de: 'liquide', a: 'solide', T: 0, chaud: false,
                        ex: 'l\'eau du bac à glaçons au congélateur, la flaque qui gèle la nuit' },
      vaporisation:   { de: 'liquide', a: 'gaz', T: 100, chaud: true,
                        ex: 'l\'eau qui bout dans la casserole (ébullition) ; la flaque qui sèche (évaporation, à toute température)' },
      liquefaction:   { de: 'gaz', a: 'liquide', T: 100, chaud: false,
                        ex: 'la buée sur la vitre froide, la rosée du matin, les gouttes sous le couvercle' },
      sublimation:    { de: 'solide', a: 'gaz', T: -10, chaud: true,
                        ex: 'par grand froid sec, la neige disparaît sans fondre ; le linge gelé qui sèche' },
      condensation:   { de: 'gaz', a: 'solide', T: -10, chaud: false,
                        ex: 'le givre sur la vitre, les flocons de neige qui naissent dans un nuage glacé' }
    };
    var NOMS = { fusion: 'fusion', solidification: 'solidification', vaporisation: 'vaporisation',
                 liquefaction: 'liquéfaction', sublimation: 'sublimation', condensation: 'condensation' };
    var ORDRE = ['fusion', 'solidification', 'vaporisation', 'liquefaction', 'sublimation', 'condensation'];
    // Rouge : il faut chauffer (fusion, vaporisation, sublimation) ; bleu : il
    // faut refroidir. Pâle au repos, franc pour le changement d'état en cours.
    var C_CHAUD = '#c2410c', C_FROID = '#1d4ed8', C_CHAUD_PALE = '#fb923c', C_FROID_PALE = '#60a5fa';

    /* ==================================================================== */
    /* La géométrie                                                          */
    /* ==================================================================== */
    var NOEUD = { solide: [-6.3, -3.6], liquide: [-1.7, -3.6], gaz: [-4, 2.4] }, R = 0.95;
    var BOITE = { x1: 1.0, x2: 6.1, y1: 0.3, y2: 5.9 };
    var THERMO = { x: 7.5, y1: -0.6, y2: 5.6, Tmin: -20, Tmax: 120, demi: 0.17 };
    var COURBE = { x1: 1.3, x2: 6.2, y1: -5.0, y2: -0.6, tmax: 10, Tmin: -20, Tmax: 120 };
    var N = 36;

    function yTherm(T) { return THERMO.y1 + (T - THERMO.Tmin) / (THERMO.Tmax - THERMO.Tmin) * (THERMO.y2 - THERMO.y1); }
    function xCourbe(t) { return COURBE.x1 + t / COURBE.tmax * (COURBE.x2 - COURBE.x1); }
    function yCourbe(T) { return COURBE.y1 + (T - COURBE.Tmin) / (COURBE.Tmax - COURBE.Tmin) * (COURBE.y2 - COURBE.y1); }
    // La courbe de chauffage : (temps, température) aux coudes.
    var COUDES = [[0, -20], [1.2, 0], [3.2, 0], [6, 100], [8.8, 100], [10, 120]];

    /* Un générateur à graine fixe : les mêmes places à chaque rejeu. */
    function alea(graine) {
      var s = graine;
      return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
    }
    var rnd = alea(1789);
    function semis(n, x1, x2, y1, y2, dmin) {
      var pts = [], essais = 0;
      while (pts.length < n && essais < 20000) {
        essais++;
        var p = { x: x1 + rnd() * (x2 - x1), y: y1 + rnd() * (y2 - y1) }, ok = true;
        for (var i = 0; i < pts.length; i++) if (Math.hypot(pts[i].x - p.x, pts[i].y - p.y) < dmin) { ok = false; break; }
        if (ok) pts.push(p);
      }
      while (pts.length < n) pts.push({ x: x1 + rnd() * (x2 - x1), y: y1 + rnd() * (y2 - y1) });
      return pts;
    }
    var PLACES = { solide: [], liquide: [], gaz: [] };
    for (var i = 0; i < N; i++) PLACES.solide.push({ x: 1.8 + (i % 6) * 0.7, y: 0.75 + Math.floor(i / 6) * 0.62 });
    PLACES.liquide = semis(N, BOITE.x1 + 0.4, BOITE.x2 - 0.4, BOITE.y1 + 0.35, BOITE.y1 + 2.9, 0.5);
    PLACES.gaz = semis(N, BOITE.x1 + 0.4, BOITE.x2 - 0.4, BOITE.y1 + 0.4, BOITE.y2 - 0.4, 0.62);
    var PHASES = [];
    for (i = 0; i < N; i++) PHASES.push({ a: rnd() * 6.28, b: rnd() * 6.28, w: 0.7 + rnd() * 0.8 });

    /* ==================================================================== */
    /* L'état                                                                */
    /* ==================================================================== */
    var de = 'solide', a = 'solide';   // état de départ, état d'arrivée
    var frac = 0;                      // fraction des molécules déjà passées de `de` à `a`
    var T = -20;                       // température lue au thermomètre
    var temps = 0;                     // position sur la courbe de chauffage (minutes), ou null
    var trans = null;                  // le changement d'état en cours (clé de TRANS), ou null
    var mode = 'repos';                // 'repos' | 'transition' | 'chauffe' | 'refroidit'
    var tic = 0;                       // le temps des vibrations
    var chips = {}, refs = null;

    function lerp(u, v, t) { return u + (v - u) * t; }
    function nPasses() { return Math.round(N * frac); }
    // L'état « dominant » : celui où sont la majorité des molécules.
    function etatCourant() { return frac >= 0.5 ? a : de; }
    function amplitude() {
      var amp = lerp(ETATS[de].amp, ETATS[a].amp, frac);
      // Un peu plus d'agitation quand on chauffe au sein d'un même état.
      if (de === a) amp *= 0.8 + 0.4 * (T - THERMO.Tmin) / (THERMO.Tmax - THERMO.Tmin);
      return amp;
    }
    function fmtT(t) { return (t < 0 ? '−' : '') + Math.abs(Math.round(t)) + ' °C'; }

    /* ==================================================================== */
    /* Les objets                                                            */
    /* ==================================================================== */
    // --- le triangle des états ---
    var noeuds = {};
    Object.keys(ETATS).forEach(function (k) {
      var P = NOEUD[k];
      noeuds[k] = board.create('circle', [P, R], { strokeColor: ETATS[k].col, strokeWidth: 2, fillColor: ETATS[k].fond, fillOpacity: 1, fixed: true, highlight: false });
      board.create('text', [P[0], P[1], ETATS[k].nom], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, strokeColor: ETATS[k].col, cssStyle: 'font-weight:700', fixed: true, highlight: false });
    });
    var fleches = {}, etiquettes = {};
    var CENTRE = [-4, -1.6];   // le centre du triangle : « dehors » est à l'opposé
    // Deux flèches parallèles par paire d'états, l'une côté extérieur (ext),
    // l'autre côté intérieur (int). Les étiquettes des paires obliques vont
    // toutes à l'extérieur, étagées le long du côté (`along`) : dedans, la
    // place manque vers le sommet GAZ.
    function fleche(cle, cote, along) {
      var tr = TRANS[cle], P = NOEUD[tr.de], Q = NOEUD[tr.a];
      var ux = Q[0] - P[0], uy = Q[1] - P[1], n = Math.hypot(ux, uy); ux /= n; uy /= n;
      var nx = -uy, ny = ux;
      var mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2;
      if ((mx - CENTRE[0]) * nx + (my - CENTRE[1]) * ny < 0) { nx = -nx; ny = -ny; }   // n pointe dehors
      var d = cote === 'ext' ? 0.3 : -0.3;
      var A = [P[0] + ux * (R + 0.12) + nx * d, P[1] + uy * (R + 0.12) + ny * d];
      var B = [Q[0] - ux * (R + 0.12) + nx * d, Q[1] - uy * (R + 0.12) + ny * d];
      var pale = tr.chaud ? C_CHAUD_PALE : C_FROID_PALE;
      fleches[cle] = board.create('arrow', [A, B], { strokeColor: pale, strokeWidth: 2, lastArrow: { type: 2, size: 6 }, fixed: true, highlight: false });
      var horizontal = Math.abs(ny) > 0.9, M, anchorX;
      if (horizontal) {
        M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 + ny * (cote === 'ext' ? 0.45 : -0.45)];
        anchorX = 'middle';
      } else {
        M = [P[0] + (Q[0] - P[0]) * along + nx * 0.85, P[1] + (Q[1] - P[1]) * along + ny * 0.85];
        anchorX = nx < 0 ? 'right' : 'left';
      }
      var t = board.create('text', [M[0], M[1], NOMS[cle]], {
        anchorX: anchorX, anchorY: 'middle',
        fontSize: 12, strokeColor: pale, cssStyle: 'font-weight:700;cursor:pointer', fixed: true, highlight: false
      });
      t.on('down', function () { lancerTransition(cle); });
      etiquettes[cle] = t;
    }
    fleche('fusion', 'int', 0); fleche('solidification', 'ext', 0);
    fleche('vaporisation', 'int', 0.3); fleche('liquefaction', 'ext', 0.62);
    fleche('sublimation', 'ext', 0.62); fleche('condensation', 'int', 0.3);
    board.create('text', [-4, -5.15, 'rouge : en chauffant · bleu : en refroidissant'],
      { anchorX: 'middle', anchorY: 'middle', fontSize: 10, strokeColor: '#64748b', fixed: true, highlight: false });

    // --- la boîte de molécules ---
    board.create('curve', [[BOITE.x1, BOITE.x2, BOITE.x2, BOITE.x1, BOITE.x1], [BOITE.y1, BOITE.y1, BOITE.y2, BOITE.y2, BOITE.y1]],
      { strokeColor: '#334155', strokeWidth: 2, fillColor: '#f8fafc', fillOpacity: 1, fixed: true, highlight: false });
    var molecules = [];
    for (i = 0; i < N; i++) {
      molecules.push(board.create('point', [PLACES.solide[i].x, PLACES.solide[i].y],
        { name: '', withLabel: false, size: 4, fillColor: '#3b82f6', strokeColor: '#1e3a8a', strokeWidth: 1, fixed: true, highlight: false, layer: 8 }));
    }
    var titreBoite = board.create('text', [BOITE.x1 + 0.1, BOITE.y2 + 0.32, titreBoiteTexte],
      { anchorX: 'left', anchorY: 'middle', fontSize: 12, strokeColor: '#1d4ed8', cssStyle: 'font-weight:700', fixed: true, highlight: false });

    // --- le thermomètre ---
    board.create('curve', [[THERMO.x - THERMO.demi, THERMO.x + THERMO.demi, THERMO.x + THERMO.demi, THERMO.x - THERMO.demi, THERMO.x - THERMO.demi],
                           [THERMO.y1, THERMO.y1, THERMO.y2 + 0.2, THERMO.y2 + 0.2, THERMO.y1]],
      { strokeColor: '#334155', strokeWidth: 1.5, fillColor: '#fff', fillOpacity: 1, fixed: true, highlight: false });
    board.create('circle', [[THERMO.x, THERMO.y1 - 0.25], 0.32], { strokeColor: '#334155', strokeWidth: 1.5, fillColor: '#dc2626', fillOpacity: 1, fixed: true, highlight: false });
    var mercure = board.create('curve', [[0], [0]], { strokeColor: '#dc2626', strokeWidth: 0.5, fillColor: '#dc2626', fillOpacity: 1, fixed: true, highlight: false });
    mercure.updateDataArray = function () {
      var d = THERMO.demi * 0.55, y = yTherm(T);
      this.dataX = [THERMO.x - d, THERMO.x + d, THERMO.x + d, THERMO.x - d, THERMO.x - d];
      this.dataY = [THERMO.y1 - 0.3, THERMO.y1 - 0.3, y, y, THERMO.y1 - 0.3];
    };
    [0, 100].forEach(function (g) {
      board.create('segment', [[THERMO.x - 0.35, yTherm(g)], [THERMO.x + 0.35, yTherm(g)]], { strokeColor: '#334155', strokeWidth: 1, fixed: true, highlight: false });
      board.create('text', [THERMO.x - 0.45, yTherm(g), g + ' °C'], { anchorX: 'right', anchorY: 'middle', fontSize: 10, strokeColor: '#334155', fixed: true, highlight: false });
    });
    // La lecture, sous le réservoir : au bord droit du cadre, un texte centré se replierait.
    var lectureT = board.create('text', [THERMO.x + 0.45, THERMO.y1 - 1.5, function () { return fmtT(T); }],
      { anchorX: 'right', anchorY: 'middle', fontSize: 12, strokeColor: '#dc2626', cssStyle: 'font-weight:700', fixed: true, highlight: false });

    // --- la courbe de chauffage ---
    board.create('arrow', [[COURBE.x1, COURBE.y1], [COURBE.x2 + 0.2, COURBE.y1]], { strokeColor: '#334155', strokeWidth: 1.2, fixed: true, highlight: false });
    board.create('arrow', [[COURBE.x1, COURBE.y1], [COURBE.x1, COURBE.y2 + 0.3]], { strokeColor: '#334155', strokeWidth: 1.2, fixed: true, highlight: false });
    board.create('curve', [COUDES.map(function (c) { return xCourbe(c[0]); }), COUDES.map(function (c) { return yCourbe(c[1]); })],
      { strokeColor: '#dc2626', strokeWidth: 2.2, fixed: true, highlight: false });
    [0, 100].forEach(function (g) {
      board.create('segment', [[COURBE.x1, yCourbe(g)], [xCourbe(8.8), yCourbe(g)]], { strokeColor: '#94a3b8', strokeWidth: 0.8, dash: 2, fixed: true, highlight: false });
      board.create('text', [COURBE.x1 - 0.1, yCourbe(g), g + ' °C'], { anchorX: 'right', anchorY: 'middle', fontSize: 10, strokeColor: '#334155', fixed: true, highlight: false });
    });
    board.create('text', [xCourbe(2.2), yCourbe(0) + 0.3, 'fusion'], { anchorX: 'middle', anchorY: 'middle', fontSize: 10, strokeColor: C_CHAUD, fixed: true, highlight: false });
    board.create('text', [xCourbe(7.4), yCourbe(100) + 0.3, 'vaporisation'], { anchorX: 'middle', anchorY: 'middle', fontSize: 10, strokeColor: C_CHAUD, fixed: true, highlight: false });
    board.create('text', [COURBE.x2 + 0.15, COURBE.y1 + 0.3, 'temps'], { anchorX: 'right', anchorY: 'middle', fontSize: 10, strokeColor: '#334155', fixed: true, highlight: false });
    board.create('text', [COURBE.x1 + 0.15, COURBE.y2 + 0.3, 'T'], { anchorX: 'left', anchorY: 'middle', fontSize: 10, strokeColor: '#334155', fixed: true, highlight: false });
    var curseur = board.create('point', [COURBE.x1, COURBE.y1], { name: '', withLabel: false, size: 5, fillColor: '#dc2626', strokeColor: '#7f1d1d', fixed: true, highlight: false, visible: false, layer: 9 });

    function titreBoiteTexte() {
      if (de === a) return 'Molécules d\'eau : ' + ETATS[a].nom.toLowerCase() + ' (' + ETATS[a].objet + ')';
      var k = nPasses();
      if (k === N) return NOMS[trans] + ' terminée : ' + N + ' en ' + ETATS[a].nom.toLowerCase();
      return NOMS[trans] + ' : ' + (N - k) + ' en ' + ETATS[de].nom.toLowerCase() + ', ' + k + ' en ' + ETATS[a].nom.toLowerCase();
    }

    /* ==================================================================== */
    /* Du state au dessin                                                    */
    /* ==================================================================== */
    function placeMolecules() {
      var amp = amplitude(), k = nPasses();
      for (var i = 0; i < N; i++) {
        var P = i < k ? PLACES[a][i] : PLACES[de][i], ph = PHASES[i];
        var x = P.x + amp * Math.cos(ph.w * tic + ph.a), y = P.y + amp * Math.sin(ph.w * 1.3 * tic + ph.b);
        x = Math.max(BOITE.x1 + 0.15, Math.min(BOITE.x2 - 0.15, x));
        y = Math.max(BOITE.y1 + 0.15, Math.min(BOITE.y2 - 0.15, y));
        molecules[i].setPosition(JXG.COORDS_BY_USER, [x, y]);
      }
    }
    function refresh() {
      placeMolecules();
      var e = etatCourant();
      ORDRE.forEach(function (k) {
        var actif = k === trans;
        var col = actif ? (TRANS[k].chaud ? C_CHAUD : C_FROID) : (TRANS[k].chaud ? C_CHAUD_PALE : C_FROID_PALE);
        fleches[k].setAttribute({ strokeColor: col, strokeWidth: actif ? 4 : 2 });
        etiquettes[k].setAttribute({ strokeColor: col, fontSize: actif ? 14 : 12 });
      });
      Object.keys(ETATS).forEach(function (k) {
        noeuds[k].setAttribute({ strokeWidth: k === e ? 4 : 2 });
      });
      titreBoite.setAttribute({ strokeColor: ETATS[e].col });
      curseur.setAttribute({ visible: temps !== null });
      if (temps !== null) curseur.setPosition(JXG.COORDS_BY_USER, [xCourbe(temps), yCourbe(T)]);
      ecrirePanneau();
    }
    function redraw() { refresh(); board.update(); }

    // Les vibrations : un tic régulier, à peine visible en solide, vif en gaz.
    function vibrer() { tic += 0.25; placeMolecules(); board.update(); }
    if (typeof setInterval === 'function') {
      var horloge = setInterval(function () { try { vibrer(); } catch (e) { clearInterval(horloge); } }, 90);
      mv.onCleanup(function () { clearInterval(horloge); });
    }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel melange-panel';
    var lignes = [];     // les phrases des étapes déjà jouées (chauffer / refroidir)
    function ecrirePanneau() {
      var e = etatCourant(), html = '';
      if (mode === 'transition' && trans) {
        var tr = TRANS[trans], k = nPasses();
        html += '<div class="props-label">' + NOMS[trans] + ' : ' + ETATS[tr.de].nom.toLowerCase() + ' → ' + ETATS[tr.a].nom.toLowerCase() + '</div>';
        html += '<p>' + (k === N ? 'C\'est fait : ' + ETATS[tr.de].objet + ' est devenue ' + ETATS[tr.a].objet + '.' :
                 'Les molécules passent une à une d\'un arrangement à l\'autre : ' + (N - k) + ' sont encore en ' + ETATS[tr.de].nom.toLowerCase() + ', ' + k + ' déjà en ' + ETATS[tr.a].nom.toLowerCase() + '.') + '</p>';
        html += '<p>' + (tr.T === 0 ? 'Pour l\'eau pure, cela se passe à <b>0 °C</b>' : tr.T === 100 ? 'À la pression normale, cela se passe à <b>100 °C</b>' : 'Cela se passe <b>en dessous de 0 °C</b>, sans passer par l\'état liquide') +
                ', et la température <b>ne change pas</b> tant que le changement d\'état n\'est pas terminé.</p>';
        html += '<p>Dans la vie : ' + tr.ex + '.</p>';
      } else if (mode === 'chauffe' || mode === 'refroidit') {
        html += '<div class="props-label">' + (mode === 'chauffe' ? 'On chauffe' : 'On refroidit') + ' : ' + fmtT(T) + '</div>';
        html += '<ol class="melange-etapes">' + lignes.map(function (l, i) { return '<li class="' + (i === lignes.length - 1 ? 'courante' : '') + '">' + l + '</li>'; }).join('') + '</ol>';
      } else {
        html += '<div class="props-label">' + ETATS[e].nom + ' : ' + ETATS[e].objet + ', à ' + fmtT(T) + '</div>';
        html += '<p>Clique une flèche du triangle pour voir un changement d\'état, ou <b>Chauffer</b> / <b>Refroidir</b> pour suivre la courbe.</p>';
      }
      html += '<p class="etats-molecules">Molécules : <b>' + ETATS[e].molecules + '</b>.</p>';
      panel.innerHTML = html;
    }

    /* ==================================================================== */
    /* Les animations                                                        */
    /* ==================================================================== */
    var anim = null;
    function poser(etat, temperature, tps) { de = etat; a = etat; frac = 0; T = temperature; temps = tps === undefined ? null : tps; trans = null; }
    function raz() { mode = 'repos'; lignes = []; poser('solide', -20, 0); redraw(); }

    // Un seul changement d'état, à sa température.
    function lancerTransition(cle) {
      var tr = TRANS[cle];
      anim.cancel();
      mode = 'transition'; lignes = [];
      ORDRE.forEach(function (j) { chips[j].className = 'ineq-preset' + (j === cle ? ' active' : ''); });
      function depart() { de = tr.de; a = tr.a; frac = 0; T = tr.T; temps = null; trans = cle; }
      depart(); redraw();
      anim.runSteps([
        { dur: 2200, step: function (p) { depart(); frac = p; refresh(); }, after: function () { depart(); frac = 1; refresh(); } }
      ], function () { depart(); redraw(); });
    }

    // La courbe de chauffage, en cinq étapes absolues (et son inverse).
    var ETAPES_CHAUD = [
      { de: 'solide', a: 'solide', t0: 0, t1: 1.2, T0: -20, T1: 0, trans: null,
        txt: 'On chauffe la glace : la température monte de −20 °C à 0 °C. Les molécules vibrent de plus en plus, mais restent en place.' },
      { de: 'solide', a: 'liquide', t0: 1.2, t1: 3.2, T0: 0, T1: 0, trans: 'fusion',
        txt: '<b>Fusion</b> : à 0 °C, la glace fond. Tant qu\'il reste de la glace, la température <b>ne monte pas</b> : c\'est un <b>palier</b>. La chaleur sert à défaire l\'arrangement des molécules.' },
      { de: 'liquide', a: 'liquide', t0: 3.2, t1: 6, T0: 0, T1: 100, trans: null,
        txt: 'On chauffe l\'eau liquide : de 0 °C à 100 °C.' },
      { de: 'liquide', a: 'gaz', t0: 6, t1: 8.8, T0: 100, T1: 100, trans: 'vaporisation',
        txt: '<b>Vaporisation</b> : à 100 °C, l\'eau bout. Tant qu\'il reste de l\'eau liquide, la température reste à 100 °C : second <b>palier</b>. Les molécules se dispersent.' },
      { de: 'gaz', a: 'gaz', t0: 8.8, t1: 10, T0: 100, T1: 120, trans: null,
        txt: 'On chauffe la vapeur d\'eau : au-delà de 100 °C. Elle est invisible : ce qu\'on voit sortir de la casserole, c\'est déjà de la buée, de l\'eau liquide.' }
    ];
    var ETAPES_FROID = [
      { de: 'gaz', a: 'gaz', t0: 10, t1: 8.8, T0: 120, T1: 100, trans: null,
        txt: 'On refroidit la vapeur : de 120 °C à 100 °C.' },
      { de: 'gaz', a: 'liquide', t0: 8.8, t1: 6, T0: 100, T1: 100, trans: 'liquefaction',
        txt: '<b>Liquéfaction</b> : à 100 °C, la vapeur redevient de l\'eau liquide. Palier à 100 °C tant qu\'il reste de la vapeur.' },
      { de: 'liquide', a: 'liquide', t0: 6, t1: 3.2, T0: 100, T1: 0, trans: null,
        txt: 'On refroidit l\'eau liquide : de 100 °C à 0 °C.' },
      { de: 'liquide', a: 'solide', t0: 3.2, t1: 1.2, T0: 0, T1: 0, trans: 'solidification',
        txt: '<b>Solidification</b> : à 0 °C, l\'eau gèle. Palier à 0 °C tant qu\'il reste de l\'eau liquide. Les molécules se rangent.' },
      { de: 'solide', a: 'solide', t0: 1.2, t1: 0, T0: 0, T1: -20, trans: null,
        txt: 'On refroidit la glace : en dessous de 0 °C.' }
    ];
    function suivreCourbe(etapes, nomMode) {
      anim.cancel();
      ORDRE.forEach(function (j) { chips[j].className = 'ineq-preset'; });
      mode = nomMode; lignes = [];
      var e0 = etapes[0];
      poser(e0.de, e0.T0, e0.t0); redraw();
      var steps = etapes.map(function (e, i) {
        function pose(p) {
          de = e.de; a = e.a; frac = e.de === e.a ? 0 : p;
          T = lerp(e.T0, e.T1, p); temps = lerp(e.t0, e.t1, p); trans = e.trans;
          lignes = etapes.slice(0, i + 1).map(function (x) { return x.txt; });
        }
        return { dur: e.de === e.a ? 1300 : 2200,
                 step: function (p) { pose(p); refresh(); },
                 after: function () { pose(1); refresh(); } };
      });
      anim.runSteps(steps, function () { mode = nomMode; lignes = []; poser(e0.de, e0.T0, e0.t0); redraw(); });
    }

    /* ==================================================================== */
    /* Les choix                                                             */
    /* ==================================================================== */
    var choix = document.createElement('div');
    choix.className = 'ineq-presets melange-choix';
    ORDRE.forEach(function (k) {
      var bt = document.createElement('button');
      bt.type = 'button';
      bt.className = 'ineq-preset';
      bt.textContent = ETATS[TRANS[k].de].nom.toLowerCase() + ' → ' + ETATS[TRANS[k].a].nom.toLowerCase() + ' : ' + NOMS[k];
      bt.onclick = function () { lancerTransition(k); };
      choix.appendChild(bt);
      chips[k] = bt;
    });
    mv.extras.appendChild(choix);

    refs = mv.addControls([
      { type: 'button', id: 'chauffer', label: '🔥 Chauffer de −20 °C à 120 °C', onClick: function () { suivreCourbe(ETAPES_CHAUD, 'chauffe'); } },
      { type: 'button', id: 'refroidir', label: '❄️ Refroidir de 120 °C à −20 °C', onClick: function () { suivreCourbe(ETAPES_FROID, 'refroidit'); } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { anim.cancel(); ORDRE.forEach(function (j) { chips[j].className = 'ineq-preset'; }); raz(); } }
    ]);
    anim = mv.createAnimator();
    mv.extras.appendChild(panel);

    raz();
    suivreCourbe(ETAPES_CHAUD, 'chauffe');   // charge les étapes : en pas à pas, la figure attend le premier « Suivante »
  }
});
