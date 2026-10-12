/*
 * Les exercices « Le volume et ses unités » (5ème, physique-chimie).
 *
 * L'éprouvette est relue dans son SVG : les graduations (leur hauteur et leur
 * valeur) donnent l'échelle, le haut du liquide donne le volume — qui doit
 * tomber sur une graduation, ni à vide ni à ras bord — et la réponse annoncée
 * doit en découler, convertie si la question le demande. Chaque volume de
 * l'énoncé est relu avec son unité et ramené en mm³ par une table tenue ici ;
 * conversion, comparaison, décomposition, déplacement d'eau, pavé et pièges
 * sont refaits à côté. La correction d'une conversion compte les colonnes,
 * dit si on multiplie ou divise, et pose le calcul.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/pc/5eme/volume.js');
if (!G || G.id !== 'pc-volume') { print('ÉCHEC : le générateur ne s\'enregistre pas'); throw new Error('register'); }
if (G.level !== '5eme' || G.competence !== 'pc-volume') { print('ÉCHEC : niveau ou compétence inattendus'); throw new Error('decl'); }

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function vu(k) { vus[k] = (vus[k] || 0) + 1; }
function texte(s) { return s.replace(/<svg[\s\S]*<\/svg>/, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function num(s) { return parseFloat(String(s).replace(/[\s  ]/g, '').replace(',', '.')); }
function milliers(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

var COL = { 'm³': 2, kL: 2, hL: 3, daL: 4, 'dm³': 5, L: 5, dL: 6, cL: 7, 'cm³': 8, mL: 8, 'mm³': 11 };
var NOMS = { 'mètres cubes': 'm³', 'décimètres cubes': 'dm³', 'centimètres cubes': 'cm³', 'millimètres cubes': 'mm³', litres: 'L', décilitres: 'dL', centilitres: 'cL', millilitres: 'mL', hectolitres: 'hL', décalitres: 'daL' };
function enMm3(u) { return Math.pow(10, 11 - COL[u]); }
var U = '(m³|dm³|cm³|mm³|kL|hL|daL|L|dL|cL|mL)', N = '(\\d[\\d \\u202f]*(?:,\\d+)?)';
function mm3(v, u) { return Math.round(num(v) * enMm3(u)); }
function proche(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)); }

/* Le programme. */
var NOTION_QCM = [[/Que mesure le volume/, 'place'], [/volume d'un liquide \?/, 'éprouvette'], [/unité légale/, 'mètre cube'], [/correspond 1 litre/, 'dm³'], [/correspond 1 millilitre/, '1 cm³'],
                  [/20 cL d'eau/, '20 cL'], [/où lit-on le niveau/, 'bas du ménisque'], [/pavé \?/, 'longueur × largeur × hauteur']];
var NOTION_VF = [[/c'est la place qu'il occupe/, 0], [/^Vrai ou faux : 1 L = 1 dm³/, 0], [/^Vrai ou faux : 1 mL = 1 cm³/, 0], [/litre d'eau et un litre d'huile/, 0], [/même masse ont forcément/, 1],
                 [/se mesure avec une balance/, 1], [/autre récipient, son volume change/, 1], [/se mesure en mètres cubes/, 0], [/eau gèle, son volume ne change pas/, 1]];
var PIEGES = [[/1 m³ = 100 L$/, 1], [/1 m³ = 1 000 L$/, 0], [/1 cm³ = 1 cL$/, 1], [/1 cm³ = 1 mL$/, 0], [/1 L = 100 cL$/, 0], [/1 L = 1 000 cL$/, 1], [/donc 1 m³ = 100 cm³$/, 1],
              [/1 m³ = 1 000 000 cm³$/, 0], [/1 dm³ = 100 cm³$/, 1], [/1 dm³ = 1 L$/, 0], [/1 L = 1 m³$/, 1], [/0,5 m³ = 50 L$/, 1], [/0,5 m³ = 500 L$/, 0], [/1 mL = 1 mm³$/, 1]];

/* Relire l'éprouvette : { pas, max, niveau } en mL. */
function lireEprouvette(enonce) {
  var m = /<svg[\s\S]*<\/svg>/.exec(enonce);
  if (!m) return null;
  var svg = m[0], grads = [], re = /<line class="grad" data-v="([^"]+)" x1="[\d.]+" y1="([\d.]+)"/g, t;
  while ((t = re.exec(svg))) grads.push({ v: num(t[1]), y: +t[2] });
  var liq = /<rect class="liquide" x="[\d.]+" y="([\d.]+)"/.exec(svg);
  if (grads.length < 3 || !liq) return null;
  grads.sort(function (a, b) { return a.v - b.v; });
  var pas = grads[1].v - grads[0].v;
  for (var i = 2; i < grads.length; i++) if (Math.abs(grads[i].v - grads[i - 1].v - pas) > 1e-6) return { illisible: 'graduations irrégulières' };
  var a = (grads[grads.length - 1].y - grads[0].y) / (grads[grads.length - 1].v - grads[0].v);
  var niveau = grads[0].v + (+liq[1] - grads[0].y) / a;
  var etiq = (svg.match(/class="etiq"/g) || []).length;
  return { pas: pas, max: grads[grads.length - 1].v, niveau: niveau, nEtiq: etiq };
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 6007 + g), palier);
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
      var Q = mm3(mc[1], mc[2]), u1 = mc[3], attendu = Q / enMm3(u1), sauts = COL[u1] - COL[mc[2]];
      if (mc[2] === u1) ko(nom + ' : convertir ' + mc[2] + ' en ' + u1 + ' ne mesure rien');
      if (!proche(q.reponse, attendu) || q.unite !== u1) ko(nom + ' : ' + mc[1] + ' ' + mc[2] + ' = ' + attendu + ' ' + u1 + ', annoncé ' + q.reponse + ' ' + q.unite);
      if (sauts === 0) { if (!/même colonne/.test(corr)) ko(nom + ' : ' + mc[2] + ' et ' + u1 + ' sont la même colonne, la correction doit le dire'); vu('convertir-meme-colonne'); }
      else {
        if (!new RegExp(Math.abs(sauts) + ' colonne').test(corr)) ko(nom + ' : la correction doit compter ' + Math.abs(sauts) + ' colonnes (' + mc[2] + ' → ' + u1 + ')');
        if (sauts < 0 && !/divise/.test(corr)) ko(nom + ' : vers une unité plus grande, la correction doit diviser');
        if (sauts > 0 && !/multiplie/.test(corr)) ko(nom + ' : vers une unité plus petite, la correction doit multiplier');
        if (corr.indexOf((sauts < 0 ? '÷' : '×') + ' ' + milliers(Math.pow(10, Math.abs(sauts)))) < 0) ko(nom + ' : la correction doit poser ' + (sauts < 0 ? '÷' : '×') + ' ' + milliers(Math.pow(10, Math.abs(sauts))));
        if (/³/.test(mc[2]) && /³/.test(u1) && !/trois longueurs/.test(corr)) ko(nom + ' : entre deux unités cubes, la correction rappelle les trois longueurs');
        if (/³/.test(mc[2]) !== /³/.test(u1) && !/sous le/.test(corr)) ko(nom + ' : entre litres et unités cubes, la correction rappelle le L sous le dm³');
      }
      if (corr.indexOf(mc[1] + ' ' + mc[2] + ' = ') < 0) ko(nom + ' : la correction doit conclure sur « ' + mc[1] + ' ' + mc[2] + ' = … »');
      vu('convertir-' + (sauts < 0 ? 'divise' : sauts > 0 ? 'multiplie' : 'egal') + '-' + Math.abs(sauts));
      if (Math.abs(sauts) >= 6) vu('convertir-deux-sauts');
      if (/³/.test(mc[2]) !== /³/.test(u1)) vu('convertir-litres-cubes');
    }
    /* --- L'éprouvette ------------------------------------------------- */
    if (/^eprouvette/.test(q.famille)) {
      var ep = lireEprouvette(q.enonce);
      if (!ep || ep.illisible) { ko(nom + ' : éprouvette illisible (' + (ep ? ep.illisible : 'absente') + ')'); continue; }
      // le SVG arrondit les hauteurs au dixième de pixel : on tolère ce flou, puis on lit la graduation
      var niveauLu = Math.round(ep.niveau / ep.pas) * ep.pas;
      if (Math.abs(ep.niveau - niveauLu) > 0.1) ko(nom + ' : le niveau (' + ep.niveau.toFixed(2) + ') doit tomber sur une graduation de ' + ep.pas);
      ep.niveau = Math.round(niveauLu * 1e6) / 1e6;
      if (ep.niveau < ep.pas * 1.5 || ep.niveau > ep.max - ep.pas * 0.5) ko(nom + ' : le niveau ne doit être ni à vide ni à ras bord (' + ep.niveau + ' / ' + ep.max + ')');
      if (ep.nEtiq < 3) ko(nom + ' : il faut au moins trois graduations chiffrées');
      var uLu = 'mL';
      if (q.famille === 'eprouvette-convertir') {
        var mu = /en (\S+(?: cubes)?) \?$/.exec(s);
        uLu = mu && NOMS[mu[1]];
        if (!uLu) { ko(nom + ' : unité demandée illisible : « ' + s + ' »'); continue; }
        if (uLu === 'mL') ko(nom + ' : la conversion doit demander une autre unité que le mL');
        vu('eprouvette-' + uLu);
      }
      var attenduE = ep.niveau * enMm3('mL') / enMm3(uLu);
      if (!proche(q.reponse, attenduE) || q.unite !== uLu) ko(nom + ' : le liquide est à ' + ep.niveau + ' mL, soit ' + attenduE + ' ' + uLu + ', annoncé ' + q.reponse + ' ' + q.unite);
      if (!/ménisque/.test(corr)) ko(nom + ' : la correction doit parler du ménisque');
      if (corr.indexOf('vaut ' + String(ep.pas).replace('.', ',') + ' mL') < 0) ko(nom + ' : la correction doit dire ce que vaut une graduation (' + ep.pas + ' mL)');
      vu('eprouvette-pas-' + ep.pas);
    }
    /* --- Déplacement, pavé -------------------------------------------- */
    if (q.famille === 'deplacement') {
      var md = /contient (\d+) mL .* monte à (\d+) mL .* en (cm³|mL) \?/.exec(s);
      if (!md) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var dv = +md[2] - +md[1];
      if (dv <= 0) ko(nom + ' : le niveau doit monter');
      if (q.reponse !== dv || q.unite !== md[3]) ko(nom + ' : volume ' + dv + ' ' + md[3] + ', annoncé ' + q.reponse + ' ' + q.unite);
      if (!/−/.test(corr) || !/1 mL = 1 cm³/.test(corr)) ko(nom + ' : la correction doit poser la soustraction et rappeler 1 mL = 1 cm³');
      vu('deplacement-' + md[3]);
    }
    if (q.famille === 'pave') {
      var mp = new RegExp('de (\\d+) cm de longueur, (\\d+) cm de largeur et (\\d+) cm de hauteur\\. Quel est son volume, en ' + U + ' \\?').exec(s);
      if (!mp) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var cm3 = +mp[1] * +mp[2] * +mp[3], uP = mp[4];
      if (+mp[2] > +mp[1]) ko(nom + ' : la largeur dépasse la longueur');
      if (!proche(q.reponse, cm3 * enMm3('cm³') / enMm3(uP)) || q.unite !== uP) ko(nom + ' : ' + mp[1] + ' × ' + mp[2] + ' × ' + mp[3] + ' = ' + cm3 + ' cm³ = ' + cm3 * enMm3('cm³') / enMm3(uP) + ' ' + uP + ', annoncé ' + q.reponse);
      if (corr.indexOf(mp[1] + ' × ' + mp[2] + ' × ' + mp[3]) < 0) ko(nom + ' : la correction doit poser le produit des trois longueurs');
      vu('pave-' + (uP === 'cm³' ? 'cm3' : 'converti'));
    }
    /* --- Comparer, composer ------------------------------------------- */
    if (q.famille === 'comparer') {
      var vols = q.choix.map(function (c) { var m = new RegExp('^' + N + ' ' + U + '$').exec(c); return m ? mm3(m[1], m[2]) : NaN; });
      if (vols.some(isNaN)) { ko(nom + ' : un choix illisible : ' + q.choix.join(' | ')); continue; }
      var max = Math.max.apply(null, vols);
      if (vols.filter(function (v) { return v === max; }).length !== 1) ko(nom + ' : deux volumes égaux, pas de plus grand');
      if (vols[q.correct] !== max) ko(nom + ' : le plus grand est ' + q.choix[vols.indexOf(max)] + ', annoncé ' + bonne);
      var cols = {}; q.choix.forEach(function (c) { cols[COL[c.split(' ').pop()]] = 1; });
      if (Object.keys(cols).length !== q.choix.length) ko(nom + ' : des unités de colonnes différentes (' + q.choix.join(', ') + ')');
      if (max / Math.min.apply(null, vols) > 10) ko(nom + ' : des volumes du même ordre de grandeur, pas ' + q.choix.join(' et '));
      if (!/même unité/.test(corr)) ko(nom + ' : la correction doit tout mettre dans la même unité');
      vu('comparer-' + q.choix.length);
    }
    if (q.famille === 'composer') {
      var mco = new RegExp('^(\\d+) ' + U + ' (\\d+) ' + U + ' = … ' + U).exec(s);
      if (!mco) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var Qc = mm3(mco[1], mco[2]) + mm3(mco[3], mco[4]), cible = mco[5];
      if (cible !== mco[2] && cible !== mco[4]) ko(nom + ' : l\'unité demandée doit être l\'une des deux');
      if (mm3(mco[3], mco[4]) >= enMm3(mco[2])) ko(nom + ' : la petite partie dépasse une unité de la grande (' + s + ')');
      if (!proche(q.reponse, Qc / enMm3(cible)) || q.unite !== cible) ko(nom + ' : ' + mco[0] + ' → ' + Qc / enMm3(cible) + ', annoncé ' + q.reponse);
      vu('composer-' + (cible === mco[2] ? 'grande' : 'petite'));
    }
    /* --- Les pièges --------------------------------------------------- */
    if (q.famille === 'piege') {
      var pp = PIEGES.filter(function (v) { return v[0].test(s); });
      if (pp.length !== 1) { ko(nom + ' : piège inconnu : « ' + s + ' »'); continue; }
      if (q.correct !== pp[0][1]) ko(nom + ' : « ' + s + ' » devrait être ' + (pp[0][1] === 0 ? 'vrai' : 'faux'));
    }
    if (q.famille === 'piege-virgule') {
      var mpi = new RegExp('^Vrai ou faux : ' + N + ' ' + U + ' = (\\d+) ' + U + ' (\\d+(?:,\\d+)?) ' + U).exec(s);
      if (!mpi) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      if (mpi[2] !== mpi[4]) ko(nom + ' : la partie entière doit garder l\'unité (' + s + ')');
      var vraiCalc = mm3(mpi[1], mpi[2]) === mm3(mpi[3], mpi[4]) + mm3(mpi[5], mpi[6]);
      if (q.correct !== (vraiCalc ? 0 : 1)) ko(nom + ' : « ' + s + ' » est ' + (vraiCalc ? 'vrai' : 'faux'));
      vu('piege-virgule-' + (vraiCalc ? 'vrai' : 'faux'));
    }
  }
}

['notion-qcm', 'notion-vf', 'convertir', 'convertir-divise-3', 'convertir-multiplie-3', 'convertir-multiplie-2', 'convertir-divise-2', 'convertir-meme-colonne', 'convertir-deux-sauts', 'convertir-litres-cubes',
 'eprouvette', 'eprouvette-convertir', 'eprouvette-pas-10', 'eprouvette-pas-5', 'eprouvette-pas-2', 'eprouvette-pas-1', 'eprouvette-pas-0.5', 'eprouvette-cL', 'eprouvette-L',
 'deplacement', 'deplacement-cm³', 'deplacement-mL', 'pave', 'pave-cm3', 'pave-converti', 'comparer', 'comparer-2', 'comparer-3', 'composer', 'composer-grande', 'composer-petite',
 'piege', 'piege-virgule', 'piege-virgule-vrai', 'piege-virgule-faux'].forEach(function (k) { if (!vus[k]) ko('jamais vu : ' + k); });

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('L\'ÉPROUVETTE EST RELUE SUR SES GRADUATIONS, CHAQUE VOLUME RAMENÉ EN mm³ ET LA CONVERSION REFAITE À CÔTÉ : ' + nb + ' QUESTIONS CONFORMES');
