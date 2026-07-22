/*
 * Trigonométrie (3ème) — cosinus, sinus, tangente dans le triangle rectangle.
 *
 * Triangle rectangle en B. On étudie l'angle aigu Â (au sommet A).
 *   - côté ADJACENT à Â  : [AB]  (bleu)
 *   - côté OPPOSÉ  à Â   : [BC]  (vert)
 *   - HYPOTÉNUSE          : [AC]  (ambre, face à l'angle droit)
 *
 * Les trois rapports ne dépendent QUE de l'angle :
 *   cos Â = adjacent / hypoténuse = AB / AC
 *   sin Â = opposé   / hypoténuse = BC / AC
 *   tan Â = opposé   / adjacent   = BC / AB
 *
 * A est fixe ; B et C sont des FONCTIONS de l'angle et de la longueur de
 * l'hypoténuse (curseurs), donc la figure et les valeurs se recalculent en
 * direct. L'animation révèle l'angle, puis les trois côtés, puis les trois
 * rapports — idéale en mode « pas à pas » pour commenter au tableau.
 */
MathsView.register({
  id: 'trigonometrie',
  title: 'Cosinus, sinus, tangente',
  level: '3eme',
  theme: 'Trigonométrie — cosinus, sinus, tangente dans le triangle rectangle',
  description:
    'Dans un triangle rectangle, les rapports entre les côtés ne dépendent que ' +
    'de l\'angle aigu. Pour l\'angle <strong>Â</strong> : ' +
    '<br><strong>cos Â</strong> = adjacent / hypoténuse, ' +
    '<strong>sin Â</strong> = opposé / hypoténuse, ' +
    '<strong>tan Â</strong> = opposé / adjacent. ' +
    '<br>Règle l\'angle et la longueur avec les curseurs, et clique sur ' +
    '<strong>Animer</strong> (ou coche <strong>Pas à pas</strong>) pour dérouler.',
  notes:
    '<ul>' +
    '<li>L\'<strong>hypoténuse</strong> est toujours le côté <em>face à l\'angle droit</em> (le plus long).</li>' +
    '<li>Le côté <strong>adjacent</strong> et le côté <strong>opposé</strong> dépendent de l\'angle qu\'on regarde.</li>' +
    '<li>Moyen mnémotechnique <strong>SOH · CAH · TOA</strong> : ' +
    '<strong>S</strong>in = <strong>O</strong>pp/<strong>H</strong>yp, ' +
    '<strong>C</strong>os = <strong>A</strong>dj/<strong>H</strong>yp, ' +
    '<strong>T</strong>an = <strong>O</strong>pp/<strong>A</strong>dj.</li>' +
    '<li>Les rapports ne changent pas si on agrandit le triangle : ils ne dépendent que de l\'angle.</li>' +
    '</ul>',
  board: { boundingbox: [-6, 4.5, 5.5, -5], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_ADJ = '#2563eb';   // côté adjacent (bleu)
    var C_OPP = '#0d9488';   // côté opposé (vert)
    var C_HYP = '#f59e0b';   // hypoténuse (ambre)
    var C_ANG = '#7c3aed';   // angle Â (violet)
    var INK = '#334155';

    var ax = -4, ay = -3;    // sommet A (angle étudié) — fixe

    /* ==================================================================== */
    /* État + moteur d'animation partagé (mode « pas à pas »)                */
    /* ==================================================================== */
    var thetaDeg = 35;       // mesure de l'angle Â
    var L = 5;               // longueur de l'hypoténuse AC
    var anim = mv.createAnimator();

    function TH() { return thetaDeg * Math.PI / 180; }
    function Bx() { return ax + L * Math.cos(TH()); }   // abscisse de B et C
    function Cy() { return ay + L * Math.sin(TH()); }   // ordonnée de C
    function ADJ() { return L * Math.cos(TH()); }       // AB
    function OPP() { return L * Math.sin(TH()); }       // BC
    function HYP() { return L; }                        // AC

    function fmt(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
    function fmt2(x) { return (Math.round(x * 100) / 100).toString().replace('.', ','); }

    /* ==================================================================== */
    /* Figure (toujours visible : le triangle est explorable aux curseurs)   */
    /* ==================================================================== */
    var A = board.create('point', [ax, ay],
      { name: 'A', size: 2, color: INK, fixed: true, label: { offset: [-14, -6] }, highlight: false });
    var B = board.create('point', [Bx, function () { return ay; }],
      { name: 'B', size: 2, color: INK, fixed: true, label: { offset: [8, -14] }, highlight: false });
    var C = board.create('point', [Bx, Cy],
      { name: 'C', size: 2, color: INK, fixed: true, label: { offset: [8, 6] }, highlight: false });

    board.create('polygon', [A, B, C],
      { fillColor: '#eef2f7', fillOpacity: 0.7, highlight: false, fixed: true,
        borders: { strokeColor: INK, strokeWidth: 1.5 }, vertices: { visible: false } });
    // Angle droit en B (toujours visible).
    board.create('angle', [C, B, A],
      { type: 'square', radius: 0.45, fillColor: '#cbd5e1', fillOpacity: 0.8,
        strokeColor: '#94a3b8', withLabel: false, fixed: true, highlight: false });

    // Côtés colorés (révélés un par un).
    function side(p0, p1, color) {
      return board.create('segment', [p0, p1],
        { strokeColor: color, strokeWidth: 5, strokeOpacity: 0, fixed: true,
          highlight: false, layer: 9 });
    }
    var segHyp = side(A, C, C_HYP);
    var segAdj = side(A, B, C_ADJ);
    var segOpp = side(B, C, C_OPP);

    // Arc de l'angle Â (révélé en premier).
    var rPt = board.create('point', [function () { return ax + 0.9; }, function () { return ay; }],
      { visible: false, fixed: true, name: '' });
    var aPt = board.create('point',
      [function () { return ax + 0.9 * Math.cos(TH()); }, function () { return ay + 0.9 * Math.sin(TH()); }],
      { visible: false, fixed: true, name: '' });
    var arc = board.create('arc', [A, rPt, aPt],
      { strokeColor: C_ANG, strokeWidth: 2.5, strokeOpacity: 0, fixed: true,
        highlight: false, withLabel: false, layer: 9 });

    /* Étiquettes (texte vivant, révélé par fondu) ------------------------- */
    function mkText(fx, fy, contentFn, color) {
      var t = board.create('text', [fx, fy, contentFn],
        { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: color,
          cssStyle: 'font-weight:700', fixed: true, visible: false, highlight: false });
      t._base = 'font-weight:700';
      return t;
    }
    function fadeText(t, p) { t.setAttribute({ visible: p > 0.01, cssStyle: t._base + ';opacity:' + p }); }

    var angLbl = mkText(function () { return ax + 1.4 * Math.cos(TH() / 2); },
                        function () { return ay + 1.4 * Math.sin(TH() / 2); },
                        function () { return thetaDeg + '°'; }, C_ANG);
    var hypLbl = mkText(function () { return (ax + Bx()) / 2 - 0.8 * Math.sin(TH()); },
                        function () { return (ay + Cy()) / 2 + 0.8 * Math.cos(TH()); },
                        function () { return 'hypoténuse<br>AC = ' + fmt(HYP()); }, C_HYP);
    var adjLbl = mkText(function () { return (ax + Bx()) / 2; }, function () { return ay - 0.7; },
                        function () { return 'adjacent<br>AB = ' + fmt(ADJ()); }, C_ADJ);
    var oppLbl = mkText(function () { return Bx() + 1.15; }, function () { return (ay + Cy()) / 2; },
                        function () { return 'opposé<br>BC = ' + fmt(OPP()); }, C_OPP);

    /* ==================================================================== */
    /* Panneau : les trois rapports, valeurs en direct                       */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.style.cssText = 'margin:.8rem 0;padding:.8rem 1rem;border:1px solid #e2e8f0;' +
      'border-radius:10px;background:#f8fafc;max-width:660px';
    panel.innerHTML =
      '<div style="margin-bottom:.5rem;color:#475569">Dans le triangle rectangle en B, pour l\'angle Â :</div>' +
      '<div class="tg-cos" style="opacity:0;display:none;font-size:1rem;line-height:1.9"></div>' +
      '<div class="tg-sin" style="opacity:0;display:none;font-size:1rem;line-height:1.9"></div>' +
      '<div class="tg-tan" style="opacity:0;display:none;font-size:1rem;line-height:1.9"></div>';
    mv.extras.appendChild(panel);
    var rowCos = panel.querySelector('.tg-cos');
    var rowSin = panel.querySelector('.tg-sin');
    var rowTan = panel.querySelector('.tg-tan');

    function sp(txt, color) { return '<span style="color:' + color + ';font-weight:700">' + txt + '</span>'; }
    function updatePanel() {
      var a = thetaDeg + '°', adj = ADJ(), opp = OPP(), hyp = HYP();
      rowCos.innerHTML = '<strong>cos ' + a + '</strong> = ' + sp('adjacent', C_ADJ) + ' / ' + sp('hypoténuse', C_HYP) +
        ' = ' + fmt(adj) + ' / ' + fmt(hyp) + ' ≈ <strong>' + fmt2(Math.cos(TH())) + '</strong>';
      rowSin.innerHTML = '<strong>sin ' + a + '</strong> = ' + sp('opposé', C_OPP) + ' / ' + sp('hypoténuse', C_HYP) +
        ' = ' + fmt(opp) + ' / ' + fmt(hyp) + ' ≈ <strong>' + fmt2(Math.sin(TH())) + '</strong>';
      rowTan.innerHTML = '<strong>tan ' + a + '</strong> = ' + sp('opposé', C_OPP) + ' / ' + sp('adjacent', C_ADJ) +
        ' = ' + fmt(opp) + ' / ' + fmt(adj) + ' ≈ <strong>' + fmt2(Math.tan(TH())) + '</strong>';
    }

    /* ==================================================================== */
    /* Reset + étapes d'animation                                            */
    /* ==================================================================== */
    function reset() {
      [segHyp, segAdj, segOpp, arc].forEach(function (o) { o.setAttribute({ strokeOpacity: 0 }); });
      [angLbl, hypLbl, adjLbl, oppLbl].forEach(function (t) { t.setAttribute({ visible: false }); });
      [rowCos, rowSin, rowTan].forEach(function (r) { r.style.opacity = 0; r.style.display = 'none'; });
      board.update();
    }
    function revealRow(r, p) { r.style.display = ''; r.style.opacity = p; }

    function play() {
      reset();
      anim.runSteps([
        { dur: 500, step: function (p) { arc.setAttribute({ strokeOpacity: p }); fadeText(angLbl, p); } },
        { dur: 500, step: function (p) { segHyp.setAttribute({ strokeOpacity: p }); fadeText(hypLbl, p); } },
        { dur: 500, step: function (p) { segAdj.setAttribute({ strokeOpacity: p }); fadeText(adjLbl, p); } },
        { dur: 500, step: function (p) { segOpp.setAttribute({ strokeOpacity: p }); fadeText(oppLbl, p); } },
        { dur: 450, step: function (p) { revealRow(rowCos, p); } },
        { dur: 450, step: function (p) { revealRow(rowSin, p); } },
        { dur: 450, step: function (p) { revealRow(rowTan, p); } }
      ], reset);
    }

    /* ==================================================================== */
    /* Contrôles                                                            */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { reset(); } },
      { type: 'slider', id: 'ang', label: 'angle Â (°)', min: 15, max: 75, step: 5, value: 35,
        onInput: function (v) { thetaDeg = v; board.update(); updatePanel(); } },
      { type: 'slider', id: 'len', label: 'hypoténuse AC', min: 3, max: 6, step: 0.5, value: 5,
        onInput: function (v) { L = v; board.update(); updatePanel(); } }
    ]);

    updatePanel();
    board.update();
    play();          // charge les étapes (en pas à pas : figure prête, on déroule à la main)
  }
});
