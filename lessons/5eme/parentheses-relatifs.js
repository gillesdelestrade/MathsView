/*
 * Quand les parenthèses sont-elles indispensables ? (5ème)
 *
 * Leçon sans figure : mv.hideBoard(), tout est en HTML dans mv.extras, et le
 * moteur d'animation partagé fait avancer l'examen étape par étape.
 *
 * ---------------------------------------------------------------------------
 * Le même signe « ( » joue DEUX rôles
 * ---------------------------------------------------------------------------
 * C'est toute la difficulté du chapitre, et elle est rarement dite :
 *
 *   PARENTHÈSE DE SIGNE — elle enferme un nombre relatif, comme dans (−3).
 *     Elle est indispensable exactement quand elle suit un symbole
 *     d'opération : on n'écrit jamais deux symboles à la suite, donc
 *     « 5 + −3 » est interdit alors que « −3 + 5 » se passe très bien de
 *     parenthèses.
 *
 *   PARENTHÈSE DE PRIORITÉ — elle force un calcul à passer en premier, comme
 *     dans (5 − 8) × 2. Elle est indispensable exactement quand l'enlever
 *     CHANGE LE RÉSULTAT. Devant un × elle sert toujours ; derrière un +, ou
 *     autour d'une multiplication déjà prioritaire, elle ne sert à rien.
 *
 * Deux rôles, deux critères — et dans les deux cas un critère qu'on peut
 * VÉRIFIER au lieu de le sentir. C'est ce que fait l'animation : elle enlève
 * la parenthèse et regarde ce qui se passe.
 *
 * ---------------------------------------------------------------------------
 * Rien n'est écrit à l'avance
 * ---------------------------------------------------------------------------
 * Le verdict n'est pas rangé dans une table à côté de chaque exemple : il est
 * CALCULÉ. L'écriture est un tableau de jetons ; on retire la paire visée, on
 * teste si l'écriture obtenue est licite (deux symboles côte à côte, c'est
 * interdit), puis on évalue les deux écritures et on les compare. Ajouter un
 * exemple ne demande donc jamais de dire soi-même s'il est indispensable —
 * et l'on ne risque pas de se tromper en le disant.
 *
 * Les valeurs sont des ENTIERS : les nombres sont tirés entiers et il n'y a ni
 * division ni décimale, si bien qu'aucun arrondi ne peut fausser la comparaison
 * des deux résultats.
 */
MathsView.register({
  id: 'parentheses-relatifs',
  title: 'Les parenthèses sont-elles indispensables ?',
  level: '5eme',
  category: 'calcul',
  subcategory: 'Nombres relatifs',
  theme: 'Nombres — le rôle des parenthèses dans une écriture',
  exercices: ['parentheses'],
  description:
    'Dans une écriture avec des nombres relatifs, les parenthèses ne servent pas toutes à la ' +
    'même chose — et elles ne sont pas toutes <strong>indispensables</strong>. ' +
    '<br>Clique sur <strong>Lancer l\'animation</strong> : chaque paire de parenthèses est ' +
    'examinée à son tour. On dit à quoi elle sert, on l\'<strong>enlève pour voir</strong>, et ' +
    'on tranche — soit l\'écriture obtenue est <strong>interdite</strong>, soit elle ne donne ' +
    '<strong>plus le même résultat</strong>, soit elle est parfaitement correcte et les ' +
    'parenthèses n\'étaient pas nécessaires.',
  notes:
    '<p><strong>Deux rôles bien différents.</strong></p>' +
    '<ul>' +
    '<li><strong>Parenthèse de signe</strong> : elle enferme un nombre relatif, comme dans ' +
    '\\( (-3) \\). Elle est <strong>indispensable après un symbole d\'opération</strong>, parce ' +
    'qu\'on n\'écrit jamais <strong>deux symboles à la suite</strong> : \\( 5 + (-3) \\) et non ' +
    '« \\( 5 + -3 \\) ». En début d\'écriture, en revanche, elle est inutile : on écrit ' +
    '\\( -3 + 5 \\).</li>' +
    '<li><strong>Parenthèse de priorité</strong> : elle force un calcul à passer en premier, ' +
    'comme dans \\( (5 - 8) \\times 2 \\). Elle est <strong>indispensable quand l\'enlever ' +
    'change le résultat</strong>.</li>' +
    '</ul>' +
    '<p><strong>Le test, dans les deux cas :</strong> on enlève les parenthèses et on regarde. ' +
    'Si l\'écriture devient interdite, ou si le résultat change, elles étaient indispensables.</p>' +
    '<ul>' +
    '<li>On peut <strong>simplifier</strong> une écriture en supprimant les parenthèses de ' +
    'signe, à condition d\'ajuster : \\( a + (-b) = a - b \\), \\( a - (-b) = a + b \\), ' +
    '\\( a + (+b) = a + b \\), \\( a - (+b) = a - b \\).</li>' +
    '<li>Autour d\'une <strong>multiplication</strong>, les parenthèses ne servent à rien : ' +
    '\\( 7 + (3 \\times 2) \\) s\'écrit \\( 7 + 3 \\times 2 \\), la multiplication étant déjà ' +
    'prioritaire.</li>' +
    '<li><strong>Derrière un signe −, elles changent tout :</strong> \\( 8 - (3 - 5) = 10 \\) ' +
    'alors que \\( 8 - 3 - 5 = 0 \\).</li>' +
    '<li>Des parenthèses qui ne sont pas indispensables ne sont pas pour autant interdites : on ' +
    'a le droit de les garder pour y voir plus clair.</li>' +
    '</ul>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();   // leçon sans figure

    /* ==================================================================== */
    /* L'écriture, en jetons                                                */
    /* ==================================================================== */
    // { t:'nb', v:3, signe:true }   un nombre, écrit avec un signe devant ou non
    // { t:'op', v:'+' }             un symbole d'opération
    // { t:'(', id:k } / { t:')', id:k }   une paire de parenthèses
    function nb(v, signe) { return { t: 'nb', v: v, signe: !!signe }; }
    function op(v) { return { t: 'op', v: v }; }
    function paire(id, dedans) {
      return [{ t: '(', id: id }].concat(dedans, [{ t: ')', id: id }]);
    }

    // Le vrai signe « moins » (U+2212), jamais le trait d'union du clavier.
    function fmtV(n) { return String(n).replace('-', '−'); }

    function txtNb(j) {
      var s = String(Math.abs(j.v));
      if (j.v < 0) return '−' + s;
      return j.signe ? '+' + s : s;
    }

    // L'écriture en HTML. `vise` surligne une paire, `sans` la retire.
    function ecrit(jetons, vise) {
      var out = [], i, j, ouvert = false;
      for (i = 0; i < jetons.length; i++) {
        j = jetons[i];
        if (j.t === '(') {
          if (j.id === vise) { out.push('<span class="vise">'); ouvert = true; }
          out.push('<span class="ptn-par">(</span>');
        } else if (j.t === ')') {
          out.push('<span class="ptn-par">)</span>');
          if (j.id === vise && ouvert) { out.push('</span>'); ouvert = false; }
        } else if (j.t === 'op') {
          out.push(' <span class="ptn-op">' + j.v + '</span> ');
        } else {
          out.push('<span class="' + (j.v < 0 ? 'ptn-neg' : '') + '">' + txtNb(j) + '</span>');
        }
      }
      return out.join('');
    }

    // L'écriture obtenue en retirant une paire de parenthèses.
    function sansPaire(jetons, id) {
      return jetons.filter(function (j) {
        return !((j.t === '(' || j.t === ')') && j.id === id);
      });
    }

    /* ==================================================================== */
    /* Le critère 1 : une écriture est-elle licite ?                        */
    /* ==================================================================== */
    // La règle de cinquième : on n'écrit jamais deux symboles à la suite.
    // Un nombre écrit AVEC son signe juste après un symbole d'opération, c'est
    // exactement ce cas-là.
    function faute(jetons) {
      for (var i = 1; i < jetons.length; i++) {
        var av = jetons[i - 1], j = jetons[i];
        if (av.t === 'op' && j.t === 'nb' && (j.signe || j.v < 0)) return i;
        if (av.t === 'op' && j.t === 'op') return i;
      }
      return -1;
    }
    // La même écriture, avec les deux symboles fautifs mis en évidence.
    function ecritFaute(jetons, i) {
      var out = [], k;
      for (k = 0; k < jetons.length; k++) {
        var j = jetons[k], t;
        if (j.t === '(') t = '<span class="ptn-par">(</span>';
        else if (j.t === ')') t = '<span class="ptn-par">)</span>';
        else if (j.t === 'op') t = ' ' + j.v + ' ';
        else t = txtNb(j);
        out.push(k === i || k === i - 1 ? '<span class="ptn-faute">' + t + '</span>' : t);
      }
      return out.join('');
    }

    /* ==================================================================== */
    /* Le critère 2 : la valeur de l'écriture                               */
    /* ==================================================================== */
    // Analyse descendante : somme de produits, avec les parenthèses.
    function valeur(jetons) {
      var i = 0;
      function facteur() {
        var j = jetons[i];
        if (j.t === '(') {
          i++;
          var v = somme();
          i++;                                   // la parenthèse fermante
          return v;
        }
        i++;
        return j.v;
      }
      function produit() {
        var v = facteur();
        while (i < jetons.length && jetons[i].t === 'op' &&
               (jetons[i].v === '×' || jetons[i].v === '÷')) {
          var o = jetons[i].v; i++;
          var w = facteur();
          v = o === '×' ? v * w : v / w;
        }
        return v;
      }
      function somme() {
        var v = produit();
        while (i < jetons.length && jetons[i].t === 'op' &&
               (jetons[i].v === '+' || jetons[i].v === '−')) {
          var o = jetons[i].v; i++;
          var w = produit();
          v = o === '+' ? v + w : v - w;
        }
        return v;
      }
      return somme();
    }

    /* ==================================================================== */
    /* Le verdict, pour une paire donnée : CALCULÉ, jamais écrit d'avance   */
    /* ==================================================================== */
    function examine(jetons, id) {
      var sans = sansPaire(jetons, id);
      var f = faute(sans);
      if (f >= 0) {
        return { indispensable: true, cause: 'interdite', sans: sans, faute: f };
      }
      var v1 = valeur(jetons), v2 = valeur(sans);
      if (v1 !== v2) {
        return { indispensable: true, cause: 'valeur', sans: sans, v1: v1, v2: v2 };
      }
      return { indispensable: false, cause: 'inutile', sans: sans, v1: v1 };
    }

    // À quoi sert cette paire : à enfermer un nombre relatif, ou à forcer un
    // ordre de calcul ? Le contenu le dit — un seul nombre, ou tout un calcul.
    function role(jetons, id) {
      var dedans = 0, dans = false, i;
      for (i = 0; i < jetons.length; i++) {
        if (jetons[i].t === '(' && jetons[i].id === id) { dans = true; continue; }
        if (jetons[i].t === ')' && jetons[i].id === id) break;
        if (dans) dedans++;
      }
      return dedans === 1 ? 'signe' : 'priorite';
    }
    // Le symbole qui précède la paire (null si elle ouvre l'écriture).
    function avant(jetons, id) {
      for (var i = 0; i < jetons.length; i++) {
        if (jetons[i].t === '(' && jetons[i].id === id) return i === 0 ? null : jetons[i - 1];
      }
      return null;
    }

    /* ==================================================================== */
    /* Les écritures étudiées                                               */
    /* ==================================================================== */
    function ent(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
    // Deux entiers distincts : une parenthèse dont le contenu vaut 0 ferait un
    // exemple bancal, même si le verdict resterait juste.
    function ent2(min, max, autre) {
      var v = ent(min, max);
      for (var i = 0; i < 40 && v === autre; i++) v = ent(min, max);
      return v === autre ? (v < max ? v + 1 : v - 1) : v;
    }
    function pick(t) { return t[Math.floor(Math.random() * t.length)]; }

    // Chaque modèle rend un tableau de jetons. Les identifiants de paires sont
    // 1, 2, … dans l'ordre où on veut les examiner.
    var MODELES = {
      signe: [
        function () { var a = ent(2, 15), b = ent(2, 12);
          return [nb(a), op(pick(['+', '−']))].concat(paire(1, [nb(-b)])); },
        function () { var a = ent(2, 15), b = ent(2, 12);
          return [nb(a), op('+')].concat(paire(1, [nb(b, true)])); },
        function () { var a = ent(2, 9), b = ent(2, 9);
          return [nb(a), op('×')].concat(paire(1, [nb(-b)])); },
        function () { var a = ent(2, 12), b = ent(2, 15);
          return paire(1, [nb(-a)]).concat([op(pick(['+', '−'])), nb(b)]); },
        function () { var a = ent(2, 12), b = ent(2, 15);
          return paire(1, [nb(a, true)]).concat([op('+'), nb(b)]); }
      ],
      priorite: [
        function () { var a = ent(5, 18), b = ent(2, 9), c = ent2(2, 9, b);
          return [nb(a), op('−')].concat(paire(1, [nb(b), op('−'), nb(c)])); },
        function () { var a = ent(5, 18), b = ent(2, 9), c = ent2(2, 9, b);
          return [nb(a), op('+')].concat(paire(1, [nb(b), op('−'), nb(c)])); },
        function () { var a = ent(2, 12), b = ent2(2, 9, a), c = ent(2, 6);
          return paire(1, [nb(a), op('−'), nb(b)]).concat([op('×'), nb(c)]); },
        function () { var a = ent(2, 12), b = ent(2, 9), c = ent(2, 6);
          return [nb(a), op('+')].concat(paire(1, [nb(b), op('×'), nb(c)])); },
        function () { var a = ent(3, 15), b = ent2(2, 9, a), c = ent(2, 9);
          return paire(1, [nb(a), op('−'), nb(b)]).concat([op('−'), nb(c)]); },
        function () { var a = ent(2, 9), b = ent(3, 12), c = ent2(2, 9, b);
          return [nb(a), op('×')].concat(paire(1, [nb(b), op('−'), nb(c)])); }
      ],
      // Deux paires dans la même écriture, une de chaque rôle.
      melange: [
        function () { var a = ent(2, 12), b = ent(2, 9), c = ent2(2, 9, b);
          return paire(1, [nb(-a)]).concat([op('−')], paire(2, [nb(b), op('−'), nb(c)])); },
        function () { var a = ent(3, 15), b = ent(2, 9), c = ent(2, 6);
          return [nb(a), op('+')].concat(paire(1, [nb(-b)]), [op('×')], paire(2, [nb(c), op('+'), nb(2)])); },
        function () { var a = ent(2, 9), b = ent2(2, 12, a), c = ent(2, 9);
          return paire(1, [nb(a), op('−'), nb(b)]).concat([op('×')], paire(2, [nb(-c)])); }
      ]
    };

    var CAS = [
      { cle: 'signe', nom: 'Parenthèses de signe' },
      { cle: 'priorite', nom: 'Parenthèses de priorité' },
      { cle: 'melange', nom: 'Les deux à la fois' }
    ];
    var cas = 'signe';
    var jetons = [];
    function ids(js) {
      var r = [];
      js.forEach(function (j) { if (j.t === '(' && r.indexOf(j.id) < 0) r.push(j.id); });
      return r.sort();
    }

    function tirer() { jetons = pick(MODELES[cas])(); }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'ptn-ui';
    root.innerHTML =
      '<div class="ptn-cas"></div>' +
      '<div class="ptn-expr"></div>' +
      '<div class="ptn-etapes"></div>' +
      '<div class="ptn-essai ptn-expr"></div>' +
      '<div><span class="ptn-verdict" style="visibility:hidden">&nbsp;</span></div>' +
      '<div class="ptn-bilan"></div>';
    var elCas = root.querySelector('.ptn-cas');
    var elExpr = root.querySelector('.ptn-expr');
    var elEtapes = root.querySelector('.ptn-etapes');
    var elEssai = root.querySelector('.ptn-essai');
    var elVerdict = root.querySelector('.ptn-verdict');
    var elBilan = root.querySelector('.ptn-bilan');
    mv.extras.appendChild(root);

    /* ==================================================================== */
    /* Les étapes : des ÉTATS figés, jamais des actions                     */
    /* ==================================================================== */
    // Le moteur rappelle step(p) à chaque image et le pas à pas rejoue les
    // étapes précédentes : une étape qui ajouterait du HTML l'ajouterait
    // quarante fois. Tout est donc reconstruit depuis un instantané.
    var phrases = [];
    function rendre(e) {
      elExpr.innerHTML = ecrit(jetons, e.vise);
      elEtapes.innerHTML = phrases.slice(0, e.n).map(function (t) {
        return '<div class="ptn-etape">' + t + '</div>';
      }).join('');
      elEssai.innerHTML = e.essai || '';
      elVerdict.style.visibility = e.verdict ? 'visible' : 'hidden';
      elVerdict.className = 'ptn-verdict ' + (e.oui ? 'oui' : 'non');
      elVerdict.innerHTML = e.verdict || '&nbsp;';
      elBilan.innerHTML = e.bilan || '';
    }

    var anim = mv.createAnimator();
    var cur = null;
    function neuf() {
      return { n: 0, vise: null, essai: '', verdict: '', oui: false, bilan: '' };
    }
    function copie(e) {
      return { n: e.n, vise: e.vise, essai: e.essai, verdict: e.verdict,
               oui: e.oui, bilan: e.bilan };
    }
    function pas(dur, maj) {
      maj();
      var e = copie(cur);
      return { dur: dur, step: function () { rendre(e); } };
    }
    function dire(t) { cur.n = phrases.push(t); }

    function construitEtapes() {
      phrases = [];
      cur = neuf();
      var steps = [], liste = ids(jetons), bilan = [];

      steps.push(pas(700, function () {
        dire('Cette écriture contient <b>' + (liste.length > 1 ? liste.length + ' paires' :
             'une paire') + '</b> de parenthèses. Pour chacune, on va se demander si elle est ' +
             '<b>indispensable</b> — et pour le savoir, on va tout simplement l\'enlever.');
      }));

      liste.forEach(function (id, rang) {
        var r = role(jetons, id), av = avant(jetons, id), v = examine(jetons, id);
        // Quand il y a deux paires, on les nomme : sans cela la même phrase
        // reviendrait deux fois dans le raisonnement.
        var laquelle = liste.length > 1 ? (rang === 0 ? 'la <b>première</b> paire'
                                                      : 'la <b>seconde</b> paire') : 'la paire';

        // 1. de quoi s'agit-il ?
        steps.push(pas(800, function () {
          cur.vise = id;
          cur.essai = '';
          cur.verdict = '';
          dire(r === 'signe'
            ? 'On regarde ' + laquelle + ' : elle enferme <b>un seul nombre</b>, c\'est une ' +
              '<b>parenthèse de signe</b>, ' +
              'elle sert à écrire un nombre relatif.'
            : 'On regarde ' + laquelle + ' : elle enferme <b>tout un calcul</b>, c\'est une ' +
              '<b>parenthèse de priorité</b>, elle sert à le faire passer en premier.');
        }));

        // 2. on l'enlève pour voir
        steps.push(pas(800, function () {
          dire('On enlève ' + laquelle + ', et on regarde ce qu\'on obtient :');
          cur.essai = v.cause === 'interdite'
            ? ecritFaute(v.sans, v.faute)
            : ecrit(v.sans, null);
        }));

        // 3. le verdict
        steps.push(pas(900, function () {
          if (v.cause === 'interdite') {
            dire('Deux <b>symboles</b> se retrouvent côte à côte, et cela ne s\'écrit pas. ' +
                 (av ? 'Après le signe <b>' + av.v + '</b>, un nombre relatif doit garder ses ' +
                       'parenthèses.' : ''));
            cur.verdict = 'Parenthèses INDISPENSABLES';
            cur.oui = true;
            bilan.push('la paire de ' + (r === 'signe' ? 'signe' : 'priorité') +
                       ' est <b>indispensable</b> : sans elle l\'écriture est interdite');
          } else if (v.cause === 'valeur') {
            dire('L\'écriture reste correcte, mais elle ne vaut plus la même chose : ' +
                 '<b>' + fmtV(v.v1) + '</b> d\'un côté, <b>' + fmtV(v.v2) +
                 '</b> de l\'autre.');
            cur.verdict = 'Parenthèses INDISPENSABLES';
            cur.oui = true;
            bilan.push('la paire de priorité est <b>indispensable</b> : sans elle le résultat ' +
                       'passe de ' + fmtV(v.v1) + ' à ' + fmtV(v.v2));
          } else {
            dire('L\'écriture obtenue est <b>correcte</b>, et elle vaut toujours <b>' +
                 fmtV(v.v1) + '</b> : ces parenthèses ne servaient à rien.' +
                 (r === 'signe' && !av
                   ? ' Un nombre relatif placé en <b>début</b> d\'écriture n\'a pas besoin de ' +
                     'parenthèses.'
                   : r === 'priorite'
                     ? ' On peut les enlever sans rien changer.' : ''));
            cur.verdict = 'Parenthèses inutiles';
            cur.oui = false;
            bilan.push('la paire de ' + (r === 'signe' ? 'signe' : 'priorité') +
                       ' n\'est <b>pas indispensable</b> : on peut l\'enlever');
          }
        }));
      });

      // Le bilan, à la fin.
      steps.push(pas(600, function () {
        cur.vise = null;
        cur.essai = '';
        cur.verdict = '';
        cur.bilan = '<b>Bilan.</b><ul><li>' + bilan.join('</li><li>') + '</li></ul>';
      }));
      return steps;
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
    function effacer() {
      anim.cancel();
      rendre(neuf());
    }
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
      { type: 'button', id: 'autre', label: '🎲 Autre écriture',
        onClick: function () { tirer(); jouer(); } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer }
    ]);

    choisir('signe');
  }
});
