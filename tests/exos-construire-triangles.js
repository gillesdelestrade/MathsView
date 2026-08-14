/* Les exercices « Construire un triangle » (5ème).
 *
 * Deux choses doivent tenir, et elles sont indépendantes.
 *
 * D'abord les MATHS : la réponse annoncée est-elle celle du triangle décrit par
 * l'énoncé ? On relit les données dans le texte, on reconstruit le triangle à
 * côté, et on remesure. Un triangle « impossible » ne doit jamais être proposé
 * à construire, et une mesure demandée ne doit jamais être déjà écrite dans
 * l'énoncé — sinon il suffirait de recopier.
 *
 * Ensuite la FAISABILITÉ : la construction demandée est-elle réellement
 * exécutable avec les instruments fournis ? On rejoue de vrais gestes — arcs de
 * compas, coups de rapporteur — et on vérifie que le point C apparaît bien
 * comme point d'accroche, à sa place. Un exercice dont la construction ne
 * tombe pas juste serait faux, quelles que soient ses valeurs.
 */
var window = this;

/* ---------------- DOM et JSXGraph de poche ---------------- */
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [], dataset: {}, onclick: null,
            classList: { _l: [],
              add: function (c) { if (this._l.indexOf(c) < 0) this._l.push(c); },
              remove: function (c) { var i = this._l.indexOf(c); if (i >= 0) this._l.splice(i, 1); },
              contains: function (c) { return this._l.indexOf(c) >= 0; },
              toggle: function (c, v) { v ? this.add(c) : this.remove(c); } },
            appendChild: function (c) { this.children.push(c); return c; },
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
var JXG = { COORDS_BY_USER: 1 };
window.JXG = JXG;

load('js/alea.js');
load('exos/outils.js');
load('exos/instruments.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/construire-triangles.js');

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function di(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
function lit(s) { return parseFloat(String(s).replace('−', '-').replace(',', '.')); }

function board() {
  var B = { objets: [], ecouteurs: {}, bb: [-2.5, 9.5, 13.5, -2.5],
    create: function (t, p, a) {
      var o = { type: t, parents: p, attr: a || {}, visible: true, txt: '' };
      o.setPosition = function (m, q) { o.parents = [q[0], q[1]]; };
      o.setAttribute = function (x) { for (var k in x) o.attr[k] = x[k];
                                      if ('visible' in x) o.visible = x.visible; };
      o.setText = function (s) { o.txt = s; };
      if (a && a.visible === false) o.visible = false;
      B.objets.push(o);
      return o;
    },
    on: function (e, f) { B.ecouteurs[e] = f; },
    update: function () {},
    removeObject: function (o) { var i = B.objets.indexOf(o); if (i >= 0) B.objets.splice(i, 1); },
    getBoundingBox: function () { return B.bb; },
    getUsrCoordsOfMouse: function (e) { return [e.x, e.y]; } };
  return B;
}
function geste(B, a, b, milieu) {
  B.ecouteurs.down({ x: a[0], y: a[1] });
  if (milieu) B.ecouteurs.move({ x: milieu[0], y: milieu[1] });
  B.ecouteurs.move({ x: b[0], y: b[1] });
  B.ecouteurs.up({ x: b[0], y: b[1] });
}
function aimants(B) {
  return B.objets.filter(function (o) {
    return o.type === 'point' && o.attr.name === '' && o.attr.color === '#94a3b8';
  }).map(function (o) { return o.parents; });
}

/* Les données de l'énoncé, relues dans le texte. */
function donnees(t) {
  var d = {};
  var m = /AB = ([\d,]+)/.exec(t); if (m) d.c = lit(m[1]);
  m = /AC = ([\d,]+)/.exec(t); if (m) d.b = lit(m[1]);
  m = /BC = ([\d,]+)/.exec(t); if (m) d.a = lit(m[1]);
  m = /widehat\{A\} = (\d+)/.exec(t); if (m) d.alpha = +m[1];
  m = /widehat\{B\} = (\d+)/.exec(t); if (m) d.beta = +m[1];
  return d;
}
var RAD = Math.PI / 180;
function sommetC(d) {
  if (d.b !== undefined && d.a !== undefined) {           // trois longueurs
    var x = (d.b * d.b - d.a * d.a + d.c * d.c) / (2 * d.c);
    var h2 = d.b * d.b - x * x;
    return h2 > 0 ? [x, Math.sqrt(h2)] : null;
  }
  if (d.alpha !== undefined && d.b !== undefined) {       // un angle et deux longueurs
    return [Math.cos(d.alpha * RAD) * d.b, Math.sin(d.alpha * RAD) * d.b];
  }
  if (d.alpha !== undefined && d.beta !== undefined) {
    if (d.alpha + d.beta >= 180) return null;
    var t = Math.tan(d.alpha * RAD), u = Math.tan(d.beta * RAD);
    var xx = u * d.c / (t + u);
    return [xx, t * xx];
  }
  return null;
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 5233 + g), palier);
    nb++;
    var fam = /Il existe un triangle/.test(q.enonce) ? 'constructible'
            : q.type === 'vraifaux' ? 'donnees'
            : /Que fait-on ensuite/.test(q.enonce) ? 'programme'
            : /Sans rien construire/.test(q.enonce) ? 'troisieme' : 'mesure';
    vus[fam] = (vus[fam] || 0) + 1;

    if (!q.etapes || q.etapes.length < 2) ko(fam + ' : correction trop courte');
    if (/[^\\<&]<[^\/a-zA-Z!]/.test(q.enonce.replace(/<svg[\s\S]*<\/svg>/, '')))
      ko(fam + ' : un « < » brut dans l\'énoncé');
    if (q.type === 'qcm') {
      if (q.correct < 0) ko(fam + ' : la bonne réponse n\'est pas dans la liste');
      var deja = {};
      q.choix.forEach(function (c) {
        if (deja[c]) ko(fam + ' : deux propositions identiques');
        deja[c] = 1;
      });
    }

    /* --- l'inégalité triangulaire, jugée à part --------------------- */
    if (fam === 'constructible') {
      var d0 = donnees(q.enonce);
      var vrai = d0.b + d0.a > d0.c && d0.c + d0.a > d0.b && d0.c + d0.b > d0.a;
      if (vrai !== (q.correct === 0))
        ko('constructible : ' + [d0.c, d0.b, d0.a].join(' / ') + ' est ' +
           (vrai ? 'constructible' : 'impossible') + ', la réponse dit le contraire');
      continue;
    }
    if (fam === 'troisieme') {
      var d1 = donnees(q.enonce);
      if (Math.abs(180 - d1.alpha - d1.beta - q.reponse) > 1e-9)
        ko('troisieme : 180 − ' + d1.alpha + ' − ' + d1.beta + ' ≠ ' + q.reponse);
      if (q.reponse <= 0) ko('troisieme : le troisième angle serait nul ou négatif');
      continue;
    }
    if (fam === 'donnees' || fam === 'programme') continue;

    /* --- construire, puis mesurer ---------------------------------- */
    var d = donnees(q.enonce);
    var C = sommetC(d);
    if (!C) { ko('mesure : on demande de construire un triangle impossible'); continue; }
    if (C[1] < 1.2) ko('mesure : le triangle proposé est trop plat pour être construit');

    var A = [0, 0], B0 = [d.c, 0];
    function ang(s, u, v) {
      var p = [u[0] - s[0], u[1] - s[1]], r = [v[0] - s[0], v[1] - s[1]];
      var k = (p[0] * r[0] + p[1] * r[1]) / (Math.hypot(p[0], p[1]) * Math.hypot(r[0], r[1]));
      return Math.acos(Math.max(-1, Math.min(1, k))) / RAD;
    }
    var attendu = null;
    var mm = /l'angle \\\(\\widehat\{([ABC])\}\\\)/.exec(q.enonce);
    if (mm) attendu = { v: mm[1] === 'A' ? ang(A, B0, C) : mm[1] === 'B' ? ang(B0, A, C)
                                                                        : ang(C, A, B0),
                        tol: 2 };
    else {
      var ml = /la longueur \\\((AC|BC)\\\)/.exec(q.enonce);
      if (ml) attendu = { v: ml[1] === 'AC' ? di(A, C) : di(B0, C), tol: 0.2 };
    }
    if (!attendu) { ko('mesure : on ne comprend pas ce qui est demandé'); continue; }
    if (Math.abs(Math.round(attendu.v * 10) / 10 - q.reponse) > 1e-9)
      ko('mesure : la figure donne ' + attendu.v.toFixed(2) + ', la réponse annoncée est ' +
         q.reponse);
    if (q.tolerance !== attendu.tol)
      ko('mesure : la tolérance est ' + q.tolerance + ' au lieu de ' + attendu.tol);
    // la valeur cherchée ne doit pas être déjà écrite dans l'énoncé
    if (mm && new RegExp('widehat\\{' + mm[1] + '\\} = ').test(q.enonce))
      ko('mesure : l\'angle demandé est déjà donné dans l\'énoncé');
    if (!mm && new RegExp(ml[1] + ' = ').test(q.enonce))
      ko('mesure : la longueur demandée est déjà donnée dans l\'énoncé');

    /* --- la construction est-elle faisable avec les instruments ? --- */
    var Bd = board();
    var zone = fauxEl('div');
    q.figure(Bd, { zone: zone });
    var barre = zone.children[0];
    var boutons = barre.querySelectorAll('.exo-outil');
    function outil(n) { boutons.forEach(function (b) { if (b.dataset.o === n) b.onclick(); }); }
    function present(p) {
      return aimants(Bd).some(function (a) { return di(a, p) < 1e-6; });
    }

    if (d.b !== undefined && d.a !== undefined) {
      // trois longueurs : deux arcs de compas
      outil('compas');
      geste(Bd, A, [A[0] + d.b, A[1]]);
      geste(Bd, B0, [B0[0] - d.a, B0[1]]);
      if (!present(C))
        ko('mesure (3 longueurs) : les deux arcs ne marquent pas le sommet C');
    } else if (d.alpha !== undefined && d.b !== undefined) {
      // un angle au rapporteur, puis un report au compas
      outil('rapporteur');
      geste(Bd, A, [Math.cos(d.alpha * RAD) * 4, Math.sin(d.alpha * RAD) * 4], [2, 0.02]);
      outil('compas');
      geste(Bd, A, [A[0] + d.b, A[1]]);
      if (!present(C))
        ko('mesure (angle + longueur) : le report au compas ne marque pas le sommet C');
    } else {
      // deux angles au rapporteur
      outil('rapporteur');
      geste(Bd, A, [Math.cos(d.alpha * RAD) * 4, Math.sin(d.alpha * RAD) * 4], [2, 0.02]);
      geste(Bd, B0, [B0[0] - Math.cos(d.beta * RAD) * 4, Math.sin(d.beta * RAD) * 4],
            [B0[0] - 2, 0.02]);
      if (!present(C))
        ko('mesure (2 angles) : les deux demi-droites ne marquent pas le sommet C');
    }
    // et les instruments annoncés sont bien là
    var noms = boutons.map(function (b) { return b.dataset.o; }).filter(Boolean);
    ['compas', 'regle', 'rapporteur'].forEach(function (o) {
      if (noms.indexOf(o) < 0) ko('mesure : l\'instrument « ' + o + ' » manque');
    });
  }
}

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE CONSTRUCTION EST FAISABLE ET DONNE LA RÉPONSE ANNONCÉE');
