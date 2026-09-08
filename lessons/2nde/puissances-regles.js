/*
 * Règles de calcul sur les puissances entières relatives (2nde).
 *
 * Leçon sans figure JSXGraph : tout est en HTML dans mv.extras, et le moteur
 * d'animation partagé révèle les lignes du calcul une à une.
 *
 * ---------------------------------------------------------------------------
 * Une règle qu'on ne retient pas : on la VOIT
 * ---------------------------------------------------------------------------
 * a^n × a^p = a^(n+p) n'a rien de mystérieux : a^n, c'est n facteurs a ; a^p,
 * c'est p facteurs a ; mis bout à bout, ça fait n + p facteurs a. L'animation
 * décompose les deux puissances, retire les parenthèses devenues inutiles, et
 * COMPTE les facteurs un par un. L'exposant s'additionne parce qu'on compte.
 *
 * ---------------------------------------------------------------------------
 * Le quotient se DÉDUIT du produit
 * ---------------------------------------------------------------------------
 * On ne pose pas une seconde règle : on lit la première à l'envers.
 * a^(n−p) × a^p = a^n (règle du produit), donc a^(n−p) est le nombre qui,
 * multiplié par a^p, redonne a^n — c'est-à-dire a^n ÷ a^p. Puis on vérifie
 * sur les facteurs : on simplifie la fraction, un a du haut contre un a du
 * bas, et il reste n − p facteurs. Quand p > n, il reste des facteurs EN BAS :
 * c'est la porte d'entrée de l'exposant négatif.
 *
 * ---------------------------------------------------------------------------
 * L'exposant nul et l'exposant négatif, même déduction
 * ---------------------------------------------------------------------------
 * La règle du quotient avec n = p donne a^0 = 1 ; avec n = 0 elle donne
 * a^(−p) = 1/a^p. Ce ne sont pas des conventions tombées du ciel : ce sont
 * les seules valeurs qui gardent la règle vraie pour tous les entiers.
 *
 * Tout est entier et exact : bases de 2 à 5 (ou 10), exposants petits, pour
 * que les valeurs restent lisibles et se vérifient de tête.
 */
MathsView.register({
  id: 'puissances-regles',
  title: 'Règles de calcul sur les puissances',
  level: '2nde',
  category: 'calcul',
  subcategory: 'Puissances',
  theme: 'Nombres — a^n × a^p = a^(n+p), a^n ÷ a^p = a^(n−p), exposants nuls et négatifs',
  description:
    'Pour un nombre \\( a \\neq 0 \\) et des entiers relatifs \\( n \\) et \\( p \\) : ' +
    '\\( a^n \\times a^p = a^{n+p} \\) et \\( \\dfrac{a^n}{a^p} = a^{n-p} \\). ' +
    '<br>L\'animation <strong>décompose</strong> \\( a^n \\) et \\( a^p \\) en produits de ' +
    'facteurs, puis <strong>compte</strong> les facteurs : voilà d\'où vient le ' +
    '\\( n + p \\). Le quotient s\'en <strong>déduit</strong>, et avec lui ' +
    '\\( a^0 = 1 \\) et \\( a^{-p} = \\dfrac{1}{a^p} \\).' +
    '<br>Les trois boutons choisissent le sujet ; <strong>🎲 Autres nombres</strong> tire ' +
    'une nouvelle base et de nouveaux exposants.',
  notes:
    '<p><strong>Les règles</strong>, pour \\( a \\neq 0 \\), \\( b \\neq 0 \\) et \\( n, p \\) ' +
    'entiers relatifs :</p>' +
    '<ul>' +
    '<li>\\( a^n \\times a^p = a^{n+p} \\) — même base, on <strong>additionne</strong> les ' +
    'exposants ;</li>' +
    '<li>\\( \\dfrac{a^n}{a^p} = a^{n-p} \\) — même base, on <strong>soustrait</strong> les ' +
    'exposants ;</li>' +
    '<li>\\( a^0 = 1 \\) et \\( a^{-n} = \\dfrac{1}{a^n} \\) : un exposant négatif désigne ' +
    'un <strong>inverse</strong>, pas un nombre négatif — \\( 2^{-3} = \\dfrac18 \\) ;</li>' +
    '<li>\\( (a^n)^p = a^{n \\times p} \\) et \\( (a \\times b)^n = a^n \\times b^n \\) ' +
    '(non animées ici, mais elles se voient de la même façon en comptant les facteurs).</li>' +
    '</ul>' +
    '<p><strong>Pourquoi on additionne.</strong> \\( a^n \\) est un produit de \\( n \\) ' +
    'facteurs \\( a \\), \\( a^p \\) un produit de \\( p \\) facteurs \\( a \\). Le produit ' +
    'des deux est un produit de \\( n + p \\) facteurs \\( a \\). L\'exposant ' +
    '<em>compte</em> : il s\'additionne.</p>' +
    '<p><strong>Les pièges.</strong> \\( 2^3 \\times 2^2 \\) n\'est ni \\( 4^5 \\) (la base ' +
    'ne change pas) ni \\( 2^6 \\) (on n\'a pas multiplié les exposants) : c\'est ' +
    '\\( 2^5 = 32 \\). Et \\( 2^3 \\times 3^2 \\) ne se simplifie pas : les bases sont ' +
    'différentes. Enfin \\( 2^3 + 2^2 \\) n\'est pas \\( 2^5 \\) : les règles portent sur ' +
    'les <em>produits</em>, jamais sur les sommes.</p>' +
    '<p><strong>Le quotient n\'est pas une seconde règle.</strong> Puisque ' +
    '\\( a^{n-p} \\times a^p = a^n \\), le nombre \\( a^{n-p} \\) est celui qui, multiplié ' +
    'par \\( a^p \\), redonne \\( a^n \\) : c\'est \\( a^n \\div a^p \\). Sur les facteurs, ' +
    'c\'est la simplification d\'une fraction, un \\( a \\) du haut contre un \\( a \\) du ' +
    'bas.</p>' +
    '<p><strong>Avec les puissances de 10</strong>, tout se lit sur les zéros : ' +
    '\\( 10^3 \\times 10^4 = 10^7 \\), \\( 10^{-2} = 0{,}01 \\), et l\'écriture ' +
    'scientifique \\( 3{,}2 \\times 10^{-5} \\) en découle.</p>',

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Règles de calcul sur les puissances',
    figures: [{
      legende: '2³ × 2² : trois facteurs, puis deux, ça fait cinq facteurs.',
      boundingbox: [-0.5, 3.7, 9.4, -1.1],
      keepaspectratio: false,
      largeur: 60, hauteur: 30,
      dessine: function (board) {
        function boite(x, col) {
          board.create('polygon', [[x, 0.6], [x + 1.2, 0.6], [x + 1.2, 2], [x, 2]], {
            fillColor: col, fillOpacity: .5, borders: { strokeColor: '#334155', strokeWidth: 1.2 },
            vertices: { visible: false }, highlight: false, fixed: true
          });
          board.create('text', [x + 0.6, 1.3, '2'], { anchorX: 'middle', anchorY: 'middle', fontSize: 14, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        function T(x, y, t, col, taille) {
          board.create('text', [x, y, t], { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 12, color: col || '#1e293b', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        var xs = [0, 1.7, 3.4, 5.9, 7.6];
        xs.forEach(function (x, i) { boite(x, i < 3 ? '#93c5fd' : '#fcd34d'); });
        T(1.45, 1.3, '×', '#64748b'); T(3.15, 1.3, '×', '#64748b'); T(7.35, 1.3, '×', '#64748b');
        T(5.25, 1.3, '×', '#1e293b', 18);
        // Les accolades, en traits : 2³ et 2² au-dessus, 2⁵ dessous.
        function accolade(x1, x2, t, col) {
          board.create('curve', [[x1, x1, x2, x2], [2.15, 2.4, 2.4, 2.15]], { strokeColor: col, strokeWidth: 1.4, fixed: true, highlight: false });
          T((x1 + x2) / 2, 2.95, t, col, 13);
        }
        accolade(0, 4.6, '2³ = 8', '#2563eb');
        accolade(5.9, 8.8, '2² = 4', '#d97706');
        board.create('curve', [[0, 0, 8.8, 8.8], [0.45, 0.2, 0.2, 0.45]], { strokeColor: '#16a34a', strokeWidth: 1.4, fixed: true, highlight: false });
        T(4.4, -0.4, '2³⁺² = 2⁵ = 32', '#16a34a', 13);
      }
    }],
    points: [
      '\\( a^n = a \\times a \\times \\cdots \\times a \\) (n facteurs) : l\'exposant <b>compte les facteurs</b>.',
      'Même base, <b>produit</b> : \\( a^n \\times a^p = a^{n+p} \\). On <b>additionne</b> les exposants.',
      'Même base, <b>quotient</b> : \\( \\dfrac{a^n}{a^p} = a^{n-p} \\). On <b>soustrait</b> les exposants.',
      '\\( a^0 = 1 \\) et \\( a^{-n} = \\dfrac{1}{a^n} \\) : un exposant négatif désigne un <b>inverse</b>, pas un nombre négatif.',
      '\\( (a^n)^p = a^{n \\times p} \\) et \\( (a \\times b)^n = a^n \\times b^n \\).',
      'Ces règles portent sur les <b>produits</b>, jamais sur les sommes, et seulement pour une <b>même base</b>.'
    ],
    exemples: [
      '\\( 2^3 \\times 2^2 = 2^5 = 32 \\) (ni \\( 4^5 \\), ni \\( 2^6 \\)) ; \\( \\dfrac{5^7}{5^4} = 5^3 = 125 \\) ; \\( (3^2)^4 = 3^8 \\).',
      '\\( 2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8} \\) ; \\( 7^0 = 1 \\) ; \\( 10^3 \\times 10^4 = 10^7 \\) ; \\( 10^{-2} = 0{,}01 \\).',
      'Pièges : \\( 2^3 + 2^2 = 8 + 4 = 12 \\), pas \\( 2^5 \\) ; \\( 2^3 \\times 3^2 \\) ne se simplifie pas (bases différentes).'
    ]
  },

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();   // leçon sans figure

    /* ==================================================================== */
    /* Les nombres : entiers, exacts, écrits à la française                 */
    /* ==================================================================== */
    function fr(n) {
      var s = String(n), out = '', c = 0, i;
      for (i = s.length - 1; i >= 0; i--) {
        out = s.charAt(i) + out;
        if (++c % 3 === 0 && i > 0) out = '&nbsp;' + out;
      }
      return out;
    }
    function puissance(a, n) {                 // entier exact, n ≥ 0 petit
      var r = 1;
      for (var i = 0; i < n; i++) r *= a;
      return r;
    }
    function exp(n) { return n < 0 ? '−' + (-n) : String(n); }
    function pow(a, n) {
      return '<span class="pui-base">' + a + '</span><sup class="pui-exp">' + exp(n) + '</sup>';
    }
    // a^n avec un exposant écrit en toutes lettres (n + p, n − p…)
    function powTxt(a, t) {
      return '<span class="pui-base">' + a + '</span><sup class="pui-exp">' + t + '</sup>';
    }
    function frac(num, den) {
      return '<span class="pr-frac"><span class="pr-num">' + num + '</span>' +
             '<span class="pr-den">' + den + '</span></span>';
    }
    // La valeur de a^n, n relatif : un entier, ou « 1/entier ».
    function valeur(a, n) {
      return n >= 0 ? fr(puissance(a, n)) : frac('1', fr(puissance(a, -n)));
    }

    /* Un produit de k facteurs a, chaque facteur étant un <span class="pr-f">.
       `opts.barre` : nombre de facteurs barrés (depuis la gauche) ;
       `opts.compte` : nombre de facteurs numérotés (depuis la gauche) ;
       `opts.cls` : classe de couleur du groupe. */
    function facteurs(a, k, opts) {
      opts = opts || {};
      var t = [];
      for (var i = 0; i < k; i++) {
        var cls = 'pr-f' + (opts.cls ? ' ' + opts.cls : '') +
                  (i < (opts.barre || 0) ? ' barre' : '') +
                  (i < (opts.compte || 0) ? ' compte' : '');
        t.push('<span class="' + cls + '"' +
               (i < (opts.compte || 0) ? ' data-i="' + (i + 1) + '"' : '') + '>' + a + '</span>');
      }
      return t.length ? t.join('<span class="pr-x">×</span>') : '<span class="pr-un">1</span>';
    }

    /* ==================================================================== */
    /* Les cas                                                              */
    /* ==================================================================== */
    var CAS = [
      { cle: 'produit', nom: 'Le produit : aⁿ × aᵖ' },
      { cle: 'quotient', nom: 'Le quotient : aⁿ ÷ aᵖ' },
      { cle: 'negatif', nom: 'Exposant nul, exposant négatif' }
    ];
    var cas = 'produit';
    var A = 2, N = 3, P = 2;                   // la base et les deux exposants

    function ent(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

    function tirer() {
      // Des bases petites (ou 10), des exposants qui laissent des facteurs
      // à compter sans que la ligne déborde : n + p ≤ 7.
      var bases = [2, 2, 3, 3, 4, 5, 10];
      A = bases[ent(0, bases.length - 1)];
      if (cas === 'produit') {
        N = ent(1, 4); P = ent(1, 4);
        if (N + P > 7) P = 7 - N;
        if (N === P && Math.random() < 0.7) P = (P % 4) + 1;   // deux exposants différents, le plus souvent
      } else if (cas === 'quotient') {
        // n ≠ p, et assez de facteurs pour qu'on voie la simplification ;
        // une fois sur quatre environ, p > n : c'est là que l'exposant négatif apparaît
        do { N = ent(1, 6); P = ent(1, 6); } while (N === P || Math.max(N, P) < 3);
        if (N < P && Math.random() < 0.5) { var t = N; N = P; P = t; }
      } else {
        N = ent(2, 4); P = ent(2, 4);
      }
      if (A === 10 && Math.max(N, P) > 4) A = 2;     // 10⁶ tient encore, au-delà on ne lit plus
    }

    /* ==================================================================== */
    /* Le panneau                                                           */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'pui-ui pr-ui';
    root.innerHTML =
      '<div class="pui-cas"></div>' +
      '<div class="pui-corps"></div>' +
      '<div class="pui-etapes"></div>' +
      '<div><span class="pui-concl" style="visibility:hidden">&nbsp;</span></div>';
    var elCas = root.querySelector('.pui-cas');
    var elCorps = root.querySelector('.pui-corps');
    var elEtapes = root.querySelector('.pui-etapes');
    var elConcl = root.querySelector('.pui-concl');
    mv.extras.appendChild(root);

    function ligne(txt, cls) {
      return '<div class="pr-ligne' + (cls ? ' ' + cls : '') + '">' + txt + '</div>';
    }
    function brace(k, cls) {
      return '<span class="pr-brace ' + (cls || '') + '">' + k + ' facteur' + (k > 1 ? 's' : '') + '</span>';
    }

    /* --- Le produit : décomposer, réunir, compter ------------------------ */
    function corpsProduit(e) {
      var L = [];
      if (e.lignes >= 1) L.push(ligne(pow(A, N) + ' <span class="pr-x">×</span> ' + pow(A, P), 'pr-titre'));
      if (e.lignes >= 2) {
        L.push(ligne('= <span class="pr-grp g1">(' + facteurs(A, N, { cls: 'g1' }) + ')</span>' +
                     ' <span class="pr-x">×</span> ' +
                     '<span class="pr-grp g2">(' + facteurs(A, P, { cls: 'g2' }) + ')</span>' +
                     '<div class="pr-braces"><span class="g1">' + brace(N, 'g1') + '</span>' +
                     '<span class="g2">' + brace(P, 'g2') + '</span></div>'));
      }
      if (e.lignes >= 3) {
        L.push(ligne('= ' + facteurs(A, N + P, { compte: e.compte }) +
                     (e.compte >= N + P
                       ? '<div class="pr-braces"><span class="tout">' + N + ' + ' + P + ' = ' +
                         (N + P) + ' facteurs</span></div>' : '')));
      }
      if (e.lignes >= 4) L.push(ligne('= ' + powTxt(A, N + ' + ' + P) + ' = <b>' + pow(A, N + P) + '</b>', 'pr-res'));
      if (e.lignes >= 5) {
        L.push(ligne('Vérification : ' + fr(puissance(A, N)) + ' × ' + fr(puissance(A, P)) + ' = <b>' +
                     fr(puissance(A, N + P)) + '</b>, et ' + pow(A, N + P) + ' = <b>' +
                     fr(puissance(A, N + P)) + '</b>.', 'pr-verif'));
      }
      return L.join('');
    }

    /* --- Le quotient : déduit du produit, puis vérifié sur les facteurs -- */
    function corpsQuotient(e) {
      var L = [], D = N - P, M = Math.min(N, P);
      if (e.lignes >= 1) L.push(ligne(frac(pow(A, N), pow(A, P)) + ' = ?', 'pr-titre'));
      if (e.lignes >= 2) {
        L.push(ligne('Règle du produit : ' + powTxt(A, exp(D)) + ' <span class="pr-x">×</span> ' + pow(A, P) +
                     ' = ' + powTxt(A, exp(D) + ' + ' + P) + ' = ' + pow(A, N), 'pr-deduc'));
      }
      if (e.lignes >= 3) {
        L.push(ligne('Donc ' + frac(pow(A, N), pow(A, P)) + ' = ' + powTxt(A, N + ' − ' + P) +
                     ' = <b>' + pow(A, D) + '</b>', 'pr-res'));
      }
      if (e.lignes >= 4) {
        L.push(ligne('Sur les facteurs : ' + frac(facteurs(A, N, { barre: e.barre }),
                                                  facteurs(A, P, { barre: e.barre })), 'pr-facteurs'));
      }
      if (e.lignes >= 5) {
        var reste = D > 0
          ? facteurs(A, D) + ' = ' + pow(A, D)
          : frac('1', facteurs(A, -D)) + ' = ' + frac('1', pow(A, -D)) + ' = ' + pow(A, D);
        L.push(ligne('= ' + reste + '<div class="pr-braces"><span class="tout">' +
                     (D > 0 ? 'il reste ' + D + ' facteur' + (D > 1 ? 's' : '') + ' en haut'
                            : 'il reste ' + (-D) + ' facteur' + (-D > 1 ? 's' : '') + ' en bas') +
                     '</span></div>', 'pr-res'));
      }
      if (e.lignes >= 6) {
        L.push(ligne('Vérification : ' + fr(puissance(A, N)) + ' ÷ ' + fr(puissance(A, P)) + ' = <b>' +
                     valeur(A, D) + '</b>', 'pr-verif'));
      }
      return L.join('');
    }

    /* --- Exposant nul, exposant négatif : la règle du quotient forcée ---- */
    function corpsNegatif(e) {
      var L = [];
      if (e.lignes >= 1) {
        L.push(ligne(frac(pow(A, N), pow(A, N)) + ' = ' + frac(fr(puissance(A, N)), fr(puissance(A, N))) +
                     ' = <b>1</b>', 'pr-deduc'));
      }
      if (e.lignes >= 2) {
        L.push(ligne('Règle du quotient : ' + frac(pow(A, N), pow(A, N)) + ' = ' + powTxt(A, N + ' − ' + N) +
                     ' = ' + pow(A, 0) + ' &nbsp;— donc <b>' + pow(A, 0) + ' = 1</b>', 'pr-res'));
      }
      if (e.lignes >= 3) {
        L.push(ligne(frac(pow(A, 0), pow(A, P)) + ' = ' + frac('1', pow(A, P)) +
                     ' &nbsp;et, par la règle, ' + frac(pow(A, 0), pow(A, P)) + ' = ' +
                     powTxt(A, '0 − ' + P) + ' = ' + pow(A, -P), 'pr-deduc'));
      }
      if (e.lignes >= 4) {
        L.push(ligne('Donc <b>' + pow(A, -P) + ' = ' + frac('1', pow(A, P)) + '</b> = ' +
                     frac('1', facteurs(A, P)) + ' = ' + valeur(A, -P), 'pr-res'));
      }
      if (e.lignes >= 5) {
        L.push(ligne('Contrôle : ' + pow(A, P) + ' <span class="pr-x">×</span> ' + pow(A, -P) + ' = ' +
                     pow(A, 0) + ' = 1 &nbsp;: ' + pow(A, -P) + ' est l\'<b>inverse</b> de ' + pow(A, P) +
                     ' — ' + fr(puissance(A, P)) + ' × ' + valeur(A, -P) + ' = 1.', 'pr-verif'));
      }
      return L.join('');
    }

    /* ==================================================================== */
    /* Les étapes : des ÉTATS figés, jamais des actions                     */
    /* ==================================================================== */
    var phrases = [];
    function rendre(e) {
      elCorps.innerHTML = cas === 'produit' ? corpsProduit(e)
                        : cas === 'quotient' ? corpsQuotient(e)
                        : corpsNegatif(e);
      elEtapes.innerHTML = phrases.slice(0, e.n).map(function (t) {
        return '<div class="pui-etape">' + t + '</div>';
      }).join('');
      elConcl.style.visibility = e.concl ? 'visible' : 'hidden';
      elConcl.innerHTML = e.concl || '&nbsp;';
    }

    var anim = mv.createAnimator();
    var cur = null;
    function neuf() { return { n: 0, lignes: 0, compte: 0, barre: 0, concl: null }; }
    function copie(e) { return { n: e.n, lignes: e.lignes, compte: e.compte, barre: e.barre, concl: e.concl }; }
    function pas(dur, maj) { maj(); var e = copie(cur); return { dur: dur, step: function () { rendre(e); } }; }
    // Une étape qui s'anime : `champ` monte de 0 à `total` avec l'avancement.
    function pasCompte(dur, champ, total, maj) {
      maj(); cur[champ] = total;
      var e = copie(cur);
      return { dur: dur, step: function (q) {
        var f = copie(e); f[champ] = Math.floor(q * total + 1e-9); rendre(f);
      } };
    }
    function dire(t) { cur.n = phrases.push(t); }

    function construitEtapes() {
      phrases = [];
      cur = neuf();
      var steps = [];

      if (cas === 'produit') {
        steps.push(pas(800, function () {
          cur.lignes = 1;
          dire('On veut calculer ' + pow(A, N) + ' × ' + pow(A, P) + '. Rappel : ' + pow(A, N) +
               ', c\'est un produit de <b>' + N + ' facteur' + (N > 1 ? 's' : '') + '</b> égaux à ' + A +
               ', et ' + pow(A, P) + ' un produit de <b>' + P + ' facteur' + (P > 1 ? 's' : '') + '</b>.');
        }));
        steps.push(pas(900, function () {
          cur.lignes = 2;
          dire('On <b>décompose</b> chaque puissance : ' + N + ' facteurs dans la première parenthèse, ' +
               P + ' dans la seconde.');
        }));
        steps.push(pasCompte(1500, 'compte', N + P, function () {
          cur.lignes = 3;
          dire('Les parenthèses ne servent à rien : c\'est <b>un seul produit</b>, dont tous les ' +
               'facteurs valent ' + A + '. On les <b>compte</b> : ' + N + ' + ' + P + ' = <b>' + (N + P) +
               '</b> facteurs.');
        }));
        steps.push(pas(900, function () {
          cur.lignes = 4;
          dire((N + P) + ' facteurs égaux à ' + A + ', c\'est ' + pow(A, N + P) + '. Donc ' + pow(A, N) +
               ' × ' + pow(A, P) + ' = ' + powTxt(A, N + ' + ' + P) + ' : même base, et on ' +
               '<b>additionne les exposants</b> — parce qu\'on a compté des facteurs.');
        }));
        steps.push(pas(900, function () {
          cur.lignes = 5;
          // Le piège « on multiplie les exposants » n'a de sens que si n × p ≠ n + p.
          dire('<span class="piege">Pièges :</span> ce n\'est pas ' + pow(A * A, N + P) +
               ' (la base ne change pas)' +
               (N * P !== N + P ? ', ni ' + pow(A, N * P) + ' (on n\'a pas multiplié les exposants)' : '') +
               '. Et la règle ne vaut que pour un <b>produit</b> : ' + pow(A, N) + ' + ' + pow(A, P) +
               ' ne se simplifie pas ainsi.');
          cur.concl = pow(A, N) + ' × ' + pow(A, P) + ' = ' + pow(A, N + P) + ' = ' + fr(puissance(A, N + P));
        }));
        return steps;
      }

      if (cas === 'quotient') {
        var D = N - P, M = Math.min(N, P);
        steps.push(pas(800, function () {
          cur.lignes = 1;
          dire('On cherche ' + pow(A, N) + ' ÷ ' + pow(A, P) + '. Pas de nouvelle règle : on va lire ' +
               'la règle du <b>produit</b> à l\'envers.');
        }));
        steps.push(pas(900, function () {
          cur.lignes = 2;
          dire('D\'après la règle du produit, ' + powTxt(A, exp(D)) + ' × ' + pow(A, P) + ' = ' +
               powTxt(A, exp(D) + ' + ' + P) + ' = ' + pow(A, N) + '.');
        }));
        steps.push(pas(900, function () {
          cur.lignes = 3;
          dire('Donc ' + powTxt(A, exp(D)) + ' est <b>le nombre qui, multiplié par ' + pow(A, P) +
               ', donne ' + pow(A, N) + '</b> : c\'est exactement ' + pow(A, N) + ' ÷ ' + pow(A, P) +
               '. Même base, on <b>soustrait les exposants</b> : ' + N + ' − ' + P + ' = ' + exp(D) + '.' +
               (D < 0 ? ' L\'exposant est <b>négatif</b> : la vérification sur les facteurs va montrer ce ' +
                        'que cela veut dire, et le troisième volet le reprend.' : ''));
        }));
        steps.push(pas(800, function () {
          cur.lignes = 4;
          dire('Vérifions sur les facteurs : ' + N + ' facteurs ' + A + ' en haut, ' + P + ' en bas.');
        }));
        steps.push(pasCompte(1400, 'barre', M, function () {
          cur.lignes = 4;
          dire('On <b>simplifie</b> la fraction : un ' + A + ' du haut contre un ' + A + ' du bas, ' +
               M + ' fois.');
        }));
        steps.push(pas(900, function () {
          cur.lignes = 5;
          dire(D > 0
            ? 'Il reste <b>' + D + ' facteur' + (D > 1 ? 's' : '') + '</b> en haut, rien en bas : ' +
              pow(A, D) + '. C\'est bien ' + N + ' − ' + P + ' = ' + D + '.'
            : 'Tout le haut est parti : il reste <b>1</b> en haut et <b>' + (-D) + ' facteur' +
              (-D > 1 ? 's' : '') + '</b> en bas, soit ' + frac('1', pow(A, -D)) + '. La règle donne ' +
              pow(A, D) + ' : un <b>exposant négatif</b>, c\'est un ' + A + ' en bas — ' +
              powTxt(A, '−' + (-D)) + ' = ' + frac('1', pow(A, -D)) + '.');
        }));
        steps.push(pas(900, function () {
          cur.lignes = 6;
          dire('Avec les valeurs : ' + fr(puissance(A, N)) + ' ÷ ' + fr(puissance(A, P)) + ' = ' +
               valeur(A, D) + '.');
          cur.concl = frac(pow(A, N), pow(A, P)) + ' = ' + pow(A, D) + ' = ' + valeur(A, D);
        }));
        return steps;
      }

      // Exposant nul, exposant négatif.
      steps.push(pas(800, function () {
        cur.lignes = 1;
        dire('Un nombre non nul divisé par lui-même vaut 1 : ' + pow(A, N) + ' ÷ ' + pow(A, N) + ' = 1.');
      }));
      steps.push(pas(900, function () {
        cur.lignes = 2;
        dire('Mais la règle du quotient dit aussi ' + pow(A, N) + ' ÷ ' + pow(A, N) + ' = ' +
             powTxt(A, N + ' − ' + N) + ' = ' + pow(A, 0) + '. Pour que la règle reste vraie, il faut ' +
             '<b>' + pow(A, 0) + ' = 1</b>. C\'est pour ça, et pas par caprice, qu\'un nombre non nul ' +
             'à la puissance 0 vaut 1.');
      }));
      steps.push(pas(900, function () {
        cur.lignes = 3;
        dire('Même idée avec ' + pow(A, 0) + ' ÷ ' + pow(A, P) + ' : d\'un côté c\'est 1 ÷ ' + pow(A, P) +
             ', de l\'autre la règle donne ' + powTxt(A, '0 − ' + P) + ' = ' + pow(A, -P) + '.');
      }));
      steps.push(pas(900, function () {
        cur.lignes = 4;
        dire('Donc <b>' + pow(A, -P) + ' = 1 ÷ ' + pow(A, P) + '</b> : l\'exposant négatif envoie ' +
             'les facteurs <b>au dénominateur</b>. Ici ' + pow(A, -P) + ' = ' + valeur(A, -P) + '.');
      }));
      steps.push(pas(900, function () {
        cur.lignes = 5;
        dire('<span class="piege">Attention :</span> ' + pow(A, -P) + ' est un nombre <b>positif</b> ' +
             '(un inverse), pas un nombre négatif. Et ' + pow(A, P) + ' × ' + pow(A, -P) + ' = ' +
             pow(A, 0) + ' = 1 : les deux sont inverses l\'un de l\'autre.');
        cur.concl = pow(A, 0) + ' = 1 &nbsp;·&nbsp; ' + pow(A, -P) + ' = ' + frac('1', pow(A, P)) +
                    ' = ' + valeur(A, -P);
      }));
      return steps;
    }

    /* ==================================================================== */
    /* États                                                                */
    /* ==================================================================== */
    /* On NE vide PAS `phrases` ici : « ◀ Précédent » appelle cette remise à
       zéro puis rejoue les étapes précédentes, qui ne retiennent qu'un indice
       dans ce tableau. Il est remis à zéro par construitEtapes(). */
    function effacer() { anim.cancel(); rendre(neuf()); }
    function jouer() { effacer(); anim.runSteps(construitEtapes(), effacer); }

    function choisir(c) {
      cas = c;
      Array.prototype.forEach.call(elCas.children, function (b) {
        b.classList.toggle('active', b.dataset.cas === c);
      });
      tirer();
      jouer();
    }

    CAS.forEach(function (c) {
      var b = document.createElement('button');
      b.textContent = c.nom;
      b.dataset.cas = c.cle;
      b.onclick = function () { choisir(c.cle); };
      elCas.appendChild(b);
    });

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Lancer l\'animation', onClick: jouer },
      { type: 'button', id: 'autre', label: '🎲 Autres nombres',
        onClick: function () { tirer(); jouer(); } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer }
    ]);

    choisir('produit');
  }
});
