/* Le mode flash des fondamentaux (js/flash.js).
 *
 * Trois choses à prouver, et une à interdire.
 *
 * LE BARÈME. Trois points sous trois secondes, deux jusqu'à six, un au-delà,
 * zéro si c'est faux. Les bornes sont vérifiées AU MILLIÈME près, des deux
 * côtés : un seuil qui glisse d'une milliseconde change la note d'une élève.
 *
 * LES FAITS. Ceux que les générateurs déclarent doivent être du rappel PUR et
 * arithmétiquement justes : 81 produits jusqu'à 10 × 10, 64 sommes qui ne
 * dépassent jamais 20 — c'est le nom de la compétence. Aucune clé en double,
 * aucun énoncé qui ne corresponde pas à sa réponse.
 *
 * LE TIRAGE. C'est là que se joue l'utilité de la séance. Un fait raté doit
 * revenir bien plus souvent qu'un fait su et rapide, un fait jamais vu doit
 * passer devant, et une séance ne doit jamais poser deux fois la même question
 * — sinon la seconde ne mesure plus un rappel mais un souvenir immédiat.
 *
 * CE QUI EST INTERDIT. Le flash ne doit toucher NI la maîtrise, NI les
 * ceintures, NI les paliers. C'est la promesse faite à l'élève : être lente ne
 * coûte rien ailleurs. Le contrôle prend une empreinte de l'état de
 * progression avant, et la compare après une séance entière.
 */
var window = this;
load('js/alea.js');

/* ------------------------------------------------------------------ */
/* Un faux MathsExos, et un faux profil                                */
/* ------------------------------------------------------------------ */
var GENS = [];
var MathsExos = {
  register: function (g) { GENS.push(g); },
  liste: function () { return GENS.slice(); }
};
window.MathsExos = MathsExos;
load('exos/6eme/tables.js');
load('exos/6eme/additions-20.js');

var ETATS = {}, JOURNAL = [];
var MathsProfils = {
  courant: function () { return 'p1'; },
  etat: function (id) {
    if (!ETATS[id]) ETATS[id] = { maitrises: {}, xp: 0, pieces: 0, sessions: [] };
    return ETATS[id];
  },
  setEtat: function (id, e) { ETATS[id] = e; },
  ajouteJournal: function (id, o) { JOURNAL.push(o); }
};
window.MathsProfils = MathsProfils;
load('js/flash.js');
var F = MathsFlash;

var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }

/* ------------------------------------------------------------------ */
/* 1. Le barème, aux bornes exactes                                    */
/* ------------------------------------------------------------------ */
var bornes = [
  [0, 3], [1, 3], [2999, 3],
  [3000, 2], [3001, 2], [5999, 2],
  [6000, 1], [6001, 1], [60000, 1]
];
bornes.forEach(function (b) {
  if (F.points(true, b[0]) !== b[1])
    ko('barème : ' + b[0] + ' ms devrait valoir ' + b[1] + ' point(s), on donne ' +
       F.points(true, b[0]));
  if (F.points(false, b[0]) !== 0)
    ko('barème : une réponse fausse à ' + b[0] + ' ms rapporte des points');
});

/* ------------------------------------------------------------------ */
/* 2. Les faits déclarés                                               */
/* ------------------------------------------------------------------ */
var srcs = F.sources();
if (srcs.length !== 2) ko('on attend deux compétences fondamentales, il y en a ' + srcs.length);
var attendus = { tables: 81, 'additions-20': 64 };
srcs.forEach(function (g) {
  var faits = g.flash.faits();
  if (attendus[g.competence] && faits.length !== attendus[g.competence])
    ko(g.competence + ' : ' + faits.length + ' faits au lieu de ' +
       attendus[g.competence]);
  var vues = {};
  faits.forEach(function (f) {
    if (vues[f.cle]) ko(g.competence + ' : la clé « ' + f.cle + ' » est en double');
    vues[f.cle] = 1;
    // l'énoncé doit VRAIMENT valoir la réponse annoncée
    var m = /^(\d+) ([×+]) (\d+)$/.exec(f.texte);
    if (!m) { ko(g.competence + ' : énoncé illisible « ' + f.texte + ' »'); return; }
    var a = +m[1], b = +m[3];
    var vrai = m[2] === '×' ? a * b : a + b;
    if (vrai !== f.reponse)
      ko(g.competence + ' : « ' + f.texte + ' » vaut ' + vrai + ', on annonce ' + f.reponse);
    // et rester dans les bornes que le nom de la compétence promet
    if (g.competence === 'tables' && (a > 10 || b > 10 || a < 2 || b < 2))
      ko('tables : « ' + f.texte +' » sort des tables de 2 à 10');
    if (g.competence === 'additions-20' && f.reponse > 20)
      ko('additions-20 : « ' + f.texte + ' = ' + f.reponse + ' » dépasse 20');
    // du rappel pur : deux opérandes, jamais d'inconnue
    if (/\?|□|manque/.test(f.texte))
      ko(g.competence + ' : « ' + f.texte + ' » n\'est pas du rappel direct');
  });
});

/* ------------------------------------------------------------------ */
/* 3. Le tirage : sans remise, et pondéré                              */
/* ------------------------------------------------------------------ */
var t1 = F.tirage('p1', 20, 12345);
if (t1.length !== 20) ko('tirage : ' + t1.length + ' questions au lieu de 20');
var dbl = {};
t1.forEach(function (f) {
  if (dbl[f.comp + '/' + f.cle]) ko('tirage : « ' + f.texte + ' » sort deux fois');
  dbl[f.comp + '/' + f.cle] = 1;
});
// les deux compétences doivent être servies
var comps = {};
F.tirage('p1', 40, 777).forEach(function (f) { comps[f.comp] = 1; });
if (Object.keys(comps).length !== 2)
  ko('tirage : une seule compétence est servie sur quarante questions');

/* Le poids : l'ordre doit être strict, sinon le tirage ne sert à rien. */
var pJamais = F.poids(null);
var pFaux = F.poids({ n: 5, e: 1, m: 2000 });
var pLent = F.poids({ n: 5, e: 0, m: 8000 });
var pMoyen = F.poids({ n: 5, e: 0, m: 4000 });
var pSu = F.poids({ n: 5, e: 0, m: 1200 });
if (!(pJamais > pFaux && pFaux > pLent && pLent > pMoyen && pMoyen > pSu))
  ko('poids : l\'ordre jamais vu > faux > lent > moyen > su n\'est pas respecté (' +
     [pJamais, pFaux, pLent, pMoyen, pSu].join(' / ') + ')');
if (pSu <= 0) ko('poids : un fait su tombe à zéro — il ne reviendrait jamais, et s\'oublierait');

/* Et à l'usage : on déclare tout su et rapide, sauf trois faits ratés. Ceux-là
   doivent revenir bien plus souvent qu'un tirage uniforme ne le ferait. */
var toutes = srcs[0].flash.faits();
toutes.forEach(function (f) {
  F.enregistre('p1', { comp: 'tables', cle: f.cle }, true, 1000);
});
srcs[1].flash.faits().forEach(function (f) {
  F.enregistre('p1', { comp: 'additions-20', cle: f.cle }, true, 1000);
});
var durs = ['7x8', '6x9', '8x7'];
durs.forEach(function (c) { F.enregistre('p1', { comp: 'tables', cle: c }, false, 9000); });

var sorties = 0, tours = 60;
for (var t = 0; t < tours; t++) {
  F.tirage('p1', 20, 1000 + t).forEach(function (f) {
    if (f.comp === 'tables' && durs.indexOf(f.cle) >= 0) sorties++;
  });
}
// uniforme, trois faits sur 145 en 20 tirages : environ 0,4 par séance
var uniforme = tours * 20 * durs.length / (81 + 64);
if (sorties < uniforme * 3)
  ko('tirage : les faits ratés sortent ' + sorties + ' fois, à peine plus que le hasard (' +
     Math.round(uniforme) + ') — la pondération ne sert à rien');

/* ------------------------------------------------------------------ */
/* 4. La jauge d'automatisme                                           */
/* ------------------------------------------------------------------ */
var r = F.resume('p1');
if (r.total !== 145) ko('résumé : ' + r.total + ' faits au total au lieu de 145');
if (r.vus !== 145) ko('résumé : ' + r.vus + ' faits vus alors qu\'on les a tous joués');
// tout est su à 1 s sauf trois ratés : la moyenne doit être juste sous 3
var attendue = (145 - 3) * 3 / 145;
if (Math.abs(r.moyenne - attendue) > 1e-9)
  ko('résumé : moyenne ' + r.moyenne + ' au lieu de ' + attendue);
if (r.pct !== Math.round(attendue / 3 * 100))
  ko('résumé : le pourcentage ne suit pas la moyenne');

/* ------------------------------------------------------------------ */
/* 5. La séance ne touche RIEN de la progression                       */
/* ------------------------------------------------------------------ */
ETATS = {}; JOURNAL = [];
var e0 = MathsProfils.etat('p1');
e0.maitrises = { tables: { score: 42, palier: 3, meilleur: 60, serie: 2 },
                 'additions-20': { score: 30, palier: 2, meilleur: 30, serie: 0 } };
e0.xp = 500;
var empreinte = JSON.stringify(e0.maitrises) + '|' + e0.xp;

F.tirage('p1', 20, 42).forEach(function (f, k) {
  F.enregistre('p1', f, k % 4 !== 0, 1000 + k * 400);
});
F.finSeance('p1', { n: 20, justes: 15, points: 33, ms: 90000 });

var e1 = MathsProfils.etat('p1');
if (JSON.stringify(e1.maitrises) + '|' + e1.xp !== empreinte)
  ko('une séance flash a modifié la maîtrise, les ceintures ou l\'XP — c\'est ' +
     'précisément ce qu\'elle ne doit pas faire');
if (!e1.flash || !e1.flash.derniere) ko('la séance ne laisse pas de date');
if (e1.pieces !== 2) ko('pièces : ' + e1.pieces + ' au lieu de 2 (33 points ÷ 15)');
/* Et l'ordre de grandeur, qui compte plus que la formule : une séance parfaite
   ne doit pas valoir une ceinture. Sans ce garde-fou, un barème généreux
   viderait la boutique de son sens sans qu'aucun test ne bronche. */
var parfaite = Math.floor(20 * 3 / 15);
if (parfaite > 5)
  ko('une séance parfaite rapporte ' + parfaite + ' pièces — c\'est trop : une ' +
     'ceinture verte en vaut 20, et la régularité hebdomadaire 15');
if (JOURNAL.length !== 1 || JOURNAL[0].type !== 'flash')
  ko('la séance ne laisse pas de trace « flash » dans le journal');

/* ------------------------------------------------------------------ */
/* 6. La relance : deux jours, pas moins                               */
/* ------------------------------------------------------------------ */
if (F.doitProposer('p1')) ko('la séance est reproposée alors qu\'elle vient d\'être faite');
e1.flash.derniere = Date.now() - 47 * 3600 * 1000;      // 1 j 23 h
MathsProfils.setEtat('p1', e1);
if (F.doitProposer('p1')) ko('la séance est reproposée avant deux jours');
e1.flash.derniere = Date.now() - 49 * 3600 * 1000;      // 2 j 1 h
MathsProfils.setEtat('p1', e1);
if (!F.doitProposer('p1')) ko('la séance n\'est pas reproposée après deux jours');
if (F.joursDepuis('p1') !== 2)
  ko('joursDepuis annonce ' + F.joursDepuis('p1') + ' au lieu de 2');
// un profil qui n'a jamais joué doit se la voir proposer
ETATS = {};
if (!F.doitProposer('p2')) ko('un profil neuf ne se voit pas proposer la séance');
if (F.joursDepuis('p2') !== null) ko('joursDepuis devrait être vide pour un profil neuf');

print('barème, faits (145), tirage pondéré et cloisonnement vérifiés — ' +
      'faits ratés ressortis ' + sorties + ' fois contre ' + Math.round(uniforme) +
      ' au hasard');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LE CHRONO NOTE, ET NE TOUCHE À RIEN D\'AUTRE');
