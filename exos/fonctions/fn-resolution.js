/*
 * fn-resolution — équations et inéquations (SPEC §3.3). Le cœur du lot.
 *
 * Tout vient du pool, y compris ce qui est le plus coûteux à écrire à la main :
 *   POOL.solutions(f, rel, k, p)  →  l'ensemble solution EXACT, ses morceaux
 *                                    numériques et son écriture au tableau ;
 *   POOL.etapes(f, rel, k, p)     →  la correction déjà rédigée, avec le
 *                                    commentaire des passages délicats
 *                                    (« on divise par −2 : le sens change »).
 *
 * La réponse est comparée par STRUCTURE (les morceaux), jamais par la chaîne :
 * « ]−2;2[ » et « ] −2 ; 2 [ » sont la même réponse, et « [−2;2] » est refusée
 * avec le message qui va bien.
 *
 * Progression des paliers, telle que prescrite :
 *   1 : « = » seulement           3 : ajout de ⩽ et ⩾
 *   2 : « < » et « > »            4 : fonctions à domaine restreint ou à deux
 *                                     branches (√x, 1/x)
 */
MathsExos.register({
  id: 'fn-resolution',
  competence: 'fn-resolution',
  level: '2nde',
  titre: 'Résoudre f(x) ⋈ k',
  paliers: 4,

  genere: function (rnd, palier) {
    var POOL = ExosFonctions.pool();
    var RELS = palier === 1 ? ['=']
             : palier === 2 ? ['<', '>']
             : ['=', '<', '>', '⩽', '⩾'];

    // On ne garde que les fonctions qui savent résoudre (celles qui donnent
    // leurs antécédents) ; au palier 4, on privilégie les plus retorses.
    var dispo = ExosFonctions.fonctions(palier).filter(function (f) { return !!f.antec; });
    var retorses = dispo.filter(function (f) { return !!f.defini; });
    if (palier >= 4 && retorses.length && rnd.booleen(0.6)) dispo = retorses;

    var f, p, rel, k, sol;
    for (var essai = 0; essai < 40; essai++) {
      f = rnd.choix(dispo);
      p = ExosFonctions.params(rnd, f, palier);
      rel = rnd.choix(RELS);
      k = rnd.entier(-4, 5);
      sol = POOL.solutions(f, rel, k, p);
      if (!sol) continue;
      // Au palier 1 on évite l'ensemble vide : c'est déroutant en ouverture.
      if (sol.vide && palier <= 1) continue;
      break;
    }
    if (!sol) {                                   // filet, jamais atteint en pratique
      f = POOL.get('identite'); p = {}; rel = '='; k = 3;
      sol = POOL.solutions(f, rel, k, p);
    }

    var etapes = POOL.etapes(f, rel, k, p) || [];
    etapes = etapes.concat([
      'L\'ensemble des solutions est <b>S = ' + sol.txt + '</b>.'
    ]);

    return {
      enonce: 'Soit \\(' + ExosFonctions.defTex(f, p) + '\\). Résous, puis donne ' +
              'l\'<strong>ensemble des solutions</strong>.',
      tex: f.tex(p) + ' ' + ExosFonctions.relTex(rel) + ' ' + POOL.texNum(k),
      type: 'intervalle',
      reponse: sol.txt,
      morceaux: sol.morceaux,
      etapes: etapes,
      indices: [
        rel === '=' ? 'Cherche les nombres dont l\'image vaut exactement ' +
                      POOL.nb(k) + '.'
                    : 'Commence par résoudre l\'égalité : elle donne les bornes.',
        'Écris la réponse en intervalles, avec des <b>bornes exactes</b> ' +
        '(√5 plutôt que 2,24), et surveille le sens des crochets.'
      ],
      duree: 90
    };
  }
});
