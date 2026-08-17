/*
 * Attribuer des probabilités dans des cas simples : l'équiprobabilité (5ème).
 *
 * ---------------------------------------------------------------------------
 * La question à laquelle cette leçon répond
 * ---------------------------------------------------------------------------
 * « 1/6 pour chaque face du dé, 1/2 pour pile ou face. » Ces nombres sont
 * donnés partout et presque jamais justifiés. On les retient comme une règle de
 * plus — et le jour où il y a onze sommes possibles avec deux dés, on écrit
 * 1/11. C'est exactement la même règle, appliquée là où elle ne vaut plus.
 *
 * Le raisonnement tient pourtant en trois phrases, et il est entièrement
 * visuel :
 *
 *   1. À chaque lancer, il sort une issue, et UNE SEULE. « Il sort quelque
 *      chose » est donc certain, et une certitude vaut 1 (100 %).
 *   2. Rien ne distingue les six faces : même forme, même taille, même poids.
 *      Le partage de cette certitude se fait donc en parts ÉGALES.
 *   3. Six parts égales dont la somme fait 1 : chacune vaut 1/6. Aucune autre
 *      valeur n'est possible.
 *
 * L'animation EST ce raisonnement, dans cet ordre : une barre pleine qui vaut
 * 1, puis les traits de coupe qui tombent un par un, puis l'étiquette 1/6 sous
 * chaque morceau, puis la vérification 6 × 1/6 = 1. Un événement, ensuite, ne
 * fait que RAMASSER ses parts — d'où « favorables sur possibles », qui n'est
 * pas une formule à apprendre mais le résumé de ce qu'on vient de voir.
 *
 * ---------------------------------------------------------------------------
 * Pourquoi ces cinq expériences
 * ---------------------------------------------------------------------------
 * Chacune apporte une raison DIFFÉRENTE d'être équiprobable, parce que c'est
 * cette raison — et non le comptage — qui autorise le partage égal :
 *
 *   LE DÉ, par la fabrication : six faces identiques, aucune plus lourde.
 *   LA PIÈCE, par la symétrie : les deux côtés jouent le même rôle.
 *   LA ROUE, par la géométrie : huit secteurs de 45°, la flèche n'a pas plus
 *   de place pour s'arrêter sur l'un que sur l'autre. C'est ici que « parts
 *   égales » se voit littéralement, avant même qu'on parle de probabilité.
 *   LE SAC DE JETONS, par l'indiscernabilité : dix jetons de même taille, tirés
 *   sans regarder. Et c'est le seul endroit où les issues ne sont PAS les
 *   catégories qu'on regarde : les jetons se valent, les couleurs non — il y a
 *   quatre rouges pour un seul jaune. P(rouge) = 4/10, et l'écart entre les dix
 *   parts égales et les quatre qu'on ramasse est tout le contenu de la règle.
 *
 *   DEUX DÉS, enfin, comme contre-exemple : onze sommes, et surtout PAS 1/11.
 *   L'animation montre d'abord ce partage-là, barré, puis redescend jusqu'aux
 *   36 couples de dés — eux se valent, par le même argument que le dé seul — et
 *   les regroupe par somme. 7 en rassemble six (6/36 = 1/6), 2 un seul (1/36).
 *   Sans ce cinquième cas, la leçon apprendrait à diviser par le nombre
 *   d'issues, ce qui est précisément l'erreur.
 *
 * ---------------------------------------------------------------------------
 * Ce qui n'est écrit nulle part à la main
 * ---------------------------------------------------------------------------
 * Les poids des sommes (1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1) sont obtenus en
 * ÉNUMÉRANT les 36 couples, jamais recopiés ; les probabilités affichées sont
 * calculées à partir de ces poids ; le nombre d'issues favorables d'un
 * événement est la somme des poids de ses issues. Un chiffre écrit de travers
 * rendrait la leçon fausse sans que rien ne le signale — et une leçon sur le
 * hasard ne peut pas être contredite par le calcul d'une élève.
 *
 * Le bouton « 300 lancers » est là pour confronter l'annonce à la réalité : la
 * barre observée doit venir se poser sur le trait pointillé de la probabilité
 * annoncée. C'est aussi ce que le contrôle vérifie, en moyenne sur de
 * nombreuses séries.
 */
MathsView.register({
  id: 'probabilites-equiprobabilite',
  title: 'Attribuer des probabilités : pourquoi 1/6 pour chaque face',
  level: '5eme',
  category: 'donnees',
  subcategory: 'Probabilités',
  exercices: ['probabilites-equiprobabilite'],
  theme: 'Probabilités — d\'où viennent 1/6, 1/2, 1/8 : partager la certitude en parts égales',
  description:
    'À chaque lancer, il sort une issue et <strong>une seule</strong> : « il sort quelque ' +
    'chose » est <strong>certain</strong>, et une certitude vaut <strong>1</strong>. ' +
    'Attribuer des probabilités, c\'est <strong>partager ce 1</strong> entre les issues.' +
    '<br>Quand <strong>rien ne distingue</strong> les issues — six faces identiques, deux ' +
    'côtés de pièce, huit secteurs de même angle — le partage se fait en parts ' +
    '<strong>égales</strong> : les issues sont dites <strong>équiprobables</strong>. Six ' +
    'parts égales qui font 1, cela ne peut donner que <strong>1/6</strong> chacune. Voilà ' +
    'd\'où vient le nombre.' +
    '<br>Un <strong>événement</strong> ramasse ensuite les parts des issues qu\'il regroupe, ' +
    'd\'où <strong>P(A) = favorables ÷ possibles</strong>. Essaie enfin « <strong>Deux ' +
    'dés</strong> » : onze sommes, et pourtant surtout pas 1/11 — la règle a une condition, ' +
    'et c\'est là qu\'on la voit.',
  notes:
    '<ul>' +
    '<li><strong>Probabilité d\'une issue.</strong> Un nombre entre 0 et 1 qui dit quelle ' +
    '<em>part de la certitude</em> revient à cette issue. La somme des probabilités de ' +
    'toutes les issues vaut toujours <strong>1</strong> : à chaque expérience, il sort une ' +
    'issue et une seule.</li>' +
    '<li><strong>Équiprobabilité.</strong> Quand aucune issue n\'est privilégiée — dé ' +
    'équilibré, pièce non truquée, secteurs de même angle, jetons indiscernables — elles ' +
    'ont toutes la <em>même</em> probabilité. S\'il y a \\(n\\) issues équiprobables, ' +
    'chacune vaut \\(\\dfrac{1}{n}\\), puisque \\(n \\times \\dfrac{1}{n} = 1\\).</li>' +
    '<li><strong>Les cas de base.</strong> Un dé : \\(\\dfrac{1}{6} \\approx 16{,}7\\,\\%\\). ' +
    'Une pièce : \\(\\dfrac{1}{2} = 50\\,\\%\\). Une roue à huit secteurs égaux : ' +
    '\\(\\dfrac{1}{8} = 12{,}5\\,\\%\\). Dix jetons : \\(\\dfrac{1}{10} = 10\\,\\%\\).</li>' +
    '<li><strong>Probabilité d\'un événement (cas équiprobable).</strong> ' +
    '\\(P(A) = \\dfrac{\\text{nombre d\'issues favorables}}{\\text{nombre d\'issues ' +
    'possibles}}\\). « Obtenir un nombre pair » avec un dé : ' +
    '\\(\\dfrac{3}{6} = \\dfrac{1}{2}\\).</li>' +
    '<li><strong>Les deux extrêmes.</strong> Un événement <em>impossible</em> a pour ' +
    'probabilité <strong>0</strong>, un événement <em>certain</em> a pour probabilité ' +
    '<strong>1</strong>. Tous les autres sont entre les deux.</li>' +
    '<li><strong>La condition qu\'on oublie.</strong> La formule ne vaut que si les issues ' +
    'sont équiprobables. La somme de deux dés a onze issues, mais elles ne se valent pas : ' +
    'ce sont les <strong>36 couples</strong> de dés qui se valent. D\'où ' +
    '\\(P(7) = \\dfrac{6}{36} = \\dfrac{1}{6}\\) et \\(P(2) = \\dfrac{1}{36}\\).</li>' +
    '<li><strong>Ce que disent les lancers.</strong> Sur 300 lancers, la fréquence observée ' +
    'd\'une issue tourne autour de sa probabilité sans jamais tomber pile dessus. Plus on ' +
    'lance, plus elle s\'en approche : c\'est le lien entre le nombre annoncé et ce qui se ' +
    'passe vraiment.</li>' +
    '</ul>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();          // leçon sans figure géométrique

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Les dessins                                                          */
    /* ==================================================================== */
    /* Le dé et la pièce sont ceux de la leçon « Le vocabulaire des
       probabilités » : d'une leçon à l'autre, une élève doit reconnaître le
       même objet. */
    var ENCRE = '#1e293b', OR = '#f59e0b', BLEU = '#2563eb';

    var POINTS = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [2, 0], [0, 2], [2, 2]],
      5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
      6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]]
    };
    function de(n, t) {
      var s = ['<svg width="' + t + '" height="' + t + '" viewBox="0 0 60 60" ' +
        'style="display:block"><rect x="2" y="2" width="56" height="56" rx="10" ' +
        'fill="#fff" stroke="' + ENCRE + '" stroke-width="3"/>'];
      (POINTS[n] || []).forEach(function (p) {
        s.push('<circle cx="' + (14 + p[0] * 16) + '" cy="' + (14 + p[1] * 16) +
               '" r="5.4" fill="' + ENCRE + '"/>');
      });
      return s.join('') + '</svg>';
    }
    function piece(cote, t) {
      return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 60 60" ' +
        'style="display:block"><circle cx="30" cy="30" r="26" fill="#fef3c7" stroke="' +
        OR + '" stroke-width="3"/><text x="30" y="39" text-anchor="middle" font-size="26" ' +
        'font-weight="800" font-family="system-ui, sans-serif" fill="#92400e">' +
        (cote === 'P' ? 'P' : 'F') + '</text></svg>';
    }
    /* La roue : c'est le dessin où « parts égales » se voit AVANT qu'on parle
       de probabilité — huit secteurs de 45°, tracés, pas affirmés. */
    function roue(k, n, t) {
      function r(v) { return Math.round(v * 100) / 100; }
      var s = ['<svg width="' + t + '" height="' + t + '" viewBox="0 0 60 60" ' +
               'style="display:block">'];
      for (var i = 0; i < n; i++) {
        var a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n;
        s.push('<path d="M 30 30 L ' + r(30 + 26 * Math.cos(a0)) + ' ' +
          r(30 + 26 * Math.sin(a0)) + ' A 26 26 0 0 1 ' + r(30 + 26 * Math.cos(a1)) + ' ' +
          r(30 + 26 * Math.sin(a1)) + ' Z" fill="' + (i === k ? '#c7d2fe' : '#f8fafc') +
          '" stroke="' + BLEU + '" stroke-width="1.6"/>');
      }
      var am = -Math.PI / 2 + (k + 0.5) * 2 * Math.PI / n;
      s.push('<text x="' + r(30 + 16 * Math.cos(am)) + '" y="' + r(30 + 16 * Math.sin(am) + 5) +
        '" text-anchor="middle" font-size="15" font-weight="800" ' +
        'font-family="system-ui, sans-serif" fill="#1e3a8a">' + (k + 1) + '</text>');
      return s.join('') + '<circle cx="30" cy="30" r="3.5" fill="' + BLEU + '"/></svg>';
    }
    var TEINTES = {
      r: { fond: '#dc2626', texte: '#fff', nom: 'rouge' },
      b: { fond: '#2563eb', texte: '#fff', nom: 'bleu' },
      v: { fond: '#059669', texte: '#fff', nom: 'vert' },
      j: { fond: '#facc15', texte: '#78350f', nom: 'jaune' }
    };
    function jeton(n, coul, t) {
      var c = TEINTES[coul];
      return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 60 60" ' +
        'style="display:block"><circle cx="30" cy="30" r="25" fill="' + c.fond +
        '" stroke="#0f172a" stroke-width="2.5" stroke-opacity=".35"/>' +
        '<text x="30" y="39" text-anchor="middle" font-size="' + (n > 9 ? 22 : 26) +
        '" font-weight="800" font-family="system-ui, sans-serif" fill="' + c.texte + '">' +
        n + '</text></svg>';
    }
    function nombre(v, t) {
      return '<div class="eqp-nb" style="font-size:' + Math.round(t * 0.62) + 'px">' + v +
             '</div>';
    }

    /* ==================================================================== */
    /* Fractions, décimaux, pourcentages                                    */
    /* ==================================================================== */
    function pgcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a || 1; }
    function frac(n, d) {
      return '<span class="eqp-frac"><span class="eqp-h">' + n + '</span>' +
             '<span class="eqp-b">' + d + '</span></span>';
    }
    function reduite(n, d) { var g = pgcd(n, d); return { n: n / g, d: d / g }; }
    function pourcent(n, d) {
      return String(Math.round(n / d * 1000) / 10).replace('.', ',') + ' %';
    }
    /* « = » ou « ≈ » : 1/2 tombe juste, 1/6 non, et écrire « = 0,167 » serait
       faux. On teste l'exactitude au lieu de la deviner. */
    function decimal(n, d) {
      var f = reduite(n, d), r = f.d;
      while (r % 2 === 0) r /= 2;
      while (r % 5 === 0) r /= 5;
      return { exact: r === 1,
               txt: String(Math.round(n / d * 1000) / 1000).replace('.', ',') };
    }

    /* ==================================================================== */
    /* Les expériences                                                      */
    /* ==================================================================== */
    /* Chaque fiche porte SA raison d'être équiprobable : c'est elle qui
       autorise le partage égal, pas le comptage des issues. */
    var JETONS = ['r', 'r', 'r', 'r', 'b', 'b', 'b', 'v', 'v', 'j'];

    var EXPERIENCES = [
      {
        nom: 'Un dé',
        dit: 'On lance un <b>dé à six faces</b> et on note le nombre obtenu.',
        pourquoi: 'Le dé est bien <b>équilibré</b> : ses six faces ont la même forme, la ' +
          'même taille et le même poids. Aucune n\'a de raison de sortir plus souvent ' +
          'qu\'une autre.',
        issues: ['1', '2', '3', '4', '5', '6'],
        tire: function (rnd) { return String(rnd.entier(1, 6)); },
        dessine: function (c, t) { return de(+c, t); },
        evenements: [
          { nom: 'obtenir un nombre pair', a: ['2', '4', '6'] },
          { nom: 'obtenir 6', a: ['6'] },
          { nom: 'obtenir au moins 5', a: ['5', '6'] },
          { nom: 'obtenir un nombre plus petit que 5', a: ['1', '2', '3', '4'] }
        ]
      },
      {
        nom: 'Une pièce',
        dit: 'On lance une <b>pièce</b> et on note le côté obtenu.',
        pourquoi: 'La pièce n\'est pas truquée : ses deux côtés jouent exactement le ' +
          '<b>même rôle</b>. Rien ne la pousse à retomber d\'un côté plutôt que de l\'autre.',
        issues: ['P', 'F'],
        tire: function (rnd) { return rnd.booleen() ? 'P' : 'F'; },
        dessine: function (c, t) { return piece(c, t); },
        evenements: [
          { nom: 'obtenir Pile', a: ['P'] },
          { nom: 'obtenir Face', a: ['F'] }
        ]
      },
      {
        nom: 'La roue',
        dit: 'On fait tourner une <b>roue</b> partagée en <b>huit secteurs</b>, et on ' +
             'regarde sur lequel elle s\'arrête.',
        pourquoi: 'Les huit secteurs ont tous le <b>même angle</b> : 360° ÷ 8 = 45°. La ' +
          'roue n\'a pas plus de place pour s\'arrêter sur l\'un que sur l\'autre — les ' +
          'parts égales sont ici <b>dessinées</b>.',
        issues: ['1', '2', '3', '4', '5', '6', '7', '8'],
        tire: function (rnd) { return String(rnd.entier(1, 8)); },
        dessine: function (c, t) { return roue(+c - 1, 8, t); },
        evenements: [
          { nom: 'obtenir un numéro pair', a: ['2', '4', '6', '8'] },
          { nom: 'obtenir au moins 6', a: ['6', '7', '8'] },
          { nom: 'obtenir un multiple de 3', a: ['3', '6'] }
        ]
      },
      {
        nom: 'Le sac de jetons',
        dit: 'Un sac contient <b>dix jetons</b> — 4 rouges, 3 bleus, 2 verts, 1 jaune — et ' +
             'on en tire un <b>sans regarder</b>.',
        pourquoi: 'Les dix jetons ont la même taille et la même forme, et la main ne les ' +
          'voit pas : aucun n\'est favorisé. Attention, ce sont les <b>jetons</b> qui sont ' +
          'équiprobables, pas les <b>couleurs</b> — il y a quatre rouges pour un seul jaune.',
        issues: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        tire: function (rnd) { return String(rnd.entier(1, 10)); },
        dessine: function (c, t) { return jeton(+c, JETONS[+c - 1], t); },
        evenements: [
          { nom: 'tirer un jeton rouge', a: ['1', '2', '3', '4'] },
          { nom: 'tirer un jeton bleu', a: ['5', '6', '7'] },
          { nom: 'tirer un jeton vert ou jaune', a: ['8', '9', '10'] },
          { nom: 'ne pas tirer de rouge', a: ['5', '6', '7', '8', '9', '10'] }
        ]
      },
      {
        nom: 'Deux dés',
        equiprobable: false,
        dit: 'On lance <b>deux dés</b> et on s\'intéresse à la <b>somme</b> des deux nombres.',
        pourquoi: '',
        mot: { un: 'couple', pl: 'couples' },
        issues: (function () {
          var t = [];
          for (var s = 2; s <= 12; s++) t.push(String(s));
          return t;
        })(),
        /* Les poids ne sont PAS recopiés : on énumère les 36 couples. Un
           chiffre écrit de travers rendrait la leçon fausse en silence. */
        couples: (function () {
          var c = {};
          for (var a = 1; a <= 6; a++) {
            for (var b = 1; b <= 6; b++) {
              var s = a + b;
              (c[s] = c[s] || []).push([a, b]);
            }
          }
          return c;
        })(),
        // le tirage passe par les DEUX dés, jamais par la somme : c'est ce qui
        // rend les sommes inégalement fréquentes, et c'est tout le propos
        tire: function (rnd) { return String(rnd.entier(1, 6) + rnd.entier(1, 6)); },
        dessine: function (c, t) { return nombre(c, t); },
        evenements: [
          { nom: 'obtenir 7', a: ['7'] },
          { nom: 'obtenir une somme paire', a: ['2', '4', '6', '8', '10', '12'] },
          { nom: 'obtenir au moins 10', a: ['10', '11', '12'] }
        ]
      }
    ];

    /* Les poids par défaut : une part chacune. Pour « Deux dés », ils viennent
       du dénombrement des couples ci-dessus. */
    EXPERIENCES.forEach(function (x) {
      if (x.equiprobable === undefined) x.equiprobable = true;
      if (!x.mot) x.mot = { un: 'issue', pl: 'issues' };
      if (!x.poids) {
        x.poids = x.issues.map(function (c) {
          return x.couples ? x.couples[+c].length : 1;
        });
      }
      x.total = x.poids.reduce(function (a, b) { return a + b; }, 0);
    });

    var iE = 0, iEvt = 0;
    function E() { return EXPERIENCES[iE]; }
    function evt() { return E().evenements[iEvt % E().evenements.length]; }
    // le nombre de parts élémentaires qu'un événement ramasse
    function favorables(x, ev) {
      return ev.a.reduce(function (s, c) { return s + x.poids[x.issues.indexOf(c)]; }, 0);
    }

    /* ==================================================================== */
    /* Le panneau                                                           */
    /* ==================================================================== */
    var bloc = document.createElement('div');
    bloc.className = 'eqp-bloc';
    bloc.innerHTML =
      '<div class="eqp-choix"></div>' +
      '<div class="eqp-dit"></div>' +
      '<div class="eqp-lot-boite"></div>' +
      '<div class="eqp-faux"></div>' +
      '<div class="eqp-barre-boite"></div>' +
      '<div class="eqp-calc"></div>' +
      '<div class="eqp-freq"></div>' +
      '<div class="eqp-etapes"></div>';
    var elChoix = bloc.querySelector('.eqp-choix');
    var elDit = bloc.querySelector('.eqp-dit');
    var elLot = bloc.querySelector('.eqp-lot-boite');
    var elFaux = bloc.querySelector('.eqp-faux');
    var elBarre = bloc.querySelector('.eqp-barre-boite');
    var elCalc = bloc.querySelector('.eqp-calc');
    var elFreq = bloc.querySelector('.eqp-freq');
    var elEtapes = bloc.querySelector('.eqp-etapes');

    EXPERIENCES.forEach(function (x, k) {
      var b = document.createElement('button');
      b.className = 'eqp-bouton' + (k === 0 ? ' active' : '');
      b.innerHTML = x.nom;
      b.onclick = function () {
        iE = k; iEvt = 0;
        for (var j = 0; j < elChoix.children.length; j++) {
          elChoix.children[j].classList.toggle('active', j === k);
        }
        freq = null;
        jouer();
      };
      elChoix.appendChild(b);
    });

    /* ==================================================================== */
    /* L'animation : des états figés, jamais des ajouts au DOM              */
    /* ==================================================================== */
    var phrases = [];
    var cur;

    function neuf() {
      return { n: 0, lot: 0, faux: 0, barre: 0, groupe: 0, part: 0, evt: 0, regle: 0 };
    }
    function copie(e) {
      return { n: e.n, lot: e.lot, faux: e.faux, barre: e.barre, groupe: e.groupe,
               part: e.part, evt: e.evt, regle: e.regle };
    }
    function pas(dur, maj) {
      maj();
      var e = copie(cur);
      return { dur: dur, step: function (q) { rendre(e, q); } };
    }
    function dire(t) { cur.n = phrases.push(t); }

    function rendre(e, q) {
      var x = E(), av = (q === undefined ? 1 : q), tot = x.total, ev = evt();
      var dedans = e.evt ? ev.a : [];

      // ---- 1. l'énoncé de l'expérience --------------------------------
      if (elDit.innerHTML !== x.dit) elDit.innerHTML = x.dit;

      // ---- 2. les issues, avec leur probabilité une fois attribuée -----
      var hl = '';
      if (e.lot) {
        var combien = e.lot === 1 ? Math.round(av * x.issues.length) : x.issues.length;
        hl = '<div class="eqp-titre">Les issues possibles</div><div class="eqp-lot">' +
          x.issues.slice(0, combien).map(function (c, i) {
            return '<div class="eqp-issue' + (dedans.indexOf(c) >= 0 ? ' dedans' : '') + '">' +
              x.dessine(c, 42) +
              (e.part ? '<div class="eqp-proba">' + frac(x.poids[i], tot) + '</div>' : '') +
              '</div>';
          }).join('') + '</div>';
        if (combien >= x.issues.length) {
          hl += '<div class="eqp-compte">Il y a <b>' + x.issues.length + '</b> issues' +
            (x.equiprobable
              ? ', et rien ne permet d\'en privilégier une : elles sont <b>équiprobables</b>.'
              : ' — mais rien ne dit encore qu\'elles se valent.') + '</div>';
        }
      }
      if (elLot.innerHTML !== hl) elLot.innerHTML = hl;

      // ---- 3. le partage qu'on aimerait faire, et qui est faux ---------
      /* Uniquement pour « Deux dés » : montrer le mauvais partage AVANT le
         bon, c'est la seule façon de le désamorcer — sinon il reste la
         réponse spontanée. */
      var hf = '';
      if (e.faux) {
        hf = '<div class="eqp-faux-titre">Onze issues, donc ' + frac(1, x.issues.length) +
          ' chacune ?</div><div class="eqp-barre fausse">' +
          x.issues.map(function () {
            return '<div class="eqp-groupe" style="flex:1"><div class="eqp-cells">' +
                   '<div class="eqp-cell ouverte"></div></div></div>';
          }).join('') + '</div>' +
          '<div class="eqp-faux-non">✘ <b>Non.</b> Un partage en parts égales n\'est ' +
          'permis que si <b>rien ne distingue</b> les issues. Ici, quelque chose les ' +
          'distingue : il n\'y a qu\'<b>une</b> façon de faire 2 (1+1), et <b>six</b> de ' +
          'faire 7.</div>';
      }
      if (elFaux.innerHTML !== hf) elFaux.innerHTML = hf;

      // ---- 4. la barre : la certitude, puis ses parts ------------------
      var hb = '';
      if (e.barre === 1) {
        hb = '<div class="eqp-titre">La certitude</div>' +
          '<div class="eqp-barre"><div class="eqp-un">1 &nbsp;— il sort forcément quelque ' +
          'chose (100 %)</div></div>';
      } else if (e.barre >= 2) {
        var seuil = e.barre === 2 ? Math.round(av * tot) : tot;
        var j = 0;
        var corps = x.issues.map(function (c, i) {
          var p = x.poids[i], cellules = '';
          for (var k = 0; k < p; k++) {
            cellules += '<div class="eqp-cell' + (j < seuil ? ' ouverte' : '') + '"></div>';
            j++;
          }
          return '<div class="eqp-groupe' + (e.groupe ? ' groupee' : '') +
            (dedans.indexOf(c) >= 0 ? ' dedans' : '') + '" style="flex:' + p + '">' +
            '<div class="eqp-cells">' + cellules + '</div>' +
            (e.part && tot <= 12 ? '<div class="eqp-part-lab">' + frac(p, tot) + '</div>' : '') +
            '</div>';
        }).join('');
        hb = '<div class="eqp-titre">' + (x.equiprobable
              ? 'La certitude, partagée en parts égales'
              : 'Les ' + tot + ' couples de dés — <b>eux</b>, ils se valent') + '</div>' +
          '<div class="eqp-barre">' + corps + '</div>';
        if (e.part) {
          hb += '<div class="eqp-compte"><b>' + tot + '</b> parts égales, et ' + tot +
            ' × ' + frac(1, tot) + ' = 1.</div>';
        }
      }
      if (elBarre.innerHTML !== hb) elBarre.innerHTML = hb;

      // ---- 5. les calculs ---------------------------------------------
      var hc = '';
      if (e.part) {
        if (x.equiprobable) {
          var d = decimal(1, tot);
          hc += '<div class="eqp-ligne">' +
            (tot <= 8
              ? x.issues.map(function () { return frac(1, tot); }).join(' + ')
              : tot + ' × ' + frac(1, tot)) + ' = 1</div>';
          hc += '<div class="eqp-ligne forte">Chaque issue : ' + frac(1, tot) + ' ' +
            (d.exact ? '=' : '≈') + ' ' + d.txt + ' = ' + pourcent(1, tot) + '</div>';
        } else {
          hc += '<div class="eqp-ligne">Chaque couple vaut ' + frac(1, tot) +
            '. On regroupe alors les couples <b>par somme</b> :</div>' + tableauCouples(x);
        }
      }
      if (e.evt) {
        var f = favorables(x, ev), r = reduite(f, tot), dv = decimal(f, tot);
        hc += '<div class="eqp-evt">' +
          '<div class="eqp-evt-nom">Événement : « <b>' + ev.nom + '</b> »</div>' +
          '<div class="eqp-ligne"><b>' + f + '</b> ' + x.mot[f > 1 ? 'pl' : 'un'] +
          ' favorable' + (f > 1 ? 's' : '') + ' sur <b>' + tot + '</b> ' + x.mot.pl +
          ' possibles.</div>' +
          '<div class="eqp-ligne forte">P(« ' + ev.nom + ' ») = ' + frac(f, tot) +
          (r.d !== tot ? ' = ' + frac(r.n, r.d) : '') + ' ' +
          (dv.exact ? '=' : '≈') + ' ' + dv.txt + ' = ' + pourcent(f, tot) + '</div></div>';
      }
      if (e.regle) {
        hc += '<div class="eqp-regle"><div class="eqp-regle-f">P(A) = ' +
          frac('issues favorables', 'issues possibles') + '</div>' +
          '<div class="eqp-regle-c">… <b>à condition</b> que les issues soient ' +
          'équiprobables. Sans cette condition, la formule est fausse : essaie ' +
          '« Deux dés ».</div>' +
          '<div class="eqp-regle-c">Une probabilité est toujours comprise entre <b>0</b> ' +
          '(événement impossible) et <b>1</b> (événement certain), et la somme des ' +
          'probabilités de toutes les issues fait <b>1</b>.</div></div>';
      }
      if (elCalc.innerHTML !== hc) elCalc.innerHTML = hc;

      // ---- 6. les phrases ---------------------------------------------
      var hp = phrases.slice(0, e.n).map(function (t) {
        return '<p class="eqp-dit-p">' + t + '</p>';
      }).join('');
      if (elEtapes.innerHTML !== hp) {
        elEtapes.innerHTML = hp;
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([elEtapes]);
      }
    }

    /* Le récapitulatif des sommes : chaque ligne est reconstruite à partir des
       couples énumérés, y compris le total — qui doit retomber sur 1. */
    function tableauCouples(x) {
      var h = '<table class="eqp-tab"><tr><th>somme</th><th>couples qui la donnent</th>' +
        '<th>combien</th><th>probabilité</th></tr>';
      x.issues.forEach(function (c, i) {
        var liste = x.couples[+c].map(function (p) { return p[0] + '+' + p[1]; }).join(', ');
        var r = reduite(x.poids[i], x.total);
        h += '<tr><td><b>' + c + '</b></td><td class="eqp-menu">' + liste + '</td><td>' +
          x.poids[i] + '</td><td>' + frac(x.poids[i], x.total) +
          (r.d !== x.total ? ' = ' + frac(r.n, r.d) : '') + '</td></tr>';
      });
      h += '<tr class="eqp-total"><td>total</td><td class="eqp-menu">tous les couples</td>' +
        '<td>' + x.total + '</td><td>' + frac(x.total, x.total) + ' = 1</td></tr>';
      return h + '</table>';
    }

    /* ==================================================================== */
    /* Les fréquences : l'annonce confrontée aux lancers                    */
    /* ==================================================================== */
    var freq = null;
    var graine = 20260817, serie = 0;

    function lancerBeaucoup(n) {
      var x = E();
      serie++;
      var rnd = MathsAlea((graine + serie * 7919) >>> 0);
      var c = {};
      x.issues.forEach(function (i) { c[i] = 0; });
      for (var k = 0; k < n; k++) {
        var i = x.tire(rnd);
        if (c[i] === undefined) c[i] = 0;
        c[i]++;
      }
      freq = { n: n, c: c };
      rendreFreq();
    }

    function rendreFreq() {
      if (!freq) { if (elFreq.innerHTML !== '') elFreq.innerHTML = ''; return; }
      var x = E(), tot = x.total, max = 1;
      x.issues.forEach(function (i, k) {
        max = Math.max(max, (freq.c[i] || 0) / freq.n * 100, x.poids[k] / tot * 100);
      });
      var h = '<div class="eqp-titre">Sur <b>' + freq.n + '</b> lancers</div>' +
        '<div class="eqp-barres">' +
        x.issues.map(function (i, k) {
          var obs = (freq.c[i] || 0) / freq.n * 100, theo = x.poids[k] / tot * 100;
          return '<div class="eqp-col">' +
            '<div class="eqp-obs">' + String(Math.round(obs * 10) / 10).replace('.', ',') +
              ' %</div>' +
            '<div class="eqp-tige"><div class="eqp-rempli" style="height:' +
              Math.round(obs / max * 100) + '%"></div>' +
            '<div class="eqp-theo-trait" style="bottom:' + Math.round(theo / max * 100) +
              '%"></div></div>' +
            '<div class="eqp-etiq">' + x.dessine(i, 26) + '</div>' +
            '<div class="eqp-theo">' + String(Math.round(theo * 10) / 10).replace('.', ',') +
              ' %</div></div>';
        }).join('') + '</div>' +
        '<div class="eqp-note">En haut, la fréquence <b>observée</b> ; en bas et en ' +
        'pointillé, la probabilité <b>annoncée</b>. Les barres n\'y tombent jamais pile, ' +
        'mais elles s\'en approchent d\'autant plus qu\'on lance longtemps. Relance ' +
        'plusieurs fois : c\'est toujours autour du trait.</div>';
      if (elFreq.innerHTML !== h) elFreq.innerHTML = h;
    }

    /* ==================================================================== */
    /* Construction des étapes                                              */
    /* ==================================================================== */
    function construire() {
      phrases = [];
      cur = neuf();
      var x = E();
      return x.equiprobable ? etapesEgales(x) : etapesPiege(x);
    }

    /* Le raisonnement, dans l'ordre : une certitude, un partage égal, une part. */
    function etapesEgales(x) {
      var tot = x.total, ev = evt(), f = favorables(x, ev), r = reduite(f, tot);
      var d = decimal(1, tot), steps = [];

      steps.push(pas(800, function () {
        cur.lot = 1;
        dire(x.dit + ' ' + x.pourquoi + ' On dit que les issues sont ' +
             '<b>équiprobables</b> : elles ont toutes la <b>même</b> probabilité.');
      }));

      steps.push(pas(700, function () {
        cur.lot = 2;
        dire('Il y a <b>' + tot + '</b> issues, et on sait qu\'elles se valent. Reste à ' +
             'trouver <b>combien vaut chacune</b>.');
      }));

      steps.push(pas(700, function () {
        cur.barre = 1;
        dire('À chaque lancer, il sort une issue, et <b>une seule</b>. « Il sort quelque ' +
             'chose » est donc <b>certain</b> — et une certitude vaut <b>1</b>, ' +
             'c\'est-à-dire 100 %. La voici, en un seul morceau.');
      }));

      steps.push(pas(1300, function () {
        cur.barre = 2;
        dire('On <b>partage</b> ce 1 entre les ' + tot + ' issues. Comme aucune n\'est ' +
             'privilégiée, les parts sont <b>égales</b> : ni plus grandes, ni plus petites ' +
             'les unes que les autres.');
      }));

      steps.push(pas(900, function () {
        cur.barre = 3;
        cur.part = 1;
        dire('Chaque part vaut donc <b>1 ÷ ' + tot + '</b>. La probabilité de chaque issue ' +
             'est ' + frac(1, tot) + ' ' + (d.exact ? '=' : '≈') + ' ' + d.txt + ', soit ' +
             pourcent(1, tot) + '. Vérification : ' + tot + ' parts de ' + frac(1, tot) +
             ' refont bien 1.');
      }));

      steps.push(pas(900, function () {
        cur.evt = 1;
        dire('Un <b>événement</b> ramasse les parts des issues qu\'il regroupe. ' +
             '« ' + ev.nom + ' » en regroupe <b>' + f + '</b> : sa probabilité est ' +
             f + ' × ' + frac(1, tot) + ' = ' + frac(f, tot) +
             (r.d !== tot ? ' = ' + frac(r.n, r.d) : '') + '.');
      }));

      steps.push(pas(800, function () {
        cur.regle = 1;
        dire('D\'où la règle — qui ne fait que résumer ce qu\'on vient de voir : ' +
             '<b>P(A) = nombre d\'issues favorables ÷ nombre d\'issues possibles</b>. Elle ' +
             'ne vaut que si les issues sont équiprobables : c\'est là que tout se joue.');
      }));

      return steps;
    }

    /* Le contre-exemple : le partage égal proposé d'abord, barré ensuite, puis
       le vrai — celui des 36 couples. Sans le mauvais partage montré, il reste
       la réponse spontanée. */
    function etapesPiege(x) {
      var tot = x.total, ev = evt(), f = favorables(x, ev), r = reduite(f, tot);
      var steps = [];

      steps.push(pas(800, function () {
        cur.lot = 1;
        dire(x.dit + ' Les sommes possibles vont de <b>2</b> à <b>12</b>.');
      }));

      steps.push(pas(700, function () {
        cur.lot = 2;
        dire('Il y a <b>' + x.issues.length + '</b> issues. Tentation immédiate : partager ' +
             'la certitude en onze parts égales et annoncer ' + frac(1, x.issues.length) +
             ' pour chacune.');
      }));

      steps.push(pas(900, function () {
        cur.faux = 1;
        dire('C\'est <b>faux</b>, et c\'est l\'erreur la plus fréquente. Le partage en ' +
             'parts égales suppose que <b>rien ne distingue</b> les issues — or il y a une ' +
             'seule façon de faire 2, et six façons de faire 7. Ces sommes ne se valent ' +
             'pas.');
      }));

      steps.push(pas(1400, function () {
        cur.barre = 2;
        dire('On redescend donc jusqu\'à ce qui, <b>lui</b>, se vaut : les <b>' + tot +
             ' couples de dés</b>. Le premier dé a six faces égales, le second aussi : ' +
             '6 × 6 = ' + tot + ' couples équiprobables, par exactement le même argument ' +
             'que pour un dé seul.');
      }));

      steps.push(pas(1000, function () {
        cur.barre = 3;
        cur.groupe = 1;
        cur.part = 1;
        dire('Chaque couple vaut ' + frac(1, tot) + '. On les regroupe alors par somme : ' +
             '7 en rassemble <b>six</b>, donc ' + frac(6, tot) + ' = ' + frac(1, 6) +
             ' ; 2 n\'en rassemble qu\'<b>un</b>, donc ' + frac(1, tot) + '. Six fois moins.');
      }));

      steps.push(pas(900, function () {
        cur.evt = 1;
        dire('Un événement ramasse toujours ses parts — mais des parts <b>égales</b>, ici ' +
             'les couples. « ' + ev.nom + ' » en contient <b>' + f + '</b> sur ' + tot +
             ' : ' + frac(f, tot) + (r.d !== tot ? ' = ' + frac(r.n, r.d) : '') + '.');
      }));

      steps.push(pas(800, function () {
        cur.regle = 1;
        dire('À retenir : <b>compter les issues ne suffit pas</b>. Avant d\'écrire ' +
             frac(1, 'n') + ', il faut s\'assurer qu\'aucune issue n\'est privilégiée — ' +
             'sinon on redescend jusqu\'à des cas qui, eux, se valent.');
      }));

      return steps;
    }

    /* ==================================================================== */
    /* Animation                                                            */
    /* ==================================================================== */
    function effacer() {
      anim.cancel();
      cur = neuf();
      // surtout PAS phrases = [] : les étapes figées ne gardent qu'un indice
      // dans cette liste, et la vider rendrait le retour en arrière muet
      rendre(neuf());
    }
    function jouer() {
      anim.cancel();
      var steps = construire();
      rendreFreq();
      anim.runSteps(steps, effacer);
    }

    /* ==================================================================== */
    /* Les commandes                                                        */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Rejouer', onClick: jouer },
      { type: 'button', id: 'autreEvt', label: '↻ Un autre événement', onClick: function () {
          iEvt = (iEvt + 1) % E().evenements.length;
          jouer();
        } },
      { type: 'button', id: 'beaucoup', label: '📊 Lancer 300 fois', onClick: function () {
          lancerBeaucoup(300);
        } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () {
          freq = null;
          effacer();
          rendreFreq();
        } }
    ]);

    if (mv.extras) mv.extras.appendChild(bloc);
    jouer();
  }
});
