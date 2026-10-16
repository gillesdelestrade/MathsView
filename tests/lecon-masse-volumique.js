/*
 * La leçon « La masse volumique » (5ème, physique-chimie), montée avec le
 * VRAI JSXGraph (renderer « no »).
 *
 * Trois volets, tout refait à côté. LES FORMULES : le triangle se trace (à
 * mi-course, la moitié de sa longueur), la lettre cachée est celle que la
 * pastille annonce, le « ? » est posé à sa place, la formule lue est la
 * bonne, et le calcul affiché est refait depuis les données de la figure —
 * l'opération, le résultat et l'unité qui en découle. LES UNITÉS : les
 * données sont relues dans la figure, l'unité choisie pour ρ doit être l'une
 * des quatre lignes du tableau, la ligne surlignée doit être la sienne, le
 * verdict « même ligne / pas la même ligne » est retrouvé dans le tableau, la
 * conversion annoncée est recalculée par une table de facteurs, et le
 * quotient divise les valeurs converties — jamais les valeurs brutes quand
 * les unités ne vont pas ensemble. FLOTTE OU COULE : la position finale du
 * bloc est confrontée à ρ (enfoncé d'une fraction ρ si ρ < 1, posé au fond
 * sinon ; une couche au-dessus de l'eau ou au fond pour un liquide, qui
 * soulève l'eau), le verdict suit le signe de ρ − 1, et la marque sur l'axe
 * est relue d'après ses graduations. Et le rejeu à l'identique.
 */
load('tests/lecon-pc-grandeurs-decor.js');
var H = monter('lessons/pc/5eme/masse-volumique.js');
var L = H.lecon, board = H.board;
var err = [];
function ko(m) { if (err.length < 25 && err.indexOf(m) < 0) err.push(m); }

if (L.matiere !== 'pc' || L.category !== 'chimie' || L.level !== '5eme') ko('la leçon doit être en physique-chimie (pc), domaine chimie, niveau 5ème');
if (!L.exercices || L.exercices.indexOf('pc-masse-volumique') < 0) ko('la leçon doit mener aux exercices pc-masse-volumique');
if (avertissements.length) ko('le moteur se plaint de la déclaration : ' + avertissements[0]);
if (H.erreurSetup) ko('setup() plante : ' + H.erreurSetup);
if (!H.controle('rejouer') || !H.controle('reset')) ko('il manque un bouton (rejouer, reset)');
if (!H.parClasse('props-panel').length) ko('le panneau manque');

/* ------------------------------------------------------------------ */
/* Lecture de la figure                                                */
/* ------------------------------------------------------------------ */
function vis(o) { var v = o.visProp.visible; return typeof v === 'function' ? v() : !!v; }
function chipsDe(cls) {
  var r = H.parClasse(cls)[0];
  return r ? r.children.filter(function (c) { return (c.className || '').split(' ').indexOf('ineq-preset') >= 0; }) : [];
}
function texte(re, filtre) { return H.textes().filter(function (t) { return re.test(t.t) && (!filtre || filtre(t)); }); }
function unTexte(re, filtre) { var t = texte(re, filtre); return t.length ? t[0].t : ''; }
function courbes(filtre) {
  var out = [];
  board.objectsList.forEach(function (o) { if (o.elType === 'curve' && vis(o) && o.dataX && !isNaN(o.dataX[0]) && filtre(o)) out.push(o); });
  return out;
}
function boite(c) { var xs = c.dataX.filter(isFinite), ys = c.dataY.filter(isFinite); return { x1: Math.min.apply(null, xs), x2: Math.max.apply(null, xs), y1: Math.min.apply(null, ys), y2: Math.max.apply(null, ys) }; }
function longueurPolyligne(c) {
  var l = 0;
  for (var i = 1; i < c.dataX.length; i++) {
    if (isNaN(c.dataX[i]) || isNaN(c.dataX[i - 1])) continue;
    l += Math.sqrt(Math.pow(c.dataX[i] - c.dataX[i - 1], 2) + Math.pow(c.dataY[i] - c.dataY[i - 1], 2));
  }
  return l;
}
function instantane() { return JSON.stringify(H.textes().map(function (t) { return [t.t, +t.x.toFixed(4), +t.y.toFixed(4)]; })); }
function proche(a, b, eps) { return Math.abs(a - b) <= (eps || 1e-6); }
function etat(nom) { if (!H.steps) { ko(nom + ' : pas d\'étapes'); return false; } return true; }

var volets = chipsDe('mv-volets');
if (volets.length !== 3) ko('trois volets attendus, ' + volets.length + ' pastilles');
var joues = 0;

/* ------------------------------------------------------------------ */
/* 1. Les formules : le triangle, la lettre cachée, le calcul refait   */
/* ------------------------------------------------------------------ */
var FORMULE = { 'ρ': 'ρ = m ÷ V', m: 'm = ρ × V', V: 'V = m ÷ ρ' };
var LECTURE = { 'ρ': 'm au-dessus de V', m: 'ρ et V côte à côte', V: 'm au-dessus de ρ' };
var N = '([\\d ,]+)';
function lettres() { return texte(/^(m|ρ|V)$/, function (t) { return t.x < 0; }); }
if (!err.length) {
  volets[0].onclick();
  var chF = chipsDe('mv-choix-formules');
  if (chF.length !== 6) ko('six exemples attendus au volet des formules, ' + chF.length + ' pastilles');
  var vus = { 'ρ': 0, m: 0, V: 0 };
  chF.forEach(function (chip) {
    var lab = /^(ρ|m|V) = \? · (.+)$/.exec(chip.textContent || '');
    if (!lab) { ko('pastille illisible « ' + chip.textContent + ' » : attendu « lettre = ? · objet »'); return; }
    var cherche = lab[1], nom = lab[2];
    vus[cherche]++;
    chip.onclick();
    if (!etat(nom)) return;
    if (H.steps.length !== 3) { ko(nom + ' : trois étapes attendues (triangle, cache, calcul)'); return; }
    if (chip.className.indexOf('active') < 0) ko(nom + ' : la pastille doit être active');
    try {
      // au repos : le triangle entier, les trois lettres, pas de cache
      H.jouer(0);
      if (lettres().length !== 3) ko(nom + ' : au repos, les trois lettres m, ρ, V');
      if (texte(/^\?$/).length) ko(nom + ' : au repos, pas de « ? »');
      var entier = courbes(function (o) { return o.visProp.strokewidth === 2.5 && boite(o).x2 < 0; });
      if (entier.length !== 1) { ko(nom + ' : le triangle est introuvable (' + entier.length + ' courbes)'); return; }
      var LTOT = longueurPolyligne(entier[0]);
      // à mi-course, le triangle est tracé à moitié
      H.remiseAZero(); H.steps[0].step(0.5); board.update(); H.sain(nom + ' (triangle, mi-course)', ko);
      var moitie = courbes(function (o) { return o.visProp.strokewidth === 2.5 && boite(o).x2 < 0; });
      if (moitie.length !== 1 || !proche(longueurPolyligne(moitie[0]), LTOT / 2, 1e-6)) ko(nom + ' : à mi-course le triangle doit être tracé à moitié');
      if (lettres().length) ko(nom + ' : les lettres attendent la fin du tracé');
      H.jouer(1);
      var positions = {};
      lettres().forEach(function (t) { positions[t.t] = [t.x, t.y]; });
      if (Object.keys(positions).length !== 3) ko(nom + ' : après le tracé, les trois lettres');
      if (!(positions.m && positions['ρ'] && positions.V && positions.m[1] > positions['ρ'][1] && positions.m[1] > positions.V[1] && proche(positions['ρ'][1], positions.V[1]) && positions['ρ'][0] < positions.V[0]))
        ko(nom + ' : m doit être en haut, ρ et V en bas côte à côte (ρ à gauche)');
      if (!/Le triangle/.test(H.panneau())) ko(nom + ' : le panneau doit présenter le triangle');
      // le cache : la lettre cherchée disparaît, un « ? » prend sa place
      H.jouer(2);
      var restantes = lettres().map(function (t) { return t.t; });
      if (restantes.indexOf(cherche) >= 0) ko(nom + ' : la lettre cherchée (' + cherche + ') doit être cachée');
      if (restantes.length !== 2) ko(nom + ' : les deux autres lettres restent visibles');
      var q = texte(/^\?$/);
      if (q.length !== 1) ko(nom + ' : un « ? » sur la lettre cachée');
      else if (!proche(q[0].x, positions[cherche][0], 1e-6) || !proche(q[0].y, positions[cherche][1], 1e-6)) ko(nom + ' : le « ? » doit être à la place de ' + cherche);
      var cacheBoite = courbes(function (o) { return o.visProp.fillcolor === '#64748b'; });
      if (cacheBoite.length !== 1) ko(nom + ' : la boîte du cache manque');
      else { var cb = boite(cacheBoite[0]); if (!(cb.x1 < positions[cherche][0] && positions[cherche][0] < cb.x2 && cb.y1 < positions[cherche][1] && positions[cherche][1] < cb.y2)) ko(nom + ' : la boîte du cache doit couvrir ' + cherche); }
      if (unTexte(/^donc /) !== 'donc ' + FORMULE[cherche]) ko(nom + ' : le triangle doit donner « donc ' + FORMULE[cherche] + ' » (' + unTexte(/^donc /) + ')');
      if (H.panneau().indexOf(LECTURE[cherche]) < 0 || H.panneau().indexOf(FORMULE[cherche]) < 0) ko(nom + ' : le panneau doit lire « ' + LECTURE[cherche] + ' », donc ' + FORMULE[cherche]);
      // le calcul, refait depuis les données
      H.jouer(3);
      var d = /^Données : (.+)$/.exec(unTexte(/^Données : /));
      if (!d) { ko(nom + ' : les données manquent'); return; }
      var donnees = {};
      d[1].split(' et ').forEach(function (p) {
        var m = new RegExp('^(ρ|m|V) = ' + N + ' (.+)$').exec(p);
        if (m) donnees[m[1]] = { v: lireNombre(m[2]), u: m[3] }; else ko(nom + ' : donnée illisible « ' + p + ' »');
      });
      if (donnees[cherche]) ko(nom + ' : ' + cherche + ' est ce qu\'on cherche, pas une donnée');
      if (Object.keys(donnees).length !== 2) ko(nom + ' : deux données attendues');
      var c = new RegExp('^(ρ|m|V) = ' + N + ' (÷|×) ' + N + ' = ' + N + ' (.+)$').exec(unTexte(/^(ρ|m|V) = [\d ,]+ (÷|×)/));
      if (!c) { ko(nom + ' : le calcul « lettre = a op b = r unité » manque'); return; }
      if (c[1] !== cherche) ko(nom + ' : le calcul doit donner ' + cherche + ', pas ' + c[1]);
      var a = lireNombre(c[2]), op = c[3], bb = lireNombre(c[4]), r = lireNombre(c[5]), u = c[6];
      var attendu = cherche === 'ρ' ? { a: donnees.m, b: donnees.V, op: '÷', u: donnees.m.u + '/' + donnees.V.u }
                  : cherche === 'm' ? { a: donnees['ρ'], b: donnees.V, op: '×', u: donnees['ρ'].u.split('/')[0] }
                  : { a: donnees.m, b: donnees['ρ'], op: '÷', u: donnees['ρ'].u.split('/')[1] };
      if (!attendu.a || !attendu.b) return;
      if (a !== attendu.a.v || bb !== attendu.b.v || op !== attendu.op) ko(nom + ' : le calcul fait ' + a + ' ' + op + ' ' + bb + ', attendu ' + attendu.a.v + ' ' + attendu.op + ' ' + attendu.b.v);
      var exact = op === '÷' ? a / bb : a * bb;
      if (!proche(r, exact, 1e-6)) ko(nom + ' : ' + a + ' ' + op + ' ' + bb + ' = ' + exact + ', pas ' + r);
      if (u !== attendu.u) ko(nom + ' : l\'unité du résultat doit être ' + attendu.u + ' (' + u + ')');
      if (cherche === 'm' && donnees['ρ'].u.split('/')[1] !== donnees.V.u) ko(nom + ' : l\'unité de volume de ρ doit être celle de V');
      if (cherche === 'V' && donnees['ρ'].u.split('/')[0] !== donnees.m.u) ko(nom + ' : l\'unité de masse de ρ doit être celle de m');
      if (H.panneau().indexOf(c[0]) < 0) ko(nom + ' : le panneau doit reprendre le calcul');
      joues += 3;
    } catch (ex) { ko(nom + ' : ' + ex + (ex.stack ? ' — ' + String(ex.stack).split('\n')[0] : '')); }
  });
  if (vus['ρ'] < 2 || vus.m < 2 || vus.V < 2) ko('deux exemples par lettre cherchée (ρ, m, V)');
}

/* ------------------------------------------------------------------ */
/* 2. Les unités : le tableau, la ligne choisie, la conversion refaite */
/* ------------------------------------------------------------------ */
var MASSE_G = { g: 1, kg: 1000 }, VOL_ML = { mL: 1, 'cm³': 1, cL: 10, dL: 100, L: 1000, 'dm³': 1000 };
if (!err.length) {
  volets[1].onclick();
  var chU = chipsDe('mv-choix-unites');
  if (chU.length !== 6) ko('six situations attendues au volet des unités, ' + chU.length + ' pastilles');
  H.jouer(0);
  // le tableau des couples, relu dans la figure : à gauche, une masse, un volume, et ρ sur chaque ligne
  var lignes = {};
  texte(/^(g|kg)\/(cm³|mL|dm³|L)$/, function (t) { return t.x < 0; }).forEach(function (t) {
    var um = texte(/^(g|kg)$/, function (s) { return s.x < t.x && proche(s.y, t.y); }), uv = texte(/^(cm³|mL|dm³|L)$/, function (s) { return s.x < t.x && proche(s.y, t.y); });
    if (um.length === 1 && uv.length === 1 && um[0].x < uv[0].x && t.t === um[0].t + '/' + uv[0].t) lignes[t.t] = { um: um[0].t, uv: uv[0].t, y: t.y };
    else ko('la ligne « ' + t.t + ' » du tableau doit porter sa masse puis son volume');
  });
  ['g/cm³', 'g/mL', 'kg/dm³', 'kg/L'].forEach(function (u) { if (!lignes[u]) ko('le tableau doit avoir la ligne ' + u); });
  function ligneDe(um, uv) { for (var u in lignes) if (lignes[u].um === um && lignes[u].uv === uv) return u; return null; }
  var directes = 0, converties = 0;
  chU.forEach(function (chip) {
    var lab = new RegExp('^(.+) : ' + N + ' (g|kg), ' + N + ' (mL|cm³|cL|dL|L|dm³)$').exec(chip.textContent || '');
    if (!lab) { ko('pastille illisible « ' + chip.textContent + ' » : attendu « objet : m u, V u »'); return; }
    var nom = lab[1], m = lireNombre(lab[2]), um = lab[3], V = lireNombre(lab[4]), uv = lab[5];
    chip.onclick();
    if (!etat(nom)) return;
    if (H.steps.length !== 4) { ko(nom + ' : quatre étapes attendues (données, unité, conversion, calcul)'); return; }
    try {
      H.jouer(0);
      if (texte(/^m = /).length || texte(/^ρ = /).length) ko(nom + ' : au repos, ni données ni calcul');
      // 1. les données, telles que la pastille les annonce
      H.remiseAZero(); H.steps[0].step(0.5); board.update(); H.sain(nom + ' (données, mi-course)', ko);
      H.jouer(1);
      if (unTexte(/^m = /) !== 'm = ' + lab[2] + ' ' + um) ko(nom + ' : la figure doit donner « m = ' + lab[2] + ' ' + um + ' » (' + unTexte(/^m = /) + ')');
      if (unTexte(/^V = /) !== 'V = ' + lab[4] + ' ' + uv) ko(nom + ' : la figure doit donner « V = ' + lab[4] + ' ' + uv + ' »');
      if (texte(/^ρ sera en/).length) ko(nom + ' : l\'unité de ρ attend l\'étape suivante');
      // 2. l'unité de ρ : une des quatre lignes, surlignée ; le verdict retrouvé dans le tableau
      H.jouer(2);
      var direct = ligneDe(um, uv);
      var choix = /^ρ sera en (\S+)/.exec(unTexte(/^ρ sera en /));
      if (!choix) { ko(nom + ' : « ρ sera en … » manque'); return; }
      var ur = choix[1];
      if (!lignes[ur]) ko(nom + ' : ' + ur + ' n\'est pas une ligne du tableau');
      var surlignes = courbes(function (o) { return o.visProp.fillcolor === '#fdba74'; });
      if (surlignes.length !== 1) ko(nom + ' : une ligne surlignée attendue (' + surlignes.length + ')');
      else if (lignes[ur]) { var sb = boite(surlignes[0]); if (!(sb.y1 < lignes[ur].y && lignes[ur].y < sb.y2)) ko(nom + ' : la ligne surlignée doit être celle de ' + ur); }
      var verdict = unTexte(/même ligne/);
      if (direct) {
        if (!/✓/.test(verdict) || /pas sur/.test(verdict)) ko(nom + ' : ' + um + ' et ' + uv + ' vont ensemble, le verdict doit être ✓ (' + verdict + ')');
        if (ur !== direct) ko(nom + ' : ' + um + ' et ' + uv + ' vont ensemble, ρ doit être en ' + direct);
        if (!/rien à convertir/.test(unTexte(/^ρ sera en /))) ko(nom + ' : rien à convertir quand les unités vont ensemble');
        directes++;
      } else {
        if (!/✗/.test(verdict) || !/pas sur la même ligne/.test(verdict)) ko(nom + ' : ' + um + ' et ' + uv + ' ne vont pas ensemble, le verdict doit être ✗ (' + verdict + ')');
        if (!/je convertis (la masse|le volume) en /.test(unTexte(/^ρ sera en /))) ko(nom + ' : il faut annoncer ce qu\'on convertit');
        converties++;
      }
      if (!/même ligne/.test(H.panneau())) ko(nom + ' : le panneau doit parler de la ligne du tableau');
      // 3. la conversion, refaite par la table des facteurs
      H.jouer(3);
      var mConv = { v: m, u: um }, VConv = { v: V, u: uv };
      var conv = unTexte(/^(rien à convertir|[\d ,]+ \S+ = [\d ,]+ \S+)/, function (t) { return t.x > 0; });
      if (direct) {
        if (conv !== 'rien à convertir') ko(nom + ' : rien à convertir (' + conv + ')');
      } else {
        var cv = new RegExp('^' + N + ' (\\S+) = ' + N + ' (\\S+)\\s+\\((× [\\d ]+)\\)$').exec(conv);
        if (!cv) { ko(nom + ' : la conversion « a u1 = b u2 (× k) » manque (' + conv + ')'); return; }
        var a = lireNombre(cv[1]), u1 = cv[2], bb = lireNombre(cv[3]), u2 = cv[4], k = lireNombre(cv[5].replace('× ', ''));
        var table = MASSE_G[u1] !== undefined ? MASSE_G : VOL_ML;
        if (table[u1] === undefined || table[u2] === undefined) ko(nom + ' : unités de conversion inconnues (' + u1 + ' → ' + u2 + ')');
        else {
          if (!proche(a * table[u1], bb * table[u2], 1e-6 * Math.max(1, bb * table[u2]))) ko(nom + ' : ' + a + ' ' + u1 + ' ≠ ' + bb + ' ' + u2);
          if (!proche(k, table[u1] / table[u2], 1e-9)) ko(nom + ' : le facteur annoncé (× ' + k + ') n\'est pas ' + table[u1] / table[u2]);
        }
        if (table === MASSE_G) { if (a !== m || u1 !== um) ko(nom + ' : on convertit la masse de l\'énoncé'); mConv = { v: bb, u: u2 }; }
        else { if (a !== V || u1 !== uv) ko(nom + ' : on convertit le volume de l\'énoncé'); VConv = { v: bb, u: u2 }; }
        if (ligneDe(mConv.u, VConv.u) !== ur) ko(nom + ' : après conversion, ' + mConv.u + ' et ' + VConv.u + ' doivent être la ligne de ' + ur);
      }
      if (texte(/^ρ = /).length) ko(nom + ' : le calcul attend la dernière étape');
      // 4. le quotient divise les valeurs converties, dans l'unité choisie ; même nombre dans les trois autres
      H.jouer(4);
      var q = new RegExp('^ρ = ' + N + ' ÷ ' + N + ' = ' + N + ' (\\S+)$').exec(unTexte(/^ρ = /));
      if (!q) { ko(nom + ' : le quotient « ρ = m ÷ V = r unité » manque (' + unTexte(/^ρ = /) + ')'); return; }
      if (lireNombre(q[1]) !== mConv.v || lireNombre(q[2]) !== VConv.v) ko(nom + ' : le quotient divise ' + q[1] + ' par ' + q[2] + ', attendu les valeurs converties ' + mConv.v + ' ÷ ' + VConv.v);
      var r = lireNombre(q[3]);
      if (!proche(r, mConv.v / VConv.v, 1e-3)) ko(nom + ' : ' + mConv.v + ' ÷ ' + VConv.v + ' = ' + (mConv.v / VConv.v) + ', pas ' + r);
      if (q[4] !== ur) ko(nom + ' : le quotient doit être en ' + ur + ' (' + q[4] + ')');
      var gParMl = (m * MASSE_G[um]) / (V * VOL_ML[uv]);
      if (!proche(r, gParMl, 1e-3)) ko(nom + ' : ' + r + ' ' + ur + ' n\'est pas la masse volumique de l\'énoncé (' + gParMl + ' g/mL)');
      var autres = unTexte(/^[\d ,]+ (g\/cm³|g\/mL|kg\/dm³|kg\/L) = /, function (t) { return t.x > 0; });
      ['g/cm³', 'g/mL', 'kg/dm³', 'kg/L'].forEach(function (u) {
        if (u !== ur && autres.indexOf(q[3] + ' ' + u) < 0) ko(nom + ' : même nombre en ' + u + ' (' + autres + ')');
      });
      var pan = H.panneau();
      if (pan.indexOf(q[0]) < 0) ko(nom + ' : le panneau doit reprendre le quotient');
      if (!/mille fois/.test(pan)) ko(nom + ' : le panneau doit prévenir du piège g/L');
      var gl = new RegExp('en g/L, c\'est ' + N + '\\.').exec(pan);
      if (!gl || !proche(lireNombre(gl[1]), r * 1000, 1e-6)) ko(nom + ' : en g/L, c\'est ' + (r * 1000));
      joues += 4;
    } catch (ex) { ko(nom + ' : ' + ex + (ex.stack ? ' — ' + String(ex.stack).split('\n')[0] : '')); }
  });
  if (directes < 1 || converties < 3) ko('au moins trois situations à convertir et une où les unités vont déjà ensemble (' + converties + ' / ' + directes + ')');
}

/* ------------------------------------------------------------------ */
/* 3. Flotte ou coule : la position du bloc, le verdict, l'axe         */
/* ------------------------------------------------------------------ */
if (!err.length) {
  volets[2].onclick();
  var chO = chipsDe('mv-choix-flotte');
  if (chO.length < 8) ko('au moins huit objets attendus au volet flotte ou coule, ' + chO.length + ' pastilles');
  H.jouer(0);
  function eau() { var c = courbes(function (o) { return o.visProp.fillcolor === '#93c5fd'; }); return c.length === 1 ? boite(c[0]) : null; }
  function bloc() { var c = courbes(function (o) { return o.visProp.strokewidth === 1.8; }); return c.length === 1 ? boite(c[0]) : null; }
  var bassin = eau();
  if (!bassin) ko('l\'eau de l\'aquarium est introuvable');
  if (bloc()) ko('au repos, rien dans l\'aquarium');
  // l'axe des masses volumiques, d'après ses graduations
  var grad = texte(/^[\d,]+$/, function (t) { return t.x > 0 && t.x < 2; }).map(function (t) { return [lireNombre(t.t), t.y]; }).sort(function (a, c) { return a[0] - c[0]; });
  if (grad.length < 4) ko('les graduations de l\'axe sont illisibles');
  var pente = (grad[grad.length - 1][1] - grad[0][1]) / (grad[grad.length - 1][0] - grad[0][0]), origine = grad[0][1] - pente * grad[0][0];
  function rhoDeY(y) { return (y - origine) / pente; }
  var rhoMax = grad[grad.length - 1][0];
  function marque() { var p = null; board.objectsList.forEach(function (o) { if (o.elType === 'point' && vis(o) && o.visProp.size === 4) p = o; }); return p; }
  var ligneEau = texte(/^eau : 1$/);
  if (ligneEau.length !== 1 || !proche(rhoDeY(ligneEau[0].y - 0.25), 1, 0.05)) ko('la ligne de l\'eau doit être à ρ = 1 sur l\'axe');
  var solides = 0, liquides = 0, flottent = 0, coulent = 0;
  chO.forEach(function (chip, idx) {
    var lab = /^(.+) \(([\d,]+)\)$/.exec(chip.textContent || '');
    if (!lab) { ko('pastille illisible « ' + chip.textContent + ' » : attendu « nom (ρ) »'); return; }
    var nom = lab[1], rho = lireNombre(lab[2]);
    chip.onclick();
    if (!etat(nom)) return;
    if (H.steps.length !== 3) { ko(nom + ' : trois étapes attendues (comparer, plonger, verdict)'); return; }
    try {
      if (marque()) ko(nom + ' : la marque sur l\'axe attend le verdict');
      // 1. comparer : l'objet au-dessus de l'eau, avec sa masse volumique
      H.jouer(1);
      var b1 = bloc();
      if (!b1) { ko(nom + ' : l\'objet doit apparaître'); return; }
      if (b1.y1 < bassin.y2 - 1e-9) ko(nom + ' : avant de plonger, l\'objet est au-dessus de l\'eau');
      var S = b1.y2 - b1.y1;
      if (!proche(b1.x2 - b1.x1, S, 1e-9)) ko(nom + ' : l\'objet commence en bloc carré');
      if (!texte(new RegExp('^' + nom + ' : ' + lab[2] + ' g/cm³$')).length) ko(nom + ' : l\'étiquette « ' + nom + ' : ' + lab[2] + ' g/cm³ » manque');
      var cmp = unTexte(/que l'eau$/);
      if (rho < 1 && !/< 1 : moins dense/.test(cmp)) ko(nom + ' : ' + rho + ' < 1, moins dense que l\'eau (' + cmp + ')');
      if (rho > 1 && !/> 1 : plus dense/.test(cmp)) ko(nom + ' : ' + rho + ' > 1, plus dense que l\'eau (' + cmp + ')');
      if (H.panneau().indexOf(rho < 1 ? 'moins dense' : 'plus dense') < 0) ko(nom + ' : le panneau doit comparer à l\'eau');
      // 2. plonger : à mi-course l'objet descend ; à la fin, sa place dépend de ρ
      H.remiseAZero(); H.steps[0].step(1); H.steps[0].after(); H.steps[1].step(0.3); board.update(); H.sain(nom + ' (plongée, mi-course)', ko);
      var bm = bloc();
      if (!bm || bm.y1 >= b1.y1 - 1e-9) ko(nom + ' : pendant la plongée, l\'objet descend');
      H.jouer(2);
      var b2 = bloc(), e2 = eau();
      if (!b2 || !e2) { ko(nom + ' : l\'objet ou l\'eau manque après la plongée'); return; }
      var liquide = b2.x2 - b2.x1 > S + 1e-6;
      if (liquide) {
        liquides++;
        if (!proche(b2.x1, bassin.x1, 1e-6) || !proche(b2.x2, bassin.x2, 1e-6)) ko(nom + ' : un liquide s\'étale sur toute la largeur');
        if (rho < 1) {
          if (!proche(b2.y1, bassin.y2, 1e-6)) ko(nom + ' : moins dense, le liquide forme une couche sur l\'eau');
          if (!proche(e2.y1, bassin.y1, 1e-6) || !proche(e2.y2, bassin.y2, 1e-6)) ko(nom + ' : l\'eau ne bouge pas sous une couche flottante');
        } else {
          if (!proche(b2.y1, bassin.y1, 1e-6)) ko(nom + ' : plus dense, le liquide se dépose au fond');
          if (!proche(e2.y1, b2.y2, 1e-6) || !proche(e2.y2 - e2.y1, bassin.y2 - bassin.y1, 1e-6)) ko(nom + ' : l\'eau est soulevée par la couche du fond, sans changer de hauteur');
        }
      } else {
        solides++;
        if (!proche(b2.x1, b1.x1, 1e-9) || !proche(b2.y2 - b2.y1, S, 1e-9)) ko(nom + ' : un solide garde sa forme');
        if (rho < 1) {
          var enfonce = (bassin.y2 - b2.y1) / S;
          if (!proche(enfonce, rho, 1e-6)) ko(nom + ' : moins dense, le bloc s\'enfonce d\'une fraction ρ = ' + rho + ' (' + enfonce.toFixed(3) + ')');
        } else if (!proche(b2.y1, bassin.y1, 1e-6)) ko(nom + ' : plus dense, le bloc repose au fond');
        if (!proche(e2.y1, bassin.y1, 1e-6)) ko(nom + ' : l\'eau reste en place sous un solide');
      }
      if (texte(/^ça (flotte|coule) !$/).length) ko(nom + ' : le verdict attend la dernière étape');
      // 3. le verdict, et la marque sur l'axe
      H.jouer(3);
      var v = unTexte(/^ça (flotte|coule) !$/);
      if (rho < 1) { flottent++; if (v !== 'ça flotte !') ko(nom + ' : moins dense que l\'eau, ça flotte (' + v + ')'); }
      else { coulent++; if (v !== 'ça coule !') ko(nom + ' : plus dense que l\'eau, ça coule (' + v + ')'); }
      var p = marque();
      if (!p) ko(nom + ' : la marque sur l\'axe manque');
      else if (rho <= rhoMax) { if (!proche(rhoDeY(p.Y()), rho, 0.02)) ko(nom + ' : la marque est à ρ = ' + rhoDeY(p.Y()).toFixed(2) + ' sur l\'axe, attendu ' + rho); }
      else if (rhoDeY(p.Y()) < rhoMax) ko(nom + ' : hors échelle, la marque est au-dessus de la dernière graduation');
      var pan = H.panneau();
      if (rho < 1 && !/ça flotte/.test(pan)) ko(nom + ' : le panneau doit dire que ça flotte');
      if (rho > 1 && !/ça coule/.test(pan)) ko(nom + ' : le panneau doit dire que ça coule');
      if (!liquide && rho < 1 && pan.indexOf('s\'enfonce de ' + Math.round(rho * 100) + ' %') < 0) ko(nom + ' : le panneau doit donner l\'enfoncement, ' + Math.round(rho * 100) + ' %');
      if (liquide && !/couche|au fond/.test(pan)) ko(nom + ' : pour un liquide, le panneau parle de couche');
      joues += 3;
    } catch (ex) { ko(nom + ' : ' + ex + (ex.stack ? ' — ' + String(ex.stack).split('\n')[0] : '')); }
  });
  if (solides < 5 || liquides < 2) ko('au moins cinq solides et deux liquides (' + solides + ' / ' + liquides + ')');
  if (flottent < 3 || coulent < 3) ko('au moins trois objets qui flottent et trois qui coulent');
}

/* ------------------------------------------------------------------ */
/* 4. Rejouer redonne la même figure ; réinitialiser la vide           */
/* ------------------------------------------------------------------ */
if (!err.length) {
  var chO2 = chipsDe('mv-choix-flotte'), chF2 = chipsDe('mv-choix-formules');
  volets[2].onclick(); chO2[1].onclick(); H.jouer(3);
  var a = instantane();
  volets[0].onclick(); chF2[2].onclick(); H.jouer(3);
  volets[2].onclick(); chO2[1].onclick(); H.jouer(3);
  if (a !== instantane()) ko('rejouer le même objet ne redonne pas la même figure');
  H.controle('rejouer').onClick();
  if (!H.steps || H.steps.length !== 3) ko('« Rejouer » recharge les étapes du volet');
  H.controle('reset').onClick();
  if (H.steps) ko('réinitialiser doit annuler l\'animation');
  if (bloc() || texte(/^ça (flotte|coule) !$/).length) ko('réinitialiser doit vider l\'aquarium');
  if (volets[2].className.indexOf('active') < 0) ko('réinitialiser garde le volet courant');
  var reste = chO2.filter(function (c) { return c.className.indexOf('active') >= 0; });
  if (reste.length) ko('réinitialiser désactive la pastille de l\'objet');
}

if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('LE TRIANGLE DONNE LA BONNE FORMULE, LES UNITÉS SONT CONVERTIES AVANT DE DIVISER, LE BLOC FLOTTE OU COULE SELON ρ (' + joues + ' ÉTAPES JOUÉES)');
