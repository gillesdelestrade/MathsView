/*
 * cercle-demi — le triangle inscrit dans un demi-cercle (2nde, leçon
 * « Triangle inscrit dans un demi-cercle »).
 *
 * Cinq familles, qui suivent la leçon dans l'ordre :
 *   — RECONNAÎTRE (palier 1) : la figure montre un cercle de centre O, deux
 *     points A et B et un point M. Le triangle AMB est-il rectangle en M ?
 *     Oui quand [AB] est un diamètre ET que M est sur le cercle ; non quand
 *     [AB] n'est qu'une corde (elle évite O, on le voit), ou quand M est
 *     franchement dedans ou dehors. L'énoncé ne dit jamais ce qui fait la
 *     réponse : c'est la figure qui la porte ;
 *   — UN ANGLE (palier 2) : [AB] diamètre, l'angle en A est écrit sur la
 *     figure, on cherche celui en B. Le triangle est rectangle en M (sans
 *     équerre dessinée : c'est à l'élève de le savoir), donc 90 − a ;
 *   — UNE LONGUEUR (palier 2-3) : AM et BM sont donnés, on cherche AB ou le
 *     rayon — triangle rectangle, puis Pythagore. Les longueurs viennent de
 *     triplets pythagoriciens : la réponse tombe juste ;
 *   — LE CERCLE CIRCONSCRIT (palier 3-4) : la réciproque. ABC rectangle en C,
 *     le centre du cercle circonscrit est le milieu I de l'hypoténuse, et
 *     IC = AB/2 — au palier 4, l'hypoténuse se calcule d'abord ;
 *   — OÙ EST M ? (palier 4) : AB, AM et BM donnés, M est-il sur le cercle de
 *     diamètre [AB], dedans ou dehors ? Sur le cercle ⇔ AM² + BM² = AB²
 *     (rectangle en M) ; AM² + BM² < AB² ⇔ angle obtus ⇔ à l'intérieur.
 *
 * La figure est un SVG maison : un cercle, des points nommés, des segments,
 * des arcs d'angle. Chaque point porte son nom en `data-nom`, le cercle sa
 * classe « cercle » : le contrôle relit ces positions et décide lui-même si
 * [AB] passe par O et si M est sur le cercle.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var INK = '#334155', BLEU = '#2563eb', ORANGE = '#b45309', ROUGE = '#dc2626';
  var TRIPLETS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15],
                  [7, 24, 25], [12, 16, 20], [10, 24, 26], [15, 20, 25], [20, 21, 29]];
  var DEG = Math.PI / 180;

  /* ===================================================================== */
  /* Un peu de géométrie                                                   */
  /* ===================================================================== */
  function pt(r, deg) { return [r * Math.cos(deg * DEG), r * Math.sin(deg * DEG)]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function len(a) { return Math.hypot(a[0], a[1]); }
  function unit(a) { var n = len(a); return n < 1e-9 ? [1, 0] : [a[0] / n, a[1] / n]; }
  // L'angle PVQ, en degrés.
  function angle(V, P, Q) {
    var u = sub(P, V), w = sub(Q, V), d = len(u) * len(w);
    if (d < 1e-9) return 0;
    return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / d))) / DEG;
  }

  /* ===================================================================== */
  /* Le dessin                                                             */
  /* ===================================================================== */
  var W = 340, H = 300, K = 108;
  function r1(v) { return Math.round(v * 10) / 10; }
  function X(p) { return r1(W / 2 + p[0] * K); }
  function Y(p) { return r1(H / 2 - p[1] * K); }
  function texte(x, y, t, col, taille) {
    return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + (taille || 16) +
           '" font-weight="700" font-family="system-ui, sans-serif" fill="' + col +
           '" stroke="#fff" stroke-width="3.5" paint-order="stroke" text-anchor="middle">' +
           t + '</text>';
  }
  /*
   * o = {
   *   points   : [{ p, nom, couleur, dir }]   dir : direction du nom (unitaire)
   *   segments : [{ de, a, couleur, ep }]
   *   marques  : [{ V, P, Q, txt, couleur }]  un arc en V, de [VP) vers [VQ)
   * }
   * Le cercle est toujours celui de centre O (l'origine) et de rayon 1.
   */
  function dessin(o) {
    var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="max-width:' + W + 'px;width:100%;height:auto;display:block;margin:0.7rem auto" ' +
      'role="img" aria-label="Un cercle de centre O et un triangle AMB.">'];
    s.push('<circle class="cercle" cx="' + X([0, 0]) + '" cy="' + Y([0, 0]) + '" r="' + K +
           '" fill="#2563eb" fill-opacity="0.04" stroke="' + INK + '" stroke-width="2"/>');
    (o.segments || []).forEach(function (t) {
      s.push('<line x1="' + X(t.de) + '" y1="' + Y(t.de) + '" x2="' + X(t.a) + '" y2="' + Y(t.a) +
             '" stroke="' + (t.couleur || BLEU) + '" stroke-width="' + (t.ep || 2.5) +
             '" stroke-linecap="round"/>');
    });
    (o.marques || []).forEach(function (m) {
      var u = unit(sub(m.P, m.V)), w = unit(sub(m.Q, m.V));
      var a1 = Math.atan2(u[1], u[0]), a2 = Math.atan2(w[1], w[0]), d = a2 - a1;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      var r = 0.3, pts = [];
      for (var k = 0; k <= 12; k++) {
        var a = a1 + d * k / 12;
        pts.push(X([m.V[0] + r * Math.cos(a), m.V[1] + r * Math.sin(a)]) + ',' +
                 Y([m.V[0] + r * Math.cos(a), m.V[1] + r * Math.sin(a)]));
      }
      var coul = m.couleur || ROUGE;
      s.push('<polyline class="arc" points="' + pts.join(' ') + '" fill="none" stroke="' + coul +
             '" stroke-width="2.2" stroke-linejoin="round"/>');
      if (m.txt) {
        var b = unit([u[0] + w[0], u[1] + w[1]]);
        var e = [m.V[0] + 1.75 * r * b[0], m.V[1] + 1.75 * r * b[1]];
        s.push(texte(X(e), Y(e) + 6, m.txt, coul, 15));
      }
    });
    (o.points || []).forEach(function (q) {
      var col = q.couleur || INK;
      s.push('<circle class="pt" data-nom="' + q.nom + '" cx="' + X(q.p) + '" cy="' + Y(q.p) +
             '" r="4.5" fill="' + col + '"/>');
      var d = q.dir || (len(q.p) > 0.2 ? unit(q.p) : [0, -1]);
      s.push(texte(X(q.p) + 16 * d[0], Y(q.p) - 16 * d[1] + 6, q.nom, col, 17));
    });
    s.push('</svg>');
    return s.join('');
  }

  // La figure standard : le cercle, O, A, B, M et le triangle.
  function figureTriangle(A, B, M, marques) {
    return dessin({
      segments: [{ de: A, a: B, couleur: ORANGE, ep: 3 }, { de: A, a: M }, { de: B, a: M }],
      marques: marques || [],
      points: [{ p: [0, 0], nom: 'O', dir: [0, -1] }, { p: A, nom: 'A' }, { p: B, nom: 'B' },
               { p: M, nom: 'M', couleur: BLEU }]
    });
  }
  // Une direction « lisible » pour M : pas trop près de A ni de B.
  function ecartM(rnd) { return rnd.entier(35, 145) * (rnd.booleen(0.5) ? 1 : -1); }

  /* ===================================================================== */
  /* 1. Reconnaître                                                        */
  /* ===================================================================== */
  function reconnaitre(rnd) {
    var theta = rnd.entier(0, 11) * 15 + rnd.entier(-5, 5);     // l'orientation du dessin
    var cas = rnd.choix(['diametre', 'diametre', 'corde', 'hors']);
    var A, B, M, enonce, correct, etapes;
    var surCercle = 'Sur la figure, \\(A\\), \\(B\\) et \\(M\\) sont trois points du cercle ' +
                    'de centre \\(O\\). Vrai ou faux : le triangle \\(AMB\\) est rectangle en \\(M\\).';
    if (cas === 'diametre') {
      A = pt(1, theta); B = pt(1, theta + 180); M = pt(1, theta + ecartM(rnd));
      enonce = rnd.booleen(0.5) ? surCercle
        : 'Sur la figure, \\([AB]\\) est un diamètre du cercle de centre \\(O\\) et \\(M\\) ' +
          'est un point du cercle. Vrai ou faux : le triangle \\(AMB\\) est rectangle en \\(M\\).';
      correct = 0;
      etapes = [
        'Le segment \\([AB]\\) passe par le centre \\(O\\) : c\'est un <b>diamètre</b> du cercle.',
        '\\(M\\) est un point du cercle, distinct de \\(A\\) et de \\(B\\).',
        'Un triangle inscrit dans un cercle dont un côté est un diamètre est rectangle : ' +
          '<b>\\(AMB\\) est rectangle en \\(M\\)</b>, l\'angle droit est en face du diamètre.'
      ];
    } else if (cas === 'corde') {
      var gamma = rnd.entier(80, 130);                           // l'angle au centre AOB
      A = pt(1, theta); B = pt(1, theta + gamma);
      M = pt(1, theta + gamma + rnd.entier(40, 360 - gamma - 40)); // sur le grand arc
      enonce = surCercle;
      correct = 1;
      etapes = [
        'Le segment \\([AB]\\) ne passe <b>pas</b> par le centre \\(O\\) : ce n\'est pas un ' +
          'diamètre, seulement une corde.',
        'Le théorème ne s\'applique donc pas. L\'angle \\(\\widehat{AMB}\\) mesure ici environ ' +
          Math.round(angle(M, A, B)) + '°.',
        '<b>Le triangle \\(AMB\\) n\'est pas rectangle en \\(M\\).</b> Il le serait seulement ' +
          'si \\([AB]\\) était un diamètre.'
      ];
    } else {
      var dedans = rnd.booleen(0.5);
      A = pt(1, theta); B = pt(1, theta + 180);
      M = pt(dedans ? rnd.entier(50, 68) / 100 : rnd.entier(130, 150) / 100, theta + ecartM(rnd));
      enonce = 'Sur la figure, \\([AB]\\) est un diamètre du cercle de centre \\(O\\). ' +
               'Vrai ou faux : le triangle \\(AMB\\) est rectangle en \\(M\\).';
      correct = 1;
      var a = Math.round(angle(M, A, B));
      etapes = [
        '\\([AB]\\) est bien un diamètre, mais \\(M\\) <b>n\'est pas sur le cercle</b> : il est ' +
          (dedans ? 'à l\'intérieur' : 'à l\'extérieur') + '.',
        'L\'angle \\(\\widehat{AMB}\\) ne vaut 90° que si \\(M\\) est sur le cercle. ' +
          (dedans ? 'À l\'intérieur, il est <b>obtus</b>' : 'À l\'extérieur, il est <b>aigu</b>') +
          ' : ici environ ' + a + '°.',
        '<b>Le triangle \\(AMB\\) n\'est pas rectangle en \\(M\\).</b>'
      ];
    }
    return {
      enonce: figureTriangle(A, B, M) + enonce,
      type: 'vraifaux', correct: correct,
      etapes: etapes,
      indices: ['Deux choses à vérifier : \\([AB]\\) passe-t-il par \\(O\\) ? \\(M\\) est-il sur le cercle ?',
                'Le triangle est rectangle en \\(M\\) exactement quand les deux réponses sont oui.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 2. Un angle                                                           */
  /* ===================================================================== */
  function unAngle(rnd) {
    var a = rnd.entier(15, 75);
    if (a === 45) a = rnd.booleen(0.5) ? 40 : 50;
    var theta = rnd.entier(0, 11) * 15 + rnd.entier(-5, 5);
    var sens = rnd.booleen(0.5) ? 1 : -1;
    // L'angle inscrit MAB vaut a, donc l'angle au centre MOB vaut 2a.
    var A = pt(1, theta + 180), B = pt(1, theta), M = pt(1, theta + sens * 2 * a);
    var enA = rnd.booleen(0.5);        // l'angle donné est en A (sinon en B)
    var donne = enA ? 'A' : 'B', cherche = enA ? 'B' : 'A';
    var V1 = enA ? A : B, V2 = enA ? B : A;
    var val = enA ? a : 90 - a;        // la mesure écrite
    var rep = 90 - val;
    return {
      enonce: figureTriangle(A, B, M, [{ V: V1, P: V2, Q: M, txt: val + '°' },
                                        { V: V2, P: V1, Q: M, txt: '?' }]) +
              '\\([AB]\\) est un diamètre du cercle de centre \\(O\\) et \\(M\\) est un point du cercle. ' +
              'L\'angle \\(\\widehat{M' + donne + (donne === 'A' ? 'B' : 'A') + '}\\) mesure ' + val + '°. ' +
              'Calcule l\'angle \\(\\widehat{M' + cherche + (cherche === 'A' ? 'B' : 'A') + '}\\).',
      type: 'nombre', reponse: rep, unite: '°',
      etapes: [
        '\\([AB]\\) est un diamètre et \\(M\\) est sur le cercle : le triangle \\(AMB\\) est ' +
          '<b>rectangle en \\(M\\)</b>, donc \\(\\widehat{AMB} = 90°\\).',
        'Dans un triangle, la somme des angles vaut 180° : \\(\\widehat{M' + cherche +
          (cherche === 'A' ? 'B' : 'A') + '} = 180 - 90 - ' + val + ' = \\mathbf{' + rep + '}°\\).',
        'Autrement dit, les deux angles aigus d\'un triangle rectangle sont <b>complémentaires</b> : ' +
          val + ' + ' + rep + ' = 90.'
      ],
      indices: ['Quelle est la nature du triangle \\(AMB\\) ? Pourquoi ?',
                'Rectangle en \\(M\\) : les deux autres angles font 90° à eux deux.'],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 3. Une longueur                                                       */
  /* ===================================================================== */
  function uneLongueur(rnd, palier) {
    var t = rnd.choix(TRIPLETS), k = palier >= 3 ? rnd.entier(1, 2) : 1;
    var a = t[0] * k, b = t[1] * k, c = t[2] * k;
    if (rnd.booleen(0.5)) { var tmp = a; a = b; b = tmp; }  // AM et BM dans un ordre ou l'autre
    var theta = rnd.entier(0, 11) * 15 + rnd.entier(-5, 5);
    // M est placé pour que AM/BM soit dans le bon rapport : l'angle MAB vaut atan(b/a).
    var alpha = Math.atan2(b, a) / DEG;
    var A = pt(1, theta + 180), B = pt(1, theta), M = pt(1, theta + (rnd.booleen(0.5) ? 2 : -2) * alpha);
    var fig = figureTriangle(A, B, M);
    var debut = '\\([AB]\\) est un diamètre du cercle de centre \\(O\\) et \\(M\\) est un point du cercle. ';
    var rect = '\\([AB]\\) est un diamètre et \\(M\\) est sur le cercle : le triangle \\(AMB\\) est ' +
               '<b>rectangle en \\(M\\)</b>, et \\([AB]\\) est son hypoténuse.';
    var forme = palier >= 3 ? rnd.choix(['rayon', 'cote', 'rayon-cote']) : rnd.choix(['diametre', 'cote']);
    if (forme === 'diametre' || forme === 'rayon') {
      var rayon = forme === 'rayon';
      return {
        enonce: fig + debut + 'On donne \\(AM = ' + a + '\\) cm et \\(BM = ' + b + '\\) cm. ' +
                'Calcule ' + (rayon ? 'le rayon du cercle' : '\\(AB\\)') + '.',
        type: 'nombre', reponse: rayon ? c / 2 : c, unite: 'cm',
        etapes: [rect,
          'D\'après le théorème de Pythagore : \\(AB^2 = AM^2 + BM^2 = ' + a + '^2 + ' + b + '^2 = ' +
            (a * a) + ' + ' + (b * b) + ' = ' + (c * c) + '\\).',
          '\\(AB = \\sqrt{' + (c * c) + '} = ' + c + '\\) cm.'].concat(rayon
            ? ['\\([AB]\\) est un diamètre, donc le rayon vaut \\(\\dfrac{AB}{2} = \\dfrac{' + c +
               '}{2} = \\mathbf{' + O.tex(c / 2) + '}\\) cm.']
            : ['Donc \\(AB = \\mathbf{' + c + '}\\) cm.']),
        indices: ['Quelle est la nature du triangle \\(AMB\\) ?',
                  'Rectangle en \\(M\\) : Pythagore donne l\'hypoténuse \\(AB\\).'],
        duree: 90
      };
    }
    var viaRayon = forme === 'rayon-cote';
    return {
      enonce: fig + debut + 'On donne ' +
              (viaRayon ? 'un rayon de \\(' + O.tex(c / 2) + '\\) cm' : '\\(AB = ' + c + '\\) cm') +
              ' et \\(AM = ' + a + '\\) cm. Calcule \\(BM\\).',
      type: 'nombre', reponse: b, unite: 'cm',
      etapes: [rect].concat(viaRayon
          ? ['\\([AB]\\) est un diamètre : \\(AB = 2 \\times ' + O.tex(c / 2) + ' = ' + c + '\\) cm.'] : [])
        .concat([
          'Pythagore, avec \\(AB\\) pour hypoténuse : \\(AB^2 = AM^2 + BM^2\\), donc ' +
            '\\(BM^2 = AB^2 - AM^2 = ' + c + '^2 - ' + a + '^2 = ' + (c * c) + ' - ' + (a * a) +
            ' = ' + (b * b) + '\\).',
          '\\(BM = \\sqrt{' + (b * b) + '} = \\mathbf{' + b + '}\\) cm.']),
      indices: ['Le triangle \\(AMB\\) est rectangle en \\(M\\) : pourquoi ?',
                'L\'hypoténuse est \\([AB]\\) : on soustrait, \\(BM^2 = AB^2 - AM^2\\).'],
      duree: 95
    };
  }

  /* ===================================================================== */
  /* 4. Le cercle circonscrit (la réciproque)                              */
  /* ===================================================================== */
  function circonscrit(rnd, palier) {
    var forme = palier >= 4 ? rnd.choix(['pythagore', 'pythagore', 'direct', 'qcm'])
                            : rnd.choix(['direct', 'direct', 'qcm']);
    if (forme === 'qcm') {
      var choix = rnd.melange([
        'le milieu de l\'hypoténuse',
        'le sommet de l\'angle droit',
        'le milieu d\'un côté de l\'angle droit',
        'le point de concours des hauteurs'
      ]);
      return {
        enonce: 'Le triangle \\(ABC\\) est rectangle en \\(C\\). Où se trouve le centre de son ' +
                'cercle circonscrit ?',
        type: 'qcm', choix: choix, correct: choix.indexOf('le milieu de l\'hypoténuse'),
        etapes: [
          'Si \\(ABC\\) est rectangle en \\(C\\), alors \\(C\\) est sur le cercle de diamètre ' +
            '\\([AB]\\) : c\'est la <b>réciproque</b> du théorème du demi-cercle.',
          'Ce cercle passe par \\(A\\), \\(B\\) et \\(C\\) : c\'est le cercle circonscrit, et son ' +
            'centre est le milieu de son diamètre \\([AB]\\).',
          '<b>Le centre du cercle circonscrit est le milieu de l\'hypoténuse</b>, et son rayon vaut ' +
            '\\(\\dfrac{AB}{2}\\).'
        ],
        indices: ['Sur quel cercle se trouve \\(C\\) quand l\'angle en \\(C\\) est droit ?'],
        duree: 40
      };
    }
    var t = rnd.choix(TRIPLETS), k = rnd.entier(1, 2);
    var a = t[0] * k, b = t[1] * k, c = t[2] * k;
    var demandeIC = rnd.booleen(0.5);
    var question = demandeIC
      ? '\\(I\\) est le milieu de \\([AB]\\). Calcule \\(IC\\).'
      : 'Calcule le rayon de son cercle circonscrit.';
    var concl = demandeIC
      ? '\\(I\\) est le centre de ce cercle et \\(C\\) est dessus : \\(IC\\) est un rayon, ' +
        '\\(IC = \\dfrac{AB}{2} = \\dfrac{' + c + '}{2} = \\mathbf{' + O.tex(c / 2) + '}\\) cm.'
      : 'Son rayon est la moitié du diamètre : \\(\\dfrac{AB}{2} = \\dfrac{' + c + '}{2} = \\mathbf{' +
        O.tex(c / 2) + '}\\) cm.';
    var reciproque = '\\(ABC\\) est rectangle en \\(C\\) : d\'après la réciproque du théorème, ' +
      '\\(C\\) est sur le cercle de diamètre \\([AB]\\). Ce cercle passe par \\(A\\), \\(B\\) et \\(C\\) : ' +
      'c\'est le cercle circonscrit, de centre le milieu de \\([AB]\\).';
    if (forme === 'pythagore') {
      return {
        enonce: 'Le triangle \\(ABC\\) est rectangle en \\(C\\), avec \\(AC = ' + a + '\\) cm et ' +
                '\\(BC = ' + b + '\\) cm. ' + question,
        type: 'nombre', reponse: c / 2, unite: 'cm',
        etapes: [reciproque,
          'Il faut d\'abord l\'hypoténuse. Pythagore : \\(AB^2 = AC^2 + BC^2 = ' + a + '^2 + ' + b +
            '^2 = ' + (a * a) + ' + ' + (b * b) + ' = ' + (c * c) + '\\), donc \\(AB = ' + c + '\\) cm.',
          concl],
        indices: ['Où est le centre du cercle circonscrit d\'un triangle rectangle ?',
                  'C\'est le milieu de l\'hypoténuse, qu\'il faut d\'abord calculer.'],
        duree: 100
      };
    }
    return {
      enonce: 'Le triangle \\(ABC\\) est rectangle en \\(C\\), avec \\(AB = ' + c + '\\) cm. ' + question,
      type: 'nombre', reponse: c / 2, unite: 'cm',
      etapes: [reciproque, concl],
      indices: ['Où est le centre du cercle circonscrit d\'un triangle rectangle ?',
                'C\'est le milieu de l\'hypoténuse : le rayon est la moitié de \\(AB\\).'],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 5. Où est M ?                                                         */
  /* ===================================================================== */
  function position(rnd) {
    var t = rnd.choix(TRIPLETS), k = rnd.entier(1, 2);
    var a = t[0] * k, b = t[1] * k, c = t[2] * k;
    if (rnd.booleen(0.5)) { var tmp = a; a = b; b = tmp; }
    var ou = rnd.choix(['sur', 'dedans', 'dehors']);
    // Dedans : AM² + BM² < AB² (angle obtus), avec AM + BM > AB pour que le triangle existe.
    if (ou === 'dedans') c = Math.min(c + rnd.entier(1, 2), a + b - 1);
    // Dehors : AM² + BM² > AB², avec AB > |AM − BM|.
    if (ou === 'dehors') c = Math.max(c - rnd.entier(1, 2), Math.abs(a - b) + 1);
    var somme = a * a + b * b, carre = c * c;
    var LIB = { sur: 'sur le cercle', dedans: 'à l\'intérieur du cercle', dehors: 'à l\'extérieur du cercle' };
    var choix = rnd.melange(['sur le cercle', 'à l\'intérieur du cercle', 'à l\'extérieur du cercle']);
    return {
      enonce: '\\(A\\) et \\(B\\) sont deux points tels que \\(AB = ' + c + '\\) cm, et \\(M\\) est un ' +
              'point tel que \\(AM = ' + a + '\\) cm et \\(BM = ' + b + '\\) cm. Où se trouve \\(M\\) ' +
              'par rapport au cercle de diamètre \\([AB]\\) ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(LIB[ou]),
      etapes: [
        '\\(M\\) est sur le cercle de diamètre \\([AB]\\) exactement quand le triangle \\(AMB\\) est ' +
          'rectangle en \\(M\\), c\'est-à-dire quand \\(AM^2 + BM^2 = AB^2\\).',
        '\\(AM^2 + BM^2 = ' + a + '^2 + ' + b + '^2 = ' + (a * a) + ' + ' + (b * b) + ' = ' + somme + '\\) ' +
          'et \\(AB^2 = ' + c + '^2 = ' + carre + '\\).'
      ].concat(ou === 'sur'
        ? ['Les deux nombres sont <b>égaux</b> : \\(AMB\\) est rectangle en \\(M\\), donc <b>\\(M\\) est ' +
           'sur le cercle</b> de diamètre \\([AB]\\).']
        : ['\\(' + somme + (ou === 'dedans' ? ' < ' : ' > ') + carre + '\\) : le triangle n\'est pas rectangle ' +
           'en \\(M\\), donc \\(M\\) n\'est pas sur le cercle.',
           ou === 'dedans'
             ? '\\(AB^2\\) est <b>plus grand</b> que \\(AM^2 + BM^2\\) : l\'angle \\(\\widehat{AMB}\\) est ' +
               '<b>obtus</b>, et un angle obtus se voit depuis l\'<b>intérieur</b> du cercle.'
             : '\\(AB^2\\) est <b>plus petit</b> que \\(AM^2 + BM^2\\) : l\'angle \\(\\widehat{AMB}\\) est ' +
               '<b>aigu</b>, et un angle aigu se voit depuis l\'<b>extérieur</b> du cercle.']),
      indices: ['\\(M\\) sur le cercle de diamètre \\([AB]\\) ⟺ \\(AMB\\) rectangle en \\(M\\).',
                'Compare \\(AM^2 + BM^2\\) et \\(AB^2\\) : égaux, plus petit, plus grand ?'],
      duree: 90
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'cercle-demi', competence: 'cercle-demi', level: '2nde',
    titre: 'Triangle inscrit dans un demi-cercle', paliers: 4,

    genere: function (rnd, palier) {
      var r = rnd.entier(1, 100);
      if (palier <= 1) return reconnaitre(rnd);
      if (palier === 2) {
        if (r <= 45) return unAngle(rnd);
        if (r <= 80) return uneLongueur(rnd, palier);
        return reconnaitre(rnd);
      }
      if (palier === 3) {
        if (r <= 30) return uneLongueur(rnd, palier);
        if (r <= 65) return circonscrit(rnd, palier);
        if (r <= 85) return unAngle(rnd);
        return reconnaitre(rnd);
      }
      if (r <= 40) return position(rnd);
      if (r <= 65) return circonscrit(rnd, palier);
      if (r <= 85) return uneLongueur(rnd, palier);
      return unAngle(rnd);
    }
  });
})();
