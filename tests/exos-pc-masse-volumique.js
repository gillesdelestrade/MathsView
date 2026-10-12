/*
 * Les exercices « La masse volumique » (5ème, physique-chimie).
 *
 * Les masses, volumes et masses volumiques de l'énoncé sont relus avec leur
 * unité et ramenés en g, en mL et en g/mL par des tables tenues ici ; les
 * trois calculs (ρ, m, V), les conversions de ρ, la tare, l'identification
 * d'une matière et le verdict flotte/coule sont refaits à côté et confrontés
 * à la réponse annoncée, dans l'unité demandée. Les pièges d'unité sont
 * tranchés par le calcul, jamais par la lecture de la correction : « 0,92
 * g/L » pour l'huile doit être faux, « 920 g/L » vrai, et l'élève qui divise
 * des g par des L doit se voir répondre « g/L ». Les notions sont
 * confrontées à une table du programme.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/pc/5eme/masse-volumique.js');
if (!G || G.id !== 'pc-masse-volumique') { print('ÉCHEC : le générateur ne s\'enregistre pas'); throw new Error('register'); }
if (G.level !== '5eme' || G.competence !== 'pc-masse-volumique') { print('ÉCHEC : niveau ou compétence inattendus'); throw new Error('decl'); }

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function vu(k) { vus[k] = (vus[k] || 0) + 1; }
function texte(s) { return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function num(s) { return parseFloat(String(s).replace(/[\s  ]/g, '').replace(',', '.')); }
// L'écriture française du générateur : virgule, espaces fines par milliers.
function fr(v) { var p = String(Math.round(v * 1e6) / 1e6).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') + (p[1] ? ',' + p[1] : ''); }
function proche(a, b) { return Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b)); }

var RHO_U = { 'g/cm³': 1, 'g/mL': 1, 'kg/L': 1, 'kg/dm³': 1, 'g/L': 0.001, 'kg/m³': 0.001, 'mg/mL': 0.001 };
var MASSE_G = { g: 1, kg: 1000, mg: 0.001 };
var VOL_ML = { mL: 1, 'cm³': 1, cL: 10, dL: 100, L: 1000, 'dm³': 1000, 'm³': 1e6 };
var N = '(\\d[\\d \\u202f]*(?:,\\d+)?)', UR = '(g/cm³|g/mL|kg/L|kg/dm³|g/L|kg/m³|mg/mL)', UM = '(kg|g|mg)', UV = '(mL|cm³|cL|dL|L|dm³|m³)';
/* Les matières du programme, en g/cm³. */
var MAT = { 'liège': 0.24, sapin: 0.45, 'chêne': 0.7, essence: 0.75, alcool: 0.79, huile: 0.92, glace: 0.92, eau: 1, lait: 1.03, miel: 1.4, 'béton': 2.3, verre: 2.5, aluminium: 2.7, fer: 7.8, cuivre: 8.9, argent: 10.5, plomb: 11.3, or: 19.3 };
// La première matière du programme nommée dans l'énoncé (« du fer », « de la glace », « d'huile »).
function matiereDe(s) {
  var mots = s.split(/[\s']+/);
  for (var i = 0; i < mots.length; i++) if (MAT[mots[i]] !== undefined) return mots[i];
  return null;
}
var NOTION_QCM = [[/Que représente la masse volumique/, 'unité de volume'], [/Quelle formule/, 'ρ = m ÷ V'], [/masse est en grammes et le volume en centimètres cubes/, 'g/cm³'], [/coupe un bloc de fer/, 'la même'],
                  [/masse volumique de l' eau/, '1 g/mL'], [/Deux cubes de même taille/, 'fer'], [/litre d'huile .* lequel/, 'eau']];
var NOTION_VF = [[/ne dépend pas de la taille/, 0], [/litre d'huile a la même masse/, 1], [/kilogramme de fer a le même volume/, 1], [/1 g\/cm³ = 1 g\/mL/, 0], [/1 g\/mL = 1 g\/L/, 1], [/1 g\/cm³ = 1 kg\/L/, 0],
                 [/plus un centimètre cube de cette matière est lourd/, 0], [/gros morceau de chêne/, 1], [/1 kg\/m³ = 1 g\/L/, 0]];

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 4457 + g), palier);
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
    /* --- Calculer ρ --------------------------------------------------- */
    if (q.famille === 'calculer-rho') {
      var mv = new RegExp(N + ' ' + UV + ' ').exec(s), mm = new RegExp('masse (?:est|de) ' + N + ' ' + UM + ' ?\\.').exec(s), mu = new RegExp('en ' + UR + ' \\?').exec(s);
      if (!mv || !mm || !mu) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var V = num(mv[1]) * VOL_ML[mv[2]], m = num(mm[1]) * MASSE_G[mm[2]], uR = mu[1], rhoAtt = m / V / RHO_U[uR];
      if (!proche(q.reponse, rhoAtt) || q.unite !== uR) ko(nom + ' : ' + m + ' g ÷ ' + V + ' mL = ' + rhoAtt + ' ' + uR + ', annoncé ' + q.reponse + ' ' + q.unite);
      var matR = matiereDe(s);
      if (!matR) ko(nom + ' : matière illisible : « ' + s + ' »');
      else if (!proche(m / V, MAT[matR])) ko(nom + ' : ' + matR + ' fait ' + MAT[matR] + ' g/cm³, l\'échantillon donne ' + m / V);
      if (Math.abs(m * 10 - Math.round(m * 10)) > 1e-6) ko(nom + ' : la masse doit tomber au dixième de gramme (' + m + ')');
      var ur = uR.split('/');
      if ((mm[2] !== ur[0] || VOL_ML[mv[2]] !== VOL_ML[ur[1]]) && !/il faut m en|il faut V en|On veut des/.test(corr)) ko(nom + ' : unités dépareillées, la correction doit les accorder d\'abord');
      if (corr.indexOf('ρ = m ÷ V = ') < 0) ko(nom + ' : la correction doit poser ρ = m ÷ V');
      if (RHO_U[uR] !== 1 && !/mille fois moins/.test(corr)) ko(nom + ' : en ' + uR + ', la correction rappelle le g/mL mille fois plus petit');
      vu('rho-' + (mm[2] === ur[0] && VOL_ML[mv[2]] === VOL_ML[ur[1]] ? 'direct' : 'accorder'));
      vu('rho-unite-' + uR);
    }
    /* --- Calculer m, calculer V --------------------------------------- */
    if (q.famille === 'calculer-m') {
      var mr = new RegExp('est ' + N + ' ' + UR + ' \\. Quelle est la masse de ' + N + ' ' + UV + ' .* en ' + UM + ' \\?').exec(s);
      if (!mr) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var rhoM = num(mr[1]) * RHO_U[mr[2]], Vm = num(mr[3]) * VOL_ML[mr[4]], mAtt = rhoM * Vm / MASSE_G[mr[5]];
      if (!proche(q.reponse, mAtt) || q.unite !== mr[5]) ko(nom + ' : m = ' + rhoM + ' × ' + Vm + ' = ' + mAtt + ' ' + mr[5] + ', annoncé ' + q.reponse + ' ' + q.unite);
      var matM = matiereDe(s);
      if (!matM || !proche(rhoM, MAT[matM])) ko(nom + ' : la masse volumique donnée (' + rhoM + ') n\'est pas celle de la matière (' + s.slice(0, 60) + ')');
      if (!/m = ρ × V/.test(corr)) ko(nom + ' : la correction doit poser m = ρ × V');
      vu('m-' + (mr[4] === mr[2].split('/')[1] ? 'direct' : 'convertir') + (RHO_U[mr[2]] !== 1 ? '-rho-mille' : ''));
    }
    if (q.famille === 'calculer-V') {
      var mV = new RegExp('est ' + N + ' ' + UR + ' \\. Quel volume occupent ' + N + ' ' + UM + ' .* en ' + UV + ' \\?').exec(s);
      if (!mV) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var rhoV = num(mV[1]) * RHO_U[mV[2]], mG = num(mV[3]) * MASSE_G[mV[4]], VAtt = mG / rhoV / VOL_ML[mV[5]];
      if (!proche(q.reponse, VAtt) || q.unite !== mV[5]) ko(nom + ' : V = ' + mG + ' ÷ ' + rhoV + ' = ' + VAtt + ' ' + mV[5] + ', annoncé ' + q.reponse + ' ' + q.unite);
      var matV = matiereDe(s);
      if (!matV || !proche(rhoV, MAT[matV])) ko(nom + ' : la masse volumique donnée (' + rhoV + ') n\'est pas celle de la matière');
      if (!/V = m ÷ ρ/.test(corr)) ko(nom + ' : la correction doit poser V = m ÷ ρ');
      vu('V-' + (mV[4] === mV[2].split('/')[0] ? 'direct' : 'convertir') + (RHO_U[mV[2]] !== 1 ? '-rho-mille' : ''));
    }
    /* --- Convertir ρ -------------------------------------------------- */
    if (q.famille === 'convertir-rho') {
      var mc = new RegExp('est ' + N + ' ' + UR + ' \\. Exprime-la en ' + UR).exec(s);
      if (!mc) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var att = num(mc[1]) * RHO_U[mc[2]] / RHO_U[mc[3]];
      if (mc[2] === mc[3]) ko(nom + ' : convertir ' + mc[2] + ' en ' + mc[3] + ' ne mesure rien');
      if (!proche(q.reponse, att) || q.unite !== mc[3]) ko(nom + ' : ' + mc[1] + ' ' + mc[2] + ' = ' + att + ' ' + mc[3] + ', annoncé ' + q.reponse + ' ' + q.unite);
      var fac = RHO_U[mc[2]] / RHO_U[mc[3]];
      if (fac === 1 && !/même nombre/.test(corr)) ko(nom + ' : ' + mc[2] + ' → ' + mc[3] + ', la correction doit dire « même nombre »');
      if (fac > 1 && !/× 1 000/.test(corr)) ko(nom + ' : ' + mc[2] + ' → ' + mc[3] + ', la correction doit multiplier par 1 000');
      if (fac < 1 && !/÷ 1 000/.test(corr)) ko(nom + ' : ' + mc[2] + ' → ' + mc[3] + ', la correction doit diviser par 1 000');
      var matC = matiereDe(s);
      if (!matC || !proche(num(mc[1]) * RHO_U[mc[2]], MAT[matC])) ko(nom + ' : la valeur donnée n\'est pas celle de la matière (' + s.slice(0, 60) + ')');
      vu('convertir-' + (fac === 1 ? 'meme' : fac > 1 ? 'mille' : 'millieme'));
    }
    /* --- Les pièges --------------------------------------------------- */
    if (q.famille === 'piege-vf') {
      var mp = new RegExp('masse volumique d[eu] (?:la |l\')?(\\S+) est ' + N + ' ' + UR + ' \\.').exec(s);
      if (!mp || MAT[mp[1]] === undefined) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var vraiP = proche(num(mp[2]) * RHO_U[mp[3]], MAT[mp[1]]);
      if (q.correct !== (vraiP ? 0 : 1)) ko(nom + ' : « ' + s + ' » est ' + (vraiP ? 'vrai' : 'faux') + ' (' + mp[1] + ' : ' + MAT[mp[1]] + ' g/cm³)');
      if (!vraiP) {
        var rapport = num(mp[2]) * RHO_U[mp[3]] / MAT[mp[1]];
        if (Math.abs(rapport - 1000) > 1e-6 && Math.abs(rapport - 0.001) > 1e-9) ko(nom + ' : le leurre doit être mille fois trop lourd ou trop léger, pas ' + rapport);
        if (!/mille fois trop/.test(corr)) ko(nom + ' : la correction doit dire « mille fois trop … »');
      }
      vu('piege-vf-' + (vraiP ? 'vrai' : 'faux') + (RHO_U[mp[3]] === 1 ? '-petite' : '-grande'));
    }
    if (q.famille === 'piege-eleve') {
      var me = new RegExp('m = ' + N + ' g et V = ' + N + ' L .* écrit ρ = ' + N + ' g/mL').exec(s);
      if (!me) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      if (!proche(num(me[3]), num(me[1]) / num(me[2]))) ko(nom + ' : le calcul de l\'élève doit être juste (' + me[1] + ' ÷ ' + me[2] + ')');
      if (!/g\/L/.test(bonne) || !/unité/.test(bonne)) ko(nom + ' : la bonne réponse dit que l\'unité est g/L (« ' + bonne + ' »)');
      var gL = num(me[1]) / num(me[2]);
      if (bonne.indexOf(fr(gL) + ' g/L') < 0) ko(nom + ' : la bonne réponse donne ' + gL + ' g/L');
      if (bonne.indexOf(fr(gL / 1000) + ' g/mL') < 0) ko(nom + ' : la bonne réponse donne ' + gL / 1000 + ' g/mL');
      q.choix.forEach(function (c, i) { if (i !== q.correct && /g\/L/.test(c)) ko(nom + ' : un leurre ne doit pas proposer g/L'); });
    }
    if (q.famille === 'piege-egal') {
      var mg = new RegExp('égale à ' + N + ' g/mL').exec(s);
      if (!mg) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var cible = num(mg[1]), bons = 0;
      q.choix.forEach(function (c, i) {
        var mc2 = new RegExp('^' + N + ' ' + UR + '$').exec(c);
        if (!mc2) { ko(nom + ' : choix illisible « ' + c + ' »'); return; }
        var egal = proche(num(mc2[1]) * RHO_U[mc2[2]], cible);
        if (egal) bons++;
        if (egal !== (i === q.correct)) ko(nom + ' : « ' + c + ' » ' + (egal ? 'vaut' : 'ne vaut pas') + ' ' + mg[1] + ' g/mL' + (egal ? ' et n\'est pas la réponse' : ' et est la réponse'));
      });
      if (bons !== 1) ko(nom + ' : une seule écriture égale attendue, ' + bons);
    }
    /* --- Flotte ou coule ---------------------------------------------- */
    if (q.famille === 'flotte-vf') {
      var mf = new RegExp('est ' + N + ' ' + UR + ' \\. Vrai ou faux : .* (flotte|coule) sur l\'eau').exec(s);
      if (!mf) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var rhoF = num(mf[1]) * RHO_U[mf[2]], matF = matiereDe(s);
      if (!matF || !proche(rhoF, MAT[matF])) ko(nom + ' : la valeur donnée n\'est pas celle de la matière (' + s.slice(0, 60) + ')');
      var flotteF = rhoF < 1, vraiF = flotteF === (mf[3] === 'flotte');
      if (q.correct !== (vraiF ? 0 : 1)) ko(nom + ' : ρ = ' + rhoF + ' g/mL, ça ' + (flotteF ? 'flotte' : 'coule') + ' : « ' + mf[3] + ' » est ' + (vraiF ? 'vrai' : 'faux'));
      if (!/1 000/.test(corr)) ko(nom + ' : la correction doit donner l\'eau en g/L ou kg/m³ aussi (1 000)');
      vu('flotte-vf-' + (RHO_U[mf[2]] === 1 ? 'petite' : 'grande'));
    }
    if (q.famille === 'flotte-qcm') {
      var cherche = /flotte sur/.test(s) ? 'flotte' : 'coule', bonsF = 0;
      q.choix.forEach(function (c, i) {
        var mc3 = new RegExp('^(\\S+) : ' + N + ' ' + UR + '$').exec(c);
        if (!mc3 || MAT[mc3[1]] === undefined) { ko(nom + ' : choix illisible « ' + c + ' »'); return; }
        var r = num(mc3[2]) * RHO_U[mc3[3]];
        if (!proche(r, MAT[mc3[1]])) ko(nom + ' : ' + mc3[1] + ' ne fait pas ' + r + ' g/cm³');
        var ok = cherche === 'flotte' ? r < 1 : r > 1;
        if (ok) bonsF++;
        if (ok !== (i === q.correct)) ko(nom + ' : « ' + c + ' » ' + (ok ? cherche : 'ne ' + cherche + ' pas') + (ok ? ' et n\'est pas la réponse' : ' et est la réponse'));
      });
      if (bonsF !== 1) ko(nom + ' : une seule bonne réponse attendue, ' + bonsF);
    }
    /* --- Identifier, tare --------------------------------------------- */
    if (q.famille === 'identifier') {
      var mi = new RegExp('masse de ' + N + ' ' + UM + ' et un volume de ' + N + ' ' + UV + ' \\.').exec(s);
      if (!mi) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var rhoI = num(mi[1]) * MASSE_G[mi[2]] / (num(mi[3]) * VOL_ML[mi[4]]), table = {}, re = /(\S+) : ([\d,]+) g\/cm³/g, t;
      while ((t = re.exec(s))) table[t[1]] = num(t[2]);
      if (Object.keys(table).length !== q.choix.length) ko(nom + ' : la table doit donner la masse volumique de chaque choix');
      q.choix.forEach(function (c) { if (table[c] !== MAT[c]) ko(nom + ' : la table donne ' + table[c] + ' pour ' + c + ', le programme dit ' + MAT[c]); });
      var candidats = q.choix.filter(function (c) { return proche(table[c], rhoI); });
      if (candidats.length !== 1) ko(nom + ' : ρ = ' + rhoI + ' désigne ' + candidats.length + ' matière(s)');
      else if (candidats[0] !== bonne) ko(nom + ' : ρ = ' + rhoI + ', c\'est ' + candidats[0] + ', annoncé ' + bonne);
      q.choix.forEach(function (c) { if (c !== bonne && Math.abs(table[c] - rhoI) < 0.2) ko(nom + ' : ' + c + ' (' + table[c] + ') est trop proche de ' + rhoI + ' pour un QCM'); });
      vu('identifier-' + (mi[2] === 'g' && mi[4] === 'cm³' ? 'direct' : 'convertir'));
    }
    if (q.famille === 'tare') {
      var mt = new RegExp('vide pèse ' + N + ' g \\. On y verse ' + N + ' cL .* pèse alors ' + N + ' g \\.').exec(s);
      if (!mt) { ko(nom + ' : énoncé illisible : « ' + s + ' »'); continue; }
      var rhoT = (num(mt[3]) - num(mt[1])) / (num(mt[2]) * 10);
      if (!proche(q.reponse, rhoT) || q.unite !== 'g/mL') ko(nom + ' : (' + mt[3] + ' − ' + mt[1] + ') ÷ ' + num(mt[2]) * 10 + ' = ' + rhoT + ' g/mL, annoncé ' + q.reponse);
      if (!Object.keys(MAT).some(function (k) { return proche(MAT[k], rhoT); })) ko(nom + ' : le liquide inconnu doit être une matière du programme (' + rhoT + ')');
      if (!/−/.test(corr) || !/ mL/.test(corr)) ko(nom + ' : la correction doit poser la soustraction et convertir en mL');
    }
  }
}

['notion-qcm', 'notion-vf', 'calculer-rho', 'rho-direct', 'rho-accorder', 'rho-unite-g/mL', 'rho-unite-g/cm³', 'rho-unite-kg/L', 'rho-unite-g/L', 'rho-unite-kg/m³', 'rho-unite-kg/dm³',
 'calculer-m', 'm-direct', 'm-convertir', 'm-convertir-rho-mille', 'calculer-V', 'V-direct', 'V-convertir', 'V-direct-rho-mille',
 'convertir-rho', 'convertir-meme', 'convertir-mille', 'convertir-millieme', 'piege-vf', 'piege-vf-vrai-petite', 'piege-vf-faux-petite', 'piege-vf-vrai-grande', 'piege-vf-faux-grande',
 'piege-eleve', 'piege-egal', 'flotte-vf', 'flotte-vf-petite', 'flotte-vf-grande', 'flotte-qcm', 'identifier', 'identifier-direct', 'identifier-convertir', 'tare']
  .forEach(function (k) { if (!vus[k]) ko('jamais vu : ' + k); });

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('MASSES, VOLUMES ET UNITÉS RELUS, ρ = m ÷ V REFAIT À CÔTÉ, LES PIÈGES g/L TRANCHÉS PAR LE CALCUL : ' + nb + ' QUESTIONS CONFORMES');
