/*
 * Les médianes d'un triangle (5ème) — les trois médianes et le centre de gravité.
 *
 * Construite exactement comme la leçon « Les hauteurs d'un triangle », pour que
 * les deux se lisent ensemble : même figure, même déroulé, même bandeau. Ce qui
 * change est ce qu'on va chercher sur le côté opposé — son MILIEU, et non plus
 * le pied d'une perpendiculaire.
 *
 * L'animation trace les médianes UNE PAR UNE, chacune en deux temps :
 *   1. le côté opposé s'allume et son MILIEU apparaît, avec le codage des deux
 *      demi-côtés égaux — c'est ce codage qui fait la définition ;
 *   2. la médiane descend du sommet jusqu'à ce milieu.
 * Puis les trois segments se révèlent concourants au CENTRE DE GRAVITÉ G, et
 * une dernière étape montre où il tombe : aux DEUX TIERS de chaque médiane en
 * partant du sommet.
 *
 * ---------------------------------------------------------------------------
 * Attention à ne pas confondre
 * ---------------------------------------------------------------------------
 * Le point de concours des MÉDIANES est le CENTRE DE GRAVITÉ. Le centre du
 * cercle INSCRIT, lui, est le point de concours des BISSECTRICES : ce sont deux
 * points différents. La case « Cercle inscrit » superpose les bissectrices (en
 * vert) et le cercle à la figure des médianes (en violet) ; il suffit de
 * déplacer un sommet pour voir G et I s'éloigner l'un de l'autre.
 * Même mise en garde que dans la leçon des hauteurs, où l'on distinguait
 * l'orthocentre du centre du cercle circonscrit. Le triangle ÉQUILATÉRAL est la
 * seule exception : les quatre points y sont confondus, et le bouton
 * « Changer de triangle » permet de le constater.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est calculé
 * ---------------------------------------------------------------------------
 * Rien n'est dessiné à la main.
 *   - le MILIEU du côté [BC] est (B + C) / 2 ; la médiane issue de A est le
 *     segment qui le joint à A ;
 *   - le CENTRE DE GRAVITÉ est G = (A + B + C) / 3. C'est bien un point de la
 *     médiane issue de A, puisque A + (2/3)·((B+C)/2 − A) = (A + B + C)/3 : le
 *     calcul donne d'un coup la concourance ET la position aux deux tiers, que
 *     la figure se contente de rendre visibles ;
 *   - le CENTRE DU CERCLE INSCRIT est I = (a·A + b·B + c·C) / (a + b + c), où
 *     a, b, c sont les longueurs des côtés opposés à A, B, C, et son rayon vaut
 *     aire / demi-périmètre. Les bissectrices, elles, sont tracées pour ce
 *     qu'elles sont : depuis chaque sommet, dans la direction qui partage
 *     l'angle en deux, c'est-à-dire la somme des deux vecteurs unitaires des
 *     côtés. Qu'elles passent toutes les trois par I n'est donc pas supposé
 *     par le tracé : c'est ce qu'on observe.
 * Le déterminant qui traîne partout ailleurs est ici l'aire du triangle : elle
 * s'annule quand les trois points s'alignent, et la figure se met alors en
 * veille.
 */
MathsView.register({
  id: 'medianes-triangle',
  title: 'Les médianes d\'un triangle',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Figures planes',
  theme: 'Géométrie — médianes d\'un triangle et centre de gravité',
  description:
    'Une <strong>médiane</strong> d\'un triangle est le segment qui joint un <strong>sommet</strong> ' +
    'au <strong>milieu du côté opposé</strong>. ' +
    '<br>Clique sur <strong>Lancer l\'animation</strong> : les trois médianes se tracent une par ' +
    'une, avec à chaque fois le milieu du côté et le codage des deux demi-côtés égaux. Elles se ' +
    'coupent toutes les trois au même point, le <strong>centre de gravité</strong> \\( G \\), ' +
    'situé aux <strong>deux tiers</strong> de chaque médiane en partant du sommet. ' +
    '<br>Ensuite, <strong>déplace les sommets</strong> : tout suit en direct — et le rapport ' +
    '\\( \\dfrac{AG}{GA\'} \\) reste égal à 2, quoi que tu fasses.',
  notes:
    '<ul>' +
    '<li>La médiane issue de \\( A \\) joint \\( A \\) au <strong>milieu</strong> \\( A\' \\) de ' +
    '\\( [BC] \\). Il y en a donc trois, une par sommet.</li>' +
    '<li>Les trois médianes sont <strong>concourantes</strong> : elles passent toutes par un même ' +
    'point, le <strong>centre de gravité</strong> \\( G \\). Il est <strong>toujours à ' +
    'l\'intérieur</strong> du triangle — contrairement à l\'orthocentre, qui peut en sortir.</li>' +
    '<li>\\( G \\) est aux <strong>deux tiers</strong> de chaque médiane en partant du sommet : ' +
    '\\( AG = \\dfrac{2}{3}\\,AA\' \\) et \\( GA\' = \\dfrac{1}{3}\\,AA\' \\), autrement dit ' +
    '\\( AG = 2 \\times GA\' \\).</li>' +
    '<li>Une médiane partage le triangle en <strong>deux triangles de même aire</strong> : ' +
    '\\( ABA\' \\) et \\( ACA\' \\) ont la même base (\\( BA\' = A\'C \\)) et la même hauteur ' +
    'issue de \\( A \\).</li>' +
    '<li><strong>Ne pas confondre.</strong> Le centre de gravité est le point de concours des ' +
    '<strong>médianes</strong>. Le <strong>centre du cercle inscrit</strong>, lui, est le point ' +
    'de concours des <strong>bissectrices</strong> : ce n\'est pas le même point. Coche ' +
    '« Cercle inscrit » pour afficher les deux en même temps et déplace un sommet.</li>' +
    '<li>Dans un triangle <strong>isocèle</strong>, la médiane issue du sommet principal est ' +
    'aussi hauteur, médiatrice et bissectrice. Dans un triangle <strong>équilatéral</strong>, ' +
    'c\'est vrai pour les trois, et les quatre points remarquables sont ' +
    '<strong>confondus</strong>.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette (la même que la leçon des hauteurs)                           */
    /* ==================================================================== */
    var INK = '#334155';     // les côtés du triangle
    var SOM = '#2563eb';     // les sommets
    var COTE = '#059669';    // le côté opposé, mis en avant pendant l'étape
    var MED = '#7c3aed';     // les médianes (partie sommet → G)
    var MED2 = '#a78bfa';    // la fin de la médiane (G → milieu)
    var MIL = '#ea580c';     // les milieux et leur codage
    var GRAV = '#dc2626';    // le centre de gravité
    var INSC = '#0d9488';    // bissectrices et cercle inscrit
    var GUIDE = '#94a3b8';

    /* ==================================================================== */
    /* Moteur d'animation partagé + mode « pas à pas » (voir app.js)         */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    // Segment de p0 à p1 (fns → [x,y]), révélé de 0 à prog.
    function segCurve(p0, p1, style) {
      var prog = { v: 0 };
      var c = board.create('curve', [
        function (t) { var a = p0(), b = p1(); return a[0] + (b[0] - a[0]) * t; },
        function (t) { var a = p0(), b = p1(); return a[1] + (b[1] - a[1]) * t; },
        0, function () { return prog.v; }
      // Un segment n'a besoin que de ses deux extrémités : sans cela JSXGraph
      // l'échantillonne sur des centaines de points à chaque mise à jour.
      ], Object.assign({ numberPointsHigh: 2, numberPointsLow: 2 }, style));
      return { curve: c, prog: prog };
    }
    // Ligne brisée réactive de n points (fn → tableau de [x,y]). L'indice est
    // arrondi : le tracé reste juste quel que soit l'échantillonnage.
    function brisee(ptsFn, n, style) {
      return board.create('curve', [
        function (t) { return ptsFn()[Math.round(t)][0]; },
        function (t) { return ptsFn()[Math.round(t)][1]; },
        0, n - 1
      ], Object.assign({ numberPointsHigh: n, numberPointsLow: n }, style));
    }
    // Afficher / masquer. On MÉMORISE l'état : dans JSXGraph, setAttribute
    // déclenche à lui seul une mise à jour complète du tableau, et l'animation
    // repasse par ici à chaque image. Ne rien faire quand rien ne change fait
    // toute la différence entre une animation fluide et une animation qui rame.
    function show(o, v) {
      v = !!v;
      if (o.__vu === v) return;
      o.__vu = v;
      o.setAttribute({ visible: v });
    }

    /* ==================================================================== */
    /* Petite algèbre vectorielle                                            */
    /* ==================================================================== */
    function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
    function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
    function mul(a, k) { return [a[0] * k, a[1] * k]; }
    function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
    function len(a) { return Math.sqrt(dot(a, a)); }
    function unit(a) { var n = len(a); return n < 1e-9 ? [0, 0] : [a[0] / n, a[1] / n]; }
    function fr(v) { return v.toFixed(2).replace('.', ','); }

    /* ==================================================================== */
    /* Le triangle : trois sommets déplaçables                               */
    /* ==================================================================== */
    // Trois formes prêtes à l'emploi. L'isocèle et l'équilatéral ne sont pas là
    // pour décorer : ce sont les cas où médiane, hauteur, médiatrice et
    // bissectrice se confondent.
    var FORMES = [
      { nom: 'quelconque', p: [[-4.5, -2.5], [4, -3], [1, 3.2]] },
      { nom: 'isocèle', p: [[-3.2, -2.5], [3.2, -2.5], [0, 3.6]] },
      { nom: 'équilatéral', p: [[-3.46, -2], [3.46, -2], [0, 4]] }
    ];
    var forme = 0;

    var NOMS = ['A', 'B', 'C'];
    var OPP = [[1, 2], [2, 0], [0, 1]];      // le côté opposé à chaque sommet
    var DECAL = [[-16, -6], [14, -6], [0, 16]];

    var S = FORMES[0].p.map(function (p, i) {
      return board.create('point', p, {
        name: NOMS[i], size: 4, color: SOM, snapToGrid: false,
        label: { offset: DECAL[i], fontSize: 16, strokeColor: SOM, cssStyle: 'font-weight:700' }
      });
    });
    board.create('polygon', S, {
      fillColor: SOM, fillOpacity: 0.07, highlight: false,
      borders: { strokeColor: INK, strokeWidth: 2.5, highlight: false },
      vertices: { visible: true }
    });

    function P(i) { return [S[i].X(), S[i].Y()]; }

    function aire2() {
      var a = P(0), b = P(1), c = P(2);
      return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
    }
    function aplati() { return Math.abs(aire2()) < 0.35; }

    // Le milieu du côté opposé au sommet i — le point que va chercher la médiane.
    function milieu(i) { var o = OPP[i]; return mul(add(P(o[0]), P(o[1])), 0.5); }

    // Le centre de gravité : la moyenne des trois sommets.
    function gravite() { return mul(add(add(P(0), P(1)), P(2)), 1 / 3); }

    /* ==================================================================== */
    /* Une médiane = le côté opposé, son milieu codé, et le segment            */
    /* ==================================================================== */
    var MS = [];
    for (var i = 0; i < 3; i++) {
      (function (i) {
        var o = OPP[i];

        // a) le côté opposé, mis en avant pendant l'étape qui le concerne
        var cote = segCurve(function () { return P(o[0]); }, function () { return P(o[1]); },
          { strokeColor: COTE, strokeWidth: 5, strokeOpacity: 0.45, highlight: false,
            visible: false });

        // b) son milieu, et le codage des deux demi-côtés égaux
        var ptMil = board.create('point',
          [function () { return milieu(i)[0]; }, function () { return milieu(i)[1]; }],
          { name: NOMS[i] + "'", size: 4, color: MIL, fixed: true, visible: false,
            highlight: false, showInfobox: false,
            label: { offset: [10, -14], fontSize: 14, strokeColor: MIL,
                     cssStyle: 'font-weight:700' } });
        var code1 = brisee(function () { return codePts(i, 0); }, 2,
          { strokeColor: MIL, strokeWidth: 2.5, highlight: false, visible: false });
        var code2 = brisee(function () { return codePts(i, 1); }, 2,
          { strokeColor: MIL, strokeWidth: 2.5, highlight: false, visible: false });

        // c) la médiane : du sommet jusqu'au milieu. Elle se trace d'un trait,
        //    puis se sépare en deux morceaux quand on montre les deux tiers.
        var trait = segCurve(function () { return P(i); }, function () { return milieu(i); },
          { strokeColor: MED, strokeWidth: 3, highlight: false, visible: false });
        var partHaut = segCurve(function () { return P(i); }, function () { return gravite(); },
          { strokeColor: MED, strokeWidth: 5, highlight: false, visible: false });
        var partBas = segCurve(function () { return gravite(); }, function () { return milieu(i); },
          { strokeColor: MED2, strokeWidth: 5, highlight: false, visible: false });
        partHaut.prog.v = 1; partBas.prog.v = 1;

        MS[i] = { cote: cote, mil: ptMil, code1: code1, code2: code2,
                  trait: trait, haut: partHaut, bas: partBas, etat: 0 };
      })(i);
    }

    // Le codage du milieu : un petit trait en travers, au milieu de chaque
    // demi-côté. Deux traits identiques = deux longueurs égales.
    function codePts(i, moitie) {
      var o = OPP[i], m = milieu(i), bout = P(o[moitie]);
      var c = mul(add(m, bout), 0.5);                 // milieu du demi-côté
      var d = unit(sub(m, bout)), n = [-d[1], d[0]];  // la normale au côté
      return [add(c, mul(n, 0.24)), add(c, mul(n, -0.24))];
    }

    /* ==================================================================== */
    /* Le centre de gravité, et le halo qui vient se refermer dessus          */
    /* ==================================================================== */
    var halo = { v: 0 };
    var haloC = board.create('curve', [
      function (t) { return gravite()[0] + halo.v * Math.cos(t); },
      function (t) { return gravite()[1] + halo.v * Math.sin(t); },
      0, 2 * Math.PI
    ], { strokeColor: GRAV, strokeWidth: 2, dash: 2, highlight: false, visible: false });

    var ptGrav = board.create('point',
      [function () { return gravite()[0]; }, function () { return gravite()[1]; }],
      { name: 'G', size: 5, color: GRAV, fixed: true, visible: false, highlight: false,
        showInfobox: false,
        label: { offset: [12, 10], fontSize: 16, strokeColor: GRAV,
                 cssStyle: 'font-weight:700' } });

    /* ==================================================================== */
    /* La couche « cercle inscrit » : les BISSECTRICES, pas les médianes       */
    /* ==================================================================== */
    // Longueur du côté opposé au sommet i.
    function cote(i) { var o = OPP[i]; return len(sub(P(o[1]), P(o[0]))); }

    // Le centre du cercle inscrit, et son rayon (aire / demi-périmètre).
    function inscrit() {
      var a = cote(0), b = cote(1), c = cote(2), s = a + b + c;
      if (s < 1e-9) return P(0);
      return mul(add(add(mul(P(0), a), mul(P(1), b)), mul(P(2), c)), 1 / s);
    }
    function rayonInscrit() {
      var s = (cote(0) + cote(1) + cote(2)) / 2;
      return s < 1e-9 ? 0 : Math.abs(aire2()) / 2 / s;
    }

    // Chaque bissectrice est tracée pour ce qu'elle est : depuis le sommet,
    // dans la direction qui partage l'angle en deux (somme des deux vecteurs
    // unitaires). Rien n'impose qu'elles se rencontrent : on l'observe.
    var biss = [0, 1, 2].map(function (i) {
      var o = OPP[i];
      function dir() {
        return unit(add(unit(sub(P(o[0]), P(i))), unit(sub(P(o[1]), P(i)))));
      }
      return board.create('line', [
        board.create('point', [function () { return P(i)[0]; }, function () { return P(i)[1]; }],
          { visible: false, fixed: true, name: '' }),
        board.create('point', [function () { return add(P(i), dir())[0]; },
                               function () { return add(P(i), dir())[1]; }],
          { visible: false, fixed: true, name: '' })
      ], { strokeColor: INSC, strokeWidth: 1.4, dash: 2, fixed: true,
           highlight: false, visible: false });
    });

    var ptInsc = board.create('point',
      [function () { return inscrit()[0]; }, function () { return inscrit()[1]; }],
      { name: 'I', size: 4, color: INSC, fixed: true, visible: false, highlight: false,
        showInfobox: false,
        label: { offset: [10, -18], fontSize: 15, strokeColor: INSC,
                 cssStyle: 'font-weight:700' } });

    var cercle = board.create('curve', [
      function (t) { return inscrit()[0] + rayonInscrit() * Math.cos(t); },
      function (t) { return inscrit()[1] + rayonInscrit() * Math.sin(t); },
      0, 2 * Math.PI
    ], { strokeColor: INSC, strokeWidth: 2, highlight: false, visible: false });

    var voirCercle = false;
    var voirTiers = false;

    /* ==================================================================== */
    /* Le bandeau : ce que la figure montre, en direct                        */
    /* ==================================================================== */
    // Les trois côtés sont-ils égaux ? deux d'entre eux ? La tolérance est
    // serrée (moins de 2 % d'écart) : sinon un triangle nettement isocèle se
    // ferait passer pour équilatéral.
    function egaux(u, v) { return Math.abs(u - v) < 0.008 * (u + v); }
    function bandeauTxt() {
      if (aplati()) {
        return 'Les trois points sont presque alignés : ce n\'est plus un triangle. ' +
               'Écarte un sommet.';
      }
      var a = cote(0), b = cote(1), c = cote(2);
      if (egaux(a, b) && egaux(b, c)) {
        return 'Triangle équilatéral : le centre de gravité, le centre du cercle inscrit, ' +
               'celui du cercle circonscrit et l\'orthocentre sont CONFONDUS.';
      }
      var iso = egaux(a, b) ? 2 : egaux(b, c) ? 0 : egaux(a, c) ? 1 : -1;
      if (iso >= 0) {
        return 'Triangle isocèle en ' + NOMS[iso] + ' : la médiane issue de ' + NOMS[iso] +
               ' est aussi hauteur, médiatrice et bissectrice.';
      }
      var g = gravite(), d1 = len(sub(g, P(0))), d2 = len(sub(milieu(0), g));
      return 'AG = ' + fr(d1) + ' et GA\' = ' + fr(d2) + ' : AG = 2 × GA\'. ' +
             'G est aux deux tiers de la médiane, en partant du sommet.';
    }
    var bandeau = board.create('text', [-7.7, 5.4, bandeauTxt],
      { fontSize: 15, color: GRAV, strokeColor: GRAV, cssStyle: 'font-weight:600',
        fixed: true, visible: false });

    var noteInsc = board.create('text', [-7.7, -5.3, function () {
      if (!voirCercle) return '';
      return 'En vert : les BISSECTRICES et le cercle inscrit, de centre I. ' +
             'I n\'est pas G : ce ne sont pas les mêmes droites.';
    }], { fontSize: 14, color: INSC, strokeColor: INSC, cssStyle: 'font-weight:600',
          fixed: true, visible: false });

    /* ==================================================================== */
    /* Mise à jour de tout ce qui dépend de la forme du triangle              */
    /* ==================================================================== */
    var fini = false;                 // le centre de gravité a-t-il été révélé ?

    function rafraichir() {
      var ok = !aplati();
      MS.forEach(function (m) {
        show(m.mil, m.etat >= 1 && ok);
        show(m.code1, m.etat >= 1 && ok);
        show(m.code2, m.etat >= 1 && ok);
        // Quand on montre les deux tiers, la médiane cède la place à ses deux
        // morceaux : le gros du sommet à G, le petit de G au milieu.
        var tiers = voirTiers && fini && ok;
        show(m.trait.curve, m.etat >= 2 && !tiers);
        show(m.haut.curve, m.etat >= 2 && tiers);
        show(m.bas.curve, m.etat >= 2 && tiers);
      });
      show(ptGrav, fini && ok);
      show(ptInsc, voirCercle && ok);
      show(cercle, voirCercle && ok);
      biss.forEach(function (b) { show(b, voirCercle && ok); });
      show(noteInsc, voirCercle);
      // Même précaution que pour show() : on ne repeint le bandeau que si sa
      // couleur change vraiment.
      var col = aplati() ? GUIDE : GRAV;
      if (bandeau.__col !== col) { bandeau.__col = col; bandeau.setAttribute({ strokeColor: col }); }
      board.update();
    }
    S.forEach(function (p) { p.on('drag', rafraichir); });

    /* ==================================================================== */
    /* États : effacer / jouer l'animation                                   */
    /* ==================================================================== */
    function effacer() {
      anim.cancel();
      fini = false;
      halo.v = 0;
      show(haloC, false);
      MS.forEach(function (m) {
        m.etat = 0;
        m.trait.prog.v = 0;
        m.cote.prog.v = 0;
        m.cote.curve.setAttribute({ strokeOpacity: 0.45 });
        [m.cote.curve, m.mil, m.code1, m.code2, m.trait.curve, m.haut.curve, m.bas.curve]
          .forEach(function (o) { show(o, false); });
      });
      show(ptGrav, false);
      show(bandeau, false);
      rafraichir();
    }

    function jouer() {
      effacer();
      var steps = [];
      [0, 1, 2].forEach(function (i) {
        // 1. le côté opposé s'allume, et son milieu apparaît (demi-côtés codés)
        steps.push({
          dur: 450,
          step: function (p) {
            MS[i].cote.prog.v = p;
            show(MS[i].cote.curve, true);
          },
          after: function () { MS[i].etat = 1; rafraichir(); }
        });
        // 2. la médiane descend du sommet jusqu'à ce milieu
        steps.push({
          dur: 800,
          step: function (p) {
            MS[i].trait.prog.v = p;
            show(MS[i].trait.curve, true);
          },
          after: function () {
            MS[i].etat = 2;
            MS[i].cote.curve.setAttribute({ strokeOpacity: 0.18 });
            rafraichir();
          }
        });
      });
      // 3. les trois médianes passent par un même point
      steps.push({
        dur: 1000,
        step: function (p) { halo.v = 1.8 * (1 - p); show(haloC, true); },
        after: function () {
          halo.v = 0;
          show(haloC, false);
          fini = true;
          show(bandeau, true);
          rafraichir();
        }
      });
      // 4. et ce point est aux deux tiers, en partant du sommet
      steps.push({
        dur: 600,
        step: function (p) {
          voirTiers = true;
          if (refs && refs.tiers) refs.tiers.checked = true;
          MS.forEach(function (m) { m.haut.prog.v = p; m.bas.prog.v = p; });
          rafraichir();
        }
      });
      anim.runSteps(steps, effacer);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    // Un minuteur traîne entre le déplacement des sommets et la relance de
    // l'animation : il doit mourir avec la leçon, sinon il rejouerait sur un
    // tableau déjà libéré.
    var minuteur = null;
    mv.onCleanup(function () { clearTimeout(minuteur); });

    var refs = mv.addControls([
      { type: 'button', id: 'play', label: '▶ Lancer l\'animation', onClick: jouer },
      { type: 'button', id: 'forme', label: '🔺 Changer de triangle', onClick: function () {
          forme = (forme + 1) % FORMES.length;
          effacer();
          FORMES[forme].p.forEach(function (p, i) { S[i].moveTo(p, 350); });
          clearTimeout(minuteur);
          minuteur = setTimeout(jouer, 420);
        } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer },
      { type: 'checkbox', id: 'tiers', label: 'Le partage aux deux tiers', checked: false,
        onChange: function (v) { voirTiers = v; rafraichir(); } },
      { type: 'checkbox', id: 'insc', label: 'Cercle inscrit (bissectrices)', checked: false,
        onChange: function (v) { voirCercle = v; rafraichir(); } }
    ]);

    // Démarrage : on joue l'animation une première fois.
    jouer();
  }
});
