/*
 * et-ou — deux inéquations reliées par « et » ou par « ou » (leçon 2nde
 * « Inéquations reliées par « et » ou « ou » »).
 *
 * L'exercice type : « résoudre x > 3 et −4 < x < 5 », réponse sous forme
 * d'intervalle. La méthode de la leçon, en deux temps : chaque inéquation
 * devient un intervalle, puis le mot de liaison dit s'il faut l'intersection
 * (« et ») ou la réunion (« ou »). La correction suit exactement ces deux
 * temps, avec les nombres de l'énoncé.
 *
 * Les paliers suivent la progression :
 *   P1  « et » seulement, deux inéquations simples : x > a et x < b (un
 *       intervalle borné), ou deux du même côté (la plus exigeante gagne) ;
 *   P2  une double inéquation entre en jeu, toujours avec « et » — et
 *       parfois l'ensemble vide, quand les deux conditions sont incompatibles ;
 *   P3  « ou » apparaît : réunion d'un seul tenant, deux morceaux (on garde
 *       le ∪), ou ℝ tout entier ; le QCM arrive, avec les erreurs classiques
 *       en leurres ;
 *   P4  tout se mélange, avec des demi-entiers et des bornes partagées, là où
 *       c'est le mot de liaison qui décide du crochet.
 *
 * La réponse est comparée par structure (type 'intervalle', champ `morceaux`) :
 * « ]3;5[ », « ] 3 ; 5 [ » et « ]3,5[ » sont la même réponse, « R » vaut ℝ,
 * et une réunion s'écrit avec ∪, U ou u.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Écriture                                                            */
  /* ------------------------------------------------------------------ */
  function fr(v) {
    if (v === -Infinity) return '−∞';
    if (v === Infinity) return '+∞';
    return String(v).replace('.', ',').replace('-', '−');
  }
  function texNb(v) {
    if (v === -Infinity) return '-\\infty';
    if (v === Infinity) return '+\\infty';
    return String(v).replace('.', '{,}');
  }
  function crochets(m) {
    if (m.a === m.b) return '{' + fr(m.a) + '}';
    if (m.a === -Infinity && m.b === Infinity) return 'ℝ';
    return (m.oa ? ']' : '[') + fr(m.a) + ' ; ' + fr(m.b) + (m.ob ? '[' : ']');
  }
  function crochetsTex(m) {
    if (m.a === m.b) return '\\{' + texNb(m.a) + '\\}';
    if (m.a === -Infinity && m.b === Infinity) return '\\mathbb{R}';
    return (m.oa ? ']' : '[') + texNb(m.a) + '\\,;' + texNb(m.b) + (m.ob ? '[' : ']');
  }
  function ensemble(ms) { return ms.length ? ms.map(crochets).join(' ∪ ') : '∅'; }
  function ensembleTex(ms) { return ms.length ? ms.map(crochetsTex).join(' \\cup ') : '\\varnothing'; }
  function cle(ms) {
    return ms.map(function (m) { return [m.a, m.b, !!m.oa, !!m.ob].join(','); }).join('|');
  }
  // L'inéquation en LaTeX : « x > 3 », « x \leqslant 2 », « -4 < x < 5 ».
  function inegTex(c) {
    if (c.a === -Infinity) return 'x ' + (c.ob ? '<' : '\\leqslant') + ' ' + texNb(c.b);
    if (c.b === Infinity) return 'x ' + (c.oa ? '>' : '\\geqslant') + ' ' + texNb(c.a);
    return texNb(c.a) + ' ' + (c.oa ? '<' : '\\leqslant') + ' x ' + (c.ob ? '<' : '\\leqslant') + ' ' + texNb(c.b);
  }
  // La même, en texte, avec x ou un nombre à sa place.
  function inegTxt(c, xs) {
    xs = xs || 'x';
    if (c.a === -Infinity) return xs + (c.ob ? ' < ' : ' ⩽ ') + fr(c.b);
    if (c.b === Infinity) return xs + (c.oa ? ' > ' : ' ⩾ ') + fr(c.a);
    return fr(c.a) + (c.oa ? ' < ' : ' ⩽ ') + xs + (c.ob ? ' < ' : ' ⩽ ') + fr(c.b);
  }
  function enonceTex(I, J, lien) {
    return inegTex(I) + ' \\quad\\text{' + lien + '}\\quad ' + inegTex(J);
  }

  /* ------------------------------------------------------------------ */
  /* Le calcul                                                           */
  /* ------------------------------------------------------------------ */
  function dans(c, x) {
    return (c.oa ? x > c.a : x >= c.a) && (c.ob ? x < c.b : x <= c.b);
  }
  function gaucheMax(I, J) {
    if (I.a > J.a) return { x: I.a, o: I.oa };
    if (J.a > I.a) return { x: J.a, o: J.oa };
    return { x: I.a, o: I.oa || J.oa };
  }
  function droiteMin(I, J) {
    if (I.b < J.b) return { x: I.b, o: I.ob };
    if (J.b < I.b) return { x: J.b, o: J.ob };
    return { x: I.b, o: I.ob || J.ob };
  }
  function gaucheMin(I, J) {
    if (I.a < J.a) return { x: I.a, o: I.oa };
    if (J.a < I.a) return { x: J.a, o: J.oa };
    return { x: I.a, o: I.oa && J.oa };
  }
  function droiteMax(I, J) {
    if (I.b > J.b) return { x: I.b, o: I.ob };
    if (J.b > I.b) return { x: J.b, o: J.ob };
    return { x: I.b, o: I.ob && J.ob };
  }
  function inter(I, J) {
    var lo = gaucheMax(I, J), hi = droiteMin(I, J);
    if (lo.x > hi.x) return [];
    if (lo.x === hi.x && (lo.o || hi.o)) return [];
    return [{ a: lo.x, b: hi.x, oa: lo.o, ob: hi.o }];
  }
  function recolle(I, J) {
    var g = gaucheMax(I, J), d = droiteMin(I, J);
    if (g.x < d.x) return true;
    if (g.x > d.x) return false;
    return dans(I, g.x) || dans(J, g.x);
  }
  function union(I, J) {
    if (recolle(I, J)) {
      var g = gaucheMin(I, J), d = droiteMax(I, J);
      return [{ a: g.x, b: d.x, oa: g.o, ob: d.o }];
    }
    var m1 = { a: I.a, b: I.b, oa: I.oa, ob: I.ob };
    var m2 = { a: J.a, b: J.b, oa: J.oa, ob: J.ob };
    return m1.a <= m2.a ? [m1, m2] : [m2, m1];
  }
  function calcule(lien, I, J) { return lien === 'et' ? inter(I, J) : union(I, J); }

  /* ------------------------------------------------------------------ */
  /* Le tirage, par cas de figure                                        */
  /* ------------------------------------------------------------------ */
  function gauche(a, large) { return { a: a, oa: !large, b: Infinity, ob: true }; }
  function droite(b, large) { return { a: -Infinity, oa: true, b: b, ob: !large }; }
  function double(a, b, largeA, largeB) { return { a: a, oa: !largeA, b: b, ob: !largeB }; }

  function tire(rnd, palier) {
    var L = function () { return rnd.booleen(palier === 1 ? 0.3 : 0.5); };
    var lien = palier >= 3 && rnd.booleen(0.5) ? 'ou' : 'et';
    var I, J, cas;

    if (palier === 1) {
      cas = rnd.choix(['borne', 'borne', 'borne', 'meme-cote']);
      var a = rnd.entier(-8, 3);
      if (cas === 'borne') {                 // x > a et x < b : un intervalle
        I = gauche(a, L()); J = droite(a + rnd.entier(2, 7), L());
      } else if (rnd.booleen()) {            // x > a et x > a' : la plus exigeante gagne
        I = gauche(a, L()); J = gauche(a + rnd.entier(1, 5), L());
      } else {
        I = droite(a, L()); J = droite(a + rnd.entier(1, 5), L());
      }
    } else {
      cas = rnd.choix(['chevauche', 'chevauche', 'inclus', 'disjoint', 'touche', 'simple']);
      var a1 = rnd.entier(-8, 2), b1 = a1 + rnd.entier(2, 6);
      I = double(a1, b1, L(), L());
      if (cas === 'chevauche') {             // la simple coupe la double
        J = rnd.booleen() ? gauche(rnd.entier(a1 + 1, b1 - 1), L())
                          : droite(rnd.entier(a1 + 1, b1 - 1), L());
      } else if (cas === 'inclus') {         // la simple englobe la double
        J = rnd.booleen() ? gauche(a1 - rnd.entier(1, 3), L())
                          : droite(b1 + rnd.entier(1, 3), L());
      } else if (cas === 'disjoint') {       // un vrai trou : ∅ ou deux morceaux
        J = rnd.booleen() ? gauche(b1 + rnd.entier(1, 3), L())
                          : droite(a1 - rnd.entier(1, 3), L());
      } else if (cas === 'touche') {         // bornes partagées : le crochet décide
        J = rnd.booleen() ? gauche(b1, L()) : droite(a1, L());
      } else {                               // deux simples, parfois deux doubles
        if (palier >= 3 && rnd.booleen(0.3)) {
          var a2 = rnd.entier(a1 - 2, b1), b2 = a2 + rnd.entier(2, 6);
          J = double(a2, b2, L(), L());
        } else {
          var sens = rnd.booleen();
          I = sens ? gauche(a1, L()) : droite(b1, L());
          J = rnd.booleen(0.7) ? (sens ? droite(b1 + rnd.entier(-1, 3), L()) : gauche(a1 + rnd.entier(-3, 1), L()))
                               : (sens ? gauche(a1 + rnd.entier(1, 4), L()) : droite(b1 - rnd.entier(1, 4), L()));
        }
      }
    }
    // Palier 4 : des demi-entiers, une fois sur trois.
    if (palier >= 4 && rnd.booleen(0.35)) {
      [I, J].forEach(function (c) {
        if (isFinite(c.a)) c.a += 0.5;
        if (isFinite(c.b)) c.b += 0.5;
      });
    }
    // Une fois sur deux, on écrit la seconde en premier : sinon la double
    // inéquation serait toujours à gauche.
    if (rnd.booleen()) { var t = I; I = J; J = t; }
    return { I: I, J: J, lien: lien };
  }

  /* ------------------------------------------------------------------ */
  /* Les explications                                                    */
  /* ------------------------------------------------------------------ */
  function b(t) { return '<b>' + t + '</b>'; }

  // Pourquoi « x > 3 » s'écrit « ]3 ; +∞[ », avec les mots de la leçon.
  function traduction(c) {
    var pourquoi;
    if (c.a === -Infinity) {
      pourquoi = 'x est ' + (c.ob ? 'strictement plus petit que ' : 'au plus égal à ') + fr(c.b) +
                 ' : crochet ' + b(c.ob ? 'ouvert' : 'fermé') + ' en ' + fr(c.b) +
                 ', et rien à gauche, jusqu\'à −∞.';
    } else if (c.b === Infinity) {
      pourquoi = 'x est ' + (c.oa ? 'strictement plus grand que ' : 'au moins égal à ') + fr(c.a) +
                 ' : crochet ' + b(c.oa ? 'ouvert' : 'fermé') + ' en ' + fr(c.a) +
                 ', et rien à droite, jusqu\'à +∞.';
    } else {
      pourquoi = 'x est entre ' + fr(c.a) + ' et ' + fr(c.b) + ' : crochet ' +
                 b(c.oa ? 'ouvert' : 'fermé') + ' en ' + fr(c.a) + ' (inégalité ' +
                 (c.oa ? 'stricte' : 'large') + '), ' + b(c.ob ? 'ouvert' : 'fermé') + ' en ' +
                 fr(c.b) + ' (' + (c.ob ? 'stricte' : 'large') + ').';
    }
    return '\\(' + inegTex(c) + '\\) se traduit par \\(x \\in ' + crochetsTex(c) + '\\) : ' + pourquoi;
  }

  function etapesCalcul(I, J, lien, ms) {
    var e = [traduction(I), traduction(J)];
    var cI = crochets(I), cJ = crochets(J);
    if (lien === 'et') {
      e.push('« ' + b('et') + ' » : un nombre est solution s\'il vérifie ' + b('les deux') +
             ' inéquations. C\'est l\'' + b('intersection') + ' : S = ' + cI + ' ∩ ' + cJ +
             ', la partie commune aux deux barres sur l\'axe.');
      if (!ms.length) {
        var g = gaucheMax(I, J), d = droiteMin(I, J);
        e.push(g.x > d.x
          ? 'Il faudrait x ' + (g.o ? '&gt; ' : '⩾ ') + fr(g.x) + ' et x ' + (d.o ? '&lt; ' : '⩽ ') +
            fr(d.x) + ' en même temps : ' + b('impossible') + ', les deux barres ne se touchent pas.'
          : 'Les deux barres se touchent en ' + fr(g.x) + ', mais une inégalité stricte ' +
            b('exclut') + ' ce nombre : il ne reste rien.');
        e.push('D\'où S = ' + b('∅') + '.');
        return e;
      }
      var lo = gaucheMax(I, J), hi = droiteMin(I, J);
      e.push('On garde la ' + b('plus grande') + ' des bornes gauches (' + fr(lo.x) + ') et la ' +
             b('plus petite') + ' des bornes droites (' + fr(hi.x) + ').' +
             (I.a === J.a || I.b === J.b
               ? ' À une borne partagée, « et » ne la garde que si ' + b('les deux') + ' inéquations la gardent.'
               : ''));
      if (ms[0].a === ms[0].b) e.push('Les deux bornes sont égales et toutes deux comprises : il ne reste que le nombre ' + fr(ms[0].a) + '.');
      e.push('D\'où S = ' + b(ensemble(ms)) + '.');
      return e;
    }
    e.push('« ' + b('ou') + ' » : un nombre est solution s\'il vérifie ' + b('l\'une ou l\'autre') +
           ' des inéquations (ou les deux). C\'est la ' + b('réunion') + ' : S = ' + cI + ' ∪ ' + cJ +
           ', tout ce que les deux barres recouvrent.');
    if (ms.length === 2) {
      e.push('Entre ' + fr(ms[0].b) + ' et ' + fr(ms[1].a) + ', ' + b('aucun nombre') +
             ' ne vérifie ni l\'une ni l\'autre : ce trou empêche d\'écrire S en un seul intervalle.');
      e.push('On garde le symbole ∪ : S = ' + b(ensemble(ms)) + '.');
      return e;
    }
    var g2 = gaucheMin(I, J), d2 = droiteMax(I, J);
    if (ms[0].a === -Infinity && ms[0].b === Infinity) {
      e.push('Les deux barres recouvrent ' + b('tout l\'axe') + ' : tout nombre vérifie au moins ' +
             'l\'une des deux inéquations.');
      e.push('D\'où S = ' + b('ℝ') + '.');
      return e;
    }
    e.push('On garde la ' + b('plus petite') + ' des bornes gauches (' + fr(g2.x) + ') et la ' +
           b('plus grande') + ' des bornes droites (' + fr(d2.x) + ').' +
           (I.a === J.a || I.b === J.b
             ? ' À une borne partagée, « ou » la garde dès que ' + b('l\'une') + ' des inéquations la garde.'
             : ''));
    e.push('D\'où S = ' + b(ensemble(ms)) + '.');
    return e;
  }

  var INDICE_TRADUIRE = 'Traduis d\'abord chaque inéquation en intervalle : stricte (&lt;) → crochet ouvert, ' +
                        'large (⩽) → crochet fermé ; du côté de l\'infini, toujours ouvert.';
  function indiceLien(lien) {
    return lien === 'et'
      ? 'Avec « et », il faut vérifier les deux : sur un axe, garde la partie commune aux deux barres.'
      : 'Avec « ou », une seule suffit : sur un axe, garde tout ce que les deux barres recouvrent.';
  }

  /* ------------------------------------------------------------------ */
  MathsExos.register({
    id: 'intervalles-et-ou',
    competence: 'et-ou',
    level: '2nde',
    titre: 'Inéquations reliées par « et » ou « ou »',
    paliers: 4,

    genere: function (rnd, palier) {
      var p = tire(rnd, palier);
      var I = p.I, J = p.J, lien = p.lien;
      var ms = calcule(lien, I, J);
      var tex = enonceTex(I, J, lien);

      // Les trois formes s'ouvrent avec les paliers : d'abord l'écriture de S,
      // puis le test d'un nombre, puis le QCM où les leurres sont les erreurs
      // classiques du chapitre.
      var forme = palier === 1 ? rnd.choix([0, 0, 1]) : rnd.entier(0, palier >= 3 ? 2 : 1);

      /* --- 0 : écrire S ---------------------------------------------------- */
      if (forme === 0) {
        return {
          enonce: 'Détermine l\'ensemble \\(S\\) des nombres \\(x\\) tels que :<br>' +
                  '<span style="font-size:.9em;color:var(--ink-soft)">Écris \\(S\\) avec des ' +
                  '<strong>crochets</strong> (ou ∅, ou ℝ).</span>',
          tex: tex,
          type: 'intervalle',
          reponse: ensemble(ms),
          morceaux: ms,
          etapes: etapesCalcul(I, J, lien, ms),
          indices: [INDICE_TRADUIRE, indiceLien(lien)],
          duree: 75
        };
      }

      /* --- 1 : un nombre est-il solution ? souvent posé SUR une borne ----- */
      if (forme === 1) {
        var candidats = [I.a, I.b, J.a, J.b].filter(isFinite);
        var x = rnd.booleen(0.55) && candidats.length
          ? rnd.choix(candidats)
          : rnd.entier(-9, 9) + (palier >= 4 && rnd.booleen(0.3) ? 0.5 : 0);
        var dI = dans(I, x), dJ = dans(J, x);
        var ok = lien === 'et' ? (dI && dJ) : (dI || dJ);
        function test(c, d) {
          var t = inegTxt(c, fr(x)) + ' : ' + b(d ? 'vrai' : 'faux');
          if (x === c.a && isFinite(c.a)) {
            return t + ' — le nombre tombe pile sur la borne gauche, et l\'inégalité est ' +
              (c.oa ? b('stricte') + ' : elle l\'exclut.' : b('large') + ' : elle le garde.');
          }
          if (x === c.b && isFinite(c.b)) {
            return t + ' — le nombre tombe pile sur la borne droite, et l\'inégalité est ' +
              (c.ob ? b('stricte') + ' : elle l\'exclut.' : b('large') + ' : elle le garde.');
          }
          return t + '.';
        }
        return {
          enonce: 'Vrai ou faux : \\(' + texNb(x) + '\\) est solution de',
          tex: tex,
          type: 'vraifaux',
          correct: ok ? 0 : 1,
          etapes: [
            'On remplace x par ' + fr(x) + ' dans ' + b('chaque') + ' inéquation, séparément.',
            test(I, dI),
            test(J, dJ),
            (lien === 'et' ? 'Avec « et », il faut « vrai » aux deux : '
                           : 'Avec « ou », un seul « vrai » suffit : ') +
            fr(x) + (ok ? ' ' + b('est') + ' solution.' : ' ' + b('n\'est pas') + ' solution.')
          ],
          indices: [
            'Remplace x par le nombre dans la première inéquation, puis dans la seconde.',
            lien === 'et' ? 'Pour « et », les DEUX inégalités doivent être vraies.'
                          : 'Pour « ou », il suffit qu\'UNE des deux soit vraie.'
          ],
          duree: 50
        };
      }

      /* --- 2 : le QCM, où chaque leurre est une erreur classique ----------- */
      var leurres = [calcule(lien === 'et' ? 'ou' : 'et', I, J)];   // avoir confondu et / ou
      if (ms.length === 1 && isFinite(ms[0].a) && isFinite(ms[0].b) && ms[0].a !== ms[0].b) {
        var m = ms[0];                                              // les bons nombres, les mauvais crochets
        leurres.push([{ a: m.a, b: m.b, oa: !m.oa, ob: !m.ob }]);
        leurres.push([{ a: m.a, b: m.b, oa: !m.oa, ob: m.ob }]);
      }
      // avoir pris les bornes du mauvais côté
      leurres.push([{ a: gaucheMin(I, J).x, b: droiteMin(I, J).x, oa: gaucheMin(I, J).o, ob: droiteMin(I, J).o }]);
      leurres.push([{ a: gaucheMax(I, J).x, b: droiteMax(I, J).x, oa: gaucheMax(I, J).o, ob: droiteMax(I, J).o }]);
      // n'avoir gardé qu'une des deux inéquations
      leurres.push([I]); leurres.push([J]);
      leurres.push([]);                                             // « ∅ », le réflexe facile

      var pool = [ms], vus = {};
      vus[cle(ms)] = 1;
      leurres.forEach(function (t) {
        if (t.length === 1 && !(t[0].a < t[0].b || (t[0].a === t[0].b && !t[0].oa && !t[0].ob))) return;
        if (t.some(function (u) { return (!isFinite(u.a) && !u.oa) || (!isFinite(u.b) && !u.ob); })) return;
        var k = cle(t);
        if (vus[k]) return;
        vus[k] = 1;
        pool.push(t);
      });
      var choix = rnd.melange(pool.slice(0, 4));
      return {
        enonce: 'Parmi ces écritures, laquelle est l\'ensemble \\(S\\) des nombres \\(x\\) tels que :',
        tex: tex,
        type: 'qcm',
        choix: choix.map(function (t) { return '\\(' + ensembleTex(t) + '\\)'; }),
        correct: choix.map(cle).indexOf(cle(ms)),
        etapes: etapesCalcul(I, J, lien, ms),
        indices: [
          INDICE_TRADUIRE,
          'Élimine d\'abord les propositions dont les ' + b('bornes') + ' sont fausses, puis regarde ' +
          'les crochets — et souviens-toi du mot : « et » garde la partie commune, « ou » garde tout.'
        ],
        duree: 60
      };
    }
  });

})();
