/*
 * Comparer et ranger des nombres décimaux relatifs (5ème).
 *
 * Deux temps, deux boutons.
 *
 *   COMPARER   Deux nombres, une question : lequel est le plus grand ? La
 *              réponse se lit à deux endroits en même temps —
 *                • sur la DROITE GRADUÉE : le plus grand est le plus à droite ;
 *                • dans le TABLEAU DE CHIFFRES : le signe d'abord, puis les
 *                  unités, les dixièmes, les centièmes, les millièmes, colonne
 *                  après colonne, jusqu'à celle qui décide.
 *              Le tableau est ÉDITABLE : chaque chiffre est un bouton (un clic
 *              = +1), la case du signe bascule − / +. Tout se recalcule aussitôt.
 *
 *   RANGER     Cinq nombres jetés sur la droite graduée. Ranger dans l'ordre
 *              croissant, c'est simplement LIRE LA DROITE de gauche à droite ;
 *              l'ordre décroissant, c'est le même trajet à l'envers.
 *
 * Les deux règles que la leçon martèle :
 *
 *   1) LE SIGNE D'ABORD, la VALEUR ABSOLUE ENSUITE — et elle joue à l'envers
 *      chez les négatifs. Entre deux négatifs, le plus grand est celui dont la
 *      valeur absolue est la plus PETITE (le plus proche de 0) ; entre deux
 *      positifs, c'est l'inverse. Deux flèches parties de 0 le disent d'un coup
 *      d'œil : en s'éloignant de 0, la valeur absolue augmente toujours, mais
 *      le nombre augmente à droite et DIMINUE à gauche.
 *
 *   2) CHIFFRE PAR CHIFFRE, EN ALIGNANT LES RANGS : la partie entière d'abord ;
 *      si elle est égale on descend d'un rang, en COMPLÉTANT AVEC DES ZÉROS les
 *      décimales qui manquent (7,5 = 7,50). C'est ce qui désamorce le piège du
 *      « 45 > 5 donc 7,45 > 7,5 ». Ces zéros ajoutés s'affichent en gris clair
 *      dans le tableau : on les voit arriver.
 *
 * Quand les deux nombres ont la même partie entière, on ne les distingue plus
 * sur la droite du haut : une seconde droite, en dessous, AGRANDIT la zone où
 * ils se cachent — exactement au rang où leurs chiffres diffèrent. Descendre
 * d'un rang et zoomer d'un cran, c'est le même geste.
 *
 * Toute la comparaison se fait sur les CHAÎNES de chiffres, jamais sur des
 * flottants : 0,1 + 0,2 n'a pas son mot à dire ici.
 */
MathsView.register({
  id: 'comparer-relatifs',
  title: 'Comparer et ranger des décimaux relatifs',
  level: '5eme',
  category: 'calcul',
  subcategory: 'Nombres relatifs',
  exercices: ['comparer'],
  theme: 'Nombres relatifs — comparer deux décimaux relatifs, ranger une liste ' +
         'dans l\'ordre croissant et décroissant',
  description:
    'Comparer deux nombres relatifs, c\'est répondre à une seule question : ' +
    '<strong>lequel est le plus à droite</strong> sur la droite graduée ?' +
    '<br>On regarde d\'abord le <strong>signe</strong> : un négatif est toujours plus ' +
    'petit qu\'un positif. Si les signes sont les mêmes, on compare les ' +
    '<strong>valeurs absolues</strong> — et attention, elles jouent <strong>à ' +
    'l\'envers</strong> chez les négatifs : entre deux négatifs, le plus grand est ' +
    'celui dont la valeur absolue est la plus <strong>petite</strong>, ' +
    '\\(-5{,}2 > -5{,}9\\).' +
    '<br>Pour comparer deux valeurs absolues décimales, on va ' +
    '<strong>rang par rang</strong> : la partie entière d\'abord, puis les dixièmes, ' +
    'les centièmes… en <strong>complétant avec des zéros</strong> les décimales qui ' +
    'manquent. \\(7{,}5 = 7{,}50\\), donc \\(7{,}45 < 7{,}5\\).' +
    '<br><strong>Clique un chiffre du tableau</strong> pour le changer (+1), ou la case ' +
    'du <strong>signe</strong> pour le basculer : la figure suit. Puis clique sur ' +
    '<strong>▶ Animer</strong> (ou coche <strong>Pas à pas</strong>).',
  notes:
    '<ul>' +
    '<li><strong>La règle du signe.</strong> Un nombre <strong>négatif</strong> est ' +
    'toujours plus petit qu\'un nombre <strong>positif</strong> : il est à gauche de 0. ' +
    'Et \\(0\\) est plus petit que tout positif, plus grand que tout négatif.</li>' +
    '<li><strong>La règle de la valeur absolue.</strong> Deux nombres de même signe se ' +
    'comparent par leur valeur absolue — leur <em>distance à 0</em> :' +
    '<br>• deux <strong>positifs</strong> : le plus grand est celui dont la valeur ' +
    'absolue est la plus <strong>grande</strong> — \\(7{,}5 > 7{,}45\\) ;' +
    '<br>• deux <strong>négatifs</strong> : le plus grand est celui dont la valeur ' +
    'absolue est la plus <strong>petite</strong> — \\(-7{,}45 > -7{,}5\\).' +
    '<br>C\'est logique sur la droite graduée : à gauche de 0, s\'éloigner de 0 c\'est ' +
    '<strong>descendre</strong>.</li>' +
    '<li><strong>Comparer deux décimaux, rang par rang.</strong> On compare d\'abord les ' +
    '<strong>parties entières</strong>. Si elles sont égales, on compare les ' +
    '<strong>dixièmes</strong>, puis les <strong>centièmes</strong>, puis les ' +
    '<strong>millièmes</strong> : le <strong>premier chiffre qui diffère</strong> ' +
    'décide, et tout ce qui suit n\'a plus aucune importance.</li>' +
    '<li><strong>Les zéros qui manquent.</strong> Pour aligner les rangs, on complète ' +
    'l\'écriture la plus courte par des zéros : \\(7{,}5 = 7{,}50 = 7{,}500\\). Un zéro ' +
    'ajouté <strong>à droite</strong> de la partie décimale ne change rien à la valeur.</li>' +
    '<li><strong>Le piège à éviter.</strong> Un nombre n\'est pas plus grand parce qu\'il ' +
    'a plus de chiffres : \\(7{,}45 < 7{,}5\\) (car \\(7{,}45\\) et \\(7{,}50\\) : ' +
    '4 dixièmes contre 5), et \\(4{,}06 < 4{,}6\\). Il faut comparer les rangs entre ' +
    'eux, pas les nombres écrits après la virgule.</li>' +
    '<li><strong>Ranger.</strong> Une fois les nombres placés sur la droite graduée, ' +
    'l\'ordre <strong>croissant</strong> est l\'ordre de lecture de la droite, de la ' +
    '<strong>gauche vers la droite</strong> ; l\'ordre <strong>décroissant</strong> est ' +
    'le même trajet à l\'envers. On sépare donc d\'abord les négatifs des positifs, puis ' +
    'on range chaque camp par valeur absolue — croissante chez les positifs, ' +
    'décroissante chez les négatifs.</li>' +
    '<li><strong>Les symboles.</strong> \\(a < b\\) se lit « \\(a\\) est inférieur à ' +
    '\\(b\\) » : la pointe du symbole montre le plus petit. \\(-5{,}9 < -5{,}2\\) et ' +
    '\\(-5{,}2 > -5{,}9\\) disent exactement la même chose.</li>' +
    '</ul>',
  board: {
    boundingbox: [-11.4, 3.05, 11.4, -3.5], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_A   = '#7c3aed';    // le premier nombre comparé
    var C_B   = '#0891b2';    // le second
    var C_NEG = '#dc2626';    // les négatifs (mode « ranger »)
    var C_POS = '#16a34a';    // les positifs
    var INK   = '#334155';
    var SOFT  = '#94a3b8';
    var PALE  = '#cbd5e1';

    var XMAX = 10;                          // la droite du haut va de −10 à 10
    var Y1 = 1.45;                          // sa hauteur
    var Y2 = -2.15;                         // la droite agrandie, en dessous
    var XL = -9.4, XR = 9.4, W = XR - XL;   // l'étendue de cette dernière
    var DY1 = 0.42, DY2 = 1.02;             // les deux hauteurs d'étiquette
    var MAXL = 5;                           // taille des listes à ranger

    var RANGS = ['unités', 'dixièmes', 'centièmes', 'millièmes'];

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Les nombres, écrits en CHIFFRES                                      */
    /*                                                                      */
    /* Un nombre = un signe, quatre chiffres (unités, dixièmes, centièmes,  */
    /* millièmes) et le nombre de décimales ÉCRITES. Les chiffres au-delà   */
    /* sont les fameux « zéros qui manquent » : ils valent 0, on ne les     */
    /* écrit pas — et c'est tout l'objet de la leçon de les faire venir.    */
    /* ==================================================================== */
    // '−5,2' → { neg: true, ch: '5200', dec: 1 }. La partie entière tient sur
    // un seul chiffre : la droite graduée va de −10 à 10.
    function lit(t) {
      var neg = /^[-−]/.test(t);
      var p = t.replace(/^[-−]/, '').split(',');
      var d = p[1] || '';
      return norm({ neg: neg, ch: p[0].charAt(0) + (d + '000').slice(0, 3), dec: d.length });
    }
    // Remet l'objet d'aplomb : au-delà des décimales écrites il n'y a que des
    // zéros, et −0 n'existe pas.
    function norm(n) {
      n.dec = Math.max(0, Math.min(3, n.dec));
      n.ch = n.ch.slice(0, 1 + n.dec) + '000'.slice(0, 3 - n.dec);
      if (n.ch === '0000') n.neg = false;
      return n;
    }
    function copie(n) { return { neg: n.neg, ch: n.ch, dec: n.dec }; }

    function val(n) { return (n.neg ? -1 : 1) * parseInt(n.ch, 10) / 1000; }
    function absVal(n) { return parseInt(n.ch, 10) / 1000; }

    // L'écriture usuelle : « −5,2 » — seules les décimales écrites y figurent.
    function txt(n) { return (n.neg ? '−' : '') + txtDec(n, n.dec); }
    // La même, complétée jusqu'au rang d : « −5,20 ». C'est celle qu'on compare.
    function txtDec(n, d) {
      return n.ch.charAt(0) + (d > 0 ? ',' + n.ch.substr(1, d) : '');
    }
    // La valeur absolue, écrite : « 5,2 ».
    function txtAbs(n) { return txtDec(n, n.dec); }

    /*
     * La comparaison, sans un seul calcul flottant.
     *
     * Les valeurs absolues se comparent comme des MOTS : les chaînes ont
     * toutes la même longueur (unités + trois décimales), donc l'ordre
     * alphabétique des chiffres est l'ordre des nombres. C'est très exactement
     * la règle « rang par rang, en complétant par des zéros ».
     */
    function compare(a, b) {
      if (a.neg !== b.neg) return a.neg ? -1 : 1;
      var c = a.ch < b.ch ? -1 : a.ch > b.ch ? 1 : 0;
      return a.neg ? -c : c;                   // chez les négatifs, tout s'inverse
    }
    // Le rang du premier chiffre qui diffère (0 = unités), −1 si les deux
    // valeurs absolues sont égales.
    function rangDiff(a, b) {
      for (var i = 0; i < 4; i++) if (a.ch.charAt(i) !== b.ch.charAt(i)) return i;
      return -1;
    }

    /* ==================================================================== */
    /* Ce qu'on donne à comparer, et à ranger                               */
    /* ==================================================================== */
    // La progression des exemples : la règle du signe, celle de la valeur
    // absolue chez les négatifs, puis les deux pièges décimaux et l'égalité.
    var EXEMPLES = [
      { a: '-3,7',   b: '2,4'   },   // signes différents : rien d'autre à regarder
      { a: '-5,2',   b: '-5,9'  },   // deux négatifs : le plus proche de 0 gagne
      { a: '7,45',   b: '7,5'   },   // le piège : 45 > 5, et pourtant 7,45 < 7,5
      { a: '-0,308', b: '-0,31' },   // le même piège, chez les négatifs
      { a: '-4,6',   b: '-4,06' },   // un zéro intercalé change tout
      { a: '2,5',    b: '2,50'  }    // deux écritures du même nombre
    ];
    var LISTES = [
      ['3,7', '-2,5', '-7,2', '1,05', '-0,4'],
      ['-4,25', '0,8', '-1,5', '2,5', '-4,9'],
      ['6,4', '-6,04', '0', '6,04', '-6,4']
    ];

    var mode = 'comparer';        // 'comparer' | 'ranger'
    var iEx = 0, iListe = 0;
    var A = null, B = null;       // les deux nombres comparés
    var L = [];                   // la liste à ranger
    var ordre = [];               // ses indices, triés dans l'ordre croissant
    var rang = [];                // rang[i] : la place de L[i] dans cet ordre

    function chargeExemple() {
      A = lit(EXEMPLES[iEx].a);
      B = lit(EXEMPLES[iEx].b);
    }
    function chargeListe() {
      L = LISTES[iListe].map(lit);
      ordre = L.map(function (n, i) { return i; })
               .sort(function (i, j) { return compare(L[i], L[j]); });
      rang = [];
      ordre.forEach(function (i, r) { rang[i] = r; });
    }
    chargeExemple();
    chargeListe();

    /* ==================================================================== */
    /* L'état de l'animation                                                */
    /*                                                                      */
    /* Chaque étape règle un état ABSOLU (jamais un incrément) : « Précédent »*/
    /* peut ainsi rejouer les étapes précédentes telles quelles.            */
    /* ==================================================================== */
    var vu = {
      pts: 0,          // combien de points sont posés sur la droite
      col: -1,         // la colonne examinée : −1 rien, 0 le signe, 1+r un rang
      zoom: 0,         // apparition de la droite agrandie
      dit: 0,          // le verdict est-il tombé ?
      signes: 0,       // (ranger) les deux camps, négatifs et positifs
      sens: 0,         // (ranger) les flèches « en s'éloignant de 0 »
      croi: 0,         // (ranger) la chaîne croissante
      decroi: 0        // (ranger) la chaîne décroissante
    };
    // La colonne qui tranche : le signe, ou le premier rang qui diffère.
    function colDecisive() {
      if (A.neg !== B.neg) return 0;
      var k = rangDiff(A, B);
      return k < 0 ? -1 : 1 + k;
    }
    // L'état « tout est dit » : celui dans lequel on retombe après une
    // modification du tableau, pour que le verdict suive le clic.
    function montreTout() {
      var k = rangDiff(A, B);
      vu.pts = MAXL; vu.col = colDecisive(); vu.dit = 1;
      vu.zoom = (A.neg === B.neg && k >= 1) ? 1 : 0;
      vu.signes = 1; vu.sens = 1; vu.croi = 1; vu.decroi = 1;
    }

    /* ==================================================================== */
    /* La zone à agrandir                                                   */
    /*                                                                      */
    /* Deux nombres de même signe dont les parties entières sont égales sont */
    /* indiscernables sur la droite du haut. On agrandit alors l'intervalle  */
    /* de leur PRÉFIXE COMMUN — [−6 ; −5] si tous deux valent −5,quelque —   */
    /* et on le regradue au rang suivant. Le rang du zoom EST le rang du    */
    /* premier chiffre qui diffère.                                          */
    /* ==================================================================== */
    function zoomInfo() {
      if (mode !== 'comparer' || A.neg !== B.neg) return null;
      var k = rangDiff(A, B);
      if (k < 1) return null;                       // inutile : ça se voit déjà
      var pre = A.ch.slice(0, k);                   // unités + (k−1) décimales
      return {
        k: k, pre: pre, neg: A.neg,
        lo: parseInt(pre, 10) / Math.pow(10, k - 1),   // la borne « proche de 0 »
        larg: Math.pow(10, 1 - k)                      // la largeur de la fenêtre
      };
    }
    // Replace la virgule nd chiffres avant la fin : ('523', 2) → « 5,23 ».
    function virgule(s, nd) {
      if (nd <= 0) return s;
      while (s.length <= nd) s = '0' + s;
      return s.slice(0, s.length - nd) + ',' + s.slice(s.length - nd);
    }
    // L'étiquette de la j-ième graduation de la droite agrandie (j de 0 à 10).
    // Toutes portent le MÊME nombre de décimales, y compris la dernière : c'est
    // le rang que l'on est en train de lire.
    function labTick(z, j) {
      var s = j < 10 ? virgule(z.pre + j, z.k)
                     : virgule(String(parseInt(z.pre, 10) + 1) + '0', z.k);
      return (z.neg ? '−' : '') + s;
    }
    // Les graduations sont rangées par valeur absolue croissante. Chez les
    // négatifs, cela va donc de la DROITE vers la gauche : c'est le même
    // renversement que celui de toute la leçon.
    function xTick(z, j) { return z.neg ? XR - (j / 10) * W : XL + (j / 10) * W; }
    function xNb(z, n) {
      var t = (absVal(n) - z.lo) / z.larg;
      t = Math.max(0, Math.min(1, t));
      return z.neg ? XR - t * W : XL + t * W;
    }
    // Les deux bornes de la fenêtre, vues sur la droite du haut (signées).
    function fenetre(z) {
      return z.neg ? [-(z.lo + z.larg), -z.lo] : [z.lo, z.lo + z.larg];
    }

    /* ==================================================================== */
    /* Fabriques                                                            */
    /* ==================================================================== */
    // Ne pose un attribut que s'il change vraiment : la figure est rafraîchie
    // à chaque image d'animation.
    function attr(o, cle, v) {
      if (!o._mv) o._mv = {};
      if (o._mv[cle] !== v) {
        o._mv[cle] = v;
        var a = {}; a[cle] = v;
        o.setAttribute(a);
      }
    }
    // Un point sur une droite, son étiquette au-dessus, et la tige qui les
    // relie — sans elle, deux étiquettes voisines ne se rattachent plus à rien.
    // `dy` peut être une fonction : dans le mode « ranger », la hauteur de
    // l'étiquette dépend de la place du nombre, qui change avec la liste.
    function pointSur(fx, y, dy, ftxt) {
      var fdy = typeof dy === 'function' ? dy : function () { return dy; };
      var p = board.create('point', [fx, y], {
        size: 5, strokeColor: '#fff', strokeWidth: 2, fillColor: INK,
        fixed: true, withLabel: false, visible: false, highlight: false,
        showInfobox: false, layer: 8
      });
      var t = board.create('text', [fx, function () { return y + fdy(); }, ftxt], {
        anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: INK,
        cssStyle: 'font-weight:800', fixed: true, visible: false,
        highlight: false, layer: 9
      });
      var tige = board.create('segment', [
        [fx, y], [fx, function () { return y + fdy() - 0.16; }]
      ], {
        strokeColor: PALE, strokeWidth: 1, fixed: true, visible: false,
        highlight: false, layer: 5
      });
      return { pt: p, lab: t, tige: tige };
    }
    function coloreP(o, c) {
      attr(o.pt, 'fillColor', c); attr(o.lab, 'color', c);
    }
    function voirP(o, b) {
      attr(o.pt, 'visible', b); attr(o.lab, 'visible', b); attr(o.tige, 'visible', b);
    }
    // Une droite graduée : le trait, et rien d'autre (les graduations sont
    // posées par l'appelant, elles ne se ressemblent pas d'une droite à l'autre).
    function trait(y, x0, x1, fleches) {
      return board.create('segment', [[x0, y], [x1, y]], {
        strokeColor: INK, strokeWidth: 2,
        firstArrow: fleches ? { type: 2, size: 6 } : false,
        lastArrow: fleches ? { type: 2, size: 6 } : false,
        fixed: true, highlight: false, layer: 4
      });
    }

    /* ==================================================================== */
    /* La droite graduée du haut — commune aux deux modes                   */
    /* ==================================================================== */
    trait(Y1, -XMAX - 0.75, XMAX + 0.75, true);
    for (var g = -XMAX; g <= XMAX; g++) {
      (function (g) {
        board.create('segment', [[g, Y1 - 0.1], [g, Y1 + 0.1]], {
          strokeColor: g === 0 ? INK : SOFT, strokeWidth: g === 0 ? 2.5 : 1.5,
          fixed: true, highlight: false, layer: 4
        });
        board.create('text', [g, Y1 - 0.34, String(g).replace('-', '−')], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 11,
          color: g === 0 ? INK : SOFT,
          cssStyle: g === 0 ? 'font-weight:800' : '',
          fixed: true, highlight: false, layer: 4
        });
      })(g);
    }

    /* ==================================================================== */
    /* Mode « comparer » : deux points en haut, la zone agrandie en bas      */
    /* ==================================================================== */
    var hA = pointSur(function () { return val(A); }, Y1, DY1, function () { return txt(A); });
    var hB = pointSur(function () { return val(B); }, Y1, DY2, function () { return txt(B); });

    // La zone que l'on va agrandir, surlignée sur la droite du haut.
    var bande = board.create('segment', [
      [function () { var z = zoomInfo(); return z ? fenetre(z)[0] : 0; }, Y1],
      [function () { var z = zoomInfo(); return z ? fenetre(z)[1] : 0; }, Y1]
    ], {
      strokeColor: SOFT, strokeWidth: 8, strokeOpacity: 0.45,
      fixed: true, visible: false, highlight: false, layer: 3
    });
    // La loupe : le cône qui relie cette zone à la droite agrandie.
    var cone = board.create('curve', [[], []], {
      strokeColor: SOFT, strokeWidth: 1, dash: 2, strokeOpacity: 0.5,
      fillColor: SOFT, fillOpacity: 0.09,
      fixed: true, visible: false, highlight: false, layer: 2
    });
    cone.updateDataArray = function () {
      var z = zoomInfo();
      if (!z) { this.dataX = []; this.dataY = []; return; }
      var f = fenetre(z), yh = Y1 - 0.52, yb = Y2 + 0.62;
      this.dataX = [f[0], f[1], XR, XL, f[0]];
      this.dataY = [yh, yh, yb, yb, yh];
    };

    // La droite agrandie : onze graduations, et les deux nombres enfin séparés.
    var basTrait = trait(Y2, XL - 0.4, XR + 0.4, false);
    var basGrad = [];
    for (var j = 0; j <= 10; j++) {
      (function (j) {
        var h = (j === 0 || j === 10) ? 0.2 : 0.13;
        basGrad.push(board.create('segment', [
          [function () { var z = zoomInfo(); return z ? xTick(z, j) : 0; }, Y2 - h],
          [function () { var z = zoomInfo(); return z ? xTick(z, j) : 0; }, Y2 + h]
        ], {
          strokeColor: SOFT, strokeWidth: 1.5, fixed: true, visible: false,
          highlight: false, layer: 4
        }));
        basGrad.push(board.create('text', [
          function () { var z = zoomInfo(); return z ? xTick(z, j) : 0; }, Y2 - 0.42,
          function () { var z = zoomInfo(); return z ? labTick(z, j) : ''; }
        ], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: SOFT,
          fixed: true, visible: false, highlight: false, layer: 4
        }));
      })(j);
    }
    var bA = pointSur(function () { var z = zoomInfo(); return z ? xNb(z, A) : 0; },
      Y2, DY1, function () { return txt(A); });
    var bB = pointSur(function () { var z = zoomInfo(); return z ? xNb(z, B) : 0; },
      Y2, DY2, function () { return txt(B); });
    // Ce que l'agrandissement montre, dit en une ligne sous la droite.
    var basTitre = board.create('text', [0, Y2 - 0.92, function () {
      var z = zoomInfo();
      if (!z) return '';
      return 'on agrandit la zone — une graduation = un ' +
             RANGS[z.k].replace(/s$/, '');
    }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: SOFT,
      cssStyle: 'font-weight:700', fixed: true, visible: false,
      highlight: false, layer: 4
    });

    /* ==================================================================== */
    /* Mode « ranger » : les cinq nombres, les deux camps, les deux sens     */
    /* ==================================================================== */
    var pts = [];
    for (var i = 0; i < MAXL; i++) {
      (function (i) {
        // Les étiquettes alternent en hauteur selon la PLACE du nombre dans
        // l'ordre croissant : deux voisins sur la droite ne se marchent
        // jamais dessus.
        pts.push(pointSur(
          function () { return L[i] ? val(L[i]) : 0; },
          Y1,
          function () { return rang[i] % 2 ? DY2 : DY1; },
          function () { return L[i] ? txt(L[i]) : ''; }
        ));
      })(i);
    }
    // Les deux camps, de part et d'autre de 0.
    var campNeg = board.create('segment', [[-XMAX - 0.4, Y1], [0, Y1]], {
      strokeColor: C_NEG, strokeWidth: 14, strokeOpacity: 0.12,
      fixed: true, visible: false, highlight: false, layer: 2
    });
    var campPos = board.create('segment', [[0, Y1], [XMAX + 0.4, Y1]], {
      strokeColor: C_POS, strokeWidth: 14, strokeOpacity: 0.12,
      fixed: true, visible: false, highlight: false, layer: 2
    });
    var labNeg = board.create('text', [-5.2, 0.35, 'les négatifs'], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: C_NEG,
      cssStyle: 'font-weight:800', fixed: true, visible: false,
      highlight: false, layer: 6
    });
    var labPos = board.create('text', [5.2, 0.35, 'les positifs'], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: C_POS,
      cssStyle: 'font-weight:800', fixed: true, visible: false,
      highlight: false, layer: 6
    });
    // En s'éloignant de 0, la valeur absolue augmente TOUJOURS — mais le
    // nombre, lui, augmente à droite et diminue à gauche. Toute la règle des
    // négatifs tient dans ces deux flèches.
    var flNeg = board.create('segment', [[-0.25, -0.55], [-9.4, -0.55]], {
      strokeColor: C_NEG, strokeWidth: 2.5, lastArrow: { type: 2, size: 7 },
      fixed: true, visible: false, highlight: false, layer: 5
    });
    var flPos = board.create('segment', [[0.25, -0.55], [9.4, -0.55]], {
      strokeColor: C_POS, strokeWidth: 2.5, lastArrow: { type: 2, size: 7 },
      fixed: true, visible: false, highlight: false, layer: 5
    });
    var txtNeg = board.create('text', [-4.9, -1.15,
      'la valeur absolue <b>augmente</b><br>le nombre <b>diminue</b>'], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: C_NEG,
      cssStyle: 'line-height:1.3;text-align:center', fixed: true, visible: false,
      highlight: false, layer: 6
    });
    var txtPos = board.create('text', [4.9, -1.15,
      'la valeur absolue <b>augmente</b><br>le nombre <b>augmente</b>'], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: C_POS,
      cssStyle: 'line-height:1.3;text-align:center', fixed: true, visible: false,
      highlight: false, layer: 6
    });
    // Le sens de lecture : croissant de gauche à droite, décroissant à l'envers.
    var lecture = board.create('segment', [[-9.4, -2.35], [9.4, -2.35]], {
      strokeColor: INK, strokeWidth: 2.5, lastArrow: { type: 2, size: 8 },
      fixed: true, visible: false, highlight: false, layer: 5
    });
    var lectureInv = board.create('segment', [[9.4, -2.35], [-9.4, -2.35]], {
      strokeColor: INK, strokeWidth: 2.5, lastArrow: { type: 2, size: 8 },
      fixed: true, visible: false, highlight: false, layer: 5
    });
    var labLecture = board.create('text', [0, -2.85, function () {
      return vu.decroi > 0.1
        ? 'on lit de la <b>droite vers la gauche</b> : ordre décroissant'
        : 'on lit de la <b>gauche vers la droite</b> : ordre croissant';
    }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK,
      cssStyle: 'font-weight:800', fixed: true, visible: false,
      highlight: false, layer: 6
    });

    /* ==================================================================== */
    /* Ce qui est visible, à chaque image                                    */
    /* ==================================================================== */
    function refresh() {
      var cmp = (mode === 'comparer');
      var z = zoomInfo();
      var zOn = cmp && !!z && vu.zoom > 0.05;

      /* -- mode « comparer » -------------------------------------------- */
      voirP(hA, cmp && vu.pts > 0.5);
      voirP(hB, cmp && vu.pts > 1.5);
      coloreP(hA, C_A); coloreP(hB, C_B);
      attr(bande, 'visible', zOn);
      attr(cone, 'visible', zOn);
      attr(cone, 'fillOpacity', Math.round(9 * Math.min(1, vu.zoom)) / 100);
      attr(basTrait, 'visible', zOn);
      basGrad.forEach(function (o) { attr(o, 'visible', zOn); });
      attr(basTitre, 'visible', zOn);
      voirP(bA, zOn && vu.zoom > 0.6);
      voirP(bB, zOn && vu.zoom > 0.6);
      coloreP(bA, C_A); coloreP(bB, C_B);

      /* -- mode « ranger » ----------------------------------------------- */
      for (var i = 0; i < MAXL; i++) {
        var n = L[i];
        var on = !cmp && !!n && vu.pts > i + 0.5;
        voirP(pts[i], on);
        if (n) coloreP(pts[i], n.neg ? C_NEG : (n.ch === '0000' ? INK : C_POS));
      }
      var camps = !cmp && vu.signes > 0.15;
      [campNeg, campPos, labNeg, labPos].forEach(function (o) { attr(o, 'visible', camps); });
      var sens = !cmp && vu.sens > 0.15;
      [flNeg, flPos, txtNeg, txtPos].forEach(function (o) { attr(o, 'visible', sens); });
      attr(lecture, 'visible', !cmp && vu.croi > 0.1 && vu.decroi <= 0.1);
      attr(lectureInv, 'visible', !cmp && vu.decroi > 0.1);
      attr(labLecture, 'visible', !cmp && vu.croi > 0.1);
    }
    board.on('update', function () { refresh(); render(false); });

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'cmp-ui';
    root.innerHTML =
      '<div class="cmp-cap"></div>' +
      '<div class="cmp-verdict"></div>' +
      '<div class="cmp-why"></div>' +
      '<div class="cmp-body"></div>';
    var capEl = root.querySelector('.cmp-cap');
    var verdictEl = root.querySelector('.cmp-verdict');
    var whyEl = root.querySelector('.cmp-why');
    var bodyEl = root.querySelector('.cmp-body');

    function span(t, c) { return '<span style="color:' + c + '">' + t + '</span>'; }

    var dernierCap = null;
    function cap(t) {
      if (t === dernierCap) return;
      dernierCap = t;
      capEl.innerHTML = t || '&nbsp;';
    }

    /* -- le tableau des chiffres ---------------------------------------- */
    // La classe d'une colonne : celle qu'on examine, et celle qui a tranché.
    function look(col) {
      var s = '';
      if (vu.col === col) s += ' look';
      if (vu.dit && col === colDecisive()) s += ' on';
      return s;
    }
    function ligneChiffres(n, i, c) {
      var s = '<tr><th class="cmp-nom" style="color:' + c + '">' + txt(n) + '</th>';
      s += '<td class="cmp-cell cmp-sg' + look(0) + '" data-r="' + i + '" data-c="s">' +
           (n.neg ? '−' : '+') + '</td>';
      for (var r = 0; r < 4; r++) {
        if (r === 1) s += '<td class="cmp-vir">,</td>';
        // Un chiffre au-delà des décimales écrites est un zéro « ajouté » :
        // il compte dans la comparaison, mais on le montre en gris clair.
        s += '<td class="cmp-cell' + (r > n.dec ? ' pad' : '') + look(1 + r) +
             '" data-r="' + i + '" data-c="' + r + '">' + n.ch.charAt(r) + '</td>';
      }
      return s + '</tr>';
    }

    function renderComparer() {
      var meme = (A.neg === B.neg);
      var k = rangDiff(A, B);
      var c = compare(A, B);

      var head = '<tr><th></th><th class="cmp-h' + look(0) + '">signe</th>' +
                 '<th class="cmp-h' + look(1) + '">unités</th><th class="cmp-vir"></th>';
      for (var r = 1; r < 4; r++) {
        head += '<th class="cmp-h' + look(1 + r) + '">' + RANGS[r] + '</th>';
      }
      head += '</tr>';

      // Le rappel des zéros ajoutés : dès que les deux écritures n'ont pas le
      // même nombre de décimales, c'est la première chose à faire.
      var note = '';
      if (meme && A.dec !== B.dec) {
        var court = A.dec < B.dec ? A : B;
        note = 'Pour aligner les rangs, on complète avec des <b>zéros</b> : ' +
               txt(court) + ' = ' + (court.neg ? '−' : '') +
               txtDec(court, Math.max(A.dec, B.dec)) + '.';
      }

      var regles = [
        { id: 'signes', actif: !meme,
          t: '<b>Signes différents</b> — le <b>négatif</b> est le plus petit, ' +
             'quels que soient les chiffres.' },
        { id: 'positifs', actif: meme && !A.neg,
          t: '<b>Deux positifs</b> — le plus grand est celui dont la valeur absolue ' +
             'est la plus <b>grande</b>.' },
        { id: 'negatifs', actif: meme && A.neg,
          t: '<b>Deux négatifs</b> — le plus grand est celui dont la valeur absolue ' +
             'est la plus <b>petite</b> : le plus proche de 0.' }
      ];
      var cartes = regles.map(function (rg) {
        return '<div class="cmp-regle' + (rg.actif && vu.col >= 0 ? ' on' : '') +
               '" data-regle="' + rg.id + '">' + rg.t + '</div>';
      }).join('');

      bodyEl.innerHTML =
        '<table class="cmp-grid">' + head + ligneChiffres(A, 0, C_A) +
          ligneChiffres(B, 1, C_B) + '</table>' +
        '<div class="cmp-note">' + (note || 'Clique un chiffre pour le changer, ' +
          'ou la case du signe pour la basculer.') + '</div>' +
        '<div class="cmp-regles">' + cartes + '</div>';

      /* -- le verdict ---------------------------------------------------- */
      if (!vu.dit) { verdictEl.innerHTML = '&nbsp;'; whyEl.innerHTML = '&nbsp;'; return; }
      var s1 = c < 0 ? '&lt;' : c > 0 ? '&gt;' : '=';
      var s2 = c < 0 ? '&gt;' : c > 0 ? '&lt;' : '=';
      verdictEl.innerHTML =
        span(txt(A), C_A) + ' <b class="cmp-signe">' + s1 + '</b> ' + span(txt(B), C_B) +
        '<span class="cmp-inv">soit ' + txt(B) + ' ' + s2 + ' ' + txt(A) + '</span>';

      if (!meme) {
        var neg = A.neg ? A : B, pos = A.neg ? B : A;
        whyEl.innerHTML = txt(neg) + ' est <b>négatif</b> et ' + txt(pos) +
          ' est <b>positif</b> : le négatif est à gauche de 0, c\'est donc lui le ' +
          '<b>plus petit</b>.';
      } else if (k < 0) {
        whyEl.innerHTML = 'Même signe et mêmes chiffres : ce sont <b>deux écritures du ' +
          'même nombre</b>. Les zéros écrits à droite ne changent rien.';
      } else {
        var grand = A.ch > B.ch ? A : B;      // la plus grande valeur absolue
        var petit = A.ch > B.ch ? B : A;
        whyEl.innerHTML =
          'Les <b>' + RANGS[k] + '</b> décident : la valeur absolue ' + txtAbs(grand) +
          ' est plus grande que ' + txtAbs(petit) + '. ' +
          (A.neg
            ? 'Mais les deux sont <b>négatifs</b> : ' + txt(grand) + ' est le plus ' +
              '<b>loin</b> de 0, donc le plus <b>petit</b>.'
            : 'Les deux sont <b>positifs</b> : ' + txt(grand) + ' est donc le plus ' +
              '<b>grand</b>.');
      }
    }

    function renderRanger() {
      var poses = Math.floor(vu.pts);
      var chips = L.map(function (n, i) {
        return '<span class="cmp-chip' + (i < poses ? ' on' : '') + '" style="color:' +
               (n.neg ? C_NEG : (n.ch === '0000' ? INK : C_POS)) + '">' + txt(n) + '</span>';
      }).join('');

      var croi = ordre.map(function (i) { return txt(L[i]); }).join(' &lt; ');
      var decroi = ordre.slice().reverse().map(function (i) { return txt(L[i]); })
                        .join(' &gt; ');

      bodyEl.innerHTML =
        '<div class="cmp-label">Les nombres à ranger</div>' +
        '<div class="cmp-chips">' + chips + '</div>' +
        (vu.croi > 0.9
          ? '<div class="cmp-label">Ordre croissant — on lit la droite de gauche à droite</div>' +
            '<div class="cmp-chaine">' + croi + '</div>'
          : '') +
        (vu.decroi > 0.9
          ? '<div class="cmp-label">Ordre décroissant — le même trajet à l\'envers</div>' +
            '<div class="cmp-chaine">' + decroi + '</div>'
          : '');

      verdictEl.innerHTML = vu.croi > 0.9 ? croi : '&nbsp;';
      whyEl.innerHTML = vu.signes > 0.9
        ? 'Les <b>négatifs</b> d\'abord (le plus loin de 0 en tête), puis <b>0</b>, ' +
          'puis les <b>positifs</b> (du plus proche de 0 au plus loin).'
        : '&nbsp;';
    }

    // On ne reconstruit le HTML que si quelque chose a vraiment changé : cette
    // fonction est appelée à chaque image d'animation.
    var dernier = null;
    function render(force) {
      var cle = [mode, iListe, A.neg, A.ch, A.dec, B.neg, B.ch, B.dec,
                 vu.col, vu.dit, Math.floor(vu.pts),
                 vu.signes > 0.9 ? 1 : 0, vu.croi > 0.9 ? 1 : 0,
                 vu.decroi > 0.9 ? 1 : 0].join('|');
      if (!force && cle === dernier) return;
      dernier = cle;
      if (mode === 'comparer') renderComparer(); else renderRanger();
    }

    /* -- les clics dans le panneau -------------------------------------- */
    root.addEventListener('click', function (e) {
      var cible = e.target.closest ? e.target.closest('[data-c]') : null;
      if (cible) {
        var n = cible.getAttribute('data-r') === '0' ? A : B;
        var col = cible.getAttribute('data-c');
        if (col === 's') {
          n.neg = !n.neg;
        } else {
          var r = parseInt(col, 10);
          // Un clic sur un zéro ajouté ÉCRIT la décimale : le nombre gagne un
          // rang, ce qui est exactement le geste de la leçon.
          if (r > n.dec) n.dec = r;
          n.ch = n.ch.slice(0, r) + ((parseInt(n.ch.charAt(r), 10) + 1) % 10) +
                 n.ch.slice(r + 1);
        }
        norm(n);
        anim.cancel();
        montreTout();
        cap('Le verdict suit le tableau : change un chiffre, la droite graduée ' +
            'et la comparaison se règlent toutes seules.');
        render(true);
        board.update();
        return;
      }
      var rg = e.target.closest ? e.target.closest('[data-regle]') : null;
      if (rg) choisirRegle(rg.getAttribute('data-regle'));
    });

    // Cliquer une règle, c'est demander un exemple qui l'illustre.
    function choisirRegle(id) {
      for (var i = 0; i < EXEMPLES.length; i++) {
        var a = lit(EXEMPLES[i].a), b = lit(EXEMPLES[i].b);
        var cat = a.neg !== b.neg ? 'signes' : (a.neg ? 'negatifs' : 'positifs');
        if (cat === id) {
          iEx = i; chargeExemple(); mode = 'comparer'; arm();
          return;
        }
      }
    }

    /* ==================================================================== */
    /* Les scénarios                                                         */
    /* ==================================================================== */
    function S(dur, texte, fn) {
      return {
        dur: dur,
        step: function (p) { cap(texte); fn(p); },
        after: function () { cap(texte); fn(1); board.update(); }
      };
    }

    /* ---- comparer deux nombres ------------------------------------------ */
    function stepsComparer() {
      var meme = (A.neg === B.neg);
      var k = rangDiff(A, B);
      var st = [];

      st.push(S(650, 'On place les deux nombres sur la droite graduée.', function (p) {
        vu.pts = p * 2; vu.col = -1; vu.zoom = 0; vu.dit = 0;
      }));
      st.push(S(700, 'On regarde d\'abord le <b>signe</b>.', function () {
        vu.pts = 2; vu.col = 0; vu.zoom = 0; vu.dit = 0;
      }));

      if (!meme) {
        st.push(S(750, 'Un négatif est <b>à gauche de 0</b>, un positif à droite : ' +
          'le négatif est forcément le plus petit — inutile de regarder les chiffres.',
          function () { vu.pts = 2; vu.col = 0; vu.zoom = 0; vu.dit = 0; }));
      } else if (k < 0) {
        st.push(S(750, 'Même signe, et <b>exactement les mêmes chiffres</b> une fois ' +
          'les zéros ajoutés : les deux écritures désignent le même nombre.',
          function () { vu.pts = 2; vu.col = 1; vu.zoom = 0; vu.dit = 0; }));
      } else {
        st.push(S(700, 'Même signe : on compare les <b>valeurs absolues</b>, ' +
          '<b>rang par rang</b>, en complétant par des zéros.', function () {
          vu.pts = 2; vu.col = 1; vu.zoom = 0; vu.dit = 0;
        }));
        for (var r = 0; r <= k; r++) {
          (function (r) {
            var decide = (r === k);
            var quoi = r === 0 ? 'Les <b>unités</b>' : 'Les <b>' + RANGS[r] + '</b>';
            var texte = decide
              ? quoi + ' diffèrent : <b>c\'est elles qui décident</b>. Tout ce qui ' +
                'suit n\'a plus aucune importance.'
              : quoi + ' sont <b>égales</b> : on descend d\'un rang.';
            st.push(S(decide ? 800 : 650, texte, function (p) {
              vu.pts = 2; vu.dit = 0; vu.col = 1 + r;
              // Sous les unités, on ne distingue plus rien là-haut : on agrandit.
              vu.zoom = k < 1 ? 0 : (r === 0 ? 0 : (r === 1 ? p : 1));
            }));
          })(r);
        }
      }

      st.push(S(750, 'On conclut — et sur la droite graduée, le plus grand est bien ' +
        'le plus à <b>droite</b>.', function () {
        vu.pts = 2; vu.col = colDecisive(); vu.dit = 1;
        vu.zoom = (meme && k >= 1) ? 1 : 0;
      }));
      return st;
    }

    /* ---- ranger une liste ------------------------------------------------ */
    function stepsRanger() {
      return [
        S(900, 'On place les cinq nombres sur la droite graduée.', function (p) {
          vu.pts = p * MAXL; vu.signes = 0; vu.sens = 0; vu.croi = 0; vu.decroi = 0;
        }),
        S(800, 'Les <b>négatifs</b> sont à gauche de 0, les <b>positifs</b> à droite : ' +
          'tout négatif est plus petit que tout positif.', function (p) {
          vu.pts = MAXL; vu.signes = p; vu.sens = 0; vu.croi = 0; vu.decroi = 0;
        }),
        S(900, 'En s\'éloignant de 0, la <b>valeur absolue augmente</b> des deux côtés — ' +
          'mais à gauche, le nombre <b>diminue</b> : c\'est là toute la règle des négatifs.',
          function (p) {
            vu.pts = MAXL; vu.signes = 1; vu.sens = p; vu.croi = 0; vu.decroi = 0;
          }),
        S(850, 'L\'ordre <b>croissant</b>, c\'est l\'ordre de lecture de la droite : ' +
          'de la <b>gauche vers la droite</b>.', function (p) {
          vu.pts = MAXL; vu.signes = 1; vu.sens = 1; vu.croi = p; vu.decroi = 0;
        }),
        S(850, 'L\'ordre <b>décroissant</b>, c\'est le <b>même trajet à l\'envers</b> : ' +
          'on relit la droite de la droite vers la gauche.', function (p) {
          vu.pts = MAXL; vu.signes = 1; vu.sens = 1; vu.croi = 1; vu.decroi = p;
        })
      ];
    }

    /* ==================================================================== */
    /* Armement                                                              */
    /* ==================================================================== */
    function arm() {
      majBoutons();
      function reset() {
        vu.pts = 0; vu.col = -1; vu.zoom = 0; vu.dit = 0;
        vu.signes = 0; vu.sens = 0; vu.croi = 0; vu.decroi = 0;
        cap(mode === 'comparer'
          ? 'Lequel des deux est le plus grand ? Le plus à droite sur la droite graduée.'
          : 'Ranger, c\'est simplement lire la droite graduée dans le bon sens.');
        render(true);
        board.update();
      }
      reset();
      anim.runSteps(mode === 'comparer' ? stepsComparer() : stepsRanger(), reset);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    var refs = null;
    function majBoutons() {
      if (!refs) return;
      refs.comparer.classList.toggle('active', mode === 'comparer');
      refs.ranger.classList.toggle('active', mode === 'ranger');
      refs.suivant.textContent = mode === 'comparer'
        ? '⟲ Un autre exemple' : '⟲ Une autre liste';
    }

    refs = mv.addControls([
      { type: 'button', id: 'comparer', label: 'Comparer deux nombres',
        onClick: function () { mode = 'comparer'; arm(); } },
      { type: 'button', id: 'ranger', label: 'Ranger une liste',
        onClick: function () { mode = 'ranger'; arm(); } },
      { type: 'button', id: 'play', label: '▶ Animer', onClick: function () { arm(); } },
      { type: 'button', id: 'suivant', label: '⟲ Un autre exemple', onClick: function () {
        if (mode === 'comparer') {
          iEx = (iEx + 1) % EXEMPLES.length;
          chargeExemple();
        } else {
          iListe = (iListe + 1) % LISTES.length;
          chargeListe();
        }
        arm();
      } }
    ]);
    mv.extras.appendChild(root);

    arm();
  }
});
