/*
 * Les exercices « Les trois états de l'eau » (5ème, physique-chimie).
 *
 * La courbe de chauffage est relue dans son SVG : la ligne rouge, les
 * graduations du temps et de la température, le point rouge. C'est le
 * contrôle qui dit sur quel segment est le point — glace, fusion, liquide,
 * ébullition, vapeur — et à quelle température, et qui mesure la durée des
 * paliers ; la réponse annoncée doit en découler. Les noms des changements
 * d'état, leurs sens, les exemples de la vie courante, les températures et le
 * vocabulaire sont confrontés à une table tenue ici, d'après le programme.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/pc/5eme/etats-eau.js');
if (!G || G.id !== 'pc-etats-eau') { print('ÉCHEC : le générateur ne s\'enregistre pas'); throw new Error('register'); }
if (G.level !== '5eme' || G.competence !== 'pc-etats-eau') { print('ÉCHEC : niveau ou compétence inattendus'); throw new Error('decl'); }

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function vu(k) { vus[k] = (vus[k] || 0) + 1; }
function texte(s) { return s.replace(/<svg[\s\S]*<\/svg>/, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

/* Le programme. */
var SENS = { fusion: ['solide', 'liquide'], solidification: ['liquide', 'solide'], vaporisation: ['liquide', 'gaz'],
             'liquéfaction': ['gaz', 'liquide'], sublimation: ['solide', 'gaz'], condensation: ['gaz', 'solide'] };
var EXEMPLES = [[/glaçon fond|neige fond/, 'fusion'], [/gèle/, 'solidification'], [/bout dans|sèche au soleil|linge mouillé sèche/, 'vaporisation'],
                [/buée|rosée|gouttes se forment sous le couvercle/, 'liquéfaction'], [/givre|flocons/, 'condensation'], [/sans fondre|sans dégeler/, 'sublimation']];
var TEMP = [[/geler|glace fond|glace en train de fondre/, 0], [/bout-elle|bout dans une casserole/, 100]];
var PALIER_VF = [[/glace fond, la température du mélange eau \+ glace augmente/, 1], [/eau bout, sa température reste/, 0], [/chauffant plus fort/, 1], [/même température, 0 °C/, 0], [/vapeur d'eau est visible/, 1]];
var MASSE_VF = [[/sa masse augmente/, 1], [/son volume augmente/, 0], [/30 g d'eau liquide/, 0], [/moins dense/, 0]];
var MOLECULES = [[/glace/, 'ordonnées'], [/eau liquide/, 'désordonnées et serrées'], [/vapeur/, 'dispersées'], [/glace fond/, 'mêmes molécules']];

/* Relire la courbe. */
function lireCourbe(enonce) {
  var m = /<svg[\s\S]*<\/svg>/.exec(enonce);
  if (!m) return null;
  var svg = m[0], f = { ticksT: {}, ticksTemps: {} };
  var p = /<polyline class="courbe" points="([^"]+)"/.exec(svg);
  if (!p) return null;
  f.pts = p[1].trim().split(/\s+/).map(function (c) { var xy = c.split(','); return [+xy[0], +xy[1]]; });
  var re = /<text class="tick-t" x="([\d.]+)"[^>]*>(\d+)<\/text>/g, t;
  while ((t = re.exec(svg))) f.ticksTemps[t[2]] = +t[1];
  re = /<text class="tick-T" x="[\d.]+" y="([\d.]+)"[^>]*>(-?\d+)<\/text>/g;
  while ((t = re.exec(svg))) f.ticksT[t[2]] = +t[1] - 4;
  var c = /<circle class="instant" cx="([\d.]+)" cy="([\d.]+)"/.exec(svg);
  if (c) f.instant = [+c[1], +c[2]];
  return f;
}
// Les échelles, d'après les graduations : t = (x − x0) / px par minute ; T = (y0 − y) / px par degré.
function echelles(f) {
  var e = {};
  var k = Object.keys(f.ticksTemps).map(Number).sort(function (a, b) { return a - b; });
  if (k.length < 2) return null;
  e.x0 = f.ticksTemps[k[0]]; e.pxMin = (f.ticksTemps[k[k.length - 1]] - e.x0) / (k[k.length - 1] - k[0]);
  if (f.ticksT[0] === undefined || f.ticksT[100] === undefined) return null;
  e.y0 = f.ticksT[0]; e.pxDeg = (f.ticksT[0] - f.ticksT[100]) / 100;
  return e;
}
function temps(f, e, x) { return (x - e.x0) / e.pxMin; }
function temperature(f, e, y) { return (e.y0 - y) / e.pxDeg; }

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 15485863 + g), palier);
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
    var s = texte(q.enonce);
    vu(q.famille);
    var bonne = q.type === 'qcm' ? q.choix[q.correct] : q.type === 'texte' ? [].concat(q.reponse)[0] : null;

    /* --- Nommer, sens ------------------------------------------------- */
    if (/^nommer/.test(q.famille)) {
      var m2 = /de l'état (\w+) à l'état (\w+)/.exec(s);
      if (!m2) { ko(nom + ' : états illisibles'); continue; }
      var attendu = Object.keys(SENS).filter(function (n) { return SENS[n][0] === m2[1] && SENS[n][1] === m2[2]; })[0];
      if (!attendu) ko(nom + ' : passage ' + m2[1] + ' → ' + m2[2] + ' inconnu');
      else if (bonne !== attendu) ko(nom + ' : ' + m2[1] + ' → ' + m2[2] + ' est la ' + attendu + ', annoncé « ' + bonne + ' »');
      if (q.type === 'texte' && [].concat(q.reponse).length < 2) ko(nom + ' : accepter aussi « la … »');
    }
    if (q.famille === 'sens') {
      var m3 = /La (\S+) , c'est/.exec(s);
      if (!m3 || !SENS[m3[1]]) { ko(nom + ' : nom illisible : « ' + s + ' »'); continue; }
      if (bonne !== SENS[m3[1]][0] + ' → ' + SENS[m3[1]][1]) ko(nom + ' : ' + m3[1] + ' = ' + SENS[m3[1]].join(' → ') + ', annoncé « ' + bonne + ' »');
    }
    /* --- Exemples ----------------------------------------------------- */
    if (q.famille === 'exemple') {
      var ex = EXEMPLES.filter(function (v) { return v[0].test(s); });
      if (ex.length !== 1) { ko(nom + ' : exemple ' + (ex.length ? 'ambigu' : 'inconnu') + ' : « ' + s + ' »'); continue; }
      if (bonne !== ex[0][1]) ko(nom + ' : « ' + s.slice(0, 60) + ' » → ' + ex[0][1] + ', annoncé « ' + bonne + ' »');
      vu('exemple-' + ex[0][1]);
    }
    /* --- Températures, paliers ---------------------------------------- */
    if (q.famille === 'temperature') {
      var tp = TEMP.filter(function (v) { return v[0].test(s); });
      if (tp.length !== 1) { ko(nom + ' : question de température inconnue : « ' + s + ' »'); continue; }
      if (q.reponse !== tp[0][1] || q.unite !== '°C') ko(nom + ' : « ' + s.slice(0, 50) + ' » → ' + tp[0][1] + ' °C, annoncé ' + q.reponse);
    }
    if (q.famille === 'palier-vf' || q.famille === 'masse-vf') {
      var table = q.famille === 'palier-vf' ? PALIER_VF : MASSE_VF;
      var vf = table.filter(function (v) { return v[0].test(s); });
      if (vf.length !== 1) { ko(nom + ' : affirmation inconnue : « ' + s + ' »'); continue; }
      if (q.correct !== vf[0][1]) ko(nom + ' : « ' + s.slice(0, 60) + ' » devrait être ' + (vf[0][1] === 0 ? 'vrai' : 'faux'));
    }
    /* --- La courbe ---------------------------------------------------- */
    if (/^courbe/.test(q.famille)) {
      var f = lireCourbe(q.enonce), e = f && echelles(f);
      if (!f || !e) { ko(nom + ' : courbe ou graduations illisibles'); continue; }
      if (f.pts.length !== 6) { ko(nom + ' : la courbe doit avoir six coudes'); continue; }
      var coudes = f.pts.map(function (p) { return [temps(f, e, p[0]), temperature(f, e, p[1])]; });
      var Tc = coudes.map(function (c) { return Math.round(c[1]); });
      if (Tc.join() !== '-20,0,0,100,100,120') ko(nom + ' : températures des coudes ' + Tc.join() + ', attendu −20, 0, 0, 100, 100, 120');
      for (var i = 1; i < 6; i++) if (coudes[i][0] <= coudes[i - 1][0] + 0.5) ko(nom + ' : les coudes doivent avancer dans le temps');
      if (q.famille === 'courbe-duree') {
        var fusion = /fusion/.test(s);
        var duree = fusion ? coudes[2][0] - coudes[1][0] : coudes[4][0] - coudes[3][0];
        if (Math.abs(q.reponse - duree) > 0.05 || q.unite !== 'min') ko(nom + ' : le palier mesure ' + duree.toFixed(2) + ' min, annoncé ' + q.reponse);
        if (f.instant) ko(nom + ' : pas de point rouge pour une durée');
        vu(fusion ? 'duree-fusion' : 'duree-ebullition');
      } else {
        if (!f.instant) { ko(nom + ' : le point rouge manque'); continue; }
        var ti = temps(f, e, f.instant[0]), Ti = temperature(f, e, f.instant[1]), seg = -1;
        for (i = 0; i < 5; i++) if (ti >= coudes[i][0] + 0.2 && ti <= coudes[i + 1][0] - 0.2) seg = i;
        if (seg < 0) { ko(nom + ' : le point rouge est trop près d\'un coude (t = ' + ti.toFixed(2) + ')'); continue; }
        var a = coudes[seg], b = coudes[seg + 1], Tsur = a[1] + (b[1] - a[1]) * (ti - a[0]) / (b[0] - a[0]);
        if (Math.abs(Tsur - Ti) > 1.5) ko(nom + ' : le point rouge n\'est pas sur la courbe (' + Ti.toFixed(1) + ' au lieu de ' + Tsur.toFixed(1) + ')');
        if (q.famille === 'courbe-etat') {
          if (q.correct !== seg) ko(nom + ' : le point est sur le segment ' + seg + ' (' + q.choix[seg] + '), annoncé « ' + q.choix[q.correct] + ' »');
          vu('etat-' + seg);
        } else {
          if (Math.abs(q.reponse - Ti) > 1.5 || q.unite !== '°C') ko(nom + ' : température lue ' + Ti.toFixed(1) + ', annoncé ' + q.reponse);
          if (q.reponse % 10 !== 0) ko(nom + ' : une température ronde, pas ' + q.reponse);
          vu('temperature-' + (seg === 1 || seg === 3 ? 'palier' : 'pente'));
        }
      }
    }
    /* --- Masse, molécules --------------------------------------------- */
    if (q.famille === 'masse') {
      var mm = /(\d+) g/.exec(s);
      if (!mm) { ko(nom + ' : masse illisible'); continue; }
      if (q.reponse !== +mm[1] || q.unite !== 'g') ko(nom + ' : la masse se conserve, ' + mm[1] + ' g attendus, annoncé ' + q.reponse);
    }
    if (q.famille === 'molecules') {
      var mo = MOLECULES.filter(function (v) { return v[0].test(s); });
      var regle = mo.length ? mo[mo.length - 1] : null;    // « glace fond » l'emporte sur « glace »
      if (!regle) { ko(nom + ' : question inconnue : « ' + s + ' »'); continue; }
      if (bonne.indexOf(regle[1]) < 0) ko(nom + ' : « ' + s.slice(0, 50) + ' » → « ' + bonne + ' », attendu « ' + regle[1] + ' »');
    }
  }
}

['nommer-qcm', 'nommer-texte', 'sens', 'exemple', 'temperature', 'palier-vf', 'courbe-etat', 'courbe-temperature', 'courbe-duree',
 'duree-fusion', 'duree-ebullition', 'etat-0', 'etat-1', 'etat-2', 'etat-3', 'etat-4', 'temperature-palier', 'temperature-pente',
 'masse', 'masse-vf', 'molecules', 'exemple-fusion', 'exemple-solidification', 'exemple-vaporisation', 'exemple-liquéfaction',
 'exemple-sublimation', 'exemple-condensation'].forEach(function (k) { if (!vus[k]) ko('jamais vu : ' + k); });

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('LA COURBE EST RELUE, LE POINT ROUGE SITUÉ ET LES PALIERS MESURÉS À CÔTÉ : ' + nb + ' QUESTIONS CONFORMES AU PROGRAMME');
