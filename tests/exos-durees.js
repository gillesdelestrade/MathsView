/*
 * Les exercices « Convertir des durées » (5ème).
 *
 * Rien n'est relu tel que le générateur l'annonce. La durée de l'énoncé est
 * relue dans son LaTeX (« 3~\text{h}~20~\text{min} »), l'unité demandée dans
 * la question, et la réponse est recalculée à côté en passant par le total
 * de secondes : une conversion ne change pas la durée, elle change son
 * écriture. Les décompositions doivent avoir chaque unité sous son maximum
 * (0–59 s, 0–59 min, 0–23 h) et être acceptées par le lecteur sous les formes
 * qu'un élève tape vraiment (« 2h46min40s », « 2 h 46 mn 40 s », « 4h10 »),
 * tandis qu'une erreur de reste est refusée. Le piège de la virgule doit
 * avoir « 1 h 50 min » parmi les leurres et jamais en bonne réponse ; la plus
 * longue des durées est recalculée ; un QCM n'a jamais deux bonnes réponses ;
 * la correction pose la division avec les nombres de l'énoncé.
 */
var window = this;
load('js/alea.js');
load('js/reponse.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/durees.js');

var err = [], cpt = {};
function ko(m) { if (err.indexOf(m) < 0 && err.length < 14) err.push(m); }
function compte(k) { cpt[k] = (cpt[k] || 0) + 1; }
function txt(h) { return String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/ /g, ' ').trim(); }

var FACT = { j: 86400, h: 3600, min: 60, s: 1 }, MAX = { s: 60, min: 60, h: 24 };

/* Une durée écrite en LaTeX : « 3~\text{h}~20~\text{min} », ou « 1{,}5~\text{h} ». */
function litDuree(tex) {
  var out = { j: 0, h: 0, min: 0, s: 0 }, re = /(\d[\d\\,{}]*?)~\\text\{(j|h|min|s)\}/g, m, n = 0, decimal = null;
  tex = String(tex).replace(/^\\\(|\\\)$/g, '');
  while ((m = re.exec(tex))) {
    var brut = m[1].replace(/\\,/g, '');
    if (brut.indexOf('{,}') >= 0) { decimal = { v: parseFloat(brut.replace('{,}', '.')), u: m[2] }; }
    else out[m[2]] += parseInt(brut, 10);
    n++;
  }
  if (!n) return null;
  return decimal ? { decimal: decimal } : out;
}
function total(v) { return v.j * FACT.j + v.h * FACT.h + v.min * FACT.min + v.s; }
function fmtN(n) {
  var s = String(Math.round(n)), out = '';
  while (s.length > 3) { out = ' ' + s.slice(-3) + out; s = s.slice(0, -3); }
  return s + out;
}
function decomposee(t) {
  var v = { j: 0, h: 0, min: 0, s: 0 };
  v.j = Math.floor(t / 86400); t -= v.j * 86400;
  v.h = Math.floor(t / 3600); t -= v.h * 3600;
  v.min = Math.floor(t / 60); v.s = t - v.min * 60;
  return v;
}
function ecrit(v) {
  var p = [];
  ['j', 'h', 'min', 's'].forEach(function (u) { if (v[u]) p.push(fmtN(v[u]) + ' ' + u); });
  return p.join(' ');
}
/* Une durée écrite en texte, comme dans les choix du piège : « 1 h 30 min ». */
function litTexte(s) {
  var v = { j: 0, h: 0, min: 0, s: 0 }, re = /(\d+)\s*(j|h|min|mn|s)\b/g, m, n = 0;
  s = txt(s);
  while ((m = re.exec(s))) { v[m[2] === 'mn' ? 'min' : m[2]] += parseInt(m[1], 10); n++; }
  return n ? v : null;
}

for (var pal = 1; pal <= 4; pal++) {
  for (var g = 0; g < 600; g++) {
    var q = G.genere(MathsAlea(pal * 409 + g), pal);
    var tout = q.enonce + '|' + (q.tex || '') + '|' + (q.etapes || []).join('|') + '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
    if (/undefined|NaN|\[object|Infinity/.test(tout)) ko('P' + pal + ' texte douteux : ' + tout.slice(0, 160));
    if (!q.etapes || q.etapes.length < 2) ko('P' + pal + ' correction trop courte');
    if (!q.indices || !q.indices.length) ko('P' + pal + ' pas d\'indice');

    /* --- vers une seule unité ---------------------------------------- */
    if (q.type === 'nombre') {
      compte('vers une unité');
      var d = litDuree(q.tex);
      if (!d || d.decimal) { ko('P' + pal + ' énoncé illisible : ' + q.tex); continue; }
      var cible = (/\\ldots~\\text\{(j|h|min|s)\}/.exec(q.tex) || [])[1];
      if (!cible) { ko('P' + pal + ' unité demandée introuvable : ' + q.tex); continue; }
      if (q.unite !== cible) ko('P' + pal + ' l\'unité de la réponse (' + q.unite + ') n\'est pas celle demandée (' + cible + ')');
      var att = total(d) / FACT[cible];
      if (att !== Math.round(att)) ko('P' + pal + ' ' + q.tex + ' : la réponse ' + att + ' ne tombe pas juste — l\'élève ne peut pas l\'écrire');
      if (Math.abs(q.reponse - att) > 1e-9) ko('P' + pal + ' ' + q.tex + ' → ' + q.reponse + ' au lieu de ' + att);
      var unites = ['j', 'h', 'min', 's'].filter(function (u) { return d[u]; });
      if (unites.length > 1) compte('durée composée');
      if (['j', 'h', 'min', 's'].indexOf(cible) < Math.min.apply(null, unites.map(function (u) { return ['j', 'h', 'min', 's'].indexOf(u); }))) compte('on divise');
      else compte('on multiplie');
      if (pal === 1 && unites.length > 1) ko('P1 : une durée composée avant le palier 2');
      if (txt(q.etapes[q.etapes.length - 1]).indexOf(fmtN(att) + ' ' + cible) < 0) ko('P' + pal + ' la correction ne finit pas sur ' + fmtN(att) + ' ' + cible);
      if (!MathsReponse.valide(q, String(att)).ok) ko('P' + pal + ' la bonne réponse ' + att + ' est refusée');
      if (MathsReponse.valide(q, String(att + 1)).ok) ko('P' + pal + ' une réponse fausse est acceptée');

    /* --- en j h min s -------------------------------------------------- */
    } else if (q.type === 'texte') {
      compte('décomposition');
      var d2 = litDuree(q.tex);
      if (!d2 || d2.decimal) { ko('P' + pal + ' énoncé illisible : ' + q.tex); continue; }
      var t = total(d2), dec = decomposee(t);
      if (dec.j) compte('avec des jours');
      if (t >= 1000000) compte('un million de secondes ou plus');
      // Toutes les écritures acceptées décrivent la même durée, et la première est la canonique.
      if (!Array.isArray(q.reponse) || !q.reponse.length) { ko('P' + pal + ' réponse texte vide'); continue; }
      if (txt(q.reponse[0]) !== ecrit(dec)) ko('P' + pal + ' ' + q.tex + ' → « ' + q.reponse[0] + ' » au lieu de « ' + ecrit(dec) + ' »');
      q.reponse.forEach(function (r) {
        var lu = litTexte(r.replace(/jours?|heures?|minutes?|secondes?|sec/g, function (m) {
          return { jour: 'j', jours: 'j', heure: 'h', heures: 'h', minute: 'min', minutes: 'min', seconde: 's', secondes: 's', sec: 's' }[m];
        }).replace(/(\d+) m\b/g, '$1 min'));
        if (!lu || total(lu) !== t) {
          // « 4 h 10 » : les minutes sans unité
          var m2 = /^(?:(\d+) j )?(\d+) h (\d+)$/.exec(txt(r));
          if (!(m2 && ((+m2[1] || 0) * 86400 + (+m2[2]) * 3600 + (+m2[3]) * 60) === t)) ko('P' + pal + ' une écriture acceptée ne vaut pas ' + t + ' s : « ' + r + ' »');
        }
      });
      // Ce qu'un élève tape vraiment.
      var canon = ecrit(dec);
      [canon, canon.replace(/\s/g, ''), canon.replace(/min/g, 'mn'), canon.toUpperCase()].forEach(function (s) {
        if (!MathsReponse.valide(q, s).ok) ko('P' + pal + ' saisie légitime refusée : « ' + s + ' » pour ' + canon);
      });
      // Un reste faux est refusé.
      var faux = decomposee(t + 60);
      if (MathsReponse.valide(q, ecrit(faux)).ok) ko('P' + pal + ' « ' + ecrit(faux) + ' » accepté pour ' + canon);
      // La correction pose chaque division avec les nombres de l'énoncé.
      var corr = txt(q.etapes.join(' '));
      var cur = { s: d2.s, min: d2.min, h: d2.h, j: d2.j }, divisions = 0;
      [['s', 'min', 60], ['min', 'h', 60], ['h', 'j', 24]].forEach(function (e) {
        if (cur[e[0]] < e[2]) return;
        var qq = Math.floor(cur[e[0]] / e[2]), r = cur[e[0]] % e[2];
        var pose = fmtN(cur[e[0]]) + ' = ' + e[2] + ' × ' + fmtN(qq) + ' + ' + fmtN(r);
        if (corr.indexOf(pose) < 0) ko('P' + pal + ' la correction de ' + q.tex + ' ne pose pas « ' + pose + ' »');
        cur[e[0]] = r; cur[e[1]] += qq; divisions++;
      });
      if (divisions >= 2) compte('deux divisions ou plus');
      if (corr.indexOf(canon) < 0) ko('P' + pal + ' la correction ne conclut pas sur ' + canon);

    /* --- les QCM ------------------------------------------------------- */
    } else if (q.type === 'qcm') {
      if (q.choix.length < 3) ko('P' + pal + ' QCM à ' + q.choix.length + ' propositions');
      if (q.correct < 0 || q.correct >= q.choix.length) ko('P' + pal + ' bonne réponse hors bornes');
      var vus = {};
      q.choix.forEach(function (c) { if (vus[c]) ko('P' + pal + ' deux propositions identiques : ' + c); vus[c] = 1; });
      var dd = litDuree(q.enonce);
      if (dd && dd.decimal) {
        compte('piège de la virgule');
        if (pal < 2) ko('P1 : le piège de la virgule avant le palier 2');
        var attT = Math.round(dd.decimal.v * FACT[dd.decimal.u]);
        var bons = 0;
        q.choix.forEach(function (c, i) {
          var lu = litTexte(c);
          if (!lu) { ko('P' + pal + ' choix illisible : ' + c); return; }
          var juste = total(lu) === attT;
          if (juste) bons++;
          if (juste !== (i === q.correct)) ko('P' + pal + ' ' + q.enonce + ' : « ' + c + ' » ' + (juste ? 'est juste mais pas marqué bon' : 'est marqué bon mais faux'));
        });
        if (bons !== 1) ko('P' + pal + ' piège de la virgule à ' + bons + ' bonne(s) réponse(s)');
        // Le leurre « 1 h 50 min » (lire la virgule comme des centièmes) doit être proposé.
        var ent = Math.floor(dd.decimal.v), fr = String(dd.decimal.v).split('.')[1];
        var leurre = ent + ' ' + dd.decimal.u + ' ' + fr + (fr.length === 1 ? '0' : '') + ' ' + (dd.decimal.u === 'h' ? 'min' : 's');
        if (q.choix.map(txt).indexOf(leurre) < 0) ko('P' + pal + ' le leurre « ' + leurre + ' » manque pour ' + q.enonce);
      } else {
        compte('la plus longue');
        if (pal < 3) ko('P' + pal + ' « la plus longue » avant le palier 3');
        var totaux = q.choix.map(function (c) { var l = litDuree(c); return l && !l.decimal ? total(l) : null; });
        if (totaux.indexOf(null) >= 0) { ko('P' + pal + ' un choix est illisible : ' + q.choix.join(' | ')); continue; }
        var max = Math.max.apply(null, totaux);
        if (totaux.filter(function (x) { return x === max; }).length !== 1) ko('P' + pal + ' deux durées sont les plus longues à égalité');
        if (totaux[q.correct] !== max) ko('P' + pal + ' la plus longue annoncée (' + totaux[q.correct] + ' s) n\'est pas le maximum (' + max + ' s)');
        var c2 = txt(q.etapes.join(' '));
        totaux.forEach(function (tt) { if (c2.indexOf(fmtN(tt) + ' s') < 0) ko('P' + pal + ' la correction ne ramène pas ' + tt + ' s en secondes'); });
      }
    } else {
      ko('P' + pal + ' type inattendu : ' + q.type);
    }
  }
}

['vers une unité', 'on divise', 'on multiplie', 'durée composée', 'décomposition', 'avec des jours',
 'un million de secondes ou plus', 'deux divisions ou plus', 'piège de la virgule', 'la plus longue'].forEach(function (k) {
  if (!cpt[k]) ko('le cas « ' + k + ' » n\'a jamais été rencontré : le tirage ne couvre pas le chapitre');
});

print('2400 énoncés relus et recalculés — ' + Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', ') + '.');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE CONVERSION CONSERVE LE TOTAL DE SECONDES, ET LA CORRECTION POSE LES DIVISIONS DE L\'ÉNONCÉ');
