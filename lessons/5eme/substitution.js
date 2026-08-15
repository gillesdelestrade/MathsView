/*
 * Calculer la valeur d'une expression littérale par substitution (5ème).
 *
 * ---------------------------------------------------------------------------
 * Une lettre est un nombre
 * ---------------------------------------------------------------------------
 * C'est tout le message, et il est plus difficile à faire passer qu'il n'y
 * paraît. Une lettre dans une formule n'est ni un objet, ni une abréviation :
 * c'est un NOMBRE, qu'on ne connaît pas encore. Dès qu'on le connaît, on le met
 * à la place — c'est ce qu'on appelle SUBSTITUER — et la formule redevient un
 * calcul ordinaire.
 *
 *   S = π × r²        r = 12   →   S = 3,14 × (12)²  =  452,16
 *   P = 9,81 × m      m = 10   →   P = 9,81 × 10     =  98,1
 *
 * L'animation fait ce remplacement à l'écran, lettre par lettre, puis déroule
 * le calcul dans l'ordre des priorités.
 *
 * ---------------------------------------------------------------------------
 * Les deux pièges, montrés plutôt que récités
 * ---------------------------------------------------------------------------
 *   LE SIGNE × CACHÉ. On écrit \pi r^2, 3x, 9,81m — le signe de multiplication
 *   est sous-entendu. Au moment de substituer, il faut le RÉTABLIR, sinon 3x
 *   avec x = 5 se lit « 35 ». L'animation le fait apparaître avant de remplacer.
 *
 *   LES PARENTHÈSES. On ne remplace pas la lettre par sa valeur toute nue : on
 *   la remplace par sa valeur ENTRE PARENTHÈSES. Sur un nombre positif cela ne
 *   change rien, et c'est bien pourquoi l'habitude ne se prend pas ; sur un
 *   nombre négatif, tout en dépend — avec x = −2, x² vaut (−2)² = 4, alors que
 *   −2² vaudrait −4. La formule « x² − 2x » est là pour ça.
 *
 * ---------------------------------------------------------------------------
 * La même formule, plusieurs valeurs
 * ---------------------------------------------------------------------------
 * La dernière étape remplit un petit tableau : la même expression, trois
 * valeurs de la lettre, trois résultats. C'est ce qui distingue une formule
 * d'un calcul — elle vaut pour TOUS les nombres à la fois, et n'en donne un
 * qu'une fois la lettre fixée. La leçon de seconde sur les tableaux de valeurs
 * repartira exactement de là.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est calculé
 * ---------------------------------------------------------------------------
 * Chaque formule sait se calculer elle-même, et les lignes affichées sont
 * produites à partir de ce calcul, jamais recopiées à la main. Les valeurs
 * intermédiaires sont arrondies au centième pour l'affichage, mais le calcul,
 * lui, va jusqu'au bout — on ne réinjecte jamais un arrondi dans la ligne
 * suivante.
 */
MathsView.register({
  id: 'substitution',
  title: 'Calculer une expression littérale',
  level: '5eme',
  category: 'algebre',
  subcategory: 'Calcul littéral',
  theme: 'Calcul littéral — remplacer une lettre par sa valeur',
  description:
    'Dans une formule, une lettre <strong>est un nombre</strong> — celui qu\'on ne connaît ' +
    'pas encore. Dès qu\'on le connaît, on le met à sa place : c\'est ' +
    '<strong>substituer</strong>, et la formule redevient un calcul ordinaire.' +
    '<br><strong>Choisis une formule</strong>, règle la valeur de la lettre, et lance ' +
    'l\'animation : le signe × caché réapparaît, la lettre cède la place à sa valeur ' +
    '<strong>entre parenthèses</strong>, puis le calcul se déroule dans l\'ordre.' +
    '<br>À la fin, la <strong>même</strong> formule est calculée pour trois valeurs ' +
    'différentes : c\'est ce qui fait la force d\'une formule — elle vaut pour tous les ' +
    'nombres à la fois.',
  notes:
    '<ul>' +
    '<li><strong>Substituer</strong>, c\'est remplacer chaque lettre par la valeur qu\'on lui ' +
    'donne, puis effectuer le calcul obtenu.</li>' +
    '<li><strong>Le signe × est souvent sous-entendu.</strong> \\(3x\\) signifie ' +
    '\\(3 \\times x\\), \\(\\pi r^2\\) signifie \\(\\pi \\times r \\times r\\), et ' +
    '\\(9{,}81\\,m\\) signifie \\(9{,}81 \\times m\\). Il faut le <strong>rétablir</strong> ' +
    'avant de remplacer : avec \\(x = 5\\), \\(3x\\) vaut \\(3 \\times 5 = 15\\), et surtout ' +
    'pas « 35 ».</li>' +
    '<li><strong>Toujours des parenthèses.</strong> On remplace la lettre par sa valeur ' +
    '<em>entre parenthèses</em>. Avec \\(x = -2\\) : \\(x^2 = (-2)^2 = 4\\), alors que ' +
    '\\(-2^2\\) vaudrait \\(-4\\). Sur un nombre positif cela ne change rien — c\'est ' +
    'justement pour cela que l\'habitude ne se prend pas toute seule.</li>' +
    '<li><strong>Les priorités restent les mêmes.</strong> Une fois la substitution faite, ' +
    'c\'est un calcul comme un autre : puissances d\'abord, puis multiplications et ' +
    'divisions, puis additions et soustractions — et les parenthèses avant tout.</li>' +
    '<li><strong>Une formule n\'est pas un calcul.</strong> Un calcul donne UN résultat ; ' +
    'une formule en donne un pour chaque valeur de la lettre. C\'est ce qui permet de ' +
    'l\'écrire une fois pour toutes.</li>' +
    '<li><strong>Les unités suivent.</strong> Si \\(r\\) est en cm, alors \\(\\pi r^2\\) est ' +
    'en cm². La lettre porte un nombre, mais la grandeur qu\'elle mesure porte une unité : ' +
    'il faut la donner dans la réponse.</li>' +
    '<li><strong>Ne pas confondre avec « développer ».</strong> Ici on connaît la valeur de ' +
    'la lettre et on calcule un nombre. Développer ou réduire, c\'est transformer ' +
    'l\'expression <em>sans</em> connaître la lettre — ce n\'est pas le même travail.</li>' +
    '</ul>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();          // leçon sans figure

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Écriture des nombres                                                  */
    /* ==================================================================== */
    // Au centième, à la française, sans zéros inutiles.
    function fr(v) {
      var r = Math.round(v * 100) / 100;
      return String(r).replace('.', ',').replace('−', '-').replace('-', '−');
    }
    // Entre parenthèses quand c'est négatif — la règle qu'on veut faire prendre.
    function par(v) { return v < 0 ? '(' + fr(v) + ')' : fr(v); }

    /* ==================================================================== */
    /* Les formules                                                          */
    /* ==================================================================== */
    /* Chacune sait : s'écrire, s'écrire une fois substituée, dérouler son
       calcul, et se calculer. Les lignes affichées sortent toutes de là — rien
       n'est recopié à la main, donc rien ne peut mentir. */
    var PI = 3.14;

    var FORMULES = [
      {
        cle: 'disque', nom: 'Aire d\'un disque',
        quoi: 'l\'aire d\'un disque de rayon <b>r</b>',
        expr: 'S = π × r²', court: 'S', unite: 'cm²',
        cache: 'On l\'écrit souvent <b>πr²</b> : les deux signes × sont sous-entendus.',
        lettres: [{ n: 'r', min: 1, max: 15, pas: 1, val: 12, unite: 'cm' }],
        avecX: 'S = π × r × r',
        subst: function (v) { return 'S = ' + fr(PI) + ' × ' + par(v.r) + ' × ' + par(v.r); },
        calc: function (v) {
          return [{ ligne: 'S = ' + fr(PI) + ' × ' + fr(v.r * v.r),
                    dit: 'on multiplie d\'abord le rayon par lui-même : ' + par(v.r) + ' × ' +
                         par(v.r) + ' = ' + fr(v.r * v.r) },
                  { ligne: 'S = ' + fr(PI * v.r * v.r),
                    dit: 'puis on multiplie par ' + fr(PI) }];
        },
        f: function (v) { return PI * v.r * v.r; }
      },
      {
        cle: 'poids', nom: 'Poids d\'un objet',
        quoi: 'le poids <b>P</b>, en newtons, d\'un objet de masse <b>m</b>',
        expr: 'P = 9,81 × m', court: 'P', unite: 'N',
        cache: 'On l\'écrit souvent <b>9,81 m</b> : le signe × est sous-entendu.',
        lettres: [{ n: 'm', min: 1, max: 50, pas: 1, val: 10, unite: 'kg' }],
        avecX: 'P = 9,81 × m',
        subst: function (v) { return 'P = 9,81 × ' + par(v.m); },
        calc: function (v) {
          return [{ ligne: 'P = ' + fr(9.81 * v.m), dit: 'une seule multiplication à faire' }];
        },
        f: function (v) { return 9.81 * v.m; }
      },
      {
        cle: 'rectangle', nom: 'Périmètre d\'un rectangle',
        quoi: 'le périmètre d\'un rectangle de longueur <b>L</b> et de largeur <b>l</b>',
        expr: 'P = 2 × (L + l)', court: 'P', unite: 'cm',
        cache: 'On l\'écrit souvent <b>2(L + l)</b> : le signe × devant la parenthèse est ' +
               'sous-entendu.',
        lettres: [{ n: 'L', min: 2, max: 20, pas: 1, val: 9, unite: 'cm' },
                  { n: 'l', min: 1, max: 15, pas: 1, val: 4, unite: 'cm' }],
        avecX: 'P = 2 × (L + l)',
        subst: function (v) { return 'P = 2 × (' + fr(v.L) + ' + ' + fr(v.l) + ')'; },
        calc: function (v) {
          return [{ ligne: 'P = 2 × ' + fr(v.L + v.l),
                    dit: 'la <b>parenthèse d\'abord</b> : ' + fr(v.L) + ' + ' + fr(v.l) + ' = ' +
                         fr(v.L + v.l) },
                  { ligne: 'P = ' + fr(2 * (v.L + v.l)), dit: 'puis la multiplication' }];
        },
        f: function (v) { return 2 * (v.L + v.l); }
      },
      {
        cle: 'triangle', nom: 'Aire d\'un triangle',
        quoi: 'l\'aire d\'un triangle de base <b>b</b> et de hauteur <b>h</b>',
        expr: 'A = b × h ÷ 2', court: 'A', unite: 'cm²',
        cache: 'On l\'écrit souvent <b>bh/2</b> : le signe × entre b et h est sous-entendu.',
        lettres: [{ n: 'b', min: 1, max: 20, pas: 1, val: 7, unite: 'cm' },
                  { n: 'h', min: 1, max: 20, pas: 1, val: 6, unite: 'cm' }],
        avecX: 'A = b × h ÷ 2',
        subst: function (v) { return 'A = ' + par(v.b) + ' × ' + par(v.h) + ' ÷ 2'; },
        calc: function (v) {
          return [{ ligne: 'A = ' + fr(v.b * v.h) + ' ÷ 2',
                    dit: 'on multiplie d\'abord : ' + par(v.b) + ' × ' + par(v.h) + ' = ' +
                         fr(v.b * v.h) },
                  { ligne: 'A = ' + fr(v.b * v.h / 2), dit: 'puis on divise par 2' }];
        },
        f: function (v) { return v.b * v.h / 2; }
      },
      {
        cle: 'distance', nom: 'Distance parcourue',
        quoi: 'la distance parcourue à la vitesse <b>v</b> pendant la durée <b>t</b>',
        expr: 'd = v × t', court: 'd', unite: 'km',
        cache: 'On l\'écrit souvent <b>vt</b> : le signe × est sous-entendu.',
        lettres: [{ n: 'v', min: 10, max: 130, pas: 5, val: 90, unite: 'km/h' },
                  { n: 't', min: 1, max: 8, pas: 1, val: 3, unite: 'h' }],
        avecX: 'd = v × t',
        subst: function (v) { return 'd = ' + fr(v.v) + ' × ' + fr(v.t); },
        calc: function (v) {
          return [{ ligne: 'd = ' + fr(v.v * v.t), dit: 'une seule multiplication à faire' }];
        },
        f: function (v) { return v.v * v.t; }
      },
      {
        cle: 'litterale', nom: 'Une expression littérale',
        quoi: 'la valeur de l\'expression pour une valeur de <b>x</b>',
        expr: 'B = x² − 2x', court: 'B', unite: '',
        cache: 'Dans <b>2x</b>, le signe × est sous-entendu : cela veut dire <b>2 × x</b>. ' +
               'Et <b>x²</b> veut dire <b>x × x</b>.',
        lettres: [{ n: 'x', min: -5, max: 6, pas: 1, val: -2, unite: '' }],
        avecX: 'B = x × x − 2 × x',
        subst: function (v) {
          return 'B = ' + par(v.x) + ' × ' + par(v.x) + ' − 2 × ' + par(v.x);
        },
        calc: function (v) {
          return [{ ligne: 'B = ' + fr(v.x * v.x) + ' − ' + fr(2 * v.x),
                    dit: 'les deux multiplications d\'abord : ' + par(v.x) + ' × ' + par(v.x) +
                         ' = ' + fr(v.x * v.x) + ', et 2 × ' + par(v.x) + ' = ' + fr(2 * v.x) },
                  { ligne: 'B = ' + fr(v.x * v.x - 2 * v.x),
                    dit: 'puis la soustraction' + (v.x < 0
                      ? ' — attention, retirer un nombre négatif revient à ajouter'
                      : '') }];
        },
        f: function (v) { return v.x * v.x - 2 * v.x; }
      }
    ];

    var iF = 0;
    function F() { return FORMULES[iF]; }
    var V = {};
    function chargeDefauts() {
      V = {};
      F().lettres.forEach(function (l) { V[l.n] = l.val; });
    }
    chargeDefauts();

    function copieV() {
      var c = {};
      Object.keys(V).forEach(function (k) { c[k] = V[k]; });
      return c;
    }
    function valeursTxt(v) {
      return F().lettres.map(function (l) {
        return '<b>' + l.n + ' = ' + fr(v[l.n]) + (l.unite ? ' ' + l.unite : '') + '</b>';
      }).join(' et ');
    }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var bloc = document.createElement('div');
    bloc.className = 'sub-bloc';
    bloc.innerHTML =
      '<div class="sub-choix"></div>' +
      '<div class="sub-curseurs"></div>' +
      '<div class="sub-scene">' +
        '<div class="sub-calcul"></div>' +
        '<div class="sub-tableau"></div>' +
      '</div>' +
      '<div class="sub-etapes"></div>';
    var elChoix = bloc.querySelector('.sub-choix');
    var elCurseurs = bloc.querySelector('.sub-curseurs');
    var elCalcul = bloc.querySelector('.sub-calcul');
    var elTableau = bloc.querySelector('.sub-tableau');
    var elEtapes = bloc.querySelector('.sub-etapes');

    /* ==================================================================== */
    /* L'animation : des états figés, jamais des ajouts au DOM               */
    /* ==================================================================== */
    /* Le moteur rappelle `step` à CHAQUE image, et le mode pas à pas rejoue
       les étapes précédentes. Une étape qui ajouterait une phrase au DOM en
       ajouterait donc des dizaines. Chaque étape fige un ÉTAT, et `rendre`
       reconstruit tout l'affichage à partir de cet état : rejouer autant qu'on
       veut redonne exactement le même écran. */
    var phrases = [];
    var cur;

    function neuf() { return { n: 0, lignes: [], tableau: 0, v: copieV() }; }
    function copie(e) {
      return { n: e.n, lignes: e.lignes.slice(), tableau: e.tableau, v: e.v };
    }
    function pas(dur, maj) {
      maj();
      var e = copie(cur);
      return { dur: dur, step: function () { rendre(e); } };
    }
    function dire(t) { cur.n = phrases.push(t); }

    function rendre(e) {
      var html = e.lignes.map(function (l) {
        return '<div class="sub-ligne' + (l.fort ? ' forte' : '') + '">' + l.t + '</div>';
      }).join('');
      if (elCalcul.innerHTML !== html) elCalcul.innerHTML = html;

      var t = '';
      if (e.tableau) {
        var f = F(), lettre = f.lettres[0];
        var vals = tableauValeurs();
        t = '<table class="sub-tab"><tr><th>' + lettre.n + '</th>' +
            vals.map(function (x) { return '<td>' + fr(x.val) + '</td>'; }).join('') +
            '</tr><tr><th>' + f.court + '</th>' +
            vals.map(function (x, k) {
              return '<td>' + (k < e.tableau ? fr(x.res) : '…') + '</td>';
            }).join('') + '</tr></table>';
      }
      if (elTableau.innerHTML !== t) elTableau.innerHTML = t;

      var ph = phrases.slice(0, e.n).map(function (x) {
        return '<p class="sub-dit">' + x + '</p>';
      }).join('');
      if (elEtapes.innerHTML !== ph) {
        elEtapes.innerHTML = ph;
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([elEtapes]);
      }
    }

    /* Trois valeurs pour la lettre principale, en gardant les autres fixes. */
    function tableauValeurs() {
      var f = F(), l = f.lettres[0];
      var out = [], vus = {};
      [V[l.n], l.min, Math.round((l.min + l.max) / 2), l.max].forEach(function (x) {
        if (out.length >= 3 || vus[x]) return;
        vus[x] = 1;
        var v = copieV();
        v[l.n] = x;
        out.push({ val: x, res: f.f(v) });
      });
      return out;
    }

    function construitEtapes() {
      phrases = [];
      cur = neuf();
      var f = F(), v = copieV();
      var steps = [];

      steps.push(pas(900, function () {
        cur.lignes = [{ t: f.expr, fort: true }];
        dire('Voici une formule qui donne ' + f.quoi + '. Pour l\'instant elle ne donne ' +
             '<b>aucun nombre</b> : tant qu\'on ne sait pas ce que valent les lettres, elle ' +
             'attend.');
      }));

      steps.push(pas(900, function () {
        dire('Une lettre n\'est pas un mystère : <b>c\'est un nombre</b>, celui qu\'on ne ' +
             'connaît pas encore. Ici, on nous le donne : ' + valeursTxt(v) + '.');
      }));

      steps.push(pas(900, function () {
        cur.lignes = [{ t: f.expr }, { t: f.avecX, fort: true }];
        dire('<b>D\'abord, on rétablit les signes ×.</b> ' + f.cache + ' Si on l\'oublie, ' +
             'on écrira n\'importe quoi en remplaçant.');
      }));

      steps.push(pas(1100, function () {
        cur.lignes = [{ t: f.expr }, { t: f.avecX }, { t: f.subst(v), fort: true }];
        dire('<b>On substitue</b> : chaque lettre cède la place à sa valeur, ' +
             '<b>entre parenthèses</b>. Les parenthèses ne servent à rien sur un nombre ' +
             'positif — mais elles sauvent tout dès qu\'il est négatif, alors on les met ' +
             '<b>toujours</b>.');
      }));

      f.calc(v).forEach(function (c, k) {
        steps.push(pas(900, function () {
          cur.lignes = cur.lignes.concat([{ t: c.ligne, fort: true }]);
          // la ligne précédente n'est plus la vedette
          cur.lignes = cur.lignes.map(function (l, i) {
            return { t: l.t, fort: i === cur.lignes.length - 1 };
          });
          dire('Il ne reste qu\'un calcul ordinaire, dans l\'ordre des priorités : ' + c.dit +
               '.');
        }));
      });

      steps.push(pas(800, function () {
        var r = f.f(v);
        dire('<b>Résultat : ' + f.court + ' = ' + fr(r) + (f.unite ? ' ' + f.unite : '') +
             '.</b>' + (f.unite ? ' L\'unité suit la grandeur : la lettre portait un nombre, ' +
             'mais ce nombre mesurait quelque chose.' : ''));
      }));

      // le tableau : la même formule, trois valeurs
      var vals = tableauValeurs();
      vals.forEach(function (x, k) {
        steps.push(pas(k === 0 ? 700 : 500, function () {
          cur.tableau = k + 1;
          if (k === 0) {
            dire('Et si la lettre valait autre chose ? On recommence — la formule, elle, ne ' +
                 'change pas.');
          }
        }));
      });
      steps.push(pas(900, function () {
        dire('<b>Une formule n\'est pas un calcul.</b> Un calcul donne un résultat ; une ' +
             'formule en donne un <b>pour chaque valeur</b> de la lettre. C\'est pour cela ' +
             'qu\'on l\'écrit avec des lettres : elle vaut d\'un coup pour tous les nombres.');
      }));

      return steps;
    }

    /* On NE vide PAS `phrases` : le bouton « ◀ Précédent » appelle cette
       remise à zéro puis rejoue les étapes précédentes, et chaque étape ne
       retient qu'un INDICE dans ce tableau. Le vider ici, c'est effacer les
       phrases auxquelles les étapes renvoient — l'écran se reconstruisait
       muet. Il est de toute façon remis à zéro par construitEtapes() au
       début de chaque lancement. */
    function effacer() { anim.cancel(); rendre(neuf()); }
    function tout() {
      anim.cancel();
      var steps = construitEtapes();
      steps.forEach(function (s) { s.step(1); });
    }
    function jouer() { effacer(); anim.runSteps(construitEtapes(), effacer); }

    /* ==================================================================== */
    /* Les commandes                                                         */
    /* ==================================================================== */
    var minuteur = null;
    mv.onCleanup(function () { clearTimeout(minuteur); });

    var boutons = FORMULES.map(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = f.nom;
      b.onclick = function () {
        iF = i;
        chargeDefauts();
        majBoutons();
        rendreCurseurs();
        jouer();
      };
      elChoix.appendChild(b);
      return b;
    });
    function majBoutons() {
      boutons.forEach(function (b, i) { b.classList.toggle('active', i === iF); });
    }

    function rendreCurseurs() {
      elCurseurs.innerHTML = '';
      F().lettres.forEach(function (l) {
        var lab = document.createElement('label');
        var nom = document.createElement('span');
        nom.className = 'sub-nom';
        nom.textContent = l.n + ' =';
        var input = document.createElement('input');
        input.type = 'range';
        input.min = l.min; input.max = l.max; input.step = l.pas;
        input.value = V[l.n];
        var val = document.createElement('span');
        val.className = 'sub-val';
        val.textContent = fr(V[l.n]) + (l.unite ? ' ' + l.unite : '');
        input.oninput = function () {
          V[l.n] = parseFloat(input.value);
          val.textContent = fr(V[l.n]) + (l.unite ? ' ' + l.unite : '');
          tout();
          clearTimeout(minuteur);
          minuteur = setTimeout(jouer, 700);
        };
        lab.appendChild(nom); lab.appendChild(input); lab.appendChild(val);
        elCurseurs.appendChild(lab);
      });
    }

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Lancer l\'animation', onClick: jouer },
      { type: 'button', id: 'all', label: 'Tout afficher', onClick: tout },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer }
    ]);

    mv.extras.appendChild(bloc);
    majBoutons();
    rendreCurseurs();
    jouer();
  }
});
