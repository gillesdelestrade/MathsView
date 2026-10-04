/*
 * Convertir des durées (5ème) — secondes, minutes, heures, jours.
 *
 * Un million de secondes, ça fait combien de jours ? Les durées ne se
 * convertissent pas comme les longueurs : le tableau de conversion ne sert à
 * rien, parce qu'on ne compte pas de 10 en 10 mais de 60 en 60, puis de 24 en
 * 24. La figure remplace le tableau par QUATRE CADRANS, comme ceux d'une
 * montre :
 *
 *      secondes      minutes       heures        jours
 *      1 tour        1 tour        2 tours       1 tour
 *      = 60 s        = 60 min      = 24 h        = 365 j
 *      = 1 min       = 1 h         = 1 jour      = 1 an
 *
 * Chaque tour complet d'un cadran fait avancer le suivant d'un cran : un tour
 * de secondes, c'est +6° sur le cadran des minutes ; un tour de minutes, +30°
 * sur celui des heures ; deux tours d'heures, à peine 1° sur celui des jours
 * (360° ÷ 365). Le bouton « Le principe des cadrans » montre exactement cela.
 *
 * Convertir, c'est alors COMPTER DES TOURS :
 *   - vers une unité plus grande, on divise par 60 (ou 24) : le quotient est
 *     le nombre de tours complets, qui passe au cadran suivant, et le RESTE
 *     est ce qu'on lit encore sur le cadran de départ.
 *         1 000 000 s = 60 × 16 666 + 40  →  16 666 min et 40 s
 *         16 666 min  = 60 × 277 + 46     →  277 h et 46 min
 *         277 h       = 24 × 11 + 13      →  11 j et 13 h
 *     donc 1 000 000 s = 11 j 13 h 46 min 40 s ;
 *   - vers une unité plus petite, on multiplie : chaque jour se vide en 24 h,
 *     chaque heure en 60 min, chaque minute en 60 s.
 *         3 j 5 h 20 min 7 s = 77 h 20 min 7 s = 4 640 min 7 s = 278 407 s.
 *
 * Dans les deux sens, l'animation montre les aiguilles : un cadran qui
 * « déborde » (plus d'un tour) a son aiguille estompée au zéro, et la
 * division la pose sur le reste ; une multiplication ramène l'aiguille à zéro
 * et verse le contenu du cadran dans le suivant. Les calculs s'écrivent
 * ligne à ligne, division posée comprise.
 */
MathsView.register({
  id: 'durees',
  title: 'Convertir des durées',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Grandeurs et mesures',
  exercices: ['durees'],
  theme: 'Grandeurs — secondes, minutes, heures, jours : convertir en comptant les tours',
  description:
    'Un million de secondes, ça fait <strong>combien de jours</strong> ? Les durées ne se ' +
    'convertissent pas de 10 en 10 comme les longueurs, mais de <strong>60 en 60</strong> ' +
    '(secondes, minutes) puis de <strong>24 en 24</strong> (heures). Le tableau de conversion ' +
    'ne sert à rien : à la place, quatre <strong>cadrans</strong>.' +
    '<br>Un tour du cadran des secondes vaut 60 s, c\'est-à-dire <strong>1 minute</strong> : ' +
    'l\'aiguille des minutes avance d\'un cran (6°). Un tour de minutes vaut <strong>1 heure</strong> ' +
    '(30° sur le cadran des heures). Deux tours d\'heures font <strong>1 jour</strong>, et le ' +
    'cadran des jours avance d\'à peine 1° : il lui faut 365 jours pour faire son tour.' +
    '<br>Convertir, c\'est <strong>compter des tours</strong>. Vers une unité plus grande, on ' +
    '<strong>divise</strong> — et la division se <strong>pose</strong> sous les cadrans, comme au ' +
    'primaire : le quotient passe au cadran suivant, le <strong>reste</strong> ' +
    'se lit sur le cadran de départ. Vers une unité plus petite, on <strong>multiplie</strong> : ' +
    'chaque cadran se vide dans le suivant.' +
    '<br><em>Lance « Le principe des cadrans », puis essaie les exemples, ou saisis ta propre ' +
    'durée et choisis le sens de la conversion.</em>',
  notes:
    '<ul>' +
    '<li><strong>Les équivalences.</strong> 1 min = 60 s ; 1 h = 60 min = 3 600 s ; ' +
    '1 j = 24 h = 1 440 min = 86 400 s ; 1 an = 365 j (366 les années bissextiles).</li>' +
    '<li><strong>Vers une unité plus grande : on divise.</strong> 1 000 000 s en minutes ? ' +
    'On compte les paquets de 60 : \\( 1\\,000\\,000 = 60 \\times 16\\,666 + 40 \\), donc ' +
    '1 000 000 s = 16 666 min 40 s. Le <strong>quotient</strong> donne la nouvelle unité, le ' +
    '<strong>reste</strong> garde l\'ancienne. Et on recommence : 16 666 min = 277 h 46 min, ' +
    '277 h = 11 j 13 h. Au total : <strong>1 000 000 s = 11 j 13 h 46 min 40 s</strong>.</li>' +
    '<li><strong>Vers une unité plus petite : on multiplie.</strong> 3 j 5 h = 3 × 24 h + 5 h = ' +
    '77 h ; 77 h = 77 × 60 min = 4 620 min ; 4 620 min = 4 620 × 60 s = 277 200 s.</li>' +
    '<li><strong>Le piège.</strong> 1,5 h n\'est pas 1 h 50 min mais 1 h 30 min : une demi-heure ' +
    'fait 30 min. De même 2,25 h = 2 h 15 min. Pour les durées, on n\'écrit pas de virgule : ' +
    'on garde des unités séparées.</li>' +
    '<li><strong>Vérifier avec la montre.</strong> Sur les cadrans, chaque unité fait moins d\'un ' +
    'tour : 0 à 59 s, 0 à 59 min, 0 à 23 h. Si tu lis « 70 min », c\'est que la conversion ' +
    'n\'est pas finie : 70 min = 1 h 10 min.</li>' +
    '<li><strong>Les ordres de grandeur.</strong> 1 000 s ≈ 17 min ; 10 000 s ≈ 2 h 47 min ; ' +
    '100 000 s ≈ 1 j 4 h ; 1 000 000 s ≈ 11 j et demi ; un milliard de secondes ≈ 31 ans et ' +
    '8 mois.</li>' +
    '</ul>',
  board: {
    boundingbox: [-0.5, 8.5, 16.5, -4.25], keepaspectratio: true,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Convertir des durées',
    figures: [{
      legende: 'Un tour de secondes = 1 min : l\'aiguille des minutes avance d\'un cran (6°).',
      boundingbox: [-2.6, 2.4, 7.0, -2.4],
      keepaspectratio: true,
      largeur: 62, hauteur: 32,
      dessine: function (board) {
        function cadran(cx, cy, r, n, long, col, nom) {
          board.create('circle', [[cx, cy], r], { strokeColor: '#334155', strokeWidth: 1.2, fillColor: '#fff', fillOpacity: 1, fixed: true, highlight: false });
          for (var i = 0; i < n; i++) {
            var a = i * 2 * Math.PI / n, l = i % long === 0 ? 0.26 : 0.12;
            board.create('segment', [[cx + (r - l) * Math.sin(a), cy + (r - l) * Math.cos(a)], [cx + r * Math.sin(a), cy + r * Math.cos(a)]],
              { strokeColor: '#334155', strokeWidth: i % long === 0 ? 1.3 : 0.7, fixed: true, highlight: false });
          }
          board.create('text', [cx, cy - r - 0.3, nom], { anchorX: 'middle', anchorY: 'top', fontSize: 8, color: col, cssStyle: 'font-weight:700;white-space:nowrap', fixed: true, highlight: false });
          return function (deg, w) {
            var a = deg * Math.PI / 180;
            board.create('segment', [[cx, cy], [cx + 0.86 * r * Math.sin(a), cy + 0.86 * r * Math.cos(a)]], { strokeColor: col, strokeWidth: w || 2.2, lineCap: 'round', fixed: true, highlight: false });
            board.create('point', [cx, cy], { size: 1.6, color: col, fixed: true, withLabel: false, highlight: false, showInfobox: false });
          };
        }
        var S = cadran(-0.5, 0.2, 1.65, 60, 5, '#2563eb', '60 s = 1 tour = 1 min');
        var M = cadran(4.6, 0.2, 1.65, 60, 5, '#7c3aed', '+6° aux minutes');
        // Le tour complet des secondes, en bleu pâle, puis l'aiguille revenue en haut.
        board.create('curve', [[-0.5].concat((function () { var t = []; for (var i = 0; i <= 60; i++) t.push(-0.5 + 1.35 * Math.sin(i * Math.PI / 30)); return t; })(), [-0.5]),
                               [0.2].concat((function () { var t = []; for (var i = 0; i <= 60; i++) t.push(0.2 + 1.35 * Math.cos(i * Math.PI / 30)); return t; })(), [0.2])],
          { strokeColor: '#2563eb', strokeWidth: 0.6, fillColor: '#2563eb', fillOpacity: 0.12, fixed: true, highlight: false });
        S(360);
        // Les minutes : de 0 à la première graduation, 6°.
        board.create('curve', [[4.6, 4.6, 4.6 + 1.35 * Math.sin(Math.PI / 30), 4.6], [0.2, 1.55, 0.2 + 1.35 * Math.cos(Math.PI / 30), 0.2]],
          { strokeColor: '#7c3aed', strokeWidth: 0.6, fillColor: '#7c3aed', fillOpacity: 0.3, fixed: true, highlight: false });
        M(6);
        board.create('text', [4.6 + 0.55, 0.2 + 1.95, '6°'], { anchorX: 'left', anchorY: 'middle', fontSize: 9, color: '#7c3aed', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [2.05, 0.2, '→'], { anchorX: 'middle', anchorY: 'middle', fontSize: 16, color: '#64748b', fixed: true, highlight: false });
      }
    }],
    points: [
      '1 min = 60 s ; 1 h = 60 min = 3 600 s ; 1 j = 24 h = 86 400 s ; 1 an = 365 j.',
      'Vers une unité plus <b>grande</b> : on <b>divise</b> par 60 (ou par 24). Le quotient change d\'unité, le <b>reste</b> garde l\'ancienne.',
      'Vers une unité plus <b>petite</b> : on <b>multiplie</b> par 24 (jours → heures) puis par 60, et encore par 60.',
      'Sur une montre, chaque unité fait moins d\'un tour : 0 à 59 s, 0 à 59 min, 0 à 23 h. « 70 min » n\'est pas fini : c\'est 1 h 10 min.',
      'Pas de virgule dans une durée : 1,5 h, c\'est 1 h <b>30</b> min, pas 1 h 50.'
    ],
    exemples: [
      '\\( 1\\,000\\,000 = 60 \\times 16\\,666 + 40 \\) : 1 000 000 s = 16 666 min 40 s = 277 h 46 min 40 s = <b>11 j 13 h 46 min 40 s</b>.',
      '3 j 5 h = 3 × 24 + 5 = 77 h = 77 × 60 = 4 620 min = 277 200 s.',
      '1 h 30 min = 90 min = 5 400 s ; 10 000 s = 2 h 46 min 40 s.'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Les quatre unités                                                    */
    /* ==================================================================== */
    var U = ['s', 'm', 'h', 'j'];
    var NOM = { s: 's', m: 'min', h: 'h', j: 'j' };
    var LONG = { s: 'secondes', m: 'minutes', h: 'heures', j: 'jours' };
    var MOD = { s: 60, m: 60, h: 24 };                  // combien pour passer au suivant
    var DEG = { s: 6, m: 6, h: 30, j: 360 / 365 };      // degrés par unité sur son cadran
    var COL = { s: '#2563eb', m: '#7c3aed', h: '#d97706', j: '#16a34a' };
    var INK = '#334155', SOFT = '#64748b', C_NO = '#dc2626', C_YES = '#16a34a';
    var SUIV = { s: 'm', m: 'h', h: 'j' };
    var PREC = { m: 's', h: 'm', j: 'h' };

    var CX = { s: 2.0, m: 6.0, h: 10.0, j: 14.0 }, CY = 5.55, R = 1.55;

    /* ==================================================================== */
    /* État                                                                 */
    /* ==================================================================== */
    var vals = { s: 0, m: 0, h: 0, j: 0 };     // ce qui est écrit sous chaque cadran
    var ang  = { s: 0, m: 0, h: 0, j: 0 };     // angle de chaque aiguille (degrés, sens horaire)
    var dim  = { s: false, m: false, h: false, j: false };   // cadran qui déborde
    var fan  = { s: null, m: null, h: null, j: null };       // secteur balayé : angle de départ
    var titre = '', ligneA = '', ligneB = '', memoTxt = '';
    var plan = [];           // les étapes de la conversion en cours
    var phase = 0;           // combien d'étapes sont jouées (ou en cours)
    var refs = null;

    /* ==================================================================== */
    /* Écritures                                                            */
    /* ==================================================================== */
    function fmtN(n) {
      n = Math.round(n);
      var s = String(Math.abs(n)), out = '';
      while (s.length > 3) { out = ' ' + s.slice(-3) + out; s = s.slice(0, -3); }
      return (n < 0 ? '−' : '') + s + out;
    }
    function duree(v) {
      var parts = [];
      ['j', 'h', 'm', 's'].forEach(function (u) {
        if (Math.round(v[u])) parts.push(fmtN(v[u]) + ' ' + NOM[u]);
      });
      return parts.length ? parts.join(' ') : '0 s';
    }
    function teinte(u, t) { return '<span style="color:' + COL[u] + '">' + t + '</span>'; }
    function copie(o) { var c = {}; for (var k in o) c[k] = o[k]; return c; }
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) { o._mv[key] = val; var t = {}; t[key] = val; o.setAttribute(t); }
    }
    function show(o, v) { attr(o, 'visible', !!v); }
    function rad(deg) { return deg * Math.PI / 180; }
    function px(u, deg, r) { return CX[u] + r * Math.sin(rad(deg)); }
    function py(u, deg, r) { return CY + r * Math.cos(rad(deg)); }

    /* ==================================================================== */
    /* Les cadrans                                                          */
    /* ==================================================================== */
    var cadrans = {};
    U.forEach(function (u) {
      board.create('circle', [[CX[u], CY], R], {
        strokeColor: INK, strokeWidth: 2, fillColor: '#ffffff', fillOpacity: 1,
        fixed: true, highlight: false, layer: 2
      });
      // Les graduations, en une seule courbe (NaN sépare les traits).
      var n = u === 'h' ? 60 : u === 'j' ? 73 : 60;
      var longues = u === 'h' ? 5 : u === 'j' ? 20 : 5;
      var xs = [], ys = [];
      for (var i = 0; i < n; i++) {
        var a = i * 360 / n, l = i % longues === 0 ? 0.28 : 0.13;
        xs.push(px(u, a, R - l), px(u, a, R), NaN);
        ys.push(py(u, a, R - l), py(u, a, R), NaN);
      }
      board.create('curve', [xs, ys], { strokeColor: INK, strokeWidth: 1.2, fixed: true, highlight: false, layer: 3 });
      // Les nombres du cadran.
      var etiq = u === 'h' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
               : u === 'j' ? [100, 200, 300, 365]
               : [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
      etiq.forEach(function (v) {
        var a = u === 'h' ? v * 30 : u === 'j' ? v * DEG.j : v * 6;
        board.create('text', [px(u, a, R - 0.55), py(u, a, R - 0.55), String(v)], {
          anchorX: 'middle', anchorY: 'middle', fontSize: u === 'h' ? 11 : 9, color: SOFT,
          fixed: true, highlight: false, layer: 3
        });
      });
      // Le secteur balayé pendant une étape.
      var secteur = board.create('curve', [[], []], {
        strokeColor: COL[u], strokeWidth: 1, fillColor: COL[u], fillOpacity: 0.18,
        fixed: true, highlight: false, layer: 4
      });
      secteur.updateDataArray = function () {
        var de = fan[u];
        if (de === null || de === undefined) { this.dataX = []; this.dataY = []; return; }
        var a = ang[u], total = a - de;
        if (total < 0) { var t = de; de = a; a = t; total = -total; }
        if (total > 359.9) { de = a - 359.9; total = 359.9; }
        var X = [CX[u]], Y = [CY], N = Math.max(2, Math.ceil(total / 4));
        for (var i = 0; i <= N; i++) {
          var d = de + total * i / N;
          X.push(px(u, d, R * 0.82)); Y.push(py(u, d, R * 0.82));
        }
        X.push(CX[u]); Y.push(CY);
        this.dataX = X; this.dataY = Y;
      };
      // L'aiguille.
      var bout = board.create('point', [function () { return px(u, ang[u], R * 0.86); },
                                        function () { return py(u, ang[u], R * 0.86); }],
        { visible: false, fixed: true, withLabel: false });
      var aiguille = board.create('segment', [[CX[u], CY], bout], {
        strokeColor: COL[u], strokeWidth: 4, lineCap: 'round', fixed: true, highlight: false, layer: 6
      });
      board.create('point', [CX[u], CY], {
        size: 3, color: COL[u], fixed: true, withLabel: false, highlight: false, showInfobox: false, layer: 7
      });
      // Le nom du cadran, au-dessus ; la valeur, en dessous ; la règle du tour.
      board.create('text', [CX[u], CY + R + 0.4, LONG[u]], {
        anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: COL[u],
        cssStyle: 'font-weight:800;text-transform:uppercase;letter-spacing:.04em', fixed: true, highlight: false, layer: 5
      });
      var compteur = board.create('text', [CX[u], CY - R - 0.45, function () {
        return fmtN(vals[u]) + ' ' + NOM[u];
      }], { anchorX: 'middle', anchorY: 'middle', fontSize: 18, color: COL[u],
            cssStyle: 'font-weight:800;white-space:nowrap', fixed: true, highlight: false, layer: 5 });
      var regle = { s: '1 tour = 60 s = 1 min', m: '1 tour = 60 min = 1 h',
                    h: '2 tours = 24 h = 1 j', j: '1 tour = 365 j = 1 an' }[u];
      var cran = { s: '→ +6° aux minutes', m: '→ +30° aux heures', h: '→ ≈ +1° aux jours', j: '' }[u];
      board.create('text', [CX[u], CY - R - 0.95, regle], {
        anchorX: 'middle', anchorY: 'middle', fontSize: 10, color: SOFT,
        cssStyle: 'white-space:nowrap', fixed: true, highlight: false, layer: 5
      });
      board.create('text', [CX[u], CY - R - 1.3, cran], {
        anchorX: 'middle', anchorY: 'middle', fontSize: 10, color: SOFT,
        cssStyle: 'white-space:nowrap', fixed: true, highlight: false, layer: 5
      });
      // Un cadran qui déborde : « plus d'un tour ».
      var deborde = board.create('text', [CX[u], CY - 0.65, function () {
        return u === 'j' ? '' : 'plus de ' + fmtN(Math.floor(vals[u] / MOD[u])) + ' tour' +
               (Math.floor(vals[u] / MOD[u]) > 1 ? 's' : '') + ' !';
      }], { anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: C_NO,
            cssStyle: 'font-weight:700;white-space:nowrap;background:rgba(255,255,255,.92);padding:1px 4px;border-radius:4px',
            fixed: true, highlight: false, layer: 8, visible: false });
      cadrans[u] = { aiguille: aiguille, secteur: secteur, compteur: compteur, deborde: deborde };
    });

    /* ==================================================================== */
    /* Les textes : le titre, l'opération, le résultat, le commentaire       */
    /*                                                                      */
    /* Pendant une division, la division POSÉE occupe la gauche du bas du   */
    /* tableau et les textes se serrent à droite ; sinon ils sont centrés.   */
    /* ==================================================================== */
    var divHtml = '';
    function xTextes() { return divHtml ? 11.3 : 8.0; }
    function largeur() { return divHtml ? 'width:330px;' : 'width:600px;'; }
    board.create('text', [8.0, 8.15, function () { return titre; }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: INK,
      cssStyle: 'font-weight:800;white-space:nowrap', fixed: true, highlight: false, layer: 5
    });
    var tA = board.create('text', [xTextes, 1.45, function () { return ligneA; }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: INK,
      cssStyle: 'font-weight:700;white-space:normal;display:inline-block;text-align:center;' + largeur(),
      fixed: true, highlight: false, layer: 5
    });
    var tB = board.create('text', [xTextes, -0.45, function () { return ligneB; }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 19, color: C_YES,
      cssStyle: 'font-weight:800;white-space:normal;display:inline-block;text-align:center;' + largeur(),
      fixed: true, highlight: false, layer: 5
    });
    var tM = board.create('text', [xTextes, -2.1, function () { return memoTxt; }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: SOFT,
      cssStyle: 'white-space:normal;display:inline-block;text-align:center;' + largeur(),
      fixed: true, highlight: false, layer: 5
    });
    // La division posée, comme au primaire : la potence, les soustractions,
    // les chiffres abaissés un à un, et le reste qui finit sur le cadran.
    board.create('text', [0.3, 2.35, function () { return divHtml; }], {
      anchorX: 'left', anchorY: 'top', fontSize: 12, color: INK,
      cssStyle: 'font-family:"SF Mono",Menlo,Consolas,monospace;line-height:1.2;white-space:pre;' +
                'text-align:left;background:rgba(255,255,255,.95);padding:5px 9px;border-radius:7px;' +
                'border:1px solid #e2e8f0',
      fixed: true, highlight: false, layer: 8
    });

    /* ==================================================================== */
    /* La division posée                                                    */
    /*                                                                      */
    /* On la refait comme à l'école : on prend la première tranche assez     */
    /* grande, on cherche combien de fois le diviseur y tient, on écrit le   */
    /* produit en dessous et on soustrait, on abaisse le chiffre suivant,    */
    /* et on recommence. Le dernier nombre écrit est le RESTE. Le paramètre  */
    /* p (0 → 1) découvre les lignes une à une : c'est l'animation.          */
    /* ==================================================================== */
    function lignesDivision(D, d) {
      var ch = String(D), n = ch.length, i = 0, cur = 0, commence = false;
      var lignes = [], quotient = '';
      while (i < n) {
        cur = cur * 10 + (+ch.charAt(i));
        if (!commence && cur < d && i < n - 1) { i++; continue; }
        commence = true;
        var q = Math.floor(cur / d), r = cur - q * d;
        quotient += String(q);
        if (q > 0) lignes.push({ txt: cale('−' + String(q * d), i), type: 'sous', q: q });
        if (i < n - 1) lignes.push({ txt: cale(String(r) + ch.charAt(i + 1), i + 1), type: 'abaisse', q: q, r: r });
        else lignes.push({ txt: cale(String(r), i), type: 'reste', r: r });
        cur = r; i++;
      }
      return { lignes: lignes, quotient: quotient, n: n };
    }
    // Une chaîne alignée à droite sur la colonne `col` du dividende.
    function cale(t, col) {
      var pad = col + 1 - t.length;
      return (pad > 0 ? new Array(pad + 1).join(' ') : '') + t;
    }
    function poseDivision(D, d, p, colU, colN) {
      var L = lignesDivision(D, d), ch = String(D);
      var total = L.lignes.length;
      var visibles = p >= 1 ? total : Math.min(total, Math.floor(p * (total + 1)));
      // le quotient se découvre chiffre à chiffre, au rythme des soustractions
      var faits = 0;
      for (var k = 0; k < visibles; k++) if (L.lignes[k].type !== 'sous') faits++;
      var qHtml = '<span style="color:' + colN + ';font-weight:800">' + L.quotient.slice(0, faits) + '</span>';
      var larg = ch.length;
      function droite(k) {
        if (k === 0) return ' │ ' + d;
        if (k === 1) return ' │ ' + new Array(Math.max(L.quotient.length, String(d).length) + 2).join('─');
        if (k === 2) return ' │ ' + qHtml;
        return '';
      }
      function gauche(k) {
        if (k === 0) return ch;
        var l = L.lignes[k - 1];
        if (!l || k - 1 >= visibles) return new Array(larg + 1).join(' ');
        if (l.type === 'reste') {
          return l.txt.replace(/\S+$/, function (m) {
            return '<span style="color:' + colU + ';font-weight:800;text-decoration:underline">' + m + '</span>';
          });
        }
        if (l.type === 'abaisse') {
          // le chiffre abaissé, en gris
          return l.txt.slice(0, -1) + '<span style="color:' + SOFT + '">' + l.txt.slice(-1) + '</span>';
        }
        return l.txt;
      }
      var rows = [], nb = Math.max(3, total + 1);
      for (var k = 0; k < nb; k++) rows.push(gauche(k) + droite(k));
      return rows.join('\n').replace(/\s+$/, '');
    }

    /* ==================================================================== */
    /* Rafraîchissement                                                     */
    /* ==================================================================== */
    function refresh() {
      U.forEach(function (u) {
        var c = cadrans[u];
        attr(c.aiguille, 'strokeOpacity', dim[u] ? 0.25 : 1);
        show(c.deborde, dim[u] && u !== 'j');
      });
      attr(tA, 'cssStyle', 'font-weight:700;white-space:normal;display:inline-block;text-align:center;' + largeur());
      attr(tB, 'cssStyle', 'font-weight:800;white-space:normal;display:inline-block;text-align:center;' + largeur());
      attr(tM, 'cssStyle', 'white-space:normal;display:inline-block;text-align:center;' + largeur());
      panneauSiBesoin();
    }
    function redraw() { refresh(); board.update(); }

    /* ==================================================================== */
    /* Les étapes : chacune interpole entre deux états complets             */
    /* ==================================================================== */
    function lerp(a, b, p) { return a + (b - a) * p; }

    // Un état : valeurs, angles, cadrans qui débordent, secteurs à montrer.
    function etat(v, a, d) {
      return { vals: copie(v), ang: copie(a), dim: copie(d) };
    }
    // L'angle « normal » d'une aiguille pour une valeur qui tient sur son cadran.
    function angleDe(u, v) { return DEG[u] * v; }
    function debordeQ(u, v) { return u !== 'j' && v >= MOD[u]; }

    function etape(de, vers, textes, duree) {
      return {
        dur: duree || 900,
        step: function (p) {
          U.forEach(function (u) {
            vals[u] = lerp(de.vals[u], vers.vals[u], p);
            ang[u] = lerp(de.ang[u], vers.ang[u], p);
            dim[u] = p < 1 ? (de.dim[u] && vers.dim[u]) : vers.dim[u];
            fan[u] = textes.fans && textes.fans[u] !== undefined ? textes.fans[u] : null;
          });
          titre = textes.titre; ligneA = textes.ligneA; ligneB = textes.ligneB; memoTxt = textes.memo;
          divHtml = textes.division
            ? poseDivision(textes.division.D, textes.division.d, p, COL[textes.division.u], COL[textes.division.n])
            : '';
          phase = textes.index + 1;
          refresh();
        },
        after: function () { this.step(1); },
        explication: textes.explication,
        division: textes.division
          ? poseDivision(textes.division.D, textes.division.d, 1, COL[textes.division.u], COL[textes.division.n])
          : '',
        ligneB: textes.ligneB
      };
    }

    /* ==================================================================== */
    /* Scénario 1 : le principe des cadrans                                  */
    /* ==================================================================== */
    function planPrincipe() {
      var z = { s: 0, m: 0, h: 0, j: 0 }, f = { s: false, m: false, h: false, j: false };
      var e0 = etat(z, z, f);
      var e1 = etat({ s: 60, m: 1, h: 0, j: 0 }, { s: 360, m: 6, h: 0, j: 0 }, f);
      var e2 = etat({ s: 60, m: 60, h: 1, j: 0 }, { s: 360, m: 360, h: 30, j: 0 }, f);
      var e3 = etat({ s: 60, m: 60, h: 24, j: 1 }, { s: 360, m: 360, h: 720, j: DEG.j }, f);
      var e4 = etat({ s: 60, m: 60, h: 24, j: 365 }, { s: 360, m: 360, h: 720, j: 360 }, f);
      var T = 'Le principe des cadrans : un tour complet ici, un cran de plus à côté';
      return [
        etape(e0, e1, { index: 0, titre: T, fans: { s: 0, m: 0 },
          ligneA: teinte('s', '60 s') + ' = 1 tour du cadran des secondes = ' + teinte('m', '1 min'),
          ligneB: 'Les minutes avancent d\'un cran : 6° (360° ÷ 60).',
          memo: 'Toute la conversion des durées tient dans ce mouvement.',
          explication: 'Un <strong>tour complet</strong> des secondes, c\'est 60 s, donc <strong>1 min</strong> : ' +
                       'le cadran des minutes avance d\'<strong>un cran</strong>, 6° (il y a 60 crans sur 360°).' }, 1800),
        etape(e1, e2, { index: 1, titre: T, fans: { m: 6, h: 0 },
          ligneA: teinte('m', '60 min') + ' = 1 tour du cadran des minutes = ' + teinte('h', '1 h'),
          ligneB: 'Les heures avancent d\'un cran : 30° (360° ÷ 12).',
          memo: 'Pendant ce tour des minutes, la trotteuse a fait 60 tours : 60 × 60 = 3 600 s dans une heure.',
          explication: 'Après 60 tours de secondes, les minutes ont fait <strong>un tour</strong> : 60 min = ' +
                       '<strong>1 h</strong>, et le cadran des heures avance d\'un cran, 30°. ' +
                       'Au passage : 1 h = 60 × 60 s = <strong>3 600 s</strong>.' }, 1800),
        etape(e2, e3, { index: 2, titre: T, fans: { h: 30, j: 0 },
          ligneA: teinte('h', '24 h') + ' = 2 tours du cadran des heures = ' + teinte('j', '1 jour'),
          ligneB: 'Les jours avancent à peine : 360° ÷ 365 ≈ 1°.',
          memo: 'Un jour vaut 24 × 60 = 1 440 min, soit 1 440 × 60 = 86 400 s.',
          explication: 'Le cadran des heures n\'a que 12 chiffres : il faut <strong>deux tours</strong> pour ' +
                       'faire 24 h, c\'est-à-dire <strong>1 jour</strong>. Le cadran des jours, lui, compte ' +
                       'jusqu\'à 365 : il avance d\'à peine 1°. Un jour = 24 × 60 = 1 440 min = 86 400 s.' }, 1800),
        etape(e3, e4, { index: 3, titre: T, fans: { j: DEG.j },
          ligneA: teinte('j', '365 jours') + ' = 1 tour du cadran des jours = 1 an',
          ligneB: 'Un an = 365 × 86 400 s = 31 536 000 s.',
          memo: 'Pour convertir, on refait ce chemin : on compte les tours, dans un sens ou dans l\'autre.',
          explication: 'Et <strong>365 jours</strong> font le tour du dernier cadran : <strong>1 an</strong>. ' +
                       'Pour convertir une durée, on refait exactement ce chemin en comptant les tours — ' +
                       'c\'est une division — ou en les défaisant — c\'est une multiplication.' }, 1800)
      ];
    }

    /* ==================================================================== */
    /* Scénario 2 : décomposer en j h min s (on divise, de bas en haut)      */
    /* ==================================================================== */
    function depart(v) {
      var a = {}, d = {};
      U.forEach(function (u) {
        d[u] = debordeQ(u, v[u]);
        a[u] = d[u] ? 0 : angleDe(u, v[u]);
      });
      return etat(v, a, d);
    }
    function planDecompose(entree) {
      var cur = depart(entree), out = [];
      var T = 'Écrire ' + duree(entree) + ' en jours, heures, minutes et secondes';
      ['s', 'm', 'h'].forEach(function (u) {
        var v = Math.round(cur.vals[u]);
        if (v < MOD[u]) return;
        var q = Math.floor(v / MOD[u]), r = v % MOD[u], n = SUIV[u];
        var vers = etat(cur.vals, cur.ang, cur.dim);
        vers.vals[u] = r; vers.ang[u] = angleDe(u, r); vers.dim[u] = false;
        vers.vals[n] = cur.vals[n] + q;
        vers.dim[n] = debordeQ(n, vers.vals[n]);
        vers.ang[n] = vers.dim[n] ? 0 : angleDe(n, vers.vals[n]);
        var fans = {}; fans[u] = 0; if (!vers.dim[n]) fans[n] = cur.dim[n] ? 0 : cur.ang[n];
        out.push(etape(cur, vers, {
          index: out.length, titre: T, fans: fans,
          division: { D: v, d: MOD[u], u: u, n: n },
          ligneA: teinte(u, fmtN(v) + ' ' + NOM[u]) + ' ÷ ' + MOD[u] + ' : ' + fmtN(v) + ' = ' + MOD[u] + ' × ' +
                  fmtN(q) + ' + ' + fmtN(r) + '<br>→ ' + teinte(n, fmtN(q) + ' ' + NOM[n]) + ' et il reste ' +
                  teinte(u, fmtN(r) + ' ' + NOM[u]),
          ligneB: duree(entree) + ' = ' + duree(vers.vals),
          memo: 'La division posée : ' + fmtN(q) + ' tours complets passent aux ' + LONG[n] + ' ; le reste, ' +
                fmtN(r) + ' ' + NOM[u] + ', se lit sur le cadran des ' + LONG[u] + '.',
          explication: '<strong style="color:' + COL[u] + '">' + fmtN(v) + ' ' + NOM[u] + '</strong>, c\'est ' +
                       'plus d\'un tour. Combien de paquets de ' + MOD[u] + ' ? On <strong>divise</strong> : ' +
                       fmtN(v) + ' ÷ ' + MOD[u] + ' = <strong>' + fmtN(q) + '</strong> reste <strong>' + fmtN(r) +
                       '</strong>, autrement dit ' + fmtN(v) + ' = ' + MOD[u] + ' × ' + fmtN(q) + ' + ' + fmtN(r) +
                       '. Le quotient ' + fmtN(q) + ' passe aux <strong style="color:' + COL[n] + '">' + LONG[n] +
                       '</strong>' + (cur.vals[n] ? ' (qui en avaient déjà ' + fmtN(cur.vals[n]) + ' : ' +
                       fmtN(cur.vals[n]) + ' + ' + fmtN(q) + ' = ' + fmtN(vers.vals[n]) + ')' : '') +
                       ', le reste ' + fmtN(r) + ' ' + NOM[u] + ' garde son unité.'
        }));
        cur = vers;
      });
      return { plan: out, debut: depart(entree), titre: T, final: duree(cur.vals),
               rien: out.length === 0 };
    }

    /* ==================================================================== */
    /* Scénario 3 : tout convertir en une unité (on multiplie, de haut en bas)*/
    /* ==================================================================== */
    function planVide(entree, cible) {
      var cur = depart(entree), out = [];
      var T = 'Écrire ' + duree(entree) + ' en ' + LONG[cible];
      var ordre = ['j', 'h', 'm'];
      for (var i = 0; i < ordre.length; i++) {
        var u = ordre[i], n = PREC[u];
        if (U.indexOf(u) <= U.indexOf(cible)) break;    // on s'arrête à la cible
        var v = Math.round(cur.vals[u]);
        if (!v) continue;
        var k = MOD[n], produit = v * k, total = Math.round(cur.vals[n]) + produit;
        var vers = etat(cur.vals, cur.ang, cur.dim);
        vers.vals[u] = 0; vers.ang[u] = 0; vers.dim[u] = false;
        vers.vals[n] = total;
        vers.dim[n] = debordeQ(n, total);
        vers.ang[n] = vers.dim[n] ? 0 : angleDe(n, total);
        var fans = {}; fans[u] = cur.dim[u] ? null : 0;
        out.push(etape(cur, vers, {
          index: out.length, titre: T, fans: fans,
          ligneA: teinte(u, fmtN(v) + ' ' + NOM[u]) + ' = ' + fmtN(v) + ' × ' + k + ' ' + NOM[n] + ' = ' +
                  teinte(n, fmtN(produit) + ' ' + NOM[n]) +
                  (Math.round(cur.vals[n]) ? ' ; ' + fmtN(produit) + ' + ' + fmtN(cur.vals[n]) + ' = ' +
                  teinte(n, fmtN(total) + ' ' + NOM[n]) : ''),
          ligneB: duree(entree) + ' = ' + duree(vers.vals),
          memo: 'Chaque ' + (u === 'j' ? 'jour' : u === 'h' ? 'heure' : 'minute') + ' se vide en ' + k + ' ' +
                NOM[n] + ' : le cadran des ' + LONG[u] + ' revient à zéro.',
          explication: 'Les <strong style="color:' + COL[u] + '">' + fmtN(v) + ' ' + NOM[u] + '</strong> se vident ' +
                       'dans le cadran suivant : chaque ' + (u === 'j' ? 'jour' : u === 'h' ? 'heure' : 'minute') +
                       ' vaut ' + k + ' ' + NOM[n] + ', on <strong>multiplie</strong> : ' + fmtN(v) + ' × ' + k +
                       ' = <strong>' + fmtN(produit) + ' ' + NOM[n] + '</strong>' +
                       (Math.round(cur.vals[n]) ? ', et avec les ' + fmtN(cur.vals[n]) + ' ' + NOM[n] + ' déjà là : ' +
                       fmtN(produit) + ' + ' + fmtN(cur.vals[n]) + ' = <strong>' + fmtN(total) + ' ' + NOM[n] + '</strong>.'
                       : '.')
        }));
        cur = vers;
      }
      return { plan: out, debut: depart(entree), titre: T, final: duree(cur.vals),
               rien: out.length === 0 };
    }

    /* ==================================================================== */
    /* Lancer un scénario                                                   */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    var debut = depart({ s: 0, m: 0, h: 0, j: 0 });
    var finalTxt = '';
    var mode = 'decomp';      // 'decomp', 's', 'm', 'h' ou 'principe'

    function poser(e) {
      U.forEach(function (u) { vals[u] = e.vals[u]; ang[u] = e.ang[u]; dim[u] = e.dim[u]; fan[u] = null; });
      divHtml = '';
    }
    function remise() {
      poser(debut);
      phase = 0;
      titre = titreCourant;
      ligneA = plan.length ? '' : messageRien;
      ligneB = '';
      memoTxt = plan.length ? 'Clique « Suivante » pour compter les tours.' : '';
      refresh();
    }
    var titreCourant = '', messageRien = '';

    function lancer(resultat) {
      anim.cancel();
      plan = resultat.plan;
      debut = resultat.debut;
      titreCourant = resultat.titre;
      finalTxt = resultat.final;
      messageRien = resultat.rien
        ? (mode === 'decomp'
            ? 'Chaque cadran fait moins d\'un tour : cette durée est déjà écrite en j, h, min et s.'
            : 'Il n\'y a rien à convertir : la durée est déjà en ' + LONG[mode] + '.')
        : '';
      remise();
      anim.runSteps(plan, remise);
      board.update();
    }

    /* ==================================================================== */
    /* Panneau                                                              */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    var derniere = '';
    function renderPanel() {
      var html = '<div class="props-name">' + titreCourant + '</div>';
      if (mode === 'principe') {
        html += '<div class="props-label">Quatre cadrans, un seul mouvement</div>';
      } else {
        html += '<div class="props-label">' + (mode === 'decomp'
          ? 'Vers une unité plus grande : on divise, et on garde le reste'
          : 'Vers une unité plus petite : on multiplie') + '</div>';
      }
      if (!plan.length) {
        html += '<p style="margin:.2rem 0 .5rem">' + messageRien + '</p>';
      } else if (phase === 0) {
        html += '<p style="margin:.2rem 0 .5rem;color:var(--ink-soft)">Clique « Suivante » : chaque étape ' +
                (mode === 'principe' ? 'fait un tour de cadran.' : 'compte les tours d\'un cadran.') + '</p>';
      } else {
        html += '<ol class="props-list" style="padding-left:1.4rem">';
        for (var i = 0; i < Math.min(phase, plan.length); i++) {
          html += '<li style="margin:.3rem 0">' + plan[i].explication +
                  (mode !== 'principe' ? ' <span style="color:var(--ink-soft)">Donc ' + plan[i].ligneB + '.</span>' : '') +
                  (plan[i].division ? '<pre class="duree-division">' + plan[i].division + '</pre>' : '') +
                  '</li>';
        }
        html += '</ol>';
        if (phase >= plan.length && mode !== 'principe') {
          html += '<p style="margin:.4rem 0 0"><strong style="color:' + C_YES + '">' + plan[plan.length - 1].ligneB +
                  '</strong></p>';
        }
      }
      html += '<p style="margin:.6rem 0 0;font-size:.85rem;color:var(--ink-soft)">1 min = 60 s · 1 h = 60 min = ' +
              '3 600 s · 1 j = 24 h = 86 400 s · 1 an = 365 j. Pas de virgule dans une durée : 1,5 h = 1 h 30 min.</p>';
      panel.innerHTML = html;
    }
    function panneauSiBesoin() {
      var s = [mode, phase, plan.length, titreCourant].join('|');
      if (s === derniere) return;
      derniere = s;
      renderPanel();
    }

    /* ==================================================================== */
    /* Saisie : une durée et un sens                                        */
    /* ==================================================================== */
    function el(tag, cls, txt) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt != null) e.textContent = txt;
      return e;
    }
    var root = el('div', 'eq-ui ineq-ui');
    var PRESETS = [
      { label: '1 000 000 s → j h min s', v: { j: 0, h: 0, m: 0, s: 1000000 }, mode: 'decomp' },
      { label: '10 000 s → h min s',      v: { j: 0, h: 0, m: 0, s: 10000 },   mode: 'decomp' },
      { label: '86 400 s → j',            v: { j: 0, h: 0, m: 0, s: 86400 },   mode: 'decomp' },
      { label: '250 min → h min',         v: { j: 0, h: 0, m: 250, s: 0 },     mode: 'decomp' },
      { label: '100 h → j h',             v: { j: 0, h: 100, m: 0, s: 0 },     mode: 'decomp' },
      { label: '3 j 5 h 20 min 7 s → s',  v: { j: 3, h: 5, m: 20, s: 7 },      mode: 's' },
      { label: '1 h 30 min → s',          v: { j: 0, h: 1, m: 30, s: 0 },      mode: 's' },
      { label: '2 j 3 h → min',           v: { j: 2, h: 3, m: 0, s: 0 },       mode: 'm' },
      { label: '1 semaine → h',           v: { j: 7, h: 0, m: 0, s: 0 },       mode: 'h' }
    ];
    var presets = el('div', 'ineq-presets');
    var presetBtns = PRESETS.map(function (p) {
      var bt = el('button', 'ineq-preset', p.label);
      bt.type = 'button';
      bt.onclick = function () { poserSaisie(p.v, p.mode); convertir(); };
      presets.appendChild(bt);
      return bt;
    });
    root.appendChild(presets);

    var entry = el('div', 'eq-entry');
    entry.appendChild(el('span', 'eq-entry-lab', 'Durée :'));
    var inputs = {};
    [['j', 'j'], ['h', 'h'], ['m', 'min'], ['s', 's']].forEach(function (d) {
      var i = el('input', 'duree-in duree-' + d[0]);
      i.type = 'number'; i.min = '0'; i.step = '1'; i.value = '0';
      i.setAttribute('aria-label', LONG[d[0]]);
      inputs[d[0]] = i;
      entry.appendChild(i);
      entry.appendChild(el('span', 'eq-x duree-unite', d[1]));
    });
    var sel = el('select', 'ineq-sel duree-sel');
    [['decomp', '→ en j, h, min et s'], ['h', '→ tout en heures'], ['m', '→ tout en minutes'], ['s', '→ tout en secondes']]
      .forEach(function (o) { var op = el('option', null, o[1]); op.value = o[0]; sel.appendChild(op); });
    entry.appendChild(sel);
    var goBtn = el('button', 'eq-rand', 'Convertir'); goBtn.type = 'button';
    var randBtn = el('button', 'eq-rand', '🎲 Une autre durée'); randBtn.type = 'button';
    entry.appendChild(goBtn); entry.appendChild(randBtn);
    root.appendChild(entry);
    var noteEl = el('div', 'eq-note'); root.appendChild(noteEl);

    function poserSaisie(v, m) {
      U.forEach(function (u) { inputs[u].value = String(v[u]); });
      sel.value = m;
    }
    function lireSaisie() {
      var v = {}, ok = true;
      U.forEach(function (u) {
        var n = parseInt(String(inputs[u].value).replace(/\s/g, ''), 10);
        if (!isFinite(n) || n < 0) { n = 0; }
        v[u] = n;
      });
      var total = v.s + 60 * v.m + 3600 * v.h + 86400 * v.j;
      if (total > 99999999) {
        noteEl.innerHTML = '<span style="color:' + C_NO + '">Trop long pour les cadrans : reste en dessous de ' +
                           '99 999 999 s (un peu plus de trois ans).</span>';
        ok = false;
      } else if (total === 0) {
        noteEl.innerHTML = '<span style="color:' + C_NO + '">Saisis une durée : au moins une case différente de 0.</span>';
        ok = false;
      } else noteEl.innerHTML = '';
      return ok ? v : null;
    }
    function convertir() {
      var v = lireSaisie();
      if (!v) return;
      mode = sel.value;
      syncControls();
      lancer(mode === 'decomp' ? planDecompose(v) : planVide(v, mode));
    }
    goBtn.onclick = convertir;
    U.forEach(function (u) {
      inputs[u].onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); convertir(); } };
    });
    sel.onchange = convertir;

    function rnd(a0, b0) { return a0 + Math.floor(Math.random() * (b0 - a0 + 1)); }
    function autre() {
      var genre = rnd(0, 5), v = { j: 0, h: 0, m: 0, s: 0 }, m = 'decomp';
      if (genre === 0) { v.s = rnd(100, 9999); }
      else if (genre === 1) { v.s = rnd(10, 999) * 1000; }
      else if (genre === 2) { v.m = rnd(61, 999); }
      else if (genre === 3) { v.h = rnd(25, 300); v.m = rnd(0, 59); }
      else if (genre === 4) { v.j = rnd(1, 9); v.h = rnd(0, 23); v.m = rnd(0, 59); m = ['s', 'm', 'h'][rnd(0, 2)]; }
      else { v.h = rnd(1, 12); v.m = rnd(0, 59); v.s = rnd(0, 59); m = ['s', 'm'][rnd(0, 1)]; }
      poserSaisie(v, m);
      convertir();
    }
    randBtn.onclick = autre;

    /* ==================================================================== */
    /* Contrôles                                                            */
    /* ==================================================================== */
    function syncControls() {
      var cle = JSON.stringify([U.map(function (u) { return parseInt(inputs[u].value, 10) || 0; }), sel.value]);
      presetBtns.forEach(function (bt, i) {
        var p = PRESETS[i];
        var k = JSON.stringify([U.map(function (u) { return p.v[u]; }), p.mode]);
        bt.className = 'ineq-preset' + (k === cle && mode !== 'principe' ? ' active' : '');
      });
    }
    function principe() {
      mode = 'principe';
      syncControls();
      lancer({ plan: planPrincipe(), debut: depart({ s: 0, m: 0, h: 0, j: 0 }),
               titre: 'Le principe des cadrans', final: '', rien: false });
    }

    refs = mv.addControls([
      { type: 'button', id: 'principe', label: '🕰 Le principe des cadrans', onClick: principe },
      { type: 'button', id: 'play', label: '▶ Rejouer les étapes', onClick: function () {
          lancer({ plan: plan, debut: debut, titre: titreCourant, final: finalTxt, rien: !plan.length });
        } },
      { type: 'button', id: 'tout', label: '⏩ Tout afficher', onClick: function () {
          anim.cancel();
          remise();
          plan.forEach(function (s) { s.step(1); });
          anim.runSteps(plan, remise);
          board.update();
        } }
    ]);

    mv.extras.appendChild(root);
    mv.extras.appendChild(panel);

    poserSaisie(PRESETS[0].v, PRESETS[0].mode);
    convertir();
  }
});
