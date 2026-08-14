/*
 * Découvrir les puissances (5ème).
 *
 * Leçon sans figure JSXGraph : tout est en HTML dans mv.extras, et le moteur
 * d'animation partagé fait avancer les deux colonnes en parallèle.
 *
 * ---------------------------------------------------------------------------
 * Une notation qui ne s'invente pas : elle se déduit
 * ---------------------------------------------------------------------------
 * La puissance n'est pas une notation de plus à mémoriser, c'est le MÊME
 * raccourci qu'on connaît déjà, appliqué un cran plus haut :
 *
 *     une addition répétée s'abrège en MULTIPLICATION   3 + 3 + 3 + 3 = 4 × 3
 *     une multiplication répétée s'abrège en PUISSANCE   3 × 3 × 3 × 3 = 3⁴
 *
 * D'où les deux colonnes de l'animation, qui avancent ligne à ligne côte à
 * côte. L'élève ne découvre pas une règle, il reconnaît une habitude.
 *
 * ---------------------------------------------------------------------------
 * Le décalage qu'il faut nommer
 * ---------------------------------------------------------------------------
 * Dans « 4 × 3 », le nombre répété est le SECOND (on dit « 4 fois 3 »). Dans
 * « 3⁴ », le nombre répété est le PREMIER, et c'est le second — l'exposant —
 * qui compte les facteurs. Les deux écritures ne rangent donc pas leurs
 * nombres dans le même ordre, et c'est exactement ce qui fait écrire 3 × 4 à
 * la place de 3⁴. La leçon met les deux résultats côte à côte : 12 et 81.
 *
 * ---------------------------------------------------------------------------
 * Aucun flottant, et des nombres qui restent lisibles
 * ---------------------------------------------------------------------------
 * Tout est entier. Les bases et les exposants sont tirés pour que le résultat
 * reste sous le millier — au-delà, on ne lit plus rien et l'élève décroche.
 * Les puissances de 10 font exception : c'est justement leur taille qu'on veut
 * montrer, et elles s'écrivent exactement (1 suivi de n zéros), sans jamais
 * passer par un calcul en virgule flottante.
 */
MathsView.register({
  id: 'puissances',
  title: 'Découvrir les puissances',
  level: '5eme',
  category: 'calcul',
  subcategory: 'Nombres entiers',
  theme: 'Nombres — la puissance, une multiplication répétée',
  exercices: ['puissances'],
  description:
    'Une <strong>addition répétée</strong> s\'écrit en abrégé avec une multiplication : ' +
    '\\( 3 + 3 + 3 + 3 = 4 \\times 3 \\). De la même façon, une <strong>multiplication ' +
    'répétée</strong> s\'écrit en abrégé avec une <strong>puissance</strong> : ' +
    '\\( 3 \\times 3 \\times 3 \\times 3 = 3^4 \\). ' +
    '<br>Clique sur <strong>Lancer l\'animation</strong> : les deux colonnes avancent côte à ' +
    'côte, et l\'on voit que c\'est deux fois le même raccourci. ' +
    '<br>Les trois boutons changent de sujet : le parallèle, le vocabulaire (base, exposant), ' +
    'et les <strong>puissances de 10</strong>.',
  notes:
    '<p><strong>La notation.</strong> \\( a^n \\) se lit « \\( a \\) puissance \\( n \\) ». ' +
    'C\'est le produit de \\( n \\) facteurs tous égaux à \\( a \\) :</p>' +
    '<ul>' +
    '<li>\\( a \\) est la <strong>base</strong> — le nombre qu\'on répète ;</li>' +
    '<li>\\( n \\) est l\'<strong>exposant</strong> — il <em>compte</em> les facteurs, il ne se ' +
    'multiplie pas.</li>' +
    '</ul>' +
    '<p><strong>Le piège à ne pas manquer.</strong> \\( 3^4 \\neq 3 \\times 4 \\). ' +
    '\\( 3^4 = 3 \\times 3 \\times 3 \\times 3 = 81 \\), alors que \\( 3 \\times 4 = 12 \\). ' +
    'L\'exposant n\'est pas un facteur : c\'est un compteur.</p>' +
    '<p><strong>Deux lectures particulières.</strong> \\( a^2 \\) se lit « \\( a \\) au ' +
    '<strong>carré</strong> » (c\'est l\'aire d\'un carré de côté \\( a \\)), et \\( a^3 \\) ' +
    '« \\( a \\) au <strong>cube</strong> » (le volume d\'un cube d\'arête \\( a \\)). ' +
    'Et \\( a^1 = a \\) : un seul facteur, donc le nombre lui-même.</p>' +
    '<p><strong>Les puissances de 10</strong> sont les plus faciles : ' +
    '\\( 10^n \\) s\'écrit <strong>1 suivi de \\( n \\) zéros</strong>. ' +
    '\\( 10^2 = 100 \\), \\( 10^3 = 1\\,000 \\), \\( 10^6 = 1\\,000\\,000 \\). ' +
    'C\'est ce qui permet d\'écrire commodément les très grands nombres.</p>' +
    '<p><strong>Les carrés à connaître par cœur</strong>, de 0 à 12 : ' +
    '0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144. Ils reviennent partout — en géométrie, ' +
    'dans les aires, et plus tard avec le théorème de Pythagore.</p>' +
    '<p>Attention enfin à l\'ordre : \\( 2^3 = 8 \\) mais \\( 3^2 = 9 \\). La base et ' +
    'l\'exposant ne jouent pas le même rôle, on ne peut pas les échanger.</p>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();   // leçon sans figure

    /* ==================================================================== */
    /* Les nombres : entiers, et écrits à la française                       */
    /* ==================================================================== */
    // Un espace fine insécable tous les trois chiffres : 1 000 000.
    function fr(n) {
      var s = String(n), out = '', c = 0, i;
      for (i = s.length - 1; i >= 0; i--) {
        out = s.charAt(i) + out;
        if (++c % 3 === 0 && i > 0) out = '&nbsp;' + out;
      }
      return out;
    }
    function puissance(a, n) {                 // entier exact, n petit
      var r = 1;
      for (var i = 0; i < n; i++) r *= a;
      return r;
    }
    function pow(a, n) { return '<span class="pui-base">' + a + '</span><sup class="pui-exp">' +
      n + '</sup>'; }

    /* ==================================================================== */
    /* Les cas                                                               */
    /* ==================================================================== */
    var CAS = [
      { cle: 'parallele', nom: 'Le même raccourci, deux fois' },
      { cle: 'lire', nom: 'Base, exposant, lecture' },
      { cle: 'dix', nom: 'Les puissances de 10' }
    ];
    var cas = 'parallele';
    var A = 3, N = 4;                          // la base et l'exposant courants

    function ent(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

    function tirer() {
      if (cas === 'dix') { A = 10; N = ent(2, 7); return; }
      // Une base et un exposant qui gardent le résultat lisible, et surtout
      // DIFFÉRENTS l'un de l'autre : avec 4 et 4, on ne voit plus lequel est
      // répété et lequel compte, et « si l'on échangeait les deux nombres »
      // ne veut plus rien dire.
      for (var i = 0; i < 300; i++) {
        A = ent(2, 7); N = ent(2, 5);
        if (A !== N && puissance(A, N) <= 1300) return;
      }
      A = 3; N = 4;
    }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'pui-ui';
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

    /* ==================================================================== */
    /* Le dessin des deux colonnes                                           */
    /* ==================================================================== */
    // e.lignes : combien de lignes sont révélées (0 à 4) dans chaque colonne.
    function duo(e) {
      var repAdd = [], repMul = [], i;
      for (i = 0; i < N; i++) { repAdd.push(A); repMul.push(A); }
      function col(cls, titre, lignes) {
        return '<div class="pui-col ' + cls + '"><div class="pui-col-titre">' + titre +
               '</div>' + lignes.join('') + '</div>';
      }
      function ligne(txt, pale) {
        return '<div class="pui-ligne' + (pale ? ' pale' : '') + '">' + txt + '</div>';
      }
      var gauche = [], droite = [];
      if (e.lignes >= 1) {
        gauche.push(ligne(repAdd.join(' + ')));
        droite.push(ligne(repMul.join(' × ')));
      }
      if (e.lignes >= 2) {
        var cpt = '<span class="pui-accolade">' + N + ' fois le nombre ' + A + '</span>';
        var cpt2 = '<span class="pui-accolade">' + N + ' facteurs égaux à ' + A + '</span>';
        gauche.push('<div>' + cpt + '</div>');
        droite.push('<div>' + cpt2 + '</div>');
      }
      if (e.lignes >= 3) {
        gauche.push(ligne('= ' + N + ' × ' + A));
        droite.push(ligne('= ' + pow(A, N)));
      }
      if (e.lignes >= 4) {
        gauche.push(ligne('= <span class="pui-res">' + fr(N * A) + '</span>'));
        droite.push(ligne('= <span class="pui-res">' + fr(puissance(A, N)) + '</span>'));
      }
      return '<div class="pui-duo">' +
        col('add', 'Une addition répétée', gauche) +
        col('mul', 'Une multiplication répétée', droite) + '</div>';
    }

    // La puissance en grand, avec ses deux rôles nommés.
    function grand(e) {
      var s = '<div class="pui-grand">' + pow(A, N) +
        (e.egal ? ' = ' + repete(e) : '') +
        (e.valeur ? ' = <span class="pui-res">' + fr(puissance(A, N)) + '</span>' : '') +
        '</div>';
      if (e.legende) {
        s += '<div class="pui-legende"><b class="b">' + A + '</b> est la <b class="b">base</b> ' +
             '— le nombre qu\'on répète. &nbsp;·&nbsp; <b class="e">' + N +
             '</b> est l\'<b class="e">exposant</b> — il compte les facteurs.</div>';
      }
      return s;
    }
    function repete(e) {
      var t = [];
      for (var i = 0; i < N; i++) t.push(A);
      return t.join(' × ');
    }

    // Le tableau des puissances de 10, révélé ligne à ligne.
    function tableDix(e) {
      var l = ['<table class="pui-table">'];
      for (var k = 1; k <= 7; k++) {
        var vu = k <= e.dix;
        l.push('<tr><td class="tete">' + pow(10, k) + '</td>' +
               '<td class="' + (vu ? 'vu' : '') + '">' + (vu ? fr(puissance(10, k)) : '…') +
               '</td>' +
               '<td class="' + (vu ? 'vu' : '') + '">' + (vu ? '1 suivi de ' + k + ' zéro' +
                 (k > 1 ? 's' : '') : '…') + '</td></tr>');
      }
      l.push('</table>');
      return l.join('');
    }

    /* ==================================================================== */
    /* Les étapes : des ÉTATS figés, jamais des actions                     */
    /* ==================================================================== */
    var phrases = [];
    function rendre(e) {
      elCorps.innerHTML = cas === 'parallele' ? duo(e)
                        : cas === 'lire' ? grand(e)
                        : tableDix(e);
      elEtapes.innerHTML = phrases.slice(0, e.n).map(function (t) {
        return '<div class="pui-etape">' + t + '</div>';
      }).join('');
      elConcl.style.visibility = e.concl ? 'visible' : 'hidden';
      elConcl.innerHTML = e.concl || '&nbsp;';
    }

    var anim = mv.createAnimator();
    var cur = null;
    function neuf() { return { n: 0, lignes: 0, egal: false, valeur: false, legende: false,
                               dix: 0, concl: null }; }
    function copie(e) { return { n: e.n, lignes: e.lignes, egal: e.egal, valeur: e.valeur,
                                 legende: e.legende, dix: e.dix, concl: e.concl }; }
    function pas(dur, maj) { maj(); var e = copie(cur); return { dur: dur, step: function () { rendre(e); } }; }
    function dire(t) { cur.n = phrases.push(t); }

    function construitEtapes() {
      phrases = [];
      cur = neuf();
      var steps = [];
      var val = puissance(A, N), prod = N * A;

      if (cas === 'parallele') {
        steps.push(pas(900, function () {
          cur.lignes = 1;
          dire('À gauche, on additionne <b>' + N + ' fois</b> le nombre ' + A + '. À droite, on ' +
               'le <b>multiplie</b> ' + N + ' fois par lui-même. Deux écritures longues, et ' +
               'toutes les deux répétitives.');
        }));
        steps.push(pas(900, function () {
          cur.lignes = 2;
          dire('Dans les deux cas, ce qui compte, c\'est <b>quel nombre</b> on répète et ' +
               '<b>combien de fois</b>.');
        }));
        steps.push(pas(1000, function () {
          cur.lignes = 3;
          dire('À gauche, on abrège avec une <b>multiplication</b> : ' + N + ' × ' + A + '. ' +
               'À droite, on abrège de la même façon, avec une <b>puissance</b> : ' + pow(A, N) +
               ' — le nombre répété en bas, le nombre de fois en petit, en haut.');
        }));
        steps.push(pas(1000, function () {
          cur.lignes = 4;
          dire('On calcule : ' + N + ' × ' + A + ' = <b>' + fr(prod) + '</b> d\'un côté, ' +
               pow(A, N) + ' = ' + fr(val) + ' de l\'autre.');
        }));
        steps.push(pas(1000, function () {
          dire('<span class="piege">Attention :</span> ' + pow(A, N) + ' n\'est pas ' + A +
               ' × ' + N + '. Ici ' + A + ' × ' + N + ' = ' + fr(prod) + ', alors que ' +
               pow(A, N) + ' = <b>' + fr(val) + '</b>. L\'exposant ne se multiplie pas : ' +
               'il <b>compte</b> les facteurs.');
          cur.concl = pow(A, N) + ' = ' + repete({}) + ' = ' + fr(val);
        }));
        return steps;
      }

      if (cas === 'lire') {
        steps.push(pas(900, function () {
          dire('On lit ' + pow(A, N) + ' : « <b>' + A + ' puissance ' + N + '</b> »' +
               (N === 2 ? ', ou « ' + A + ' au <b>carré</b> »'
                        : (N === 3 ? ', ou « ' + A + ' au <b>cube</b> »' : '')) + '.');
        }));
        steps.push(pas(900, function () {
          cur.legende = true;
          dire('Les deux nombres n\'ont pas le même rôle : celui du bas est le nombre qu\'on ' +
               'répète, celui du haut dit <b>combien de fois</b>.');
        }));
        steps.push(pas(1000, function () {
          cur.egal = true;
          dire('On <b>développe</b> : on écrit ' + N + ' facteurs, tous égaux à ' + A + '.');
        }));
        steps.push(pas(1000, function () {
          cur.valeur = true;
          dire('Puis on calcule, de gauche à droite : ' + detail() + '.');
          cur.concl = pow(A, N) + ' = ' + fr(val);
        }));
        steps.push(pas(900, function () {
          dire('Si l\'on échangeait les deux nombres, on obtiendrait ' + pow(N, A) + ' = ' +
               fr(puissance(N, A)) + (puissance(N, A) === val
                 ? ' — ici c\'est la même chose, mais c\'est un hasard.'
                 : ' : ce n\'est <b>pas</b> le même nombre. La base et l\'exposant ne ' +
                   's\'échangent pas.'));
        }));
        return steps;
      }

      // Les puissances de 10, une ligne après l'autre.
      steps.push(pas(800, function () {
        cur.dix = 1;
        dire('Avec la base <b>10</b>, tout devient limpide : ' + pow(10, 1) + ' = 10.');
      }));
      steps.push(pas(800, function () {
        cur.dix = 3;
        dire(pow(10, 2) + ' = 10 × 10 = <b>100</b>, et ' + pow(10, 3) + ' = 10 × 10 × 10 = ' +
             '<b>1&nbsp;000</b>. À chaque facteur 10, un <b>zéro</b> de plus.');
      }));
      steps.push(pas(900, function () {
        cur.dix = 7;
        dire('La règle se lit dans le tableau : ' + pow(10, 'n') + ' s\'écrit <b>1 suivi de n ' +
             'zéros</b>. L\'exposant, c\'est le nombre de zéros.');
      }));
      steps.push(pas(900, function () {
        dire('C\'est ce qui rend les grands nombres commodes à écrire : un million, c\'est ' +
             pow(10, 6) + ', et l\'on n\'a pas à compter les zéros un par un.');
        cur.concl = pow(10, N) + ' = ' + fr(puissance(10, N)) + ' &nbsp;(1 suivi de ' + N +
                    ' zéros)';
      }));
      return steps;
    }

    // Le calcul pas à pas, de gauche à droite.
    function detail() {
      var r = A, t = String(A);
      for (var i = 1; i < N; i++) { r *= A; t += ' × ' + A + ' = ' + fr(r); }
      return t;
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
      { type: 'button', id: 'autre', label: '🎲 Autres nombres',
        onClick: function () { tirer(); jouer(); } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer }
    ]);

    choisir('parallele');
  }
});
