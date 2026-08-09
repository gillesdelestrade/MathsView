/*
 * MathsAlea — aléatoire SEMÉ (SPEC §2.1).
 *
 * Toute la mécanique des exercices repose sur une propriété : une même graine
 * doit régénérer exactement le même énoncé. C'est ce qui permet de réafficher
 * une correction, de rejouer un exercice raté, ou de proposer à deux élèves la
 * série strictement identique d'un défi.
 *
 * Conséquence directe : `Math.random()` est INTERDIT partout ailleurs dans le
 * module exercices. Il n'apparaît qu'ici, dans MathsAlea.graine(), pour tirer
 * la graine elle-même.
 *
 * L'algorithme est mulberry32 : trois lignes, période de 2³², parfaitement
 * suffisant pour tirer des énoncés (ce n'est pas de la cryptographie).
 */
(function (global) {
  'use strict';

  function MathsAlea(graine) {
    var s = (graine >>> 0) || 1;

    // mulberry32 : renvoie un flottant dans [0 ; 1[
    function suivant() {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    function pgcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a || 1; }

    var api = {
      // Le tirage brut, si un générateur en a vraiment besoin.
      brut: suivant,

      entier: function (a, b) {
        return a + Math.floor(suivant() * (b - a + 1));
      },
      entierNonNul: function (a, b) {
        if (a === 0 && b === 0) return 1;          // sinon : boucle infinie
        var v;
        do { v = api.entier(a, b); } while (v === 0);
        return v;
      },
      choix: function (t) { return t[api.entier(0, t.length - 1)]; },

      // Copie mélangée (Fisher–Yates) : l'original n'est jamais touché, un
      // générateur peut donc mélanger une constante sans se saborder.
      melange: function (t) {
        var c = t.slice();
        for (var i = c.length - 1; i > 0; i--) {
          var j = api.entier(0, i), tmp = c[i];
          c[i] = c[j]; c[j] = tmp;
        }
        return c;
      },

      signe: function () { return suivant() < 0.5 ? -1 : 1; },
      booleen: function (p) { return suivant() < (p === undefined ? 0.5 : p); },

      // Une fraction irréductible, jamais entière (d ≠ 1) et jamais nulle.
      fraction: function (maxNum, maxDen) {
        maxNum = maxNum || 9;
        maxDen = Math.max(2, maxDen || 9);
        var n, d, g;
        do {
          n = api.entierNonNul(-maxNum, maxNum);
          d = api.entier(2, maxDen);
          g = pgcd(Math.abs(n), d);
          n /= g; d /= g;
        } while (d === 1);
        return { n: n, d: d };
      }
    };
    return api;
  }

  // Le SEUL Math.random() du module : le tirage de la graine.
  MathsAlea.graine = function () {
    return (Math.floor(Math.random() * 2147483646) + 1) >>> 0;
  };

  global.MathsAlea = MathsAlea;

})(window);
