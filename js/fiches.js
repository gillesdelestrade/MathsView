/*
 * MathsView — la fiche bristol à recopier.
 *
 * Une leçon qui déclare un champ `fiche` affiche, sous ses notes, le MODÈLE
 * d'une fiche bristol (200 × 125 mm) que l'élève recopie à la main pour ancrer
 * la leçon. Le modèle est dessiné à sa taille réelle, en millimètres, pour
 * qu'on puisse le poser à côté de la vraie fiche — et l'imprimer tel quel.
 *
 * L'intercalaire (l'onglet en haut) prend la couleur du domaine de la leçon,
 * et sa POSITION LATÉRALE dépend du domaine : un cran par grand domaine, dans
 * l'ordre de `MathsView.categories` (Nombres et calculs tout à gauche, Données
 * et hasard tout à droite). Une fois rangées, les fiches d'un même domaine
 * s'alignent, comme les onglets d'un répertoire. Les autres emplacements sont
 * dessinés en pointillé, pour que l'élève voie où découper le sien.
 *
 * Ce que déclare une leçon :
 *
 *   fiche: {
 *     titre:   'Titre de la fiche',              // facultatif : le titre de la leçon sinon
 *     figures: [{                                // facultatif : une ou deux petites figures
 *       legende:     'Une phrase sous la figure',
 *       boundingbox: [xmin, ymax, xmax, ymin],    // repère de la figure
 *       largeur: 58, hauteur: 44,                 // en mm, facultatif
 *       dessine: function (board) { … }           // construit la figure, FIXE (rien à déplacer)
 *     }],
 *     points:   [ 'Phrase courte.', … ],          // l'essentiel, une idée par phrase
 *     exemples: [ '\\( \\frac{6}{8} = \\frac{3}{4} \\)', … ]
 *   }
 *
 * Les textes acceptent le HTML et les formules \( … \) comme `description`.
 * La figure est un vrai tableau JSXGraph, mais figé : pas de navigation, pas
 * de zoom, rien ne se déplace — c'est un dessin à reproduire, pas une
 * illustration à manipuler (celle-là est au-dessus, dans la leçon).
 */
(function (global) {
  'use strict';

  // Format de la fiche, en millimètres. Le CSS lit les mêmes valeurs dans
  // les variables --fiche-l / --fiche-h de css/style.css.
  var FIGURE_L = 58, FIGURE_H = 44;   // taille par défaut d'une figure, en mm

  var boards = [];                    // tableaux de la fiche affichée, à libérer

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function libere() {
    boards.forEach(function (b) { try { JXG.JSXGraph.freeBoard(b); } catch (e) { /* ignore */ } });
    boards = [];
  }

  /* L'onglet du domaine et les emplacements fantômes des autres. */
  function onglets(catKey, cats) {
    var keys = Object.keys(cats);
    var n = keys.length || 1;
    var row = el('div', 'fiche-onglets');
    keys.forEach(function (k, i) {
      var o = el('span', 'fiche-onglet' + (k === catKey ? ' actif' : ''), cats[k].label);
      o.style.left = (i * 100 / n) + '%';
      o.style.width = (100 / n) + '%';
      o.title = k === catKey ? 'L\'intercalaire de cette fiche' :
                'Emplacement de l\'intercalaire « ' + cats[k].label + ' »';
      row.appendChild(o);
    });
    // Domaine inconnu : pas d'onglet plein, seulement les emplacements.
    return row;
  }

  function figure(spec, idx, lessonId) {
    var fig = el('figure', 'fiche-figure');
    var box = el('div', 'fiche-board');
    box.id = 'fiche-fig-' + lessonId + '-' + idx;
    box.style.width = (spec.largeur || FIGURE_L) + 'mm';
    box.style.height = (spec.hauteur || FIGURE_H) + 'mm';
    fig.appendChild(box);
    if (spec.legende) fig.appendChild(el('figcaption', null, spec.legende));
    return fig;
  }

  // Construit le tableau JSXGraph d'une figure, une fois le bloc dans la page
  // (JSXGraph lit la taille réelle de l'élément).
  function dessine(spec, id) {
    var opts = {
      boundingbox: spec.boundingbox || [-5, 5, 5, -5],
      keepaspectratio: spec.keepaspectratio !== false,
      axis: !!spec.axis,
      showCopyright: false,
      showNavigation: false,
      showInfobox: false,
      registerEvents: false,
      pan: { enabled: false },
      zoom: { enabled: false, wheel: false },
      drag: { enabled: false }
    };
    var board = JXG.JSXGraph.initBoard(id, opts);
    boards.push(board);
    try {
      if (typeof spec.dessine === 'function') spec.dessine(board);
    } catch (e) {
      console.error('Erreur dans une figure de fiche (' + id + ') :', e);
    }
    board.update();
    return board;
  }

  function imprime() {
    var body = document.body;
    body.classList.add('fiche-impression');
    var fin = function () { body.classList.remove('fiche-impression'); };
    global.addEventListener('afterprint', fin, { once: true });
    global.print();
    // Safari rend la main avant la fermeture du dialogue : on nettoie aussi
    // à retardement, au cas où « afterprint » ne serait pas envoyé.
    setTimeout(fin, 2000);
  }

  /* Monte la fiche de `lesson` dans #lesson-fiche. Sans champ `fiche`, le
     conteneur est simplement vidé. `ctx` est le contexte passé à setup() par
     app.js : on s'en sert pour libérer les tableaux en quittant la leçon. */
  function monte(lesson, ctx) {
    var box = document.getElementById('lesson-fiche');
    if (!box) return;
    libere();
    box.innerHTML = '';
    var f = lesson && lesson.fiche;
    if (!f) return;

    var mv = global.MathsView || {};
    var cats = mv.categories || {};
    var niveaux = mv.niveaux || {};
    var catKey = cats[lesson.category] ? lesson.category : 'autres';
    var niveau = niveaux[lesson.level];

    /* En-tête de la rubrique, hors de la fiche. */
    var entete = el('div', 'fiche-entete');
    entete.appendChild(el('h3', null, '📇 La fiche à recopier'));
    entete.appendChild(el('p', null,
      'Recopie cette fiche à la main sur une fiche bristol, telle quelle : le titre, ' +
      'la figure, les phrases, les exemples. Découpe l\'intercalaire à l\'emplacement ' +
      'indiqué pour la ranger avec les autres fiches du même domaine.'));
    var btn = el('button', 'fiche-imprimer', '🖨 Imprimer le modèle');
    btn.type = 'button';
    btn.onclick = imprime;
    entete.appendChild(btn);
    box.appendChild(entete);

    /* La fiche elle-même. */
    var zone = el('div', 'fiche-zone');
    var fiche = el('div', 'fiche ' + catKey);
    fiche.appendChild(onglets(catKey, cats));

    var carte = el('div', 'fiche-carte');

    var titre = el('div', 'fiche-titre');
    titre.appendChild(el('h4', null, f.titre || lesson.title));
    if (lesson.subcategory) titre.appendChild(el('span', 'fiche-sous', lesson.subcategory));
    if (niveau) titre.appendChild(el('span', 'badge ' + niveau.badge, niveau.label));
    carte.appendChild(titre);

    var corps = el('div', 'fiche-corps');
    var figs = f.figures || [];
    var figEls = [];
    if (figs.length) {
      var colFig = el('div', 'fiche-figures');
      figs.forEach(function (spec, i) {
        var fe = figure(spec, i, lesson.id);
        figEls.push(fe.firstChild);
        colFig.appendChild(fe);
      });
      corps.appendChild(colFig);
    }
    var ul = el('ul', 'fiche-points');
    (f.points || []).forEach(function (p) { ul.appendChild(el('li', null, p)); });
    corps.appendChild(ul);
    carte.appendChild(corps);

    if (f.exemples && f.exemples.length) {
      var ex = el('div', 'fiche-exemples');
      ex.appendChild(el('div', 'fiche-exemples-titre', 'Exemples'));
      var ol = el('ol');
      f.exemples.forEach(function (x) { ol.appendChild(el('li', null, x)); });
      ex.appendChild(ol);
      carte.appendChild(ex);
    }

    fiche.appendChild(carte);
    zone.appendChild(fiche);
    box.appendChild(zone);

    /* Les figures, maintenant que leurs boîtes sont dans la page. */
    figs.forEach(function (spec, i) { dessine(spec, figEls[i].id); });

    if (ctx && typeof ctx.onCleanup === 'function') ctx.onCleanup(libere);
  }

  // Mode « fiche seule » : index.html?fiche=seule#id n'affiche que la fiche,
  // avec un repère à 125 mm. C'est la vue qu'on capture pour vérifier qu'une
  // fiche tient sur la carte ; la même mise en page sert à l'impression.
  if (/[?&]fiche=seule\b/.test(global.location.search || '')) {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('fiche-seule');
    });
  }

  global.MathsFiches = { monte: monte, libere: libere };

})(window);
