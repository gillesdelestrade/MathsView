/*
 * Deux inéquations reliées par « et » ou par « ou » (2nde).
 *
 * L'exercice type du chapitre : « résoudre x > 3 et −4 < x < 5 », réponse
 * attendue sous la forme d'un intervalle. La méthode tient en deux temps, et
 * la figure les sépare nettement :
 *
 *   1. chaque inéquation devient un INTERVALLE, posé sur l'axe
 *          x > 3        ⟺  x ∈ ]3 ; +∞[       (barre bleue)
 *          −4 < x < 5   ⟺  x ∈ ]−4 ; 5[       (barre violette)
 *   2. le mot de liaison dit comment combiner les deux barres
 *          « et »  →  il faut vérifier les DEUX  →  la partie commune   (∩)
 *          « ou »  →  il suffit d'en vérifier UNE →  tout ce qui est couvert (∪)
 *
 *      x > 3                   ]----------------------->
 *      −4 < x < 5         ]-----------[
 *      « et » : S = ]3 ; 5[     ]-------[
 *
 * Le résultat est tracé en vert sous les deux barres, aligné sur les mêmes
 * graduations : ses bornes sont toujours des bornes des deux intervalles, on
 * les lit à la verticale. Un point x glisse sur l'axe et teste les deux
 * inéquations avec un vrai nombre — « 4 > 3 ✓ et −4 < 4 < 5 ✓ » — c'est la
 * définition même de « et » et de « ou », vérifiable sans aucune figure.
 *
 * La leçon « Union et intersection d'intervalles » a déjà montré ∩ et ∪ ;
 * celle-ci part des inéquations, et insiste sur les quatre réponses qui
 * déroutent : un intervalle borné (le cas courant), l'ensemble vide (« et »
 * avec deux barres qui ne se touchent pas), deux morceaux (« ou » avec un
 * trou, on garde le symbole ∪), et ℝ tout entier (« ou » qui recouvre tout).
 *
 * On peut taper n'importe quel exercice du manuel dans la zone de saisie :
 * « x>3 et -4<x<5 », « x<=2 ou x>5 », avec >=, <= ou ⩾, ⩽.
 */
MathsView.register({
  id: 'intervalles-et-ou',
  title: 'Inéquations reliées par « et » ou « ou »',
  level: '2nde',
  category: 'calcul',
  subcategory: 'Ensembles de nombres',
  exercices: ['intervalles-et-ou'],
  theme: 'Nombres — deux inéquations reliées par « et » ou « ou », et l\'intervalle de leurs solutions',
  description:
    'On cherche tous les nombres \\(x\\) qui vérifient <strong>deux inéquations à la ' +
    'fois</strong>, par exemple \\(x>3\\) <strong>et</strong> \\(-4&lt;x&lt;5\\), et on veut la ' +
    'réponse sous la forme d\'un <strong>intervalle</strong>.' +
    '<br>La méthode tient en deux temps. <strong>D\'abord</strong>, chaque inéquation ' +
    'devient un intervalle posé sur l\'axe : \\(x>3\\) donne \\(]3\\,;+\\infty[\\), ' +
    '\\(-4&lt;x&lt;5\\) donne \\(]-4\\,;5[\\). <strong>Ensuite</strong>, le mot de liaison ' +
    'décide : avec « <strong>et</strong> », il faut vérifier les deux, on ne garde que ' +
    'la partie <em>commune</em> aux deux barres (l\'intersection \\(\\cap\\)) ; avec ' +
    '« <strong>ou</strong> », il suffit d\'en vérifier une, on garde tout ce que les ' +
    'barres <em>recouvrent</em> (la réunion \\(\\cup\\)).' +
    '<br>Le résultat se dessine en <strong style="color:#16a34a">vert</strong> sous les ' +
    'deux barres, sur les mêmes graduations : ses bornes se lisent à la verticale. ' +
    'Déplace le point <strong>x</strong> sur l\'axe : il teste les deux inéquations avec ' +
    'un vrai nombre, et dit s\'il est solution.' +
    '<br><em>Clique un exemple, tape le tien (« x&gt;3 et -4&lt;x&lt;5 »), bascule ' +
    '« et » en « ou », ou tire les bornes à la souris. Les quatre réponses possibles ' +
    'sont dans les exemples : un intervalle, <strong>∅</strong>, <strong>deux ' +
    'morceaux</strong>, et <strong>ℝ</strong> tout entier.</em>',
  notes:
    '<ul>' +
    '<li><strong>Traduire d\'abord.</strong> \\(x>a\\iff x\\in\\;]a\\,;+\\infty[\\), ' +
    '\\(x\\leqslant b\\iff x\\in\\;]-\\infty\\,;b]\\), ' +
    '\\(a&lt;x\\leqslant b\\iff x\\in\\;]a\\,;b]\\). Inégalité <em>stricte</em> : crochet ' +
    'ouvert ; inégalité <em>large</em> : crochet fermé ; du côté de l\'infini, toujours ' +
    'ouvert.</li>' +
    '<li><strong>« et » = intersection.</strong> Un nombre convient s\'il vérifie ' +
    '<em>les deux</em> inéquations : \\(x\\in I\\text{ et }x\\in J\\iff x\\in I\\cap J\\). ' +
    'Sur l\'axe, on garde la partie commune : la <strong>plus grande</strong> des bornes ' +
    'gauches et la <strong>plus petite</strong> des bornes droites. ' +
    'Exemple : \\(x>3\\text{ et }-4&lt;x&lt;5\\iff x\\in\\;]3\\,;5[\\).</li>' +
    '<li><strong>« ou » = réunion.</strong> Il suffit de vérifier <em>l\'une</em> des ' +
    'deux : \\(x\\in I\\text{ ou }x\\in J\\iff x\\in I\\cup J\\). On garde tout ce que les ' +
    'barres recouvrent. Le « ou » des mathématiques n\'est pas exclusif : un nombre qui ' +
    'vérifie les deux inéquations est bien solution.</li>' +
    '<li><strong>Quatre réponses possibles.</strong> Un intervalle (le cas courant) ; ' +
    '\\(\\varnothing\\) quand « et » relie deux conditions incompatibles ' +
    '(\\(x\\geqslant 1\\text{ et }x&lt;-2\\)) ; <strong>deux morceaux</strong> quand « ou » ' +
    'laisse un trou (\\(x\\leqslant 2\\text{ ou }x>5\\iff x\\in\\;]-\\infty\\,;2]\\cup\\;]5\\,;+\\infty[\\), ' +
    'on garde le symbole \\(\\cup\\)) ; et \\(\\mathbb{R}\\) tout entier quand « ou » ' +
    'recouvre tout (\\(x&lt;4\\text{ ou }x\\geqslant -1\\)).</li>' +
    '<li><strong>Quand une condition l\'emporte.</strong> \\(x>1\\text{ et }x\\geqslant 4\\) : ' +
    'la plus exigeante gagne, \\(S=[4\\,;+\\infty[\\). \\(x>1\\text{ ou }x\\geqslant 4\\) : ' +
    'la plus large gagne, \\(S=\\;]1\\,;+\\infty[\\).</li>' +
    '<li><strong>Le crochet à une borne partagée.</strong> Avec « et », la borne est ' +
    'comprise seulement si <em>les deux</em> inéquations la gardent ; avec « ou », dès ' +
    'que <em>l\'une</em> la garde. Ainsi \\(x\\leqslant 5\\text{ et }x&lt;5\\iff x&lt;5\\), mais ' +
    '\\(x\\leqslant 5\\text{ ou }x&lt;5\\iff x\\leqslant 5\\).</li>' +
    '<li><strong>Vérifier avec un nombre.</strong> Pour savoir si 4 est solution de ' +
    '\\(x>3\\text{ et }-4&lt;x&lt;5\\), on remplace : \\(4>3\\) vrai, \\(-4&lt;4&lt;5\\) vrai, donc ' +
    'oui. C\'est le test de la figure, et il ne demande aucun dessin.</li>' +
    '</ul>',
  board: {
    boundingbox: [-8.5, 7.5, 11.5, -7.5], keepaspectratio: true,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Inéquations reliées par « et » ou « ou »',
    figures: [{
      legende: 'x > 3 et −4 < x < 5 : on garde ce qui est sous les deux barres → ]3 ; 5[.',
      boundingbox: [-7.6, 5.4, 7.6, -1.4],
      keepaspectratio: false,
      largeur: 62, hauteur: 40,
      dessine: function (board) {
        board.create('segment', [[-6.4, 0], [6.6, 0]], { strokeColor: '#334155', strokeWidth: 1.4, lastArrow: true, fixed: true, highlight: false });
        for (var i = -6; i <= 6; i++) {
          board.create('segment', [[i, -0.12], [i, 0.12]], { strokeColor: '#334155', strokeWidth: 1, fixed: true, highlight: false });
          board.create('text', [i, -0.3, String(i).replace('-', '−')], { anchorX: 'middle', anchorY: 'top', fontSize: 9, color: '#64748b', fixed: true, highlight: false });
        }
        // Crochet en x : d = 1 ouvert vers la droite « [ », d = −1 vers la gauche « ] ».
        function crochet(x, y, d, col) {
          board.create('curve', [[x + 0.22 * d, x, x, x + 0.22 * d], [y + 0.36, y + 0.36, y - 0.36, y - 0.36]], { strokeColor: col, strokeWidth: 2, fixed: true, highlight: false });
        }
        function barre(x1, x2, y, col, nom, formule, infini) {
          board.create('segment', [[x1, y], [x2, y]], { strokeColor: col, strokeWidth: 4, fixed: true, highlight: false, lastArrow: !!infini });
          board.create('polygon', [[x1, y - 0.3], [infini ? 6.6 : x2, y - 0.3], [infini ? 6.6 : x2, y + 0.3], [x1, y + 0.3]], {
            fillColor: col, fillOpacity: .18, borders: { visible: false }, vertices: { visible: false }, highlight: false, fixed: true
          });
          crochet(x1, y, -1, col);
          if (!infini) crochet(x2, y, 1, col);
          [x1].concat(infini ? [] : [x2]).forEach(function (x) {
            board.create('segment', [[x, y - 0.3], [x, 0]], { strokeColor: col, strokeWidth: .8, dash: 2, fixed: true, highlight: false });
          });
          board.create('text', [-7.4, y, nom], { anchorX: 'left', anchorY: 'middle', fontSize: 10, color: col, cssStyle: 'font-weight:700;white-space:nowrap', fixed: true, highlight: false });
          board.create('text', [(x1 + (infini ? 6.4 : x2)) / 2, y + 0.75, formule], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: col, cssStyle: 'white-space:nowrap', fixed: true, highlight: false });
        }
        barre(3, 6.4, 4.1, '#2563eb', 'x > 3', ']3 ; +∞[', true);
        barre(-4, 5, 2.5, '#7c3aed', '−4 < x < 5', ']−4 ; 5[', false);
        barre(3, 5, 0.9, '#16a34a', 'et → S', ']3 ; 5[', false);
      }
    }],
    points: [
      'Chaque inéquation se traduit en intervalle : \\( x > 3 \\) donne \\( ]3\\,;+\\infty[ \\), \\( -4 &lt; x &lt; 5 \\) donne \\( ]-4\\,;5[ \\). Stricte : crochet ouvert ; large : fermé.',
      '« <b>et</b> » : il faut vérifier <b>les deux</b> → on garde la partie <b>commune</b> des deux barres (intersection \\( \\cap \\)).',
      '« <b>ou</b> » : il suffit d\'en vérifier <b>une</b> → on garde tout ce que les barres <b>recouvrent</b> (réunion \\( \\cup \\)).',
      'Avec « et » : la plus grande borne gauche et la plus petite borne droite. Si les barres ne se touchent pas, \\( S = \\varnothing \\).',
      'Avec « ou » : si les barres se recouvrent, un seul intervalle ; sinon deux morceaux reliés par \\( \\cup \\). Si tout l\'axe est couvert, \\( S = \\mathbb{R} \\).'
    ],
    exemples: [
      '\\( x > 3 \\) et \\( -4 &lt; x &lt; 5 \\) : \\( S = \\;]3\\,;5[ \\).',
      '\\( x \\leqslant 2 \\) ou \\( x > 5 \\) : \\( S = \\;]-\\infty\\,;2] \\cup\\; ]5\\,;+\\infty[ \\).',
      '\\( x \\geqslant 1 \\) et \\( x &lt; -2 \\) : \\( S = \\varnothing \\). \\( x &lt; 4 \\) ou \\( x \\geqslant -1 \\) : \\( S = \\mathbb{R} \\).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette et géométrie                                                 */
    /* ==================================================================== */
    var C_1   = '#2563eb';   // bleu   : la première inéquation
    var C_2   = '#7c3aed';   // violet : la seconde
    var C_YES = '#16a34a';   // vert   : les solutions
    var C_NO  = '#dc2626';   // rouge  : ce qui n'en est pas
    var INK   = '#334155';
    var SOFT  = '#64748b';

    var Y1 = 4.45;           // la barre de la première inéquation
    var Y2 = 2.95;           // la seconde
    var YR = 1.45;           // le résultat
    var YL = 0.15;           // la droite graduée
    var H  = 0.34;           // demi-hauteur des crochets
    var GMIN = -8, GMAX = 11;            // premières et dernières graduations
    var BMIN = -7, BMAX = 10;            // là où les bornes peuvent aller
    var XINF_L = GMIN - 0.2, XINF_R = GMAX + 0.2;   // où filent les barres sans borne
    var XMID = (GMIN + GMAX) / 2;

    /* ==================================================================== */
    /* État                                                                 */
    /*                                                                      */
    /* Une condition est un intervalle { a, b, oa, ob } : oa / ob disent si  */
    /* la borne est EXCLUE (inégalité stricte). Une inéquation « x > 3 » a   */
    /* pour borne droite +∞, « x ⩽ 2 » pour borne gauche −∞.                 */
    /* ==================================================================== */
    var conds = [{ a: 3, b: Infinity, oa: true, ob: true },
                 { a: -4, b: 5, oa: true, ob: true }];
    var lien = 'et';         // 'et' ou 'ou'
    var phase = 0;           // 0 : rien ; 1 : 1re traduite ; 2 : les deux ; 3 : résultat
    var prog = 1;            // avancement (0..1) de la phase en cours
    var refs = null;

    function fmt(x) {
      if (x === -Infinity) return '−∞';
      if (x === Infinity) return '+∞';
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
    function yFix(y) { return function () { return y; }; }
    // Une borne infinie n'a pas de place sur l'axe : on la pose au bout.
    function clampe(x) { return Math.max(XINF_L, Math.min(XINF_R, x)); }

    /* ==================================================================== */
    /* Les écritures                                                        */
    /* ==================================================================== */
    // « x > 3 », « x ⩽ 2 », « −4 < x < 5 » — et la même chose avec un nombre
    // à la place de x, pour le test : « −4 < 4 < 5 ».
    function ineg(c, xs) {
      xs = xs || 'x';
      if (c.a === -Infinity) return xs + (c.ob ? ' < ' : ' ⩽ ') + fmt(c.b);
      if (c.b === Infinity) return xs + (c.oa ? ' > ' : ' ⩾ ') + fmt(c.a);
      return fmt(c.a) + (c.oa ? ' < ' : ' ⩽ ') + xs + (c.ob ? ' < ' : ' ⩽ ') + fmt(c.b);
    }
    // La même, pour un texte HTML : « < » et « > » y sont des balises.
    function inegHtml(c, xs) { return ineg(c, xs).replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function notation(m) {
      if (m.a === m.b) return '{ ' + fmt(m.a) + ' }';
      if (m.a === -Infinity && m.b === Infinity) return 'ℝ';
      return (m.oa ? ']' : '[') + ' ' + fmt(m.a) + ' ; ' + fmt(m.b) + ' ' + (m.ob ? '[' : ']');
    }
    function ensemble(ms) { return ms.length ? ms.map(notation).join(' ∪ ') : '∅'; }
    function col(k) { return k === 0 ? C_1 : C_2; }
    function teinte(k, t) { return '<span style="color:' + col(k) + '">' + t + '</span>'; }

    /* ==================================================================== */
    /* Le calcul                                                            */
    /* ==================================================================== */
    function dans(c, x) {
      return (c.oa ? x > c.a : x >= c.a) && (c.ob ? x < c.b : x <= c.b);
    }
    // La définition de « et » et de « ou », appliquée à un nombre.
    function verifie(x) {
      var d1 = dans(conds[0], x), d2 = dans(conds[1], x);
      return lien === 'et' ? (d1 && d2) : (d1 || d2);
    }
    // À bornes égales, c'est le mot de liaison qui tranche le crochet : « et »
    // exclut dès que l'une exclut, « ou » garde dès que l'une garde.
    function gaucheMax(I, J) {
      if (I.a > J.a) return { x: I.a, o: I.oa };
      if (J.a > I.a) return { x: J.a, o: J.oa };
      return { x: I.a, o: I.oa || J.oa };
    }
    function droiteMin(I, J) {
      if (I.b < J.b) return { x: I.b, o: I.ob };
      if (J.b < I.b) return { x: J.b, o: J.ob };
      return { x: I.b, o: I.ob || J.ob };
    }
    function gaucheMin(I, J) {
      if (I.a < J.a) return { x: I.a, o: I.oa };
      if (J.a < I.a) return { x: J.a, o: J.oa };
      return { x: I.a, o: I.oa && J.oa };
    }
    function droiteMax(I, J) {
      if (I.b > J.b) return { x: I.b, o: I.ob };
      if (J.b > I.b) return { x: J.b, o: J.ob };
      return { x: I.b, o: I.ob && J.ob };
    }
    function inter(I, J) {
      var lo = gaucheMax(I, J), hi = droiteMin(I, J);
      if (lo.x > hi.x) return [];
      if (lo.x === hi.x && (lo.o || hi.o)) return [];
      return [{ a: lo.x, b: hi.x, oa: lo.o, ob: hi.o }];
    }
    // La réunion se recolle si les barres se chevauchent, ou si elles se
    // touchent en un nombre que l'une des deux garde.
    function recolle(I, J) {
      var g = gaucheMax(I, J), d = droiteMin(I, J);
      if (g.x < d.x) return true;
      if (g.x > d.x) return false;
      return dans(I, g.x) || dans(J, g.x);
    }
    function union(I, J) {
      if (recolle(I, J)) {
        var g = gaucheMin(I, J), d = droiteMax(I, J);
        return [{ a: g.x, b: d.x, oa: g.o, ob: d.o }];
      }
      var m1 = { a: I.a, b: I.b, oa: I.oa, ob: I.ob };
      var m2 = { a: J.a, b: J.b, oa: J.oa, ob: J.ob };
      return m1.a <= m2.a ? [m1, m2] : [m2, m1];
    }
    // Les solutions, en zéro, un ou deux morceaux.
    function morceaux() {
      return lien === 'et' ? inter(conds[0], conds[1]) : union(conds[0], conds[1]);
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
    /* Barres, crochets, flèches                                            */
    /*                                                                      */
    /* Chaque barre apparaît en grandissant de gauche à droite pendant son   */
    /* étape (frac passe de 0 à 1), puis reste. Une barre sans borne file    */
    /* jusqu'au bout de l'axe et s'y termine par une flèche.                 */
    /* ==================================================================== */
    // L'avancement de la barre k : 0 et 1 pour les conditions, 2 pour S.
    function frac(k) {
      if (phase > k + 1) return 1;
      if (phase === k + 1) return prog;
      return 0;
    }
    function barre(xf, yf, xf2, couleur, w) {
      return board.create('segment', [pt(xf, yf), pt(xf2, yf)], {
        strokeColor: couleur, strokeWidth: w, fixed: true, highlight: false, layer: 6
      });
    }
    // Le crochet est tourné VERS l'intervalle quand la borne est comprise,
    // vers l'extérieur quand elle est exclue (leçon « Les intervalles »).
    function crochet(xf, yf, dirf, couleur) {
      var V1 = pt(xf, function () { return yf() - H; });
      var V2 = pt(xf, function () { return yf() + H; });
      var A1 = pt(function () { return xf() + 0.30 * dirf(); }, function () { return yf() + H; });
      var A2 = pt(function () { return xf() + 0.30 * dirf(); }, function () { return yf() - H; });
      var o = { strokeColor: couleur, strokeWidth: 3.5, lineCap: 'round',
                fixed: true, highlight: false, layer: 8 };
      return [board.create('segment', [V1, V2], o),
              board.create('segment', [V2, A1], o),
              board.create('segment', [V1, A2], o)];
    }
    // La pointe de flèche d'une barre sans borne : la pointe en xf, les
    // ailes en arrière (dir = +1 pour une flèche vers la droite).
    function fleche(xf, yf, dir, couleur) {
      var P = pt(xf, yf);
      var W1 = pt(function () { return xf() - 0.45 * dir; }, function () { return yf() + 0.26; });
      var W2 = pt(function () { return xf() - 0.45 * dir; }, function () { return yf() - 0.26; });
      var o = { strokeColor: couleur, strokeWidth: 3.5, lineCap: 'round',
                fixed: true, highlight: false, layer: 8 };
      return [board.create('segment', [P, W1], o), board.create('segment', [P, W2], o)];
    }
    function etiquette(xf, yv, tf, couleur, taille) {
      return board.create('text', [xf, yv, tf], {
        anchorX: 'middle', anchorY: 'middle', fontSize: taille || 16, color: couleur,
        cssStyle: 'font-weight:800;background:rgba(255,255,255,.85);padding:0 4px;' +
                  'border-radius:5px;white-space:nowrap', fixed: true, highlight: false, layer: 9
      });
    }

    /* --- Les deux conditions ----------------------------------------------- */
    function snap(x) { return Math.max(BMIN, Math.min(BMAX, Math.round(x))); }
    function poser(P, x, y) { P.setPosition(JXG.COORDS_BY_USER, [x, y]); }
    function borne(x, y) {
      return board.create('point', [x, y], {
        size: 5, strokeWidth: 2, withLabel: false, showInfobox: false, layer: 9
      });
    }

    var rangs = [{ y: Y1, c: C_1 }, { y: Y2, c: C_2 }];
    var barres = rangs.map(function (r, k) {
      function c() { return conds[k]; }
      function g() { return clampe(c().a); }
      function d() { return clampe(c().b); }
      function fin() { return g() + (d() - g()) * frac(k); }
      var seg = barre(g, yFix(r.y), fin, r.c, 6);
      var cg = crochet(g, yFix(r.y), function () { return c().oa ? -1 : 1; }, r.c);
      var cd = crochet(d, yFix(r.y), function () { return c().ob ? 1 : -1; }, r.c);
      var fg = fleche(g, yFix(r.y), -1, r.c);
      var fd = fleche(d, yFix(r.y), 1, r.c);
      var lab = etiquette(function () { return (g() + d()) / 2; }, r.y + 0.72, function () {
        return inegHtml(c()) + ' &nbsp;⟺&nbsp; x ∈ ' + notation(c());
      }, r.c);
      // Les bornes glissantes : posées là où on les lit, sur la barre.
      var PA = borne(isFinite(c().a) ? c().a : BMIN, r.y);
      var PB = borne(isFinite(c().b) ? c().b : BMAX, r.y);
      PA.on('drag', function () {
        var x = Math.min(snap(PA.X()), Math.min(c().b, BMAX) - 1);
        conds[k].a = x; poser(PA, x, r.y); redraw();
      });
      PB.on('drag', function () {
        var x = Math.max(snap(PB.X()), Math.max(c().a, BMIN) + 1);
        conds[k].b = x; poser(PB, x, r.y); redraw();
      });
      return { k: k, y: r.y, c: c, seg: seg, cg: cg, cd: cd, fg: fg, fd: fd, lab: lab, PA: PA, PB: PB };
    });

    /* --- Le résultat : jusqu'à deux morceaux ------------------------------- */
    var pieces = [0, 1].map(function (k) {
      function m() { return morceaux()[k] || null; }
      function A() { var x = m(); return x ? clampe(x.a) : 0; }
      function B() { var x = m(); return x ? clampe(x.b) : 0; }
      function fin() { return A() + (B() - A()) * frac(2); }
      var seg = barre(A, yFix(YR), fin, C_YES, 7);
      var cg = crochet(A, yFix(YR), function () { var x = m(); return x && !x.oa ? 1 : -1; }, C_YES);
      var cd = crochet(B, yFix(YR), function () { var x = m(); return x && !x.ob ? -1 : 1; }, C_YES);
      var fg = fleche(A, yFix(YR), -1, C_YES);
      var fd = fleche(B, yFix(YR), 1, C_YES);
      // La bande verticale relie le résultat aux deux barres qui le font.
      var bande = board.create('polygon', [
        pt(A, yFix(Y1 + 0.45)), pt(B, yFix(Y1 + 0.45)),
        pt(B, yFix(YL - 0.65)), pt(A, yFix(YL - 0.65))
      ], { fillColor: C_YES, fillOpacity: 0.12, withLines: false,
           borders: { visible: false }, hasInnerPoints: false,
           fixed: true, highlight: false, layer: 1 });
      // Le cas { 4 } : les solutions se réduisent à un seul nombre.
      var seul = board.create('point', [A, YR], {
        size: 5, color: C_YES, fixed: true, withLabel: false,
        showInfobox: false, highlight: false, layer: 9
      });
      return { m: m, seg: seg, cg: cg, cd: cd, fg: fg, fd: fd, bande: bande, seul: seul };
    });

    var labS = etiquette(function () { return XMID; }, YR + 0.72, function () {
      return 'S = ' + ensemble(morceaux());
    }, C_YES, 18);
    var vide = board.create('text', [XMID, YR, function () {
      return lien === 'et'
        ? 'aucun nombre ne vérifie les deux inéquations à la fois'
        : 'aucun nombre ne vérifie l\'une ou l\'autre';
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: C_NO,
          cssStyle: 'font-weight:700;background:rgba(255,255,255,.9);padding:0 4px;border-radius:5px',
          fixed: true, highlight: false, layer: 9, visible: false });

    /* ==================================================================== */
    /* Le point x qui teste les deux inéquations                            */
    /* ==================================================================== */
    var PT = board.create('point', [4, YL], {
      size: 7, strokeWidth: 2, withLabel: false, showInfobox: false, layer: 10
    });
    function x() { return PT.X(); }
    function setX(v) { poser(PT, Math.max(GMIN, Math.min(GMAX, v)), YL); }
    PT.on('drag', function () {
      setX(Math.round(PT.X() * 2) / 2);
      redraw();
    });

    var fil = board.create('segment', [pt(x, yFix(Y1 + 0.42)), pt(x, yFix(-0.95))], {
      strokeColor: SOFT, strokeWidth: 1.5, dash: 2, fixed: true,
      highlight: false, layer: 4
    });
    var labX = board.create('text', [x, -1.3, function () {
      return 'x = ' + fmt(x());
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 16, color: INK,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });

    function coche(ok) {
      return ok ? '<span style="color:' + C_YES + ';font-weight:800">✓</span>'
                : '<span style="color:' + C_NO + ';font-weight:800">✗</span>';
    }
    // « 4 > 3 ✓  et  −4 < 4 < 5 ✓ » : les deux inéquations, avec le nombre.
    board.create('text', [XMID, -2.5, function () {
      var v = fmt(x());
      return teinte(0, inegHtml(conds[0], v)) + ' ' + coche(dans(conds[0], x())) +
             ' &nbsp;&nbsp;<strong>' + lien + '</strong>&nbsp;&nbsp; ' +
             teinte(1, inegHtml(conds[1], v)) + ' ' + coche(dans(conds[1], x()));
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 18, color: INK,
          cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 9 });

    var verdict = board.create('text', [XMID, -3.8, function () {
      return fmt(x()) + (verifie(x()) ? ' est solution : ' : ' n\'est pas solution : ') +
             fmt(x()) + (verifie(x()) ? ' ∈ S' : ' ∉ S');
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 22, color: C_YES,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });

    board.create('text', [XMID, -5.1, function () { return memo(); }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: SOFT,
      fixed: true, highlight: false, layer: 9
    });

    // Le commentaire attrape le cas le plus instructif du moment.
    function memo() {
      var xv = x();
      var surBorne = [];
      conds.forEach(function (c, k) {
        if (xv === c.a) surBorne.push([k, 'la borne gauche de ' + inegHtml(c), !c.oa]);
        if (xv === c.b) surBorne.push([k, 'la borne droite de ' + inegHtml(c), !c.ob]);
      });
      if (surBorne.length) {
        var b = surBorne[0];
        return '<span style="color:' + (b[2] ? C_YES : C_NO) + ';font-weight:700">' +
          'x est exactement sur ' + b[1] + ' : l\'inégalité est ' +
          (b[2] ? 'large (⩽), la borne est comprise.' : 'stricte (&lt;), la borne est exclue.') +
          '</span>';
      }
      return lien === 'et'
        ? '« et » : il faut deux ✓ pour être solution. Un seul ✗ suffit à exclure x.'
        : '« ou » : un seul ✓ suffit pour être solution. Il faut deux ✗ pour exclure x.';
    }

    /* ==================================================================== */
    /* Les textes du haut : l'énoncé, et le commentaire de l'étape          */
    /* ==================================================================== */
    board.create('text', [XMID, 7.0, function () {
      return teinte(0, inegHtml(conds[0])) + ' &nbsp;&nbsp;<strong>' + lien + '</strong>&nbsp;&nbsp; ' +
             teinte(1, inegHtml(conds[1]));
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 26, color: INK,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });

    function commentaire() {
      var ms = morceaux();
      if (phase === 0) {
        return 'Deux conditions sur x, reliées par « <strong>' + lien + '</strong> ». ' +
               'Traduisons d\'abord chacune en intervalle.';
      }
      if (phase <= 2) {
        var c = conds[phase - 1], k = phase - 1;
        var tete = teinte(k, '<strong>' + inegHtml(c) + '</strong>') + ' : les nombres ';
        if (c.a === -Infinity) {
          return tete + (c.ob ? 'strictement plus petits que ' : 'inférieurs ou égaux à ') + fmt(c.b) +
                 ', sans limite à gauche.';
        }
        if (c.b === Infinity) {
          return tete + (c.oa ? 'strictement plus grands que ' : 'supérieurs ou égaux à ') + fmt(c.a) +
                 ', sans limite à droite.';
        }
        return tete + 'entre ' + fmt(c.a) + ' et ' + fmt(c.b) + ', ' + fmt(c.a) +
               (c.oa ? ' exclu' : ' compris') + ', ' + fmt(c.b) + (c.ob ? ' exclu' : ' compris') + '.';
      }
      if (lien === 'et') {
        if (!ms.length) return '« <strong>et</strong> » : il faut vérifier les deux. Les barres ne ' +
                               'se touchent pas : <strong>S = ∅</strong>.';
        return '« <strong>et</strong> » : il faut vérifier les deux → on garde la partie ' +
               '<strong>commune</strong> aux deux barres (∩).';
      }
      if (ms.length === 2) return '« <strong>ou</strong> » : une seule suffit → tout ce qui est ' +
                                  'couvert. Un trou reste : S a <strong>deux morceaux</strong>.';
      if (ms[0].a === -Infinity && ms[0].b === Infinity)
        return '« <strong>ou</strong> » : une seule suffit → les deux barres couvrent ' +
               '<strong>tout l\'axe</strong> : S = ℝ.';
      return '« <strong>ou</strong> » : il suffit d\'en vérifier une → on garde <strong>tout ce que ' +
             'les barres recouvrent</strong> (∪).';
    }
    board.create('text', [XMID, 6.1, function () { return commentaire(); }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: INK,
      fixed: true, highlight: false, layer: 9
    });

    /* ==================================================================== */
    /* Rafraîchissement                                                     */
    /* ==================================================================== */
    function refresh() {
      var ms = morceaux();
      var ok = verifie(x());
      var couleur = ok ? C_YES : C_NO;

      barres.forEach(function (b) {
        var c = b.c(), f = frac(b.k);
        show(b.seg, f > 0);
        b.cg.forEach(function (s) { show(s, f > 0 && isFinite(c.a)); });
        b.cd.forEach(function (s) { show(s, f >= 1 && isFinite(c.b)); });
        b.fg.forEach(function (s) { show(s, f > 0 && !isFinite(c.a)); });
        b.fd.forEach(function (s) { show(s, f >= 1 && !isFinite(c.b)); });
        show(b.lab, f > 0);
        // Les bornes : pleines si comprises, creuses si exclues ; absentes à l'infini.
        show(b.PA, f >= 1 && isFinite(c.a));
        show(b.PB, f >= 1 && isFinite(c.b));
        attr(b.PA, 'fillColor', c.oa ? '#ffffff' : col(b.k)); attr(b.PA, 'strokeColor', col(b.k));
        attr(b.PB, 'fillColor', c.ob ? '#ffffff' : col(b.k)); attr(b.PB, 'strokeColor', col(b.k));
      });

      var f2 = frac(2);
      pieces.forEach(function (p, k) {
        var m = ms[k];
        var seul = !!m && m.a === m.b;
        show(p.seg, !!m && !seul && f2 > 0);
        show(p.bande, !!m && !seul && f2 >= 1);
        show(p.seul, seul && f2 > 0);
        p.cg.forEach(function (s) { show(s, !!m && !seul && f2 > 0 && isFinite(m.a)); });
        p.cd.forEach(function (s) { show(s, !!m && !seul && f2 >= 1 && isFinite(m.b)); });
        p.fg.forEach(function (s) { show(s, !!m && f2 > 0 && !isFinite(m.a)); });
        p.fd.forEach(function (s) { show(s, !!m && f2 >= 1 && !isFinite(m.b)); });
      });
      show(labS, phase === 3);
      attr(labS, 'color', ms.length ? C_YES : C_NO);
      show(vide, phase === 3 && !ms.length);

      attr(PT, 'fillColor', couleur);
      attr(PT, 'strokeColor', couleur);
      attr(fil, 'strokeColor', couleur);
      attr(verdict, 'color', couleur);
      attr(labX, 'color', couleur);

      panneauSiBesoin();
    }
    // Les attributs se posent AVANT board.update(), jamais depuis l'événement.
    function redraw() { refresh(); board.update(); }

    /* ==================================================================== */
    /* Les trois étapes                                                     */
    /*                                                                      */
    /* Chaque étape règle un état ABSOLU (phase, avancement) : « Précédent » */
    /* remet à zéro et rejoue, et retombe exactement sur la même figure.     */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function etape(ph, duree) {
      return {
        dur: duree,
        step: function (p) { phase = ph; prog = p; refresh(); },
        after: function () { phase = ph; prog = 1; refresh(); }
      };
    }
    function etapes() { return [etape(1, 650), etape(2, 650), etape(3, 750)]; }
    function remise() { phase = 0; prog = 1; refresh(); }
    function armer() { anim.runSteps(etapes(), remise); }
    function rejouer() {
      anim.cancel();
      remise();
      armer();
      board.update();
    }

    /* ==================================================================== */
    /* Poser deux conditions, et le point de test au milieu                 */
    /* ==================================================================== */
    function poseBornes() {
      barres.forEach(function (b) {
        var c = b.c();
        poser(b.PA, isFinite(c.a) ? c.a : BMIN, b.y);
        poser(b.PB, isFinite(c.b) ? c.b : BMAX, b.y);
      });
    }
    function charger(c1, c2, l) {
      conds = [c1, c2];
      lien = l;
      poseBornes();
      // Le point de test se pose sur un nombre parlant : dans S s'il y en a.
      var ms = morceaux();
      if (ms.length) {
        var m = ms[0];
        // Une demi-droite : à trois unités de sa borne ; ℝ : au milieu de l'axe.
        var a = isFinite(m.a) ? m.a : (isFinite(m.b) ? Math.max(GMIN, m.b - 3) : GMIN);
        var b = isFinite(m.b) ? m.b : (isFinite(m.a) ? Math.min(GMAX, m.a + 3) : GMAX);
        setX(Math.round((a + b) / 2));
      } else {
        setX(Math.round((Math.max(conds[0].a, conds[1].a) + Math.min(conds[0].b, conds[1].b)) / 2));
      }
      syncControls();
      rejouer();
    }

    /* ==================================================================== */
    /* Lire une saisie : « x>3 et -4<x<5 », « x<=2 ou x>5 »                 */
    /* ==================================================================== */
    var MIROIR = { '<': '>', '>': '<', '⩽': '⩾', '⩾': '⩽' };
    function simple(rel, v) {
      if (rel === '<') return { a: -Infinity, oa: true, b: v, ob: true };
      if (rel === '⩽') return { a: -Infinity, oa: true, b: v, ob: false };
      if (rel === '>') return { a: v, oa: true, b: Infinity, ob: true };
      return { a: v, oa: false, b: Infinity, ob: true };
    }
    var NB = '(-?\\d+(?:\\.\\d+)?)';
    function lireUne(t) {
      t = t.replace(/\s+/g, '');
      var r;
      if ((r = new RegExp('^x([<>⩽⩾])' + NB + '$').exec(t))) return simple(r[1], +r[2]);
      if ((r = new RegExp('^' + NB + '([<>⩽⩾])x$').exec(t))) return simple(MIROIR[r[2]], +r[1]);
      if ((r = new RegExp('^' + NB + '([<⩽])x([<⩽])' + NB + '$').exec(t)))
        return { a: +r[1], oa: r[2] === '<', b: +r[4], ob: r[3] === '<' };
      if ((r = new RegExp('^' + NB + '([>⩾])x([>⩾])' + NB + '$').exec(t)))
        return { a: +r[4], oa: r[3] === '>', b: +r[1], ob: r[2] === '>' };
      return null;
    }
    // Renvoie { c1, c2, lien } ou { erreur }.
    function lire(s) {
      s = String(s).toLowerCase()
        .replace(/[−–]/g, '-').replace(/,/g, '.')
        .replace(/>=|=>|≥/g, '⩾').replace(/<=|=<|≤/g, '⩽')
        .replace(/et|&|∧/g, ' et ').replace(/ou|\|/g, ' ou ')
        .replace(/\s+/g, ' ').trim();
      var m = /^(.*?) (et|ou) (.*)$/.exec(s);
      if (!m) return { erreur: 'Il faut deux inéquations, séparées par « et » ou par « ou ».' };
      var c1 = lireUne(m[1]), c2 = lireUne(m[3]);
      if (!c1 || !c2) {
        return { erreur: 'Je ne lis pas « ' + (c1 ? m[3] : m[1]).trim() + ' ». Écris par exemple ' +
                         'x>3, x<=2 ou -4<x<5.' };
      }
      var hors = [c1, c2].some(function (c) {
        return [c.a, c.b].some(function (v) { return isFinite(v) && (v < BMIN || v > BMAX); });
      });
      if (hors) return { erreur: 'Les bornes doivent rester entre ' + fmt(BMIN) + ' et ' + fmt(BMAX) +
                                 ' pour tenir sur l\'axe.' };
      var demi = [c1, c2].some(function (c) {
        return [c.a, c.b].some(function (v) { return isFinite(v) && v * 2 !== Math.round(v * 2); });
      });
      if (demi) return { erreur: 'Utilise des entiers ou des demi-entiers (2 ; 2,5 ; −3) pour les bornes.' };
      if (c1.a >= c1.b || c2.a >= c2.b) {
        return { erreur: 'Dans « a < x < b », il faut a < b : sinon aucun nombre ne convient.' };
      }
      return { c1: c1, c2: c2, lien: m[2] };
    }

    /* ==================================================================== */
    /* Panneau                                                              */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    var derniere = '';

    function traduction(k) {
      var c = conds[k];
      var pourquoi;
      if (c.a === -Infinity) {
        pourquoi = (c.ob ? 'strictement plus petit que ' : 'au plus égal à ') + fmt(c.b) +
                   ' : crochet ' + (c.ob ? 'ouvert' : 'fermé') + ' en ' + fmt(c.b) +
                   ', et rien à gauche, jusqu\'à −∞.';
      } else if (c.b === Infinity) {
        pourquoi = (c.oa ? 'strictement plus grand que ' : 'au moins égal à ') + fmt(c.a) +
                   ' : crochet ' + (c.oa ? 'ouvert' : 'fermé') + ' en ' + fmt(c.a) +
                   ', et rien à droite, jusqu\'à +∞.';
      } else {
        pourquoi = 'entre ' + fmt(c.a) + ' et ' + fmt(c.b) + ' : ' +
                   (c.oa ? 'ouvert' : 'fermé') + ' en ' + fmt(c.a) + ' (' + (c.oa ? '&lt;' : '⩽') +
                   '), ' + (c.ob ? 'ouvert' : 'fermé') + ' en ' + fmt(c.b) + ' (' +
                   (c.ob ? '&lt;' : '⩽') + ').';
      }
      return '<li><strong style="color:' + col(k) + '">' + inegHtml(c) + '</strong> ⟺ x ∈ ' +
             '<strong style="color:' + col(k) + '">' + notation(c) + '</strong> — x ' + pourquoi + '</li>';
    }

    function lecture() {
      var I = conds[0], J = conds[1], ms = morceaux();
      if (lien === 'et') {
        if (!ms.length) {
          var g = gaucheMax(I, J), d = droiteMin(I, J);
          return 'Il faudrait x ' + (g.o ? '&gt; ' : '⩾ ') + fmt(g.x) + ' et x ' +
                 (d.o ? '&lt; ' : '⩽ ') + fmt(d.x) + ' en même temps : ' +
                 (g.x > d.x ? 'impossible, les barres ne se touchent pas.'
                            : 'elles se touchent en ' + fmt(g.x) + ', mais une inégalité stricte ' +
                              'l\'exclut.') +
                 ' <strong style="color:' + C_NO + '">S = ∅</strong>.';
        }
        var lo = gaucheMax(I, J), hi = droiteMin(I, J);
        return 'On garde la partie commune : la <strong>plus grande</strong> des bornes gauches (' +
               fmt(lo.x) + ') et la <strong>plus petite</strong> des bornes droites (' + fmt(hi.x) +
               ').' + (I.a === J.a || I.b === J.b
                 ? ' À une borne partagée, « et » ne la garde que si <em>les deux</em> inéquations la gardent.'
                 : '') +
               ' <strong style="color:' + C_YES + '">S = ' + ensemble(ms) + '</strong>.';
      }
      if (ms.length === 2) {
        return 'Les barres ne se touchent pas : entre ' + fmt(ms[0].b) + ' et ' + fmt(ms[1].a) +
               ', aucun nombre ne vérifie ni l\'une ni l\'autre. S reste en <strong>deux ' +
               'morceaux</strong>, reliés par ∪ : <strong style="color:' + C_YES + '">S = ' +
               ensemble(ms) + '</strong>.';
      }
      var g2 = gaucheMin(I, J), d2 = droiteMax(I, J);
      var tout = ms[0].a === -Infinity && ms[0].b === Infinity;
      return 'On garde tout ce que les barres recouvrent : la <strong>plus petite</strong> des ' +
             'bornes gauches (' + fmt(g2.x) + ') et la <strong>plus grande</strong> des bornes ' +
             'droites (' + fmt(d2.x) + ').' +
             (I.a === J.a || I.b === J.b
               ? ' À une borne partagée, « ou » la garde dès que <em>l\'une</em> des inéquations la garde.'
               : '') +
             (tout ? ' Tout l\'axe est couvert : <strong style="color:' + C_YES + '">S = ℝ</strong>.'
                   : ' <strong style="color:' + C_YES + '">S = ' + ensemble(ms) + '</strong>.');
    }

    function renderPanel() {
      var xv = x(), v = fmt(xv);
      var d1 = dans(conds[0], xv), d2 = dans(conds[1], xv), ok = verifie(xv);
      var ms = morceaux();

      panel.innerHTML =
        '<div class="props-name">' + teinte(0, inegHtml(conds[0])) + ' &nbsp;' + lien + '&nbsp; ' +
          teinte(1, inegHtml(conds[1])) +
          (phase === 3 ? ' &nbsp;<span style="color:' + (ms.length ? C_YES : C_NO) + '">⟹ S = ' +
                         ensemble(ms) + '</span>' : '') + '</div>' +

        '<div class="props-label">1. Chaque inéquation devient un intervalle</div>' +
        (phase >= 1
          ? '<ul class="props-list">' + traduction(0) + (phase >= 2 ? traduction(1) : '') + '</ul>'
          : '<p style="margin:.2rem 0 .5rem;color:var(--ink-soft)">Clique « Suivante » : la ' +
            'première inéquation se traduit en intervalle.</p>') +

        (phase === 3
          ? '<div class="props-label">2. Le mot « ' + lien + ' » décide</div>' +
            '<p style="margin:.2rem 0 .5rem">' +
              (lien === 'et'
                ? 'Un nombre est solution s\'il vérifie <strong>les deux</strong> inéquations : ' +
                  'c\'est l\'<strong>intersection</strong>, S = ' + notation(conds[0]) + ' ∩ ' +
                  notation(conds[1]) + '. '
                : 'Un nombre est solution s\'il vérifie <strong>l\'une ou l\'autre</strong> ' +
                  '(ou les deux) : c\'est la <strong>réunion</strong>, S = ' + notation(conds[0]) +
                  ' ∪ ' + notation(conds[1]) + '. ') +
              lecture() + '</p>'
          : '') +

        '<div class="props-label">Le nombre x = ' + v + '</div>' +
        '<ul class="props-list">' +
          '<li>' + teinte(0, inegHtml(conds[0], v)) + ' ? <strong style="color:' + (d1 ? C_YES : C_NO) + '">' +
            (d1 ? 'vrai' : 'faux') + '</strong></li>' +
          '<li>' + teinte(1, inegHtml(conds[1], v)) + ' ? <strong style="color:' + (d2 ? C_YES : C_NO) + '">' +
            (d2 ? 'vrai' : 'faux') + '</strong></li>' +
        '</ul>' +
        '<p style="margin:.2rem 0 0">' +
          (lien === 'et' ? 'Il faut « vrai » aux deux : ' : 'Il suffit d\'un « vrai » : ') +
          '<strong style="color:' + (ok ? C_YES : C_NO) + '">' + v +
          (ok ? ' est solution, ' + v + ' ∈ S' : ' n\'est pas solution, ' + v + ' ∉ S') +
          '</strong>.</p>' +

        '<p style="margin:.5rem 0 0;font-size:.85rem;color:var(--ink-soft)">' +
          'Le « ou » des mathématiques n\'est pas exclusif : un nombre qui vérifie les ' +
          '<em>deux</em> inéquations est solution de « l\'une ou l\'autre ». C\'est le « et » ' +
          'qui est exigeant.</p>';
    }

    // Le panneau ne se reconstruit que si quelque chose a changé : pendant
    // l'animation, les barres grandissent à 60 images par seconde.
    function panneauSiBesoin() {
      var s = [lien, phase, Math.round(x() * 10)].concat(conds.map(function (c) {
        return [c.a, c.b, c.oa, c.ob].join(',');
      })).join('|');
      if (s === derniere) return;
      derniere = s;
      renderPanel();
    }

    /* ==================================================================== */
    /* Préréglages, saisie, tirage                                          */
    /* ==================================================================== */
    function el(tag, cls, txt) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt != null) e.textContent = txt;
      return e;
    }
    // Les quatre réponses possibles sont toutes là : un intervalle, ∅, deux
    // morceaux, ℝ — plus les cas où une condition l'emporte sur l'autre.
    var PRESETS = [
      { label: 'x > 3 et −4 < x < 5',       s: 'x>3 et -4<x<5' },
      { label: 'x ⩽ 2 ou x > 5',            s: 'x<=2 ou x>5' },
      { label: 'x ⩾ 1 et x < −2',           s: 'x>=1 et x<-2' },
      { label: 'x < 4 ou x ⩾ −1',           s: 'x<4 ou x>=-1' },
      { label: '−3 ⩽ x < 2 et 0 < x ⩽ 6',   s: '-3<=x<2 et 0<x<=6' },
      { label: 'x > 1 et x ⩾ 4',            s: 'x>1 et x>=4' },
      { label: 'x ⩽ 5 ou x < 5',            s: 'x<=5 ou x<5' }
    ];
    var root = el('div', 'eq-ui ineq-ui');
    var presets = el('div', 'ineq-presets');
    var presetBtns = PRESETS.map(function (p) {
      var bt = el('button', 'ineq-preset', p.label);
      bt.type = 'button';
      bt.onclick = function () { appliquer(p.s); };
      presets.appendChild(bt);
      return bt;
    });
    root.appendChild(presets);

    var entry = el('div', 'eq-entry');
    entry.appendChild(el('span', 'eq-entry-lab', 'Résoudre :'));
    var saisie = el('input', 'ineq-saisie');
    saisie.type = 'text';
    saisie.placeholder = 'x>3 et -4<x<5';
    saisie.spellcheck = false;
    saisie.setAttribute('aria-label', 'Deux inéquations reliées par et ou par ou');
    entry.appendChild(saisie);
    var goBtn = el('button', 'eq-rand', 'Tracer'); goBtn.type = 'button';
    var randBtn = el('button', 'eq-rand', '🎲 Un autre exemple'); randBtn.type = 'button';
    entry.appendChild(goBtn); entry.appendChild(randBtn);
    root.appendChild(entry);
    var noteEl = el('div', 'eq-note'); root.appendChild(noteEl);

    function appliquer(s) {
      var r = lire(s);
      if (r.erreur) {
        noteEl.innerHTML = '<span style="color:' + C_NO + '">' + r.erreur + '</span>';
        return false;
      }
      noteEl.innerHTML = '';
      saisie.value = s;
      charger(r.c1, r.c2, r.lien);
      return true;
    }
    goBtn.onclick = function () { appliquer(saisie.value); };
    saisie.onchange = function () { appliquer(saisie.value); };
    saisie.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); appliquer(saisie.value); } };

    function rnd(a0, b0) { return a0 + Math.floor(Math.random() * (b0 - a0 + 1)); }
    function tireCond(genre) {
      var strict1 = Math.random() < 0.5, strict2 = Math.random() < 0.5;
      if (genre === 'g') { var a = rnd(BMIN, BMAX - 2); return { a: a, oa: strict1, b: Infinity, ob: true }; }
      if (genre === 'd') { var b = rnd(BMIN + 2, BMAX); return { a: -Infinity, oa: true, b: b, ob: strict2 }; }
      var a2 = rnd(BMIN, BMAX - 3), b2 = a2 + rnd(2, Math.min(7, BMAX - a2));
      return { a: a2, oa: strict1, b: b2, ob: strict2 };
    }
    function autre() {
      // Toujours au moins une double inéquation ou deux sens différents :
      // deux conditions du même côté font un exemple trop pauvre.
      var genres = [['g', 'dbl'], ['dbl', 'g'], ['d', 'dbl'], ['dbl', 'd'], ['g', 'd'], ['d', 'g'],
                    ['dbl', 'dbl'], ['g', 'g'], ['d', 'd']];
      var g = genres[rnd(0, genres.length - 1)];
      var l = Math.random() < 0.6 ? 'et' : 'ou';
      noteEl.innerHTML = '';
      var c1 = tireCond(g[0]), c2 = tireCond(g[1]);
      saisie.value = ineg(c1).replace(/⩽/g, '<=').replace(/⩾/g, '>=').replace(/−/g, '-') + ' ' + l + ' ' +
                     ineg(c2).replace(/⩽/g, '<=').replace(/⩾/g, '>=').replace(/−/g, '-');
      charger(c1, c2, l);
    }
    randBtn.onclick = autre;

    /* ==================================================================== */
    /* Contrôles                                                            */
    /* ==================================================================== */
    function syncControls() {
      if (refs && refs.lien) refs.lien.textContent = lien === 'et' ? '↔ Remplacer « et » par « ou »'
                                                                   : '↔ Remplacer « ou » par « et »';
      var s = saisie.value;
      presetBtns.forEach(function (bt, i) {
        bt.className = 'ineq-preset' + (PRESETS[i].s === s ? ' active' : '');
      });
    }

    refs = mv.addControls([
      { type: 'button', id: 'lien', label: '↔ Remplacer « et » par « ou »', onClick: function () {
          lien = lien === 'et' ? 'ou' : 'et';
          saisie.value = saisie.value.replace(/\b(et|ou)\b/, lien);
          syncControls();
          redraw();
        } },
      { type: 'button', id: 'play', label: '▶ Rejouer les étapes', onClick: rejouer },
      { type: 'button', id: 'tout', label: '⏩ Tout afficher', onClick: function () {
          anim.cancel();
          phase = 3; prog = 1;
          refresh();
          armer();
          board.update();
        } }
    ]);

    mv.extras.appendChild(root);
    mv.extras.appendChild(panel);

    appliquer(PRESETS[0].s);
  }
});
