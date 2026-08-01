/*
 * Les intervalles de ℝ (2nde) — crochets ouverts / fermés, et appartenance.
 *
 * Un intervalle, c'est un « morceau » de la droite des réels : tous les
 * nombres compris entre deux bornes. Toute la difficulté tient dans le sens
 * des crochets, et c'est exactement ce que la figure met en scène :
 *
 *      [ a ; b ]   a et b compris        a ⩽ x ⩽ b
 *      ] a ; b [   a et b exclus         a < x < b
 *      [ a ; b [   a compris, b exclu    a ⩽ x < b
 *      ] a ; b ]   a exclu, b compris    a < x ⩽ b
 *
 * Moyen mnémotechnique visible sur le dessin : le crochet est tourné VERS
 * l'intervalle quand la borne est comprise, et vers l'EXTÉRIEUR quand elle
 * est exclue. Trois codes disent la même chose au même endroit : le sens du
 * crochet, le point plein ou creux, et le bord de la bande (trait plein ou
 * pointillé).
 *
 * Les bornes infinies sont traitées comme un cas à part : −∞ et +∞ ne sont
 * pas des nombres, on ne peut donc JAMAIS fermer le crochet de leur côté.
 * Cocher « pas de borne à gauche » désactive d'ailleurs la case « borne
 * gauche comprise ».
 *
 * Le point de test x se déplace sur la droite : on lit tout de suite s'il est
 * dans la bande colorée, et le panneau détaille les deux comparaisons. Le
 * « mode question » cache la réponse pour interroger la classe.
 */
MathsView.register({
  id: 'intervalles',
  title: 'Les intervalles',
  level: '2nde',
  category: 'calcul',
  subcategory: 'Ensembles de nombres',
  theme: 'Nombres — intervalles de ℝ, crochets ouverts ou fermés, appartenance',
  description:
    'Un <strong>intervalle</strong> est un morceau de la droite des réels : tous les ' +
    'nombres compris entre deux <strong>bornes</strong>. Le <strong>crochet</strong> dit ' +
    'si la borne fait partie du voyage : ' +
    '<strong>fermé</strong> \\([\\) elle est <em>comprise</em>, ' +
    '<strong>ouvert</strong> \\(]\\) elle est <em>exclue</em>.' +
    '<br>Sur le dessin, trois indices disent la même chose : le crochet est tourné ' +
    '<strong>vers l\'intervalle</strong> si la borne est comprise (et vers l\'extérieur ' +
    'sinon), le point est <strong>plein</strong> ou <strong>creux</strong>, et le bord de ' +
    'la bande est en <strong>trait plein</strong> ou en <strong>pointillés</strong>.' +
    '<br>Déplace le point <strong>x</strong> : la figure et le panneau disent s\'il ' +
    '<strong>appartient</strong> à l\'intervalle, et pourquoi. Essaie surtout de le poser ' +
    '<em>exactement sur une borne</em> : c\'est là que tout se joue.' +
    '<br>Les cases <strong>−∞</strong> et <strong>+∞</strong> enlèvent une borne. ' +
    'Attention : de ce côté-là le crochet reste <strong>toujours ouvert</strong>, ' +
    'parce que l\'infini n\'est pas un nombre.' +
    '<br><em>Déplace les deux bornes et le point x à la souris. Le ' +
    '<strong>mode question</strong> cache la réponse pour faire chercher la classe.</em>',
  notes:
    '<ul>' +
    '<li><strong>Les quatre écritures.</strong> Pour \\(a\\leqslant b\\) : ' +
    '\\([a\\,;b]=\\{x\\in\\mathbb{R}\\mid a\\leqslant x\\leqslant b\\}\\) (fermé), ' +
    '\\(]a\\,;b[\\;=\\{x\\mid a<x<b\\}\\) (ouvert), ' +
    '\\([a\\,;b[\\;=\\{x\\mid a\\leqslant x<b\\}\\) et ' +
    '\\(]a\\,;b]=\\{x\\mid a<x\\leqslant b\\}\\) (semi-ouverts).</li>' +
    '<li><strong>Le crochet, mode d\'emploi.</strong> Crochet <em>fermé</em> ' +
    '\\([\\;]\\) : la borne <strong>appartient</strong> à l\'intervalle. Crochet ' +
    '<em>ouvert</em> \\(]\\;[\\) : elle n\'y appartient pas. Sur un axe, on le retient ' +
    'ainsi : le crochet se tourne vers l\'intérieur pour « attraper » la borne.</li>' +
    '<li><strong>Inégalités et intervalles, c\'est la même chose.</strong> ' +
    '\\(x\\in[-3\\,;2[\\iff -3\\leqslant x<2\\). Savoir passer d\'une écriture à l\'autre ' +
    'est l\'essentiel du chapitre.</li>' +
    '<li><strong>Bornes infinies.</strong> \\(]-\\infty\\,;b]=\\{x\\mid x\\leqslant b\\}\\), ' +
    '\\([a\\,;+\\infty[\\;=\\{x\\mid x\\geqslant a\\}\\), et ' +
    '\\(]-\\infty\\,;+\\infty[\\;=\\mathbb{R}\\). Du côté de l\'infini le crochet est ' +
    '<strong>toujours ouvert</strong> : \\(+\\infty\\) n\'est pas un nombre, il ne peut ' +
    'donc pas appartenir à l\'intervalle. Écrire \\([a\\,;+\\infty]\\) est une faute.</li>' +
    '<li><strong>Exemples utiles.</strong> \\(\\mathbb{R}^{+}=[0\\,;+\\infty[\\), ' +
    '\\(\\mathbb{R}^{-}=\\;]-\\infty\\,;0]\\), ' +
    '\\(\\mathbb{R}^{*}=\\;]-\\infty\\,;0[\\;\\cup\\;]0\\,;+\\infty[\\).</li>' +
    '<li><strong>Cas particuliers.</strong> \\([a\\,;a]=\\{a\\}\\) (un seul nombre), ' +
    'tandis que \\(]a\\,;a[\\;=\\;]a\\,;a]=\\;[a\\,;a[\\;=\\varnothing\\) ' +
    '(l\'ensemble vide) : dès qu\'un crochet est ouvert et que les bornes sont égales, ' +
    'il ne reste plus rien.</li>' +
    '<li><strong>Amplitude et centre.</strong> Pour un intervalle borné, l\'amplitude ' +
    '(sa longueur) vaut \\(b-a\\) et son centre \\(\\dfrac{a+b}{2}\\). ' +
    'Ainsi \\([-3\\,;2]\\) a pour amplitude \\(5\\) et pour centre \\(-0{,}5\\).</li>' +
    '<li><strong>Attention à l\'ordre.</strong> On écrit toujours la plus petite borne ' +
    'à gauche : \\([2\\,;-3]\\) n\'a aucun sens.</li>' +
    '<li><strong>Ne pas confondre.</strong> \\(]1\\,;5[\\) est un <em>intervalle</em> ' +
    '(une infinité de réels : 1,0001 ; 2 ; \\(\\pi\\) ; 4,999…), alors que ' +
    '\\(\\{1;5\\}\\) est un <em>ensemble de deux nombres</em>.</li>' +
    '</ul>',
  board: {
    boundingbox: [-10, 7.5, 10, -7.5], keepaspectratio: true,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_YES = '#16a34a';   // vert : borne COMPRISE, ou point qui appartient
    var C_NO  = '#dc2626';   // rouge : point qui n'appartient pas
    var C_OPN = '#ea580c';   // orange : borne EXCLUE (crochet ouvert)
    var C_I   = '#2563eb';   // bleu : l'intervalle lui-même
    var INK   = '#334155';
    var SOFT  = '#64748b';

    var YL = 1.6;            // hauteur de la droite graduée
    var YT = -1.1;           // hauteur du point de test
    var YB = -1.75;          // bas de la bande colorée
    var H  = 0.52;           // demi-hauteur des crochets
    var XMIN = -9.35, XMAX = 9.35;   // là où s'arrête le dessin (côté infini)
    var ARROW = { type: 2, size: 7 };

    /* ==================================================================== */
    /* État                                                                 */
    /* ==================================================================== */
    var closedL = true;      // borne gauche comprise ?  → crochet [
    var closedR = false;     // borne droite comprise ?  → crochet ]
    var infL = false;        // pas de borne à gauche (−∞)
    var infR = false;        // pas de borne à droite (+∞)
    var quiz = false;        // mode question : la réponse est cachée
    var shown = true;        // la réponse est-elle dévoilée ?
    var refs = null;

    function fmt(x) {
      var v = Math.round(x * 10) / 10;
      if (Object.is(v, -0)) v = 0;
      return v.toString().replace('-', '−').replace('.', ',');
    }
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) {
        o._mv[key] = val;
        var t = {}; t[key] = val;
        o.setAttribute(t);
      }
    }
    function show(o, v) { attr(o, 'visible', !!v); }

    /* ==================================================================== */
    /* La droite des réels                                                   */
    /* ==================================================================== */
    board.create('segment', [[-9.7, YL], [9.7, YL]], {
      strokeColor: INK, strokeWidth: 2, firstArrow: { type: 2, size: 6 },
      lastArrow: { type: 2, size: 6 }, fixed: true, highlight: false, layer: 5
    });
    for (var v = -9; v <= 9; v++) {
      (function (v) {
        board.create('segment', [[v, YL - 0.16], [v, YL + 0.16]], {
          strokeColor: INK, strokeWidth: v === 0 ? 2.5 : 1.2,
          fixed: true, highlight: false, layer: 5
        });
        board.create('text', [v, YL - 0.62, function () {
          return String(v).replace('-', '−');
        }], { anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: SOFT,
              fixed: true, highlight: false, layer: 5 });
      })(v);
    }

    /* ==================================================================== */
    /* Les deux bornes et le point de test                                   */
    /*                                                                       */
    /* Trois points libres, ramenés à chaque déplacement sur leur ligne et    */
    /* sur les demi-unités : les valeurs restent lisibles.                    */
    /* ==================================================================== */
    function snap(x) { return Math.max(-9, Math.min(9, Math.round(x * 2) / 2)); }

    var PA = board.create('point', [-3, YL], {
      size: 5, strokeWidth: 2, fixed: false, withLabel: false,
      showInfobox: false, layer: 9
    });
    var PB = board.create('point', [2, YL], {
      size: 5, strokeWidth: 2, fixed: false, withLabel: false,
      showInfobox: false, layer: 9
    });
    var PT = board.create('point', [4, YT], {
      size: 6, strokeWidth: 2, fixed: false, withLabel: false,
      showInfobox: false, layer: 9
    });

    function a() { return PA.X(); }
    function b() { return PB.X(); }
    function t() { return PT.X(); }

    // Les bornes ne se croisent jamais : a reste à gauche de b.
    PA.on('drag', function () {
      PA.setPosition(JXG.COORDS_BY_USER, [Math.min(snap(PA.X()), b()), YL]);
      ask(); board.update();
    });
    PB.on('drag', function () {
      PB.setPosition(JXG.COORDS_BY_USER, [Math.max(snap(PB.X()), a()), YL]);
      ask(); board.update();
    });
    PT.on('drag', function () {
      PT.setPosition(JXG.COORDS_BY_USER, [snap(PT.X()), YT]);
      ask(); board.update();
    });

    /* ==================================================================== */
    /* Appartenance : les deux conditions, chacune de son côté               */
    /* ==================================================================== */
    function okLeft()  { return infL || (closedL ? t() >= a() : t() > a()); }
    function okRight() { return infR || (closedR ? t() <= b() : t() < b()); }
    function belongs() { return okLeft() && okRight(); }
    // Un intervalle est vide si ses bornes sont confondues et qu'au moins un
    // crochet est ouvert.
    function empty() {
      return !infL && !infR && a() === b() && !(closedL && closedR);
    }
    function singleton() {
      return !infL && !infR && a() === b() && closedL && closedR;
    }

    /* ==================================================================== */
    /* La bande colorée : l'intervalle vu comme un morceau de droite         */
    /* ==================================================================== */
    function pt(fx, fy) {
      return board.create('point', [fx, fy],
        { visible: false, fixed: true, name: '', withLabel: false });
    }
    function bandL() { return infL ? XMIN : a(); }
    function bandR() { return infR ? XMAX : b(); }

    var band = board.create('polygon', [
      pt(bandL, function () { return YL + 0.62; }),
      pt(bandR, function () { return YL + 0.62; }),
      pt(bandR, function () { return YB; }),
      pt(bandL, function () { return YB; })
    ], { fillColor: C_I, fillOpacity: 0.13, withLines: false,
         borders: { visible: false }, hasInnerPoints: false,
         fixed: true, highlight: false, layer: 2 });

    // Le trait épais posé sur la droite elle-même, fléché du côté infini.
    var bar = board.create('segment', [pt(bandL, function () { return YL; }),
                                       pt(bandR, function () { return YL; })], {
      strokeColor: C_I, strokeWidth: 6, fixed: true, highlight: false, layer: 4
    });

    // Les bords verticaux de la bande : trait plein si la borne est comprise,
    // pointillés sinon.
    function edge(xf) {
      return board.create('segment', [pt(xf, function () { return YL - H; }),
                                      pt(xf, function () { return YB; })], {
        strokeColor: C_YES, strokeWidth: 2, fixed: true, highlight: false, layer: 3
      });
    }
    var edgeL = edge(function () { return a(); });
    var edgeR = edge(function () { return b(); });

    /* ==================================================================== */
    /* Les crochets                                                          */
    /*                                                                       */
    /* Trois segments : la barre verticale et les deux bras. Les bras         */
    /* pointent vers l'INTÉRIEUR de l'intervalle quand la borne est comprise, */
    /* vers l'extérieur quand elle est exclue — c'est tout le moyen           */
    /* mnémotechnique de la leçon.                                           */
    /* ==================================================================== */
    function bracket(xf, dirf) {
      var V1 = pt(xf, function () { return YL - H; });
      var V2 = pt(xf, function () { return YL + H; });
      var A1 = pt(function () { return xf() + 0.34 * dirf(); },
                  function () { return YL + H; });
      var A2 = pt(function () { return xf() + 0.34 * dirf(); },
                  function () { return YL - H; });
      var o = { strokeWidth: 4, strokeColor: C_YES, lineCap: 'round',
                fixed: true, highlight: false, layer: 8 };
      return [board.create('segment', [V1, V2], o),
              board.create('segment', [V2, A1], o),
              board.create('segment', [V1, A2], o)];
    }
    var brL = bracket(function () { return a(); },
                      function () { return closedL ? 1 : -1; });
    var brR = bracket(function () { return b(); },
                      function () { return closedR ? -1 : 1; });

    /* Les étiquettes −∞ / +∞, au bout de la bande ------------------------- */
    var infTxtL = board.create('text', [XMIN + 0.5, YL + 0.95, function () {
      return '−∞';
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: C_I,
          cssStyle: 'font-weight:800', fixed: true, highlight: false,
          layer: 8, visible: false });
    var infTxtR = board.create('text', [XMAX - 0.5, YL + 0.95, function () {
      return '+∞';
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: C_I,
          cssStyle: 'font-weight:800', fixed: true, highlight: false,
          layer: 8, visible: false });

    /* Les valeurs des bornes, au-dessus de la droite ----------------------- */
    function boundLabel(xf, txtf) {
      return board.create('text', [xf, YL + 0.95, txtf], {
        anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: C_YES,
        cssStyle: 'font-weight:800;background:rgba(255,255,255,.85);' +
                  'padding:0 3px;border-radius:5px', fixed: true,
        highlight: false, layer: 8
      });
    }
    var labA = boundLabel(function () { return a(); }, function () { return fmt(a()); });
    var labB = boundLabel(function () { return b(); }, function () { return fmt(b()); });

    /* ==================================================================== */
    /* Le point de test                                                      */
    /* ==================================================================== */
    var lineT = board.create('segment', [pt(t, function () { return YT; }),
                                         pt(t, function () { return YL; })], {
      strokeColor: SOFT, strokeWidth: 1.5, dash: 2, fixed: true,
      highlight: false, layer: 3
    });
    var dotT = board.create('point', [t, YL], {
      size: 3, fixed: true, withLabel: false, showInfobox: false,
      highlight: false, layer: 8, color: C_NO
    });
    var labT = board.create('text', [t, YT - 0.75, function () {
      return 'x = ' + fmt(t());
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: INK,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 8 });

    /* ==================================================================== */
    /* Les textes du haut : l'écriture de l'intervalle, puis l'inégalité      */
    /* ==================================================================== */
    // Le crochet écrit dépend du côté ET de l'inclusion. Du côté de l'infini
    // il est forcément ouvert.
    function brChar(side) {
      if (side === 'L') return (infL || !closedL) ? ']' : '[';
      return (infR || !closedR) ? '[' : ']';
    }
    function brColor(side) {
      if (side === 'L') return (infL || !closedL) ? C_OPN : C_YES;
      return (infR || !closedR) ? C_OPN : C_YES;
    }
    function big(s, col, size) {
      return '<span style="color:' + col + ';font-size:' + size + 'em">' + s + '</span>';
    }
    function notation() {
      return big(brChar('L'), brColor('L'), 1.15) + ' ' +
        (infL ? '−∞' : fmt(a())) + ' <span style="color:' + SOFT + '">;</span> ' +
        (infR ? '+∞' : fmt(b())) + ' ' + big(brChar('R'), brColor('R'), 1.15);
    }
    // La même chose en inégalités.
    function inequality() {
      if (infL && infR) return 'x est un réel quelconque : aucune condition.';
      var l = infL ? '' : fmt(a()) + (closedL ? ' ≤ ' : ' < ');
      var r = infR ? '' : (closedR ? ' ≤ ' : ' < ') + fmt(b());
      return l + 'x' + r;
    }

    board.create('text', [0, 6.3, function () {
      return 'I = ' + notation();
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 26, color: C_I,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });

    board.create('text', [0, 4.95, function () {
      return 'x ∈ I &nbsp;⟺&nbsp; ' + inequality();
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: INK,
          cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 9 });

    board.create('text', [0, 3.85, function () { return kind(); }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: SOFT,
      fixed: true, highlight: false, layer: 9
    });

    function kind() {
      if (empty()) return 'Les deux bornes sont confondues et un crochet est ouvert : ' +
        'l\'intervalle est <strong>vide</strong> (∅).';
      if (singleton()) return 'Les deux bornes sont confondues et les crochets sont ' +
        'fermés : il ne reste que le nombre ' + fmt(a()) + '.';
      if (infL && infR) return 'Aucune borne : cet intervalle est <strong>ℝ</strong> ' +
        'tout entier.';
      var s;
      if (infL || infR) s = 'Intervalle <strong>non borné</strong> (illimité d\'un côté)';
      else if (closedL && closedR) s = 'Intervalle <strong>fermé</strong> : les deux bornes sont comprises';
      else if (!closedL && !closedR) s = 'Intervalle <strong>ouvert</strong> : aucune borne n\'est comprise';
      else s = 'Intervalle <strong>semi-ouvert</strong> : une borne comprise, l\'autre non';
      if (!infL && !infR) {
        s += ' — amplitude ' + fmt(b() - a()) + ', centre ' + fmt((a() + b()) / 2);
      }
      return s;
    }

    /* ==================================================================== */
    /* Le verdict, en bas                                                    */
    /* ==================================================================== */
    var verdict = board.create('text', [0, -3.5, function () {
      if (!shown) return '<span style="color:' + SOFT + '">' + fmt(t()) +
        ' appartient-il à I ?</span>';
      return fmt(t()) + (belongs() ? ' ∈ I' : ' ∉ I');
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 24, color: C_YES,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });

    var why = board.create('text', [0, -4.8, function () { return reason(); }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: INK,
      fixed: true, highlight: false, layer: 9
    });

    function tick(ok) {
      return ok ? '<span style="color:' + C_YES + '">✓</span>'
                : '<span style="color:' + C_NO + '">✗</span>';
    }
    // Les deux comparaisons, côte à côte, chacune avec son verdict.
    function reason() {
      if (!shown) return '<span style="color:' + SOFT + '">' +
        'Regarde le crochet de chaque côté, puis clique sur « Réponse ».</span>';
      if (empty()) return 'L\'intervalle est vide : aucun nombre ne lui appartient.';
      var parts = [];
      if (!infL) {
        parts.push(fmt(a()) + (closedL ? ' ≤ ' : ' < ') + fmt(t()) + ' ' + tick(okLeft()));
      }
      if (!infR) {
        parts.push(fmt(t()) + (closedR ? ' ≤ ' : ' < ') + fmt(b()) + ' ' + tick(okRight()));
      }
      if (!parts.length) return 'Tout réel convient : I = ℝ.';
      return parts.join(' &nbsp;&nbsp;et&nbsp;&nbsp; ');
    }

    // Le cas décisif : x est posé exactement sur une borne.
    board.create('text', [0, -6.2, function () { return memo(); }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: SOFT,
      fixed: true, highlight: false, layer: 9
    });

    function memo() {
      if (shown && !infL && t() === a() && a() !== b()) {
        return '<span style="color:' + (closedL ? C_YES : C_OPN) + ';font-weight:700">' +
          'x est exactement sur la borne gauche : le crochet est ' +
          (closedL ? 'fermé, elle est donc COMPRISE.' : 'ouvert, elle est donc EXCLUE.') +
          '</span>';
      }
      if (shown && !infR && t() === b() && a() !== b()) {
        return '<span style="color:' + (closedR ? C_YES : C_OPN) + ';font-weight:700">' +
          'x est exactement sur la borne droite : le crochet est ' +
          (closedR ? 'fermé, elle est donc COMPRISE.' : 'ouvert, elle est donc EXCLUE.') +
          '</span>';
      }
      return 'Le crochet est tourné <strong>vers l\'intervalle</strong> quand la borne ' +
        'est comprise,<br>et vers l\'<strong>extérieur</strong> quand elle est exclue.';
    }

    /* ==================================================================== */
    /* Rafraîchissement                                                      */
    /* ==================================================================== */
    function refresh() {
      var vide = empty();
      var colL = closedL ? C_YES : C_OPN;
      var colR = closedR ? C_YES : C_OPN;

      // Bornes : point plein si comprise, creux si exclue ; rien du côté ∞.
      show(PA, !infL);
      show(labA, !infL);
      attr(PA, 'fillColor', closedL ? C_YES : '#ffffff');
      attr(PA, 'strokeColor', colL);
      attr(labA, 'color', colL);
      show(PB, !infR);
      show(labB, !infR);
      attr(PB, 'fillColor', closedR ? C_YES : '#ffffff');
      attr(PB, 'strokeColor', colR);
      attr(labB, 'color', colR);

      brL.forEach(function (s) { show(s, !infL); attr(s, 'strokeColor', colL); });
      brR.forEach(function (s) { show(s, !infR); attr(s, 'strokeColor', colR); });

      show(infTxtL, infL);
      show(infTxtR, infR);

      // Bords de la bande : plein si comprise, pointillés sinon.
      show(edgeL, !infL && !vide);
      show(edgeR, !infR && !vide);
      attr(edgeL, 'strokeColor', colL);
      attr(edgeR, 'strokeColor', colR);
      attr(edgeL, 'dash', closedL ? 0 : 2);
      attr(edgeR, 'dash', closedR ? 0 : 2);

      // La bande et le trait épais disparaissent si l'intervalle est vide.
      show(band, !vide);
      show(bar, !vide);
      // ARROW est une constante : attr() compare les valeurs, un objet créé
      // à la volée relancerait setAttribute à chaque image.
      attr(bar, 'firstArrow', infL ? ARROW : false);
      attr(bar, 'lastArrow', infR ? ARROW : false);

      // Le point de test et son verdict.
      var col = !shown ? SOFT : (belongs() ? C_YES : C_NO);
      attr(PT, 'fillColor', col);
      attr(PT, 'strokeColor', col);
      attr(dotT, 'color', col);
      attr(verdict, 'color', col);
      attr(lineT, 'strokeColor', col);
    }

    /* ==================================================================== */
    /* Panneau                                                               */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';

    function renderPanel() {
      var vide = empty();
      var dansTxt;
      if (!shown) {
        dansTxt = '<span style="color:' + SOFT + '">Réponds d\'abord, puis clique sur ' +
          '« Réponse ».</span>';
      } else if (vide) {
        dansTxt = '<strong style="color:' + C_NO + '">' + fmt(t()) + ' ∉ I</strong> — ' +
          'l\'intervalle est vide, aucun nombre ne lui appartient.';
      } else {
        dansTxt = '<strong style="color:' + (belongs() ? C_YES : C_NO) + '">' +
          fmt(t()) + (belongs() ? ' ∈ I' : ' ∉ I') + '</strong> : ' +
          (belongs()
            ? 'les deux conditions sont vérifiées.'
            : 'il suffit qu\'une seule condition tombe en défaut.');
      }

      panel.innerHTML =
        '<div class="props-name" style="color:' + C_I + '">I = ' + notation() + '</div>' +
        '<p style="margin:.3rem 0 .6rem">' + kind() + '</p>' +

        '<div class="props-label">La même chose en inégalités</div>' +
        '<p style="margin:.2rem 0 .5rem;font-weight:700">x ∈ I &nbsp;⟺&nbsp; ' +
          inequality() + '</p>' +

        '<div class="props-label">Les crochets</div>' +
        '<ul class="props-list">' +
          '<li>' + (infL
            ? 'À gauche, <strong>pas de borne</strong> : l\'intervalle descend jusqu\'à ' +
              '−∞. Le crochet reste <strong style="color:' + C_OPN + '">ouvert</strong> — ' +
              '−∞ n\'est pas un nombre, il ne peut pas être « compris ».'
            : 'Borne gauche ' + fmt(a()) + ' : crochet <strong style="color:' + colOf(closedL) +
              '">' + brChar('L') + '</strong>, elle est donc <strong style="color:' +
              colOf(closedL) + '">' + (closedL ? 'comprise' : 'exclue') + '</strong>.') +
          '</li>' +
          '<li>' + (infR
            ? 'À droite, <strong>pas de borne</strong> : l\'intervalle monte jusqu\'à ' +
              '+∞, crochet <strong style="color:' + C_OPN + '">ouvert</strong> lui aussi.'
            : 'Borne droite ' + fmt(b()) + ' : crochet <strong style="color:' + colOf(closedR) +
              '">' + brChar('R') + '</strong>, elle est donc <strong style="color:' +
              colOf(closedR) + '">' + (closedR ? 'comprise' : 'exclue') + '</strong>.') +
          '</li>' +
        '</ul>' +

        '<div class="props-label">Le point de test</div>' +
        '<p style="margin:.2rem 0 .3rem">' + (shown ? reason() : '') + '</p>' +
        '<p style="margin:.2rem 0 0">' + dansTxt + '</p>' +

        '<p style="margin:.5rem 0 0;font-size:.85rem;color:var(--ink-soft)">' +
          'Pour savoir si un nombre appartient à un intervalle, on ne devine pas : on ' +
          'écrit les <strong>deux inégalités</strong> et on les vérifie l\'une après ' +
          'l\'autre. Le crochet dit simplement s\'il faut mettre ' +
          '<strong>&lt;</strong> ou <strong>≤</strong>.</p>';
    }
    function colOf(closed) { return closed ? C_YES : C_OPN; }

    board.on('update', function () { refresh(); renderPanel(); });

    /* ==================================================================== */
    /* Mode question                                                         */
    /* ==================================================================== */
    function ask() {                 // une manipulation relance la question
      if (quiz) shown = false;
      if (refs) refs.ans.disabled = !quiz || shown;
    }
    function answer() {
      shown = true;
      if (refs) refs.ans.disabled = true;
      board.update();
    }

    /* ==================================================================== */
    /* Tirage d'un nouvel exemple                                            */
    /* ==================================================================== */
    function rnd(a0, b0) { return a0 + Math.floor(Math.random() * (b0 - a0 + 1)); }

    function newExample() {
      infL = Math.random() < 0.18;
      infR = Math.random() < 0.18;
      closedL = !infL && Math.random() < 0.5;
      closedR = !infR && Math.random() < 0.5;

      var x1 = rnd(-8, 3), x2 = x1 + rnd(2, 10);
      if (x2 > 9) x2 = 9;
      PA.setPosition(JXG.COORDS_BY_USER, [x1, YL]);
      PB.setPosition(JXG.COORDS_BY_USER, [x2, YL]);

      // Une fois sur trois, le point de test tombe pile sur une borne : c'est
      // le cas qui départage vraiment ouvert et fermé.
      var choix = rnd(0, 2);
      var xt;
      if (choix === 0 && !infL) xt = x1;
      else if (choix === 1 && !infR) xt = x2;
      else xt = rnd(-9, 9);
      PT.setPosition(JXG.COORDS_BY_USER, [xt, YT]);

      syncControls();
      ask();
      board.update();
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    // Une borne infinie ne peut pas être comprise : la case correspondante
    // est décochée ET désactivée.
    function syncControls() {
      if (!refs) return;
      refs.cl.checked = closedL; refs.cl.disabled = infL;
      refs.cr.checked = closedR; refs.cr.disabled = infR;
      refs.il.checked = infL;
      refs.ir.checked = infR;
      refs.quiz.checked = quiz;
      refs.ans.disabled = !quiz || shown;
    }

    refs = mv.addControls([
      { type: 'checkbox', id: 'cl', label: 'borne gauche comprise  [', checked: true,
        onChange: function (on) { closedL = on; ask(); board.update(); } },
      { type: 'checkbox', id: 'cr', label: 'borne droite comprise  ]', checked: false,
        onChange: function (on) { closedR = on; ask(); board.update(); } },
      { type: 'checkbox', id: 'il', label: 'pas de borne à gauche  (−∞)', checked: false,
        onChange: function (on) {
          infL = on;
          if (on) closedL = false;
          syncControls(); ask(); board.update();
        } },
      { type: 'checkbox', id: 'ir', label: 'pas de borne à droite  (+∞)', checked: false,
        onChange: function (on) {
          infR = on;
          if (on) closedR = false;
          syncControls(); ask(); board.update();
        } },
      { type: 'checkbox', id: 'quiz', label: 'mode question (cacher la réponse)',
        checked: false,
        onChange: function (on) { quiz = on; shown = !on; syncControls(); board.update(); } },
      { type: 'button', id: 'ans', label: 'Réponse', onClick: answer },
      { type: 'button', id: 'dice', label: '🎲 Nouvel exemple', onClick: newExample }
    ]);

    mv.extras.appendChild(panel);

    syncControls();
    board.update();
  }
});
