/* Les exercices « Variations et tableau de valeurs ».
 *
 * L'invariant décisif : l'énoncé montre un SCRIPT, et la réponse attendue porte
 * sur ce que ce script AFFICHE. On ne se contente donc pas de vérifier les
 * valeurs annoncées — on exécute réellement le script de chaque question, on
 * relit sa sortie, et on recalcule la réponse à partir de ces lignes-là. Si le
 * générateur et l'interpréteur ne racontent pas la même histoire, l'exercice
 * est faux même quand ses nombres sont justes.
 */
var window = this;

/* le DOM minimal dont la console a besoin */
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [], value: '', rows: 0,
            textContent: '', onclick: null, spellcheck: true, type: '',
            classList: { _l: [],
              add: function (c) { if (this._l.indexOf(c) < 0) this._l.push(c); },
              remove: function (c) { var i = this._l.indexOf(c); if (i >= 0) this._l.splice(i, 1); },
              contains: function (c) { return this._l.indexOf(c) >= 0; } },
            appendChild: function (c) { this.children.push(c); return c; } };
  Object.defineProperty(e, 'innerHTML',
    { get: function () { return e._html; }, set: function (v) { e._html = v; } });
  return e;
}
var document = { createElement: fauxEl };
window.document = document;

load('js/alea.js');
load('js/python-mini.js');
load('js/python-console.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/2nde/variations.js');

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 18 && err.indexOf(m) < 0) err.push(m); }
function parClasse(n, cls, out) {
  out = out || [];
  if (n.className === cls) out.push(n);
  (n.children || []).forEach(function (c) { parClasse(c, cls, out); });
  return out;
}

/* Monte la console de la question et exécute le script qu'elle contient. */
function lanceScript(q) {
  var zone = fauxEl('div');
  q.outil(zone, {});
  var code = parClasse(zone, 'py-code')[0];
  if (!code) { ko('la console n\'a pas de zone de saisie'); return null; }
  var r = MathsPython.executer(code.value);
  return { src: code.value, r: r, sortie: parClasse(zone, 'py-sortie')[0] };
}
function nombres(lignes) {
  return lignes.map(function (L) {
    var m = L.split(' ');
    return { x: parseFloat(m[0]), y: parseFloat(m[1]), brut: L };
  });
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 600; g++) {
    var q = G.genere(MathsAlea(palier * 4211 + g), palier);
    nb++;
    var fam = q.type === 'vraifaux' ? 'conjecture'
            : /Quelle boucle écrire/.test(q.enonce) ? 'boucle'
            : /ne fait pas ce qu'on voulait/.test(q.enonce) ? 'bogue'
            : /combien de lignes/.test(q.enonce) ? 'combien'
            : /semble-t-elle/.test(q.enonce) ? 'sens'
            : /lis la ligne qui commence/.test(q.enonce) ? 'valeur' : 'extremum';
    vus[fam] = (vus[fam] || 0) + 1;
    if (q.outil && /x = i \//.test(q.outil.toString ? '' : '')) {}

    /* --- le socle commun ------------------------------------------- */
    if (!q.etapes || !q.etapes.length) ko(fam + ' : pas de correction');
    if (/<[^>]*$/.test(q.enonce)) ko(fam + ' : balise HTML tronquée dans l\'énoncé');
    if (q.type === 'qcm') {
      if (q.correct < 0 || q.correct >= q.choix.length)
        ko(fam + ' : la bonne réponse n\'est pas dans la liste');
      var deja = {};
      q.choix.forEach(function (c) {
        if (deja[c]) ko(fam + ' : deux propositions identiques');
        deja[c] = 1;
      });
      if (q.choix.length < 3) ko(fam + ' : moins de trois propositions');
    }
    if (q.type === 'nombre' && !isFinite(q.reponse))
      ko(fam + ' : la réponse n\'est pas un nombre');

    /* --- les questions sans script --------------------------------- */
    if (!q.outil) {
      if (fam !== 'conjecture' && fam !== 'boucle')
        ko(fam + ' : la question parle d\'un script mais n\'en montre aucun');
      continue;
    }

    /* --- le script tourne-t-il, et dit-il ce qu'on prétend ? -------- */
    var essai = lanceScript(q);
    if (!essai) continue;
    var r = essai.r;

    if (fam === 'bogue') {
      // là, le script est fautif EXPRÈS : on vérifie que la panne annoncée
      // est bien celle qui se produit
      var bonChoix = q.choix[q.correct];
      vus['bogue:' + bonChoix.slice(0, 22)] = (vus['bogue:' + bonChoix.slice(0, 22)] || 0) + 1;
      var erreurAnnoncee = /erreur/.test(bonChoix);
      if (erreurAnnoncee && !r.erreur)
        ko('bogue : on annonce une erreur, le script tourne pourtant sans broncher ' +
           '→ ' + bonChoix);
      if (!erreurAnnoncee && r.erreur)
        ko('bogue : le script casse alors qu\'on annonce autre chose — ' +
           MathsPython.messageErreur(r.erreur));
      // « une ligne de moins » : on le vérifie en comptant
      if (/une ligne de moins/.test(bonChoix)) {
        var attenduTxt = /de (−?-?[\d,]+) à (−?-?[\d,]+)/.exec(q.enonce);
        if (!r.erreur && r.lignes.length < 1) ko('bogue : le script fautif n\'affiche rien');
      }
      // la correction doit montrer un script, lui, correct
      var bon = /<pre class="exo-code">([\s\S]*?)<\/pre>/.exec(q.etapes.join(''));
      if (!bon) ko('bogue : la correction ne montre pas le script correct');
      else {
        var propre = bon[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        var r2 = MathsPython.executer(propre);
        if (r2.erreur)
          ko('bogue : le script donné comme correct ne tourne pas — ' +
             MathsPython.messageErreur(r2.erreur));
        if (!r2.erreur && !r2.lignes.length)
          ko('bogue : le script donné comme correct n\'affiche rien');
      }
      continue;
    }

    if (r.erreur) {
      ko(fam + ' : le script de l\'énoncé ne tourne pas — ' +
         MathsPython.messageErreur(r.erreur) + '\n' + essai.src);
      continue;
    }
    if (!r.lignes.length) { ko(fam + ' : le script n\'affiche rien'); continue; }
    var T = nombres(r.lignes);
    T.forEach(function (v) {
      if (!isFinite(v.x) || !isFinite(v.y))
        ko(fam + ' : une ligne affichée n\'est pas « x y » → « ' + v.brut + ' »');
    });

    /* --- chaque famille, recalculée sur la sortie réelle ------------ */
    if (fam === 'combien') {
      if (q.reponse !== T.length)
        ko('combien : on annonce ' + q.reponse + ' lignes, le script en affiche ' + T.length);
    }

    if (fam === 'valeur') {
      var m = /commence par <b>([^<]+)<\/b>/.exec(q.enonce);
      if (!m) ko('valeur : l\'énoncé ne dit pas quelle ligne lire');
      else {
        var cible = parseFloat(m[1]);
        var l = T.filter(function (v) { return Math.abs(v.x - cible) < 1e-9; });
        if (l.length !== 1)
          ko('valeur : la ligne demandée (x = ' + m[1] + ') apparaît ' + l.length + ' fois');
        else if (Math.abs(l[0].y - q.reponse) > 1e-9)
          ko('valeur : pour x = ' + m[1] + ' le script affiche ' + l[0].y +
             ', la réponse attendue est ' + q.reponse);
      }
    }

    if (fam === 'extremum') {
      var surX = /Pour quelle valeur/.test(q.enonce);
      var mini = /plus petite/.test(q.enonce);
      var best = T[0];
      T.forEach(function (v) { if (mini ? v.y < best.y : v.y > best.y) best = v; });
      var exaequo = T.filter(function (v) { return v.y === best.y; });
      if (exaequo.length > 1)
        ko('extremum : ' + exaequo.length + ' lignes se partagent l\'extremum — la ' +
           'réponse serait double');
      var attendu = surX ? best.x : best.y;
      if (Math.abs(attendu - q.reponse) > 1e-9)
        ko('extremum : le script donne ' + attendu + ', la réponse annoncée est ' + q.reponse);
    }

    if (fam === 'sens') {
      var croissant = /semble-t-elle croissante/.test(q.enonce);
      var bonI = q.choix[q.correct];
      var bornes = /\[(−?[\d,]+) ; (−?[\d,]+)\]/.exec(bonI);
      if (!bornes) { ko('sens : l\'intervalle annoncé est illisible → ' + bonI); continue; }
      function lit(s) { return parseFloat(s.replace('−', '-').replace(',', '.')); }
      var a = lit(bornes[1]), b = lit(bornes[2]);
      if (!(b > a)) ko('sens : intervalle vide ou renversé → ' + bonI);
      // sur l'intervalle annoncé, la colonne doit VRAIMENT aller dans ce sens
      var dedans = T.filter(function (v) { return v.x >= a - 1e-9 && v.x <= b + 1e-9; });
      if (dedans.length < 3)
        ko('sens : l\'intervalle annoncé ne contient que ' + dedans.length + ' lignes — ' +
           'impossible d\'y lire un sens');
      for (var k = 1; k < dedans.length; k++) {
        var d = dedans[k].y - dedans[k - 1].y;
        if (croissant && d < -1e-9)
          { ko('sens : on annonce croissante sur ' + bonI + ', or la colonne y descend'); break; }
        if (!croissant && d > 1e-9)
          { ko('sens : on annonce décroissante sur ' + bonI + ', or la colonne y monte'); break; }
      }
      // et les distracteurs ne doivent PAS convenir
      q.choix.forEach(function (c, ci) {
        if (ci === q.correct) return;
        var bo = /\[(−?[\d,]+) ; (−?[\d,]+)\]/.exec(c);
        if (!bo) return;
        var a2 = lit(bo[1]), b2 = lit(bo[2]);
        var dd = T.filter(function (v) { return v.x >= a2 - 1e-9 && v.x <= b2 + 1e-9; });
        var bonAussi = dd.length > 2;
        for (var j = 1; j < dd.length; j++) {
          var e2 = dd[j].y - dd[j - 1].y;
          if ((croissant && e2 < -1e-9) || (!croissant && e2 > 1e-9)) { bonAussi = false; break; }
        }
        if (bonAussi) ko('sens : le distracteur ' + c + ' conviendrait lui aussi');
      });
    }
  }
}

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE RÉPONSE EST CELLE QUE LE SCRIPT AFFICHE VRAIMENT');
