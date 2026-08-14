/*
 * Le jardin et la révision (js/progression.js).
 *
 * On simule plusieurs profils, on leur donne un passé de réponses, puis on
 * regarde ce que le moteur leur propose : une compétence d'un niveau supérieur
 * ne doit jamais apparaître, mais ce qui a déjà été travaillé reste visible,
 * et la révision ne sort pas du programme du profil.
 */
var window = this, global = this;
/* --- profils et catalogue simulés --- */
var ETATS = {};
var PROFILS = {
  lea:  { id:'lea',  prenom:'Léa',  niveau:'5eme' },
  zoe:  { id:'zoe',  prenom:'Zoé',  niveau:'6eme' },
  ana:  { id:'ana',  prenom:'Ana',  niveau:'2nde' },
  sans: { id:'sans', prenom:'Sans', niveau: undefined }
};
var MathsProfils = {
  profil: function (id) { return PROFILS[id] || null; },
  etat: function (id) { return ETATS[id] || (ETATS[id] = { xp:0, pieces:0, maitrises:{} }); },
  setEtat: function (id, e) { ETATS[id] = e; },
  ajouteJournal: function () {}, journal: function () { return []; }
};
var CAT = [];
['6eme','5eme','4eme','3eme','2nde','1ere','terminale'].forEach(function (n, i) {
  for (var k = 0; k < i + 2; k++) CAT.push({ code: n + '-' + k, libelle: n + ' n°' + k,
                                             niveau: n, chapitre: 'ch-' + n });
});
CAT.push({ code: 'sansniveau', libelle: 'Sans niveau', niveau: '', chapitre: 'x' });
var MathsExos = { catalogue: CAT, competence: function (c) {
  return CAT.filter(function (x) { return x.code === c; })[0] || { code: c, niveau: '' }; } };
window.MathsProfils = MathsProfils; window.MathsExos = MathsExos;
load('js/progression.js');

var err = []; function ko(m) { err.push(m); }
function attendu(niv) {
  var N = MathsProgression.NIVEAUX, i = N.indexOf(niv);
  return CAT.filter(function (c) {
    var j = N.indexOf(c.niveau);
    return i < 0 || j < 0 || j <= i;
  }).length;
}
/* --- 1. le total suit le niveau du profil --- */
Object.keys(PROFILS).forEach(function (id) {
  var j = MathsProgression.jardin(id), r = MathsProgression.resume(id);
  var att = attendu(PROFILS[id].niveau);
  if (j.length !== att) ko(id + ' (' + PROFILS[id].niveau + ') : jardin de ' + j.length +
                           ' compétences au lieu de ' + att);
  if (r.total !== att) ko(id + ' : resume().total = ' + r.total + ' au lieu de ' + att);
  // aucune compétence d'un niveau supérieur
  var N = MathsProgression.NIVEAUX, i = N.indexOf(PROFILS[id].niveau);
  if (i >= 0) j.forEach(function (c) {
    var k = N.indexOf(c.niveau);
    if (k > i) ko(id + ' : ' + c.code + ' (' + c.niveau + ') est au-dessus de son niveau');
  });
});
var jLea = MathsProgression.jardin('lea').length;
var jZoe = MathsProgression.jardin('zoe').length;
var jAna = MathsProgression.jardin('ana').length;
print('jardins : Zoé (6ème) ' + jZoe + ' · Léa (5ème) ' + jLea + ' · Ana (2nde) ' + jAna +
      ' · sans niveau ' + MathsProgression.jardin('sans').length + ' (catalogue : ' + CAT.length + ')');
if (!(jZoe < jLea && jLea < jAna)) ko('les totaux ne croissent pas avec le niveau');
if (MathsProgression.jardin('sans').length !== CAT.length) ko('un profil sans niveau devrait tout voir');
// la compétence sans niveau doit rester visible pour tout le monde
Object.keys(PROFILS).forEach(function (id) {
  if (!MathsProgression.jardin(id).some(function (c) { return c.code === 'sansniveau'; }))
    ko(id + ' : la compétence sans niveau a disparu');
});

/* --- 2. ce qui a déjà été travaillé ne disparaît jamais --- */
var e = MathsProfils.etat('lea');
e.maitrises['terminale-0'] = { score: 40, palier: 2, derniere: Date.now(),
                               serie: 1, tentatives: 5, reussites: 3, meilleur: 40 };
MathsProfils.setEtat('lea', e);
var j2 = MathsProgression.jardin('lea');
if (!j2.some(function (c) { return c.code === 'terminale-0'; }))
  ko('une compétence déjà travaillée au-dessus du niveau a disparu du jardin');
if (j2.length !== jLea + 1) ko('le total n\'a pas suivi : ' + j2.length + ' au lieu de ' + (jLea + 1));
if (MathsProgression.resume('lea').travaillees !== 1) ko('travaillees ne compte pas la compétence faite');

/* --- 3. « arroser » ne propose plus rien hors programme --- */
var N2 = MathsProgression.NIVEAUX;
MathsProgression.aReviser('zoe', 5).forEach(function (code) {
  var c = MathsExos.competence(code);
  if (N2.indexOf(c.niveau) > N2.indexOf('6eme'))
    ko('révision : ' + code + ' (' + c.niveau + ') proposé à une élève de 6ème');
});
print(err.length ? 'ÉCHECS :\n - ' + err.join('\n - ')
                 : 'JARDIN CONFORME : chaque profil ne voit que son niveau et ceux d\'en dessous,\n' +
                   'ce qui est déjà travaillé reste visible, et la révision ne sort pas du programme');
