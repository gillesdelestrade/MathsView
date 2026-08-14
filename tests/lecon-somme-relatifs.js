/* On exécute setup() avec un DOM simulé, puis on rejoue TOUTES les étapes de
   l'animation pour chacun des quatre cas, en relisant le tableau produit. */
var elements = [];
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', style: {}, children: [], dataset: {},
            classList: { toggle: function(){}, add: function(){}, remove: function(){} },
            appendChild: function (c) { this.children.push(c); },
            querySelector: function (sel) {
              var cls = sel.replace('.', '');
              function cherche(n) {
                if (n.className && n.className.split(' ').indexOf(cls) >= 0) return n;
                for (var i = 0; i < n.children.length; i++) {
                  var r = cherche(n.children[i]); if (r) return r;
                }
                // les enfants créés par innerHTML ne sont pas modélisés : on
                // retrouve les blocs par la classe grâce à `_sous`
                return null;
              }
              return this._sous && this._sous[cls] ? this._sous[cls] : cherche(this);
            } };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) {
      e._html = v;
      e.children = [];          // comme dans un vrai DOM : innerHTML remplace tout
      // on recrée les sous-blocs déclarés par leur classe dans le gabarit
      // un élément peut porter PLUSIEURS classes : on les enregistre toutes
      var m, re = /class="([^"]+)"/g, sous = {};
      while ((m = re.exec(v))) {
        var f = fauxEl('div'); f.className = m[1];
        m[1].split(/\s+/).forEach(function (c) { if (c && !sous[c]) sous[c] = f; });
      }
      if (Object.keys(sous).length) e._sous = sous;
    }
  });
  Object.defineProperty(e, 'textContent', { get: function(){ return e._txt || ''; },
                                            set: function(v){ e._txt = v; } });
  elements.push(e); return e;
}
var document = { createElement: fauxEl };
var steps = null, extras = fauxEl('div');
var board = { update: function(){}, create: function(){ return {}; } };
var mv = {
  hideBoard: function(){}, typeset: function(){}, onCleanup: function(){},
  extras: extras, addControls: function(){ return {}; },
  createAnimator: function(){ return { cancel: function(){}, runSteps: function(s){ steps = s; } }; }
};
var LECON = null; var MathsView = { register: function (l) { LECON = l; } };
load('lessons/5eme/somme-relatifs.js');
LECON.setup(board, mv);

var ui = extras.children[0];
function bloc(cls) { return ui._sous[cls]; }
function txt(h) { return String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' '); }
function nb(t) { return parseFloat(t.replace('−', '-').replace(',', '.')); }

/* Relit le tableau posé et vérifie qu'il est juste, colonne par colonne. */
function verifiePose(html, err) {
  // toutes les lignes, qu'elles portent une classe ou non
  var trs = [], m, re = /<tr([^>]*)>([\s\S]*?)<\/tr>/g;
  while ((m = re.exec(html))) trs.push({ cls: m[1], corps: m[2] });
  function cases(tr) {
    var r = [], mm, r2 = /<td class="([^"]*)">([^<]*)<\/td>/g;
    while ((mm = r2.exec(tr))) r.push({ cls: mm[1], t: mm[2] });
    return r;
  }
  // les lignes de retenue ne sont pas des opérandes : on les écarte
  var utiles = trs.filter(function (t) { return !/som-ret/.test(t.cls); }).map(function (t) {
    return { cls: t.cls, c: cases(t.corps) }; });
  if (utiles.length !== 3) { err('tableau à ' + utiles.length + ' lignes utiles'); return null; }
  var A = utiles[0].c, B = utiles[1].c, res = utiles[2].c;
  function colVir(l) { return l.map(function (c, i) { return /som-vir/.test(c.cls) ? i : -1; })
                                .filter(function (i) { return i >= 0; }); }
  var vA = colVir(A), vB = colVir(B), vR = colVir(res);
  if (vA.length !== 1 || vB.length !== 1 || vR.length !== 1) { err('colonne de virgule absente'); return null; }
  if (vA[0] !== vB[0] || vA[0] !== vR[0]) err('virgules non alignées');
  // on ne juge que les tableaux TERMINÉS : la virgule du résultat n'est posée
  // qu'à la dernière étape, c'est notre marqueur
  if (res[vR[0]].t !== ',') return null;
  if (A[vA[0]].t !== ',' || B[vB[0]].t !== ',') err('la colonne surlignée ne porte pas la virgule');
  function lire(l, vir) {
    var e = '', d = '';
    l.forEach(function (c, i) {
      if (i === vir || !/^\d$/.test(c.t)) return;
      if (i < vir) e += c.t; else d += c.t;
    });
    return (e === '' ? 0 : parseInt(e, 10)) * 100 + (d === '' ? 0 : parseInt((d + '00').slice(0, 2), 10));
  }
  var opCell = B.filter(function (c) { return /som-op/.test(c.cls); });
  if (!opCell.length) { err('pas de signe d\'opération'); return null; }
  var va = lire(A, vA[0]), vb = lire(B, vB[0]), vr = lire(res, vR[0]);
  var att = opCell[0].t === '+' ? va + vb : va - vb;
  if (vr !== att) err('résultat posé faux : ' + va + ' ' + opCell[0].t + ' ' + vb + ' → ' + vr +
                      ' au lieu de ' + att);
  function nbDec(l, vir) { var n = 0; l.forEach(function (c, i) { if (i > vir && /^\d$/.test(c.t)) n++; }); return n; }
  if (nbDec(A, vA[0]) !== nbDec(B, vB[0])) err('les deux nombres n\'ont pas autant de décimales');
  return { a: va, b: vb, r: vr, op: opCell[0].t };
}

var err = [], cpt = {};
function ko(m) { if (err.length < 12) err.push(m); }
var CAS = ['meme', 'contraire', 'moins', 'plusieurs'];
for (var essai = 0; essai < 600; essai++) {
  var c = CAS[essai % 4];
  // on rejoue le cas : le bouton correspondant a été créé par la leçon
  var boutons = elements.filter(function (e) { return e.tag === 'button' && e.dataset.cas; });
  var b = boutons.filter(function (x) { return x.dataset.cas === c; })[0];
  b.onclick();
  cpt[c] = (cpt[c] || 0) + 1;

  var calcul = txt(bloc('som-calcul').innerHTML);
  // le calcul de départ, relu depuis l'affichage
  var nums = calcul.match(/\(([+−][\d,]+)\)/g).map(function (t) {
    return Math.round(nb(t.replace(/[()]/g, '').replace('+', '')) * 100); });
  var moins = calcul.indexOf(' − ') >= 0;
  var attendu = moins ? nums[0] - nums[1] : nums.reduce(function (x, y) { return x + y; }, 0);

  // on déroule toute l'animation, en vérifiant chaque tableau posé au passage
  var vus = 0, iEtape = 0;
  steps.forEach(function (s) {
    // Le vrai moteur rappelle step(p) à CHAQUE IMAGE, et le mode pas à pas
    // rejoue les étapes précédentes : une étape doit donc pouvoir être rejouée
    // sans que rien ne se duplique.
    if (s.step) { s.step(0); s.step(0.4); s.step(1); s.step(1); }
    if (s.after) { s.after(); s.after(); }
    iEtape++;
    // Après la PREMIÈRE étape d'une soustraction, le calcul affiché doit être
    // l'addition de l'opposé : mêmes termes, second terme changé de signe.
    if (moins && iEtape === 1) {
      var apres = txt(bloc('som-calcul').innerHTML);
      var n2 = (apres.match(/\(([+−][\d,]+)\)/g) || []).map(function (t) {
        return Math.round(nb(t.replace(/[()]/g, '').replace('+', '')) * 100); });
      if (apres.indexOf(' − ') >= 0) ko('moins : la soustraction n\'a pas été transformée');
      else if (n2.length !== 2 || n2[0] !== nums[0] || n2[1] !== -nums[1])
        ko('moins : réécriture fausse — ' + calcul + ' devient ' + apres);
      var e1 = txt((bloc('som-etapes').innerHTML.split('som-etape">')[1] || ''));
      // la phrase doit nommer l'opposé DANS LE BON SENS
      var dits = (e1.match(/\(([+−][\d,]+)\)/g) || []).map(function (t) {
        return Math.round(nb(t.replace(/[()]/g, '').replace('+', '')) * 100); });
      if (dits.length !== 2 || dits[0] !== nums[1] || dits[1] !== -nums[1])
        ko('moins : « ' + e1 + " » alors que le terme retranché est " + (nums[1] / 100));
    }
    var h = bloc('som-posewrap').innerHTML;
    if (h && /som-bar/.test(h)) { var v = verifiePose(h, ko); if (v) vus++; }
  });
  // Aucune phrase ne doit apparaître deux fois de suite : c'est la signature
  // d'une étape qui agit au lieu d'afficher un état.
  var ph = bloc('som-etapes').innerHTML.split('som-etape">').slice(1);
  var vusPh = {};
  ph.forEach(function (t) {
    if (vusPh[t]) ko(c + ' : phrase répétée — ' + txt(t).slice(0, 60));
    vusPh[t] = 1;
  });
  var fin = txt(bloc('som-final').innerHTML);
  var obtenu = Math.round(nb(fin.replace('A =', '')) * 100);
  if (obtenu !== attendu) ko(c + ' : « ' + fin + ' » au lieu de ' + (attendu / 100) +
                             ' pour ' + calcul);
  if (!vus && c !== 'plusieurs') ko(c + ' : aucun calcul posé');
}
print('cas joués : ' + JSON.stringify(cpt));
print(err.length ? 'ÉCHECS :\n - ' + err.join('\n - ') : 'TOUS LES CALCULS SONT JUSTES');
