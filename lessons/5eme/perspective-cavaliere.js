/*
 * Perspective cavalière (5ème) — pavé droit, cube, prisme droit, cylindre de
 * révolution, et la règle du trait plein / des pointillés.
 *
 * TOUT EST CALCULÉ, RIEN N'EST DESSINÉ À LA MAIN. Le solide existe en 3D
 * (des sommets (x ; y ; z)), et la figure est sa projection :
 *
 *              x' = x + z × k × cos(a)          a : angle des fuyantes
 *              y' = y + z × k × sin(a)          k : coefficient de réduction
 *
 * C'est la définition même de la perspective cavalière : le plan de face
 * (z = 0) est dessiné en VRAIE GRANDEUR, et la profondeur part en biais, d'un
 * angle a, raccourcie d'un facteur k. Les deux curseurs règlent a et k : on
 * obtient ainsi DIFFÉRENTES REPRÉSENTATIONS DU MÊME SOLIDE, ce qui est
 * exactement l'objectif du programme — et l'on voit du même coup que les
 * arêtes cachées ne sont pas toujours les mêmes.
 *
 * CE QUI EST CACHÉ EST CALCULÉ AUSSI. La direction du regard est le vecteur
 * w = (−k cos a ; −k sin a ; 1) : deux points qui diffèrent d'un multiple de w
 * se projettent au même endroit. Une face est donc tournée vers nous — visible —
 * quand sa normale sortante n vérifie n · w < 0. Et pour un solide convexe :
 *
 *      une arête est CACHÉE lorsque TOUTES les faces qui la bordent le sont.
 *
 * Sur un pavé, cela donne toujours trois arêtes en pointillés, celles qui se
 * rejoignent au sommet du fond — et si l'on envoie les fuyantes vers la gauche,
 * ce n'est plus le même sommet. La leçon le fait constater plutôt que de le
 * réciter.
 *
 * POURQUOI DES POINTILLÉS. L'animation ne se contente pas de les tracer : à
 * l'avant-dernière étape le solide devient OPAQUE, et l'on voit les arêtes du
 * fond disparaître derrière les faces de devant. Elles sont masquées par ce qui
 * est devant — et comme il faut tout de même les dessiner, on les trace en
 * pointillés.
 *
 * Pavé, cube et prisme droit sont décrits d'une seule façon : le contour de la
 * face avant, et une profondeur. Ce sont trois PRISMES ; le cube est le pavé
 * dont les trois dimensions sont égales. Le cylindre, lui, est le cas où la
 * base est un cercle : il se projette en ellipse, et la moitié arrière de sa
 * base du bas passe derrière lui.
 *
 * DEUXIÈME TEMPS : LE VOLUME. Le bouton « Le volume » rejoue la même figure
 * pour y lire le calcul, et c'est la même description qui sert :
 *
 *              V = aire d'une base × hauteur correspondante
 *
 * Pour les quatre solides, sans exception — c'est l'intérêt de les avoir
 * construits de la même façon. La base s'allume en vert, les fuyantes (qui
 * SONT la hauteur, puisque le prisme est droit) passent en rouge, et le calcul
 * s'écrit sous la figure.
 *
 * Un point que la figure rend visible mieux qu'un discours : sur le dessin, la
 * profondeur est RACCOURCIE par la perspective. On calcule évidemment avec la
 * vraie longueur, pas avec celle que l'on mesure sur la feuille — la leçon
 * affiche les deux côte à côte pour que la confusion ne s'installe pas.
 */
MathsView.register({
  id: 'perspective-cavaliere',
  title: 'Perspective cavalière',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Géométrie dans l\'espace',
  exercices: ['volumes'],
  theme: 'Espace — représenter en perspective cavalière un pavé droit, un cube, ' +
         'un prisme droit, un cylindre, et calculer leur volume',
  description:
    'Dessiner un solide sur une feuille, c\'est choisir une <strong>représentation</strong>. ' +
    'La <strong>perspective cavalière</strong> en est une, avec trois règles.' +
    '<br><strong>1.</strong> La <strong>face avant</strong> est dans le plan de la feuille : ' +
    'on la dessine en <strong>vraie grandeur</strong>, ses angles droits restent droits.' +
    '<br><strong>2.</strong> Les <strong>fuyantes</strong> — les arêtes qui partent vers ' +
    'l\'arrière — sont toutes <strong>parallèles</strong>, tracées avec le <strong>même ' +
    'angle</strong> et <strong>raccourcies</strong> du même coefficient.' +
    '<br><strong>3.</strong> Ce que l\'on <strong>voit</strong> se trace en <strong>trait ' +
    'plein</strong> ; ce qui est <strong>caché</strong> par le solide se trace en ' +
    '<strong>pointillés</strong>.' +
    '<br>Le bouton <strong>Le volume</strong> reprend la même figure pour y lire le ' +
    'calcul : pour ces quatre solides, ' +
    '\\(V = \\text{aire d\'une base} \\times \\text{hauteur}\\).' +
    '<br>Choisis un solide, puis clique sur <strong>▶ Animer</strong> (ou coche ' +
    '<strong>Pas à pas</strong>). Les curseurs changent l\'angle et la réduction : ' +
    'c\'est <strong>toujours le même solide</strong>, mais une autre représentation — ' +
    'et les arêtes cachées ne sont plus les mêmes.',
  notes:
    '<ul>' +
    '<li><strong>Vraie grandeur, mais seulement de face.</strong> Tout ce qui est dans un ' +
    'plan <strong>parallèle à la feuille</strong> est dessiné en vraie grandeur : longueurs ' +
    'et angles y sont respectés. La face avant et la face arrière d\'un pavé sont donc deux ' +
    'rectangles <strong>identiques</strong> sur le dessin.</li>' +
    '<li><strong>Les fuyantes.</strong> Elles représentent la <strong>profondeur</strong>. ' +
    'Sur le dessin elles sont <strong>parallèles entre elles</strong>, de <strong>même ' +
    'longueur</strong>, et cette longueur est celle de la profondeur <strong>multipliée par ' +
    'le coefficient de réduction</strong> (souvent \\(0{,}5\\)) : 6 cm de profondeur se ' +
    'dessinent 3 cm.</li>' +
    '<li><strong>Ce qui est conservé, ce qui ne l\'est pas.</strong> Le ' +
    '<strong>parallélisme</strong> et les <strong>milieux</strong> sont conservés : deux ' +
    'arêtes parallèles du solide restent parallèles sur le dessin. Mais les ' +
    '<strong>angles droits</strong> qui ne sont pas de face ne le sont plus, et les ' +
    'longueurs des fuyantes sont fausses : sur le dessin d\'un cube, les arêtes n\'ont pas ' +
    'toutes la même longueur !</li>' +
    '<li><strong>Trait plein, pointillés.</strong> Le solide est <strong>plein</strong> : ' +
    'les faces de devant cachent une partie des arêtes du fond. On dessine ces arêtes ' +
    'cachées en <strong>pointillés</strong> — on ne les efface pas, car elles font partie ' +
    'du solide.</li>' +
    '<li><strong>Sur un pavé ou un cube</strong>, il y a 12 arêtes, et ' +
    '<strong>exactement 3</strong> sont cachées : celles qui se rejoignent au ' +
    '<strong>sommet du fond</strong>. Change le sens des fuyantes : c\'est un autre sommet ' +
    'qui passe derrière.</li>' +
    '<li><strong>Le cylindre.</strong> Ses bases sont des <strong>cercles</strong>, mais ' +
    'vues de biais elles se dessinent comme des <strong>ellipses</strong>. La base du haut ' +
    'est entièrement visible ; sur celle du bas, la <strong>moitié arrière</strong> est ' +
    'cachée par le cylindre : elle se trace en pointillés. La <strong>hauteur</strong>, ' +
    'elle, est verticale et en vraie grandeur.</li>' +
    '<li><strong>Le volume : une seule formule.</strong> Pour un <strong>prisme droit</strong> ' +
    'comme pour un <strong>cylindre</strong> : ' +
    '$$V = \\mathcal{B} \\times h$$ où \\(\\mathcal{B}\\) est l\'<strong>aire d\'une base</strong> ' +
    'et \\(h\\) la <strong>hauteur</strong>, c\'est-à-dire la distance entre les deux bases. ' +
    'C\'est la même idée à chaque fois : on empile la base sur une hauteur \\(h\\).</li>' +
    '<li><strong>Les quatre cas.</strong>' +
    '<br>• <strong>Pavé droit</strong> : \\(V = L \\times l \\times h\\) — c\'est bien ' +
    '\\(\\mathcal{B} \\times h\\), avec \\(\\mathcal{B} = L \\times l\\) ;' +
    '<br>• <strong>Cube</strong> d\'arête \\(a\\) : \\(V = a \\times a \\times a = a^{3}\\) ;' +
    '<br>• <strong>Prisme droit</strong> : \\(V = \\mathcal{B} \\times h\\), l\'aire de la base ' +
    'se calculant selon sa forme (pour un triangle, \\(\\dfrac{b \\times h_t}{2}\\)) ;' +
    '<br>• <strong>Cylindre</strong> de rayon \\(r\\) : \\(V = \\pi r^{2} \\times h\\), ' +
    'puisque l\'aire du disque vaut \\(\\pi r^{2}\\).</li>' +
    '<li><strong>Les unités.</strong> Un volume se mesure en <strong>unités de longueur au ' +
    'cube</strong> : des cm × des cm × des cm donnent des <strong>cm³</strong>. Il faut donc ' +
    'que <strong>toutes les longueurs soient dans la même unité</strong> avant de multiplier.</li>' +
    '<li><strong>Attention au dessin !</strong> La perspective <strong>raccourcit les ' +
    'fuyantes</strong> : une profondeur de 3 cm peut n\'en mesurer que 1,5 sur la feuille. ' +
    'On calcule toujours avec les <strong>dimensions réelles</strong> du solide, jamais avec ' +
    'celles que l\'on mesurerait sur le dessin.</li>' +
    '<li><strong>Retrouver une longueur.</strong> La formule se lit aussi à l\'envers : si ' +
    'l\'on connaît le volume et les autres dimensions, on <strong>divise</strong>. Un pavé de ' +
    '\\(60\\) cm³ dont la base mesure \\(5 \\times 4\\) cm a pour hauteur ' +
    '\\(60 \\div 20 = 3\\) cm.</li>' +
    '<li><strong>Un dessin n\'est pas le solide.</strong> Le même pavé se dessine d\'une ' +
    'infinité de façons — c\'est ce que montrent les curseurs. Deux dessins différents ' +
    'peuvent représenter le même solide, et un même dessin se lit toujours en se ' +
    'demandant : <em>qu\'est-ce qui est devant ?</em></li>' +
    '</ul>',
  board: {
    boundingbox: [-2.9, 5.9, 6.9, -1.2], keepaspectratio: true,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_AV = '#2563eb';     // la face avant, en vraie grandeur
    var C_FU = '#d97706';     // les fuyantes
    var C_AR = '#7c3aed';     // la face arrière
    var C_CACHE = '#94a3b8';  // ce qui est caché
    var C_FACE = '#60a5fa';   // le remplissage du solide
    var C_BASE = '#16a34a';   // la base, dans le calcul du volume
    var C_HAUT = '#dc2626';   // la hauteur
    var INK = '#334155';
    var SOFT = '#94a3b8';

    var LETTRES = 'ABCDEFGH';

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Le point de vue : l'angle des fuyantes et la réduction                */
    /* ==================================================================== */
    var angle = 45;           // en degrés
    var kRed = 0.5;           // coefficient de réduction
    var sens = 1;             // 1 : fuyantes vers la droite, −1 : vers la gauche

    function aRad() { return (sens > 0 ? angle : 180 - angle) * Math.PI / 180; }
    // La projection : le plan de face est en vraie grandeur, la profondeur
    // part en biais et raccourcie.
    function px(P) { return P[0] + P[2] * kRed * Math.cos(aRad()); }
    function py(P) { return P[1] + P[2] * kRed * Math.sin(aRad()); }
    // La direction du regard (cf. l'en-tête) : une face est visible quand sa
    // normale sortante n vérifie n · w < 0.
    function vue(n) {
      return n[0] * (-kRed * Math.cos(aRad())) +
             n[1] * (-kRed * Math.sin(aRad())) + n[2];
    }
    function visible(n) { return vue(n) < 0; }

    /* ==================================================================== */
    /* Les solides                                                          */
    /*                                                                      */
    /* Un pavé, un cube et un prisme droit sont trois PRISMES : le contour   */
    /* de la face avant, et une profondeur. Le cube est le pavé dont les     */
    /* trois dimensions sont égales — on le décrit donc de la même façon.    */
    /* Les contours sont donnés dans le sens direct : la normale sortante    */
    /* d'une face latérale est alors (dy ; −dx ; 0).                         */
    /* ==================================================================== */
    /* Les dimensions sont en centimètres, et choisies pour que les volumes
       tombent juste : 30, 27 et 18 cm³ — le cylindre, lui, garde son π. */
    var SOLIDES = [
      { id: 'pave', nom: 'Pavé droit', type: 'prisme',
        base: [[0, 0], [4, 0], [4, 2.5], [0, 2.5]], p: 3,
        dit: 'Six faces rectangulaires, 12 arêtes, 8 sommets.' },
      { id: 'cube', nom: 'Cube', type: 'prisme',
        base: [[0, 0], [3, 0], [3, 3], [0, 3]], p: 3,
        dit: 'Un pavé dont les 12 arêtes ont la même longueur — ce qui ne se ' +
             'voit pas sur le dessin : les fuyantes y sont raccourcies.' },
      { id: 'prisme', nom: 'Prisme droit', type: 'prisme',
        base: [[0, 0], [4, 0], [1.4, 3]], p: 3,
        dit: 'Deux bases identiques et parallèles (ici des triangles), reliées ' +
             'par des faces rectangulaires.' },
      { id: 'cylindre', nom: 'Cylindre', type: 'cylindre',
        r: 1.5, h: 3, cx: 1.7, cz: 1.5,
        dit: 'Ses deux bases sont des disques identiques ; vues de biais, elles ' +
             'se dessinent comme des ellipses.' }
    ];

    /* ==================================================================== */
    /* Le volume — la même formule pour les quatre solides                  */
    /*                                                                      */
    /* Tout se déduit de la géométrie déjà décrite : l'aire de la base, la   */
    /* hauteur (la profondeur du prisme, la hauteur du cylindre), et le      */
    /* produit des deux. Rien n'est écrit en dur : le texte ne peut donc pas */
    /* se mettre à mentir si l'on change une dimension.                     */
    /* ==================================================================== */
    function infoVolume(s) {
      var i = { h: s.type === 'prisme' ? s.p : s.h };
      if (s.type === 'cylindre') {
        i.aire = Math.PI * s.r * s.r;
        i.baseNom = 'un disque de rayon ' + f(s.r) + ' cm';
        i.aireCalc = 'π × ' + f(s.r) + '²';
        i.aireTxt = '≈ ' + f2(i.aire) + ' cm²';
        i.approche = true;
      } else if (s.base.length === 3) {
        // Le triangle a ici une base horizontale : sa hauteur est l'ordonnée
        // du sommet opposé.
        var b = s.base[1][0], ht = s.base[2][1];
        i.aire = b * ht / 2;
        i.baseNom = 'un triangle de base ' + f(b) + ' cm et de hauteur ' + f(ht) + ' cm';
        i.aireCalc = f(b) + ' × ' + f(ht) + ' ÷ 2';
        i.aireTxt = '= ' + f(i.aire) + ' cm²';
      } else {
        var L = s.base[1][0], l = s.base[2][1];
        i.aire = L * l;
        i.baseNom = (L === l ? 'un carré de ' + f(L) + ' cm de côté'
                             : 'un rectangle de ' + f(L) + ' cm sur ' + f(l) + ' cm');
        i.aireCalc = f(L) + ' × ' + f(l);
        i.aireTxt = '= ' + f(i.aire) + ' cm²';
        i.L = L; i.l = l;
      }
      i.V = i.aire * i.h;
      return i;
    }
    var iSol = 0;
    function S() { return SOLIDES[iSol]; }

    /* ==================================================================== */
    /* L'état de l'animation                                                */
    /*                                                                      */
    /* Chaque étape règle un état ABSOLU : « Précédent » rejoue sans surprise.*/
    /* ==================================================================== */
    var mode = 'dessin';        // 'dessin' | 'volume'
    var vu = {
      av: 0,        // la face avant se trace
      fu: 0,        // les fuyantes, l'une après l'autre
      ar: 0,        // la face arrière
      plein: 0,     // le solide devient opaque : on voit ce qui masque quoi
      cache: 0,     // les arêtes cachées passent en pointillés
      regle: 0,     // la règle mise en avant dans le panneau (1, 2 ou 3)
      bas: 0,       // (volume) la base s'allume
      hau: 0,       // (volume) la hauteur s'allume
      res: 0        // (volume) le résultat s'écrit
    };
    function toutMontrer() {
      vu.av = 1; vu.fu = 1; vu.ar = 1; vu.plein = 0; vu.cache = 1; vu.regle = 3;
    }

    /* ==================================================================== */
    /* Fabriques                                                            */
    /* ==================================================================== */
    function attr(o, cle, v) {
      if (!o._mv) o._mv = {};
      if (o._mv[cle] !== v) {
        o._mv[cle] = v;
        var a = {}; a[cle] = v;
        o.setAttribute(a);
      }
    }
    function pointDe(P) {
      return board.create('point', [function () { return px(P); },
                                    function () { return py(P); }], {
        size: 2.5, fillColor: INK, strokeColor: INK, fixed: true,
        withLabel: false, visible: false, highlight: false, showInfobox: false,
        layer: 9
      });
    }
    function segmentDe(pa, pb, couleur) {
      return board.create('segment', [pa, pb], {
        strokeColor: couleur, strokeWidth: 2.4, strokeOpacity: 1,
        fixed: true, visible: false, highlight: false, layer: 7
      });
    }

    /* ==================================================================== */
    /* Construction d'un prisme (pavé, cube, prisme droit)                   */
    /* ==================================================================== */
    function construitPrisme(s) {
      var n = s.base.length, i;
      s.n = n;
      s.P3 = [];                                   // les sommets, en 3D
      for (i = 0; i < n; i++) s.P3.push([s.base[i][0], s.base[i][1], 0]);
      for (i = 0; i < n; i++) s.P3.push([s.base[i][0], s.base[i][1], s.p]);
      s.nom3 = function (j) { return LETTRES.charAt(j); };

      s.centre = [0, 0, s.p / 2];
      for (i = 0; i < n; i++) {
        s.centre[0] += s.base[i][0] / n;
        s.centre[1] += s.base[i][1] / n;
      }

      s.pts = s.P3.map(pointDe);
      s.labs = s.P3.map(function (P, j) {
        // L'étiquette s'écarte du centre du dessin : elle ne chevauche jamais
        // les arêtes qui arrivent au sommet.
        function ec(q) {
          var cx = px(s.centre), cy = py(s.centre);
          var dx = px(P) - cx, dy = py(P) - cy;
          var d = Math.sqrt(dx * dx + dy * dy) || 1;
          return q === 0 ? px(P) + 0.36 * dx / d : py(P) + 0.36 * dy / d;
        }
        return board.create('text', [function () { return ec(0); },
                                     function () { return ec(1); },
                                     s.nom3(j)], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: INK,
          cssStyle: 'font-weight:800', fixed: true, visible: false,
          highlight: false, layer: 9
        });
      });

      /* -- les faces, avec leur normale sortante ------------------------- */
      s.faces = [{ idx: [], n3: [0, 0, -1], obj: null, quoi: 'avant' },
                 { idx: [], n3: [0, 0, 1], obj: null, quoi: 'arriere' }];
      for (i = 0; i < n; i++) s.faces[0].idx.push(i);
      for (i = n - 1; i >= 0; i--) s.faces[1].idx.push(i + n);
      s.lat = [];
      for (i = 0; i < n; i++) {
        var j = (i + 1) % n;
        var dx = s.base[j][0] - s.base[i][0], dy = s.base[j][1] - s.base[i][1];
        var f = { idx: [i, j, j + n, i + n], n3: [dy, -dx, 0], obj: null, quoi: 'lat' };
        s.lat.push(f);
        s.faces.push(f);
      }
      s.faces.forEach(function (f) {
        f.obj = board.create('polygon', f.idx.map(function (k) { return s.pts[k]; }), {
          fillColor: C_FACE, fillOpacity: 0, highlight: false, withLabel: false,
          borders: { visible: false, strokeOpacity: 0 },
          vertices: { visible: false }, fixed: true, layer: 6
        });
      });

      /* -- les arêtes ---------------------------------------------------- */
      /* Trois familles, et c'est tout le dessin : le contour de devant, les
         fuyantes, le contour de derrière. */
      s.aretes = [];
      for (i = 0; i < n; i++) {
        var k = (i + 1) % n;
        s.aretes.push({ fam: 'av', i: i, a: i, b: k, couleur: C_AV });
        s.aretes.push({ fam: 'fu', i: i, a: i, b: i + n, couleur: C_FU });
        s.aretes.push({ fam: 'ar', i: i, a: i + n, b: k + n, couleur: C_AR });
      }
      s.aretes.forEach(function (e) {
        e.obj = segmentDe(s.pts[e.a], s.pts[e.b], e.couleur);
        e.nom = '[' + s.nom3(e.a) + s.nom3(e.b) + ']';
      });
      s.objets = [].concat(s.pts, s.labs,
                           s.faces.map(function (f) { return f.obj; }),
                           s.aretes.map(function (e) { return e.obj; }));
    }

    // Une arête est cachée quand TOUTES les faces qui la bordent le sont.
    // La face avant est toujours visible, la face arrière jamais : tout se
    // décide donc sur les faces latérales.
    function cacheeS(s, e) {
      var lat = s.lat.map(function (f) { return visible(f.n3); });
      if (e.fam === 'av') return false;
      if (e.fam === 'ar') return !lat[e.i];
      return !lat[e.i] && !lat[(e.i + s.n - 1) % s.n];      // fuyante
    }

    /* ==================================================================== */
    /* Construction du cylindre                                              */
    /*                                                                      */
    /* Le cercle de base se projette en ellipse. Le regard est tangent au    */
    /* cylindre en deux points : ce sont les GÉNÉRATRICES DU CONTOUR, et     */
    /* elles séparent la moitié visible de la moitié cachée.                 */
    /* ==================================================================== */
    function construitCylindre(s) {
      function bas(t) { return [s.cx + s.r * Math.cos(t), 0, s.cz + s.r * Math.sin(t)]; }
      function haut(t) { return [s.cx + s.r * Math.cos(t), s.h, s.cz + s.r * Math.sin(t)]; }
      s.bas = bas; s.haut = haut;
      // La normale au point d'angle t vaut (cos t ; 0 ; sin t) : le contour est
      // là où elle est perpendiculaire au regard, donc tan t = k cos a.
      s.t0 = function () { return Math.atan(kRed * Math.cos(aRad())); };
      s.centre = [s.cx, s.h / 2, s.cz];

      function courbe(f, ta, tb, couleur, largeur) {
        return board.create('curve', [
          function (u) { return px(f(ta() + (tb() - ta()) * u)); },
          function (u) { return py(f(ta() + (tb() - ta()) * u)); },
          0, 1
        ], {
          strokeColor: couleur, strokeWidth: largeur || 2.4, fixed: true,
          visible: false, highlight: false, layer: 7, numberPointsHigh: 200
        });
      }
      // La base du bas : moitié avant (visible) et moitié arrière (cachée).
      s.basAvant = courbe(bas, function () { return s.t0() - Math.PI; }, s.t0, C_AV);
      s.basArriere = courbe(bas, s.t0, function () { return s.t0() + Math.PI; }, C_AV);
      // La base du haut, tout entière : on la voit de dessus.
      s.hautEllipse = courbe(haut, function () { return s.t0() - Math.PI; },
                             function () { return s.t0() + Math.PI; }, C_AR);
      // Les deux génératrices du contour, verticales et en vraie grandeur.
      function gen(dec) {
        return board.create('segment', [
          [function () { return px(bas(s.t0() + dec)); },
           function () { return py(bas(s.t0() + dec)); }],
          [function () { return px(haut(s.t0() + dec)); },
           function () { return py(haut(s.t0() + dec)); }]
        ], {
          strokeColor: C_FU, strokeWidth: 2.4, fixed: true, visible: false,
          highlight: false, layer: 7
        });
      }
      s.gen1 = gen(0); s.gen2 = gen(Math.PI);
      // Le corps du cylindre, pour le rendre opaque : le contour visible, du
      // bas de l'ellipse d'en bas au tour complet de celle d'en haut.
      s.corps = board.create('curve', [[], []], {
        fillColor: C_FACE, fillOpacity: 0, strokeOpacity: 0, fixed: true,
        visible: false, highlight: false, layer: 6
      });
      s.corps.updateDataArray = function () {
        var t0 = s.t0(), N = 60, i, t, P;
        this.dataX = []; this.dataY = [];
        for (i = 0; i <= N; i++) {                    // le bas, moitié avant
          t = t0 - Math.PI + (Math.PI * i) / N;
          P = bas(t); this.dataX.push(px(P)); this.dataY.push(py(P));
        }
        for (i = 0; i <= N; i++) {                    // le haut, moitié arrière
          t = t0 + (Math.PI * i) / N;
          P = haut(t); this.dataX.push(px(P)); this.dataY.push(py(P));
        }
      };
      s.objets = [s.basAvant, s.basArriere, s.hautEllipse, s.gen1, s.gen2, s.corps];
    }

    /* ==================================================================== */
    /* Ce qu'ajoute le mode « volume » : la base, ses cotes, la hauteur      */
    /* ==================================================================== */
    function texteCote(fx, fy, ftxt, couleur) {
      return board.create('text', [fx, fy, ftxt], {
        anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: couleur,
        cssStyle: 'font-weight:800', fixed: true, visible: false,
        highlight: false, layer: 9
      });
    }

    function construitVolume(s) {
      var i = infoVolume(s);
      s.volObjets = [];
      var o;

      if (s.type === 'prisme') {
        // La base : la face avant, repeinte en vert par-dessus le reste.
        s.volBase = board.create('polygon', s.faces[0].idx.map(function (k) {
          return s.pts[k];
        }), {
          fillColor: C_BASE, fillOpacity: 0, highlight: false, withLabel: false,
          borders: { strokeColor: C_BASE, strokeWidth: 3, strokeOpacity: 0 },
          vertices: { visible: false }, fixed: true, layer: 8
        });
        s.volObjets.push(s.volBase);

        var b = s.base[1][0];
        // La longueur de la base, écrite sous l'arête de devant.
        o = texteCote(function () { return px([b / 2, 0, 0]); },
                      function () { return py([b / 2, 0, 0]) - 0.42; },
                      f(b) + ' cm', C_BASE);
        s.volCotes = [o]; s.volObjets.push(o);

        if (s.base.length === 4) {
          // Un rectangle : la seconde dimension, à gauche.
          var l = s.base[2][1];
          o = texteCote(function () { return px([0, l / 2, 0]) - 0.55; },
                        function () { return py([0, l / 2, 0]); },
                        f(l) + ' cm', C_BASE);
          s.volCotes.push(o); s.volObjets.push(o);
        } else {
          // Un triangle : il faut sa hauteur, qu'on trace en pointillés.
          var ax = s.base[2][0], ah = s.base[2][1];
          s.volHt = board.create('segment', [
            [function () { return px([ax, ah, 0]); }, function () { return py([ax, ah, 0]); }],
            [function () { return px([ax, 0, 0]); }, function () { return py([ax, 0, 0]); }]
          ], {
            strokeColor: C_BASE, strokeWidth: 2, dash: 2, fixed: true,
            visible: false, highlight: false, layer: 9
          });
          o = texteCote(function () { return px([ax, ah / 2, 0]) + 0.45; },
                        function () { return py([ax, ah / 2, 0]); },
                        f(ah) + ' cm', C_BASE);
          s.volCotes.push(o);
          s.volObjets.push(s.volHt, o);
        }
      } else {
        // Le disque du bas, et son rayon.
        s.volBase = board.create('curve', [[], []], {
          fillColor: C_BASE, fillOpacity: 0, strokeColor: C_BASE, strokeWidth: 3,
          strokeOpacity: 0, fixed: true, visible: false, highlight: false, layer: 8
        });
        s.volBase.updateDataArray = function () {
          var N = 80, j, P;
          this.dataX = []; this.dataY = [];
          for (j = 0; j <= N; j++) {
            P = s.bas(2 * Math.PI * j / N);
            this.dataX.push(px(P)); this.dataY.push(py(P));
          }
        };
        // Le rayon part du centre et va vers l'avant du cercle : toujours visible.
        function bord() { return s.bas(s.t0() - Math.PI / 2); }
        s.volRayon = board.create('segment', [
          [function () { return px([s.cx, 0, s.cz]); },
           function () { return py([s.cx, 0, s.cz]); }],
          [function () { return px(bord()); }, function () { return py(bord()); }]
        ], {
          strokeColor: C_BASE, strokeWidth: 2.4, fixed: true, visible: false,
          highlight: false, layer: 9
        });
        o = texteCote(function () { return (px([s.cx, 0, s.cz]) + px(bord())) / 2; },
                      function () { return (py([s.cx, 0, s.cz]) + py(bord())) / 2 - 0.35; },
                      'r = ' + f(s.r) + ' cm', C_BASE);
        s.volCotes = [o];
        s.volObjets.push(s.volBase, s.volRayon, o);
      }

      // La hauteur : elle est portée par les fuyantes (le prisme est droit),
      // et par les génératrices pour le cylindre. On la cote sur l'une d'elles.
      s.volHaut = texteCote(function () { return coteHaut(s)[0]; },
                            function () { return coteHaut(s)[1]; },
                            'h = ' + f(i.h) + ' cm', C_HAUT);
      s.volObjets.push(s.volHaut);
      s.objets = s.objets.concat(s.volObjets);
    }

    // Où poser l'étiquette de la hauteur : au milieu d'une fuyante VISIBLE, la
    // plus haute possible, décalée vers l'extérieur.
    function coteHaut(s) {
      var a, b;
      if (s.type === 'cylindre') {
        a = s.bas(s.t0()); b = s.haut(s.t0());
      } else {
        var lat = s.lat.map(function (fc) { return visible(fc.n3); });
        var best = -1, bestY = -Infinity;
        for (var i = 0; i < s.n; i++) {
          var vis = lat[i] || lat[(i + s.n - 1) % s.n];
          var y = py(s.P3[i]);
          if (vis && y > bestY) { bestY = y; best = i; }
        }
        if (best < 0) best = 0;
        a = s.P3[best]; b = s.P3[best + s.n];
      }
      return [(px(a) + px(b)) / 2 + 0.1, (py(a) + py(b)) / 2 + 0.34];
    }

    SOLIDES.forEach(function (s) {
      if (s.type === 'prisme') construitPrisme(s); else construitCylindre(s);
      construitVolume(s);
    });

    /* ==================================================================== */
    /* Ce qui est visible, à chaque image                                    */
    /* ==================================================================== */
    // Une famille d'arêtes apparaît l'une après l'autre : l'arête i sort quand
    // l'avancement dépasse (i + 1) / n.
    function sortie(p, i, n) { return p >= (i + 1) / n - 1e-9; }

    function refresh() {
      SOLIDES.forEach(function (s) {
        if (s !== S()) s.objets.forEach(function (o) { attr(o, 'visible', false); });
      });
      var s = S();
      if (s.type === 'prisme') appliquePrisme(s); else appliqueCylindre(s);
      appliqueVolume(s);
    }

    // La base en vert, ses cotes, la hauteur en rouge : rien de tout cela n'est
    // visible tant qu'on parle du dessin.
    function appliqueVolume(s) {
      var on = (mode === 'volume');
      attr(s.volBase, 'visible', on && vu.bas > 0.05);
      attr(s.volBase, 'fillOpacity', Math.round(38 * Math.min(1, vu.bas)) / 100);
      attr(s.volBase, 'strokeOpacity', Math.min(1, vu.bas));
      if (s.volBase.borders) {
        s.volBase.borders.forEach(function (b) {
          attr(b, 'strokeOpacity', Math.min(1, vu.bas));
        });
      }
      s.volCotes.forEach(function (t) { attr(t, 'visible', on && vu.bas > 0.55); });
      if (s.volHt) attr(s.volHt, 'visible', on && vu.bas > 0.55);
      if (s.volRayon) attr(s.volRayon, 'visible', on && vu.bas > 0.4);
      attr(s.volHaut, 'visible', on && vu.hau > 0.4);
      // Les fuyantes SONT la hauteur : on les repeint plutôt que d'ajouter un
      // trait qui ferait double emploi.
      var hautOn = on && vu.hau > 0.15;
      if (s.type === 'prisme') {
        s.aretes.forEach(function (e) {
          if (e.fam !== 'fu') return;
          attr(e.obj, 'strokeColor', hautOn ? C_HAUT : (vu.cache >= 1 && cacheeS(s, e) ? C_CACHE : e.couleur));
          attr(e.obj, 'strokeWidth', hautOn ? 3.2 : (vu.cache >= 1 && cacheeS(s, e) ? 2 : 2.4));
        });
      } else {
        [s.gen1, s.gen2].forEach(function (g) {
          attr(g, 'strokeColor', hautOn ? C_HAUT : C_FU);
          attr(g, 'strokeWidth', hautOn ? 3.2 : 2.4);
        });
      }
    }

    function appliquePrisme(s) {
      var n = s.n;
      var opaque = vu.plein;
      s.aretes.forEach(function (e) {
        var av = e.fam === 'av' ? vu.av : e.fam === 'fu' ? vu.fu : vu.ar;
        var on = sortie(av, e.i, n);
        var derriere = cacheeS(s, e);           // l'arête passe-t-elle au fond ?
        var cach = vu.cache >= 1 && derriere;   // la dessine-t-on en pointillés ?
        attr(e.obj, 'visible', on);
        attr(e.obj, 'dash', cach ? 2 : 0);
        attr(e.obj, 'strokeColor', cach ? C_CACHE : e.couleur);
        attr(e.obj, 'strokeWidth', cach ? 2 : 2.4);
        // Une arête du fond est TOUJOURS posée sous les faces, même avant
        // qu'on en parle : c'est ce qui la fait disparaître pour de bon quand
        // le solide devient opaque, à l'étape « le solide est plein ».
        attr(e.obj, 'layer', derriere ? 5 : 7);
      });
      s.pts.forEach(function (p, j) {
        var vuJ = (j < n ? vu.av : Math.max(vu.fu, vu.ar));
        attr(p, 'visible', vuJ > 0.05);
      });
      s.labs.forEach(function (t, j) {
        var vuJ = (j < n ? vu.av : Math.max(vu.fu, vu.ar));
        attr(t, 'visible', vuJ > 0.05);
        // Le sommet du fond, celui où se rejoignent les pointillés, se signale.
        attr(t, 'color', (vu.cache >= 1 && sommetCache(s) === j) ? C_CACHE : INK);
      });
      s.faces.forEach(function (f) {
        var vis = visible(f.n3);
        // Seules les faces visibles se remplissent : les autres sont derrière.
        attr(f.obj, 'visible', vis && vu.ar > 0.6);
        attr(f.obj, 'fillOpacity', Math.round((0.10 + 0.85 * opaque) * 100) / 100);
      });
    }

    // Le sommet du fond : celui d'où partent les trois arêtes cachées.
    function sommetCache(s) {
      var lat = s.lat.map(function (f) { return visible(f.n3); });
      for (var i = 0; i < s.n; i++) {
        if (!lat[i] && !lat[(i + s.n - 1) % s.n]) return i + s.n;
      }
      return -1;
    }

    function appliqueCylindre(s) {
      var cach = vu.cache >= 1;
      attr(s.basAvant, 'visible', vu.av > 0.05);
      attr(s.gen1, 'visible', sortie(vu.fu, 0, 2));
      attr(s.gen2, 'visible', sortie(vu.fu, 1, 2));
      attr(s.hautEllipse, 'visible', vu.ar > 0.05);
      // Tant qu'on n'a pas parlé du caché, l'arrière de la base est un trait
      // plein comme les autres : c'est l'étape « le solide est plein » qui
      // fait la différence.
      attr(s.basArriere, 'visible', vu.av > 0.05);
      attr(s.basArriere, 'dash', cach ? 2 : 0);
      attr(s.basArriere, 'strokeColor', cach ? C_CACHE : C_AV);
      attr(s.basArriere, 'strokeWidth', cach ? 2 : 2.4);
      // Posée sous le corps du cylindre dès le départ : elle disparaît donc
      // vraiment quand celui-ci devient opaque.
      attr(s.basArriere, 'layer', 5);
      attr(s.corps, 'visible', vu.ar > 0.6);
      attr(s.corps, 'fillOpacity', Math.round((0.10 + 0.85 * vu.plein) * 100) / 100);
    }

    board.on('update', function () { refresh(); majPanneau(); });

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'per-ui';
    root.innerHTML =
      '<div class="per-cap"></div>' +
      '<div class="per-regles"></div>' +
      '<div class="per-bilan"></div>';
    var capEl = root.querySelector('.per-cap');
    var reglesEl = root.querySelector('.per-regles');
    var bilanEl = root.querySelector('.per-bilan');

    var dernierCap = null;
    function cap(t) {
      if (t === dernierCap) return;
      dernierCap = t;
      capEl.innerHTML = t || '&nbsp;';
    }
    function f(v) { return String(Math.round(v * 100) / 100).replace('.', ','); }
    function f1(v) { return String(Math.round(v * 10) / 10).replace('.', ','); }
    function f2(v) { return String(Math.round(v * 100) / 100).replace('.', ','); }

    var dernierPan = null;
    function majPanneau() {
      var s = S();
      var cle = [mode, s.id, vu.regle, vu.cache >= 1 ? 1 : 0, vu.ar > 0.6 ? 1 : 0,
                 vu.bas > 0.55 ? 1 : 0, vu.hau > 0.4 ? 1 : 0, vu.res > 0.4 ? 1 : 0,
                 angle, kRed, sens].join('|');
      if (cle === dernierPan) return;
      dernierPan = cle;
      if (mode === 'volume') dessineVolume(); else dessinePanneau();
    }

    /* -- le panneau du mode « volume » : la formule, ligne à ligne -------- */
    function dessineVolume() {
      var s = S(), i = infoVolume(s);
      var vert = function (t) { return '<b style="color:' + C_BASE + '">' + t + '</b>'; };
      var rouge = function (t) { return '<b style="color:' + C_HAUT + '">' + t + '</b>'; };

      var lignes =
        '<div class="per-formule">V = ' + vert('aire de la base') + ' × ' +
          rouge('hauteur') + '</div>';
      if (vu.bas > 0.55) {
        lignes += '<div class="per-etape">' + vert('La base') + ' est ' + i.baseNom +
          ' : son aire vaut ' + vert(i.aireCalc + ' ' + i.aireTxt) + '</div>';
      }
      if (vu.hau > 0.4) {
        lignes += '<div class="per-etape">' + rouge('La hauteur') +
          ' est la distance entre les deux bases : ' + rouge(f(i.h) + ' cm') +
          ' <span class="per-piege">sur le dessin, elle ne mesure que ' +
          f(i.h * kRed) + ' cm — on calcule avec la <b>vraie</b> longueur</span></div>';
      }
      if (vu.res > 0.4) {
        // Avec un π, on garde l'écriture exacte jusqu'au bout : enchaîner sur
        // une aire déjà arrondie donnerait le mauvais réflexe.
        lignes += '<div class="per-resultat">V = ' +
          vert(i.approche ? i.aireCalc : f2(i.aire)) + ' × ' + rouge(f(i.h)) + ' ' +
          (i.approche ? '≈ ' : '= ') + '<b>' +
          (i.approche ? f1(i.V) : f(i.V)) + ' cm³</b></div>';
      }
      reglesEl.innerHTML = lignes;

      var bilan = '';
      if (vu.res > 0.4) {
        if (s.id === 'cube') {
          bilan = 'Les trois dimensions d\'un cube sont égales : ' +
            'V = ' + f(s.p) + ' × ' + f(s.p) + ' × ' + f(s.p) + ' = ' + f(s.p) +
            '³ = <b>' + f(i.V) + ' cm³</b>.';
        } else if (s.id === 'pave') {
          bilan = 'Pour un pavé droit, cela revient à multiplier ses trois ' +
            'dimensions : longueur × largeur × hauteur = ' + f(i.L) + ' × ' + f(i.l) +
            ' × ' + f(i.h) + ' = <b>' + f(i.V) + ' cm³</b>. Peu importe la face que ' +
            'l\'on choisit comme base : le volume est le même.';
        } else if (s.id === 'cylindre') {
          bilan = 'L\'aire d\'un disque vaut π × r², d\'où V = π × ' + f(s.r) + '² × ' +
            f(i.h) + ' = ' + f(s.r * s.r * i.h) + ' π ≈ <b>' + f1(i.V) + ' cm³</b> ' +
            '(valeur arrondie au dixième).';
        } else {
          bilan = 'L\'aire de la base se calcule selon sa forme — ici un triangle, ' +
            'donc base × hauteur ÷ 2. Le reste ne change pas : on multiplie par la ' +
            'hauteur du prisme.';
        }
        bilan = '<div class="per-compte">' + bilan + '</div>';
      }
      bilanEl.innerHTML = '<span class="per-dit">' + s.dit + '</span>' + bilan;
    }

    function dessinePanneau() {
      var s = S();
      var prof = s.type === 'prisme' ? s.p : 2 * s.r;
      var regles = [
        { n: 1, t: 'La <b>face avant</b> est dans le plan de la feuille : on la dessine ' +
             'en <b>vraie grandeur</b>' +
             (s.type === 'prisme'
               ? ', ses angles droits restent droits.'
               : '. La <b>hauteur</b> aussi est en vraie grandeur : elle est verticale.') },
        { n: 2, t: 'Les <b>fuyantes</b> sont toutes <b>parallèles</b>, tracées à ' +
             '<b>' + angle + '°</b> vers la <b>' + (sens > 0 ? 'droite' : 'gauche') +
             '</b> et raccourcies du coefficient <b>' + f(kRed) + '</b> : ' +
             f(prof) + ' cm de profondeur se dessinent ' + f(prof * kRed) + ' cm.' },
        { n: 3, t: '<b>Trait plein</b> : ce que l\'on voit. <b>Pointillés</b> : ce qui est ' +
             '<b>caché</b>, masqué par ce qui est devant.' }
      ];
      reglesEl.innerHTML = regles.map(function (r) {
        return '<div class="per-regle' + (vu.regle === r.n ? ' on' : '') + '">' +
               '<span class="per-no">' + r.n + '</span>' + r.t + '</div>';
      }).join('');

      if (vu.cache < 1) {
        bilanEl.innerHTML = '<span class="per-dit">' + s.dit + '</span>';
        return;
      }
      if (s.type === 'cylindre') {
        bilanEl.innerHTML =
          '<span class="per-dit">' + s.dit + '</span>' +
          '<div class="per-compte">La <b>moitié arrière</b> du cercle du bas passe ' +
          'derrière le cylindre : <b>pointillés</b>. Le cercle du haut, lui, est ' +
          '<b>entièrement visible</b> — on le voit de dessus.</div>';
        return;
      }
      var cachees = s.aretes.filter(function (e) { return cacheeS(s, e); });
      var som = sommetCache(s);
      bilanEl.innerHTML =
        '<span class="per-dit">' + s.dit + '</span>' +
        '<div class="per-compte">Arêtes cachées : ' +
        cachees.map(function (e) {
          return '<b class="per-ar">' + e.nom + '</b>';
        }).join(' , ') +
        ' — <b>' + cachees.length + '</b> sur ' + s.aretes.length + '.' +
        (som >= 0 ? ' Elles se rejoignent au sommet <b>' + s.nom3(som) +
                    '</b>, celui qui est <b>derrière</b>.' : '') +
        '</div>';
    }

    /* ==================================================================== */
    /* Les scénarios                                                         */
    /* ==================================================================== */
    function S_(dur, txt, fn) {
      return {
        dur: dur,
        step: function (p) { cap(txt); fn(p); },
        after: function () { cap(txt); fn(1); board.update(); }
      };
    }

    function stepsPrisme() {
      var quoi = S().id === 'prisme' ? 'triangle' : 'rectangle';
      return [
        S_(900, 'La <b>face avant</b> est dans le plan de la feuille : on la dessine ' +
          'en <b>vraie grandeur</b>.', function (p) {
          vu.av = p; vu.fu = 0; vu.ar = 0; vu.plein = 0; vu.cache = 0; vu.regle = 1;
        }),
        S_(1100, 'De chaque sommet part une <b>fuyante</b> : même direction, même ' +
          'longueur — la profondeur, <b>raccourcie</b>.', function (p) {
          vu.av = 1; vu.fu = p; vu.ar = 0; vu.plein = 0; vu.cache = 0; vu.regle = 2;
        }),
        S_(900, 'On ferme le solide : la face arrière est le <b>même ' + quoi +
          '</b>, simplement décalé.', function (p) {
          vu.av = 1; vu.fu = 1; vu.ar = p; vu.plein = 0; vu.cache = 0; vu.regle = 2;
        }),
        S_(1000, 'Mais le solide est <b>plein</b> ! Les faces de devant en cachent une ' +
          'partie — regarde les arêtes du fond disparaître.', function (p) {
          vu.av = 1; vu.fu = 1; vu.ar = 1; vu.plein = p; vu.cache = 0; vu.regle = 3;
        }),
        S_(900, 'On doit quand même les dessiner : ce qu\'on ne voit pas se trace en ' +
          '<b>pointillés</b>.', function (p) {
          vu.av = 1; vu.fu = 1; vu.ar = 1; vu.plein = 1 - p; vu.cache = 1; vu.regle = 3;
        }),
        S_(800, 'Trait plein = visible, pointillés = caché. <b>Change l\'angle, la ' +
          'réduction ou le sens des fuyantes</b> : c\'est le même solide, et pourtant ' +
          'ce ne sont plus les mêmes arêtes qui sont cachées.', function () {
          toutMontrer();
        })
      ];
    }

    function stepsCylindre() {
      return [
        S_(900, 'La base du bas est un <b>cercle</b> — mais vu de biais, il se dessine ' +
          'comme une <b>ellipse</b>.', function (p) {
          vu.av = p; vu.fu = 0; vu.ar = 0; vu.plein = 0; vu.cache = 0; vu.regle = 1;
        }),
        S_(900, 'Deux traits <b>verticaux</b> donnent la <b>hauteur</b> : elle, elle ' +
          'est en vraie grandeur.', function (p) {
          vu.av = 1; vu.fu = p; vu.ar = 0; vu.plein = 0; vu.cache = 0; vu.regle = 1;
        }),
        S_(900, 'La base du haut est la <b>même ellipse</b>, montée de la hauteur du ' +
          'cylindre.', function (p) {
          vu.av = 1; vu.fu = 1; vu.ar = p; vu.plein = 0; vu.cache = 0; vu.regle = 2;
        }),
        S_(1000, 'Le cylindre est <b>plein</b> : l\'arrière du cercle du bas passe ' +
          '<b>derrière lui</b>.', function (p) {
          vu.av = 1; vu.fu = 1; vu.ar = 1; vu.plein = p; vu.cache = 0; vu.regle = 3;
        }),
        S_(900, 'On le trace donc en <b>pointillés</b>. Le cercle du haut, lui, est ' +
          'entièrement visible : on le voit de dessus.', function (p) {
          vu.av = 1; vu.fu = 1; vu.ar = 1; vu.plein = 1 - p; vu.cache = 1; vu.regle = 3;
        }),
        S_(800, 'Trait plein = visible, pointillés = caché. <b>Change le point de vue</b> : ' +
          'l\'ellipse s\'aplatit ou s\'ouvre, mais c\'est toujours le même cylindre.',
          function () { toutMontrer(); })
      ];
    }

    /* ---- le volume : la même formule, quel que soit le solide ------------ */
    function stepsVolume() {
      var s = S(), i = infoVolume(s);
      return [
        S_(800, 'Pour un <b>prisme droit</b> comme pour un <b>cylindre</b>, le volume est ' +
          'toujours le même calcul : <b>aire de la base × hauteur</b>.', function () {
          toutMontrer(); vu.bas = 0; vu.hau = 0; vu.res = 0;
        }),
        S_(1000, 'La <b>base</b> : ' + i.baseNom + '. Son aire se calcule dans le plan, ' +
          'comme d\'habitude.', function (p) {
          toutMontrer(); vu.bas = p; vu.hau = 0; vu.res = 0;
        }),
        S_(1000, 'La <b>hauteur</b> : la distance entre les deux bases. ' +
          'Attention — sur le dessin elle est <b>raccourcie</b> par la perspective, ' +
          'mais on calcule avec la <b>vraie</b> longueur.', function (p) {
          toutMontrer(); vu.bas = 1; vu.hau = p; vu.res = 0;
        }),
        S_(800, 'On multiplie : le volume est en <b>cm³</b>, puisqu\'on multiplie ' +
          'trois longueurs.', function (p) {
          toutMontrer(); vu.bas = 1; vu.hau = 1; vu.res = p;
        })
      ];
    }

    /* ==================================================================== */
    /* Armement                                                              */
    /* ==================================================================== */
    function arm() {
      majBoutons();
      function reset() {
        if (mode === 'volume') {
          // Le solide est déjà dessiné : c'est le calcul qui se construit.
          toutMontrer();
        } else {
          vu.av = 0; vu.fu = 0; vu.ar = 0; vu.plein = 0; vu.cache = 0; vu.regle = 0;
        }
        vu.bas = 0; vu.hau = 0; vu.res = 0;
        cap(mode === 'volume'
          ? 'Le solide est dessiné : quel volume occupe-t-il ?'
          : 'Un solide, une feuille : comment le dessiner sans le trahir ?');
        dernierPan = null;
        board.update();
      }
      reset();
      anim.runSteps(
        mode === 'volume' ? stepsVolume()
          : S().type === 'prisme' ? stepsPrisme() : stepsCylindre(),
        reset);
    }

    // Un curseur bouge : la figure suit toute seule (tout est fonction du point
    // de vue), il ne reste qu'à réécrire le panneau.
    function majVue() { board.update(); }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    var refs = null;
    function majBoutons() {
      if (!refs) return;
      SOLIDES.forEach(function (s) {
        refs['s' + s.id].classList.toggle('active', s === S());
      });
      refs.dessin.classList.toggle('active', mode === 'dessin');
      refs.volume.classList.toggle('active', mode === 'volume');
      refs.sens.textContent = sens > 0 ? '⇄ Fuyantes à gauche' : '⇄ Fuyantes à droite';
    }

    var specs = SOLIDES.map(function (s, i) {
      return { type: 'button', id: 's' + s.id, label: s.nom,
               onClick: function () { iSol = i; arm(); } };
    });
    specs.push({ type: 'button', id: 'dessin', label: 'Le dessin',
      onClick: function () { mode = 'dessin'; arm(); } });
    specs.push({ type: 'button', id: 'volume', label: 'Le volume',
      onClick: function () { mode = 'volume'; arm(); } });
    specs.push({ type: 'button', id: 'play', label: '▶ Animer', onClick: arm });
    specs.push({ type: 'button', id: 'sens', label: '⇄ Fuyantes à gauche',
      onClick: function () { sens = -sens; majBoutons(); majVue(); } });
    specs.push({ type: 'slider', id: 'angle', label: 'angle des fuyantes',
      min: 20, max: 70, step: 5, value: 45,
      onInput: function (v) { angle = v; majVue(); } });
    specs.push({ type: 'slider', id: 'k', label: 'réduction',
      min: 0.3, max: 0.8, step: 0.1, value: 0.5,
      onInput: function (v) { kRed = v; majVue(); } });

    refs = mv.addControls(specs);
    mv.extras.appendChild(root);

    arm();
  }
});
