/*
 * Déterminer une proportion, un pourcentage (5ème).
 *
 * ---------------------------------------------------------------------------
 * L'autre sens de la leçon sur les fractions d'une quantité
 * ---------------------------------------------------------------------------
 * Là-bas, on connaissait la proportion et on cherchait la quantité : « 30 % de
 * 48 ». Ici on connaît les DEUX quantités — la partie et le tout — et l'on
 * cherche la proportion : « 15 filles sur 25 élèves, cela fait combien ? »
 * C'est une division, là où l'autre était une multiplication.
 *
 * ---------------------------------------------------------------------------
 * Pourquoi « pour cent » se voit mieux qu'il ne s'explique
 * ---------------------------------------------------------------------------
 * L'animation dessine la situation en carreaux : le tout, et la partie
 * coloriée. Puis elle en dessine une SECONDE, de cent carreaux, et la remplit
 * jusqu'à retrouver la même proportion. Le pourcentage n'est alors pas une
 * formule mais une lecture : c'est le nombre de carreaux coloriés quand on
 * refait la même chose sur cent.
 *
 * D'où l'enchaînement de la leçon :
 *   la proportion         partie / tout, telle quelle
 *   simplifiée            en divisant les deux par le même nombre
 *   ramenée sur cent      la grille de cent, remplie d'autant
 *   en pourcentage        ce nombre-là, suivi du signe %
 *   en écriture décimale  le quotient, qui est aussi le pourcentage ÷ 100
 *
 * ---------------------------------------------------------------------------
 * À quoi ça sert vraiment : comparer
 * ---------------------------------------------------------------------------
 * Une proportion isolée ne dit pas grand-chose. La case « Comparer » pose une
 * seconde situation, avec un tout DIFFÉRENT : 12 réussites sur 20 et 15 sur 25
 * ne se comparent pas à vue, et pourtant c'est la même proportion. Ramener sur
 * cent est précisément ce qui rend deux situations comparables — c'est la
 * raison d'être du pourcentage, et elle ne se comprend pas sans un second cas.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est calculé
 * ---------------------------------------------------------------------------
 * Tout part du couple (partie, tout). La fraction simplifiée vient du PGCD, le
 * pourcentage de partie × 100 ÷ tout, et les grilles sont dessinées à partir de
 * ces mêmes nombres. Les totaux proposés (20, 25, 40, 50) sont choisis pour que
 * le pourcentage tombe juste, au dixième près au pire.
 */
MathsView.register({
  id: 'proportions',
  title: 'Déterminer une proportion, un pourcentage',
  level: '5eme',
  category: 'calcul',
  subcategory: 'Proportionnalité',
  theme: 'Proportions et pourcentages — de deux quantités vers une proportion',
  exercices: ['proportions'],
  description:
    'Quand on connaît la <strong>partie</strong> et le <strong>tout</strong>, la ' +
    '<strong>proportion</strong> est leur quotient : \\(\\dfrac{\\text{partie}}' +
    '{\\text{tout}}\\). C\'est une <strong>division</strong> — l\'inverse du calcul ' +
    '« 30 % de 48 », qui était une multiplication.' +
    '<br>Un <strong>pourcentage</strong> n\'est rien d\'autre qu\'une proportion écrite ' +
    '<strong>sur cent</strong>. L\'animation dessine la situation en carreaux, puis en ' +
    'refait une de <strong>cent carreaux</strong> et la remplit jusqu\'à la même ' +
    'proportion : le pourcentage se <em>lit</em> alors, au lieu de se réciter.' +
    '<br><strong>Choisis une situation</strong>, règle la partie avec le curseur, et coche ' +
    '<strong>Comparer</strong> pour voir à quoi sert vraiment un pourcentage : mettre côte ' +
    'à côte deux situations qui n\'ont pas le même total.',
  notes:
    '<ul>' +
    '<li><strong>La proportion.</strong> C\'est le quotient \\(\\dfrac{\\text{partie}}' +
    '{\\text{tout}}\\). Elle s\'écrit en fraction, en nombre décimal, ou en pourcentage — ' +
    'ce sont trois écritures du <em>même</em> nombre.</li>' +
    '<li><strong>Le pourcentage.</strong> \\(t\\,\\%\\) signifie \\(\\dfrac{t}{100}\\). ' +
    'Dire « 60 % », c\'est dire « 60 sur 100 ». On passe de la proportion au pourcentage en ' +
    '<strong>multipliant par 100</strong>, et du pourcentage à la proportion en ' +
    '<strong>divisant par 100</strong>.</li>' +
    '<li><strong>La partie sur le tout, jamais l\'inverse.</strong> Sur 25 élèves dont 15 ' +
    'filles, la proportion de filles est \\(\\frac{15}{25}\\), pas \\(\\frac{25}{15}\\). ' +
    'Une proportion est toujours comprise entre 0 et 1 — donc un pourcentage entre 0 % et ' +
    '100 %.</li>' +
    '<li><strong>Simplifier ne change rien.</strong> \\(\\frac{15}{25} = \\frac{3}{5}\\) : ' +
    'c\'est la même proportion, écrite plus simplement. Et \\(\\frac{3}{5} = \\frac{60}{100} ' +
    '= 60\\,\\%\\).</li>' +
    '<li><strong>Pourquoi ramener sur cent.</strong> Deux proportions de totaux différents ' +
    'ne se comparent pas à vue : 12 sur 20 et 15 sur 25 ont l\'air différentes, et sont ' +
    'pourtant égales. Sur cent, elles s\'écrivent toutes deux 60 — le pourcentage est fait ' +
    'pour ça.</li>' +
    '<li><strong>Attention à ce qu\'on compare.</strong> Un pourcentage se rapporte toujours ' +
    'à un tout : 50 % d\'une classe de 20 et 50 % d\'une classe de 30, ce n\'est pas le même ' +
    'nombre d\'élèves. Le pourcentage compare des <em>proportions</em>, pas des quantités.</li>' +
    '<li><strong>Le complément.</strong> Si 60 % des élèves sont des filles, alors ' +
    '\\(100 - 60 = 40\\,\\%\\) sont des garçons : les deux proportions font 100 % à elles ' +
    'deux, puisqu\'ensemble elles forment le tout.</li>' +
    '</ul>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();          // leçon sans figure

    var anim = mv.createAnimator();

    var PART = '#2563eb';        // la partie
    var RESTE = '#e2e8f0';       // le reste du tout
    var CENT = '#16a34a';        // la grille de cent

    function fr(v) {
      var r = Math.round(v * 100) / 100;
      return String(r).replace('.', ',');
    }
    function pgcd(a, b) { return b ? pgcd(b, a % b) : Math.abs(a); }

    /* ==================================================================== */
    /* Les situations                                                       */
    /* ==================================================================== */
    /* Les totaux sont choisis pour que le pourcentage tombe juste : 20, 25, 40
       et 50 divisent 100 ou lui donnent un seul chiffre après la virgule. */
    var SITUATIONS = [
      { cle: 'classe', nom: 'Une classe', tout: 25, part: 15, cols: 5,
        quoi: 'élèves', dont: 'filles', phrase: function (p, n) {
          return 'Dans une classe de <b>' + n + ' élèves</b>, il y a <b>' + p +
                 ' filles</b>.'; } },
      { cle: 'paniers', nom: 'Un panier de fruits', tout: 40, part: 24, cols: 10,
        quoi: 'fruits', dont: 'pommes', phrase: function (p, n) {
          return 'Un panier contient <b>' + n + ' fruits</b>, dont <b>' + p +
                 ' pommes</b>.'; } },
      { cle: 'tirs', nom: 'Des tirs au but', tout: 20, part: 13, cols: 5,
        quoi: 'tirs', dont: 'réussis', phrase: function (p, n) {
          return 'Sur <b>' + n + ' tirs au but</b>, <b>' + p + '</b> ont été <b>réussis</b>.'; } },
      { cle: 'sondage', nom: 'Un sondage', tout: 50, part: 32, cols: 10,
        quoi: 'personnes', dont: 'ont répondu oui', phrase: function (p, n) {
          return 'On interroge <b>' + n + ' personnes</b> : <b>' + p +
                 '</b> répondent <b>oui</b>.'; } }
    ];
    var iS = 0;
    function S() { return SITUATIONS[iS]; }
    var part = SITUATIONS[0].part;

    function tout() { return S().tout; }
    function pourcent() { return part * 100 / tout(); }
    function simplifiee() {
      var g = pgcd(part, tout()) || 1;
      return [part / g, tout() / g];
    }

    /* La seconde situation, pour la comparaison : un autre total, et une
       proportion volontairement proche — c'est là que l'œil se trompe. */
    function autre() {
      var n2 = tout() === 20 ? 25 : 20;
      var p2 = Math.round(pourcent() * n2 / 100);
      // on la décale d'un cran quand elle tomberait exactement pareil : deux
      // situations identiques ne montreraient rien
      if (Math.abs(p2 * 100 / n2 - pourcent()) < 1e-9 && p2 < n2) p2 += 1;
      return { n: n2, p: Math.max(0, Math.min(n2, p2)) };
    }

    /* ==================================================================== */
    /* Les grilles                                                          */
    /* ==================================================================== */
    /* Un carreau par unité, `p` coloriés. C'est le dessin qui porte la leçon :
       la proportion se voit comme une part de surface, et « pour cent » devient
       littéralement « sur une grille de cent ». */
    function grille(n, p, cols, couleur, taille) {
      var c = taille || 17, e = 3;
      var lignes = Math.ceil(n / cols);
      var W = cols * (c + e) - e, H = lignes * (c + e) - e;
      var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H +
               '" xmlns="http://www.w3.org/2000/svg" class="pro-grille">'];
      for (var i = 0; i < n; i++) {
        var x = (i % cols) * (c + e), y = Math.floor(i / cols) * (c + e);
        s.push('<rect x="' + x + '" y="' + y + '" width="' + c + '" height="' + c +
               '" rx="3" fill="' + (i < p ? couleur : RESTE) + '"/>');
      }
      return s.join('') + '</svg>';
    }

    /* ==================================================================== */
    /* Le panneau                                                           */
    /* ==================================================================== */
    var bloc = document.createElement('div');
    bloc.className = 'pro-bloc';
    bloc.innerHTML =
      '<div class="pro-choix"></div>' +
      '<div class="pro-curseur"></div>' +
      '<div class="pro-scene">' +
        '<div class="pro-col"><div class="pro-titre-col"></div><div class="pro-g1"></div></div>' +
        '<div class="pro-col"><div class="pro-titre-col2"></div><div class="pro-g2"></div></div>' +
      '</div>' +
      '<div class="pro-calcul"></div>' +
      '<div class="pro-comparaison"></div>' +
      '<div class="pro-etapes"></div>';
    var elChoix = bloc.querySelector('.pro-choix');
    var elCurseur = bloc.querySelector('.pro-curseur');
    var elT1 = bloc.querySelector('.pro-titre-col');
    var elT2 = bloc.querySelector('.pro-titre-col2');
    var elG1 = bloc.querySelector('.pro-g1');
    var elG2 = bloc.querySelector('.pro-g2');
    var elCalcul = bloc.querySelector('.pro-calcul');
    var elComp = bloc.querySelector('.pro-comparaison');
    var elEtapes = bloc.querySelector('.pro-etapes');

    var voirComparaison = false;

    /* ==================================================================== */
    /* L'animation : des états figés, jamais des ajouts au DOM               */
    /* ==================================================================== */
    var phrases = [];
    var cur;

    function neuf() { return { n: 0, g1: 0, cent: 0, lignes: [] }; }
    function copie(e) {
      return { n: e.n, g1: e.g1, cent: e.cent, lignes: e.lignes.slice() };
    }
    function pas(dur, maj) {
      maj();
      var e = copie(cur);
      return { dur: dur, step: function (q) { rendre(e, q); } };
    }
    function dire(t) { cur.n = phrases.push(t); }

    function rendre(e, q) {
      var s = S();
      // la grille de la situation : elle se colorie au fil de la première étape,
      // puis reste pleine
      var av = (q === undefined ? 1 : q);
      var p1 = e.g1 === 1 ? Math.round(part * av) : (e.g1 >= 2 ? part : 0);
      var h1 = e.g1 ? grille(tout(), p1, s.cols, PART) : '';
      var t1 = e.g1 ? '<b>' + tout() + ' ' + s.quoi + '</b>, dont <b style="color:' + PART +
                      '">' + part + '</b>' : '';
      // la grille de cent : elle se remplit pendant l'étape qui lui est propre
      var vise = Math.round(pourcent());
      var pc = e.cent >= 2 ? vise
             : e.cent === 1 ? Math.round(vise * (q === undefined ? 1 : q)) : 0;
      var h2 = e.cent ? grille(100, pc, 10, CENT, 14) : '';
      var t2 = e.cent ? '<b>la même proportion, sur 100</b>' : '';

      if (elG1.innerHTML !== h1) elG1.innerHTML = h1;
      if (elT1.innerHTML !== t1) elT1.innerHTML = t1;
      if (elG2.innerHTML !== h2) elG2.innerHTML = h2;
      if (elT2.innerHTML !== t2) elT2.innerHTML = t2;

      var hc = e.lignes.map(function (l) {
        return '<div class="pro-ligne' + (l.fort ? ' forte' : '') + '">' + l.t + '</div>';
      }).join('');
      if (elCalcul.innerHTML !== hc) elCalcul.innerHTML = hc;

      var ph = phrases.slice(0, e.n).map(function (x) {
        return '<p class="pro-dit">' + x + '</p>';
      }).join('');
      if (elEtapes.innerHTML !== ph) {
        elEtapes.innerHTML = ph;
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([elEtapes]);
      }
      rendreComparaison(e);
    }

    function rendreComparaison(e) {
      var h = '';
      if (voirComparaison && e.cent >= 2) {
        var a = autre(), s = S();
        var pcA = a.p * 100 / a.n;
        h = '<div class="pro-comp-titre">Et cette autre situation ?</div>' +
          '<div class="pro-comp-duo">' +
          '<div class="pro-comp-cas"><div class="pro-comp-lab">' + part + ' sur ' + tout() +
            '</div>' + grille(tout(), part, S().cols, PART, 13) +
            '<div class="pro-comp-val">' + fr(pourcent()) + ' %</div></div>' +
          '<div class="pro-comp-cas"><div class="pro-comp-lab">' + a.p + ' sur ' + a.n +
            '</div>' + grille(a.n, a.p, a.n === 25 ? 5 : 5, '#a855f7', 13) +
            '<div class="pro-comp-val">' + fr(pcA) + ' %</div></div>' +
          '</div>' +
          '<p class="pro-comp-dit">' + (Math.abs(pcA - pourcent()) < 1e-9
            ? 'Les deux totaux sont différents, les deux parties aussi — et pourtant c\'est ' +
              '<b>la même proportion</b>. Impossible de le voir sans ramener sur cent.'
            : 'Les deux situations n\'ont pas le même total : on ne peut pas comparer ' +
              part + ' et ' + a.p + ' directement. Ramenées sur cent, elles donnent <b>' +
              fr(pourcent()) + ' %</b> et <b>' + fr(pcA) + ' %</b> — et là, ' +
              (pourcent() > pcA ? 'la première' : 'la seconde') + ' l\'emporte.') + '</p>';
      }
      if (elComp.innerHTML !== h) elComp.innerHTML = h;
    }

    function construitEtapes() {
      phrases = [];
      cur = neuf();
      var s = S(), n = tout(), p = part;
      var simp = simplifiee(), pc = pourcent();
      var steps = [];

      steps.push(pas(900, function () {
        cur.g1 = 1;
        dire(s.phrase(p, n) + ' Chaque carreau est un ' + s.quoi.replace(/s$/, '') +
             ' ; les carreaux colorés sont ceux qui nous intéressent.');
      }));

      steps.push(pas(800, function () {
        cur.g1 = 2;
        cur.lignes = [{ t: 'proportion = <sup>partie</sup>⁄<sub>tout</sub> = <b>' + p + '/' +
                           n + '</b>', fort: true }];
        dire('La <b>proportion</b>, c\'est la <b>partie divisée par le tout</b> : ' +
             '<b>' + p + '/' + n + '</b>. Attention au sens — c\'est la partie sur le tout, ' +
             'jamais l\'inverse.');
      }));

      if (simp[1] !== n) {
        steps.push(pas(800, function () {
          cur.lignes = cur.lignes.concat([{ t: p + '/' + n + ' = <b>' + simp[0] + '/' +
                                              simp[1] + '</b>', fort: true }]);
          cur.lignes = cur.lignes.map(function (l, i) {
            return { t: l.t, fort: i === cur.lignes.length - 1 };
          });
          dire('On peut la <b>simplifier</b> en divisant les deux nombres par ' +
               (pgcd(p, n) || 1) + ' : <b>' + simp[0] + '/' + simp[1] + '</b>. C\'est la ' +
               '<b>même</b> proportion, écrite plus simplement.');
        }));
      }

      steps.push(pas(1200, function () {
        cur.cent = 1;
        dire('Et si le tout faisait <b>100</b> ? On remplit une grille de cent carreaux ' +
             'jusqu\'à retrouver la <b>même part</b>.');
      }));

      steps.push(pas(700, function () {
        cur.cent = 2;
        cur.lignes = cur.lignes.concat([{ t: p + '/' + n + ' = <b>' + fr(pc) + '/100</b>',
                                          fort: true }]);
        cur.lignes = cur.lignes.map(function (l, i) {
          return { t: l.t, fort: i === cur.lignes.length - 1 };
        });
        dire('Il en faut <b>' + fr(pc) + '</b> sur cent. Le calcul le confirme : ' +
             '<b>' + p + ' × 100 ÷ ' + n + ' = ' + fr(pc) + '</b>.');
      }));

      steps.push(pas(800, function () {
        cur.lignes = cur.lignes.concat([{ t: '<b>' + fr(pc) + ' %</b>', fort: true }]);
        cur.lignes = cur.lignes.map(function (l, i) {
          return { t: l.t, fort: i === cur.lignes.length - 1 };
        });
        dire('« Sur cent » s\'écrit <b>%</b> : la proportion vaut <b>' + fr(pc) + ' %</b>. ' +
             'Un pourcentage n\'est rien d\'autre qu\'une proportion écrite sur cent.');
      }));

      steps.push(pas(800, function () {
        dire('En écriture décimale, c\'est le quotient : <b>' + p + ' ÷ ' + n + ' = ' +
             fr(pc / 100) + '</b>. On passe de l\'un à l\'autre en multipliant ou en ' +
             'divisant par 100 — trois écritures, <b>un seul nombre</b>.');
      }));

      steps.push(pas(700, function () {
        dire('Et le <b>reste</b> ? ' + (n - p) + ' ' + s.quoi + ' sur ' + n + ', soit <b>' +
             fr(100 - pc) + ' %</b> : les deux parts font <b>100 %</b> à elles deux, ' +
             'puisqu\'ensemble elles forment le tout.');
      }));

      return steps;
    }

    function effacer() { anim.cancel(); rendre(neuf(), 1); }
    function toutAfficher() {
      anim.cancel();
      var steps = construitEtapes();
      steps.forEach(function (s) { s.step(1); });
    }
    function jouer() { effacer(); anim.runSteps(construitEtapes(), effacer); }

    /* ==================================================================== */
    /* Les commandes                                                        */
    /* ==================================================================== */
    var minuteur = null;
    mv.onCleanup(function () { clearTimeout(minuteur); });

    var boutons = SITUATIONS.map(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = s.nom;
      b.onclick = function () {
        iS = i;
        part = s.part;
        majBoutons();
        rendreCurseur();
        jouer();
      };
      elChoix.appendChild(b);
      return b;
    });
    function majBoutons() {
      boutons.forEach(function (b, i) { b.classList.toggle('active', i === iS); });
    }

    function rendreCurseur() {
      elCurseur.innerHTML = '';
      var lab = document.createElement('label');
      var nom = document.createElement('span');
      nom.className = 'pro-nom';
      nom.textContent = 'la partie :';
      var input = document.createElement('input');
      input.type = 'range';
      input.min = 0; input.max = tout(); input.step = 1;
      input.value = part;
      var val = document.createElement('span');
      val.className = 'pro-val';
      val.textContent = part + ' sur ' + tout();
      input.oninput = function () {
        part = parseInt(input.value, 10);
        val.textContent = part + ' sur ' + tout();
        toutAfficher();
        clearTimeout(minuteur);
        minuteur = setTimeout(jouer, 700);
      };
      lab.appendChild(nom); lab.appendChild(input); lab.appendChild(val);
      elCurseur.appendChild(lab);
    }

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Lancer l\'animation', onClick: jouer },
      { type: 'button', id: 'all', label: 'Tout afficher', onClick: toutAfficher },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer },
      { type: 'checkbox', id: 'comp', label: 'Comparer avec une autre situation',
        checked: false,
        onChange: function (v) { voirComparaison = v; toutAfficher(); } }
    ]);

    mv.extras.appendChild(bloc);
    majBoutons();
    rendreCurseur();
    jouer();
  }
});
