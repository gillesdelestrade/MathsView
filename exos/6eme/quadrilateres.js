/*
 * quadrilateres — propriétés des quadrilatères (leçon 6ème du même nom).
 *
 * Les cinq quadrilatères et les sept propriétés sont EXACTEMENT ceux de la
 * leçon, dans le même ordre et avec les mêmes libellés : l'élève retrouve la
 * figure qu'elle a manipulée, mot pour mot.
 *
 * Tout le chapitre tient dans une idée : les quadrilatères s'emboîtent. Un
 * carré est à la fois un rectangle et un losange, donc il a TOUTES leurs
 * propriétés. C'est pour ça que la table ci-dessous n'est pas écrite à la main
 * quadrilatère par quadrilatère : chacun HÉRITE de ceux qu'il généralise, et
 * les corrections le disent à chaque fois.
 *
 * Trois formes de questions, qui se répondent l'une l'autre :
 *   • une propriété  → cocher les quadrilatères qui l'ont toujours ;
 *   • deux ou trois propriétés → cocher ceux qui les ont toutes ;
 *   • un quadrilatère → cocher toutes ses propriétés.
 *
 * La troisième n'est pas un luxe : sans elle, le carré serait la bonne réponse
 * de toutes les questions (il a toutes les propriétés), et une élève maligne
 * cocherait le carré à chaque fois sans rien lire.
 */
(function () {
  'use strict';

  /* Les sept propriétés, dans l'ordre des cases à cocher de la leçon. */
  var PROPS = [
    { key: 'par1', label: 'Deux côtés parallèles',
      raison: 'C\'est la définition même du trapèze — et tous les autres en ont ' +
              'au moins deux, puisqu\'ils ont leurs côtés opposés parallèles.' },
    { key: 'par2', label: 'Côtés opposés parallèles deux à deux',
      raison: 'C\'est la définition du parallélogramme. Le trapèze, lui, n\'a ' +
              'qu\'une seule paire de côtés parallèles.' },
    { key: 'milieu', label: 'Diagonales qui se coupent en leur milieu',
      raison: 'C\'est la propriété caractéristique du parallélogramme : ses ' +
              'diagonales se coupent toujours en leur milieu.' },
    { key: 'diagEq', label: 'Diagonales de même longueur',
      raison: 'C\'est ce qui distingue le <b>rectangle</b>. Le losange, lui, a des ' +
              'diagonales perpendiculaires mais de longueurs différentes.' },
    { key: 'diagPerp', label: 'Diagonales perpendiculaires',
      raison: 'C\'est ce qui distingue le <b>losange</b>. Les diagonales d\'un ' +
              'rectangle ne se croisent pas à angle droit (sauf si c\'est un carré).' },
    { key: 'cotes4', label: 'Quatre côtés de même longueur',
      raison: 'C\'est la définition du losange. Un rectangle a ses côtés opposés ' +
              'égaux, mais pas les quatre.' },
    { key: 'angles4', label: 'Quatre angles droits',
      raison: 'C\'est la définition du rectangle. Un losange n\'a des angles droits ' +
              'que s\'il est un carré.' }
  ];

  /* Les quadrilatères, du plus général au plus particulier. `propres` = ce que
     la figure apporte EN PLUS de celles dont elle hérite ; `herite` = ceux
     qu'elle généralise. La table complète s'en déduit — impossible d'oublier
     une case ou de se contredire. */
  var QUADS = [
    { key: 'trapeze', nom: 'Trapèze',          propres: ['par1'],                 herite: [] },
    { key: 'para',    nom: 'Parallélogramme',  propres: ['par2', 'milieu'],       herite: ['trapeze'] },
    { key: 'rect',    nom: 'Rectangle',        propres: ['diagEq', 'angles4'],    herite: ['para'] },
    { key: 'losange', nom: 'Losange',          propres: ['diagPerp', 'cotes4'],   herite: ['para'] },
    { key: 'carre',   nom: 'Carré',            propres: [],                       herite: ['rect', 'losange'] }
  ];

  function quad(key) {
    return QUADS.filter(function (q) { return q.key === key; })[0];
  }
  // Toutes les propriétés d'un quadrilatère, héritage compris.
  function proprietesDe(key) {
    var q = quad(key), out = q.propres.slice();
    q.herite.forEach(function (h) {
      proprietesDe(h).forEach(function (p) { if (out.indexOf(p) < 0) out.push(p); });
    });
    return out;
  }
  function a(key, prop) { return proprietesDe(key).indexOf(prop) >= 0; }
  function prop(key) { return PROPS.filter(function (p) { return p.key === key; })[0]; }

  // « le rectangle et le carré », « le losange, le rectangle et le carré »
  function liste(noms) {
    if (!noms.length) return 'aucun';
    if (noms.length === 1) return noms[0];
    return noms.slice(0, -1).join(', ') + ' et ' + noms[noms.length - 1];
  }
  // La phrase d'héritage, quand elle éclaire quelque chose.
  function heritage(key) {
    var q = quad(key);
    if (!q.herite.length) return '';
    var noms = q.herite.map(function (h) { return quad(h).nom.toLowerCase(); });
    return 'Un ' + q.nom.toLowerCase() + ' est un ' + liste(noms) +
      ' particulier : il en a donc <b>toutes</b> les propriétés.';
  }

  MathsExos.register({
    id: 'quadrilateres',
    competence: 'quadrilateres',
    level: '6eme',
    titre: 'Propriétés des quadrilatères',
    paliers: 4,

    genere: function (rnd, palier) {
      // Le palier 1 mêle les deux formes simples : avec la seule première, il
      // n'existait que six questions, moins qu'une série entière.
      var forme;
      if (palier === 1) forme = rnd.booleen(0.6) ? 0 : 2;
      else if (palier === 2) forme = rnd.booleen(0.5) ? 0 : 2;
      else forme = rnd.entier(0, 2);

      /* --- forme 2 : un quadrilatère → cocher ses propriétés --------------
         Le CARRÉ en est écarté : il possède les sept propriétés, la question
         se gagnerait donc en cochant tout, sans rien lire. Le fait reste dit —
         c'est la conclusion des corrections des autres questions. */
      if (forme === 2) {
        var q = rnd.choix(QUADS.filter(function (Q) { return Q.key !== 'carre'; }));
        var siennes = proprietesDe(q.key);
        var corrects = [];
        PROPS.forEach(function (p, i) { if (siennes.indexOf(p.key) >= 0) corrects.push(i); });

        return {
          enonce: 'Coche <strong>toutes</strong> les propriétés que possède ' +
                  '<strong>' + (q.nom === 'Carré' ? 'un carré' :
                    q.nom === 'Rectangle' ? 'un rectangle' :
                    q.nom === 'Losange' ? 'un losange' :
                    q.nom === 'Trapèze' ? 'un trapèze' : 'un parallélogramme') +
                  '</strong>.',
          type: 'qcm-multi',
          choix: PROPS.map(function (p) { return p.label; }),
          corrects: corrects,
          etapes: [heritage(q.key) || 'Un ' + q.nom.toLowerCase() +
                     ' est le cas le plus général ici : il n\'hérite de personne.']
            .filter(Boolean)
            .concat(PROPS.map(function (p) {
              var oui = siennes.indexOf(p.key) >= 0;
              return (oui ? '✔ ' : '✘ ') + '<b>' + p.label + '</b> — ' +
                (oui ? 'oui.' : 'non.') + ' ' + p.raison;
            })),
          indices: [
            q.herite.length
              ? 'Commence par te demander ce que « ' + q.nom.toLowerCase() +
                ' » est aussi : il hérite de toutes ses propriétés.'
              : 'Repars de la définition : qu\'est-ce qui fait un ' +
                q.nom.toLowerCase() + ' ?',
            'Pense aux diagonales : se coupent-elles en leur milieu ? ' +
            'Sont-elles de même longueur ? perpendiculaires ?'
          ],
          duree: 70
        };
      }

      /* --- formes 0 et 1 : une ou plusieurs propriétés → les quadrilatères -- */
      var nb = forme === 0 ? 1 : (palier >= 4 && rnd.booleen(0.35) ? 3 : 2);
      /* Seule sur sa ligne, « deux côtés parallèles » serait vraie pour les cinq
         figures : encore une question qui se coche en entier sans réfléchir. On
         ne la tire donc qu'en compagnie d'une autre, où elle redevient
         discriminante. */
      var dispo = PROPS.map(function (p) { return p.key; });
      if (nb === 1) dispo = dispo.filter(function (k) { return k !== 'par1'; });
      var choisies = rnd.melange(dispo).slice(0, nb);

      var bons = QUADS.filter(function (Q) {
        return choisies.every(function (k) { return a(Q.key, k); });
      });
      var corrects2 = [];
      QUADS.forEach(function (Q, i) {
        if (bons.indexOf(Q) >= 0) corrects2.push(i);
      });

      var libelles = choisies.map(function (k) { return prop(k).label.toLowerCase(); });
      var enonce = nb === 1
        ? 'Coche <strong>tous</strong> les quadrilatères qui ont toujours cette ' +
          'propriété : <strong>' + prop(choisies[0]).label.toLowerCase() + '</strong>.'
        : 'Coche <strong>tous</strong> les quadrilatères qui ont <strong>à la fois</strong> ' +
          'ces propriétés : <strong>' + liste(libelles) + '</strong>.';

      var etapes = choisies.map(function (k) {
        var oui = QUADS.filter(function (Q) { return a(Q.key, k); })
                       .map(function (Q) { return Q.nom.toLowerCase(); });
        return '<b>' + prop(k).label + '</b> : ' + prop(k).raison +
          ' → ' + liste(oui) + '.';
      });
      if (nb > 1) {
        etapes.push('Il faut les <b>' + nb + ' à la fois</b> : on ne garde que ceux qui ' +
          'figurent dans toutes les listes ci-dessus.');
      }
      etapes.push('Réponse : <b>' + liste(bons.map(function (Q) { return Q.nom.toLowerCase(); })) +
        '</b>' + (bons.length > 1
          ? ' — et n\'oublie pas le carré, qui est à la fois un rectangle et un losange.'
          : '.'));

      return {
        enonce: enonce,
        type: 'qcm-multi',
        choix: QUADS.map(function (Q) { return Q.nom; }),
        corrects: corrects2,
        etapes: etapes,
        indices: [
          'Passe les cinq quadrilatères en revue, un par un.',
          'Souviens-toi de l\'emboîtement : un carré est un rectangle ET un losange, ' +
          'un rectangle est un parallélogramme, un parallélogramme est un trapèze.'
        ],
        duree: nb === 1 ? 60 : 90
      };
    }
  });

})();
