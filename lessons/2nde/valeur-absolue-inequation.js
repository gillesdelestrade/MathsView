/*
 * L'inéquation |x − a| ⩽ r (2nde) — pourquoi la solution est [a − r ; a + r].
 *
 * UNE SEULE droite graduée, et la démonstration se joue dessus, en glissant :
 *
 *   1) On place x − a. |x − a| est sa DISTANCE à 0 (la double flèche sous
 *      l'axe, qui gardera la même longueur du début à la fin).
 *   2) Dire que cette distance est ⩽ r, c'est dire que x − a est coincé entre
 *      −r et r : la zone bleue [−r ; r] s'ouvre depuis 0, symétriquement.
 *   3) Pour revenir à x, on AJOUTE a — puisque x = (x − a) + a. Le point
 *      glisse de +a le long de l'axe, porté par un arc « + a ».
 *   4) La borne −r glisse du même coup : elle devient a − r.
 *   5) La borne r devient a + r.
 *   6) La zone bleue se referme entre les deux : S = [a − r ; a + r].
 *
 * Les trois arcs « + a » restent tracés à la fin, à trois hauteurs
 * différentes : ils ont tous exactement la MÊME longueur, et c'est là tout le
 * théorème — ajouter a translate tout le monde du même pas, sans changer ni
 * les distances ni l'ordre.
 *
 * Chaque objet mobile porte deux étiquettes qui basculent en cours de route :
 * sa valeur (sur la graduation) et son nom, « −r » qui devient « a − r »,
 * « 0 » qui devient « a », « x − a » qui devient « x ». La démonstration est
 * donc lisible sur l'axe lui-même, sans quitter la figure des yeux.
 *
 * Entre les étapes 4 et 5, la barre bleue s'efface : une seule borne a bougé,
 * l'intervalle affiché n'aurait plus de sens. Seuls les crochets voyagent.
 *
 * Deux détails qui ne sont pas décoratifs :
 *   • la double flèche de distance glisse avec le point et le centre : sa
 *     longueur ne change JAMAIS, c'est pourquoi |x − a| se lit aussi bien
 *     « distance de x − a à 0 » que « distance de x à a » ;
 *   • quand a est négatif, l'inéquation s'écrit |x + 4| ⩽ r et tout glisse
 *     vers la GAUCHE : le sens du glissement, c'est le signe de a.
 *
 * Le point x se déplace à la souris : la figure dit tout de suite (vert /
 * rouge) si l'inéquation est vraie.
 */
MathsView.register({
  id: 'valeur-absolue-inequation',
  title: 'Inéquation |x − a| ⩽ r',
  level: '2nde',
  category: 'calcul',
  subcategory: 'Ensembles de nombres',
  exercices: ['val-abs'],
  theme: 'Nombres — |x − a| ⩽ r, distance et intervalle [a − r ; a + r]',
  description:
    '\\(|x-a|\\) est la <strong>distance</strong> entre \\(x\\) et \\(a\\). ' +
    'L\'inéquation \\(|x-a|\\leqslant r\\) demande donc tous les nombres situés ' +
    '<strong>à une distance au plus \\(r\\) de \\(a\\)</strong> — et la réponse ' +
    'est l\'intervalle \\([a-r\\,;a+r]\\).' +
    '<br>La figure le <strong>démontre</strong> sur une seule droite graduée. ' +
    'D\'abord \\(x-a\\), dont la distance à <strong>0</strong> est au plus \\(r\\) : ' +
    'il est donc entre \\(-r\\) et \\(r\\). Puis on <strong>ajoute \\(a\\)</strong>, ' +
    'puisque \\(x=(x-a)+a\\) : tout <strong>glisse de \\(+a\\)</strong> le long de ' +
    'l\'axe. Le point devient \\(x\\), la borne \\(-r\\) devient \\(a-r\\), la borne ' +
    '\\(r\\) devient \\(a+r\\) — trois arcs, tous de la même longueur.' +
    '<br>Règle les curseurs <strong>a</strong> et <strong>r</strong>, ' +
    '<strong>déplace le point</strong> à la souris, puis clique sur ' +
    '<strong>▶ Animer</strong> (ou coche <strong>Pas à pas</strong>).' +
    '<br><em>Essaie \\(a\\) négatif : l\'inéquation s\'écrit alors \\(|x+4|\\leqslant r\\), ' +
    'et tout glisse vers la gauche.</em>',
  notes:
    '<ul>' +
    '<li><strong>La valeur absolue, c\'est une distance.</strong> \\(|X|\\) est la ' +
    'distance de \\(X\\) à \\(0\\) ; plus généralement \\(|x-a|\\) est la distance ' +
    'entre \\(x\\) et \\(a\\) sur la droite graduée. C\'est la bonne façon de lire ' +
    'toutes les inéquations de ce chapitre.</li>' +
    '<li><strong>Le théorème de base.</strong> Pour \\(r\\geqslant 0\\) : ' +
    '\\(|X|\\leqslant r\\iff -r\\leqslant X\\leqslant r\\). Une distance à 0 est au ' +
    'plus \\(r\\) exactement quand le nombre est entre \\(-r\\) et \\(r\\).</li>' +
    '<li><strong>La démonstration.</strong> On l\'applique à \\(X=x-a\\), puis on ' +
    'ajoute \\(a\\) aux trois membres — ce qui <strong>conserve l\'ordre</strong> : ' +
    '$$|x-a|\\leqslant r\\iff -r\\leqslant x-a\\leqslant r\\iff a-r\\leqslant x\\leqslant a+r$$ ' +
    'd\'où \\(S=[a-r\\,;a+r]\\). Sur la figure, « ajouter \\(a\\) aux trois membres », ' +
    'c\'est exactement le glissement de \\(+a\\).</li>' +
    '<li><strong>Centre et rayon.</strong> \\([a-r\\,;a+r]\\) est l\'intervalle de ' +
    '<strong>centre \\(a\\)</strong> et de <strong>rayon \\(r\\)</strong> ; son ' +
    'amplitude vaut \\(2r\\). Réciproquement, tout intervalle \\([m\\,;M]\\) s\'écrit ' +
    '\\(|x-c|\\leqslant\\rho\\) avec \\(c=\\dfrac{m+M}{2}\\) (le centre) et ' +
    '\\(\\rho=\\dfrac{M-m}{2}\\) (la moitié de la longueur). Ainsi ' +
    '\\([1\\,;5]\\) c\'est \\(|x-3|\\leqslant 2\\).</li>' +
    '<li><strong>Inégalité stricte.</strong> \\(|x-a|<r\\iff x\\in\\;]a-r\\,;a+r[\\) : ' +
    'mêmes bornes, mais crochets ouverts — les deux extrémités ne conviennent plus.</li>' +
    '<li><strong>L\'inégalité contraire.</strong> \\(|x-a|\\geqslant r\\) donne cette ' +
    'fois <em>deux</em> morceaux : \\(]-\\infty\\,;a-r]\\cup[a+r\\,;+\\infty[\\) — tout ' +
    'ce qui est <strong>en dehors</strong> de l\'intervalle.</li>' +
    '<li><strong>Cas limites.</strong> Si \\(r=0\\), il ne reste que \\(x=a\\). Si ' +
    '\\(r<0\\), aucune solution : une distance n\'est jamais négative.</li>' +
    '<li><strong>Le piège du signe.</strong> \\(|x+4|\\leqslant 2\\) se lit ' +
    '\\(|x-(-4)|\\leqslant 2\\) : ici \\(a=-4\\), et la solution est ' +
    '\\([-6\\,;-2]\\), pas \\([2\\,;6]\\). Le centre est toujours le nombre qu\'on ' +
    '<em>soustrait</em>.</li>' +
    '<li><strong>À quoi ça sert.</strong> C\'est le langage des valeurs approchées : ' +
    '« \\(x\\) est une valeur approchée de \\(\\pi\\) à \\(10^{-3}\\) près » s\'écrit ' +
    '\\(|x-\\pi|\\leqslant 10^{-3}\\), c\'est-à-dire ' +
    '\\(x\\in[\\pi-10^{-3}\\,;\\pi+10^{-3}]\\).</li>' +
    '</ul>',
  board: {
    boundingbox: [-10.5, 5.3, 10.5, -3.7], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_INT = '#2563eb';   // bleu : l'intervalle, ses bornes, ses crochets
    var C_A   = '#7c3aed';   // violet : le centre, et le glissement « + a »
    var C_OK  = '#16a34a';   // vert : l'inéquation est vraie pour ce x
    var C_NO  = '#dc2626';   // rouge : elle est fausse
    var INK   = '#334155';
    var SOFT  = '#94a3b8';

    var Y  = 0;              // l'axe, unique
    var XM = 9;              // il va de −9 à 9
    var H  = 0.30;           // demi-hauteur des crochets
    var ARROW = { type: 2, size: 7 };

    var YVAL = -0.58;        // les valeurs, sous l'axe
    var YNOM = -1.18;        // les noms, en dessous
    var YDIS = -1.95;        // la double flèche de la distance
    var HARC = [0.75, 1.35, 1.95];   // hauteur des trois arcs « + a »

    /* ==================================================================== */
    /* État                                                                 */
    /* ==================================================================== */
    var a = 3, r = 2, xv = 4.5;

    // Avancement de chacune des six étapes (1 = acquise). Chaque objet mobile
    // se déduit de ces six nombres : une étape n'a donc qu'à les régler, et
    // « Précédent » peut la rejouer telle quelle.
    var rv = { dist: 1, zone: 1, tpt: 1, tmin: 1, tmax: 1, sol: 1 };
    var ORDRE = ['dist', 'zone', 'tpt', 'tmin', 'tmax', 'sol'];
    function etape() {
      var e = -1;
      ORDRE.forEach(function (k, i) { if (rv[k] > 0.05) e = i; });
      return e;
    }

    function fmt(v) {
      var t = Math.round(v * 100) / 100;
      if (Object.is(t, -0)) t = 0;
      return t.toString().replace('-', '−').replace('.', ',');
    }
    // Un nombre négatif se met entre parenthèses derrière un signe : « + (−4) ».
    function paren(v) { return v < 0 ? '(' + fmt(v) + ')' : fmt(v); }
    // L'écriture de x − a : « x − 3 », « x + 4 » si a < 0, « x » si a = 0.
    function expr() {
      if (a === 0) return 'x';
      return 'x ' + (a < 0 ? '+ ' + fmt(-a) : '− ' + fmt(a));
    }
    function absExpr() { return a === 0 ? '|x|' : '|' + expr() + '|'; }

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
    /* Où se trouve chaque objet mobile                                      */
    /*                                                                       */
    /* Avant le glissement, tout est « en x − a » : le centre en 0, les      */
    /* bornes en −r et r. Chaque étape ajoute a × son avancement.            */
    /* ==================================================================== */
    function dist() { return Math.abs(xv - a); }
    function ok() { return dist() <= r + 1e-9; }
    function col() { return ok() ? C_OK : C_NO; }

    // L'ouverture de la zone [−r ; r] à l'étape 2 ; ensuite elle est acquise.
    function zf() { return (rv.tmin > 0 || rv.tmax > 0) ? 1 : rv.zone; }

    function cPos() { return a * rv.tpt; }                  // le centre : 0 → a
    function pPos() { return (xv - a) + a * rv.tpt; }       // le point : x − a → x
    function biPos() { return -r * zf() + a * rv.tmin; }    // la borne du bas
    function bsPos() { return  r * zf() + a * rv.tmax; }    // la borne du haut

    /* ==================================================================== */
    /* Le point, déplaçable à la souris                                      */
    /*                                                                       */
    /* C'est le seul objet libre de la figure. On lit son abscisse, on en     */
    /* retire le glissement déjà effectué, et on le repose à sa place.        */
    /* ==================================================================== */
    function clampX(v) {
      var lo = Math.max(-XM, a - XM), hi = Math.min(XM, a + XM);
      return Math.max(lo, Math.min(hi, Math.round(v * 2) / 2));
    }
    var PX = board.create('point', [xv, Y], {
      size: 6, strokeWidth: 2, strokeColor: '#fff', fixed: false,
      withLabel: false, showInfobox: false, layer: 9
    });
    function syncPX() { PX.setPosition(JXG.COORDS_BY_USER, [pPos(), Y]); }
    PX.on('drag', function () {
      // Le point est posé en pPos() = x − a + a·tpt : pour remonter à x, on
      // retire le glissement qui RESTE à faire, pas celui déjà fait.
      xv = clampX(PX.X() + a * (1 - rv.tpt));
      syncPX();
      board.update();
    });

    /* ==================================================================== */
    /* La droite graduée                                                     */
    /* ==================================================================== */
    board.create('segment', [[-XM - 0.7, Y], [XM + 0.7, Y]], {
      strokeColor: INK, strokeWidth: 2, firstArrow: ARROW, lastArrow: ARROW,
      fixed: true, highlight: false, layer: 4
    });
    for (var v = -XM; v <= XM; v++) {
      (function (v) {
        board.create('segment', [[v, Y - 0.16], [v, Y + 0.16]], {
          strokeColor: v === 0 ? INK : SOFT, strokeWidth: v === 0 ? 2.5 : 1.2,
          fixed: true, highlight: false, layer: 4
        });
        board.create('text', [v, YVAL, String(v).replace('-', '−')], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: SOFT,
          fixed: true, highlight: false, layer: 4
        });
      })(v);
    }

    /* ==================================================================== */
    /* Fabriques                                                             */
    /* ==================================================================== */
    // Un crochet fermé : la barre verticale et deux bras tournés vers
    // l'intérieur de l'intervalle (dir = +1 à gauche, −1 à droite).
    function crochet(xf, dir) {
      var V1 = pt(xf, function () { return Y - H; });
      var V2 = pt(xf, function () { return Y + H; });
      var A1 = pt(function () { return xf() + 0.35 * dir; }, function () { return Y + H; });
      var A2 = pt(function () { return xf() + 0.35 * dir; }, function () { return Y - H; });
      var o = { strokeWidth: 4, strokeColor: C_INT, lineCap: 'round',
                fixed: true, highlight: false, layer: 8 };
      return [board.create('segment', [V1, V2], o),
              board.create('segment', [V2, A1], o),
              board.create('segment', [V1, A2], o)];
    }
    // Une étiquette posée sur fond blanc : elle masque la graduation grise
    // qu'elle recouvre.
    function etiquette(xf, y, txt, couleur, taille) {
      return board.create('text', [xf, y, txt], {
        anchorX: 'middle', anchorY: 'middle', fontSize: taille || 13, color: couleur,
        cssStyle: 'font-weight:800;background:rgba(255,255,255,.9);' +
                  'padding:0 3px;border-radius:5px;white-space:nowrap',
        fixed: true, highlight: false, layer: 9
      });
    }
    // L'arc « saut de puce » : il se trace en même temps que l'objet glisse,
    // sa pointe reste au-dessus de lui, et il retombe pile à l'arrivée.
    function arc(fdep, h, fav) {
      var c = board.create('curve', [
        function (t) { return fdep() + a * fav() * t; },
        function (t) { return h * Math.sin(Math.PI * fav() * t); },
        0, 1
      ], { strokeColor: C_A, strokeWidth: 2.5, lastArrow: ARROW,
           fixed: true, highlight: false, layer: 6 });
      var lab = board.create('text', [
        function () { return fdep() + a * fav() / 2; },
        function () { return h * Math.sin(Math.PI * fav() / 2) + 0.24; },
        function () { return '+ ' + paren(a); }
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: C_A,
           cssStyle: 'font-weight:800;background:rgba(255,255,255,.9);padding:0 3px;' +
                     'border-radius:5px', fixed: true, highlight: false, layer: 7 });
      return { c: c, lab: lab };
    }

    /* ==================================================================== */
    /* L'intervalle : la barre et ses deux crochets                          */
    /* ==================================================================== */
    var barre = board.create('segment', [pt(biPos, function () { return Y; }),
                                         pt(bsPos, function () { return Y; })], {
      strokeColor: C_INT, strokeWidth: 7, fixed: true, highlight: false, layer: 5
    });
    var crL = crochet(biPos, +1);
    var crR = crochet(bsPos, -1);

    /* ==================================================================== */
    /* Le centre (0 puis a) et le point (x − a puis x)                        */
    /* ==================================================================== */
    var ptC = board.create('point', [cPos, Y], {
      size: 5, face: 'o', fillColor: C_A, strokeColor: '#fff', strokeWidth: 2,
      fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8
    });

    // Chaque objet mobile porte sa VALEUR sur la graduation, et son NOM juste
    // en dessous — le nom bascule en cours de glissement : c'est là qu'on voit
    // −r devenir a − r.
    function bascule(prog, avant, apres) {
      return function () { return prog() > 0.5 ? apres() : avant(); };
    }
    var valC = etiquette(cPos, YVAL, function () { return fmt(cPos()); }, C_A, 12);
    var nomC = etiquette(cPos, YNOM, bascule(function () { return rv.tpt; },
      function () { return '0'; }, function () { return 'a'; }), C_A, 12);

    var valBI = etiquette(biPos, YVAL, function () { return fmt(biPos()); }, C_INT, 12);
    var nomBI = etiquette(biPos, YNOM, bascule(function () { return rv.tmin; },
      function () { return '−r'; }, function () { return 'a − r'; }), C_INT, 12);

    var valBS = etiquette(bsPos, YVAL, function () { return fmt(bsPos()); }, C_INT, 12);
    var nomBS = etiquette(bsPos, YNOM, bascule(function () { return rv.tmax; },
      function () { return 'r'; }, function () { return 'a + r'; }), C_INT, 12);

    // Le point mobile : son étiquette est au-dessus de l'axe, seule de son côté.
    var labP = etiquette(pPos, 0.52, function () {
      return (rv.tpt > 0.5 ? 'x' : expr()) + ' = ' + fmt(pPos());
    }, C_OK, 13);

    /* ==================================================================== */
    /* Les trois arcs « + a »                                                */
    /* ==================================================================== */
    var arcBI = arc(function () { return -r; }, HARC[0], function () { return rv.tmin; });
    var arcPT = arc(function () { return xv - a; }, HARC[1], function () { return rv.tpt; });
    var arcBS = arc(function () { return r; }, HARC[2], function () { return rv.tmax; });

    /* ==================================================================== */
    /* La distance |x − a| : elle glisse avec le point, sans jamais changer   */
    /* de longueur                                                           */
    /* ==================================================================== */
    var flDist = board.create('segment', [pt(cPos, function () { return YDIS; }),
                                          pt(pPos, function () { return YDIS; })], {
      strokeColor: C_OK, strokeWidth: 2.5, firstArrow: ARROW, lastArrow: ARROW,
      fixed: true, highlight: false, layer: 6
    });
    function montant(fx) {
      return board.create('segment', [pt(fx, function () { return YDIS + 0.22; }),
                                      pt(fx, function () { return Y - 0.16; })], {
        strokeColor: SOFT, strokeWidth: 1, dash: 2, fixed: true, highlight: false, layer: 3
      });
    }
    var mC = montant(cPos), mP = montant(pPos);
    var labDist = board.create('text', [
      function () { return (cPos() + pPos()) / 2; }, YDIS - 0.45,
      function () {
        return absExpr() + ' = ' + fmt(dist()) +
               '<span style="color:' + (ok() ? C_OK : C_NO) + '"> ' +
               (ok() ? '⩽' : '&gt;') + ' r = ' + fmt(r) + '</span>';
      }
    ], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK,
         cssStyle: 'font-weight:800;background:rgba(255,255,255,.9);padding:0 3px;' +
                   'border-radius:5px;white-space:nowrap',
         fixed: true, highlight: false, layer: 9 });

    /* ==================================================================== */
    /* Le titre, et les deux lignes qui racontent l'étape en cours            */
    /* ==================================================================== */
    board.create('text', [0, 4.8, function () {
      return absExpr() + ' ⩽ <span style="color:' + C_INT + '">' + fmt(r) + '</span>';
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 22, color: INK,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });

    function capHaut() {
      var e = etape();
      if (e < 0) return 'On cherche tous les x dont la distance à a est au plus r.';
      if (e === 0) return '<b>' + absExpr() + '</b> est la <b>distance</b> entre <b>' +
                          expr() + '</b> et <b>0</b>.';
      if (e === 1) return 'Cette distance est au plus r : <b>' + expr() +
                          '</b> est donc entre <b>−' + fmt(r) + '</b> et <b>' + fmt(r) + '</b>.';
      if (e === 2) return 'On <b>ajoute ' + fmt(a) + '</b> : x = (' + expr() + ') + ' +
                          paren(a) + ', le point glisse et devient <b>x</b>.';
      if (e === 3) return 'La borne <b>−' + fmt(r) + '</b> glisse du même pas : ' +
                          '−' + fmt(r) + ' + ' + paren(a) + ' = <b>' + fmt(a - r) + '</b>.';
      if (e === 4) return 'Et la borne <b>' + fmt(r) + '</b> devient ' +
                          fmt(r) + ' + ' + paren(a) + ' = <b>' + fmt(a + r) + '</b>.';
      return 'Les trois arcs ont la <b>même longueur</b> : ajouter ' + fmt(a) +
             ' translate tout du même pas.';
    }
    function capBas() {
      var e = etape();
      if (e <= 1) return '−' + fmt(r) + ' ⩽ ' + expr() + ' ⩽ ' + fmt(r) +
                         ' — reste à revenir à x.';
      if (e < 5) return 'On ajoute ' + fmt(a) + ' aux trois membres : l\'ordre est conservé.';
      return '<b style="color:' + C_INT + '">S = [' + fmt(a - r) + ' ; ' + fmt(a + r) +
             ']</b> : l\'intervalle de centre a et de rayon r.';
    }
    board.create('text', [0, 3.85, capHaut], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: INK,
      fixed: true, highlight: false, layer: 9
    });
    board.create('text', [0, -3.15, capBas], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: INK,
      fixed: true, highlight: false, layer: 9
    });

    /* ==================================================================== */
    /* Rafraîchissement                                                      */
    /* ==================================================================== */
    function opac(v) { return Math.round(100 * Math.min(1, Math.max(0, v))) / 100; }

    function refresh() {
      var c = col();

      /* le point et sa distance au centre --------------------------------- */
      attr(PX, 'fillColor', c);
      attr(labP, 'color', c);
      show(labP, rv.dist > 0.35);
      show(PX, rv.dist > 0.35);
      attr(ptC, 'fillColor', C_A);
      show(ptC, rv.dist > 0.35);
      show(valC, rv.dist > 0.35);
      show(nomC, rv.dist > 0.35);

      // Une double flèche de longueur nulle ne se dessine pas : x est sur a.
      var large = dist() > 0.05 && rv.dist > 0.35;
      show(flDist, large); show(mC, large); show(mP, large);
      attr(flDist, 'strokeColor', c);
      attr(flDist, 'strokeOpacity', opac(rv.dist));
      show(labDist, rv.dist > 0.35);

      /* la zone [−r ; r] puis [a − r ; a + r] ------------------------------ */
      var vz = zf();
      var ouverte = vz > 0.02;
      // La barre s'efface tant qu'une seule des deux bornes a glissé :
      // l'intervalle affiché n'aurait pas de sens.
      var enRoute = rv.tmin > 0.02 || rv.tmax > 0.02;
      var opBarre = enRoute ? rv.sol : rv.zone;
      show(barre, ouverte && opBarre > 0.02);
      attr(barre, 'strokeOpacity', opac(opBarre));

      crL.concat(crR).forEach(function (s) {
        show(s, ouverte);
        attr(s, 'strokeOpacity', opac(rv.zone));
      });
      [valBI, nomBI, valBS, nomBS].forEach(function (t) { show(t, vz > 0.9); });

      /* les trois arcs « + a » --------------------------------------------- */
      // À a = 0 il n'y a rien à translater : l'arc serait un point.
      [[arcBI, rv.tmin], [arcPT, rv.tpt], [arcBS, rv.tmax]].forEach(function (p) {
        var vu = p[1] > 0.02 && a !== 0;
        show(p[0].c, vu);
        show(p[0].lab, vu && p[1] > 0.25);
      });
    }

    /* ==================================================================== */
    /* Panneau : la démonstration, ligne à ligne                             */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';

    function ligne(vue, formule, justif) {
      return '<div class="' + (vue ? '' : 'off') + '"><b>' + formule + '</b>' +
             (justif ? '<i>' + justif + '</i>' : '') + '</div>';
    }

    function renderPanel() {
      var e = etape();
      var I = '[' + fmt(a - r) + ' ; ' + fmt(a + r) + ']';
      var bleu = function (s) { return '<span style="color:' + C_INT + '">' + s + '</span>'; };

      panel.innerHTML =
        '<div class="props-name" style="color:' + INK + '">' + absExpr() +
          ' ⩽ ' + bleu(fmt(r)) + '</div>' +
        '<p style="margin:.3rem 0 .6rem">Se lit : « la <strong>distance</strong> entre ' +
          'x et <strong style="color:' + C_A + '">' + fmt(a) + '</strong> est au plus ' +
          '<strong style="color:' + C_INT + '">' + fmt(r) + '</strong> ».' +
          (a < 0
            ? ' <em>Attention : ici a = ' + fmt(a) + ', car ' + expr() + ' = x − (' +
              fmt(a) + ').</em>'
            : '') +
        '</p>' +

        '<div class="props-label">La démonstration</div>' +
        '<div class="abs-chain">' +
          ligne(true, absExpr() + ' ⩽ ' + fmt(r), 'l\'inéquation de départ') +
          ligne(e >= 1, '⟺ &nbsp;−' + fmt(r) + ' ⩽ ' + expr() + ' ⩽ ' + fmt(r),
                'une distance à 0 au plus r') +
          ligne(e >= 2, '⟺ &nbsp;−' + fmt(r) + ' + ' + paren(a) + ' ⩽ x ⩽ ' +
                fmt(r) + ' + ' + paren(a),
                'on ajoute ' + fmt(a) + ' aux trois membres') +
          ligne(e >= 4, '⟺ &nbsp;' + fmt(a - r) + ' ⩽ x ⩽ ' + fmt(a + r),
                'l\'ordre est conservé') +
          ligne(e >= 5, '⟺ &nbsp;x ∈ ' + I, 'la même chose, en intervalle') +
        '</div>' +

        '<div class="props-label">Le résultat</div>' +
        '<p style="margin:.2rem 0 .5rem;font-size:1.15rem;font-weight:800;color:' +
          C_INT + '">S = ' + I + '</p>' +
        '<ul class="props-list">' +
          '<li><strong>Centre</strong> a = ' + fmt(a) + ', <strong>rayon</strong> r = ' +
            fmt(r) + ', <strong>amplitude</strong> 2r = ' + fmt(2 * r) + '.</li>' +
          '<li>Les deux bornes sont à la <strong>même distance</strong> r de a : ' +
            'l\'intervalle est <strong>symétrique</strong> autour de a.</li>' +
          '<li>Ajouter a ne change ni les longueurs ni l\'ordre : les trois arcs de la ' +
            'figure ont la même longueur, et la double flèche de la distance garde la ' +
            'sienne pendant tout le glissement.</li>' +
        '</ul>' +

        '<div class="props-label">Le point de test</div>' +
        '<p style="margin:.2rem 0 0">' +
          'x = <strong>' + fmt(xv) + '</strong> : ' + absExpr().replace('x', fmt(xv)) +
          ' = ' + fmt(dist()) + (ok() ? ' ⩽ ' : ' > ') + fmt(r) + ' → ' +
          '<strong style="color:' + col() + '">' +
            (ok() ? 'vrai' : 'faux') + '</strong>, et en effet ' + fmt(xv) +
            (ok() ? ' ∈ ' : ' ∉ ') + I + '.' +
        '</p>';
    }

    board.on('update', function () { refresh(); renderPanel(); });

    /* ==================================================================== */
    /* Animation : les six étapes de la démonstration                        */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function maj() { syncPX(); board.update(); }
    function reset() { ORDRE.forEach(function (k) { rv[k] = 0; }); maj(); }

    function play() {
      reset();
      var durees = [700, 800, 900, 900, 900, 700];
      anim.runSteps(ORDRE.map(function (k, i) {
        return { dur: durees[i], step: function (p) {
          // État absolu : les étapes précédentes sont acquises, les suivantes
          // pas encore. « Précédent » rejoue donc exactement la même figure.
          ORDRE.forEach(function (c, j) { rv[c] = j < i ? 1 : (j === i ? p : 0); });
          syncPX();
        } };
      }), reset);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    mv.addControls([
      { type: 'slider', id: 'a', label: 'a =', min: -4, max: 4, step: 0.5, value: a,
        onInput: function (v) { a = v; xv = clampX(xv); maj(); } },
      { type: 'slider', id: 'r', label: 'r =', min: 0.5, max: 4, step: 0.5, value: r,
        onInput: function (v) { r = v; maj(); } },
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play }
    ]);

    mv.extras.appendChild(panel);
    maj();
  }
});
