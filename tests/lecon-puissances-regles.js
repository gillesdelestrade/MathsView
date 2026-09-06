/*
 * La leçon « Règles de calcul sur les puissances » (2nde).
 *
 * On rejoue l'animation dans un DOM simulé, pour beaucoup de tirages, et on
 * refait les calculs à côté : les facteurs décomposés doivent être au nombre
 * de n puis p, réunis au nombre de n + p ; la conclusion doit porter a^(n+p)
 * et sa valeur exacte ; au quotient, on doit barrer min(n, p) paires et
 * conclure a^(n−p), valeur comprise — y compris quand l'exposant devient
 * négatif ; et le rejeu doit être identique.
 */
load('tests/lecon-puissances-regles-decor.js');
var ui2 = extras.children[0];
function txt(h) {
  return String(h).replace(/<sup[^>]*>([−\d]+)<\/sup>/g, '^$1')
    .replace(/<span class="pr-num">/g, ' [').replace(/<span class="pr-den">/g, '/')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, '').replace(/\s+/g, ' ')
    .replace(/\s+\^/g, '^').replace(/−/g, '-')
    .replace(/\[\s+/g, '[').replace(/\s*\/\s*/g, '/').trim();
}
function etat() { return ['pui-corps', 'pui-etapes', 'pui-concl']
  .map(function (c) { return ui2._sous[c] ? ui2._sous[c].innerHTML : ''; }).join('§'); }
function puiss(a, n) { var r = 1; for (var i = 0; i < n; i++) r *= a; return r; }
function nbFacteurs(h, cls) {
  var re = new RegExp('<span class="pr-f' + (cls ? ' ' + cls : '') + '[ "]', 'g');
  return (h.match(re) || []).length;
}
function bloc(h, cls) {                   // la première ligne portant cette classe
  var i = h.indexOf('class="pr-ligne ' + cls + '"');
  if (i < 0) return '';
  var j = h.indexOf('<div class="pr-ligne', i + 10);
  return j < 0 ? h.slice(i) : h.slice(i, j);
}
function lignes(h) {
  return h.split('<div class="pr-ligne').slice(1).map(function (x) { return '<div class="pr-ligne' + x; });
}

var err = [], cpt = {}, negatifs = 0, egaux = 0;
function ko(m) { if (err.length < 12 && err.indexOf(m) < 0) err.push(m); }
var CAS = ['produit', 'quotient', 'negatif'];
for (var essai = 0; essai < 600; essai++) {
  var c = CAS[essai % 3];
  var b = elements.filter(function (e) { return e.tag === 'button' && e.dataset.cas === c; })[0];
  b.onclick();
  cpt[c] = (cpt[c] || 0) + 1;

  var refs = [];
  steps.forEach(function (s) {
    if (s.step) { s.step(0); s.step(0.5); s.step(1); }
    if (s.after) s.after();
    refs.push(etat());
  });
  var corps = ui2._sous['pui-corps'].innerHTML;
  var concl = txt(ui2._sous['pui-concl'].innerHTML);
  var etapes = txt(ui2._sous['pui-etapes'].innerHTML);

  // La base et les exposants, relus sur le titre du calcul.
  var t = txt(lignes(corps)[0] || '');
  var m = t.match(/^(\d+)\^(-?\d+) × (\d+)\^(-?\d+)$/) || t.match(/^\[(\d+)\^(-?\d+)\/(\d+)\^(-?\d+) = \?$/);
  if (c !== 'negatif') {
    if (!m) { ko(c + ' : titre illisible « ' + t + ' »'); continue; }
    var A = +m[1], N = +m[2], P = +m[4];
    if (+m[3] !== A) ko(c + ' : deux bases différentes dans ' + t);
  }

  if (c === 'produit') {
    // n facteurs bleus, p facteurs orange, puis n + p comptés
    var L = lignes(corps);
    if (nbFacteurs(L[1], 'g1') !== N) ko('produit : ' + nbFacteurs(L[1], 'g1') + ' facteurs dans la première parenthèse au lieu de ' + N);
    if (nbFacteurs(L[1], 'g2') !== P) ko('produit : ' + nbFacteurs(L[1], 'g2') + ' facteurs dans la seconde au lieu de ' + P);
    if (nbFacteurs(L[2]) !== N + P) ko('produit : ' + nbFacteurs(L[2]) + ' facteurs réunis au lieu de ' + (N + P));
    if ((L[2].match(/pr-f compte/g) || []).length !== N + P) ko('produit : les ' + (N + P) + ' facteurs ne sont pas tous comptés');
    if (L[2].indexOf(N + ' + ' + P + ' = ' + (N + P) + ' facteurs') < 0) ko('produit : le compte « ' + N + ' + ' + P + ' » n\'est pas écrit');
    var val = puiss(A, N + P);
    var attendu = A + '^' + N + ' × ' + A + '^' + P + ' = ' + A + '^' + (N + P) + ' = ' + val;
    if (concl !== attendu) ko('produit : conclusion « ' + concl + '  » au lieu de « ' + attendu + ' »');
    if (txt(bloc(corps, 'pr-verif')).indexOf(puiss(A, N) + ' × ' + puiss(A, P) + ' = ' + val) < 0)
      ko('produit : la vérification numérique est fausse — ' + txt(bloc(corps, 'pr-verif')));
    // le piège nomme les deux mauvaises réponses
    if (etapes.indexOf((A * A) + '^' + (N + P)) < 0) ko('produit : le piège ' + (A * A) + '^' + (N + P) + ' n\'est pas nommé');
    if (N * P !== N + P && etapes.indexOf(A + '^' + (N * P)) < 0) ko('produit : le piège ' + A + '^' + (N * P) + ' n\'est pas nommé');
    if (N * P === N + P && etapes.indexOf('multiplié les exposants') >= 0) ko('produit : n × p = n + p, le piège des exposants multipliés n\'a pas de sens ici');
  }

  if (c === 'quotient') {
    var D = N - P, M = Math.min(N, P);
    if (N === P) ko('quotient : n = p tiré, le cas est réservé au troisième volet');
    if (Math.max(N, P) < 3) ko('quotient : ' + N + '/' + P + ', trop peu de facteurs pour voir la simplification');
    if (D < 0) negatifs++;
    var F = bloc(corps, 'pr-facteurs');
    var num = F.split('pr-den')[0], den = F.split('pr-den')[1] || '';
    if (nbFacteurs(num) !== N || nbFacteurs(den) !== P) ko('quotient : ' + nbFacteurs(num) + '/' + nbFacteurs(den) + ' facteurs au lieu de ' + N + '/' + P);
    if ((num.match(/barre/g) || []).length !== M || (den.match(/barre/g) || []).length !== M)
      ko('quotient : il faut barrer ' + M + ' facteurs en haut et en bas');
    // la déduction passe par la règle du produit
    var ded = txt(bloc(corps, 'pr-deduc'));
    if (ded.indexOf(A + '^' + D + ' × ' + A + '^' + P) < 0 || ded.indexOf('= ' + A + '^' + N) < 0)
      ko('quotient : la déduction « ' + ded + ' » ne dit pas a^(n−p) × a^p = a^n');
    var valTxt = D >= 0 ? String(puiss(A, D)) : '[1/' + puiss(A, -D);
    var att = '[' + A + '^' + N + '/' + A + '^' + P + ' = ' + A + '^' + D + ' = ' + valTxt;
    if (concl.indexOf(att) !== 0) ko('quotient : conclusion « ' + concl + ' » au lieu de « ' + att + ' … »');
    if (D < 0 && etapes.indexOf('exposant négatif') < 0) ko('quotient : p > n sans un mot sur l\'exposant négatif');
    if (D > 0 && !new RegExp('il reste ' + D + ' facteur', 'i').test(etapes)) ko('quotient : « il reste ' + D + ' facteur(s) » manque');
  }

  if (c === 'negatif') {
    var t0 = txt(lignes(corps)[0] || '');
    var m0 = t0.match(/^\[(\d+)\^(\d+)\/(\d+)\^(\d+) = \[(\d+)\/(\d+) = 1$/);
    if (!m0) { ko('negatif : première ligne illisible « ' + t0 + ' »'); continue; }
    var A0 = +m0[1], N0 = +m0[2];
    if (+m0[5] !== puiss(A0, N0) || +m0[6] !== puiss(A0, N0)) ko('negatif : ' + A0 + '^' + N0 + ' vaut ' + puiss(A0, N0) + ', pas ' + m0[5]);
    var mP = txt(lignes(corps)[2] || '').match(/= (\d+)\^-(\d+)$/);
    if (!mP) { ko('negatif : a^(−p) illisible dans « ' + txt(lignes(corps)[2]) + ' »'); continue; }
    var P0 = +mP[2];
    var att0 = A0 + '^0 = 1 · ' + A0 + '^-' + P0 + ' = [1/' + A0 + '^' + P0 + ' = [1/' + puiss(A0, P0);
    if (concl !== att0) ko('negatif : conclusion « ' + concl + ' » au lieu de « ' + att0 + ' »');
    if (etapes.indexOf('positif') < 0) ko('negatif : il faut dire qu\'un exposant négatif ne rend pas le nombre négatif');
  }

  // Le rejeu est identique : « Précédent » repart du reset puis rejoue.
  remiseAZero();
  steps.forEach(function (s, i) {
    if (s.step) { s.step(1); }
    if (s.after) s.after();
    if (etat() !== refs[i]) ko(c + ' : le rejeu de l\'étape ' + (i + 1) + ' diffère du premier passage');
  });
  if (!ui2._sous['pui-etapes'].innerHTML) ko(c + ' : plus aucune phrase après un rejeu');
}

print(cpt.produit + ' produits, ' + cpt.quotient + ' quotients (dont ' + negatifs + ' à exposant négatif), ' +
      cpt.negatif + ' exposants nuls/négatifs rejoués');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LES FACTEURS SONT COMPTÉS JUSTE ET LES RÈGLES SE DÉDUISENT L\'UNE DE L\'AUTRE');
