/* Les exercices « Le vocabulaire des probabilités » (5ème).
 *
 * Le contrôle ne peut pas relire un dessin ici : tout est dans le texte. Il
 * reconstruit donc l'univers à partir de l'énoncé — le nombre de faces, de
 * boules, de cartes — et refait les comptages avec son propre code.
 *
 * Ce qu'il refuse :
 *
 *   — un univers mal compté. « Deux pièces » vaut QUATRE, « deux dés » ONZE,
 *     « pierre-feuille-ciseaux » NEUF. Ce sont les trois endroits où l'on se
 *     trompe, et ils sont vérifiés nommément.
 *
 *   — un événement qui ne serait pas une partie stricte de l'univers là où la
 *     question demande de compter : à zéro il serait impossible, au complet il
 *     serait certain, et dans les deux cas la question changerait de sens.
 *
 *   — une question à cocher où tout cocher, ou ne rien cocher, suffirait. Dans
 *     « realise », il doit toujours y avoir au moins un événement réalisé ET au
 *     moins un qui ne l'est pas.
 *
 *   — une correction qui annonce un nombre différent de la liste qu'elle
 *     affiche juste au-dessus : le nombre doit être la longueur de la liste,
 *     jamais un chiffre écrit à la main.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/probabilites-vocabulaire.js');

var err = [], vus = {}, nb = 0, univers = {};
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }

/* ------------------------------------------------------------------ */
/* Reconstruire l'univers à partir de la phrase de l'énoncé            */
/* ------------------------------------------------------------------ */
/* Le contrôle ne fait confiance qu'au texte : c'est ce qu'une élève lit. */
function taille(enonce) {
  var m;
  if ((m = /dé à <b>(\d+) faces<\/b>/.exec(enonce))) return { n: +m[1], nom: 'dé' };
  if ((m = /<b>(\d+) boules<\/b>/.exec(enonce))) return { n: +m[1], nom: 'sac' };
  if ((m = /<b>(\d+) cartes<\/b>/.exec(enonce))) return { n: +m[1], nom: 'cartes' };
  if (/lance une <b>pièce<\/b>/.test(enonce)) return { n: 2, nom: 'pièce' };
  if (/lance <b>deux pièces<\/b>/.test(enonce)) return { n: 4, nom: 'deux pièces' };
  if (/lance <b>deux dés<\/b>/.test(enonce)) return { n: 11, nom: 'deux dés' };
  if (/pierre-feuille-ciseaux/.test(enonce)) return { n: 9, nom: 'pfc' };
  return null;
}
/* Les listes en accolades que les corrections affichent. */
function accolades(txt) {
  var out = [], m, re = /\{ ([^}]*) \}/g;
  while ((m = re.exec(txt))) out.push(m[1].split(' ; '));
  return out;
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 6491 + g), palier);
    nb++;
    var fam = q.type === 'vraifaux' ? 'proprietes'
            : /est une expérience aléatoire. Laquelle/.test(q.enonce) ? 'experience'
            : /Combien cette expérience a-t-elle d'issues/.test(q.enonce) ? 'issues'
            : /Combien d'issues cet événement regroupe/.test(q.enonce) ? 'combien'
            : /Coche tous les événements/.test(q.enonce) ? 'realise'
            : /Choisis le mot juste/.test(q.enonce) ? 'nature'
            : 'certain';
    vus[fam] = (vus[fam] || 0) + 1;

    if (!q.etapes || q.etapes.length < 2) ko(fam + ' : correction trop courte');
    if (q.type === 'qcm') {
      if (q.correct < 0) ko(fam + ' : la bonne réponse n\'est pas dans la liste');
      var deja = {};
      q.choix.forEach(function (c) {
        if (deja[c]) ko(fam + ' : deux propositions identiques');
        deja[c] = 1;
      });
      if (q.choix.length < 3) ko(fam + ' : moins de trois propositions');
    }
    if (q.type === 'nombre' && (!isFinite(q.reponse) || q.reponse !== Math.round(q.reponse)))
      ko(fam + ' : la réponse n\'est pas un entier (' + q.reponse + ')');

    /* --- l'expérience aléatoire --------------------------------------- */
    if (fam === 'experience') {
      // la bonne réponse doit être une action dont le résultat est imprévisible
      var bon = q.choix[q.correct];
      if (!/Lancer|Tirer|Faire tourner/.test(bon))
        ko('experience : la réponse cochée « ' + bon + ' » n\'a rien d\'aléatoire');
      var aleas = q.choix.filter(function (c) {
        return /Lancer|Tirer|Faire tourner/.test(c);
      }).length;
      if (aleas !== 1)
        ko('experience : ' + aleas + ' propositions sont aléatoires — une seule est attendue');
      continue;
    }
    if (fam === 'proprietes') continue;

    var u = taille(q.enonce);
    if (!u) { ko(fam + ' : l\'expérience de l\'énoncé est méconnaissable'); continue; }
    univers[u.nom] = u.n;

    /* --- combien d'issues --------------------------------------------- */
    if (fam === 'issues') {
      if (q.reponse !== u.n)
        ko('issues : « ' + u.nom + ' » a ' + u.n + ' issues, on attend ' + q.reponse);
      // la correction doit montrer l'univers, et il doit être cohérent
      var lots = accolades(q.etapes.join(' '));
      if (!lots.length) ko('issues : la correction ne montre pas les issues');
      else if (lots[0].indexOf('…') < 0 && lots[0].length !== u.n)
        ko('issues : la correction liste ' + lots[0].length + ' issues pour ' + u.n);
      continue;
    }

    /* --- combien d'issues dans l'événement ----------------------------- */
    if (fam === 'combien') {
      if (q.reponse < 2)
        ko('combien : l\'événement ne regroupe que ' + q.reponse + ' issue — on ne compte rien');
      if (q.reponse >= u.n)
        ko('combien : l\'événement regroupe ' + q.reponse + ' issues sur ' + u.n +
           ' — il serait certain');
      // la liste montrée doit avoir exactement la longueur annoncée
      var l2 = accolades(q.etapes.join(' '));
      if (l2.length < 2) ko('combien : la correction ne montre pas les deux listes');
      else {
        var evt = l2[1];
        if (evt.indexOf('…') < 0 && evt.length !== q.reponse)
          ko('combien : la correction liste ' + evt.length + ' issues et en annonce ' +
             q.reponse);
      }
      var mf = /Il y en a <b>(\d+)<\/b>/.exec(q.etapes.join(' '));
      if (mf && +mf[1] !== q.reponse)
        ko('combien : la correction conclut ' + mf[1] + ' au lieu de ' + q.reponse);
      continue;
    }

    /* --- quels événements sont réalisés -------------------------------- */
    if (fam === 'realise') {
      if (!q.corrects || !q.corrects.length)
        ko('realise : aucun événement réalisé — ne rien cocher suffirait');
      if (q.corrects && q.corrects.length === q.choix.length)
        ko('realise : tous les événements sont réalisés — tout cocher suffirait');
      if (q.choix.length < 3) ko('realise : moins de trois événements proposés');
      var mi = /On a obtenu : <b>([^<]+)<\/b>/.exec(q.enonce);
      if (!mi) { ko('realise : l\'issue obtenue est illisible'); continue; }
      var issue = mi[1];
      /* Chaque ligne de correction montre les issues de l'événement : l'issue
         obtenue doit y figurer si et seulement si l'événement est coché. */
      var lignes = q.etapes.filter(function (e) { return /^[✔✘] «/.test(e); });
      if (lignes.length !== q.choix.length)
        ko('realise : ' + lignes.length + ' lignes de correction pour ' + q.choix.length +
           ' événements');
      lignes.forEach(function (l, k) {
        var coche = q.corrects.indexOf(k) >= 0;
        if ((l.charAt(0) === '✔') !== coche)
          ko('realise : la correction et la case cochée se contredisent sur « ' +
             q.choix[k] + ' »');
        var liste = accolades(l)[0];
        if (!liste) { ko('realise : une ligne de correction ne montre pas ses issues'); return; }
        var dedans = liste.indexOf(issue) >= 0;
        if (liste.indexOf('…') < 0 && dedans !== coche)
          ko('realise : « ' + issue + ' » ' + (dedans ? 'figure' : 'ne figure pas') +
             ' dans les issues de « ' + q.choix[k] + ' », mais la case dit le contraire');
      });
      continue;
    }

    /* --- issue, événement ou expérience -------------------------------- */
    if (fam === 'nature') {
      var att = q.choix[q.correct];
      if (['une issue', 'un événement', 'une expérience aléatoire'].indexOf(att) < 0)
        ko('nature : la réponse cochée n\'est pas un des trois mots');
      if (q.choix.length !== 3) ko('nature : il faut exactement les trois mots');
      var sujet = /<b>« ([\s\S]*?) »<\/b> est…/.exec(q.enonce);
      if (!sujet) { ko('nature : le sujet de la question est illisible'); continue; }
      /* Un événement doit VRAIMENT regrouper plusieurs issues, sinon ce serait
         une issue déguisée et la question n'aurait pas de réponse unique. */
      if (att === 'un événement') {
        var le = accolades(q.etapes.join(' '));
        var last = le[le.length - 1];
        if (last && last.indexOf('…') < 0 && last.length < 2)
          ko('nature : l\'« événement » ne regroupe qu\'une issue — c\'est une issue');
      }
      if (att === 'une issue' && /regroupe/.test(sujet[1]))
        ko('nature : le sujet annoncé comme une issue parle de regroupement');
      /* Le sujet doit être une tournure lisible. Fabriquer l'action en
         retirant le « On » d'une phrase donne « lance une pièce », qui ne se
         dit pas : une action s'annonce à l'infinitif. */
      if (att === 'une expérience aléatoire' &&
          !/^(lancer|tirer|retourner|jouer|faire|mélanger|choisir)\b/.test(sujet[1]))
        ko('nature : l\'action « ' + sujet[1] + ' » n\'est pas à l\'infinitif');
      continue;
    }

    /* --- certain, impossible, ni l'un ni l'autre ----------------------- */
    if (fam === 'certain') {
      var mot = q.choix[q.correct];
      var mcb = /Combien en regroupe l'événement[\s\S]*?<b>(\d+)<\/b>/.exec(q.etapes.join(' '));
      if (!mcb) { ko('certain : la correction ne dit pas combien d\'issues sont regroupées'); continue; }
      var c = +mcb[1];
      var attendu = c === 0 ? 'impossible'
                  : c === u.n ? 'certain' : 'ni certain, ni impossible';
      if (mot !== attendu)
        ko('certain : l\'événement regroupe ' + c + ' issues sur ' + u.n + ', il est donc « ' +
           attendu + ' », on coche « ' + mot + ' »');
      if (q.choix.length !== 3) ko('certain : il faut exactement les trois cas');
      continue;
    }
  }
}

/* Les trois univers qu'on compte mal doivent tous avoir été rencontrés, et
   comptés juste : c'est le cœur de ce que la leçon veut installer. */
[['deux pièces', 4], ['deux dés', 11], ['pfc', 9]].forEach(function (p) {
  if (univers[p[0]] === undefined) ko('l\'expérience « ' + p[0] + ' » n\'est jamais tirée');
  else if (univers[p[0]] !== p[1])
    ko('« ' + p[0] + ' » compte ' + univers[p[0]] + ' issues au lieu de ' + p[1]);
});

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE COMPTAGE EST CELUI DE L\'UNIVERS DÉCRIT DANS L\'ÉNONCÉ');
