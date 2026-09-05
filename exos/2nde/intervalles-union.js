/*
 * union-inter — réunir et croiser deux intervalles (leçon 2nde « Union et
 * intersection d'intervalles »).
 *
 * Le calcul lui-même tient en deux comparaisons — la plus grande des bornes
 * gauches, la plus petite des bornes droites, et l'inverse pour l'union — mais
 * trois pièges décident vraiment de la réponse, et l'énoncé les cherche :
 *
 *   — le CROCHET à une borne partagée : l'intersection ne ferme que si les
 *     DEUX ferment (« et »), l'union dès que L'UN ferme (« ou ») ;
 *   — l'intersection VIDE, quand les intervalles ne se recouvrent pas — et son
 *     cas limite, l'intersection réduite à un seul nombre ;
 *   — l'union EN DEUX MORCEAUX, qui n'est pas un intervalle et garde son ∪.
 *
 * Les intervalles ne sont donc pas tirés au hasard mais par CAS de figure
 * (chevauchement, inclusion, disjonction, contact), pour que chacun de ces
 * pièges revienne assez souvent pour être appris.
 *
 * La réponse est comparée par structure (type 'intervalle', champ `morceaux`) :
 * « [4;6] », « [4 ; 6] » et « [4,6] » sont la même réponse, et une réunion
 * s'écrit avec ∪, U ou u.
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
  // « [3 ; 6] », « ]−∞ ; 2[ », et « {6} » quand l'ensemble tient en un nombre.
  function crochets(m) {
    if (m.a === m.b) return '{' + fr(m.a) + '}';
    return (m.oa ? ']' : '[') + fr(m.a) + ' ; ' + fr(m.b) + (m.ob ? '[' : ']');
  }
  function crochetsTex(m) {
    if (m.a === m.b) return '\\{' + texNb(m.a) + '\\}';
    return (m.oa ? ']' : '[') + texNb(m.a) + '\\,;' + texNb(m.b) + (m.ob ? '[' : ']');
  }
  function ensemble(ms) {
    return ms.length ? ms.map(crochets).join(' ∪ ') : '∅';
  }
  function ensembleTex(ms) {
    return ms.length ? ms.map(crochetsTex).join(' \\cup ') : '\\varnothing';
  }
  // Deux ensembles écrits pareil ? On compare les morceaux, jamais les chaînes.
  function cle(ms) {
    return ms.map(function (m) {
      return [m.a, m.b, !!m.oa, !!m.ob].join(',');
    }).join('|');
  }

  /* ------------------------------------------------------------------ */
  /* Le calcul                                                           */
  /* ------------------------------------------------------------------ */
  function dans(iv, x) {
    return (iv.oa ? x > iv.a : x >= iv.a) && (iv.ob ? x < iv.b : x <= iv.b);
  }
  // À bornes égales, c'est le mot de liaison qui tranche le crochet : « et »
  // exclut dès que l'un exclut, « ou » inclut dès que l'un inclut.
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
  // L'union se recolle si les intervalles se chevauchent, ou s'ils se touchent
  // en un point que l'un des deux contient.
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
  function calcule(op, I, J) { return op === 'inter' ? inter(I, J) : union(I, J); }

  /* ------------------------------------------------------------------ */
  /* Le tirage, par cas de figure                                        */
  /* ------------------------------------------------------------------ */
  function tire(rnd, palier) {
    var a1 = rnd.entier(-8, 2);
    var b1 = a1 + rnd.entier(3, 6);
    var cas = palier <= 2
      ? rnd.choix(['chevauche', 'chevauche', 'inclus'])
      : rnd.choix(['chevauche', 'inclus', 'disjoint', 'colle',
                   'chevauche', 'disjoint']);
    var a2, b2;
    if (cas === 'chevauche') {                 // ils se recouvrent en partie
      a2 = rnd.entier(a1 + 1, b1 - 1); b2 = b1 + rnd.entier(1, 4);
    } else if (cas === 'inclus') {             // J est à l'intérieur de I
      a2 = rnd.entier(a1 + 1, b1 - 2); b2 = rnd.entier(a2 + 1, b1 - 1);
    } else if (cas === 'disjoint') {           // un vrai trou entre les deux
      a2 = b1 + rnd.entier(1, 3); b2 = a2 + rnd.entier(1, 4);
    } else {                                   // ils se touchent en b1
      a2 = b1; b2 = b1 + rnd.entier(2, 5);
    }

    var I = { a: a1, b: b1, oa: false, ob: false };
    var J = { a: a2, b: b2, oa: false, ob: false };

    // Palier 1 : tout est fermé, il n'y a que le calcul des bornes à faire.
    if (palier >= 2) {
      I.oa = rnd.booleen(0.4); I.ob = rnd.booleen(0.4);
      J.oa = rnd.booleen(0.4); J.ob = rnd.booleen(0.4);
      // Sur un contact, on ouvre plus volontiers : c'est là que le crochet
      // décide si l'union recolle et si l'intersection est vide ou pas.
      if (cas === 'colle' && rnd.booleen(0.5)) { I.ob = rnd.booleen(); J.oa = rnd.booleen(); }
    }
    // Palier 4 : une borne infinie, et parfois des demi-entiers.
    if (palier >= 4 && rnd.booleen(0.35)) {
      if (rnd.booleen()) { I.a = -Infinity; I.oa = true; }
      else { J.b = Infinity; J.ob = true; }
    }
    if (palier >= 4 && rnd.booleen(0.25)) {
      [I, J].forEach(function (m) {
        if (isFinite(m.a)) m.a += 0.5;
        if (isFinite(m.b)) m.b += 0.5;
      });
    }

    // Une fois sur deux, c'est J qui est le plus à gauche : sans cela, la
    // « plus grande borne gauche » serait toujours celle de J.
    return rnd.booleen() ? { I: I, J: J } : { I: J, J: I };
  }

  function enonceIJ(I, J) {
    return 'I = ' + crochetsTex(I) + ' \\quad\\text{et}\\quad J = ' + crochetsTex(J);
  }

  /* ------------------------------------------------------------------ */
  /* Les explications                                                    */
  /* ------------------------------------------------------------------ */
  function b(t) { return '<b>' + t + '</b>'; }

  // Le choix d'une borne, expliqué avec les nombres de l'énoncé.
  function choixBorne(op, I, J, cote) {
    var vI = cote === 'g' ? I.a : I.b, vJ = cote === 'g' ? J.a : J.b;
    var grand = (op === 'inter') === (cote === 'g');   // ∩ à gauche, ∪ à droite
    var mot = grand ? 'plus grande' : 'plus petite';
    var quoi = cote === 'g' ? 'bornes gauches' : 'bornes droites';
    if (vI === vJ) {
      return 'Les deux ' + quoi + ' sont égales (' + fr(vI) + ').';
    }
    var pris = grand ? Math.max(vI, vJ) : Math.min(vI, vJ);
    return 'La ' + b(mot) + ' des ' + quoi + ' est ' + b(fr(pris)) + ' : celle de I vaut ' +
           fr(vI) + ', celle de J vaut ' + fr(vJ) + '.';
  }

  // Le crochet, quand les deux intervalles se disputent la même borne.
  function motCrochet(op, oI, oJ) {
    var lien = op === 'inter' ? 'et' : 'ou';
    if (op === 'inter') {
      return oI || oJ
        ? 'Pour être dans les deux à la fois, il faut y être des deux côtés : ' +
          'un seul crochet ouvert suffit à ' + b('exclure') + ' cette borne.'
        : 'Les deux crochets sont fermés : la borne est dans I ' + lien + ' dans J, ' +
          'elle est donc ' + b('comprise') + '.';
    }
    return oI && oJ
      ? 'Aucun des deux ne prend cette borne : elle reste ' + b('exclue') + '.'
      : 'Il suffit d\'être dans l\'un des deux : un crochet fermé suffit à ' +
        b('comprendre') + ' cette borne.';
  }

  function etapesCalcul(op, I, J, ms) {
    var e = [];
    e.push(op === 'inter'
      ? 'L\'intersection \\(I \\cap J\\) rassemble les nombres qui sont dans I ' +
        b('ET') + ' dans J, en même temps.'
      : 'La réunion \\(I \\cup J\\) rassemble les nombres qui sont dans I ' +
        b('OU') + ' dans J — il suffit d\'être dans l\'un des deux.');

    if (op === 'inter') {
      if (!ms.length) {
        e.push('La plus grande borne gauche (' + fr(gaucheMax(I, J).x) + ') n\'est pas ' +
               'plus petite que la plus petite borne droite (' + fr(droiteMin(I, J).x) +
               ') : les deux intervalles ' + b('ne se recouvrent nulle part') + '.');
        if (gaucheMax(I, J).x === droiteMin(I, J).x) {
          e.push('Ils se touchent bien en ' + fr(gaucheMax(I, J).x) + ', mais au moins un ' +
                 'crochet y est ' + b('ouvert') + ' : ce nombre manque à l\'un des deux.');
        }
        e.push('D\'où \\(I \\cap J = \\) ' + b('∅') + '.');
        return e;
      }
      e.push(choixBorne('inter', I, J, 'g') + ' ' + choixBorne('inter', I, J, 'd'));
      if (I.a === J.a) e.push('Borne gauche partagée : ' + motCrochet('inter', I.oa, J.oa));
      if (I.b === J.b) e.push('Borne droite partagée : ' + motCrochet('inter', I.ob, J.ob));
      if (ms[0].a === ms[0].b) {
        e.push('Les deux bornes obtenues sont égales et les crochets fermés : il ne reste ' +
               'que le nombre ' + fr(ms[0].a) + '.');
      }
      e.push('D\'où \\(I \\cap J = \\) ' + b(ensemble(ms)) + '.');
      return e;
    }

    if (ms.length === 2) {
      e.push('Entre ' + fr(ms[0].b) + ' et ' + fr(ms[1].a) + ' il n\'y a ' +
             b('aucun nombre') + ' de I ni de J : ce trou empêche de réunir les deux ' +
             'en un seul intervalle.');
      e.push('On garde donc le symbole ∪ dans la réponse : ' + b(ensemble(ms)) + '. ' +
             'Ce n\'est pas un intervalle, mais c\'est bien un ensemble.');
      return e;
    }
    e.push(gaucheMax(I, J).x < droiteMin(I, J).x
      ? 'Les deux intervalles ' + b('se chevauchent') + ' : leur réunion est d\'un seul ' +
        'tenant, on peut l\'écrire avec un seul couple de crochets.'
      : 'Les deux intervalles ' + b('se touchent') + ' en ' + fr(gaucheMax(I, J).x) +
        ', et ce nombre appartient à l\'un des deux : la réunion se recolle en un seul ' +
        'intervalle.');
    e.push(choixBorne('union', I, J, 'g') + ' ' + choixBorne('union', I, J, 'd'));
    if (I.a === J.a) e.push('Borne gauche partagée : ' + motCrochet('union', I.oa, J.oa));
    if (I.b === J.b) e.push('Borne droite partagée : ' + motCrochet('union', I.ob, J.ob));
    e.push('D\'où \\(I \\cup J = \\) ' + b(ensemble(ms)) + '.');
    return e;
  }

  /* ------------------------------------------------------------------ */
  MathsExos.register({
    id: 'intervalles-union-inter',
    competence: 'union-inter',
    level: '2nde',
    titre: 'Union et intersection d\'intervalles',
    paliers: 4,

    genere: function (rnd, palier) {
      var p = tire(rnd, palier);
      var I = p.I, J = p.J;
      var op = rnd.booleen() ? 'inter' : 'union';
      var ms = calcule(op, I, J);
      var sym = op === 'inter' ? '\\cap' : '\\cup';
      var symTxt = op === 'inter' ? '∩' : '∪';
      var lien = op === 'inter' ? 'et' : 'ou';

      // Les trois formes s'ouvrent avec les paliers : d'abord le calcul seul,
      // puis l'appartenance, puis le QCM où les leurres sont les erreurs
      // classiques du chapitre.
      var forme = palier === 1 ? 0 : rnd.entier(0, palier >= 3 ? 2 : 1);

      /* --- 0 : écrire I ∩ J ou I ∪ J ------------------------------------ */
      if (forme === 0) {
        return {
          enonce: 'Détermine \\(I ' + sym + ' J\\), puis écris le résultat avec des ' +
                  '<strong>crochets</strong>.',
          tex: enonceIJ(I, J),
          type: 'intervalle',
          reponse: ensemble(ms),
          morceaux: ms,
          etapes: etapesCalcul(op, I, J, ms),
          indices: [
            op === 'inter'
              ? 'Place les deux intervalles l\'un sous l\'autre sur un axe : ' +
                'l\'intersection est la partie commune aux deux.'
              : 'Place les deux intervalles l\'un sous l\'autre sur un axe : ' +
                'la réunion est tout ce qu\'ils recouvrent à eux deux.',
            'Aux bornes partagées, souviens-toi du mot de liaison : « et » ferme ' +
            'seulement si les deux ferment, « ou » ferme dès que l\'un ferme.'
          ],
          duree: 75
        };
      }

      /* --- 1 : appartenance, souvent posée SUR une borne ----------------- */
      if (forme === 1) {
        var candidats = [I.a, I.b, J.a, J.b].filter(isFinite);
        var x = rnd.booleen(0.6) && candidats.length
          ? rnd.choix(candidats)
          : rnd.entier(-9, 9) + (rnd.booleen(0.25) ? 0.5 : 0);
        var dI = dans(I, x), dJ = dans(J, x);
        var dedans = op === 'inter' ? (dI && dJ) : (dI || dJ);
        function pourquoi(iv, nom, ok) {
          var t = fr(x) + (ok ? ' ∈ ' : ' ∉ ') + nom + ' = ' + crochets(iv);
          if (x === iv.a && isFinite(iv.a)) {
            return t + ' : le nombre tombe pile sur la borne gauche, et le crochet est ' +
              (iv.oa ? b('ouvert') + ' — elle est exclue.' : b('fermé') + ' — elle est comprise.');
          }
          if (x === iv.b && isFinite(iv.b)) {
            return t + ' : le nombre tombe pile sur la borne droite, et le crochet est ' +
              (iv.ob ? b('ouvert') + ' — elle est exclue.' : b('fermé') + ' — elle est comprise.');
          }
          return t + (ok ? ' : il est bien entre les deux bornes.'
                         : ' : il est en dehors de cet intervalle.');
        }
        return {
          enonce: 'Vrai ou faux : \\(' + texNb(x) + ' \\in I ' + sym + ' J\\) ?',
          tex: enonceIJ(I, J),
          type: 'vraifaux',
          correct: dedans ? 0 : 1,
          etapes: [
            'On regarde les deux intervalles ' + b('séparément') + '.',
            pourquoi(I, 'I', dI),
            pourquoi(J, 'J', dJ),
            'Il faut être dans I ' + b(lien) + ' dans J : ' + fr(x) +
            (dedans ? ' ∈ ' : ' ∉ ') + 'I ' + symTxt + ' J.'
          ],
          indices: [
            'Teste l\'appartenance à I, puis à J, avant de conclure.',
            op === 'inter'
              ? 'Pour l\'intersection, il faut que les DEUX réponses soient « oui ».'
              : 'Pour la réunion, une seule réponse « oui » suffit.'
          ],
          duree: 50
        };
      }

      /* --- 2 : le QCM, où chaque leurre est une erreur classique --------- */
      var autre = calcule(op === 'inter' ? 'union' : 'inter', I, J);
      var leurres = [autre];                       // avoir confondu ∪ et ∩
      // Les bons nombres, les mauvais crochets — mais jamais du côté de
      // l'infini : « [−∞ » n'est pas une écriture qu'on veut donner à lire.
      if (ms.length === 1 && isFinite(ms[0].a) && isFinite(ms[0].b) &&
          ms[0].a !== ms[0].b) {
        var m = ms[0];
        leurres.push([{ a: m.a, b: m.b, oa: !m.oa, ob: !m.ob }]);
        leurres.push([{ a: m.a, b: m.b, oa: !m.oa, ob: m.ob }]);
      }
      // avoir pris les bornes du mauvais côté : la plus petite des deux
      // gauches avec la plus petite des deux droites, et l'inverse
      leurres.push([{ a: gaucheMin(I, J).x, b: droiteMin(I, J).x,
                      oa: gaucheMin(I, J).o, ob: droiteMin(I, J).o }]);
      leurres.push([{ a: gaucheMax(I, J).x, b: droiteMax(I, J).x,
                      oa: gaucheMax(I, J).o, ob: droiteMax(I, J).o }]);
      leurres.push([]);                            // « ∅ », le réflexe facile

      var pool = [ms], vus = {};
      vus[cle(ms)] = 1;
      leurres.forEach(function (t) {
        // un leurre mal formé (borne gauche à droite de la borne droite) ou
        // égal à la bonne réponse ne sert à rien
        if (t.length === 1 && !(t[0].a < t[0].b ||
            (t[0].a === t[0].b && !t[0].oa && !t[0].ob))) return;
        var k = cle(t);
        if (vus[k]) return;
        vus[k] = 1;
        pool.push(t);
      });
      var choix = rnd.melange(pool.slice(0, 4));
      var texte = choix.map(function (t) { return '\\(' + ensembleTex(t) + '\\)'; });

      return {
        enonce: 'Parmi ces écritures, laquelle est \\(I ' + sym + ' J\\) ?',
        tex: enonceIJ(I, J),
        type: 'qcm',
        choix: texte,
        correct: choix.map(cle).indexOf(cle(ms)),
        etapes: etapesCalcul(op, I, J, ms),
        indices: [
          'Commence par situer les deux intervalles l\'un sous l\'autre sur un axe.',
          'Élimine d\'abord les propositions dont les ' + b('bornes') + ' sont fausses, ' +
          'puis regarde les crochets.'
        ],
        duree: 60
      };
    }
  });

})();
