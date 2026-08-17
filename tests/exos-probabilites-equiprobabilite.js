/* Les exercices « Attribuer des probabilités » (5ème).
 *
 * Il n'y a pas de figure à relire ici : tout est dans le texte. Le contrôle
 * reconstruit donc la situation à partir de l'ÉNONCÉ — le nombre de faces, de
 * secteurs, de jetons de chaque couleur — et refait tous les calculs avec son
 * propre code, sans jamais relire ce que le générateur affirme.
 *
 * Ce qu'il refuse :
 *
 *   — une probabilité qui ne serait pas celle de l'énoncé. Elle est recalculée
 *     en fractions, jamais en décimaux : 0,167 n'est pas 1/6, et une réponse
 *     attendue arrondie serait refusée à une élève qui écrit la valeur exacte.
 *
 *   — une probabilité hors de [0 ; 1], ou nulle, ou égale à 1 : la question
 *     porterait alors sur un événement impossible ou certain, ce que la leçon
 *     traite à part et qu'aucune de ces familles n'annonce.
 *
 *   — un sac dont toutes les couleurs auraient le même effectif : « 1 sur le
 *     nombre de couleurs » deviendrait la bonne réponse, et le piège de la
 *     famille — l'univers, ce sont les jetons, pas les couleurs — disparaîtrait
 *     sans que rien ne le signale.
 *
 *   — une correction qui annonce un nombre de cas favorables différent de la
 *     liste qu'elle affiche, ou qui n'accorde pas avec la réponse attendue.
 *
 *   — la somme de deux dés comptée sur onze issues au lieu de trente-six
 *     couples. C'est l'erreur que la leçon combat ; le contrôle réénumère les
 *     couples de son côté.
 *
 * Il vérifie enfin que les huit familles sortent toutes, et que « équiprobable »
 * propose bien QUATRE expériences dont une seule est en défaut : à trois
 * propositions, une élève la trouverait une fois sur trois sans rien savoir.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/probabilites-equiprobabilite.js');

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 25 && err.indexOf(m) < 0) err.push(m); }
function pgcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function txt(h) { return String(h).replace(/<[^>]+>/g, ''); }

/* La valeur attendue, quelle que soit la forme sous laquelle elle est donnée. */
function valeur(r) {
  return (r && typeof r === 'object') ? r.n / r.d : Number(r);
}
/* Une fraction lue dans un texte, façon « 3/12 ». */
function fracs(h) {
  var out = [], m, re = /(\d+)\s*\/\s*(\d+)/g;
  while ((m = re.exec(h))) out.push({ n: +m[1], d: +m[2] });
  return out;
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 7717 + g), palier);
    nb++;
    var e = q.enonce, corr = q.etapes.join(' ');

    var fam = q.type === 'vraifaux' ? 'proprietes'
            : /ne sont-elles PAS/.test(e) ? 'equiprobable'
            : /somme<\/b> des deux nombres/.test(e) ? 'deuxdes'
            : /Combien de secteurs|Combien de jetons|Combien y a-t-il de boules/.test(e)
              ? 'combien'
            : /ne rien gagner|qu'elle <b>perde<\/b>|roue <b>truquée<\/b>/.test(e) ? 'somme1'
            : /contient <b>\d+ (jetons|boules|billes)<\/b> :/.test(e) ? 'couleurs'
            : /l'événement <b>«/.test(e) ? 'evenement'
            : 'issue';
    vus[fam] = (vus[fam] || 0) + 1;

    if (!q.etapes || q.etapes.length < 2) ko(fam + ' : correction trop courte');
    if (!q.indices || !q.indices.length) ko(fam + ' : aucun indice');
    if (!q.duree) ko(fam + ' : pas de durée annoncée');
    /* Un champ mal nommé ne plante pas en JavaScript : il écrit « undefined »
       au milieu d'une phrase, et la question part telle quelle à l'élève. */
    var tousLesTextes = e + ' ' + corr + ' ' + q.indices.join(' ') +
                        ' ' + (q.choix || []).join(' ');
    if (/undefined|NaN|\[object/.test(tousLesTextes))
      ko(fam + ' : « ' + /undefined|NaN|\[object/.exec(tousLesTextes)[0] +
         ' » apparaît dans le texte de la question');

    /* --- ce qui vaut pour toute réponse de type « probabilité » -------- */
    if (q.type === 'nombre' && fam !== 'combien') {
      var v = valeur(q.reponse);
      if (!(v > 0 && v < 1))
        ko(fam + ' : la probabilité attendue vaut ' + v + ' — hors de ]0 ; 1[, ' +
           'l\'événement serait impossible ou certain');
      if (typeof q.reponse !== 'object')
        ko(fam + ' : la réponse n\'est pas donnée sous forme de fraction { n, d }');
      else if (pgcd(q.reponse.n, q.reponse.d) !== 1)
        ko(fam + ' : la réponse attendue ' + q.reponse.n + '/' + q.reponse.d +
           ' n\'est pas irréductible');
    }
    if (q.type === 'qcm') {
      if (q.correct < 0) ko(fam + ' : la bonne réponse n\'est pas dans la liste');
      var deja = {};
      q.choix.forEach(function (c) {
        if (deja[c]) ko(fam + ' : deux propositions identiques');
        deja[c] = 1;
      });
    }

    /* --- 1. la probabilité d'une issue : 1/n -------------------------- */
    if (fam === 'issue') {
      var n = null, m1;
      if ((m1 = /<b>(\d+) faces<\/b>/.exec(e))) n = +m1[1];
      else if ((m1 = /<b>(\d+) boules<\/b>/.exec(e))) n = +m1[1];
      else if ((m1 = /<b>(\d+) secteurs de même angle<\/b>/.exec(e))) n = +m1[1];
      else if ((m1 = /<b>(\d+) cartes<\/b>/.exec(e))) n = +m1[1];
      else if (/pièce <b>non truquée<\/b>/.test(e)) n = 2;
      if (n === null) { ko('issue : l\'expérience de l\'énoncé est méconnaissable'); continue; }
      if (Math.abs(valeur(q.reponse) - 1 / n) > 1e-12)
        ko('issue : ' + n + ' issues équiprobables donnent 1/' + n + ', on attend ' +
           q.reponse.n + '/' + q.reponse.d);
      // la raison de l'équiprobabilité doit être dite : c'est elle qui autorise
      // le partage égal, et sans elle la règle devient « on divise par n »
      if (!/équilibré|identiques|même angle|même taille|même rôle|mélangé|indiscernables|sans regarder/.test(corr))
        ko('issue : la correction ne dit pas pourquoi les issues se valent');
      if (corr.indexOf(n + ' × 1/' + n + ' = 1') < 0)
        ko('issue : la correction ne vérifie pas que les ' + n + ' parts refont 1');
      continue;
    }

    /* --- 2. la probabilité d'un événement ----------------------------- */
    if (fam === 'evenement') {
      var nb2 = null, m2;
      if ((m2 = /<b>(\d+) faces<\/b>/.exec(e))) nb2 = +m2[1];
      else if ((m2 = /<b>(\d+) boules<\/b>/.exec(e))) nb2 = +m2[1];
      else if ((m2 = /<b>(\d+) secteurs de même angle<\/b>/.exec(e))) nb2 = +m2[1];
      else if ((m2 = /<b>(\d+) cartes<\/b>/.exec(e))) nb2 = +m2[1];
      if (nb2 === null) { ko('evenement : l\'univers est méconnaissable'); continue; }

      /* La condition est relue dans l'énoncé et REJOUÉE ici, sur 1..n : le
         contrôle refait le filtre au lieu de croire la liste affichée. */
      var cond = /l'événement <b>« ([^»]+) »<\/b>/.exec(e);
      if (!cond) { ko('evenement : la condition est illisible'); continue; }
      var c = cond[1].trim(), f = null, mm;
      if (/^obtenir un nombre pair$/.test(c)) f = function (v) { return v % 2 === 0; };
      else if (/^obtenir un nombre impair$/.test(c)) f = function (v) { return v % 2 === 1; };
      else if ((mm = /^obtenir un multiple de (\d+)$/.exec(c))) {
        f = (function (k) { return function (v) { return v % k === 0; }; })(+mm[1]);
      } else if ((mm = /^obtenir un nombre strictement plus grand que (\d+)$/.exec(c))) {
        f = (function (k) { return function (v) { return v > k; }; })(+mm[1]);
      } else if ((mm = /^obtenir un nombre inférieur ou égal à (\d+)$/.exec(c))) {
        f = (function (k) { return function (v) { return v <= k; }; })(+mm[1]);
      } else if (/^obtenir un nombre à deux chiffres$/.test(c)) {
        f = function (v) { return v >= 10; };
      }
      if (!f) { ko('evenement : condition inconnue du contrôle — « ' + c + ' »'); continue; }
      var favo = 0;
      for (var i = 1; i <= nb2; i++) if (f(i)) favo++;
      if (Math.abs(valeur(q.reponse) - favo / nb2) > 1e-12)
        ko('evenement : « ' + c + ' » vaut ' + favo + '/' + nb2 + ', on attend ' +
           q.reponse.n + '/' + q.reponse.d);
      if (favo < 2) ko('evenement : l\'événement ne regroupe que ' + favo + ' issue');
      if (favo >= nb2) ko('evenement : l\'événement regroupe toutes les issues');
      // la correction doit montrer la liste, et son compte doit être celui-là
      var mfav = /il y en a <b>(\d+)<\/b>/i.exec(corr);
      if (!mfav) ko('evenement : la correction ne compte pas les cas favorables');
      else if (+mfav[1] !== favo)
        ko('evenement : la correction annonce ' + mfav[1] + ' cas favorables au lieu de ' +
           favo);
      continue;
    }

    /* --- 3. les couleurs : l'univers, ce sont les jetons --------------- */
    if (fam === 'couleurs') {
      var mt = /contient <b>(\d+) (jetons|boules|billes)<\/b> :/.exec(e);
      var total = +mt[1], objs = mt[2];
      /* Les effectifs sont relus un par un dans l'énoncé, puis additionnés :
         un total annoncé qui ne serait pas celui du détail rendrait toutes les
         probabilités fausses. */
      var lots = [], m3, re3 = /<b>(\d+) ([a-zéèêA-Z]+)<\/b>/g;
      var apres = e.slice(e.indexOf(':'));
      while ((m3 = re3.exec(apres))) lots.push({ k: +m3[1], c: m3[2] });
      var somme = lots.reduce(function (s, l) { return s + l.k; }, 0);
      if (somme !== total)
        ko('couleurs : les effectifs font ' + somme + ' pour un total annoncé de ' + total);
      if (lots.length < 2) ko('couleurs : moins de deux couleurs');
      var tousPareils = lots.every(function (l) { return l.k === lots[0].k; });
      if (tousPareils)
        ko('couleurs : toutes les couleurs ont le même effectif — « 1 sur le nombre de ' +
           'couleurs » serait juste, et le piège disparaîtrait');

      /* La question est relue, et le nombre de cas favorables recalculé depuis
         les effectifs — jamais repris de la correction. */
      var mq = /probabilité (de [\s\S]*?) \?<\/b>/.exec(e);
      if (!mq) { ko('couleurs : la question est illisible'); continue; }
      var quest = txt(mq[1]);
      var attendu = null;
      var couleursCitees = lots.filter(function (l) {
        // « rouges » dans l'énoncé, « rouge » dans la question : on compare les
        // radicaux, sans quoi l'accord ferait échouer la relecture
        return quest.indexOf(l.c.replace(/e?s$/, '')) >= 0;
      });
      if (/ne pas tirer/.test(quest)) {
        if (couleursCitees.length !== 1) ko('couleurs : la couleur exclue est ambiguë');
        else attendu = total - couleursCitees[0].k;
      } else if (/ ou /.test(quest)) {
        if (couleursCitees.length !== 2) ko('couleurs : les deux couleurs sont ambiguës');
        else attendu = couleursCitees[0].k + couleursCitees[1].k;
      } else {
        if (couleursCitees.length !== 1) ko('couleurs : la couleur visée est ambiguë');
        else attendu = couleursCitees[0].k;
      }
      if (attendu !== null && Math.abs(valeur(q.reponse) - attendu / total) > 1e-12)
        ko('couleurs : « ' + quest + ' » vaut ' + attendu + '/' + total + ', on attend ' +
           q.reponse.n + '/' + q.reponse.d);
      // la mise en garde doit être présente : c'est tout l'intérêt de la famille
      if (!/pas les couleurs/.test(corr))
        ko('couleurs : la correction ne prévient pas que ce ne sont pas les couleurs qui ' +
           'sont équiprobables');
      if (corr.indexOf('' + total + ' ' + objs) < 0)
        ko('couleurs : la correction ne rappelle pas que l\'univers a ' + total + ' ' + objs);
      continue;
    }

    /* --- 4. le calcul à l'envers -------------------------------------- */
    if (fam === 'combien') {
      var mp = /est <b>(\d+)\/(\d+)<\/b>/.exec(e);
      if (!mp) { ko('combien : la probabilité de l\'énoncé est illisible'); continue; }
      var p = { n: +mp[1], d: +mp[2] };
      if (pgcd(p.n, p.d) !== 1)
        ko('combien : la probabilité de l\'énoncé (' + p.n + '/' + p.d + ') n\'est pas ' +
           'donnée sous forme irréductible — la question perdrait son intérêt');
      if (!(p.n / p.d > 0 && p.n / p.d < 1))
        ko('combien : la probabilité de l\'énoncé n\'est pas dans ]0 ; 1[');
      if (q.reponse !== Math.round(q.reponse) || q.reponse <= 0)
        ko('combien : la réponse attendue n\'est pas un entier positif (' + q.reponse + ')');
      var mtot = /en <b>(\d+) secteurs de même angle<\/b>|contient <b>(\d+) jetons<\/b>/.exec(e);
      if (mtot) {
        // on connaît le total : la réponse est le nombre de cas favorables
        var T = +(mtot[1] || mtot[2]);
        if (Math.abs(q.reponse - T * p.n / p.d) > 1e-9)
          ko('combien : ' + T + ' × ' + p.n + '/' + p.d + ' = ' + (T * p.n / p.d) +
             ', on attend ' + q.reponse);
        if (T * p.n % p.d !== 0)
          ko('combien : ' + T + ' × ' + p.n + '/' + p.d + ' ne tombe pas sur un entier');
      } else {
        // on connaît les cas favorables : la réponse est le total
        var mfa = /<b>(\d+) boules [a-zéè]+<\/b>/.exec(e);
        if (!mfa) { ko('combien : le nombre de cas favorables est illisible'); continue; }
        var F = +mfa[1];
        if (Math.abs(q.reponse - F * p.d / p.n) > 1e-9)
          ko('combien : ' + F + ' boules pour une probabilité de ' + p.n + '/' + p.d +
             ' donnent ' + (F * p.d / p.n) + ' boules en tout, on attend ' + q.reponse);
        if (q.reponse <= F)
          ko('combien : le total (' + q.reponse + ') ne dépasse pas les ' + F +
             ' boules favorables');
      }
      continue;
    }

    /* --- 5. la somme des probabilités vaut 1 -------------------------- */
    if (fam === 'somme1') {
      var don = fracs(e);
      if (!don.length) { ko('somme1 : aucune probabilité dans l\'énoncé'); continue; }
      var dd = don[0].d;
      var cumul = 0, coherent = true;
      don.forEach(function (fr) {
        if (fr.d !== dd) coherent = false;
        cumul += fr.n;
      });
      if (!coherent)
        ko('somme1 : les probabilités de l\'énoncé n\'ont pas le même dénominateur');
      if (cumul >= dd)
        ko('somme1 : les probabilités données font déjà ' + cumul + '/' + dd +
           ' — il ne reste rien pour la dernière issue');
      if (Math.abs(valeur(q.reponse) - (dd - cumul) / dd) > 1e-12)
        ko('somme1 : il reste ' + (dd - cumul) + '/' + dd + ', on attend ' +
           q.reponse.n + '/' + q.reponse.d);
      if (corr.indexOf('vaut toujours <b>1</b>') < 0)
        ko('somme1 : la correction n\'énonce pas que le total des probabilités fait 1');
      // et la règle ne doit PAS être présentée comme une conséquence de
      // l'équiprobabilité : elle vaut de toute expérience
      if (!/ne demande <i>pas<\/i>|ne dépend pas de/.test(corr))
        ko('somme1 : la correction ne dit pas que cette règle vaut sans équiprobabilité');
      continue;
    }

    /* --- 6. l'intruse non équiprobable -------------------------------- */
    if (fam === 'equiprobable') {
      if (q.choix.length !== 4)
        ko('equiprobable : ' + q.choix.length + ' propositions au lieu de quatre — on ' +
           'devinerait trop souvent');
      /* La bonne réponse doit être une expérience où quelque chose distingue
         les issues ; les trois autres, des expériences où rien ne les
         distingue. Le contrôle les reconnaît par ce qui est écrit. */
      var estMauvaise = function (t) {
        return /somme des deux nombres|jetons rouges et 2 jetons bleus|demi-disque|pipé|pleuvra/
          .test(t);
      };
      if (!estMauvaise(q.choix[q.correct]))
        ko('equiprobable : la proposition cochée « ' + txt(q.choix[q.correct]).slice(0, 40) +
           '… » a pourtant des issues équiprobables');
      var mauvaises = q.choix.filter(estMauvaise).length;
      if (mauvaises !== 1)
        ko('equiprobable : ' + mauvaises + ' propositions ne sont pas équiprobables — une ' +
           'seule est attendue');
      if (q.etapes.length < 5)
        ko('equiprobable : la correction n\'explique pas chacune des quatre propositions');
      continue;
    }

    /* --- 7. la somme de deux dés -------------------------------------- */
    if (fam === 'deuxdes') {
      var ms = /somme ⁠?égale à (\d+)/.exec(e) || /égale à (\d+)/.exec(e);
      if (!ms) { ko('deuxdes : la somme demandée est illisible'); continue; }
      var s = +ms[1];
      // les 36 couples, réénumérés ici : c'est exactement ce que la leçon
      // reproche de ne pas faire
      var att = 0;
      for (var a = 1; a <= 6; a++) {
        for (var b = 1; b <= 6; b++) if (a + b === s) att++;
      }
      if (Math.abs(valeur(q.reponse) - att / 36) > 1e-12)
        ko('deuxdes : la somme ' + s + ' se fait de ' + att + ' façons sur 36, on attend ' +
           q.reponse.n + '/' + q.reponse.d);
      if (Math.abs(valeur(q.reponse) - 1 / 11) < 1e-12)
        ko('deuxdes : la réponse attendue est 1/11 — c\'est précisément l\'erreur');
      if (corr.indexOf('36 couples équiprobables') < 0)
        ko('deuxdes : la correction ne redescend pas jusqu\'aux 36 couples');
      var listes = (corr.match(/\d\+\d/g) || []).length;
      if (listes !== att)
        ko('deuxdes : la correction énumère ' + listes + ' couples pour ' + att + ' attendus');
      continue;
    }
  }
}

/* Les huit familles doivent toutes sortir : une famille qui ne tombe jamais est
   du code mort, et le palier qui devait la proposer ne propose rien. */
['issue', 'evenement', 'couleurs', 'combien', 'somme1', 'equiprobable', 'deuxdes',
 'proprietes'].forEach(function (f) {
  if (!vus[f]) ko('la famille « ' + f + ' » n\'est jamais tirée');
});

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE PROBABILITÉ EST CELLE DE LA SITUATION DÉCRITE DANS L\'ÉNONCÉ');
