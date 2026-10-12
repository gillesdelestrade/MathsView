/*
 * Les exercices « La masse et ses unités » (5ème, physique-chimie).
 *
 * Chaque masse de l'énoncé est relue avec son unité et ramenée en
 * milligrammes par une table tenue ici ; la conversion, la comparaison, la
 * décomposition (2 kg 350 g), la tare et le piège de la virgule sont refaits
 * à côté et confrontés à la réponse annoncée. La correction d'une conversion
 * doit compter les colonnes, dire si on multiplie ou si on divise, et poser
 * le calcul avec les nombres de l'énoncé. Les questions de notion sont
 * confrontées à une table du programme.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/pc/5eme/masse.js');
if (!G || G.id !== 'pc-masse') { print('ÉCHEC : le générateur ne s\'enregistre pas'); throw new Error('register'); }
if (G.level !== '5eme' || G.competence !== 'pc-masse') { print('ÉCHEC : niveau ou compétence inattendus'); throw new Error('decl'); }

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function vu(k) { vus[k] = (vus[k] || 0) + 1; }
function texte(s) { return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function num(s) { return parseFloat(String(s).replace(/[\s  ]/g, '').replace(',', '.')); }

var EN_MG = { t: 1e9, kg: 1e6, hg: 1e5, dag: 1e4, g: 1e3, dg: 100, cg: 10, mg: 1 };
var RANG = { t: 0, kg: 3, hg: 4, dag: 5, g: 6, dg: 7, cg: 8, mg: 9 };
var U = '(t|kg|hg|dag|g|dg|cg|mg)', N = '(\\d[\\d \\u202f]*(?:,\\d+)?)';   // texte() a ramené les espaces fines à des espaces
function milliers(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function mg(v, u) { return Math.round(num(v) * EN_MG[u]); }
function proche(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)); }

/* Le programme. */
var NOTION_QCM = [[/Que mesure la masse/, 'quantité de matière'], [/quel instrument/, 'balance'], [/unité légale/, 'kilogramme'], [/sur la Lune/, '70 kg'],
                  [/galette/, '50 g'], [/plumes ou 1 kg de plomb/, 'même masse'], [/glaçon de 40 g/, '40 g']];
var NOTION_VF = [[/Sur la Lune, la masse/, 1], [/100 g de glace/, 0], [/balance sert à mesurer le volume/, 1], [/même taille ont forcément/, 1], [/unité légale de masse est le kilogramme/, 0],
                 [/coupe un objet en deux/, 0], [/dissout 10 g de sel/, 0], [/1 t = 100 kg/, 1], [/1 kg = 1 000 g/, 0], [/1 g = 100 mg/, 1]];

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 7919 + g), palier);
    nb++;
    var nom = 'palier ' + palier + ', ' + q.famille;
    if (!q.etapes || q.etapes.length < 2) ko(nom + ' : correction trop courte');
    if (!q.indices || !q.indices.length) ko(nom + ' : pas d\'indice');
    if (q.type === 'qcm') {
      if (q.correct < 0 || q.correct >= q.choix.length) ko(nom + ' : la bonne réponse est hors des choix');
      var uniques = {}; q.choix.forEach(function (c) { uniques[c] = 1; });
      if (Object.keys(uniques).length !== q.choix.length) ko(nom + ' : deux propositions identiques');
    }
    if (q.type === 'vraifaux' && q.correct !== 0 && q.correct !== 1) ko(nom + ' : vrai/faux sans réponse');
    if (q.type === 'nombre' && !(typeof q.reponse === 'number' && isFinite(q.reponse))) ko(nom + ' : réponse numérique absente');
    var s = texte(q.enonce), corr = texte(q.etapes.join(' '));
    vu(q.famille);
    var bonne = q.type === 'qcm' ? q.choix[q.correct] : null;

    /* --- La notion ---------------------------------------------------- */
    if (q.famille === 'notion-qcm') {
      var nq = NOTION_QCM.filter(function (v) { return v[0].test(s); });
      if (nq.length !== 1) { ko(nom + ' : question inconnue : « ' + s + ' »'); continue; }
      if (bonne.indexOf(nq[0][1]) < 0) ko(nom + ' : « ' + s.slice(0, 50) + ' » → « ' + bonne + ' », attendu « ' + nq[0][1] + ' »');
    }
    if (q.famille === 'notion-vf') {
      var nv = NOTION_VF.filter(function (v) { return v[0].test(s); });
      if (nv.length !== 1) { ko(nom + ' : affirmation inconnue : « ' + s + ' »'); continue; }
      if (q.correct !== nv[0][1]) ko(nom + ' : « ' + s.slice(0, 60) + ' » devrait être ' + (nv[0][1] === 0 ? 'vrai' : 'faux'));
    }
    /* --- Convertir ---------------------------------------------------- */
    if (q.famille === 'convertir') {
      var mc = new RegExp('Convertis : ' + N + ' ' + U + ' = … ' + U).exec(s);
      if (!mc) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var M = mg(mc[1], mc[2]), u1 = mc[3], attendu = M / EN_MG[u1];
      if (mc[2] === u1) ko(nom + ' : convertir ' + mc[2] + ' en ' + u1 + ' ne mesure rien');
      if (!proche(q.reponse, attendu) || q.unite !== u1) ko(nom + ' : ' + mc[1] + ' ' + mc[2] + ' = ' + attendu + ' ' + u1 + ', annoncé ' + q.reponse + ' ' + q.unite);
      var sauts = RANG[u1] - RANG[mc[2]];
      if (!new RegExp(Math.abs(sauts) + ' colonne').test(corr)) ko(nom + ' : la correction doit compter ' + Math.abs(sauts) + ' colonnes (' + mc[2] + ' → ' + u1 + ')');
      if (sauts < 0 && !/divise/.test(corr)) ko(nom + ' : vers une unité plus grande, la correction doit diviser');
      if (sauts > 0 && !/multiplie/.test(corr)) ko(nom + ' : vers une unité plus petite, la correction doit multiplier');
      if (corr.indexOf((sauts < 0 ? '÷' : '×') + ' ' + milliers(Math.pow(10, Math.abs(sauts)))) < 0) ko(nom + ' : la correction doit poser ' + (sauts < 0 ? '÷' : '×') + ' ' + milliers(Math.pow(10, Math.abs(sauts))));
      if (corr.indexOf(mc[1] + ' ' + mc[2] + ' = ') < 0) ko(nom + ' : la correction doit conclure sur « ' + mc[1] + ' ' + mc[2] + ' = … »');
      vu('convertir-' + (sauts < 0 ? 'divise' : 'multiplie') + '-' + Math.abs(sauts));
      if (Math.abs(sauts) >= 6) vu('convertir-deux-sauts');
      if (num(mc[1]) !== Math.floor(num(mc[1]))) vu('convertir-decimal');
      if (/^(hg|dag|dg|cg)$/.test(mc[2]) || /^(hg|dag|dg|cg)$/.test(u1)) vu('convertir-intermediaire');
    }
    /* --- Comparer ----------------------------------------------------- */
    if (q.famille === 'comparer') {
      var masses = q.choix.map(function (c) { var m = new RegExp('^' + N + ' ' + U + '$').exec(c); return m ? mg(m[1], m[2]) : NaN; });
      if (masses.some(isNaN)) { ko(nom + ' : un choix illisible : ' + q.choix.join(' | ')); continue; }
      var max = Math.max.apply(null, masses);
      if (masses.filter(function (m) { return m === max; }).length !== 1) ko(nom + ' : deux masses égales, pas de plus grande');
      if (masses[q.correct] !== max) ko(nom + ' : la plus grande est ' + q.choix[masses.indexOf(max)] + ', annoncé ' + bonne);
      var us = {}; q.choix.forEach(function (c) { us[c.split(' ').pop()] = 1; });
      if (Object.keys(us).length !== q.choix.length) ko(nom + ' : les masses à comparer doivent être dans des unités différentes');
      if (!/même unité/.test(corr)) ko(nom + ' : la correction doit tout mettre dans la même unité');
      var ratio = Math.max.apply(null, masses) / Math.min.apply(null, masses);
      if (ratio > 10) ko(nom + ' : des masses du même ordre de grandeur, pas ' + q.choix.join(' et '));
      vu('comparer-' + q.choix.length);
    }
    /* --- Composer ----------------------------------------------------- */
    if (q.famille === 'composer') {
      var mp = new RegExp('^(\\d+) ' + U + ' (\\d+) ' + U + ' = … ' + U).exec(s);
      if (!mp) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var Mc = mg(mp[1], mp[2]) + mg(mp[3], mp[4]), cible = mp[5];
      if (cible !== mp[2] && cible !== mp[4]) ko(nom + ' : l\'unité demandée doit être l\'une des deux');
      if (!proche(q.reponse, Mc / EN_MG[cible]) || q.unite !== cible) ko(nom + ' : ' + mp[0] + ' → ' + Mc / EN_MG[cible] + ', annoncé ' + q.reponse);
      vu('composer-' + (cible === mp[2] ? 'grande' : 'petite'));
    }
    if (q.famille === 'composer-texte') {
      var mt = new RegExp('Écris ' + N + ' ' + U + ' en (\\w+) et (\\w+)').exec(s);
      if (!mt) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var Mt = mg(mt[1], mt[2]), rep = [].concat(q.reponse);
      var md = new RegExp('^(\\d+) ' + U + ' (\\d+) ' + U + '$').exec(rep[0]);
      if (!md) { ko(nom + ' : réponse illisible « ' + rep[0] + ' »'); continue; }
      if (mg(md[1], md[2]) + mg(md[3], md[4]) !== Mt) ko(nom + ' : ' + rep[0] + ' ne fait pas ' + mt[1] + ' ' + mt[2]);
      if (num(md[3]) * EN_MG[md[4]] >= EN_MG[md[2]]) ko(nom + ' : le reste ' + md[3] + ' ' + md[4] + ' dépasse 1 ' + md[2]);
      if (rep.length < 2) ko(nom + ' : accepter aussi l\'écriture sans espaces');
    }
    /* --- La tare ------------------------------------------------------ */
    if (/^tare/.test(q.famille)) {
      var mv = /vide pèse (\d+) g/.exec(s), mpl = new RegExp('pèse ' + N + ' (g|kg) \\. Quelle').exec(s);
      if (!mv || !mpl) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var contenu = (mg(mpl[1], mpl[2]) - mg(mv[1], 'g')) / 1000;
      if (contenu <= 0) ko(nom + ' : le plein doit peser plus que le vide');
      if (!proche(q.reponse, contenu) || q.unite !== 'g') ko(nom + ' : contenu ' + contenu + ' g, annoncé ' + q.reponse);
      if (q.famille === 'tare-mixte' && mpl[2] !== 'kg') ko(nom + ' : la tare mixte doit donner le plein en kg');
      if (q.famille === 'tare' && mpl[2] !== 'g') ko(nom + ' : la tare simple reste en grammes');
      if (!/−/.test(corr)) ko(nom + ' : la correction doit poser la soustraction');
    }
    /* --- Le piège de la virgule --------------------------------------- */
    if (q.famille === 'piege') {
      var mpi = new RegExp('^Vrai ou faux : ' + N + ' ' + U + ' = (\\d+) ' + U + ' (\\d+) ' + U).exec(s);
      if (!mpi) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      if (mpi[2] !== mpi[4]) ko(nom + ' : la partie entière doit garder l\'unité (' + s + ')');
      var vraiCalc = mg(mpi[1], mpi[2]) === mg(mpi[3], mpi[4]) + mg(mpi[5], mpi[6]);
      if (q.correct !== (vraiCalc ? 0 : 1)) ko(nom + ' : « ' + s + ' » est ' + (vraiCalc ? 'vrai' : 'faux'));
      if (!/trois colonnes/.test(corr)) ko(nom + ' : la correction doit parler des trois colonnes');
      vu('piege-' + (vraiCalc ? 'vrai' : 'faux'));
    }
  }
}

['notion-qcm', 'notion-vf', 'convertir', 'convertir-divise-3', 'convertir-multiplie-3', 'convertir-deux-sauts', 'convertir-decimal', 'convertir-intermediaire',
 'comparer', 'comparer-2', 'comparer-3', 'composer', 'composer-grande', 'composer-petite', 'composer-texte', 'tare', 'tare-mixte', 'piege', 'piege-vrai', 'piege-faux']
  .forEach(function (k) { if (!vus[k]) ko('jamais vu : ' + k); });

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('CHAQUE MASSE EST RAMENÉE EN mg ET LA CONVERSION REFAITE À CÔTÉ, COLONNES COMPTÉES : ' + nb + ' QUESTIONS CONFORMES');
