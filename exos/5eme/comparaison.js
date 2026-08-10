/*
 * comparer — comparer et ranger des décimaux relatifs (leçon 5ème « Comparer
 * et ranger des décimaux relatifs »).
 *
 * Un nombre y est gardé sous la forme où il est ÉCRIT : sa partie entière et
 * ses décimales, chacune dans son coin. 7,5 et 7,50 sont donc deux objets
 * différents, de même valeur — et c'est très exactement ce que le chapitre
 * apprend à ne pas confondre. La correction peut alors montrer le geste qui
 * compte : compléter avec des zéros pour aligner les rangs.
 *
 * Les cinq situations tirées au sort sont les cinq pièges du chapitre :
 *
 *     signes      des signes différents — rien d'autre à regarder ;
 *     entiers     même signe, parties entières différentes ;
 *     longueurs   7,45 et 7,5 : le piège du « 45 > 5 » ;
 *     zero        4,06 et 4,6 : le zéro intercalé ;
 *     egal        2,5 et 2,50 : deux écritures du même nombre.
 *
 * Et dans les questions de rangement, les mauvaises réponses proposées ne sont
 * pas des ordres pris au hasard : ce sont les DEUX erreurs classiques — ranger
 * les négatifs par valeur absolue croissante, et lire les décimales comme des
 * entiers.
 */
(function () {
  'use strict';

  var RANGS = ['dixièmes', 'centièmes', 'millièmes'];

  /* ===================================================================== */
  /* Les nombres                                                           */
  /* ===================================================================== */
  // s : le signe (±1), e : la partie entière, d : les décimales ÉCRITES.
  function faire(s, e, d) {
    d = String(d === undefined || d === null ? '' : d);
    var t = (s < 0 ? '−' : '') + e + (d ? ',' + d : '');
    return {
      s: s, e: String(e), d: d,
      v: s * parseFloat(e + '.' + (d || '0')),
      txt: t,
      tex: (s < 0 ? '-' : '') + e + (d ? '{,}' + d : '')
    };
  }
  function absTxt(x) { return x.e + (x.d ? ',' + x.d : ''); }
  // Les décimales complétées à n chiffres — le geste central du chapitre.
  function comp(d, n) { while (d.length < n) d += '0'; return d; }
  function texComp(x, n) {
    return (x.s < 0 ? '-' : '') + x.e + (n > 0 ? '{,}' + comp(x.d, n) : '');
  }
  function cmp(a, b) {
    return Math.abs(a.v - b.v) < 1e-9 ? 0 : (a.v < b.v ? -1 : 1);
  }

  // Un décimal relatif quelconque. Les zéros de fin tirés au hasard ne sont
  // gardés nulle part : ils ne sont intéressants que lorsqu'ils sont le sujet
  // de la question, et c'est alors le cas « egal » qui les fabrique.
  function tire(rnd, palier, s) {
    var e = rnd.entier(0, palier === 1 ? 9 : 12);
    var nd = palier === 1 ? rnd.entier(0, 1)
           : palier >= 4 ? rnd.entier(1, 3)
           : rnd.entier(1, 2);
    var d = '';
    for (var i = 0; i < nd; i++) d += rnd.entier(0, 9);
    d = d.replace(/0+$/, '');
    if (e === 0 && d === '') d = String(rnd.entier(1, 9));   // jamais 0 tout seul
    return faire(s || (rnd.booleen(0.5) ? 1 : -1), e, d);
  }

  /* Les cinq situations du chapitre. */
  function tirePaire(rnd, palier) {
    var cas = palier === 1 ? rnd.choix(['signes', 'signes', 'entiers'])
            : palier === 2 ? rnd.choix(['longueurs', 'longueurs', 'zero', 'egal', 'entiers'])
            : rnd.choix(['longueurs', 'longueurs', 'zero', 'egal', 'signes', 'entiers']);
    var s = rnd.booleen(0.55) ? -1 : 1;      // les négatifs sont le cœur du sujet
    var e = rnd.entier(0, palier === 1 ? 9 : 12);
    var x, y, a, b;

    if (cas === 'signes') {
      a = tire(rnd, palier, 1);
      b = tire(rnd, palier, -1);
    } else if (cas === 'entiers') {
      a = tire(rnd, palier, s);
      b = tire(rnd, palier, s);
      if (a.e === b.e) b = faire(s, (parseInt(a.e, 10) + rnd.entier(1, 4)) % 13, b.d);
    } else if (cas === 'longueurs') {        // 7,45 et 7,5
      x = rnd.entier(1, 8);
      y = rnd.entier(0, 9);
      while (y === x) y = rnd.entier(0, 9);  // sinon les dixièmes sont égaux
      a = faire(s, e, String(x));
      b = faire(s, e, String(y) + rnd.entier(1, 9));
    } else if (cas === 'zero') {             // 4,06 et 4,6
      x = rnd.entier(1, 9);
      a = faire(s, e, '0' + x);
      b = faire(s, e, String(x));
    } else {                                 // 'egal' : 2,5 et 2,50
      x = rnd.entier(1, 9);
      a = faire(s, e, String(x));
      b = faire(s, e, String(x) + (rnd.booleen(0.5) ? '0' : '00'));
    }

    // Plusieurs de ces situations fabriquent toujours la paire dans le même
    // ordre — le négatif en second, le zéro intercalé en premier. On tire donc
    // l'ordre au sort : sans cela, « c'est toujours > » se retiendrait très
    // vite, et sans regarder les nombres.
    return rnd.booleen(0.5) ? { cas: cas, a: a, b: b } : { cas: cas, a: b, b: a };
  }

  /*
   * Une liste à ranger. Deux de ses nombres partagent leur signe ET leur
   * partie entière : c'est là que la comparaison se joue vraiment, pas entre
   * 12 et −3. Et la liste contient toujours les deux signes, sans quoi la
   * règle des négatifs ne servirait à rien.
   */
  function tireListe(rnd, palier, n) {
    var s = rnd.booleen(0.6) ? -1 : 1;
    var e = rnd.entier(0, palier === 1 ? 9 : 12);
    var x = rnd.entier(1, 8), y = rnd.entier(0, 9);
    while (y === x) y = rnd.entier(0, 9);
    var out = [faire(s, e, String(x)), faire(s, e, String(y) + rnd.entier(1, 9))];

    function libre(z) {
      return !out.some(function (u) { return Math.abs(u.v - z.v) < 1e-9; });
    }
    var essais = 0;
    while (out.length < n && essais++ < 300) {
      var z = tire(rnd, palier);
      if (libre(z)) out.push(z);
    }
    // Il faut les deux camps : on retourne le dernier venu s'il le faut — en
    // décalant sa partie entière si son opposé était déjà dans la liste.
    if (out.every(function (u) { return u.s === out[0].s; })) {
      var last = out.pop();
      var jumeau = faire(-last.s, last.e, last.d);
      if (!libre(jumeau)) jumeau = faire(-last.s, (parseInt(last.e, 10) + 1) % 13, last.d);
      out.push(libre(jumeau) ? jumeau : last);
    }
    return rnd.melange(out);
  }

  /* ===================================================================== */
  /* La correction d'une comparaison — le raisonnement de la leçon          */
  /* ===================================================================== */
  function etapesCompare(a, b) {
    var c = cmp(a, b);
    var fin = '\\(' + a.tex + (c < 0 ? ' < ' : c > 0 ? ' > ' : ' = ') + b.tex + '\\)';
    var e = [];

    if (a.s !== b.s) {
      var neg = a.s < 0 ? a : b, pos = a.s < 0 ? b : a;
      e.push('On regarde d\'abord le <b>signe</b> : ' + neg.txt + ' est négatif, ' +
             pos.txt + ' est positif.');
      e.push('Le négatif est <b>à gauche de 0</b> sur la droite graduée, le positif à ' +
             'droite : ' + neg.txt + ' est donc le plus <b>petit</b>. Les chiffres ' +
             'n\'ont rien à dire ici.');
      e.push(fin);
      return e;
    }

    e.push('Même signe : on compare les <b>valeurs absolues</b>, ' + absTxt(a) +
           ' et ' + absTxt(b) + '.');

    if (a.e !== b.e) {
      e.push('Les <b>parties entières</b> suffisent à décider : ' + a.e + ' et ' + b.e + '.');
    } else {
      var n = Math.max(a.d.length, b.d.length);
      if (a.d.length !== b.d.length) {
        var court = a.d.length < b.d.length ? a : b;
        e.push('Même partie entière : on descend d\'un rang. On <b>complète avec des ' +
               'zéros</b> pour aligner les chiffres — \\(' + court.tex + ' = ' +
               texComp(court, n) + '\\).');
      } else {
        e.push('Même partie entière : on descend d\'un rang.');
      }
      var da = comp(a.d, n), db = comp(b.d, n), r = -1;
      for (var i = 0; i < n; i++) {
        if (da.charAt(i) !== db.charAt(i)) { r = i; break; }
      }
      if (r < 0) {
        e.push('Une fois alignés, <b>tous les chiffres sont identiques</b> : les deux ' +
               'écritures désignent le même nombre. Un zéro ajouté à droite ne change ' +
               'rien à la valeur.');
        e.push(fin);
        return e;
      }
      e.push('Les <b>' + RANGS[r] + '</b> diffèrent : ' + da.charAt(r) + ' et ' +
             db.charAt(r) + '. Ce sont elles qui décident — ce qui suit ne compte plus.');
    }

    var grand = Math.abs(a.v) > Math.abs(b.v) ? a : b;
    e.push(a.s < 0
      ? 'C\'est ' + grand.txt + ' qui a la plus <b>grande</b> valeur absolue — mais les ' +
        'deux sont <b>négatifs</b> : le plus loin de 0 est le plus <b>petit</b>.'
      : 'Les deux sont <b>positifs</b> : le plus grand est celui dont la valeur absolue ' +
        'est la plus grande.');
    e.push(fin);
    return e;
  }

  function indicesCompare(a, b) {
    var meme = (a.s === b.s);
    return [
      !meme
        ? 'Commence par les <b>signes</b> : un négatif est toujours plus petit qu\'un positif.'
        : a.s < 0
          ? 'Les deux sont <b>négatifs</b> : compare les valeurs absolues, puis rappelle-toi ' +
            'que la plus <b>grande</b> valeur absolue donne le plus <b>petit</b> nombre.'
          : 'Les deux sont <b>positifs</b> : compare les valeurs absolues — la plus grande ' +
            'donne le plus grand nombre.',
      meme && a.e === b.e
        ? 'Aligne les rangs en complétant avec des <b>zéros</b> : 7,5 = 7,50.'
        : 'Place-les mentalement sur la droite graduée : le plus grand est le plus à droite.'
    ];
  }

  /* ===================================================================== */
  /* Les formes de questions                                               */
  /* ===================================================================== */

  /* --- comparer deux nombres ------------------------------------------- */
  function qCompare(rnd, palier) {
    var p = tirePaire(rnd, palier), c = cmp(p.a, p.b);
    return {
      enonce: 'Complète avec le bon symbole.',
      tex: p.a.tex + ' \\;\\ldots\\; ' + p.b.tex,
      type: 'qcm',
      choix: ['\\(<\\)', '\\(>\\)', '\\(=\\)'],
      correct: c < 0 ? 0 : c > 0 ? 1 : 2,
      etapes: etapesCompare(p.a, p.b),
      indices: indicesCompare(p.a, p.b),
      duree: 40
    };
  }

  /* --- vrai ou faux ----------------------------------------------------- */
  function qVraiFaux(rnd, palier) {
    var p = tirePaire(rnd, palier), c = cmp(p.a, p.b);
    var bon = c < 0 ? '<' : c > 0 ? '>' : '=';
    // Une affirmation vraie une fois sur deux : sinon la réponse s'apprend
    // sans même regarder les nombres.
    var sym = rnd.booleen(0.5) ? bon : rnd.choix(['<', '>', '='].filter(
      function (s) { return s !== bon; }));
    var etapes = etapesCompare(p.a, p.b);
    etapes.push('L\'affirmation proposée est donc <b>' + (sym === bon ? 'vraie' : 'fausse') +
                '</b>.');
    return {
      enonce: 'Vrai ou faux ?',
      tex: p.a.tex + ' ' + sym + ' ' + p.b.tex,
      type: 'vraifaux',
      correct: sym === bon ? 0 : 1,
      etapes: etapes,
      indices: indicesCompare(p.a, p.b),
      duree: 40
    };
  }

  /* --- le plus grand, ou le plus petit ---------------------------------- */
  function qExtreme(rnd, palier) {
    var liste = tireListe(rnd, palier, palier === 1 ? 3 : 4);
    var grand = rnd.booleen(0.5);
    var tri = liste.slice().sort(cmp);
    var cible = grand ? tri[tri.length - 1] : tri[0];
    var choix = liste.map(function (x) { return x.txt; });
    var negs = liste.filter(function (x) { return x.s < 0; });
    var negTri = negs.slice().sort(cmp);

    return {
      // Inutile de répéter la liste : les boutons de réponse SONT la liste.
      enonce: 'Quel est le <b>plus ' + (grand ? 'grand' : 'petit') + '</b> de ces nombres ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(cible.txt),
      etapes: [
        'On sépare les <b>négatifs</b> des <b>positifs</b> : tout négatif est plus petit ' +
          'que tout positif.',
        grand
          ? 'Le plus grand est donc à chercher chez les <b>positifs</b>' +
            (negs.length === liste.length
              ? ' — il n\'y en a pas : c\'est le négatif le plus <b>proche de 0</b>, ' +
                negTri[negTri.length - 1].txt + '.'
              : ', et c\'est celui dont la valeur absolue est la plus <b>grande</b>.')
          : 'Le plus petit est donc à chercher chez les <b>négatifs</b>' +
            (negs.length === 0
              ? ' — il n\'y en a pas : c\'est le positif le plus proche de 0, ' +
                tri[0].txt + '.'
              : ', et c\'est celui qui est le plus <b>loin de 0</b> : la plus grande ' +
                'valeur absolue.'),
        'La réponse est <b>' + cible.txt + '</b>.'
      ],
      indices: [
        'Commence par écarter tous les nombres du mauvais signe.',
        grand ? 'Chez les négatifs, le plus grand est le plus proche de 0.'
              : 'Chez les négatifs, le plus petit est le plus loin de 0.'
      ],
      duree: 45
    };
  }

  /* --- ranger une liste -------------------------------------------------- */
  // L'erreur nº 1 : ranger les négatifs comme s'ils étaient positifs.
  function triValeurAbsolue(t) {
    return t.slice().sort(function (a, b) {
      if (a.s !== b.s) return a.s - b.s;
      return Math.abs(a.v) - Math.abs(b.v);
    });
  }
  // L'erreur nº 2 : lire les décimales comme des entiers (7,45 > 7,5).
  function triNaif(t) {
    function cle(x) {
      return x.s * (parseInt(x.e, 10) + parseInt(x.d || '0', 10) / 1e6);
    }
    return t.slice().sort(function (a, b) { return cle(a) - cle(b); });
  }

  function qRanger(rnd, palier) {
    var liste = tireListe(rnd, palier, palier >= 4 ? 5 : 4);
    var croissant = rnd.booleen(0.5);
    var sep = croissant ? ' &lt; ' : ' &gt; ';
    function chaine(t) {
      var u = croissant ? t : t.slice().reverse();
      return u.map(function (x) { return x.txt; }).join(sep);
    }

    var bonne = liste.slice().sort(cmp);          // toujours dans l'ordre croissant
    var vrai = chaine(bonne);
    var pool = [vrai];
    function ajoute(t) {
      var s = chaine(t);
      if (pool.indexOf(s) < 0) pool.push(s);
    }
    ajoute(bonne.slice().reverse());              // l'ordre inverse
    ajoute(triValeurAbsolue(liste));
    ajoute(triNaif(liste));
    // Si la liste tirée ne piège personne, on fabrique un leurre en échangeant
    // deux nombres voisins.
    for (var i = 0; pool.length < 4 && i < bonne.length - 1; i++) {
      var t = bonne.slice(), tmp = t[i];
      t[i] = t[i + 1]; t[i + 1] = tmp;
      ajoute(t);
    }
    var choix = rnd.melange(pool.slice(0, 4));

    var negs = bonne.filter(function (x) { return x.s < 0; });
    var pos = bonne.filter(function (x) { return x.s >= 0; });
    var etapes = [
      'On place les nombres sur la droite graduée : les <b>négatifs</b> à gauche de 0, ' +
        'les <b>positifs</b> à droite. Tout négatif est plus petit que tout positif.'
    ];
    if (negs.length > 1) {
      etapes.push('Chez les <b>négatifs</b>, le plus petit est celui dont la valeur ' +
        'absolue est la plus <b>grande</b> — le plus loin de 0 : ' +
        negs.map(function (x) { return x.txt; }).join(' puis ') + '.');
    }
    if (pos.length > 1) {
      etapes.push('Chez les <b>positifs</b>, on range comme d\'habitude, par valeur ' +
        'absolue croissante : ' + pos.map(function (x) { return x.txt; }).join(' puis ') +
        '.');
    }
    etapes.push('L\'ordre <b>croissant</b>, c\'est l\'ordre de lecture de la droite, de ' +
      'gauche à droite : <b>' + bonne.map(function (x) { return x.txt; }).join(' &lt; ') +
      '</b>');
    if (!croissant) {
      etapes.push('On demande l\'ordre <b>décroissant</b> : c\'est le même trajet à ' +
        'l\'envers — <b>' + vrai + '</b>');
    }

    return {
      enonce: 'Range ces nombres dans l\'ordre <b>' +
              (croissant ? 'croissant' : 'décroissant') + '</b>.' +
              '<br><b>' + liste.map(function (x) { return x.txt; }).join(' ; ') + '</b>',
      type: 'qcm', choix: choix, correct: choix.indexOf(vrai),
      etapes: etapes,
      indices: [
        'Sépare d\'abord les négatifs des positifs.',
        croissant
          ? 'L\'ordre croissant se lit sur la droite graduée, de la gauche vers la droite.'
          : 'L\'ordre décroissant part du plus grand : lis la droite graduée à l\'envers.'
      ],
      duree: 70
    };
  }

  /* --- intercaler un nombre ---------------------------------------------- */
  function qIntercale(rnd) {
    var s = rnd.booleen(0.55) ? -1 : 1;
    var e = rnd.entier(0, 9);
    var x = rnd.entier(1, 8);                       // le rang des dixièmes
    var g = faire(s, e, String(x)), d = faire(s, e, String(x + 1));
    var lo = s < 0 ? d : g, hi = s < 0 ? g : d;     // les bornes, dans l'ordre

    var bon = faire(s, e, String(x) + rnd.entier(1, 9));
    var choix = rnd.melange([
      bon.txt,
      faire(s, e, String(x + 1) + rnd.entier(1, 9)).txt,   // au-delà d'une borne
      faire(s, e, String(x - 1) + rnd.entier(1, 9)).txt,   // en deçà de l'autre
      faire(-s, e, String(x) + rnd.entier(1, 9)).txt       // le bon nombre, mauvais signe
    ]);

    return {
      enonce: 'Lequel de ces nombres est compris <b>entre ' + lo.txt + ' et ' + hi.txt +
              '</b> ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(bon.txt),
      etapes: [
        'On <b>complète avec des zéros</b> pour aligner les rangs : les bornes s\'écrivent ' +
          '\\(' + texComp(lo, 2) + '\\) et \\(' + texComp(hi, 2) + '\\).',
        'Il faut donc un nombre de même partie entière, dont les <b>centièmes</b> tombent ' +
          'entre les deux.',
        (s < 0
          ? 'Attention au signe : entre deux négatifs, plus la valeur absolue est grande, ' +
            'plus le nombre est petit.'
          : 'Les deux bornes sont positives : on compare directement les valeurs absolues.'),
        '<b>' + bon.txt + '</b> convient : \\(' + texComp(lo, 2) + ' < ' + bon.tex +
          ' < ' + texComp(hi, 2) + '\\)'
      ],
      indices: [
        'Récris les deux bornes avec le même nombre de décimales.',
        'Place-les sur la droite graduée : le nombre cherché est entre les deux.'
      ],
      duree: 55
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'comparer', competence: 'comparer', level: '5eme',
    titre: 'Comparer et ranger des relatifs', paliers: 4,

    genere: function (rnd, palier) {
      var forme = rnd.choix(
        palier === 1 ? ['compare', 'compare', 'compare', 'extreme'] :
        palier === 2 ? ['compare', 'compare', 'vraifaux', 'extreme'] :
        palier === 3 ? ['compare', 'ranger', 'ranger', 'vraifaux', 'extreme'] :
                       ['ranger', 'ranger', 'compare', 'intercale', 'vraifaux']);

      if (forme === 'vraifaux') return qVraiFaux(rnd, palier);
      if (forme === 'extreme') return qExtreme(rnd, palier);
      if (forme === 'ranger') return qRanger(rnd, palier);
      if (forme === 'intercale') return qIntercale(rnd);
      return qCompare(rnd, palier);
    }
  });

})();
