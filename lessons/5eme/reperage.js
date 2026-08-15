/*
 * Lire et placer un point dans un repère orthogonal (5ème).
 *
 * ---------------------------------------------------------------------------
 * Un seul geste, dans les deux sens
 * ---------------------------------------------------------------------------
 * Lire les coordonnées d'un point et placer un point dont on donne les
 * coordonnées ne sont pas deux leçons : c'est le MÊME chemin, parcouru dans un
 * sens ou dans l'autre. On part de l'origine, on avance horizontalement, puis
 * on monte ou on descend. Lire, c'est compter les bonds qu'on a faits ; placer,
 * c'est faire les bonds qu'on nous annonce.
 *
 * L'animation les montre donc comme des BONDS d'un carreau, numérotés au fur et
 * à mesure : vers la droite ou vers la gauche le long de l'axe horizontal, puis
 * vers le haut ou vers le bas. Le bouton fait passer d'un sens de lecture à
 * l'autre sans changer la figure — c'est le même trajet qui se rejoue.
 *
 * ---------------------------------------------------------------------------
 * Ce que les bonds font comprendre sans qu'on le dise
 * ---------------------------------------------------------------------------
 *   L'ORDRE. On avance AVANT de monter, toujours. C'est pour cela que
 *   l'abscisse s'écrit en premier : A(3 ; −2) n'est pas A(−2 ; 3), et la case
 *   « Et si on inversait ? » pose le second point à côté du premier pour qu'on
 *   voie l'écart.
 *
 *   LES SIGNES. Un bond vers la droite compte +1, vers la gauche −1 ; vers le
 *   haut +1, vers le bas −1. Le signe n'est pas une décoration : c'est la
 *   direction du bond.
 *
 *   LE ZÉRO. Un point posé sur un axe ne demande aucun bond dans une des deux
 *   directions — sa coordonnée est nulle. L'origine n'en demande aucun.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est calculé
 * ---------------------------------------------------------------------------
 * Le point est accroché aux nœuds du quadrillage : ses coordonnées sont donc
 * des entiers, et le nombre de bonds est exactement leur valeur absolue. Tout
 * le reste — le sens de chaque bond, le texte du bandeau, les pointillés vers
 * les axes — se déduit de la position du point, jamais l'inverse.
 */
MathsView.register({
  id: 'reperage',
  title: 'Lire et placer un point dans un repère',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Repérage',
  theme: 'Repérage — coordonnées d\'un point dans un repère orthogonal',
  exercices: ['reperage'],
  description:
    'Dans un repère, un point est repéré par <strong>deux nombres</strong> : son ' +
    '<strong>abscisse</strong>, qui dit de combien on avance horizontalement, et son ' +
    '<strong>ordonnée</strong>, qui dit de combien on monte ou on descend. On les écrit ' +
    'toujours dans cet ordre : \\(A(3\\,;\\,-2)\\).' +
    '<br>L\'animation part de l\'<strong>origine</strong> et fait des <strong>bonds d\'un ' +
    'carreau</strong> : d\'abord vers la droite ou la gauche, puis vers le haut ou le bas. ' +
    '<strong>Lire</strong> des coordonnées, c\'est compter ces bonds ; <strong>placer</strong> ' +
    'un point, c\'est les faire. Le bouton passe d\'un sens à l\'autre — c\'est le même ' +
    'trajet.' +
    '<br><strong>Déplace le point</strong> : il s\'accroche aux nœuds du quadrillage, et le ' +
    'trajet se refait.',
  notes:
    '<ul>' +
    '<li><strong>Le repère.</strong> Deux axes gradués perpendiculaires, qui se coupent en ' +
    '\\(O\\), l\'<strong>origine</strong>. L\'axe horizontal porte les <em>abscisses</em>, ' +
    'l\'axe vertical les <em>ordonnées</em>.</li>' +
    '<li><strong>L\'ordre ne se discute pas.</strong> On écrit l\'abscisse en premier : ' +
    '\\(A(3\\,;\\,-2)\\) se lit « abscisse 3, ordonnée −2 ». Le point \\((-2\\,;\\,3)\\) est ' +
    'un <em>autre</em> point — coche « Et si on inversait ? » pour voir où il tombe.</li>' +
    '<li><strong>Les signes sont des directions.</strong> Abscisse positive : à droite de ' +
    'l\'axe vertical. Négative : à gauche. Ordonnée positive : au-dessus de l\'axe ' +
    'horizontal. Négative : en dessous.</li>' +
    '<li><strong>Sur un axe, une coordonnée est nulle.</strong> Un point de l\'axe horizontal ' +
    'a pour ordonnée 0 ; un point de l\'axe vertical a pour abscisse 0. L\'origine est ' +
    '\\(O(0\\,;\\,0)\\).</li>' +
    '<li><strong>Pour lire, on redescend sur les axes.</strong> Du point, on trace deux ' +
    'pointillés perpendiculaires aux axes : là où ils tombent, on lit les deux nombres. ' +
    'C\'est l\'opération inverse des bonds.</li>' +
    '<li><strong>Orthogonal.</strong> Les deux axes sont perpendiculaires — c\'est ce que ' +
    'veut dire le mot. Quand en plus les unités sont les mêmes sur les deux axes, on dit ' +
    'que le repère est <em>orthonormé</em>, et les carreaux sont alors des carrés.</li>' +
    '</ul>',
  board: { boundingbox: [-7.5, 6.5, 7.5, -6.5], axis: true, grid: true,
           keepaspectratio: true },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var PT = '#dc2626';        // le point
    var HORIZ = '#2563eb';     // les bonds horizontaux, et l'abscisse
    var VERT = '#059669';      // les bonds verticaux, et l'ordonnée
    var GUIDE = '#94a3b8';     // les pointillés vers les axes
    var INVER = '#a855f7';     // le point aux coordonnées inversées

    var anim = mv.createAnimator();

    function show(o, v) {
      v = !!v;
      if (o.__vu === v) return;
      o.__vu = v;
      o.setAttribute({ visible: v });
    }

    /* ==================================================================== */
    /* Le point, accroché aux nœuds du quadrillage                          */
    /* ==================================================================== */
    var P = board.create('point', [3, -2], {
      name: 'A', size: 5, color: PT, snapToGrid: true, snapSizeX: 1, snapSizeY: 1,
      showInfobox: false,
      label: { offset: [12, 12], fontSize: 18, strokeColor: PT, cssStyle: 'font-weight:800' }
    });
    function x() { return Math.round(P.X()); }
    function y() { return Math.round(P.Y()); }

    var mode = 'lire';                       // 'lire' ou 'placer'
    var voirInverse = false;

    /* ==================================================================== */
    /* Les bonds                                                            */
    /* ==================================================================== */
    /* Un bond est une petite arche d'un carreau, qui se dessine de son départ
       vers son arrivée. `av` dit combien de bonds sont faits : le bond n° i est
       entier si av ≥ i+1, en cours si i < av < i+1, absent sinon. C'est ce
       découpage qui donne l'impression de sauter d'un carreau à l'autre. */
    var MAX = 8;
    var avX = { v: 0 }, avY = { v: 0 };

    /* Le ventre de l'arche se prend PERPENDICULAIREMENT au déplacement, et du
       côté qu'on lui indique : vers le haut pour les bonds horizontaux, vers la
       droite pour les bonds verticaux. Sans ce choix explicite, un bond vers la
       gauche se bomberait vers le bas et un bond vertical ne se bomberait pas du
       tout — les deux directions n'auraient pas l'air de faire le même geste. */
    function arche(depart, arrivee, hauteur, prog, couleur, ventre) {
      function point(t, i) {
        var a = depart(), b = arrivee(), v = ventre();
        return a[i] + (b[i] - a[i]) * t + v[i] * hauteur() * Math.sin(Math.PI * t);
      }
      return board.create('curve', [
        function (t) { return point(t, 0); },
        function (t) { return point(t, 1); },
        0, prog
      ], { numberPointsHigh: 26, numberPointsLow: 26, strokeColor: couleur,
           strokeWidth: 2.6, highlight: false, visible: false });
    }

    // Les bonds horizontaux : de (i·s ; 0) à ((i+1)·s ; 0), s le sens.
    var bondsX = [], numX = [];
    for (var i = 0; i < MAX; i++) {
      (function (i) {
        function s() { return x() >= 0 ? 1 : -1; }
        function de() { return [i * s(), 0]; }
        function a() { return [(i + 1) * s(), 0]; }
        bondsX.push(arche(de, a, function () { return 0.55; },
          function () { return Math.max(0, Math.min(1, avX.v - i)); }, HORIZ,
          function () { return [0, 1]; }));          // le ventre vers le haut
        numX.push(board.create('text', [
          function () { return (i + 0.5) * s(); },
          function () { return 0.78; },
          function () { return String(i + 1); }
        ], { fontSize: 13, color: HORIZ, cssStyle: 'font-weight:800', fixed: true,
             anchorX: 'middle', highlight: false, visible: false }));
      })(i);
    }
    // Les bonds verticaux : de (x ; i·s) à (x ; (i+1)·s), collés à la verticale.
    var bondsY = [], numY = [];
    for (i = 0; i < MAX; i++) {
      (function (i) {
        function s() { return y() >= 0 ? 1 : -1; }
        function de() { return [x(), i * s()]; }
        function a() { return [x(), (i + 1) * s()]; }
        // moins bombées que les horizontales : elles se suivent dans une même
        // colonne, et un ventre trop marqué les ferait lire comme un ressort
        bondsY.push(arche(de, a, function () { return 0.38; },
          function () { return Math.max(0, Math.min(1, avY.v - i)); }, VERT,
          function () { return [1, 0]; }));          // le ventre vers la droite
        numY.push(board.create('text', [
          // au-delà du ventre de l'arche, et assez loin pour que le premier
          // numéro ne se loge pas sous le dernier bond horizontal
          function () { return x() + 0.95; },
          function () { return (i + 0.5) * s(); },
          function () { return String(i + 1); }
        ], { fontSize: 13, color: VERT, cssStyle: 'font-weight:800', fixed: true,
             anchorX: 'middle', highlight: false, visible: false }));
      })(i);
    }
    /* Les bonds verticaux sont des traits droits — une arche y serait illisible.
       On pose donc une pointe de flèche à l'endroit atteint, pour qu'on voie le
       sens du déplacement. Trois points : la barbe gauche, la pointe, la barbe
       droite. */
    function pointeY(k) {
      var s = y() >= 0 ? 1 : -1;
      var h = Math.min(Math.abs(y()), avY.v);
      var pointe = [x(), h * s];
      if (k === 1) return pointe;
      return [x() + (k === 0 ? -0.24 : 0.24), pointe[1] - 0.32 * s];
    }
    var fleche = board.create('curve', [
      function (t) { return pointeY(Math.round(t))[0]; },
      function (t) { return pointeY(Math.round(t))[1]; },
      0, 2
    ], { numberPointsHigh: 3, numberPointsLow: 3, strokeColor: VERT, strokeWidth: 2.6,
         highlight: false, visible: false });

    /* ==================================================================== */
    /* Les pointillés vers les axes, et les valeurs lues                    */
    /* ==================================================================== */
    var pGuide = { v: 0 };
    function guide(de, a) {
      return board.create('curve', [
        function (t) { var u = de(), v = a(); return u[0] + (v[0] - u[0]) * t * pGuide.v; },
        function (t) { var u = de(), v = a(); return u[1] + (v[1] - u[1]) * t * pGuide.v; },
        0, 1
      ], { numberPointsHigh: 2, numberPointsLow: 2, strokeColor: GUIDE, strokeWidth: 1.8,
           dash: 2, highlight: false, visible: false });
    }
    var guideX = guide(function () { return [x(), y()]; }, function () { return [x(), 0]; });
    var guideY = guide(function () { return [x(), y()]; }, function () { return [0, y()]; });

    var marqueX = board.create('text', [
      function () { return x(); }, function () { return -0.55; },
      function () { return String(x()).replace('-', '−'); }
    ], { fontSize: 16, color: HORIZ, cssStyle: 'font-weight:800', fixed: true,
         anchorX: 'middle', highlight: false, visible: false });
    var marqueY = board.create('text', [
      function () { return -0.45; }, function () { return y(); },
      function () { return String(y()).replace('-', '−'); }
    ], { fontSize: 16, color: VERT, cssStyle: 'font-weight:800', fixed: true,
         anchorX: 'right', highlight: false, visible: false });

    var etiquette = board.create('text', [
      // au-dessus du nom du point, pas dessus
      function () { return x() + 0.35; }, function () { return y() + 1.15; },
      function () {
        return 'A(' + String(x()).replace('-', '−') + ' ; ' +
               String(y()).replace('-', '−') + ')';
      }
    ], { fontSize: 17, color: PT, cssStyle: 'font-weight:800', fixed: true,
         highlight: false, visible: false });

    // Le point aux coordonnées inversées, pour montrer que l'ordre compte.
    var ptInv = board.create('point', [function () { return y(); },
                                       function () { return x(); }], {
      name: 'B', size: 4.5, color: INVER, fixed: true, showInfobox: false, visible: false,
      label: { offset: [12, 10], fontSize: 16, strokeColor: INVER,
               cssStyle: 'font-weight:800' }
    });
    var noteInv = board.create('text', [-7.2, -5.9, function () {
      if (!voirInverse) return '';
      if (x() === y()) return 'Ici l\'abscisse et l\'ordonnée sont égales : inverser ne change ' +
        'rien. C\'est le seul cas.';
      return 'En violet, le point B(' + String(y()).replace('-', '−') + ' ; ' +
             String(x()).replace('-', '−') + ') — les mêmes nombres, dans l\'autre ordre. ' +
             'Ce n\'est pas le même point : l\'ordre fait tout.';
    }], { fontSize: 14, color: INVER, strokeColor: INVER, cssStyle: 'font-weight:600',
          fixed: true, highlight: false, visible: false });

    /* ==================================================================== */
    /* Le bandeau                                                           */
    /* ==================================================================== */
    var panneau = document.createElement('div');
    panneau.className = 'rep-panneau';
    var dernier = '';

    function motX() { return x() > 0 ? 'vers la droite' : x() < 0 ? 'vers la gauche' : ''; }
    function motY() { return y() > 0 ? 'vers le haut' : y() < 0 ? 'vers le bas' : ''; }
    function nb(v) { return String(v).replace('-', '−'); }

    function rendrePanneau() {
      var h = '<div class="rep-titre">' +
        (mode === 'lire' ? 'Lire les coordonnées du point A'
                         : 'Placer le point A(' + nb(x()) + ' ; ' + nb(y()) + ')') + '</div>';

      var fait = avX.v >= Math.abs(x()) && avY.v >= Math.abs(y());
      h += '<ol class="rep-etapes">';
      h += '<li' + (avX.v > 0 || fait ? ' class="faite"' : '') + '>On part de l\'<b>origine</b> ' +
           'O(0 ; 0).</li>';
      h += '<li' + (avX.v >= Math.abs(x()) ? ' class="faite"' : '') + '>On avance ' +
           'horizontalement : <b style="color:' + HORIZ + '">' + Math.abs(x()) + ' bond' +
           (Math.abs(x()) > 1 ? 's' : '') + ' ' + (motX() || 'aucun bond') + '</b>' +
           (x() === 0 ? ' — le point est sur l\'axe vertical' : '') + '.</li>';
      h += '<li' + (fait ? ' class="faite"' : '') + '>Puis verticalement : ' +
           '<b style="color:' + VERT + '">' + Math.abs(y()) + ' bond' +
           (Math.abs(y()) > 1 ? 's' : '') + ' ' + (motY() || 'aucun bond') + '</b>' +
           (y() === 0 ? ' — le point est sur l\'axe horizontal' : '') + '.</li>';
      h += '</ol>';

      if (fait && pGuide.v > 0.9) {
        h += '<p class="rep-bilan">L\'<b style="color:' + HORIZ + '">abscisse</b> vaut <b>' +
          nb(x()) + '</b> et l\'<b style="color:' + VERT + '">ordonnée</b> vaut <b>' + nb(y()) +
          '</b>. On écrit <b>A(' + nb(x()) + ' ; ' + nb(y()) + ')</b> — l\'abscisse ' +
          '<b>toujours en premier</b>.</p>';
        h += '<p class="rep-sous">' + (mode === 'lire'
          ? 'Pour lire, on redescend du point vers les axes en suivant les pointillés : c\'est ' +
            'le chemin des bonds, parcouru à l\'envers.'
          : 'Pour placer, on a fait les bonds annoncés par les deux nombres. Lire et placer, ' +
            'c\'est le même trajet dans les deux sens.') + '</p>';
      }
      if (h !== dernier) { dernier = h; panneau.innerHTML = h; }
    }

    /* ==================================================================== */
    /* Rafraîchissement                                                     */
    /* ==================================================================== */
    function rafraichir() {
      var nx = Math.abs(x()), ny = Math.abs(y());
      bondsX.forEach(function (b, i) { show(b, i < nx && avX.v > i); });
      numX.forEach(function (t, i) { show(t, i < nx && avX.v >= i + 1); });
      bondsY.forEach(function (b, i) { show(b, i < ny && avY.v > i); });
      numY.forEach(function (t, i) { show(t, i < ny && avY.v >= i + 1); });
      show(fleche, ny > 0 && avY.v > 0.15);

      show(guideX, pGuide.v > 0.02);
      show(guideY, pGuide.v > 0.02);
      show(marqueX, pGuide.v > 0.5);
      show(marqueY, pGuide.v > 0.5);
      show(etiquette, pGuide.v > 0.7);

      // en mode « placer », le point n'apparaît qu'à l'arrivée du trajet
      show(P, mode === 'lire' || (avX.v >= nx && avY.v >= ny));
      show(ptInv, voirInverse && pGuide.v > 0.7);
      show(noteInv, voirInverse && pGuide.v > 0.7);

      rendrePanneau();
    }
    /* Déplacer le point change le nombre de bonds — or les étapes de l'animation
       ont figé l'ancien. Se contenter de rafraîchir laisserait un trajet
       incomplet, arrêté au compte précédent : on montre donc directement le
       trajet entier de la nouvelle position, et le bouton ▶ le rejouera. */
    P.on('drag', function () { tout(); });

    /* ==================================================================== */
    /* Animation                                                            */
    /* ==================================================================== */
    function effacer() {
      anim.cancel();
      avX.v = 0; avY.v = 0; pGuide.v = 0;
      board.update();
      rafraichir();
    }
    function tout() {
      anim.cancel();
      avX.v = MAX; avY.v = MAX; pGuide.v = 1;
      board.update();
      rafraichir();
    }
    function jouer() {
      effacer();
      var nx = Math.abs(x()), ny = Math.abs(y());
      anim.runSteps([
        { dur: Math.max(300, 320 * nx),
          step: function (q) { avX.v = nx * q; rafraichir(); } },
        { dur: Math.max(300, 320 * ny),
          step: function (q) { avX.v = nx; avY.v = ny * q; rafraichir(); } },
        { dur: 700,
          step: function (q) { avX.v = nx; avY.v = ny; pGuide.v = q; rafraichir(); } }
      ], effacer);
    }

    /* ==================================================================== */
    /* Les commandes                                                        */
    /* ==================================================================== */
    var minuteur = null;
    mv.onCleanup(function () { clearTimeout(minuteur); });

    var refs = mv.addControls([
      { type: 'button', id: 'play', label: '▶ Refaire le trajet', onClick: jouer },
      { type: 'button', id: 'mode', label: '↔ Lire / Placer', onClick: function () {
          mode = mode === 'lire' ? 'placer' : 'lire';
          jouer();
        } },
      { type: 'button', id: 'autre', label: '🎲 Un autre point', onClick: function () {
          var nx, ny;
          do {
            nx = Math.floor(Math.random() * 13) - 6;
            ny = Math.floor(Math.random() * 11) - 5;
          } while (nx === x() && ny === y());
          effacer();
          P.moveTo([nx, ny], 320);
          clearTimeout(minuteur);
          minuteur = setTimeout(jouer, 400);
        } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer },
      { type: 'checkbox', id: 'inv', label: 'Et si on inversait ?', checked: false,
        onChange: function (v) { voirInverse = v; rafraichir(); } }
    ]);

    mv.extras.appendChild(panneau);
    board.on('update', rafraichir);
    jouer();
  }
});
