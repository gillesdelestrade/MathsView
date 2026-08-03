/*
 * Le POOL DE FONCTIONS DE RÉFÉRENCE — commun à TOUTES les leçons « Fonctions ».
 *
 * Une leçon ne définit pas ses propres formules : elle demande la liste au pool
 * (MathsView.fonctions.liste()) et travaille avec ce qu'elle reçoit. Ajouter une
 * fonction ICI la fait donc apparaître, sans autre modification, dans toutes les
 * leçons qui utilisent le pool (tableau de valeurs, lecture graphique, sens de
 * variation, etc.).
 *
 * Ce fichier est chargé dans index.html APRÈS js/app.js et AVANT les leçons.
 *
 * ---------------------------------------------------------------------------
 * Description d'une fonction du pool
 * ---------------------------------------------------------------------------
 *   key        identifiant court (clé de bouton, de mémorisation…)
 *   nom        nom complet, pour un titre : « La fonction carré »
 *   court      étiquette courte pour un bouton : « x² »
 *   couleur    couleur de sa courbe
 *   params     curseurs éventuels : [{ name, label, min, max, step, value }].
 *              Les valeurs courantes sont passées aux fonctions ci-dessous
 *              dans un objet p, par exemple p = { a: 2, b: -1 }.
 *   expr(p)    l'expression de f(x) en HTML simple : « 2x − 1 », « x² », « √x »
 *   tex(p)     la même chose en LaTeX, pour un texte passé à MathJax
 *   f(x, p)    la valeur de f(x)
 *   defini(x, p)  x est-il dans l'ensemble de définition ? (absent = toujours)
 *   xmin/xmax  bornes du domaine, quand il en a (√ : xmin = 0)
 *   trous      les valeurs interdites À L'INTÉRIEUR du domaine (1/x : [0]). Elles
 *              coupent la courbe en plusieurs branches — voir branches() plus bas.
 *   ensemble   l'ensemble de définition écrit pour l'élève : « ℝ », « [0 ; +∞[ »
 *   courbe     le nom de sa courbe : « une parabole »
 *   calcul(x, p)  les étapes du calcul de f(x), à afficher reliées par des « = » :
 *                 pour la fonction carré et x = −3 → ['(−3)²', '9']
 *   image(x, p)  l'image de x ÉCRITE exactement quand elle ne tombe pas juste
 *                (1/x en −3 → « −1/3 », plutôt que l'arrondi −0,33)
 *   oppose(p)  l'écriture de f(−x), étape par étape, comme au tableau :
 *                pour la fonction carré → ['(−x)²', 'x²']. C'est la SEULE chose
 *                à fournir pour que la leçon sur la parité montre le calcul ;
 *                le verdict (paire, impaire, ni l'une ni l'autre), lui, est
 *                établi tout seul — voir parite() plus bas.
 *   sommets(p) les abscisses où la fonction CHANGE DE SENS — le sommet de la
 *                parabole, la pointe du « V » — avec leur écriture exacte :
 *                  [{ v: 0, txt: '0' }]
 *                C'est la SEULE chose à fournir pour que le tableau de
 *                variations se construise (voir variations() plus bas) ; le sens
 *                de chaque morceau, lui, est trouvé tout seul.
 *   antec(k, p)  les ANTÉCÉDENTS de k, c'est-à-dire les solutions de f(x) = k,
 *                avec leur écriture exacte :
 *                  { sols: [{ v: -2.236…, txt: '−√5' }, { v: 2.236…, txt: '√5' }] }
 *                { sols: [] } quand k n'a pas d'antécédent, { tout: true } quand
 *                la fonction est constante égale à k. C'est la SEULE chose à
 *                fournir pour que solutions() sache résoudre f(x) = k ET les
 *                quatre inéquations (voir solutions() plus bas).
 *   etapes(rel, k, p)  le raisonnement algébrique, ligne à ligne, pour
 *                résoudre f(x) ⋈ k (⋈ parmi =, <, ⩽, >, ⩾)
 *   remarque   une phrase à retenir, affichée dans le panneau de la leçon
 *
 * Tout est optionnel sauf key, nom, court, expr, f. Une leçon qui a besoin d'un
 * champ absent doit prévoir une valeur par défaut (voir defini() ci-dessous).
 */
(function (global) {
  'use strict';

  var MV = global.MathsView;
  if (!MV) {
    console.error('MathsView : js/fonctions-base.js doit être chargé après js/app.js.');
    return;
  }

  /* ===================================================================== */
  /* Écriture des nombres à la française : virgule décimale, vrai signe −  */
  /* ===================================================================== */

  // 2 décimales par défaut, zéros inutiles supprimés : 3 → « 3 », 1.4142 → « 1,41 ».
  function nb(v, dec) {
    if (v === undefined || v === null || !isFinite(v)) return '—';
    var d = dec === undefined ? 2 : dec;
    var k = Math.pow(10, d);
    var r = Math.round(v * k) / k;
    if (r === 0) r = 0;                       // évite le « −0 »
    return String(r).replace('.', ',').replace('-', '−');
  }

  // La valeur affichée est-elle exacte, ou seulement arrondie ? (√2 → non)
  function exact(v, dec) {
    var d = dec === undefined ? 2 : dec;
    var k = Math.pow(10, d);
    return Math.abs(v - Math.round(v * k) / k) < 1e-12;
  }

  // Parenthèses autour des négatifs, comme au tableau : (−3)² et non −3².
  function par(v) { return v < 0 ? '(' + nb(v) + ')' : nb(v); }

  // Un nombre dans une formule LaTeX : la virgule y demande des accolades.
  function texNum(v) { return String(v).replace('.', '{,}'); }

  /* Écriture de ax + b, en évitant les « 1x », « + 0 » et autres maladresses.
     `moins` et `num` diffèrent selon la cible : en HTML on écrit « 2,5 » avec le
     vrai signe « − », en LaTeX « 2{,}5 » avec le tiret que MathJax transforme. */
  function lin(a, b, moins, num) {
    var t = '';
    if (a === 1) t = 'x';
    else if (a === -1) t = moins + 'x';
    else if (a !== 0) t = (a < 0 ? moins + num(-a) : num(a)) + 'x';
    if (t === '') return (b < 0 ? moins + num(-b) : num(b));   // a = 0 : constante
    if (b > 0) t += ' + ' + num(b);
    else if (b < 0) t += ' ' + moins + ' ' + num(-b);
    return t;
  }
  function htmlNum(v) { return String(v).replace('.', ','); }
  function linHtml(a, b) { return lin(a, b, '−', htmlNum); }
  function linTex(a, b)  { return lin(a, b, '-', texNum); }

  // Le terme « + b » / « − b » tel qu'on l'écrit à la suite d'un calcul.
  function ajout(b) { return b < 0 ? ' − ' + nb(-b) : ' + ' + nb(b); }

  /* 1/x écrit comme on l'écrit au tableau : le signe devant, des entiers de part
     et d'autre de la barre. 1/(−3) → « −1/3 », 1/1,5 → « 2/3 », 1/(−1) → « −1 ». */
  function frac1(x) {
    var num = 1, den = x;
    if (den !== Math.round(den)) { num *= 2; den *= 2; }   // les demis : 1/1,5 = 2/3
    if (den < 0) { num = -num; den = -den; }
    return den === 1 ? nb(num) : nb(num) + '/' + nb(den);
  }

  function pgcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a || 1; }

  /* Le quotient num/den écrit EXACTEMENT : on s'y ramène à des entiers, on
     simplifie, et l'on préfère l'écriture décimale quand elle tombe juste.
     4/2 → « 2 » ; 1/4 → « 0,25 » ; 1/3 → « 1/3 » ; 2/(−6) → « −1/3 ». */
  function fracTxt(num, den) {
    if (den === 0) return '—';
    var f = 1;
    while (f < 1e6 && (Math.abs(num * f - Math.round(num * f)) > 1e-9 ||
                       Math.abs(den * f - Math.round(den * f)) > 1e-9)) f *= 10;
    var n = Math.round(num * f), d = Math.round(den * f);
    if (d < 0) { n = -n; d = -d; }
    var g = pgcd(Math.abs(n), d);
    n /= g; d /= g;
    if (d === 1) return nb(n);
    if (exact(n / d, 2)) return nb(n / d);            // 1/4 se lit mieux « 0,25 »
    return nb(n) + '/' + nb(d);
  }

  /* √k écrit au mieux : √4 → « 2 », √6,25 → « 2,5 », √5 → « √5 » (exact, alors
     que 2,24 n'en serait qu'un arrondi). */
  function racineTxt(k) {
    var r = Math.sqrt(k);
    return exact(r) ? nb(r) : '√' + nb(k);
  }

  // Une borne d'intervalle : les infinis s'écrivent, le reste se lit.
  function borneTxt(v) {
    return v === -Infinity ? '−∞' : v === Infinity ? '+∞' : nb(v);
  }

  /* ===================================================================== */
  /* Les relations                                                         */
  /*                                                                       */
  /* Une leçon résout f(x) ⋈ k, où ⋈ est l'une des cinq relations ci-       */
  /* dessous. Elles s'écrivent telles quelles dans les textes.             */
  /* ===================================================================== */
  var RELS = ['=', '<', '⩽', '>', '⩾'];

  function verifie(v, rel, k) {
    var e = 1e-9;
    if (rel === '=') return Math.abs(v - k) < e;
    if (rel === '<') return v < k - e;
    if (rel === '⩽') return v <= k + e;
    if (rel === '>') return v > k + e;
    if (rel === '⩾') return v >= k - e;
    return false;
  }
  function large(rel) { return rel === '⩽' || rel === '⩾' || rel === '='; }
  /* Les textes du site sont posés en HTML : « < » et « > » y sont les caractères
     réservés des balises et doivent s'écrire en entités. À utiliser DÈS qu'une
     relation part dans une phrase affichée. */
  function relHtml(rel) { return rel === '<' ? '&lt;' : rel === '>' ? '&gt;' : rel; }
  // La relation retournée : diviser par un nombre négatif change le sens.
  function retourne(rel) {
    return { '=': '=', '<': '>', '⩽': '⩾', '>': '<', '⩾': '⩽' }[rel];
  }
  // Le coefficient devant x : on n'écrit ni « 1x » ni « −1x ».
  function coefTxt(a) { return a === 1 ? '' : a === -1 ? '−' : nb(a); }

  /* ===================================================================== */
  /* Parité                                                                */
  /*                                                                       */
  /* Les nombres d'essai qui servent à classer une fonction (voir parite() */
  /* plus bas) : on compare f(−x) et f(x) sur chacun d'eux. Les premiers   */
  /* sont ronds — ce sont eux que l'on montrera à l'élève en cas de        */
  /* contre-exemple ; les suivants sont là pour ne pas conclure trop vite  */
  /* sur une coïncidence.                                                  */
  /* ===================================================================== */
  var ESSAIS = [1, 2, 3, 0.5, 1.5, 2.5, 4, 5, 0.75, 3.25, 4.6];

  /* Le domaine est-il SYMÉTRIQUE par rapport à 0 ? C'est la condition pour que
     la question de la parité ait un sens : il faut que −x ait une image dès que
     x en a une, sinon f(−x) et f(x) ne sont pas comparables (√x). */
  function symetrique(fn, p) {
    var xmin = fn.xmin === undefined ? -Infinity : fn.xmin;
    var xmax = fn.xmax === undefined ?  Infinity : fn.xmax;
    if (xmin !== -xmax) return false;
    if (!fn.defini) return true;
    return ESSAIS.every(function (t) {
      return fn.defini(t, p) === fn.defini(-t, p);
    });
  }

  /* ===================================================================== */
  /* Sens de variation                                                     */
  /*                                                                       */
  /* Sur quel sens la fonction va-t-elle de a à b ? On la regarde en une   */
  /* douzaine de points : si elle ne fait que monter, elle est croissante ;*/
  /* que descendre, décroissante ; si elle ne bouge pas, constante. Les    */
  /* bornes où elle n'est pas définie sont sautées (1/x tout près de 0).   */
  /* Le résultat n'est sûr que si l'intervalle ne contient pas de          */
  /* changement de sens : c'est le rôle de sommets() de les donner.        */
  /* ===================================================================== */
  function sensSur(fn, p, a, b) {
    var N = 12, prev = null, monte = 0, descend = 0;
    for (var i = 0; i <= N; i++) {
      var t = a + (b - a) * (i / N);
      if (fn.defini && !fn.defini(t, p)) continue;
      var v = fn.f(t, p);
      if (!isFinite(v)) continue;
      if (prev !== null) {
        if (v - prev > 1e-9) monte++;
        else if (v - prev < -1e-9) descend++;
      }
      prev = v;
    }
    if (monte && !descend) return 'croissante';
    if (descend && !monte) return 'decroissante';
    if (!monte && !descend) return 'constante';
    return 'variable';                     // sommet oublié : la leçon le dira
  }

  /* ===================================================================== */
  /* Le pool                                                               */
  /*                                                                       */
  /* L'ordre ci-dessous est celui des boutons dans les leçons : on va du    */
  /* plus simple au plus difficile.                                        */
  /* ===================================================================== */
  var POOL = [
    {
      key: 'identite',
      nom: 'La fonction identité',
      court: 'x',
      couleur: '#0d9488',
      expr: function () { return 'x'; },
      tex:  function () { return 'x'; },
      f:    function (x) { return x; },
      ensemble: 'ℝ',
      courbe: 'une droite passant par l\'origine',
      calcul: function (x) { return [nb(x)]; },
      oppose: function () { return ['−x']; },
      antec: function (k) { return { sols: [{ v: k, txt: nb(k) }] }; },
      etapes: function (rel, k) {
        return ['La condition s\'écrit directement <b>x ' + relHtml(rel) + ' ' + nb(k) + '</b> : ' +
                'l\'inconnue est déjà seule, il n\'y a rien à transformer.'];
      },
      remarque: 'Cette fonction associe à chaque nombre… ce même nombre. Sa courbe ' +
                'est la droite d\'équation y = x, celle qui coupe le repère en deux ' +
                '(la « première bissectrice »).'
    },
    {
      key: 'affine',
      nom: 'Une fonction affine',
      court: 'ax + b',
      couleur: '#2563eb',
      params: [
        { name: 'a', label: 'a', min: -3, max: 3, step: 0.5, value: 2 },
        { name: 'b', label: 'b', min: -5, max: 5, step: 0.5, value: -1 }
      ],
      expr: function (p) { return linHtml(p.a, p.b); },
      tex:  function (p) { return linTex(p.a, p.b); },
      f:    function (x, p) { return p.a * x + p.b; },
      ensemble: 'ℝ',
      courbe: 'une droite',
      calcul: function (x, p) {
        var s = [nb(p.a) + ' × ' + par(x) + ajout(p.b)];
        if (p.b !== 0) s.push(nb(p.a * x) + ajout(p.b));
        s.push(nb(p.a * x + p.b));
        return s;
      },
      /* On remplace x par (−x), puis on range : a(−x) + b = −ax + b. Avec a = 0
         il n'y a pas de x à remplacer (la fonction est constante), et le
         deuxième temps ne sert que s'il change l'écriture. */
      oppose: function (p) {
        if (p.a === 0) return [nb(p.b)];
        var t = p.a === 1 ? '(−x)' : p.a === -1 ? '−(−x)' : nb(p.a) + ' × (−x)';
        var s = [t + (p.b === 0 ? '' : ajout(p.b))];
        var fin = linHtml(-p.a, p.b);
        if (fin !== s[0]) s.push(fin);
        return s;
      },
      antec: function (k, p) {
        if (p.a === 0) return p.b === k ? { tout: true } : { sols: [] };
        return { sols: [{ v: (k - p.b) / p.a, txt: fracTxt(k - p.b, p.a) }] };
      },
      etapes: function (rel, k, p) {
        var a = p.a, b = p.b;
        if (a === 0) {
          return ['Avec a = 0, la fonction est <b>constante</b> : f(x) = ' + nb(b) +
                  ' quel que soit x. La condition ' + nb(b) + ' ' + relHtml(rel) + ' ' + nb(k) +
                  ' est ' + (verifie(b, rel, k) ? '<b>vraie</b>' : '<b>fausse</b>') +
                  ', et elle ne dépend pas de x : tous les x conviennent, ou aucun.'];
        }
        var e = [linHtml(a, b) + ' ' + relHtml(rel) + ' ' + nb(k)];
        if (b !== 0) {
          e.push(coefTxt(a) + 'x ' + relHtml(rel) + ' ' + nb(k) + (b < 0 ? ' + ' + nb(-b) : ' − ' + nb(b)) +
                 '<i>on ' + (b < 0 ? 'ajoute ' + nb(-b) : 'retire ' + nb(b)) +
                 ' de chaque côté</i>');
          e.push(coefTxt(a) + 'x ' + relHtml(rel) + ' ' + nb(k - b));
        }
        if (a === 1) return e;                       // x est déjà seul
        var s = fracTxt(k - b, a);
        if (rel === '=' || a > 0) {
          e.push('x ' + relHtml(rel) + ' ' + s + '<i>on divise par ' + nb(a) +
                 (rel === '=' ? '' : ', qui est positif : le sens ne change pas') + '</i>');
        } else {
          e.push('x ' + relHtml(retourne(rel)) + ' ' + s + '<i>on divise par ' + nb(a) +
                 ', qui est <b>négatif</b> : l\'inégalité <b>change de sens</b></i>');
        }
        return e;
      },
      remarque: 'a est le coefficient directeur : quand x augmente de 1, f(x) varie ' +
                'de a. b est l\'ordonnée à l\'origine : la droite coupe l\'axe des ' +
                'ordonnées au point (0 ; b).'
    },
    {
      key: 'abs',
      nom: 'La valeur absolue',
      court: '|x|',
      couleur: '#ea580c',
      expr: function () { return '|x|'; },
      tex:  function () { return '\\left|x\\right|'; },
      f:    function (x) { return Math.abs(x); },
      ensemble: 'ℝ',
      courbe: 'deux demi-droites qui forment un « V »',
      calcul: function (x) { return ['|' + nb(x) + '|', nb(Math.abs(x))]; },
      // x et −x sont à la même distance de 0 : la valeur absolue ne les distingue pas.
      oppose: function () { return ['|−x|', '|x|']; },
      sommets: function () { return [{ v: 0, txt: '0' }]; },   // la pointe du « V »
      antec: function (k) {
        if (k < 0) return { sols: [] };
        if (k === 0) return { sols: [{ v: 0, txt: '0' }] };
        return { sols: [{ v: -k, txt: nb(-k) }, { v: k, txt: nb(k) }] };
      },
      etapes: function (rel, k) {
        var e = ['|x| se lit « distance de x à 0 » : la question devient une question ' +
                 'de <b>distance</b>.'];
        if (k < 0) {
          e.push('Une distance n\'est <b>jamais négative</b>, et ' + nb(k) + ' &lt; 0 : la ' +
                 'condition |x| ' + relHtml(rel) + ' ' + nb(k) + ' est donc ' +
                 (rel === '>' || rel === '⩾' ? 'vraie pour <b>tous</b> les x.'
                                             : '<b>impossible</b>.'));
          return e;
        }
        if (rel === '=') {
          e.push(k === 0 ? 'Seul 0 est à la distance 0 de lui-même.'
                         : 'Les nombres situés à la distance ' + nb(k) + ' de 0 sont ' +
                           nb(-k) + ' et ' + nb(k) + '.');
        } else if (rel === '<' || rel === '⩽') {
          e.push('On cherche les x dont la distance à 0 est inférieure à ' + nb(k) +
                 ' : ce sont ceux <b>compris entre</b> ' + nb(-k) + ' et ' + nb(k) + '.');
        } else {
          e.push('On cherche les x dont la distance à 0 dépasse ' + nb(k) +
                 ' : ce sont ceux qui sont <b>avant</b> ' + nb(-k) + ' <b>ou après</b> ' +
                 nb(k) + '.');
        }
        return e;
      },
      remarque: '|x| est la distance de x à 0 : elle n\'est jamais négative. Deux ' +
                'nombres opposés ont la même image, la courbe est donc symétrique ' +
                'par rapport à l\'axe des ordonnées.'
    },
    {
      key: 'carre',
      nom: 'La fonction carré',
      court: 'x²',
      couleur: '#7c3aed',
      expr: function () { return 'x²'; },
      tex:  function () { return 'x^{2}'; },
      f:    function (x) { return x * x; },
      ensemble: 'ℝ',
      courbe: 'une parabole',
      calcul: function (x) { return [par(x) + '²', nb(x * x)]; },
      // Le carré d'un nombre et celui de son opposé sont égaux : (−x)² = x².
      oppose: function () { return ['(−x)²', 'x²']; },
      sommets: function () { return [{ v: 0, txt: '0' }]; },   // le sommet de la parabole
      antec: function (k) {
        if (k < 0) return { sols: [] };
        if (k === 0) return { sols: [{ v: 0, txt: '0' }] };
        return { sols: [{ v: -Math.sqrt(k), txt: '−' + racineTxt(k) },
                        { v:  Math.sqrt(k), txt: racineTxt(k) }] };
      },
      etapes: function (rel, k) {
        if (k < 0) {
          return ['Un carré n\'est <b>jamais négatif</b> : x² ⩾ 0 pour tout x.',
                  'Comme ' + nb(k) + ' &lt; 0, la condition x² ' + relHtml(rel) + ' ' + nb(k) + ' est ' +
                  (rel === '>' || rel === '⩾' ? 'vraie pour <b>tous</b> les x.'
                                              : '<b>impossible</b>.')];
        }
        if (k === 0) {
          return ['x² = 0 uniquement pour x = 0 ; partout ailleurs, x² > 0.',
                  rel === '=' ? 'Donc x = 0.'
                  : rel === '<' ? 'x² < 0 est <b>impossible</b>.'
                  : rel === '⩽' ? 'x² ⩽ 0 ne laisse que x = 0.'
                  : rel === '>' ? 'x² > 0 pour tout x <b>sauf</b> 0.'
                  : 'x² ⩾ 0 est vrai pour <b>tous</b> les x.'];
        }
        var r = racineTxt(k);
        var e = ['Les deux nombres dont le carré vaut ' + nb(k) + ' sont <b>−' + r +
                 '</b> et <b>' + r + '</b>' +
                 (exact(Math.sqrt(k)) ? '.'
                  : ' (√' + nb(k) + ' est la valeur exacte ; ' + nb(Math.sqrt(k)) +
                    ' n\'en est qu\'un arrondi).')];
        if (rel === '=') return e;
        if (rel === '<' || rel === '⩽') {
          e.push('Élever au carré rapproche de 0 les nombres entre −' + r + ' et ' + r +
                 ' : x² ' + relHtml(rel) + ' ' + nb(k) + ' équivaut à <b>−' + r + ' ' + relHtml(rel) +
                 ' x ' + relHtml(rel) + ' ' + r + '</b>.');
        } else {
          e.push('Au-delà, le carré dépasse ' + nb(k) + ' : x² ' + relHtml(rel) + ' ' + nb(k) +
                 ' équivaut à <b>x ' + relHtml(retourne(rel)) + ' −' + r + '</b> ou <b>x ' + relHtml(rel) +
                 ' ' + r + '</b>.');
        }
        return e;
      },
      remarque: 'Un carré n\'est jamais négatif, et deux nombres opposés ont la même ' +
                'image : la parabole est symétrique par rapport à l\'axe des ordonnées. ' +
                'Elle monte vite : f(5) = 25.'
    },
    {
      key: 'racine',
      nom: 'La fonction racine carrée',
      court: '√x',
      couleur: '#c026d3',
      xmin: 0,
      defini: function (x) { return x >= 0; },
      expr: function () { return '√x'; },
      tex:  function () { return '\\sqrt{x}'; },
      f:    function (x) { return Math.sqrt(x); },
      ensemble: '[0 ; +∞[',
      courbe: 'une demi-parabole couchée',
      calcul: function (x) {
        if (x < 0) return ['n\'existe pas'];
        var v = Math.sqrt(x);
        return exact(v) ? ['√' + nb(x), nb(v)] : ['√' + nb(x), '≈ ' + nb(v)];
      },
      /* Pas d'oppose() ici : pour x > 0, √(−x) n'existe pas. Le domaine n'étant
         pas symétrique par rapport à 0, la question de la parité ne se pose même
         pas — parite() le dit sans avoir besoin d'un calcul. */
      antec: function (k) {
        return k < 0 ? { sols: [] } : { sols: [{ v: k * k, txt: nb(k * k) }] };
      },
      etapes: function (rel, k) {
        var e = ['On ne travaille que sur l\'ensemble de définition : <b>x ⩾ 0</b>.'];
        if (k < 0) {
          e.push('Une racine carrée n\'est jamais négative : √x ⩾ 0. Comme ' + nb(k) +
                 ' &lt; 0, la condition √x ' + relHtml(rel) + ' ' + nb(k) + ' est ' +
                 (rel === '>' || rel === '⩾' ? 'vraie pour <b>tout</b> le domaine.'
                                             : '<b>impossible</b>.'));
          return e;
        }
        e.push('Les deux membres sont positifs : on peut les <b>élever au carré</b> sans ' +
               'changer la relation, car la fonction carré range les nombres positifs ' +
               'dans le même ordre.');
        e.push('√x ' + relHtml(rel) + ' ' + nb(k) + ' équivaut donc à <b>x ' + relHtml(rel) + ' ' +
               nb(k * k) + '</b>' +
               (rel === '<' || rel === '⩽' ? ', <b>sans oublier x ⩾ 0</b>.' : '.'));
        return e;
      },
      remarque: 'Aucun nombre négatif n\'a de racine carrée : la fonction n\'est ' +
                'définie que pour x ⩾ 0. Sa courbe part de l\'origine et ne monte ' +
                'que très lentement.'
    },
    {
      key: 'inverse',
      nom: 'La fonction inverse',
      court: '1/x',
      couleur: '#16a34a',
      trous: [0],                                  // 0 n'a pas d'image : la courbe y est coupée
      defini: function (x) { return Math.abs(x) > 1e-9; },
      expr: function () { return '1/x'; },
      tex:  function () { return '\\dfrac{1}{x}'; },
      f:    function (x) { return 1 / x; },
      ensemble: 'ℝ privé de 0',
      courbe: 'une hyperbole, en deux branches séparées',
      calcul: function (x) {
        if (Math.abs(x) <= 1e-9) return ['n\'existe pas'];
        var v = 1 / x, s = ['1/' + par(x)];
        // L'étape intermédiaire n'a d'intérêt que si elle change l'écriture :
        // 1/(−4) = −1/4, mais on n'écrit pas « 1/3 = 1/3 ».
        if (frac1(x) !== '1/' + nb(x)) s.push(frac1(x));
        var fin = exact(v) ? nb(v) : '≈ ' + nb(v);
        if (s[s.length - 1] !== fin) s.push(fin);
        return s;
      },
      image: function (x) { return frac1(x); },
      // Le signe « moins » du dénominateur remonte devant la fraction.
      oppose: function () { return ['1/(−x)', '−1/x']; },
      antec: function (k) {
        return k === 0 ? { sols: [] } : { sols: [{ v: 1 / k, txt: fracTxt(1, k) }] };
      },
      etapes: function (rel, k) {
        if (rel === '=') {
          return k === 0
            ? ['1/x est un quotient de numérateur 1 : il n\'est <b>jamais nul</b>. ' +
               'L\'équation 1/x = 0 n\'a donc pas de solution.']
            : ['1/x = ' + nb(k) + ' : en prenant l\'inverse des deux membres, ' +
               '<b>x = ' + fracTxt(1, k) + '</b> (et cette valeur est bien ≠ 0).'];
        }
        var e = ['<b>Piège :</b> on ne multiplie pas les deux membres par x sans ' +
                 'connaître son <b>signe</b> — l\'inégalité changerait de sens pour x &lt; 0.',
                 'On sépare donc les deux morceaux du domaine : sur ]−∞ ; 0[, 1/x est ' +
                 '<b>négatif</b> ; sur ]0 ; +∞[, il est <b>positif</b>.'];
        e.push(k === 0
          ? '1/x ne s\'annule jamais : sur chaque morceau, son signe est celui de x, ' +
            'ce qui règle la question.'
          : 'Sur chacun de ces morceaux la fonction inverse est <b>décroissante</b>, et ' +
            'elle vaut ' + nb(k) + ' en x = ' + fracTxt(1, k) + ' : c\'est ce nombre qui ' +
            'sépare les x qui conviennent des autres.');
        return e;
      },
      remarque: 'Diviser par 0 est impossible : 0 est le seul nombre qui n\'a pas ' +
                'd\'image. Sa courbe, une hyperbole, est faite de deux branches qui ' +
                'ne se rejoignent jamais. Plus x est grand, plus 1/x s\'approche de 0 ; ' +
                'plus x s\'approche de 0, plus 1/x devient grand.'
    }
  ];

  /* ===================================================================== */
  /* L'API utilisée par les leçons                                         */
  /* ===================================================================== */
  MV.fonctions = {
    // La liste complète, dans l'ordre pédagogique (copie : une leçon peut la trier).
    liste: function () { return POOL.slice(); },

    // Une fonction précise, par sa clé.
    get: function (key) {
      for (var i = 0; i < POOL.length; i++) if (POOL[i].key === key) return POOL[i];
      return null;
    },

    // Les valeurs de départ des paramètres : { a: 2, b: -1 }, {} s'il n'y en a pas.
    defauts: function (fn) {
      var p = {};
      (fn.params || []).forEach(function (s) { p[s.name] = s.value; });
      return p;
    },

    // f(x), et « x est-il dans l'ensemble de définition ? » — les deux seuls
    // points d'entrée à utiliser, pour que le domaine soit toujours respecté.
    valeur: function (fn, x, p) { return fn.f(x, p || {}); },
    defini: function (fn, x, p) { return fn.defini ? fn.defini(x, p || {}) : true; },

    // Bornes du domaine intersecté avec [x1 ; x2] (utile pour tracer la courbe).
    domaine: function (fn, x1, x2) {
      return [Math.max(x1, fn.xmin === undefined ? -Infinity : fn.xmin),
              Math.min(x2, fn.xmax === undefined ?  Infinity : fn.xmax)];
    },

    /* Le domaine découpé en MORCEAUX D'UN SEUL TENANT (là où la courbe se trace
       sans lever le crayon), limité à [x1 ; x2] — sans arguments, c'est le
       domaine entier, bornes infinies comprises.
         x²  → [{ a: −∞, b: +∞, oa: true,  ob: true  }]
         √x  → [{ a: 0,  b: +∞, oa: false, ob: true  }]
         1/x → [{ a: −∞, b: 0, … }, { a: 0, b: +∞, … }]
       `oa` / `ob` disent si la borne est EXCLUE : une borne infinie l'est
       toujours, une borne finie l'est si la fonction n'y est pas définie. */
    morceaux: function (fn, x1, x2) {
      var self = this;
      var a = Math.max(x1 === undefined ? -Infinity : x1,
                       fn.xmin === undefined ? -Infinity : fn.xmin);
      var b = Math.min(x2 === undefined ?  Infinity : x2,
                       fn.xmax === undefined ?  Infinity : fn.xmax);
      if (!(b > a)) return [];
      function ouvert(v) { return !isFinite(v) || !self.defini(fn, v); }
      var out = [{ a: a, b: b, oa: ouvert(a), ob: ouvert(b) }];
      (fn.trous || [])
        .filter(function (t) { return t > a && t < b; })
        .sort(function (m, n) { return m - n; })
        .forEach(function (t) {
          var last = out[out.length - 1];
          out[out.length - 1] = { a: last.a, b: t, oa: last.oa, ob: true };
          out.push({ a: t, b: last.b, oa: true, ob: last.ob });
        });
      return out;
    },

    /* Les mêmes morceaux, mais prêts à être TRACÉS : [[−5 ; 5]] pour x²,
       [[−5 ; −ε], [ε ; 5]] pour 1/x. Une leçon trace une courbe par morceau :
       d'un seul trait, le tracé relierait les deux branches de l'hyperbole par
       un trait vertical qui n'existe pas. Les morceaux s'arrêtent tout près du
       trou (ε), et non dessus : la courbe file alors vers le haut (ou le bas)
       hors de l'écran, comme il se doit. */
    branches: function (fn, x1, x2) {
      var eps = (x2 - x1) * 1e-3;
      return this.morceaux(fn, x1, x2).map(function (m) {
        return [m.oa ? m.a + eps : m.a, m.ob ? m.b - eps : m.b];
      });
    },

    // Les cinq relations que l'on sait résoudre, dans l'ordre d'un sélecteur.
    relations: RELS.slice(),
    // La relation retournée (diviser par un négatif change le sens) et le test
    // « ce nombre vérifie-t-il la relation ? », partagés avec les leçons.
    retourne: retourne,
    verifie: verifie,
    // « < » et « > » écrits pour du HTML : à utiliser dès qu'une relation part
    // dans un innerHTML, sinon le navigateur y voit le début d'une balise.
    relHtml: relHtml,

    /* Un intervalle écrit comme au tableau : « ]−2 ; 2[ », « [0 ; +∞[ », et
       « {3} » pour une solution isolée (a = b). */
    intervalleTxt: function (m) {
      if (m.a === m.b) return '{' + (m.ta !== undefined ? m.ta : borneTxt(m.a)) + '}';
      return (m.oa ? ']' : '[') + (m.ta !== undefined ? m.ta : borneTxt(m.a)) + ' ; ' +
             (m.tb !== undefined ? m.tb : borneTxt(m.b)) + (m.ob ? '[' : ']');
    },
    // Une réunion d'intervalles : « ]−∞ ; −2[ ∪ ]2 ; +∞[ », « ∅ » si vide.
    ensembleTxt: function (morceaux) {
      var self = this;
      if (!morceaux || !morceaux.length) return '∅';
      return morceaux.map(function (m) { return self.intervalleTxt(m); }).join(' ∪ ');
    },

    /* L'ensemble des solutions de f(x) ⋈ k, EXACT et sur tout l'ensemble de
       définition (pas seulement sur la fenêtre affichée).
       ---------------------------------------------------------------------
       Une seule chose est demandée à la fonction : antec(k, p), la liste de ses
       antécédents de k — c'est-à-dire les solutions de f(x) = k, avec leur
       écriture exacte (« −√5 » et non « −2,24 »). Tout le reste est déduit ici :
       ces solutions découpent le domaine en morceaux, et sur chaque morceau la
       relation est soit toujours vraie soit toujours fausse — il suffit donc
       d'y tester UN point pour savoir s'il fait partie de l'ensemble solution.
       Les bornes, elles, gardent l'écriture exacte donnée par antec().
       ---------------------------------------------------------------------
       Renvoie { egalite, points, morceaux, vide, txt } — ou null si la fonction
       ne sait pas résoudre (la leçon se rabat alors sur la seule lecture
       graphique). Les `morceaux` sont numériques : une leçon peut les tracer,
       les recouper avec sa fenêtre, etc. */
    solutions: function (fn, rel, k, p) {
      p = p || {};
      if (!fn.antec) return null;
      var self = this;
      var A = fn.antec(k, p) || { sols: [] };
      var dom = this.morceaux(fn);
      var sols = (A.sols || []).slice().sort(function (m, n) { return m.v - n.v; });

      function fini(morceaux, points) {
        var vide = !morceaux.length;
        var pareil = morceaux.length === dom.length && morceaux.every(function (m, i) {
          return m.a === dom[i].a && m.b === dom[i].b && m.oa === dom[i].oa && m.ob === dom[i].ob;
        });
        return { egalite: rel === '=', points: points || [], morceaux: morceaux, vide: vide,
                 // Quand l'ensemble solution est le domaine tout entier, on
                 // l'écrit comme la leçon l'écrit : « ℝ » plutôt que « ]−∞ ; +∞[ ».
                 txt: vide ? '∅' : (pareil && fn.ensemble ? fn.ensemble
                                                          : self.ensembleTxt(morceaux)) };
      }

      if (rel === '=') {
        if (A.tout) return fini(dom, []);            // fonction constante égale à k
        var r = fini(sols.map(function (s) {
          return { a: s.v, b: s.v, oa: false, ob: false, ta: s.txt, tb: s.txt };
        }), sols);
        // Les solutions d'une équation s'écrivent dans UNE seule paire
        // d'accolades : { −2 ; 2 }, et non { −2 } ∪ { 2 }.
        if (!r.vide) {
          r.txt = '{' + sols.map(function (s) { return s.txt; }).join(' ; ') + '}';
        }
        return r;
      }

      var out = [];
      dom.forEach(function (m) {
        // Les bornes du morceau, plus les solutions de f(x) = k qui tombent
        // dedans : entre deux bornes consécutives, la relation ne change pas.
        var bornes = [{ v: m.a, txt: borneTxt(m.a), ouv: m.oa }]
          .concat(sols.filter(function (s) { return s.v > m.a && s.v < m.b; })
                      .map(function (s) { return { v: s.v, txt: s.txt, racine: true }; }))
          .concat([{ v: m.b, txt: borneTxt(m.b), ouv: m.ob }]);

        for (var i = 0; i < bornes.length - 1; i++) {
          var g = bornes[i], d = bornes[i + 1];
          var t = isFinite(g.v) ? (isFinite(d.v) ? (g.v + d.v) / 2 : g.v + 1)
                                : (isFinite(d.v) ? d.v - 1 : 0);
          if (!verifie(fn.f(t, p), rel, k)) continue;
          // Une borne qui est une solution de f(x) = k n'appartient à
          // l'ensemble que si la relation est large (⩽, ⩾).
          var oa = g.racine ? !large(rel) : g.ouv;
          var ob = d.racine ? !large(rel) : d.ouv;
          var prec = out[out.length - 1];
          if (prec && prec.b === g.v && !prec.ob && !oa) {   // la borne commune convient
            prec.b = d.v; prec.tb = d.txt; prec.ob = ob;     // → un seul intervalle
          } else {
            out.push({ a: g.v, b: d.v, oa: oa, ob: ob, ta: g.txt, tb: d.txt });
          }
        }
      });

      // Les solutions ISOLÉES, qu'aucun intervalle ne contient : x² ⩽ 0 n'a
      // que 0 pour solution.
      if (large(rel)) {
        sols.forEach(function (s) {
          if (!verifie(fn.f(s.v, p), rel, k)) return;
          var dedans = out.some(function (m) { return s.v >= m.a && s.v <= m.b; });
          if (!dedans) out.push({ a: s.v, b: s.v, oa: false, ob: false, ta: s.txt, tb: s.txt });
        });
        out.sort(function (m, n) { return m.a - n.a; });
      }
      return fini(out, sols);
    },

    /* VARIATIONS — le tableau de variations de f sur [x1 ; x2], prêt à être
       dessiné : les COLONNES (les bornes, les sommets, les valeurs interdites)
       et, entre deux colonnes consécutives, le SENS de variation.
       ---------------------------------------------------------------------
       Une seule chose est demandée à la fonction : sommets(p), les abscisses où
       elle change de sens. Elles découpent le domaine ; sur chaque morceau le
       sens ne change plus, il suffit donc de regarder la fonction en quelques
       points pour le trouver (voir sensSur() plus haut). Les valeurs interdites
       découpent elles aussi — elles donnent la double barre du tableau.
       ---------------------------------------------------------------------
       Renvoie { cols, arcs } avec arcs.length === cols.length − 1 :
         cols[i]  { v, txt, bar, defini, val, txtVal, sommet }
                  bar : la colonne est une valeur interdite (double barre) ;
                  txtVal : l'image écrite exactement (« 1/3 », et non 0,33) ;
         arcs[i]  { a, b, sens } entre cols[i] et cols[i+1], sens valant
                  'croissante', 'decroissante', 'constante' — ou 'variable'
                  si un changement de sens a été oublié dans sommets(). */
    variations: function (fn, p, x1, x2) {
      p = p || {};
      var self = this;
      var ms = this.morceaux(fn, x1, x2);
      var somm = (fn.sommets ? fn.sommets(p) : []) || [];
      var cols = [], arcs = [];

      function colonne(v, txt) {
        var def = self.defini(fn, v, p);
        return { v: v, txt: txt !== undefined ? txt : borneTxt(v), bar: false,
                 defini: def, sommet: false,
                 val: def ? fn.f(v, p) : null,
                 txtVal: def ? self.ecrire(fn, v, p) : null };
      }

      ms.forEach(function (m, im) {
        // La colonne de gauche : la borne du domaine pour le premier morceau,
        // la double barre déjà posée pour les suivants (une valeur interdite
        // sépare deux morceaux qui se touchent — c'est le cas de 1/x en 0).
        if (im === 0) cols.push(colonne(m.a));
        var prev = m.a;
        somm.filter(function (s) { return s.v > m.a && s.v < m.b; })
            .sort(function (u, w) { return u.v - w.v; })
            .forEach(function (s) {
              arcs.push({ a: prev, b: s.v, sens: sensSur(fn, p, prev, s.v) });
              var c = colonne(s.v, s.txt);
              c.sommet = true;
              cols.push(c);
              prev = s.v;
            });
        arcs.push({ a: prev, b: m.b, sens: sensSur(fn, p, prev, m.b) });
        var suiv = ms[im + 1];
        if (suiv && Math.abs(suiv.a - m.b) < 1e-12) {
          cols.push({ v: m.b, txt: borneTxt(m.b), bar: true, defini: false,
                      sommet: false, val: null, txtVal: null });
        } else {
          cols.push(colonne(m.b));
        }
      });
      return { cols: cols, arcs: arcs };
    },

    /* PARITÉ — f est PAIRE lorsque f(−x) = f(x) pour TOUT x du domaine (sa
       courbe est alors symétrique par rapport à l'axe des ordonnées), IMPAIRE
       lorsque f(−x) = −f(x) (symétrique par rapport à l'origine du repère).
       ---------------------------------------------------------------------
       Le verdict est établi ICI, en comparant f(−x) et f(x) sur les nombres
       d'essai : une fonction ajoutée au pool est donc classée toute seule, sans
       rien avoir à déclarer. Elle ne fournit, si elle veut que le CALCUL soit
       montré à l'élève, que oppose(p) — l'écriture de f(−x), étape par étape.
       ---------------------------------------------------------------------
       Renvoie { type, sym, calcul, contreP, contreI, contre } :
         type    'paire', 'impaire', 'deux' (la fonction nulle est les deux),
                 'aucune', ou 'domaine' quand le domaine n'est pas symétrique
                 par rapport à 0 — la question ne se pose alors même pas ;
         sym     la symétrie de la courbe : 'ordonnees', 'origine' ou null ;
         calcul  les étapes de f(−x), ou null si la fonction n'en donne pas ;
         contreP / contreI  un nombre x qui suffit à écarter « paire » (resp.
                 « impaire »), avec les deux images en jeu : { x, fx, fmx } ;
         contre  celui à montrer — de préférence un x qui écarte les deux. */
    parite: function (fn, p) {
      p = p || {};
      var self = this;
      var out = { type: 'domaine', sym: null, calcul: null,
                  contreP: null, contreI: null, contre: null };
      if (!symetrique(fn, p)) return out;

      var paire = true, impaire = true, refP = [], refI = [];
      ESSAIS.forEach(function (t) {
        if (!self.defini(fn, t, p) || !self.defini(fn, -t, p)) return;
        var a = fn.f(t, p), b = fn.f(-t, p);
        if (!isFinite(a) || !isFinite(b)) return;
        if (Math.abs(b - a) > 1e-9) { paire = false; refP.push(t); }
        if (Math.abs(b + a) > 1e-9) { impaire = false; refI.push(t); }
      });

      out.type = paire && impaire ? 'deux' : paire ? 'paire'
               : impaire ? 'impaire' : 'aucune';
      out.sym = out.type === 'impaire' ? 'origine'
              : (out.type === 'paire' || out.type === 'deux') ? 'ordonnees' : null;
      out.calcul = fn.oppose ? fn.oppose(p) : null;

      function temoin(t) {
        return t === undefined ? null
                               : { x: t, fx: fn.f(t, p), fmx: fn.f(-t, p) };
      }
      out.contreP = temoin(refP[0]);
      out.contreI = temoin(refI[0]);
      // Un SEUL nombre suffit souvent à écarter les deux à la fois : c'est
      // celui-là qu'on montre, plutôt que deux contre-exemples différents.
      var commun = refP.filter(function (t) { return refI.indexOf(t) >= 0; })[0];
      out.contre = temoin(commun !== undefined ? commun
                          : refP.length ? refP[0] : refI[0]);
      return out;
    },

    // Le raisonnement algébrique, ligne à ligne (HTML simple), ou null si la
    // fonction n'en propose pas. Un <i>…</i> en fin de ligne est le commentaire
    // de l'étape (« on divise par −2 : le sens change »).
    etapes: function (fn, rel, k, p) {
      return fn.etapes ? fn.etapes(rel, k, p || {}) : null;
    },

    // Relie les étapes d'un calcul : un « = » entre deux étapes, mais RIEN
    // devant une étape qui commence par « ≈ » (le ≈ remplace le signe égal) :
    // f(5) = √5 ≈ 2,24.
    chaine: function (etapes) {
      return etapes.map(function (s, i) {
        return i === 0 ? s : (s.charAt(0) === '≈' ? ' ' : ' = ') + s;
      }).join('');
    },

    // L'image de x telle qu'on l'ÉCRIT : la valeur si elle tombe juste, sinon
    // son écriture exacte (√5 plutôt que 2,24, qui n'est qu'un arrondi).
    ecrire: function (fn, x, p) {
      var v = fn.f(x, p || {});
      if (exact(v)) return nb(v);
      if (fn.image) return fn.image(x, p || {});
      var s = fn.calcul ? fn.calcul(x, p || {}) : null;
      return (s && s.length > 1) ? s[0] : '≈ ' + nb(v);
    },

    // Écriture des nombres (partagée pour que tout le site affiche pareil).
    nb: nb, exact: exact, par: par, texNum: texNum
  };

})(window);
