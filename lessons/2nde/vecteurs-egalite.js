/*
 * Découvrir les vecteurs (2nde) — direction, sens, longueur, et égalité.
 *
 * Un vecteur est défini par TROIS caractéristiques :
 *   - sa DIRECTION : l'inclinaison de la droite qui le porte ;
 *   - son SENS     : indiqué par la pointe de la flèche ;
 *   - sa LONGUEUR  : la distance entre l'origine et l'extrémité (sa norme).
 *
 * Deux vecteurs sont ÉGAUX s'ils ont la même direction, le même sens ET la même
 * longueur — autrement dit les mêmes coordonnées. La position dans le plan n'a
 * aucune importance : un même vecteur peut être dessiné n'importe où.
 *
 * ANIMATION D'OUVERTURE — chaque caractéristique est montrée par le MOUVEMENT
 * qui la définit, les deux autres étant figées :
 *   1. la DIRECTION : une droite pointillée oscille et balaie toutes les
 *      inclinaisons, puis s'arrête sur l'une d'elles ;
 *   2. le SENS : la direction arrêtée, une flèche parcourt la droite dans un
 *      sens, puis dans l'autre, plusieurs fois, avant de s'arrêter ;
 *   3. la LONGUEUR : direction et sens arrêtés, la pointe avance et recule le
 *      long de la droite jusqu'à se fixer.
 * La dernière étape rend la main à la figure de la leçon (ci-dessous).
 *
 * Figure :
 *   - AB (bleu)  : le vecteur étudié u = AB. On déplace A et B pour le changer.
 *   - CD (vert)  : D = C + u, donc CD = AB PAR CONSTRUCTION (déplace C : la
 *                  copie égale se pose ailleurs, toujours identique).
 *   - EF (orange): E et F libres, réglés au départ DIFFÉRENTS de u.
 *   - un VECTEUR MOBILE violet (poignée + boutons) : posé sur C il recouvre
 *     exactement CD (égaux) ; posé sur E, sa pointe tombe en E+u, PAS sur F,
 *     ce qui montre en direct que EF n'est pas le même vecteur.
 */
MathsView.register({
  id: 'vecteurs-egalite',
  title: 'Vecteurs : direction, sens, longueur',
  level: '2nde',
  category: 'geometrie',
  subcategory: 'Vecteurs',
  theme: 'Vecteurs — définition et égalité de deux vecteurs',
  description:
    'Un <strong>vecteur</strong> est déterminé par trois choses : sa ' +
    '<strong>direction</strong> (l\'inclinaison de la droite), son ' +
    '<strong>sens</strong> (la pointe de la flèche) et sa <strong>longueur</strong>. ' +
    'Deux vecteurs sont <strong>égaux</strong> s\'ils partagent ces trois caractéristiques — ' +
    'peu importe l\'endroit où on les dessine.' +
    '<br>Commence par <strong>▶ Les trois caractéristiques</strong> : la droite pointillée ' +
    '<strong>s\'incline</strong> (la direction), puis la flèche <strong>parcourt</strong> cette ' +
    'droite dans un sens puis dans l\'autre (le sens), puis sa pointe ' +
    '<strong>avance et recule</strong> (la longueur). À chaque étape, les caractéristiques ' +
    'déjà choisies ne bougent plus.' +
    '<br>Ici <strong>D = C + \\(\\vec{AB}\\)</strong>, donc \\(\\vec{CD}=\\vec{AB}\\) toujours. ' +
    'Attrape le <strong>vecteur violet</strong> (ou les boutons) et pose-le sur <strong>C</strong> ' +
    'puis sur <strong>E</strong> : sur C il se superpose à \\(\\vec{CD}\\) ; sur E, sa pointe ne ' +
    'tombe pas sur F, donc \\(\\vec{EF}\\neq\\vec{AB}\\).' +
    '<br><em>Déplace A, B (le vecteur), C (la copie égale), E et F (l\'autre vecteur).</em>',
  notes:
    '<ul>' +
    '<li>Le vecteur \\(\\vec{AB}\\) a pour <strong>coordonnées</strong> ' +
    '\\((x_B-x_A\\,;\\,y_B-y_A)\\).</li>' +
    '<li>\\(\\vec{AB}=\\vec{CD}\\) <strong>si et seulement si</strong> ils ont les mêmes ' +
    'coordonnées, ce qui revient à dire que <strong>ABDC est un parallélogramme</strong>.</li>' +
    '<li>Passer de \\(\\vec{AB}\\) à \\(\\vec{CD}\\), c\'est faire <strong>glisser</strong> la ' +
    'flèche (une translation) sans la tourner ni l\'étirer : c\'est le même vecteur.</li>' +
    '<li><strong>Direction et sens ne sont pas la même chose.</strong> La direction, c\'est ' +
    'l\'inclinaison de la droite : toutes les droites <strong>parallèles</strong> entre elles ' +
    'donnent la même direction. Sur une direction donnée, il reste ' +
    '<strong>deux sens opposés</strong>, et c\'est la pointe de la flèche qui choisit.</li>' +
    '<li>Si une seule des trois caractéristiques change (direction, sens ou longueur), ' +
    'ce n\'est <strong>plus le même vecteur</strong>.</li>' +
    '</ul>',
  board: { boundingbox: [-7.5, 5.6, 7.5, -6.4], keepaspectratio: true, axis: true,
           grid: true },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_AB = '#2563eb';   // vecteur étudié u = AB (bleu)
    var C_CD = '#0d9488';   // copie égale CD (vert)
    var C_EF = '#ea580c';   // autre vecteur EF (orange)
    var C_MOB = '#7c3aed';  // vecteur mobile (violet)
    var INK = '#334155';
    var GREY = '#94a3b8';

    function fmt(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
    function near(P, Q) { return Math.hypot(P.X() - Q.X(), P.Y() - Q.Y()) < 0.08; }

    // Ne pose l'attribut « visible » que s'il change : la figure est rafraîchie
    // à chaque frame de l'animation.
    function show(o, v) {
      v = !!v;
      if (o._mvVis !== v) { o._mvVis = v; o.setAttribute({ visible: v }); }
    }

    /* ==================================================================== */
    /* Le vecteur u = AB (A et B déplaçables)                                */
    /* ==================================================================== */
    var A = board.create('point', [-6, -3], { name: 'A', size: 4, color: C_AB, label: { offset: [-14, -4] } });
    var B = board.create('point', [-3, -2], { name: 'B', size: 4, color: C_AB, label: { offset: [8, 6] } });
    function ux() { return B.X() - A.X(); }
    function uy() { return B.Y() - A.Y(); }
    var arrAB = board.create('arrow', [A, B], { strokeColor: C_AB, strokeWidth: 3.5, lastArrow: { type: 2, size: 7 } });

    /* ==================================================================== */
    /* La copie égale CD : D = C + u  ⇒  vecteur CD = vecteur AB              */
    /* ==================================================================== */
    var C = board.create('point', [-1, 1], { name: 'C', size: 4, color: C_CD, label: { offset: [-14, -4] } });
    var D = board.create('point', [function () { return C.X() + ux(); }, function () { return C.Y() + uy(); }],
      { name: 'D', size: 4, color: C_CD, fixed: true, label: { offset: [8, 6] } });
    var arrCD = board.create('arrow', [C, D], { strokeColor: C_CD, strokeWidth: 3.5, lastArrow: { type: 2, size: 7 } });

    /* ==================================================================== */
    /* L'autre vecteur EF (E et F libres, différent de u au départ)          */
    /* ==================================================================== */
    var E = board.create('point', [2, -4], { name: 'E', size: 4, color: C_EF, label: { offset: [-14, -4] } });
    var F = board.create('point', [4, -2], { name: 'F', size: 4, color: C_EF, label: { offset: [8, 6] } });
    var arrEF = board.create('arrow', [E, F], { strokeColor: C_EF, strokeWidth: 3.5, lastArrow: { type: 2, size: 7 } });

    /* ==================================================================== */
    /* Le vecteur mobile violet : même u, posé où on veut                    */
    /* ==================================================================== */
    var M = board.create('point', [-2, 3], {
      name: '', size: 6, color: C_MOB, strokeColor: '#4c1d95', strokeWidth: 1,
      face: 'o', layer: 9
    });
    var Mh = board.create('point', [function () { return M.X() + ux(); }, function () { return M.Y() + uy(); }],
      { name: '', size: 2, color: C_MOB, fixed: true, withLabel: false, layer: 9 });
    var arrMob = board.create('arrow', [M, Mh], { strokeColor: C_MOB, strokeWidth: 4.5, lastArrow: { type: 2, size: 8 }, layer: 8 });

    // Trait en pointillés reliant la pointe du vecteur mobile au point F :
    // visible seulement quand le vecteur est posé en E et diffère de EF.
    var gap = board.create('segment', [Mh, F],
      { strokeColor: GREY, strokeWidth: 1.5, dash: 2, visible: false, fixed: true, highlight: false });

    /* ==================================================================== */
    /* Longueurs (étiquettes au milieu de chaque flèche)                     */
    /* ==================================================================== */
    function lenLabel(P, Q, color) {
      return board.create('text', [
        function () { return (P.X() + Q.X()) / 2 - 0.15 * (Q.Y() - P.Y()) / (Math.hypot(Q.X() - P.X(), Q.Y() - P.Y()) || 1); },
        function () { return (P.Y() + Q.Y()) / 2 + 0.15 * (Q.X() - P.X()) / (Math.hypot(Q.X() - P.X(), Q.Y() - P.Y()) || 1); },
        function () { return fmt(Math.hypot(Q.X() - P.X(), Q.Y() - P.Y())); }
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: color, cssStyle: 'font-weight:700',
           fixed: true, highlight: false });
    }
    var labAB = lenLabel(A, B, C_AB);
    var labEF = lenLabel(E, F, C_EF);

    // Tout ce qui constitue la figure de la leçon : l'animation d'ouverture la
    // masque le temps de montrer les trois caractéristiques, une par une.
    var FIG = [A, B, C, D, E, F, M, Mh, arrAB, arrCD, arrEF, arrMob, labAB, labEF];

    /* ==================================================================== */
    /* ANIMATION D'OUVERTURE : direction, sens, longueur                     */
    /*                                                                       */
    /* Une caractéristique se comprend en la faisant VARIER pendant que les   */
    /* autres restent figées. Les trois étapes suivent donc toujours le même  */
    /* schéma : une seule chose bouge, et elle finit par s'arrêter.           */
    /*                                                                       */
    /*   ① la droite pointillée oscille   → la DIRECTION change ;            */
    /*   ② la flèche parcourt la droite dans un sens puis dans l'autre       */
    /*      → le SENS change (la direction, elle, ne bouge plus) ;           */
    /*   ③ la pointe avance et recule → la LONGUEUR change (direction et     */
    /*      sens sont arrêtés).                                              */
    /*                                                                       */
    /* Tout se joue autour de l'origine du repère : la démonstration occupe   */
    /* seule le tableau, la figure de la leçon revient à la dernière étape.   */
    /* ==================================================================== */
    var C_DIR = '#7c3aed';    // la droite qui porte le vecteur (direction)
    var C_LEN = '#ea580c';    // la mesure de la longueur

    var TH_FIN  = 28 * Math.PI / 180;   // la direction sur laquelle on s'arrête
    var TH_AMP  = 78 * Math.PI / 180;   // amplitude du balayage
    var LEN_FIN = 3.6;                  // longueur sur laquelle on s'arrête
    var LEN_AMP = 2.2;                  // de combien la longueur oscille
    var TRAJET  = 2.5;                  // course de la flèche le long de la droite

    // L'état de la démonstration. `phase` vaut 0 quand c'est la figure de la
    // leçon qui est affichée, 1/2/3 pendant les trois étapes, 4 pour le bilan.
    var dPhase = 0;
    var dTh   = TH_FIN;     // inclinaison de la droite
    var dTail = 0;          // position de l'origine de la flèche sur la droite
    var dSens = 1;          // +1 ou −1 : de quel côté pointe la flèche
    var dLen  = LEN_FIN;    // longueur de la flèche

    function dcos() { return Math.cos(dTh); }
    function dsin() { return Math.sin(dTh); }
    function demoOn() { return dPhase > 0; }
    function degres() { return Math.round(((dTh * 180 / Math.PI) % 180 + 180) % 180); }

    function hid(fx, fy, extra) {
      return board.create('point', [fx, fy], Object.assign({
        visible: false, fixed: true, name: '', withLabel: false, highlight: false
      }, extra || {}));
    }

    // La droite qui porte le vecteur : c'est ELLE qui montre la direction, et
    // elle traverse tout le tableau — deux droites parallèles, même direction.
    var dLine = board.create('line', [
      hid(function () { return -dcos(); }, function () { return -dsin(); }),
      hid(function () { return dcos(); }, function () { return dsin(); })
    ], { strokeColor: C_DIR, strokeWidth: 2.5, dash: 3,
         straightFirst: true, straightLast: true,
         fixed: true, highlight: false, visible: false, layer: 3 });

    // La flèche : son origine glisse le long de la droite (étape « sens »), sa
    // pointe est toujours DEVANT elle, du côté indiqué par dSens.
    var dT = hid(function () { return dTail * dcos(); },
                 function () { return dTail * dsin(); },
                 { size: 3, color: C_AB, layer: 9 });
    var dH = hid(function () { return (dTail + dSens * dLen) * dcos(); },
                 function () { return (dTail + dSens * dLen) * dsin(); });
    var dArr = board.create('arrow', [dT, dH], {
      strokeColor: C_AB, strokeWidth: 5, lastArrow: { type: 2, size: 9 },
      fixed: true, highlight: false, visible: false, layer: 8
    });
    var dLenLab = lenLabel(dT, dH, C_LEN);
    dLenLab.setAttribute({ visible: false, fontSize: 14 });

    /* Le commentaire, en haut à gauche du tableau ------------------------- */
    var CAPS = [
      null,
      { t: '① La direction',
        s: function () { return 'l\'inclinaison de la droite qui porte le vecteur — ici ≈ ' +
                                degres() + '°'; } },
      { t: '② Le sens',
        s: function () { return 'sur cette droite, la flèche peut aller d\'un côté… ou de ' +
                                'l\'autre'; } },
      { t: '③ La longueur',
        s: function () { return 'la distance de l\'origine à la pointe — ici ' +
                                fmt(dLen); } },
      { t: 'Direction + sens + longueur',
        s: function () { return 'les trois sont fixées : le vecteur est déterminé'; } }
    ];
    var cap1 = board.create('text', [-7.2, 5.15,
      function () { return demoOn() ? CAPS[dPhase].t : ''; }
    ], { anchorX: 'left', anchorY: 'middle', fontSize: 16, color: C_DIR,
         cssStyle: 'font-weight:800', fixed: true, highlight: false,
         visible: false, layer: 12 });
    var cap2 = board.create('text', [-7.2, 4.45,
      function () { return demoOn() ? CAPS[dPhase].s() : ''; }
    ], { anchorX: 'left', anchorY: 'middle', fontSize: 13, color: INK,
         fixed: true, highlight: false, visible: false, layer: 12 });

    // Qui est visible : la démonstration, ou la figure de la leçon ?
    function refreshDemo() {
      var on = demoOn();
      FIG.forEach(function (o) { show(o, !on); });
      show(dLine, on);
      show(dT, on && dPhase >= 2);
      show(dArr, on && dPhase >= 2);
      show(dLenLab, on && dPhase >= 3);
      show(cap1, on);
      show(cap2, on);
    }

    /* Les trois mouvements ------------------------------------------------ */

    // ① La droite balaie les directions, de moins en moins largement (le
    // facteur (1 − p) amortit), et s'immobilise pile sur la direction retenue.
    function pasDirection(p) {
      dPhase = 1;
      dTh = TH_FIN + TH_AMP * Math.sin(2 * Math.PI * 2 * p) * (1 - p);
      dTail = 0; dSens = 1; dLen = LEN_FIN;
    }

    // ② La direction ne bouge plus. La flèche fait deux allers-retours (sin) et
    // sa pointe regarde toujours vers où elle avance — le signe de la vitesse,
    // c'est-à-dire le cosinus. Comme sin s'annule en changeant de signe aux
    // demi-tours, elle y est à l'arrêt : le retournement se voit bien.
    //
    // Elle pivote autour de son MILIEU : au demi-tour, elle occupe exactement le
    // même segment, seule la pointe change de bout — c'est tout le propos du
    // sens. Sur la toute fin (après le dernier demi-tour), elle glisse pour
    // poser son origine en O, prête pour l'étape suivante.
    function pasSens(p) {
      dPhase = 2;
      var a = 2 * Math.PI * 2 * p;
      dTh = TH_FIN; dLen = LEN_FIN;
      dSens = Math.cos(a) >= 0 ? 1 : -1;      // p = 1 : la flèche revient au sens choisi
      var pose = Math.max(0, (p - 0.9) / 0.1);
      pose = pose * pose * (3 - 2 * pose);    // adoucissement du glissement final
      dTail = TRAJET * Math.sin(a) - dSens * dLen * 0.5 * (1 - pose);
    }

    // ③ Direction et sens arrêtés, l'origine revient en place : seule la
    // pointe avance et recule, de moins en moins, jusqu'à la longueur retenue.
    function pasLongueur(p) {
      dPhase = 3;
      dTh = TH_FIN; dTail = 0; dSens = 1;
      dLen = LEN_FIN + LEN_AMP * Math.sin(2 * Math.PI * 2.5 * p) * (1 - p);
    }

    // ④ Un temps d'arrêt sur le vecteur complet, puis la figure de la leçon
    // reprend la main.
    function pasBilan(p) {
      dTh = TH_FIN; dTail = 0; dSens = 1; dLen = LEN_FIN;
      dPhase = p < 0.6 ? 4 : 0;
    }

    var anim = mv.createAnimator();

    function resetDemo() {
      dPhase = 0; dTh = TH_FIN; dTail = 0; dSens = 1; dLen = LEN_FIN;
      board.update();
    }
    function playDemo() {
      anim.cancel();
      resetDemo();
      anim.runSteps([
        { dur: 4600, step: pasDirection },
        { dur: 5200, step: pasSens },
        { dur: 4200, step: pasLongueur },
        { dur: 1600, step: pasBilan }
      ], resetDemo);
    }

    /* ==================================================================== */
    /* Déplacement du vecteur mobile : aimantation sur A, C ou E             */
    /* ==================================================================== */
    var raf = null;
    function stopTween() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    mv.onCleanup(stopTween);

    function snap() {
      var best = null;
      [A, C, E].forEach(function (T) {
        var dd = Math.hypot(T.X() - M.X(), T.Y() - M.Y());
        if (dd < 0.6 && (best === null || dd < best.d)) best = { x: T.X(), y: T.Y(), d: dd };
      });
      if (best) M.setPosition(JXG.COORDS_BY_USER, [best.x, best.y]);
    }

    M.on('drag', function () { stopTween(); snap(); board.update(); });

    function moveMto(tx, ty) {
      stopTween();
      var sx = M.X(), sy = M.Y(), t0 = null, dur = 650;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;  // easeInOut
        M.setPosition(JXG.COORDS_BY_USER, [sx + (tx - sx) * e, sy + (ty - sy) * e]);
        board.update();
        if (p < 1) raf = requestAnimationFrame(frame); else { raf = null; }
      }
      raf = requestAnimationFrame(frame);
    }

    /* ==================================================================== */
    /* Panneau explicatif                                                   */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';

    // Notations colorées (pas de LaTeX ici : ce panneau se redessine à chaque
    // frame d'animation ou de déplacement, on évite de relancer MathJax en continu).
    function vec(name, color) {
      return '<b style="color:' + color + '">' + name + '</b>' +
        '<span style="color:' + color + ';font-size:.7em;vertical-align:.6em">▸</span>';
    }

    /* Pendant l'animation, le panneau tient le compte des caractéristiques : ce
       qui est déjà arrêté est écrit en clair, ce qui est en train de varier est
       mis en avant, le reste attend son tour. */
    function renderDemoPanel() {
      // `e` porte l'accord : « le sens … arrêté », « la longueur … arrêtée ».
      function ligne(n, nom, couleur, e, valeur) {
        var actif = dPhase === n;
        var fait = dPhase > n;
        var val = fait || actif ? valeur
          : '<span style="color:var(--ink-soft)">— pas encore choisi' + e + '</span>';
        return '<li style="' + (actif ? 'font-weight:700' : '') + '">' +
          '<span style="color:' + couleur + ';font-weight:700">' + nom + '</span> : ' + val +
          (actif ? ' <span style="color:' + couleur + '">◀ en train de varier</span>'
                 : (fait ? ' <span style="color:' + C_CD + '">✓ arrêté' + e + '</span>' : '')) +
          '</li>';
      }

      var sensTxt = dSens * dcos() >= 0 ? 'vers la droite' : 'vers la gauche';
      var mots = [
        '',
        'La droite pointillée s\'incline : à chaque inclinaison correspond une ' +
          '<strong>direction</strong> différente. Toutes les droites parallèles à ' +
          'celle-ci donnent la même direction.',
        'La direction ne bouge plus. Sur cette droite, il ne reste que ' +
          '<strong>deux sens</strong> possibles : la flèche les parcourt l\'un après ' +
          'l\'autre, et c\'est sa <strong>pointe</strong> qui dit lequel est choisi.',
        'Direction et sens sont arrêtés : il ne manque plus que la ' +
          '<strong>longueur</strong> (on dit aussi la <em>norme</em>), c\'est-à-dire la ' +
          'distance entre l\'origine de la flèche et sa pointe.',
        'Les trois caractéristiques sont fixées : le vecteur est ' +
          '<strong>entièrement déterminé</strong>. Si une seule change, ce n\'est plus le ' +
          'même vecteur. Sa <strong>position</strong> dans le plan, en revanche, ne le ' +
          'change pas — c\'est ce que montre la figure qui revient.'
      ];

      panel.innerHTML =
        '<div class="props-name" style="color:' + C_DIR + '">Les trois caractéristiques ' +
          'd\'un vecteur</div>' +
        '<ul class="props-list">' +
          ligne(1, 'Direction', C_DIR, 'e', 'inclinaison de la droite ≈ ' + degres() + '°') +
          ligne(2, 'Sens', C_AB, '', sensTxt) +
          ligne(3, 'Longueur', C_LEN, 'e', fmt(dLen)) +
        '</ul>' +
        '<p style="margin:.45rem 0 0">' + mots[dPhase] + '</p>';
    }

    function renderPanel() {
      if (demoOn()) { show(gap, false); renderDemoPanel(); return; }

      var uxv = ux(), uyv = uy(), uLen = Math.hypot(uxv, uyv);
      var efx = F.X() - E.X(), efy = F.Y() - E.Y(), efLen = Math.hypot(efx, efy);
      var cross = uxv * efy - uyv * efx, dot = uxv * efx + uyv * efy;
      var TOL = 0.05;
      var parEF = Math.abs(cross) < TOL * (uLen * efLen) + 1e-6;
      var sameDir = parEF && dot > 0;
      var sameLen = Math.abs(uLen - efLen) < TOL * Math.max(uLen, efLen, 1);
      var equalEF = sameDir && sameLen;

      var slot = 'free';
      if (near(M, A)) slot = 'AB'; else if (near(M, C)) slot = 'CD'; else if (near(M, E)) slot = 'EF';

      show(gap, slot === 'EF' && !equalEF);

      var vAB = vec('AB', C_AB), vCD = vec('CD', C_CD), vEF = vec('EF', C_EF);

      // Message principal selon la position du vecteur mobile.
      var head;
      if (slot === 'CD') {
        head = '<span style="color:' + C_CD + '">✓ Posé sur C, le vecteur violet recouvre ' +
          'exactement ' + vCD + '.</span> Donc ' + vAB + ' = ' + vCD + ' : même direction, ' +
          'même sens, même longueur.';
      } else if (slot === 'AB') {
        head = 'Le vecteur mobile est posé sur son origine : il coïncide avec ' + vAB + '.';
      } else if (slot === 'EF') {
        if (equalEF) {
          head = '<span style="color:' + C_CD + '">Tu as réglé E et F pour que ' + vEF + ' = ' +
            vAB + ' : la pointe tombe pile sur F.</span>';
        } else {
          head = '<span style="color:' + C_EF + '">✗ Posé en E, la pointe du vecteur ne tombe ' +
            '<strong>pas</strong> sur F</span> (voir le pointillé). Donc ' + vEF + ' ≠ ' + vAB +
            ' : ce n\'est pas le même vecteur.';
        }
      } else {
        head = 'Fais glisser le <span style="color:' + C_MOB + '">vecteur violet</span> ' +
          '(ou utilise les boutons) et pose-le sur <strong>C</strong> puis sur <strong>E</strong>.';
      }

      // Comparaison détaillée AB / EF.
      function tag(ok) {
        return ok ? '<span style="color:' + C_CD + ';font-weight:700">même</span>'
                  : '<span style="color:' + C_EF + ';font-weight:700">différente</span>';
      }
      var sensTxt = parEF ? (dot > 0 ? '<span style="color:' + C_CD + ';font-weight:700">même</span>'
                                     : '<span style="color:' + C_EF + ';font-weight:700">opposé</span>')
                          : '<span style="color:var(--ink-soft)">— (directions différentes)</span>';

      panel.innerHTML =
        '<div class="props-name" style="color:' + C_AB + '">Vecteur ' + vAB +
          ' : coordonnées (' + fmt(uxv) + ' ; ' + fmt(uyv) + '), longueur ≈ ' + fmt(uLen) + '</div>' +
        '<p style="margin:.3rem 0 .6rem">' + head + '</p>' +
        '<div class="props-label">Comparaison ' + vAB + ' et ' + vEF + '</div>' +
        '<ul class="props-list">' +
          '<li>Direction : ' + tag(parEF) + '</li>' +
          '<li>Sens : ' + sensTxt + '</li>' +
          '<li>Longueur : ' + tag(sameLen) + ' (' + fmt(uLen) + ' contre ' + fmt(efLen) + ')</li>' +
        '</ul>' +
        '<p style="margin:.4rem 0 0;font-weight:700;color:' + (equalEF ? C_CD : C_EF) + '">' +
          vEF + (equalEF ? ' = ' : ' ≠ ') + vAB + '</p>';
    }

    board.on('update', function () { refreshDemo(); renderPanel(); });

    /* ==================================================================== */
    /* Boutons                                                              */
    /*                                                                      */
    /* Les trois « Poser sur… » agissent sur la figure : ils interrompent    */
    /* l'animation, qui occupe le tableau à elle seule.                      */
    /* ==================================================================== */
    function versFigure(x, y) {
      if (demoOn()) { anim.cancel(); resetDemo(); }
      moveMto(x, y);
    }

    mv.addControls([
      { type: 'button', id: 'demo', label: '▶ Les trois caractéristiques', onClick: playDemo },
      { type: 'button', id: 'toAB', label: 'Poser sur AB', onClick: function () { versFigure(A.X(), A.Y()); } },
      { type: 'button', id: 'toCD', label: 'Poser sur CD (C)', onClick: function () { versFigure(C.X(), C.Y()); } },
      { type: 'button', id: 'toEF', label: 'Poser sur EF (E)', onClick: function () { versFigure(E.X(), E.Y()); } }
    ]);

    mv.extras.appendChild(panel);

    // Les étapes sont chargées d'emblée : en pas à pas (coché par défaut), la
    // figure de la leçon reste affichée et l'animation attend le premier appui.
    playDemo();
  }
});
