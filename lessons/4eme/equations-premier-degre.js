/*
 * Équations du premier degré (4ème) — résoudre a·x + b = c·x + d.
 *
 * Le message clé : pour isoler x, on REGROUPE les x d'un côté, les nombres de
 * l'autre. Et surtout, quand un terme CHANGE DE CÔTÉ (traverse le « = »), il
 * CHANGE : un « + » devient « − », un « × » devient « ÷ ».
 *
 * La solution se construit ligne par ligne (comme au tableau). À chaque étape,
 * un terme « vole » par-dessus le signe = et change de signe/opération en cours
 * de route — c'est le cœur pédagogique.
 *
 * Leçon sans figure : mv.hideBoard(), tout est en HTML dans mv.extras, et
 * l'animation est pilotée par le moteur « pas à pas » partagé (chaque
 * « Suivante » = une étape). Les étapes règlent un état ABSOLU (idempotent),
 * pour que « Précédent » puisse les rejouer.
 */
MathsView.register({
  id: 'equations-premier-degre',
  title: 'Équations du premier degré',
  level: '4eme',
  theme: 'Calcul littéral — résoudre a·x + b = c·x + d',
  description:
    'Résoudre une équation, c\'est trouver la valeur de <strong>x</strong> qui rend ' +
    'l\'égalité vraie. On <strong>regroupe les x</strong> d\'un côté et les <strong>nombres</strong> ' +
    'de l\'autre.' +
    '<br>Le point important : quand un terme <strong>change de côté</strong> du « = », ' +
    'il <strong>change</strong> : un <strong>+</strong> devient <strong>−</strong>, ' +
    'un <strong>×</strong> devient <strong>÷</strong>.' +
    '<br>Saisis les coefficients, puis clique sur <strong>Animer</strong> (ou coche ' +
    '<strong>Pas à pas</strong>).',
  notes:
    '<ul>' +
    '<li>On peut faire passer un terme de l\'autre côté <em>parce qu\'on fait la même chose ' +
    'aux deux membres</em> : enlever 3x à gauche et à droite revient à « faire passer 3x en −3x ».</li>' +
    '<li>Étape 1 : les <strong>x</strong> à gauche. Étape 2 : les <strong>nombres</strong> à droite.</li>' +
    '<li>Étape 3 : le <strong>coefficient</strong> de x passe de l\'autre côté en <strong>division</strong> ' +
    '(× k devient ÷ k).</li>' +
    '<li>On <strong>simplifie</strong> la fraction obtenue, et on peut vérifier en remplaçant x ' +
    'par sa valeur.</li>' +
    '</ul>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();

    /* ==================================================================== */
    /* Arithmétique                                                          */
    /* ==================================================================== */
    function pgcd(x, y) { x = Math.abs(x); y = Math.abs(y); while (y) { var t = y; y = x % y; x = t; } return x || 1; }
    function terminates(dn) { dn = Math.abs(dn); while (dn % 2 === 0) dn /= 2; while (dn % 5 === 0) dn /= 5; return dn === 1; }
    function decimalStr(n, dn) { return String(n / dn).replace('.', ','); }

    // Écriture d'un terme en x : "x", "-x", "5x", "-5x".
    function absX(k) { var n = Math.abs(k); return n === 1 ? 'x' : n + 'x'; }
    // Signe explicite (pour les bulles qui « volent ») : "+3x", "−12", "+x".
    function signExpl(k, isX) { return (k < 0 ? '−' : '+') + (isX ? absX(k) : Math.abs(k)); }

    /* ==================================================================== */
    /* Rendu d'une équation                                                  */
    /* ==================================================================== */
    // terms : [{k, x}]  (k=0 → non affiché). side : 'l' | 'r'. tok : spans balisés.
    function side(terms, s, tok) {
      var out = '', first = true;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i];
        if (t.k === 0) continue;
        var body = t.x ? absX(t.k) : ('' + Math.abs(t.k));
        var role = t.x ? 'x' : 'const';
        var span = tok ? '<span class="eq-tok" data-side="' + s + '" data-role="' + role + '">' : '<span class="eq-tok">';
        if (first) { out += span + (t.k < 0 ? '−' : '') + body + '</span>'; }
        else { out += '<span class="eq-op">' + (t.k < 0 ? ' − ' : ' + ') + '</span>' + span + body + '</span>'; }
        first = false;
      }
      if (!first) return out;
      return '<span class="eq-tok" data-side="' + s + '" data-role="const">0</span>';
    }
    function fracHtml(n, dn) {
      return '<span class="eq-frac"><span class="eq-num">' + n + '</span>' +
             '<span class="eq-den">' + dn + '</span></span>';
    }
    function eqn(lhsHtml, rhsHtml) {
      return '<span class="eq-eqn">' + lhsHtml + '<span class="eq-equals"> = </span>' + rhsHtml + '</span>';
    }

    /* ==================================================================== */
    /* Construction des états et des étapes                                  */
    /* ==================================================================== */
    var a = 5, b = 12, c = 3, d = -3;   // 5x + 12 = 3x − 3
    var states = [];                     // { eqn, note, move? }

    function kParen(k) { return k < 0 ? '(−' + Math.abs(k) + ')' : ('' + k); }

    function buildStates() {
      states = [];
      var k = a - c, R = d - b;

      // État 0 : l'équation de départ.
      states.push({
        eqn: eqn(side([{ k: a, x: 1 }, { k: b, x: 0 }], 'l', true),
                 side([{ k: c, x: 1 }, { k: d, x: 0 }], 'r', true)),
        note: ''
      });

      if (k === 0) {                     // pas de solution unique
        states.push({
          eqn: (R === 0)
            ? '<span class="eq-eqn">Toujours vrai : une <b>infinité</b> de solutions.</span>'
            : '<span class="eq-eqn">Jamais vrai : <b>aucune</b> solution.</span>',
          note: 'Les x s\'éliminent (a = c) : ce n\'est pas une équation à solution unique.',
          final: true
        });
        return;
      }

      // Étape 1 : regrouper les x à gauche (le terme c·x traverse le =).
      // Inutile si c = 0 (il n'y a pas de x à droite à déplacer).
      if (c !== 0) {
        var n1 = 'Les <b>x</b> vont à gauche : <b class="hot">' + signExpl(c, true) +
          '</b> traverse le <b>=</b> et devient <b class="hot">' + signExpl(-c, true) + '</b>.' +
          (a !== 0 ? ' On réduit : ' + absX(a) + (c < 0 ? ' + ' : ' − ') + Math.abs(c) + 'x = ' + absX(k) + '.' : '');
        states.push({
          eqn: eqn(side([{ k: k, x: 1 }, { k: b, x: 0 }], 'l', true),
                   side([{ k: d, x: 0 }], 'r', true)),
          note: n1,
          move: { side: 'r', role: 'x', start: signExpl(c, true), end: signExpl(-c, true), kind: 'add' }
        });
      }

      // Étape 2 : regrouper les nombres à droite (b traverse le =).
      // Inutile si b = 0 (il n'y a pas de constante à gauche à déplacer).
      if (b !== 0) {
        var n2 = 'Les <b>nombres</b> vont à droite : <b class="hot">' + signExpl(b, false) +
          '</b> traverse le <b>=</b> et devient <b class="hot">' + signExpl(-b, false) + '</b>.' +
          ' On réduit : ' + d + (b < 0 ? ' + ' : ' − ') + Math.abs(b) + ' = ' + R + '.';
        states.push({
          eqn: eqn(side([{ k: k, x: 1 }], 'l', true),
                   side([{ k: R, x: 0 }], 'r', true)),
          note: n2,
          move: { side: 'l', role: 'const', start: signExpl(b, false), end: signExpl(-b, false), kind: 'add' }
        });
      }

      // Résultat : x = R / k.
      var n0 = R, d0 = k;
      if (d0 < 0) { n0 = -n0; d0 = -d0; }              // dénominateur positif
      var g = pgcd(n0, d0), nr = n0 / g, dr = d0 / g;   // fraction réduite

      if (k === 1) {                                    // x est déjà seul
        states[states.length - 1].final = true;         // « x = R » est la solution
        return;
      }

      // Étape 3 : diviser par le coefficient (× k devient ÷ k).
      var n3 = 'x n\'est pas seul : le coefficient <b class="hot">×' + kParen(k) +
        '</b> traverse le <b>=</b> et devient <b class="hot">÷' + kParen(k) + '</b>.';
      var res3 = (n0 === 0) ? '0' : (d0 === 1 ? ('' + n0) : fracHtml(n0, d0));
      states.push({
        eqn: eqn('<span class="eq-tok" data-side="l" data-role="x">x</span>', res3),
        note: n3,
        move: { side: 'l', role: 'x', start: '×' + kParen(k), end: '÷' + kParen(k), kind: 'div' },
        final: (d0 === 1 || n0 === 0)
      });

      // Étape 4 : simplifier (si la fraction se réduit ou a une écriture décimale).
      if (n0 !== 0 && d0 > 1 && (dr !== d0 || terminates(dr))) {
        var res4 = (dr === 1)
          ? ('' + nr)
          : fracHtml(nr, dr) + (terminates(dr) ? ' <span class="eq-approx">= ' + decimalStr(nr, dr) + '</span>' : '');
        states.push({
          eqn: eqn('<span class="eq-tok" data-side="l" data-role="x">x</span>', res4),
          note: 'On <b>simplifie</b> la fraction' + (terminates(dr) ? ' et on donne l\'écriture décimale.' : '.'),
          final: true
        });
      } else {
        states[states.length - 1].final = true;
      }
    }

    /* ==================================================================== */
    /* Interface                                                             */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'eq-ui';
    root.innerHTML =
      '<div class="eq-entry">' +
        '<span class="eq-entry-lab">Équation :</span>' +
        '<input class="eq-a" type="number" step="1"><span class="eq-x">x</span>' +
        '<span class="eq-plus">+</span><input class="eq-b" type="number" step="1">' +
        '<span class="eq-equals-in">=</span>' +
        '<input class="eq-c" type="number" step="1"><span class="eq-x">x</span>' +
        '<span class="eq-plus">+</span><input class="eq-d" type="number" step="1">' +
        '<button class="eq-rand" type="button" title="Nouvelle équation au hasard">🎲 Autre équation</button>' +
      '</div>' +
      '<div class="eq-form">soit&nbsp; <b class="eq-form-txt"></b></div>' +
      '<div class="eq-stage"><div class="eq-lines"></div></div>' +
      '<div class="eq-note"></div>';
    mv.extras.appendChild(root);

    var inA = root.querySelector('.eq-a'), inB = root.querySelector('.eq-b');
    var inC = root.querySelector('.eq-c'), inD = root.querySelector('.eq-d');
    var randBtn = root.querySelector('.eq-rand');
    var formTxt = root.querySelector('.eq-form-txt');
    var stageEl = root.querySelector('.eq-stage');
    var linesEl = root.querySelector('.eq-lines');
    var noteEl = root.querySelector('.eq-note');

    var anim = mv.createAnimator();
    var ghost = null;

    /* ---- Rendu des lignes (états 0..n) ---------------------------------- */
    function renderLines(n) {
      var html = '';
      for (var i = 0; i <= n && i < states.length; i++) {
        var st = states[i];
        var noteHtml = st.note ? '<div class="eq-line-note">' + st.note + '</div>' : '';
        var cls = 'eq-line' + (st.final && i === n ? ' eq-sol' : '');
        html += noteHtml + '<div class="' + cls + '">' + st.eqn + '</div>';
      }
      linesEl.innerHTML = html;
    }

    /* ---- Vol d'un terme par-dessus le « = » ----------------------------- */
    function removeGhost() { if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost); ghost = null; }

    function flight(t, p) {
      var mv2 = states[t].move;
      if (!mv2) return;
      var allLines = linesEl.querySelectorAll('.eq-line');
      var srcLine = allLines[t - 1];                         // dernière ligne visible (état t−1)
      if (!srcLine) return;
      var srcTok = srcLine.querySelector('.eq-eqn [data-side="' + mv2.side + '"][data-role="' + mv2.role + '"]');
      var eqTok = srcLine.querySelector('.eq-equals');
      if (!srcTok || !eqTok) return;
      var sRect = stageEl.getBoundingClientRect();
      var tRect = srcTok.getBoundingClientRect();
      var eRect = eqTok.getBoundingClientRect();
      var srcX = tRect.left - sRect.left, srcY = tRect.top - sRect.top;
      var eqCx = (eRect.left + eRect.right) / 2 - sRect.left;
      var tgtX = 2 * eqCx - (srcX + tRect.width);            // symétrique par rapport au =
      var tgtY = srcY + 44;                                  // vers la ligne suivante

      if (!ghost) {
        ghost = document.createElement('div');
        ghost.className = 'eq-ghost';
        stageEl.appendChild(ghost);
      }
      ghost.innerHTML = p < 0.5 ? mv2.start : mv2.end;
      ghost.classList.toggle('eq-ghost-flip', p >= 0.5);
      var x = srcX + (tgtX - srcX) * p;
      var y = srcY + (tgtY - srcY) * p - 22 * Math.sin(Math.PI * p);
      ghost.style.left = x + 'px';
      ghost.style.top = y + 'px';
      srcTok.style.opacity = Math.max(0, 1 - 1.8 * p);
      noteEl.innerHTML = states[t].note;
    }

    /* ---- Étapes ---------------------------------------------------------- */
    function reset() {
      removeGhost();
      renderLines(0);
      noteEl.innerHTML = '';
    }
    function commit(t) {
      removeGhost();
      renderLines(t);
      noteEl.innerHTML = states[t].note || '';
    }

    function buildSteps() {
      var steps = [];
      for (var t = 1; t < states.length; t++) {
        (function (t) {
          steps.push({
            dur: states[t].move && states[t].move.kind === 'div' ? 900 : 800,
            step: function (p) {
              if (states[t].move) flight(t, p);
              else { noteEl.innerHTML = states[t].note; }
              if (p >= 1) commit(t);
            },
            after: function () { commit(t); }
          });
        })(t);
      }
      return steps;
    }

    /* ==================================================================== */
    /* Saisie + (re)démarrage                                                */
    /* ==================================================================== */
    function plainSide(terms) {
      var out = '', first = true;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i]; if (t.k === 0) continue;
        var body = t.x ? absX(t.k) : ('' + Math.abs(t.k));
        out += first ? (t.k < 0 ? '−' : '') + body : (t.k < 0 ? ' − ' : ' + ') + body;
        first = false;
      }
      return first ? '0' : out;
    }
    function updateForm() {
      formTxt.textContent =
        plainSide([{ k: a, x: 1 }, { k: b, x: 0 }]) + ' = ' + plainSide([{ k: c, x: 1 }, { k: d, x: 0 }]);
    }
    function clampInputs() {
      var na = parseInt(inA.value, 10), nb = parseInt(inB.value, 10);
      var nc = parseInt(inC.value, 10), nd = parseInt(inD.value, 10);
      a = isNaN(na) ? a : Math.max(-10, Math.min(10, na));
      c = isNaN(nc) ? c : Math.max(-10, Math.min(10, nc));
      b = isNaN(nb) ? b : Math.max(-20, Math.min(20, nb));
      d = isNaN(nd) ? d : Math.max(-20, Math.min(20, nd));
    }
    function syncInputs() { inA.value = a; inB.value = b; inC.value = c; inD.value = d; }

    var lastKey = null;
    function arm() {
      var key = a + ',' + b + ',' + c + ',' + d;
      if (key === lastKey) return;
      lastKey = key;
      updateForm();
      buildStates();
      reset();
      anim.runSteps(buildSteps(), reset);
    }

    inA.oninput = inB.oninput = inC.oninput = inD.oninput = function () { clampInputs(); arm(); };
    inA.onchange = inB.onchange = inC.onchange = inD.onchange = function () { clampInputs(); syncInputs(); arm(); };

    // Tirage d'une nouvelle équation : x des deux côtés (a, c ≠ 0) et a ≠ c,
    // pour garantir une équation du 1er degré à solution unique.
    function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
    function nonzero(lo, hi) { var v; do { v = randInt(lo, hi); } while (v === 0); return v; }
    randBtn.onclick = function () {
      a = nonzero(-6, 6);
      do { c = nonzero(-6, 6); } while (c === a);
      b = randInt(-12, 12); d = randInt(-12, 12);
      syncInputs(); lastKey = null; arm();
    };

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: function () { lastKey = null; arm(); } }
    ]);

    syncInputs();
    arm();
  }
});
