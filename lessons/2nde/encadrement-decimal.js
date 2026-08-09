/*
 * L'ensemble 𝔻 des nombres décimaux, et l'encadrement décimal d'un réel à
 * 10^(−n) près (2nde).
 *
 * L'idée de la figure tient en un geste : ON ZOOME. Cinq droites graduées
 * empilées, chacune étant l'AGRANDISSEMENT ×10 de l'intervalle rouge de celle
 * du dessus — le cône clair qui relie deux lignes est la loupe.
 *
 *      ligne 0 :  [0 ; 10]        découpée en 10   →  3 < π < 4
 *      ligne 1 :  [3 ; 4]         découpée en 10   →  3,1 < π < 3,2
 *      ligne 2 :  [3,1 ; 3,2]     découpée en 10   →  3,14 < π < 3,15
 *      ligne 3 :  [3,14 ; 3,15]   découpée en 10   →  3,141 < π < 3,142
 *      ligne 4 :  [3,141 ; 3,142] découpée en 10   →  3,1415 < π < 3,1416
 *
 * À chaque zoom on lit UN chiffre de plus : les chiffres violets alignés
 * verticalement sous les lignes sont exactement les décimales du nombre, qui
 * s'allument aussi une à une dans l'écriture décimale, en haut de la figure.
 *
 * Deux couleurs, deux natures de nombres :
 *     ROUGE   le réel qu'on cherche (π, √2, 1/3…), un point sur la droite ;
 *     VIOLET  les DÉCIMAUX qui l'encadrent — les bornes, les chiffres, la
 *             zone. Ce sont eux les éléments de 𝔻.
 *
 * Quatre nombres au choix, qui balaient ℝ ⊃ ℚ ⊃ 𝔻 :
 *     π et √2   irrationnels : ça ne s'arrête jamais, l'encadrement non plus ;
 *     1/3       rationnel non décimal : 0,3333… se répète, mais ne s'arrête
 *               pas davantage — le zoom est identique à lui-même à l'infini ;
 *     2,45      DÉCIMAL : à partir du rang 2 le point rouge tombe exactement
 *               sur la borne de gauche, l'encadrement devient une égalité.
 *
 * Toute l'arithmétique est faite sur les CHAÎNES de chiffres (jamais sur des
 * flottants) : la troncature au rang n est le préfixe des décimales, et la
 * borne de droite s'obtient en ajoutant 1 à cet entier. Aucun 0,1 + 0,2 qui
 * traîne, et 2,45 tombe juste.
 */
MathsView.register({
  id: 'encadrement-decimal',
  title: 'Encadrement décimal d\'un réel',
  level: '2nde',
  category: 'calcul',
  subcategory: 'Ensembles de nombres',
  exercices: ['encadrement'],
  theme: 'Nombres — l\'ensemble 𝔻 des décimaux, encadrer π à 10⁻ⁿ près',
  description:
    'Un <strong>nombre décimal</strong> s\'écrit avec un nombre <strong>fini</strong> ' +
    'de chiffres après la virgule, autrement dit \\(x=\\dfrac{a}{10^{n}}\\) avec ' +
    '\\(a\\in\\mathbb{Z}\\) et \\(n\\in\\mathbb{N}\\). Ces nombres forment l\'ensemble ' +
    '\\(\\mathbb{D}\\).' +
    '<br>\\(\\pi\\) n\'en fait pas partie : ses décimales ne s\'arrêtent jamais. Mais on ' +
    'peut le <strong>coincer entre deux décimaux</strong> aussi proches qu\'on veut — ' +
    'c\'est l\'<strong>encadrement à \\(10^{-n}\\) près</strong> : ' +
    '\\(3{,}14 < \\pi < 3{,}15\\), puis \\(3{,}141 < \\pi < 3{,}142\\)…' +
    '<br>Chaque ligne de la figure est l\'<strong>agrandissement ×10</strong> de la zone ' +
    'violette de la ligne du dessus : à chaque zoom, on gagne ' +
    '<strong>un chiffre après la virgule</strong>.' +
    '<br>Choisis un nombre, puis clique sur <strong>▶ Animer</strong> (ou coche ' +
    '<strong>Pas à pas</strong>). Tu peux aussi cliquer une ligne du tableau.',
  notes:
    '<ul>' +
    '<li><strong>L\'ensemble \\(\\mathbb{D}\\).</strong> Un réel est <em>décimal</em> s\'il ' +
    's\'écrit \\(\\dfrac{a}{10^{n}}\\) avec \\(a\\in\\mathbb{Z}\\), \\(n\\in\\mathbb{N}\\) : ' +
    '\\(2{,}45=\\dfrac{245}{100}\\), \\(-7=\\dfrac{-7}{10^{0}}\\). Autrement dit : un nombre ' +
    'fini de chiffres après la virgule. On a ' +
    '\\(\\mathbb{Z}\\subset\\mathbb{D}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\).</li>' +
    '<li><strong>\\(\\frac13\\notin\\mathbb{D}\\).</strong> Si on avait ' +
    '\\(\\frac13=\\frac{a}{10^{n}}\\), alors \\(3a=10^{n}\\) : impossible, car ' +
    '\\(10^{n}\\) n\'est jamais divisible par 3. Plus simplement : \\(0{,}333\\dots\\) ne ' +
    's\'arrête pas.</li>' +
    '<li><strong>Troncature.</strong> La troncature de \\(x\\) au rang \\(n\\) est ' +
    '\\(a=\\dfrac{\\lfloor 10^{n}x\\rfloor}{10^{n}}\\) : on <em>coupe</em> après la ' +
    '\\(n\\)-ième décimale, sans rien changer aux chiffres gardés.</li>' +
    '<li><strong>L\'encadrement à \\(10^{-n}\\) près.</strong> Pour tout réel \\(x\\) et sa ' +
    'troncature \\(a\\) : \\(a\\leqslant x < a+10^{-n}\\). Les deux bornes sont des ' +
    '<strong>décimaux</strong>, et l\'<strong>amplitude</strong> de l\'intervalle vaut ' +
    '\\(10^{-n}\\) : c\'est la précision de l\'encadrement.</li>' +
    '<li><strong>Par défaut, par excès.</strong> \\(a\\) est la valeur approchée <em>par ' +
    'défaut</em> à \\(10^{-n}\\) près (elle est plus petite), \\(a+10^{-n}\\) la valeur ' +
    'approchée <em>par excès</em>.</li>' +
    '<li><strong>Troncature \\(\\neq\\) arrondi.</strong> L\'<em>arrondi</em> est celle des ' +
    'deux bornes dont \\(x\\) est le plus proche. Au rang 3 : la troncature de \\(\\pi\\) ' +
    'est \\(3{,}141\\), son arrondi \\(3{,}142\\) (car la décimale suivante est un 5).</li>' +
    '<li><strong>Aussi près qu\'on veut.</strong> Comme \\(10^{-n}\\) devient aussi petit ' +
    'qu\'on veut, tout réel est approché d\'aussi près qu\'on le souhaite par un décimal : ' +
    'on dit que \\(\\mathbb{D}\\) est <strong>dense</strong> dans \\(\\mathbb{R}\\). Entre ' +
    'deux réels distincts, il y a toujours un décimal.</li>' +
    '<li><strong>Approcher n\'est pas atteindre.</strong> Aucune des lignes ne donne ' +
    '\\(\\pi\\) : la zone violette se resserre indéfiniment autour du point rouge sans ' +
    'jamais s\'y réduire. La calculatrice, elle, affiche \\(3{,}141592654\\) — un décimal, ' +
    'donc pas \\(\\pi\\).</li>' +
    '<li><strong>Un cas particulier.</strong> Si \\(x\\) est <em>déjà</em> décimal ' +
    '(essaie \\(2{,}45\\)), à partir d\'un certain rang la troncature vaut exactement ' +
    '\\(x\\) : le point rouge se pose sur la borne de gauche, et ' +
    '\\(a\\leqslant x\\) devient \\(a=x\\).</li>' +
    '<li><strong>Petit piège.</strong> \\(\\mathbb{D}\\) est stable par addition et par ' +
    'multiplication (\\(0{,}25\\times 1{,}2=0{,}3\\)) mais pas par division : ' +
    '\\(1\\in\\mathbb{D}\\), \\(3\\in\\mathbb{D}\\), et pourtant ' +
    '\\(\\frac13\\notin\\mathbb{D}\\).</li>' +
    '</ul>',
  board: {
    boundingbox: [-10.6, 7.9, 10.6, -8.9], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette — deux couleurs, deux natures de nombres                     */
    /* ==================================================================== */
    var C_REEL = '#dc2626';   // rouge : le réel cherché (π, √2, …)
    var C_DEC  = '#7c3aed';   // violet : les DÉCIMAUX (bornes, chiffres, zone)
    var INK    = '#334155';
    var SOFT   = '#94a3b8';

    // Une police qui possède les lettres ajourées 𝔻, ℝ…
    var MATHFONT = "'STIX Two Math','Cambria Math','Latin Modern Math'," +
                   "'DejaVu Serif','Times New Roman',serif";

    /* ==================================================================== */
    /* Les nombres proposés                                                  */
    /*                                                                       */
    /* `ent` et `dec` sont les CHAÎNES de chiffres : tout le calcul des      */
    /* troncatures s'y ramène, donc aucun arrondi flottant parasite.         */
    /* ==================================================================== */
    var NOMBRES = [
      { key: 'pi',  sym: 'π',   ent: '3', dec: '14159265358979', fini: false,
        nature: 'irrationnel',
        phrase: 'Ses décimales ne s\'arrêtent jamais et ne se répètent pas : ' +
                'aucune fraction d\'entiers ne vaut π. Donc ' +
                'π &notin; 𝔻, et même π &notin; ℚ.' },
      { key: 'rac', sym: '√2',  ent: '1', dec: '41421356237309', fini: false,
        nature: 'irrationnel',
        phrase: 'Là encore les décimales ne s\'arrêtent jamais : √2 est irrationnel ' +
                '(on le démontre par l\'absurde). Pourtant √2 × √2 = 2, bien décimal !' },
      { key: 'tiers', sym: '1/3', ent: '0', dec: '33333333333333', fini: false,
        nature: 'rationnel, mais pas décimal',
        phrase: '1/3 = 0,3333… : l\'écriture est périodique, donc 1/3 &isin; ℚ — mais ' +
                'elle ne s\'arrête pas, donc 1/3 &notin; 𝔻. Le zoom se répète à ' +
                'l\'identique indéfiniment.' },
      { key: 'dec', sym: '2,45', ent: '2', dec: '45', fini: true,
        nature: 'décimal',
        phrase: '2,45 = 245/100 : deux chiffres après la virgule, et c\'est fini. ' +
                '2,45 &isin; 𝔻. Regarde le rang 2 : la borne de gauche EST le nombre.' }
    ];
    var iNum = 0;                      // le nombre choisi (indice dans NOMBRES)
    function N() { return NOMBRES[iNum]; }

    /* --- Arithmétique sur les chiffres ---------------------------------- */
    function decAt(i) {                // i-ième décimale ('0' au-delà)
      var d = N().dec;
      return i < d.length ? d.charAt(i) : '0';
    }
    // Les chiffres de la troncature au rang n, virgule enlevée : « 31415 ».
    function chiffres(n) {
      var s = N().ent;
      for (var i = 0; i < n; i++) s += decAt(i);
      return s;
    }
    // Replace la virgule n chiffres avant la fin : ('31415', 4) → « 3,1415 ».
    function virgule(s, n) {
      if (n === 0) return s;
      while (s.length <= n) s = '0' + s;
      return s.slice(0, s.length - n) + ',' + s.slice(s.length - n);
    }
    function troncStr(n) { return virgule(chiffres(n), n); }          // borne gauche
    function excesStr(n) {                                            // borne droite
      return virgule(String(parseInt(chiffres(n), 10) + 1), n);
    }
    function ampliStr(n) { return virgule('1', n); }                  // 10^(−n) en écriture décimale
    function expo(n) { return n === 0 ? '0' : '−' + n; }
    function num(s) { return parseFloat(s.replace(',', '.')); }
    function troncNum(n) { return num(troncStr(n)); }
    function xNum() { return num(N().ent + ',' + N().dec); }
    // Le nombre est-il ATTEINT par sa troncature au rang n (cas d'un décimal) ?
    function exactAu(n) { return N().dec.slice(n).replace(/0/g, '') === ''; }
    // L'arrondi : la borne dont x est le plus proche — la décimale suivante décide.
    function arrondiStr(n) { return decAt(n) >= '5' ? excesStr(n) : troncStr(n); }
    // Le chiffre lu à la ligne k : la partie entière, puis les décimales.
    function chiffreDe(k) { return k === 0 ? parseInt(N().ent, 10) : parseInt(decAt(k - 1), 10); }

    /* ==================================================================== */
    /* Géométrie des lignes                                                  */
    /*                                                                       */
    /* La ligne k représente l'intervalle [lo(k) ; lo(k) + 10^(1−k)], toujours*/
    /* dessiné à la MÊME largeur à l'écran : c'est ça, le zoom ×10.          */
    /* ==================================================================== */
    var ROWY = [6.4, 3.0, -0.4, -3.8, -7.2];   // hauteur de chaque ligne
    var RMAX = ROWY.length - 1;                // rang maximal atteint : 4
    var XL = -9.6, XR = 4.6, W = XR - XL;      // la ligne, à l'écran
    var XT = 5.15;                             // colonne de texte, à droite

    function lo(k) { return k === 0 ? 0 : troncNum(k - 1); }
    function largeur(k) { return Math.pow(10, 1 - k); }
    function xTick(j) { return XL + j * W / 10; }                 // j-ième graduation
    function xVal(k, v) {                                         // un réel → l'écran
      var t = XL + (v - lo(k)) / largeur(k) * W;
      return Math.max(XL, Math.min(XR, t));
    }

    /* ==================================================================== */
    /* État : jusqu'où a-t-on zoomé ?                                        */
    /* ==================================================================== */
    var rev = [1, 1, 1, 1, 1];      // avancement de l'apparition de chaque ligne
    function rang() {               // rang courant (−1 : rien d'affiché)
      var r = -1;
      for (var k = 0; k <= RMAX; k++) if (rev[k] > 0.5) r = k;
      return r;
    }

    // Ne pose un attribut que s'il change vraiment : la figure est rafraîchie
    // à chaque image d'animation.
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) {
        o._mv[key] = val;
        var a = {}; a[key] = val;
        o.setAttribute(a);
      }
    }

    /* ==================================================================== */
    /* L'écriture décimale, en haut : les chiffres trouvés s'allument         */
    /* ==================================================================== */
    function chiffre(txt, on) {
      return '<span style="color:' + (on ? C_DEC : SOFT) +
             (on ? ';font-weight:800' : '') + '">' + txt + '</span>';
    }
    board.create('text', [0, 7.35, function () {
      // Un décimal aussi a une écriture illimitée : elle finit par des zéros.
      // C'est très exactement ce qui le distingue de π ou de 1/3.
      var n = N(), r = rang();
      var s = '<span style="color:' + C_REEL + ';font-weight:800">' + n.sym +
              '</span><span style="color:' + INK + '"> = </span>' +
              chiffre(n.ent, r >= 0) + chiffre(',', r >= 1);
      for (var i = 0; i < 14; i++) s += chiffre(decAt(i), r >= i + 1);
      return s + '<span style="color:' + SOFT + '">…</span>';
    }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 16, color: INK,
      cssStyle: 'letter-spacing:.04em', fixed: true, highlight: false, layer: 9
    });

    /* ==================================================================== */
    /* Les cinq lignes graduées                                              */
    /* ==================================================================== */
    var LIGNES = [];

    for (var k = 0; k <= RMAX; k++) {
      (function (k) {
        var y = ROWY[k];
        var objets = { fond: [], texte: [], zone: [] };

        /* -- la loupe : le cône qui relie la zone violette d'en haut à la  */
        /*    ligne d'en bas, laquelle en est l'agrandissement ×10 --------- */
        if (k > 0) {
          var cone = board.create('curve', [[], []], {
            strokeColor: C_DEC, strokeWidth: 1, dash: 2, strokeOpacity: 0.35,
            fillColor: C_DEC, fillOpacity: 0.07,
            fixed: true, highlight: false, layer: 3
          });
          cone.updateDataArray = function () {
            var d = chiffreDe(k - 1);
            var yh = ROWY[k - 1] - 1.28, yb = y + 0.30;
            this.dataX = [xTick(d), xTick(d + 1), XR, XL, xTick(d)];
            this.dataY = [yh, yh, yb, yb, yh];
          };
          objets.zone.push(cone);

          // « ×10 » posé au milieu du cône.
          objets.texte.push(board.create('text', [function () {
            var d = chiffreDe(k - 1);
            return ((xTick(d) + xTick(d + 1)) / 2 + (XL + XR) / 2) / 2;
          }, (ROWY[k - 1] - 1.28 + y + 0.30) / 2, '×10'], {
            anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: C_DEC,
            cssStyle: 'font-weight:700;opacity:.75', fixed: true, highlight: false, layer: 4
          }));
        }

        /* -- la ligne et ses onze graduations ----------------------------- */
        objets.fond.push(board.create('segment', [[XL, y], [XR, y]], {
          strokeColor: INK, strokeWidth: 2, fixed: true, highlight: false, layer: 5
        }));
        for (var j = 0; j <= 10; j++) {
          (function (j) {
            var h = (j === 0 || j === 10) ? 0.22 : 0.14;
            objets.fond.push(board.create('segment', [[xTick(j), y - h], [xTick(j), y + h]], {
              strokeColor: SOFT, strokeWidth: 1.5, fixed: true, highlight: false, layer: 5
            }));
            // Le chiffre apporté par chaque dixième d'intervalle, sous la ligne.
            if (j < 10) {
              objets.texte.push(board.create('text', [xTick(j) + W / 20, y - 0.44,
                function () { return String(j); }], {
                anchorX: 'middle', anchorY: 'middle', fontSize: 11,
                color: SOFT, fixed: true, highlight: false, layer: 6,
                cssStyle: 'font-weight:600'
              }));
              objets.texte[objets.texte.length - 1]._chiffre = j;
            }
          })(j);
        }

        /* -- la zone violette : l'intervalle où se trouve le nombre -------- */
        objets.zone.push(board.create('segment', [
          [function () { return xTick(chiffreDe(k)); }, y],
          [function () { return xTick(chiffreDe(k) + 1); }, y]
        ], {
          strokeColor: C_DEC, strokeWidth: 7, fixed: true, highlight: false, layer: 6
        }));
        // Les deux crochets de l'intervalle, un peu plus hauts que les graduations.
        [0, 1].forEach(function (b) {
          objets.zone.push(board.create('segment', [
            [function () { return xTick(chiffreDe(k) + b); }, y - 0.26],
            [function () { return xTick(chiffreDe(k) + b); }, y + 0.26]
          ], { strokeColor: C_DEC, strokeWidth: 2.5, fixed: true, highlight: false, layer: 7 }));
        });

        /* -- les deux bornes décimales, écrites sous la ligne -------------- */
        [0, 1].forEach(function (b) {
          objets.texte.push(board.create('text', [
            function () { return xTick(chiffreDe(k) + b); }, y - 1.00,
            function () { return b === 0 ? troncStr(k) : excesStr(k); }
          ], {
            anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: C_DEC,
            cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 8
          }));
        });

        /* -- le réel cherché : un point rouge, et son nom ------------------ */
        var pt = board.create('point', [function () { return xVal(k, xNum()); }, y], {
          size: 4, face: 'o', fillColor: C_REEL, strokeColor: '#fff', strokeWidth: 1.5,
          fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 9
        });
        var lab = board.create('text', [
          function () { return xVal(k, xNum()); }, y + 0.40,
          function () { return N().sym; }
        ], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: C_REEL,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9
        });

        /* -- le bilan de la ligne, dans la colonne de droite --------------- */
        var bilan = board.create('text', [XT, y, function () {
          var signe = exactAu(k) ? '=' : '&lt;';
          return '<div style="font-size:.78em;color:' + SOFT + ';font-weight:700">' +
                   'n = ' + k + '</div>' +
                 '<div style="font-weight:800;color:' + C_DEC + '">' +
                   troncStr(k) + ' ' + signe +
                   ' <span style="color:' + C_REEL + '">' + N().sym + '</span> &lt; ' +
                   excesStr(k) + '</div>' +
                 '<div style="font-size:.78em;color:' + SOFT + '">amplitude ' +
                   ampliStr(k) + ' = 10<sup>' + expo(k) + '</sup></div>';
        }], {
          anchorX: 'left', anchorY: 'middle', fontSize: 13, color: INK,
          cssStyle: 'line-height:1.35;white-space:nowrap', fixed: true,
          highlight: false, layer: 8
        });

        objets.pt = pt; objets.lab = lab; objets.bilan = bilan;
        LIGNES[k] = objets;
      })(k);
    }

    /* ==================================================================== */
    /* Rafraîchissement : ce qui est visible, et à quelle opacité            */
    /* ==================================================================== */
    function refresh() {
      LIGNES.forEach(function (o, k) {
        var v = rev[k], on = v > 0.35;
        o.fond.forEach(function (s) { attr(s, 'visible', on); });
        o.zone.forEach(function (s) {
          attr(s, 'visible', v > 0.02);
          attr(s, 'strokeOpacity', Math.round(100 * v) / 100);
          attr(s, 'fillOpacity', Math.round(7 * v) / 100);
        });
        o.texte.forEach(function (t) {
          // Le chiffre choisi passe en violet gras : c'est la décimale trouvée.
          if (t._chiffre !== undefined) {
            var pris = t._chiffre === chiffreDe(k);
            attr(t, 'color', pris ? C_DEC : SOFT);
            attr(t, 'fontSize', pris ? 13 : 11);
          }
          attr(t, 'visible', on);
        });
        attr(o.pt, 'visible', v > 0.6);
        attr(o.lab, 'visible', v > 0.6);
        attr(o.bilan, 'visible', on);
      });
    }

    /* ==================================================================== */
    /* Le panneau : le tableau des encadrements                              */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    var dernier = '';                 // évite de reconstruire le HTML 60 fois/s

    function symR(s) {
      return '<span style="color:' + C_REEL + ';font-weight:800">' + s + '</span>';
    }
    function symD() {
      return '<span style="color:' + C_DEC + ';font-weight:700">𝔻</span>';
    }
    // Toutes les polices n'ont pas les lettres ajourées : on leur en impose une.
    function mathSyms(s) {
      return s.replace(/𝔻|ℚ|ℝ|ℕ|ℤ/g, function (c) {
        return '<span style="font-family:' + MATHFONT + '">' + c + '</span>';
      });
    }

    function renderPanel(force) {
      var r = rang();
      var cle = N().key + '|' + r;
      if (!force && cle === dernier) return;
      dernier = cle;

      var n = N();
      var lignes = '';
      for (var k = 0; k <= RMAX; k++) {
        var vu = k <= r;
        lignes +=
          '<tr class="' + (vu ? 'on' : 'off') + (k === r ? ' now' : '') + '" data-n="' + k + '">' +
            '<td class="enc-n">' + k + '</td>' +
            '<td>' + troncStr(k) + (exactAu(k) ? ' = ' : ' &lt; ') + symR(n.sym) +
              ' &lt; ' + excesStr(k) + '</td>' +
            '<td class="enc-amp">' + ampliStr(k) + '</td>' +
            '<td>' + arrondiStr(k) + '</td>' +
          '</tr>';
      }

      // La troncature courante, écrite comme un élément de 𝔻 : a / 10^n.
      var fraction = '';
      if (r >= 0) {
        var a = String(parseInt(chiffres(r), 10));
        fraction =
          '<p style="margin:.45rem 0 0">' +
            '<strong style="color:' + C_DEC + '">' + troncStr(r) + '</strong> = ' +
            '<span class="enc-frac"><b>' + a + '</b><i>10<sup>' + r + '</sup></i></span>' +
            ' : c\'est bien un quotient d\'un entier par une puissance de 10, donc un ' +
            'élément de ' + symD() + '.</p>';
      }

      panel.innerHTML = mathSyms(
        '<div class="props-name" style="color:' + C_REEL + '">' + n.sym +
          ' <span style="color:var(--ink-soft);font-size:.8em;font-weight:600">— ' +
          n.nature + '</span></div>' +
        '<p style="margin:.3rem 0 .7rem">' + n.phrase + '</p>' +

        '<div class="props-label">Les encadrements décimaux' +
          '<span style="text-transform:none;font-weight:600"> — clique une ligne</span>' +
        '</div>' +
        '<div class="enc-tablewrap"><table class="enc-table">' +
          '<thead><tr><th>n</th><th>Encadrement à 10<sup>−n</sup> près</th>' +
          '<th>Amplitude</th><th>Arrondi</th></tr></thead>' +
          '<tbody>' + lignes + '</tbody>' +
        '</table></div>' +

        '<div class="props-label">Ce qu\'il faut retenir</div>' +
        '<ul class="props-list">' +
          '<li>La borne de gauche est la <strong>troncature</strong> de ' + n.sym +
            ' au rang n (on coupe), la borne de droite vaut ' +
            '<strong>troncature + 10<sup>−n</sup></strong>.</li>' +
          '<li>Les deux bornes sont des <strong>décimaux</strong> : ' +
            'valeur approchée <em>par défaut</em> et <em>par excès</em>.</li>' +
          '<li>L\'<strong>amplitude</strong> 10<sup>−n</sup> est la précision. Elle devient ' +
            'aussi petite qu\'on veut : ' + symD() + ' est <strong>dense</strong> dans ℝ.</li>' +
          (n.fini
            ? '<li>' + n.sym + ' <strong>est</strong> décimal : dès le rang ' +
              n.dec.length + ', la troncature vaut exactement ' + n.sym + '.</li>'
            : '<li>On approche ' + n.sym + ' d\'aussi près qu\'on veut, mais on ne ' +
              '<strong>l\'atteint jamais</strong> : ' + n.sym + ' &notin; ' + symD() + '.</li>') +
        '</ul>' +
        fraction);
    }

    // Cliquer une ligne du tableau = régler directement le rang.
    panel.addEventListener('click', function (e) {
      var tr = e.target.closest ? e.target.closest('tr[data-n]') : null;
      if (!tr) return;
      anim.cancel();
      setRang(parseInt(tr.dataset.n, 10));
    });

    board.on('update', function () { refresh(); renderPanel(false); });

    /* ==================================================================== */
    /* Réglage du rang, choix du nombre, animation                           */
    /* ==================================================================== */
    function setRang(r) {
      for (var k = 0; k <= RMAX; k++) rev[k] = k <= r ? 1 : 0;
      board.update();
    }

    var anim = mv.createAnimator();

    function reset() { setRang(-1); }
    function play() {
      var steps = [];
      for (var k = 0; k <= RMAX; k++) {
        (function (k) {
          steps.push({ dur: k === 0 ? 500 : 750, step: function (p) {
            // État ABSOLU : « Précédent » rejoue les étapes telles quelles.
            for (var j = 0; j <= RMAX; j++) rev[j] = j < k ? 1 : (j === k ? p : 0);
          } });
        })(k);
      }
      reset();
      anim.runSteps(steps, reset);
    }

    var btns = {};
    function majBoutons() {
      NOMBRES.forEach(function (n, i) {
        if (btns[n.key]) btns[n.key].classList.toggle('active', i === iNum);
      });
    }
    function choisir(i) {
      if (i === iNum) return;
      anim.cancel();
      iNum = i;
      majBoutons();
      if (rang() < 0) setRang(RMAX);       // on ne reste pas sur une figure vide
      else board.update();
      renderPanel(true);
    }

    var specs = NOMBRES.map(function (n, i) {
      return { type: 'button', id: 'n' + n.key, label: n.sym,
               onClick: function () { choisir(i); } };
    });
    specs.push({ type: 'button', id: 'play', label: '▶ Animer', onClick: play });

    var refs = mv.addControls(specs);
    NOMBRES.forEach(function (n) { btns[n.key] = refs['n' + n.key]; });
    mv.extras.appendChild(panel);

    majBoutons();
    setRang(RMAX);            // à l'ouverture, toute la cascade est visible
    renderPanel(true);
    board.update();
  }
});
