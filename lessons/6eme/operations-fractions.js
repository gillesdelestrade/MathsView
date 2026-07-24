/*
 * Addition, soustraction et produit de fractions (6ème / 5ème).
 *
 * Un sélecteur choisit l'opération ; le dessin s'adapte :
 *
 *   +  et  −  (dénominateurs quelconques) : trois barres de MÊME largeur (une
 *     unité). On recoupe les deux fractions au dénominateur commun m = PPCM(b,d)
 *     — des traits épais rappellent les parts d'origine, les traits fins les
 *     nouvelles. La barre-résultat colle bout à bout (addition) ou retire
 *     (soustraction) les longueurs coloriées ; elle déborde sur une 2ᵉ ligne
 *     quand la somme dépasse 1.
 *
 *   ×  : modèle d'AIRE dans le carré unité. a/b de la largeur (colonnes) croisé
 *     avec c/d de la hauteur (lignes) ; l'aire violette de recouvrement compte
 *     a·c cases sur b·d — c'est le produit.
 *
 * Technique (comme la leçon « fractions ») : le nombre de parts change avec les
 * dénominateurs, donc jamais de création/destruction — des pools FIXES de
 * courbes, chacune avec un updateDataArray() qui se recalcule et s'efface quand
 * son emplacement (ou l'opération) ne la concerne pas. Tailles bornées par le
 * pire cas sur b,d ∈ [2..6] : opérandes ≤ 30 parts, résultat ≤ 60, grille ≤ 36.
 */
MathsView.register({
  id: 'operations-fractions',
  title: 'Additionner, soustraire, multiplier des fractions',
  level: '6eme',
  theme: 'Nombres — opérations sur les fractions',
  description:
    'Choisis l\'opération, puis les deux fractions.' +
    '<br><strong>Addition / soustraction</strong> : on met les fractions au <strong>même ' +
    'dénominateur</strong> (leur PPCM), puis on ajoute ou on retire les numérateurs.' +
    '<br><strong>Produit</strong> : on multiplie les numérateurs entre eux et les ' +
    'dénominateurs entre eux ; l\'<strong>aire</strong> du carré unité le montre.',
  notes:
    '<ul>' +
    '<li><strong>+ et −</strong> : on n\'additionne pas les dénominateurs ! On recoupe les ' +
    'deux fractions en parts <em>de même taille</em> (dénominateur commun), puis ' +
    '\\( \\frac{A}{m} + \\frac{C}{m} = \\frac{A+C}{m} \\).</li>' +
    '<li>La soustraction demande une 1re fraction <strong>≥</strong> la 2e (résultat positif).</li>' +
    '<li><strong>×</strong> : \\( \\frac{a}{b} \\times \\frac{c}{d} = \\frac{a\\times c}{b\\times d} \\). ' +
    'On prend « une fraction d\'une fraction » — d\'où le rectangle de recouvrement.</li>' +
    '<li>On <strong>simplifie</strong> toujours le résultat si c\'est possible.</li>' +
    '</ul>',
  board: { boundingbox: [-3.2, 5.9, 12.5, -2.4], keepaspectratio: false, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* État                                                                  */
    /* ==================================================================== */
    var op = 'add';                 // 'add' | 'sub' | 'mul'
    var a = 1, b = 2, c = 1, d = 3; // 1/2 et 1/3 au départ
    var DEN_MIN = 2, DEN_MAX = 6;

    var F1 = '#0d9488', F2 = '#2563eb';            // fraction 1 (vert), fraction 2 (bleu)
    var F1L = '#99f6e4', F2L = '#bfdbfe';          // teintes claires (grille produit)
    var OVER = '#7c3aed';                          // recouvrement = produit
    var VIDE = '#eef2f7', TRAIT = '#334155', MUTE = '#94a3b8';

    var X0 = 0, W = 10;
    var B1 = { yTop: 5.00, yBot: 4.10 };           // opérande 1
    var B2 = { yTop: 3.40, yBot: 2.50 };           // opérande 2
    var RR = [{ yTop: 1.35, yBot: 0.45 }, { yTop: 0.25, yBot: -0.65 }]; // résultat (2 lignes)
    var SQ = { yTop: 4.60, yBot: -1.80 };          // carré unité (produit)

    var OP_POOL = 30, RES_POOL = 60, GRID_POOL = 36;

    /* ==================================================================== */
    /* Arithmétique (pure, testée hors navigateur)                           */
    /* ==================================================================== */
    function pgcd(x, y) { x = Math.abs(x); y = Math.abs(y); while (y) { var t = y; y = x % y; x = t; } return x || 1; }
    function ppcm(x, y) { return x * y / pgcd(x, y); }
    function comm() { var m = ppcm(b, d); return { m: m, A: a * (m / b), C: c * (m / d) }; }
    function resN() {   // numérateur du résultat au dénominateur m (add/sub)
      var k = comm();
      return op === 'sub' ? k.A - k.C : k.A + k.C;
    }
    function subOK() { var k = comm(); return k.A >= k.C; }
    function simp(n, dn) {
      if (n === 0) return { n: 0, d: 1, g: dn };
      var g = pgcd(n, dn); return { n: n / g, d: dn / g, g: g };
    }

    function midY(o) { return (o.yTop + o.yBot) / 2; }
    function rect(store, xL, xR, yB, yT) { store.dataX = [xL, xR, xR, xL, xL]; store.dataY = [yB, yB, yT, yT, yB]; }
    function empty(store) { store.dataX = []; store.dataY = []; }

    /* ==================================================================== */
    /* Barres opérandes : deux pools fixes                                   */
    /* ==================================================================== */
    function makeOperand(pool, bar, colorFn, countFn, denFn) {
      for (var i = 0; i < pool; i++) {
        (function (idx) {
          var cell = board.create('curve', [[], []], {
            strokeColor: TRAIT, strokeWidth: 1,
            fillColor: function () { return op !== 'mul' && idx < countFn() ? colorFn() : VIDE; },
            fillOpacity: 0.9, highlight: false, fixed: true
          });
          cell.updateDataArray = function () {
            if (op === 'mul') { empty(this); return; }
            var m = comm().m;
            if (idx >= m) { empty(this); return; }
            rect(this, X0 + idx * W / m, X0 + (idx + 1) * W / m, bar.yBot, bar.yTop);
          };
        })(i);
      }
    }
    // Opérande 1 : A = a·(m/b) parts coloriées ; opérande 2 : C = c·(m/d).
    makeOperand(OP_POOL, B1, function () { return F1; }, function () { return comm().A; });
    makeOperand(OP_POOL, B2, function () { return F2; }, function () { return comm().C; });

    // Traits ÉPAIS aux frontières des parts d'origine (montre le recoupage).
    function makeMajors(bar, nFn) {
      var cv = board.create('curve', [[], []], { strokeColor: TRAIT, strokeWidth: 2.5, fixed: true, highlight: false, layer: 7 });
      cv.updateDataArray = function () {
        if (op === 'mul') { empty(this); return; }
        var n = nFn(), X = [], Y = [];
        for (var k = 0; k <= n; k++) { var x = X0 + k * W / n; X.push(x, x, NaN); Y.push(bar.yBot, bar.yTop, NaN); }
        this.dataX = X; this.dataY = Y;
      };
    }
    makeMajors(B1, function () { return b; });
    makeMajors(B2, function () { return d; });

    /* ==================================================================== */
    /* Barre résultat : un pool fixe (jusqu'à 2 lignes = 2 unités)           */
    /* ==================================================================== */
    for (var ri = 0; ri < RES_POOL; ri++) {
      (function (idx) {
        var cell = board.create('curve', [[], []], {
          strokeColor: TRAIT, strokeWidth: 1,
          fillColor: function () {
            if (op === 'mul') return VIDE;
            if (op === 'sub') { if (!subOK()) return VIDE; return idx < resN() ? F1 : VIDE; }
            var k = comm(), N = k.A + k.C;            // addition : vert puis bleu
            return idx < k.A ? F1 : (idx < N ? F2 : VIDE);
          },
          fillOpacity: 0.9, highlight: false, fixed: true
        });
        cell.updateDataArray = function () {
          if (op === 'mul' || (op === 'sub' && !subOK())) { empty(this); return; }
          var k = comm(), N = resN();
          var units = N > k.m ? 2 : 1, total = units * k.m;
          if (idx >= total) { empty(this); return; }
          var row = Math.floor(idx / k.m), col = idx % k.m;
          if (row > 1) { empty(this); return; }
          rect(this, X0 + col * W / k.m, X0 + (col + 1) * W / k.m, RR[row].yBot, RR[row].yTop);
        };
      })(ri);
    }

    /* ==================================================================== */
    /* Grille produit : un pool fixe (carré unité, b colonnes × d lignes)     */
    /* ==================================================================== */
    for (var gi = 0; gi < GRID_POOL; gi++) {
      (function (idx) {
        var cell = board.create('curve', [[], []], {
          strokeColor: MUTE, strokeWidth: 1,
          fillColor: function () {
            if (op !== 'mul') return VIDE;
            var i = idx % b, j = Math.floor(idx / b);
            var inA = i < a, inC = j < c;
            if (inA && inC) return OVER;
            if (inA) return F1L;
            if (inC) return F2L;
            return VIDE;
          },
          fillOpacity: 0.9, highlight: false, fixed: true
        });
        cell.updateDataArray = function () {
          if (op !== 'mul' || idx >= b * d) { empty(this); return; }
          var i = idx % b, j = Math.floor(idx / b), H = SQ.yTop - SQ.yBot;
          rect(this, X0 + i * W / b, X0 + (i + 1) * W / b,
                     SQ.yTop - (j + 1) * H / d, SQ.yTop - j * H / d);
        };
      })(gi);
    }
    // Repères des extents a/b (largeur) et c/d (hauteur) sur le carré.
    var extTop = board.create('curve', [[], []], { strokeColor: F1, strokeWidth: 4, fixed: true, highlight: false });
    extTop.updateDataArray = function () {
      if (op !== 'mul') { empty(this); return; }
      this.dataX = [X0, X0 + (a / b) * W]; this.dataY = [SQ.yTop + 0.18, SQ.yTop + 0.18];
    };
    var extLeft = board.create('curve', [[], []], { strokeColor: F2, strokeWidth: 4, fixed: true, highlight: false });
    extLeft.updateDataArray = function () {
      if (op !== 'mul') { empty(this); return; }
      var H = SQ.yTop - SQ.yBot;
      this.dataX = [X0 - 0.18, X0 - 0.18]; this.dataY = [SQ.yTop, SQ.yTop - (c / d) * H];
    };

    /* ==================================================================== */
    /* Textes (contenu = '' pour masquer selon l'opération)                  */
    /* ==================================================================== */
    function txt(x, y, fn, opts) {
      return board.create('text', [x, y, fn], Object.assign(
        { anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false }, opts || {}));
    }
    var showBars = function () { return op !== 'mul'; };
    var frT = { fontSize: 20, cssStyle: 'font-weight:800', color: '#1e293b' };
    var sgT = { fontSize: 26, cssStyle: 'font-weight:800', color: '#475569' };
    var reT = { fontSize: 13, color: MUTE, anchorX: 'left' };

    txt(-1.9, midY(B1), function () { return showBars() ? a + '/' + b : ''; }, frT);
    txt(-1.9, midY(B2), function () { return showBars() ? c + '/' + d : ''; }, frT);
    txt(-1.9, midY(RR[0]), function () {
      if (!showBars()) return '';
      if (op === 'sub' && !subOK()) return '?';
      var s = simp(resN(), comm().m); return s.d === 1 ? '' + s.n : s.n + '/' + s.d;
    }, Object.assign({}, frT, { color: '#0f766e' }));

    txt(-0.55, (midY(B1) + midY(B2)) / 2, function () {
      return op === 'add' ? '+' : op === 'sub' ? '−' : '';
    }, sgT);
    txt(-0.55, (midY(B2) + midY(RR[0])) / 2, function () { return showBars() ? '=' : ''; }, sgT);

    // Rappel du recoupage à droite des opérandes : « = A/m ».
    txt(W + 0.35, midY(B1), function () { return showBars() ? '= ' + comm().A + '/' + comm().m : ''; }, reT);
    txt(W + 0.35, midY(B2), function () { return showBars() ? '= ' + comm().C + '/' + comm().m : ''; }, reT);

    // Produit : étiquettes des deux extents + résultat.
    txt(function () { return X0 + (a / b) * W / 2; }, SQ.yTop + 0.5,
      function () { return op === 'mul' ? a + '/' + b + ' de la largeur' : ''; },
      { fontSize: 13, color: F1, cssStyle: 'font-weight:700' });
    txt(-1.7, function () { var H = SQ.yTop - SQ.yBot; return SQ.yTop - (c / d) * H / 2; },
      function () { return op === 'mul' ? c + '/' + d + ' de la hauteur' : ''; },
      { fontSize: 13, color: F2, cssStyle: 'font-weight:700' });
    txt(W + 0.4, midY(SQ), function () {
      if (op !== 'mul') return '';
      var s = simp(a * c, b * d); return '= ' + (s.d === 1 ? '' + s.n : s.n + '/' + s.d);
    }, Object.assign({}, frT, { anchorX: 'left', color: OVER, fontSize: 18 }));

    /* ==================================================================== */
    /* Saisie : opération + deux fractions                                   */
    /* ==================================================================== */
    var form = document.createElement('div');
    form.className = 'frops';
    form.innerHTML =
      '<div class="frops-line">' +
        '<span class="frops-lab">Fraction 1</span>' +
        '<input class="fr-a" type="number" min="0" max="6" step="1">' +
        '<span class="frops-sl">/</span>' +
        '<input class="fr-b" type="number" min="2" max="6" step="1">' +
        '<span class="frops-ops">' +
          '<button class="fr-op" data-op="add">+</button>' +
          '<button class="fr-op" data-op="sub">−</button>' +
          '<button class="fr-op" data-op="mul">×</button>' +
        '</span>' +
        '<span class="frops-lab">Fraction 2</span>' +
        '<input class="fr-c" type="number" min="0" max="6" step="1">' +
        '<span class="frops-sl">/</span>' +
        '<input class="fr-d" type="number" min="2" max="6" step="1">' +
      '</div>' +
      '<div class="frops-msg"></div>';
    mv.extras.appendChild(form);
    var inA = form.querySelector('.fr-a'), inB = form.querySelector('.fr-b');
    var inC = form.querySelector('.fr-c'), inD = form.querySelector('.fr-d');
    var msg = form.querySelector('.frops-msg');
    var opBtns = form.querySelectorAll('.fr-op');

    /* ==================================================================== */
    /* Panneau : les étapes du calcul                                        */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    mv.extras.appendChild(panel);
    function frac(n, dn) { return '\\( \\frac{' + n + '}{' + dn + '} \\)'; }
    function fracX(n1, n2, d1, d2) {
      return '\\( \\frac{' + n1 + '\\times ' + n2 + '}{' + d1 + '\\times ' + d2 + '} \\)';
    }

    function render() {
      var html = '';
      if (op === 'mul') {
        var s = simp(a * c, b * d);
        html += '<div class="props-label">Produit</div>';
        html += '<div class="calc-line">On multiplie les numérateurs entre eux, et les ' +
                'dénominateurs entre eux :</div>';
        html += '<div class="calc-result">' + frac(a, b) + ' × ' + frac(c, d) + ' = ' +
                fracX(a, c, b, d) + ' = ' + frac(a * c, b * d) +
                (s.g > 1 ? ' = ' + (s.d === 1 ? '<b>' + s.n + '</b>' : frac(s.n, s.d)) : '') + '</div>';
        html += '<div class="props-label">Sur le dessin</div>';
        html += '<div class="calc-line">' + frac(a, b) + ' de la largeur croisé avec ' +
                frac(c, d) + ' de la hauteur : l\'aire <b>violette</b> couvre ' +
                frac(a * c, b * d) + ' du carré.</div>';
      } else {
        var k = comm(), N = resN(), sign = op === 'sub' ? ' − ' : ' + ';
        html += '<div class="props-label">Même dénominateur</div>';
        html += '<div class="calc-line">On coupe les deux fractions en parts de même taille : ' +
                'le dénominateur commun est <b>' + k.m + '</b> (le PPCM de ' + b + ' et ' + d + ').</div>';
        html += '<div class="calc-line">' + frac(a, b) + ' = ' + frac(k.A, k.m) + ' , ' +
                frac(c, d) + ' = ' + frac(k.C, k.m) + '</div>';
        if (op === 'sub' && !subOK()) {
          html += '<div class="props-label">' + (op === 'sub' ? 'Soustraction' : 'Addition') + '</div>';
          html += '<div class="calc-line calc-warn">Ici ' + frac(a, b) + ' &lt; ' + frac(c, d) +
                  ' : la soustraction serait négative. Choisis une 1re fraction plus grande.</div>';
        } else {
          var s2 = simp(N, k.m), q = Math.floor(N / k.m), rem = N - q * k.m;
          html += '<div class="props-label">' + (op === 'sub' ? 'Soustraction' : 'Addition') + '</div>';
          html += '<div class="calc-result">' + frac(a, b) + sign + frac(c, d) + ' = ' +
                  frac(k.A, k.m) + sign + frac(k.C, k.m) + ' = ' + frac(N, k.m) +
                  (s2.g > 1 || s2.d === 1
                    ? ' = ' + (s2.d === 1 ? '<b>' + s2.n + '</b>' : frac(s2.n, s2.d))
                    : '') + '</div>';
          if (op === 'add' && N > k.m) {
            html += '<div class="calc-line">C\'est plus grand que 1 : ' + frac(N, k.m) + ' = <b>' +
                    q + '</b>' + (rem ? ' + ' + frac(rem, k.m) : '') + ' (un entier' +
                    (rem ? ' et un reste' : '') + ').</div>';
          }
        }
      }
      panel.innerHTML = html;
      mv.typeset();
    }

    /* ==================================================================== */
    /* Mise à jour + garde-fous                                              */
    /* ==================================================================== */
    function clampInputs() {
      var na = parseInt(inA.value, 10), nb = parseInt(inB.value, 10);
      var nc = parseInt(inC.value, 10), nd = parseInt(inD.value, 10);
      if (isNaN(nb)) nb = b; nb = Math.min(DEN_MAX, Math.max(DEN_MIN, nb));
      if (isNaN(nd)) nd = d; nd = Math.min(DEN_MAX, Math.max(DEN_MIN, nd));
      if (isNaN(na)) na = a; na = Math.min(nb, Math.max(0, na));
      if (isNaN(nc)) nc = c; nc = Math.min(nd, Math.max(0, nc));
      a = na; b = nb; c = nc; d = nd;
      msg.textContent = (op === 'sub' && !subOK())
        ? 'Pour une soustraction positive, la 1re fraction doit être ≥ la 2e.' : '';
    }
    function syncInputs() { inA.value = a; inB.value = b; inC.value = c; inD.value = d; }
    function highlightOps() {
      opBtns.forEach(function (btn) { btn.classList.toggle('active', btn.dataset.op === op); });
    }

    var lastKey = null;
    function refresh() {
      var key = op + a + '/' + b + ',' + c + '/' + d;
      if (key === lastKey) return;
      lastKey = key;
      board.update();
      render();
    }

    inA.oninput = inB.oninput = inC.oninput = inD.oninput =
      function () { clampInputs(); refresh(); };
    inA.onchange = inB.onchange = inC.onchange = inD.onchange =
      function () { clampInputs(); syncInputs(); refresh(); };
    opBtns.forEach(function (btn) {
      btn.onclick = function () { op = btn.dataset.op; highlightOps(); clampInputs(); refresh(); };
    });

    // Démarrage : addition 1/2 + 1/3.
    highlightOps();
    syncInputs();
    board.update();
    render();
  }
});
