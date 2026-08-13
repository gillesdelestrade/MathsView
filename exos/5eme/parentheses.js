/*
 * parentheses — les parenthèses indispensables (leçon 5ème « Les parenthèses
 * sont-elles indispensables ? »).
 *
 * Le même signe « ( » joue deux rôles, et chacun a son critère :
 *
 *   parenthèse de SIGNE      indispensable quand elle suit un symbole
 *                            d'opération, parce qu'on n'écrit jamais deux
 *                            symboles à la suite ;
 *   parenthèse de PRIORITÉ   indispensable quand l'enlever change le résultat.
 *
 * Les familles de questions déclinent ces deux critères :
 *
 *   correcte      parmi quatre écritures, laquelle est licite ? C'est la règle
 *                 des deux symboles, prise seule ;
 *   indispensable on montre une écriture et on demande si SES parenthèses le
 *                 sont. Le verdict n'est jamais écrit à la main : on retire la
 *                 paire, on regarde si l'écriture reste licite, et on compare
 *                 les deux valeurs ;
 *   simplifier    la réécriture sans parenthèses : a + (−b) = a − b, etc. ;
 *   valeur        deux écritures qui ne diffèrent que par des parenthèses, et
 *                 le résultat de l'une des deux — pour voir qu'elles ne valent
 *                 pas la même chose ;
 *   proprietes    vrai/faux.
 *
 * Comme dans la leçon, tout est calculé : le générateur ne sait pas d'avance si
 * une paire est indispensable, il le détermine. On ne peut donc pas se tromper
 * en le déclarant.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  function m(s) { return '\\(' + s + '\\)'; }
  // Le vrai signe « moins » dans le texte courant, le tiret LaTeX dans les formules.
  function fmtV(n) { return String(n).replace('-', '−'); }

  /* ===================================================================== */
  /* Les écritures, en jetons                                              */
  /* ===================================================================== */
  function nb(v, signe) { return { t: 'nb', v: v, signe: !!signe }; }
  function op(v) { return { t: 'op', v: v }; }
  function paire(id, dedans) {
    return [{ t: '(', id: id }].concat(dedans, [{ t: ')', id: id }]);
  }
  function tex(js) {                      // l'écriture, en LaTeX
    return js.map(function (j) {
      if (j.t === '(') return '(';
      if (j.t === ')') return ')';
      if (j.t === 'op') return j.v === '×' ? ' \\times ' : (j.v === '÷' ? ' \\div ' :
             (j.v === '−' ? ' - ' : ' + '));
      return (j.v < 0 ? '-' : (j.signe ? '+' : '')) + Math.abs(j.v);
    }).join('');
  }
  function sansPaire(js, id) {
    return js.filter(function (j) { return !((j.t === '(' || j.t === ')') && j.id === id); });
  }
  // « deux symboles à la suite », c'est interdit.
  function licite(js) {
    for (var i = 1; i < js.length; i++) {
      var av = js[i - 1], j = js[i];
      if (av.t === 'op' && j.t === 'nb' && (j.signe || j.v < 0)) return false;
      if (av.t === 'op' && j.t === 'op') return false;
    }
    return true;
  }
  function valeur(js) {
    var i = 0;
    function facteur() {
      var j = js[i];
      if (j.t === '(') { i++; var v = somme(); i++; return v; }
      i++; return j.v;
    }
    function produit() {
      var v = facteur();
      while (i < js.length && js[i].t === 'op' && (js[i].v === '×' || js[i].v === '÷')) {
        var o = js[i].v; i++; var w = facteur(); v = o === '×' ? v * w : v / w;
      }
      return v;
    }
    function somme() {
      var v = produit();
      while (i < js.length && js[i].t === 'op' && (js[i].v === '+' || js[i].v === '−')) {
        var o = js[i].v; i++; var w = produit(); v = o === '+' ? v + w : v - w;
      }
      return v;
    }
    return somme();
  }
  // Le verdict, CALCULÉ : { indispensable, cause }
  function examine(js, id) {
    var sans = sansPaire(js, id);
    if (!licite(sans)) return { indispensable: true, cause: 'interdite', sans: sans };
    var v1 = valeur(js), v2 = valeur(sans);
    if (v1 !== v2) return { indispensable: true, cause: 'valeur', sans: sans, v1: v1, v2: v2 };
    return { indispensable: false, cause: 'inutile', sans: sans, v1: v1 };
  }
  function role(js, id) {
    var dedans = 0, dans = false;
    for (var i = 0; i < js.length; i++) {
      if (js[i].t === '(' && js[i].id === id) { dans = true; continue; }
      if (js[i].t === ')' && js[i].id === id) break;
      if (dans) dedans++;
    }
    return dedans === 1 ? 'signe' : 'priorite';
  }

  /* ===================================================================== */
  /* Les modèles d'écriture, à une seule paire                             */
  /* ===================================================================== */
  function ent(rnd, a, b) { return rnd.entier(a, b); }
  function ent2(rnd, a, b, autre) {
    var v = rnd.entier(a, b);
    for (var i = 0; i < 40 && v === autre; i++) v = rnd.entier(a, b);
    return v === autre ? (v < b ? v + 1 : v - 1) : v;
  }

  var MODELES = [
    // parenthèses de signe
    function (r) { var a = ent(r,2,15), b = ent(r,2,12);
      return [nb(a), op(r.booleen(0.5) ? '+' : '−')].concat(paire(1, [nb(-b)])); },
    function (r) { var a = ent(r,2,15), b = ent(r,2,12);
      return [nb(a), op('+')].concat(paire(1, [nb(b, true)])); },
    function (r) { var a = ent(r,2,9), b = ent(r,2,9);
      return [nb(a), op('×')].concat(paire(1, [nb(-b)])); },
    function (r) { var a = ent(r,2,12), b = ent(r,2,15);
      return paire(1, [nb(-a)]).concat([op(r.booleen(0.5) ? '+' : '−'), nb(b)]); },
    function (r) { var a = ent(r,2,12), b = ent(r,2,15);
      return paire(1, [nb(a, true)]).concat([op('+'), nb(b)]); },
    // parenthèses de priorité
    function (r) { var a = ent(r,5,18), b = ent(r,2,9), c = ent2(r,2,9,b);
      return [nb(a), op('−')].concat(paire(1, [nb(b), op('−'), nb(c)])); },
    function (r) { var a = ent(r,5,18), b = ent(r,2,9), c = ent2(r,2,9,b);
      return [nb(a), op('+')].concat(paire(1, [nb(b), op('−'), nb(c)])); },
    function (r) { var a = ent(r,2,12), b = ent2(r,2,9,0), c = ent(r,2,6);
      return paire(1, [nb(a), op('−'), nb(b)]).concat([op('×'), nb(c)]); },
    function (r) { var a = ent(r,2,12), b = ent(r,2,9), c = ent(r,2,6);
      return [nb(a), op('+')].concat(paire(1, [nb(b), op('×'), nb(c)])); },
    function (r) { var a = ent(r,3,15), b = ent2(r,2,9,0), c = ent(r,2,9);
      return paire(1, [nb(a), op('−'), nb(b)]).concat([op('−'), nb(c)]); },
    function (r) { var a = ent(r,2,9), b = ent(r,3,12), c = ent2(r,2,9,b);
      return [nb(a), op('×')].concat(paire(1, [nb(b), op('−'), nb(c)])); }
  ];

  /* ===================================================================== */
  /* 1. Quelle écriture est correcte ?                                     */
  /* ===================================================================== */
  function qCorrecte(rnd, palier) {
    var a = ent(rnd, 2, 15), b = ent(rnd, 2, 12);
    var o = rnd.choix(['+', '−', '×']);
    var bonne = [nb(a), op(o)].concat(paire(1, [nb(-b)]));
    var oTex = o === '×' ? ' \\times ' : (o === '−' ? ' - ' : ' + ');
    // Les fautes : le nombre relatif privé de ses parenthèses, une parenthèse
    // qu'on n'a pas refermée, une fermante toute seule.
    var prop = rnd.melange([
      { cle: 'bon', tex: tex(bonne) },
      { cle: 'colle', tex: a + oTex + '-' + b },
      { cle: 'double', tex: a + oTex + '(-' + b },
      { cle: 'ferme', tex: a + oTex + '-' + b + ')' }
    ]);

    return {
      enonce: 'On veut écrire le calcul « ' + fmtV(a) + ' ' + o + ' ' + fmtV(-b) + ' ».<br>' +
        'Laquelle de ces écritures est <b>correcte</b> ?',
      type: 'qcm',
      choix: prop.map(function (p) { return m(p.tex); }),
      correct: prop.map(function (p) { return p.cle; }).indexOf('bon'),
      etapes: [
        'On n\'écrit jamais <b>deux symboles à la suite</b> : ni ' + m('+ -') + ', ni ' +
          m('- -') + ', ni ' + m('\\times -') + '.',
        'Pour écrire un nombre <b>négatif</b> juste après un symbole d\'opération, on le met ' +
          'entre <b>parenthèses</b> : ' + m(tex(bonne)) + '.',
        'Les autres écritures laissent deux symboles côte à côte, ou une parenthèse qui ne se ' +
          'referme pas : elles ne veulent rien dire.'
      ],
      indices: ['Regarde ce qui se trouve juste après le symbole d\'opération.',
                'Deux symboles à la suite, c\'est interdit : il faut une parenthèse.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 2. Ces parenthèses sont-elles indispensables ?                        */
  /* ===================================================================== */
  function qIndispensable(rnd, palier) {
    // Aux premiers paliers on reste sur les parenthèses de signe, dont le
    // critère ne demande aucun calcul.
    var choixMod = palier === 1 ? MODELES.slice(0, 5)
                 : palier === 2 ? MODELES
                 : MODELES.slice(5).concat(MODELES.slice(0, 5));
    var js = rnd.choix(choixMod)(rnd);
    var v = examine(js, 1), r = role(js, 1);
    var ordre = rnd.melange([
      { cle: 'oui', txt: 'Oui, elles sont indispensables' },
      { cle: 'non', txt: 'Non, on peut les enlever sans rien changer' }
    ]);

    var pourquoi = v.cause === 'interdite'
      ? 'Sans elles, on obtiendrait ' + m(tex(v.sans)) + ' : <b>deux symboles à la suite</b>, ' +
        'ce qui ne s\'écrit pas.'
      : v.cause === 'valeur'
        ? 'Sans elles, on obtiendrait ' + m(tex(v.sans)) + ', qui vaut <b>' + fmtV(v.v2) +
          '</b> au lieu de <b>' + fmtV(v.v1) + '</b> : le résultat <b>change</b>.'
        : 'Sans elles, on obtiendrait ' + m(tex(v.sans)) + ' : l\'écriture reste <b>correcte</b> ' +
          'et vaut toujours <b>' + fmtV(v.v1) + '</b>.';

    return {
      enonce: 'Dans l\'écriture ' + m(tex(js)) + ', les parenthèses sont-elles ' +
        '<b>indispensables</b> ?',
      type: 'qcm',
      choix: ordre.map(function (x) { return x.txt; }),
      correct: ordre.map(function (x) { return x.cle; }).indexOf(v.indispensable ? 'oui' : 'non'),
      etapes: [
        r === 'signe'
          ? 'Ces parenthèses enferment <b>un seul nombre</b> : c\'est une <b>parenthèse de ' +
            'signe</b>, elle sert à écrire un nombre relatif.'
          : 'Ces parenthèses enferment <b>tout un calcul</b> : c\'est une <b>parenthèse de ' +
            'priorité</b>, elle sert à le faire passer en premier.',
        'Pour savoir si elles sont indispensables, on les <b>enlève</b> et on regarde.',
        pourquoi,
        v.indispensable
          ? 'Elles sont donc <b>indispensables</b>.'
          : 'Elles ne sont donc <b>pas indispensables</b> — on a le droit de les garder pour y ' +
            'voir plus clair, mais on peut s\'en passer.'
      ],
      indices: [
        'Enlève-les mentalement, et regarde ce que devient l\'écriture.',
        'Deux questions : l\'écriture obtenue est-elle <b>permise</b> ? Et donne-t-elle le ' +
          '<b>même résultat</b> ?'
      ],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 3. Simplifier l'écriture                                              */
  /* ===================================================================== */
  function qSimplifier(rnd, palier) {
    var a = ent(rnd, 2, 15), b = ent(rnd, 2, 12);
    var opSigne = rnd.booleen(0.5) ? '+' : '−';
    var neg = rnd.booleen(0.5);
    var js = [nb(a), op(opSigne)].concat(paire(1, [nb(neg ? -b : b, true)]));
    // a + (+b) = a + b ; a + (−b) = a − b ; a − (+b) = a − b ; a − (−b) = a + b
    // Autrement dit : deux signes IDENTIQUES donnent un +, deux signes
    // DIFFÉRENTS donnent un −.
    var signeFinal = ((opSigne === '−') === neg) ? '+' : '−';
    var bonne = tex([nb(a), op(signeFinal === '+' ? '+' : '−'), nb(b)]);
    var prop = rnd.melange([
      { cle: 'bon', tex: bonne },
      { cle: 'inverse', tex: tex([nb(a), op(signeFinal === '+' ? '−' : '+'), nb(b)]) },
      { cle: 'signeA', tex: tex([nb(-a), op(signeFinal === '+' ? '+' : '−'), nb(b)]) },
      { cle: 'colle', tex: tex(js).replace('(', '').replace(')', '') }
    ]);

    return {
      enonce: 'Simplifie cette écriture, c\'est-à-dire réécris-la <b>sans parenthèses</b> :<br>' +
        m(tex(js)),
      type: 'qcm',
      choix: prop.map(function (p) { return m(p.tex); }),
      correct: prop.map(function (p) { return p.cle; }).indexOf('bon'),
      etapes: [
        'Les quatre règles à connaître : ' + m('a + (+b) = a + b') + ', ' +
          m('a + (-b) = a - b') + ', ' + m('a - (+b) = a - b') + ', ' + m('a - (-b) = a + b') + '.',
        'Ici on a ' + m(opSigne === '+' ? 'a + (' : 'a - (') + (neg ? m('-b') : m('+b')) +
          m(')') + ' : les deux symboles ' + m(opSigne + (neg ? '-' : '+')) +
          ' se combinent en un seul, le ' + m(signeFinal) + '.',
        'On obtient ' + m(bonne) + '.',
        'Vérification : les deux écritures valent bien <b>' + fmtV(valeur(js)) + '</b>.'
      ],
      indices: ['Deux signes qui se suivent se remplacent par un seul.',
                'Deux signes <b>identiques</b> donnent un +, deux signes <b>différents</b> ' +
                  'donnent un −.'],
      duree: 55
    };
  }

  /* ===================================================================== */
  /* 4. Les parenthèses changent-elles le résultat ?                       */
  /* ===================================================================== */
  function qValeur(rnd, palier) {
    // Un modèle de priorité dont on sait que les parenthèses comptent.
    var js = null;
    for (var i = 0; i < 40 && !js; i++) {
      var essai = rnd.choix(MODELES.slice(5))(rnd);
      if (examine(essai, 1).cause === 'valeur') js = essai;
    }
    if (!js) js = [nb(12), op('−')].concat(paire(1, [nb(7), op('−'), nb(3)]));
    var v = examine(js, 1);
    var avec = rnd.booleen(0.5);

    return {
      enonce: 'Calcule :<br>' + m(tex(avec ? js : v.sans)),
      type: 'nombre', reponse: avec ? v.v1 : v.v2,
      etapes: [
        avec
          ? 'Les parenthèses passent en <b>premier</b> : on calcule d\'abord ce qu\'elles ' +
            'contiennent.'
          : 'Il n\'y a pas de parenthèses : on applique les priorités habituelles — les ' +
            '<b>multiplications</b> d\'abord, puis les additions et soustractions <b>de gauche ' +
            'à droite</b>.',
        m(tex(avec ? js : v.sans) + ' = ' + fmtV(avec ? v.v1 : v.v2).replace('−', '-')),
        '<b>À comparer :</b> ' + m(tex(js)) + ' vaut <b>' + fmtV(v.v1) + '</b>, alors que ' +
          m(tex(v.sans)) + ' vaut <b>' + fmtV(v.v2) + '</b>. Ces parenthèses-là sont donc ' +
          '<b>indispensables</b> : les enlever change le résultat.'
      ],
      indices: [avec ? 'Commence par le calcul entre parenthèses.'
                     : 'Sans parenthèses : les multiplications d\'abord, puis on lit de gauche ' +
                       'à droite.',
                'Attention au signe du résultat.'],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 5. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'On peut écrire \\(7 + -4\\).', ok: false,
      d: 'Non : on n\'écrit jamais <b>deux symboles à la suite</b>. Il faut ' +
         '\\(7 + (-4)\\), ou bien la forme simplifiée \\(7 - 4\\).' },
    { t: 'On peut écrire \\(-4 + 7\\) sans parenthèses.', ok: true,
      d: 'Oui : le nombre négatif est en <b>début</b> d\'écriture, il ne suit aucun symbole ' +
         'd\'opération. Les parenthèses ne sont pas nécessaires.' },
    { t: '\\(8 - (3 - 5)\\) et \\(8 - 3 - 5\\) donnent le même résultat.', ok: false,
      d: 'Non : \\(8 - (3 - 5) = 8 - (-2) = 10\\), alors que \\(8 - 3 - 5 = 0\\). Derrière un ' +
         'signe −, les parenthèses changent tout.' },
    { t: '\\(7 + (3 \\times 2)\\) et \\(7 + 3 \\times 2\\) donnent le même résultat.', ok: true,
      d: 'Oui : la multiplication est <b>déjà</b> prioritaire, les parenthèses ne servent à ' +
         'rien ici. Les deux valent 13.' },
    { t: 'Des parenthèses qui ne sont pas indispensables sont <b>interdites</b>.', ok: false,
      d: 'Non : elles sont seulement inutiles. On a parfaitement le droit de les garder pour y ' +
         'voir plus clair.' },
    { t: '\\((5 - 8) \\times 2\\) et \\(5 - 8 \\times 2\\) donnent le même résultat.', ok: false,
      d: 'Non : \\((5 - 8) \\times 2 = -6\\), alors que \\(5 - 8 \\times 2 = -11\\), puisque la ' +
         'multiplication passe avant. Ces parenthèses sont indispensables.' },
    { t: 'Dans \\(4 \\times (-3)\\), les parenthèses sont indispensables.', ok: true,
      d: 'Oui : sans elles on écrirait \\(4 \\times -3\\), avec deux symboles à la suite.' },
    { t: 'Simplifier \\(6 - (-2)\\) donne \\(6 - 2\\).', ok: false,
      d: 'Non : soustraire \\(-2\\), c\'est ajouter \\(+2\\). Cela donne \\(6 + 2 = 8\\). Deux ' +
         'signes − à la suite donnent un +.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Deux questions : l\'écriture est-elle <b>permise</b> ? Et le résultat ' +
                '<b>change-t-il</b> si on enlève les parenthèses ?'],
      duree: 40
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'parentheses', competence: 'parentheses', level: '5eme',
    titre: 'Les parenthèses indispensables', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['correcte', 'correcte', 'indispensable', 'proprietes'] :
        palier === 2 ? ['correcte', 'indispensable', 'indispensable', 'simplifier',
                        'proprietes'] :
        palier === 3 ? ['indispensable', 'simplifier', 'valeur', 'valeur', 'proprietes'] :
                       ['indispensable', 'indispensable', 'valeur', 'valeur', 'simplifier',
                        'proprietes']);

      if (quoi === 'correcte') return qCorrecte(rnd, palier);
      if (quoi === 'simplifier') return qSimplifier(rnd, palier);
      if (quoi === 'valeur') return qValeur(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qIndispensable(rnd, palier);
    }
  });

})();
