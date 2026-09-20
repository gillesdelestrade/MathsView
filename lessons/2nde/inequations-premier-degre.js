/*
 * Inéquations du premier degré (2nde) — résoudre a·x + b ⋈ c·x + d.
 *
 * Le message : une inéquation se résout EXACTEMENT comme une équation — les x
 * d'un côté, les nombres de l'autre, un terme qui traverse le signe change de
 * signe — jusqu'à la dernière ligne. Là, pour une équation, 2x = 4 donne x = 2
 * et −2x = 4 donne x = −2, sans état d'âme. Pour une inéquation, diviser par
 * un nombre NÉGATIF retourne le sens : −2x > 4 donne x < −2.
 *
 * Deux moitiés, qui doivent dire la même chose :
 *
 *   • le panneau, où la résolution s'écrit ligne à ligne comme au tableau —
 *     un terme « vole » par-dessus le signe et change en cours de route, et,
 *     au moment de diviser par un négatif, le symbole d'inégalité se RETOURNE
 *     sous les yeux (< devient >) ;
 *   • la droite graduée, qui JUSTIFIE ce retournement sans rien admettre : on
 *     arrive à −3x > 1, l'équation associée −3x = 1 donne une frontière qui
 *     coupe la droite en deux, et on teste un nombre de chaque côté. À gauche
 *     x = −1 donne 3 > 1 ✓, à droite x = 0 donne 0 > 1 ✗ : les solutions sont
 *     à GAUCHE de la frontière, donc x < −1/3. Le calcul n'a rien inventé.
 *
 * Le point sur la droite se déplace à la souris et refait le calcul pour la
 * valeur choisie (vert : l'inéquation est vraie, rouge : fausse).
 *
 * Deux exemples préréglés : 6 > 3x + 7 (les x sont à droite, on les ramène à
 * gauche : −3x > 1) et (4 − 5x)/2 + 7 > 13 (on isole la fraction, on multiplie
 * par 2 — positif, le sens ne bouge pas — puis −5x > 8). Le contraste est
 * voulu : multiplier ou diviser par un positif garde le sens, par un négatif
 * le retourne, et la figure le montre à chaque fois.
 *
 * Les étapes règlent un état ABSOLU (panneau : nombre de lignes écrites ;
 * figure : avancement de la frontière, des deux tests, du trait solution) pour
 * que « Précédent » rejoue exactement la même image. Le rafraîchissement est
 * appelé explicitement dans chaque étape, jamais depuis l'événement update.
 */
MathsView.register({
  id: 'inequations-premier-degre',
  title: 'Inéquations du premier degré',
  level: '2nde',
  category: 'algebre',
  exercices: ['inequations'],
  theme: 'Algèbre — comme une équation, sauf quand on divise par un négatif',
  description:
    'Une inéquation se résout <strong>comme une équation</strong> : on regroupe les ' +
    '<strong>x</strong> d\'un côté, les <strong>nombres</strong> de l\'autre, et un terme ' +
    'qui change de côté change de signe.' +
    '<br>La seule différence arrive à la dernière ligne. Pour une équation, ' +
    '\\(2x=4\\) donne \\(x=2\\) et \\(-2x=4\\) donne \\(x=-2\\). Pour une inéquation, ' +
    'diviser par un nombre <strong>négatif</strong> <strong>retourne le sens</strong> : ' +
    '\\(-2x>4\\) donne \\(x<-2\\).' +
    '<br>La droite graduée le <strong>justifie</strong> : la frontière \\(-2x=4\\) coupe ' +
    'la droite en deux, et on teste un nombre de chaque côté — \\(x=-3\\) donne \\(6>4\\), ' +
    'vrai ; \\(x=0\\) donne \\(0>4\\), faux. Les solutions sont à gauche.' +
    '<br>Choisis une inéquation ou saisis la tienne, puis clique sur ' +
    '<strong>▶ Animer</strong> (ou coche <strong>Pas à pas</strong>). ' +
    '<strong>Déplace le point</strong> sur la droite pour tester d\'autres valeurs.',
  notes:
    '<ul>' +
    '<li><strong>Même méthode qu\'une équation.</strong> On a le droit d\'ajouter ou de ' +
    'retrancher le même nombre aux deux membres : l\'ordre est conservé. C\'est ce qui ' +
    'permet de « faire passer » un terme de l\'autre côté en changeant son signe.</li>' +
    '<li><strong>Multiplier ou diviser par un nombre positif</strong> conserve aussi ' +
    'l\'ordre : \\(2x\\leqslant 8\\) donne \\(x\\leqslant 4\\).</li>' +
    '<li><strong>Multiplier ou diviser par un nombre négatif retourne l\'ordre.</strong> ' +
    'Si \\(-x>5\\), les nombres qui conviennent sont \\(-6\\), \\(-10\\), \\(-100\\)… ' +
    'tous plus petits que \\(-5\\) : donc \\(x<-5\\). En général : ' +
    '$$-3x>1\\iff x<-\\dfrac{1}{3}\\qquad\\text{et}\\qquad -2x\\leqslant 4\\iff x\\geqslant -2.$$</li>' +
    '<li><strong>Pourquoi la figure le confirme.</strong> L\'équation associée ' +
    '\\(-3x=1\\) donne la <strong>frontière</strong> \\(x=-\\frac13\\), qui coupe la droite ' +
    'en deux. De chaque côté, l\'inéquation est ou bien toujours vraie, ou bien toujours ' +
    'fausse : il suffit de <strong>tester un nombre de chaque côté</strong>.</li>' +
    '<li><strong>Pour éviter le négatif.</strong> Dans \\(6>3x+7\\), on peut aussi ' +
    'laisser les \\(x\\) à droite : \\(6-7>3x\\), soit \\(-1>3x\\), et diviser par 3 : ' +
    '\\(-\\frac13>x\\), c\'est-à-dire \\(x<-\\frac13\\). Même réponse — il faut juste ' +
    'savoir lire une inégalité dans les deux sens.</li>' +
    '<li><strong>La réponse est un intervalle.</strong> \\(x<-\\frac13\\) s\'écrit ' +
    '\\(S=\\left]-\\infty\\,;-\\frac13\\right[\\). Inégalité stricte : crochet ' +
    '<strong>ouvert</strong> ; inégalité large (\\(\\leqslant\\), \\(\\geqslant\\)) : ' +
    'crochet <strong>fermé</strong>, la frontière est solution.</li>' +
    '<li><strong>Vérifier.</strong> On remplace \\(x\\) par une valeur de \\(S\\) dans ' +
    'l\'inéquation de départ : \\(x=-1\\) dans \\(6>3x+7\\) donne \\(6>4\\), vrai. ' +
    'Et par une valeur hors de \\(S\\) : \\(x=0\\) donne \\(6>7\\), faux.</li>' +
    '</ul>',
  board: {
    boundingbox: [-8.9, 4.4, 8.9, -2.4], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Inéquations du premier degré',
    figures: [{
      legende: '−x > 5 : vrai pour −6, −7, −8… à gauche de −5. Donc x < −5.',
      boundingbox: [-11.2, 3.1, 1.2, -1.5],
      keepaspectratio: false,
      largeur: 62, hauteur: 30,
      dessine: function (board) {
        var g = '#334155', ok = '#16a34a', no = '#dc2626', vio = '#7c3aed';
        board.create('segment', [[-11, 0], [1, 0]], { strokeColor: g, strokeWidth: 1.4, lastArrow: true, fixed: true, highlight: false });
        for (var i = -10; i <= 0; i++) {
          board.create('segment', [[i, -0.1], [i, 0.1]], { strokeColor: g, strokeWidth: 1, fixed: true, highlight: false });
          board.create('text', [i, -0.25, String(i).replace('-', '−')], { anchorX: 'middle', anchorY: 'top', fontSize: 9, color: '#64748b', fixed: true, highlight: false });
          if (i !== -5) {
            var v = i < -5;
            board.create('text', [i, 0.55, v ? '✓' : '✗'], { anchorX: 'middle', anchorY: 'middle', fontSize: 10, color: v ? ok : no, cssStyle: 'font-weight:700', fixed: true, highlight: false });
          }
        }
        // La frontière, et le trait des solutions vers la gauche.
        board.create('segment', [[-5, -0.5], [-5, 1.6]], { strokeColor: vio, strokeWidth: 1.2, dash: 2, fixed: true, highlight: false });
        board.create('text', [-5, 1.75, 'frontière : −x = 5'], { anchorX: 'middle', anchorY: 'bottom', fontSize: 9, color: vio, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('segment', [[-10.8, 0], [-5, 0]], { strokeColor: ok, strokeWidth: 3.5, firstArrow: true, fixed: true, highlight: false });
        board.create('curve', [[-4.8, -5, -5, -4.8], [0.3, 0.3, -0.3, -0.3]], { strokeColor: ok, strokeWidth: 2, fixed: true, highlight: false });
        board.create('text', [-8, 1.15, 'x < −5'], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: ok, cssStyle: 'font-weight:800', fixed: true, highlight: false });
        board.create('text', [-2, 1.15, 'faux'], { anchorX: 'middle', anchorY: 'middle', fontSize: 10, color: no, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [-5, 2.55, '−x > 5'], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: g, cssStyle: 'font-weight:800', fixed: true, highlight: false });
      }
    }],
    points: [
      'Une inéquation se résout <b>comme une équation</b> : les x d\'un côté, les nombres de l\'autre. Un terme qui change de côté change de signe.',
      'Ajouter, retrancher un nombre, multiplier ou diviser par un nombre <b>positif</b> : le sens de l\'inégalité <b>ne change pas</b>.',
      'Multiplier ou diviser par un nombre <b>négatif</b> : le sens <b>change</b>. < devient >, ⩽ devient ⩾.',
      'Pourquoi : −x > 5 est vrai pour −6, −10, −100… tous plus petits que −5. Donc x < −5.',
      'Vérifier : la frontière est la solution de l\'équation associée ; on teste un nombre de chaque côté.',
      'La réponse s\'écrit en intervalle : x < −5 ⟺ x ∈ ]−∞ ; −5[. Stricte : crochet ouvert ; large : fermé.'
    ],
    exemples: [
      '\\( 6 > 3x + 7 \\) → \\( -3x + 6 > 7 \\) → \\( -3x > 1 \\) → ÷ (−3), le sens change : \\( x < -\\tfrac{1}{3} \\), \\( S = \\;]-\\infty\\,;-\\tfrac{1}{3}[ \\).',
      '\\( \\tfrac{4 - 5x}{2} + 7 > 13 \\) → \\( \\tfrac{4 - 5x}{2} > 6 \\) → \\( 4 - 5x > 12 \\) → \\( -5x > 8 \\) → \\( x < -1{,}6 \\).',
      '\\( 2x - 3 \\leqslant 5 \\) → \\( 2x \\leqslant 8 \\) → on divise par 2, positif : \\( x \\leqslant 4 \\), \\( S = \\;]-\\infty\\,;4] \\).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette et symboles                                                  */
    /* ==================================================================== */
    var C_OK = '#16a34a';    // vert : l'inéquation est vraie ici
    var C_NO = '#dc2626';    // rouge : elle est fausse
    var C_F  = '#7c3aed';    // violet : la frontière
    var INK  = '#334155';
    var SOFT = '#94a3b8';
    var ARROW = { type: 2, size: 7 };

    var REL = { lt: '<', gt: '>', le: '⩽', ge: '⩾' };            // en texte brut
    var RELH = { lt: '&lt;', gt: '&gt;', le: '⩽', ge: '⩾' };    // dans du HTML
    var MIROIR = { lt: 'gt', gt: 'lt', le: 'ge', ge: 'le' };
    function cmp(rel, u, v) {
      var e = 1e-9;
      if (rel === 'lt') return u < v - e;
      if (rel === 'gt') return u > v + e;
      if (rel === 'le') return u <= v + e;
      return u >= v - e;
    }
    function large(rel) { return rel === 'le' || rel === 'ge'; }

    /* ==================================================================== */
    /* Arithmétique et écritures                                             */
    /* ==================================================================== */
    function pgcd(x, y) { x = Math.abs(x); y = Math.abs(y); while (y) { var t = y; y = x % y; x = t; } return x || 1; }
    function termine(dn) { dn = Math.abs(dn); while (dn % 2 === 0) dn /= 2; while (dn % 5 === 0) dn /= 5; return dn === 1; }
    function fmt(v) {
      var t = Math.round(v * 100) / 100;
      if (Object.is(t, -0)) t = 0;
      return t.toString().replace('-', '−').replace('.', ',');
    }
    function paren(v) { return v < 0 ? '(' + fmt(v) + ')' : fmt(v); }
    function absX(k) { var n = Math.abs(k); return n === 1 ? 'x' : n + 'x'; }
    function signExpl(k, isX) { return (k < 0 ? '−' : '+') + (isX ? absX(k) : Math.abs(k)); }
    function kParen(k) { return k < 0 ? '(−' + Math.abs(k) + ')' : ('' + k); }
    // « −3 × (−1) », « −(−1) », « 3 » : le produit k·x écrit pour une valeur.
    function prodTxt(k, x) {
      if (k === 1) return fmt(x);
      if (k === -1) return '−' + paren(x);
      return fmt(k) + ' × ' + paren(x);
    }

    /* ==================================================================== */
    /* Rendu d'un membre                                                     */
    /* ==================================================================== */
    // terms : [{k, x}] dans l'ordre d'écriture (k = 0 : absent). s : 'l' | 'r'.
    // tok : les termes portent data-side / data-role, pour le vol par-dessus
    // le signe.
    function side(terms, s, tok) {
      var out = '', first = true;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i];
        if (t.k === 0) continue;
        var body = t.x ? absX(t.k) : ('' + Math.abs(t.k));
        var role = t.x ? 'x' : 'const';
        var span = tok ? '<span class="eq-tok" data-side="' + s + '" data-role="' + role + '">' : '<span class="eq-tok">';
        if (first) out += span + (t.k < 0 ? '−' : '') + body + '</span>';
        else out += '<span class="eq-op">' + (t.k < 0 ? ' − ' : ' + ') + '</span>' + span + body + '</span>';
        first = false;
      }
      if (!first) return out;
      return '<span class="eq-tok" data-side="' + s + '" data-role="const">0</span>';
    }
    function fracHtml(numHtml, denHtml, s) {
      var tok = s ? ' eq-tok" data-side="' + s + '" data-role="frac' : '';
      var den = s ? '<span class="eq-den" data-side="' + s + '" data-role="den">' : '<span class="eq-den">';
      return '<span class="eq-frac' + tok + '"><span class="eq-num">' + numHtml + '</span>' +
             den + denHtml + '</span></span>';
    }
    // (p + q·x)/n + r, le membre de gauche de la forme avec fraction.
    function fracSide(p, q, n, r, s) {
      var h = fracHtml(side([{ k: p, x: 0 }, { k: q, x: 1 }], s, false), n, s);
      if (r !== 0) h += '<span class="eq-op">' + (r < 0 ? ' − ' : ' + ') + '</span>' +
                        '<span class="eq-tok" data-side="' + s + '" data-role="const">' + Math.abs(r) + '</span>';
      return h;
    }
    function relHtml(rel, hot, q) {
      var st = (q != null) ? ' style="transform:scaleX(' + Math.cos(Math.PI * q).toFixed(3) + ')"' : '';
      return '<span class="ineq-rel' + (hot ? ' hot' : '') + '"' + st + '>' + RELH[rel] + '</span>';
    }
    function eqn(l, r, rel, hot, q) {
      return '<span class="eq-eqn">' + l + relHtml(rel, hot, q) + r + '</span>';
    }
    // La valeur n0/d0 (d0 > 0), en fraction réduite, avec l'écriture décimale
    // quand elle existe.
    function valHtml(n0, d0) {
      if (d0 === 1) return fmt(n0);
      var h = (n0 < 0 ? '−' : '') + fracHtml(Math.abs(n0), d0, null);
      if (termine(d0)) h += ' <span class="eq-approx">= ' + fmt(n0 / d0) + '</span>';
      return h;
    }
    function valTxt(n0, d0) {
      if (d0 === 1) return fmt(n0);
      return termine(d0) ? fmt(n0 / d0) : (n0 < 0 ? '−' : '') + Math.abs(n0) + '/' + d0;
    }
    function intervalle(relSol, vHtml) {
      if (relSol === 'lt') return ']−∞ ; ' + vHtml + '[';
      if (relSol === 'le') return ']−∞ ; ' + vHtml + ']';
      if (relSol === 'gt') return ']' + vHtml + ' ; +∞[';
      return '[' + vHtml + ' ; +∞[';
    }

    /* ==================================================================== */
    /* Le problème courant                                                   */
    /* ==================================================================== */
    var mode = 'lin';                               // 'lin' | 'frac'
    var a = 0, b = 6, rel = 'gt', c = 3, d = 7;     // 6 > 3x + 7
    var F = { p: 4, q: -5, n: 2, r: 7, k: 13 };     // (4 − 5x)/2 + 7 > 13

    // Ce qu'on en tire : la forme réduite k·x ⋈ R, la frontière, la solution.
    // Initialisé avant tout board.create : JSXGraph évalue le contenu d'un
    // texte dès sa création, et ces contenus lisent `red`.
    var red = { k: 0, R: 0, vrai: false, x0: null };
    var states = [];      // les lignes du panneau
    var plan = [];        // les étapes : {kind:'line', t} | {kind:'front'} | {kind:'test', s}
    var iRed = 0;         // l'indice de la ligne k·x ⋈ R

    // L'inéquation de départ, évaluée en x : { g, dr, gTxt, drTxt, ok }.
    function evalOrig(x) {
      var g, dr, gTxt, drTxt;
      if (mode === 'frac') {
        var num = F.p + F.q * x;
        g = num / F.n + F.r;
        gTxt = '(' + fmt(F.p) + (F.q < 0 ? ' − ' : ' + ') + prodTxt(Math.abs(F.q), x) + ') ÷ ' + F.n +
               (F.r ? (F.r < 0 ? ' − ' : ' + ') + Math.abs(F.r) : '') + ' = ' + fmt(g);
        dr = F.k; drTxt = fmt(F.k);
      } else {
        g = a * x + b; dr = c * x + d;
        gTxt = sideVal(a, b, x); drTxt = sideVal(c, d, x);
      }
      return { g: g, dr: dr, gTxt: gTxt, drTxt: drTxt, ok: cmp(rel, g, dr) };
    }
    function sideVal(kx, kc, x) {
      if (kx === 0) return fmt(kc);
      var t = prodTxt(kx, x);
      if (kc !== 0) t += (kc < 0 ? ' − ' : ' + ') + Math.abs(kc);
      return (kc !== 0 || Math.abs(kx) !== 1 || x < 0) ? t + ' = ' + fmt(kx * x + kc) : t;
    }
    // La forme réduite k·x ⋈ R, évaluée en x.
    function evalRed(x) {
      var v = red.k * x;
      // « −1 » ou « 3 » sont déjà des nombres : pas de « = » redondant.
      var deja = red.k === 1 || (red.k === -1 && x >= 0);
      return { v: v, txt: prodTxt(red.k, x) + (deja ? '' : ' = ' + fmt(v)), ok: cmp(rel, v, red.R) };
    }

    function buildStates() {
      states = []; plan = [];
      var lx, lc, rx, rc;
      if (mode === 'frac') {
        var p = F.p, q = F.q, n = F.n, r = F.r, k0 = F.k;
        states.push({ eqn: eqn(fracSide(p, q, n, r, 'l'), side([{ k: k0, x: 0 }], 'r', true), rel), note: '', rel: rel });
        var k1 = k0 - r;
        if (r !== 0) {
          states.push({
            eqn: eqn(fracSide(p, q, n, 0, 'l'), side([{ k: k1, x: 0 }], 'r', true), rel),
            note: 'On isole la fraction : <b class="hot">' + signExpl(r) + '</b> traverse le signe et devient ' +
                  '<b class="hot">' + signExpl(-r) + '</b> — comme pour une équation. On réduit : ' +
                  fmt(k0) + (r < 0 ? ' + ' : ' − ') + Math.abs(r) + ' = ' + fmt(k1) + '.',
            move: { side: 'l', role: 'const', start: signExpl(r), end: signExpl(-r), kind: 'add' }, rel: rel
          });
        }
        states.push({
          eqn: eqn(side([{ k: p, x: 0 }, { k: q, x: 1 }], 'l', true), side([{ k: n * k1, x: 0 }], 'r', true), rel),
          note: 'Le <b class="hot">÷ ' + n + '</b> traverse le signe et devient <b class="hot">× ' + n + '</b>. ' +
                'On multiplie par ' + n + ', un nombre <b>positif</b> : le sens de l\'inégalité <b>ne change pas</b>. ' +
                n + ' × ' + paren(k1) + ' = ' + fmt(n * k1) + '.',
          move: { side: 'l', role: 'den', start: '÷ ' + n, end: '× ' + n, kind: 'mul' }, rel: rel
        });
        lx = q; lc = p; rx = 0; rc = n * k1;
      } else {
        lx = a; lc = b; rx = c; rc = d;
        states.push({ eqn: eqn(side([{ k: a, x: 1 }, { k: b, x: 0 }], 'l', true), side([{ k: c, x: 1 }, { k: d, x: 0 }], 'r', true), rel), note: '', rel: rel });
      }
      var k = lx - rx, R = rc - lc;

      // Les x à gauche : le terme rx·x traverse le signe.
      if (rx !== 0) {
        states.push({
          eqn: eqn(side([{ k: k, x: 1 }, { k: lc, x: 0 }], 'l', true), side([{ k: rc, x: 0 }], 'r', true), rel),
          note: 'Les <b>x</b> vont à gauche : <b class="hot">' + signExpl(rx, true) + '</b> traverse le signe et devient ' +
                '<b class="hot">' + signExpl(-rx, true) + '</b> — exactement comme pour une équation.' +
                (lx !== 0 ? ' On réduit : ' + absX(lx) + (rx < 0 ? ' + ' : ' − ') + absX(rx) + ' = ' + absX(k) + '.' : ''),
          move: { side: 'r', role: 'x', start: signExpl(rx, true), end: signExpl(-rx, true), kind: 'add' }, rel: rel
        });
      }
      // Les nombres à droite : lc traverse le signe.
      if (lc !== 0) {
        states.push({
          eqn: eqn(side([{ k: k, x: 1 }], 'l', true), side([{ k: R, x: 0 }], 'r', true), rel),
          note: 'Les <b>nombres</b> vont à droite : <b class="hot">' + signExpl(lc) + '</b> traverse le signe et devient ' +
                '<b class="hot">' + signExpl(-lc) + '</b>. On réduit : ' + fmt(rc) + (lc < 0 ? ' + ' : ' − ') + Math.abs(lc) + ' = ' + fmt(R) + '.',
          move: { side: 'l', role: 'const', start: signExpl(lc), end: signExpl(-lc), kind: 'add' }, rel: rel
        });
      }
      iRed = states.length - 1;
      for (var t = 1; t <= iRed; t++) plan.push({ kind: 'line', t: t });

      if (k === 0) {
        var vrai = cmp(rel, 0, R);
        red = { k: 0, R: R, vrai: vrai, x0: null };
        states.push({
          eqn: '<span class="eq-eqn">' + (vrai ? 'Toujours vrai : S = ℝ' : 'Jamais vrai : S = ∅') + '</span>',
          note: 'Les x ont disparu : il reste <b>' + fmt(0) + ' ' + RELH[rel] + ' ' + fmt(R) + '</b>, qui est ' +
                (vrai ? '<b>vrai</b> quel que soit x : tous les réels sont solutions.' : '<b>faux</b> quel que soit x : aucune solution.'),
          final: true, rel: rel
        });
        plan.push({ kind: 'line', t: states.length - 1 });
        return;
      }

      var n0 = R, d0 = k;
      if (d0 < 0) { n0 = -n0; d0 = -d0; }
      var g = pgcd(n0, d0); n0 /= g; d0 /= g;
      var relSol = k < 0 ? MIROIR[rel] : rel;
      red = { k: k, R: R, x0: R / k, n0: n0, d0: d0, relSol: relSol, vrai: null };

      plan.push({ kind: 'front' });
      plan.push({ kind: 'test', s: -1 });
      plan.push({ kind: 'test', s: 1 });

      var lhsX = '<span class="eq-tok" data-side="l" data-role="x">x</span>';
      if (k !== 1) {
        var gauche = cmp(relSol, red.x0 - 1, red.x0);
        states.push({
          eqn: eqn(lhsX, valHtml(n0, d0), relSol, k < 0),
          note: 'x n\'est pas seul : <b class="hot">× ' + kParen(k) + '</b> traverse le signe et devient <b class="hot">÷ ' + kParen(k) + '</b>. ' +
                (k < 0
                  ? 'On divise par un nombre <b class="hot">négatif</b> : le sens de l\'inégalité <b class="hot">change</b>, ' +
                    RELH[rel] + ' devient ' + RELH[relSol] + '. La figure le confirme : les solutions sont ' +
                    (gauche ? 'à gauche' : 'à droite') + ' de la frontière.'
                  : 'On divise par un nombre <b>positif</b> : le sens <b>ne change pas</b>, ' +
                    'et la figure est d\'accord : les solutions sont ' + (gauche ? 'à gauche' : 'à droite') + ' de la frontière.'),
          move: { side: 'l', role: 'x', start: '× ' + kParen(k), end: '÷ ' + kParen(k), kind: 'div' },
          flip: k < 0, relOld: rel, rel: relSol
        });
        plan.push({ kind: 'line', t: states.length - 1 });
      }
      states.push({
        eqn: '<span class="eq-eqn">S = ' + intervalle(relSol, valHtml(n0, d0).replace(/ <span class="eq-approx">.*<\/span>/, '')) + '</span>',
        note: 'On écrit la réponse en intervalle. ' + (large(relSol)
          ? 'Inégalité large : le crochet est <b>fermé</b> en ' + valTxt(n0, d0) + ', la frontière est solution.'
          : 'Inégalité stricte : le crochet est <b>ouvert</b> en ' + valTxt(n0, d0) + ', la frontière n\'est pas solution.'),
        final: true, rel: relSol
      });
      plan.push({ kind: 'line', t: states.length - 1 });
    }

    /* ==================================================================== */
    /* État de l'animation (absolu)                                          */
    /* ==================================================================== */
    var prog = [];                                   // avancement de chaque étape du plan
    var vis = { front: 0, testL: 0, testR: 0, sol: 0 };
    var lineShown = 0;                               // lignes écrites au panneau
    var xv = 2;                                      // le point de test (à la souris)
    var XL = -6, XR = 6;                             // les graduations affichées

    function progOf(kind, s) {
      for (var j = 0; j < plan.length; j++) if (plan[j].kind === kind && (s == null || plan[j].s === s)) return prog[j] || 0;
      return 0;
    }
    // Le trait solution apparaît avec la première ligne écrite APRÈS les tests
    // (la division, ou l'intervalle si x était déjà seul).
    function progSol() {
      var apres = false;
      for (var j = 0; j < plan.length; j++) {
        if (plan[j].kind === 'test') apres = true;
        else if (apres && plan[j].kind === 'line') return prog[j] || 0;
      }
      if (red && red.k === 0) return prog[plan.length - 1] || 0;
      return 0;
    }
    function x0() { return red && red.x0 != null ? red.x0 : 0; }
    function DL() { return x0() - XL; }
    function DR() { return XR - x0(); }
    function okAt(x) { return red.k === 0 ? red.vrai : cmp(rel, red.k * x, red.R); }
    function okSide(s) { return okAt(x0() + s * 0.5); }
    function clampX(v) { return Math.max(XL, Math.min(XR, Math.round(v * 2) / 2)); }

    // Où est le point : porté par le test en cours, sinon là où l'élève l'a mis.
    function pPos() {
      if (vis.testR >= 1) return xv;
      if (vis.testR > 0) {
        var p = vis.testR;
        return p < 0.25 ? XL + (x0() - XL) * (p / 0.25) : x0() + (p - 0.25) / 0.75 * DR();
      }
      if (vis.testL >= 1) return XL;
      if (vis.testL > 0) return x0() - vis.testL * DL();
      return xv;
    }
    // La marque ✓/✗ au-dessus de la graduation m est posée quand le point l'a
    // dépassée.
    function markVisible(m) {
      if (red.k === 0) return vis.sol >= 1;
      if (Math.abs(m - x0()) < 1e-9) return false;
      if (m < x0()) return vis.testL * DL() >= x0() - m - 1e-9;
      var pr = vis.testR <= 0.25 ? 0 : (vis.testR - 0.25) / 0.75;
      return pr * DR() >= m - x0() - 1e-9;
    }

    /* ==================================================================== */
    /* La figure                                                             */
    /* ==================================================================== */
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) { o._mv[key] = val; var t = {}; t[key] = val; o.setAttribute(t); }
    }
    function show(o, v) { attr(o, 'visible', !!v); }
    function pt(fx, fy) { return board.create('point', [fx, fy], { visible: false, fixed: true, name: '', withLabel: false }); }
    function etiquette(fx, fy, txt, couleur, taille, layer) {
      return board.create('text', [fx, fy, txt], {
        anchorX: 'middle', anchorY: 'middle', fontSize: taille || 13, color: couleur,
        cssStyle: 'font-weight:800;background:rgba(255,255,255,.92);padding:0 4px;border-radius:5px;white-space:nowrap',
        fixed: true, highlight: false, layer: layer || 9
      });
    }

    var Y = 0, YH = 2.5, YB = -1.1;    // l'axe, et la bande coupée en deux

    // Les deux moitiés de la droite (et du plan), de part et d'autre de la frontière.
    function moitie(s) {
      var e = function () { return s < 0 ? XL - 0.9 : XR + 0.9; };
      return board.create('polygon', [pt(e, function () { return YB; }), pt(x0, function () { return YB; }),
                                      pt(x0, function () { return YH; }), pt(e, function () { return YH; })], {
        fillColor: SOFT, fillOpacity: 0.13, borders: { visible: false }, vertices: { visible: false },
        highlight: false, fixed: true, layer: 1, visible: false
      });
    }
    var moitieL = moitie(-1), moitieR = moitie(1);

    // La droite graduée.
    board.create('segment', [pt(function () { return XL - 0.9; }, function () { return Y; }),
                             pt(function () { return XR + 0.9; }, function () { return Y; })], {
      strokeColor: INK, strokeWidth: 2, firstArrow: ARROW, lastArrow: ARROW, fixed: true, highlight: false, layer: 4
    });
    var NT = 15, marques = [];
    for (var i = 0; i < NT; i++) {
      (function (i) {
        var gx = function () { return XL + i; };
        var dans = function () { return XL + i <= XR; };
        board.create('segment', [pt(gx, function () { return Y - 0.16; }), pt(gx, function () { return Y + 0.16; })], {
          strokeColor: SOFT, strokeWidth: 1.2, fixed: true, highlight: false, layer: 4,
          visible: dans
        });
        board.create('text', [gx, -0.58, function () { return fmt(XL + i); }], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: SOFT, fixed: true, highlight: false, layer: 4,
          visible: dans
        });
        marques.push(board.create('text', [gx, 0.75, function () { return okAt(XL + i) ? '✓' : '✗'; }], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: C_OK, cssStyle: 'font-weight:800',
          fixed: true, highlight: false, layer: 6, visible: false
        }));
      })(i);
    }

    // La frontière : un pointillé qui pousse depuis l'axe, et son étiquette.
    var frontiere = board.create('segment', [pt(x0, function () { return YB * vis.front; }),
                                             pt(x0, function () { return YH * vis.front; })], {
      strokeColor: C_F, strokeWidth: 2, dash: 2, fixed: true, highlight: false, layer: 5, visible: false
    });
    var ptF = board.create('point', [x0, Y], {
      size: 4, face: 'o', fillColor: '#fff', strokeColor: C_F, strokeWidth: 2.5,
      fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false
    });
    var labF = etiquette(x0, YH + 0.32, function () {
      return red.k ? 'frontière : ' + kxTxt(red.k) + ' = ' + fmt(red.R) + ', soit x = ' + valTxt(red.n0, red.d0) : '';
    }, C_F, 12);
    var labF2 = etiquette(x0, -1.5, function () { return red.k ? 'x = ' + valTxt(red.n0, red.d0) : ''; }, C_F, 12);

    // Le trait des solutions : depuis la frontière vers un bord, avec sa flèche.
    function bout(s) { return function () { return red.k === 0 ? (s < 0 ? XL - 0.9 : XR + 0.9) : x0() + s * vis.sol * (s < 0 ? DL() + 0.9 : DR() + 0.9); }; }
    var solL = board.create('segment', [pt(bout(-1), function () { return Y; }), pt(x0, function () { return Y; })], {
      strokeColor: C_OK, strokeWidth: 7, firstArrow: ARROW, fixed: true, highlight: false, layer: 5, visible: false
    });
    var solR = board.create('segment', [pt(x0, function () { return Y; }), pt(bout(1), function () { return Y; })], {
      strokeColor: C_OK, strokeWidth: 7, lastArrow: ARROW, fixed: true, highlight: false, layer: 5, visible: false
    });
    // Le crochet en x0 : bras vers les solutions si la frontière en fait partie
    // (crochet fermé), vers l'extérieur sinon (crochet ouvert).
    function dirCrochet() {
      if (!red.k) return 1;
      var g = cmp(red.relSol, x0() - 1, x0());          // les solutions sont à gauche
      var ferme = large(red.relSol);
      return (g ? -1 : 1) * (ferme ? 1 : -1);
    }
    var H = 0.3, crochet = [];
    (function () {
      var V1 = pt(x0, function () { return Y - H; }), V2 = pt(x0, function () { return Y + H; });
      var A1 = pt(function () { return x0() + 0.35 * dirCrochet(); }, function () { return Y + H; });
      var A2 = pt(function () { return x0() + 0.35 * dirCrochet(); }, function () { return Y - H; });
      var o = { strokeWidth: 4, strokeColor: C_OK, lineCap: 'round', fixed: true, highlight: false, layer: 8, visible: false };
      crochet.push(board.create('segment', [V1, V2], o), board.create('segment', [V2, A1], o), board.create('segment', [V1, A2], o));
    })();

    // Le point de test, déplaçable à la souris, et son calcul.
    var PX = board.create('point', [xv, Y], {
      size: 6, strokeWidth: 2, strokeColor: '#fff', fillColor: C_OK, fixed: false,
      withLabel: false, showInfobox: false, layer: 9
    });
    function syncPX() { PX.setPosition(JXG.COORDS_BY_USER, [pPos(), Y]); }
    function reduitVu() { return red.k !== 0 && lineShown >= iRed; }
    function calcTxt(x) {
      if (reduitVu()) {
        var r = evalRed(x);
        return r.txt + ' <span style="color:' + (r.ok ? C_OK : C_NO) + '">' + RELH[rel] + ' ' + fmt(red.R) + ' ' + (r.ok ? '✓' : '✗') + '</span>';
      }
      var o = evalOrig(x);
      return o.gTxt + ' <span style="color:' + (o.ok ? C_OK : C_NO) + '">' + RELH[rel] + '</span> ' + o.drTxt +
             ' <span style="color:' + (o.ok ? C_OK : C_NO) + '">' + (o.ok ? '✓' : '✗') + '</span>';
    }
    var labP = etiquette(pPos, 1.45, function () { return 'x = ' + fmt(pPos()) + ' : ' + calcTxt(pPos()); }, INK, 13);
    PX.on('drag', function () {
      if (vis.testL > 0 && vis.testR < 1) { syncPX(); return; }   // pendant un test, le point est piloté
      xv = clampX(PX.X());
      syncPX(); refresh(); renderPanel();
      board.update();
    });

    // Le titre et les deux lignes qui racontent l'étape.
    function titre() {
      if (red.k === 0 || !reduitVu()) return plainOrig(true);
      if (vis.sol >= 1 && red.k !== 1) return 'x ' + RELH[red.relSol] + ' ' + valTxt(red.n0, red.d0);
      return kxTxt(red.k) + ' ' + RELH[rel] + ' ' + fmt(red.R);
    }
    function kxTxt(k) { return k === 1 ? 'x' : k === -1 ? '−x' : fmt(k) + 'x'; }
    board.create('text', [function () { return (XL + XR) / 2; }, 3.95, titre], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 22, color: INK, cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9
    });
    function capHaut() {
      if (red.k === 0) return vis.sol >= 1 ? (red.vrai ? 'Tous les nombres conviennent : S = ℝ.' : 'Aucun nombre ne convient : S = ∅.')
                                           : 'On regroupe : les x à gauche, les nombres à droite.';
      var gauche = okSide(-1);
      if (vis.sol > 0) return 'Les solutions sont <b style="color:' + C_OK + '">' + (gauche ? 'à gauche' : 'à droite') + '</b> de la frontière : ' +
                              '<b>x ' + RELH[red.relSol] + ' ' + valTxt(red.n0, red.d0) + '</b>. ' +
                              (red.k < 0 ? 'Diviser par ' + fmt(red.k) + ' a bien <b style="color:' + C_NO + '">retourné le sens</b>.' :
                               red.k === 1 ? 'x était déjà seul.' : 'Diviser par ' + fmt(red.k) + ' (positif) garde le sens.');
      if (vis.testR > 0) return 'À droite de la frontière : ' + (okSide(1) ? 'tous les nombres conviennent ✓' : 'aucun nombre ne convient ✗') + '.';
      if (vis.testL > 0) return 'À gauche de la frontière : ' + (gauche ? 'tous les nombres conviennent ✓' : 'aucun nombre ne convient ✗') + '.';
      if (vis.front > 0) return 'L\'équation associée <b>' + kxTxt(red.k) + ' = ' + fmt(red.R) + '</b> donne la <b style="color:' + C_F + '">frontière</b>, qui coupe la droite en deux.';
      return reduitVu() ? 'Reste à diviser par ' + fmt(red.k) + '. Avant ça, regardons la droite graduée.'
                        : 'On regroupe : les x à gauche, les nombres à droite — comme pour une équation.';
    }
    function capBas() {
      if (red.k === 0) return '';
      if (vis.sol >= 1) return '<b style="color:' + C_OK + '">S = ' + intervalle(red.relSol, valTxt(red.n0, red.d0)) + '</b> — déplace le point pour tester d\'autres valeurs.';
      if (vis.testL > 0) return 'De chaque côté de la frontière, l\'inéquation est toujours vraie, ou toujours fausse : un seul test suffit.';
      return '';
    }
    board.create('text', [function () { return (XL + XR) / 2; }, 3.25, capHaut], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: INK, fixed: true, highlight: false, layer: 9
    });
    board.create('text', [function () { return (XL + XR) / 2; }, -2.02, capBas], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: INK, fixed: true, highlight: false, layer: 9
    });

    function refresh() {
      var k0 = red.k === 0;
      var g = !k0 && okSide(-1), dr = !k0 && okSide(1);

      show(moitieL, !k0 && vis.front > 0); show(moitieR, !k0 && vis.front > 0);
      attr(moitieL, 'fillColor', vis.testL > 0 ? (g ? C_OK : C_NO) : SOFT);
      attr(moitieR, 'fillColor', vis.testR > 0.25 ? (dr ? C_OK : C_NO) : SOFT);

      show(frontiere, !k0 && vis.front > 0);
      show(ptF, !k0 && vis.front > 0.3);
      show(labF, !k0 && vis.front > 0.5);
      show(labF2, !k0 && vis.front >= 1);

      marques.forEach(function (m, i) {
        var x = XL + i, vu = x <= XR && markVisible(x);
        show(m, vu);
        attr(m, 'color', okAt(x) ? C_OK : C_NO);
      });

      var solVu = vis.sol > 0 && (k0 ? red.vrai : true);
      show(solL, solVu && (k0 || g));
      show(solR, solVu && (k0 || dr));
      crochet.forEach(function (s) { show(s, !k0 && vis.sol > 0); });

      var x = pPos(), okP = okAt(x);
      attr(PX, 'fillColor', okP ? C_OK : C_NO);
      show(labP, true);
      // L'étiquette du point reste dans le cadre : près d'un bord, elle
      // s'accroche à ce bord au lieu d'être centrée sur le point.
      attr(labP, 'anchorX', x > XR - 3 ? 'right' : x < XL + 3 ? 'left' : 'middle');
    }

    /* ==================================================================== */
    /* Le panneau : la résolution, ligne à ligne                             */
    /* ==================================================================== */
    function el(tag, cls, txt) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt != null) e.textContent = txt;
      return e;
    }
    var root = el('div', 'eq-ui ineq-ui');
    var presets = el('div', 'ineq-presets');
    var PRESETS = [
      { label: '6 > 3x + 7', set: function () { mode = 'lin'; a = 0; b = 6; rel = 'gt'; c = 3; d = 7; } },
      { label: '(4 − 5x)/2 + 7 > 13', set: function () { mode = 'frac'; F = { p: 4, q: -5, n: 2, r: 7, k: 13 }; rel = 'gt'; } },
      { label: '−x > 5', set: function () { mode = 'lin'; a = -1; b = 0; rel = 'gt'; c = 0; d = 5; } },
      { label: '2x − 3 ⩽ 5', set: function () { mode = 'lin'; a = 2; b = -3; rel = 'le'; c = 0; d = 5; } },
      { label: '5x + 1 ⩾ 2x − 8', set: function () { mode = 'lin'; a = 5; b = 1; rel = 'ge'; c = 2; d = -8; } }
    ];
    var presetBtns = PRESETS.map(function (p) {
      var bt = el('button', 'ineq-preset', p.label);
      bt.type = 'button';
      bt.onclick = function () { p.set(); syncInputs(); lastKey = null; arm(); };
      presets.appendChild(bt);
      return bt;
    });
    root.appendChild(presets);

    var entry = el('div', 'eq-entry');
    entry.appendChild(el('span', 'eq-entry-lab', 'Inéquation :'));
    function num(cls) { var i = el('input', cls); i.type = 'number'; i.step = '1'; return i; }
    var inA = num('eq-a'), inB = num('eq-b'), inC = num('eq-c'), inD = num('eq-d');
    var sel = el('select', 'ineq-sel');
    ['lt', 'le', 'gt', 'ge'].forEach(function (k) { var o = el('option', null, REL[k]); o.value = k; sel.appendChild(o); });
    entry.appendChild(inA); entry.appendChild(el('span', 'eq-x', 'x'));
    entry.appendChild(el('span', 'eq-plus', '+')); entry.appendChild(inB);
    entry.appendChild(sel);
    entry.appendChild(inC); entry.appendChild(el('span', 'eq-x', 'x'));
    entry.appendChild(el('span', 'eq-plus', '+')); entry.appendChild(inD);
    var randBtn = el('button', 'eq-rand', '🎲 Autre inéquation'); randBtn.type = 'button';
    var randFrac = el('button', 'eq-rand', '🎲 Avec une fraction'); randFrac.type = 'button';
    entry.appendChild(randBtn); entry.appendChild(randFrac);
    root.appendChild(entry);

    var form = el('div', 'eq-form'); form.innerHTML = 'soit&nbsp; ';
    var formTxt = el('b', 'eq-form-txt'); form.appendChild(formTxt);
    root.appendChild(form);
    var stageEl = el('div', 'eq-stage'), linesEl = el('div', 'eq-lines');
    stageEl.appendChild(linesEl); root.appendChild(stageEl);
    var noteEl = el('div', 'eq-note'); root.appendChild(noteEl);
    mv.extras.appendChild(root);

    var ghost = null, lastRendered = null;

    // Les lignes 0..n ; q ∈ [0 ; 1] : le symbole de la ligne n est en train de
    // se retourner (on montre l'ANCIEN symbole, en miroir progressif).
    function renderLines(n, q) {
      var html = '';
      for (var i = 0; i <= n && i < states.length; i++) {
        var st = states[i];
        var noteHtml = st.note ? '<div class="eq-line-note">' + st.note + '</div>' : '';
        var cls = 'eq-line' + (st.final && i === n ? ' eq-sol' : '');
        var e = st.eqn;
        if (q != null && i === n && st.flip) {
          e = e.replace(/<span class="ineq-rel hot">[^<]*<\/span>/, relHtml(st.relOld, true, q));
        }
        html += noteHtml + '<div class="' + cls + '">' + e + '</div>';
      }
      linesEl.innerHTML = html;
      lastRendered = (q == null) ? n : null;
    }
    function ensureLines(n) { if (lastRendered !== n) renderLines(n); }

    /* ---- Vol d'un terme par-dessus le signe --------------------------------- */
    function removeGhost() { if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost); ghost = null; }
    function flight(t, p) {
      var m = states[t].move;
      if (!m) return;
      var allLines = linesEl.querySelectorAll('.eq-line');
      var srcLine = allLines[t - 1];
      if (!srcLine) return;
      var srcTok = srcLine.querySelector('.eq-eqn [data-side="' + m.side + '"][data-role="' + m.role + '"]');
      var pivot = srcLine.querySelector('.ineq-rel');
      if (!srcTok || !pivot) return;
      var sRect = stageEl.getBoundingClientRect();
      var tRect = srcTok.getBoundingClientRect();
      var eRect = pivot.getBoundingClientRect();
      var srcX = tRect.left - sRect.left, srcY = tRect.top - sRect.top;
      var eqCx = (eRect.left + eRect.right) / 2 - sRect.left;
      var tgtX = 2 * eqCx - (srcX + tRect.width);     // symétrique par rapport au signe
      var tgtY = srcY + 44;                           // vers la ligne suivante
      if (!ghost) { ghost = document.createElement('div'); ghost.className = 'eq-ghost'; stageEl.appendChild(ghost); }
      ghost.innerHTML = p < 0.5 ? m.start : m.end;
      ghost.classList.toggle('eq-ghost-flip', p >= 0.5);
      var x = srcX + (tgtX - srcX) * p;
      var y = srcY + (tgtY - srcY) * p - 22 * Math.sin(Math.PI * p);
      ghost.style.left = x + 'px';
      ghost.style.top = y + 'px';
      srcTok.style.opacity = Math.max(0, 1 - 1.8 * p);
      noteEl.innerHTML = states[t].note;
    }
    function commit(t) {
      removeGhost();
      ensureLines(t);
      noteEl.innerHTML = '';          // la note est désormais écrite au-dessus de la ligne
    }
    // La ligne t en cours d'écriture : le terme vole, puis, s'il y a lieu, le
    // symbole se retourne.
    function animLine(t, p) {
      var st = states[t];
      if (st.flip) {
        if (p < 0.55) { ensureLines(t - 1); flight(t, p / 0.55); }
        else { removeGhost(); renderLines(t, (p - 0.55) / 0.45); noteEl.innerHTML = st.note; }
      } else if (st.move) { ensureLines(t - 1); flight(t, p); }
      else { ensureLines(t - 1); noteEl.innerHTML = st.note; }
    }

    /* ---- Le résultat, et le point de test ------------------------------------ */
    var panel = el('div', 'props-panel');
    function renderPanel() {
      var x = pPos(), o = evalOrig(x);
      var S = red.k === 0 ? (red.vrai ? 'ℝ' : '∅') : intervalle(red.relSol, valTxt(red.n0, red.d0));
      var fini = vis.sol >= 1 || (red.k === 0 && lineShown >= states.length - 1);
      var dans = okAt(x);
      panel.innerHTML =
        '<div class="props-label">Le résultat</div>' +
        '<p style="margin:.2rem 0 .5rem;font-size:1.15rem;font-weight:800;color:' + (fini ? C_OK : SOFT) + '">' +
          (fini ? 'S = ' + S : 'S = … (lance l\'animation)') + '</p>' +
        '<div class="props-label">Le point de test, dans l\'inéquation de départ</div>' +
        '<p style="margin:.2rem 0 0">x = <strong>' + fmt(x) + '</strong> : ' + o.gTxt + ' ' + RELH[rel] + ' ' + o.drTxt +
          ' → <strong style="color:' + (o.ok ? C_OK : C_NO) + '">' + (o.ok ? 'vrai' : 'faux') + '</strong>' +
          (fini ? ', et en effet ' + fmt(x) + (dans ? ' ∈ ' : ' ∉ ') + S + '.' : '.') +
        '</p>';
    }

    /* ==================================================================== */
    /* Les étapes                                                            */
    /* ==================================================================== */
    function applyStage(i, p) {
      for (var j = 0; j < plan.length; j++) prog[j] = j < i ? 1 : (j === i ? p : 0);
      vis.front = progOf('front'); vis.testL = progOf('test', -1); vis.testR = progOf('test', 1); vis.sol = progSol();
      lineShown = 0;
      plan.forEach(function (e, j) { if (e.kind === 'line' && prog[j] >= 1) lineShown = Math.max(lineShown, e.t); });
      var cur = plan[i];
      if (cur && cur.kind === 'line' && p < 1) animLine(cur.t, p);
      else commit(lineShown);
      if (cur && cur.kind === 'test' && p >= 1) xv = cur.s < 0 ? XL : XR;
      syncPX(); refresh(); renderPanel();
    }
    function reset() { xv = clampX(Math.round(x0()) + 2); applyStage(-1, 0); }
    function buildSteps() {
      return plan.map(function (e, i) {
        var dur = e.kind === 'test' ? 1500 : e.kind === 'front' ? 700 : (states[e.t].flip ? 1300 : 800);
        return { dur: dur, step: function (p) { applyStage(i, p); }, after: function () { applyStage(i, 1); } };
      });
    }

    /* ==================================================================== */
    /* Saisie et (re)démarrage                                               */
    /* ==================================================================== */
    function plainSide(terms) {
      var out = '', first = true;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i]; if (t.k === 0) continue;
        var body = t.x ? absX(t.k) : ('' + Math.abs(t.k));
        out += first ? (t.k < 0 ? '−' : '') + body : (t.k < 0 ? ' − ' : ' + ') + body;
        first = false;
      }
      return first ? '0' : out;
    }
    function plainOrig(html) {
      var sym = (html ? RELH : REL)[rel];
      if (mode === 'frac') {
        return '(' + plainSide([{ k: F.p, x: 0 }, { k: F.q, x: 1 }]) + ')/' + F.n +
               (F.r ? (F.r < 0 ? ' − ' : ' + ') + Math.abs(F.r) : '') + ' ' + sym + ' ' + fmt(F.k);
      }
      return plainSide([{ k: a, x: 1 }, { k: b, x: 0 }]) + ' ' + sym + ' ' + plainSide([{ k: c, x: 1 }, { k: d, x: 0 }]);
    }
    function clampInputs() {
      var na = parseInt(inA.value, 10), nb = parseInt(inB.value, 10);
      var nc = parseInt(inC.value, 10), nd = parseInt(inD.value, 10);
      a = isNaN(na) ? a : Math.max(-10, Math.min(10, na));
      c = isNaN(nc) ? c : Math.max(-10, Math.min(10, nc));
      b = isNaN(nb) ? b : Math.max(-30, Math.min(30, nb));
      d = isNaN(nd) ? d : Math.max(-30, Math.min(30, nd));
      if (['lt', 'le', 'gt', 'ge'].indexOf(sel.value) >= 0) rel = sel.value;
    }
    function syncInputs() {
      inA.value = a; inB.value = b; inC.value = c; inD.value = d; sel.value = rel;
      entry.className = 'eq-entry' + (mode === 'frac' ? ' is-off' : '');
    }
    function bornes() {
      if (!red.k) { XL = -6; XR = 6; }
      else { XL = Math.floor(red.x0) - 6; XR = Math.ceil(red.x0) + 6; }
      board.setBoundingBox([XL - 0.9, 4.4, XR + 0.9, -2.4], false);
    }

    var anim = mv.createAnimator();
    var lastKey = null;
    function arm() {
      var key = mode + ':' + (mode === 'frac' ? [F.p, F.q, F.n, F.r, F.k].join(',') : [a, b, c, d].join(',')) + rel;
      if (key === lastKey) return;
      lastKey = key;
      presetBtns.forEach(function (bt, i) { bt.className = 'ineq-preset' + (PRESETS[i].label === plainOrig() ? ' active' : ''); });
      formTxt.textContent = plainOrig();
      buildStates();
      bornes();
      lastRendered = null;
      reset();
      anim.runSteps(buildSteps(), reset);
      board.update();
    }

    function saisie() { mode = 'lin'; clampInputs(); syncInputs(); arm(); }
    inA.oninput = inB.oninput = inC.oninput = inD.oninput = function () { mode = 'lin'; clampInputs(); entry.className = 'eq-entry'; arm(); };
    inA.onchange = inB.onchange = inC.onchange = inD.onchange = saisie;
    sel.onchange = saisie;

    function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
    function nonzero(lo, hi) { var v; do { v = randInt(lo, hi); } while (v === 0); return v; }
    var RELS = ['lt', 'le', 'gt', 'ge'];
    randBtn.onclick = function () {
      mode = 'lin';
      a = randInt(-6, 6);
      do { c = randInt(-6, 6); } while (c === a);
      b = randInt(-12, 12); d = randInt(-12, 12); rel = RELS[randInt(0, 3)];
      syncInputs(); lastKey = null; arm();
    };
    randFrac.onclick = function () {
      mode = 'frac';
      F = { p: randInt(-9, 9), q: nonzero(-6, 6), n: randInt(2, 5), r: nonzero(-9, 9), k: randInt(-12, 12) };
      rel = RELS[randInt(0, 3)];
      syncInputs(); lastKey = null; arm();
    };

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: function () { lastKey = null; arm(); } }
    ]);
    mv.extras.appendChild(panel);

    syncInputs();
    arm();
  }
});
