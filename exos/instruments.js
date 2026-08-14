/*
 * instruments — le compas, la règle et le rapporteur, posés sur une figure.
 *
 * ---------------------------------------------------------------------------
 * Pourquoi une ardoise plutôt qu'une réponse à cocher
 * ---------------------------------------------------------------------------
 * Une médiatrice, une bissectrice, un triangle dont on connaît trois longueurs :
 * rien de tout cela ne se calcule, tout se trace. Un exercice qui se contenterait
 * de demander le résultat passerait à côté de la seule chose qui s'apprend ici —
 * le geste. Ce module fournit donc les instruments, et la réponse reste une
 * question à part : on construit pour CHERCHER.
 *
 *   COMPAS      on appuie sur le centre, on tire jusqu'au rayon voulu, on
 *               relâche. Le rayon s'affiche pendant le tracé, arrondi au
 *               millimètre — c'est ce qui permet de refaire deux arcs de même
 *               écartement, geste sans lequel aucune construction ne marche.
 *   RÈGLE       on appuie sur un point, on tire jusqu'à un autre, la droite est
 *               tracée. La longueur s'affiche, elle aussi au millimètre.
 *   RAPPORTEUR  on appuie sur le sommet, on part le long d'un côté existant —
 *               c'est le zéro du rapporteur — puis on tourne jusqu'à l'angle
 *               voulu, affiché en degrés. En relâchant, la demi-droite est
 *               tracée à l'angle entier le plus proche.
 *
 * ---------------------------------------------------------------------------
 * Ce qui rend la construction réellement faisable
 * ---------------------------------------------------------------------------
 * Sur le papier, le crayon se pose « là où les arcs se croisent ». À l'écran, il
 * faut le rendre possible : chaque tracé AIMANTE les points remarquables — les
 * points nommés, et surtout les INTERSECTIONS, arcs entre eux, arcs avec les
 * côtés de la figure ET avec les traits déjà faits par l'élève. Elles sont
 * calculées et marquées d'un petit point dès qu'elles apparaissent. Sans cela,
 * tracer la droite qui passe par deux croisements d'arcs serait une affaire de
 * pixels, et l'exercice porterait sur l'adresse à la souris.
 *
 * ---------------------------------------------------------------------------
 * L'arrondi est un choix, pas une approximation subie
 * ---------------------------------------------------------------------------
 * Le rayon est arrondi au millimètre et l'angle au degré. C'est ce que fait la
 * main sur du papier : on lit une graduation. Sans cet arrondi, deux arcs
 * « de même écartement » ne le seraient jamais tout à fait, et la construction
 * ne tomberait jamais juste.
 *
 *   MathsInstruments.figure(donnees, options) → function (board, ctx)
 *
 *   donnees = {
 *     points : [{ nom, p, role, offset }]   les points nommés, aimantés
 *     traits : [[p, q], …]                  les segments déjà tracés
 *   }
 *   options = {
 *     outils : ['compas', 'regle', 'rapporteur']   ceux qu'on met à disposition
 *     aide   : la phrase affichée à côté des boutons
 *   }
 *
 * À charger APRÈS exos/outils.js, et AVANT les générateurs qui s'en servent.
 */
(function (global) {
  'use strict';

  var ENCRE = '#334155', BLEU = '#2563eb', ORANGE = '#ea580c';
  var TRACE = '#7c3aed', AIMANT = '#94a3b8';

  /* ===================================================================== */
  /* Géométrie                                                             */
  /* ===================================================================== */
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
  function len(a) { return Math.sqrt(dot(a, a)); }
  function unit(a) { var n = len(a); return n < 1e-9 ? [1, 0] : [a[0] / n, a[1] / n]; }
  function mil(a, b) { return mul(add(a, b), 0.5); }
  function dist(a, b) { return len(sub(a, b)); }
  function pol(c, a, r) { return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]; }

  // Les deux points d'intersection de deux cercles.
  function interCC(A, B) {
    var d = dist(A.c, B.c);
    if (d < 1e-9 || d > A.r + B.r || d < Math.abs(A.r - B.r)) return [];
    var a = (A.r * A.r - B.r * B.r + d * d) / (2 * d);
    var h2 = A.r * A.r - a * a;
    if (h2 < 0) return [];
    var h = Math.sqrt(h2);
    var u = unit(sub(B.c, A.c)), n = [-u[1], u[0]];
    var m = add(A.c, mul(u, a));
    return [add(m, mul(n, h)), add(m, mul(n, -h))];
  }
  /* Les intersections d'un cercle avec un trait. `t.borne` dit jusqu'où le trait
     existe : un segment s'arrête à ses extrémités, une droite ou une demi-droite
     continuent — et une intersection sur le prolongement d'un segment n'existe
     pas, on ne doit pas pouvoir s'y accrocher. */
  function interCT(C, t) {
    var u = sub(t.b, t.a), f = sub(t.a, C.c);
    var a = dot(u, u), b = 2 * dot(f, u), c = dot(f, f) - C.r * C.r;
    var disc = b * b - 4 * a * c;
    if (disc < 0 || a < 1e-12) return [];
    var rd = Math.sqrt(disc), out = [];
    [(-b - rd) / (2 * a), (-b + rd) / (2 * a)].forEach(function (k) {
      var kmin = t.type === 'droite' ? -Infinity : -0.02;
      var kmax = t.type === 'segment' ? 1.02 : Infinity;
      if (k >= kmin && k <= kmax) out.push(add(t.a, mul(u, k)));
    });
    return out;
  }
  // L'intersection de deux traits, si elle tombe sur les deux.
  function interTT(s, t) {
    var r = sub(s.b, s.a), u = sub(t.b, t.a);
    var den = r[0] * u[1] - r[1] * u[0];
    if (Math.abs(den) < 1e-12) return [];
    var w = sub(t.a, s.a);
    var k1 = (w[0] * u[1] - w[1] * u[0]) / den;
    var k2 = (w[0] * r[1] - w[1] * r[0]) / den;
    function dedans(k, t2) {
      return k >= (t2.type === 'droite' ? -Infinity : -0.02) &&
             k <= (t2.type === 'segment' ? 1.02 : Infinity);
    }
    if (!dedans(k1, s) || !dedans(k2, t)) return [];
    return [add(s.a, mul(r, k1))];
  }

  /* ===================================================================== */
  /* La figure                                                             */
  /* ===================================================================== */
  function figure(donnees, options) {
    options = options || {};
    var OUTILS = options.outils || ['compas', 'regle'];

    return function (board, ctx) {
      var O = global.ExosOutils;

      /* --- la figure de départ ------------------------------------- */
      (donnees.traits || []).forEach(function (t) {
        board.create('segment', [t[0], t[1]],
          { strokeColor: ENCRE, strokeWidth: 2.5, fixed: true, highlight: false });
      });
      (donnees.points || []).forEach(function (x) {
        board.create('point', x.p, {
          name: x.nom, size: 3.5, color: x.role === 'test' ? ORANGE : BLEU,
          fixed: true, showInfobox: false, highlight: false,
          label: { offset: x.offset || [8, 10], fontSize: 15, cssStyle: 'font-weight:700',
                   strokeColor: x.role === 'test' ? ORANGE : BLEU }
        });
      });

      /* --- ce qui aimante le crayon -------------------------------- */
      var cercles = [];                 // { c, r }
      var traits = (donnees.traits || []).map(function (t) {
        return { a: t[0], b: t[1], type: 'segment' };
      });
      var figes = traits.length;        // les traits de l'énoncé, jamais effacés
      var aimants = (donnees.points || []).map(function (x) { return x.p; });
      var socle = aimants.length;
      var marques = [];

      function dansCadre(p) {
        var bb = board.getBoundingBox();
        return p[0] >= bb[0] && p[0] <= bb[2] && p[1] <= bb[1] && p[1] >= bb[3];
      }
      function ajouteAimant(p) {
        if (!isFinite(p[0]) || !isFinite(p[1]) || !dansCadre(p)) return;
        for (var i = 0; i < aimants.length; i++) {
          if (dist(aimants[i], p) < 0.06) return;
        }
        aimants.push(p);
        marques.push(board.create('point', p, {
          name: '', size: 2, color: AIMANT, fixed: true, highlight: false,
          showInfobox: false
        }));
      }
      function nouveauCercle(C) {
        cercles.forEach(function (D) { interCC(C, D).forEach(ajouteAimant); });
        traits.forEach(function (t) { interCT(C, t).forEach(ajouteAimant); });
        cercles.push(C);
      }
      function nouveauTrait(t) {
        cercles.forEach(function (C) { interCT(C, t).forEach(ajouteAimant); });
        traits.forEach(function (s) { interTT(s, t).forEach(ajouteAimant); });
        traits.push(t);
      }
      function aimante(p) {
        var best = null, bd = 0.42;
        aimants.forEach(function (a) {
          var d = dist(a, p);
          if (d < bd) { bd = d; best = a; }
        });
        return best ? best.slice() : p;
      }
      /* Les demi-droites partant d'un point : ce sont les zéros possibles du
         rapporteur. Un segment en fournit une par extrémité ; une droite ou une
         demi-droite déjà tracée en fournit aussi. */
      function cotesEn(p) {
        var out = [];
        traits.forEach(function (t) {
          if (dist(t.a, p) < 0.08) out.push(unit(sub(t.b, t.a)));
          else if (dist(t.b, p) < 0.08) out.push(unit(sub(t.a, t.b)));
          else if (t.type !== 'segment') {
            // le point est-il SUR la droite ? alors elle offre deux directions
            var u = unit(sub(t.b, t.a));
            var w = sub(p, t.a);
            if (Math.abs(w[0] * u[1] - w[1] * u[0]) < 0.08) { out.push(u); out.push(mul(u, -1)); }
          }
        });
        return out;
      }

      /* --- les tracés de l'élève ------------------------------------ */
      var traces = [];
      var outil = OUTILS[0];
      var depart = null;
      var zero = null;                  // le côté qui sert de zéro au rapporteur

      var apCentre = board.create('point', [0, 0], { visible: false, fixed: true, name: '' });
      var apBord = board.create('point', [0, 0], { visible: false, fixed: true, name: '' });
      var apCercle = board.create('circle', [apCentre, apBord], {
        strokeColor: TRACE, strokeWidth: 1.5, dash: 2, fixed: true, highlight: false,
        visible: false
      });
      var apDroite = board.create('segment', [apCentre, apBord], {
        strokeColor: TRACE, strokeWidth: 1.5, dash: 2, fixed: true, highlight: false,
        visible: false
      });
      var apTexte = board.create('text', [0, 0, ''], {
        fontSize: 15, color: TRACE, cssStyle: 'font-weight:800', fixed: true,
        visible: false, anchorX: 'middle'
      });
      /* L'arc du rapporteur : il montre l'angle en train d'être mesuré, depuis le
         zéro jusqu'à la direction courante. */
      var arcEtat = { c: [0, 0], a0: 0, ouv: 0, r: 1 };
      var apArc = board.create('curve', [
        function (u) { return pol(arcEtat.c, arcEtat.a0 + arcEtat.ouv * u, arcEtat.r)[0]; },
        function (u) { return pol(arcEtat.c, arcEtat.a0 + arcEtat.ouv * u, arcEtat.r)[1]; },
        0, 1
      ], { numberPointsHigh: 40, numberPointsLow: 40, strokeColor: TRACE, strokeWidth: 2,
           highlight: false, visible: false });
      var apZero = board.create('segment', [apCentre, apBord], {
        strokeColor: TRACE, strokeWidth: 1.5, dash: 3, fixed: true, highlight: false,
        visible: false, strokeOpacity: 0.6
      });
      var apZeroBout = board.create('point', [0, 0], { visible: false, fixed: true, name: '' });
      apZero.point2 = apZeroBout;

      // Sur tablette, l'événement n'a pas de clientX — la position est dans
      // e.touches, que board.getUsrCoordsOfMouse ne sait pas lire. JXG.getPosition
      // gère la souris ET le doigt.
      function souris(e) {
        if (JXG.Coords && JXG.getPosition) {
          var coin = board.getCoordsTopLeftCorner(e), abs = JXG.getPosition(e);
          var k = new JXG.Coords(JXG.COORDS_BY_SCREEN,
            [abs[0] - coin[0], abs[1] - coin[1]], board);
          return [k.usrCoords[1], k.usrCoords[2]];
        }
        var c = board.getUsrCoordsOfMouse(e);
        return [c[0], c[1]];
      }
      function poser(p) { apCentre.setPosition(JXG.COORDS_BY_USER, p); }
      function tirer(p) { apBord.setPosition(JXG.COORDS_BY_USER, p); }

      /* L'angle mesuré : entre le zéro et la direction courante, dans [0 ; 180].
         On ne rend pas d'angle rentrant — un rapporteur n'en mesure pas. */
      function mesure(p) {
        var v = unit(sub(p, depart));
        var c = Math.max(-1, Math.min(1, dot(zero, v)));
        return Math.acos(c) * 180 / Math.PI;
      }
      function sensArc(p) {                     // + ou − : de quel côté on tourne
        var v = sub(p, depart);
        return (zero[0] * v[1] - zero[1] * v[0]) >= 0 ? 1 : -1;
      }

      board.on('down', function (e) {
        if (ctx.fige) return;
        depart = aimante(souris(e));
        zero = null;
        poser(depart); tirer(depart);
        apCercle.setAttribute({ visible: outil === 'compas' });
        apDroite.setAttribute({ visible: outil === 'regle' });
        apTexte.setAttribute({ visible: true });
        if (outil === 'rapporteur' && !cotesEn(depart).length) {
          apTexte.setText('pas de côté ici');
          apTexte.setPosition(JXG.COORDS_BY_USER, [depart[0], depart[1] + 0.45]);
          depart = null;
        }
        board.update();
      });

      board.on('move', function (e) {
        if (!depart) return;
        var brut = souris(e);
        var p = outil === 'compas' ? brut : aimante(brut);

        if (outil === 'rapporteur') {
          // Le zéro se choisit au PREMIER mouvement — le côté vers lequel on
          // part — puis ne bouge plus : c'est l'aiguille qu'on pose sur zéro.
          if (!zero) {
            var v = unit(sub(brut, depart));
            if (len(sub(brut, depart)) < 0.25) { board.update(); return; }
            var cs = cotesEn(depart), best = cs[0], bd = -2;
            cs.forEach(function (c) { var d = dot(c, v); if (d > bd) { bd = d; best = c; } });
            zero = best;
            apZeroBout.setPosition(JXG.COORDS_BY_USER, add(depart, mul(zero, 2)));
            apZero.setAttribute({ visible: true });
            apArc.setAttribute({ visible: true });
          }
          var a = mesure(brut), s = sensArc(brut);
          arcEtat.c = depart;
          arcEtat.a0 = Math.atan2(zero[1], zero[0]);
          arcEtat.ouv = s * a * Math.PI / 180;
          arcEtat.r = Math.min(1.6, Math.max(0.7, len(sub(brut, depart)) * 0.55));
          tirer(add(depart, mul(unit(sub(brut, depart)), Math.max(1.2, arcEtat.r * 1.6))));
          apDroite.setAttribute({ visible: true });
          apTexte.setText(Math.round(a) + '°');
          var mid = arcEtat.a0 + arcEtat.ouv / 2;
          apTexte.setPosition(JXG.COORDS_BY_USER, pol(depart, mid, arcEtat.r + 0.45));
          board.update();
          return;
        }

        tirer(p);
        var r = dist(depart, p);
        apTexte.setText(O.fr(Math.round(r * 10) / 10) + ' cm');
        apTexte.setPosition(JXG.COORDS_BY_USER, [mil(depart, p)[0], mil(depart, p)[1] + 0.35]);
        board.update();
      });

      board.on('up', function (e) {
        if (!depart) return;
        var brut = souris(e);
        var p = outil === 'compas' ? brut : aimante(brut);
        apCercle.setAttribute({ visible: false });
        apDroite.setAttribute({ visible: false });
        apTexte.setAttribute({ visible: false });
        apArc.setAttribute({ visible: false });
        apZero.setAttribute({ visible: false });

        if (outil === 'rapporteur') {
          if (zero) {
            // l'angle est arrondi au degré : c'est une graduation qu'on lit
            var a = Math.round(mesure(brut)) * sensArc(brut) * Math.PI / 180;
            var a0 = Math.atan2(zero[1], zero[0]);
            var bout = pol(depart, a0 + a, 30);
            traces.push(board.create('line', [depart.slice(), bout], {
              strokeColor: TRACE, strokeWidth: 1.6, fixed: true, highlight: false,
              straightFirst: false, straightLast: true
            }));
            nouveauTrait({ a: depart.slice(), b: bout, type: 'demi' });
          }
          depart = null; zero = null;
          board.update();
          return;
        }

        var r = Math.round(dist(depart, p) * 10) / 10;      // au millimètre
        if (outil === 'compas' && r >= 0.3) {
          traces.push(board.create('circle', [depart.slice(), r], {
            strokeColor: TRACE, strokeWidth: 1.6, fixed: true, highlight: false
          }));
          nouveauCercle({ c: depart.slice(), r: r });
        } else if (outil === 'regle' && r >= 0.3) {
          traces.push(board.create('line', [depart.slice(), p], {
            strokeColor: TRACE, strokeWidth: 1.6, fixed: true, highlight: false,
            straightFirst: true, straightLast: true
          }));
          nouveauTrait({ a: depart.slice(), b: p.slice(), type: 'droite' });
        }
        depart = null;
        board.update();
      });

      /* --- la barre d'outils, sous la figure ------------------------ */
      if (!ctx.zone) return;
      var LIBELLE = { compas: '◯ Compas', regle: '📏 Règle', rapporteur: '◔ Rapporteur' };
      var AIDE = {
        compas: 'le compas trace un cercle',
        regle: 'la règle une droite',
        rapporteur: 'le rapporteur mesure un angle depuis un côté existant'
      };
      var barre = document.createElement('div');
      barre.className = 'exo-outils';
      barre.innerHTML =
        OUTILS.map(function (o, i) {
          return '<button type="button" class="exo-outil' + (i ? '' : ' actif') +
                 '" data-o="' + o + '">' + LIBELLE[o] + '</button>';
        }).join('') +
        '<button type="button" class="exo-outil gomme">↺ Effacer mes tracés</button>' +
        '<span class="exo-outil-aide">' + (options.aide ||
          ('Appuie et tire : ' + OUTILS.map(function (o) { return AIDE[o]; }).join(', ') +
           '. Le crayon s\'aimante aux points et aux croisements.')) + '</span>';
      ctx.zone.appendChild(barre);

      var btns = barre.querySelectorAll('.exo-outil');
      Array.prototype.forEach.call(btns, function (b) {
        b.onclick = function () {
          if (b.classList.contains('gomme')) {
            traces.forEach(function (o) { try { board.removeObject(o); } catch (err) {} });
            marques.forEach(function (o) { try { board.removeObject(o); } catch (err) {} });
            traces = []; marques = []; cercles = [];
            traits = traits.slice(0, figes);      // on garde la figure de l'énoncé
            aimants = aimants.slice(0, socle);
            board.update();
            return;
          }
          outil = b.dataset.o;
          Array.prototype.forEach.call(btns, function (x) {
            x.classList.toggle('actif', x === b);
          });
        };
      });
    };
  }

  global.MathsInstruments = { figure: figure, interCC: interCC, interCT: interCT };

})(window);
