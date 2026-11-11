/*
 * Équations équivalentes (2nde) — les opérations qui ne changent pas les
 * solutions.
 *
 * Deux équations sont équivalentes quand elles ont exactement les mêmes
 * solutions. Toute la résolution d'une équation consiste à la remplacer par
 * une équation équivalente plus simple, et il n'y a que trois façons de le
 * faire. La leçon a donc trois volets, et une seule figure : chaque membre de
 * l'équation est une courbe, et la solution est l'abscisse de leur croisement.
 *
 *   1) Ajouter ou soustraire un même nombre aux deux membres : les deux
 *      droites montent (ou descendent, ou pivotent si on ajoute un multiple de
 *      x) ENSEMBLE. Le croisement se déplace à la verticale : il reste
 *      au-dessus du même x.
 *   2) Multiplier ou diviser les deux membres par un même nombre non nul : les
 *      deux hauteurs sont multipliées ensemble, le croisement reste au-dessus
 *      du même x. Multiplier par 0 écrase les deux droites sur l'axe — 0 = 0,
 *      vrai partout : l'équation a changé, et la figure le montre. Diviser par
 *      0 est impossible.
 *   3) Développer, factoriser, réduire un membre : on change son ÉCRITURE, pas
 *      sa valeur. La nouvelle écriture retrace exactement la même courbe : rien
 *      ne bouge du tout.
 *
 * Le curseur choisit le nombre qu'on ajoute ou par lequel on multiplie : les
 * droites suivent en direct. Le point sur l'axe se déplace et calcule les deux
 * membres, avant et après : les deux équations sont vraies pour les mêmes x.
 * Le panneau écrit la chaîne des ⟺ et dit ce qui se passerait si on ne
 * faisait l'opération que d'un côté.
 *
 * Même discipline que les autres leçons animées : état absolu par étape,
 * rafraîchissement explicite, tout ce que lisent les textes calculé avant le
 * premier board.create.
 */
MathsView.register({
  id: 'equations-equivalentes',
  title: 'Équations équivalentes',
  level: '2nde',
  category: 'algebre',
  subcategory: 'Équations',
  exercices: ['eq-equivalentes'],
  theme: 'Algèbre — les opérations qui ne changent pas les solutions d\'une équation',
  description:
    'Deux équations sont <strong>équivalentes</strong> quand elles ont exactement les ' +
    '<strong>mêmes solutions</strong>. Résoudre, c\'est remplacer l\'équation par une équation ' +
    'équivalente plus simple — et trois opérations le permettent.' +
    '<br><strong>1.</strong> Ajouter ou soustraire un même nombre aux deux membres. ' +
    '<strong>2.</strong> Multiplier ou diviser les deux membres par un même nombre ' +
    '<strong>non nul</strong>. <strong>3.</strong> Développer, factoriser ou réduire un membre.' +
    '<br>Sur la figure, chaque membre est une courbe, et la solution est l\'abscisse de leur ' +
    '<strong>croisement</strong>. Choisis un volet, une équation, puis clique sur ' +
    '<strong>▶ Animer</strong> (ou coche <strong>Pas à pas</strong>). Le <strong>curseur</strong> ' +
    'change le nombre : les droites bougent, le croisement reste au-dessus du même \\(x\\). ' +
    '<strong>Déplace le point</strong> sur l\'axe pour comparer les deux membres.',
  notes:
    '<ul>' +
    '<li><strong>Équivalentes.</strong> \\(2x-1=x+2\\) et \\(2x=x+3\\) ont la même solution, ' +
    '\\(3\\) : on écrit \\(2x-1=x+2\\iff 2x=x+3\\). Le signe \\(\\iff\\) se lit « équivaut à ».</li>' +
    '<li><strong>Ajouter, soustraire.</strong> Pour tous nombres : \\(A=B\\iff A+k=B+k\\). ' +
    'Le nombre \\(k\\) peut contenir \\(x\\) : soustraire \\(x\\) aux deux membres de ' +
    '\\(2x=x+3\\) donne \\(x=3\\). C\'est ce qu\'on appelle « faire passer un terme de l\'autre ' +
    'côté en changeant son signe ».</li>' +
    '<li><strong>Multiplier, diviser.</strong> Pour \\(k\\neq0\\) : \\(A=B\\iff kA=kB\\) et ' +
    '\\(A=B\\iff \\dfrac{A}{k}=\\dfrac{B}{k}\\). Multiplier sert à chasser un dénominateur : ' +
    '\\(\\dfrac{x}{2}+1=2\\iff x+2=4\\). Diviser sert à isoler \\(x\\) : \\(3x=6\\iff x=2\\).</li>' +
    '<li><strong>Jamais par zéro.</strong> Multiplier par \\(0\\) donne \\(0=0\\), vraie pour ' +
    'tous les nombres : l\'équation a changé. Diviser par \\(0\\) est impossible. C\'est pour ' +
    'cela qu\'on ne « simplifie » jamais par \\(x\\), qui peut être nul.</li>' +
    '<li><strong>Développer, factoriser, réduire.</strong> On remplace un membre par une ' +
    'expression <em>égale</em> : \\(2(x+3)=x+4\\iff 2x+6=x+4\\). Le membre vaut le même nombre ' +
    'pour chaque \\(x\\), donc les solutions ne changent pas.</li>' +
    '<li><strong>Des deux côtés, la même chose.</strong> Ajouter \\(3\\) à gauche seulement, ' +
    'ou multiplier un seul membre, donne une autre équation, avec d\'autres solutions.</li>' +
    '<li><strong>La suite.</strong> Ces trois opérations suffisent pour ' +
    '<a href="#equations-premier-degre">les équations du premier degré</a> ; avec la ' +
    'factorisation, elles mènent au <a href="#equations-produit-nul">produit nul</a> et au ' +
    '<a href="#equations-quotient-nul">quotient nul</a>.</li>' +
    '</ul>',
  board: {
    boundingbox: [-1.6, 10.2, 7.6, -9.4], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Équations équivalentes',
    figures: [{
      legende: 'On ajoute 2 aux deux membres : le croisement reste au-dessus de x = 3.',
      boundingbox: [-0.8, 9.4, 6.4, -1.6],
      keepaspectratio: false,
      largeur: 60, hauteur: 38,
      dessine: function (board) {
        var g = '#334155', ok = '#16a34a', b1 = '#2563eb', b2 = '#ea580c';
        function f1(x) { return 2 * x - 1; }
        function f2(x) { return x + 2; }
        board.create('segment', [[-0.6, 0], [6.2, 0]], { strokeColor: g, strokeWidth: 1.2, lastArrow: true, fixed: true, highlight: false });
        board.create('segment', [[0, -1.4], [0, 9.2]], { strokeColor: g, strokeWidth: 1.2, lastArrow: true, fixed: true, highlight: false });
        for (var i = 1; i <= 5; i++) {
          board.create('segment', [[i, -0.15], [i, 0.15]], { strokeColor: g, strokeWidth: 1, fixed: true, highlight: false });
          board.create('text', [i, -0.7, String(i)], { anchorX: 'middle', anchorY: 'middle', fontSize: 8, color: '#64748b', fixed: true, highlight: false });
        }
        board.create('functiongraph', [f1, -0.2, 4.6], { strokeColor: b1, strokeWidth: 1, dash: 2, fixed: true, highlight: false });
        board.create('functiongraph', [f2, -0.6, 6], { strokeColor: b2, strokeWidth: 1, dash: 2, fixed: true, highlight: false });
        board.create('functiongraph', [function (x) { return f1(x) + 2; }, -0.6, 3.6], { strokeColor: b1, strokeWidth: 1.8, fixed: true, highlight: false });
        board.create('functiongraph', [function (x) { return f2(x) + 2; }, -0.6, 5.2], { strokeColor: b2, strokeWidth: 1.8, fixed: true, highlight: false });
        board.create('segment', [[3, 0], [3, 7]], { strokeColor: ok, strokeWidth: 1, dash: 2, fixed: true, highlight: false });
        board.create('segment', [[3, 5.25], [3, 6.75]], { strokeColor: ok, strokeWidth: 1.6, lastArrow: true, fixed: true, highlight: false });
        [[3, 5], [3, 7], [3, 0]].forEach(function (p) {
          board.create('point', p, { name: '', size: 2.5, fillColor: ok, strokeColor: ok, fixed: true, highlight: false, showInfobox: false });
        });
        board.create('text', [3.25, 0.75, 'x = 3'], { anchorX: 'left', anchorY: 'middle', fontSize: 10, color: ok, cssStyle: 'font-weight:800', fixed: true, highlight: false });
        board.create('text', [4.75, 8.3, '2x − 1'], { anchorX: 'left', anchorY: 'middle', fontSize: 9, color: b1, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [5.35, 6.3, 'x + 2'], { anchorX: 'left', anchorY: 'middle', fontSize: 9, color: b2, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [1.1, 6.2, '+ 2'], { anchorX: 'middle', anchorY: 'middle', fontSize: 10, color: ok, cssStyle: 'font-weight:800', fixed: true, highlight: false });
      }
    }],
    points: [
      'Deux équations sont <b>équivalentes</b> (\\( \\iff \\)) quand elles ont exactement les <b>mêmes solutions</b>.',
      'On peut <b>ajouter ou soustraire</b> un même nombre aux deux membres : \\( A = B \\iff A + k = B + k \\).',
      'On peut <b>multiplier ou diviser</b> les deux membres par un même nombre <b>non nul</b> : \\( A = B \\iff kA = kB \\).',
      'On peut <b>développer, factoriser, réduire</b> un membre : son écriture change, pas sa valeur.',
      '<b>Jamais par 0</b> : multiplier par 0 donne 0 = 0, toujours vraie. On ne « simplifie » pas par x.',
      'Toujours la <b>même opération des deux côtés</b> : sinon les solutions changent.'
    ],
    exemples: [
      '\\( 2x - 1 = x + 2 \\iff 2x = x + 3 \\) (on ajoute 1) \\( \\iff x = 3 \\) (on soustrait x).',
      '\\( \\dfrac{x}{2} + 1 = 2 \\iff x + 2 = 4 \\) (on multiplie par 2). \\( 3x = 6 \\iff x = 2 \\) (on divise par 3).',
      '\\( 2(x + 3) = x + 4 \\iff 2x + 6 = x + 4 \\) (on développe) \\( \\iff x = -2 \\).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette et écritures                                                  */
    /* ==================================================================== */
    var C1 = '#2563eb', C2 = '#ea580c', C_V = '#7c3aed';   // membre de gauche, de droite, réécriture
    var C_OK = '#16a34a', C_NO = '#dc2626';
    var INK = '#334155', SOFT = '#94a3b8';
    var ARROW = { type: 2, size: 7 };
    var EPS = 1e-9;

    function fmt(v) {
      var t = Math.round(v * 1000) / 1000;
      if (Object.is(t, -0)) t = 0;
      return t.toString().replace('-', '−').replace('.', ',');
    }
    function termine(dn) { while (dn % 2 === 0) dn /= 2; while (dn % 5 === 0) dn /= 5; return dn === 1; }
    // v = n/d avec un petit dénominateur, ou null
    function fraction(v) {
      for (var dn = 1; dn <= 12; dn++) {
        var n = v * dn;
        if (Math.abs(n - Math.round(n)) < EPS) return { n: Math.round(n), d: dn };
      }
      return null;
    }
    // un nombre tel qu'on l'écrit : « 3 », « −0,5 », « 2/3 »
    function nb(v) {
      var f = fraction(v);
      if (!f) return fmt(v);
      if (f.d === 1) return fmt(f.n);
      if (termine(f.d)) return fmt(v);
      return (f.n < 0 ? '−' : '') + Math.abs(f.n) + '/' + f.d;
    }
    function par(v) { return v < 0 ? '(' + nb(v) + ')' : nb(v); }
    // un terme en x, sans son signe : « x », « 3x », « x/2 », « 3x/2 »
    function absX(p) {
      p = Math.abs(p);
      var f = fraction(p);
      if (!f) return fmt(p) + 'x';
      return (f.n === 1 ? '' : f.n) + 'x' + (f.d === 1 ? '' : '/' + f.d);
    }
    // le membre p·x + q : « 2x − 1 », « −x + 2 », « 3x », « 6 », « 0 »
    function aff(p, q) {
      if (Math.abs(p) < EPS) return nb(q);
      var t = (p < 0 ? '−' : '') + absX(p);
      if (Math.abs(q) > EPS) t += (q < 0 ? ' − ' : ' + ') + nb(Math.abs(q));
      return t;
    }
    function fracHtml(haut, bas) {
      return '<span class="eq-frac"><span class="eq-num">' + haut + '</span><span class="eq-den">' + bas + '</span></span>';
    }

    /* ==================================================================== */
    /* Les trois volets et leurs équations                                   */
    /* ==================================================================== */
    var VOLETS = [
      { cle: 'add', nom: '1 · Ajouter, soustraire' },
      { cle: 'mul', nom: '2 · Multiplier, diviser' },
      { cle: 'ecr', nom: '3 · Développer, factoriser, réduire' }
    ];
    var PLANS = { add: ['depart', 'op', 'reduit', 'sol'], mul: ['depart', 'op', 'reduit', 'sol'], ecr: ['depart', 'op', 'sol'] };
    // volets 1 et 2 : a·x + b = c·x + d, l'opération proposée avec
    var CAS = {
      add: [
        { a: 2, b: -1, c: 1, d: 2, genre: 'nb', k: 1 },      // 2x − 1 = x + 2, + 1
        { a: 2, b: 0, c: 1, d: 3, genre: 'x', k: -1 },       // 2x = x + 3, − x
        { a: 1, b: -4, c: -2, d: 5, genre: 'x', k: 2 },      // x − 4 = −2x + 5, + 2x
        { a: 3, b: 2, c: 1, d: -2, genre: 'nb', k: -2 }      // 3x + 2 = x − 2, − 2
      ],
      mul: [
        { a: 0.5, b: 1, c: 0, d: 2, genre: 'fois', k: 2 },   // x/2 + 1 = 2, × 2
        { a: 4, b: 0, c: 2, d: 2, genre: 'div', k: 2 },      // 4x = 2x + 2, ÷ 2
        { a: -1, b: 2, c: 1, d: -4, genre: 'fois', k: -1 },  // −x + 2 = x − 4, × (−1)
        { a: 3, b: 0, c: 0, d: 6, genre: 'div', k: 3 },      // 3x = 6, ÷ 3
        { a: 2, b: -4, c: 1, d: -1, genre: 'fois', k: 0 }    // 2x − 4 = x − 1, × 0 : interdit
      ],
      // volet 3 : le membre de gauche est réécrit, celui de droite ne change pas
      ecr: [
        { verbe: 'développe', nom: 'Développer', L0t: '2(x + 3)', L1t: '2x + 6', Rt: 'x + 4',
          L: function (x) { return 2 * (x + 3); }, R: function (x) { return x + 4; }, sols: [-2],
          regle: 'k(a + b) = ka + kb' },
        { verbe: 'réduit', nom: 'Réduire', L0t: '3x + 2 − x + 4', L1t: '2x + 6', Rt: '10',
          L: function (x) { return 3 * x + 2 - x + 4; }, R: function () { return 10; }, sols: [2],
          regle: 'on regroupe les x entre eux, les nombres entre eux' },
        { verbe: 'factorise', nom: 'Factoriser', L0t: 'x² − 3x', L1t: 'x(x − 3)', Rt: '0',
          L: function (x) { return x * x - 3 * x; }, R: function () { return 0; }, sols: [0, 3],
          regle: 'x est un facteur commun' },
        { verbe: 'développe', nom: 'Développer', L0t: '(x − 1)²', L1t: 'x² − 2x + 1', Rt: 'x² − 3',
          L: function (x) { return (x - 1) * (x - 1); }, R: function (x) { return x * x - 3; }, sols: [2],
          regle: '(a − b)² = a² − 2ab + b²' }
      ]
    };
    function suffixeOp(genre, k) {
      if (genre === 'nb' || (genre === 'x' && k === 0)) return (k < 0 ? '− ' : '+ ') + nb(Math.abs(k));
      if (genre === 'x') return (k < 0 ? '− ' : '+ ') + absX(k);
      return (genre === 'fois' ? '× ' : '÷ ') + par(k);
    }
    function nomCas(v, cs) {
      if (v === 'ecr') return cs.nom + ' : ' + cs.L0t + ' = ' + cs.Rt;
      return aff(cs.a, cs.b) + ' = ' + aff(cs.c, cs.d) + '   (' + suffixeOp(cs.genre, cs.k) + ')';
    }

    var volet = 'add';
    var a = 2, b = -1, c = 1, d = 2, genre = 'nb', K = 1;
    var iCas = 0;                     // le préréglage en cours (−1 après un tirage)
    var cas = CAS.ecr[0];
    var D = null;
    var XL = -1, XR = 7, YT = 7.2;

    /* Tout ce que la figure et le panneau lisent, recalculé d'un coup. */
    function calcule() {
      if (volet === 'ecr') {
        D = { L0: cas.L, R0: cas.R, L1: cas.L, R1: cas.R,
              L0t: cas.L0t, R0t: cas.Rt, L1t: cas.L1t, R1t: cas.Rt,
              LopT: cas.L1t, RopT: cas.Rt, LopH: cas.L1t, RopH: cas.Rt,
              sols: cas.sols.slice(), interdit: null, neutre: false, bouge: false, seul: '',
              noteOp: 'On <b>' + cas.verbe + '</b> le membre de gauche : ' + cas.regle + '.' };
      } else {
        var k = K, p1 = a, q1 = b, r1 = c, s1 = d, interdit = null, neutre = false;
        var Lt = aff(a, b), Rt = aff(c, d), LopT, RopT, LopH, RopH, note;
        var deux = function (p, q) { return Math.abs(p) > EPS && Math.abs(q) > EPS; };
        if (volet === 'add') {
          var enX = genre === 'x' && k !== 0;
          if (enX) { p1 = a + k; r1 = c + k; } else { q1 = b + k; s1 = d + k; }
          var quoi = enX ? absX(k) : nb(Math.abs(k)), suf = (k < 0 ? ' − ' : ' + ') + quoi;
          LopT = LopH = Lt + suf; RopT = RopH = Rt + suf;
          neutre = k === 0;
          note = neutre ? 'On ajoute <b>0</b> aux deux membres : rien ne change.'
                        : 'On <b>' + (k < 0 ? 'soustrait ' : 'ajoute ') + quoi + '</b> aux deux membres.';
        } else if (genre === 'fois') {
          p1 = k * a; q1 = k * b; r1 = k * c; s1 = k * d;
          var foisTxt = function (m, p, q) {
            if (k === 0) return '0 × ' + (deux(p, q) ? '(' + m + ')' : m);
            if (deux(p, q)) return nb(k) + '(' + m + ')';
            return nb(k) + ' × ' + (m.charAt(0) === '−' ? '(' + m + ')' : m);
          };
          LopT = LopH = foisTxt(Lt, a, b); RopT = RopH = foisTxt(Rt, c, d);
          if (k === 0) interdit = 'x0';
          neutre = k === 1;
          note = k === 0 ? '<b style="color:' + C_NO + '">On multiplie les deux membres par 0</b> : chaque membre devient 0.'
               : 'On <b>multiplie</b> les deux membres <b>par ' + nb(k) + '</b>.' + (neutre ? ' Multiplier par 1 ne change rien.' : '');
        } else {
          if (k === 0) {
            interdit = 'd0';
            LopT = LopH = Lt; RopT = RopH = Rt;
            note = '<b style="color:' + C_NO + '">Diviser par 0 est impossible</b> : cette opération n\'existe pas.';
          } else {
            p1 = a / k; q1 = b / k; r1 = c / k; s1 = d / k;
            var divTxt = function (m, p, q) { return (deux(p, q) ? '(' + m + ')' : m) + ' ÷ ' + par(k); };
            LopT = divTxt(Lt, a, b); RopT = divTxt(Rt, c, d);
            LopH = fracHtml(Lt, nb(k)); RopH = fracHtml(Rt, nb(k));
            neutre = k === 1;
            note = 'On <b>divise</b> les deux membres <b>par ' + nb(k) + '</b>.' + (neutre ? ' Diviser par 1 ne change rien.' : '');
          }
        }
        var xs = (d - b) / (a - c);
        D = { L0: function (x) { return a * x + b; }, R0: function (x) { return c * x + d; },
              L1: function (x) { return p1 * x + q1; }, R1: function (x) { return r1 * x + s1; },
              L0t: Lt, R0t: Rt, L1t: aff(p1, q1), R1t: aff(r1, s1),
              LopT: LopT, RopT: RopT, LopH: LopH, RopH: RopH,
              sols: [xs], interdit: interdit, neutre: neutre, bouge: interdit !== 'd0', noteOp: note, seul: '' };
        // et si on ne faisait l'opération qu'à gauche ?
        if (!interdit && !neutre) {
          var P = p1 - c, Q = q1 - d, x2 = Math.abs(P) < EPS ? null : -Q / P;
          if (x2 === null || Math.abs(x2 - xs) > EPS) {
            D.seul = 'Si on ne le faisait qu\'à gauche — <b>' + D.L1t + ' = ' + Rt + '</b> —, ' +
              (x2 === null ? (Math.abs(Q) < EPS ? 'tous les nombres seraient solutions' : 'il n\'y aurait plus aucune solution')
                           : 'la solution deviendrait <b>' + nb(x2) + '</b> au lieu de ' + nb(xs)) +
              ' : l\'équation aurait changé.';
          }
        }
      }
      D.Stxt = '{' + D.sols.map(nb).join(' ; ') + '}';
      D.solTxt = D.sols.map(nb).join(' et ');
    }
    function bornesFenetre() {
      var lo = Math.min.apply(null, D.sols), hi = Math.max.apply(null, D.sols);
      XL = Math.floor(lo) - 4; XR = Math.ceil(hi) + 4;
      board.setBoundingBox([XL - 0.6, 10.2, XR + 0.6, -9.4], false);
    }
    calcule();
    bornesFenetre();

    /* ==================================================================== */
    /* État de l'animation (absolu)                                          */
    /* ==================================================================== */
    var vis = { depart: 0, op: 0, reduit: 0, sol: 0 };
    var xv = 1;
    function applyStage(i, p) {
      var plan = PLANS[volet];
      vis.depart = vis.op = vis.reduit = vis.sol = 0;
      plan.forEach(function (k, j) { vis[k] = j < i ? 1 : (j === i ? p : 0); });
      if (plan.indexOf('reduit') < 0) vis.reduit = vis.op >= 1 ? 1 : 0;   // réécrire, c'est déjà réduire
      syncPX(); refresh(); renderPanel();
    }
    function clampX(v) { return Math.max(XL, Math.min(XR, Math.round(v * 2) / 2)); }
    // l'avancement de l'opération, et les deux membres tels qu'ils sont tracés
    function tt() { return D.bouge ? vis.op : 0; }
    function Lc(x) { var t = tt(); return D.L0(x) + t * (D.L1(x) - D.L0(x)); }
    function Rc(x) { var t = tt(); return D.R0(x) + t * (D.R1(x) - D.R0(x)); }
    function egal(x) { return Math.abs(Lc(x) - Rc(x)) < EPS; }
    function etape() { return D.interdit === 'd0' ? 0 : vis.reduit >= 1 ? 2 : vis.op >= 1 ? 1 : 0; }
    function LtxtCur() { var e = etape(); return e === 2 ? D.L1t : e === 1 ? D.LopT : D.L0t; }
    function RtxtCur() { var e = etape(); return e === 2 ? D.R1t : e === 1 ? D.RopT : D.R0t; }

    /* ==================================================================== */
    /* La figure                                                             */
    /* ==================================================================== */
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) { o._mv[key] = val; var t = {}; t[key] = val; o.setAttribute(t); }
    }
    function show(o, v) { attr(o, 'visible', !!v); }
    function pt(fx, fy) { return board.create('point', [fx, fy], { visible: false, fixed: true, name: '', withLabel: false }); }
    function etiquette(fx, fy, txt, col, taille, opts) {
      var o = { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 13, color: col,
                cssStyle: 'font-weight:800;background:rgba(255,255,255,.92);padding:0 4px;border-radius:5px;white-space:nowrap',
                fixed: true, highlight: false, layer: 9 };
      for (var k in (opts || {})) o[k] = opts[k];
      return board.create('text', [fx, fy, txt], o);
    }
    function cx() { return (XL + XR) / 2; }
    function clip(v) { return Math.max(-YT - 0.3, Math.min(YT + 0.3, v)); }
    function solX(m) { return D.sols[m] != null ? D.sols[m] : XL; }

    // Les axes.
    board.create('segment', [pt(function () { return XL - 0.6; }, function () { return 0; }),
                             pt(function () { return XR + 0.6; }, function () { return 0; })],
      { strokeColor: INK, strokeWidth: 1.6, firstArrow: ARROW, lastArrow: ARROW, fixed: true, highlight: false, layer: 3 });
    board.create('segment', [pt(function () { return 0; }, function () { return -YT; }), pt(function () { return 0; }, function () { return YT; })],
      { strokeColor: INK, strokeWidth: 1.6, lastArrow: ARROW, fixed: true, highlight: false, layer: 3 });
    for (var i = 0; i < 17; i++) {
      (function (i) {
        var gx = function () { return XL + i; }, dans = function () { return XL + i <= XR; };
        board.create('segment', [pt(gx, function () { return -0.18; }), pt(gx, function () { return 0.18; })],
          { strokeColor: SOFT, strokeWidth: 1, fixed: true, highlight: false, layer: 3, visible: dans });
        board.create('text', [gx, -0.62, function () { return fmt(XL + i); }],
          { anchorX: 'middle', anchorY: 'middle', fontSize: 10, color: SOFT, fixed: true, highlight: false, layer: 3, visible: dans });
      })(i);
    }
    for (var y = -6; y <= 6; y += 2) {
      if (y === 0) continue;
      (function (y) {
        board.create('segment', [pt(function () { return -0.15; }, function () { return y; }), pt(function () { return 0.15; }, function () { return y; })],
          { strokeColor: SOFT, strokeWidth: 1, fixed: true, highlight: false, layer: 3 });
        board.create('text', [-0.3, y, fmt(y)], { anchorX: 'right', anchorY: 'middle', fontSize: 10, color: SOFT, fixed: true, highlight: false, layer: 3 });
      })(y);
    }

    // Les courbes. Dans l'ordre : les deux membres de départ (en pointillé,
    // restés en place), les deux membres tels qu'ils sont, la réécriture.
    var gauche = function () { return XL - 0.6; };
    function fantome(f, col) {
      return board.create('functiongraph', [f, gauche, function () { return XR + 0.6; }],
        { strokeColor: col, strokeWidth: 1.5, dash: 2, strokeOpacity: 0.55, fixed: true, highlight: false, layer: 4, visible: false });
    }
    var GL = fantome(function (x) { return D.L0(x); }, C1), GR = fantome(function (x) { return D.R0(x); }, C2);
    function membre(f, col) {
      return board.create('functiongraph', [f, gauche, function () { return XL - 0.6 + vis.depart * (XR - XL + 1.2); }],
        { strokeColor: col, strokeWidth: 3, fixed: true, highlight: false, layer: 5, visible: false });
    }
    var CL = membre(Lc, C1), CR = membre(Rc, C2);
    var OV = board.create('functiongraph', [function (x) { return D.L1(x); }, gauche,
                                            function () { return XL - 0.6 + vis.op * (XR - XL + 1.2); }],
      { strokeColor: C_V, strokeWidth: 3.5, dash: 2, fixed: true, highlight: false, layer: 6, visible: false });

    // Le nom de chaque membre, au bout de sa courbe ; écartés s'ils se touchent.
    function yNom(lequel) {
      var x = XR + 0.2, lim = YT - 0.5;
      var yl = Math.max(-lim, Math.min(lim, Lc(x))), yr = Math.max(-lim, Math.min(lim, Rc(x)));
      if (Math.abs(yl - yr) < 1.1) {
        var m = (yl + yr) / 2, hautL = Lc(x) >= Rc(x);
        yl = m + (hautL ? 0.55 : -0.55); yr = m + (hautL ? -0.55 : 0.55);
      }
      return lequel === 'L' ? yl : yr;
    }
    var nomL = etiquette(function () { return XR + 0.2; }, function () { return yNom('L'); }, LtxtCur, C1, 12, { anchorX: 'right' });
    var nomR = etiquette(function () { return XR + 0.2; }, function () { return yNom('R'); }, RtxtCur, C2, 12, { anchorX: 'right' });

    // Les croisements : là où ils étaient (creux), là où ils sont (pleins), la
    // verticale qui les relie à l'axe, et la flèche du déplacement.
    var CROIX0 = [], CROIX = [], VERT = [], ETIQ = [], SOL = [];
    for (var m = 0; m < 2; m++) {
      (function (m) {
        var zx = function () { return solX(m); };
        CROIX0.push(board.create('point', [zx, function () { return D.L0(solX(m)); }],
          { size: 4, face: 'o', fillColor: '#fff', strokeColor: SOFT, strokeWidth: 2, fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 7, visible: false }));
        CROIX.push(board.create('point', [zx, function () { return Lc(solX(m)); }],
          { size: 4.5, face: 'o', fillColor: C_OK, strokeColor: '#fff', strokeWidth: 1.5, fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false }));
        VERT.push(board.create('segment', [pt(zx, function () { return -YT; }), pt(zx, function () { return YT; })],
          { strokeColor: C_OK, strokeWidth: 1.2, dash: 2, fixed: true, highlight: false, layer: 2, visible: false }));
        ETIQ.push(etiquette(zx, -1.3, function () { return 'x = ' + nb(solX(m)); }, C_OK, 12));
        SOL.push(board.create('point', [zx, 0], { size: 6, face: 'o', fillColor: C_OK, strokeColor: '#fff', strokeWidth: 2,
          fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false }));
      })(m);
    }
    var FLECHE = board.create('segment', [pt(function () { return solX(0); }, function () { return clip(D.L0(solX(0))); }),
                                          pt(function () { return solX(0); }, function () { return clip(Lc(solX(0))); })],
      { strokeColor: C_OK, strokeWidth: 3, lastArrow: ARROW, fixed: true, highlight: false, layer: 7, visible: false });
    // Multiplier par 0 : tout l'axe devient solution.
    var TOUT = board.create('segment', [pt(function () { return XL - 0.4; }, function () { return 0; }),
                                        pt(function () { return XR + 0.4; }, function () { return 0; })],
      { strokeColor: C_NO, strokeWidth: 6, strokeOpacity: 0.55, fixed: true, highlight: false, layer: 6, visible: false });

    // Le point de test et ses images sur les deux membres.
    var PX = board.create('point', [xv, 0], { size: 6, strokeWidth: 2, strokeColor: '#fff', fillColor: C_NO, fixed: false,
      withLabel: false, showInfobox: false, layer: 9 });
    function syncPX() { PX.setPosition(JXG.COORDS_BY_USER, [xv, 0]); }
    var GUIDE = board.create('segment', [pt(function () { return xv; }, function () { return clip(Math.min(0, Lc(xv), Rc(xv))); }),
                             pt(function () { return xv; }, function () { return clip(Math.max(0, Lc(xv), Rc(xv))); })],
      { strokeColor: SOFT, strokeWidth: 1, dash: 1, fixed: true, highlight: false, layer: 2, visible: false });
    function image(f, col) {
      return board.create('point', [function () { return xv; }, function () { return clip(f(xv)); }],
        { size: 4, fillColor: col, strokeColor: '#fff', strokeWidth: 1.5, fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false });
    }
    var P1 = image(Lc, C1), P2 = image(Rc, C2);
    function calcTxt() {
      var ok = egal(xv);
      return 'x = ' + fmt(xv) + ' : <span style="color:' + C1 + '">' + fmt(Lc(xv)) + '</span> ' + (ok ? '=' : '≠') +
             ' <span style="color:' + C2 + '">' + fmt(Rc(xv)) + '</span> ' +
             (ok ? '<span style="color:' + C_OK + '">✓ solution</span>' : '<span style="color:' + C_NO + '">✗</span>');
    }
    var labP = etiquette(function () { return xv; }, function () { return -YT - 0.6; }, calcTxt, INK, 12);
    PX.on('drag', function () {
      xv = clampX(PX.X());
      syncPX(); refresh(); renderPanel();
      board.update();
    });

    // Le titre et les deux lignes qui racontent l'étape.
    board.create('text', [cx, 9.55, function () { return LtxtCur() + ' = ' + RtxtCur(); }],
      { anchorX: 'middle', anchorY: 'middle', fontSize: 21, color: INK, cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });
    function capOp() {
      if (volet === 'ecr') return 'On <b style="color:' + C_V + '">' + cas.verbe + '</b> le membre de gauche : la nouvelle écriture retrace exactement la même courbe.';
      if (D.interdit === 'x0') return '<b style="color:' + C_NO + '">Multiplier par 0</b> écrase les deux droites sur l\'axe.';
      if (D.interdit === 'd0') return '<b style="color:' + C_NO + '">Diviser par 0 est impossible</b> : il n\'y a rien à tracer.';
      if (D.neutre) return 'Rien ne bouge : l\'équation est restée la même.';
      if (volet === 'add') {
        if (genre === 'x') return 'On ' + (K < 0 ? 'soustrait ' : 'ajoute ') + absX(K) + ' aux deux membres : les deux droites pivotent ensemble.';
        return 'On ' + (K < 0 ? 'soustrait ' : 'ajoute ') + nb(Math.abs(K)) + ' aux deux membres : les deux droites ' +
               (K < 0 ? 'descendent' : 'montent') + ' ensemble de ' + nb(Math.abs(K)) + '.';
      }
      return 'On ' + (genre === 'fois' ? 'multiplie' : 'divise') + ' les deux membres par ' + nb(K) + ' : les deux hauteurs sont ' +
             (genre === 'fois' ? 'multipliées' : 'divisées') + ' ensemble' + (K < 0 ? ', et les droites se retournent' : '') + '.';
    }
    function capHaut() {
      if (vis.sol > 0) {
        if (D.interdit === 'x0') return '<b style="color:' + C_NO + '">0 = 0 est vraie partout</b> : tous les nombres sont solutions. L\'équation a changé !';
        if (D.interdit === 'd0') return 'L\'équation n\'a pas bougé : <b style="color:' + C_OK + '">S = ' + D.Stxt + '</b>.';
        return (D.sols.length > 1 ? 'Mêmes croisements, mêmes solutions' : 'Le croisement est resté au-dessus de ' + D.solTxt + ' : même solution') +
               '. <b style="color:' + C_OK + '">Équations équivalentes, S = ' + D.Stxt + '</b>.';
      }
      if (vis.reduit > 0 && volet !== 'ecr') return D.interdit === 'x0' ? 'Chaque membre vaut 0, quel que soit x.'
                                                                         : 'On réduit chaque membre : la même équation, écrite plus simplement.';
      if (vis.op > 0) return capOp();
      if (vis.depart > 0) return 'Les deux membres sont égaux là où les courbes se croisent : en x = ' + D.solTxt + '.';
      return 'Chaque membre se trace : <b style="color:' + C1 + '">celui de gauche</b>, <b style="color:' + C2 + '">celui de droite</b>.';
    }
    function capBas() {
      if (vis.sol >= 1) return D.interdit === 'x0' ? 'Déplace le point : après × 0, l\'égalité est vraie pour n\'importe quel x.'
                                                   : 'Déplace le point : les deux équations sont vraies pour les mêmes x.';
      if (vis.op > 0 && D.bouge && !D.neutre && volet !== 'ecr') return 'En pointillé, l\'équation de départ. La flèche verte suit le croisement.';
      return '';
    }
    board.create('text', [cx, 8.55, capHaut], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK, fixed: true, highlight: false, layer: 9 });
    board.create('text', [cx, -9.0, capBas], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK, fixed: true, highlight: false, layer: 9 });

    function refresh() {
      var bouge = D.bouge && volet !== 'ecr' && vis.op > 0, pret = vis.depart >= 1;
      var x0fini = D.interdit === 'x0' && vis.sol > 0;
      show(GL, bouge); show(GR, bouge);
      show(CL, vis.depart > 0); show(CR, vis.depart > 0);
      show(OV, volet === 'ecr' && vis.op > 0);
      show(nomL, vis.depart >= 0.5); show(nomR, vis.depart >= 0.5);
      for (var m = 0; m < 2; m++) {
        var la = pret && D.sols[m] != null;
        var deplace = la && bouge && Math.abs(Lc(solX(m)) - D.L0(solX(m))) > 0.2;
        show(CROIX0[m], deplace && Math.abs(D.L0(solX(m))) <= YT + 0.3);
        show(CROIX[m], la && Math.abs(Lc(solX(m))) <= YT + 0.3);
        show(VERT[m], la); show(ETIQ[m], la && !x0fini);
        show(SOL[m], la && vis.sol > 0 && D.interdit !== 'x0');
      }
      show(FLECHE, pret && bouge && Math.abs(clip(Lc(solX(0))) - clip(D.L0(solX(0)))) > 0.45);
      show(TOUT, x0fini);
      attr(PX, 'fillColor', egal(xv) ? C_OK : C_NO);
      show(P1, pret); show(P2, pret); show(GUIDE, pret);
      attr(labP, 'anchorX', xv > XR - 2.5 ? 'right' : xv < XL + 2.5 ? 'left' : 'middle');
    }

    /* ==================================================================== */
    /* Les choix : volet, équation, opération                                */
    /* ==================================================================== */
    function el(tag, cls, txt) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt != null) e.textContent = txt;
      return e;
    }
    function pastille(parent, cls, txt, onclick) {
      var bt = el('button', 'ineq-preset ' + cls, txt);
      bt.type = 'button'; bt.onclick = onclick;
      parent.appendChild(bt);
      return bt;
    }
    function intitule(parent, t) {
      var s = el('span', null, t);
      s.style.cssText = 'align-self:center;font-size:.85rem;color:#64748b;margin-right:.2rem';
      parent.appendChild(s);
    }
    var root = el('div', 'eq-ui ineq-ui');
    var rowVolets = el('div', 'ineq-presets melange-choix mv-volets');
    var voletBtns = VOLETS.map(function (v) {
      return pastille(rowVolets, 'eqv-volet', v.nom, function () { choisirVolet(v.cle); });
    });
    root.appendChild(rowVolets);

    var rowCas = {}, casBtns = {};
    VOLETS.forEach(function (v) {
      var row = el('div', 'ineq-presets');
      casBtns[v.cle] = CAS[v.cle].map(function (cs, i) {
        return pastille(row, 'eqv-cas', nomCas(v.cle, cs), function () { choisirCas(i); });
      });
      rowCas[v.cle] = row;
      root.appendChild(row);
    });

    // L'opération : son genre (deux pastilles) et son nombre (un curseur).
    var rowOp = el('div', 'ineq-presets');
    intitule(rowOp, 'Aux deux membres :');
    var GENRES = { add: [['nb', 'ajouter un nombre'], ['x', 'ajouter un multiple de x']],
                   mul: [['fois', '× multiplier'], ['div', '÷ diviser']] };
    var genreBtns = [0, 1].map(function (j) {
      return pastille(rowOp, 'eqv-genre', '', function () {
        if (volet === 'ecr') return;
        genre = GENRES[volet][j][0];
        change();
      });
    });
    root.appendChild(rowOp);
    var rowK = el('div', 'ineq-presets');
    var lu = el('b', 'eqv-lu');
    lu.style.cssText = 'align-self:center;min-width:4.2rem;font-size:1.1rem';
    rowK.appendChild(lu);
    var curseur = el('input', 'eqv-k');
    curseur.type = 'range'; curseur.min = '-6'; curseur.max = '6'; curseur.step = '1';
    curseur.style.cssText = 'flex:1 1 9rem;min-width:8rem;max-width:16rem;align-self:center';
    rowK.appendChild(curseur);
    var randBtn = el('button', 'eq-rand', '🎲 Autre équation'); randBtn.type = 'button';
    rowK.appendChild(randBtn);
    root.appendChild(rowK);

    var stageEl = el('div', 'eq-stage'), linesEl = el('div', 'eq-lines');
    stageEl.appendChild(linesEl); root.appendChild(stageEl);
    var noteEl = el('div', 'eq-note');
    root.appendChild(noteEl);
    mv.extras.appendChild(root);
    var panel = el('div', 'props-panel');

    function marquer() {
      VOLETS.forEach(function (v, i) {
        voletBtns[i].className = 'ineq-preset eqv-volet' + (v.cle === volet ? ' active' : '');
        rowCas[v.cle].style.display = v.cle === volet ? '' : 'none';
        casBtns[v.cle].forEach(function (bt, j) { bt.className = 'ineq-preset eqv-cas' + (v.cle === volet && j === iCas ? ' active' : ''); });
      });
      rowOp.style.display = rowK.style.display = volet === 'ecr' ? 'none' : '';
      if (volet !== 'ecr') {
        genreBtns.forEach(function (bt, j) {
          bt.textContent = GENRES[volet][j][1];
          bt.className = 'ineq-preset eqv-genre' + (GENRES[volet][j][0] === genre ? ' active' : '');
        });
        curseur.value = String(K);
        lu.textContent = suffixeOp(genre, K);
        lu.style.color = D.interdit ? C_NO : INK;
      }
    }

    /* ==================================================================== */
    /* Le panneau : la chaîne des équivalences, ligne à ligne                */
    /* ==================================================================== */
    function renderLines() {
      var lignes = [];
      function ligne(html, note, final) {
        lignes.push((note ? '<div class="eq-line-note">' + note + '</div>' : '') +
                    '<div class="eq-line' + (final ? ' eq-sol' : '') + '">' + html + '</div>');
      }
      function eq(l, r) { return '<span style="color:' + C1 + '">' + l + '</span> = <span style="color:' + C2 + '">' + r + '</span>'; }
      ligne(eq(D.L0t, D.R0t));
      if (vis.op >= 1) {
        if (D.interdit === 'd0') ligne('✗ impossible', D.noteOp);
        else ligne((D.interdit ? '✗ ' : '⟺ ') + eq(D.LopH, D.RopH), D.noteOp);
      }
      if (volet !== 'ecr' && vis.reduit >= 1 && D.interdit !== 'd0') {
        ligne((D.interdit ? 'soit ' : '⟺ ') + eq(D.L1t, D.R1t), 'On réduit chaque membre.');
      }
      if (vis.sol >= 1) {
        if (D.interdit === 'x0') ligne('S = ℝ', 'Tous les nombres vérifient 0 = 0, alors que l\'équation de départ n\'avait que ' + D.solTxt +
                                               ' pour solution : les deux équations ne sont <b>pas</b> équivalentes.', true);
        else if (D.interdit === 'd0') ligne('S = ' + D.Stxt, 'L\'équation de départ est restée telle quelle.', true);
        else ligne('S = ' + D.Stxt, (D.sols.length > 1 ? 'Mêmes solutions' : 'Même solution') + ' avant et après : les équations sont <b>équivalentes</b>.', true);
      }
      linesEl.innerHTML = lignes.join('');
    }
    function renderNote() {
      if (vis.sol >= 1) {
        noteEl.innerHTML = D.interdit === 'x0'
          ? '<b style="color:' + C_NO + '">On ne multiplie jamais les deux membres par 0</b> : on perdrait toute l\'information de l\'équation.'
          : D.interdit === 'd0' ? '<b style="color:' + C_NO + '">On ne divise jamais par 0.</b> C\'est aussi pour cela qu\'on ne « simplifie » pas par x, qui peut valoir 0.'
          : '<b style="color:' + C_OK + '">' + D.L0t + ' = ' + D.R0t + ' ⟺ ' + D.L1t + ' = ' + D.R1t + '</b>';
      } else if (vis.op > 0) {
        noteEl.innerHTML = volet === 'ecr'
          ? 'Pour chaque x, les deux écritures donnent le même nombre : le membre n\'a pas changé de valeur.'
          : D.interdit ? '' : 'Les deux membres subissent la même opération : ils restent égaux aux mêmes endroits.';
      } else noteEl.innerHTML = '';
    }
    var REGLES = {
      add: 'On peut <b>ajouter ou soustraire un même nombre</b> aux deux membres d\'une équation : on obtient une équation équivalente.',
      mul: 'On peut <b>multiplier ou diviser</b> les deux membres par un même nombre <b>non nul</b> : on obtient une équation équivalente.',
      ecr: 'On peut <b>développer, factoriser ou réduire</b> un membre : son écriture change, pas sa valeur. L\'équation obtenue est équivalente.'
    };
    function renderPanel() {
      renderLines(); renderNote();
      var fini = vis.sol >= 1;
      var l0 = D.L0(xv), r0 = D.R0(xv), l1 = D.L1(xv), r1 = D.R1(xv);
      var v0 = Math.abs(l0 - r0) < EPS, v1 = Math.abs(l1 - r1) < EPS;
      function verdict(v) { return '<strong style="color:' + (v ? C_OK : C_NO) + '">' + (v ? 'vraie' : 'fausse') + '</strong>'; }
      var html =
        '<div class="props-label">La règle</div>' +
        '<p style="margin:.2rem 0 .5rem">' + REGLES[volet] + '</p>' +
        '<div class="props-label">Le résultat</div>' +
        '<p style="margin:.2rem 0 .5rem;font-size:1.15rem;font-weight:800;color:' + (fini ? (D.interdit === 'x0' ? C_NO : C_OK) : SOFT) + '">' +
          (!fini ? '… (lance l\'animation)'
                 : D.interdit === 'x0' ? 'Pas équivalentes : S = ' + D.Stxt + ' est devenu ℝ'
                 : D.interdit === 'd0' ? 'Opération impossible'
                 : D.L0t + ' = ' + D.R0t + ' ⟺ ' + D.L1t + ' = ' + D.R1t) + '</p>' +
        '<div class="props-label">Le point de test</div>' +
        '<p style="margin:.2rem 0 .5rem">Pour x = <strong>' + fmt(xv) + '</strong> — au départ : ' + fmt(l0) + (v0 ? ' = ' : ' ≠ ') + fmt(r0) +
          ', égalité ' + verdict(v0) +
          (D.interdit === 'd0' ? '.' : ' ; après : ' + fmt(l1) + (v1 ? ' = ' : ' ≠ ') + fmt(r1) + ', égalité ' + verdict(v1) + '. ' +
            (v0 === v1 ? 'Le même verdict, comme pour tous les x.' : '<b style="color:' + C_NO + '">Le verdict a changé</b> : les équations ne sont pas équivalentes.')) +
        '</p>';
      if (D.seul) html += '<div class="props-label">Et d\'un seul côté ?</div><p style="margin:.2rem 0 0">' + D.seul + '</p>';
      panel.innerHTML = html;
    }

    /* ==================================================================== */
    /* Les étapes                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    function reset() { applyStage(-1, 0); }
    var DUREES = { depart: 1200, op: 1600, reduit: 500, sol: 700 };
    function buildSteps() {
      return PLANS[volet].map(function (k, i) {
        return { dur: DUREES[k], step: function (p) { applyStage(i, p); }, after: function () { applyStage(i, 1); } };
      });
    }
    // (Re)part de zéro : nouvelle équation ou nouveau volet.
    function arm() {
      calcule();
      bornesFenetre();
      marquer();
      xv = clampX(D.sols[0] + (volet === 'ecr' ? 1 : -2));
      reset();
      anim.runSteps(buildSteps(), reset);
      board.update();
    }
    // Le nombre ou le genre de l'opération change : la figure suit en direct,
    // montrée dans son état final, sans relancer l'animation.
    function change() {
      calcule();
      marquer();
      applyStage(PLANS[volet].length - 1, 1);
      board.update();
    }

    function prendre(cs) { a = cs.a; b = cs.b; c = cs.c; d = cs.d; genre = cs.genre; K = cs.k; }
    function reglerCurseur() { var lim = volet === 'mul' ? 5 : 6; curseur.min = String(-lim); curseur.max = String(lim); }
    function choisirCas(i) {
      iCas = i;
      if (volet === 'ecr') cas = CAS.ecr[i]; else prendre(CAS[volet][i]);
      arm();
    }
    function choisirVolet(v) {
      volet = v;
      reglerCurseur();
      choisirCas(0);
    }
    curseur.oninput = curseur.onchange = function () {
      var v = parseInt(curseur.value, 10), lim = volet === 'mul' ? 5 : 6;
      if (isNaN(v) || volet === 'ecr') return;
      v = Math.max(-lim, Math.min(lim, v));
      if (v === K) return;
      K = v;
      change();
    };
    // Un tirage : une solution entière, un croisement près de l'axe, une
    // opération qui change vraiment quelque chose.
    function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
    function nonzero(lo, hi) { var v; do { v = randInt(lo, hi); } while (v === 0); return v; }
    randBtn.onclick = function () {
      if (volet === 'ecr') return;
      var xs = randInt(-3, 3), y0 = randInt(-2, 2);
      a = nonzero(-3, 3);
      do { c = randInt(-3, 3); } while (c === a);
      b = y0 - a * xs; d = y0 - c * xs;
      if (volet === 'add') { genre = Math.random() < 0.5 ? 'nb' : 'x'; K = nonzero(-4, 4); }
      else { genre = Math.random() < 0.5 ? 'fois' : 'div'; do { K = nonzero(-3, 3); } while (K === 1); }
      iCas = -1;
      arm();
    };

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: function () { arm(); } }
    ]);
    mv.extras.appendChild(panel);
    reglerCurseur();
    arm();
  }
});
