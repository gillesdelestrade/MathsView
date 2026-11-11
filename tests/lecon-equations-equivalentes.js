/*
 * La leçon « Équations équivalentes » (2nde).
 *
 * La leçon affirme que trois opérations ne changent pas les solutions : le
 * contrôle ne la croit pas sur parole. Chaque ligne écrite au panneau est
 * RELUE et transformée en fonction de x, puis :
 *   - la ligne de l'opération doit valoir, pour tout x, le membre de départ
 *     auquel le contrôle applique lui-même l'opération (+ k, + k·x, × k, ÷ k),
 *     des deux côtés ; pour le volet 3, la réécriture doit valoir exactement le
 *     membre de départ (un développement faux ne passe pas) ;
 *   - la ligne réduite doit valoir la précédente, sans parenthèse ni × ni ÷ ;
 *   - les solutions de l'équation de départ ET celles de l'équation d'arrivée
 *     sont retrouvées ici par le discriminant : ce doit être le même ensemble,
 *     et c'est celui que S annonce.
 * Multiplier par 0 doit au contraire être dénoncé (0 = 0, S = ℝ, « pas
 * équivalentes ») et diviser par 0 refusé. Sur la figure, les deux courbes
 * tracées sont celles de la dernière ligne, les pointillés celles du départ,
 * et le croisement reste au-dessus du même x PENDANT tout le mouvement, pas
 * seulement à la fin. Le point de test dit « solution » exactement sur les
 * solutions ; la phrase « d'un seul côté » annonce une solution recalculée,
 * différente de la vraie. Le curseur agit en direct sans relancer
 * l'animation, le dé tire des équations à solution entière, et le rejeu
 * redonne le même écran.
 */
load('tests/lecon-equations-equivalentes-decor.js');

var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function strip(h) {
  return String(h).replace(/<span class="eq-frac"><span class="eq-num">([^<]*)<\/span><span class="eq-den">([^<]*)<\/span><\/span>/g, '($1)/($2)')
    .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
/* Un membre tel qu'il est écrit → une fonction de x. */
function expr(t) {
  var s = String(t).replace(/−/g, '-').replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').replace(/\s+/g, '')
    .replace(/²/g, '**2').replace(/(\d)x/g, '$1*x').replace(/(\d)\(/g, '$1*(').replace(/\)\(/g, ')*(').replace(/x\(/g, 'x*(')
    .replace(/\)x/g, ')*x').replace(/(^|[^\d*)])x/g, '$1(x)').replace(/\)\(/g, ')*(').replace(/(\d)\(x\)/g, '$1*(x)');
  try { var f = new Function('x', 'return (' + s + ');'); f(1.5); return f; } catch (e) { return null; }
}
var XS = [-2.5, -1, 0, 0.5, 2, 3.25];
function memes(f, g) { return XS.every(function (x) { return Math.abs(f(x) - g(x)) < 1e-9; }); }
/* Les solutions de L = R (degré ⩽ 2), par le discriminant. 'R' si tout x convient. */
function racines(L, R) {
  function P(x) { return L(x) - R(x); }
  var p0 = P(0), p1 = P(1), p2 = P(-1), A = (p1 + p2) / 2 - p0, B = (p1 - p2) / 2, C = p0;
  if (Math.abs(A * 4 + B * 2 + C - P(2)) > 1e-9) return null;
  if (Math.abs(A) < 1e-12) return Math.abs(B) < 1e-12 ? (Math.abs(C) < 1e-12 ? 'R' : []) : [-C / B];
  var dl = B * B - 4 * A * C;
  if (dl < -1e-12) return [];
  if (dl < 1e-12) return [-B / (2 * A)];
  var r1 = (-B - Math.sqrt(dl)) / (2 * A), r2 = (-B + Math.sqrt(dl)) / (2 * A);
  return [Math.min(r1, r2), Math.max(r1, r2)];
}
function nb(t) {
  t = String(t).replace(/−/g, '-').replace(',', '.').trim();
  var m = /^(-?)(\d+)\/(\d+)$/.exec(t);
  return m ? (m[1] ? -1 : 1) * +m[2] / +m[3] : parseFloat(t);
}
function pareils(u, v) { return u !== 'R' && v !== 'R' && u && v && u.length === v.length && u.every(function (x, i) { return Math.abs(x - v[i]) < 1e-9; }); }

var linesEl = parClasse('eq-lines')[0], noteEl = parClasse('eq-note')[0], panel = parClasse('props-panel')[0];
var volets = parClasse('eqv-volet'), cas = parClasse('eqv-cas'), genres = parClasse('eqv-genre');
var curseur = parClasse('eqv-k')[0], lu = parClasse('eqv-lu')[0], rands = parClasse('eq-rand');
if (volets.length !== 3 || cas.length !== 13 || genres.length !== 2 || !curseur || !lu || rands.length !== 1) ko('3 volets, 13 préréglages, 2 genres, un curseur et un dé attendus');
var PX = objets.filter(function (o) { return o.type === 'point' && o.attrs.fixed === false; })[0];
var SOL = objets.filter(function (o) { return o.type === 'point' && o.attrs.size === 6 && o.attrs.fixed === true; });
var CROIX = objets.filter(function (o) { return o.type === 'point' && o.attrs.size === 4.5; });
var courbes = objets.filter(function (o) { return o.type === 'functiongraph'; });
var labP = objets.filter(function (o) { return o.type === 'text' && typeof o.parents[2] === 'function' && /✓|✗/.test(o.texte()); })[0];
if (!PX || SOL.length !== 2 || CROIX.length !== 2 || courbes.length !== 5 || !labP) ko('objets de la figure introuvables');
var GL = courbes[0], GR = courbes[1], CL = courbes[2], CR = courbes[3], OV = courbes[4];

function lignes() {
  var out = [], re = /<div class="eq-line( eq-sol)?">([\s\S]*?)<\/div>/g, m;
  while ((m = re.exec(linesEl.innerHTML))) out.push(strip(m[2]));
  return out;
}
function membres(l) {
  var d = l.replace(/^(⟺|✗|soit) /, '').split(' = ');
  if (d.length !== 2) return null;
  var L = expr(d[0]), R = expr(d[1]);
  return L && R ? { L: L, R: R, lt: d[0], rt: d[1] } : null;
}
function etat() {
  return [linesEl.innerHTML, noteEl.innerHTML, panel.innerHTML, PX.X(), labP.texte(),
          objets.map(function (o) { return JSON.stringify(o.attrs); }).join('|')].join('§');
}
function toutJouer() { remiseAZero(); steps.forEach(function (s) { s.step(0.3); s.step(1); s.after(); }); }

var vus = { x0: 0, d0: 0, neutre: 0, seul: 0, deux: 0 }, n = 0;

/* Une équation des volets 1 et 2, dans l'état où la leçon vient de l'armer. */
function verifier(nom, v, genre, k) {
  n++;
  remiseAZero();
  var L0 = lignes();
  if (L0.length !== 1) return ko(nom + 'au départ, une seule ligne : ' + L0.join(' | '));
  var dep = membres(L0[0]);
  if (!dep) return ko(nom + 'équation de départ illisible : ' + L0[0]);
  var R0 = racines(dep.L, dep.R);
  if (!R0 || R0 === 'R' || !R0.length) return ko(nom + 'l\'équation de départ doit avoir des solutions');
  if (R0.length === 2) vus.deux++;
  if (visible(CL) || visible(GL) || visible(OV)) ko(nom + 'rien ne doit être tracé avant la première étape');

  // ce que l'opération doit donner, refait ici
  var x0 = v === 'mul' && genre === 'fois' && k === 0, d0 = v === 'mul' && genre === 'div' && k === 0;
  function op(f) {
    return function (x) {
      if (v === 'ecr' || d0) return f(x);
      if (v === 'add') return genre === 'x' ? f(x) + k * x : f(x) + k;
      return genre === 'fois' ? k * f(x) : f(x) / k;
    };
  }
  var attL = op(dep.L), attR = op(dep.R);
  var plan = v === 'ecr' ? ['depart', 'op', 'sol'] : ['depart', 'op', 'reduit', 'sol'];
  if (steps.length !== plan.length) return ko(nom + plan.length + ' étapes attendues, ' + steps.length);

  var fin = null;
  steps.forEach(function (s, i) {
    s.step(0.5);
    // pendant le mouvement, le croisement reste au-dessus des solutions de départ
    if (plan[i] === 'op' && !d0) R0.forEach(function (r) {
      if (Math.abs(CL.parents[0](r) - CR.parents[0](r)) > 1e-9) ko(nom + 'à mi-mouvement, les courbes ne se croisent plus en x = ' + r);
    });
    s.step(1); s.after();
    var L = lignes();
    if (plan[i] === 'depart') {
      if (L.length !== 1) ko(nom + 'tracer les courbes ne doit rien écrire de plus');
      if (!visible(CL) || !visible(CR)) ko(nom + 'les deux membres doivent être tracés');
      if (!memes(CL.parents[0], dep.L) || !memes(CR.parents[0], dep.R)) ko(nom + 'les courbes tracées ne sont pas les membres de l\'équation');
    }
    if (plan[i] === 'op') {
      if (L.length !== 2) return ko(nom + 'après l\'opération, deux lignes : ' + L.join(' | '));
      if (d0) { if (!/impossible/.test(L[1])) ko(nom + 'diviser par 0 doit être refusé : ' + L[1]); return; }
      var o = membres(L[1]);
      if (!o) return ko(nom + 'ligne de l\'opération illisible : ' + L[1]);
      if (!memes(o.L, attL) || !memes(o.R, attR)) ko(nom + 'la ligne « ' + L[1] + ' » n\'est pas l\'opération annoncée, appliquée aux deux membres');
      if ((/^⟺/.test(L[1])) === x0) ko(nom + 'le signe ⟺ est ' + (x0 ? 'écrit pour × 0' : 'absent') + ' : ' + L[1]);
      if (v === 'ecr') {
        if (o.lt === dep.lt) ko(nom + 'le membre de gauche doit être réécrit');
        if (o.rt !== dep.rt) ko(nom + 'le membre de droite ne doit pas changer');
        if (!visible(OV) || !memes(OV.parents[0], dep.L)) ko(nom + 'la réécriture doit retracer la même courbe');
        if (visible(GL)) ko(nom + 'rien ne bouge au volet 3 : pas de pointillés');
        fin = o;
      }
    }
    if (plan[i] === 'reduit' && !d0) {
      if (L.length !== 3) return ko(nom + 'après la réduction, trois lignes : ' + L.join(' | '));
      var r = membres(L[2]);
      if (!r) return ko(nom + 'ligne réduite illisible : ' + L[2]);
      if (!memes(r.L, attL) || !memes(r.R, attR)) ko(nom + 'la ligne réduite « ' + L[2] + ' » ne vaut pas la précédente');
      if (/[()×÷]/.test(r.lt + r.rt)) ko(nom + 'la ligne réduite ne l\'est pas : ' + L[2]);
      fin = r;
    }
  });
  var L = lignes(), der = L[L.length - 1];
  if (d0) {
    vus.d0++;
    if (!/^S = \{/.test(der)) ko(nom + 'après ÷ 0, S reste celui du départ : ' + der);
    if (!/jamais par 0/.test(strip(noteEl.innerHTML))) ko(nom + 'la note doit dire qu\'on ne divise jamais par 0');
    if (visible(GL)) ko(nom + 'après ÷ 0, rien ne doit avoir bougé');
    return;
  }
  if (!fin) return ko(nom + 'pas d\'équation d\'arrivée');
  var R1 = racines(fin.L, fin.R);
  if (x0) {
    vus.x0++;
    if (R1 !== 'R') ko(nom + '× 0 doit donner une équation vraie partout');
    if (der !== 'S = ℝ') ko(nom + '× 0 : S = ℝ attendu, lu ' + der);
    if (!/pas équivalentes/.test(strip(linesEl.innerHTML)) || !/Pas équivalentes/.test(strip(panel.innerHTML))) ko(nom + '× 0 doit être dénoncé comme non équivalent');
    if (SOL.filter(visible).length) ko(nom + '× 0 : pas de point vert de solution');
  } else {
    // LE contrôle : mêmes solutions avant et après, retrouvées ici
    if (!pareils(R0, R1)) ko(nom + 'les équations de départ et d\'arrivée n\'ont pas les mêmes solutions : ' + R0 + ' / ' + R1);
    var mS = /^S = \{(.*)\}$/.exec(der);
    if (!mS) return ko(nom + 'pas de S final : ' + der);
    if (!pareils(mS[1].split(' ; ').map(nb), R0)) ko(nom + der + ' au lieu de {' + R0.join(' ; ') + '}');
    if (!/équivalentes/.test(strip(linesEl.innerHTML)) || /pas/.test(strip(linesEl.innerHTML))) ko(nom + 'la conclusion doit dire « équivalentes »');
    var verts = SOL.filter(visible);
    if (verts.length !== R0.length) ko(nom + verts.length + ' point(s) vert(s) pour ' + R0.length + ' solution(s)');
    verts.forEach(function (s, i) { if (Math.abs(s.X() - R0[i]) > 1e-9 || s.Y() !== 0) ko(nom + 'point vert en ' + s.X() + ' au lieu de ' + R0[i]); });
  }
  // la figure finale : les courbes pleines sont l'équation d'arrivée, les pointillés celle du départ
  if (!memes(CL.parents[0], fin.L) || !memes(CR.parents[0], fin.R)) ko(nom + 'les courbes finales ne sont pas celles de la dernière équation');
  if (!memes(GL.parents[0], dep.L) || !memes(GR.parents[0], dep.R)) ko(nom + 'les pointillés ne sont pas l\'équation de départ');
  if (visible(GL) !== (v !== 'ecr') || visible(GR) !== (v !== 'ecr')) ko(nom + 'les pointillés du départ sont ' + (visible(GL) ? 'montrés à tort' : 'absents'));
  CROIX.filter(visible).forEach(function (c, i) {
    if (Math.abs(c.X() - R0[i]) > 1e-9) ko(nom + 'croisement dessiné en x = ' + c.X() + ' au lieu de ' + R0[i]);
    if (Math.abs(c.Y() - fin.L(R0[i])) > 1e-9 || Math.abs(c.Y() - fin.R(R0[i])) > 1e-9) ko(nom + 'le croisement dessiné n\'est pas sur les deux courbes');
  });
  // le point de test
  [R0[0], R0[0] + 0.5, R0[R0.length - 1] - 1, R0[R0.length - 1]].forEach(function (x) {
    x = Math.round(x * 2) / 2;
    PX.setPosition(1, [x, 0]); PX._ev.drag();
    var sol = x0 || Math.abs(dep.L(PX.X()) - dep.R(PX.X())) < 1e-9;
    if ((/✓/.test(labP.texte())) !== sol) ko(nom + 'en x = ' + PX.X() + ', l\'étiquette dit ' + strip(labP.texte()));
    var pt = strip(panel.innerHTML);
    if (!x0 && !/Le même verdict/.test(pt)) ko(nom + 'en x = ' + PX.X() + ', les deux équations doivent avoir le même verdict');
    if (x0 && (/Le verdict a changé/.test(pt)) !== (Math.abs(dep.L(PX.X()) - dep.R(PX.X())) > 1e-9)) ko(nom + 'en x = ' + PX.X() + ', × 0 change le verdict hors de la solution');
  });
  // et d'un seul côté ?
  var ms = /qu'à gauche — (.*?) = (.*?) —, (.*?) : l'équation aurait changé/.exec(strip(panel.innerHTML));
  var neutre = v !== 'ecr' && ((v === 'add' && k === 0) || (v === 'mul' && k === 1));
  if (neutre) vus.neutre++;
  if (ms) {
    vus.seul++;
    var Ls = expr(ms[1]), Rs = expr(ms[2]);
    if (!Ls || !Rs || !memes(Ls, attL) || !memes(Rs, dep.R)) ko(nom + '« d\'un seul côté » : ' + ms[1] + ' = ' + ms[2] + ' n\'est pas l\'opération faite à gauche seulement');
    else {
      var Rseul = racines(Ls, Rs), md = /deviendrait (.*?) au lieu de (.*)$/.exec(ms[3]);
      if (pareils(Rseul, R0)) ko(nom + '« d\'un seul côté » ne change pas les solutions : la phrase est fausse');
      if (md && (!Rseul || Rseul === 'R' || Rseul.length !== 1 || Math.abs(nb(md[1]) - Rseul[0]) > 1e-9 || Math.abs(nb(md[2]) - R0[0]) > 1e-9)) ko(nom + '« d\'un seul côté » : ' + ms[3] + ' alors que la solution serait ' + Rseul);
      if (/plus aucune/.test(ms[3]) && !(Rseul && Rseul.length === 0)) ko(nom + '« plus aucune solution » annoncé à tort');
      if (/tous les nombres/.test(ms[3]) && Rseul !== 'R') ko(nom + '« tous les nombres » annoncé à tort');
    }
  } else if (v !== 'ecr' && !x0 && !neutre) {
    // absente seulement si, par coïncidence, la solution ne changerait pas
    if (!pareils(racines(attL, dep.R), R0)) ko(nom + 'la phrase « d\'un seul côté » manque');
  }
  // le rejeu
  toutJouer(); var e1 = etat(); toutJouer();
  if (etat() !== e1) ko(nom + 'le rejeu ne redonne pas le même écran');
}

/* --- Les préréglages, tels quels ---------------------------------------- */
var PRE = {
  add: [['2x − 1 = x + 2', '{3}'], ['2x = x + 3', '{3}'], ['x − 4 = −2x + 5', '{3}'], ['3x + 2 = x − 2', '{−2}']],
  mul: [['x/2 + 1 = 2', '{2}'], ['4x = 2x + 2', '{1}'], ['−x + 2 = x − 4', '{3}'], ['3x = 6', '{2}'], ['2x − 4 = x − 1', 'ℝ']],
  ecr: [['2(x + 3) = x + 4', '{−2}'], ['3x + 2 − x + 4 = 10', '{2}'], ['x² − 3x = 0', '{0 ; 3}'], ['(x − 1)² = x² − 3', '{2}']]
};
var GENRES = { add: ['nb', 'x'], mul: ['fois', 'div'] }, OPS = { add: [['nb', 1], ['x', -1], ['x', 2], ['nb', -2]], mul: [['fois', 2], ['div', 2], ['fois', -1], ['div', 3], ['fois', 0]] };
var rang = 0;
['add', 'mul', 'ecr'].forEach(function (v, iv) {
  volets[iv].onclick();
  if (volets[iv].className.indexOf('active') < 0) ko('le volet ' + (iv + 1) + ' ne s\'allume pas');
  if ((parClasse('ineq-presets')[4].style.display === 'none') !== (v === 'ecr')) ko('la rangée de l\'opération doit être masquée au volet 3, et seulement là');
  PRE[v].forEach(function (p, i) {
    var bt = cas[rang++];
    bt.onclick();
    if (bt.className.indexOf('active') < 0) ko(v + ' : le préréglage ' + (i + 1) + ' ne s\'allume pas');
    var nom = ' [' + v + ' ' + p[0] + '] ';
    if (lignes()[0] !== p[0]) ko(nom + 'équation lue : ' + lignes()[0]);
    var g = v === 'ecr' ? null : OPS[v][i][0], k = v === 'ecr' ? null : OPS[v][i][1];
    verifier(nom, v, g, k);
    toutJouer();
    var L = lignes();
    if (L[L.length - 1] !== 'S = ' + p[1]) ko(nom + L[L.length - 1] + ' au lieu de S = ' + p[1]);
    if (v === 'ecr') return;
    // le curseur, dans les deux genres : en direct, sans relancer l'animation
    GENRES[v].forEach(function (genre, ig) {
      genres[ig].onclick();
      if (genres[ig].className.indexOf('active') < 0) ko(nom + 'le genre ' + genre + ' ne s\'allume pas');
      var lim = v === 'mul' ? 5 : 6;
      for (var kk = -lim; kk <= lim; kk++) {
        var avant = steps;
        curseur.value = String(kk); curseur.oninput();
        if (steps !== avant) ko(nom + 'le curseur ne doit pas relancer l\'animation');
        var attendu = v === 'mul' && kk === 0 ? (genre === 'fois' ? 4 : 3) : 4;
        if (lignes().length !== attendu) ko(nom + genre + ' ' + kk + ' : le curseur doit montrer l\'état final (' + lignes().length + ' lignes)');
        var aff = v === 'mul' ? (genre === 'fois' ? '× ' : '÷ ') + (kk < 0 ? '(−' + (-kk) + ')' : kk)
                : (kk < 0 ? '− ' : '+ ') + (genre === 'x' && kk !== 0 ? (Math.abs(kk) === 1 ? '' : Math.abs(kk)) + 'x' : Math.abs(kk));
        if (lu.textContent !== aff) ko(nom + 'le curseur affiche « ' + lu.textContent + ' » au lieu de « ' + aff + ' »');
        verifier(nom + genre + ' ' + kk + ' ', v, genre, kk);
      }
      curseur.value = '99'; curseur.oninput();
      if (lignes().length !== 4) ko(nom + 'une valeur hors bornes doit être ramenée dans les bornes');
    });
  });
});

/* --- Le dé ---------------------------------------------------------------- */
[0, 1].forEach(function (iv) {
  volets[iv].onclick();
  for (var t = 0; t < 40; t++) {
    rands[0].onclick();
    var dep = membres(lignes()[0]);
    if (!dep) { ko('dé : équation illisible ' + lignes()[0]); continue; }
    var R = racines(dep.L, dep.R);
    if (!R || R === 'R' || R.length !== 1 || Math.abs(R[0] - Math.round(R[0])) > 1e-9 || Math.abs(R[0]) > 3) { ko('dé : ' + lignes()[0] + ' doit avoir une solution entière entre −3 et 3'); continue; }
    if (cas.some(function (b) { return b.className.indexOf('active') >= 0; })) ko('dé : aucun préréglage ne doit rester allumé');
    // l'opération tirée est relue sur le curseur et les pastilles
    var k = parseInt(curseur.value, 10), g = GENRES[iv ? 'mul' : 'add'][genres[0].className.indexOf('active') >= 0 ? 0 : 1];
    if (k === 0 || (iv === 1 && k === 1)) ko('dé : opération sans effet tirée (' + g + ' ' + k + ')');
    verifier(' [dé ' + lignes()[0] + ' ' + g + ' ' + k + '] ', iv ? 'mul' : 'add', g, k);
  }
});

if (!vus.x0 || !vus.d0 || !vus.neutre || !vus.seul || !vus.deux) ko('cas jamais rencontré : ' + JSON.stringify(vus));
if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('Équations équivalentes : ' + n + ' transformations relues, solutions avant/après retrouvées par le discriminant (' + vus.x0 + ' × 0 dénoncés, ' + vus.d0 + ' ÷ 0 refusés, ' + vus.seul + ' « d\'un seul côté » recalculés), figure et rejeu vérifiés.');
