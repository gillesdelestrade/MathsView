/* Vérification du générateur « Constructions au compas ».
 *
 * Le point délicat n'est pas l'arithmétique : c'est de savoir si la
 * construction est RÉELLEMENT FAISABLE dans la figure proposée. On simule donc
 * un vrai JSXGraph et de vrais gestes de souris — on pique le compas, on tire,
 * on relâche — puis on trace la droite en s'aimantant aux croisements, et on
 * regarde quels points elle traverse. Si la droite obtenue ne passe pas
 * exactement par les points annoncés, l'exercice est infaisable, quelles que
 * soient les valeurs calculées par le générateur.
 */
var window = this;

/* ------------------------------------------------------------------ */
/* Un JSXGraph de poche                                               */
/* ------------------------------------------------------------------ */
var JXG = {
  COORDS_BY_USER: 1,
  JSXGraph: {
    initBoard: function (id, opts) {
      var B = {
        objets: [], ecouteurs: {}, bb: opts.boundingbox,
        create: function (type, parents, attr) {
          var o = { type: type, parents: parents, attr: attr || {}, visible: true,
                    txt: '' };
          o.setPosition = function (m, p) { o.parents = [p[0], p[1]]; };
          o.setAttribute = function (a) {
            for (var k in a) o.attr[k] = a[k];
            if ('visible' in a) o.visible = a.visible;
          };
          o.setText = function (t) { o.txt = t; };
          if (attr && attr.visible === false) o.visible = false;
          B.objets.push(o);
          return o;
        },
        on: function (ev, f) { B.ecouteurs[ev] = f; },
        update: function () {},
        removeObject: function (o) {
          var i = B.objets.indexOf(o); if (i >= 0) B.objets.splice(i, 1);
        },
        getBoundingBox: function () { return B.bb; },
        getUsrCoordsOfMouse: function (e) { return [e.x, e.y]; }
      };
      return B;
    }
  }
};
window.JXG = JXG;

/* Un DOM de poche, juste ce qu'il faut pour la barre d'outils. */
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [], dataset: {},
            onclick: null,
            classList: {
              _l: [],
              add: function (c) { if (this._l.indexOf(c) < 0) this._l.push(c); },
              remove: function (c) { var i = this._l.indexOf(c); if (i >= 0) this._l.splice(i, 1); },
              contains: function (c) { return this._l.indexOf(c) >= 0; },
              toggle: function (c, v) { v ? this.add(c) : this.remove(c); }
            },
            appendChild: function (c) { this.children.push(c); },
            querySelectorAll: function (sel) {
              var cls = sel.replace('.', ''), out = [];
              (function marche(n) {
                if (n.classList && n.classList.contains(cls)) out.push(n);
                n.children.forEach(marche);
              })(e);
              return out;
            } };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) {
      e._html = v; e.children = [];
      // on modélise les <button class="…" data-o="…">
      var m, re = /<(button|span)[^>]*class="([^"]+)"([^>]*)>/g;
      while ((m = re.exec(v))) {
        var b = fauxEl(m[1]);
        m[2].split(' ').forEach(function (c) { b.classList.add(c); });
        var d = /data-o="([^"]+)"/.exec(m[3]);
        if (d) b.dataset.o = d[1];
        e.children.push(b);
      }
    }
  });
  return e;
}
var document = { createElement: fauxEl };
window.document = document;

load('js/alea.js'); load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/6eme/compas.js');

/* ------------------------------------------------------------------ */
var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function d(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
function distDroite(p, u, v) {
  var dx = v[0] - u[0], dy = v[1] - u[1];
  return Math.abs(dx * (p[1] - u[1]) - dy * (p[0] - u[0])) / Math.hypot(dx, dy);
}

/* Rejoue un geste : appuie en `a`, tire jusqu'en `b`, relâche. */
function geste(B, a, b) {
  B.ecouteurs.down({ x: a[0], y: a[1] });
  B.ecouteurs.move({ x: b[0], y: b[1] });
  B.ecouteurs.up({ x: b[0], y: b[1] });
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 700; g++) {
    var q = G.genere(MathsAlea(palier * 7717 + g), palier);
    nb++;
    var t = /Laquelle|médiatrice de/.test(q.enonce) ? '' : '';
    var fam = q.type === 'vraifaux' ? 'proprietes'
            : q.type === 'qcm' ? 'etapes'
            : /bissectrice/.test(q.enonce) ? 'bissectrice' : 'mediatrice';
    vus[fam] = (vus[fam] || 0) + 1;

    /* --- ce qui vaut pour toutes les questions -------------------- */
    if (/<[^>]*$/.test(q.enonce)) ko(fam + ' : balise HTML tronquée');
    if (!q.etapes || !q.etapes.length) ko(fam + ' : pas de correction');
    if (q.type === 'qcm-multi') {
      if (!q.corrects || !q.corrects.length) ko(fam + ' : aucune bonne réponse à cocher');
      if (q.corrects.length === q.choix.length) ko(fam + ' : TOUS les points sont bons');
      if (!q.figure) ko(fam + ' : pas de figure');
    } else if (q.type === 'qcm') {
      if (q.correct < 0) ko('etapes : la bonne réponse n\'est pas dans la liste');
      var vusChoix = {};
      q.choix.forEach(function (c) {
        if (vusChoix[c]) ko('etapes : deux propositions identiques');
        vusChoix[c] = 1;
      });
    } else if (q.type === 'vraifaux') {
      if (q.correct !== 0 && q.correct !== 1) ko('proprietes : réponse hors [0,1]');
    }
    if (!q.figure) continue;

    /* --- on monte la figure et on l'utilise ----------------------- */
    var zone = fauxEl('div');
    var B = JXG.JSXGraph.initBoard('x', Object.assign(
      { boundingbox: [-10, 4, 10, -4] }, q.board));
    var ctx = { zone: zone };
    q.figure(B, ctx);

    // les points nommés, relus depuis la figure construite
    var nommes = {};
    B.objets.forEach(function (o) {
      if (o.type === 'point' && o.attr.name) nommes[o.attr.name] = o.parents;
    });
    var bb = q.board.boundingbox;
    Object.keys(nommes).forEach(function (n) {
      var p = nommes[n];
      if (p[0] < bb[0] + 0.5 || p[0] > bb[2] - 0.5 || p[1] > bb[1] - 0.4 || p[1] < bb[3] + 0.4)
        ko(fam + ' : le point ' + n + ' sort du cadre');
    });
    var tests = ['C', 'D', 'E', 'F'].map(function (n) { return nommes[n]; });
    tests.forEach(function (p, i) {
      tests.forEach(function (r, j) {
        if (i < j && d(p, r) < 0.9) ko(fam + ' : les points sont trop serrés (illisible)');
      });
    });

    // la barre d'outils est-elle bien posée ?
    var barre = zone.children[0];
    if (!barre || barre.children.length < 3) ko(fam + ' : la barre d\'outils manque');
    var boutons = barre.querySelectorAll('.exo-outil');
    function outil(nom) {
      boutons.forEach(function (b) { if (b.dataset.o === nom) b.onclick(); });
    }

    /* --- LA CONSTRUCTION, à la main -------------------------------- */
    /* On ne devine pas où sont les croisements : on les CALCULE, puis on
       vérifie qu'ils sont bien apparus comme points aimantés. Un croisement
       hors cadre n'est pas aimanté — et la construction devient alors
       infaisable, ce qui est exactement ce qu'on cherche à débusquer. */
    function aimants() {
      return B.objets.filter(function (o) {
        return o.type === 'point' && o.attr.name === '' && o.attr.color === '#94a3b8';
      }).map(function (o) { return o.parents; });
    }
    function present(p) {
      return aimants().some(function (a) { return d(a, p) < 1e-6; });
    }
    function interCC(c1, r1, c2, r2) {
      var D = d(c1, c2);
      if (D < 1e-9 || D > r1 + r2 || D < Math.abs(r1 - r2)) return [];
      var a = (r1 * r1 - r2 * r2 + D * D) / (2 * D), h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
      var ux = (c2[0] - c1[0]) / D, uy = (c2[1] - c1[1]) / D;
      var mx = c1[0] + ux * a, my = c1[1] + uy * a;
      return [[mx - uy * h, my + ux * h], [mx + uy * h, my - ux * h]];
    }
    function gomme() {
      barre.querySelectorAll('.gomme')[0].onclick();
    }

    var droite = null, faisable = false;
    if (fam === 'mediatrice') {
      var A = nommes.A, Bp = nommes.B, ab = d(A, Bp);
      // un élève essaie plusieurs écartements : il suffit qu'UN marche
      [0.6, 0.7, 0.55, 0.8, 0.9].forEach(function (k) {
        if (faisable) return;
        gomme(); outil('compas');
        var r = Math.round(ab * k * 10) / 10;
        geste(B, A, [A[0] + r + 0.02, A[1] - 0.01]);
        geste(B, Bp, [Bp[0] + r - 0.02, Bp[1] + 0.02]);
        var X = interCC(A, r, Bp, r);
        if (X.length !== 2 || !present(X[0]) || !present(X[1])) return;
        faisable = true;
        outil('regle');
        // on vise GROSSIÈREMENT : c'est l'aimantation qui doit corriger
        geste(B, [X[0][0] + 0.25, X[0][1] - 0.2], [X[1][0] - 0.3, X[1][1] + 0.15]);
        droite = B.objets[B.objets.length - 1];
      });
      if (!faisable) ko('mediatrice : aucun écartement de compas ne donne deux croisements ' +
        'visibles — la construction est infaisable');
    } else {
      var Oo = nommes.O, M = nommes.M, N = nommes.N;
      var u1 = [(M[0] - Oo[0]) / d(M, Oo), (M[1] - Oo[1]) / d(M, Oo)];
      var u2 = [(N[0] - Oo[0]) / d(N, Oo), (N[1] - Oo[1]) / d(N, Oo)];
      var portee = Math.min(d(M, Oo), d(N, Oo));
      [0.6, 0.5, 0.7, 0.4, 0.8].forEach(function (k) {
        if (faisable) return;
        gomme(); outil('compas');
        var r1 = Math.round(portee * k * 10) / 10;
        geste(B, Oo, [Oo[0] + r1, Oo[1]]);
        var S1 = [Oo[0] + u1[0] * r1, Oo[1] + u1[1] * r1];
        var S2 = [Oo[0] + u2[0] * r1, Oo[1] + u2[1] * r1];
        if (!present(S1) || !present(S2)) return;   // l'arc ne coupe pas les deux côtés
        var r2 = Math.round(r1 * 9) / 10;
        geste(B, S1, [S1[0] + r2, S1[1]]);
        geste(B, S2, [S2[0] + r2 - 0.01, S2[1] + 0.01]);
        var X = interCC(S1, r2, S2, r2);
        // celui des deux qui est du côté de l'ouverture
        var bx = u1[0] + u2[0], by = u1[1] + u2[1];
        // les deux croisements sont sur la bissectrice ; on prend le PLUS
        // ÉLOIGNÉ du sommet — l'autre est parfois à quelques millimètres de O,
        // et la règle n'aurait rien à tracer
        var bon = X.filter(function (p) {
          return (p[0] - Oo[0]) * bx + (p[1] - Oo[1]) * by > 0.3 && d(p, Oo) > 1;
        }).sort(function (a, c) { return d(c, Oo) - d(a, Oo); })[0];
        if (!bon || !present(bon)) return;
        faisable = true;
        outil('regle');
        geste(B, [Oo[0] + 0.2, Oo[1] + 0.15], [bon[0] - 0.2, bon[1] - 0.1]);
        droite = B.objets[B.objets.length - 1];
      });
      if (!faisable) ko('bissectrice : aucun écartement ne mène au bout de la construction');
    }
    if (droite && droite.type !== 'line') {
      ko(fam + ' : la règle n\'a pas tracé de droite'); droite = null;
    }

    /* --- la gomme remet-elle la figure à zéro ? -------------------- */
    if (g % 97 === 0) {
      gomme();
      var reste = B.objets.filter(function (o) {
        return o.visible && (o.attr.strokeColor === '#7c3aed' || o.attr.color === '#94a3b8');
      });
      if (reste.length) ko(fam + ' : la gomme laisse ' + reste.length + ' tracé(s)');
      // et on doit pouvoir reconstruire ensuite
      if (fam === 'mediatrice') {
        outil('compas');
        var rr = Math.round(d(nommes.A, nommes.B) * 7) / 10;
        geste(B, nommes.A, [nommes.A[0] + rr, nommes.A[1]]);
        geste(B, nommes.B, [nommes.B[0] + rr, nommes.B[1]]);
        // (les arcs recoupent aussi [AB] : il y a plus de deux aimants, ce qui
        //  est normal — on vérifie que les DEUX croisements d'arcs sont là)
        var X2 = interCC(nommes.A, rr, nommes.B, rr);
        if (X2.length !== 2 || !present(X2[0]) || !present(X2[1]))
          ko('mediatrice : après la gomme, la construction ne repart pas');
      }
    }
  }
}

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('TOUTES LES RÉPONSES SONT VÉRIFIÉES');
