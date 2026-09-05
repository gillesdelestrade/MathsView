/*
 * Union et intersection de deux intervalles (2nde).
 *
 * Deux intervalles I et J sont posés sur le MÊME axe, l'un au-dessus de
 * l'autre, et le résultat — I ∪ J ou I ∩ J selon le mode — est tracé juste
 * en dessous, aligné sur les mêmes graduations. Rien d'autre ne bouge : les
 * bornes du résultat se lisent donc à la verticale, ce sont toujours celles
 * de I ou de J.
 *
 *      I    [--------]                  ∩ : ce qui est dans les DEUX
 *      J       [------------]           ∪ : ce qui est dans AU MOINS UN
 *      ∪    [---------------]
 *      ∩       [-----]
 *
 * Puis un point x parcourt l'axe de gauche à droite. Il est VERT quand il
 * appartient au résultat, ROUGE sinon, et il laisse derrière lui une trace
 * de la même couleur : à l'arrivée, l'axe entier est colorié et l'ensemble
 * cherché se voit d'un seul coup d'œil. Le parcours s'arrête à chaque borne
 * rencontrée — c'est là que la couleur change, et c'est là que le crochet
 * décide.
 *
 * Les deux définitions tiennent en un mot de liaison, et c'est ce mot que la
 * figure met en scène sous le point :
 *
 *      x ∈ I ∪ J  ⟺  x ∈ I  OU  x ∈ J
 *      x ∈ I ∩ J  ⟺  x ∈ I  ET  x ∈ J
 *
 * Deux pièges sont accessibles à la souris : une intersection VIDE (les
 * intervalles ne se chevauchent pas) et une union EN DEUX MORCEAUX (qui ne
 * s'écrit donc pas comme un seul intervalle). Le cas limite — les deux
 * intervalles se touchent en un point unique — se règle avec les crochets :
 * [3;6[ ∪ [6;10] recolle en [3;10], mais [3;6[ ∪ ]6;10] laisse un trou.
 */
MathsView.register({
  id: 'intervalles-union-intersection',
  title: 'Union et intersection d\'intervalles',
  level: '2nde',
  category: 'calcul',
  subcategory: 'Ensembles de nombres',
  exercices: ['intervalles-union-inter'],
  theme: 'Nombres — réunion et intersection de deux intervalles de ℝ',
  description:
    'Deux intervalles \\(I\\) et \\(J\\) posés sur le même axe. ' +
    'L\'<strong>intersection</strong> \\(I\\cap J\\) rassemble les nombres qui sont dans ' +
    '\\(I\\) <strong>ET</strong> dans \\(J\\) ; l\'<strong>union</strong> \\(I\\cup J\\) ' +
    'ceux qui sont dans \\(I\\) <strong>OU</strong> dans \\(J\\) (au moins l\'un des deux).' +
    '<br>Lance le parcours : un point traverse l\'axe et devient ' +
    '<strong style="color:#16a34a">vert</strong> quand il appartient à l\'ensemble ' +
    'cherché, <strong style="color:#dc2626">rouge</strong> sinon. Il laisse sa couleur ' +
    'derrière lui : à l\'arrivée, l\'ensemble est colorié tout entier. Le parcours ' +
    's\'arrête à chaque <strong>borne</strong>, parce que c\'est exactement là que la ' +
    'couleur bascule.' +
    '<br><em>Déplace les bornes à la souris et coche les crochets. Le bouton ' +
    '<strong>∅ Intervalles disjoints</strong> pose deux intervalles séparés par un vrai ' +
    'trou : l\'intersection y est <strong>vide</strong> et l\'union reste en ' +
    '<strong>deux morceaux</strong>.</em>',
  notes:
    '<ul>' +
    '<li><strong>Les deux définitions.</strong> ' +
    '\\(I\\cap J=\\{x\\mid x\\in I \\text{ et } x\\in J\\}\\), ' +
    '\\(I\\cup J=\\{x\\mid x\\in I \\text{ ou } x\\in J\\}\\). Le « ou » des ' +
    'mathématiques n\'est pas exclusif : un nombre qui est dans les deux est bien ' +
    'dans l\'union.</li>' +
    '<li><strong>On ne calcule pas, on lit.</strong> Sur l\'axe, ' +
    '\\(I\\cap J\\) est la partie <em>commune</em> aux deux barres, ' +
    '\\(I\\cup J\\) est ce que les deux barres recouvrent <em>à elles deux</em>.</li>' +
    '<li><strong>Les bornes du résultat.</strong> Pour l\'intersection, on prend la ' +
    '<strong>plus grande</strong> des bornes gauches et la <strong>plus petite</strong> ' +
    'des bornes droites ; pour l\'union (quand elle se recolle), la plus petite des ' +
    'bornes gauches et la plus grande des bornes droites. Exemple : ' +
    '\\([3\\,;6]\\cap[4\\,;10]=[4\\,;6]\\) et \\([3\\,;6]\\cup[4\\,;10]=[3\\,;10]\\).</li>' +
    '<li><strong>Et les crochets ?</strong> À une borne partagée, l\'intersection est ' +
    'fermée seulement si <em>les deux</em> le sont (« et »), l\'union dès que ' +
    '<em>l\'un</em> l\'est (« ou »). Ainsi ' +
    '\\([3\\,;6[\\;\\cap\\;[4\\,;6]=[4\\,;6[\\).</li>' +
    '<li><strong>L\'intersection peut être vide.</strong> Si les intervalles ne se ' +
    'chevauchent pas, \\(I\\cap J=\\varnothing\\). Attention au cas limite : ' +
    '\\([3\\,;6]\\cap[6\\,;10]=\\{6\\}\\) (un seul nombre), mais ' +
    '\\([3\\,;6[\\;\\cap\\;[6\\,;10]=\\varnothing\\).</li>' +
    '<li><strong>L\'union n\'est pas toujours un intervalle.</strong> ' +
    '\\([3\\,;5]\\cup[7\\,;9]\\) ne peut pas s\'écrire avec un seul couple de crochets : ' +
    'il y a un trou entre 5 et 7. On garde alors le symbole \\(\\cup\\) dans la réponse. ' +
    'C\'est ainsi qu\'on écrit \\(\\mathbb{R}^{*}=\\;]-\\infty\\,;0[\\;\\cup\\;]0\\,;+\\infty[\\).</li>' +
    '<li><strong>Le recollement.</strong> Deux intervalles qui se touchent en un point ' +
    'ne font un seul intervalle que si ce point appartient à l\'un des deux : ' +
    '\\([3\\,;6[\\;\\cup\\;[6\\,;10]=[3\\,;10]\\), alors que ' +
    '\\([3\\,;6[\\;\\cup\\;]6\\,;10]\\) reste en deux morceaux — il manque 6.</li>' +
    '<li><strong>Toujours utile.</strong> \\(I\\cap J\\subset I\\subset I\\cup J\\) : ' +
    'l\'intersection est la plus petite des trois, l\'union la plus grande.</li>' +
    '</ul>',
  board: {
    boundingbox: [-8.5, 7.5, 11.5, -7.5], keepaspectratio: true,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette et géométrie                                                 */
    /* ==================================================================== */
    var C_I   = '#2563eb';   // bleu   : l'intervalle I
    var C_J   = '#7c3aed';   // violet : l'intervalle J
    var C_YES = '#16a34a';   // vert   : dans l'ensemble cherché
    var C_NO  = '#dc2626';   // rouge  : en dehors
    var INK   = '#334155';
    var SOFT  = '#64748b';

    var YI = 4.45;           // hauteur de la barre I
    var YJ = 2.95;           // hauteur de la barre J
    var YR = 1.45;           // hauteur de la barre résultat
    var YL = 0.15;           // la droite graduée
    var YT = -1.30;          // la trace laissée par le point
    var H  = 0.34;           // demi-hauteur des crochets
    var GMIN = -8, GMAX = 11;        // premières et dernières graduations
    var BMIN = -7, BMAX = 10;        // là où les bornes peuvent aller
    var XA = GMIN, XB = GMAX;        // départ et arrivée du parcours

    /* ==================================================================== */
    /* État                                                                 */
    /* ==================================================================== */
    var mode = 'union';      // 'union' ou 'inter'
    var clI = true, crI = true;      // crochets de I : gauche / droite fermés ?
    var clJ = true, crJ = true;      // crochets de J
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
    function pt(fx, fy) {
      return board.create('point', [fx, fy],
        { visible: false, fixed: true, name: '', withLabel: false });
    }

    /* ==================================================================== */
    /* La droite graduée                                                    */
    /* ==================================================================== */
    board.create('segment', [[GMIN - 0.35, YL], [GMAX + 0.35, YL]], {
      strokeColor: INK, strokeWidth: 2, firstArrow: { type: 2, size: 6 },
      lastArrow: { type: 2, size: 6 }, fixed: true, highlight: false, layer: 5
    });
    for (var v = GMIN; v <= GMAX; v++) {
      (function (v) {
        board.create('segment', [[v, YL - 0.15], [v, YL + 0.15]], {
          strokeColor: INK, strokeWidth: v === 0 ? 2.5 : 1.2,
          fixed: true, highlight: false, layer: 5
        });
        board.create('text', [v, YL - 0.52, function () {
          return String(v).replace('-', '−');
        }], { anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: SOFT,
              fixed: true, highlight: false, layer: 5 });
      })(v);
    }

    /* ==================================================================== */
    /* Les quatre bornes, glissantes                                        */
    /*                                                                      */
    /* Chacune vit sur la barre de son intervalle : on les déplace là où on  */
    /* les lit. Elles s'accrochent aux entiers et ne se croisent jamais —    */
    /* un intervalle garde au moins une unité de large, ce qui laisse        */
    /* toujours quelque chose à voir.                                        */
    /* ==================================================================== */
    function snap(x) { return Math.max(BMIN, Math.min(BMAX, Math.round(x))); }

    function borne(x, y) {
      return board.create('point', [x, y], {
        size: 5, strokeWidth: 2, withLabel: false, showInfobox: false, layer: 9
      });
    }
    var PA = borne(3, YI), PB = borne(6, YI);      // bornes de I
    var QA = borne(4, YJ), QB = borne(10, YJ);     // bornes de J

    function poser(P, x, y) { P.setPosition(JXG.COORDS_BY_USER, [x, y]); }

    PA.on('drag', function () { poser(PA, Math.min(snap(PA.X()), PB.X() - 1), YI); touche(); });
    PB.on('drag', function () { poser(PB, Math.max(snap(PB.X()), PA.X() + 1), YI); touche(); });
    QA.on('drag', function () { poser(QA, Math.min(snap(QA.X()), QB.X() - 1), YJ); touche(); });
    QB.on('drag', function () { poser(QB, Math.max(snap(QB.X()), QA.X() + 1), YJ); touche(); });

    function I() { return { a: PA.X(), b: PB.X(), cl: clI, cr: crI, nom: 'I', col: C_I }; }
    function J() { return { a: QA.X(), b: QB.X(), cl: clJ, cr: crJ, nom: 'J', col: C_J }; }

    // La seule question qui compte, posée intervalle par intervalle.
    function dans(iv, x) {
      return (iv.cl ? x >= iv.a : x > iv.a) && (iv.cr ? x <= iv.b : x < iv.b);
    }
    function dansResultat(x) {
      return mode === 'union' ? (dans(I(), x) || dans(J(), x))
                              : (dans(I(), x) && dans(J(), x));
    }

    /* ==================================================================== */
    /* Le résultat, calculé borne à borne                                   */
    /*                                                                      */
    /* Tout tient dans quatre comparaisons. Quand deux bornes tombent au     */
    /* même endroit, c'est le mot de liaison qui tranche le crochet :        */
    /* « et » pour l'intersection (fermé s'ils le sont TOUS LES DEUX),       */
    /* « ou » pour l'union (fermé dès que L'UN l'est).                       */
    /* ==================================================================== */
    function gaucheMax(i, j) {                    // la plus grande borne gauche
      if (i.a > j.a) return { x: i.a, c: i.cl };
      if (j.a > i.a) return { x: j.a, c: j.cl };
      return { x: i.a, c: i.cl && j.cl };
    }
    function droiteMin(i, j) {                    // la plus petite borne droite
      if (i.b < j.b) return { x: i.b, c: i.cr };
      if (j.b < i.b) return { x: j.b, c: j.cr };
      return { x: i.b, c: i.cr && j.cr };
    }
    function gaucheMin(i, j) {                    // la plus petite borne gauche
      if (i.a < j.a) return { x: i.a, c: i.cl };
      if (j.a < i.a) return { x: j.a, c: j.cl };
      return { x: i.a, c: i.cl || j.cl };
    }
    function droiteMax(i, j) {                    // la plus grande borne droite
      if (i.b > j.b) return { x: i.b, c: i.cr };
      if (j.b > i.b) return { x: j.b, c: j.cr };
      return { x: i.b, c: i.cr || j.cr };
    }

    // Les intervalles se touchent-ils assez pour que leur union se recolle ?
    function recolle() {
      var i = I(), j = J();
      var g = gaucheMax(i, j), d = droiteMin(i, j);
      if (g.x < d.x) return true;                        // ils se chevauchent
      if (g.x > d.x) return false;                       // il y a un vrai trou
      return dans(i, g.x) || dans(j, g.x);               // ils se touchent en un point
    }

    // Le résultat, en un ou deux morceaux. Zéro morceau = l'ensemble vide.
    function morceaux() {
      var i = I(), j = J();
      if (mode === 'inter') {
        var lo = gaucheMax(i, j), hi = droiteMin(i, j);
        if (lo.x > hi.x) return [];
        if (lo.x === hi.x && !(lo.c && hi.c)) return [];
        return [{ a: lo.x, b: hi.x, cl: lo.c, cr: hi.c }];
      }
      if (recolle()) {
        var g = gaucheMin(i, j), d = droiteMax(i, j);
        return [{ a: g.x, b: d.x, cl: g.c, cr: d.c }];
      }
      // Deux morceaux disjoints : on écrit d'abord celui de gauche.
      var m1 = { a: i.a, b: i.b, cl: i.cl, cr: i.cr };
      var m2 = { a: j.a, b: j.b, cl: j.cl, cr: j.cr };
      return m1.a <= m2.a ? [m1, m2] : [m2, m1];
    }

    /* ==================================================================== */
    /* Les barres, les crochets                                             */
    /* ==================================================================== */
    function barre(xf, yf, xf2, col, w) {
      return board.create('segment', [pt(xf, yf), pt(xf2, yf)], {
        strokeColor: col, strokeWidth: w, fixed: true, highlight: false, layer: 6
      });
    }
    // Le crochet est tourné VERS l'intervalle quand la borne est comprise, et
    // vers l'extérieur quand elle est exclue : la leçon précédente l'a mis en
    // place, on s'appuie dessus sans le réexpliquer.
    function crochet(xf, yf, dirf, col) {
      var V1 = pt(xf, function () { return yf() - H; });
      var V2 = pt(xf, function () { return yf() + H; });
      var A1 = pt(function () { return xf() + 0.30 * dirf(); }, function () { return yf() + H; });
      var A2 = pt(function () { return xf() + 0.30 * dirf(); }, function () { return yf() - H; });
      var o = { strokeColor: col, strokeWidth: 3.5, lineCap: 'round',
                fixed: true, highlight: false, layer: 8 };
      return [board.create('segment', [V1, V2], o),
              board.create('segment', [V2, A1], o),
              board.create('segment', [V1, A2], o)];
    }

    function yFix(y) { return function () { return y; }; }

    /* --- I et J ---------------------------------------------------------- */
    barre(function () { return PA.X(); }, yFix(YI), function () { return PB.X(); }, C_I, 6);
    barre(function () { return QA.X(); }, yFix(YJ), function () { return QB.X(); }, C_J, 6);

    crochet(function () { return PA.X(); }, yFix(YI), function () { return clI ? 1 : -1; }, C_I);
    crochet(function () { return PB.X(); }, yFix(YI), function () { return crI ? -1 : 1; }, C_I);
    crochet(function () { return QA.X(); }, yFix(YJ), function () { return clJ ? 1 : -1; }, C_J);
    crochet(function () { return QB.X(); }, yFix(YJ), function () { return crJ ? -1 : 1; }, C_J);

    // L'écriture de chaque intervalle, posée au-dessus de sa barre.
    function ecriture(iv) {
      return iv.nom + ' = ' + (iv.cl ? '[' : ']') + ' ' + fmt(iv.a) + ' ; ' +
             fmt(iv.b) + ' ' + (iv.cr ? ']' : '[');
    }
    function etiquette(yv, f, col) {
      return board.create('text', [f.x, yv + 0.72, f.t], {
        anchorX: 'middle', anchorY: 'middle', fontSize: 16, color: col,
        cssStyle: 'font-weight:800;background:rgba(255,255,255,.85);padding:0 4px;' +
                  'border-radius:5px', fixed: true, highlight: false, layer: 9
      });
    }
    etiquette(YI, { x: function () { return (PA.X() + PB.X()) / 2; },
                    t: function () { return ecriture(I()); } }, C_I);
    etiquette(YJ, { x: function () { return (QA.X() + QB.X()) / 2; },
                    t: function () { return ecriture(J()); } }, C_J);

    /* --- Le résultat : jusqu'à deux morceaux ------------------------------ */
    /* Les objets sont créés une fois pour toutes et se déplacent ; le second
       morceau ne se montre que si l'union se retrouve coupée en deux. */
    var pieces = [0, 1].map(function (k) {
      function m() { return morceaux()[k] || null; }
      function A() { var x = m(); return x ? x.a : 0; }
      function B() { var x = m(); return x ? x.b : 0; }
      var seg = barre(A, yFix(YR), B, C_YES, 7);
      var cg = crochet(A, yFix(YR), function () { var x = m(); return x && x.cl ? 1 : -1; }, C_YES);
      var cd = crochet(B, yFix(YR), function () { var x = m(); return x && x.cr ? -1 : 1; }, C_YES);
      // La bande verticale descend jusque sous l'axe : le point est vert
      // exactement quand il la traverse.
      var bande = board.create('polygon', [
        pt(A, yFix(YR + 0.45)), pt(B, yFix(YR + 0.45)),
        pt(B, yFix(YT - 0.35)), pt(A, yFix(YT - 0.35))
      ], { fillColor: C_YES, fillOpacity: 0.12, withLines: false,
           borders: { visible: false }, hasInnerPoints: false,
           fixed: true, highlight: false, layer: 1 });
      // Le cas {4} : l'intersection se réduit à un seul nombre.
      var seul = board.create('point', [A, YR], {
        size: 5, color: C_YES, fixed: true, withLabel: false,
        showInfobox: false, highlight: false, layer: 9
      });
      return { m: m, seg: seg, cg: cg, cd: cd, bande: bande, seul: seul };
    });

    var vide = board.create('text', [(GMIN + GMAX) / 2, YR, function () {
      return '∅ — aucun nombre n\'est dans les deux à la fois';
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: C_NO,
          cssStyle: 'font-weight:700', fixed: true, highlight: false,
          layer: 9, visible: false });

    /* ==================================================================== */
    /* Le point qui parcourt l'axe, et la trace qu'il laisse                */
    /*                                                                      */
    /* La trace est découpée aux bornes : entre deux bornes consécutives,    */
    /* l'appartenance ne change pas, la couleur non plus. Chaque tronçon se  */
    /* dessine jusqu'à la position courante du point — d'où l'impression     */
    /* qu'il peint l'axe en avançant.                                        */
    /* ==================================================================== */
    var PT = board.create('point', [XA, YL], {
      size: 7, strokeWidth: 2, withLabel: false, showInfobox: false, layer: 10
    });
    function x() { return PT.X(); }
    function setX(v) { poser(PT, Math.max(XA, Math.min(XB, v)), YL); }

    PT.on('drag', function () {
      poser(PT, Math.max(XA, Math.min(XB, Math.round(PT.X() * 2) / 2)), YL);
      armer(); board.update();
    });

    // Les frontières : les quatre bornes, dans l'ordre, sans doublon.
    function frontieres() {
      var i = I(), j = J();
      var xs = [i.a, i.b, j.a, j.b].filter(function (v) { return v > XA && v < XB; });
      xs.sort(function (p, q) { return p - q; });
      return xs.filter(function (v, k) { return k === 0 || v !== xs[k - 1]; });
    }
    // Les tronçons entre deux frontières successives, du départ à l'arrivée.
    function troncons() {
      var f = [XA].concat(frontieres(), [XB]);
      var out = [];
      for (var k = 0; k + 1 < f.length; k++) out.push([f[k], f[k + 1]]);
      return out;
    }

    board.create('segment', [[XA, YT], [XB, YT]], {
      strokeColor: '#e2e8f0', strokeWidth: 6, fixed: true, highlight: false, layer: 2
    });

    var TRACE = 6;                       // au plus 4 bornes → 5 tronçons, plus une marge
    var traces = [];
    for (var k = 0; k < TRACE; k++) {
      (function (k) {
        function z() { return troncons()[k] || null; }
        function d() { var t = z(); return t ? t[0] : 0; }
        // Le tronçon s'arrête là où le point en est : c'est toute l'animation.
        function f() { var t = z(); return t ? Math.min(t[1], x()) : 0; }
        var s = board.create('segment', [pt(d, yFix(YT)), pt(f, yFix(YT))], {
          strokeColor: C_YES, strokeWidth: 7, fixed: true, highlight: false, layer: 3
        });
        traces.push({ z: z, seg: s });
      })(k);
    }

    // Sur la trace, un point par borne : c'est le seul endroit où l'on voit
    // qu'une borne est prise ou laissée — un point isolé n'a pas de largeur.
    var bornesTrace = [0, 1, 2, 3].map(function (k) {
      function xf() { var b = [I().a, I().b, J().a, J().b]; return b[k]; }
      var p = board.create('point', [xf, YT], {
        size: 3.5, fixed: true, withLabel: false, showInfobox: false,
        highlight: false, layer: 7
      });
      return { x: xf, p: p };
    });

    // Le fil vertical qui relie le point à tout ce qui le concerne.
    var fil = board.create('segment', [pt(x, yFix(YI + 0.42)), pt(x, yFix(YT - 0.3))], {
      strokeColor: SOFT, strokeWidth: 1.5, dash: 2, fixed: true,
      highlight: false, layer: 4
    });

    var labX = board.create('text', [x, YT - 0.9, function () {
      return 'x = ' + fmt(x());
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 16, color: INK,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });

    /* ==================================================================== */
    /* Les textes : la formule en haut, le raisonnement en bas              */
    /* ==================================================================== */
    function signe() { return mode === 'union' ? '∪' : '∩'; }
    function motLien() { return mode === 'union' ? 'ou' : 'et'; }

    function notation(m) {
      return (m.cl ? '[' : ']') + ' ' + fmt(m.a) + ' ; ' + fmt(m.b) + ' ' + (m.cr ? ']' : '[');
    }
    function resultat() {
      var ms = morceaux();
      if (!ms.length) return '∅';
      if (ms.length === 1 && ms[0].a === ms[0].b) return '{ ' + fmt(ms[0].a) + ' }';
      return ms.map(notation).join(' ∪ ');
    }

    board.create('text', [(GMIN + GMAX) / 2, 6.95, function () {
      return 'I ' + signe() + ' J = ' + resultat();
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 26, color: C_YES,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });

    board.create('text', [(GMIN + GMAX) / 2, 6.00, function () {
      return 'x ∈ I ' + signe() + ' J &nbsp;⟺&nbsp; x ∈ I &nbsp;<strong>' +
             motLien().toUpperCase() + '</strong>&nbsp; x ∈ J';
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: INK,
          cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 9 });

    function coche(ok) {
      return ok ? '<span style="color:' + C_YES + ';font-weight:800">✓</span>'
                : '<span style="color:' + C_NO + ';font-weight:800">✗</span>';
    }
    board.create('text', [(GMIN + GMAX) / 2, -3.2, function () {
      var v = fmt(x());
      return v + ' ∈ I ' + coche(dans(I(), x())) +
             ' &nbsp;&nbsp;<strong>' + motLien() + '</strong>&nbsp;&nbsp; ' +
             v + ' ∈ J ' + coche(dans(J(), x()));
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 18, color: INK,
          cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 9 });

    var verdict = board.create('text', [(GMIN + GMAX) / 2, -4.5, function () {
      return fmt(x()) + (dansResultat(x()) ? ' ∈ ' : ' ∉ ') + 'I ' + signe() + ' J';
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 24, color: C_YES,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });

    board.create('text', [(GMIN + GMAX) / 2, -5.9, function () { return memo(); }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: SOFT,
      fixed: true, highlight: false, layer: 9
    });

    // Le commentaire attrape le cas le plus instructif du moment : le point
    // posé sur une borne, l'intersection vide, l'union en deux morceaux.
    function memo() {
      var i = I(), j = J(), xv = x();
      var surBorne = [[i.a, 'la borne gauche de I', i.cl], [i.b, 'la borne droite de I', i.cr],
                      [j.a, 'la borne gauche de J', j.cl], [j.b, 'la borne droite de J', j.cr]]
        .filter(function (b) { return b[0] === xv; });
      if (surBorne.length) {
        var b = surBorne[0];
        return '<span style="color:' + (b[2] ? C_YES : C_NO) + ';font-weight:700">' +
          'x est exactement sur ' + b[1] + ' : le crochet est ' +
          (b[2] ? 'fermé, elle est donc comprise.' : 'ouvert, elle est donc exclue.') +
          '</span>';
      }
      if (mode === 'inter' && !morceaux().length) {
        return 'Les deux barres ne se recouvrent nulle part : ' +
          '<strong>I ∩ J = ∅</strong>. Aucun nombre ne peut être dans les deux.';
      }
      if (mode === 'union' && morceaux().length === 2) {
        return 'Les deux barres ne se touchent pas : l\'union reste en ' +
          '<strong>deux morceaux</strong> et garde son symbole ∪ — ce n\'est pas un ' +
          'intervalle.';
      }
      return mode === 'union'
        ? 'Union : il suffit d\'être dans <strong>l\'un</strong> des deux intervalles.'
        : 'Intersection : il faut être dans <strong>les deux</strong> à la fois.';
    }

    /* ==================================================================== */
    /* Rafraîchissement                                                     */
    /* ==================================================================== */
    function refresh() {
      var ms = morceaux();
      var dedans = dansResultat(x());
      var col = dedans ? C_YES : C_NO;

      // Les bornes de I et de J : pleines si comprises, creuses si exclues.
      attr(PA, 'fillColor', clI ? C_I : '#ffffff'); attr(PA, 'strokeColor', C_I);
      attr(PB, 'fillColor', crI ? C_I : '#ffffff'); attr(PB, 'strokeColor', C_I);
      attr(QA, 'fillColor', clJ ? C_J : '#ffffff'); attr(QA, 'strokeColor', C_J);
      attr(QB, 'fillColor', crJ ? C_J : '#ffffff'); attr(QB, 'strokeColor', C_J);

      // Les morceaux du résultat.
      pieces.forEach(function (p, k) {
        var m = ms[k];
        var seul = !!m && m.a === m.b;
        show(p.seg, !!m && !seul);
        show(p.bande, !!m && !seul);
        show(p.seul, seul);
        p.cg.forEach(function (s) { show(s, !!m && !seul); });
        p.cd.forEach(function (s) { show(s, !!m && !seul); });
      });
      show(vide, !ms.length);

      // La trace : chaque tronçon prend la couleur de ce qu'il traverse, et
      // n'apparaît que là où le point est déjà passé.
      var ts = troncons();
      traces.forEach(function (t, k) {
        var z = ts[k];
        if (!z) { show(t.seg, false); return; }
        show(t.seg, x() > z[0]);
        attr(t.seg, 'strokeColor', dansResultat((z[0] + z[1]) / 2) ? C_YES : C_NO);
      });
      bornesTrace.forEach(function (b) {
        var xb = b.x();
        show(b.p, x() >= xb && xb > XA && xb < XB);
        attr(b.p, 'fillColor', dansResultat(xb) ? C_YES : C_NO);
        attr(b.p, 'strokeColor', dansResultat(xb) ? C_YES : C_NO);
      });

      attr(PT, 'fillColor', col);
      attr(PT, 'strokeColor', col);
      attr(fil, 'strokeColor', col);
      attr(verdict, 'color', col);
      attr(labX, 'color', col);
    }

    /* ==================================================================== */
    /* Le parcours                                                          */
    /*                                                                      */
    /* Une étape = un tronçon. Le point part de là où il se trouve : les      */
    /* étapes lisent leur origine au premier appel plutôt que de la figer,    */
    /* ce qui permet de réarmer le parcours après un déplacement de borne     */
    /* sans faire sauter le point.                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    var xDepart = XA;

    function versX(cible, duree) {
      var de = null;
      return {
        dur: duree,
        step: function (p) {
          if (p === 0) de = x();
          setX(de + (cible - de) * p);
          refresh();
        },
        after: function () { setX(cible); refresh(); }
      };
    }
    function etapes() {
      var out = [], prec = x();
      frontieres().concat([XB]).forEach(function (c) {
        if (c <= prec + 1e-9) return;
        out.push(versX(c, Math.max(280, 150 * (c - prec))));
        prec = c;
      });
      return out;
    }
    // Réarme sans bouger le point : « Précédent » ramène là où on en était.
    function armer() {
      xDepart = x();
      anim.runSteps(etapes(), function () { setX(xDepart); refresh(); });
    }
    function rejouer() {
      anim.cancel();
      setX(XA);
      refresh();
      armer();
      board.update();
    }
    // Toute manipulation redonne un parcours cohérent avec la nouvelle figure.
    function touche() { armer(); board.update(); }

    /* ==================================================================== */
    /* Panneau                                                              */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    var derniere = '';

    function bornesTexte() {
      var i = I(), j = J();
      if (mode === 'inter') {
        var lo = gaucheMax(i, j), hi = droiteMin(i, j);
        return 'On prend la <strong>plus grande</strong> des bornes gauches (' +
          fmt(lo.x) + ') et la <strong>plus petite</strong> des bornes droites (' +
          fmt(hi.x) + ').';
      }
      if (!recolle()) {
        return 'Les deux intervalles ne se touchent pas : on ne peut pas les réunir en ' +
          'un seul, la réponse <strong>garde le symbole ∪</strong>.';
      }
      var g = gaucheMin(i, j), d = droiteMax(i, j);
      return 'Les deux intervalles se recollent : on prend la <strong>plus petite</strong> ' +
        'des bornes gauches (' + fmt(g.x) + ') et la <strong>plus grande</strong> des ' +
        'bornes droites (' + fmt(d.x) + ').';
    }

    function renderPanel() {
      var i = I(), j = J(), xv = x();
      var dI = dans(i, xv), dJ = dans(j, xv), ok = dansResultat(xv);

      panel.innerHTML =
        '<div class="props-name" style="color:' + C_YES + '">I ' + signe() + ' J = ' +
          resultat() + '</div>' +

        '<div class="props-label">Les deux intervalles</div>' +
        '<ul class="props-list">' +
          '<li><strong style="color:' + C_I + '">' + ecriture(i) + '</strong></li>' +
          '<li><strong style="color:' + C_J + '">' + ecriture(j) + '</strong></li>' +
        '</ul>' +

        '<div class="props-label">Comment on lit le résultat</div>' +
        '<p style="margin:.2rem 0 .5rem">' +
          (mode === 'union'
            ? 'L\'<strong>union</strong> rassemble ce que les deux barres recouvrent ' +
              '<em>à elles deux</em>.'
            : 'L\'<strong>intersection</strong> ne garde que la partie <em>commune</em> ' +
              'aux deux barres.') +
          ' ' + bornesTexte() + '</p>' +

        '<div class="props-label">Le point x = ' + fmt(xv) + '</div>' +
        '<ul class="props-list">' +
          '<li>' + fmt(xv) + ' ∈ I ? <strong style="color:' + (dI ? C_YES : C_NO) + '">' +
            (dI ? 'oui' : 'non') + '</strong></li>' +
          '<li>' + fmt(xv) + ' ∈ J ? <strong style="color:' + (dJ ? C_YES : C_NO) + '">' +
            (dJ ? 'oui' : 'non') + '</strong></li>' +
        '</ul>' +
        '<p style="margin:.2rem 0 0">On demande « dans I <strong>' + motLien() +
          '</strong> dans J » : <strong style="color:' + (ok ? C_YES : C_NO) + '">' +
          fmt(xv) + (ok ? ' ∈ ' : ' ∉ ') + 'I ' + signe() + ' J</strong>.</p>' +

        '<p style="margin:.5rem 0 0;font-size:.85rem;color:var(--ink-soft)">' +
          'Le « ou » de l\'union n\'est pas exclusif : un nombre qui est dans les ' +
          '<em>deux</em> intervalles est bien dans leur union. C\'est le « et » de ' +
          'l\'intersection qui est exigeant.</p>';
    }

    // Le panneau ne se reconstruit que si quelque chose a changé : pendant
    // l'animation, le point avance de 60 images par seconde.
    function panneauSiBesoin() {
      var s = [mode, PA.X(), PB.X(), QA.X(), QB.X(), clI, crI, clJ, crJ,
               Math.round(x() * 10)].join('|');
      if (s === derniere) return;
      derniere = s;
      renderPanel();
    }

    board.on('update', function () { refresh(); panneauSiBesoin(); });

    /* ==================================================================== */
    /* Tirage d'un autre couple d'intervalles                               */
    /* ==================================================================== */
    function rnd(a0, b0) { return a0 + Math.floor(Math.random() * (b0 - a0 + 1)); }

    function pose4(a1, b1, a2, b2) {
      poser(PA, a1, YI); poser(PB, b1, YI);
      poser(QA, a2, YJ); poser(QB, b2, YJ);
      clI = Math.random() < 0.7; crI = Math.random() < 0.7;
      clJ = Math.random() < 0.7; crJ = Math.random() < 0.7;
      syncControls();
      rejouer();
    }

    function autres() {
      // Un cas sur quatre, les intervalles sont disjoints : c'est là qu'on
      // rencontre l'intersection vide et l'union en deux morceaux.
      var disjoints = Math.random() < 0.25;
      var a1 = rnd(BMIN, 1), b1 = a1 + rnd(2, 5);
      var a2 = disjoints ? Math.min(b1 + rnd(1, 3), BMAX - 2)
                         : Math.max(BMIN, rnd(a1 - 1, b1));
      var b2 = Math.min(a2 + rnd(2, 6), BMAX);
      if (b2 - a2 < 1) { a2 = BMAX - 2; b2 = BMAX; }
      pose4(a1, b1, a2, b2);
    }

    // Le même tirage, mais avec un vrai TROU garanti entre I et J : le cas où
    // l'intersection est vide et où l'union reste en deux morceaux. C'est le
    // bouton à montrer en classe quand on introduit ∅ et le ∪ qui ne se
    // simplifie pas.
    function disjoints() {
      var a1 = rnd(BMIN, -1), b1 = a1 + rnd(2, 4);
      var a2 = b1 + rnd(1, 3);                       // au moins une unité de trou
      var b2 = Math.min(a2 + rnd(2, 5), BMAX);
      pose4(a1, b1, a2, b2);
    }

    /* ==================================================================== */
    /* Contrôles                                                            */
    /* ==================================================================== */
    function syncControls() {
      if (!refs) return;
      refs.cli.checked = clI; refs.cri.checked = crI;
      refs.clj.checked = clJ; refs.crj.checked = crJ;
      refs.mode.textContent = mode === 'union' ? '↔ Voir I ∩ J' : '↔ Voir I ∪ J';
    }

    refs = mv.addControls([
      { type: 'button', id: 'mode', label: '↔ Voir I ∩ J', onClick: function () {
          mode = mode === 'union' ? 'inter' : 'union';
          syncControls();
          rejouer();
        } },
      { type: 'button', id: 'play', label: '▶ Refaire le parcours', onClick: rejouer },
      { type: 'checkbox', id: 'cli', label: 'I : borne gauche comprise', checked: true,
        onChange: function (on) { clI = on; touche(); } },
      { type: 'checkbox', id: 'cri', label: 'I : borne droite comprise', checked: true,
        onChange: function (on) { crI = on; touche(); } },
      { type: 'checkbox', id: 'clj', label: 'J : borne gauche comprise', checked: true,
        onChange: function (on) { clJ = on; touche(); } },
      { type: 'checkbox', id: 'crj', label: 'J : borne droite comprise', checked: true,
        onChange: function (on) { crJ = on; touche(); } },
      { type: 'button', id: 'dice', label: '🎲 Deux autres intervalles', onClick: autres },
      { type: 'button', id: 'gap', label: '∅ Intervalles disjoints', onClick: disjoints }
    ]);

    mv.extras.appendChild(panel);

    syncControls();
    setX(XA);
    armer();
    board.update();
  }
});
