/*
 * fn-image — calcul d'une image (SPEC §3.1).
 *
 * Le pool fournit tout : l'écriture de la fonction (tex), sa valeur (valeur),
 * son ensemble de définition (defini) et le détail du calcul (calcul), qui
 * devient la correction sans une ligne de rédaction supplémentaire.
 *
 * Seule précaution : on ne pose la question que si l'image « tombe juste »
 * (POOL.exact), sinon l'élève n'aurait aucun moyen d'écrire la réponse — √3
 * ne se tape pas dans un champ de saisie de la classe de seconde.
 */
MathsExos.register({
  id: 'fn-image',
  competence: 'fn-images',
  level: '2nde',
  titre: 'Calculer une image',
  paliers: 4,

  genere: function (rnd, palier) {
    var POOL = ExosFonctions.pool();
    var f = rnd.choix(ExosFonctions.fonctions(palier));
    var p = ExosFonctions.params(rnd, f, palier);

    // Un x du domaine, dont l'image s'écrit exactement.
    var x = null;
    for (var essai = 0; essai < 80; essai++) {
      var c = rnd.entier(-6, 6);
      if (!POOL.defini(f, c, p)) continue;
      if (!POOL.exact(POOL.valeur(f, c, p))) continue;
      x = c;
      break;
    }
    if (x === null) { x = 1; p = POOL.defauts(f); }   // filet : toujours calculable

    var y = POOL.valeur(f, x, p);

    return {
      enonce: 'Soit \\(' + ExosFonctions.defTex(f, p) + '\\). Calcule \\(f(' +
              POOL.texNum(x) + ')\\).',
      type: 'nombre',
      reponse: y,
      etapes: [
        'On remplace \\(x\\) par ' + POOL.par(x) + ' dans l\'expression de \\(f\\).',
        '<b>f(' + POOL.nb(x) + ') = ' + POOL.chaine(f.calcul(x, p)) + '</b>'
      ],
      indices: [
        'Remplace \\(x\\) par ' + POOL.par(x) + ' — partout où il apparaît.',
        x < 0 ? 'Attention aux parenthèses : ' + POOL.par(x) + ', pas ' +
                POOL.nb(x) + ' tout seul.'
              : 'Effectue ensuite les opérations dans l\'ordre des priorités.'
      ],
      duree: 45
    };
  }
});
