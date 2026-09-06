/*
 * Travailler sous son niveau (js/progression.js).
 *
 * Une élève de 2nde peut faire les exercices de 6ème — mais ils doivent lui
 * rapporter MOINS d'XP et de pièces qu'à une élève de 6ème, à réponses égales.
 * Sa maîtrise de la compétence, elle, doit progresser exactement pareil : on
 * réduit la récompense, pas l'apprentissage. Un niveau inconnu ne réduit rien.
 */
var window = this, global = this;
var ETATS = {};
var PROFILS = {
  zoe:  { id: 'zoe',  prenom: 'Zoé',  niveau: '6eme' },
  lea:  { id: 'lea',  prenom: 'Léa',  niveau: '5eme' },
  mia:  { id: 'mia',  prenom: 'Mia',  niveau: '4eme' },
  ana:  { id: 'ana',  prenom: 'Ana',  niveau: '2nde' },
  sans: { id: 'sans', prenom: 'Sans', niveau: undefined }
};
var MathsProfils = {
  profil: function (id) { return PROFILS[id] || null; },
  etat: function (id) { return ETATS[id] || (ETATS[id] = { xp: 0, pieces: 0, maitrises: {} }); },
  setEtat: function (id, e) { ETATS[id] = e; },
  ajouteJournal: function () {}, journal: function () { return []; }
};
var CAT = [
  { code: 'frac6', libelle: 'Fractions', niveau: '6eme', chapitre: 'nombres-6' },
  { code: 'prop6', libelle: 'Proportionnalité', niveau: '6eme', chapitre: 'nombres-6' },
  { code: 'fn2',   libelle: 'Fonctions', niveau: '2nde', chapitre: 'fonctions-2' },
  { code: 'mystere', libelle: 'Sans niveau', niveau: '', chapitre: 'x' }
];
var MathsExos = { catalogue: CAT, competence: function (c) {
  return CAT.filter(function (x) { return x.code === c; })[0] || { code: c, niveau: '' }; } };
window.MathsProfils = MathsProfils; window.MathsExos = MathsExos;
load('js/progression.js');

var err = []; function ko(m) { err.push(m); }
var P = MathsProgression;

/* --- 1. le coefficient ------------------------------------------------- */
[['6eme', '6eme', 1], ['2nde', '2nde', 1], ['6eme', '2nde', 1],      // même niveau ou au-dessus
 ['5eme', '6eme', 0.6], ['4eme', '6eme', 0.4], ['3eme', '6eme', 0.25],
 ['2nde', '6eme', 0.25], ['terminale', '6eme', 0.25], ['2nde', '3eme', 0.6],
 [undefined, '6eme', 1], ['2nde', '', 1], ['2nde', 'inconnu', 1]]
.forEach(function (c) {
  var v = P.coefNiveau(c[0], c[1]);
  if (v !== c[2]) ko('coefNiveau(' + c[0] + ', ' + c[1] + ') = ' + v + ' au lieu de ' + c[2]);
});

/* --- 2. mêmes réponses, même maîtrise, moins d'XP ----------------------- */
// Chacune répond juste 12 fois de suite à « frac6 », au même palier — le plus
// haut, pour que l'XP d'une question dépasse le plancher de 1 XP et que les
// écarts se voient.
function serie(id, comp, n) {
  var last = null, xp = 0, pieces = 0;
  for (var k = 0; k < n; k++) {
    last = P.apresQuestion(id, { comp: comp, gen: 'g', seed: k + 1, palier: 4,
                                 maxPaliers: 4, ok: true, indices: 0, indicesDispo: 2 });
    xp += last.xp; pieces += last.pieces;
  }
  return { xp: xp, pieces: pieces, m: last.maitrise, ecart: last.ecart };
}
var rZoe = serie('zoe', 'frac6', 12), rLea = serie('lea', 'frac6', 12),
    rMia = serie('mia', 'frac6', 12), rAna = serie('ana', 'frac6', 12),
    rSans = serie('sans', 'frac6', 12);

if (!(rZoe.xp > rLea.xp && rLea.xp > rMia.xp && rMia.xp > rAna.xp))
  ko('l\'XP ne décroît pas avec l\'écart de niveau : 6ème ' + rZoe.xp + ', 5ème ' + rLea.xp +
     ', 4ème ' + rMia.xp + ', 2nde ' + rAna.xp);
if (rSans.xp !== rZoe.xp) ko('un profil sans niveau est pénalisé (' + rSans.xp + ' vs ' + rZoe.xp + ')');
if (rAna.xp > rZoe.xp * 0.3 + 12)
  ko('en 2nde, l\'XP de la 6ème n\'est pas réduit au quart : ' + rAna.xp + ' vs ' + rZoe.xp);
if (rAna.xp <= 0) ko('une bonne réponse doit toujours rapporter au moins 1 XP');

// la maîtrise, elle, est identique
['score', 'palier', 'meilleur', 'reussites'].forEach(function (k) {
  // (tolérance : la décroissance est calculée à la milliseconde près)
  if (Math.abs(rAna.m[k] - rZoe.m[k]) > 1e-4)
    ko('la maîtrise diffère (' + k + ' : ' + rAna.m[k] + ' vs ' + rZoe.m[k] + ') — on réduit la récompense, pas l\'apprentissage');
});

// les pièces de ceinture aussi
if (!rZoe.pieces) ko('12 réussites n\'ont donné aucune ceinture à Zoé : le test ne prouve rien');
if (rAna.pieces >= rZoe.pieces)
  ko('les pièces de ceinture ne sont pas réduites : Ana ' + rAna.pieces + ', Zoé ' + rZoe.pieces);
if (Math.abs(rAna.pieces - Math.round(rZoe.pieces * 0.25)) > 1)
  ko('pièces de ceinture d\'Ana : ' + rAna.pieces + ', attendu environ ' + rZoe.pieces * 0.25);
if (rSans.pieces !== rZoe.pieces) ko('un profil sans niveau perd des pièces de ceinture');

// de quoi l'expliquer à l'écran
if (!rAna.ecart || rAna.ecart.coef !== 0.25 || rAna.ecart.nomComp !== '6ème' || rAna.ecart.nomProfil !== '2nde')
  ko('l\'écart renvoyé n\'explique pas la réduction : ' + JSON.stringify(rAna.ecart));
if (rZoe.ecart.coef !== 1) ko('Zoé, en 6ème, est réduite sur une compétence de 6ème');

/* --- 3. à son niveau, Ana gagne plein ----------------------------------- */
var rAna2 = serie('ana', 'fn2', 12);
if (rAna2.xp !== rZoe.xp) ko('Ana sur la 2nde gagne ' + rAna2.xp + ' XP, Zoé sur la 6ème ' + rZoe.xp + ' : ça devrait être pareil');
if (rAna2.pieces !== rZoe.pieces) ko('Ana sur la 2nde gagne ' + rAna2.pieces + ' pièces contre ' + rZoe.pieces);
var rAna3 = serie('ana', 'mystere', 3);
if (rAna3.ecart.coef !== 1) ko('une compétence sans niveau est réduite');

/* --- 4. le boss ---------------------------------------------------------- */
var bZoe = P.bossFini('zoe', 'nombres-6', 9, 10), bAna = P.bossFini('ana', 'nombres-6', 9, 10);
if (!bZoe.reussi || !bAna.reussi) ko('9/10 doit valider le boss');
if (bZoe.pieces !== 25) ko('le boss de 6ème rapporte ' + bZoe.pieces + ' à Zoé au lieu de 25');
if (bAna.pieces !== Math.round(25 * 0.25)) ko('le boss de 6ème rapporte ' + bAna.pieces + ' à Ana au lieu de ' + Math.round(25 * 0.25));
var bAna2 = P.bossFini('ana', 'fonctions-2', 10, 10);
if (bAna2.pieces !== 25) ko('le boss de 2nde rapporte ' + bAna2.pieces + ' à Ana au lieu de 25');
// le second passage ne redonne rien, réduit ou pas
if (P.bossFini('ana', 'nombres-6', 10, 10).pieces !== 0) ko('le gros lot du boss retombe une seconde fois');

print('XP pour 12 réussites en 6ème : Zoé (6ème) ' + rZoe.xp + ' · Léa (5ème) ' + rLea.xp +
      ' · Mia (4ème) ' + rMia.xp + ' · Ana (2nde) ' + rAna.xp +
      ' — pièces de ceinture : ' + rZoe.pieces + ' / ' + rLea.pieces + ' / ' + rMia.pieces + ' / ' + rAna.pieces);
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('SOUS SON NIVEAU, ON APPREND AUTANT MAIS ON GAGNE MOINS');
