/*
 * Multiplier / diviser par 10, 100, 1000 et 0,1 ; 0,01 ; 0,001 (6ème).
 *
 * L'idée graphique : les chiffres restent en place, seule la VIRGULE se déplace.
 *   - × 10 / 100 / 1000        → la virgule glisse de 1 / 2 / 3 crans vers la DROITE
 *   - × 0,1 / 0,01 / 0,001     → 1 / 2 / 3 crans vers la GAUCHE
 *   - diviser, c'est l'inverse : ÷ 10 = 1 cran à gauche, ÷ 0,1 = 1 cran à droite…
 *
 * On note e l'exposant du facteur (10 → e=1, 0,1 → e=-1, 0,001 → e=-3). Le
 * déplacement signé de la virgule (droite = positif) vaut :
 *     s = (× )  ? +e : -e
 * Le nombre de crans est |s| (1, 2 ou 3), le sens est le signe de s.
 *
 * Les chiffres significatifs sont posés dans des cases fixes ; des zéros (de
 * tête pour les petits nombres, de queue pour les grands) apparaissent au fur
 * et à mesure que la virgule passe. Le calcul du résultat est fait par décalage
 * de chaîne (exact, sans erreur d'arrondi des flottants) : voir shiftDecimal().
 *
 * Leçon sans figure : mv.hideBoard() puis tout est construit en HTML dans
 * mv.extras. L'animation est pilotée par le moteur « pas à pas » partagé
 * (mv.createAnimator) : chaque appui sur « Suivante » avance d'un cran.
 */
MathsView.register({
  id: 'multiplier-diviser-10',
  title: 'Multiplier et diviser par 10, 100, 1000',
  level: '6eme',
  theme: 'Nombres décimaux — multiplier et diviser par 10, 100, 1000 ; 0,1 ; 0,01 ; 0,001',
  description:
    'Pour multiplier ou diviser un nombre décimal par 10, 100, 1000 (ou par ' +
    '0,1 ; 0,01 ; 0,001), on ne change pas les chiffres : on <strong>déplace la ' +
    'virgule</strong>.' +
    '<br>Choisis un nombre et une opération, puis clique sur <strong>Animer</strong> ' +
    '(ou coche <strong>Pas à pas</strong> et avance d\'un <strong>cran</strong> à la fois).',
  notes:
    '<ul>' +
    '<li><strong>× 10, × 100, × 1000</strong> : la virgule se déplace de ' +
    '<strong>1, 2 ou 3 crans vers la droite</strong> (le nombre grandit).</li>' +
    '<li><strong>× 0,1 ; × 0,01 ; × 0,001</strong> : de ' +
    '<strong>1, 2 ou 3 crans vers la gauche</strong> (le nombre rapetisse).</li>' +
    '<li><strong>Diviser, c\'est l\'inverse</strong> : ÷ 10 déplace d\'un cran vers la ' +
    '<em>gauche</em>, ÷ 0,1 d\'un cran vers la <em>droite</em>.</li>' +
    '<li>On complète les cases vides par des <strong>zéros</strong> ; les chiffres, ' +
    'eux, ne changent jamais.</li>' +
    '<li>Astuce : <strong>× 0,1 revient à ÷ 10</strong>, et <strong>÷ 0,1 revient à × 10</strong>.</li>' +
    '</ul>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();   // leçon sans figure

    /* ==================================================================== */
    /* Fonctions pures                                                       */
    /* ==================================================================== */
    // "3,5" / "3.5" / ".5" / "12" → { ok, neg, intPart, fracPart } (chiffres).
    function parseValue(str) {
      str = String(str).trim().replace(/\s/g, '').replace(',', '.').replace(/^\+/, '');
      var neg = /^-/.test(str);
      str = str.replace(/^-/, '');
      if (str === '' || str === '.' || !/^\d*\.?\d*$/.test(str)) return { ok: false };
      var parts = str.split('.');
      return {
        ok: true, neg: neg,
        intPart: parts[0] === '' ? '0' : parts[0],
        fracPart: parts[1] || ''
      };
    }

    function repeat(c, n) { return n > 0 ? new Array(n + 1).join(c) : ''; }

    // Décale la virgule de n rangs (n>0 = vers la droite). Chaînes → exact.
    function shiftDecimal(intPart, fracPart, n) {
      var digits = intPart + fracPart;
      var point = intPart.length + n;
      var intOut, fracOut;
      if (point <= 0) {
        intOut = '0'; fracOut = repeat('0', -point) + digits;
      } else if (point >= digits.length) {
        intOut = digits + repeat('0', point - digits.length); fracOut = '';
      } else {
        intOut = digits.slice(0, point); fracOut = digits.slice(point);
      }
      intOut = intOut.replace(/^0+/, '') || '0';
      fracOut = fracOut.replace(/0+$/, '');
      return fracOut ? intOut + ',' + fracOut : intOut;
    }

    // Pose TOUS les chiffres du nombre (zéros internes compris) + les zéros de
    // padding pour que la virgule puisse aller de son cran de départ à son cran
    // d'arrivée. slot = position de la virgule (0 = tout à gauche, n = à droite).
    function buildLayout(intPart, fracPart, s) {
      var base = intPart + fracPart;
      if (base.replace(/0/g, '') === '') return null;   // valeur nulle
      var slot0 = intPart.length;                 // virgule d'origine (avant padding)
      var slot1 = slot0 + s;                       // virgule d'arrivée
      var leadPad = Math.max(0, 1 - Math.min(slot0, slot1));            // zéros de tête
      var trailPad = Math.max(0, Math.max(slot0, slot1) - base.length); // zéros de queue
      var digits = [], i;
      for (i = 0; i < leadPad; i++) digits.push('0');
      for (i = 0; i < base.length; i++) digits.push(base.charAt(i));
      for (i = 0; i < trailPad; i++) digits.push('0');
      return {
        digits: digits, n: digits.length,
        slotStart: slot0 + leadPad, slotEnd: slot1 + leadPad
      };
    }

    // Cases visibles (0/1) quand la virgule est au cran c : c'est la règle
    // d'écriture d'un décimal — on masque les zéros de tête de la partie entière
    // (sauf un s'il n'y a que des zéros) et les zéros de queue de la partie
    // décimale. Les chiffres, eux, ne bougent jamais.
    function visAt(L, c) {
      var d = L.digits, n = L.n, v = [], j;
      for (j = 0; j < n; j++) v.push(0);
      // Partie décimale d[c..n-1] : on garde jusqu'au dernier chiffre non nul.
      var lastNZ = -1;
      for (j = c; j < n; j++) if (d[j] !== '0') lastNZ = j;
      for (j = c; j < n; j++) v[j] = (lastNZ !== -1 && j <= lastNZ) ? 1 : 0;
      // Partie entière d[0..c-1] : on masque les zéros de tête (mais on en garde
      // un si la partie entière ne vaut que des zéros).
      var firstNZ = -1;
      for (j = 0; j < c; j++) if (d[j] !== '0') { firstNZ = j; break; }
      if (firstNZ === -1) { if (c >= 1) v[c - 1] = 1; }
      else { for (j = firstNZ; j < c; j++) v[j] = 1; }
      return v;
    }

    /* ==================================================================== */
    /* Données : les facteurs                                                */
    /* ==================================================================== */
    var FACTORS = [
      { lab: '10', e: 1 }, { lab: '100', e: 2 }, { lab: '1000', e: 3 },
      { lab: '0,1', e: -1 }, { lab: '0,01', e: -2 }, { lab: '0,001', e: -3 }
    ];

    var C_RIGHT = '#dc2626';   // sens droite (multiplier « en grand »)
    var C_LEFT = '#2563eb';    // sens gauche

    /* ==================================================================== */
    /* État                                                                  */
    /* ==================================================================== */
    var raw = '3,5';
    var op = 'x';              // 'x' (×) ou 'd' (÷)
    var factor = FACTORS[1];   // 100 par défaut
    var W = 42;                // largeur d'une case, en px (géométrie des crans)

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Interface                                                             */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'dec-ui';
    root.innerHTML =
      '<div class="dec-entry"><label>Je pars du nombre ' +
        '<input class="dec-val" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"></label></div>' +
      '<div class="dec-ops">' +
        '<div class="dec-oprow"><span class="dec-oplabel">Multiplier par</span><span class="dec-opbtns dec-mul"></span></div>' +
        '<div class="dec-oprow"><span class="dec-oplabel">Diviser par</span><span class="dec-opbtns dec-div"></span></div>' +
      '</div>' +
      '<div class="dec-rule"></div>' +
      '<div class="dec-stage">' +
        '<div class="dec-caption">&nbsp;</div>' +
        '<div class="dec-strip"></div>' +
      '</div>' +
      '<div class="dec-eq"></div>' +
      '<div class="dec-msg"></div>';
    mv.extras.appendChild(root);

    var valInput = root.querySelector('.dec-val');
    var mulBox = root.querySelector('.dec-mul');
    var divBox = root.querySelector('.dec-div');
    var ruleBox = root.querySelector('.dec-rule');
    var caption = root.querySelector('.dec-caption');
    var strip = root.querySelector('.dec-strip');
    var eqBox = root.querySelector('.dec-eq');
    var msgBox = root.querySelector('.dec-msg');

    // La virgule rouge mobile (créée une fois, réinsérée à chaque rendu).
    var comma = document.createElement('div');
    comma.className = 'dec-comma';
    comma.innerHTML = '<div class="dec-comma-tip"></div><div class="dec-comma-line"></div>' +
                      '<div class="dec-comma-dot">,</div>';

    // Boutons des facteurs (une paire de rangées : × et ÷).
    var opBtns = [];
    function makeBtns(container, kind) {
      FACTORS.forEach(function (f) {
        var b = document.createElement('button');
        b.className = 'dec-op';
        b.textContent = f.lab;
        b.onclick = function () { op = kind; factor = f; arm(); };
        container.appendChild(b);
        opBtns.push({ el: b, kind: kind, f: f });
      });
    }
    makeBtns(mulBox, 'x');
    makeBtns(divBox, 'd');

    valInput.value = raw;
    valInput.oninput = function () { raw = valInput.value; arm(); };

    /* ==================================================================== */
    /* Rendu de la bande + géométrie des crans                               */
    /* ==================================================================== */
    var cellEls = [], xSlot = [], L = null;

    function renderStrip() {
      var html = '';
      for (var j = 0; j < L.n; j++) {
        html += '<span class="dec-cell" style="width:' + W + 'px">' + L.digits[j] + '</span>';
      }
      strip.innerHTML = html;
      strip.appendChild(comma);
      cellEls = strip.querySelectorAll('.dec-cell');
      // Cases jointives de largeur W → le cran j est à l'abscisse j*W (pas de
      // lecture de layout : robuste même si la section n'est pas encore mesurée).
      xSlot = [];
      for (var k = 0; k <= L.n; k++) xSlot.push(k * W);
    }

    // Applique une image : virgule interpolée du cran cB au cran cA, zéros qui
    // apparaissent/disparaissent en fondu (p de 0 à 1).
    function applyFrame(cB, cA, p) {
      var vb = visAt(L, cB), va = visAt(L, cA);
      for (var j = 0; j < L.n; j++) {
        cellEls[j].style.opacity = vb[j] + (va[j] - vb[j]) * p;
      }
      comma.style.left = (xSlot[cB] + (xSlot[cA] - xSlot[cB]) * p) + 'px';
    }

    function setCaption(nCran, dir) {
      if (!nCran) { caption.innerHTML = '&nbsp;'; return; }
      var word = nCran > 1 ? 'crans' : 'cran';
      var arrow = dir > 0 ? '▶' : '◀';
      var sens = dir > 0 ? 'vers la droite' : 'vers la gauche';
      caption.style.color = dir > 0 ? C_RIGHT : C_LEFT;
      caption.innerHTML = (dir > 0 ? '' : arrow + ' ') +
        '<b>' + nCran + ' ' + word + '</b> ' + sens + (dir > 0 ? ' ' + arrow : '');
    }

    /* ==================================================================== */
    /* Armement : recalcule tout et prépare les étapes (1 étape = 1 cran)     */
    /* ==================================================================== */
    function highlightBtns() {
      opBtns.forEach(function (o) {
        o.el.classList.toggle('active', o.kind === op && o.f === factor);
      });
    }

    function arm() {
      highlightBtns();
      var parsed = parseValue(raw);
      var s = (op === 'x' ? 1 : -1) * factor.e;   // déplacement signé (droite +)
      var dir = s > 0 ? 1 : -1;
      var opSym = op === 'x' ? '×' : '÷';

      if (!parsed.ok) {
        strip.innerHTML = '<span class="dec-empty">Saisis un nombre (ex. 3,5).</span>';
        ruleBox.innerHTML = ''; eqBox.innerHTML = ''; caption.innerHTML = '&nbsp;';
        msgBox.textContent = '';
        anim.runSteps([], null);
        return;
      }

      var clean = (parsed.neg ? '-' : '') + parsed.intPart +
        (parsed.fracPart ? ',' + parsed.fracPart : '');
      var result = (parsed.neg ? '-' : '') +
        shiftDecimal(parsed.intPart, parsed.fracPart, s);

      // Règle (toujours affichée dès qu'on choisit l'opération).
      var nr = Math.abs(s);
      ruleBox.innerHTML =
        '<b>' + opSym + ' ' + factor.lab + '</b> : la virgule se déplace de ' +
        '<b style="color:' + (dir > 0 ? C_RIGHT : C_LEFT) + '">' + nr + ' cran' +
        (nr > 1 ? 's' : '') + ' vers la ' + (dir > 0 ? 'droite' : 'gauche') + '</b>.';

      L = buildLayout(parsed.intPart, parsed.fracPart, s);
      if (!L) {   // valeur nulle : 0 × … = 0
        strip.innerHTML = '<span class="dec-cell" style="width:' + W + 'px">0</span>';
        eqBox.innerHTML = clean + ' ' + opSym + ' ' + factor.lab +
          ' = <b class="dec-res">' + result + '</b>';
        caption.innerHTML = '&nbsp;'; msgBox.textContent = '';
        anim.runSteps([], null);
        return;
      }

      renderStrip();
      msgBox.textContent = '';
      eqBox.innerHTML = clean + ' ' + opSym + ' ' + factor.lab +
        ' = <b class="dec-res" style="opacity:0">' + result + '</b>';
      var resEl = eqBox.querySelector('.dec-res');

      function reset() {
        applyFrame(L.slotStart, L.slotStart, 1);
        resEl.style.opacity = 0;
        setCaption(0, dir);
      }

      var steps = [];
      for (var i = 0; i < nr; i++) {
        (function (i) {
          var cB = L.slotStart + dir * i;
          var cA = L.slotStart + dir * (i + 1);
          steps.push({
            dur: 620,
            step: function (p) { applyFrame(cB, cA, p); setCaption(i + 1, dir); }
          });
        })(i);
      }
      // Dernière étape : on révèle le résultat.
      steps.push({ dur: 480, step: function (p) { resEl.style.opacity = p; } });

      reset();
      anim.runSteps(steps, reset);
    }

    /* ==================================================================== */
    /* Contrôles (bouton « Animer » ; le pas à pas est ajouté par le moteur) */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: arm }
    ]);

    arm();   // prépare la première animation (3,5 × 100)
  }
});
