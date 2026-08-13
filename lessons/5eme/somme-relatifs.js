/*
 * Additionner et soustraire des nombres décimaux relatifs (5ème).
 *
 * Leçon sans figure : mv.hideBoard(), tout est en HTML dans mv.extras, et le
 * moteur d'animation partagé fait avancer le calcul étape par étape.
 *
 * ---------------------------------------------------------------------------
 * Ce que l'animation montre, et pourquoi
 * ---------------------------------------------------------------------------
 * Une somme de relatifs se joue en DEUX temps, et l'élève qui échoue rate
 * presque toujours le premier :
 *
 *   1. décider ce qu'on fait des DISTANCES À ZÉRO — les additionner (mêmes
 *      signes) ou les soustraire (signes contraires) — et quel sera le SIGNE
 *      du résultat ;
 *   2. seulement ensuite, poser l'opération et la mener.
 *
 * L'animation sépare donc franchement les deux : le raisonnement sur les
 * signes s'écrit en toutes lettres AVANT que le calcul posé n'apparaisse.
 *
 * ---------------------------------------------------------------------------
 * L'alignement des virgules
 * ---------------------------------------------------------------------------
 * C'est là que se perdent les décimaux. La colonne de la virgule est donc
 * SURLIGNÉE d'un bout à l'autre du calcul posé, virgule du résultat comprise,
 * et les zéros qu'il faut ajouter pour que les deux nombres aient autant de
 * décimales apparaissent dans une autre couleur : ils ne viennent pas de
 * l'énoncé, c'est nous qui les écrivons. Chaque colonne s'allume à son tour,
 * de droite à gauche, avec sa retenue.
 *
 * ---------------------------------------------------------------------------
 * Aucun flottant
 * ---------------------------------------------------------------------------
 * 0,1 + 0,2 ne fait pas 0,3 en virgule flottante, et une leçon qui afficherait
 * 0,30000000000000004 aurait tout perdu. Les nombres sont donc manipulés comme
 * des ENTIERS de centièmes, et le calcul posé se fait chiffre par chiffre sur
 * les chaînes — exactement comme au tableau. La division par 100 n'a lieu qu'à
 * l'affichage.
 *
 * ---------------------------------------------------------------------------
 * Les quatre cas
 * ---------------------------------------------------------------------------
 *   mêmes signes       on additionne les distances, on garde le signe commun ;
 *   signes contraires  on soustrait la plus petite distance de la plus grande,
 *                      et l'on prend le signe de celui qui est le plus loin
 *                      de zéro ;
 *   soustraction       soustraire, c'est ajouter l'opposé : on se ramène à
 *                      l'un des deux cas précédents, et c'est tout ;
 *   plusieurs termes   on regroupe les positifs d'un côté, les négatifs de
 *                      l'autre : deux additions posées, puis une somme de deux
 *                      relatifs de signes contraires.
 */
MathsView.register({
  id: 'somme-relatifs',
  title: 'Additionner et soustraire des relatifs',
  level: '5eme',
  category: 'calcul',
  subcategory: 'Nombres relatifs',
  theme: 'Nombres — somme et différence de décimaux relatifs',
  exercices: ['somme-relatifs'],
  description:
    'Pour additionner deux nombres relatifs, on regarde d\'abord leurs <strong>signes</strong>, ' +
    'et seulement ensuite on calcule avec leurs <strong>distances à zéro</strong>. ' +
    '<br>Clique sur <strong>Lancer l\'animation</strong> : le raisonnement sur les signes ' +
    's\'écrit d\'abord, puis l\'opération se pose en colonnes — <strong>virgules alignées</strong>, ' +
    'zéros ajoutés là où il en manque, et une colonne à la fois. ' +
    '<br>Les quatre boutons changent de cas : mêmes signes, signes contraires, une soustraction, ' +
    'ou une somme de plusieurs termes.',
  notes:
    '<p><strong>Additionner deux relatifs.</strong></p>' +
    '<ul>' +
    '<li><strong>Mêmes signes</strong> : on <strong>additionne</strong> les distances à zéro et ' +
    'on garde le signe commun. \\( (-7,2) + (-3,5) = -10,7 \\)</li>' +
    '<li><strong>Signes contraires</strong> : on <strong>soustrait</strong> la plus petite ' +
    'distance à zéro de la plus grande, et on garde le signe de celui qui a la ' +
    '<strong>plus grande</strong> distance à zéro. \\( (-7,2) + (+3,5) = -3,7 \\)</li>' +
    '</ul>' +
    '<p><strong>Soustraire, c\'est ajouter l\'opposé.</strong> \\( a - b = a + (-b) \\). On ' +
    'transforme la soustraction en addition, puis on applique la règle ci-dessus. ' +
    '\\( (-7,2) - (-3,5) = (-7,2) + (+3,5) = -3,7 \\)</p>' +
    '<p><strong>Plusieurs termes.</strong> On peut changer l\'ordre et regrouper : on additionne ' +
    'tous les positifs entre eux, tous les négatifs entre eux, et il ne reste qu\'une somme de ' +
    'deux relatifs de signes contraires.</p>' +
    '<ul>' +
    '<li><strong>Poser l\'opération.</strong> On aligne les <strong>virgules</strong> — donc les ' +
    'unités sous les unités, les dixièmes sous les dixièmes — et on complète avec des ' +
    '<strong>zéros</strong> pour que les deux nombres aient autant de décimales. La virgule du ' +
    'résultat se place dans la même colonne.</li>' +
    '<li><strong>Le piège :</strong> aligner sur la droite au lieu d\'aligner les virgules. ' +
    '\\( 12,7 + 5,45 \\) n\'est pas \\( 12,7 + 5,45 \\) posé « 7 sous 5 » : c\'est ' +
    '\\( 12,70 + 5,45 \\).</li>' +
    '<li>La somme de deux nombres <strong>opposés</strong> est <strong>nulle</strong> : ' +
    '\\( (-4,3) + (+4,3) = 0 \\).</li>' +
    '</ul>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();   // leçon sans figure

    /* ==================================================================== */
    /* Les nombres : des ENTIERS de centièmes, jamais de flottants          */
    /* ==================================================================== */
    // Un relatif est un entier `c` : sa valeur est c / 100.
    function fmt(c) {                        // 1270 → « 12,7 »
      var neg = c < 0, v = Math.abs(c);
      var e = Math.floor(v / 100), d = v % 100;
      var t = String(e);
      if (d) t += ',' + (d % 10 === 0 ? String(d / 10) : (d < 10 ? '0' + d : String(d)));
      return (neg ? '−' : '') + t;
    }
    function signeHtml(c) {                  // « (−12,7) », coloré
      return '<span class="' + (c < 0 ? 'neg' : 'pos') + '">(' + (c < 0 ? '−' : '+') +
             fmt(Math.abs(c)) + ')</span>';
    }
    // Les chiffres d'un entier de centièmes : partie entière et décimales.
    function parts(v) {                      // v ⩾ 0
      var e = String(Math.floor(v / 100));
      var d = v % 100;
      var dec = d === 0 ? '' : (d % 10 === 0 ? String(d / 10) : (d < 10 ? '0' + d : String(d)));
      return { e: e, d: dec };
    }

    /* ==================================================================== */
    /* Poser une opération : le tableau de chiffres, colonne par colonne     */
    /* ==================================================================== */
    /*
     * a et b : entiers positifs de centièmes, avec a ⩾ b si op vaut '−'.
     * Renvoie tout ce qu'il faut pour DESSINER et pour ANIMER :
     *   T      nombre de colonnes,  vir  l'indice de la colonne de la virgule,
     *   A, B   les chiffres (null = case vide),  Az, Bz : ce chiffre est-il un
     *          zéro que NOUS avons ajouté ?
     *   ordre  les colonnes dans l'ordre du calcul (de droite à gauche),
     *   R      les chiffres du résultat,  RET  les retenues,
     *   res    le résultat, en entier de centièmes.
     */
    function poser(a, b, op) {
      var pa = parts(a), pb = parts(b);
      var ei = Math.max(pa.e.length, pb.e.length) + 1;      // +1 pour la retenue
      var de = Math.max(pa.d.length, pb.d.length);
      var T = ei + 1 + de, vir = ei;

      var A = new Array(T), B = new Array(T), R = new Array(T);
      var Az = new Array(T), Bz = new Array(T), RET = new Array(T);
      function place(p, tab, zero) {
        var i;
        for (i = 0; i < p.e.length; i++) tab[ei - p.e.length + i] = p.e.charAt(i);
        for (i = 0; i < de; i++) {
          var c = i < p.d.length ? p.d.charAt(i) : '0';
          tab[vir + 1 + i] = c;
          if (i >= p.d.length) zero[vir + 1 + i] = true;     // un zéro ajouté par nous
        }
      }
      place(pa, A, Az);
      place(pb, B, Bz);
      A[vir] = ','; B[vir] = ','; R[vir] = ',';

      // L'ordre du calcul : de la droite vers la gauche, la virgule mise à part.
      var ordre = [];
      for (var i = T - 1; i >= 0; i--) if (i !== vir) ordre.push(i);

      // Le calcul, chiffre par chiffre — exactement comme au tableau.
      var ret = 0;
      ordre.forEach(function (i, k) {
        var da = A[i] === undefined ? 0 : +A[i];
        var db = B[i] === undefined ? 0 : +B[i];
        var v;
        if (op === '+') {
          v = da + db + ret;
          R[i] = String(v % 10);
          ret = v >= 10 ? 1 : 0;
        } else {
          v = da - db - ret;
          R[i] = String((v + 10) % 10);
          ret = v < 0 ? 1 : 0;
        }
        // La retenue s'écrit sur la colonne SUIVANTE du calcul (celle de gauche).
        if (ret && k + 1 < ordre.length) RET[ordre[k + 1]] = '1';
      });

      // On n'écrit pas les zéros inutiles devant le résultat.
      for (var j = 0; j < vir - 1; j++) {
        if (R[j] === '0') R[j] = undefined; else break;
      }
      return { T: T, vir: vir, A: A, B: B, R: R, Az: Az, Bz: Bz, RET: RET,
               ordre: ordre, op: op, res: op === '+' ? a + b : a - b };
    }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'som-ui';
    root.innerHTML =
      '<div class="som-cas"></div>' +
      '<div class="som-calcul"></div>' +
      '<div class="som-recap"></div>' +
      '<div class="som-etapes"></div>' +
      '<div class="som-posewrap"></div>' +
      '<div class="som-final" style="visibility:hidden">&nbsp;</div>';
    var elCas = root.querySelector('.som-cas');
    var elCalcul = root.querySelector('.som-calcul');
    var elRecap = root.querySelector('.som-recap');
    var elEtapes = root.querySelector('.som-etapes');
    var elPose = root.querySelector('.som-posewrap');
    var elFinal = root.querySelector('.som-final');
    mv.extras.appendChild(root);

    // Dessine le calcul posé. `vues` : jusqu'où on en est dans `ordre`
    // (−1 : rien de calculé), `on` : la colonne allumée, `virgule` : la virgule
    // du résultat est-elle posée ?
    function dessinePose(p, vues, on, virgule) {
      if (!p) { elPose.innerHTML = ''; return; }
      function cell(txt, cls) {
        return '<td class="' + (cls || '') + '">' + (txt === undefined ? '' : txt) + '</td>';
      }
      var i, ret = [], la = [], lb = [], lr = [];
      var faites = {};
      for (i = 0; i <= vues; i++) faites[p.ordre[i]] = true;

      for (i = 0; i < p.T; i++) {
        var vir = i === p.vir ? ' som-vir' : '';
        var allume = i === on ? ' som-on' : '';
        // Une retenue n'apparaît qu'une fois calculée la colonne qui la produit,
        // c'est-à-dire la colonne juste à droite dans l'ordre du calcul.
        var rang = p.ordre.indexOf(i);
        var voirRet = p.RET[i] !== undefined && vues >= 0 && rang >= 0 && rang <= vues + 1;
        ret.push(cell(voirRet ? p.RET[i] : undefined, 'som-ret' + vir));
        la.push(cell(p.A[i], (p.Az[i] ? 'som-zero' : '') + vir + allume));
        lb.push(cell(i === 0 ? p.op : p.B[i], (i === 0 ? 'som-op ' : '') +
                     (p.Bz[i] ? 'som-zero' : '') + vir + allume));
        lr.push(cell(i === p.vir ? (virgule ? ',' : undefined) : (faites[i] ? p.R[i] : undefined),
                     vir + allume));
      }
      // La retenue d'une ADDITION se note au-dessus du premier terme ; celle
      // d'une SOUSTRACTION se note contre le second, celui qu'on retranche.
      var ligneRet = '<tr class="som-ret">' + ret.join('') + '</tr>';
      elPose.innerHTML = '<table class="som-pose">' +
        (p.op === '+' ? ligneRet : '') +
        '<tr>' + la.join('') + '</tr>' +
        (p.op === '+' ? '' : ligneRet) +
        '<tr>' + lb.join('') + '</tr>' +
        '<tr class="som-bar som-res">' + lr.join('') + '</tr>' +
        '</table>';
    }

    // Une étape n'AJOUTE rien : elle affiche un ÉTAT. Le moteur d'animation
    // rappelle `step(p)` à chaque image, et le mode pas à pas rejoue les étapes
    // précédentes ; une étape qui empilerait du HTML l'empilerait donc quarante
    // fois de suite. Tout est reconstruit à partir d'un instantané figé.
    var phrases = [];               // toutes les phrases du raisonnement, dans l'ordre
    function rendre(e) {
      elCalcul.innerHTML = 'A = ' + e.termes.map(signeHtml).join(e.soustrait ? ' − ' : ' + ');
      elRecap.innerHTML = e.recap || '';
      elEtapes.innerHTML = phrases.slice(0, e.n).map(function (t) {
        return '<div class="som-etape">' + t + '</div>';
      }).join('');
      dessinePose(e.pose, e.vues, e.on, e.virgule);
      elFinal.style.visibility = e.final === null ? 'hidden' : 'visible';
      elFinal.innerHTML = e.final === null ? '&nbsp;' : 'A = ' + fmt(e.final);
    }

    /* ==================================================================== */
    /* Les quatre cas, et leurs exemples                                     */
    /* ==================================================================== */
    var CAS = [
      { cle: 'meme', nom: 'Mêmes signes' },
      { cle: 'contraire', nom: 'Signes contraires' },
      { cle: 'moins', nom: 'Une soustraction' },
      { cle: 'plusieurs', nom: 'Plusieurs termes' }
    ];
    var cas = 'meme';
    var termes = [];              // les termes du calcul, en centièmes
    var soustrait = false;        // le calcul de départ est-il une différence ?

    function alea(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
    // Un décimal « qui a de l'allure » : 1 ou 2 décimales, jamais un entier rond.
    function tireNombre(maxEnt) {
      var e = alea(1, maxEnt || 19);
      var d = Math.random() < 0.5 ? alea(1, 9) * 10 : alea(1, 99);
      if (d % 10 === 0 && d !== 0 && Math.random() < 0.5) d = alea(1, 99);
      return e * 100 + d;
    }

    function tirer() {
      soustrait = false;
      if (cas === 'meme') {
        var s = Math.random() < 0.65 ? -1 : 1;
        termes = [s * tireNombre(15), s * tireNombre(9)];
      } else if (cas === 'contraire') {
        var a = tireNombre(18), b = tireNombre(12);
        while (a === b) b = tireNombre(12);
        termes = Math.random() < 0.5 ? [-a, b] : [a, -b];
      } else if (cas === 'moins') {
        soustrait = true;
        termes = [(Math.random() < 0.6 ? -1 : 1) * tireNombre(15),
                  (Math.random() < 0.6 ? -1 : 1) * tireNombre(9)];
        // On évite la différence nulle, qui n'apprend rien ici.
        if (termes[0] === termes[1]) termes[1] += 100;
      } else {
        var n = Math.random() < 0.5 ? 3 : 4, i;
        termes = [];
        for (i = 0; i < n; i++) {
          termes.push((Math.random() < 0.5 ? -1 : 1) * tireNombre(9));
        }
        // Il faut des deux : sans négatif ni positif, il n'y a rien à regrouper.
        if (termes.every(function (t) { return t > 0; })) termes[0] = -termes[0];
        if (termes.every(function (t) { return t < 0; })) termes[0] = -termes[0];
      }
      afficheCalcul();
    }

    function afficheCalcul() {
      var t = termes.map(signeHtml);
      elCalcul.innerHTML = 'A = ' + t.join(soustrait ? ' − ' : ' + ');
    }

    /* ==================================================================== */
    /* La construction des étapes                                            */
    /* ==================================================================== */
    /*
     * Chaque étape est un ÉTAT figé, pas une action : `cur` est modifié pendant
     * la CONSTRUCTION, on en prend une copie, et l'étape se contente de la
     * réafficher. On peut donc la rejouer autant de fois qu'on veut — ce que
     * fait le moteur à chaque image, et le mode pas à pas quand on revient en
     * arrière — sans que rien ne se duplique.
     */
    var anim = mv.createAnimator();
    var cur = null;
    var virguleDite = false;        // la phrase sur la virgule n'est dite qu'une fois

    function neuf() {
      return { n: 0, pose: null, vues: -1, on: null, virgule: false,
               termes: termes.slice(), soustrait: soustrait, recap: '', final: null };
    }
    function copie(e) {
      return { n: e.n, pose: e.pose, vues: e.vues, on: e.on, virgule: e.virgule,
               termes: e.termes.slice(), soustrait: e.soustrait,
               recap: e.recap, final: e.final };
    }
    // Enregistre une étape : `maj` modifie `cur` maintenant, l'étape affichera
    // l'instantané correspondant plus tard.
    function pas(dur, maj) {
      maj();
      var e = copie(cur);
      return { dur: dur, step: function () { rendre(e); } };
    }
    function dire(txt) { cur.n = phrases.push(txt); }

    // Les étapes qui déroulent UNE opération posée : apparition, colonnes,
    // virgule. `apres` peut ajouter des phrases et fixer le résultat.
    function etapesPose(p, intro, apres) {
      var steps = [];
      steps.push(pas(700, function () {
        dire(intro);
        cur.pose = p; cur.vues = -1; cur.on = null; cur.virgule = false;
      }));
      p.ordre.forEach(function (col, k) {
        steps.push(pas(420, function () { cur.vues = k; cur.on = col; }));
      });
      steps.push(pas(600, function () {
        cur.vues = p.ordre.length - 1; cur.on = null; cur.virgule = true;
        // Une somme de plusieurs termes enchaîne deux ou trois opérations
        // posées : on ne redit pas la même phrase à chaque fois.
        if (!virguleDite) {
          dire('On place la <b>virgule du résultat</b> dans la même colonne que les autres.');
          virguleDite = true;
        }
        if (apres) apres();
      }));
      return steps;
    }

    function construitEtapes() {
      phrases = [];
      virguleDite = false;
      cur = neuf();
      var steps = [];
      var a = termes[0], b = termes[1];

      // 0. Une soustraction se ramène d'abord à une addition.
      if (soustrait) {
        var bAvant = b, bApres = -b;
        steps.push(pas(800, function () {
          dire('<b>Soustraire, c\'est ajouter l\'opposé.</b> L\'opposé de ' +
               signeHtml(bAvant) + ' est ' + signeHtml(bApres) + '.');
          cur.termes = [a, bApres];
          cur.soustrait = false;
        }));
        b = bApres;
      }

      if (cas === 'plusieurs') return steps.concat(etapesPlusieurs());

      var memeSigne = (a > 0) === (b > 0);
      var da = Math.abs(a), db = Math.abs(b);

      if (memeSigne) {
        steps.push(pas(800, function () {
          dire('Les deux nombres ont le <b>même signe</b> (' + (a < 0 ? '−' : '+') +
               ') : on <b>additionne</b> leurs distances à zéro, et le résultat garde ce signe.');
          dire('Distances à zéro : ' + fmt(da) + ' et ' + fmt(db) + '.');
        }));
        var p1 = poser(da, db, '+');
        return steps.concat(etapesPose(p1,
          'On pose l\'addition : les <b>virgules alignées</b>, et on complète avec des ' +
          '<b>zéros</b> pour que les deux nombres aient autant de décimales.',
          function () {
            var r = (a < 0 ? -1 : 1) * p1.res;
            dire('On remet le signe <b>' + (a < 0 ? '−' : '+') + '</b> : A = <b>' + fmt(r) + '</b>.');
            cur.final = r;
          }));
      }

      // Signes contraires : c'est le plus grand en distance qui donne le signe.
      var grand = da >= db ? a : b, gd = Math.max(da, db), pd = Math.min(da, db);
      steps.push(pas(800, function () {
        dire('Les deux nombres sont de <b>signes contraires</b> : on <b>soustrait</b> la plus ' +
             'petite distance à zéro de la plus grande.');
        dire('Distances à zéro : ' + fmt(da) + ' et ' + fmt(db) + '. La plus grande est <b>' +
             fmt(gd) + '</b>, celle de ' + signeHtml(grand) + ' : le résultat aura donc le ' +
             'signe <b>' + (grand < 0 ? '−' : '+') + '</b>.');
      }));
      var p2 = poser(gd, pd, '−');
      return steps.concat(etapesPose(p2,
        'On pose la soustraction ' + fmt(gd) + ' − ' + fmt(pd) + ' : les <b>virgules alignées</b>, ' +
        'et on complète avec des <b>zéros</b> si besoin.',
        function () {
          var r = (grand < 0 ? -1 : 1) * p2.res;
          dire('On met le signe <b>' + (grand < 0 ? '−' : '+') + '</b> : A = <b>' + fmt(r) + '</b>.');
          cur.final = r;
        }));
    }

    /* ==================================================================== */
    /* Le cas « plusieurs termes » : on regroupe, puis deux additions         */
    /* ==================================================================== */
    function etapesPlusieurs() {
      var pos = termes.filter(function (t) { return t > 0; });
      var neg = termes.filter(function (t) { return t < 0; }).map(function (t) { return -t; });
      var sp = pos.reduce(function (x, y) { return x + y; }, 0);
      var sn = neg.reduce(function (x, y) { return x + y; }, 0);
      var steps = [];

      steps.push(pas(800, function () {
        dire('Dans une somme, on peut <b>changer l\'ordre</b> des termes et les regrouper. On ' +
             'met les <b>positifs</b> ensemble et les <b>négatifs</b> ensemble.');
        cur.recap = 'positifs : ' + pos.map(function (t) { return fmt(t); }).join(' + ') +
          ' &nbsp;·&nbsp; négatifs : ' + neg.map(function (t) { return '−' + fmt(t); }).join(' ');
      }));

      steps = steps.concat(sommeGroupe(pos, '+', 'positifs', function (s) {
        cur.recap = 'somme des positifs : <b>+' + fmt(s) + '</b>';
      }));
      steps = steps.concat(sommeGroupe(neg, '−', 'négatifs', function (s) {
        cur.recap = 'somme des positifs : <b>+' + fmt(sp) + '</b> &nbsp;·&nbsp; ' +
          'somme des négatifs : <b>−' + fmt(s) + '</b>';
      }));

      // Il ne reste qu'une somme de deux relatifs de signes contraires.
      var gd = Math.max(sp, sn), pd = Math.min(sp, sn), neget = sn > sp;
      steps.push(pas(800, function () {
        dire('Il ne reste plus que <b>(+' + fmt(sp) + ') + (−' + fmt(sn) + ')</b> : deux ' +
             'nombres de <b>signes contraires</b>. On soustrait la plus petite distance à zéro ' +
             'de la plus grande, et on prend le signe de <b>' +
             (neget ? '−' + fmt(sn) : '+' + fmt(sp)) + '</b>.');
      }));
      if (gd === pd) {
        steps.push(pas(800, function () {
          dire('Les deux distances à zéro sont <b>égales</b> : la somme est <b>nulle</b>.');
          cur.pose = null;
          cur.final = 0;
        }));
        return steps;
      }
      var p = poser(gd, pd, '−');
      return steps.concat(etapesPose(p, 'On pose ' + fmt(gd) + ' − ' + fmt(pd) + '.',
        function () {
          var r = (neget ? -1 : 1) * p.res;
          dire('A = <b>' + fmt(r) + '</b>.');
          cur.final = r;
        }));
    }

    // Additionner les termes d'un groupe, deux par deux, en les posant.
    function sommeGroupe(liste, signe, nom, apres) {
      var steps = [], courant = liste[0];
      if (liste.length === 1) {
        steps.push(pas(700, function () {
          dire('Il n\'y a qu\'un seul terme ' + nom + ' : sa somme est <b>' + signe +
               fmt(courant) + '</b>.');
          cur.pose = null;
          if (apres) apres(courant);
        }));
        return steps;
      }
      liste.slice(1).forEach(function (t) {
        var avant = courant, p = poser(courant, t, '+');
        courant = p.res;
        var total = courant;
        steps = steps.concat(etapesPose(p,
          'On additionne les ' + nom + ' : ' + fmt(avant) + ' + ' + fmt(t) +
          ', <b>virgules alignées</b>.',
          function () {
            dire('Somme des ' + nom + ' pour l\'instant : <b>' + signe + fmt(total) + '</b>.');
            if (apres) apres(total);
          }));
      });
      return steps;
    }

    /* ==================================================================== */
    /* États                                                                 */
    /* ==================================================================== */
    function effacer() {
      anim.cancel();
      phrases = [];
      rendre(neuf());
    }

    var depart = null;          // les termes d'origine, pour pouvoir rejouer
    function jouer() {
      if (depart) { termes = depart.t.slice(); soustrait = depart.s; }
      else depart = { t: termes.slice(), s: soustrait };
      effacer();
      anim.runSteps(construitEtapes(), effacer);
    }

    function choisir(c) {
      cas = c;
      Array.prototype.forEach.call(elCas.children, function (b) {
        b.classList.toggle('active', b.dataset.cas === c);
      });
      tirer();
      depart = { t: termes.slice(), s: soustrait };
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
      { type: 'button', id: 'autre', label: '🎲 Autre calcul', onClick: function () {
          tirer(); depart = { t: termes.slice(), s: soustrait }; jouer();
        } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer }
    ]);

    // Démarrage : le premier cas, joué une fois.
    choisir('meme');
  }
});
