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
 *   ensemble   l'ensemble de définition écrit pour l'élève : « ℝ », « [0 ; +∞[ »
 *   courbe     le nom de sa courbe : « une parabole »
 *   calcul(x, p)  les étapes du calcul de f(x), à afficher reliées par des « = » :
 *                 pour la fonction carré et x = −3 → ['(−3)²', '9']
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
      remarque: 'Aucun nombre négatif n\'a de racine carrée : la fonction n\'est ' +
                'définie que pour x ⩾ 0. Sa courbe part de l\'origine et ne monte ' +
                'que très lentement.'
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
      var s = fn.calcul ? fn.calcul(x, p || {}) : null;
      return (s && s.length > 1) ? s[0] : '≈ ' + nb(v);
    },

    // Écriture des nombres (partagée pour que tout le site affiche pareil).
    nb: nb, exact: exact, par: par, texNum: texNum
  };

})(window);
