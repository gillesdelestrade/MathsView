/*
 * python-mini — un tout petit Python, écrit en JavaScript.
 *
 * ---------------------------------------------------------------------------
 * Pourquoi
 * ---------------------------------------------------------------------------
 * En seconde, on écrit un script qui affiche un tableau de valeurs, et on lit le
 * tableau pour trouver le sens de variation. Le script est court — une dizaine
 * de lignes — mais il doit tourner : lire un programme sans pouvoir l'exécuter,
 * ni le modifier, n'apprend pas grand-chose. Le même script, tapé tel quel sur
 * une calculatrice Numworks, TI ou Casio, donne exactement la même sortie.
 *
 * ---------------------------------------------------------------------------
 * Ce qu'il comprend
 * ---------------------------------------------------------------------------
 *   nombres, chaînes, booléens, None, listes
 *   + − * / // % **   et les comparaisons, and / or / not
 *   affectation (a = …, a += …), indexation L[i]
 *   if / elif / else, for … in …, while, break, continue, pass
 *   def … : return …            (récursion comprise, profondeur bornée)
 *   print, range, len, abs, round, int, float, str, min, max, sum
 *   import math / from math import …   (sqrt, floor, ceil, pi…)
 *   les commentaires #
 *
 * Tout le reste — classes, dictionnaires, f-strings, compréhensions, modules —
 * donne une erreur EXPLICITE, en français, avec le numéro de ligne. C'est le
 * point important : un mini-langage qui échoue en silence, ou qui accepte
 * quelque chose en lui donnant un autre sens que Python, apprendrait des choses
 * fausses. Mieux vaut dire « je ne sais pas faire ça » que se tromper.
 *
 * ---------------------------------------------------------------------------
 * Les pièges de Python qui sont respectés ici
 * ---------------------------------------------------------------------------
 *   3 / 2 vaut 1.5, jamais 1 — la division donne toujours un flottant ;
 *   −7 // 2 vaut −4 (partie entière PAR DÉFAUT, pas troncature) ;
 *   −7 % 2 vaut 1 (le reste a le signe du diviseur) ;
 *   −2 ** 2 vaut −4 (la puissance est plus forte que le moins) ;
 *   print(3.0) écrit « 3.0 », print(3) écrit « 3 » — d'où le suivi du type ;
 *   round(2.5) vaut 2 (arrondi au pair le plus proche, comme Python).
 *
 * L'exécution est bornée : nombre d'opérations, lignes affichées, profondeur
 * d'appel. Une boucle infinie s'arrête d'elle-même avec un message, elle ne
 * fige pas la page.
 */
(function (global) {
  'use strict';

  var MAX_OPS = 400000;      // opérations élémentaires
  var MAX_SORTIE = 3000;     // lignes affichées
  var MAX_PILE = 120;        // appels imbriqués
  var ENTIER_MAX = 9007199254740991;   // au-delà, un entier JS n'est plus exact

  /* ===================================================================== */
  /* Les valeurs                                                           */
  /* ===================================================================== */
  /* Python distingue 3 et 3.0 ; l'un s'affiche « 3 », l'autre « 3.0 », et
     c'est exactement ce qu'on lit dans un tableau de valeurs. On porte donc
     le type avec la valeur au lieu de se reposer sur les nombres de JS. */
  function ent(v) { return { t: 'int', v: v }; }
  function flo(v) { return { t: 'float', v: v }; }
  function bool(v) { return { t: 'bool', v: !!v }; }
  function chaine(v) { return { t: 'str', v: v }; }
  function liste(v) { return { t: 'list', v: v }; }
  var NONE = { t: 'none', v: null };

  function estNombre(x) { return x.t === 'int' || x.t === 'float' || x.t === 'bool'; }
  function num(x) { return x.t === 'bool' ? (x.v ? 1 : 0) : x.v; }

  function nomType(x) {
    return { int: 'un entier', float: 'un nombre à virgule', bool: 'un booléen',
             str: 'une chaîne', list: 'une liste', none: 'None',
             fonction: 'une fonction', builtin: 'une fonction', module: 'un module',
             methode: 'une méthode' }[x.t] || x.t;
  }

  /* L'écriture d'un flottant, comme Python l'affiche. Les deux langages
     choisissent la plus courte écriture qui redonne le même nombre, mais ils
     diffèrent sur deux points :
       — Python garde le « .0 » d'un flottant entier, JavaScript le laisse tomber ;
       — ils ne basculent pas en notation scientifique au même moment. Python
         y passe dès que l'exposant sort de [−4 ; 16[ (0.00001 s'écrit « 1e-05 »),
         JavaScript attend 1e21. */
  function ecritFloat(v) {
    if (v === Infinity) return 'inf';
    if (v === -Infinity) return '-inf';
    if (v !== v) return 'nan';
    // −0.0 existe en Python et s'affiche avec son signe ; JavaScript l'écrit
    // « 0 », il faut donc le rattraper à la main.
    if (v === 0) return (1 / v < 0 ? '-0.0' : '0.0');
    var m = /^(-?)(\d)(?:\.(\d+))?e([+-]\d+)$/.exec(v.toExponential());
    var exp = parseInt(m[4], 10);
    if (exp < -4 || exp >= 16) {
      var mant = m[2] + (m[3] ? '.' + m[3] : '');
      var ae = Math.abs(exp);
      return m[1] + mant + 'e' + (exp < 0 ? '-' : '+') + (ae < 10 ? '0' + ae : ae);
    }
    var s = String(v);
    if (/^-?\d+$/.test(s)) s += '.0';
    return s;
  }
  function texte(x) {           // ce qu'écrit print
    switch (x.t) {
      case 'int': return String(x.v);
      case 'float': return ecritFloat(x.v);
      case 'bool': return x.v ? 'True' : 'False';
      case 'str': return x.v;
      case 'none': return 'None';
      case 'list': return '[' + x.v.map(repr).join(', ') + ']';
      case 'fonction': return '<fonction ' + x.nom + '>';
      case 'builtin': case 'methode': return '<fonction ' + x.nom + '>';
      case 'module': return '<module ' + x.nom + '>';
    }
    return String(x.v);
  }
  function repr(x) {            // ce qu'écrit print À L'INTÉRIEUR d'une liste
    return x.t === 'str' ? "'" + x.v + "'" : texte(x);
  }
  function vrai(x) {            // la « vérité » d'une valeur, à la Python
    switch (x.t) {
      case 'none': return false;
      case 'bool': return x.v;
      case 'int': case 'float': return x.v !== 0;
      case 'str': case 'list': return x.v.length > 0;
    }
    return true;
  }

  /* ===================================================================== */
  /* Erreurs                                                               */
  /* ===================================================================== */
  function Err(ligne, message) { this.ligne = ligne; this.message = message; }
  function leve(ligne, message) { throw new Err(ligne, message); }

  /* ===================================================================== */
  /* 1. Découpage en mots (avec l'indentation, qui fait les blocs)          */
  /* ===================================================================== */
  var MOTS_CLES = ['def', 'return', 'for', 'in', 'if', 'elif', 'else', 'while',
                   'and', 'or', 'not', 'True', 'False', 'None', 'break',
                   'continue', 'pass', 'import', 'from', 'as'];
  var INTERDITS = {
    'class': 'les classes', 'lambda': 'les fonctions lambda', 'try': 'try / except',
    'except': 'try / except', 'finally': 'try / except', 'with': 'le bloc with',
    'yield': 'yield', 'global': 'global', 'nonlocal': 'nonlocal',
    'assert': 'assert', 'del': 'del', 'raise': 'raise', 'is': 'l\'opérateur is (pour comparer deux nombres, écris ==)'
  };
  var OPS = ['**=', '//=', '**', '//', '<=', '>=', '==', '!=', '+=', '-=', '*=',
             '/=', '%=', '+', '-', '*', '/', '%', '<', '>', '=', '(', ')', '[',
             ']', ',', ':', '.'];

  function decoupe(src) {
    var lignes = src.replace(/\r\n?/g, '\n').split('\n');
    var jetons = [], pile = [0], prof = 0;   // prof : profondeur des parenthèses

    for (var n = 0; n < lignes.length; n++) {
      var ligne = lignes[n], no = n + 1;
      if (prof === 0) {
        // Une ligne vide ou toute en commentaire ne compte pas dans l'indentation.
        if (/^[ \t]*(#.*)?$/.test(ligne)) continue;
        var creux = /^[ \t]*/.exec(ligne)[0];
        if (creux.indexOf('\t') >= 0) {
          if (/ /.test(creux)) leve(no, 'l\'indentation mélange des espaces et des ' +
            'tabulations. Choisis les unes ou les autres — quatre espaces, de préférence.');
          creux = creux.replace(/\t/g, '    ');
        }
        var col = creux.length;
        if (col > pile[pile.length - 1]) {
          pile.push(col);
          jetons.push({ t: 'INDENT', ligne: no });
        } else {
          while (col < pile[pile.length - 1]) {
            pile.pop();
            jetons.push({ t: 'DEDENT', ligne: no });
          }
          if (col !== pile[pile.length - 1])
            leve(no, 'l\'indentation ne retombe sur aucun bloc ouvert. Vérifie le ' +
                     'nombre d\'espaces au début de la ligne.');
        }
      }

      var i = /^[ \t]*/.exec(ligne)[0].length;
      while (i < ligne.length) {
        var c = ligne[i];
        if (c === ' ' || c === '\t') { i++; continue; }
        if (c === '#') break;                       // commentaire : reste de la ligne

        // un nombre
        if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(ligne[i + 1] || ''))) {
          var m = /^(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?/.exec(ligne.slice(i));
          var txt = m[0];
          var flottant = /[.eE]/.test(txt);
          jetons.push({ t: 'NOMBRE', v: flottant ? flo(parseFloat(txt)) : ent(parseInt(txt, 10)),
                        ligne: no });
          i += txt.length;
          if (/[A-Za-z_]/.test(ligne[i] || ''))
            leve(no, 'je ne comprends pas « ' + txt + ligne[i] + ' ». Un nombre ne peut ' +
                     'pas être collé à un nom.');
          continue;
        }
        // un nom, un mot-clé
        if (/[A-Za-z_]/.test(c)) {
          var mot = /^[A-Za-z_][A-Za-z_0-9]*/.exec(ligne.slice(i))[0];
          i += mot.length;
          if (INTERDITS[mot])
            leve(no, 'ce mini-Python ne sait pas faire ' + INTERDITS[mot] + '. ' +
                     'Il comprend les calculs, if, for, while, def et print.');
          if (mot === 'f' && (ligne[i] === '"' || ligne[i] === "'"))
            leve(no, 'ce mini-Python ne comprend pas les f-strings. Écris plutôt ' +
                     'print(x, f(x)) : print sépare les valeurs par une espace.');
          jetons.push({ t: MOTS_CLES.indexOf(mot) >= 0 ? mot : 'NOM', v: mot, ligne: no });
          continue;
        }
        // une chaîne
        if (c === '"' || c === "'") {
          var j = i + 1, out = '';
          while (j < ligne.length && ligne[j] !== c) {
            if (ligne[j] === '\\' && j + 1 < ligne.length) {
              var e = ligne[j + 1];
              out += e === 'n' ? '\n' : e === 't' ? '\t' : e;
              j += 2;
            } else { out += ligne[j]; j++; }
          }
          if (j >= ligne.length) leve(no, 'il manque le guillemet fermant.');
          jetons.push({ t: 'CHAINE', v: chaine(out), ligne: no });
          i = j + 1;
          continue;
        }
        // un opérateur
        var trouve = null;
        for (var k = 0; k < OPS.length; k++) {
          if (ligne.startsWith(OPS[k], i)) { trouve = OPS[k]; break; }
        }
        if (!trouve) {
          if (c === '{' || c === '}')
            leve(no, 'ce mini-Python ne gère pas les dictionnaires { }. Une liste [ ] ' +
                     'suffit pour un tableau de valeurs.');
          leve(no, 'je ne comprends pas le caractère « ' + c + ' ».');
        }
        if (trouve === '(' || trouve === '[') prof++;
        if (trouve === ')' || trouve === ']') prof = Math.max(0, prof - 1);
        jetons.push({ t: trouve, ligne: no });
        i += trouve.length;
      }
      if (prof === 0) jetons.push({ t: 'FIN_LIGNE', ligne: no });
    }
    while (pile.length > 1) { pile.pop(); jetons.push({ t: 'DEDENT', ligne: lignes.length }); }
    jetons.push({ t: 'FIN', ligne: lignes.length });
    return jetons;
  }

  /* ===================================================================== */
  /* 2. Analyse : des mots vers un arbre                                   */
  /* ===================================================================== */
  function analyse(jetons) {
    var p = 0;
    function voir(d) { return jetons[p + (d || 0)]; }
    function type() { return jetons[p].t; }
    function ligne() { return jetons[p].ligne; }
    function avance() { return jetons[p++]; }
    function attend(t, quoi) {
      if (type() !== t) leve(ligne(), quoi || ('il manque « ' + t + ' ».'));
      return avance();
    }
    function sauteFins() { while (type() === 'FIN_LIGNE') p++; }

    /* -- les instructions ---------------------------------------------- */
    function bloc(finBloc) {
      var out = [];
      while (type() !== finBloc && type() !== 'FIN') {
        sauteFins();
        if (type() === finBloc || type() === 'FIN') break;
        out.push(instruction());
      }
      return out;
    }
    function corps() {
      if (type() === '=')
        leve(ligne(), 'pour comparer deux valeurs, il faut « == » (deux signes égal) ; ' +
                      'un seul « = » sert à donner une valeur à une variable.');
      attend(':', 'il manque les deux-points « : » à la fin de la ligne.');
      if (type() !== 'FIN_LIGNE') {           // « if x: print(x) » sur une ligne
        var un = [instruction()];
        return un;
      }
      attend('FIN_LIGNE');
      sauteFins();
      if (type() !== 'INDENT')
        leve(ligne(), 'le bloc est vide : la ligne suivante doit être indentée ' +
                      '(quatre espaces).');
      avance();
      var b = bloc('DEDENT');
      if (type() === 'DEDENT') avance();
      return b;
    }

    function instruction() {
      var l = ligne();
      switch (type()) {
        case 'if': {
          avance();
          var cond = expression(), alors = corps(), sinon = [];
          sauteFins();
          if (type() === 'elif') {
            jetons[p] = { t: 'if', ligne: ligne() };   // elif = else + if
            sinon = [instruction()];
          } else if (type() === 'else') {
            avance();
            sinon = corps();
          }
          return { k: 'si', cond: cond, alors: alors, sinon: sinon, ligne: l };
        }
        case 'while': {
          avance();
          var c2 = expression();
          return { k: 'tantque', cond: c2, corps: corps(), ligne: l };
        }
        case 'for': {
          avance();
          var v = attend('NOM', 'après « for », il faut le nom de la variable.').v;
          attend('in', 'il manque « in » : la boucle s\'écrit « for x in range(…) ».');
          var it = expression();
          return { k: 'pour', nom: v, iter: it, corps: corps(), ligne: l };
        }
        case 'def': {
          avance();
          var nom = attend('NOM', 'après « def », il faut le nom de la fonction.').v;
          attend('(', 'il manque la parenthèse ouvrante après le nom de la fonction.');
          var args = [];
          while (type() !== ')') {
            args.push(attend('NOM', 'un paramètre doit être un nom.').v);
            if (type() === ',') avance();
            else break;
          }
          attend(')', 'il manque la parenthèse fermante.');
          return { k: 'def', nom: nom, args: args, corps: corps(), ligne: l };
        }
        case 'return': {
          avance();
          var val = (type() === 'FIN_LIGNE') ? null : expression();
          finLigne();
          return { k: 'retour', val: val, ligne: l };
        }
        case 'break': avance(); finLigne(); return { k: 'sortir', ligne: l };
        case 'continue': avance(); finLigne(); return { k: 'suivant', ligne: l };
        case 'pass': avance(); finLigne(); return { k: 'rien', ligne: l };
        case 'import': {
          avance();
          var mo = attend('NOM', 'il faut le nom du module après « import ».').v;
          finLigne();
          return { k: 'import', module: mo, noms: null, ligne: l };
        }
        case 'from': {
          avance();
          var mo2 = attend('NOM', 'il faut le nom du module après « from ».').v;
          attend('import', 'il manque « import ».');
          var noms = [];
          if (type() === '*') { avance(); noms = '*'; }
          else {
            do {
              if (type() === ',') avance();
              noms.push(attend('NOM', 'il faut un nom à importer.').v);
            } while (type() === ',');
          }
          finLigne();
          return { k: 'import', module: mo2, noms: noms, ligne: l };
        }
      }
      // sinon : une affectation, ou une expression toute seule
      var e = expression();
      var augm = ['=', '+=', '-=', '*=', '/=', '//=', '%=', '**='];
      if (augm.indexOf(type()) >= 0) {
        var op = avance().t;
        var d = expression();
        finLigne();
        if (e.k !== 'nom' && e.k !== 'index')
          leve(l, 'on ne peut affecter qu\'une variable ou une case de liste.');
        return { k: 'affecte', cible: e, op: op, val: d, ligne: l };
      }
      finLigne();
      return { k: 'expr', val: e, ligne: l };
    }
    function finLigne() {
      if (type() === 'FIN_LIGNE') { avance(); return; }
      if (type() === 'FIN' || type() === 'DEDENT') return;
      if (type() === ',')
        leve(ligne(), 'ce mini-Python ne gère pas les affectations multiples ni les ' +
                      'tuples (a, b = 1, 2). Écris une ligne par variable.');
      if (type() === '=')
        leve(ligne(), 'pour comparer, il faut écrire « == » (deux signes égal) ; ' +
                      'un seul « = » sert à affecter.');
      leve(ligne(), 'je ne comprends pas la fin de cette ligne.');
    }

    /* -- les expressions, du moins prioritaire au plus prioritaire ------ */
    function expression() { return ou(); }
    function ou() {
      var g = et();
      while (type() === 'or') { avance(); g = { k: 'ou', g: g, d: et() }; }
      return g;
    }
    function et() {
      var g = non();
      while (type() === 'and') { avance(); g = { k: 'et', g: g, d: non() }; }
      return g;
    }
    function non() {
      if (type() === 'not') { var l = ligne(); avance(); return { k: 'non', d: non(), ligne: l }; }
      return comparaison();
    }
    function comparaison() {
      var g = somme();
      var rel = ['<', '>', '<=', '>=', '==', '!='];
      while (rel.indexOf(type()) >= 0) {
        var l = ligne(), op = avance().t;
        g = { k: 'compare', op: op, g: g, d: somme(), ligne: l };
      }
      return g;
    }
    function somme() {
      var g = produit();
      while (type() === '+' || type() === '-') {
        var l = ligne(), op = avance().t;
        g = { k: 'binaire', op: op, g: g, d: produit(), ligne: l };
      }
      return g;
    }
    function produit() {
      var g = unaire();
      while (['*', '/', '//', '%'].indexOf(type()) >= 0) {
        var l = ligne(), op = avance().t;
        g = { k: 'binaire', op: op, g: g, d: unaire(), ligne: l };
      }
      return g;
    }
    /* Le moins unaire est MOINS fort que la puissance : −2 ** 2 vaut −4.
       C'est un piège classique, on le respecte. */
    function unaire() {
      if (type() === '-' || type() === '+') {
        var l = ligne(), op = avance().t;
        return { k: 'unaire', op: op, d: unaire(), ligne: l };
      }
      return puissance();
    }
    function puissance() {
      var g = suffixe();
      if (type() === '**') {
        var l = ligne();
        avance();
        return { k: 'binaire', op: '**', g: g, d: unaire(), ligne: l };  // à droite
      }
      return g;
    }
    function suffixe() {
      var e = atome();
      for (;;) {
        if (type() === '(') {
          var l = ligne();
          avance();
          var args = [];
          while (type() !== ')') {
            if (type() === 'NOM' && voir(1).t === '=')
              leve(ligne(), 'ce mini-Python ne gère pas les arguments nommés ' +
                            '(comme sep= ou end=).');
            args.push(expression());
            if (type() === ',') avance(); else break;
          }
          attend(')', 'il manque la parenthèse fermante.');
          e = { k: 'appel', f: e, args: args, ligne: l };
        } else if (type() === '[') {
          var l2 = ligne();
          avance();
          var idx = expression();
          if (type() === ':')
            leve(l2, 'ce mini-Python ne gère pas les tranches de liste (L[a:b]).');
          attend(']', 'il manque le crochet fermant.');
          e = { k: 'index', obj: e, idx: idx, ligne: l2 };
        } else if (type() === '.') {
          var l3 = ligne();
          avance();
          var att = attend('NOM', 'il faut un nom après le point.').v;
          e = { k: 'attribut', obj: e, nom: att, ligne: l3 };
        } else return e;
      }
    }
    function atome() {
      var l = ligne();
      switch (type()) {
        case 'NOMBRE': return { k: 'const', v: avance().v, ligne: l };
        case 'CHAINE': return { k: 'const', v: avance().v, ligne: l };
        case 'True': avance(); return { k: 'const', v: bool(true), ligne: l };
        case 'False': avance(); return { k: 'const', v: bool(false), ligne: l };
        case 'None': avance(); return { k: 'const', v: NONE, ligne: l };
        case 'NOM': return { k: 'nom', v: avance().v, ligne: l };
        case '(': {
          avance();
          var e = expression();
          if (type() === ',')
            leve(l, 'ce mini-Python ne gère pas les tuples (a, b).');
          attend(')', 'il manque la parenthèse fermante.');
          return e;
        }
        case '[': {
          avance();
          var els = [];
          while (type() !== ']') {
            els.push(expression());
            if (type() === 'for')
              leve(l, 'ce mini-Python ne gère pas les listes en compréhension. ' +
                      'Écris une boucle for avec .append().');
            if (type() === ',') avance(); else break;
          }
          attend(']', 'il manque le crochet fermant.');
          return { k: 'listeLit', els: els, ligne: l };
        }
      }
      if (type() === 'FIN_LIGNE' || type() === 'FIN')
        leve(l, 'la ligne s\'arrête trop tôt : il manque quelque chose après.');
      if (type() === 'INDENT')
        leve(l, 'cette ligne est décalée vers la droite alors qu\'aucun bloc n\'est ' +
                'ouvert. On n\'indente qu\'après un « : » (if, for, while, def).');
      leve(l, 'je ne m\'attendais pas à « ' + (jetons[p].v || jetons[p].t) + ' » ici.');
    }

    sauteFins();
    var prog = bloc('FIN');
    return prog;
  }

  /* ===================================================================== */
  /* 3. Exécution                                                          */
  /* ===================================================================== */
  /* Les sauts (return, break, continue) remontent la pile par des exceptions.
     Chacun porte SA ligne : si le saut finit hors de son bloc, c'est elle qu'on
     montre à l'élève. */
  function Saut(quoi, ligne) { this.quoi = quoi; this.ligne = ligne; }
  function Retour(v, ligne) { this.v = v; this.ligne = ligne; }

  function executer(src, options) {
    options = options || {};
    var sortie = [], tronque = false, ops = 0, profondeur = 0;
    var globaux = Object.create(null);

    function compte(l) {
      if (++ops > MAX_OPS)
        leve(l, 'le programme est trop long à exécuter (plus de ' +
                MAX_OPS.toLocaleString('fr-FR') + ' opérations). ' +
                'Y aurait-il une boucle qui ne s\'arrête jamais ?');
    }
    function ecrire(s) {
      if (sortie.length >= MAX_SORTIE) { tronque = true; return; }
      sortie.push(s);
    }

    /* -- les fonctions fournies ---------------------------------------- */
    function bi(nom, f) { return { t: 'builtin', nom: nom, f: f }; }

    function verifNombre(l, x, quoi) {
      if (!estNombre(x))
        leve(l, quoi + ' attend un nombre, or il a reçu ' + nomType(x) + '.');
      return num(x);
    }
    /* L'arrondi de Python vise le PAIR le plus proche quand on tombe pile au
       milieu : round(0.5) = 0, round(1.5) = 2, round(2.5) = 2. C'est déroutant,
       mais c'est ce que la calculatrice fera aussi. */
    function arrondiPair(x, n) {
      var f = Math.pow(10, n), y = x * f;
      var bas = Math.floor(y), r = y - bas;
      var e;
      if (Math.abs(r - 0.5) < 1e-9) e = (bas % 2 === 0) ? bas : bas + 1;
      else e = Math.round(y);
      return e / f;
    }
    var BUILTINS = {
      print: bi('print', function (args) {
        ecrire(args.map(texte).join(' '));
        return NONE;
      }),
      range: bi('range', function (args, l) {
        if (!args.length || args.length > 3)
          leve(l, 'range attend un, deux ou trois nombres.');
        args.forEach(function (a) {
          if (a.t !== 'int' && a.t !== 'bool')
            leve(l, 'range n\'accepte que des entiers ; ' + texte(a) + ' n\'en est pas un. ' +
                    'Pour un pas décimal, fais une boucle sur des entiers et divise.');
        });
        var deb = args.length > 1 ? num(args[0]) : 0;
        var fin = args.length > 1 ? num(args[1]) : num(args[0]);
        var pas = args.length > 2 ? num(args[2]) : 1;
        if (pas === 0) leve(l, 'le pas de range ne peut pas être nul.');
        var out = [];
        for (var v = deb; pas > 0 ? v < fin : v > fin; v += pas) {
          compte(l);
          out.push(ent(v));
          if (out.length > MAX_OPS) leve(l, 'range produit beaucoup trop de valeurs.');
        }
        return liste(out);
      }),
      len: bi('len', function (args, l) {
        if (args.length !== 1) leve(l, 'len attend une seule valeur.');
        var x = args[0];
        if (x.t !== 'list' && x.t !== 'str')
          leve(l, 'len attend une liste ou une chaîne, pas ' + nomType(x) + '.');
        return ent(x.v.length);
      }),
      abs: bi('abs', function (args, l) {
        if (args.length !== 1) leve(l, 'abs attend une seule valeur.');
        var v = Math.abs(verifNombre(l, args[0], 'abs'));
        return args[0].t === 'float' ? flo(v) : ent(v);
      }),
      round: bi('round', function (args, l) {
        if (!args.length || args.length > 2) leve(l, 'round attend un ou deux nombres.');
        var x = verifNombre(l, args[0], 'round');
        if (args.length === 1) return ent(arrondiPair(x, 0));
        return flo(arrondiPair(x, num(args[1])));
      }),
      int: bi('int', function (args, l) {
        if (args.length !== 1) leve(l, 'int attend une seule valeur.');
        var x = args[0];
        if (x.t === 'str') {
          if (!/^\s*[+-]?\d+\s*$/.test(x.v))
            leve(l, '« ' + x.v + ' » n\'est pas un entier.');
          return ent(parseInt(x.v, 10));
        }
        var v = verifNombre(l, x, 'int');
        return ent(v < 0 ? Math.ceil(v) : Math.floor(v));   // int() tronque vers 0
      }),
      float: bi('float', function (args, l) {
        if (args.length !== 1) leve(l, 'float attend une seule valeur.');
        var x = args[0];
        if (x.t === 'str') {
          var v = parseFloat(x.v);
          if (isNaN(v)) leve(l, '« ' + x.v + ' » n\'est pas un nombre.');
          return flo(v);
        }
        return flo(verifNombre(l, x, 'float'));
      }),
      str: bi('str', function (args, l) {
        if (args.length !== 1) leve(l, 'str attend une seule valeur.');
        return chaine(texte(args[0]));
      }),
      min: bi('min', function (args, l) { return extremum(args, l, 'min'); }),
      max: bi('max', function (args, l) { return extremum(args, l, 'max'); }),
      sum: bi('sum', function (args, l) {
        if (args.length !== 1 || args[0].t !== 'list')
          leve(l, 'sum attend une liste.');
        var s = 0, flottant = false;
        args[0].v.forEach(function (x) {
          s += verifNombre(l, x, 'sum');
          if (x.t === 'float') flottant = true;
        });
        return flottant ? flo(s) : ent(s);
      })
    };
    function extremum(args, l, quoi) {
      var vals = (args.length === 1 && args[0].t === 'list') ? args[0].v : args;
      if (!vals.length) leve(l, quoi + ' attend au moins une valeur.');
      var best = vals[0];
      vals.forEach(function (x) {
        verifNombre(l, x, quoi);
        if (quoi === 'min' ? num(x) < num(best) : num(x) > num(best)) best = x;
      });
      return best;
    }

    var MATH = { t: 'module', nom: 'math', membres: {
      sqrt: bi('sqrt', function (a, l) {
        var v = verifNombre(l, a[0], 'sqrt');
        if (v < 0) leve(l, 'la racine carrée d\'un nombre négatif n\'existe pas ' +
                           '(math domain error).');
        return flo(Math.sqrt(v));
      }),
      floor: bi('floor', function (a, l) { return ent(Math.floor(verifNombre(l, a[0], 'floor'))); }),
      ceil: bi('ceil', function (a, l) { return ent(Math.ceil(verifNombre(l, a[0], 'ceil'))); }),
      pi: flo(Math.PI),
      e: flo(Math.E),
      cos: bi('cos', function (a, l) { return flo(Math.cos(verifNombre(l, a[0], 'cos'))); }),
      sin: bi('sin', function (a, l) { return flo(Math.sin(verifNombre(l, a[0], 'sin'))); }),
      tan: bi('tan', function (a, l) { return flo(Math.tan(verifNombre(l, a[0], 'tan'))); })
    } };

    /* -- les opérations ------------------------------------------------ */
    function verifEntier(l, v) {
      // Python compte les entiers sans limite ; nous, non. Le dire franchement
      // vaut mieux que de rendre l'infini ou un nombre faux.
      if (!isFinite(v) || Math.abs(v) > ENTIER_MAX)
        leve(l, 'ce mini-Python ne sait pas manipuler des entiers aussi grands. ' +
                'Le vrai Python, lui, y arrive : essaie sur la calculatrice.');
      return v;
    }
    function binaire(l, op, A, B) {
      compte(l);
      // le + des chaînes et des listes
      if (op === '+' && A.t === 'str' && B.t === 'str') return chaine(A.v + B.v);
      if (op === '+' && A.t === 'list' && B.t === 'list') return liste(A.v.concat(B.v));
      if (op === '*' && A.t === 'str' && B.t === 'int') return chaine(A.v.repeat(Math.max(0, B.v)));
      if (op === '*' && A.t === 'int' && B.t === 'str') return chaine(B.v.repeat(Math.max(0, A.v)));
      if (op === '+' && (A.t === 'str') !== (B.t === 'str'))
        leve(l, 'on ne peut pas additionner une chaîne et ' + nomType(A.t === 'str' ? B : A) +
                '. Utilise str(…) pour convertir, ou sépare par une virgule dans print.');
      if (!estNombre(A) || !estNombre(B))
        leve(l, 'l\'opération « ' + op + ' » attend deux nombres, or elle a reçu ' +
                nomType(A) + ' et ' + nomType(B) + '.');

      var a = num(A), b = num(B);
      var entier = A.t !== 'float' && B.t !== 'float';
      switch (op) {
        case '+': return entier ? ent(verifEntier(l, a + b)) : flo(a + b);
        case '-': return entier ? ent(verifEntier(l, a - b)) : flo(a - b);
        case '*': return entier ? ent(verifEntier(l, a * b)) : flo(a * b);
        case '/':                                  // TOUJOURS un flottant
          if (b === 0) leve(l, 'division par zéro.');
          return flo(a / b);
        case '//':                                 // partie entière PAR DÉFAUT
          if (b === 0) leve(l, 'division entière par zéro.');
          return entier ? ent(Math.floor(a / b)) : flo(Math.floor(a / b));
        case '%':                                  // le reste a le signe du diviseur
          if (b === 0) leve(l, 'reste d\'une division par zéro.');
          var r = a - Math.floor(a / b) * b;
          return entier ? ent(r) : flo(r);
        case '**': {
          var v = Math.pow(a, b);
          if (v !== v)
            leve(l, 'cette puissance ne donne pas un nombre réel.');
          // un entier à une puissance négative donne un flottant, comme en Python
          return (entier && b >= 0) ? ent(verifEntier(l, v)) : flo(v);
        }
      }
      leve(l, 'opérateur inconnu : ' + op);
    }
    function compare(l, op, A, B) {
      compte(l);
      var a, b;
      if (A.t === 'str' && B.t === 'str') { a = A.v; b = B.v; }
      else if (estNombre(A) && estNombre(B)) { a = num(A); b = num(B); }
      else if (op === '==' || op === '!=') {
        var eg = A.t === B.t && texte(A) === texte(B);
        return bool(op === '==' ? eg : !eg);
      } else {
        leve(l, 'on ne peut pas comparer ' + nomType(A) + ' et ' + nomType(B) + '.');
      }
      switch (op) {
        case '<': return bool(a < b);
        case '>': return bool(a > b);
        case '<=': return bool(a <= b);
        case '>=': return bool(a >= b);
        case '==': return bool(a === b);
        case '!=': return bool(a !== b);
      }
    }

    /* -- l'évaluation d'une expression --------------------------------- */
    function evalue(e, port) {
      switch (e.k) {
        case 'const': return e.v;
        case 'nom': {
          if (e.v in port) return port[e.v];
          if (e.v in globaux) return globaux[e.v];
          if (BUILTINS[e.v]) return BUILTINS[e.v];
          leve(e.ligne, '« ' + e.v + ' » n\'est pas défini. Une variable doit recevoir ' +
                        'une valeur avant d\'être utilisée, et une fonction être définie ' +
                        'plus haut.');
          break;
        }
        case 'listeLit':
          return liste(e.els.map(function (x) { return evalue(x, port); }));
        case 'unaire': {
          var d = evalue(e.d, port);
          if (!estNombre(d))
            leve(e.ligne, 'le signe « ' + e.op +' » attend un nombre, pas ' + nomType(d) + '.');
          var v = e.op === '-' ? -num(d) : num(d);
          return d.t === 'float' ? flo(v) : ent(v);
        }
        case 'binaire':
          return binaire(e.ligne, e.op, evalue(e.g, port), evalue(e.d, port));
        case 'compare':
          return compare(e.ligne, e.op, evalue(e.g, port), evalue(e.d, port));
        case 'et': {
          var g = evalue(e.g, port);
          return vrai(g) ? evalue(e.d, port) : g;
        }
        case 'ou': {
          var g2 = evalue(e.g, port);
          return vrai(g2) ? g2 : evalue(e.d, port);
        }
        case 'non': return bool(!vrai(evalue(e.d, port)));
        case 'index': {
          var o = evalue(e.obj, port), i = evalue(e.idx, port);
          if (o.t !== 'list' && o.t !== 'str')
            leve(e.ligne, 'on ne peut indexer qu\'une liste ou une chaîne, pas ' + nomType(o) + '.');
          if (i.t !== 'int' && i.t !== 'bool')
            leve(e.ligne, 'un indice doit être un entier.');
          var k = num(i);
          if (k < 0) k += o.v.length;
          if (k < 0 || k >= o.v.length)
            leve(e.ligne, 'indice ' + num(i) + ' hors de la liste (elle a ' + o.v.length +
                          ' élément' + (o.v.length > 1 ? 's' : '') + ', numérotés à partir de 0).');
          return o.t === 'str' ? chaine(o.v[k]) : o.v[k];
        }
        case 'attribut': {
          var ob = evalue(e.obj, port);
          if (ob.t === 'module') {
            if (!(e.nom in ob.membres))
              leve(e.ligne, 'le module ' + ob.nom + ' n\'a pas de « ' + e.nom + ' » ici.');
            return ob.membres[e.nom];
          }
          if (ob.t === 'list' && e.nom === 'append')
            return { t: 'methode', nom: 'append', cible: ob };
          leve(e.ligne, nomType(ob) + ' n\'a pas d\'attribut « ' + e.nom + ' » ici.');
          break;
        }
        case 'appel': {
          var f = evalue(e.f, port);
          var args = e.args.map(function (x) { return evalue(x, port); });
          return appelle(e.ligne, f, args);
        }
      }
      leve(e.ligne, 'expression incomprise.');
    }

    function appelle(l, f, args) {
      compte(l);
      if (f.t === 'builtin') return f.f(args, l);
      if (f.t === 'methode') {
        if (args.length !== 1) leve(l, 'append attend une seule valeur.');
        f.cible.v.push(args[0]);
        return NONE;
      }
      if (f.t !== 'fonction')
        leve(l, nomType(f) + ' ne s\'appelle pas comme une fonction.');
      if (args.length !== f.args.length)
        leve(l, 'la fonction ' + f.nom + ' attend ' + f.args.length + ' argument' +
                (f.args.length > 1 ? 's' : '') + ', or elle en reçoit ' + args.length + '.');
      if (++profondeur > MAX_PILE) {
        profondeur = 0;
        leve(l, 'trop d\'appels imbriqués (' + MAX_PILE + '). Une fonction qui ' +
                's\'appelle elle-même doit avoir un cas d\'arrêt.');
      }
      var port = Object.create(null);
      f.args.forEach(function (nom, i) { port[nom] = args[i]; });
      try {
        lance(f.corps, port);
      } catch (ex) {
        if (ex instanceof Retour) { profondeur--; return ex.v; }
        profondeur--;
        throw ex;
      }
      profondeur--;
      return NONE;                          // pas de return : la fonction rend None
    }

    /* -- l'exécution d'un bloc ----------------------------------------- */
    function lance(bloc, port) {
      for (var i = 0; i < bloc.length; i++) {
        var s = bloc[i];
        compte(s.ligne);
        switch (s.k) {
          case 'expr': evalue(s.val, port); break;
          case 'rien': break;
          case 'affecte': {
            var v = evalue(s.val, port);
            if (s.op !== '=') {
              var ancien = evalue(s.cible, port);
              v = binaire(s.ligne, s.op.slice(0, -1), ancien, v);
            }
            if (s.cible.k === 'nom') port[s.cible.v] = v;
            else {
              var o = evalue(s.cible.obj, port), k = evalue(s.cible.idx, port);
              if (o.t !== 'list') leve(s.ligne, 'on ne peut modifier qu\'une case de liste.');
              var idx = num(k);
              if (idx < 0) idx += o.v.length;
              if (idx < 0 || idx >= o.v.length)
                leve(s.ligne, 'indice ' + num(k) + ' hors de la liste.');
              o.v[idx] = v;
            }
            break;
          }
          case 'si':
            if (vrai(evalue(s.cond, port))) lance(s.alors, port);
            else lance(s.sinon, port);
            break;
          case 'tantque': {
            while (vrai(evalue(s.cond, port))) {
              compte(s.ligne);
              try { lance(s.corps, port); }
              catch (ex) {
                if (ex instanceof Saut && ex.quoi === 'sortir') break;
                if (!(ex instanceof Saut) || ex.quoi !== 'suivant') throw ex;
              }
            }
            break;
          }
          case 'pour': {
            var it = evalue(s.iter, port);
            if (it.t !== 'list' && it.t !== 'str')
              leve(s.ligne, 'on ne peut parcourir qu\'une liste, une chaîne ou un range, ' +
                            'pas ' + nomType(it) + '.');
            var elems = it.t === 'str' ? it.v.split('').map(chaine) : it.v;
            var arrete = false;
            for (var j = 0; j < elems.length && !arrete; j++) {
              compte(s.ligne);
              port[s.nom] = elems[j];
              try { lance(s.corps, port); }
              catch (ex) {
                if (ex instanceof Saut && ex.quoi === 'sortir') arrete = true;
                else if (!(ex instanceof Saut) || ex.quoi !== 'suivant') throw ex;
              }
            }
            break;
          }
          case 'def':
            port[s.nom] = { t: 'fonction', nom: s.nom, args: s.args, corps: s.corps };
            break;
          case 'retour':
            throw new Retour(s.val ? evalue(s.val, port) : NONE, s.ligne);
          case 'sortir': throw new Saut('sortir', s.ligne);
          case 'suivant': throw new Saut('suivant', s.ligne);
          case 'import': {
            if (s.module !== 'math')
              leve(s.ligne, 'ce mini-Python ne connaît que le module math.');
            if (!s.noms) port.math = MATH;
            else if (s.noms === '*') {
              Object.keys(MATH.membres).forEach(function (k) { port[k] = MATH.membres[k]; });
            } else {
              s.noms.forEach(function (n) {
                if (!(n in MATH.membres))
                  leve(s.ligne, 'math n\'a pas de « ' + n + ' » ici.');
                port[n] = MATH.membres[n];
              });
            }
            break;
          }
        }
      }
    }

    /* -- en route ------------------------------------------------------ */
    try {
      var arbre = analyse(decoupe(src));
      lance(arbre, globaux);
    } catch (ex) {
      if (ex instanceof Err) return { lignes: sortie, erreur: ex, tronque: tronque };
      if (ex instanceof Retour)
        return { lignes: sortie, tronque: tronque,
                 erreur: new Err(ex.ligne, '« return » ne peut s\'écrire que dans une ' +
                                           'fonction, après un « def ».') };
      if (ex instanceof Saut)
        return { lignes: sortie, tronque: tronque,
                 erreur: new Err(ex.ligne, '« ' + (ex.quoi === 'sortir' ? 'break' : 'continue') +
                                 ' » ne s\'écrit que dans une boucle for ou while.') };
      return { lignes: sortie, tronque: tronque,
               erreur: new Err(0, 'erreur inattendue : ' + (ex && ex.message ? ex.message : ex)) };
    }
    return { lignes: sortie, erreur: null, tronque: tronque };
  }

  global.MathsPython = {
    executer: executer,
    /* Le message tel qu'on l'affiche à l'élève. */
    messageErreur: function (err) {
      if (!err) return '';
      return (err.ligne ? 'Ligne ' + err.ligne + ' : ' : '') + err.message;
    }
  };

})(typeof window !== 'undefined' ? window : this);
