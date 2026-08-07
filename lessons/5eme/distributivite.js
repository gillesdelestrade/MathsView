/*
 * Distributivité (5ème) — k(a + b) = ka + kb, lue sur l'aire d'un rectangle.
 *
 * Une seule figure sert aux quatre situations : un rectangle de largeur k,
 * coupé en deux par un trait vertical. Le morceau de GAUCHE et celui de DROITE
 * ont la même largeur k — c'est tout le secret : k est le facteur commun.
 *
 *              ┌─────────────┬───────┐
 *            k │    k × a    │ k × b │        aire totale = k × (a + b)
 *              └─────────────┴───────┘
 *                     a          b
 *
 * Quatre scénarios, deux boutons chacun :
 *
 *   k(a+b), développer  : le rectangle entier, on le COUPE, on écarte les
 *                         morceaux → k(a + b) = k×a + k×b
 *   k(a+b), factoriser  : deux rectangles de même largeur, on les met BOUT À
 *                         BOUT → k×a + k×b = k(a + b)
 *   k(a−b), développer  : le rectangle de longueur a−b ; pour trouver son aire
 *                         on COMPLÈTE jusqu'à a, puis on enlève le bout k×b
 *   k(a−b), factoriser  : le rectangle de longueur a, on RETIRE le bout k×b,
 *                         il reste k(a − b)
 *
 * « Développer » part donc toujours de la forme factorisée, « factoriser » de
 * la forme développée : l'animation se lit dans le sens du calcul demandé.
 *
 * Toutes les coordonnées sont des FONCTIONS de k, a, b (et du glissement) :
 * bouger un curseur recalcule la figure en direct. L'égalité s'écrit en
 * dessous, terme par terme, aux couleurs des morceaux — un terme apparaît
 * quand la pièce correspondante apparaît. Le moteur « pas à pas » partagé
 * (mv.createAnimator) pilote le tout ; chaque étape règle un état ABSOLU pour
 * que « Précédent » puisse la rejouer.
 */
MathsView.register({
  id: 'distributivite',
  title: 'Distributivité',
  level: '5eme',
  category: 'algebre',
  subcategory: 'Calcul littéral',
  theme: 'Calcul littéral — k(a + b) = ka + kb, prouvé par les aires',
  description:
    'Un rectangle de largeur <strong>k</strong> et de longueur <strong>a + b</strong> ' +
    'se coupe en deux rectangles de largeur <strong>k</strong> : l\'un de longueur ' +
    '<strong>a</strong>, l\'autre de longueur <strong>b</strong>. Son aire se calcule ' +
    'donc de deux façons, et les deux donnent le même nombre : ' +
    '\\(k(a + b) = k \\times a + k \\times b\\).' +
    '<br>Choisis l\'égalité (<strong>+</strong> ou <strong>−</strong>) et le sens : ' +
    '<strong>développer</strong>, c\'est enlever la parenthèse ; ' +
    '<strong>factoriser</strong>, c\'est la faire apparaître.' +
    '<br>Règle <strong>k</strong>, <strong>a</strong> et <strong>b</strong>, puis clique ' +
    'sur <strong>Animer</strong> (ou coche <strong>Pas à pas</strong>).',
  notes:
    '<ul>' +
    '<li><strong>La règle :</strong> \\(k(a + b) = ka + kb\\) et \\(k(a - b) = ka - kb\\). ' +
    'On multiplie le facteur \\(k\\) par <strong>chacun</strong> des termes de la parenthèse ' +
    '— sans en oublier.</li>' +
    '<li><strong>Pourquoi c\'est vrai :</strong> les deux morceaux ont la <strong>même ' +
    'largeur k</strong>. Leurs aires \\(k \\times a\\) et \\(k \\times b\\) mises bout à bout ' +
    'font l\'aire du grand rectangle.</li>' +
    '<li><strong>Développer</strong> : \\(4(x + 3) = 4x + 12\\). ' +
    '<strong>Factoriser</strong> : \\(4x + 12 = 4(x + 3)\\). C\'est la même égalité, lue ' +
    'dans l\'autre sens.</li>' +
    '<li><strong>Le piège du signe −</strong> : dans \\(k(a - b)\\), le \\(k\\) multiplie ' +
    'aussi le terme qu\'on retire : \\(5(10 - 2) = 50 - 10 = 40\\), et non \\(50 - 2\\).</li>' +
    '<li><strong>Utile en calcul mental :</strong> \\(7 \\times 102 = 7(100 + 2) = 700 + 14 = 714\\), ' +
    'et \\(7 \\times 98 = 7(100 - 2) = 700 - 14 = 686\\).</li>' +
    '<li>Pour <strong>factoriser</strong>, on cherche ce qui est <strong>commun</strong> aux ' +
    'deux termes : dans \\(3 \\times 7 + 3 \\times 5\\), c\'est le \\(3\\).</li>' +
    '</ul>',
  board: { boundingbox: [-1.2, 5, 7.9, -1.9], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette — la couleur d'un terme est celle de la pièce qu'il mesure    */
    /* ==================================================================== */
    var C_L = '#2563eb';    // morceau de gauche  : k × a          (bleu)
    var C_R = '#d97706';    // morceau de droite  : k × b          (ambre)
    var C_NEG = '#dc2626';  // le morceau qu'on retire (mode −)    (rouge)
    var C_TOT = '#7c3aed';  // le rectangle entier                 (violet)
    var INK = '#334155';

    var FILL = 0.30;        // opacité de remplissage des morceaux
    var GAP = 0.9;          // écartement des deux morceaux, en unités du repère

    /* ==================================================================== */
    /* État                                                                  */
    /* ==================================================================== */
    var mode = 'plus';      // 'plus' → k(a+b)   |  'moins' → k(a−b)
    var sens = 'dev';       // 'dev'  → développer | 'fac' → factoriser
    var kVal = 2, aVal = 3, bVal = 2;
    var sl = 0;             // glissement du morceau de droite : 0 = collé, 1 = écarté
    var niveau = 0;         // avancement de l'égalité écrite sous la figure

    var anim = mv.createAnimator();

    function K() { return kVal; }
    function A() { return aVal; }
    // En mode −, il faut a > b (et on garde au moins 1 pour que « a − b » reste
    // lisible sous le morceau de gauche).
    function B() { return mode === 'plus' ? bVal : Math.min(bVal, aVal - 1); }
    function Lg() { return mode === 'plus' ? A() : A() - B(); }   // longueur du morceau gauche
    function Rg() { return B(); }                                  // longueur du morceau droit
    function Tot() { return Lg() + Rg(); }                         // a+b (mode +) ou a (mode −)
    function Rx() { return Lg() + sl * GAP; }                      // bord gauche du morceau droit
    function Cdroite() { return mode === 'plus' ? C_R : C_NEG; }

    /* ==================================================================== */
    /* Fabriques d'objets (coordonnées = fonctions de k, a, b, sl)           */
    /* ==================================================================== */
    function pt(fx, fy) {
      return board.create('point', [fx, fy],
        { visible: false, fixed: true, name: '', withLabel: false });
    }
    function rect(fx0, fy0, fx1, fy1, fill) {
      return board.create('polygon',
        [pt(fx0, fy0), pt(fx1, fy0), pt(fx1, fy1), pt(fx0, fy1)],
        { fillColor: fill, fillOpacity: 0, highlight: false, withLabel: false,
          borders: { strokeColor: INK, strokeWidth: 2, strokeOpacity: 0 },
          vertices: { visible: false } });
    }
    function lab(fx, fy, txt, color, size) {
      return board.create('text', [fx, fy, txt],
        { anchorX: 'middle', anchorY: 'middle', fontSize: size || 15, color: color,
          cssStyle: 'font-weight:700', fixed: true, visible: false, highlight: false });
    }
    // Affiche une région : remplissage + bord, de 0 à p.
    function reveal(pg, ft, p) {
      pg.setAttribute({ fillOpacity: ft * p });
      if (pg.borders) pg.borders.forEach(function (b) { b.setAttribute({ strokeOpacity: p }); });
    }
    function paint(pg, color) {
      pg.setAttribute({ fillColor: color });
    }
    function show(o, v) { o.setAttribute({ visible: !!v }); }
    function K0(v) { return function () { return v; }; }

    /* ==================================================================== */
    /* La figure                                                             */
    /* ==================================================================== */
    // Le rectangle entier (violet) : c'est lui qu'on voit avant la coupe, et
    // celui qu'on reconstitue à la fin d'une factorisation.
    var tot = rect(K0(0), K0(0), Tot, K, C_TOT);
    // Les deux morceaux. Posés par-dessus, ils recouvrent exactement `tot`
    // quand sl = 0 : le passage de l'un aux autres est invisible.
    var pL = rect(K0(0), K0(0), Lg, K, C_L);
    var pR = rect(Rx, K0(0), function () { return Rx() + Rg(); }, K, C_R);
    // Le trait de coupe.
    var cut = board.create('segment', [pt(Lg, K0(0)), pt(Lg, K)],
      { strokeColor: INK, strokeWidth: 2, dash: 2, visible: false,
        fixed: true, highlight: false, withLabel: false });

    /* Étiquettes ---------------------------------------------------------- */
    var lK = lab(K0(-0.45), function () { return K() / 2; }, 'k', INK);
    // Sous la figure, deux rangées : la longueur totale en bas, le détail au-dessus.
    var lTotBot = lab(function () { return Tot() / 2; }, K0(-1.15), 'a + b', C_TOT);
    var lLbot = lab(function () { return Lg() / 2; }, K0(-0.5), 'a', C_L);
    var lRbot = lab(function () { return Rx() + Rg() / 2; }, K0(-0.5), 'b', C_R);
    // Aires : l'expression au-dessus, sa valeur en dessous.
    function cy(d) { return function () { return K() / 2 + d; }; }
    var lTotAir = lab(function () { return Tot() / 2; }, cy(0.26), 'k × (a + b)', C_TOT);
    var lTotVal = lab(function () { return Tot() / 2; }, cy(-0.3), '', C_TOT, 14);
    var lLair = lab(function () { return Lg() / 2; }, cy(0.26), 'k × a', C_L);
    var lLval = lab(function () { return Lg() / 2; }, cy(-0.3), '', C_L, 14);
    var lRair = lab(function () { return Rx() + Rg() / 2; }, cy(0.26), 'k × b', C_R);
    var lRval = lab(function () { return Rx() + Rg() / 2; }, cy(-0.3), '', C_R, 14);

    var TOUT = [lK, lTotBot, lLbot, lRbot, lTotAir, lTotVal, lLair, lLval, lRair, lRval];

    /* ==================================================================== */
    /* Écriture des nombres et des expressions                               */
    /* ==================================================================== */
    function f(x) { return (Math.round(x * 100) / 100).toString().replace('.', ','); }
    function sgn() { return mode === 'plus' ? '+' : '−'; }
    function span(txt, c) { return '<span style="color:' + c + '">' + txt + '</span>'; }

    /* Aires, vues comme des mesures de pièces de la figure :
     *   airTot    = le rectangle entier  = k×(a+b) en mode + , k×a en mode −
     *   airGauche = le morceau de gauche = k×a     en mode + , k×(a−b) en mode −
     *   airDroite = le morceau de droite = k×b                                  */
    function airTot() { return K() * Tot(); }
    function airGauche() { return K() * Lg(); }
    function airDroite() { return K() * Rg(); }
    // Les mêmes, vues comme des expressions algébriques.
    function airFact() { return mode === 'plus' ? airTot() : airGauche(); }  // k × (a ± b)
    function airA() { return mode === 'plus' ? airGauche() : airTot(); }     // k × a
    function airB() { return airDroite(); }                                  // k × b

    /* Un terme porte la couleur de la pièce qu'il mesure — c'est ce qui relie
     * l'égalité à la figure. En mode −, attention : k × a est le GRAND
     * rectangle (violet) et k × (a − b) le morceau qui reste (bleu) ; en mode +
     * c'est l'inverse. */
    function cFact() { return mode === 'plus' ? C_TOT : C_L; }   // couleur de k × (a ± b)
    function cA() { return mode === 'plus' ? C_L : C_TOT; }      // couleur de k × a
    function cB() { return Cdroite(); }                          // couleur de k × b

    function factLit() { return span('k × (a ' + sgn() + ' b)', cFact()); }
    function devLit() {
      return span('k × a', cA()) + ' ' + sgn() + ' ' + span('k × b', cB());
    }
    function factNum() {
      return span(f(K()) + ' × (' + f(A()) + ' ' + sgn() + ' ' + f(B()) + ')', cFact());
    }
    function devNum() {
      return span(f(K()) + ' × ' + f(A()), cA()) + ' ' + sgn() + ' ' +
             span(f(K()) + ' × ' + f(B()), cB());
    }

    /* ==================================================================== */
    /* Le panneau : l'égalité qui s'écrit sous la figure                      */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'dis-panel';
    panel.innerHTML =
      '<div class="dis-cap"></div>' +
      '<div class="dis-eq dis-lit"></div>' +
      '<div class="dis-eq dis-num"></div>' +
      '<div class="dis-check"></div>' +
      '<div class="dis-warn"></div>';
    mv.extras.appendChild(panel);
    var capEl = panel.querySelector('.dis-cap');
    var litEl = panel.querySelector('.dis-lit');
    var numEl = panel.querySelector('.dis-num');
    var chkEl = panel.querySelector('.dis-check');
    var warnEl = panel.querySelector('.dis-warn');

    // cap() et setNiveau() sont appelés à CHAQUE image de l'animation : on ne
    // réécrit le HTML que lorsque le contenu change vraiment.
    var dernierCap = null;
    function cap(txt) {
      if (txt === dernierCap) return;
      dernierCap = txt;
      capEl.innerHTML = txt || '&nbsp;';
    }

    // niveau 0 : rien — 1 : le premier membre — 2 : l'égalité entière —
    // 3 : la vérification chiffrée.
    function setNiveau(n) {
      if (n === niveau) return;
      niveau = n;
      dessinePanneau();
    }
    function dessinePanneau() {
      // En mode −, la longueur retirée ne peut pas dépasser a : le curseur b est
      // borné à a − 1, et on le dit plutôt que de laisser croire qu'il n'a pas
      // d'effet.
      var borne = mode === 'moins' && bVal > aVal - 1;
      warnEl.innerHTML = borne
        ? 'On ne peut retirer que ce qui existe : <b>b</b> est ramené à ' + f(B()) +
          ' (il faut <b>b &lt; a</b>).' : '';
      warnEl.style.display = borne ? '' : 'none';

      // « Développer » part de la forme factorisée, « factoriser » de la forme
      // développée : le premier membre écrit est celui d'où l'on part.
      var un = sens === 'dev' ? factLit() : devLit();
      var deux = sens === 'dev' ? devLit() : factLit();
      var unN = sens === 'dev' ? factNum() : devNum();
      var deuxN = sens === 'dev' ? devNum() : factNum();

      litEl.innerHTML = niveau < 1 ? '' :
        (niveau < 2 ? un : un + ' <b class="dis-egal">=</b> ' + deux);
      numEl.innerHTML = niveau < 1 ? '' :
        (niveau < 2 ? unN : unN + ' <b class="dis-egal">=</b> ' + deuxN);

      if (niveau < 3) { chkEl.innerHTML = ''; chkEl.style.display = 'none'; return; }
      // Les deux membres, calculés chacun de son côté, tombent sur le même
      // nombre : c'est la vérification.
      var dansParen = mode === 'plus' ? A() + B() : A() - B();
      var cotéFact = span(f(K()) + ' × ' + f(dansParen), cFact()) + ' = ' + f(airFact());
      var cotéDev = span(f(airA()), cA()) + ' ' + sgn() + ' ' + span(f(airB()), cB()) +
                    ' = ' + f(airFact());
      chkEl.innerHTML = '<span class="dis-ok">✔</span>' +
        (sens === 'dev' ? cotéFact : cotéDev) +
        '<span class="dis-et">et</span>' +
        (sens === 'dev' ? cotéDev : cotéFact) +
        '<span class="dis-meme">même aire : ' + f(airFact()) + '</span>';
      chkEl.style.display = '';
    }

    /* ==================================================================== */
    /* Les quatre scénarios                                                  */
    /* ==================================================================== */
    // Remise à zéro : la figure est vierge, le panneau vide.
    function hideAll() {
      sl = (sens === 'fac' && mode === 'plus') ? 1 : 0;   // la factorisation part des morceaux écartés
      reveal(tot, 0, 0); reveal(pL, 0, 0); reveal(pR, 0, 0);
      show(cut, false);
      TOUT.forEach(function (t) { show(t, false); });
      cap('');
      niveau = 0; dessinePanneau();
      board.update();
    }

    // Petite fabrique d'étape : le commentaire et le niveau du panneau sont
    // réglés à chaque image (état absolu → « Précédent » rejoue sans surprise).
    function S(dur, txt, niv, fn) {
      return {
        dur: dur,
        step: function (p) { cap(txt); if (niv != null) setNiveau(niv); fn(p); },
        after: function () {
          cap(txt); if (niv != null) setNiveau(niv); fn(1); board.update();
        }
      };
    }

    // Les textes de la figure dépendent du mode (et les nombres, des curseurs).
    function textesFixes() {
      lTotBot.setText(mode === 'plus' ? 'a + b' : 'a');
      lLbot.setText(mode === 'plus' ? 'a' : 'a − b');
      lTotAir.setText(mode === 'plus' ? 'k × (a + b)' : 'k × a');
      lLair.setText(mode === 'plus' ? 'k × a' : 'k × (a − b)');
      lRair.setText('k × b');
      lTotVal.setText('= ' + f(airTot()));
      lLval.setText('= ' + f(airGauche()));
      lRval.setText('= ' + f(airDroite()));
      lRbot.setAttribute({ color: Cdroite() });
      lRair.setAttribute({ color: Cdroite() });
      lRval.setAttribute({ color: Cdroite() });
      paint(pR, Cdroite());
    }

    /* ---- k(a + b), développer : on coupe le rectangle et on écarte ------- */
    function stepsPlusDev() {
      return [
        S(520, 'Un rectangle de largeur <b>k</b> et de longueur <b>a + b</b>.', 0, function (p) {
          sl = 0; reveal(tot, FILL, p); reveal(pL, 0, 0); reveal(pR, 0, 0);
          show(cut, false);
          show(lK, p >= 1); show(lTotBot, p >= 1);
          show(lTotAir, false); show(lTotVal, false);
          [lLbot, lRbot, lLair, lLval, lRair, lRval].forEach(function (t) { show(t, false); });
        }),
        S(480, 'Son aire, c\'est <b>largeur × longueur</b> : <b>k × (a + b)</b>.', 1, function (p) {
          reveal(tot, FILL, 1);
          show(lTotAir, p >= 0.4); show(lTotVal, p >= 0.4);
        }),
        S(620, 'On le <b>coupe</b> en deux : d\'un côté la longueur <b>a</b>, de l\'autre <b>b</b>.', 1, function (p) {
          sl = 0;
          reveal(tot, FILL * (1 - p), 1); reveal(pL, FILL, p); reveal(pR, FILL, p);
          show(cut, true);
          show(lTotAir, false); show(lTotVal, false);
          show(lLbot, p >= 0.5); show(lRbot, p >= 0.5);
        }),
        S(900, 'On <b>écarte</b> les deux morceaux : ils ont tous les deux la largeur <b>k</b>.', 2, function (p) {
          sl = p;
          reveal(tot, 0, 0);
          show(cut, p < 0.15);
          show(lTotBot, false);
          show(lLair, p >= 0.5); show(lLval, p >= 0.5);
          show(lRair, p >= 0.5); show(lRval, p >= 0.5);
        }),
        S(620, 'Les deux aires <b>bout à bout</b> font l\'aire de départ : on a <b>développé</b>.', 3, function (p) {
          sl = 1;
        })
      ];
    }

    /* ---- k(a + b), factoriser : deux morceaux qu'on met bout à bout ------ */
    function stepsPlusFac() {
      return [
        S(520, 'Deux rectangles de <b>même largeur k</b> : l\'un long de <b>a</b>, l\'autre de <b>b</b>.', 0, function (p) {
          sl = 1;
          reveal(tot, 0, 0); reveal(pL, FILL, p); reveal(pR, FILL, p);
          show(cut, false);
          show(lK, p >= 1); show(lLbot, p >= 1); show(lRbot, p >= 1);
          [lTotBot, lTotAir, lTotVal, lLair, lLval, lRair, lRval].forEach(function (t) { show(t, false); });
        }),
        S(480, 'Leurs aires : <b>k × a</b> et <b>k × b</b>.', 1, function (p) {
          show(lLair, p >= 0.4); show(lLval, p >= 0.4);
          show(lRair, p >= 0.4); show(lRval, p >= 0.4);
        }),
        S(900, 'Même largeur : on peut les mettre <b>bout à bout</b>.', 1, function (p) {
          sl = 1 - p;
          show(cut, p >= 1);
        }),
        S(620, 'Ensemble, un seul rectangle de longueur <b>a + b</b>.', 2, function (p) {
          sl = 0;
          reveal(tot, FILL * p, p);
          reveal(pL, FILL * (1 - p), 1 - p); reveal(pR, FILL * (1 - p), 1 - p);
          show(cut, p < 0.5);
          show(lLair, p < 0.5); show(lLval, p < 0.5);
          show(lRair, p < 0.5); show(lRval, p < 0.5);
          show(lLbot, p < 0.5); show(lRbot, p < 0.5);
          show(lTotBot, p >= 0.5);
          show(lTotAir, p >= 0.5); show(lTotVal, p >= 0.5);
        }),
        S(620, 'Le <b>k</b> était commun aux deux termes : on l\'a mis en <b>facteur</b>.', 3, function (p) {
          sl = 0;
        })
      ];
    }

    /* ---- k(a − b), développer : on complète, puis on enlève -------------- */
    function stepsMoinsDev() {
      return [
        S(520, 'Un rectangle de largeur <b>k</b> et de longueur <b>a − b</b>.', 0, function (p) {
          sl = 1;
          reveal(tot, 0, 0); reveal(pL, FILL, p); reveal(pR, 0, 0);
          show(cut, false);
          show(lK, p >= 1); show(lLbot, p >= 1);
          [lTotBot, lRbot, lTotAir, lTotVal, lLair, lLval, lRair, lRval].forEach(function (t) { show(t, false); });
        }),
        S(480, 'Son aire : <b>k × (a − b)</b>. C\'est elle qu\'on cherche.', 1, function (p) {
          show(lLair, p >= 0.4); show(lLval, p >= 0.4);
        }),
        S(900, 'Pour la calculer, on <b>complète</b> jusqu\'à la longueur <b>a</b>.', 1, function (p) {
          sl = 1 - p;
          reveal(pR, FILL, p);
          show(lRbot, p >= 0.6);
          show(cut, p >= 1);
        }),
        S(620, 'Le grand rectangle a pour aire <b>k × a</b> — mais c\'est <b>trop</b>.', 1, function (p) {
          sl = 0;
          show(lLair, p < 0.5); show(lLval, p < 0.5);
          show(lTotBot, p >= 0.5);
          show(lTotAir, p >= 0.5); show(lTotVal, p >= 0.5);
          show(lRair, false); show(lRval, false);
        }),
        S(900, 'On <b>enlève</b> le morceau en trop, d\'aire <b>k × b</b> : il reste <b>k × (a − b)</b>.', 2, function (p) {
          sl = p;                                   // le morceau s'en va pour de bon
          reveal(pR, FILL + 0.25, 1);
          show(lRair, true); show(lRval, true);
          show(lTotBot, p < 0.3);
          show(lTotAir, p < 0.3); show(lTotVal, p < 0.3);
          show(lLair, p >= 0.5); show(lLval, p >= 0.5);
        }),
        S(620, 'Le <b>k</b> multiplie <b>les deux</b> termes de la parenthèse : on a <b>développé</b>.', 3, function (p) {
          sl = 1;
        })
      ];
    }

    /* ---- k(a − b), factoriser : on retire le bout, il reste (a − b) ------ */
    function stepsMoinsFac() {
      return [
        S(520, 'Un rectangle de largeur <b>k</b> et de longueur <b>a</b>.', 0, function (p) {
          sl = 0;
          reveal(tot, FILL, p); reveal(pL, 0, 0); reveal(pR, 0, 0);
          show(cut, false);
          show(lK, p >= 1); show(lTotBot, p >= 1);
          [lTotAir, lTotVal, lLbot, lRbot, lLair, lLval, lRair, lRval]
            .forEach(function (t) { show(t, false); });
        }),
        // Le membre écrit ici est « k × a − k × b » : il n'est complet qu'une
        // fois le bout retiré, à l'étape suivante. On n'écrit donc rien encore.
        S(480, 'Son aire : <b>k × a</b>.', 0, function (p) {
          reveal(tot, FILL, 1);
          show(lTotAir, p >= 0.4); show(lTotVal, p >= 0.4);
        }),
        S(620, 'On en <b>retire</b> un bout de longueur <b>b</b> : son aire est <b>k × b</b>.', 1, function (p) {
          sl = 0;
          reveal(tot, FILL * (1 - p), 1); reveal(pL, FILL, p); reveal(pR, FILL + 0.25 * p, p);
          show(cut, true);
          show(lTotAir, false); show(lTotVal, false);
          show(lRbot, p >= 0.5); show(lRair, p >= 0.5); show(lRval, p >= 0.5);
        }),
        S(900, 'Le morceau s\'en va : il reste la longueur <b>a − b</b>.', 2, function (p) {
          sl = p;
          show(cut, p < 0.15);
          show(lTotBot, false);
          show(lLbot, p >= 0.4);
          show(lLair, p >= 0.6); show(lLval, p >= 0.6);
        }),
        S(620, 'Ce qui reste, c\'est <b>k × (a − b)</b> : on a <b>factorisé</b> par k.', 3, function (p) {
          sl = 1;
        })
      ];
    }

    var SCENARIOS = {
      'plus:dev': stepsPlusDev, 'plus:fac': stepsPlusFac,
      'moins:dev': stepsMoinsDev, 'moins:fac': stepsMoinsFac
    };

    /* ==================================================================== */
    /* Armement                                                              */
    /* ==================================================================== */
    function arm() {
      textesFixes();
      majBoutons();
      hideAll();
      anim.runSteps(SCENARIOS[mode + ':' + sens](), hideAll);
    }

    // Un curseur bouge : la figure suit toute seule (les coordonnées sont des
    // fonctions), il ne reste qu'à réécrire les nombres.
    function majValeurs() {
      textesFixes();
      dessinePanneau();
      board.update();
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    var refs = null;
    function majBoutons() {
      if (!refs) return;
      refs.plus.classList.toggle('active', mode === 'plus');
      refs.moins.classList.toggle('active', mode === 'moins');
      refs.dev.classList.toggle('active', sens === 'dev');
      refs.fac.classList.toggle('active', sens === 'fac');
    }

    refs = mv.addControls([
      { type: 'button', id: 'plus', label: 'k (a + b)', onClick: function () { mode = 'plus'; arm(); } },
      { type: 'button', id: 'moins', label: 'k (a − b)', onClick: function () { mode = 'moins'; arm(); } },
      { type: 'button', id: 'dev', label: 'Développer →', onClick: function () { sens = 'dev'; arm(); } },
      { type: 'button', id: 'fac', label: '← Factoriser', onClick: function () { sens = 'fac'; arm(); } },
      { type: 'button', id: 'play', label: '▶ Animer', onClick: arm },
      { type: 'slider', id: 'k', label: 'k', min: 1, max: 4, step: 1, value: 2,
        onInput: function (v) { kVal = v; majValeurs(); } },
      { type: 'slider', id: 'a', label: 'a', min: 2, max: 4, step: 1, value: 3,
        onInput: function (v) { aVal = v; majValeurs(); } },
      { type: 'slider', id: 'b', label: 'b', min: 1, max: 3, step: 1, value: 2,
        onInput: function (v) { bVal = v; majValeurs(); } }
    ]);

    arm();
  }
});
