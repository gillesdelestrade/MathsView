/*
 * Les outils communs aux générateurs « classiques » (SPEC §4).
 *
 * Rien de malin ici : juste l'écriture française des nombres (virgule décimale,
 * vrai signe « − »), les fractions, et deux ou trois raccourcis LaTeX. Les
 * générateurs des leçons « Fonctions » n'en ont pas besoin — le pool s'en
 * charge pour eux — mais tous les autres écrivent des nombres à la main.
 *
 * À charger AVANT les exos/<niveau>/*.js.
 */
(function (global) {
  'use strict';

  // Écriture française : « −2,5 ». `dec` limite le nombre de décimales.
  function fr(v, dec) {
    var d = dec === undefined ? 3 : dec;
    var k = Math.pow(10, d);
    var r = Math.round(v * k) / k;
    if (r === 0) r = 0;                       // évite le « −0 »
    return String(r).replace('.', ',').replace('-', '−');
  }
  // Le même nombre dans une formule LaTeX : la virgule y demande des accolades.
  function tex(v, dec) { return fr(v, dec).replace(',', '{,}').replace('−', '-'); }
  // Entre parenthèses si négatif, comme au tableau : 5 × (−3).
  function par(v) { return v < 0 ? '(' + fr(v) + ')' : fr(v); }
  // « + 3 » ou « − 3 », pour coller un terme derrière un autre.
  function signe(v) { return (v < 0 ? ' − ' : ' + ') + fr(Math.abs(v)); }
  function signeTex(v) { return (v < 0 ? ' - ' : ' + ') + tex(Math.abs(v)); }

  function pgcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = a % b; a = b; b = t; }
    return a || 1;
  }
  // La fraction réduite, sous forme { n, d } avec d > 0.
  function reduit(n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = pgcd(n, d);
    return { n: n / g, d: d / g };
  }
  // Une fraction telle qu'on l'écrit : « 3/4 », « −3/4 », et « 3 » si d = 1.
  function fracTxt(n, d) {
    var f = reduit(n, d);
    return f.d === 1 ? fr(f.n) : fr(f.n) + '/' + fr(f.d);
  }
  function fracTex(n, d) {
    if (d === 1) return tex(n);
    return (n < 0 ? '-' : '') + '\\dfrac{' + tex(Math.abs(n)) + '}{' + tex(d) + '}';
  }
  // Les écritures d'une même fraction que l'on accepte en réponse.
  function fracFormes(n, d) {
    var f = reduit(n, d);
    var out = [f.d === 1 ? fr(f.n) : fr(f.n) + '/' + fr(f.d)];
    if (f.d !== 1) out.push(fr(f.n) + ' / ' + fr(f.d));
    // La forme décimale, mais seulement si elle tombe juste.
    var v = f.n / f.d;
    if (Math.abs(v * 10000 - Math.round(v * 10000)) < 1e-9) out.push(fr(v, 4));
    return out;
  }

  // Un entier « qui tombe bien » : évite 0 et 1 quand on veut un coefficient.
  function coef(rnd, max) {
    var v = rnd.entier(2, max || 9);
    return rnd.booleen(0.5) ? v : -v;
  }

  global.ExosOutils = {
    fr: fr, tex: tex, par: par, signe: signe, signeTex: signeTex,
    pgcd: pgcd, reduit: reduit, fracTxt: fracTxt, fracTex: fracTex,
    fracFormes: fracFormes, coef: coef
  };

})(window);
