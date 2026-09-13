/* La boutique : le catalogue par défaut, et la fusion des articles ajoutés
   après coup dans un catalogue déjà enregistré chez le parent.

   Le catalogue est écrit dans mv.admin dès sa première lecture. Sans fusion,
   un article ajouté aux valeurs par défaut n'atteindrait jamais une famille
   qui utilise déjà la boutique — et personne ne s'en apercevrait. */
var window = this;

/* --- stockage et profils simulés --- */
var STOCK = {};
var MathsProfils = {
  lire: function (k, d) { return k in STOCK ? JSON.parse(STOCK[k]) : d; },
  ecrire: function (k, v) { STOCK[k] = JSON.stringify(v); },
  profils: function () { return [{ id: 'lea', prenom: 'Léa' }]; },
  etat: function (id) { return MathsProfils.lire('mv.etat.' + id, { pieces: 0 }); },
  setEtat: function (id, e) { MathsProfils.ecrire('mv.etat.' + id, e); }
};
window.MathsProfils = MathsProfils;
load('js/boutique.js');

var err = []; function ko(m) { err.push(m); }
var CARTES = ['Sephora', 'Zara', 'Stradivarius'];

function bons(liste) {
  return liste.filter(function (a) { return a.type === 'bon'; });
}

/* ------------------------------------------------------------------ */
/* 1. Le catalogue par défaut propose les trois cartes cadeaux          */
/* ------------------------------------------------------------------ */
var defaut = MathsBoutique.defaut();
CARTES.forEach(function (e) {
  var a = bons(defaut).filter(function (x) { return x.nom.indexOf(e) >= 0; })[0];
  if (!a) return ko('pas de carte cadeau ' + e + ' dans le catalogue par défaut');
  if (a.euros !== 20) ko('carte ' + e + ' : ' + a.euros + ' € au lieu de 20');
  if (a.nom.indexOf('20 €') < 0) ko('carte ' + e + ' : le nom ne dit pas 20 € — ' + a.nom);
  /* le coût en pièces suit le même taux que l'argent de poche (100 pièces/€) */
  if (a.cout !== 20 * MathsBoutique.reglages().tauxPieces)
    ko('carte ' + e + ' : ' + a.cout + ' pièces pour 20 € au taux de ' +
       MathsBoutique.reglages().tauxPieces);
  if (MathsBoutique.eurosDe(a) !== 20) ko('eurosDe(' + e + ') = ' + MathsBoutique.eurosDe(a));
});
var ids = defaut.map(function (a) { return a.id; });
ids.forEach(function (id, i) {
  if (ids.indexOf(id) !== i) ko('identifiant en double dans le catalogue : ' + id);
});

/* ------------------------------------------------------------------ */
/* 2. Un catalogue enregistré AVANT les cartes les reçoit — une fois   */
/* ------------------------------------------------------------------ */
STOCK = {};
var ancien = MathsBoutique.defaut().filter(function (a) { return a.type !== 'bon'; });
MathsProfils.ecrire('mv.admin', { budgetMensuel: 30, tauxPieces: 100,
                                  boutique: ancien, depenses: [] });
var apres = MathsBoutique.articles();
if (bons(apres).length !== 3)
  ko('catalogue déjà enregistré : ' + bons(apres).length + ' bon(s) après fusion, 3 attendus');
if (apres.length !== ancien.length + 3)
  ko('la fusion a changé autre chose que les bons : ' + apres.length + ' articles');
/* les réglages du parent sont conservés */
if (MathsBoutique.reglages().budgetMensuel !== 30) ko('la fusion a écrasé le budget');
/* la fusion est enregistrée, pas seulement calculée à la volée */
if (bons(MathsProfils.lire('mv.admin').boutique).length !== 3)
  ko('la fusion n\'est pas enregistrée dans mv.admin');

/* le parent retire une carte : elle ne doit pas revenir à la lecture suivante */
var sans = MathsBoutique.articles().filter(function (a) { return a.id !== 'bonZara'; });
MathsBoutique.setArticles(sans);
if (MathsBoutique.article('bonZara'))
  ko('une carte retirée par le parent revient à la lecture suivante');
if (bons(MathsBoutique.articles()).length !== 2) ko('retrait : mauvais nombre de bons');

/* et une lecture de plus ne rajoute rien */
var n = MathsBoutique.articles().length;
if (MathsBoutique.articles().length !== n) ko('le catalogue grossit à chaque lecture');

/* ------------------------------------------------------------------ */
/* 3. Un catalogue tout neuf porte déjà la version courante             */
/* ------------------------------------------------------------------ */
STOCK = {};
MathsBoutique.articles();
MathsBoutique.setReglages({ budgetMensuel: 25 });
var adm = MathsProfils.lire('mv.admin');
if (bons(adm.boutique).length !== 3) ko('catalogue neuf : ' + bons(adm.boutique).length + ' bon(s)');
if (!adm.versionCatalogue) ko('catalogue neuf : pas de version enregistrée');

/* ------------------------------------------------------------------ */
/* 4. Une carte se demande comme les autres articles                    */
/* ------------------------------------------------------------------ */
MathsProfils.setEtat('lea', { pieces: 2500, achats: [] });
var v = MathsBoutique.peutDemander('lea', 'bonSephora');
if (!v.ok) ko('carte Sephora indisponible avec 2500 pièces et 25 € de budget : ' + v.raison);
var r = MathsBoutique.demander('lea', 'bonSephora');
if (!r.ok) ko('la demande de carte échoue : ' + JSON.stringify(r));
if (MathsProfils.etat('lea').pieces !== 500) ko('pièces après demande : ' + MathsProfils.etat('lea').pieces);
/* avec le budget par défaut de 15 €, une carte de 20 € est hors d'atteinte :
   c'est voulu (le plafond protège le parent), mais le message doit le dire */
MathsBoutique.setReglages({ budgetMensuel: 15 });
MathsProfils.setEtat('lea', { pieces: 2500, achats: [] });
var v2 = MathsBoutique.peutDemander('lea', 'bonZara');
if (v2.ok || !/budget/.test(v2.raison)) ko('sous le plafond, la carte devrait être refusée pour budget');

/* ------------------------------------------------------------------ */
if (err.length) {
  print('ÉCHEC — ' + err.length + ' problème(s) :');
  err.forEach(function (m) { print('  · ' + m); });
} else {
  print('boutique : 3 cartes cadeaux de 20 € par défaut, fusionnées une seule ' +
        'fois dans un catalogue déjà enregistré');
}
