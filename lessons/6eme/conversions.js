/*
 * Les conversions (6ème) — le tableau de conversion.
 *
 * On choisit un tableau (longueur, aire, volume), on saisit une valeur avec son
 * unité, et le tableau se remplit : on lit alors la même grandeur dans toutes
 * les unités.
 *
 * ---------------------------------------------------------------------------
 * L'idée : un seul tableau de position décimale
 * ---------------------------------------------------------------------------
 * Les trois tableaux ont exactement la même mécanique, seule la LARGEUR d'une
 * unité change :
 *   - longueur : 1 colonne par unité (chaque rang vaut ×10)   → km hm dam m dm cm mm
 *   - aire     : 2 colonnes par unité (chaque rang vaut ×100)  → km² … mm²
 *   - volume   : 3 colonnes par unité (chaque rang vaut ×1000) → km³ … mm³
 * On note k ce nombre de colonnes par unité (1, 2 ou 3). Le tableau entier
 * n'est qu'une suite de chiffres en base 10 ; k ne fait que placer les
 * séparateurs d'unités et la virgule (au bord droit de l'unité choisie).
 *
 * Convertir vers une autre unité = décaler la virgule de k rangs par unité
 * franchie. On le fait par décalage de chaîne (exact, sans erreur d'arrondi
 * des flottants) : voir shiftDecimal().
 *
 * Cette leçon n'a pas de figure : elle appelle mv.hideBoard() et construit un
 * tableau HTML dans mv.extras.
 */
MathsView.register({
  id: 'conversions',
  title: 'Les conversions (tableau)',
  level: '6eme',
  theme: 'Grandeurs — unités et tableau de conversion',
  description:
    'Pour changer d\'unité, on range les chiffres dans un <strong>tableau de ' +
    'conversion</strong> : une colonne par rang, la virgule au bord de l\'unité ' +
    'choisie. On lit ensuite la valeur dans <strong>n\'importe quelle unité</strong>.' +
    '<br><strong>Choisis un tableau</strong>, puis <strong>saisis une valeur et son unité</strong>.',
  notes:
    '<ul>' +
    '<li><strong>Longueurs</strong> : chaque rang vaut 10 fois le précédent ' +
    '(1 m = 10 dm = 100 cm = 1000 mm), donc <strong>une colonne par unité</strong>.</li>' +
    '<li><strong>Aires</strong> : chaque rang vaut 100 fois le précédent ' +
    '(1 m² = 100 dm²), donc <strong>deux colonnes par unité</strong>.</li>' +
    '<li><strong>Volumes</strong> : chaque rang vaut 1000 fois le précédent ' +
    '(1 m³ = 1000 dm³), donc <strong>trois colonnes par unité</strong>. ' +
    'Rappel utile : 1 dm³ = 1 L et 1 cm³ = 1 mL.</li>' +
    '</ul>' +
    '<p>Convertir, c\'est déplacer la virgule et compléter avec des zéros — jamais ' +
    'multiplier les chiffres eux-mêmes.</p>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();   // leçon sans figure

    /* ==================================================================== */
    /* Données des trois tableaux                                            */
    /* ==================================================================== */
    // units : de la plus grande à la plus petite (gauche → droite du tableau).
    // alias : nom courant affiché en petit sous l'en-tête.
    var TABLES = {
      longueur: {
        titre: 'Longueur', k: 1,
        units: [
          { u: 'km' }, { u: 'hm' }, { u: 'dam' }, { u: 'm' },
          { u: 'dm' }, { u: 'cm' }, { u: 'mm' }
        ],
        defaut: 'm'
      },
      aire: {
        titre: 'Aire', k: 2,
        units: [
          { u: 'km²' }, { u: 'hm²', alias: 'ha' }, { u: 'dam²', alias: 'a' }, { u: 'm²' },
          { u: 'dm²' }, { u: 'cm²' }, { u: 'mm²' }
        ],
        defaut: 'm²'
      },
      volume: {
        titre: 'Volume', k: 3,
        units: [
          { u: 'km³' }, { u: 'hm³' }, { u: 'dam³' }, { u: 'm³' },
          { u: 'dm³', alias: 'L' }, { u: 'cm³', alias: 'mL' }, { u: 'mm³' }
        ],
        defaut: 'm³'
      }
    };

    /* ==================================================================== */
    /* Fonctions pures (testées hors navigateur)                             */
    /* ==================================================================== */

    // "3,5" / "3.5" / ".5" / "12" → { ok, intPart, fracPart } (chiffres only).
    function parseValue(str) {
      str = String(str).trim().replace(/\s/g, '').replace(',', '.').replace(/^\+/, '');
      var neg = /^-/.test(str);
      str = str.replace(/^-/, '');
      if (str === '' || str === '.' || !/^\d*\.?\d*$/.test(str)) return { ok: false };
      var parts = str.split('.');
      var intPart = parts[0] === '' ? '0' : parts[0];
      var fracPart = parts[1] || '';
      return { ok: true, neg: neg, intPart: intPart, fracPart: fracPart };
    }

    // Décale la virgule de n rangs (n>0 vers la droite = plus petite unité).
    // Travaille sur les chaînes de chiffres → conversions EXACTES.
    function shiftDecimal(intPart, fracPart, n) {
      var digits = intPart + fracPart;
      var point = intPart.length + n;         // position de la virgule depuis la gauche
      var intOut, fracOut;
      if (point <= 0) {
        intOut = '0';
        fracOut = repeat('0', -point) + digits;
      } else if (point >= digits.length) {
        intOut = digits + repeat('0', point - digits.length);
        fracOut = '';
      } else {
        intOut = digits.slice(0, point);
        fracOut = digits.slice(point);
      }
      intOut = intOut.replace(/^0+/, '') || '0';
      fracOut = fracOut.replace(/0+$/, '');
      return fracOut ? intOut + ',' + fracOut : intOut;
    }
    function repeat(c, n) { return n > 0 ? new Array(n + 1).join(c) : ''; }

    // Remplit la grille de chiffres. onesR = rang (depuis la droite) de la
    // colonne des unités de l'unité choisie = ui*k.
    function buildGrid(intPart, fracPart, ui, k, numUnits) {
      var onesR = ui * k, numCols = numUnits * k, map = {};
      var ip = intPart.replace(/^0+/, '') || '0';
      for (var i = 0; i < ip.length; i++) map[onesR + (ip.length - 1 - i)] = ip.charAt(i);
      var highInt = onesR + (ip.length - 1);
      var fp = fracPart.replace(/0+$/, '');
      for (i = 0; i < fp.length; i++) map[onesR - 1 - i] = fp.charAt(i);
      var lowFrac = onesR - fp.length;

      var cells = [];
      for (var j = 0; j < numCols; j++) {
        var r = numCols - 1 - j, d;
        if (map[r] !== undefined) d = map[r];
        else if (r >= 0) d = '0';   // toute colonne entière vide → zéro (à gauche comme à droite)
        else d = '';
        cells.push({ d: d, r: r, unitFromRight: Math.floor(r / k) });
      }
      return {
        cells: cells, onesR: onesR, numCols: numCols,
        overflowLeft: highInt > numCols - 1,   // trop grand pour le tableau
        overflowRight: lowFrac < 0             // plus fin que la plus petite unité
      };
    }

    /* ==================================================================== */
    /* État + interface                                                      */
    /* ==================================================================== */
    var type = 'longueur';
    var unit = TABLES.longueur.defaut;
    var raw = '3,5';

    var root = document.createElement('div');
    root.className = 'conv-ui';
    mv.extras.appendChild(root);
    root.innerHTML =
      '<div class="conv-types"></div>' +
      '<div class="conv-entry">' +
        '<label>Je saisis <input class="conv-val" type="text" inputmode="decimal" ' +
        'autocomplete="off" spellcheck="false"></label>' +
        '<select class="conv-unit"></select>' +
      '</div>' +
      '<div class="conv-tablewrap"><table class="conv-table"></table></div>' +
      '<div class="conv-msg"></div>' +
      '<div class="props-label">Je lis, dans toutes les unités :</div>' +
      '<div class="conv-read"></div>';

    var typesBox = root.querySelector('.conv-types');
    var valInput = root.querySelector('.conv-val');
    var unitSel = root.querySelector('.conv-unit');
    var table = root.querySelector('.conv-table');
    var msgBox = root.querySelector('.conv-msg');
    var readBox = root.querySelector('.conv-read');

    // Boutons de choix du tableau.
    var typeBtns = {};
    Object.keys(TABLES).forEach(function (key) {
      var b = document.createElement('button');
      b.textContent = TABLES[key].titre;
      b.onclick = function () { setType(key); };
      typesBox.appendChild(b);
      typeBtns[key] = b;
    });

    valInput.value = raw;
    valInput.oninput = function () { raw = valInput.value; render(); };
    unitSel.onchange = function () { unit = unitSel.value; render(); };

    function setType(key) {
      type = key;
      unit = TABLES[key].defaut;
      Object.keys(typeBtns).forEach(function (k) {
        typeBtns[k].classList.toggle('active', k === key);
      });
      // Reconstruit la liste d'unités du sélecteur.
      unitSel.innerHTML = '';
      TABLES[key].units.forEach(function (o) {
        var opt = document.createElement('option');
        opt.value = o.u; opt.textContent = o.u + (o.alias ? ' (' + o.alias + ')' : '');
        unitSel.appendChild(opt);
      });
      unitSel.value = unit;
      render();
    }

    /* ==================================================================== */
    /* Rendu                                                                 */
    /* ==================================================================== */
    function unitIndexFromRight(key, u) {
      var arr = TABLES[key].units, n = arr.length;
      for (var i = 0; i < n; i++) if (arr[i].u === u) return n - 1 - i;
      return -1;
    }

    function render() {
      var T = TABLES[type], k = T.k, units = T.units, numUnits = units.length;
      var ui = unitIndexFromRight(type, unit);
      var parsed = parseValue(raw);

      // -- En-tête du tableau : une unité par bloc de k colonnes --------------
      var thead = '<thead><tr>';
      units.forEach(function (o) {
        thead += '<th colspan="' + k + '"' + (o.u === unit ? ' class="is-chosen"' : '') + '">' +
          o.u + (o.alias ? '<span class="conv-alias">' + o.alias + '</span>' : '') + '</th>';
      });
      thead += '</tr></thead>';

      var tbody = '<tbody><tr>';
      if (!parsed.ok) {
        table.innerHTML = thead + '<tbody><tr><td colspan="' + (numUnits * k) +
          '" class="conv-empty">Saisis un nombre (ex. 3,5).</td></tr></tbody>';
        msgBox.textContent = '';
        readBox.innerHTML = '';
        return;
      }

      var g = buildGrid(parsed.intPart, parsed.fracPart, ui, k, numUnits);
      g.cells.forEach(function (c) {
        var cls = [];
        if (c.unitFromRight === ui) cls.push('is-chosen');
        if ((c.r % k) === 0) cls.push('unit-end');          // bord droit d'une unité
        if (c.r === g.onesR) cls.push('comma');             // virgule après cette case
        tbody += '<td class="' + cls.join(' ') + '">' + (c.d === '' ? '&nbsp;' : c.d) + '</td>';
      });
      tbody += '</tr></tbody>';
      table.innerHTML = thead + tbody;

      // -- Messages de débordement -------------------------------------------
      var warn = [];
      if (g.overflowLeft) warn.push('La valeur est trop grande pour ce tableau ' +
        '(des chiffres à gauche ne rentrent pas).');
      if (g.overflowRight) warn.push('La valeur est plus fine que la plus petite unité : ' +
        'des décimales ne rentrent pas dans le tableau.');
      msgBox.innerHTML = warn.length
        ? warn.map(function (w) { return '⚠️ ' + w; }).join('<br>')
        : '';

      // -- Lecture dans toutes les unités (exacte, par décalage) --------------
      var lines = units.map(function (o) {
        var uj = unitIndexFromRight(type, o.u);
        var val = shiftDecimal(parsed.intPart, parsed.fracPart, k * (ui - uj));
        var cur = (o.u === unit);
        return '<div class="conv-read-line' + (cur ? ' is-current' : '') + '">' +
          '<span class="conv-read-val">' + (parsed.neg ? '-' : '') + val + '</span> ' +
          '<span class="conv-read-unit">' + o.u + (o.alias ? ' (' + o.alias + ')' : '') + '</span>' +
          '</div>';
      });
      readBox.innerHTML = lines.join('');
    }

    // Démarrage : onglet Longueur actif, unité m, valeur 3,5.
    setType('longueur');
  }
});
