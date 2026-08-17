/* La leçon « Attribuer des probabilités : l'équiprobabilité » (5ème).
 *
 * Cette leçon ne montre pas une figure : elle ANNONCE des nombres — 1/6, 1/2,
 * 1/8, 4/10, 6/36. Personne, en classe, ne peut la contredire d'un calcul. Le
 * contrôle refait donc tout de son côté, à partir de ce qui est AFFICHÉ.
 *
 * LA SOMME DES PARTS. C'est le cœur du raisonnement : les probabilités des
 * issues doivent faire exactement 1. Le contrôle les relit une par une dans les
 * étiquettes affichées et les additionne en fractions, sans passer par les
 * décimaux — 6 × 0,167 ne fait pas 1, et une leçon qui affirmerait le contraire
 * enseignerait une approximation à la place d'une égalité.
 *
 * LA BARRE. Elle est le raisonnement lui-même : autant de cellules que de parts
 * élémentaires, et les groupes proportionnels aux poids. Le contrôle compte les
 * cellules et relit les `flex:` : si la barre disait autre chose que les
 * étiquettes, la démonstration visuelle contredirait le calcul.
 *
 * L'ÉVÉNEMENT. Sa probabilité doit valoir le nombre de parts qu'il ramasse
 * divisé par le total, la simplification doit être juste et irréductible, et le
 * pourcentage tomber sur la même valeur. Les parts mises en évidence dans la
 * barre doivent être exactement celles-là.
 *
 * L'ANNONCE CONFRONTÉE AUX LANCERS. C'est la vérification qu'aucune relecture
 * ne remplace : on lance vraiment, beaucoup, et la fréquence de chaque issue
 * doit rejoindre la probabilité annoncée. Si le tirage des deux dés passait un
 * jour par la somme, l'écran serait identique et la leçon enseignerait le
 * contraire de ce qu'elle affirme — ici, l'écart sauterait aux yeux.
 *
 * LE PIÈGE. Pour « Deux dés », la leçon doit montrer le partage en onze parts
 * égales ET le barrer : c'est la réponse spontanée, et une leçon qui se
 * contenterait de donner la bonne la laisserait intacte.
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
load('lessons/5eme/probabilites-equiprobabilite.js');

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
function ko(m) { if (err.length < 25 && err.indexOf(m) < 0) err.push(m); }
if (!mv._cache) ko('la figure n\'est pas masquée : cette leçon n\'en a pas');

var bloc = extras.children[0];
if (!bloc) throw new Error('le panneau n\'a pas été ajouté');
['eqp-choix', 'eqp-dit', 'eqp-lot-boite', 'eqp-faux', 'eqp-barre-boite', 'eqp-calc',
 'eqp-freq', 'eqp-etapes'].forEach(function (c) {
  if (!bloc._sous[c]) ko('le panneau n\'a pas de « ' + c + ' »');
});
var elChoix = bloc._sous['eqp-choix'], elLot = bloc._sous['eqp-lot-boite'];
var elFaux = bloc._sous['eqp-faux'], elBarre = bloc._sous['eqp-barre-boite'];
var elCalc = bloc._sous['eqp-calc'], elFreq = bloc._sous['eqp-freq'];
var elEtapes = bloc._sous['eqp-etapes'];

/* ------------------------------------------------------------------ */
/* De quoi relire ce qui est affiché                                   */
/* ------------------------------------------------------------------ */
function pgcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function jouerTout() {
  controles.play.onClick();
  mv._steps.forEach(function (s) { s.step(1); });
}
function phrases() {
  return (elEtapes.innerHTML.match(/<p class="eqp-dit-p">([\s\S]*?)<\/p>/g) || [])
    .map(function (p) { return p.replace(/<[^>]+>/g, ''); });
}
/* Toutes les fractions d'un morceau de HTML, dans l'ordre, sous forme {n, d}.
   Les fractions « en mots » (issues favorables / issues possibles) sont
   ignorées : ce ne sont pas des nombres. */
function fractions(html) {
  var out = [], m;
  var re = /<span class="eqp-frac"><span class="eqp-h">([^<]*)<\/span><span class="eqp-b">([^<]*)<\/span><\/span>/g;
  while ((m = re.exec(html))) {
    if (/^\d+$/.test(m[1]) && /^\d+$/.test(m[2])) out.push({ n: +m[1], d: +m[2] });
  }
  return out;
}
/* Les issues affichées : leur appartenance à l'événement, et la probabilité
   écrite dessous. */
function issuesAffichees() {
  return elLot.innerHTML.split('<div class="eqp-issue').slice(1).map(function (bout) {
    var f = fractions(bout);
    return { dedans: /^[^>]*dedans/.test(bout), p: f[0] || null };
  });
}
/* La barre : un groupe par issue, avec son `flex:` (le poids) et ses cellules
   (les parts élémentaires). */
function groupesBarre(html) {
  return (html || elBarre.innerHTML).split('<div class="eqp-groupe').slice(1)
    .map(function (bout) {
      var f = /style="flex:(\d+)"/.exec(bout);
      return { poids: f ? +f[1] : 0,
               dedans: /^[^>]*dedans/.test(bout),
               // « eqp-cells » est le conteneur, pas une part : on ne compte
               // que les cellules elles-mêmes
               cellules: (bout.match(/<div class="eqp-cell(?: ouverte)?">/g) || []).length,
               ouvertes: (bout.match(/<div class="eqp-cell ouverte">/g) || []).length };
    });
}
function pourcents(html) {
  return (html.match(/(\d+(?:,\d+)?) %/g) || [])
    .map(function (s) { return parseFloat(s.replace(',', '.')); });
}

/* ------------------------------------------------------------------ */
/* Les expériences, parcourues comme le ferait une élève               */
/* ------------------------------------------------------------------ */
var NOMS = elChoix.children.map(function (b) { return b.innerHTML; });
if (NOMS.length !== 5) ko('on attend cinq expériences, il y en a ' + NOMS.length);
['Un dé', 'Une pièce', 'La roue', 'Le sac de jetons', 'Deux dés'].forEach(function (n) {
  if (NOMS.indexOf(n) < 0) ko('l\'expérience « ' + n + ' » manque');
});
/* Ce que chaque expérience doit annoncer — écrit ici à la main, exprès : c'est
   la seule façon de vérifier que la leçon dit bien 1/6, 1/2, 1/8, 1/10. */
var ATTENDU = {
  'Un dé':            { issues: 6,  parts: 6,  p: [1, 6] },
  'Une pièce':        { issues: 2,  parts: 2,  p: [1, 2] },
  'La roue':          { issues: 8,  parts: 8,  p: [1, 8] },
  'Le sac de jetons': { issues: 10, parts: 10, p: [1, 10] },
  'Deux dés':         { issues: 11, parts: 36, p: null }   // pas d'équiprobabilité
};

NOMS.forEach(function (nom, k) {
  var att = ATTENDU[nom];
  if (!att) return;
  elChoix.children[k].onclick();
  jouerTout();
  nb++;

  /* --- 1. les issues et leurs probabilités -------------------------- */
  var vues = issuesAffichees();
  if (vues.length !== att.issues)
    ko(nom + ' : ' + vues.length + ' issues affichées au lieu de ' + att.issues);
  var mc = /Il y a <b>(\d+)<\/b> issues/.exec(elLot.innerHTML);
  if (!mc) ko(nom + ' : le nombre d\'issues n\'est pas annoncé');
  else if (+mc[1] !== vues.length)
    ko(nom + ' : on annonce ' + mc[1] + ' issues alors qu\'on en dessine ' + vues.length);

  /* La somme des probabilités affichées doit valoir 1 — en FRACTIONS. */
  var den = 0, num = 0, manque = 0;
  vues.forEach(function (v) {
    if (!v.p) { manque++; return; }
    if (!den) den = v.p.d;
    if (v.p.d !== den) ko(nom + ' : deux issues sont données sur des dénominateurs ' +
                          'différents (' + den + ' et ' + v.p.d + ')');
    num += v.p.n;
  });
  if (manque) ko(nom + ' : ' + manque + ' issue(s) n\'affichent pas leur probabilité');
  else if (num !== den)
    ko(nom + ' : les probabilités des issues font ' + num + '/' + den + ' au lieu de 1 — ' +
       'la certitude n\'est pas entièrement partagée');
  if (den !== att.parts)
    ko(nom + ' : les probabilités sont écrites sur ' + den + ' parts, on en attend ' +
       att.parts);
  if (att.p) {
    vues.forEach(function (v, i) {
      if (v.p && (v.p.n !== att.p[0] || v.p.d !== att.p[1]))
        ko(nom + ' : l\'issue n°' + (i + 1) + ' vaut ' + v.p.n + '/' + v.p.d +
           ' au lieu de ' + att.p[0] + '/' + att.p[1]);
    });
  }

  /* --- 2. la barre dit la même chose que les étiquettes -------------- */
  var g = groupesBarre();
  if (g.length !== att.issues)
    ko(nom + ' : la barre a ' + g.length + ' groupes pour ' + att.issues + ' issues');
  var cellules = g.reduce(function (s, x) { return s + x.cellules; }, 0);
  if (cellules !== att.parts)
    ko(nom + ' : la barre est coupée en ' + cellules + ' parts, on en attend ' + att.parts);
  var pasOuvertes = g.reduce(function (s, x) { return s + (x.cellules - x.ouvertes); }, 0);
  if (pasOuvertes) ko(nom + ' : ' + pasOuvertes + ' part(s) de la barre ne sont pas ' +
                      'coupées à la fin de l\'animation');
  g.forEach(function (x, i) {
    if (x.poids !== x.cellules)
      ko(nom + ' : un groupe occupe ' + x.poids + ' de largeur pour ' + x.cellules +
         ' cellules — la barre ne serait pas à l\'échelle');
    if (vues[i] && vues[i].p && vues[i].p.n !== x.poids)
      ko(nom + ' : l\'issue n°' + (i + 1) + ' annonce ' + vues[i].p.n + '/' + vues[i].p.d +
         ' mais occupe ' + x.poids + ' part(s) de la barre');
  });

  /* --- 3. l'événement : parts ramassées, fraction, simplification ---- */
  for (var t = 0; t < 5; t++) {
    var vus = issuesAffichees(), gb = groupesBarre();
    var favo = 0;
    vus.forEach(function (v, i) { if (v.dedans) favo += (gb[i] ? gb[i].poids : 0); });
    if (!favo) ko(nom + ' : l\'événement ne ramasse aucune part — il serait impossible');
    if (favo === att.parts)
      ko(nom + ' : l\'événement ramasse toutes les parts — il serait certain');
    gb.forEach(function (x, i) {
      if (vus[i] && x.dedans !== vus[i].dedans)
        ko(nom + ' : une issue est mise en avant dans la liste mais pas dans la barre');
    });
    var htmlEvt = elCalc.innerHTML.slice(elCalc.innerHTML.indexOf('<div class="eqp-evt">'));
    if (htmlEvt.indexOf('eqp-evt') < 0) { ko(nom + ' : aucun événement n\'est calculé'); break; }
    var mf = /<b>(\d+)<\/b> \w+ favorable/.exec(htmlEvt);
    if (!mf) ko(nom + ' : le nombre de cas favorables n\'est pas annoncé');
    else if (+mf[1] !== favo)
      ko(nom + ' : on annonce ' + mf[1] + ' cas favorables, ' + favo + ' parts sont ' +
         'mises en avant');
    var fr = fractions(htmlEvt);
    if (!fr.length) ko(nom + ' : la probabilité de l\'événement n\'est pas écrite');
    else {
      var brute = fr[0];
      if (brute.n !== favo || brute.d !== att.parts)
        ko(nom + ' : P(événement) est écrite ' + brute.n + '/' + brute.d + ' au lieu de ' +
           favo + '/' + att.parts);
      var gg = pgcd(favo, att.parts);
      if (gg > 1) {
        var simple = fr[1];
        if (!simple || simple.n !== favo / gg || simple.d !== att.parts / gg)
          ko(nom + ' : ' + favo + '/' + att.parts + ' n\'est pas simplifiée en ' +
             (favo / gg) + '/' + (att.parts / gg));
      } else if (fr.length > 1) {
        ko(nom + ' : ' + favo + '/' + att.parts + ' est déjà irréductible, une seconde ' +
           'écriture est affichée');
      }
      var pc = pourcents(htmlEvt);
      var attPc = Math.round(favo / att.parts * 1000) / 10;
      if (!pc.length || Math.abs(pc[pc.length - 1] - attPc) > 0.051)
        ko(nom + ' : le pourcentage annoncé ne vaut pas ' + attPc + ' %');
    }
    controles.autreEvt.onClick();
    mv._steps.forEach(function (s) { s.step(1); });
  }

  /* --- 4. la règle et les bornes sont dites ------------------------- */
  var tout = phrases().join(' ') + ' ' + elCalc.innerHTML.replace(/<[^>]+>/g, ' ');
  ['équiprobable', 'certain', 'impossible', 'favorables'].forEach(function (mot) {
    if (tout.indexOf(mot) < 0) ko(nom + ' : le mot « ' + mot + ' » n\'apparaît nulle part');
  });
  var vusP = {};
  phrases().forEach(function (p) {
    if (vusP[p]) ko(nom + ' : une phrase est affichée deux fois');
    vusP[p] = 1;
  });

  /* --- 5. rejouer redonne le même écran ----------------------------- */
  var ecran = elLot.innerHTML + '|' + elBarre.innerHTML + '|' + elCalc.innerHTML + '|' +
              elFaux.innerHTML + '|' + elEtapes.innerHTML;
  controles.play.onClick();
  mv._steps.forEach(function (s) { s.step(0); s.step(0.5); s.step(1); });
  if (elLot.innerHTML + '|' + elBarre.innerHTML + '|' + elCalc.innerHTML + '|' +
      elFaux.innerHTML + '|' + elEtapes.innerHTML !== ecran)
    ko(nom + ' : rejouer l\'animation ne redonne pas le même écran');

  /* --- 6. la remise à zéro ------------------------------------------ */
  controles.reset.onClick();
  if (elLot.innerHTML || elBarre.innerHTML || elCalc.innerHTML || elFaux.innerHTML ||
      elFreq.innerHTML)
    ko(nom + ' : la remise à zéro laisse quelque chose à l\'écran');
});

/* ------------------------------------------------------------------ */
/* L'annonce confrontée aux lancers                                    */
/* ------------------------------------------------------------------ */
/* Une probabilité annoncée n'engage à rien tant qu'on n'a pas lancé. On lance
   donc pour de bon — 30 séries de 300 — et la fréquence moyenne de chaque
   issue doit rejoindre le nombre affiché sous elle. C'est ce qui attraperait un
   tirage qui ne correspondrait pas au partage annoncé : pour deux dés, tirer la
   somme au lieu des deux dés donnerait 9 % partout et 1/36 affiché. */
NOMS.forEach(function (nom, k) {
  var att = ATTENDU[nom];
  if (!att) return;
  elChoix.children[k].onclick();
  jouerTout();
  var vues = issuesAffichees();
  var cumul = vues.map(function () { return 0; }), T = 30;
  for (var s = 0; s < T; s++) {
    controles.beaucoup.onClick();
    var cols = elFreq.innerHTML.split('<div class="eqp-col">').slice(1);
    if (cols.length !== vues.length) {
      ko(nom + ' : le graphique a ' + cols.length + ' barres pour ' + vues.length +
         ' issues');
      break;
    }
    var somme = 0;
    cols.forEach(function (c, i) {
      var mo = /<div class="eqp-obs">([\d,]+) %<\/div>/.exec(c);
      var mt = /<div class="eqp-theo">([\d,]+) %<\/div>/.exec(c);
      var obs = mo ? parseFloat(mo[1].replace(',', '.')) : NaN;
      var theo = mt ? parseFloat(mt[1].replace(',', '.')) : NaN;
      var attTheo = Math.round(vues[i].p.n / vues[i].p.d * 1000) / 10;
      if (Math.abs(theo - attTheo) > 0.051)
        ko(nom + ' : le graphique annonce ' + theo + ' % pour une issue à ' +
           vues[i].p.n + '/' + vues[i].p.d + ' (' + attTheo + ' %)');
      cumul[i] += obs / T;
      somme += obs;
    });
    if (Math.abs(somme - 100) > 1.5)
      ko(nom + ' : les fréquences font ' + Math.round(somme * 10) / 10 + ' % au total — ' +
         'des lancers tombent hors des issues annoncées');
    var mn = /Sur <b>(\d+)<\/b> lancers/.exec(elFreq.innerHTML);
    if (!mn || +mn[1] !== 300) ko(nom + ' : le nombre de lancers annoncé n\'est pas 300');
  }
  cumul.forEach(function (v, i) {
    var theo = vues[i].p.n / vues[i].p.d * 100;
    // 9000 lancers : l'écart-type d'une fréquence est sous 0,5 point ; 1,5
    // point d'écart ne s'explique plus par le hasard
    if (Math.abs(v - theo) > 1.5)
      ko(nom + ' : l\'issue n°' + (i + 1) + ' est annoncée à ' +
         Math.round(theo * 10) / 10 + ' % et sort ' + Math.round(v * 10) / 10 +
         ' % en moyenne sur ' + (300 * 30) + ' lancers');
  });
  nb++;
});

/* ------------------------------------------------------------------ */
/* Le piège des deux dés                                               */
/* ------------------------------------------------------------------ */
/* La leçon doit MONTRER le partage en onze parts égales avant de le barrer :
   c'est la réponse spontanée, et la donner d'emblée juste la laisserait
   intacte. */
var iDeux = NOMS.indexOf('Deux dés');
if (iDeux >= 0) {
  elChoix.children[iDeux].onclick();
  jouerTout();
  var faux = elFaux.innerHTML;
  if (!faux) ko('deux dés : le partage en onze parts égales n\'est jamais montré');
  else {
    var onze = groupesBarre(faux);
    if (onze.length !== 11)
      ko('deux dés : le faux partage montre ' + onze.length + ' parts au lieu de onze');
    if (faux.indexOf('✘') < 0 || !/faux|Non/.test(faux))
      ko('deux dés : le faux partage est montré mais jamais désigné comme faux');
  }
  /* Et les nombres du piège : 7 six fois plus probable que 2. */
  var vues2 = issuesAffichees();
  var p2 = vues2[0].p, p7 = vues2[5].p;
  if (!p2 || p2.n !== 1 || p2.d !== 36) ko('deux dés : P(2) n\'est pas 1/36');
  if (!p7 || p7.n !== 6 || p7.d !== 36) ko('deux dés : P(7) n\'est pas 6/36');
  var lignes = (elCalc.innerHTML.match(/<tr/g) || []).length;
  if (lignes < 13) ko('deux dés : le récapitulatif des onze sommes est incomplet (' +
                      lignes + ' lignes)');
  nb++;
}

print(nb + ' passages vérifiés : parts, fractions, simplifications et fréquences recalculées');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LA CERTITUDE EST PARTAGÉE SANS RESTE, ET CHAQUE NOMBRE ANNONCÉ SORT VRAIMENT');
