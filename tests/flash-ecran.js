/* L'écran de la séance flash, joué pour de bon (js/flash.js).
 *
 * Le contrôle voisin, `flash-fondamentaux`, vérifie le barème, les faits et le
 * tirage — de la logique pure. Celui-ci fait autre chose : il MONTE l'écran
 * dans un DOM qui sait se relire, répond aux vingt questions, et regarde ce qui
 * a été produit. C'est le seul endroit où la mécanique est éprouvée de bout en
 * bout, et notamment ce qui fait tout le mode :
 *
 *   LA MESURE À LA PREMIÈRE FRAPPE. L'horloge est simulée. On laisse s'écouler
 *   une durée connue AVANT de taper le premier caractère, puis une autre, bien
 *   plus longue, entre la frappe et la validation. Le temps retenu doit être le
 *   premier, jamais la somme : c'est la latence de rappel qu'on note, pas la
 *   vitesse de frappe. Une régression ici ne se verrait sur aucun test de
 *   logique, et rendrait pourtant le seuil de trois secondes inatteignable.
 *
 *   LE RÉCAPITULATIF. Une ligne par question, dans l'ordre, avec la bonne
 *   réponse, la réponse DONNÉE telle qu'elle a été tapée, et le temps. Chaque
 *   cellule est confrontée à ce que le contrôle a lui-même saisi.
 *
 * Rien n'est simulé du côté de flash.js : c'est le vrai balisage qui est relu.
 */
var window = this;

/* ------------------------------------------------------------------ */
/* Un DOM minimal, mais qui sait se sérialiser                         */
/* ------------------------------------------------------------------ */
function El(tag) {
  var e = { tag: tag, className: '', _html: '', children: [], style: {}, value: '',
            type: '', inputMode: '', autocomplete: '', disabled: false, _h: {},
            appendChild: function (c) { e.children.push(c); return c; },
            addEventListener: function (ev, f) { e._h[ev] = f; },
            focus: function () {}, remove: function () {} };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) { e._html = v; e.children = []; }
  });
  e.html = function () {
    if (e.tag === 'input') return '<input class="' + e.className + '" value="' + e.value + '">';
    return '<' + e.tag + ' class="' + e.className + '">' + e._html +
           e.children.map(function (c) { return c.html(); }).join('') + '</' + e.tag + '>';
  };
  return e;
}
var document = { createElement: El };
window.document = document;

/* L'horloge est à nous : sans cela, les latences seraient toutes nulles et le
   barème ne serait jamais éprouvé. */
var HORLOGE = 1700000000000;
Date.now = function () { return HORLOGE; };

/* requestAnimationFrame DIFFÉRÉ, comme dans un navigateur. L'exécuter tout de
   suite appellerait focus() avant que les écouteurs de la question soient
   posés — le harnais mesurerait alors autre chose que la page réelle. */
var ATTENTE = [];
var requestAnimationFrame = function (f) { ATTENTE.push(f); };
var setTimeout = function (f) { f(); return 0; };

load('js/alea.js');
var GENS = [];
var MathsExos = { register: function (g) { GENS.push(g); },
                  liste: function () { return GENS.slice(); } };
window.MathsExos = MathsExos;
load('exos/6eme/tables.js');
load('exos/6eme/additions-20.js');

var ETATS = {};
var MathsProfils = {
  courant: function () { return 'p1'; },
  etat: function (id) {
    if (!ETATS[id]) ETATS[id] = { maitrises: {}, xp: 0, pieces: 0 };
    return ETATS[id];
  },
  setEtat: function (id, e) { ETATS[id] = e; },
  ajouteJournal: function () {}
};
window.MathsProfils = MathsProfils;
load('js/flash.js');

var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function sec(ms) { return (Math.round(ms / 100) / 10).toString().replace('.', ',') + ' s'; }

/* ------------------------------------------------------------------ */
/* Le scénario : des latences choisies pour couvrir les trois paliers  */
/* ------------------------------------------------------------------ */
var GRAINE = 20260816;
var FILE = MathsFlash.tirage('p1', 20, GRAINE);
if (FILE.length !== 20) throw new Error('le tirage n\'a pas donné vingt questions');

var LATENCES = [900, 1200, 2999, 3000, 4500, 5999, 6000, 8000, 1500, 2000,
                700, 3500, 6500, 1100, 4000, 2500, 900, 7000, 1800, 2200];
var FAUSSES = [3, 9, 14];          // ces questions-là, on répond à côté
var VIDES = [17];                  // et celle-là, on ne répond rien

var attendu = FILE.map(function (f, i) {
  var vide = VIDES.indexOf(i) >= 0;
  var faux = FAUSSES.indexOf(i) >= 0;
  var saisie = vide ? '' : String(faux ? f.reponse + 1 : f.reponse);
  var ok = !vide && !faux;
  return { texte: f.texte, reponse: f.reponse, saisie: saisie, ok: ok,
           ms: LATENCES[i], p: MathsFlash.points(ok, LATENCES[i]) };
});

/* On répond dès que la question est à l'écran. Entre la première frappe et la
   validation, on laisse traîner DIX SECONDES : si le module mesurait jusqu'à
   Entrée, tous les temps relus seraient faux, et tous les points à 1. */
var n = 0;
var creerVrai = El;
document.createElement = function (tag) {
  var e = creerVrai(tag);
  if (tag !== 'input') return e;
  var i = n++;
  e.focus = function () {
    HORLOGE += LATENCES[i];                  // le temps de retrouver le résultat
    e.value = attendu[i].saisie;
    if (e._h.input) e._h.input();            // la première frappe : c'est ici qu'on note
    HORLOGE += 10000;                        // dix secondes de flânerie
    if (e._h.keydown) e._h.keydown({ key: 'Enter', preventDefault: function () {} });
  };
  return e;
};

var hote = El('div');
var finAppelee = 0;
MathsFlash.monte(hote, { n: 20, graine: GRAINE, surFin: function () { finAppelee++; } });
var garde = 0;
while (ATTENTE.length && garde++ < 500) ATTENTE.shift()();
if (garde >= 500) ko('l\'écran ne s\'arrête pas : la séance boucle');

/* ------------------------------------------------------------------ */
/* 1. Le récapitulatif, ligne à ligne                                  */
/* ------------------------------------------------------------------ */
var page = hote.html();
var tbody = /<tbody>([\s\S]*?)<\/tbody>/.exec(page);
if (!tbody) { ko('aucun tableau récapitulatif à la fin de la séance'); }
else {
  var lignes = tbody[1].match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
  if (lignes.length !== 20)
    ko('le récapitulatif a ' + lignes.length + ' ligne(s) au lieu de 20');
  lignes.forEach(function (l, i) {
    var a = attendu[i];
    if (!a) return;
    var tds = (l.match(/<td[^>]*>([\s\S]*?)<\/td>/g) || []).map(function (d) {
      return d.replace(/<[^>]+>/g, '').replace(/\s*✘\s*$/, '').trim();
    });
    if (tds.length !== 4) {
      ko('ligne ' + (i + 1) + ' : ' + tds.length + ' colonnes au lieu de 4 ' +
         '(question, réponse, ta réponse, temps)');
      return;
    }
    if (tds[0] !== a.texte)
      ko('ligne ' + (i + 1) + ' : la question relue est « ' + tds[0] + ' » au lieu de « ' +
         a.texte + ' »');
    if (tds[1] !== String(a.reponse))
      ko('ligne ' + (i + 1) + ' : la bonne réponse annoncée est ' + tds[1] + ' au lieu de ' +
         a.reponse);
    var saisieAttendue = a.saisie === '' ? '—' : a.saisie;
    if (tds[2] !== saisieAttendue)
      ko('ligne ' + (i + 1) + ' : on a tapé « ' + saisieAttendue + ' », le tableau montre « ' +
         tds[2] + ' »');
    /* LE POINT CENTRAL : dix secondes se sont écoulées entre la frappe et la
       validation. Le temps relu doit ignorer ces dix secondes. */
    if (tds[3] !== sec(a.ms))
      ko('ligne ' + (i + 1) + ' : temps annoncé ' + tds[3] + ' au lieu de ' + sec(a.ms) +
         ' — la mesure ne s\'arrête pas à la première frappe');
    var ditFaux = /class="faux"/.test(l);
    if (ditFaux === a.ok)
      ko('ligne ' + (i + 1) + ' : la réponse est marquée ' + (ditFaux ? 'fausse' : 'juste') +
         ' à tort');
  });
}

/* ------------------------------------------------------------------ */
/* 2. Le score affiché découle des mêmes temps                         */
/* ------------------------------------------------------------------ */
var total = attendu.reduce(function (s, a) { return s + a.p; }, 0);
var justes = attendu.filter(function (a) { return a.ok; }).length;
var ms = /<div class="fl-score"><b>(\d+)<\/b> <span>\/ (\d+) points<\/span><\/div>/.exec(page);
if (!ms) ko('le score final n\'est pas affiché');
else {
  if (+ms[1] !== total)
    ko('score affiché ' + ms[1] + ' au lieu de ' + total + ' (somme des points ligne à ligne)');
  if (+ms[2] !== 60) ko('le maximum affiché est ' + ms[2] + ' au lieu de 60');
}
var mb = /(\d+) bonnes? réponses? sur 20/.exec(page);
if (!mb) ko('le nombre de bonnes réponses n\'est pas affiché');
else if (+mb[1] !== justes)
  ko('on annonce ' + mb[1] + ' bonnes réponses au lieu de ' + justes);

/* La séance doit s'être terminée d'elle-même, et une seule fois. */
if (/fl-champ/.test(page)) ko('un champ de saisie reste à l\'écran après la dernière question');
if (!/Terminer/.test(page)) ko('le bouton « Terminer » manque');

/* ------------------------------------------------------------------ */
/* 3. « À revoir » ne retient que ce qui doit l'être                   */
/* ------------------------------------------------------------------ */
var mr = /<div class="fl-revoir">([\s\S]*?)<\/div><\/div>/.exec(page) ||
         /<div class="fl-revoir">([\s\S]*?)$/.exec(page);
if (!mr) ko('la liste « à revoir » manque');
else {
  var cites = (mr[1].match(/<b>([^<]*?) = /g) || []).map(function (x) {
    return x.replace(/<b>/, '').replace(/ = $/, '');
  });
  if (cites.length > 3) ko('« à revoir » cite ' + cites.length + ' lignes : c\'est trop long');
  // les fausses passent devant les lentes
  var fausses = attendu.filter(function (a) { return !a.ok; }).map(function (a) { return a.texte; });
  fausses.slice(0, 3).forEach(function (t) {
    if (cites.indexOf(t) < 0) ko('« à revoir » oublie « ' + t +' », qui a été ratée');
  });
}

print('séance de 20 questions jouée à l\'écran — ' + total + ' points, ' + justes +
      ' justes, récapitulatif et temps relus ligne à ligne');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LE RÉCAPITULATIF DIT CE QUI S\'EST PASSÉ, ET LE TEMPS S\'ARRÊTE À LA PREMIÈRE FRAPPE');
