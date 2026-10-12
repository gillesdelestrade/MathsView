/*
 * La leçon « La masse et ses unités » (5ème, physique-chimie), montée avec
 * le VRAI JSXGraph (renderer « no »).
 *
 * La balance est relue sur ses deux bouts de fléau : la gauche descend quand
 * l'objet est seul, remonte à chaque masse marquée posée, et le fléau est
 * horizontal exactement quand la somme des étiquettes des masses marquées —
 * lues sur la figure — égale la masse de l'objet. Le tableau est relu dans
 * ses cellules : les chiffres par colonne, la virgule par sa position, les
 * noms d'unités dans l'en-tête ; le nombre reconstitué doit valoir la masse,
 * dans l'unité de départ puis dans l'unité d'arrivée, et le facteur affiché
 * doit être la bonne puissance de 10. Chaque objet, chaque unité cible, et
 * le rejeu à l'identique.
 */
load('tests/lecon-pc-grandeurs-decor.js');
var H = monter('lessons/pc/5eme/masse.js');
var L = H.lecon, board = H.board;
var err = [];
function ko(m) { if (err.length < 25 && err.indexOf(m) < 0) err.push(m); }

if (L.matiere !== 'pc' || L.category !== 'chimie' || L.level !== '5eme') ko('la leçon doit être en physique-chimie (pc), domaine chimie, niveau 5ème');
if (!L.exercices || L.exercices.indexOf('pc-masse') < 0) ko('la leçon doit mener aux exercices pc-masse');
if (avertissements.length) ko('le moteur se plaint de la déclaration : ' + avertissements[0]);
if (H.erreurSetup) ko('setup() plante : ' + H.erreurSetup);

/* La géométrie, telle que la figure l'expose. */
var PIVOT_X = -4.3, TABLE = { x0: 0.6, w: 0.7, yHaut: 5.6, yMilieu: 4.85, yBas: 3.95 }, NCOL = 10;
var EN_G = { t: 1e6, kg: 1000, hg: 100, dag: 10, g: 1, dg: 0.1, cg: 0.01, mg: 0.001 };
var OBJETS = { 'un comprimé': 0.5, 'un trombone': 1, 'une pièce de 2 €': 8.5, 'une pomme': 150, 'une plaquette de beurre': 250,
               'un paquet de farine': 1000, 'un dictionnaire': 1200, 'une bouteille d\'eau pleine (1,5 L)': 1500, 'une voiture': 1200000 };
var UNITES_CIBLES = { 'tonnes': 't', 'kilogrammes': 'kg', 'grammes': 'g', 'milligrammes': 'mg' };

var chips = H.chips();
if (chips.length !== 13) ko('neuf objets et quatre unités attendus, ' + chips.length + ' pastilles');
Object.keys(OBJETS).forEach(function (n) { if (!H.chip(n)) ko('pas de pastille « ' + n + ' »'); });
Object.keys(UNITES_CIBLES).forEach(function (n) { if (!H.chip(n)) ko('pas de pastille « ' + n + ' »'); });
if (!H.controle('peser') || !H.controle('reset')) ko('il manque un bouton (peser, reset)');
if (!H.steps || H.steps.length !== 6) ko('au chargement, la pomme doit être prête : 6 étapes (objet, 100 g, 50 g, lecture, tableau, glisse), ' + (H.steps ? H.steps.length : 'aucune'));
if (!H.parClasse('props-panel').length) ko('le panneau manque');

/* ------------------------------------------------------------------ */
/* Lecture de la figure                                                */
/* ------------------------------------------------------------------ */
function fleau() {
  var G = null, D = null;
  board.objectsList.forEach(function (o) {
    if (o.elType === 'segment' && o.visProp.strokewidth === 4 && o.point1 && o.point2) { G = o.point1; D = o.point2; }
  });
  return G && D ? { gauche: G.Y(), droite: D.Y(), penche: G.Y() - D.Y() } : null;
}
// Les étiquettes des masses marquées : à droite du pivot, sous le fléau, de la forme « 500 g ».
function marquees() {
  return H.textes().filter(function (t) { return t.x > PIVOT_X && t.x < 0 && t.y < 2 && /^[\d ,]+ (kg|g|mg)$/.test(t.t); })
    .map(function (t) { var m = /^([\d ,]+) (kg|g|mg)$/.exec(t.t); return lireNombre(m[1]) * EN_G[m[2]]; });
}
function lecture() { return H.textes().filter(function (t) { return t.y < -3 && t.x < 0; }).map(function (t) { return t.t; }).join(' | '); }
function enTete() {
  var u = [];
  H.textes().forEach(function (t) {
    if (t.y > TABLE.yMilieu && t.y < TABLE.yHaut && t.x > TABLE.x0 && t.x < TABLE.x0 + NCOL * TABLE.w) u[Math.floor((t.x - TABLE.x0) / TABLE.w)] = t.t;
  });
  return u;
}
// Le nombre écrit dans le tableau : { valeur, unite } ou null.
function tableau() {
  var cells = [], virgule = null, unites = enTete();
  H.textes().forEach(function (t) {
    if (t.x < TABLE.x0 - 0.05 || t.x > TABLE.x0 + NCOL * TABLE.w + 0.05) return;
    if (t.t === ',' && t.y < TABLE.yBas + 0.4 && t.y > TABLE.yBas) virgule = Math.round((t.x - TABLE.x0) / TABLE.w) - 1;
    else if (t.y > TABLE.yBas && t.y < TABLE.yMilieu && /^\d$/.test(t.t)) cells[Math.floor((t.x - TABLE.x0) / TABLE.w)] = { c: t.t, col: String(t.o.visProp.strokecolor) };
  });
  var n = 0; for (var i = 0; i < NCOL; i++) if (cells[i]) n++;
  if (!n && virgule === null) return null;
  if (virgule === null || !unites[virgule]) return { illisible: 'virgule ' + virgule };
  var gauche = NCOL, droite = -1;
  for (i = 0; i < NCOL; i++) if (cells[i]) { gauche = Math.min(gauche, i); droite = Math.max(droite, i); }
  for (i = gauche; i <= droite; i++) if (!cells[i]) return { illisible: 'un trou dans les chiffres' };
  if (virgule < gauche || virgule > droite) return { illisible: 'la virgule est hors des chiffres' };
  var s = '';
  for (i = gauche; i <= droite; i++) s += cells[i].c + (i === virgule && i < droite ? '.' : '');
  var ajoutes = 0; for (i = 0; i < NCOL; i++) if (cells[i] && cells[i].col === '#c2410c') ajoutes++;
  return { valeur: parseFloat(s), unite: unites[virgule], texte: s.replace('.', ','), ajoutes: ajoutes, n: n };
}
function egalite() { return H.textes().filter(function (t) { return t.x > 0 && t.y > 2 && t.y < 3 && / = /.test(t.t); })[0]; }
function facteur() { return H.textes().filter(function (t) { return t.x > 0 && t.y > 3 && t.y < 3.5 && /^[×÷] /.test(t.t); })[0]; }
function uniteNaturelle(m) { return m >= 1e6 ? 't' : m >= 1000 ? 'kg' : m < 1 ? 'mg' : 'g'; }
function cibleParDefaut(u) { return u === 'g' ? 'kg' : u === 'kg' ? 'g' : u === 'mg' ? 'g' : 'kg'; }
function instantane() { return JSON.stringify(H.textes().map(function (t) { return [t.t, +t.x.toFixed(4), +t.y.toFixed(4)]; })); }

/* ------------------------------------------------------------------ */
/* 1. Chaque objet, pesé et converti dans son unité par défaut         */
/* ------------------------------------------------------------------ */
var joues = 0;
function controler(nom, m, cible) {
  var u0 = uniteNaturelle(m), lourd = m >= 1e6;
  if (!H.steps) { ko(nom + ' : aucune étape'); return; }
  try {
    H.jouer(0);
    var f = fleau();
    if (!f) { ko(nom + ' : fléau introuvable'); return; }
    if (Math.abs(f.penche) > 1e-9) ko(nom + ' : au repos le fléau doit être horizontal');
    if (marquees().length) ko(nom + ' : au repos, aucune masse marquée');
    if (tableau()) ko(nom + ' : au repos, le tableau doit être vide');
    var n = H.steps.length, k = lourd ? 0 : n - 4;
    if (lourd && n !== 3) ko(nom + ' : trois étapes attendues (trop lourd, tableau, glisse), ' + n);
    if (!lourd && k < 1) ko(nom + ' : il faut au moins une masse marquée (' + n + ' étapes)');
    var i;
    if (!lourd) {
      // l'objet seul : la gauche descend
      H.remiseAZero(); H.steps[0].step(0.5); board.update(); H.sain(nom + ' (objet à mi-course)', ko);
      H.jouer(1);
      f = fleau();
      if (!(f.penche < -0.3)) ko(nom + ' : l\'objet seul doit faire descendre le plateau de gauche (écart ' + f.penche.toFixed(3) + ')');
      if (marquees().length) ko(nom + ' : pas encore de masse marquée');
      var prec = f.penche, somme = 0;
      for (i = 1; i <= k; i++) {
        H.remiseAZero(); for (var j = 0; j < i; j++) { H.steps[j].step(1); if (H.steps[j].after) H.steps[j].after(); } H.steps[i].step(0.5); board.update(); H.sain(nom + ' (masse ' + i + ' à mi-course)', ko);
        H.jouer(i + 1);
        var ms = marquees();
        if (ms.length !== i) { ko(nom + ' : après ' + i + ' masse(s) posée(s), ' + ms.length + ' étiquette(s) lisible(s)'); break; }
        for (j = 1; j < ms.length; j++) if (ms[j] > ms[j - 1] + 1e-9) ko(nom + ' : les masses marquées se posent de la plus grosse à la plus petite');
        somme = ms.reduce(function (s, v) { return s + v; }, 0);
        if (somme > m + 1e-9) ko(nom + ' : les masses marquées (' + somme + ' g) dépassent l\'objet (' + m + ' g)');
        f = fleau();
        if (i < k) {
          if (!(f.penche > prec - 1e-9)) ko(nom + ' : chaque masse posée doit remonter le plateau de gauche');
          if (!(f.penche < -1e-6)) ko(nom + ' : la gauche doit rester en bas tant qu\'il manque des masses (' + somme + ' / ' + m + ')');
        } else {
          if (Math.abs(somme - m) > 1e-9) ko(nom + ' : la somme des masses marquées (' + somme + ' g) devrait valoir ' + m + ' g');
          if (Math.abs(f.penche) > 1e-9) ko(nom + ' : à l\'équilibre, le fléau doit être horizontal (écart ' + f.penche.toFixed(4) + ')');
        }
        prec = f.penche;
        if (i < k && !/manque/.test(H.panneau())) ko(nom + ' : le panneau doit dire ce qu\'il manque');
      }
      H.jouer(k + 2);   // lecture
      var lu = /m = ([\d ,]+) (t|kg|g|mg)/.exec(lecture());
      if (!lu) ko(nom + ' : la lecture « m = … » manque (' + lecture() + ')');
      else {
        if (lu[2] !== u0) ko(nom + ' : la lecture devrait être en ' + u0 + ', elle est en ' + lu[2]);
        if (Math.abs(lireNombre(lu[1]) * EN_G[lu[2]] - m) > 1e-9) ko(nom + ' : lecture « ' + lu[0] + ' », attendu ' + m + ' g');
      }
      if (!/Équilibre/.test(H.panneau())) ko(nom + ' : le panneau doit annoncer l\'équilibre');
    } else {
      H.jouer(1);
      if (marquees().length) ko(nom + ' : pas de masse marquée pour une voiture');
      if (!/1,2 t/.test(lecture())) ko(nom + ' : le pont-bascule doit indiquer 1,2 t (' + lecture() + ')');
      if (!/tonne/.test(H.panneau())) ko(nom + ' : le panneau doit parler de la tonne');
    }
    // le tableau, dans l'unité de départ
    H.jouer(n - 1);
    var tb = tableau();
    if (!tb || tb.illisible) ko(nom + ' : tableau illisible après l\'écriture (' + (tb ? tb.illisible : 'vide') + ')');
    else {
      if (tb.unite !== u0) ko(nom + ' : la virgule devrait être derrière la colonne ' + u0 + ', elle est derrière ' + tb.unite);
      if (Math.abs(tb.valeur * EN_G[tb.unite] - m) > 1e-9) ko(nom + ' : le tableau dit ' + tb.texte + ' ' + tb.unite + ', attendu ' + m + ' g');
      if (tb.ajoutes) ko(nom + ' : pas de zéro ajouté avant le glissement');
    }
    if (facteur()) ko(nom + ' : pas de facteur avant le glissement');
    var eg = egalite();
    if (eg) ko(nom + ' : pas d\'égalité avant le glissement (' + eg.t + ')');
    // à mi-glissement : la virgule bouge, rien ne casse
    H.remiseAZero(); for (i = 0; i < n - 1; i++) { H.steps[i].step(1); if (H.steps[i].after) H.steps[i].after(); } H.steps[n - 1].step(0.5); board.update(); H.sain(nom + ' (glissement)', ko);
    // le tableau, dans l'unité d'arrivée
    H.jouer(n);
    tb = tableau();
    if (!tb || tb.illisible) ko(nom + ' : tableau illisible après le glissement (' + (tb ? tb.illisible : 'vide') + ')');
    else {
      if (tb.unite !== cible) ko(nom + ' : la virgule devrait finir derrière ' + cible + ', elle est derrière ' + tb.unite);
      if (Math.abs(tb.valeur * EN_G[tb.unite] - m) > 1e-9) ko(nom + ' : converti, le tableau dit ' + tb.texte + ' ' + tb.unite + ', attendu ' + m + ' g');
      var attenduTxt = (m / EN_G[cible]).toFixed(9).replace('.', ',');
      // « 0,150 kg » garde le zéro des unités de 150 g : on compare sans les zéros de queue
      function nu(t) { return t.replace(/^0+(?=\d)/, '').replace(/(,\d*?)0+$/, '$1').replace(/,$/, ''); }
      if (nu(tb.texte) !== nu(attenduTxt)) ko(nom + ' : le tableau écrit ' + tb.texte + ' ' + cible + ', attendu ' + attenduTxt);
    }
    var sauts = Math.round(Math.log10(EN_G[u0] / EN_G[cible]));
    var fa = facteur();
    if (!sauts) {
      // déjà dans la bonne unité : rien à convertir, et on le dit
      if (fa) ko(nom + ' : pas de facteur quand l\'unité ne change pas');
      if (egalite()) ko(nom + ' : pas d\'égalité quand l\'unité ne change pas');
      if (!/déjà/.test(H.panneau())) ko(nom + ' : le panneau doit dire que c\'est déjà l\'unité demandée');
      joues += n;
      return;
    }
    if (!fa) ko(nom + ' : le facteur du saut manque');
    else {
      var fm = /^([×÷]) ([\d ]+)$/.exec(fa.t);
      if (!fm) ko(nom + ' : facteur illisible « ' + fa.t + ' »');
      else {
        var attenduF = (sauts > 0 ? '×' : '÷') + ' ' + Math.pow(10, Math.abs(sauts));
        if (fm[1] + ' ' + lireNombre(fm[2]) !== attenduF) ko(nom + ' : facteur « ' + fa.t + ' », attendu ' + attenduF);
      }
    }
    eg = egalite();
    if (!eg) ko(nom + ' : l\'égalité manque');
    else {
      var em = /^([\d ,]+) (t|kg|g|mg) = ([\d ,]+) (t|kg|g|mg)$/.exec(eg.t);
      if (!em) ko(nom + ' : égalité illisible « ' + eg.t + ' »');
      else {
        if (em[2] !== u0 || em[4] !== cible) ko(nom + ' : l\'égalité va de ' + em[2] + ' à ' + em[4] + ', attendu ' + u0 + ' → ' + cible);
        if (Math.abs(lireNombre(em[1]) * EN_G[em[2]] - m) > 1e-9 || Math.abs(lireNombre(em[3]) * EN_G[em[4]] - m) > 1e-9) ko(nom + ' : égalité fausse « ' + eg.t + ' »');
      }
    }
    var p = H.panneau();
    if (p.indexOf('virgule') < 0 || p.indexOf(cible) < 0) ko(nom + ' : le panneau doit parler de la virgule et de l\'unité ' + cible);
    if (sauts < 0 && !/divise|plus petit/.test(p)) ko(nom + ' : vers une unité plus grande, le panneau doit dire que le nombre devient plus petit');
    if (sauts > 0 && !/davantage|multipli/.test(p)) ko(nom + ' : vers une unité plus petite, le panneau doit dire qu\'il en faut davantage');
    joues += n;
  } catch (ex) { ko(nom + ' : ' + ex + (ex.stack ? ' — ' + String(ex.stack).split('\n')[0] : '')); }
}
if (!err.length) {
  Object.keys(OBJETS).forEach(function (nomObjet) {
    H.chip(nomObjet).onclick();
    controler(nomObjet, OBJETS[nomObjet], cibleParDefaut(uniteNaturelle(OBJETS[nomObjet])));
  });
}

/* ------------------------------------------------------------------ */
/* 2. Les quatre unités d'arrivée, sur la pomme et sur la bouteille    */
/* ------------------------------------------------------------------ */
if (!err.length) {
  [['une pomme', 150], ['une bouteille d\'eau pleine (1,5 L)', 1500], ['un comprimé', 0.5]].forEach(function (o) {
    Object.keys(UNITES_CIBLES).forEach(function (nomU) {
      H.chip(o[0]).onclick();
      H.chip(nomU).onclick();
      controler(o[0] + ' en ' + nomU, o[1], UNITES_CIBLES[nomU]);
      if (H.chip(nomU).className.indexOf('active') < 0) ko('la pastille « ' + nomU + ' » doit être active');
    });
  });
}

/* ------------------------------------------------------------------ */
/* 3. Rejouer redonne la même figure ; réinitialiser la vide           */
/* ------------------------------------------------------------------ */
if (!err.length) {
  H.chip('un dictionnaire').onclick(); H.jouer(H.steps.length);
  var a = instantane();
  H.chip('un trombone').onclick(); H.jouer(H.steps.length);
  H.chip('un dictionnaire').onclick(); H.jouer(H.steps.length);
  if (a !== instantane()) ko('rejouer la pesée du dictionnaire ne redonne pas la même figure');
  H.controle('reset').onClick();
  if (H.steps) ko('réinitialiser doit annuler l\'animation');
  if (marquees().length || tableau() || lecture()) ko('réinitialiser doit vider la balance et le tableau');
  if (Math.abs(fleau().penche) > 1e-9) ko('réinitialisé, le fléau est horizontal');
}

if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('LE FLÉAU PENCHE AVEC L\'ÉCART, LES MASSES MARQUÉES FONT LA MASSE, LE TABLEAU DIT LE MÊME NOMBRE DANS LES DEUX UNITÉS (' + joues + ' ÉTAPES JOUÉES)');
