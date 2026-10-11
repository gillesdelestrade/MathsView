/*
 * Les exercices « Mélanges homogènes et hétérogènes » (5ème, physique-chimie).
 *
 * La figure est relue dans son SVG : des grains ou une couche dessinés,
 * c'est hétérogène, quelle que soit la légende et quelle que soit la couleur
 * du liquide — le vrai/faux ou le QCM annoncé doit en découler. Les mélanges
 * de la vie courante et le vocabulaire sont confrontés à une table tenue ici,
 * d'après le programme. Les masses de sel sont relues dans l'énoncé et la
 * saturation (36 g pour 100 mL, proportionnelle au volume) refaite à côté,
 * de même que la masse d'une solution.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/pc/5eme/melanges.js');
if (!G || G.id !== 'pc-melanges') { print('ÉCHEC : le générateur ne s\'enregistre pas'); throw new Error('register'); }
if (G.level !== '5eme' || G.competence !== 'pc-melanges') { print('ÉCHEC : niveau ou compétence inattendus'); throw new Error('decl'); }

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function vu(k) { vus[k] = (vus[k] || 0) + 1; }
function texte(s) { return s.replace(/<svg[\s\S]*<\/svg>/, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function nombre(re, s) { var m = re.exec(s); return m ? parseFloat(m[1].replace(',', '.')) : NaN; }

/* Ce que dit le programme. */
var HOMOGENES = [/\bsel\b/, /sucre/, /sirop/, /alcool/, /\bvinaigre\b/, /eau de mer/, /l'air/, /thé/, /eau sucrée/];
var HETEROGENES = [/huile/, /sable/, /craie/, /terre/, /farine/, /copeaux/, /vinaigrette/, /pulpe/, /bulles/, /boueuse/, /morceaux/];
var VOCAB = [[/liquide qui dissout le sel|l'eau est le…/, 'solvant'], [/une fois dissous|le sel est le…/, 'soluté'], [/mélange homogène obtenu en dissolvant/, 'solution'],
             [/sucre disparaît|se dissout dans l'eau est dit/, 'soluble'], [/sable reste au fond|ne se dissout pas dans l'eau est dit/, 'insoluble'],
             [/sirop et l'eau|se mélangent en un mélange homogène sont dits/, 'miscible'], [/huile et l'eau forment deux couches/, 'non miscibles'],
             [/ne se dissout plus|ne peut plus dissoudre/, 'saturée'], [/traversé le filtre/, 'filtrat']];
var SEPARER = [[/retirer le sable/, 'filtration'], [/récupérer le sel dissous/, 'évaporation'], [/séparer l'huile/, 'décantation'], [/laisse reposer de l'eau boueuse/, 'décantation'],
               [/filtre de l'eau salée/, 'salée'], [/reste-t-il sur le filtre/, 'sable'], [/mélangée à de la terre/, 'limpide']];
var SEPARER_VF = [[/filtration permet de séparer le sel/, 1], [/filtrat est encore salé/, 0], [/filtration permet de séparer le sable/, 0], [/retient l'huile/, 1], [/décantation consiste/, 0], [/évaporer l'eau/, 0]];

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 104729 + g), palier);
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

    /* --- Reconnaître ------------------------------------------------- */
    if (/^reconnaitre/.test(q.famille)) {
      var annonce;   // ce que la question annonce comme homogène (true) ou non
      if (q.type === 'vraifaux') {
        var affirme = /ce mélange est homogène/.test(s) ? true : /ce mélange est hétérogène/.test(s) ? false : null;
        if (affirme === null) { ko(nom + ' : l\'affirmation du vrai/faux est illisible'); continue; }
        annonce = q.correct === 0 ? affirme : !affirme;
      } else {
        if (q.choix.join('|') !== 'homogène|hétérogène') ko(nom + ' : les deux choix doivent être homogène / hétérogène');
        annonce = q.correct === 0;
      }
      var svg = /<svg[\s\S]*<\/svg>/.exec(q.enonce);
      if (svg) {
        var grains = (svg[0].match(/class="grain"/g) || []).length, couche = /class="couche"/.test(svg[0]);
        if (!/class="liquide"/.test(svg[0]) || !/class="becher"/.test(svg[0])) ko(nom + ' : le bécher ou le liquide manquent sur la figure');
        var heteroVu = grains > 0 || couche;
        vu('figure-' + (heteroVu ? 'hetero' : 'homo'));
        if (heteroVu === annonce) ko(nom + ' : la figure montre ' + (heteroVu ? 'des grains ou une couche' : 'un liquide uniforme') + ' mais la réponse dit ' + (annonce ? 'homogène' : 'hétérogène'));
        // la couleur n'est pas un indice : il doit exister des figures colorées homogènes
        if (!heteroVu && !/#bfdbfe/.test(svg[0])) vu('figure-coloree-homogene');
      } else {
        var h = HOMOGENES.some(function (k) { return k.test(s); }), x = HETEROGENES.some(function (k) { return k.test(s); });
        if (h === x) { ko(nom + ' : mélange inconnu de la table : « ' + s.slice(0, 60) + ' »'); continue; }
        if (h !== annonce) ko(nom + ' : « ' + s.slice(0, 50) + ' » est ' + (h ? 'homogène' : 'hétérogène') + ' d\'après le programme');
      }
    }
    /* --- Vocabulaire ------------------------------------------------- */
    if (/^vocabulaire/.test(q.famille)) {
      var regle = VOCAB.filter(function (v) { return v[0].test(s); })[0];
      if (!regle) { ko(nom + ' : question de vocabulaire inconnue : « ' + s.slice(0, 60) + ' »'); continue; }
      var bonne = q.type === 'texte' ? [].concat(q.reponse)[0] : q.choix[q.correct];
      if (bonne.indexOf(regle[1]) < 0) ko(nom + ' : « ' + s.slice(0, 50) + ' » → « ' + bonne + ' », attendu « ' + regle[1] + ' »');
      if (regle[1] === 'miscible' && /^non/.test(bonne)) ko(nom + ' : miscibles, pas non miscibles');
    }
    /* --- Saturation -------------------------------------------------- */
    if (/^saturation/.test(q.famille)) {
      // le volume de la QUESTION, pas celui du rappel « 36 g pour 100 mL » : le dernier cité
      var tousV = s.match(/(\d+) mL/g) || [];
      var V = tousV.length > 1 ? parseInt(tousV[tousV.length - 1], 10) : NaN;
      if (isNaN(V)) { ko(nom + ' : volume illisible'); continue; }
      var seuil = 36 * V / 100;
      if (q.famille === 'saturation-maxi') { if (q.reponse !== seuil) ko(nom + ' : ' + V + ' mL dissolvent ' + seuil + ' g, annoncé ' + q.reponse); }
      else {
        var m = nombre(/verse (\d+(?:,\d+)?) g/, s);
        if (isNaN(m)) { ko(nom + ' : masse versée illisible'); continue; }
        if (q.famille === 'saturation-vf') {
          if (m === seuil) ko(nom + ' : masse pile au seuil, ambigu');
          if (q.correct !== (m > seuil ? 0 : 1)) ko(nom + ' : ' + m + ' g dans ' + V + ' mL, saturée = ' + (m > seuil) + ', annoncé ' + q.correct);
        } else if (Math.abs(q.reponse - Math.max(0, m - seuil)) > 1e-9) ko(nom + ' : ' + m + ' g dans ' + V + ' mL → reste ' + Math.max(0, m - seuil) + ' g, annoncé ' + q.reponse);
        vu(q.famille + (m > seuil ? '-sature' : '-dissous'));
      }
      if (palier === 4 && V !== 100) vu('saturation-proportion');
    }
    /* --- Séparer ----------------------------------------------------- */
    if (q.famille === 'separer-qcm') {
      var r2 = SEPARER.filter(function (v) { return v[0].test(s); })[0];
      if (!r2) { ko(nom + ' : question inconnue : « ' + s.slice(0, 60) + ' »'); continue; }
      if (q.choix[q.correct].indexOf(r2[1]) < 0) ko(nom + ' : « ' + s.slice(0, 40) + ' » → « ' + q.choix[q.correct] + ' », attendu « ' + r2[1] + ' »');
    }
    if (q.famille === 'separer-vf') {
      var r3 = SEPARER_VF.filter(function (v) { return v[0].test(s); })[0];
      if (!r3) { ko(nom + ' : affirmation inconnue : « ' + s.slice(0, 60) + ' »'); continue; }
      if (q.correct !== r3[1]) ko(nom + ' : « ' + s.slice(0, 50) + ' » devrait être ' + (r3[1] === 0 ? 'vrai' : 'faux'));
    }
    /* --- Masse ------------------------------------------------------- */
    if (q.famille === 'masse') {
      var ms = nombre(/dissout (\d+) g/, s), me = nombre(/dans (\d+) g d'eau/, s);
      if (isNaN(ms) || isNaN(me)) { ko(nom + ' : masses illisibles'); continue; }
      if (q.reponse !== ms + me) ko(nom + ' : ' + ms + ' + ' + me + ' = ' + (ms + me) + ', annoncé ' + q.reponse);
    }
    if (q.famille === 'masse-inverse') {
      var mt = nombre(/pèse (\d+) g/, s), md = nombre(/dissolvant (\d+) g/, s);
      if (isNaN(mt) || isNaN(md)) { ko(nom + ' : masses illisibles'); continue; }
      if (q.reponse !== mt - md) ko(nom + ' : ' + mt + ' − ' + md + ' = ' + (mt - md) + ', annoncé ' + q.reponse);
    }
  }
}

['reconnaitre-figure', 'reconnaitre-texte', 'figure-hetero', 'figure-homo', 'figure-coloree-homogene', 'vocabulaire-qcm', 'vocabulaire-texte',
 'saturation-maxi', 'saturation-vf', 'saturation-reste', 'saturation-reste-sature', 'saturation-reste-dissous', 'saturation-proportion',
 'separer-qcm', 'separer-vf', 'masse', 'masse-inverse'].forEach(function (k) { if (!vus[k]) ko('jamais vu : ' + k); });

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('HOMOGÈNE OU HÉTÉROGÈNE LU SUR LE DESSIN, SATURATION ET MASSES REFAITES À CÔTÉ : ' + nb + ' QUESTIONS CONFORMES');
