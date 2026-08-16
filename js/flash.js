/*
 * MathsFlash — le mode « flash » des fondamentaux : tables de multiplication et
 * additions jusqu'à 20.
 *
 * ---------------------------------------------------------------------------
 * Pourquoi ces deux-là, et pas le reste
 * ---------------------------------------------------------------------------
 * Partout ailleurs sur le site, l'objectif est de COMPRENDRE, et le chronomètre
 * y serait nuisible : une élève qui met deux minutes à retrouver pourquoi une
 * droite passe par l'origine a parfaitement réussi. Pour les tables et les
 * additions jusqu'à 20, l'objectif est autre : l'AUTOMATISME. Savoir que
 * 7 × 8 = 56 sans le calculer. Ici, la vitesse n'est pas une mesure indirecte
 * de la maîtrise — elle EST la maîtrise, et c'est la seule raison pour laquelle
 * ce module chronomètre.
 *
 * ---------------------------------------------------------------------------
 * Ce qu'on mesure exactement : la PREMIÈRE FRAPPE
 * ---------------------------------------------------------------------------
 * Le chronomètre s'arrête au premier caractère tapé, pas à la validation. C'est
 * la différence entre mesurer un automatisme et mesurer une vitesse de frappe :
 * lire l'énoncé, retrouver 56, taper « 5 », puis « 6 », puis Entrée, cela
 * dépasse trois secondes même quand on sait sa table par cœur. La latence de
 * rappel, elle, est exactement ce qu'on veut voir descendre.
 *
 *     moins de 3 s   3 points   « tu la sais »
 *     de 3 à 6 s     2 points   « tu la retrouves »
 *     au-delà        1 point    « tu la calcules »
 *     faux           0 point
 *
 * ---------------------------------------------------------------------------
 * Le tirage est pondéré, sinon la séance est perdue
 * ---------------------------------------------------------------------------
 * Un tirage uniforme sur 81 produits passerait l'essentiel du temps sur 2 × 3
 * et 5 × 4. Or les faits difficiles sont toujours les mêmes — 7 × 8, 6 × 9,
 * 8 + 7 — et ce sont eux qu'il faut revoir. Chaque fait garde donc trois
 * chiffres : combien de fois il a été vu, si la DERNIÈRE réponse était fausse,
 * et la latence moyenne. Le poids en découle : une erreur récente pèse très
 * lourd, une lenteur pèse, un fait su et rapide ne pèse presque plus. Les faits
 * jamais vus passent devant tout le reste — il faut bien commencer par en
 * faire le tour.
 *
 * ---------------------------------------------------------------------------
 * Ce que ça ne touche pas
 * ---------------------------------------------------------------------------
 * Rien de la progression habituelle. Les points de rapidité alimentent une
 * jauge d'AUTOMATISME qui leur est propre, jamais la maîtrise ni les ceintures.
 * Une élève lente mais juste ne perd rien ailleurs, et une ceinture continue de
 * vouloir dire la même chose sur tout le site. Les deux mesures répondent à
 * deux questions différentes — « est-ce que je comprends » et « est-ce que je
 * sais par cœur » — et les mélanger les rendrait toutes les deux illisibles.
 */
(function (global) {
  'use strict';

  var JOUR = 24 * 3600 * 1000;
  var DELAI = 2 * JOUR;             // au-delà, la séance est reproposée
  var SEUILS = [3000, 6000];        // millisecondes, sur la PREMIÈRE frappe
  var POINTS = [3, 2, 1];
  var NB = 20;                      // questions d'une séance
  var MAX_FAITS = 400;              // garde-fou de taille pour le stockage

  /* ===================================================================== */
  /* L'état, rangé dans le profil                                          */
  /* ===================================================================== */
  /* Compact à dessein : ces objets partent dans localStorage et sont
     synchronisés. Par fait, trois champs seulement — n (vu), e (dernière
     réponse fausse), m (latence moyenne, en ms). */
  function etat(id) {
    var e = MathsProfils.etat(id);
    if (!e.flash) e.flash = { derniere: 0, comps: {} };
    return e;
  }
  function pourComp(e, comp) {
    if (!e.flash.comps[comp]) {
      e.flash.comps[comp] = { n: 0, points: 0, faits: {} };
    }
    return e.flash.comps[comp];
  }

  /* Les générateurs qui déclarent des faits — c'est eux qui savent ce qu'est
     un fait de leur compétence, pas ce module. */
  function sources() {
    return MathsExos.liste().filter(function (g) {
      return g.flash && typeof g.flash.faits === 'function';
    });
  }

  /* ===================================================================== */
  /* Le barème                                                             */
  /* ===================================================================== */
  function points(ok, ms) {
    if (!ok) return 0;
    if (ms < SEUILS[0]) return POINTS[0];
    if (ms < SEUILS[1]) return POINTS[1];
    return POINTS[2];
  }
  function secondes(ms) {
    return (Math.round(ms / 100) / 10).toString().replace('.', ',') + ' s';
  }
  function mot(p) {
    return p === 3 ? 'tu la sais' : p === 2 ? 'tu la retrouves'
         : p === 1 ? 'tu la calcules' : '';
  }

  /* ===================================================================== */
  /* Le poids d'un fait                                                    */
  /* ===================================================================== */
  /* Jamais vu : il passe devant. Faux la dernière fois : il revient vite.
     Lent : il revient. Su et rapide : il s'efface sans disparaître — un fait
     de poids nul ne reviendrait jamais, et s'oublierait. */
  /* Les deux termes s'AJOUTENT, et l'erreur est ajoutée en dernier. Écrit dans
     l'autre sens — une branche « rapide » qui pose le poids au lieu de s'y
     ajouter —, un fait habituellement su mais raté à l'instant retomberait au
     poids le plus faible de tous : celui qu'on vient de manquer serait le
     dernier à revenir. */
  function poids(h) {
    if (!h || !h.n) return 10;
    var p = h.m >= SEUILS[1] ? 5              // lent
          : h.m >= SEUILS[0] ? 2.5            // moyen
          : 0.35;                             // su, et rapide
    if (h.e) p += 8;                          // faux la dernière fois : prioritaire
    return p;
  }

  /* ===================================================================== */
  /* Le tirage d'une séance                                                */
  /* ===================================================================== */
  /* Un tirage pondéré SANS REMISE : une même table ne doit pas tomber deux
     fois dans la séance, sinon la seconde ne mesure plus un rappel mais un
     souvenir immédiat. */
  function tirage(id, n, graine) {
    var e = etat(id);
    var rnd = MathsAlea(graine || MathsAlea.graine());
    var lot = [];
    sources().forEach(function (g) {
      var h = pourComp(e, g.competence).faits;
      g.flash.faits().forEach(function (f) {
        lot.push({ comp: g.competence, gen: g.id, cle: f.cle, texte: f.texte,
                   reponse: f.reponse, poids: poids(h[f.cle]) });
      });
    });
    if (!lot.length) return [];

    var out = [];
    n = Math.min(n || NB, lot.length);
    for (var k = 0; k < n; k++) {
      var total = lot.reduce(function (s, f) { return s + f.poids; }, 0);
      var seuil = rnd.entier(0, Math.max(1, Math.round(total * 1000))) / 1000;
      var acc = 0, choisi = lot.length - 1;
      for (var i = 0; i < lot.length; i++) {
        acc += lot[i].poids;
        if (acc >= seuil) { choisi = i; break; }
      }
      out.push(lot[choisi]);
      lot.splice(choisi, 1);                 // sans remise
    }
    return out;
  }

  /* ===================================================================== */
  /* Enregistrer une réponse                                               */
  /* ===================================================================== */
  function enregistre(id, f, ok, ms) {
    var e = etat(id);
    var c = pourComp(e, f.comp);
    var h = c.faits[f.cle] || { n: 0, e: 0, m: 0 };
    // moyenne glissante : la dernière mesure pèse la moitié, pour qu'un progrès
    // se voie tout de suite sans qu'un accident efface tout l'historique
    h.m = h.n ? Math.round((h.m + ms) / 2) : ms;
    h.n++;
    h.e = ok ? 0 : 1;
    c.faits[f.cle] = h;
    c.n++;
    var pts = points(ok, ms);
    c.points += pts;

    // garde-fou : on ne garde que les faits les plus récemment utiles
    var cles = Object.keys(c.faits);
    if (cles.length > MAX_FAITS) {
      cles.sort(function (a, b) { return poids(c.faits[b]) - poids(c.faits[a]); });
      var garde = {};
      cles.slice(0, MAX_FAITS).forEach(function (k) { garde[k] = c.faits[k]; });
      c.faits = garde;
    }
    MathsProfils.setEtat(id, e);
    return pts;
  }

  /* ===================================================================== */
  /* La jauge d'automatisme                                                */
  /* ===================================================================== */
  /* Une moyenne de points par question, sur les faits connus — donc entre 0 et
     3. On la ramène en pourcentage pour l'affichage, et on dit combien de faits
     restent à voir : c'est cela qui donne envie de revenir. */
  function resume(id) {
    var e = etat(id);
    var out = { comps: [], moyenne: 0, vus: 0, total: 0, derniere: e.flash.derniere || 0 };
    var somme = 0, nb = 0;
    sources().forEach(function (g) {
      var c = pourComp(e, g.competence);
      var faits = g.flash.faits();
      var vus = 0, sp = 0;
      faits.forEach(function (f) {
        var h = c.faits[f.cle];
        if (!h || !h.n) return;
        vus++;
        sp += h.e ? 0 : points(true, h.m);
      });
      var moy = vus ? sp / vus : 0;
      out.comps.push({ comp: g.competence, libelle: g.flash.libelle || g.titre,
                       vus: vus, total: faits.length, moyenne: moy,
                       pct: Math.round(moy / 3 * 100) });
      out.vus += vus; out.total += faits.length;
      somme += sp; nb += vus;
    });
    out.moyenne = nb ? somme / nb : 0;
    out.pct = Math.round(out.moyenne / 3 * 100);
    return out;
  }

  /* Faut-il la proposer ? Deux jours, et jamais deux fois le même jour. */
  function doitProposer(id) {
    if (!id || !sources().length) return false;
    return Date.now() - (etat(id).flash.derniere || 0) > DELAI;
  }
  function joursDepuis(id) {
    var d = etat(id).flash.derniere || 0;
    return d ? Math.floor((Date.now() - d) / JOUR) : null;
  }

  /* Fin de séance : on horodate, on récompense, et on laisse une trace. */
  function finSeance(id, bilan) {
    var e = etat(id);
    e.flash.derniere = Date.now();
    /* Une pièce tous les quinze points : une séance parfaite en vaut quatre.
       Le barème a été resserré après coup — à une pièce pour trois points, une
       séance rapportait vingt pièces, soit une ceinture noire tous les deux
       jours, et la boutique n'aurait plus rien valu. L'ordre de grandeur visé
       est celui du bonus de régularité (15 pièces par semaine) : la séance
       flash récompense, elle n'enrichit pas. */
    var pieces = Math.floor((bilan.points || 0) / 15);
    e.pieces = (e.pieces || 0) + pieces;
    MathsProfils.setEtat(id, e);
    MathsProfils.ajouteJournal(id, {
      t: e.flash.derniere, type: 'flash', n: bilan.n || 0, justes: bilan.justes || 0,
      points: bilan.points || 0, duree: Math.round((bilan.ms || 0) / 1000), pieces: pieces
    });
    return { pieces: pieces };
  }

  /* ===================================================================== */
  /* Le déroulé, à l'écran                                                 */
  /* ===================================================================== */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function monte(hote, opts) {
    opts = opts || {};
    var id = opts.profil || MathsProfils.courant();
    var file = tirage(id, opts.n || NB, opts.graine);
    if (!file.length) { hote.innerHTML = '<p>Aucun fondamental à réviser.</p>'; return; }

    var i = 0, pts = 0, justes = 0, debutSeance = Date.now();
    var detail = [];

    hote.innerHTML = '';
    var barre = el('div', 'fl-barre');
    var jauge = el('div', 'fl-jauge');
    barre.appendChild(jauge);
    hote.appendChild(barre);

    var compteur = el('div', 'fl-compteur');
    hote.appendChild(compteur);
    var carte = el('div', 'fl-carte');
    hote.appendChild(carte);

    var t0 = 0, latence = 0, verrou = false;

    function question() {
      var f = file[i];
      carte.innerHTML = '';
      carte.className = 'fl-carte';
      compteur.innerHTML = 'Question <b>' + (i + 1) + '</b> sur ' + file.length;
      jauge.style.width = Math.round(i / file.length * 100) + '%';

      carte.appendChild(el('div', 'fl-calcul', f.texte + ' = ?'));
      var champ = el('input', 'fl-champ');
      champ.type = 'text';
      champ.inputMode = 'numeric';
      champ.autocomplete = 'off';
      carte.appendChild(champ);
      var aide = el('div', 'fl-aide', 'Tape le résultat, puis <b>Entrée</b>.');
      carte.appendChild(aide);

      latence = 0;
      verrou = false;
      /* Le chronomètre part quand la question est RÉELLEMENT à l'écran, pas
         quand on la construit : une image de retard suffirait à fausser un
         seuil de trois secondes. */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { t0 = Date.now(); champ.focus(); });
      });

      // la mesure : le premier caractère tapé, et rien d'autre
      champ.addEventListener('input', function () {
        if (!latence && t0) latence = Date.now() - t0;
      });
      champ.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); valide(f, champ); }
      });
    }

    function valide(f, champ) {
      if (verrou) return;
      verrou = true;
      if (!latence) latence = t0 ? Date.now() - t0 : SEUILS[1] + 1;
      // on garde la saisie TELLE QU'ELLE A ÉTÉ TAPÉE pour le récapitulatif : une
      // élève doit pouvoir y relire son erreur, pas une version normalisée
      var brut = String(champ.value).trim();
      var saisie = brut.replace(',', '.');
      var ok = saisie !== '' && Math.abs(parseFloat(saisie) - f.reponse) < 1e-9;
      var p = enregistre(id, f, ok, latence);
      pts += p;
      if (ok) justes++;
      detail.push({ texte: f.texte, reponse: f.reponse, saisie: brut, ok: ok,
                    ms: latence, p: p });

      carte.className = 'fl-carte ' + (ok ? 'juste' : 'faux');
      var verdict = el('div', 'fl-verdict');
      verdict.innerHTML = ok
        ? '<span class="fl-pts">' + '●'.repeat(p) + '</span> <b>' + p + ' point' +
          (p > 1 ? 's' : '') + '</b> — ' + mot(p) +
          ' <span class="fl-ms">(' + secondes(latence) + ')</span>'
        : '<b>' + f.texte + ' = ' + f.reponse + '</b>';
      carte.appendChild(verdict);
      champ.disabled = true;

      setTimeout(function () {
        i++;
        if (i < file.length) question(); else fin();
      }, ok ? 550 : 1400);
    }

    function fin() {
      var bilan = { n: file.length, justes: justes, points: pts,
                    ms: Date.now() - debutSeance };
      var r = finSeance(id, bilan);
      jauge.style.width = '100%';
      compteur.innerHTML = 'Séance terminée';
      carte.className = 'fl-carte';
      carte.innerHTML = '';
      var max = file.length * POINTS[0];
      carte.appendChild(el('div', 'fl-score',
        '<b>' + pts + '</b> <span>/ ' + max + ' points</span>'));
      carte.appendChild(el('div', 'fl-bilan',
        justes + ' bonne' + (justes > 1 ? 's' : '') + ' réponse' + (justes > 1 ? 's' : '') +
        ' sur ' + file.length +
        (r.pieces ? ' — <b>' + r.pieces + ' pièce' + (r.pieces > 1 ? 's' : '') + '</b>' : '')));

      /* Ce qu'il faut revoir : les fausses d'abord, puis les plus lentes. Trois
         au plus — une liste de vingt lignes ne se lit pas. */
      var revoir = detail.filter(function (d) { return !d.ok; })
        .concat(detail.filter(function (d) { return d.ok && d.p === 1; }))
        .slice(0, 3);
      if (revoir.length) {
        carte.appendChild(el('div', 'fl-revoir',
          '<div class="fl-revoir-titre">À revoir</div>' +
          revoir.map(function (d) {
            return '<div class="fl-revoir-l"><b>' + d.texte + ' = ' + d.reponse + '</b>' +
                   (d.ok ? ' <span>(' + secondes(d.ms) + ')</span>' : '') +
                   '</div>';
          }).join('')));
      } else {
        carte.appendChild(el('div', 'fl-revoir',
          '<div class="fl-revoir-titre">Rien à revoir — tout était su.</div>'));
      }

      /* Le récapitulatif complet : une ligne par question, dans l'ordre où elles
         ont été posées. C'est ce qu'on regarde à deux, après coup — d'où la
         colonne « ta réponse », qui montre l'erreur telle qu'elle a été tapée,
         et la colonne du temps, qui explique le nombre de points. */
      var recap = '<table class="fl-recap"><thead><tr>' +
        '<th>Question</th><th>Réponse</th><th>Ta réponse</th><th>Temps</th>' +
        '</tr></thead><tbody>' +
        detail.map(function (d) {
          return '<tr class="' + (d.ok ? 'juste' : 'faux') + '">' +
            '<td class="q">' + d.texte + '</td>' +
            '<td class="r">' + d.reponse + '</td>' +
            '<td class="s">' + (d.saisie === '' ? '—' : d.saisie) +
              (d.ok ? '' : ' ✘') + '</td>' +
            '<td class="t">' + secondes(d.ms) + '</td></tr>';
        }).join('') + '</tbody></table>';
      carte.appendChild(el('div', 'fl-recap-boite',
        '<div class="fl-recap-titre">Le détail de la séance</div>' + recap));

      var b = el('button', 'exo-btn primaire', 'Terminer');
      b.onclick = function () { if (opts.surFin) opts.surFin(bilan); };
      carte.appendChild(b);
      // les trophées se relisent après coup, comme en fin de série ordinaire
      if (global.MathsTrophees) MathsTrophees.evalue(id);
    }

    question();
  }

  global.MathsFlash = {
    monte: monte,
    tirage: tirage,
    points: points,
    poids: poids,
    enregistre: enregistre,
    resume: resume,
    doitProposer: doitProposer,
    joursDepuis: joursDepuis,
    finSeance: finSeance,
    sources: sources,
    SEUILS: SEUILS, POINTS: POINTS, NB: NB
  };
})(this);
