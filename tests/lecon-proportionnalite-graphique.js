/* La leçon « Reconnaître la proportionnalité : tableau et graphique » (5ème).
 *
 * Toute la leçon tient dans un pont : le TABLEAU d'un côté, le GRAPHIQUE de
 * l'autre, et l'affirmation qu'ils disent la même chose. Le contrôle vérifie
 * donc ce pont dans les deux sens.
 *
 *   — Chaque ligne du tableau affiché doit être posée sur le graphique en un
 *     point d'abscisse et d'ordonnée exactement égales aux deux nombres de la
 *     ligne. Un point décalé d'un carreau, et la leçon enseignerait le faux.
 *   — Les pointillés doivent partir de l'axe horizontal, monter jusqu'au point
 *     et repartir vers l'axe vertical : c'est le geste qu'on demande à l'élève.
 *   — Le tracé doit relier les points CONSÉCUTIFS, dans l'ordre.
 *   — Le prolongement doit aboutir sur l'axe vertical, à l'ordonnée que le test
 *     recalcule de son côté à partir des deux premiers points.
 *
 * Et surtout le VERDICT. Le contrôle refait le raisonnement avec son propre
 * code — produits en croix, jamais de divisions — et exige que l'annonce lui
 * corresponde, y compris sur la double condition : proportionnel équivaut à
 * « alignés ET la droite passe par l'origine », jamais à l'une des deux seule.
 * Il exige aussi que les quatre situations couvrent les trois cas, sans quoi le
 * piège que la leçon veut montrer ne serait jamais montré.
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

var JXG = { COORDS_BY_USER: 1 };
window.JXG = JXG;
var objets = [];
function fauxBoard() {
  var surUpdate = [];
  return {
    create: function (type, parents, attr) {
      var o = { type: type, parents: parents, attr: attr || {},
                visible: !(attr && attr.visible === false) };
      if (type === 'point') {
        o.X = function () {
          return typeof parents[0] === 'function' ? parents[0]() : parents[0];
        };
        o.Y = function () {
          return typeof parents[1] === 'function' ? parents[1]() : parents[1];
        };
      }
      o.on = function (ev, f) { (o._h = o._h || {})[ev] = f; };
      o.setAttribute = function (a) {
        for (var k in a) o.attr[k] = a[k];
        if ('visible' in a) o.visible = a.visible;
      };
      o.setText = function () {};
      objets.push(o);
      return o;
    },
    on: function (ev, f) { if (ev === 'update') surUpdate.push(f); },
    update: function () { surUpdate.forEach(function (f) { f(); }); },
    getBoundingBox: function () { return [-1.9, 23.6, 9.5, -3.6]; },
    setBoundingBox: function () {}
  };
}

load('js/alea.js');
var MathsView = { lecon: null, register: function (l) { MathsView.lecon = l; }, fonctions: null };
window.MathsView = MathsView;
load('lessons/5eme/proportionnalite-graphique.js');

var extras = fauxEl('div');
var controles = {};
var mv = {
  extras: extras,
  onCleanup: function () {},
  hideBoard: function () { mv._cache = true; },
  addControls: function (specs) {
    specs.forEach(function (s) { controles[s.id] = s; });
    return controles;
  },
  createAnimator: function () {
    return { runSteps: function (steps) { mv._steps = steps; }, cancel: function () {} };
  }
};
var board = fauxBoard();
MathsView.lecon.setup(board, mv);

var err = [], nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function lit(s) { return parseFloat(String(s).replace(/−/g, '-').replace(',', '.')); }
function di(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

var panneau = extras.children[0];
if (!panneau) throw new Error('le panneau n\'a pas été ajouté');
var elChoix = panneau._sous['prg-choix'], elTable = panneau._sous['prg-table'];
var elVerdict = panneau._sous['prg-verdict'], elPhrase = panneau._sous['prg-phrase'];
['prg-choix', 'prg-phrase', 'prg-table', 'prg-verdict'].forEach(function (c) {
  if (!panneau._sous[c]) ko('le panneau n\'a pas de « ' + c + ' »');
});
if (mv._cache) ko('la figure est masquée : cette leçon a besoin du repère');
if (!elChoix || elChoix.children.length < 3)
  ko('moins de trois situations sont proposées');

function jouerTout() {
  controles.play.onClick();
  mv._steps.forEach(function (s) { s.step(1); });
  board.update();
}

/* ------------------------------------------------------------------ */
/* Relire ce que la figure montre RÉELLEMENT                           */
/* ------------------------------------------------------------------ */
function courbes(filtre) {
  return objets.filter(function (o) {
    return o.type === 'curve' && o.visible && filtre(o.attr);
  }).map(function (o) {
    var t0 = typeof o.parents[2] === 'function' ? o.parents[2]() : o.parents[2];
    var t1 = typeof o.parents[3] === 'function' ? o.parents[3]() : o.parents[3];
    return { de: [o.parents[0](t0), o.parents[1](t0)],
             a: [o.parents[0](t1), o.parents[1](t1)],
             en: function (t) { return [o.parents[0](t), o.parents[1](t)]; },
             t0: t0, t1: t1 };
  });
}
function pointsPoses() {
  return objets.filter(function (o) {
    return o.type === 'point' && o.visible && o.attr.color === '#dc2626';
  }).map(function (o) { return [o.X(), o.Y()]; });
}
function equerres() { return courbes(function (a) { return a.dash === 2 && a.strokeWidth === 1.6; }); }
function liens() { return courbes(function (a) { return a.strokeWidth === 3; }); }
function prolongement() { return courbes(function (a) { return a.dash === 2 && a.strokeWidth === 2.4; }); }

/* Le tableau tel qu'il est écrit dans le panneau : une paire par ligne. */
function tableau() {
  var lignes = elTable.innerHTML.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
  var out = [];
  lignes.forEach(function (l) {
    if (/<th/.test(l)) return;
    var tds = l.match(/<td[^>]*>([\s\S]*?)<\/td>/g) || [];
    if (tds.length < 2) return;
    function val(k) {
      var t = tds[k].replace(/<[^>]+>/g, '').trim();
      var m = /^(−?[\d,]+)/.exec(t);
      return m ? lit(m[1]) : NaN;
    }
    out.push({ x: val(0), y: val(1), posee: /class="posee"/.test(l),
               q: tds.length > 2 ? tds[2].replace(/<[^>]+>/g, '') : null });
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Le modèle du contrôle, écrit à part                                 */
/* ------------------------------------------------------------------ */
function estAligne(p) {
  for (var i = 2; i < p.length; i++) {
    if (Math.abs((p[1].x - p[0].x) * (p[i].y - p[0].y) -
                 (p[1].y - p[0].y) * (p[i].x - p[0].x)) > 1e-9) return false;
  }
  return true;
}
function estProportionnel(p) {
  for (var i = 1; i < p.length; i++) {
    if (p[0].x === 0 || Math.abs(p[i].y * p[0].x - p[0].y * p[i].x) > 1e-9) return false;
  }
  return true;
}
function ordonneeOrigine(p) {
  var m = (p[1].y - p[0].y) / (p[1].x - p[0].x);
  return p[0].y - m * p[0].x;
}

var cas = { proportionnel: 0, alignePasOrigine: 0, pasAligne: 0 };

/* ------------------------------------------------------------------ */
/* Chaque situation, de bout en bout                                   */
/* ------------------------------------------------------------------ */
for (var k = 0; k < elChoix.children.length; k++) {
  var nom = elChoix.children[k].innerHTML;
  elChoix.children[k].onclick();
  jouerTout();
  nb++;

  var T = tableau();
  if (T.length < 3) { ko(nom + ' : le tableau a moins de trois lignes'); continue; }
  if (T.some(function (r) { return !isFinite(r.x) || !isFinite(r.y); })) {
    ko(nom + ' : une ligne du tableau est illisible'); continue;
  }
  if (T.some(function (r) { return r.x <= 0; }))
    ko(nom + ' : une abscisse est nulle ou négative — le quotient y ÷ x n\'aurait pas de sens');

  var ali = estAligne(T), pro = estProportionnel(T), p0 = ordonneeOrigine(T);
  if (pro !== (ali && Math.abs(p0) < 1e-9))
    ko(nom + ' : le modèle du contrôle se contredit sur cette situation');
  if (pro) cas.proportionnel++;
  else if (ali) cas.alignePasOrigine++;
  else cas.pasAligne++;

  /* --- 1. une ligne du tableau, un point sur le graphique ----------- */
  var pts = pointsPoses();
  if (pts.length !== T.length)
    ko(nom + ' : ' + pts.length + ' point(s) posé(s) pour ' + T.length + ' ligne(s) de tableau');
  T.forEach(function (r, i) {
    if (!pts[i]) return;
    if (di(pts[i], [r.x, r.y]) > 1e-9)
      ko(nom + ' : la ligne (' + r.x + ' ; ' + r.y + ') est posée en (' + pts[i][0] + ' ; ' +
         pts[i][1] + ')');
    if (!r.posee)
      ko(nom + ' : la ligne (' + r.x + ' ; ' + r.y + ') reste éteinte alors que son point ' +
         'est posé');
  });

  /* --- 2. les pointillés vont bien d'un axe à l'autre --------------- */
  var eq = equerres();
  if (eq.length !== T.length)
    ko(nom + ' : ' + eq.length + ' report(s) en pointillés pour ' + T.length + ' lignes');
  eq.forEach(function (e, i) {
    var r = T[i];
    if (!r) return;
    if (di(e.de, [r.x, 0]) > 1e-9)
      ko(nom + ' : le report de la ligne ' + (i + 1) + ' ne part pas de l\'axe horizontal ' +
         'en (' + r.x + ' ; 0)');
    if (di(e.en(1), [r.x, r.y]) > 1e-9)
      ko(nom + ' : le report de la ligne ' + (i + 1) + ' ne passe pas par son point');
    if (di(e.a, [0, r.y]) > 1e-9)
      ko(nom + ' : le report de la ligne ' + (i + 1) + ' n\'aboutit pas sur l\'axe vertical ' +
         'en (0 ; ' + r.y + ')');
  });

  /* --- 3. le tracé relie les points consécutifs, dans l'ordre ------- */
  var L = liens();
  if (L.length !== T.length - 1)
    ko(nom + ' : ' + L.length + ' segment(s) pour relier ' + T.length + ' points');
  L.forEach(function (s, i) {
    if (!T[i] || !T[i + 1]) return;
    if (di(s.de, [T[i].x, T[i].y]) > 1e-9 || di(s.a, [T[i + 1].x, T[i + 1].y]) > 1e-9)
      ko(nom + ' : le segment ' + (i + 1) + ' ne joint pas les points ' + (i + 1) + ' et ' +
         (i + 2));
  });

  /* --- 4. le prolongement aboutit sur l'axe vertical ---------------- */
  var PR = prolongement();
  if (PR.length !== 1) { ko(nom + ' : le prolongement vers l\'axe n\'est pas tracé'); }
  else {
    if (di(PR[0].de, [T[0].x, T[0].y]) > 1e-9)
      ko(nom + ' : le prolongement ne part pas du premier point');
    if (Math.abs(PR[0].a[0]) > 1e-9)
      ko(nom + ' : le prolongement n\'atteint pas l\'axe vertical (il s\'arrête en x = ' +
         PR[0].a[0] + ')');
    if (Math.abs(PR[0].a[1] - p0) > 1e-9)
      ko(nom + ' : le prolongement coupe l\'axe en ' + PR[0].a[1] + ' au lieu de ' + p0);
    // et il doit vraiment prolonger le tracé, pas partir dans une autre direction
    var m = (T[1].y - T[0].y) / (T[1].x - T[0].x);
    if (Math.abs((T[0].y - PR[0].a[1]) - m * (T[0].x - PR[0].a[0])) > 1e-9)
      ko(nom + ' : le prolongement n\'est pas dans le prolongement du premier segment');
  }

  /* --- 5. le verdict annoncé ---------------------------------------- */
  var v = elVerdict.innerHTML;
  if (!v) { ko(nom + ' : aucun verdict à la fin de l\'animation'); }
  else {
    var dit = /pas une situation de proportionnalité/.test(v) ? false
            : /c'est une situation de proportionnalité/.test(v) ? true : null;
    if (dit === null) ko(nom + ' : le verdict ne conclut pas');
    else if (dit !== pro)
      ko(nom + ' : la situation ' + (pro ? 'EST' : 'n\'est PAS') + ' proportionnelle, ' +
         'on annonce le contraire');
    // les deux conditions doivent être annoncées séparément, et justement
    var tests = v.match(/<div class="prg-test">([\s\S]*?)<\/div>/g) || [];
    // une double négation (« sont ne sont pas ») se glisse vite dans une phrase assemblée
    tests.forEach(function (t) {
      if (/sont\s+<b>ne sont pas/.test(t)) ko(nom + ' : « sont ne sont pas » — phrase bancale');
    });
    if (tests.length !== 2) ko(nom + ' : les deux conditions ne sont pas énoncées séparément');
    else {
      if ((tests[0].indexOf('✔') >= 0) !== ali)
        ko(nom + ' : l\'alignement annoncé est faux (les points ' + (ali ? '' : 'ne ') +
           'sont ' + (ali ? '' : 'pas ') + 'alignés)');
      if ((tests[1].indexOf('✔') >= 0) !== pro)
        ko(nom + ' : le passage par l\'origine annoncé est faux');
    }
    // le piège n'a de sens que dans le cas « alignés mais pas par l'origine »
    var piege = /prg-piege/.test(v);
    if (piege !== (ali && !pro))
      ko(nom + ' : l\'avertissement « alignés ne suffit pas » ' + (piege ? 'apparaît' :
         'manque') + ' à tort');
    // le coefficient annoncé
    if (pro) {
      var mc = /de coefficient <b>([\d,]+)<\/b>/.exec(v);
      if (!mc) ko(nom + ' : le coefficient n\'est pas annoncé');
      else if (Math.abs(lit(mc[1]) - T[0].y / T[0].x) > 1e-9)
        ko(nom + ' : le coefficient annoncé est ' + mc[1] + ' au lieu de ' +
           (T[0].y / T[0].x));
    }
  }

  /* --- 6. la colonne des quotients dit la même chose ---------------- */
  T.forEach(function (r) {
    if (!r.q) { ko(nom + ' : la colonne des quotients manque à la fin'); return; }
    var mq = /([=≈])\s*(−?[\d,]+)\s*$/.exec(r.q.trim());
    if (!mq) ko(nom + ' : un quotient est illisible → ' + r.q);
    else {
      var exact = Math.abs(mq[1] === '=' ? 0 : 1) === 0;
      var q = r.y / r.x;
      // un « = » engage : la valeur doit être exacte, pas arrondie
      if (exact && Math.abs(lit(mq[2]) - q) > 1e-9)
        ko(nom + ' : ' + r.y + ' ÷ ' + r.x + ' est annoncé « = ' + mq[2] + ' » alors que ' +
           'le quotient vaut ' + q);
      if (!exact && Math.abs(lit(mq[2]) - q) > 0.005)
        ko(nom + ' : la valeur approchée de ' + r.y + ' ÷ ' + r.x + ' est annoncée ' + mq[2]);
      // et l'inverse : un quotient qui tombe juste ne doit pas s'écrire « ≈ »
      var tombeJuste = Math.abs(q * 1000 - Math.round(q * 1000)) < 1e-9;
      if (exact !== tombeJuste)
        ko(nom + ' : ' + r.y + ' ÷ ' + r.x + ' est écrit avec « ' + mq[1] + ' » alors ' +
           'qu\'il ' + (tombeJuste ? 'tombe juste' : 'ne tombe pas juste'));
    }
  });
  var tousEgaux = T.every(function (r) {
    return Math.abs(r.y / r.x - T[0].y / T[0].x) < 1e-9;
  });
  if (tousEgaux !== pro)
    ko(nom + ' : les quotients et le verdict ne s\'accordent pas');

  /* --- 7. rejouer redonne le même écran ----------------------------- */
  var ecran = elTable.innerHTML + '|' + elVerdict.innerHTML;
  controles.play.onClick();
  mv._steps.forEach(function (s) { s.step(0); s.step(0.5); s.step(1); });
  if (elTable.innerHTML + '|' + elVerdict.innerHTML !== ecran)
    ko(nom + ' : rejouer l\'animation ne redonne pas le même écran');

  /* --- 8. la remise à zéro vide bien la figure ---------------------- */
  controles.reset.onClick();
  if (pointsPoses().length) ko(nom + ' : la remise à zéro laisse des points sur le graphique');
  if (liens().length) ko(nom + ' : la remise à zéro laisse le tracé');
  if (elVerdict.innerHTML) ko(nom + ' : la remise à zéro laisse le verdict affiché');
  if (!elPhrase.innerHTML) ko(nom + ' : la situation n\'est pas décrite');
}

/* Les trois cas doivent être représentés : sans le piège du taxi, la leçon ne
   montrerait jamais qu'alignés ne suffit pas. */
if (!cas.proportionnel) ko('aucune situation proportionnelle n\'est proposée');
if (!cas.alignePasOrigine)
  ko('aucune situation alignée SANS passer par l\'origine : le piège de la leçon manque');
if (!cas.pasAligne) ko('aucune situation aux points non alignés');

print(nb + ' situations vérifiées — ' + cas.proportionnel + ' proportionnelle(s), ' +
      cas.alignePasOrigine + ' alignée(s) hors origine, ' + cas.pasAligne + ' non alignée(s)');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LE TABLEAU ET LE GRAPHIQUE DISENT LA MÊME CHOSE, ET LE VERDICT AUSSI');
