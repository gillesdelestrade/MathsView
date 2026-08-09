/*
 * fn-domaine — ensemble de définition (SPEC §3.2).
 *
 * Deux formes selon le palier, comme prévu :
 *   paliers 1–2 : question fermée « f(−2) existe-t-il ? », verdict par
 *                 POOL.defini — c'est la question qui construit l'intuition ;
 *   paliers 3–4 : question ouverte « donne l'ensemble de définition »,
 *                 attendu via POOL.morceaux, comparé par structure.
 *
 * Aux paliers 1–2 on tire de préférence une fonction qui a vraiment un domaine
 * restreint (√x, 1/x) : demander si \(2x-1\) existe en −2 n'apprend rien.
 */
MathsExos.register({
  id: 'fn-domaine',
  competence: 'fn-domaine',
  level: '2nde',
  titre: 'Ensemble de définition',
  paliers: 4,

  genere: function (rnd, palier) {
    var POOL = ExosFonctions.pool();
    var restreintes = POOL.liste().filter(function (f) { return !!f.defini; });
    var toutes = ExosFonctions.fonctions(palier);

    var f = (rnd.booleen(0.7) && restreintes.length)
      ? rnd.choix(restreintes) : rnd.choix(toutes);
    var p = ExosFonctions.params(rnd, f, palier);
    var def = ExosFonctions.defTex(f, p);

    /* --- paliers 1–2 : « ce nombre a-t-il une image ? » ------------------ */
    if (palier <= 2) {
      // Une valeur intéressante : à moitié dans le domaine, à moitié dehors.
      var candidats = [];
      for (var v = -5; v <= 5; v++) candidats.push(v);
      var dedans = candidats.filter(function (c) { return POOL.defini(f, c, p); });
      var dehors = candidats.filter(function (c) { return !POOL.defini(f, c, p); });
      var x = (dehors.length && rnd.booleen(0.5)) ? rnd.choix(dehors) : rnd.choix(dedans);
      var existe = POOL.defini(f, x, p);

      return {
        enonce: 'Soit \\(' + def + '\\). Le nombre \\(f(' + POOL.texNum(x) +
                ')\\) existe-t-il ?',
        type: 'vraifaux',
        correct: existe ? 0 : 1,
        etapes: [
          existe
            ? '\\(' + POOL.texNum(x) + '\\) est bien dans l\'ensemble de définition : ' +
              '<b>f(' + POOL.nb(x) + ') = ' + POOL.ecrire(f, x, p) + '</b>.'
            : 'On ne peut pas calculer \\(f(' + POOL.texNum(x) + ')\\) : ' +
              (f.key === 'racine'
                ? 'la racine carrée d\'un nombre <b>négatif</b> n\'existe pas.'
                : 'cela reviendrait à <b>diviser par 0</b>.'),
          'L\'ensemble de définition de \\(f\\) est <b>' +
            POOL.ensembleTxt(POOL.morceaux(f)) + '</b>.'
        ],
        indices: ['Essaie de faire le calcul : y a-t-il une opération interdite ?'],
        duree: 30
      };
    }

    /* --- paliers 3–4 : l'ensemble de définition en entier ---------------- */
    var ms = POOL.morceaux(f);
    return {
      enonce: 'Soit \\(' + def + '\\). Donne son <strong>ensemble de définition</strong> ' +
              '\\(\\mathcal{D}_f\\).',
      type: 'intervalle',
      reponse: POOL.ensembleTxt(ms),
      morceaux: ms,
      etapes: [
        f.defini
          ? (f.key === 'racine'
              ? 'Une racine carrée n\'existe que pour un nombre <b>positif ou nul</b> : ' +
                'il faut \\(x \\geqslant 0\\).'
              : 'Une division par 0 est interdite : il faut \\(x \\neq 0\\).')
          : 'Aucune opération interdite ici : la fonction se calcule pour ' +
            '<b>tout réel</b>.',
        '\\(\\mathcal{D}_f = \\) <b>' + POOL.ensembleTxt(ms) + '</b>'
      ],
      indices: [
        'Cherche les opérations interdites : division par 0, racine d\'un négatif.',
        'Écris le résultat avec des intervalles : ' +
        'les crochets vers l\'extérieur du côté de l\'infini.'
      ],
      duree: 60
    };
  }
});
