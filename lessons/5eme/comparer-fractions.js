/*
 * Comparer deux fractions (5ème).
 *
 * Leçon sans figure JSXGraph : tout est en HTML dans mv.extras — les fractions
 * écrites empilées, et deux barres dessinées en SVG — et le moteur d'animation
 * partagé fait avancer le raisonnement étape par étape.
 *
 * ---------------------------------------------------------------------------
 * L'erreur qu'on veut défaire
 * ---------------------------------------------------------------------------
 * « 5 est plus grand que 3, donc 5/8 est plus grand que 3/4. » C'est l'erreur
 * la plus fréquente du chapitre, et elle vient d'une idée juste appliquée trop
 * tôt : comparer les numérateurs. Ça ne marche QUE si les parts ont la même
 * taille. L'animation commence donc par montrer le piège, avant de donner la
 * méthode.
 *
 * ---------------------------------------------------------------------------
 * Deux barres de MÊME longueur, redécoupées
 * ---------------------------------------------------------------------------
 * C'est le prolongement direct de la leçon « Égalités de fractions » (6ème),
 * et volontairement le même langage visuel : deux barres de même largeur — la
 * même unité — coupées l'une en b parts, l'autre en d. Quand on amplifie, la
 * barre se REDÉCOUPE : les traits d'origine restent marqués, les nouveaux
 * apparaissent plus fins, et la LONGUEUR COLORIÉE ne bouge pas d'un pixel.
 * C'est ce qui rend l'amplification acceptable : on n'a rien ajouté, on a
 * seulement coupé plus finement.
 *
 * Une fois les deux barres coupées de la même façon, un trait vertical posé au
 * bord du premier coloriage traverse les deux : la comparaison se voit avant
 * de se calculer.
 *
 * ---------------------------------------------------------------------------
 * Les trois cas, et le dénominateur commun
 * ---------------------------------------------------------------------------
 *   même dénominateur   il n'y a rien à faire : on compare les numérateurs ;
 *   l'un multiple de    on n'amplifie qu'UNE fraction — c'est le cas le plus
 *   l'autre             économique, et celui qu'il faut penser à chercher ;
 *   quelconques         on prend le produit des deux dénominateurs.
 *
 * Dans le troisième cas, les dénominateurs tirés sont toujours PREMIERS ENTRE
 * EUX : le produit est alors exactement le plus petit dénominateur commun, et
 * l'on ne raconte donc rien d'approximatif en le présentant comme LE
 * dénominateur commun. Quand ils ont un facteur en commun, un multiple plus
 * petit existe — c'est dit dans les notes, pas escamoté.
 *
 * ---------------------------------------------------------------------------
 * Aucun flottant
 * ---------------------------------------------------------------------------
 * Deux fractions se comparent par un PRODUIT EN CROIX sur des entiers
 * (a·d contre c·b), jamais en divisant : a/b calculé en virgule flottante
 * mettrait 1/3 et 2/6 à un cheveu l'un de l'autre, et la leçon annoncerait
 * parfois « ≠ » sur deux fractions égales.
 */
MathsView.register({
  id: 'comparer-fractions',
  title: 'Comparer deux fractions',
  level: '5eme',
  category: 'calcul',
  subcategory: 'Fractions',
  theme: 'Nombres — comparer deux fractions',
  exercices: ['comparer-fractions'],
  description:
    'Pour comparer deux fractions, on ne compare pas les numérateurs tels quels : ' +
    '\\( \\frac{5}{8} \\) n\'est pas plus grand que \\( \\frac{3}{4} \\) sous prétexte que ' +
    '\\( 5 > 3 \\). Il faut d\'abord les écrire avec le <strong>même dénominateur</strong>, ' +
    'c\'est-à-dire découper l\'unité en parts de <strong>même taille</strong>. ' +
    '<br>Clique sur <strong>Lancer l\'animation</strong> : les deux barres, de même longueur, ' +
    'se <strong>redécoupent</strong> sans que la partie coloriée ne bouge — et une fois les ' +
    'parts identiques, il n\'y a plus qu\'à comparer les numérateurs. ' +
    '<br>Les trois boutons changent de cas : même dénominateur, un dénominateur multiple de ' +
    'l\'autre, ou deux dénominateurs quelconques.',
  notes:
    '<p><strong>La méthode, en deux temps.</strong></p>' +
    '<ul>' +
    '<li><strong>1. Même dénominateur.</strong> On réduit les deux fractions au même ' +
    'dénominateur, en multipliant numérateur <em>et</em> dénominateur par un même nombre — ce ' +
    'qui ne change pas leur valeur.</li>' +
    '<li><strong>2. On compare les numérateurs.</strong> À dénominateur égal, la plus grande ' +
    'fraction est celle qui a le plus grand numérateur : les parts ont la même taille, il n\'y ' +
    'a plus qu\'à les compter.</li>' +
    '</ul>' +
    '<p><strong>Quel dénominateur commun choisir&nbsp;?</strong></p>' +
    '<ul>' +
    '<li>Si l\'un des dénominateurs est un <strong>multiple</strong> de l\'autre, il fait ' +
    'l\'affaire : pour \\( \\frac{3}{4} \\) et \\( \\frac{5}{8} \\), on garde 8 et on ' +
    'n\'amplifie que la première.</li>' +
    '<li>Sinon, le <strong>produit</strong> des deux dénominateurs marche toujours : pour ' +
    '\\( \\frac{2}{3} \\) et \\( \\frac{3}{4} \\), on prend \\( 3 \\times 4 = 12 \\).</li>' +
    '<li>Ce n\'est pas forcément le plus petit : pour \\( \\frac{5}{6} \\) et ' +
    '\\( \\frac{3}{4} \\), le produit donne 24, alors que 12 suffit. Un dénominateur commun ' +
    'plus grand n\'est jamais faux, seulement plus lourd à écrire.</li>' +
    '</ul>' +
    '<p><strong>Le piège.</strong> \\( \\frac{5}{8} < \\frac{3}{4} \\), bien que \\( 5 > 3 \\). ' +
    'Comparer les numérateurs n\'a de sens que si les parts ont la <strong>même taille</strong>, ' +
    'donc si les dénominateurs sont égaux.</p>' +
    '<p>Deux cas se voient d\'un coup d\'œil, sans rien calculer&nbsp;: à ' +
    '<strong>numérateurs égaux</strong>, la plus grande fraction est celle qui a le ' +
    '<strong>plus petit dénominateur</strong> (les parts sont plus grosses) ; et une fraction ' +
    'est plus petite que 1 quand son numérateur est plus petit que son dénominateur.</p>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();   // leçon sans figure JSXGraph

    /* ==================================================================== */
    /* Comparer sans jamais diviser                                          */
    /* ==================================================================== */
    // a/b contre c/d : on compare a·d et c·b. Des ENTIERS, donc exact.
    function compare(a, b, c, d) {
      var g = a * d, h = c * b;
      return g > h ? '>' : (g < h ? '<' : '=');
    }
    function pgcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }

    /* ==================================================================== */
    /* Le dessin : deux barres de même longueur, coupées et coloriées        */
    /* ==================================================================== */
    var W = 460, HB = 34, Y1 = 8, Y2 = 74, HT = 122, X0 = 4, LB = 452;
    var BLEU = '#2563eb', VIOLET = '#7c3aed', TRAIT = '#334155';

    function n1(v) { return Math.round(v * 10) / 10; }

    /*
     * Une barre : `b` parts d'origine, `mult` fois plus fines après
     * amplification, `a` parts d'origine coloriées. La longueur coloriée vaut
     * a/b de la barre — elle ne dépend PAS de mult, et c'est tout l'intérêt.
     */
    function barre(y, a, b, mult, couleur) {
      var s = [];
      var plein = LB * a / b;
      s.push('<rect x="' + X0 + '" y="' + y + '" width="' + LB + '" height="' + HB +
             '" fill="#fff" stroke="' + TRAIT + '" stroke-width="2" rx="4"/>');
      s.push('<rect x="' + X0 + '" y="' + y + '" width="' + n1(plein) + '" height="' + HB +
             '" fill="' + couleur + '" fill-opacity="0.3"/>');
      // les traits de découpe : marqués pour le découpage d'origine, fins pour
      // ceux qu'ajoute l'amplification
      var n = b * mult, i;
      for (i = 1; i < n; i++) {
        var x = X0 + LB * i / n, origine = (i % mult === 0);
        s.push('<line x1="' + n1(x) + '" y1="' + y + '" x2="' + n1(x) + '" y2="' + (y + HB) +
               '" stroke="' + (origine ? TRAIT : '#cbd5e1') + '" stroke-width="' +
               (origine ? 1.6 : 1) + '"/>');
      }
      s.push('<rect x="' + X0 + '" y="' + y + '" width="' + LB + '" height="' + HB +
             '" fill="none" stroke="' + TRAIT + '" stroke-width="2" rx="4"/>');
      return s.join('');
    }

    // Le dessin complet. `repere` : tracer le trait vertical qui compare les
    // deux longueurs coloriées.
    function dessin(e) {
      var s = ['<svg viewBox="0 0 ' + W + ' ' + HT + '" xmlns="http://www.w3.org/2000/svg" ' +
        'style="max-width:' + W + 'px;width:100%;height:auto;display:block;margin:.4rem 0" ' +
        'role="img" aria-label="Deux barres de même longueur, partagées et coloriées.">'];
      s.push(barre(Y1, e.f1.a, e.f1.b, e.f1.mult, BLEU));
      s.push(barre(Y2, e.f2.a, e.f2.b, e.f2.mult, VIOLET));
      if (e.repere) {
        var x1 = X0 + LB * e.f1.a / e.f1.b, x2 = X0 + LB * e.f2.a / e.f2.b;
        [[x1, BLEU], [x2, VIOLET]].forEach(function (p) {
          s.push('<line x1="' + n1(p[0]) + '" y1="' + (Y1 - 4) + '" x2="' + n1(p[0]) +
                 '" y2="' + (Y2 + HB + 4) + '" stroke="' + p[1] + '" stroke-width="2.5" ' +
                 'stroke-dasharray="6 4"/>');
        });
      }
      s.push('</svg>');
      return s.join('');
    }

    /* ==================================================================== */
    /* L'écriture des fractions                                              */
    /* ==================================================================== */
    // Les signes de comparaison partent dans du HTML : « < » doit être écrit
    // en entité, sinon on laisse traîner un début de balise dans la page.
    function sgn(x) { return x === '<' ? '&lt;' : (x === '>' ? '&gt;' : x); }

    function frac(a, b, cls, vise) {
      return '<span class="cmf-frac ' + cls + '">' +
        '<span class="num' + (vise === 'num' ? ' cmf-vise' : '') + '">' + a + '</span>' +
        '<span class="den' + (vise === 'den' ? ' cmf-vise' : '') + '">' + b + '</span></span>';
    }

    /* ==================================================================== */
    /* Les cas, et le tirage                                                 */
    /* ==================================================================== */
    var CAS = [
      { cle: 'meme', nom: 'Même dénominateur' },
      { cle: 'multiple', nom: 'Un dénominateur multiple de l\'autre' },
      { cle: 'quelconque', nom: 'Dénominateurs quelconques' }
    ];
    var cas = 'meme';
    var F = { a: 3, b: 4, c: 5, d: 8 };      // a/b et c/d

    function ent(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

    function tirer() {
      var a, b, c, d, i;
      if (cas === 'meme') {
        b = ent(4, 12); d = b;
        a = ent(1, b - 1);
        c = ent(1, b - 1);
        for (i = 0; i < 40 && c === a; i++) c = ent(1, b - 1);
      } else if (cas === 'multiple') {
        b = ent(2, 6);
        var k = ent(2, 4);
        d = b * k;
        if (d > 20) d = b * 2;
        a = ent(1, b - 1 || 1);
        c = ent(1, d - 1);
        // On évite l'égalité : deux fractions égales ne se « comparent » pas.
        for (i = 0; i < 60 && a * d === c * b; i++) c = ent(1, d - 1);
      } else {
        // Dénominateurs PREMIERS ENTRE EUX : le produit est alors le plus petit
        // dénominateur commun, et l'on peut le présenter comme tel sans mentir.
        var paires = [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [3, 7], [4, 7], [5, 6], [2, 7]];
        var p = paires[ent(0, paires.length - 1)];
        if (ent(0, 1)) { b = p[0]; d = p[1]; } else { b = p[1]; d = p[0]; }
        a = ent(1, b - 1 || 1);
        c = ent(1, d - 1 || 1);
        for (i = 0; i < 60 && a * d === c * b; i++) c = ent(1, d - 1 || 1);
      }
      F = { a: a, b: b, c: c, d: d };
    }

    // Le dénominateur commun, et de combien il faut amplifier chacune.
    function commun() {
      if (F.b === F.d) return { den: F.b, m1: 1, m2: 1, pourquoi: 'meme' };
      if (F.d % F.b === 0) return { den: F.d, m1: F.d / F.b, m2: 1, pourquoi: 'multiple' };
      if (F.b % F.d === 0) return { den: F.b, m1: 1, m2: F.b / F.d, pourquoi: 'multiple' };
      return { den: F.b * F.d, m1: F.d, m2: F.b, pourquoi: 'produit' };
    }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'cmf-ui';
    root.innerHTML =
      '<div class="cmf-cas"></div>' +
      '<div class="cmf-ligne cmf-depart"></div>' +
      '<div class="cmf-dessin"></div>' +
      '<div class="cmf-etapes"></div>' +
      '<div class="cmf-ligne cmf-apres"></div>' +
      '<div><span class="cmf-concl" style="visibility:hidden">&nbsp;</span></div>';
    var elCas = root.querySelector('.cmf-cas');
    var elDepart = root.querySelector('.cmf-depart');
    var elDessin = root.querySelector('.cmf-dessin');
    var elEtapes = root.querySelector('.cmf-etapes');
    var elApres = root.querySelector('.cmf-apres');
    var elConcl = root.querySelector('.cmf-concl');
    mv.extras.appendChild(root);

    /* ==================================================================== */
    /* Les étapes : des ÉTATS figés, jamais des actions                     */
    /* ==================================================================== */
    // Le moteur rappelle step(p) à chaque image et le pas à pas rejoue les
    // étapes précédentes : tout est donc reconstruit depuis un instantané.
    var phrases = [];
    function rendre(e) {
      elDepart.innerHTML =
        frac(F.a, F.b, 'cmf-un', e.vise) +
        '<span class="cmf-signe' + (e.signeDepart ? '' : ' mystere') + '">' +
        (e.signeDepart ? sgn(e.signeDepart) : '?') + '</span>' +
        frac(F.c, F.d, 'cmf-deux', e.vise);
      elDessin.innerHTML = dessin(e);
      elEtapes.innerHTML = phrases.slice(0, e.n).map(function (t) {
        return '<div class="cmf-etape">' + t + '</div>';
      }).join('');
      elApres.innerHTML = e.apres
        ? frac(F.a * e.f1.mult, F.b * e.f1.mult, 'cmf-un', e.viseApres) +
          '<span class="cmf-signe' + (e.signe ? '' : ' mystere') + '">' +
          (e.signe ? sgn(e.signe) : '?') + '</span>' +
          frac(F.c * e.f2.mult, F.d * e.f2.mult, 'cmf-deux', e.viseApres) +
          (e.fois ? '<span class="cmf-fois">' + e.fois + '</span>' : '')
        : '';
      elConcl.style.visibility = e.concl ? 'visible' : 'hidden';
      elConcl.innerHTML = e.concl || '&nbsp;';
    }

    var anim = mv.createAnimator();
    var cur = null;
    function neuf() {
      return { n: 0, f1: { a: F.a, b: F.b, mult: 1 }, f2: { a: F.c, b: F.d, mult: 1 },
               vise: null, viseApres: null, apres: false, fois: '', signe: null,
               signeDepart: null, repere: false, concl: null };
    }
    function copie(e) {
      return { n: e.n, f1: { a: e.f1.a, b: e.f1.b, mult: e.f1.mult },
               f2: { a: e.f2.a, b: e.f2.b, mult: e.f2.mult },
               vise: e.vise, viseApres: e.viseApres, apres: e.apres, fois: e.fois,
               signe: e.signe, signeDepart: e.signeDepart, repere: e.repere, concl: e.concl };
    }
    function pas(dur, maj) { maj(); var e = copie(cur); return { dur: dur, step: function () { rendre(e); } }; }
    function dire(t) { cur.n = phrases.push(t); }

    function construitEtapes() {
      phrases = [];
      cur = neuf();
      var steps = [];
      var k = commun();
      var signe = compare(F.a, F.b, F.c, F.d);
      var na = F.a * k.m1, nc = F.c * k.m2;

      // 1. la situation, et ce que montrent les barres
      steps.push(pas(800, function () {
        dire('Les deux barres ont la <b>même longueur</b> : c\'est la même unité. Mais la ' +
             'première est partagée en <b>' + F.b + '</b> parts et la seconde en <b>' + F.d +
             '</b>.');
      }));

      // 2. le piège, quand il y a matière
      if (k.pourquoi !== 'meme' && ((F.c > F.a) !== (signe === '<'))) {
        steps.push(pas(900, function () {
          cur.vise = 'num';
          dire('<span class="piege">Le piège :</span> ' + F.c + ' est plus grand que ' + F.a +
               ', et pourtant ce n\'est pas la plus grande fraction. Comparer les numérateurs ' +
               'n\'a de sens que si les parts ont la <b>même taille</b>.');
        }));
      }

      if (k.pourquoi === 'meme') {
        // 3a. rien à faire : les dénominateurs sont déjà égaux
        steps.push(pas(900, function () {
          cur.vise = 'den';
          dire('Ici les deux dénominateurs sont <b>déjà égaux</b> : les parts ont la même ' +
               'taille, on peut comparer directement.');
        }));
      } else {
        // 3b. choisir le dénominateur commun
        steps.push(pas(900, function () {
          cur.vise = 'den';
          dire(k.pourquoi === 'multiple'
            ? '<b>' + k.den + '</b> est un multiple de <b>' + Math.min(F.b, F.d) + '</b> (' +
              k.den + ' = ' + Math.min(F.b, F.d) + ' × ' + (k.den / Math.min(F.b, F.d)) +
              ') : il fera un <b>dénominateur commun</b>, et il n\'y a qu\'une fraction à ' +
              'transformer.'
            : 'Aucun des deux dénominateurs n\'est un multiple de l\'autre. On prend leur ' +
              '<b>produit</b> : ' + F.b + ' × ' + F.d + ' = <b>' + k.den + '</b>.');
        }));

        // 4. amplifier la première, si besoin
        if (k.m1 > 1) {
          steps.push(pas(1000, function () {
            cur.vise = null;
            cur.apres = true;
            cur.f1.mult = k.m1;
            cur.fois = '× ' + k.m1 + ' en haut et en bas';
            dire('On multiplie le numérateur <b>et</b> le dénominateur de la première par <b>' +
                 k.m1 + '</b> : ' + F.a + ' × ' + k.m1 + ' = ' + na + ' et ' + F.b + ' × ' +
                 k.m1 + ' = ' + k.den + '. La barre se <b>redécoupe</b>, mais la longueur ' +
                 'coloriée ne bouge pas : c\'est la même fraction.');
          }));
        }
        // 5. amplifier la seconde, si besoin
        if (k.m2 > 1) {
          steps.push(pas(1000, function () {
            cur.apres = true;
            cur.f2.mult = k.m2;
            cur.fois = '× ' + k.m2 + ' en haut et en bas';
            dire('Même chose pour la seconde, avec <b>' + k.m2 + '</b> : ' + F.c + ' × ' +
                 k.m2 + ' = ' + nc + ' et ' + F.d + ' × ' + k.m2 + ' = ' + k.den + '.');
          }));
        }
      }

      // 6. comparer les numérateurs, parts identiques
      steps.push(pas(1000, function () {
        cur.apres = true;
        cur.fois = '';
        cur.viseApres = 'num';
        cur.repere = true;
        cur.signe = signe;
        dire('Les deux barres sont maintenant coupées de la <b>même façon</b> : les parts ont ' +
             'la même taille. Il n\'y a plus qu\'à <b>compter</b> — ' + na + ' contre ' + nc +
             (signe === '=' ? ', c\'est la même chose.' : '.'));
      }));

      // 7. la conclusion, sur les fractions de départ
      steps.push(pas(700, function () {
        cur.viseApres = null;
        cur.signeDepart = signe;
        dire('On revient aux fractions de départ : elles se comparent dans le <b>même sens</b>, ' +
             'puisqu\'on ne les a pas changées de valeur.');
        cur.concl = frac(F.a, F.b, 'cmf-un') + '<span class="cmf-signe">' + sgn(signe) +
                    '</span>' + frac(F.c, F.d, 'cmf-deux');
      }));
      return steps;
    }

    /* ==================================================================== */
    /* États                                                                 */
    /* ==================================================================== */
    function effacer() { anim.cancel(); phrases = []; rendre(neuf()); }
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
      { type: 'button', id: 'autre', label: '🎲 Deux autres fractions',
        onClick: function () { tirer(); jouer(); } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer }
    ]);

    choisir('multiple');
  }
});
