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
    chapitre: 'nombres', prerequis: ['intervalles'] },

  /* --- Vecteurs (2nde), une compétence par leçon du chapitre ------------- */
  { code: 'vec-egalite',  libelle: 'Direction, sens, longueur', niveau: '2nde',
    chapitre: 'vecteurs', prerequis: [] },
  { code: 'vec-coord',    libelle: 'Coordonnées d\'un vecteur', niveau: '2nde',
    chapitre: 'vecteurs', prerequis: ['vec-egalite'] },
  { code: 'vec-somme',    libelle: 'Somme de deux vecteurs',    niveau: '2nde',
    chapitre: 'vecteurs', prerequis: ['vec-coord'] },
  { code: 'vec-colin',    libelle: 'Produit par un réel et colinéarité', niveau: '2nde',
    chapitre: 'vecteurs', prerequis: ['vec-coord'] },
  { code: 'vec-det',      libelle: 'Déterminant de deux vecteurs', niveau: '2nde',
    chapitre: 'vecteurs', prerequis: ['vec-colin'] },
  { code: 'vec-translation', libelle: 'La translation',         niveau: '2nde',
    chapitre: 'vecteurs', prerequis: ['vec-coord'] },

  /* --- 6ème -------------------------------------------------------------- */
  { code: 'tables',       libelle: 'Tables de multiplication', niveau: '6eme',
    chapitre: 'calcul-mental', prerequis: [] },
  { code: 'additions-20', libelle: 'Additions jusqu\'à 20',    niveau: '6eme',
    chapitre: 'calcul-mental', prerequis: [] },
  { code: 'divisibilite', libelle: 'Critères de divisibilité', niveau: '6eme',
    chapitre: 'nombres-6e', prerequis: [] },
  { code: 'fractions',    libelle: 'Fractions',                niveau: '6eme',
    chapitre: 'nombres-6e', prerequis: ['divisibilite', 'tables'] },
  { code: 'mult-div-10',  libelle: 'Multiplier et diviser par 10', niveau: '6eme',
    chapitre: 'nombres-6e', prerequis: [] },
  { code: 'perimetres',   libelle: 'Périmètres',               niveau: '6eme',
    chapitre: 'grandeurs', prerequis: [] },
  { code: 'aires',        libelle: 'Périmètres et aires',      niveau: '6eme',
    chapitre: 'grandeurs', prerequis: [] },
  { code: 'conversions',  libelle: 'Conversions d\'unités',    niveau: '6eme',
    chapitre: 'grandeurs', prerequis: ['mult-div-10'] },
  { code: 'quadrilateres', libelle: 'Propriétés des quadrilatères', niveau: '6eme',
    chapitre: 'geometrie-6e', prerequis: [] },
  { code: 'sym-axiale',   libelle: 'Symétrie axiale',          niveau: '6eme',
    chapitre: 'geometrie-6e', prerequis: [] },
  { code: 'compas',       libelle: 'Constructions au compas',   niveau: '6eme',
    chapitre: 'geometrie-6e', prerequis: [] },
  { code: 'angles-6e',    libelle: 'Reconnaître et mesurer un angle', niveau: '6eme',
    chapitre: 'geometrie-6e', prerequis: [] },
  { code: 'perp-para',    libelle: 'Droites perpendiculaires et parallèles', niveau: '6eme',
    chapitre: 'geometrie-6e', prerequis: [] },

  /* --- 5ème -------------------------------------------------------------- */
  { code: 'relatifs',       libelle: 'Nombres relatifs',       niveau: '5eme',
    chapitre: 'calcul-5e', prerequis: [] },
  { code: 'comparer',       libelle: 'Comparer et ranger des relatifs', niveau: '5eme',
    chapitre: 'calcul-5e', prerequis: ['relatifs'] },
  { code: 'somme-relatifs', libelle: 'Additionner et soustraire des relatifs', niveau: '5eme',
    chapitre: 'calcul-5e', prerequis: ['relatifs'] },
  { code: 'parentheses',    libelle: 'Les parenthèses indispensables', niveau: '5eme',
    chapitre: 'calcul-5e', prerequis: ['relatifs'] },
  { code: 'comparer-fractions', libelle: 'Comparer des fractions', niveau: '5eme',
    chapitre: 'calcul-5e', prerequis: ['fractions'] },
  { code: 'fraction-pourcentage', libelle: 'Fraction et pourcentage d\'une quantité',
    niveau: '5eme', chapitre: 'calcul-5e', prerequis: ['fractions'] },
  { code: 'puissances',     libelle: 'Découvrir les puissances', niveau: '5eme',
    chapitre: 'calcul-5e', prerequis: ['tables'] },
  { code: 'priorites',      libelle: 'Priorités opératoires',  niveau: '5eme',
    chapitre: 'calcul-5e', prerequis: [] },
  { code: 'distributivite', libelle: 'Distributivité',         niveau: '5eme',
    chapitre: 'calcul-5e', prerequis: ['priorites'] },
  { code: 'volumes',        libelle: 'Volumes des solides usuels', niveau: '5eme',
    chapitre: 'espace-5e', prerequis: ['aires'] },
  { code: 'angles-par',     libelle: 'Angles et droites parallèles', niveau: '5eme',
    chapitre: 'geometrie-5e', prerequis: [] },
  { code: 'hauteurs',       libelle: 'Les hauteurs d\'un triangle', niveau: '5eme',
    chapitre: 'geometrie-5e', prerequis: [] },
  { code: 'medianes',       libelle: 'Les médianes d\'un triangle', niveau: '5eme',
    chapitre: 'geometrie-5e', prerequis: [] },
  { code: 'sym-centrale',   libelle: 'Symétrie centrale',        niveau: '5eme',
    chapitre: 'geometrie-5e', prerequis: [] },

  /* --- 4ème -------------------------------------------------------------- */
  { code: 'eq1',       libelle: 'Équations du 1er degré', niveau: '4eme',
    chapitre: 'litteral', prerequis: ['relatifs'] },
  { code: 'pythagore', libelle: 'Théorème de Pythagore',  niveau: '4eme',
    chapitre: 'geometrie', prerequis: [] },

  /* --- 3ème -------------------------------------------------------------- */
  { code: 'identites', libelle: 'Identités remarquables', niveau: '3eme',
    chapitre: 'litteral', prerequis: ['distributivite'] },
  { code: 'thales',    libelle: 'Théorème de Thalès',     niveau: '3eme',
    chapitre: 'geometrie', prerequis: ['fractions'] },
  { code: 'trigo',     libelle: 'Trigonométrie',          niveau: '3eme',
    chapitre: 'geometrie', prerequis: ['pythagore'] }
];
