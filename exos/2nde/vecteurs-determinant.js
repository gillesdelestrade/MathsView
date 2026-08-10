/*
 * vec-det — déterminant de deux vecteurs (leçon 2nde du même nom).
 *
 * Le déterminant est vite réduit à une recette (« en croix, puis on soustrait »)
 * appliquée sans savoir ce qu'on calcule. La leçon en donne pourtant une
 * lecture géométrique complète, et ce générateur la suit pas à pas.
 *
 *   • Le NOMBRE : \(xy' - yx'\). Palier 1, la recette.
 *   • Ce que son ANNULATION signifie : colinéarité. Palier 2.
 *   • Ce que sa VALEUR ABSOLUE mesure : l'aire du parallélogramme construit
 *     sur les deux vecteurs. Palier 2 également — c'est ce qui rend le test
 *     de colinéarité évident au lieu d'arbitraire (aire nulle ⟺ figure aplatie).
 *   • Ce que son SIGNE indique, et le fait qu'échanger les deux vecteurs le
 *     change. Palier 3.
 *   • L'usage : alignement de trois points, puis une équation à résoudre pour
 *     rendre le déterminant nul. Paliers 3 et 4.
 *
 * Le recouvrement avec « vec-colin » est voulu : là-bas le déterminant est un
 * outil qu'on applique, ici c'est l'objet qu'on étudie.
 */
(function () {
  'use strict';
  var O = ExosOutils, V = VecOutils;

  // Le calcul, écrit une fois pour toutes : les six questions le réutilisent.
  function calcul(u, v) {
    return '\\(' + O.tex(u.x) + ' \\times ' + V.parTex(v.y) + ' - ' + O.tex(u.y) +
           ' \\times ' + V.parTex(v.x) + ' = ' + O.tex(u.x * v.y) + ' - ' +
           V.parTex(u.y * v.x) + ' = ' + O.tex(V.det(u, v)) + '\\)';
  }

  /* --- Le calcul brut ---------------------------------------------------- */
  function qDeterminant(rnd) {
    var u = V.vecteur(rnd, 6), v = V.vecteur(rnd, 6);
    return {
      enonce: 'Calcule \\(\\det(\\vec{u}, \\vec{v})\\) pour \\(' +
              V.vecTex('u', u.x, u.y) + '\\) et \\(' + V.vecTex('v', v.x, v.y) + '\\).',
      type: 'nombre', reponse: V.det(u, v),
      etapes: [
        'Par définition \\(\\det(\\vec{u}, \\vec{v}) = xy\' - yx\'\\) : on multiplie ' +
          '<b>en croix</b>, puis on soustrait.',
        calcul(u, v),
        'Les deux vecteurs forment les <b>colonnes</b> du tableau : ' +
          '\\(\\begin{vmatrix}' + O.tex(u.x) + ' & ' + O.tex(v.x) + '\\\\' + O.tex(u.y) +
          ' & ' + O.tex(v.y) + '\\end{vmatrix}\\).'
      ],
      indices: ['\\(xy\'\\) d\'abord, puis on retire \\(yx\'\\).',
                'Attention à l\'ordre : ce n\'est pas \\(yx\' - xy\'\\).'],
      duree: 55
    };
  }

  /* --- Ce que l'annulation signifie -------------------------------------- */
  function qConclusion(rnd) {
    var u = V.vecteur(rnd, 5);
    var nul = rnd.booleen();
    var v = nul ? (function () { var k = rnd.entierNonNul(-3, 3);
                                 return { x: k * u.x, y: k * u.y }; })()
                : V.deuxVecteursLibres(rnd, 5)[1];
    if (!nul && V.colineaires(u, v)) v = { x: -u.y, y: u.x };
    var d = V.det(u, v);
    var bon = d === 0 ? 'ils sont colinéaires' : 'ils ne sont pas colinéaires';
    var choix = rnd.melange(['ils sont colinéaires', 'ils ne sont pas colinéaires',
                             'ils sont perpendiculaires', 'ils sont égaux']);
    return {
      enonce: 'Soit \\(' + V.vecTex('u', u.x, u.y) + '\\) et \\(' +
              V.vecTex('v', v.x, v.y) + '\\). Calcule leur déterminant, puis conclus.',
      type: 'qcm', choix: choix, correct: choix.indexOf(bon),
      etapes: [
        calcul(u, v),
        'Le théorème : \\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires ' +
          '<b>si et seulement si</b> \\(\\det(\\vec{u}, \\vec{v}) = 0\\).',
        d === 0
          ? 'Ici le déterminant est <b>nul</b> : les deux vecteurs sont colinéaires.'
          : 'Ici le déterminant vaut \\(' + O.tex(d) + ' \\neq 0\\) : ils ne sont ' +
            'pas colinéaires.',
        'Le déterminant ne dit rien de la perpendicularité — c\'est un autre calcul.'
      ],
      indices: ['Calcule d\'abord le nombre, conclus ensuite.',
                'Seule l\'annulation du déterminant a une signification ici.'],
      duree: 65
    };
  }

  /* --- L'aire du parallélogramme ----------------------------------------- */
  function qAire(rnd) {
    var uv = V.deuxVecteursLibres(rnd, 5), u = uv[0], v = uv[1];
    var d = V.det(u, v);
    return {
      enonce: 'Dans un repère orthonormé, on construit le parallélogramme sur les vecteurs ' +
              '\\(' + V.vecTex('u', u.x, u.y) + '\\) et \\(' + V.vecTex('v', v.x, v.y) +
              '\\). Quelle est son <strong>aire</strong> ?',
      type: 'nombre', reponse: Math.abs(d), unite: 'unités²',
      etapes: [
        'L\'aire du parallélogramme construit sur deux vecteurs est la <b>valeur absolue</b> ' +
          'de leur déterminant.',
        calcul(u, v),
        'L\'aire vaut donc \\(|' + O.tex(d) + '| = ' + Math.abs(d) + '\\) unités². ' +
          (d < 0 ? 'Le signe négatif indique seulement le sens de rotation de ' +
                   '\\(\\vec{u}\\) vers \\(\\vec{v}\\) : une aire, elle, est toujours positive.'
                 : 'Le déterminant était déjà positif : on tourne de \\(\\vec{u}\\) vers ' +
                   '\\(\\vec{v}\\) dans le sens direct.')
      ],
      indices: ['Aire et déterminant, c\'est presque la même chose.',
                'Une aire ne peut pas être négative : pense à la valeur absolue.'],
      duree: 70
    };
  }

  /* --- Échanger les deux vecteurs change le signe ------------------------ */
  function qEchange(rnd) {
    var uv = V.deuxVecteursLibres(rnd, 6), u = uv[0], v = uv[1];
    var d = V.det(u, v);
    return {
      enonce: 'On sait que \\(\\det(\\vec{u}, \\vec{v}) = ' + O.tex(d) +
              '\\). Que vaut \\(\\det(\\vec{v}, \\vec{u})\\) ?',
      type: 'nombre', reponse: -d,
      etapes: [
        'Échanger les deux vecteurs échange les deux produits en croix : ' +
          '\\(\\det(\\vec{v}, \\vec{u}) = x\'y - y\'x = -(xy\' - yx\')\\).',
        'Donc \\(\\det(\\vec{v}, \\vec{u}) = -\\det(\\vec{u}, \\vec{v}) = ' +
          O.tex(-d) + '\\).',
        'L\'<b>aire</b> du parallélogramme, elle, ne change pas : c\'est la même figure. ' +
          'Seul le sens de rotation s\'inverse.'
      ],
      indices: ['Le déterminant n\'est pas symétrique : l\'ordre des vecteurs compte.',
                'Il change de signe, pas de valeur absolue.'],
      duree: 50
    };
  }

  /* --- Alignement de trois points ---------------------------------------- */
  function qAlignement(rnd) {
    var n = V.noms(rnd, 3);
    var A = V.point(rnd, 5), u = V.vecteur(rnd, 3);
    var B = { x: A.x + u.x, y: A.y + u.y };
    var k = rnd.entierNonNul(-3, 3);
    var C = rnd.booleen(0.4)
      ? { x: A.x + k * u.x, y: A.y + k * u.y }
      : { x: A.x + k * u.x + rnd.entierNonNul(-2, 2), y: A.y + k * u.y };
    var AB = V.delta(A, B), AC = V.delta(A, C);
    return {
      enonce: 'On donne \\(' + V.ptTex(n[0], A.x, A.y) + '\\), \\(' + V.ptTex(n[1], B.x, B.y) +
              '\\) et \\(' + V.ptTex(n[2], C.x, C.y) + '\\). Calcule \\(\\det(' +
              V.vec(n[0] + n[1]) + ', ' + V.vec(n[0] + n[2]) + ')\\).',
      type: 'nombre', reponse: V.det(AB, AC),
      etapes: [
        'D\'abord les deux vecteurs : \\(' + V.vecTex(n[0] + n[1], AB.x, AB.y) + '\\) et \\(' +
          V.vecTex(n[0] + n[2], AC.x, AC.y) + '\\).',
        calcul(AB, AC),
        V.det(AB, AC) === 0
          ? 'Le déterminant est <b>nul</b> : les trois points ' + n[0] + ', ' + n[1] +
            ' et ' + n[2] + ' sont <b>alignés</b>.'
          : 'Le déterminant n\'est pas nul : les trois points ne sont <b>pas</b> alignés, ' +
            'ils forment un vrai triangle.'
      ],
      indices: ['Les deux vecteurs doivent partir du <b>même</b> point.',
                'Calcule leurs coordonnées avant de faire le produit en croix.'],
      duree: 95
    };
  }

  /* --- Résoudre pour annuler le déterminant ------------------------------ */
  function qAnnuler(rnd) {
    var u = V.vecteur(rnd, 5);
    if (u.x === 0) u.x = rnd.entierNonNul(-5, 5);   // sinon m n'est pas déterminé
    var k = rnd.entierNonNul(-3, 3);
    var xp = k * u.x, m = k * u.y;
    return {
      enonce: 'Soit \\(' + V.vecTex('u', u.x, u.y) + '\\) et \\(\\vec{v}\\,(' + O.tex(xp) +
              '\\,;\\,m)\\). Pour quelle valeur de \\(m\\) a-t-on ' +
              '\\(\\det(\\vec{u}, \\vec{v}) = 0\\) ?',
      type: 'nombre', reponse: m,
      etapes: [
        '\\(\\det(\\vec{u}, \\vec{v}) = ' + O.tex(u.x) + 'm - ' + V.parTex(u.y) +
          ' \\times ' + V.parTex(xp) + ' = ' + O.tex(u.x) + 'm - ' + O.tex(u.y * xp) + '\\)',
        'On veut que ce nombre soit nul : \\(' + O.tex(u.x) + 'm = ' + O.tex(u.y * xp) + '\\).',
        '\\(m = ' + O.tex(u.y * xp) + ' \\div ' + V.parTex(u.x) + ' = ' + O.tex(m) + '\\)',
        'Pour cette valeur, \\(\\vec{v}\\,' + V.coordTex(xp, m) + '\\) est colinéaire à ' +
          '\\(\\vec{u}\\) — c\'est \\(' + O.tex(k) + '\\,\\vec{u}\\), et le parallélogramme ' +
          'est complètement aplati.'
      ],
      indices: ['Écris le déterminant en laissant \\(m\\), puis résous l\'équation.',
                'Annuler le déterminant, c\'est rendre les deux vecteurs colinéaires.'],
      duree: 110
    };
  }

  var QUESTIONS = [
    { des: 1, poids: 4, f: qDeterminant },
    { des: 2, poids: 3, f: qConclusion },
    { des: 2, poids: 3, f: qAire },
    { des: 3, poids: 3, f: qEchange },
    { des: 3, poids: 3, f: qAlignement },
    { des: 4, poids: 4, f: qAnnuler }
  ];

  MathsExos.register({
    id: 'vec-det', competence: 'vec-det', level: '2nde',
    titre: 'Déterminant de deux vecteurs', paliers: 4,

    genere: function (rnd, palier) { return V.tire(rnd, palier, QUESTIONS); }
  });
})();
