/*
 * Les quelques outils communs aux générateurs « Fonctions ».
 *
 * Le pool `js/fonctions-base.js` EST déjà un générateur d'exercices pris à
 * l'envers : il donne la réponse *et* la correction rédigée. Ces générateurs ne
 * font donc que poser la question — d'où leur brièveté, et d'où le fait qu'une
 * fonction ajoutée au pool crée automatiquement des exercices dans les quatre
 * familles (SPEC §3).
 *
 * À charger AVANT les fn-*.js.
 */
(function (global) {
  'use strict';

  function P() { return MathsView.fonctions; }

  /* Les fonctions disponibles à ce palier. Le pool est rangé du plus simple au
     plus difficile : on en prend un préfixe de plus en plus long. La part est
     PROPORTIONNELLE au nombre de fonctions, et non un nombre fixe — ainsi le
     dernier palier atteint toujours la fin du pool, même après y avoir ajouté
     une fonction. `maxPalier` est le nombre de paliers du générateur appelant. */
  function fonctions(palier, maxPalier) {
    var L = P().liste();
    var n = Math.round(L.length * palier / (maxPalier || 4));
    return L.slice(0, Math.max(2, Math.min(L.length, n)));
  }

  // Les paramètres (a, b…) : imposés au palier 1 (valeurs par défaut du pool),
  // entiers ensuite, décimaux au dernier palier.
  function params(rnd, f, palier) {
    var p = P().defauts(f);
    if (!f.params || palier < 2) return p;
    f.params.forEach(function (s) {
      var v;
      if (palier <= 3) {
        v = rnd.entier(Math.ceil(s.min), Math.floor(s.max));
      } else {
        v = s.min + s.step * rnd.entier(0, Math.round((s.max - s.min) / s.step));
      }
      // Un « a » nul rendrait la fonction constante : la question perdrait son sel.
      if (s.name === 'a' && Math.abs(v) < 1e-9) v = 1;
      p[s.name] = Math.round(v * 100) / 100;
    });
    return p;
  }

  var TEX = { '=': '=', '<': '<', '>': '>', '⩽': '\\leqslant', '⩾': '\\geqslant' };
  function relTex(rel) { return TEX[rel] || rel; }

  // « f(x) = 2x − 1 » écrit en LaTeX, prêt pour un énoncé.
  function defTex(f, p) { return 'f(x) = ' + f.tex(p); }

  global.ExosFonctions = {
    pool: P, fonctions: fonctions, params: params, relTex: relTex, defTex: defTex
  };

})(window);
