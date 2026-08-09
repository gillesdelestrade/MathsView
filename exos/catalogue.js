/*
 * Le catalogue des compétences (SPEC §5.1).
 *
 * Une compétence est l'unité de progression : c'est elle qui portera plus tard
 * la maîtrise, la ceinture et la plante du jardin. Un même code peut être
 * alimenté par plusieurs générateurs — c'est même souhaitable, cela varie les
 * angles d'attaque d'une même notion.
 *
 * `chapitre` sert au regroupement visuel et, plus tard, au déclenchement du
 * boss de fin de chapitre.
 */
MathsExos.catalogue = [
  /* --- Fonctions (2nde), branchées sur js/fonctions-base.js --------------- */
  { code: 'fn-images',    libelle: 'Calculer une image',        niveau: '2nde',
    chapitre: 'fonctions', prerequis: [] },
  { code: 'fn-domaine',   libelle: 'Ensemble de définition',    niveau: '2nde',
    chapitre: 'fonctions', prerequis: ['fn-images'] },
  { code: 'fn-resolution', libelle: 'Équations et inéquations', niveau: '2nde',
    chapitre: 'fonctions', prerequis: ['fn-images', 'intervalles'] },
  { code: 'fn-parite',    libelle: 'Parité d\'une fonction',    niveau: '2nde',
    chapitre: 'fonctions', prerequis: ['fn-images'] },

  /* --- Nombres et ensembles (2nde) --------------------------------------- */
  { code: 'ensembles',    libelle: 'Ensembles de nombres',      niveau: '2nde',
    chapitre: 'nombres', prerequis: [] },
  { code: 'intervalles',  libelle: 'Intervalles',               niveau: '2nde',
    chapitre: 'nombres', prerequis: [] },
  { code: 'encadrement',  libelle: 'Encadrement décimal',       niveau: '2nde',
    chapitre: 'nombres', prerequis: ['ensembles'] },
  { code: 'val-abs',      libelle: 'Valeur absolue et distance', niveau: '2nde',
    chapitre: 'nombres', prerequis: ['intervalles'] }
];
