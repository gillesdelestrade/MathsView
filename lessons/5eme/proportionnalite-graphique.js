/*
 * Reconnaître une situation de proportionnalité — tableau et graphique (5ème).
 *
 * ---------------------------------------------------------------------------
 * Une même situation, deux façons de la regarder
 * ---------------------------------------------------------------------------
 * Un tableau de mesures ne dit rien à l'œil : il faut diviser ligne par ligne
 * pour savoir si les quotients sont égaux. Le graphique, lui, répond d'un coup
 * d'œil — à condition de savoir ce qu'on regarde. L'animation fait le pont :
 * chaque LIGNE du tableau devient un POINT du repère, son abscisse et son
 * ordonnée reportées en pointillés depuis les axes. Quand les quatre lignes
 * sont posées, on relie les points et on regarde.
 *
 * ---------------------------------------------------------------------------
 * Deux conditions, pas une
 * ---------------------------------------------------------------------------
 * C'est là que la leçon se joue, et l'erreur classique est de n'en retenir
 * qu'une. Une situation est proportionnelle si, et seulement si :
 *
 *   1. les points sont ALIGNÉS — le tracé qui les relie ne fait aucun coude ;
 *   2. et la droite PASSE PAR L'ORIGINE.
 *
 * La situation du taxi est là pour ça : 5 € de prise en charge puis 2 € par
 * kilomètre donne des points parfaitement alignés, et pourtant rien n'est
 * proportionnel — la droite coupe l'axe vertical à 5, pas à 0. Payer 0 km ne
 * coûte pas 0 €. L'animation prolonge donc toujours le tracé jusqu'à l'axe
 * vertical, et montre où il tombe : c'est ce prolongement qui tranche.
 *
 * La situation du carré fait tomber l'autre condition : les points montent de
 * plus en plus vite, le tracé est courbe, aucune droite ne les contient.
 *
 * ---------------------------------------------------------------------------
 * Le tableau répond aussi, et il doit dire la même chose
 * ---------------------------------------------------------------------------
 * La colonne des quotients \(y \div x\) apparaît à la fin : constants pour les
 * situations proportionnelles — c'est le coefficient —, variables pour les
 * deux autres. Les deux lectures, celle du tableau et celle du graphique, sont
 * mises face à face pour qu'on voie qu'elles disent la même chose : le
 * coefficient est aussi ce qui donne sa pente à la droite.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est calculé
 * ---------------------------------------------------------------------------
 * Rien n'est déclaré : la leçon ne sait pas d'avance quelle situation est
 * proportionnelle. `alignes()` et `parOrigine()` le décident à partir des seuls
 * couples, par des produits en croix — jamais par des divisions, dont les
 * arrondis feraient mentir la comparaison. Le verdict affiché, le prolongement
 * tracé et la couleur du tableau en découlent tous.
 */
MathsView.register({
  id: 'proportionnalite-graphique',
  title: 'Reconnaître la proportionnalité : tableau et graphique',
  level: '5eme',
  category: 'calcul',
  subcategory: 'Proportionnalité',
  theme: 'Proportionnalité — reconnaître une situation par un tableau ou un graphique',
  description:
    'Chaque <strong>ligne du tableau</strong> donne deux nombres : ils deviennent ' +
    'l\'<strong>abscisse</strong> et l\'<strong>ordonnée</strong> d\'un <strong>point</strong>. ' +
    'L\'animation reporte les lignes une à une, en pointillés depuis les axes, puis ' +
    '<strong>relie les points</strong>.' +
    '<br>La situation est proportionnelle à <strong>deux conditions</strong> : les points ' +
    'sont <strong>alignés</strong>, <em>et</em> la droite <strong>passe par l\'origine</strong>. ' +
    'Les deux, pas une seule — c\'est là que se joue la leçon. Le tracé est donc toujours ' +
    '<strong>prolongé jusqu\'à l\'axe vertical</strong> : là où il tombe, on tranche.' +
    '<br><strong>Choisis une situation</strong> : le taxi donne des points parfaitement ' +
    'alignés sans être proportionnel, le carré des points qui ne s\'alignent pas. La colonne ' +
    'des <strong>quotients</strong> montre que le tableau dit la même chose que le dessin.',
  notes:
    '<ul>' +
    '<li><strong>Une ligne du tableau, un point du graphique.</strong> Le premier nombre se ' +
    'lit sur l\'axe horizontal, le second sur l\'axe vertical. Reporter un tableau, c\'est ' +
    'poser autant de points qu\'il y a de lignes.</li>' +
    '<li><strong>La reconnaissance graphique.</strong> Une situation est proportionnelle ' +
    '<em>si et seulement si</em> les points sont <strong>alignés avec l\'origine</strong> — ' +
    'autrement dit s\'ils sont sur une <strong>droite passant par le point</strong> ' +
    '\\(O(0\\,;\\,0)\\).</li>' +
    '<li><strong>Alignés ne suffit pas.</strong> Un taxi qui prend 5 € puis 2 € par ' +
    'kilomètre donne des points alignés : 1 km → 7 €, 3 km → 11 €, 5 km → 15 €. Mais la ' +
    'droite coupe l\'axe vertical en 5, pas en 0, et les quotients ne sont pas égaux ' +
    '(\\(7\\), puis \\(\\frac{11}{3}\\), puis \\(3\\)). Ce n\'est <em>pas</em> ' +
    'proportionnel : sans le prolongement jusqu\'à l\'axe, on se trompe.</li>' +
    '<li><strong>Le test de l\'origine se comprend.</strong> Dans une situation ' +
    'proportionnelle, 0 donne toujours 0 : zéro cahier coûte zéro euro. Le point ' +
    '\\((0\\,;\\,0)\\) fait donc partie de la situation, et la droite doit y passer.</li>' +
    '<li><strong>La reconnaissance par le tableau.</strong> On divise chaque valeur de la ' +
    'seconde colonne par celle de la première. Si tous les quotients sont <strong>égaux</strong>, ' +
    'c\'est proportionnel, et ce quotient commun est le <strong>coefficient de ' +
    'proportionnalité</strong> \\(k\\) : on passe alors de \\(x\\) à \\(y\\) en ' +
    '<strong>multipliant par \\(k\\)</strong>.</li>' +
    '<li><strong>Un seul contre-exemple suffit.</strong> Pour prouver qu\'une situation ' +
    'n\'est <em>pas</em> proportionnelle, il suffit de deux quotients différents — ou d\'un ' +
    'point hors de la droite. Pour prouver qu\'elle l\'est, il faut les vérifier ' +
    '<em>tous</em>.</li>' +
    '<li><strong>Le coefficient se lit sur le dessin.</strong> Quand la droite passe par ' +
    'l\'origine, avancer de 1 vers la droite fait monter de \\(k\\). Le coefficient du ' +
    'tableau et la pente de la droite sont le même nombre.</li>' +
    '<li><strong>Attention aux échelles.</strong> Les deux axes n\'ont pas forcément la même ' +
    'unité — ici l\'axe vertical est gradué de 2 en 2. Cela change l\'inclinaison de la ' +
    'droite à l\'œil, mais ni les points, ni le verdict.</li>' +
    '</ul>',
  board: { boundingbox: [-1.9, 23.6, 9.5, -3.6], axis: true, keepaspectratio: false,
           /* L'axe vertical monte à 21 : gradué de 1 en 1, il serait illisible.
              `insertTicks: false` est indispensable — sans lui, JSXGraph
              recalcule le pas tout seul et ignore celui qu'on demande. */
           defaultAxes: { y: { ticks: { insertTicks: false, ticksDistance: 2 } } } },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var PT = '#dc2626';        // les points reportés du tableau
    var GUIDE = '#94a3b8';     // les pointillés qui vont des axes au point
    var JOINT = '#2563eb';     // le tracé qui relie les points
    var OUI = '#059669';       // le verdict quand c'est proportionnel
    var NON = '#ea580c';       // le verdict quand ça ne l'est pas

    var anim = mv.createAnimator();

    function show(o, v) {
      v = !!v;
      if (o.__vu === v) return;
      o.__vu = v;
      o.setAttribute({ visible: v });
    }
    function fr(v) {
      var r = Math.round(v * 1000) / 1000;
      return String(r).replace('.', ',').replace('-', '−');
    }
    /* Un quotient ne tombe pas toujours juste : 11 ÷ 3 n'est pas 3,667, et
       l'écrire avec un signe = enseignerait une contrevérité au moment précis
       où l'on demande à l'élève de comparer des quotients. On distingue donc
       les deux cas, et le signe le dit. */
    function quotient(y, x) {
      var q = y / x;
      var exact = Math.abs(q * 1000 - Math.round(q * 1000)) < 1e-9;
      return { v: q, exact: exact,
               signe: exact ? '=' : '≈',
               texte: exact ? fr(q) : fr(Math.round(q * 100) / 100) };
    }

    /* ==================================================================== */
    /* Les situations                                                       */
    /* ==================================================================== */
    /* Quatre situations, et surtout quatre CAS : proportionnel à coefficient
       entier, proportionnel à coefficient décimal, aligné sans passer par
       l'origine, et pas aligné du tout. Aucune n'annonce ce qu'elle est — le
       verdict se calcule plus bas à partir des seuls couples. */
    var SITUATIONS = [
      { nom: 'Des cahiers',
        phrase: 'Des cahiers identiques. On note le prix payé selon le nombre de cahiers.',
        gx: 'nombre de cahiers', gy: 'prix payé (€)', ux: '', uy: ' €',
        pts: [[1, 3], [2, 6], [4, 12], [7, 21]] },
      { nom: 'De l\'essence',
        phrase: 'On fait le plein. On note le prix payé selon le nombre de litres.',
        gx: 'nombre de litres', gy: 'prix payé (€)', ux: ' L', uy: ' €',
        pts: [[2, 3], [4, 6], [6, 9], [8, 12]] },
      { nom: 'Un taxi',
        phrase: 'Un taxi facture une prise en charge, puis un prix par kilomètre.',
        gx: 'distance (km)', gy: 'prix de la course (€)', ux: ' km', uy: ' €',
        pts: [[1, 7], [3, 11], [5, 15], [8, 21]] },
      { nom: 'Un carré',
        phrase: 'Des carrés de côtés différents. On note l\'aire selon le côté.',
        gx: 'côté (cm)', gy: 'aire (cm²)', ux: ' cm', uy: ' cm²',
        pts: [[1, 1], [2, 4], [3, 9], [4, 16]] }
    ];
    var MAXP = 4;                              // toutes en ont quatre
    var iS = 0;
    function S() { return SITUATIONS[iS]; }
    function P(i) { return S().pts[i]; }
    function n() { return S().pts.length; }

    /* ==================================================================== */
    /* Le verdict, calculé — jamais déclaré                                 */
    /* ==================================================================== */
    /* Par produits en croix, pour ne jamais comparer deux quotients arrondis.
       Alignés : le vecteur du premier point vers le i-ème est colinéaire au
       vecteur du premier vers le deuxième. */
    function alignes() {
      var a = P(0), b = P(1);
      for (var i = 2; i < n(); i++) {
        var c = P(i);
        if ((b[0] - a[0]) * (c[1] - a[1]) !== (b[1] - a[1]) * (c[0] - a[0])) return false;
      }
      return true;
    }
    /* Proportionnel : tous les quotients y ÷ x sont égaux, ce qui s'écrit sans
       division. C'est exactement « alignés ET la droite passe par l'origine »,
       puisque l'origine s'ajoute alors à la liste des points. */
    function proportionnel() {
      var a = P(0);
      if (a[0] === 0) return false;
      for (var i = 1; i < n(); i++) {
        if (P(i)[1] * a[0] !== a[1] * P(i)[0]) return false;
      }
      return true;
    }
    function coefficient() { return P(0)[1] / P(0)[0]; }

    /* L'ordonnée à laquelle le tracé coupe l'axe vertical : on prolonge le
       premier segment. C'est le geste que fait l'élève avec sa règle. */
    function pente() {
      return (P(1)[1] - P(0)[1]) / (P(1)[0] - P(0)[0]);
    }
    function ordonneeOrigine() { return P(0)[1] - pente() * P(0)[0]; }

    /* ==================================================================== */
    /* L'avancement                                                         */
    /* ==================================================================== */
    /* Tout l'écran se déduit de ces trois nombres : c'est ce qui rend le rejeu
       et le mode pas à pas fidèles, sans qu'aucune étape n'ait à défaire ce
       qu'une autre a fait. */
    var av = { pts: 0, joint: 0, prolonge: 0 };
    var voirQuotients = false;

    /* ==================================================================== */
    /* Le repère : les noms des grandeurs                                   */
    /* ==================================================================== */
    var nomX = board.create('text', [9.2, -1.5, function () { return S().gx; }], {
      fontSize: 13, color: '#475569', cssStyle: 'font-weight:700', fixed: true,
      anchorX: 'right', highlight: false });
    var nomY = board.create('text', [-1.7, 23.0, function () { return S().gy; }], {
      fontSize: 13, color: '#475569', cssStyle: 'font-weight:700', fixed: true,
      anchorX: 'left', highlight: false });

    /* ==================================================================== */
    /* Les points, et les pointillés qui les amènent                        */
    /* ==================================================================== */
    /* Chaque ligne du tableau se reporte en deux temps : on monte depuis l'axe
       horizontal, puis on file vers l'axe vertical. Le chemin est donc une
       équerre, parcourue de 0 à 2 — c'est le geste qu'on fait à la règle. */
    function progres(i) { return Math.max(0, Math.min(1, av.pts - i)); }

    function equerre(i) {
      function sommet(t) {
        var p = P(i);
        if (t <= 1) return [p[0], p[1] * t];                 // on monte
        return [p[0] * (2 - t), p[1]];                       // puis on va à gauche
      }
      return board.create('curve', [
        function (t) { return sommet(t)[0]; },
        function (t) { return sommet(t)[1]; },
        0, function () { return 2 * progres(i); }
      ], { numberPointsHigh: 3, numberPointsLow: 3, strokeColor: GUIDE, strokeWidth: 1.6,
           dash: 2, highlight: false, visible: false });
    }

    var equerres = [], points = [], etiquettes = [];
    for (var i = 0; i < MAXP; i++) {
      (function (i) {
        equerres.push(equerre(i));
        points.push(board.create('point', [
          function () { return P(i)[0]; },
          function () { return P(i)[1]; }
        ], { size: 4.5, color: PT, fixed: true, showInfobox: false, withLabel: false,
             highlight: false, visible: false }));
        etiquettes.push(board.create('text', [
          function () { return P(i)[0] + 0.18; },
          function () { return P(i)[1] + 0.9; },
          function () { return '(' + fr(P(i)[0]) + ' ; ' + fr(P(i)[1]) + ')'; }
        ], { fontSize: 12, color: PT, cssStyle: 'font-weight:700', fixed: true,
             highlight: false, visible: false }));
      })(i);
    }

    /* ==================================================================== */
    /* Le tracé qui relie les points                                        */
    /* ==================================================================== */
    /* Un segment par intervalle, chacun avec son propre avancement : le tracé
       se dessine d'un point au suivant, et surtout les coudes restent nets.
       Une seule courbe échantillonnée les aurait arrondis — or c'est justement
       le coude qui dit « pas alignés ». */
    var liens = [];
    for (i = 0; i < MAXP - 1; i++) {
      (function (i) {
        liens.push(board.create('curve', [
          function (t) { return P(i)[0] + (P(i + 1)[0] - P(i)[0]) * t; },
          function (t) { return P(i)[1] + (P(i + 1)[1] - P(i)[1]) * t; },
          0, function () {
            return Math.max(0, Math.min(1, av.joint * (n() - 1) - i));
          }
        ], { numberPointsHigh: 2, numberPointsLow: 2, strokeColor: JOINT, strokeWidth: 3,
             highlight: false, visible: false }));
      })(i);
    }

    /* ==================================================================== */
    /* Le prolongement jusqu'à l'axe vertical                               */
    /* ==================================================================== */
    /* On prolonge le premier segment vers la gauche, jusqu'à x = 0, et on
       marque le point d'arrivée. C'est ce trait-là qui tranche : s'il tombe sur
       l'origine, c'est proportionnel ; sinon, non — même si tout est aligné. */
    var prolonge = board.create('curve', [
      function (t) { return P(0)[0] * (1 - t * av.prolonge); },
      function (t) {
        var x = P(0)[0] * (1 - t * av.prolonge);
        return pente() * x + ordonneeOrigine();
      },
      0, 1
    ], { numberPointsHigh: 2, numberPointsLow: 2, strokeColor: JOINT, strokeWidth: 2.4,
         dash: 2, highlight: false, visible: false });

    var arrivee = board.create('point', [0, function () { return ordonneeOrigine(); }], {
      size: 5, color: NON, fixed: true, showInfobox: false, withLabel: false,
      highlight: false, visible: false });

    var marque = board.create('text', [0.4, function () { return ordonneeOrigine() + 1.4; },
      function () {
        var p = ordonneeOrigine();
        if (!alignes()) return 'le tracé n\'est pas droit';
        return p === 0 ? 'passe par l\'origine (0 ; 0)'
                       : 'coupe l\'axe en (0 ; ' + fr(p) + '), pas en 0';
      }], { fontSize: 13, cssStyle: 'font-weight:800', fixed: true, highlight: false,
            visible: false, color: NON });

    /* Quand c'est proportionnel, on montre d'où vient le coefficient : d'un pas
       de 1 vers la droite naît une montée de k. */
    var pasX = board.create('curve', [
      function (t) { return 5 + t; }, function () { return 5 * coefficient(); },
      0, 1
    ], { numberPointsHigh: 2, numberPointsLow: 2, strokeColor: OUI, strokeWidth: 2.4,
         highlight: false, visible: false });
    var pasY = board.create('curve', [
      function () { return 6; },
      function (t) { return 5 * coefficient() + t * coefficient(); }, 0, 1
    ], { numberPointsHigh: 2, numberPointsLow: 2, strokeColor: OUI, strokeWidth: 2.4,
         highlight: false, visible: false });
    var pasTxt = board.create('text', [6.25, function () { return 5.5 * coefficient(); },
      function () { return '+ ' + fr(coefficient()); }], {
      fontSize: 14, color: OUI, cssStyle: 'font-weight:800', fixed: true,
      highlight: false, visible: false });
    var pasTxt1 = board.create('text', [5.5, function () { return 5 * coefficient() - 1.5; },
      '+ 1'], { fontSize: 14, color: OUI, cssStyle: 'font-weight:800', fixed: true,
                anchorX: 'middle', highlight: false, visible: false });

    /* ==================================================================== */
    /* Le panneau : la situation, le tableau, le verdict                    */
    /* ==================================================================== */
    var panneau = document.createElement('div');
    panneau.className = 'prg-panneau';
    panneau.innerHTML =
      '<div class="prg-choix"></div>' +
      '<div class="prg-phrase"></div>' +
      '<div class="prg-table"></div>' +
      '<div class="prg-verdict"></div>';
    var elChoix = panneau.querySelector('.prg-choix');
    var elPhrase = panneau.querySelector('.prg-phrase');
    var elTable = panneau.querySelector('.prg-table');
    var elVerdict = panneau.querySelector('.prg-verdict');

    SITUATIONS.forEach(function (s, k) {
      var b = document.createElement('button');
      b.className = 'prg-bouton' + (k === 0 ? ' active' : '');
      b.innerHTML = s.nom;
      b.onclick = function () {
        iS = k;
        for (var j = 0; j < elChoix.children.length; j++) {
          elChoix.children[j].classList.toggle('active', j === k);
        }
        jouer();
      };
      elChoix.appendChild(b);
    });

    function rendrePanneau() {
      var s = S(), N = n();
      var h = '';

      // le tableau : une ligne par couple, allumée dès que son point est posé
      var quotients = voirQuotients || av.prolonge > 0.9;
      h += '<table class="prg-tab"><thead><tr><th>' + s.gx + '</th><th>' + s.gy + '</th>' +
           (quotients ? '<th>quotient</th>' : '') + '</tr></thead><tbody>';
      for (var i = 0; i < N; i++) {
        var faite = av.pts >= i + 1;
        var q = quotient(P(i)[1], P(i)[0]);
        h += '<tr class="' + (faite ? 'posee' : '') + '">' +
             '<td>' + fr(P(i)[0]) + s.ux + '</td>' +
             '<td>' + fr(P(i)[1]) + s.uy + '</td>' +
             (quotients ? '<td class="q">' + fr(P(i)[1]) + ' ÷ ' + fr(P(i)[0]) + ' ' +
                          q.signe + ' <b>' + q.texte + '</b></td>' : '') +
             '</tr>';
      }
      h += '</tbody></table>';

      if (quotients) {
        h += '<p class="prg-quot">' + (proportionnel()
          ? 'Les quotients sont <b>tous égaux</b> à <b>' + fr(coefficient()) + '</b> : le ' +
            'tableau dit la même chose que le dessin. C\'est le <b>coefficient de ' +
            'proportionnalité</b> — on passe de la première ligne à la seconde en ' +
            '<b>multipliant par ' + fr(coefficient()) + '</b>.'
          : 'Les quotients ne sont <b>pas tous égaux</b> — ' +
            quotient(P(0)[1], P(0)[0]).texte + ', puis ' +
            quotient(P(1)[1], P(1)[0]).texte + '. Deux quotients différents suffisent : ' +
            'ce n\'est pas proportionnel.') + '</p>';
      }
      if (elTable.innerHTML !== h) elTable.innerHTML = h;

      // le verdict, une fois le prolongement tracé
      var v = '';
      if (av.prolonge > 0.9) {
        var ali = alignes(), pro = proportionnel();
        v = '<div class="prg-bilan ' + (pro ? 'oui' : 'non') + '">';
        v += '<div class="prg-test">' + (ali ? '✔' : '✘') + ' Les points ' +
             (ali ? 'sont <b>alignés</b>'
                  : '<b>ne sont pas alignés</b> — le tracé fait des coudes') + '.</div>';
        v += '<div class="prg-test">' + (ali && pro ? '✔' : '✘') + ' La droite ' +
             (!ali ? 'n\'existe pas : il n\'y a pas de droite à prolonger'
                   : pro ? '<b>passe par l\'origine</b>'
                         : 'coupe l\'axe vertical en <b>' + fr(ordonneeOrigine()) +
                           '</b> : elle <b>ne passe pas par l\'origine</b>') + '.</div>';
        v += '<div class="prg-conclu">' + (pro
          ? 'Les deux conditions sont remplies : <b>c\'est une situation de ' +
            'proportionnalité</b>, de coefficient <b>' + fr(coefficient()) + '</b>.'
          : 'Il en manque une : <b>ce n\'est pas une situation de proportionnalité</b>.') +
          '</div>';
        if (ali && !pro) {
          v += '<div class="prg-piege">Attention — les points sont pourtant parfaitement ' +
               'alignés. L\'alignement <b>ne suffit pas</b> : ici, une valeur nulle en ' +
               'abscisse donnerait déjà <b>' + fr(ordonneeOrigine()) + '</b> en ordonnée, ' +
               'alors qu\'une situation proportionnelle donne toujours <b>0 pour 0</b>.</div>';
        }
        v += '</div>';
      }
      if (elVerdict.innerHTML !== v) elVerdict.innerHTML = v;

      if (elPhrase.innerHTML !== s.phrase) elPhrase.innerHTML = s.phrase;
    }

    /* ==================================================================== */
    /* Rafraîchissement                                                     */
    /* ==================================================================== */
    function rafraichir() {
      var N = n();
      equerres.forEach(function (e, i) { show(e, i < N && progres(i) > 0.02); });
      points.forEach(function (p, i) { show(p, i < N && progres(i) >= 1); });
      etiquettes.forEach(function (t, i) { show(t, i < N && progres(i) >= 1); });
      liens.forEach(function (l, i) {
        show(l, i < N - 1 && av.joint * (N - 1) > i);
      });
      /* Le trait, le point d'arrivée et sa légende passent au vert quand le
         prolongement tombe sur l'origine : la couleur est un verdict, elle doit
         donc être recalculée et non figée à la création. */
      var bon = alignes() && proportionnel();
      var teinte = bon ? OUI : NON;
      if (prolonge.__t !== teinte) {
        prolonge.__t = teinte;
        prolonge.setAttribute({ strokeColor: teinte });
        arrivee.setAttribute({ strokeColor: teinte, fillColor: teinte });
        marque.setAttribute({ color: teinte, strokeColor: teinte });
      }
      show(prolonge, av.prolonge > 0.02);
      show(arrivee, av.prolonge > 0.95);
      show(marque, av.prolonge > 0.95);

      var montrePas = av.prolonge > 0.95 && proportionnel();
      show(pasX, montrePas);
      show(pasY, montrePas);
      show(pasTxt, montrePas);
      show(pasTxt1, montrePas);

      rendrePanneau();
    }

    /* ==================================================================== */
    /* Animation                                                            */
    /* ==================================================================== */
    function effacer() {
      anim.cancel();
      av.pts = 0; av.joint = 0; av.prolonge = 0;
      board.update();
      rafraichir();
    }
    function tout() {
      anim.cancel();
      av.pts = MAXP; av.joint = 1; av.prolonge = 1;
      board.update();
      rafraichir();
    }
    function jouer() {
      effacer();
      var steps = [];
      for (var i = 0; i < n(); i++) {
        (function (i) {
          steps.push({ dur: 700, step: function (q) {
            av.pts = i + q; av.joint = 0; av.prolonge = 0; rafraichir();
          } });
        })(i);
      }
      steps.push({ dur: 900, step: function (q) {
        av.pts = MAXP; av.joint = q; av.prolonge = 0; rafraichir();
      } });
      steps.push({ dur: 900, step: function (q) {
        av.pts = MAXP; av.joint = 1; av.prolonge = q; rafraichir();
      } });
      anim.runSteps(steps, effacer);
    }

    /* ==================================================================== */
    /* Les commandes                                                        */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Reporter le tableau', onClick: jouer },
      { type: 'button', id: 'fin', label: '⏭ Voir le résultat', onClick: tout },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer },
      { type: 'checkbox', id: 'quot', label: 'Les quotients y ÷ x', checked: false,
        onChange: function (v) { voirQuotients = v; rafraichir(); } }
    ]);

    if (mv.extras) mv.extras.appendChild(panneau);
    jouer();
  }
});
