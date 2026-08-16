/*
 * Le vocabulaire des probabilités, sur des expériences concrètes (5ème).
 *
 * ---------------------------------------------------------------------------
 * Trois mots, et rien d'autre
 * ---------------------------------------------------------------------------
 * Toute la leçon tient dans trois mots qu'un élève confond régulièrement, faute
 * de les avoir vus se distinguer sur un exemple :
 *
 *   L'EXPÉRIENCE ALÉATOIRE, c'est l'action : lancer un dé. On ne peut pas
 *   prévoir ce qu'elle donnera, mais — et c'est le point — on connaît d'avance
 *   TOUT ce qu'elle peut donner. Le hasard n'est pas l'inconnu total.
 *
 *   L'ISSUE, c'est UN résultat possible : « 4 ». Une seule à la fois.
 *
 *   L'ÉVÉNEMENT, c'est une CONDITION, qui regroupe plusieurs issues :
 *   « obtenir un nombre pair » en contient trois. C'est la marche difficile —
 *   un événement n'est pas un résultat, c'est un paquet de résultats, et il est
 *   « réalisé » quand l'issue obtenue tombe dedans.
 *
 * L'animation les fait donc apparaître dans cet ordre, sur la même expérience :
 * on lance, on obtient une issue, on déroule toutes les issues possibles, puis
 * on colore celles que l'événement contient, et on regarde si l'issue obtenue
 * en fait partie.
 *
 * ---------------------------------------------------------------------------
 * Cinq expériences, et deux pièges volontaires
 * ---------------------------------------------------------------------------
 * Un dé, deux dés, une pièce, un tirage de loto, pierre-feuille-ciseaux. Elles
 * ne sont pas interchangeables : deux d'entre elles sont là pour défaire une
 * idée fausse.
 *
 *   DEUX DÉS, la somme. Onze issues — et elles ne sont PAS également
 *   probables. C'est la seule façon de couper court à « il y a onze issues,
 *   donc chacune a une chance sur onze » : le bouton « lancer 300 fois »
 *   dessine un toit, pas un plateau, et l'œil s'en souvient.
 *
 *   PIERRE-FEUILLE-CISEAUX. Les issues sont les NEUF mains possibles, pas les
 *   trois résultats. « Je gagne » est un événement qui en regroupe trois. C'est
 *   l'exemple où la distinction issue / événement se voit le mieux, parce que
 *   les deux niveaux existent en même temps.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est tiré, et quand
 * ---------------------------------------------------------------------------
 * Le lancer est tiré UNE FOIS, à la construction des étapes, à partir d'une
 * graine qui ne change qu'au bouton « 🎲 Relancer ». Sans cela, rejouer
 * l'animation donnerait un autre résultat que celui que les phrases
 * commentent — et le mode pas à pas, qui rejoue les étapes précédentes,
 * afficherait une issue différente à chaque image.
 */
MathsView.register({
  id: 'probabilites-vocabulaire',
  title: 'Le vocabulaire des probabilités : expérience, issue, événement',
  level: '5eme',
  category: 'donnees',
  subcategory: 'Probabilités',
  exercices: ['probabilites-vocabulaire'],
  theme: 'Probabilités — aborder le hasard et son vocabulaire sur des exemples concrets',
  description:
    'Une <strong>expérience aléatoire</strong>, c\'est une action dont on ne peut pas ' +
    'prévoir le résultat, mais dont on connaît <strong>tous les résultats possibles</strong>. ' +
    'Chacun de ces résultats est une <strong>issue</strong>.' +
    '<br>Un <strong>événement</strong> est une <em>condition</em> qui regroupe plusieurs ' +
    'issues — « obtenir un nombre pair » en contient trois. Il est <strong>réalisé</strong> ' +
    'quand l\'issue obtenue en fait partie. C\'est la marche à ne pas rater : un événement ' +
    'n\'est pas un résultat, c\'est un <strong>paquet</strong> de résultats.' +
    '<br><strong>Choisis une expérience</strong> — dé, pièce, loto, pierre-feuille-ciseaux — ' +
    'puis lance <strong>300 fois</strong> : les fréquences se stabilisent. Avec ' +
    '<strong>deux dés</strong>, elles ne se stabilisent pas toutes à la même hauteur, et ' +
    'c\'est tout l\'intérêt.',
  notes:
    '<ul>' +
    '<li><strong>Expérience aléatoire.</strong> Une action dont on <em>ne peut pas prévoir</em> ' +
    'le résultat, mais dont on connaît <em>tous</em> les résultats possibles. Lancer un dé ' +
    'en est une ; regarder l\'heure n\'en est pas une.</li>' +
    '<li><strong>Issue.</strong> Un des résultats possibles, et un seul. Les issues d\'un ' +
    'lancer de dé sont 1, 2, 3, 4, 5 et 6. Leur ensemble se note souvent entre accolades : ' +
    '\\(\\{1\\,;\\,2\\,;\\,3\\,;\\,4\\,;\\,5\\,;\\,6\\}\\).</li>' +
    '<li><strong>Événement.</strong> Une condition qui <strong>regroupe</strong> des issues. ' +
    '« Obtenir un nombre pair » regroupe 2, 4 et 6. On dit qu\'il est <strong>réalisé</strong> ' +
    'si l\'issue obtenue en fait partie. Un événement n\'est <em>pas</em> une issue : c\'est ' +
    'un paquet d\'issues.</li>' +
    '<li><strong>Événement certain, événement impossible.</strong> Celui qui contient ' +
    '<em>toutes</em> les issues est <strong>certain</strong> — « obtenir un nombre entre 1 ' +
    'et 6 ». Celui qui n\'en contient <em>aucune</em> est <strong>impossible</strong> — ' +
    '« obtenir 7 ». Ce sont les deux extrêmes, tout le reste est entre les deux.</li>' +
    '<li><strong>Attention : plusieurs issues peuvent donner le même « résultat ».</strong> ' +
    'À pierre-feuille-ciseaux, les issues sont les <em>neuf</em> mains possibles. ' +
    '« Je gagne » n\'est pas une issue, c\'est un événement qui en regroupe trois.</li>' +
    '<li><strong>Toutes les issues ne sont pas toujours aussi probables.</strong> Avec la ' +
    'somme de deux dés, il y a onze issues (de 2 à 12), et pourtant 7 sort bien plus souvent ' +
    'que 2 : il y a six façons de faire 7, une seule de faire 2. Compter les issues ne suffit ' +
    'donc <em>pas</em> à conclure.</li>' +
    '<li><strong>Ce que le hasard fait à la longue.</strong> Sur quelques lancers, tout ' +
    'peut arriver. Sur des centaines, les fréquences se rapprochent de valeurs stables : ' +
    'c\'est ce qu\'on appellera plus tard la <em>probabilité</em>. Lance 300 fois, puis ' +
    'recommence : les barres retombent à peu près au même endroit.</li>' +
    '</ul>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();          // leçon sans figure géométrique

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Les dessins                                                          */
    /* ==================================================================== */
    var ENCRE = '#1e293b', OR = '#f59e0b', BLEU = '#2563eb', VERT = '#059669';

    /* Un dé, avec ses vrais points : les positions sont celles d'un dé réel,
       et c'est ce qui le rend reconnaissable sans légende. */
    var POINTS = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [2, 0], [0, 2], [2, 2]],
      5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
      6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]]
    };
    function de(n, t, couleur) {
      var r = Math.max(2, t * 0.09);
      var s = ['<svg width="' + t + '" height="' + t + '" viewBox="0 0 60 60" ' +
        'style="display:block">' +
        '<rect x="2" y="2" width="56" height="56" rx="10" fill="#fff" stroke="' +
        (couleur || ENCRE) + '" stroke-width="3"/>'];
      (POINTS[n] || []).forEach(function (p) {
        s.push('<circle cx="' + (14 + p[0] * 16) + '" cy="' + (14 + p[1] * 16) +
               '" r="5.4" fill="' + (couleur || ENCRE) + '"/>');
      });
      return s.join('') + '</svg>';
    }
    /* Une pièce : le côté s'écrit en toutes lettres, un dessin de profil ne se
       distinguerait pas de l'autre face. */
    function piece(cote, t) {
      return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 60 60" ' +
        'style="display:block"><circle cx="30" cy="30" r="26" fill="#fef3c7" stroke="' +
        OR + '" stroke-width="3"/><text x="30" y="39" text-anchor="middle" font-size="26" ' +
        'font-weight="800" font-family="system-ui, sans-serif" fill="#92400e">' +
        (cote === 'P' ? 'P' : 'F') + '</text></svg>';
    }
    function boule(n, t) {
      return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 60 60" ' +
        'style="display:block"><circle cx="30" cy="30" r="26" fill="#dbeafe" stroke="' +
        BLEU + '" stroke-width="3"/><text x="30" y="39" text-anchor="middle" font-size="' +
        (n > 9 ? 22 : 26) + '" font-weight="800" font-family="system-ui, sans-serif" fill="#1e3a8a">' +
        n + '</text></svg>';
    }
    /* Les trois mains : une forme franche vaut mieux qu'un dessin réaliste
       minuscule — un poing fermé, une feuille rectangulaire, deux lames en V. */
    function main(k, t) {
      var d = '';
      if (k === 'P') d = '<circle cx="30" cy="31" r="17" fill="#fecaca" stroke="#b91c1c" ' +
        'stroke-width="3"/>';
      else if (k === 'F') d = '<rect x="12" y="13" width="36" height="36" rx="4" ' +
        'fill="#dbeafe" stroke="#1d4ed8" stroke-width="3"/>';
      else d = '<path d="M 16 14 L 34 42 M 44 14 L 26 42" stroke="#047857" stroke-width="5" ' +
        'stroke-linecap="round" fill="none"/><circle cx="30" cy="48" r="5" fill="none" ' +
        'stroke="#047857" stroke-width="3"/>';
      return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 60 60" ' +
        'style="display:block">' + d + '</svg>';
    }
    function cote(txt) {
      return '<div class="prb-legende">' + txt + '</div>';
    }

    /* ==================================================================== */
    /* Les expériences                                                      */
    /* ==================================================================== */
    /* Chacune sait : s'annoncer, tirer une issue, énumérer TOUTES ses issues,
       en dessiner une, et proposer des événements. L'animation ne connaît
       qu'elle — elle ne sait rien des dés ni des pièces. */
    var EXPERIENCES = [
      {
        nom: 'Un dé',
        dit: 'On lance un <b>dé à six faces</b> et on regarde le nombre obtenu.',
        issues: ['1', '2', '3', '4', '5', '6'],
        tire: function (rnd) { return { cle: String(rnd.entier(1, 6)) }; },
        dessine: function (c, t) { return de(+c, t); },
        scene: function (c, t) { return de(+c, t); },
        evenements: [
          { nom: 'obtenir un nombre pair', a: ['2', '4', '6'] },
          { nom: 'obtenir au moins 5', a: ['5', '6'] },
          { nom: 'obtenir un multiple de 3', a: ['3', '6'] },
          { nom: 'obtenir un nombre plus petit que 3', a: ['1', '2'] }
        ],
        certain: 'obtenir un nombre entre 1 et 6',
        impossible: 'obtenir 7'
      },
      {
        nom: 'Deux dés',
        dit: 'On lance <b>deux dés</b> et on s\'intéresse à la <b>somme</b> des deux nombres.',
        issues: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        // le tirage passe par les DEUX dés : c'est ce qui rend les sommes
        // inégalement fréquentes, et il ne faut surtout pas tirer la somme
        /* On tire les DEUX dés, jamais la somme : c'est ce qui rend les
           sommes inégalement fréquentes. Et le détail repart avec le
           résultat plutôt que d'être rangé sur l'expérience — un compteur de
           300 lancers écraserait sinon les dés que la scène doit montrer. */
        tire: function (rnd) {
          var a = rnd.entier(1, 6), b = rnd.entier(1, 6);
          return { cle: String(a + b), detail: [a, b] };
        },
        dessine: function (c, t) {
          return '<div class="prb-somme" style="font-size:' + Math.round(t * 0.62) +
                 'px">' + c + '</div>';
        },
        scene: function (c, t, detail) {
          var d = detail || [1, 1];
          return '<div class="prb-paire">' + de(d[0], t) + de(d[1], t) +
                 '<div class="prb-egal">=</div>' +
                 '<div class="prb-somme" style="font-size:' + Math.round(t * 0.7) + 'px">' +
                 c + '</div></div>';
        },
        evenements: [
          { nom: 'obtenir 7', a: ['7'] },
          { nom: 'obtenir une somme paire', a: ['2', '4', '6', '8', '10', '12'] },
          { nom: 'obtenir au moins 10', a: ['10', '11', '12'] }
        ],
        certain: 'obtenir une somme entre 2 et 12',
        impossible: 'obtenir 1',
        inegal: 'Attention : ces onze issues ne sont <b>pas</b> également probables. Il y a ' +
          '<b>six</b> façons de faire 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1) et une <b>seule</b> ' +
          'de faire 2. Compter les issues ne suffit donc pas.'
      },
      {
        nom: 'Une pièce',
        dit: 'On lance une <b>pièce</b> et on regarde le côté obtenu.',
        issues: ['P', 'F'],
        tire: function (rnd) { return { cle: rnd.booleen() ? 'P' : 'F' }; },
        dessine: function (c, t) { return piece(c, t) + cote(c === 'P' ? 'Pile' : 'Face'); },
        scene: function (c, t) { return piece(c, t) + cote(c === 'P' ? 'Pile' : 'Face'); },
        evenements: [
          { nom: 'obtenir Pile', a: ['P'] },
          { nom: 'obtenir Face', a: ['F'] }
        ],
        certain: 'obtenir Pile ou Face',
        impossible: 'obtenir la tranche'
      },
      {
        nom: 'Le loto',
        dit: 'On tire au sort une <b>boule</b> dans un sac qui en contient <b>vingt</b>, ' +
             'numérotées de 1 à 20.',
        issues: (function () {
          var t = [];
          for (var i = 1; i <= 20; i++) t.push(String(i));
          return t;
        })(),
        tire: function (rnd) { return { cle: String(rnd.entier(1, 20)) }; },
        dessine: function (c, t) { return boule(c, t); },
        scene: function (c, t) { return boule(c, t); },
        evenements: [
          { nom: 'obtenir un numéro pair',
            a: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20'] },
          { nom: 'obtenir un numéro à deux chiffres',
            a: ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'] },
          { nom: 'obtenir un multiple de 5', a: ['5', '10', '15', '20'] }
        ],
        certain: 'obtenir un numéro entre 1 et 20',
        impossible: 'obtenir 21'
      },
      {
        nom: 'Pierre-feuille-ciseaux',
        dit: 'Deux joueuses jouent <b>en même temps</b>. Une issue, c\'est le <b>couple</b> ' +
             'des deux mains — la tienne à gauche, la sienne à droite.',
        issues: ['PP', 'PF', 'PC', 'FP', 'FF', 'FC', 'CP', 'CF', 'CC'],
        tire: function (rnd) {
          return { cle: rnd.choix(['P', 'F', 'C']) + rnd.choix(['P', 'F', 'C']) };
        },
        dessine: function (c, t) {
          return '<div class="prb-mains">' + main(c[0], t) + main(c[1], t) + '</div>';
        },
        scene: function (c, t) {
          var noms = { P: 'Pierre', F: 'Feuille', C: 'Ciseaux' };
          return '<div class="prb-mains">' +
                 '<div>' + main(c[0], t) + cote(noms[c[0]]) + '</div>' +
                 '<div class="prb-contre">contre</div>' +
                 '<div>' + main(c[1], t) + cote(noms[c[1]]) + '</div></div>';
        },
        evenements: [
          { nom: 'je gagne', a: ['PC', 'FP', 'CF'] },
          { nom: 'je perds', a: ['CP', 'PF', 'FC'] },
          { nom: 'égalité', a: ['PP', 'FF', 'CC'] }
        ],
        certain: 'l\'une gagne, ou bien il y a égalité',
        impossible: 'les deux gagnent en même temps'
      }
    ];

    var iE = 0, iEvt = 0;
    function E() { return EXPERIENCES[iE]; }
    function evt() { return E().evenements[iEvt % E().evenements.length]; }

    /* La graine du lancer : elle ne bouge qu'au bouton « Relancer ». C'est ce
       qui permet à ▶ de rejouer EXACTEMENT le même lancer que celui que les
       phrases commentent. */
    var graine = 20260816;
    var issue = null, detail = null;

    /* ==================================================================== */
    /* Le panneau                                                           */
    /* ==================================================================== */
    var bloc = document.createElement('div');
    bloc.className = 'prb-bloc';
    bloc.innerHTML =
      '<div class="prb-choix"></div>' +
      '<div class="prb-dit"></div>' +
      '<div class="prb-scene"></div>' +
      '<div class="prb-univers"></div>' +
      '<div class="prb-evt"></div>' +
      '<div class="prb-freq"></div>' +
      '<div class="prb-etapes"></div>';
    var elChoix = bloc.querySelector('.prb-choix');
    var elDit = bloc.querySelector('.prb-dit');
    var elScene = bloc.querySelector('.prb-scene');
    var elUniv = bloc.querySelector('.prb-univers');
    var elEvt = bloc.querySelector('.prb-evt');
    var elFreq = bloc.querySelector('.prb-freq');
    var elEtapes = bloc.querySelector('.prb-etapes');

    EXPERIENCES.forEach(function (x, k) {
      var b = document.createElement('button');
      b.className = 'prb-bouton' + (k === 0 ? ' active' : '');
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

    function neuf() { return { n: 0, scene: 0, univers: 0, evt: 0, verdict: 0, extremes: 0 }; }
    function copie(e) {
      return { n: e.n, scene: e.scene, univers: e.univers, evt: e.evt,
               verdict: e.verdict, extremes: e.extremes };
    }
    function pas(dur, maj) {
      maj();
      var e = copie(cur);
      return { dur: dur, step: function (q) { rendre(e, q); } };
    }
    function dire(t) { cur.n = phrases.push(t); }

    function rendre(e, q) {
      var x = E(), av = (q === undefined ? 1 : q);

      // 1. la scène : au repos, puis le lancer, puis le résultat
      var hs = '';
      if (e.scene === 0) {
        hs = '<div class="prb-repos">' + x.dessine(x.issues[0], 66) + '</div>' +
             '<div class="prb-attente">on n\'a pas encore lancé</div>';
      } else if (e.scene === 1) {
        /* Pendant le lancer, on montre une issue qui défile — mais tirée du
           NUMÉRO D'IMAGE, pas du hasard : rejouer doit redonner exactement le
           même défilé, sinon le pas à pas serait incohérent. */
        var k = Math.floor(av * 11) % x.issues.length;
        hs = '<div class="prb-roule">' + x.dessine(x.issues[k], 66) + '</div>' +
             '<div class="prb-attente">on lance…</div>';
      } else {
        hs = '<div class="prb-obtenu">' + x.scene(issue, 66, detail) + '</div>' +
             '<div class="prb-attente">l\'issue obtenue</div>';
      }
      if (elScene.innerHTML !== hs) elScene.innerHTML = hs;

      // 2. l'univers : les issues apparaissent une à une
      var hu = '';
      if (e.univers) {
        var combien = e.univers === 1 ? Math.round(av * x.issues.length) : x.issues.length;
        var dansEvt = e.evt ? evt().a : [];
        hu = '<div class="prb-titre">Toutes les issues possibles</div><div class="prb-lot">' +
          x.issues.slice(0, combien).map(function (c) {
            var cls = 'prb-issue';
            if (e.evt && dansEvt.indexOf(c) >= 0) cls += ' dedans';
            if (e.verdict && c === issue) cls += ' obtenue';
            return '<div class="' + cls + '">' + x.dessine(c, 40) + '</div>';
          }).join('') + '</div>';
        if (combien >= x.issues.length) {
          hu += '<div class="prb-compte">Il y a <b>' + x.issues.length + '</b> issues.</div>';
        }
      }
      if (elUniv.innerHTML !== hu) elUniv.innerHTML = hu;

      // 3. l'événement, et s'il est réalisé
      var he = '';
      if (e.evt) {
        var ev = evt();
        var realise = ev.a.indexOf(issue) >= 0;
        he = '<div class="prb-evt-nom">Événement : « <b>' + ev.nom + '</b> »</div>' +
             '<div class="prb-evt-liste">Il regroupe <b>' + ev.a.length + '</b> issue' +
             (ev.a.length > 1 ? 's' : '') + ' sur ' + x.issues.length + '.</div>';
        if (e.verdict) {
          he += '<div class="prb-verdict ' + (realise ? 'oui' : 'non') + '">' +
            (realise
              ? '✔ L\'issue obtenue fait partie de l\'événement : il est <b>réalisé</b>.'
              : '✘ L\'issue obtenue n\'en fait pas partie : l\'événement n\'est ' +
                '<b>pas réalisé</b>.') + '</div>';
        }
        if (e.extremes) {
          he += '<div class="prb-extremes">' +
            '<div><b>Certain</b> — « ' + x.certain + ' » : il contient <b>toutes</b> les ' +
            'issues, il se réalise à tous les coups.</div>' +
            '<div><b>Impossible</b> — « ' + x.impossible + ' » : il n\'en contient ' +
            '<b>aucune</b>, il ne se réalise jamais.</div></div>';
        }
      }
      if (elEvt.innerHTML !== he) elEvt.innerHTML = he;

      // 4. les phrases
      var hp = phrases.slice(0, e.n).map(function (t) {
        return '<p class="prb-dit-p">' + t + '</p>';
      }).join('');
      if (elEtapes.innerHTML !== hp) {
        elEtapes.innerHTML = hp;
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([elEtapes]);
      }
      if (elDit.innerHTML !== x.dit) elDit.innerHTML = x.dit;
    }

    /* ==================================================================== */
    /* Les fréquences : ce que le hasard fait à la longue                   */
    /* ==================================================================== */
    /* Hors de l'animation, et c'est voulu : ce n'est pas une étape du
       vocabulaire mais une observation, qu'on relance autant qu'on veut sans
       perdre le fil des définitions. */
    var freq = null;

    function lancerBeaucoup(n) {
      var x = E();
      var rnd = MathsAlea((graine ^ (0xbeef + n)) >>> 0);
      var c = {};
      x.issues.forEach(function (i) { c[i] = 0; });
      for (var k = 0; k < n; k++) {
        var i = x.tire(rnd).cle;
        if (c[i] === undefined) c[i] = 0;
        c[i]++;
      }
      freq = { n: n, c: c };
      rendreFreq();
    }

    function rendreFreq() {
      if (!freq) { if (elFreq.innerHTML !== '') elFreq.innerHTML = ''; return; }
      var x = E();
      var max = 1;
      x.issues.forEach(function (i) { max = Math.max(max, freq.c[i] || 0); });
      var h = '<div class="prb-titre">Sur <b>' + freq.n + '</b> lancers</div>' +
        '<div class="prb-barres">' +
        x.issues.map(function (i) {
          var v = freq.c[i] || 0;
          var pc = Math.round(v / freq.n * 1000) / 10;
          return '<div class="prb-col">' +
            '<div class="prb-pc">' + String(pc).replace('.', ',') + ' %</div>' +
            '<div class="prb-tige"><div class="prb-rempli" style="height:' +
              Math.round(v / max * 100) + '%"></div></div>' +
            '<div class="prb-etiq">' + x.dessine(i, 26) + '</div></div>';
        }).join('') + '</div>';
      h += '<div class="prb-note">' + (x.inegal
        ? x.inegal
        : 'Les ' + x.issues.length + ' issues se partagent les lancers à peu près à ' +
          'égalité. Relance : les barres retombent au même endroit — c\'est ce qu\'on ' +
          'appellera plus tard la <b>probabilité</b>.') + '</div>';
      if (elFreq.innerHTML !== h) elFreq.innerHTML = h;
    }

    /* ==================================================================== */
    /* Construction des étapes                                              */
    /* ==================================================================== */
    function construire() {
      phrases = [];
      cur = neuf();
      var x = E();
      // LE tirage de la séquence : une seule fois, ici
      var t = x.tire(MathsAlea(graine));
      issue = t.cle; detail = t.detail || null;
      var ev = evt();
      var realise = ev.a.indexOf(issue) >= 0;
      var steps = [];

      steps.push(pas(700, function () {
        cur.scene = 0;
        dire(x.dit + ' Avant de lancer, <b>personne ne peut prédire</b> ce qu\'on va ' +
             'obtenir : c\'est une <b>expérience aléatoire</b>.');
      }));

      steps.push(pas(1100, function () {
        cur.scene = 1;
      }));

      steps.push(pas(800, function () {
        cur.scene = 2;
        dire('On a obtenu ceci. Ce résultat s\'appelle une <b>issue</b> de l\'expérience — ' +
             '<b>un</b> résultat possible, un seul.');
      }));

      steps.push(pas(1200, function () {
        cur.univers = 1;
        dire('On ne pouvait pas prévoir <b>laquelle</b>, mais on connaissait d\'avance ' +
             '<b>toutes celles qui pouvaient sortir</b>. Les voici : c\'est ce qui distingue ' +
             'le hasard de l\'inconnu.');
      }));

      steps.push(pas(900, function () {
        cur.univers = 2;
        cur.evt = 1;
        dire('Un <b>événement</b>, ce n\'est pas un résultat : c\'est une <b>condition</b>, ' +
             'qui <b>regroupe</b> plusieurs issues. Ici « ' + ev.nom + ' » en regroupe <b>' +
             ev.a.length + '</b>, mises en évidence.');
      }));

      steps.push(pas(900, function () {
        cur.verdict = 1;
        dire('L\'événement est <b>réalisé</b> quand l\'issue obtenue en fait partie. ' +
             (realise
               ? 'C\'est le cas ici : « ' + ev.nom + ' » est réalisé.'
               : 'Ce n\'est pas le cas ici : « ' + ev.nom + ' » n\'est pas réalisé.') +
             ' Sur un autre lancer, ce serait peut-être l\'inverse.');
      }));

      steps.push(pas(900, function () {
        cur.extremes = 1;
        dire('Deux événements sont à part : celui qui contient <b>toutes</b> les issues est ' +
             '<b>certain</b>, celui qui n\'en contient <b>aucune</b> est <b>impossible</b>. ' +
             'Tous les autres sont entre les deux.');
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
    function tout() {
      anim.cancel();
      var steps = construire();
      steps.forEach(function (s) { s.step(1); });
      rendreFreq();
    }

    /* ==================================================================== */
    /* Les commandes                                                        */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Rejouer', onClick: jouer },
      { type: 'button', id: 'relancer', label: '🎲 Relancer le sort', onClick: function () {
          // une graine nulle rendrait le générateur constant
          graine = ((graine * 1103515245 + 12345) >>> 0) || 12345;
          jouer();
        } },
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
