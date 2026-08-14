/* On relit le HTML produit par le tableau de bord : autant de colonnes dans
   l'en-tête que dans chaque ligne, et la valeur des pièces au bon endroit. */
var s = read('js/admin.js');
var mThead = s.match(/tbl\.innerHTML = ([\s\S]*?)';\n/);
var entete = (s.match(/<th>[^<]*<\/th>/g) || []).slice(0, 7);
print('en-tête : ' + entete.join(' | '));

// on extrait le corps de la ligne, tel qu'il est écrit
var deb = s.indexOf("      tr.innerHTML =");
var fin = s.indexOf("tr.onclick", deb);
var corps = s.slice(deb, fin);
var cells = corps.match(/'<td[ >]/g) || [];
print('colonnes de l\'en-tête : ' + entete.length + '   cellules par ligne : ' + cells.length);

var err = [];
if (entete.length !== cells.length) err.push('l\'en-tête et les lignes n\'ont pas le même nombre de colonnes');
if (entete[1] !== '<th>XP</th>') err.push('la 2e colonne n\'est plus XP');
if (entete[2] !== '<th>Pièces</th>') err.push('les pièces ne sont pas juste après l\'XP : ' + entete[2]);
// la cellule des pièces doit bien afficher r.pieces, et être la 3e
var ordre = corps.match(/r\.xp|r\.pieces|r\.travaillees|s\.taux|s\.temps|s\.semaine/g) || [];
print('valeurs, dans l\'ordre : ' + ordre.join(', '));
if (ordre[0] !== 'r.xp' || ordre[1] !== 'r.pieces') err.push('l\'ordre des valeurs ne suit pas l\'en-tête');
// resume() fournit-il bien `pieces` ?
var prog = read('js/progression.js');
if (!/return \{[\s\S]*?pieces: e\.pieces \|\| 0/.test(prog)) err.push('resume() ne renvoie pas les pièces');
// les pièces d'une demande en attente sont-elles déjà débitées ?
var bout = read('js/boutique.js');
if (!/etat\.pieces = \(etat\.pieces \|\| 0\) - art\.cout/.test(bout))
  err.push('les pièces ne sont pas débitées à la demande : « disponibles » serait faux');
print(err.length ? 'ÉCHECS :\n - ' + err.join('\n - ')
                 : 'TABLEAU COHÉRENT : 7 colonnes, les pièces juste après l\'XP,\n' +
                   'et la valeur affichée est bien le solde disponible');
