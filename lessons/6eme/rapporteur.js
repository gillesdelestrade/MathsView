/*
 * Mesurer un angle avec le rapporteur (6ème).
 *
 * On pose un vrai rapporteur (demi-disque à DOUBLE graduation) sur un angle de
 * sommet O. L'élève déplace le second côté ; le site montre en direct :
 *   - où passe ce côté sur les deux graduations (bleue 0→180, rose 180→0) ;
 *   - la nature de l'angle (aigu / droit / obtus) ;
 *   - lequel des deux nombres il faut choisir.
 *
 * Contrôles :
 *   - « Deux graduations » : décoché, on n'affiche que la graduation bleue
 *     (0 à droite). C'est le SEUL réglage qui change les graduations ; le
 *     bouton de base, lui, n'y touche jamais.
 *   - « Base à droite / à gauche » : on pose le côté de référence (le 0) à
 *     droite OU à gauche du sommet — cela ne déplace que le segment de base.
 *     À gauche (« pas dans le sens du rapporteur ») : avec deux graduations on
 *     suit la rose ; avec la seule bleue on lit « à l'envers » (180 − lecture).
 *   - « 🎲 Au hasard » : angle aléatoire, base d'un côté ou de l'autre au hasard.
 *
 * ---------------------------------------------------------------------------
 * La géométrie
 * ---------------------------------------------------------------------------
 * Sommet à l'origine O. On note « a » (5..175) la MESURE de l'angle (ce qu'on
 * veut trouver). Le côté de référence est posé sur le 0.
 *   - base À DROITE : référence à 0°, second côté à l'angle physique  a.
 *   - base À GAUCHE : référence à 180°, second côté à l'angle physique 180 − a.
 * Dans les deux cas le second côté croise le bord sur les nombres
 *   bleu = angle physique,  rose = 180 − (angle physique),
 * c'est-à-dire { a ; 180 − a }. La bonne réponse est TOUJOURS a :
 *   - base à droite, le 0 bleu est sur le côté → on suit le bleu = a ;
 *   - base à gauche, le 0 rose est sur le côté → on suit le rose = a.
 * Et la règle « aigu → le plus petit, obtus → le plus grand » redonne aussi a.
 */
MathsView.register({
  id: 'rapporteur',
  title: 'Mesurer un angle au rapporteur',
  level: '6eme',
  category: 'geometrie',
  subcategory: 'Angles',
  theme: 'Géométrie — mesurer un angle avec le rapporteur',
  description:
    'Le <strong>rapporteur</strong> sert à mesurer un angle en degrés (°). ' +
    'La méthode :' +
    '<br><strong>1.</strong> pose le <strong>centre</strong> du rapporteur sur le ' +
    '<strong>sommet</strong> de l\'angle (le point O) ;' +
    '<br><strong>2.</strong> tourne-le pour poser le <strong>0</strong> sur un des deux côtés ;' +
    '<br><strong>3.</strong> regarde où passe l\'<strong>autre côté</strong> et lis la graduation.' +
    '<br><strong>Déplace le point bleu</strong>, joue avec le curseur, mets la ' +
    '<strong>base à droite ou à gauche</strong>, ou tire un <strong>angle au hasard</strong>.',
  notes:
    '<ul>' +
    '<li>Un angle <strong>aigu</strong> est <em>plus fermé</em> qu\'un angle droit : sa mesure est ' +
    '<strong>inférieure à 90°</strong>.</li>' +
    '<li>Un angle <strong>droit</strong> mesure exactement <strong>90°</strong> (le coin d\'une équerre).</li>' +
    '<li>Un angle <strong>obtus</strong> est <em>plus ouvert</em> qu\'un angle droit : sa mesure est ' +
    '<strong>supérieure à 90°</strong> (mais inférieure à 180°).</li>' +
    '</ul>' +
    '<p><strong>Pourquoi deux graduations&nbsp;?</strong> Le rapporteur porte deux séries de ' +
    'nombres (la <span style="color:#2563eb;font-weight:700">bleue</span> qui monte de 0 à 180, ' +
    'la <span style="color:#e11d48;font-weight:700">rose</span> qui descend de 180 à 0), pour ' +
    'qu\'on puisse poser le 0 à gauche <em>ou</em> à droite. Décoche « Deux graduations » : il ' +
    'ne reste que la <span style="color:#2563eb;font-weight:700">bleue</span> (0 à droite) ; le ' +
    'bouton « Base à droite / à gauche » ne déplace que le côté de base, sans jamais changer les ' +
    'graduations.</p>' +
    '<p><strong>Avec les deux échelles</strong>, ton côté croise le bord entre <em>deux</em> ' +
    'nombres, par exemple 50 et 130. Lequel choisir&nbsp;? <strong>L\'astuce&nbsp;:</strong>' +
    '<br>• angle <strong>aigu</strong> (bien fermé) → mesure petite → on prend le ' +
    '<strong>plus petit</strong> des deux&nbsp;;' +
    '<br>• angle <strong>obtus</strong> (bien ouvert) → mesure grande → on prend le ' +
    '<strong>plus grand</strong> des deux.</p>' +
    '<p><strong>Base à gauche&nbsp;?</strong> C\'est le cas « pas dans le sens du rapporteur ». ' +
    'Avec les deux graduations, le 0 de la base est alors sous la ' +
    '<span style="color:#e11d48;font-weight:700">rose</span> : on suit la rose. Avec la seule ' +
    'graduation <span style="color:#2563eb;font-weight:700">bleue</span>, on lit « à l\'envers » ' +
    '(180 − lecture). La mesure, elle, ne change pas.</p>',
  board: { boundingbox: [-5.9, 5.7, 5.9, -1.9], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette + dimensions                                                 */
    /* ==================================================================== */
    var BLUE = '#2563eb';   // graduation extérieure : 0 → 180
    var ROSE = '#e11d48';   // graduation intérieure : 180 → 0
    var GREEN = '#0d9488';  // les côtés de l'angle
    var AMBER = '#f59e0b';  // arc de l'angle + repère de lecture
    var INK = '#334155';
    var GREY = '#94a3b8';   // corps + graduations du rapporteur
    var VIOLET = '#7c3aed'; // angle droit

    var R = 4.3;            // rayon du rapporteur (le « bord » où on lit)
    var RL = R + 0.4;       // longueur des côtés (ils dépassent un peu le bord)
    var R_OUT = R - 0.5;    // rayon des nombres bleus (extérieurs)
    var R_IN = R - 1.15;    // rayon des nombres roses (intérieurs)

    /* ==================================================================== */
    /* État                                                                 */
    /* ==================================================================== */
    var aDeg = 40;          // MESURE de l'angle (ce qu'on cherche)
    var side = 'right';     // côté de la base : 'right' | 'left'
    var showTwo = true;     // afficher les deux graduations ?

    function rad(d) { return d * Math.PI / 180; }
    function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
    function A() { return rad(aDeg); }
    function refAngle() { return side === 'right' ? 0 : Math.PI; }        // direction du côté de base
    function phys() { return side === 'right' ? A() : Math.PI - A(); }    // angle physique du 2e côté
    function loAng() { return Math.min(refAngle(), phys()); }
    function hiAng() { return Math.max(refAngle(), phys()); }

    /* ==================================================================== */
    /* Corps du rapporteur : demi-disque + bord droit                       */
    /* ==================================================================== */
    var O = board.create('point', [0, 0], {
      name: 'O', size: 3, color: INK, fixed: true, highlight: false,
      label: { offset: [-6, -16], fontSize: 14, cssStyle: 'font-weight:700' }
    });
    var pR = board.create('point', [R, 0], { visible: false, fixed: true, name: '' });
    var pL = board.create('point', [-R, 0], { visible: false, fixed: true, name: '' });

    // Demi-disque (le corps translucide du rapporteur).
    board.create('arc', [O, pR, pL], {
      strokeColor: GREY, strokeWidth: 1.5, fillColor: '#fef3c7', fillOpacity: 0.18,
      fixed: true, highlight: false, withLabel: false, layer: 1
    });
    // Bord droit (le côté plat, marqué « 0 » aux deux bouts).
    board.create('segment', [pL, pR], { strokeColor: GREY, strokeWidth: 1.5, fixed: true, highlight: false, layer: 1 });

    // Croix repère au centre : « pose ce centre sur le sommet ».
    board.create('segment', [[-0.16, 0], [0.16, 0]], { strokeColor: INK, strokeWidth: 1, fixed: true, highlight: false, layer: 2 });
    board.create('segment', [[0, -0.16], [0, 0.16]], { strokeColor: INK, strokeWidth: 1, fixed: true, highlight: false, layer: 2 });

    /* ==================================================================== */
    /* Graduations (tous les degrés) + nombres (tous les 10°)               */
    /* ==================================================================== */
    for (var d = 0; d <= 180; d++) {
      var t = rad(d);
      var len = (d % 10 === 0) ? 0.5 : (d % 5 === 0) ? 0.32 : 0.18;
      var r0 = R - len;
      board.create('segment', [
        [r0 * Math.cos(t), r0 * Math.sin(t)],
        [R * Math.cos(t), R * Math.sin(t)]
      ], {
        strokeColor: GREY, strokeWidth: (d % 10 === 0) ? 1.4 : 0.7,
        fixed: true, highlight: false, layer: 2
      });
    }
    var blueTexts = [];   // graduation extérieure (valeur = g)
    var roseTexts = [];   // graduation intérieure (valeur = 180 − g)
    for (var g = 0; g <= 180; g += 10) {
      var tg = rad(g);
      blueTexts.push(board.create('text', [R_OUT * Math.cos(tg), R_OUT * Math.sin(tg), String(g)], {
        anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: BLUE,
        cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 3
      }));
      roseTexts.push(board.create('text', [R_IN * Math.cos(tg), R_IN * Math.sin(tg), String(180 - g)], {
        anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: ROSE,
        cssStyle: 'font-weight:600', fixed: true, highlight: false, layer: 3
      }));
    }

    /* ==================================================================== */
    /* L'angle : côté de référence (sur le 0) + côté mobile                  */
    /* ==================================================================== */
    // Côté de référence : posé sur le bord droit OU gauche selon `side`.
    var refEnd = board.create('point', [function () { return RL * Math.cos(refAngle()); }, 0],
      { visible: false, fixed: true, name: '' });
    board.create('segment', [O, refEnd], { strokeColor: GREEN, strokeWidth: 3.5, fixed: true, highlight: false, layer: 6 });

    // Point mobile qui définit le second côté.
    var P = board.create('point', [RL * Math.cos(phys()), RL * Math.sin(phys())], {
      name: '', size: 5, color: BLUE, strokeColor: '#1e3a8a', strokeWidth: 1,
      withLabel: false, layer: 8
    });
    board.create('segment', [O, P], { strokeColor: GREEN, strokeWidth: 3.5, highlight: false, layer: 6 });

    // Arc de l'angle (sans nombre : la mesure se lit sur le rapporteur).
    var aLo = board.create('point', [
      function () { return 1.25 * Math.cos(loAng()); },
      function () { return 1.25 * Math.sin(loAng()); }
    ], { visible: false, fixed: true, name: '' });
    var aHi = board.create('point', [
      function () { return 1.25 * Math.cos(hiAng()); },
      function () { return 1.25 * Math.sin(hiAng()); }
    ], { visible: false, fixed: true, name: '' });
    board.create('arc', [O, aLo, aHi], {
      strokeColor: AMBER, strokeWidth: 2.5, fillColor: AMBER, fillOpacity: 0.16,
      fixed: true, highlight: false, withLabel: false, layer: 5
    });

    // Repère de lecture : là où le second côté croise le bord gradué.
    board.create('point', [
      function () { return R * Math.cos(phys()); },
      function () { return R * Math.sin(phys()); }
    ], { name: '', size: 3, color: AMBER, strokeColor: '#b45309', fixed: true, highlight: false, layer: 7 });

    /* ==================================================================== */
    /* Rafraîchissement global                                              */
    /* ==================================================================== */
    var refs = null;   // rempli par addControls plus bas

    function refresh() {
      // Position du point mobile (le côté suit l'angle et le côté de base).
      P.setPosition(JXG.COORDS_BY_USER, [RL * Math.cos(phys()), RL * Math.sin(phys())]);
      // Visibilité des graduations : elle ne dépend QUE de la case, jamais du
      // côté de la base (changer la base ne modifie pas le rapporteur). La
      // graduation bleue reste toujours affichée ; la rose s'ajoute avec la case.
      blueTexts.forEach(function (t) { t.setAttribute({ visible: true }); });
      roseTexts.forEach(function (t) { t.setAttribute({ visible: showTwo }); });
      board.update();
      // Contrôles.
      if (refs) {
        if (refs.ang) { refs.ang.value = aDeg; if (refs.ang.nextSibling) refs.ang.nextSibling.textContent = aDeg; }
        if (refs.two) refs.two.checked = showTwo;
        if (refs.base) refs.base.textContent = 'Base : ' + (side === 'right' ? 'à droite ▶' : '◀ à gauche');
      }
      renderPanel();
    }

    // Déplacement du point mobile (rabattu dans le demi-plan supérieur).
    P.on('drag', function () {
      var p = Math.atan2(P.Y(), P.X()) * 180 / Math.PI;
      if (p < 0) p += 360;
      if (p > 180) p = 360 - p;
      var val = (side === 'right') ? p : 180 - p;
      aDeg = clamp(Math.round(val), 5, 175);
      refresh();
    });

    /* ==================================================================== */
    /* Panneau : nature, lecture(s), choix, mesure                          */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    mv.extras.appendChild(panel);

    function renderPanel() {
      var m = aDeg;                                                    // la mesure (réponse)
      var blueReading = Math.round(side === 'right' ? aDeg : 180 - aDeg); // là où le côté croise, lu en bleu
      var otherReading = 180 - blueReading;                            // l'autre lecture (rose ou 180 − lecture)
      var lo = Math.min(m, 180 - m), hi = Math.max(m, 180 - m);
      var baseWord = side === 'right' ? 'à droite' : 'à gauche';

      var nature, natColor;
      if (m < 90) { nature = 'Angle aigu'; natColor = BLUE; }
      else if (m > 90) { nature = 'Angle obtus'; natColor = ROSE; }
      else { nature = 'Angle droit'; natColor = VIOLET; }

      var reading, choix = '';
      if (m === 90) {
        reading = 'Le second côté tombe pile sur <strong>90°</strong>.';
      } else if (showTwo) {
        // Deux graduations : on suit celle dont le 0 est du côté de la base.
        var scaleWord = side === 'right' ? 'bleue' : 'rose';
        var scaleColor = side === 'right' ? BLUE : ROSE;
        var good = side === 'right' ? blueReading : otherReading;      // = m
        reading = 'Le côté croise le bord entre ' +
          '<span style="color:' + BLUE + ';font-weight:700">' + blueReading + '°</span> (bleu) et ' +
          '<span style="color:' + ROSE + ';font-weight:700">' + otherReading + '°</span> (rose).<br>' +
          'Le <strong>0 est posé ' + baseWord + '</strong>, du côté ' +
          '<span style="color:' + scaleColor + ';font-weight:700">' + scaleWord + '</span> : ' +
          'on suit cette graduation → <strong>' + good + '°</strong>.';
      } else if (side === 'right') {
        // Une seule graduation (la bleue) et 0 du côté de la base : lecture directe.
        reading = 'Le <strong>0 (bleu) est posé sur le côté</strong> de base : on lit ' +
          '<strong>directement</strong> <strong>' + blueReading + '°</strong>.';
      } else {
        // Une seule graduation (la bleue) mais base à gauche : lecture « à l'envers ».
        reading = 'Le côté croise sur <span style="color:' + BLUE + ';font-weight:700">' +
          blueReading + '°</span>, mais la <strong>base est à gauche</strong> : le 0 bleu est à ' +
          'l\'opposé. On lit « à l\'envers » : 180 − ' + blueReading + ' = <strong>' +
          otherReading + '°</strong>.';
      }

      if (m !== 90) {
        if (m < 90) {
          choix = 'L\'angle est <strong>aigu</strong> (plus fermé qu\'un angle droit) → la mesure ' +
            'est le <strong>plus petit</strong> des deux nombres : <strong>' + lo + '°</strong>.';
        } else {
          choix = 'L\'angle est <strong>obtus</strong> (plus ouvert qu\'un angle droit) → la mesure ' +
            'est le <strong>plus grand</strong> des deux nombres : <strong>' + hi + '°</strong>.';
        }
      }

      panel.innerHTML =
        '<div class="props-name" style="color:' + natColor + '">' + nature +
          ' <span style="color:var(--ink-soft);font-weight:600;font-size:.9rem">(' +
          (m < 90 ? 'moins de 90°' : m > 90 ? 'plus de 90°' : '= 90°') + ')</span></div>' +
        '<div class="props-label">Ce que je lis sur le rapporteur</div>' +
        '<p style="margin:.2rem 0">' + reading + '</p>' +
        (choix
          ? '<div class="props-label">Vérifier avec la nature de l\'angle</div>' +
            '<p style="margin:.2rem 0">' + choix + '</p>'
          : '') +
        '<p style="margin:.6rem 0 0;font-size:1.05rem">Mesure de l\'angle : ' +
          '<strong style="color:' + natColor + '">' + m + '°</strong></p>';
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    refs = mv.addControls([
      { type: 'checkbox', id: 'two', label: 'Deux graduations', checked: true,
        onChange: function (c) { showTwo = c; refresh(); } },
      { type: 'slider', id: 'ang', label: 'Angle', min: 5, max: 175, step: 1, value: aDeg,
        onInput: function (v) { aDeg = v; refresh(); } },
      { type: 'button', id: 'base', label: 'Base : à droite ▶',
        onClick: function () { side = (side === 'right' ? 'left' : 'right'); refresh(); } },
      { type: 'button', id: 'ex1', label: 'Aigu (40°)', onClick: function () { aDeg = 40; refresh(); } },
      { type: 'button', id: 'ex2', label: 'Droit (90°)', onClick: function () { aDeg = 90; refresh(); } },
      { type: 'button', id: 'ex3', label: 'Obtus (130°)', onClick: function () { aDeg = 130; refresh(); } },
      { type: 'button', id: 'rand', label: '🎲 Au hasard', onClick: function () {
          side = Math.random() < 0.5 ? 'left' : 'right';
          aDeg = 15 + Math.floor(Math.random() * 151);   // 15 … 165
          refresh();
        } }
    ]);

    refresh();
  }
});
