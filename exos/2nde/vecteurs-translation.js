/*
 * vec-translation — la translation (leçon 2nde « La translation »).
 *
 * Une seule définition à tenir : \(M'\) est l'image de \(M\) par la translation
 * de vecteur \(\vec{u}\) lorsque \(\vec{MM'} = \vec{u}\). Tout le reste en
 * découle, y compris la formule en coordonnées \(M'(x+a\,;\,y+b)\).
 *
 * Le générateur travaille les trois inconnues possibles de cette égalité :
 * l'image, l'antécédent, et le vecteur lui-même. La deuxième est la plus
 * instructive — beaucoup d'élèves ajoutent le vecteur au lieu de le retirer,
 * parce qu'ils ont mémorisé « on ajoute » sans mémoriser à quoi.
 *
 * Deux questions viennent de mises en garde explicites de la leçon :
 *
 *   • l'ORDRE DES LETTRES du parallélogramme. Puisque \(\vec{AA'} = \vec{BB'}\),
 *     c'est \(ABB'A'\) qui est un parallélogramme, et surtout pas \(ABA'B'\).
 *     La leçon le signale ; l'exercice le vérifie.
 *
 *   • ce que la translation CONSERVE. En cases à cocher, parce que la réponse
 *     est une liste et qu'un QCM à réponse unique laisserait croire qu'il n'y
 *     a qu'une propriété en jeu.
 */
(function () {
  'use strict';
  var O = ExosOutils, V = VecOutils;

  /* --- L'image d'un point ------------------------------------------------ */
  function qImage(rnd) {
    var n = V.noms(rnd, 1), M = V.point(rnd, 6), u = V.vecteur(rnd, 6);
    var I = { x: M.x + u.x, y: M.y + u.y };
    return {
      enonce: 'Quelle est l\'image du point \\(' + V.ptTex(n[0], M.x, M.y) +
              '\\) par la translation de vecteur \\(' + V.vecTex('u', u.x, u.y) + '\\) ? ' +
              V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(I.x, I.y),
      etapes: [
        'Par définition, l\'image \\(' + n[0] + '\'\\) vérifie \\(\\vec{' + n[0] + n[0] +
          '\'} = \\vec{u}\\) : on <b>ajoute</b> les coordonnées du vecteur à celles du point.',
        '\\(x = ' + O.tex(M.x) + ' + ' + V.parTex(u.x) + ' = ' + O.tex(I.x) + '\\)',
        '\\(y = ' + O.tex(M.y) + ' + ' + V.parTex(u.y) + ' = ' + O.tex(I.y) + '\\)',
        'Donc \\(' + n[0] + '\'\\,' + V.coordTex(I.x, I.y) + '\\).'
      ],
      indices: ['Translater, c\'est glisser : on applique le déplacement au point.',
                'On ajoute les coordonnées du vecteur à celles du point.'],
      duree: 55
    };
  }

  /* --- L'antécédent : le piège du chapitre ------------------------------- */
  function qAntecedent(rnd) {
    var n = V.noms(rnd, 1), u = V.vecteur(rnd, 6), I = V.point(rnd, 6);
    var M = { x: I.x - u.x, y: I.y - u.y };
    return {
      enonce: 'Le point \\(' + n[0] + '\'\\,' + V.coordTex(I.x, I.y) + '\\) est l\'image du ' +
              'point \\(' + n[0] + '\\) par la translation de vecteur \\(' +
              V.vecTex('u', u.x, u.y) + '\\). Quelles sont les coordonnées de \\(' +
              n[0] + '\\) ? ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(M.x, M.y),
      etapes: [
        'Ici c\'est le point de <b>départ</b> qui est inconnu : on remonte la translation, ' +
          'donc on <b>retire</b> le vecteur au lieu de l\'ajouter.',
        '\\(x = ' + O.tex(I.x) + ' - ' + V.parTex(u.x) + ' = ' + O.tex(M.x) + '\\)',
        '\\(y = ' + O.tex(I.y) + ' - ' + V.parTex(u.y) + ' = ' + O.tex(M.y) + '\\)',
        'Donc \\(' + V.ptTex(n[0], M.x, M.y) + '\\). Vérification : en ajoutant \\(\\vec{u}\\) ' +
          'à ce point, on retrouve bien \\(' + n[0] + '\'\\).'
      ],
      indices: ['Attention au sens : on cherche le point AVANT le glissement.',
                'Revenir en arrière, c\'est appliquer le vecteur opposé.'],
      duree: 80
    };
  }

  /* --- Retrouver le vecteur de la translation ---------------------------- */
  function qVecteur(rnd) {
    var n = V.noms(rnd, 1), p = V.deuxPoints(rnd, 6), M = p[0], I = p[1];
    var u = V.delta(M, I);
    return {
      enonce: 'La translation qui transforme \\(' + V.ptTex(n[0], M.x, M.y) + '\\) en \\(' +
              n[0] + '\'\\,' + V.coordTex(I.x, I.y) + '\\) a pour vecteur \\(\\vec{u}\\). ' +
              'Détermine les coordonnées de \\(\\vec{u}\\). ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(u.x, u.y),
      etapes: [
        'Le vecteur de la translation est exactement \\(\\vec{' + n[0] + n[0] + '\'}\\).',
        'On applique « arrivée moins départ » : \\(x = ' + O.tex(I.x) + ' - ' +
          V.parTex(M.x) + ' = ' + O.tex(u.x) + '\\).',
        '\\(y = ' + O.tex(I.y) + ' - ' + V.parTex(M.y) + ' = ' + O.tex(u.y) + '\\)',
        'Donc \\(' + V.vecTex('u', u.x, u.y) + '\\).'
      ],
      indices: ['Le vecteur va du point de départ vers son image.',
                'C\'est le calcul habituel : arrivée moins départ.'],
      duree: 60
    };
  }

  /* --- Enchaîner deux translations --------------------------------------- */
  function qEnchainer(rnd) {
    var u = V.vecteur(rnd, 5), v = V.vecteur(rnd, 5);
    var w = { x: u.x + v.x, y: u.y + v.y };
    return {
      enonce: 'On applique la translation de vecteur \\(' + V.vecTex('u', u.x, u.y) +
              '\\), puis celle de vecteur \\(' + V.vecTex('v', v.x, v.y) + '\\). ' +
              'Ces deux glissements enchaînés reviennent à une seule translation : ' +
              'quel est son vecteur ? ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(w.x, w.y),
      etapes: [
        'Le premier glissement mène de \\(M\\) à \\(M\'\\), le second de \\(M\'\\) à ' +
          '\\(M\'\'\\). Au total on passe de \\(M\\) à \\(M\'\'\\).',
        '\\(\\vec{MM\'\'} = \\vec{MM\'} + \\vec{M\'M\'\'} = \\vec{u} + \\vec{v}\\) : ' +
          'c\'est la <b>relation de Chasles</b>.',
        '\\(\\vec{u} + \\vec{v}\\,(' + O.tex(u.x) + O.signeTex(v.x) + '\\,;\\,' +
          O.tex(u.y) + O.signeTex(v.y) + ') = ' + V.coordTex(w.x, w.y) + '\\)'
      ],
      indices: ['Deux déplacements à la suite, cela fait un déplacement total.',
                'Additionne les deux vecteurs.'],
      duree: 80
    };
  }

  /* --- L'ordre des lettres du parallélogramme ---------------------------- */
  function qParallelogramme(rnd) {
    var choix = rnd.melange(['\\(ABB\'A\'\\)', '\\(ABA\'B\'\\)',
                             '\\(AA\'BB\'\\)', '\\(A\'ABB\'\\)']);
    return {
      enonce: '\\(A\'\\) et \\(B\'\\) sont les images de \\(A\\) et \\(B\\) par la même ' +
              'translation de vecteur \\(\\vec{u}\\) (avec \\(A\\), \\(B\\), \\(A\'\\) non ' +
              'alignés). Quel quadrilatère est un <strong>parallélogramme</strong> ?',
      type: 'qcm', choix: choix, correct: choix.indexOf('\\(ABB\'A\'\\)'),
      etapes: [
        'Les deux points subissent le <b>même</b> glissement : \\(\\vec{AA\'} = \\vec{BB\'} ' +
          '= \\vec{u}\\).',
        'Un quadrilatère est un parallélogramme quand deux de ses côtés opposés portent ' +
          'des vecteurs égaux. Ici les côtés \\([AA\']\\) et \\([BB\']\\) conviennent.',
        'Pour que \\([AA\']\\) et \\([BB\']\\) soient des <b>côtés</b>, il faut lire les ' +
          'sommets dans l\'ordre \\(A \\to B \\to B\' \\to A\'\\) : le quadrilatère est ' +
          '\\(ABB\'A\'\\).',
        'Dans \\(ABA\'B\'\\), les segments \\([AA\']\\) et \\([BB\']\\) seraient les ' +
          '<b>diagonales</b> et non les côtés : ce n\'est pas la bonne écriture.'
      ],
      indices: ['Le vecteur \\(\\vec{u}\\) doit se retrouver sur deux côtés opposés.',
                'Parcours les sommets dans l\'ordre et regarde si tu fais bien le tour.'],
      duree: 70
    };
  }

  /* --- Ce que la translation conserve ------------------------------------ */
  function qConserve(rnd) {
    var VRAIES = ['les longueurs', 'les angles', 'les aires', 'le parallélisme',
                  'l\'alignement des points', 'le sens de parcours de la figure'];
    var FAUSSES = ['la position des points', 'la distance de chaque point à l\'origine',
                   'les coordonnées des points'];
    // Trois propriétés conservées et deux qui ne le sont pas : la liste est
    // courte, sinon la question devient un exercice de lecture.
    var bonnes = rnd.melange(VRAIES).slice(0, 3);
    var mauvaises = rnd.melange(FAUSSES).slice(0, 2);
    var choix = rnd.melange(bonnes.concat(mauvaises));
    var corrects = bonnes.map(function (b) { return choix.indexOf(b); })
                         .sort(function (a, b) { return a - b; });
    return {
      enonce: 'Une translation de vecteur non nul transforme une figure en son image. ' +
              'Coche <strong>tout ce qu\'elle conserve</strong>.',
      type: 'qcm-multi', choix: choix, corrects: corrects,
      etapes: [
        'Une translation fait <b>glisser</b> la figure sans la tourner, sans l\'agrandir ' +
          'et sans la retourner.',
        'Elle conserve donc les longueurs, les angles, les aires, le parallélisme, ' +
          'l\'alignement, les milieux — et le <b>sens de parcours</b>, contrairement à ' +
          'une symétrie axiale.',
        'En revanche elle ne conserve évidemment <b>pas la position</b> des points : ' +
          'leurs coordonnées changent toutes, puisque c\'est précisément ce que fait ' +
          'un glissement.'
      ],
      indices: ['Demande-toi ce qui change quand on fait glisser un calque sur une feuille.',
                'La forme est intacte ; seul l\'emplacement change.'],
      duree: 75
    };
  }

  /* --- L'image d'une figure ---------------------------------------------- */
  function qImageFigure(rnd) {
    var CAS = [
      { objet: 'une droite \\(d\\)', bon: 'une droite parallèle à \\(d\\)',
        autres: ['une droite perpendiculaire à \\(d\\)', 'la droite \\(d\\) elle-même',
                 'un segment'] },
      { objet: 'un segment \\([AB]\\)', bon: 'un segment de même longueur que \\([AB]\\)',
        autres: ['un segment deux fois plus long', 'une droite', 'un segment plus court'] },
      { objet: 'un cercle de rayon \\(r\\)', bon: 'un cercle de même rayon \\(r\\)',
        autres: ['un cercle de rayon \\(2r\\)', 'un cercle de même centre', 'une ellipse'] }
    ];
    var cas = rnd.choix(CAS);
    var choix = rnd.melange([cas.bon].concat(cas.autres));
    return {
      enonce: 'Par une translation de vecteur non nul, l\'image de ' + cas.objet + ' est…',
      type: 'qcm', choix: choix, correct: choix.indexOf(cas.bon),
      etapes: [
        'La translation fait glisser la figure <b>sans la déformer</b> : ni rotation, ' +
          'ni agrandissement, ni retournement.',
        'La nature de la figure est donc conservée, ainsi que ses dimensions.',
        'Réponse : ' + cas.bon + '.',
        'Le centre du cercle, lui, se déplace : seule la <b>forme</b> est intacte, ' +
          'jamais la position.'
      ],
      indices: ['Rien n\'est déformé, tout est simplement déplacé.',
                'Une droite reste une droite, et elle glisse parallèlement à elle-même.'],
      duree: 55
    };
  }

  var QUESTIONS = [
    { des: 1, poids: 4, f: qImage },
    { des: 1, poids: 3, f: qVecteur },
    { des: 2, poids: 4, f: qAntecedent },
    { des: 2, poids: 3, f: qConserve },
    { des: 3, poids: 3, f: qEnchainer },
    { des: 3, poids: 3, f: qImageFigure },
    { des: 4, poids: 4, f: qParallelogramme }
  ];

  MathsExos.register({
    id: 'vec-translation', competence: 'vec-translation', level: '2nde',
    titre: 'La translation', paliers: 4,

    genere: function (rnd, palier) { return V.tire(rnd, palier, QUESTIONS); }
  });
})();
