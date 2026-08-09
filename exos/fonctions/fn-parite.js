/*
 * fn-parite — paire, impaire, ou ni l'une ni l'autre (SPEC §3.4).
 *
 * Le verdict vient de POOL.parite(f, p).type, établi par le pool en comparant
 * f(−x) et f(x) : rien à déclarer, rien à maintenir.
 *
 * On écarte deux cas où la question n'a pas de sens :
 *   'domaine' — le domaine n'est pas symétrique (√x), la question ne se pose pas ;
 *   'deux'    — la fonction nulle est à la fois paire et impaire, et aucun des
 *               trois choix ne serait juste.
 *
 * Après coup, le pool fournit de quoi justifier dans les deux sens : `calcul`
 * (l'écriture de f(−x) étape par étape) quand la fonction est paire ou impaire,
 * `contre` (un contre-exemple chiffré) quand elle n'est ni l'une ni l'autre.
 */
MathsExos.register({
  id: 'fn-parite',
  competence: 'fn-parite',
  level: '2nde',
  titre: 'Parité d\'une fonction',
  paliers: 3,

  genere: function (rnd, palier) {
    var POOL = ExosFonctions.pool();

    var f, p, par;
    for (var essai = 0; essai < 60; essai++) {
      f = rnd.choix(ExosFonctions.fonctions(palier, 3));
      p = ExosFonctions.params(rnd, f, palier);
      par = POOL.parite(f, p);
      if (par.type !== 'domaine' && par.type !== 'deux') break;
    }
    if (!par || par.type === 'domaine' || par.type === 'deux') {
      f = POOL.get('carre'); p = {}; par = POOL.parite(f, p);
    }

    // L'ordre des choix est mélangé par la graine : rejouer l'exercice redonne
    // exactement la même disposition.
    var LIB = { paire: 'Paire', impaire: 'Impaire', aucune: 'Ni l\'une ni l\'autre' };
    var cles = rnd.melange(['paire', 'impaire', 'aucune']);
    var choix = cles.map(function (c) { return LIB[c]; });

    var etapes = [];
    if (par.type === 'aucune' && par.contre) {
      var c = par.contre;
      etapes.push('Il suffit d\'un <b>contre-exemple</b>. Prenons \\(x = ' +
        POOL.texNum(c.x) + '\\) :');
      etapes.push('\\(f(' + POOL.texNum(c.x) + ') = ' + POOL.texNum(c.fx) +
        '\\) tandis que \\(f(' + POOL.texNum(-c.x) + ') = ' + POOL.texNum(c.fmx) + '\\).');
      etapes.push('On a donc \\(f(-x) \\neq f(x)\\) <em>et</em> \\(f(-x) \\neq -f(x)\\) : ' +
        'la fonction n\'est <b>ni paire ni impaire</b>.');
    } else {
      if (par.calcul) {
        etapes.push('On calcule \\(f(-x)\\) : <b>f(−x) = ' +
          POOL.chaine(par.calcul) + '</b>');
      }
      etapes.push(par.type === 'paire'
        ? 'On retrouve \\(f(x)\\) : la fonction est <b>paire</b>, sa courbe est ' +
          'symétrique par rapport à l\'<b>axe des ordonnées</b>.'
        : 'On obtient l\'opposé \\(-f(x)\\) : la fonction est <b>impaire</b>, sa ' +
          'courbe est symétrique par rapport à l\'<b>origine</b> du repère.');
    }

    return {
      enonce: 'Soit \\(' + ExosFonctions.defTex(f, p) + '\\), définie sur ' +
              '\\(' + (f.ensemble === 'ℝ' ? '\\mathbb{R}' : '\\mathcal{D}_f') + '\\). ' +
              'Cette fonction est-elle paire, impaire, ou ni l\'une ni l\'autre ?',
      type: 'qcm',
      choix: choix,
      correct: cles.indexOf(par.type),
      etapes: etapes,
      indices: [
        'Calcule \\(f(-x)\\) en remplaçant \\(x\\) par \\(-x\\), puis compare à ' +
        '\\(f(x)\\) et à \\(-f(x)\\).',
        'Un seul nombre qui ne marche pas suffit à écarter les deux cas.'
      ],
      duree: 60
    };
  }
});
