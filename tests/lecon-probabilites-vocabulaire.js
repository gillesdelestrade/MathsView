/* La leçon « Le vocabulaire des probabilités » (5ème).
 *
 * Une leçon sur le hasard doit être IRRÉPROCHABLE sur ce qu'elle affirme, parce
 * qu'aucun élève ne peut la contredire d'un calcul. Le contrôle refait donc
 * tout de son côté.
 *
 * L'UNIVERS. Les issues affichées doivent être exactement celles que
 * l'expérience peut produire — ni une de plus, ni une de moins. Le contrôle
 * s'en assure par les deux bouts, en faisant tourner les tirages :
 *   — aucune issue tirée ne doit manquer à la liste, faute de quoi la somme des
 *     fréquences affichées tomberait sous 100 % ;
 *   — aucune issue listée ne doit rester à zéro, faute de quoi elle serait
 *     annoncée possible sans l'être.
 * Une issue affichée mais impossible, ou possible mais oubliée, rendrait la
 * leçon fausse.
 *
 * LES ÉVÉNEMENTS. Chacun doit être une PARTIE de l'univers, non vide et non
 * pleine : un événement qui contiendrait toutes les issues serait certain, et
 * la leçon le présente comme un cas à part. Le verdict « réalisé » affiché doit
 * correspondre à l'appartenance de l'issue tirée.
 *
 * LE PIÈGE DES DEUX DÉS. La leçon affirme que les onze sommes ne sont pas
 * également probables. Le contrôle le vérifie sur un grand nombre de lancers :
 * 7 doit sortir nettement plus souvent que 2. Si un jour le tirage passait par
 * la somme au lieu des deux dés, la leçon enseignerait le contraire de ce
 * qu'elle affirme, sans que rien ne change à l'écran.
 *
 * LE REJEU. Le lancer est tiré d'une graine : rejouer doit redonner exactement
 * le même écran, sinon les phrases commenteraient un autre résultat que celui
 * qui est affiché.
 */
var window = this;
var clearTimeout = function () {};
var setTimeout = function (f) { f(); return 0; };

function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [], value: '', textContent: '',
            onclick: null, _sous: {},
            classList: { _l: [],
              add: function (c) { if (this._l.indexOf(c) < 0) this._l.push(c); },
              remove: function (c) { var i = this._l.indexOf(c); if (i >= 0) this._l.splice(i, 1); },
              contains: function (c) { return this._l.indexOf(c) >= 0; },
              toggle: function (c, v) { v ? this.add(c) : this.remove(c); } },
            appendChild: function (c) { this.children.push(c); return c; },
            querySelector: function (sel) { return this._sous[sel.replace('.', '')] || null; } };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) {
      e._html = v;
      if (v === '') e.children = [];
      var m, re = /class="([^"]+)"/g;
      while ((m = re.exec(v))) {
        m[1].split(' ').forEach(function (c) {
          if (!e._sous[c]) { var f = fauxEl('div'); f.className = c; e._sous[c] = f; }
        });
      }
    }
  });
  return e;
}
var document = { createElement: fauxEl };
window.document = document;

load('js/alea.js');
var MathsView = { lecon: null, register: function (l) { MathsView.lecon = l; }, fonctions: null };
window.MathsView = MathsView;
load('lessons/5eme/probabilites-vocabulaire.js');

var extras = fauxEl('div');
var controles = {};
var mv = {
  extras: extras,
  onCleanup: function () {},
  hideBoard: function () { mv._cache = true; },
  addControls: function (specs) { specs.forEach(function (s) { controles[s.id] = s; }); },
  createAnimator: function () {
    return { runSteps: function (steps) { mv._steps = steps; }, cancel: function () {} };
  }
};
MathsView.lecon.setup(null, mv);

var err = [], nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
if (!mv._cache) ko('la figure n\'est pas masquée : cette leçon n\'en a pas');

var bloc = extras.children[0];
if (!bloc) throw new Error('le panneau n\'a pas été ajouté');
var elChoix = bloc._sous['prb-choix'], elScene = bloc._sous['prb-scene'];
var elUniv = bloc._sous['prb-univers'], elEvt = bloc._sous['prb-evt'];
var elFreq = bloc._sous['prb-freq'], elEtapes = bloc._sous['prb-etapes'];
['prb-choix', 'prb-dit', 'prb-scene', 'prb-univers', 'prb-evt', 'prb-freq',
 'prb-etapes'].forEach(function (c) {
  if (!bloc._sous[c]) ko('le panneau n\'a pas de « ' + c + ' »');
});

function jouerTout() {
  controles.play.onClick();
  mv._steps.forEach(function (s) { s.step(1); });
}
function phrases() {
  return (elEtapes.innerHTML.match(/<p class="prb-dit-p">([\s\S]*?)<\/p>/g) || [])
    .map(function (p) { return p.replace(/<[^>]+>/g, ''); });
}
/* Les issues affichées, et leur état : dans l'événement, et/ou obtenue. */
function issuesAffichees() {
  return (elUniv.innerHTML.match(/<div class="prb-issue[^"]*">/g) || [])
    .map(function (d) {
      return { dedans: /dedans/.test(d), obtenue: /obtenue/.test(d) };
    });
}

/* ------------------------------------------------------------------ */
/* Les expériences, relues dans la leçon elle-même                     */
/* ------------------------------------------------------------------ */
/* On n'a pas accès à la table interne : on passe par les boutons, comme une
   élève. Le nom du bouton est la seule clé dont on dispose. */
var NOMS = elChoix.children.map(function (b) { return b.innerHTML; });
if (NOMS.length !== 5) ko('on attend cinq expériences, il y en a ' + NOMS.length);
['Un dé', 'Deux dés', 'Une pièce', 'Le loto', 'Pierre-feuille-ciseaux'].forEach(function (n) {
  if (NOMS.indexOf(n) < 0) ko('l\'expérience « ' + n + ' » manque');
});

/* Combien d'issues chaque expérience doit annoncer — recalculé ici, pas relu. */
var ATTENDU = { 'Un dé': 6, 'Deux dés': 11, 'Une pièce': 2, 'Le loto': 20,
                'Pierre-feuille-ciseaux': 9 };

NOMS.forEach(function (nom, k) {
  elChoix.children[k].onclick();
  jouerTout();
  nb++;

  /* --- 1. l'univers affiché ---------------------------------------- */
  var vues = issuesAffichees();
  if (ATTENDU[nom] && vues.length !== ATTENDU[nom])
    ko(nom + ' : ' + vues.length + ' issues affichées au lieu de ' + ATTENDU[nom]);
  var mc = /Il y a <b>(\d+)<\/b> issues/.exec(elUniv.innerHTML);
  if (!mc) ko(nom + ' : le nombre d\'issues n\'est pas annoncé');
  else if (+mc[1] !== vues.length)
    ko(nom + ' : on annonce ' + mc[1] + ' issues alors qu\'on en dessine ' + vues.length);

  /* --- 2. l'événement est une partie stricte de l'univers ----------- */
  var dedans = vues.filter(function (v) { return v.dedans; }).length;
  var me = /Il regroupe <b>(\d+)<\/b> issue/.exec(elEvt.innerHTML);
  if (!me) ko(nom + ' : l\'événement n\'annonce pas combien d\'issues il regroupe');
  else if (+me[1] !== dedans)
    ko(nom + ' : l\'événement annonce ' + me[1] + ' issues, ' + dedans + ' sont colorées');
  if (!dedans) ko(nom + ' : l\'événement ne regroupe aucune issue — il serait impossible');
  if (dedans === vues.length)
    ko(nom + ' : l\'événement regroupe TOUTES les issues — il serait certain, or la ' +
       'leçon présente ce cas à part');

  /* --- 3. le verdict suit l'appartenance --------------------------- */
  var obtenue = vues.filter(function (v) { return v.obtenue; });
  if (obtenue.length !== 1)
    ko(nom + ' : ' + obtenue.length + ' issue(s) marquée(s) comme obtenue');
  var ditRealise = /il est <b>réalisé<\/b>/.test(elEvt.innerHTML);
  var ditPas = /n'est <b>pas réalisé<\/b>/.test(elEvt.innerHTML);
  if (ditRealise === ditPas) ko(nom + ' : le verdict ne tranche pas');
  else if (obtenue.length === 1 && ditRealise !== obtenue[0].dedans)
    ko(nom + ' : l\'issue obtenue est ' + (obtenue[0].dedans ? '' : 'hors ') +
       'de l\'événement, mais on annonce le contraire');

  /* --- 4. les trois mots sont bien tous dits ------------------------ */
  var tout = phrases().join(' ');
  ['expérience aléatoire', 'issue', 'événement', 'réalisé', 'certain', 'impossible']
    .forEach(function (mot) {
      if (tout.indexOf(mot) < 0) ko(nom + ' : le mot « ' + mot + ' » n\'est jamais prononcé');
    });
  var vus = {};
  phrases().forEach(function (p) {
    if (vus[p]) ko(nom + ' : une phrase est affichée deux fois');
    vus[p] = 1;
  });

  /* --- 5. rejouer redonne le même écran ----------------------------- */
  var ecran = elScene.innerHTML + '|' + elUniv.innerHTML + '|' + elEvt.innerHTML + '|' +
              elEtapes.innerHTML;
  controles.play.onClick();
  mv._steps.forEach(function (s) { s.step(0); s.step(0.5); s.step(1); });
  if (elScene.innerHTML + '|' + elUniv.innerHTML + '|' + elEvt.innerHTML + '|' +
      elEtapes.innerHTML !== ecran)
    ko(nom + ' : rejouer l\'animation ne redonne pas le même écran');

  /* --- 6. les autres événements tiennent aussi ---------------------- */
  for (var t = 0; t < 4; t++) {
    controles.autreEvt.onClick();
    mv._steps.forEach(function (s) { s.step(1); });
    var v2 = issuesAffichees();
    var d2 = v2.filter(function (x) { return x.dedans; }).length;
    if (!d2 || d2 === v2.length)
      ko(nom + ' : un événement proposé est vide ou plein — impossible ou certain');
  }

  /* --- 7. les fréquences : toutes les issues, et rien d'autre ------- */
  controles.beaucoup.onClick();
  var cols = (elFreq.innerHTML.match(/<div class="prb-col">/g) || []).length;
  if (cols !== vues.length)
    ko(nom + ' : le graphique a ' + cols + ' barres pour ' + vues.length + ' issues');
  var pcs = (elFreq.innerHTML.match(/<div class="prb-pc">([\d,]+) %<\/div>/g) || [])
    .map(function (d) { return parseFloat(d.replace(/<[^>]+>/g, '').replace(',', '.')); });
  var somme = pcs.reduce(function (a, b) { return a + b; }, 0);
  if (Math.abs(somme - 100) > 1.5)
    ko(nom + ' : les fréquences font ' + Math.round(somme * 10) / 10 + ' % au total — ' +
       'des lancers tombent en dehors des issues annoncées');
  var mn = /Sur <b>(\d+)<\/b> lancers/.exec(elFreq.innerHTML);
  if (!mn || +mn[1] !== 300) ko(nom + ' : le nombre de lancers annoncé n\'est pas 300');
  /* Et l'autre bout : une issue annoncée possible doit finir par sortir. Sur
     300 lancers, la plus rare de toutes nos expériences (2 avec deux dés) est
     attendue huit fois — un zéro signalerait une issue listée à tort. */
  var jamais = pcs.filter(function (v) { return v === 0; }).length;
  if (jamais)
    ko(nom + ' : ' + jamais + ' issue(s) affichée(s) ne sortent jamais en 300 lancers — ' +
       'elles sont annoncées possibles sans l\'être');

  /* --- 8. la remise à zéro ------------------------------------------ */
  controles.reset.onClick();
  if (elUniv.innerHTML || elEvt.innerHTML || elFreq.innerHTML)
    ko(nom + ' : la remise à zéro laisse quelque chose à l\'écran');
  if (!phrases().length === false) ko(nom + ' : la remise à zéro laisse des phrases');
});

/* ------------------------------------------------------------------ */
/* Le piège des deux dés, vérifié sur beaucoup de lancers              */
/* ------------------------------------------------------------------ */
/* La leçon AFFIRME que les onze sommes ne sont pas également probables. Si le
   tirage passait un jour par la somme directement, l'écran serait identique et
   la leçon enseignerait le contraire de ce qu'elle dit. */
var iDeux = NOMS.indexOf('Deux dés');
if (iDeux >= 0) {
  elChoix.children[iDeux].onclick();
  var sept = 0, deux = 0, tours = 30;
  for (var r = 0; r < tours; r++) {
    controles.beaucoup.onClick();
    controles.relancer.onClick();          // change la graine, donc l'échantillon
    var lus = (elFreq.innerHTML.match(/<div class="prb-pc">([\d,]+) %<\/div>/g) || [])
      .map(function (d) { return parseFloat(d.replace(/<[^>]+>/g, '').replace(',', '.')); });
    if (lus.length === 11) { deux += lus[0]; sept += lus[5]; }
  }
  var mSept = sept / tours, mDeux = deux / tours;
  if (!(mSept > mDeux * 3))
    ko('deux dés : 7 sort ' + Math.round(mSept * 10) / 10 + ' % et 2 sort ' +
       Math.round(mDeux * 10) / 10 + ' % — la leçon affirme pourtant que 7 est bien plus ' +
       'fréquent, et le tirage doit passer par les deux dés');
  if (Math.abs(mSept - 16.7) > 3)
    ko('deux dés : 7 devrait sortir près d\'une fois sur six (16,7 %), on observe ' +
       Math.round(mSept * 10) / 10 + ' %');
}

/* Et l'inverse pour une expérience équiprobable : le dé simple doit rester plat. */
var iUn = NOMS.indexOf('Un dé');
if (iUn >= 0) {
  elChoix.children[iUn].onclick();
  var cumul = [0, 0, 0, 0, 0, 0], T = 30;
  for (var u = 0; u < T; u++) {
    controles.beaucoup.onClick();
    controles.relancer.onClick();
    var l6 = (elFreq.innerHTML.match(/<div class="prb-pc">([\d,]+) %<\/div>/g) || [])
      .map(function (d) { return parseFloat(d.replace(/<[^>]+>/g, '').replace(',', '.')); });
    if (l6.length === 6) l6.forEach(function (v, i) { cumul[i] += v / T; });
  }
  cumul.forEach(function (v, i) {
    if (Math.abs(v - 100 / 6) > 2.5)
      ko('un dé : la face ' + (i + 1) + ' sort ' + Math.round(v * 10) / 10 +
         ' % en moyenne, loin des 16,7 % attendus — le dé n\'est pas équilibré');
  });
}

print(nb + ' expériences vérifiées, univers, événements et fréquences recalculés');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE ISSUE AFFICHÉE EST POSSIBLE, CHAQUE ÉVÉNEMENT EN EST UNE PARTIE');
