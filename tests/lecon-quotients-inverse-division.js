/*
 * La leçon « Inverse et division de quotients » (2nde), montée avec le VRAI
 * JSXGraph (renderer « no »).
 *
 * Tout est relu sur la FIGURE, puis refait à côté en fractions exactes.
 *   Volet 1 — le carré unité et le rectangle sont remesurés sur leurs
 *   courbes : le rectangle fait b/d de large et d/b de haut, son aire vaut 1 ;
 *   les deux quadrillages sont recomptés et leurs cases remesurées — ce
 *   doivent être les mêmes cases (1/d × 1/b), en même nombre (b × d). Le
 *   panneau doit conclure « = 1 » et nommer l'inverse d/b.
 *   Volet 2 — la barre mesure a/c, la pièce b/d ; les traits fins découpent
 *   chacune en a·d et b·c petites parts de 1/(c·d) ; les copies reportées
 *   sont remesurées une à une : elles se touchent sans trou ni chevauchement,
 *   les entières font exactement la longueur de la pièce, et leur total —
 *   copies entières plus la fraction de la dernière — est le quotient
 *   (a·d)/(b·c), que le panneau doit annoncer simplifié et écrire comme
 *   produit par l'inverse. La dernière étiquette donne la fraction de pièce
 *   restante. La vérification « quotient × diviseur » du panneau est refaite.
 * Préréglages, saisie (bornée), dé, rejeu à l'identique, et rien de dessiné
 * avant la première étape.
 */
load('tests/lecon-pc-grandeurs-decor.js');
var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
var H = monter('lessons/2nde/quotients-inverse-division.js');
if (H.erreurSetup) ko('setup() plante : ' + H.erreurSetup);
var board = H.board;

function pgcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x || 1; }
function fr(n, d) { var g = pgcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : n + '/' + d; }
function brut(n, d) { return d === 1 ? String(n) : n + '/' + d; }
function strip(h) {
  return String(h).replace(/<span class="eq-frac"><span class="eq-num">([^<]*)<\/span><span class="eq-den">([^<]*)<\/span><\/span>/g, '$1/$2')
    .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
function proche(u, v) { return Math.abs(u - v) < 1e-9; }
function role(r) { return board.objectsList.filter(function (o) { return o.elType === 'curve' && o.mvRole === r; }); }
// la boîte d'une courbe-rectangle : null si elle est vide
function boite(cv) {
  var X = (cv.dataX || []).filter(function (v) { return !isNaN(v); }), Y = (cv.dataY || []).filter(function (v) { return !isNaN(v); });
  if (!X.length) return null;
  return { x0: Math.min.apply(null, X), x1: Math.max.apply(null, X), y0: Math.min.apply(null, Y), y1: Math.max.apply(null, Y) };
}
// les traits d'une courbe à NaN : [{x0,y0,x1,y1}]
function segments(cv) {
  var out = [], X = cv.dataX || [], Y = cv.dataY || [];
  for (var i = 0; i + 1 < X.length; i += 3) out.push({ x0: X[i], y0: Y[i], x1: X[i + 1], y1: Y[i + 1] });
  return out;
}
function verticaux(cv) { return segments(cv).filter(function (s) { return proche(s.x0, s.x1); }).map(function (s) { return s.x0; }).sort(function (u, v) { return u - v; }); }
function horizontaux(cv) { return segments(cv).filter(function (s) { return proche(s.y0, s.y1); }).map(function (s) { return s.y0; }).sort(function (u, v) { return u - v; }); }
function lignes() {
  var out = [], re = /<div class="eq-line( eq-sol)?">([\s\S]*?)<\/div>/g, m, h = H.parClasse('eq-lines')[0].innerHTML;
  while ((m = re.exec(h))) out.push(strip(m[2]));
  return out;
}
function note() { return strip(H.parClasse('eq-note')[0].innerHTML); }
function titre() { return H.textes().filter(function (t) { return t.o.visProp.fontsize === 20; })[0].t; }
function etat() {
  return [H.parClasse('eq-lines')[0].innerHTML, H.panneau(), note(),
          board.objectsList.filter(function (o) { return o.elType === 'curve'; }).map(function (o) { return (o.dataX || []).join(',') + ';' + (o.dataY || []).join(','); }).join('|'),
          H.textes().map(function (t) { return t.t + '@' + t.x.toFixed(6) + ',' + t.y.toFixed(6); }).join('|')].join('§');
}
function rienDeDessine(nom) {
  H.remiseAZero(); board.update();
  var pleines = board.objectsList.filter(function (o) { return o.elType === 'curve' && boite(o); });
  if (pleines.length) ko(nom + 'avant la première étape, rien ne doit être dessiné (' + pleines[0].mvRole + ')');
  if (lignes().length !== 1) ko(nom + 'avant la première étape, une seule ligne au panneau');
}
function rejeu(nom, n) {
  H.jouer(n); var e1 = etat(); H.jouer(n);
  if (etat() !== e1) ko(nom + 'le rejeu ne redonne pas le même écran');
}

var volets = H.parClasse('qd-volet'), cas = H.parClasse('qd-cas'), rand = H.parClasse('eq-rand')[0];
var inA = H.parClasse('qd-a')[0], inC = H.parClasse('qd-c')[0], inB = H.parClasse('qd-b')[0], inD = H.parClasse('qd-d')[0];
if (volets.length !== 2 || cas.length !== 10 || !rand || !inA || !inC || !inB || !inD) ko('2 volets, 10 exemples, 4 champs et un dé attendus');
var nInv = 0, nDiv = 0, vus = { entier: 0, petit: 0, grand: 0, simplifie: 0 };

/* --- Volet 1 : l'inverse ---------------------------------------------- */
function verifierInverse(b, d) {
  var nom = ' [inverse de ' + b + '/' + d + '] ';
  nInv++;
  rienDeDessine(nom);
  if (!H.steps || H.steps.length !== 4) return ko(nom + '4 étapes attendues');
  if (lignes()[0] !== brut(b, d) + ' × ' + brut(d, b)) ko(nom + 'première ligne : ' + lignes()[0]);
  H.jouer(1);
  var U = boite(role('unite')[0]), gu = role('grille-unite')[0];
  if (!U || !proche(U.x0, 0) || !proche(U.x1, 1) || !proche(U.y0, 0) || !proche(U.y1, 1)) ko(nom + 'le carré unité n\'est pas un carré de côté 1');
  if (verticaux(gu).length !== d + 1 || horizontaux(gu).length !== b + 1) ko(nom + 'le carré unité doit avoir ' + d + ' colonnes et ' + b + ' lignes');
  if (boite(role('rectangle')[0])) ko(nom + 'le rectangle ne doit pas être là à la première étape');
  H.jouer(2);
  var R = boite(role('rectangle')[0]), gr = role('grille-rect')[0];
  if (!R) return ko(nom + 'le rectangle manque');
  var w = R.x1 - R.x0, h = R.y1 - R.y0;
  if (!proche(w, b / d) || !proche(h, d / b)) ko(nom + 'le rectangle mesure ' + w + ' × ' + h + ' au lieu de ' + b + '/' + d + ' × ' + d + '/' + b);
  if (!proche(w * h, 1)) ko(nom + 'l\'aire du rectangle vaut ' + (w * h) + ', pas 1');
  if (R.x0 < 1 + 1e-9) ko(nom + 'le rectangle chevauche le carré unité');
  var vr = verticaux(gr), hr = horizontaux(gr), vu = verticaux(gu), hu = horizontaux(gu);
  if (vr.length !== b + 1 || hr.length !== d + 1) ko(nom + 'le rectangle doit avoir ' + b + ' colonnes et ' + d + ' lignes');
  // les mêmes cases : 1/d de large, 1/b de haut, des deux côtés
  [[vr, 1 / d, 'colonnes du rectangle'], [hr, 1 / b, 'lignes du rectangle'], [vu, 1 / d, 'colonnes du carré'], [hu, 1 / b, 'lignes du carré']].forEach(function (g) {
    for (var i = 1; i < g[0].length; i++) if (!proche(g[0][i] - g[0][i - 1], g[1])) ko(nom + 'les ' + g[2] + ' ne font pas ' + g[1]);
  });
  if ((vr.length - 1) * (hr.length - 1) !== (vu.length - 1) * (hu.length - 1)) ko(nom + 'les deux figures n\'ont pas le même nombre de cases');
  if (!proche(vr[0], R.x0) || !proche(vr[vr.length - 1], R.x1) || !proche(hr[hr.length - 1], R.y1)) ko(nom + 'le quadrillage ne remplit pas le rectangle');
  if (lignes().length !== 1) ko(nom + 'rien à écrire avant de compter');
  H.jouer(3);
  var cu = boite(role('case-unite')[0]), cr = boite(role('case-rect')[0]);
  if (!cu || !cr || !proche(cu.x1 - cu.x0, cr.x1 - cr.x0) || !proche(cu.y1 - cu.y0, cr.y1 - cr.y0) || !proche(cu.x1 - cu.x0, 1 / d) || !proche(cu.y1 - cu.y0, 1 / b))
    ko(nom + 'les deux cases mises en valeur doivent être identiques (1/' + d + ' × 1/' + b + ')');
  var yc = H.textes().filter(function (t) { return /cases$/.test(t.t); }).map(function (t) { return t.y; });
  if (yc.length === 2 && Math.abs(yc[0] - yc[1]) < 0.2) ko(nom + 'les deux comptes de cases sont sur la même ligne : ils se chevauchent quand le rectangle est étroit');
  var comptes = H.textes().filter(function (t) { return /cases$/.test(t.t); }).map(function (t) { return t.t; });
  if (comptes.length !== 2 || comptes.some(function (t) { var m = /^(\d+) × (\d+) = (\d+) cases$/.exec(t); return !m || +m[1] * +m[2] !== +m[3] || +m[3] !== b * d; }))
    ko(nom + 'les deux comptes de cases doivent valoir ' + (b * d) + ' : ' + comptes.join(' | '));
  var L = lignes();
  if (L.length !== 2 || L[1] !== '= ' + b + ' × ' + d + '/' + d + ' × ' + b + ' = ' + brut(b * d, b * d)) ko(nom + 'ligne du produit : ' + L[1]);
  if (/= 1$/.test(titre())) ko(nom + 'le titre ne doit pas conclure avant la dernière étape');
  H.jouer(4);
  L = lignes();
  if (L[L.length - 1] !== '= 1') ko(nom + 'la dernière ligne doit être « = 1 » : ' + L[L.length - 1]);
  if (titre() !== brut(b, d) + ' × ' + brut(d, b) + ' = 1') ko(nom + 'titre final : ' + titre());
  if (note().indexOf('L\'inverse de ' + brut(b, d) + ' est ' + brut(d, b)) !== 0) ko(nom + 'la note doit nommer l\'inverse : ' + note());
  if (strip(H.panneau()).indexOf('inverse de ' + brut(b, d) + ' = ' + brut(d, b)) < 0) ko(nom + 'le panneau doit donner l\'inverse');
  if (!/Zéro n'a pas d'inverse/.test(strip(H.panneau())) || !/opposé/.test(strip(H.panneau()))) ko(nom + 'le panneau doit distinguer inverse et opposé, et exclure zéro');
  var F = board.getBoundingBox();
  if (R.x1 > F[2] || R.y1 > F[1] - 0.2 * (F[1] - F[3]) || F[0] > -0.12 || F[3] > -0.95) ko(nom + 'le rectangle ou ses cotes sortent de la fenêtre (' + F.map(function (v) { return v.toFixed(2); }) + ')');
  if (!proche((F[2] - F[0]) / (F[1] - F[3]), board.canvasWidth / board.canvasHeight)) ko(nom + 'le carré unité n\'est pas carré à l\'écran');
  H.sain(nom, ko);
  rejeu(nom, 4);
}

/* --- Volet 2 : la division --------------------------------------------- */
function verifierDivision(a, c, b, d) {
  var nom = ' [' + a + '/' + c + ' ÷ ' + b + '/' + d + '] ';
  nDiv++;
  var qn = a * d, qd = b * c, g = pgcd(qn, qd), Q = fr(qn, qd), q = qn / qd, m = c * d;
  rienDeDessine(nom);
  if (!H.steps || H.steps.length !== 5) return ko(nom + '5 étapes attendues');
  if (lignes()[0] !== brut(a, c) + ' ÷ ' + brut(b, d)) ko(nom + 'première ligne : ' + lignes()[0]);
  H.jouer(1);
  var B = boite(role('barre')[0]);
  if (!B || !proche(B.x0, 0) || !proche(B.x1, a / c)) ko(nom + 'la barre ne mesure pas ' + a + '/' + c);
  if (boite(role('piece')[0])) ko(nom + 'la pièce ne doit pas être là à la première étape');
  var pb = verticaux(role('parts-barre')[0]);
  for (var i = 1; i < pb.length; i++) if (!proche(pb[i] - pb[i - 1], 1 / c)) ko(nom + 'la barre n\'est pas coupée en ' + c + 'ièmes');
  H.jouer(2);
  var P = boite(role('piece')[0]);
  if (!P || !proche(P.x0, 0) || !proche(P.x1, b / d)) ko(nom + 'la pièce ne mesure pas ' + b + '/' + d);
  if (P.y1 > B.y0) ko(nom + 'la pièce doit être sous la barre');
  if (boite(role('copie')[0]) || boite(role('fines-barre')[0])) ko(nom + 'ni copie ni redécoupage avant leur étape');
  H.jouer(3);
  var fb = verticaux(role('fines-barre')[0]), fp = verticaux(role('fines-piece')[0]);
  if (fb.length - 1 !== a * d || fp.length - 1 !== b * c) ko(nom + 'petites parts : ' + (fb.length - 1) + ' et ' + (fp.length - 1) + ' au lieu de ' + (a * d) + ' et ' + (b * c));
  [fb, fp].forEach(function (f) { for (var j = 1; j < f.length; j++) if (!proche(f[j] - f[j - 1], 1 / m)) ko(nom + 'les petites parts ne font pas 1/' + m); });
  if (!proche(fb[fb.length - 1], a / c) || !proche(fp[fp.length - 1], b / d)) ko(nom + 'le redécoupage ne couvre pas exactement la barre et la pièce');
  var L = lignes();
  if (L.length !== 2 || L[1] !== '= ' + brut(a * d, m) + ' ÷ ' + brut(b * c, m)) ko(nom + 'ligne du même dénominateur : ' + L[1]);
  H.jouer(4);
  var copies = role('copie').map(boite).filter(Boolean);
  if (!copies.length) return ko(nom + 'aucune copie reportée');
  var total = 0;
  copies.forEach(function (cp, k) {
    if (!proche(cp.x0, k * b / d)) ko(nom + 'la copie ' + (k + 1) + ' ne commence pas au bout de la précédente');
    if (k < copies.length - 1 && !proche(cp.x1 - cp.x0, b / d)) ko(nom + 'la copie ' + (k + 1) + ' n\'a pas la longueur de la pièce');
    if (cp.x1 - cp.x0 > b / d + 1e-9) ko(nom + 'la copie ' + (k + 1) + ' est plus longue que la pièce');
    if (cp.y1 > B.y0 || cp.y0 < P.y1) ko(nom + 'les copies doivent être entre la barre et la pièce');
    total += (cp.x1 - cp.x0) / (b / d);
  });
  if (!proche(copies[copies.length - 1].x1, a / c)) ko(nom + 'les copies ne s\'arrêtent pas au bout de la barre');
  if (!proche(total, q)) ko(nom + 'la pièce est reportée ' + total + ' fois au lieu de ' + q);
  // les étiquettes des copies : 1, 2, 3… puis la fraction de pièce restante
  var entier = Math.floor(q + 1e-9), reste = fr(qn - entier * qd, qd);
  var etiq = H.textes().filter(function (t) { return t.y > copies[0].y0 && t.y < copies[0].y1; }).sort(function (u, v) { return u.x - v.x; }).map(function (t) { return t.t; });
  var attendu = []; for (var k = 1; k <= entier; k++) attendu.push(String(k)); if (qn % qd) attendu.push(reste);
  if (etiq.join(' ') !== attendu.join(' ')) ko(nom + 'étiquettes des copies : ' + etiq.join(' ') + ' au lieu de ' + attendu.join(' '));
  var dep = boite(role('depasse')[0]);
  if (dep && dep.x1 > board.getBoundingBox()[2]) ko(nom + 'la copie qui dépasse sort de la fenêtre');
  if (!!dep !== (qn % qd !== 0)) ko(nom + 'le contour de la copie qui dépasse est ' + (dep ? 'montré à tort' : 'absent'));
  if (dep && !proche(dep.x1 - dep.x0, b / d)) ko(nom + 'le contour qui dépasse n\'a pas la longueur de la pièce');
  L = lignes();
  if (L.length !== 3 || L[2] !== '= ' + a + ' × ' + d + '/' + c + ' × ' + b) ko(nom + 'ligne du report : ' + L[2]);
  if (titre() !== brut(a, c) + ' ÷ ' + brut(b, d) + ' = ' + Q) ko(nom + 'titre après le report : ' + titre());
  var bas = H.textes().filter(function (t) { return /résultat est plus/.test(t.t); });
  if (q < 1 - 1e-9) { vus.petit++; if (!bas.length || !/plus petit que 1/.test(bas[0].t)) ko(nom + 'une pièce plus longue que la barre : la figure doit le dire'); }
  else if (q > a / c + 1e-9) { vus.grand++; if (!bas.length || !/plus grand que/.test(bas[0].t)) ko(nom + 'diviser par moins que 1 agrandit : la figure doit le dire'); }
  else if (bas.length) ko(nom + 'remarque de bas de figure à tort : ' + bas[0].t);
  H.jouer(5);
  L = lignes();
  if (L.length !== 5 || L[3] !== '= ' + brut(a, c) + ' × ' + brut(d, b)) ko(nom + 'la ligne du produit par l\'inverse : ' + L[3]);
  if (L[4] !== '= ' + Q) ko(nom + 'résultat ' + L[4] + ' au lieu de = ' + Q);
  if (g > 1) { vus.simplifie++; if (!/On simplifie/.test(strip(H.parClasse('eq-lines')[0].innerHTML))) ko(nom + 'la simplification doit être annoncée'); }
  else if (!/irréductible/.test(strip(H.parClasse('eq-lines')[0].innerHTML))) ko(nom + 'la fraction est irréductible : le dire');
  if (qn % qd === 0) vus.entier++;
  if (note() !== brut(a, c) + ' ÷ ' + brut(b, d) + ' = ' + Q) ko(nom + 'note finale : ' + note());
  if (titre() !== brut(a, c) + ' ÷ ' + brut(b, d) + ' = ' + brut(a, c) + ' × ' + brut(d, b) + ' = ' + Q) ko(nom + 'titre final : ' + titre());
  // la vérification du panneau : quotient × diviseur = dividende
  var mv = /multiplication : (\S+) × (\S+) = (\S+?)(?: = (\S+))?, on retrouve bien (\S+)\./.exec(strip(H.panneau()));
  function val(t) { var p = t.split('/'); return p.length === 2 ? +p[0] / +p[1] : +p[0]; }
  if (!mv) ko(nom + 'la vérification manque au panneau');
  else if (!proche(val(mv[1]) * val(mv[2]), val(mv[3])) || !proche(val(mv[3]), a / c) || (mv[4] && !proche(val(mv[4]), a / c)) || mv[5] !== brut(a, c))
    ko(nom + 'vérification fausse : ' + mv[0]);
  H.sain(nom, ko);
  rejeu(nom, 5);
}

if (!err.length) {
  /* Les préréglages. */
  var INV = [[2, 3], [3, 4], [5, 2], [1, 4], [3, 1]], DIV = [[3, 2, 1, 4, '6'], [3, 4, 2, 3, '9/8'], [1, 2, 3, 4, '2/3'], [2, 1, 2, 3, '3'], [5, 6, 5, 3, '1/2']];
  volets[0].onclick();
  if (volets[0].className.indexOf('active') < 0) ko('le volet 1 ne s\'allume pas');
  if (H.parClasse('qd-bloc-ac')[0].style.display !== 'none') ko('au volet 1, seul le quotient b/d se saisit');
  INV.forEach(function (p, i) {
    cas[i].onclick();
    if (cas[i].className.indexOf('active') < 0) ko('inverse : l\'exemple ' + (i + 1) + ' ne s\'allume pas');
    verifierInverse(p[0], p[1]);
  });
  for (var b = 1; b <= 5; b++) for (var d = 1; d <= 5; d++) { inB.value = b; inD.value = d; inB.onchange(); verifierInverse(b, d); }
  inB.value = 0; inD.value = 99; inB.onchange();
  if (+inB.value !== 1 || +inD.value !== 5) ko('inverse : la saisie doit être bornée (0 → 1, 99 → 5), lu ' + inB.value + ' et ' + inD.value);
  for (var t = 0; t < 20; t++) { rand.onclick(); if (+inB.value === +inD.value) ko('dé : b/d = 1 est sans intérêt'); verifierInverse(+inB.value, +inD.value); }

  volets[1].onclick();
  if (H.parClasse('qd-bloc-ac')[0].style.display === 'none') ko('au volet 2, les quatre nombres se saisissent');
  DIV.forEach(function (p, i) {
    cas[5 + i].onclick();
    if (cas[5 + i].className.indexOf('active') < 0) ko('division : l\'exemple ' + (i + 1) + ' ne s\'allume pas');
    verifierDivision(p[0], p[1], p[2], p[3]);
    var L = lignes();
    if (L[L.length - 1] !== '= ' + p[4]) ko('division : exemple ' + (i + 1) + ', ' + L[L.length - 1] + ' au lieu de = ' + p[4]);
  });
  [1, 2, 3, 5, 6].forEach(function (c) { [1, 2, 4, 6].forEach(function (d) { [1, 2, 3 * c].forEach(function (a) { [1, 3, 3 * d].forEach(function (b) {
    inA.value = a; inC.value = c; inB.value = b; inD.value = d; inA.onchange();
    verifierDivision(a, c, b, d);
  }); }); }); });
  inA.value = 99; inC.value = 2; inB.value = 99; inD.value = 9; inA.onchange();
  if (+inA.value !== 6 || +inD.value !== 6 || +inB.value !== 18) ko('division : la saisie doit être bornée (barre et pièce ⩽ 3 unités, dénominateurs ⩽ 6), lu ' + [inA.value, inC.value, inB.value, inD.value]);
  for (t = 0; t < 40; t++) {
    rand.onclick();
    var A = +inA.value, C = +inC.value, Bv = +inB.value, Dv = +inD.value;
    if (A % C === 0 && Bv % Dv === 0) ko('dé : deux entiers, ce n\'est plus une division de quotients');
    if (cas.some(function (x) { return x.className.indexOf('active') >= 0; })) ko('dé : aucun exemple ne doit rester allumé');
    verifierDivision(A, C, Bv, Dv);
  }
  ['entier', 'petit', 'grand', 'simplifie'].forEach(function (k) { if (!vus[k]) ko('cas jamais rencontré : ' + k); });
}
if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('Inverse et division de quotients : ' + nInv + ' inverses (rectangle d\'aire 1, mêmes cases recomptées) et ' + nDiv + ' divisions (copies remesurées, quotient refait en fractions) vérifiés avec le vrai JSXGraph.');
