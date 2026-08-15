/*
 * Prendre une fraction, ou un pourcentage, d'une quantité (5ème).
 *
 * Leçon sans figure JSXGraph : tout est en HTML dans mv.extras — l'énoncé, une
 * barre dessinée en SVG, et le calcul écrit ligne à ligne — et le moteur
 * d'animation partagé fait avancer le raisonnement étape par étape.
 *
 * ---------------------------------------------------------------------------
 * Une seule idée, et deux gestes
 * ---------------------------------------------------------------------------
 * Prendre a/b d'une quantité N, c'est partager N en b parts égales puis en
 * prendre a. D'où les deux gestes, dans cet ordre :
 *
 *        N ÷ b   →  la valeur d'UNE part
 *        × a     →  la valeur de a parts
 *
 * La barre montre exactement cela : elle représente la quantité entière, on la
 * coupe en b, chaque part reçoit sa valeur, et l'on colorie les a premières.
 * Le calcul écrit et le dessin avancent ensemble, ligne par ligne.
 *
 * ---------------------------------------------------------------------------
 * Le pourcentage n'est pas un autre chapitre
 * ---------------------------------------------------------------------------
 * C'est le point que la leçon tient d'un bout à l'autre : t % , c'est la
 * fraction t/100, rien d'autre. On l'écrit, on la SIMPLIFIE — 30 % = 30/100 =
 * 3/10 — et l'on retombe sur le cas précédent, avec une barre en 10 parts au
 * lieu de 100. Un pourcentage ne demande donc aucune méthode nouvelle, et
 * c'est ce qu'on veut faire sentir plutôt que d'ajouter une recette.
 *
 * ---------------------------------------------------------------------------
 * Les deux ordres de calcul
 * ---------------------------------------------------------------------------
 * (N ÷ b) × a et (N × a) ÷ b donnent le même résultat. Le troisième cas de la
 * leçon est celui où la première division ne tombe pas ronde : on montre alors
 * les deux chemins côte à côte, et l'on constate qu'ils arrivent au même
 * nombre. Il n'y a pas un ordre juste et un faux, il y a un ordre commode.
 *
 * ---------------------------------------------------------------------------
 * Aucun flottant
 * ---------------------------------------------------------------------------
 * Les valeurs sont manipulées en CENTIÈMES, comme entiers. Une leçon sur les
 * pourcentages qui afficherait 14,399999999999999 aurait tout perdu ; les
 * énoncés sont d'ailleurs tirés de façon que chaque résultat s'écrive avec au
 * plus deux décimales.
 */
MathsView.register({
  id: 'fraction-pourcentage',
  title: 'Fraction et pourcentage d\'une quantité',
  level: '5eme',
  category: 'calcul',
  subcategory: 'Fractions',
  theme: 'Nombres — prendre une fraction ou un pourcentage d\'une quantité',
  exercices: ['fraction-pourcentage'],
  description:
    'Prendre \\( \\frac{2}{5} \\) de 30 élèves, ou 30 % d\'un prix de 48 €, c\'est le ' +
    '<strong>même geste</strong> : on partage la quantité en parts égales, et on en prend ' +
    'plusieurs. ' +
    '<br>Clique sur <strong>Lancer l\'animation</strong> : la barre représente la quantité ' +
    'entière, elle se coupe en parts, chaque part reçoit sa valeur, et le calcul s\'écrit en ' +
    'même temps. ' +
    '<br>Un <strong>pourcentage</strong> n\'est rien d\'autre qu\'une fraction de dénominateur ' +
    '100 : \\( 30\\,\\% = \\frac{30}{100} = \\frac{3}{10} \\). Il n\'y a donc pas de méthode ' +
    'nouvelle à apprendre.',
  notes:
    '<p><strong>Prendre une fraction d\'une quantité.</strong> ' +
    '\\( \\frac{a}{b} \\) de \\( N \\), c\'est partager \\( N \\) en \\( b \\) parts égales, ' +
    'puis en prendre \\( a \\) :</p>' +
    '<ul>' +
    '<li>\\( \\frac{a}{b} \\text{ de } N = (N \\div b) \\times a \\) — on cherche d\'abord la ' +
    'valeur d\'<strong>une</strong> part.</li>' +
    '<li>On peut aussi calculer \\( (N \\times a) \\div b \\) : c\'est le <strong>même ' +
    'résultat</strong>. On choisit l\'ordre où les nombres tombent le mieux.</li>' +
    '</ul>' +
    '<p><strong>Prendre un pourcentage.</strong> \\( t\\,\\% \\) veut dire \\( \\frac{t}{100} \\), ' +
    'c\'est-à-dire « \\( t \\) sur 100 ». Il n\'y a donc rien de nouveau :</p>' +
    '<ul>' +
    '<li>\\( 30\\,\\% \\text{ de } 48 = \\frac{30}{100} \\times 48 = \\frac{3}{10} \\times 48 ' +
    '= 14{,}4 \\)</li>' +
    '<li>Quelques-uns se reconnaissent d\'un coup d\'œil : ' +
    '\\( 50\\,\\% = \\frac{1}{2} \\), \\( 25\\,\\% = \\frac{1}{4} \\), ' +
    '\\( 75\\,\\% = \\frac{3}{4} \\), \\( 20\\,\\% = \\frac{1}{5} \\), et ' +
    '\\( 10\\,\\% \\), c\'est diviser par 10.</li>' +
    '</ul>' +
    '<p><strong>Attention au sens des mots.</strong> « Les \\( \\frac{2}{5} \\) des 30 élèves » ' +
    'et « 40 % des 30 élèves » désignent la même chose : 12 élèves. Le pourcentage n\'est qu\'une ' +
    'autre façon d\'écrire la fraction.</p>' +
    '<p>Un résultat peut très bien ne pas être entier : 30 % de 48 € font 14,40 €. En revanche, ' +
    'un nombre d\'élèves, lui, est forcément entier — c\'est un bon moyen de vérifier qu\'on ne ' +
    's\'est pas trompé.</p>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();   // leçon sans figure JSXGraph

    /* ==================================================================== */
    /* Les nombres : des CENTIÈMES, jamais de flottants                     */
    /* ==================================================================== */
    function fmt(c) {                        // 1440 → « 14,4 »
      var neg = c < 0, v = Math.abs(c);
      var e = Math.floor(v / 100), d = v % 100;
      var t = String(e);
      if (d) t += ',' + (d % 10 === 0 ? String(d / 10) : (d < 10 ? '0' + d : String(d)));
      return (neg ? '−' : '') + t;
    }
    function pgcd(x, y) { x = Math.abs(x); y = Math.abs(y); while (y) { var t = y; y = x % y; x = t; } return x; }

    /* ==================================================================== */
    /* Les situations                                                        */
    /* ==================================================================== */
    // Chaque contexte sait se raconter : ce qu'on compte, et son unité.
    var CONTEXTES = [
      { tout: function (n) { return n + ' élèves'; }, unite: 'élèves', entier: true,
        phrase: function (n, q) { return 'Dans une classe de <span class="qte-tout">' + n +
          ' élèves</span>, ' + q + ' sont demi-pensionnaires.'; },
        question: 'Combien d\'élèves cela fait-il ?' },
      { tout: function (n) { return n + ' €'; }, unite: '€', entier: false,
        phrase: function (n, q) { return 'Un jeu coûte <span class="qte-tout">' + n +
          ' €</span>. On en paie ' + q + '.'; },
        question: 'Quelle somme paie-t-on ?' },
      { tout: function (n) { return n + ' pages'; }, unite: 'pages', entier: true,
        phrase: function (n, q) { return 'Un livre a <span class="qte-tout">' + n +
          ' pages</span>. Léa en a lu ' + q + '.'; },
        question: 'Combien de pages a-t-elle lues ?' },
      { tout: function (n) { return n + ' billes'; }, unite: 'billes', entier: true,
        phrase: function (n, q) { return 'Un sachet contient <span class="qte-tout">' + n +
          ' billes</span>. ' + q + ' sont rouges.'; },
        question: 'Combien y a-t-il de billes rouges ?' },
      { tout: function (n) { return n + ' km'; }, unite: 'km', entier: false,
        phrase: function (n, q) { return 'Un parcours mesure <span class="qte-tout">' + n +
          ' km</span>. On en a fait ' + q + '.'; },
        question: 'Quelle distance a-t-on parcourue ?' }
    ];

    var CAS = [
      { cle: 'fraction', nom: 'Une fraction d\'une quantité' },
      { cle: 'pourcent', nom: 'Un pourcentage' },
      { cle: 'decimal', nom: 'Quand ça ne tombe pas rond' }
    ];
    var cas = 'fraction';

    // La situation courante : a/b (ou t %) d'une quantité N.
    var S = null;
    function ent(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
    function pick(t) { return t[Math.floor(Math.random() * t.length)]; }

    function tirer() {
      var ctx, a, b, n, t, i;
      if (cas === 'pourcent') {
        // Des pourcentages qui se simplifient bien. Ceux qui donnent une
        // fraction de numérateur 1 (10 %, 20 %, 25 %, 50 %) sont gardés : ce
        // sont les plus utiles. C'est la RÉDACTION qui s'adapte, plus bas, pour
        // ne pas écrire « × 1 ».
        t = pick([10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90]);
        var g = pgcd(t, 100);
        a = t / g; b = 100 / g;
        ctx = pick(CONTEXTES);
        for (i = 0; i < 200; i++) {
          n = ctx.entier ? ent(2, 12) * b : ent(2, 30) * 2;
          if (!ctx.entier || (n * a) % b === 0) {
            if ((n * a * 100) % b === 0) break;
          }
        }
        if ((n * a * 100) % b !== 0) { n = b * ent(2, 9); }
        S = { type: 'pourcent', t: t, a: a, b: b, n: n, ctx: ctx };
        return;
      }
      if (cas === 'decimal') {
        // Le résultat ne tombe pas rond : c'est là qu'on montre les deux ordres.
        ctx = pick(CONTEXTES.filter(function (c) { return !c.entier; }));
        for (i = 0; i < 300; i++) {
          b = pick([3, 4, 5, 6, 8]);
          a = ent(1, b - 1);
          if (pgcd(a, b) !== 1) continue;
          n = ent(3, 60);
          if (n % b === 0) continue;                 // sinon ça tombe rond
          if ((n * a * 100) % b !== 0) continue;     // au plus deux décimales
          break;
        }
        if (!b || n % b === 0) { a = 3; b = 4; n = 10; ctx = CONTEXTES[1]; }
        S = { type: 'fraction', a: a, b: b, n: n, ctx: ctx };
        return;
      }
      // Cas simple : la division tombe juste.
      ctx = pick(CONTEXTES);
      b = pick([2, 3, 4, 5, 6, 8]);
      a = ent(1, b - 1);
      for (i = 0; i < 40 && pgcd(a, b) !== 1; i++) a = ent(1, b - 1);
      n = b * ent(2, ctx.entier ? 8 : 12);
      S = { type: 'fraction', a: a, b: b, n: n, ctx: ctx };
    }

    // Les valeurs du calcul, en centièmes.
    function valeurs() {
      var part = S.n * 100 / S.b;              // une part
      var res = S.n * S.a * 100 / S.b;         // a parts
      return { part: part, res: res };
    }

    /* ==================================================================== */
    /* Le dessin : la quantité entière, coupée en parts                      */
    /* ==================================================================== */
    var W = 470, X0 = 6, LB = 458, YB = 34, HB = 44, HT = 118;
    var BLEU = '#2563eb', ORANGE = '#ea580c', VIOLET = '#7c3aed', TRAIT = '#334155';

    function n1(v) { return Math.round(v * 10) / 10; }
    function txt(x, y, t, col, taille, gras) {
      return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + (taille || 13) +
             '" font-weight="' + (gras === false ? 600 : 800) +
             '" font-family="system-ui, sans-serif" fill="' + col +
             '" stroke="#fff" stroke-width="3" paint-order="stroke" text-anchor="middle">' +
             t + '</text>';
    }

    /*
     * e.parts   : la barre est-elle coupée ?
     * e.valeurs : la valeur d'une part est-elle écrite sous chaque part ?
     * e.pris    : combien de parts sont coloriées (0 = aucune) ;
     * e.total   : afficher le résultat sous la zone coloriée.
     */
    function dessin(e) {
      var v = valeurs();
      var s = ['<svg viewBox="0 0 ' + W + ' ' + HT + '" xmlns="http://www.w3.org/2000/svg" ' +
        'style="max-width:' + W + 'px;width:100%;height:auto;display:block;margin:.4rem 0" ' +
        'role="img" aria-label="La quantité entière, partagée en parts égales.">'];

      // la quantité totale, au-dessus
      s.push(txt(X0 + LB / 2, 18, S.ctx.tout(S.n), BLEU, 15));

      // la zone coloriée : les `pris` premières parts
      if (e.pris) {
        s.push('<rect x="' + X0 + '" y="' + YB + '" width="' + n1(LB * e.pris / S.b) +
               '" height="' + HB + '" fill="' + VIOLET + '" fill-opacity="0.28"/>');
      }
      // le cadre, puis les traits de partage
      s.push('<rect x="' + X0 + '" y="' + YB + '" width="' + LB + '" height="' + HB +
             '" fill="none" stroke="' + TRAIT + '" stroke-width="2" rx="4"/>');
      if (e.parts) {
        for (var i = 1; i < S.b; i++) {
          var x = X0 + LB * i / S.b;
          s.push('<line x1="' + n1(x) + '" y1="' + YB + '" x2="' + n1(x) + '" y2="' +
                 (YB + HB) + '" stroke="' + TRAIT + '" stroke-width="1.6"/>');
        }
      }
      // la valeur d'une part, écrite dans chaque part
      if (e.valeurs) {
        for (var k = 0; k < S.b; k++) {
          var xc = X0 + LB * (k + 0.5) / S.b;
          s.push(txt(xc, YB + HB / 2 + 5, fmt(v.part), k < e.pris ? VIOLET : ORANGE, 14));
        }
      }
      // le résultat, sous la zone coloriée
      if (e.total) {
        var xf = X0 + LB * e.pris / S.b;
        s.push('<line x1="' + X0 + '" y1="' + (YB + HB + 8) + '" x2="' + n1(xf) + '" y2="' +
               (YB + HB + 8) + '" stroke="' + VIOLET + '" stroke-width="2.5"/>');
        s.push(txt(X0 + xf / 2, YB + HB + 28, fmt(v.res) + ' ' + S.ctx.unite, VIOLET, 15));
      }
      s.push('</svg>');
      return s.join('');
    }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'qte-ui';
    root.innerHTML =
      '<div class="qte-cas"></div>' +
      '<div class="qte-enonce"></div>' +
      '<div class="qte-dessin"></div>' +
      '<div class="qte-etapes"></div>' +
      '<div class="qte-calc"></div>' +
      '<div><span class="qte-concl" style="visibility:hidden">&nbsp;</span></div>' +
      '<div class="qte-autre"></div>';
    var elCas = root.querySelector('.qte-cas');
    var elEnonce = root.querySelector('.qte-enonce');
    var elDessin = root.querySelector('.qte-dessin');
    var elEtapes = root.querySelector('.qte-etapes');
    var elCalc = root.querySelector('.qte-calc');
    var elConcl = root.querySelector('.qte-concl');
    var elAutre = root.querySelector('.qte-autre');
    mv.extras.appendChild(root);

    // Comment se dit la quantité prise, dans l'énoncé.
    function ditQuantite() {
      return S.type === 'pourcent'
        ? '<b>' + S.t + ' %</b>'
        : '<b>les ' + S.a + '/' + S.b + '</b>';
    }

    /* ==================================================================== */
    /* Les étapes : des ÉTATS figés, jamais des actions                     */
    /* ==================================================================== */
    var phrases = [];
    function rendre(e) {
      elEnonce.innerHTML = S.ctx.phrase(S.n, ditQuantite()) + '<br>' + S.ctx.question;
      elDessin.innerHTML = dessin(e);
      elEtapes.innerHTML = phrases.slice(0, e.n).map(function (t) {
        return '<div class="qte-etape">' + t + '</div>';
      }).join('');
      elCalc.innerHTML = e.calc || '';
      elConcl.style.visibility = e.concl ? 'visible' : 'hidden';
      elConcl.innerHTML = e.concl || '&nbsp;';
      elAutre.innerHTML = e.autre || '';
    }

    var anim = mv.createAnimator();
    var cur = null;
    function neuf() {
      return { n: 0, parts: false, valeurs: false, pris: 0, total: false,
               calc: '', concl: null, autre: '' };
    }
    function copie(e) {
      return { n: e.n, parts: e.parts, valeurs: e.valeurs, pris: e.pris, total: e.total,
               calc: e.calc, concl: e.concl, autre: e.autre };
    }
    function pas(dur, maj) { maj(); var e = copie(cur); return { dur: dur, step: function () { rendre(e); } }; }
    function dire(t) { cur.n = phrases.push(t); }

    function construitEtapes() {
      phrases = [];
      cur = neuf();
      var steps = [], v = valeurs();
      var unite = S.ctx.unite;

      // 0. un pourcentage : c'est une fraction de dénominateur 100
      if (S.type === 'pourcent') {
        var g = pgcd(S.t, 100);
        steps.push(pas(900, function () {
          dire('<b>' + S.t + ' %</b> veut dire « ' + S.t + ' sur 100 » : c\'est la fraction ' +
               '<b>' + S.t + '/100</b>. Il n\'y a rien de nouveau à apprendre.');
          cur.calc = S.t + ' % = ' + S.t + '/100' +
            (g > 1 ? ' = <span class="part">' + S.a + '/' + S.b + '</span>' : '');
        }));
        if (g > 1) {
          steps.push(pas(800, function () {
            dire('On <b>simplifie</b> : ' + S.t + ' et 100 se divisent tous les deux par ' + g +
                 ', donc ' + S.t + '/100 = <b>' + S.a + '/' + S.b + '</b>. La quantité se ' +
                 'partagera donc en <b>' + S.b + '</b> parts, et non en 100.');
          }));
        }
      }

      // 1. partager la quantité
      steps.push(pas(900, function () {
        cur.parts = true;
        dire('Prendre ' + (S.type === 'pourcent' ? S.t + ' %' : 'les ' + S.a + '/' + S.b) +
             ' d\'une quantité, c\'est la partager en <b>' + S.b + ' parts égales</b> et en ' +
             'prendre <b>' + S.a + '</b>.');
      }));

      // 2. la valeur d'une part
      steps.push(pas(900, function () {
        cur.valeurs = true;
        dire('Une part vaut ' + S.n + ' ÷ ' + S.b + ' = <b>' + fmt(v.part) + '</b> ' + unite + '.');
        cur.calc = S.n + ' ÷ ' + S.b + ' = <span class="part">' + fmt(v.part) + '</span>';
      }));

      // 3. en prendre a. Quand on n'en prend qu'UNE, il n'y a rien à
      //    multiplier : écrire « × 1 » ferait croire à un calcul.
      steps.push(pas(1000, function () {
        cur.pris = S.a;
        cur.total = true;
        if (S.a === 1) {
          dire('On n\'en prend qu\'<b>une</b> : le résultat est directement la valeur d\'une ' +
               'part, <b>' + fmt(v.res) + '</b> ' + unite + '.');
          cur.calc = S.n + ' ÷ ' + S.b + ' = <span class="res">' + fmt(v.res) + '</span>';
        } else {
          dire('On en prend <b>' + S.a + '</b> : ' + fmt(v.part) + ' × ' + S.a + ' = <b>' +
               fmt(v.res) + '</b> ' + unite + '.');
          cur.calc = S.n + ' ÷ ' + S.b + ' = <span class="part">' + fmt(v.part) + '</span>' +
                     ' &nbsp;puis&nbsp; <span class="part">' + fmt(v.part) + '</span> × ' + S.a +
                     ' = <span class="res">' + fmt(v.res) + '</span>';
        }
      }));

      // 4. la conclusion, dans les mots de l'énoncé
      steps.push(pas(800, function () {
        cur.concl = (S.type === 'pourcent' ? S.t + ' % de ' : 'Les ' + S.a + '/' + S.b + ' de ') +
                    S.n + ' ' + unite + ' = <b>' + fmt(v.res) + '</b> ' + unite;
        dire('On répond par une phrase : ' + reponse() + '.');
      }));

      // 5. l'autre ordre de calcul — sans objet si l'on ne prend qu'une part
      steps.push(pas(800, function () {
        if (S.a === 1) {
          dire('Ici on ne prend qu\'<b>une</b> part : il n\'y a qu\'une division à faire. ' +
               'Dès qu\'on en prend plusieurs, deux chemins s\'ouvrent — diviser puis ' +
               'multiplier, ou multiplier puis diviser — et ils donnent le même résultat.');
          cur.autre = '<b>À retenir :</b> ' + (S.type === 'pourcent' ? S.t + ' %' : '1/' + S.b) +
            ' d\'une quantité, c\'est la <b>diviser par ' + S.b + '</b>.';
          return;
        }
        var croise = S.n * S.a;
        dire('On aurait pu <b>multiplier d\'abord</b> : ' + S.n + ' × ' + S.a + ' = ' + croise +
             ', puis ' + croise + ' ÷ ' + S.b + ' = <b>' + fmt(v.res) + '</b>. Même résultat — ' +
             'on choisit l\'ordre où les nombres tombent le mieux.');
        cur.autre = '<b>Les deux chemins :</b> (' + S.n + ' ÷ ' + S.b + ') × ' + S.a + ' = ' +
          fmt(v.res) + ' &nbsp;·&nbsp; (' + S.n + ' × ' + S.a + ') ÷ ' + S.b + ' = ' + fmt(v.res) +
          (v.res % 100 !== 0
            ? ' &nbsp;— ici le résultat n\'est pas entier, et c\'est normal : on parle de ' +
              unite + '.'
            : '');
      }));
      return steps;
    }

    function reponse() {
      var v = valeurs();
      return S.ctx.unite === 'élèves'
        ? '<b>' + fmt(v.res) + ' élèves</b> sont demi-pensionnaires'
        : S.ctx.unite === '€' ? 'on paie <b>' + fmt(v.res) + ' €</b>'
        : S.ctx.unite === 'pages' ? 'elle a lu <b>' + fmt(v.res) + ' pages</b>'
        : S.ctx.unite === 'billes' ? 'il y a <b>' + fmt(v.res) + ' billes rouges</b>'
        : 'on a parcouru <b>' + fmt(v.res) + ' km</b>';
    }

    /* ==================================================================== */
    /* États                                                                 */
    /* ==================================================================== */
    /* On NE vide PAS `phrases` : le bouton « ◀ Précédent » appelle cette
       remise à zéro puis rejoue les étapes précédentes, et chaque étape ne
       retient qu'un INDICE dans ce tableau. Le vider ici, c'est effacer les
       phrases auxquelles les étapes renvoient — l'écran se reconstruisait
       muet. Il est de toute façon remis à zéro par construitEtapes() au
       début de chaque lancement. */
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
      { type: 'button', id: 'autre', label: '🎲 Autre situation',
        onClick: function () { tirer(); jouer(); } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer }
    ]);

    choisir('fraction');
  }
});
