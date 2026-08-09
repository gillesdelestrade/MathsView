/*
 * MathsExos — le moteur d'exercices (SPEC §2).
 *
 * Principe directeur, hérité du pool de fonctions : un générateur fournit le
 * strict minimum — un énoncé, une réponse, une correction — et le moteur déduit
 * tout le reste. Un générateur ne connaît ni le chrono, ni le score, ni les
 * paliers de l'élève, ni la façon dont sa question sera affichée.
 *
 * Ce fichier contient trois choses :
 *   1. le REGISTRE des générateurs (register / get / liste) ;
 *   2. le DÉROULÉ d'une session (tirage des paliers, file d'attente, rappel des
 *      questions ratées en fin de série) ;
 *   3. l'INTERFACE (saisie selon le type, indices, correction, écran de fin).
 *
 * La progression (maîtrise, ceintures, XP) vit dans `js/progression.js` et le
 * moteur s'y branche SI un profil est actif : le palier de départ est alors lu
 * dans la maîtrise, et chaque réponse y est reportée. Sans profil — ou sans le
 * module chargé — tout continue de fonctionner, avec un palier ajusté au fil de
 * la seule session en cours. Aucune leçon, aucun générateur n'en sait rien.
 */
(function (global) {
  'use strict';

  var GENS = [];              // les générateurs enregistrés
  var MAX_RAPPELS = 4;        // combien de questions ratées on repropose au plus

  /* ===================================================================== */
  /* Registre                                                              */
  /* ===================================================================== */
  function register(g) {
    if (!g || !g.id) { console.error('MathsExos.register : il manque un id.', g); return; }
    if (GENS.some(function (x) { return x.id === g.id; })) {
      console.warn('MathsExos : id déjà utilisé, ignoré :', g.id);
      return;
    }
    if (typeof g.genere !== 'function') {
      console.error('MathsExos.register : « ' + g.id +' » n\'a pas de genere().');
      return;
    }
    g.paliers = g.paliers || 3;
    GENS.push(g);
  }
  function get(id) {
    for (var i = 0; i < GENS.length; i++) if (GENS[i].id === id) return GENS[i];
    return null;
  }
  function liste() { return GENS.slice(); }
  function parCompetence(code) {
    return GENS.filter(function (g) { return g.competence === code; });
  }
  function competence(code) {
    var c = (MathsExos.catalogue || []).filter(function (x) { return x.code === code; })[0];
    return c || { code: code, libelle: code, niveau: '', chapitre: '' };
  }

  /* ===================================================================== */
  /* Petits utilitaires                                                    */
  /* ===================================================================== */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function vide(e) { while (e.firstChild) e.removeChild(e.firstChild); }
  function typeset(node) {
    if (global.MathJax && global.MathJax.typesetPromise) {
      global.MathJax.typesetPromise(node ? [node] : undefined)['catch'](function () {});
    }
  }
  function echappe(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ===================================================================== */
  /* Une session                                                           */
  /* ===================================================================== */
  function session(opts) {
    opts = opts || {};
    var gens = (opts.generateurs || []).map(get).filter(Boolean);
    if (!gens.length && opts.competences) {
      opts.competences.forEach(function (c) { gens = gens.concat(parCompetence(c)); });
    }
    if (!gens.length) gens = liste();

    var S = {
      gens: gens,
      nb: opts.nb || 8,
      mode: opts.mode || 'entrainement',
      graine: opts.graine || MathsAlea.graine(),
      i: 0,                       // questions déjà posées
      faites: [],                 // { gen, q, saisie, ok, indices, seed, palier }
      rappels: [],                // générateurs à reproposer en fin de série
      rappelsFaits: 0,            // combien on en a déjà programmé (plafond)
      palier: {},                 // palier courant, par générateur (cf. en-tête)
      serie: {},                  // réussites d'affilée, par générateur
      profil: opts.profil !== undefined ? opts.profil
              : (global.MathsProfils ? MathsProfils.courant() : null),
      // Boss et défi : le palier est IMPOSÉ (pour un défi, c'est celui de la
      // défiée), le chrono tourne, et la série est tirée d'avance.
      palierFixe: opts.palierFixe || null,
      chapitre: opts.chapitre || '',
      defi: opts.defi || null,
      chrono: opts.chrono || 0,
      bilan: { xp: 0, pieces: 0, ceintures: [] },
      tour: 0
    };
    S.alea = MathsAlea(S.graine);
    // Le palier de départ vient de la maîtrise du profil, quand il y en a une.
    gens.forEach(function (g) {
      var p = 1;
      if (S.profil && global.MathsProgression) {
        p = MathsProgression.maitrise(S.profil, g.competence).palier || 1;
      }
      S.palier[g.id] = Math.max(1, Math.min(g.paliers, p));
      S.serie[g.id] = 0;
    });
    return S;
  }

  // Le palier de la PROCHAINE question : autour du palier courant — 70 % au
  // palier, 20 % un cran au-dessus, 10 % un cran en dessous (SPEC §2.6).
  function palierDe(S, g) {
    // Un défi doit poser EXACTEMENT les mêmes questions aux deux joueuses :
    // pas de palier tiré au sort, donc.
    if (S.palierFixe) return Math.max(1, Math.min(g.paliers, S.palierFixe));
    var p = S.palier[g.id] || 1;
    var d = S.alea.brut();
    if (d > 0.9) p -= 1; else if (d > 0.7) p += 1;
    return Math.max(1, Math.min(g.paliers, p));
  }

  // Ce que l'on retient d'une réponse. Avec un profil, le palier est celui que
  // la progression vient de recalculer (elle a la mémoire longue) ; sans profil,
  // on l'ajuste au fil de la série : deux réussites d'affilée pour monter, un
  // échec pour redescendre.
  function apres(S, g, ok, res) {
    if (res && res.maitrise) {
      S.palier[g.id] = Math.max(1, Math.min(g.paliers, res.maitrise.palier || 1));
      return;
    }
    if (ok) {
      S.serie[g.id] = (S.serie[g.id] || 0) + 1;
      if (S.serie[g.id] >= 2 && S.palier[g.id] < g.paliers) {
        S.palier[g.id]++; S.serie[g.id] = 0;
      }
    } else {
      S.serie[g.id] = 0;
      S.palier[g.id] = Math.max(1, (S.palier[g.id] || 1) - 1);
    }
  }

  // Tire la question suivante. Renvoie null quand la série est finie.
  function prochaine(S) {
    var g, palier;
    if (S.file && S.file.length) { S.i++; return S.file.shift(); }
    if (S.i < S.nb) {
      // Les générateurs de la série sont pris à tour de rôle.
      g = S.gens[S.i % S.gens.length];
      palier = palierDe(S, g);
      S.i++;
    } else if (S.rappels.length) {
      var r = S.rappels.shift();
      g = r.gen; palier = r.palier;
    } else {
      return null;
    }
    var seed = S.alea.entier(1, 2147483646);
    var q;
    try {
      q = g.genere(MathsAlea(seed), palier);
    } catch (e) {
      console.error('Générateur « ' + g.id + ' » : ' + e.message, e);
      return null;
    }
    return { gen: g, q: q, palier: palier, seed: seed };
  }

  // Rejoue exactement une question à partir de sa graine (SPEC §2.1).
  function rejoue(genId, seed, palier) {
    var g = get(genId);
    return g ? g.genere(MathsAlea(seed), palier || 1) : null;
  }

  /* ===================================================================== */
  /* Interface — le déroulé à l'écran                                      */
  /* ===================================================================== */
  var PALETTE = ['−', '√', '/', '∪', '∞', '[', ']', 'π'];

  function monter(racine, opts) {
    var S = session(opts);
    S.racine = racine;
    S.surFin = opts && opts.surFin;
    S.titre = opts && opts.titre;
    if (S.mode !== 'entrainement' && S.mode !== 'revision') preTirage(S);
    demarreChrono(S);
    suivante(S);
    return S;
  }

  /* Boss et défi : on tire toute la série d'avance. Deux raisons — le chrono
     se calcule alors sur les durées indicatives des questions réellement
     posées, et un défi rejoué depuis sa graine redonne exactement la même
     série, quelle que soit l'évolution de la maîtrise entre-temps. */
  function preTirage(S) {
    S.file = [];
    var secondes = 0;
    for (var k = 0; k < S.nb; k++) {
      var g = S.gens[k % S.gens.length];
      var palier = palierDe(S, g);
      var seed = S.alea.entier(1, 2147483646);
      var q;
      try { q = g.genere(MathsAlea(seed), palier); }
      catch (e) { console.error('Générateur « ' + g.id + ' » : ' + e.message, e); continue; }
      S.file.push({ gen: g, q: q, palier: palier, seed: seed });
      secondes += q.duree || 60;
    }
    S.nb = S.file.length;
    if (!S.chrono) S.chrono = Math.round(secondes * 1.1);   // 10 % de marge
  }

  function fmtChrono(s) {
    var m = Math.floor(s / 60);
    return m + ':' + ('0' + (s % 60)).slice(-2);
  }
  function arreteChrono(S) {
    if (S.timer && global.clearInterval) global.clearInterval(S.timer);
    S.timer = null;
  }
  function demarreChrono(S) {
    if (!S.chrono || !global.setInterval) return;
    S.finChrono = new Date().getTime() + S.chrono * 1000;
    S.timer = global.setInterval(function () {
      // Si la page a changé sous nos pieds, le minuteur s'arrête tout seul.
      if (global.document && document.body && document.body.contains &&
          !document.body.contains(S.racine)) { arreteChrono(S); return; }
      var reste = Math.max(0, Math.round((S.finChrono - new Date().getTime()) / 1000));
      if (S.spanChrono) {
        S.spanChrono.innerHTML = '⏱ ' + fmtChrono(reste);
        S.spanChrono.className = 'exo-chrono' + (reste <= 30 ? ' urgent' : '');
      }
      if (reste <= 0) { arreteChrono(S); S.tempsEcoule = true; rendreFin(S); }
    }, 1000);
  }

  function suivante(S) {
    var t = prochaine(S);
    if (!t) { rendreFin(S); return; }
    S.finie = false;
    S.courante = t;
    S.indicesVus = 0;
    S.repondu = false;
    S.debut = new Date().getTime();
    rendreQuestion(S);
  }

  function rendreQuestion(S) {
    var t = S.courante, q = t.q;
    var racine = S.racine;
    vide(racine);

    /* -- la barre du haut : où en est-on ------------------------------- */
    var total = S.nb + Math.min(S.rappels.length, MAX_RAPPELS);
    var barre = el('div', 'exo-barre');
    barre.appendChild(el('span', 'exo-compte',
      'Question ' + (S.faites.length + 1) + ' / ' + total));
    var pts = S.faites.map(function (f) {
      return '<i class="exo-pastille ' + (f.ok ? 'ok' : 'ko') + '"></i>';
    }).join('') + '<i class="exo-pastille en-cours"></i>';
    barre.appendChild(el('span', 'exo-pastilles', pts));
    barre.appendChild(el('span', 'exo-palier',
      'palier ' + t.palier + '/' + t.gen.paliers));
    if (S.chrono) {
      var reste = Math.max(0, Math.round((S.finChrono - new Date().getTime()) / 1000));
      S.spanChrono = el('span', 'exo-chrono', '⏱ ' + fmtChrono(reste));
      barre.appendChild(S.spanChrono);
    }
    racine.appendChild(barre);

    /* -- la carte de la question --------------------------------------- */
    var carte = el('div', 'exo-carte');
    carte.appendChild(el('div', 'exo-titre', echappe(t.gen.titre || '')));
    carte.appendChild(el('p', 'exo-enonce', q.enonce || ''));
    if (q.tex) carte.appendChild(el('div', 'exo-tex', '\\(' + q.tex + '\\)'));

    var zone = el('div', 'exo-zone');
    carte.appendChild(zone);

    var indices = el('div', 'exo-indices');
    carte.appendChild(indices);
    var retour = el('div', 'exo-retour');
    carte.appendChild(retour);
    var actions = el('div', 'exo-actions');
    carte.appendChild(actions);
    racine.appendChild(carte);

    S.dom = { zone: zone, indices: indices, retour: retour, actions: actions };
    S.ctx = {};

    construireSaisie(S, zone);
    construireActions(S);
    typeset(carte);
  }

  /* -- la saisie, selon le type de question ---------------------------- */
  function construireSaisie(S, zone) {
    var q = S.courante.q;

    if (q.type === 'qcm' || q.type === 'vraifaux') {
      var choix = q.type === 'vraifaux' ? ['Vrai', 'Faux'] : q.choix;
      S.boutons = [];
      choix.forEach(function (c, i) {
        var b = el('button', 'exo-choix', c);
        b.type = 'button';
        b.onclick = function () {
          if (S.repondu) return;
          S.boutons.forEach(function (x) { x.classList.remove('choisi'); });
          b.classList.add('choisi');
          S.saisie = i;
        };
        S.boutons.push(b);
        zone.appendChild(b);
      });
      typeset(zone);
      return;
    }

    if (q.type === 'jsx') {
      var boite = el('div', 'exo-board jxgbox');
      boite.id = 'exo-board-' + (new Date().getTime());
      zone.appendChild(boite);
      var bb = q.board || {};
      var board = JXG.JSXGraph.initBoard(boite.id, Object.assign({
        boundingbox: [-10, 4, 10, -4], keepaspectratio: false, axis: false,
        grid: false, showCopyright: false, showNavigation: false,
        pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
      }, bb));
      S.ctx.board = board;
      S.board = board;
      try { q.figure(board, S.ctx); } catch (e) { console.error('figure() :', e); }
      if (q.consigneFig) zone.appendChild(el('p', 'exo-sous', q.consigneFig));
      return;
    }

    // nombre / texte / intervalle : une palette, puis le champ.
    var pal = el('div', 'exo-palette');
    var champ = el('input', 'exo-champ');
    champ.type = 'text';
    champ.autocomplete = 'off';
    champ.setAttribute('inputmode', q.type === 'nombre' ? 'decimal' : 'text');
    champ.placeholder = q.type === 'intervalle' ? 'par exemple ]−2 ; 5]' : 'ta réponse';

    PALETTE.forEach(function (c) {
      var b = el('button', 'exo-touche', c);
      b.type = 'button';
      b.onclick = function () { insere(champ, c); };
      pal.appendChild(b);
    });
    zone.appendChild(pal);

    var ligne = el('div', 'exo-ligne');
    ligne.appendChild(champ);
    if (q.unite) ligne.appendChild(el('span', 'exo-unite', q.unite));
    zone.appendChild(ligne);

    champ.onkeydown = function (e) {
      if (e.key === 'Enter') { e.preventDefault(); valider(S); }
    };
    S.champ = champ;
    setTimeout(function () { champ.focus(); }, 30);
  }

  function insere(champ, txt) {
    var d = champ.selectionStart === null ? champ.value.length : champ.selectionStart;
    var f = champ.selectionEnd === null ? d : champ.selectionEnd;
    champ.value = champ.value.slice(0, d) + txt + champ.value.slice(f);
    champ.focus();
    champ.selectionStart = champ.selectionEnd = d + txt.length;
  }

  /* -- les boutons ------------------------------------------------------ */
  function construireActions(S) {
    var q = S.courante.q, actions = S.dom.actions;
    vide(actions);

    var verif = el('button', 'exo-btn primaire', 'Vérifier');
    verif.onclick = function () { valider(S); };
    actions.appendChild(verif);

    // Un boss se passe d'indices, et un défi aussi : les deux joueuses doivent
    // affronter exactement les mêmes conditions.
    var avecIndices = S.mode === 'entrainement' || S.mode === 'revision';
    if (avecIndices && q.indices && q.indices.length) {
      var ind = el('button', 'exo-btn', 'Un indice');
      ind.onclick = function () {
        if (S.indicesVus >= q.indices.length) return;
        S.dom.indices.appendChild(
          el('div', 'exo-indice', '💡 ' + q.indices[S.indicesVus]));
        S.indicesVus++;
        if (S.indicesVus >= q.indices.length) ind.disabled = true;
        typeset(S.dom.indices);
      };
      actions.appendChild(ind);
    }
  }

  /* -- la validation ---------------------------------------------------- */
  function valider(S) {
    if (S.repondu) return;
    var t = S.courante, q = t.q;
    var saisie = (q.type === 'qcm' || q.type === 'vraifaux') ? S.saisie
               : (q.type === 'jsx' ? null : (S.champ ? S.champ.value : ''));

    var v = MathsReponse.valide(q, saisie, S.ctx);

    // Une saisie incomprise n'est JAMAIS un échec : on le dit, et on laisse
    // réessayer sans rien compter.
    if (v.forme === 'malformee') {
      vide(S.dom.retour);
      S.dom.retour.appendChild(el('div', 'exo-flou', v.message));
      return;
    }

    S.repondu = true;
    var duree = Math.round((new Date().getTime() - S.debut) / 1000);

    // Report vers la progression : maîtrise, XP, pièces, journal. Le générateur
    // n'en sait rien, et une session sans profil saute simplement l'étape.
    var res = null;
    if (S.profil && global.MathsProgression) {
      res = MathsProgression.apresQuestion(S.profil, {
        comp: t.gen.competence, gen: t.gen.id, seed: t.seed, palier: t.palier,
        maxPaliers: t.gen.paliers, ok: v.ok, indices: S.indicesVus,
        indicesDispo: (q.indices || []).length, duree: duree,
        // Ce que l'élève a répondu : c'est ce qui permettra au parent de voir
        // COMMENT elle se trompe, pas seulement qu'elle se trompe (SPEC §9.2).
        saisie: saisieLisible({ q: q, saisie: saisie })
      });
      S.bilan.xp += res.xp;
      S.bilan.pieces += res.pieces;
      if (res.nouvelleCeinture) {
        S.bilan.ceintures.push({ comp: t.gen.competence, ceinture: res.ceintureApres });
      }
    }
    apres(S, t.gen, v.ok, res);

    S.faites.push({
      gen: t.gen, q: q, palier: t.palier, seed: t.seed,
      saisie: saisie, ok: v.ok, indices: S.indicesVus, duree: duree
    });

    // Le plafond porte sur le TOTAL des rappels, pas sur la file d'attente :
    // sinon une question ratée puis re-ratée se reprogrammerait indéfiniment,
    // et la série ne finirait jamais.
    if (!v.ok && S.rappelsFaits < MAX_RAPPELS &&
        (S.mode === 'entrainement' || S.mode === 'revision')) {
      S.rappels.push({ gen: t.gen, palier: t.palier });
      S.rappelsFaits++;
    }

    rendreRetour(S, v);
  }

  function rendreRetour(S, v) {
    var q = S.courante.q, retour = S.dom.retour;
    vide(retour);
    if (S.champ) S.champ.disabled = true;
    if (S.boutons) {
      S.boutons.forEach(function (b, i) {
        if (i === Number(q.correct)) b.classList.add('bonne');
        else if (i === Number(S.saisie)) b.classList.add('mauvaise');
        b.disabled = true;
      });
    }

    if (v.ok) {
      retour.appendChild(el('div', 'exo-ok', 'Bravo, c\'est exactement ça.'));
    } else {
      retour.appendChild(el('div', 'exo-ko',
        (v.message ? v.message + '<br>' : '') +
        'Pas tout à fait — regarde la correction.'));
    }
    retour.appendChild(bonneReponse(q));
    if (q.etapes && q.etapes.length) {
      var c = el('div', 'exo-correction');
      c.appendChild(el('div', 'exo-correction-titre', 'La correction'));
      q.etapes.forEach(function (s) { c.appendChild(el('div', 'exo-etape', s)); });
      retour.appendChild(c);
    }

    vide(S.dom.actions);
    var suite = el('button', 'exo-btn primaire',
      (S.faites.length >= S.nb && !S.rappels.length) ? 'Voir mon résultat' :
      (v.ok ? 'Question suivante' : 'On réessaie ?'));
    suite.onclick = function () { suivante(S); };
    S.dom.actions.appendChild(suite);
    suite.focus();

    typeset(retour);
  }

  // Ce qu'il fallait répondre, écrit selon le type.
  function bonneReponse(q) {
    var txt;
    if (q.type === 'qcm') txt = q.choix[q.correct];
    else if (q.type === 'vraifaux') txt = q.correct === 0 ? 'Vrai' : 'Faux';
    else if (q.type === 'jsx') txt = q.solutionTxt || '';
    else txt = [].concat(q.reponse)[0];
    return el('div', 'exo-reponse',
      txt === '' ? '' : 'Réponse attendue : <b>' + txt + '</b>' +
      (q.unite ? ' ' + q.unite : ''));
  }

  /* -- l'écran de fin --------------------------------------------------- */
  function rendreFin(S) {
    var racine = S.racine;
    S.finie = true;          // la série est close (une page peut vouloir le savoir)
    arreteChrono(S);
    vide(racine);
    var justes = S.faites.filter(function (f) { return f.ok; }).length;
    // Hors entraînement, une question jamais atteinte (temps écoulé) compte
    // comme ratée : sinon un boss abandonné après trois bonnes réponses
    // afficherait 3/3 et serait validé.
    var total = (S.mode === 'boss' || S.mode === 'defi')
      ? Math.max(S.nb, S.faites.length) : S.faites.length;
    var pct = total ? Math.round(100 * justes / total) : 0;

    var carte = el('div', 'exo-carte exo-fin');
    carte.appendChild(el('div', 'exo-fin-titre', 'Série terminée'));
    carte.appendChild(el('div', 'exo-score', justes + ' / ' + total));

    var jauge = el('div', 'exo-jauge');
    var barre = el('i');
    barre.style.width = pct + '%';
    jauge.appendChild(barre);
    carte.appendChild(jauge);

    carte.appendChild(el('p', 'exo-mot',
      pct === 100 ? 'Sans faute, du début à la fin. Chapeau.' :
      pct >= 75 ? 'Très bonne série — quelques détails à revoir.' :
      pct >= 40 ? 'C\'est en train de rentrer. Reprends les erreurs ci-dessous.' :
                  'Notion encore fragile : relis la leçon, puis reviens t\'entraîner.'));

    /* Le bilan de progression : c'est LE moment de récompense de la séance
       (SPEC §11.3), donc il passe avant la liste des erreurs. */
    if (S.profil && global.MathsProgression) {
      // L'ordre compte : finSession écrit la trace de la série dans le journal,
      // et plusieurs trophées se lisent précisément là-dedans.
      var reg = MathsProgression.finSession(S.profil, {
        n: total, justes: justes, graine: S.graine,
        mode: S.mode, chapitre: S.chapitre,
        duree: S.faites.reduce(function (n, f) { return n + (f.duree || 0); }, 0)
      });
      /* On tranche d'abord boss et défi : « Parcours parfait » et « Duelliste »
         se lisent dans ce que ces deux-là viennent d'écrire. Évaluer les
         trophées avant, c'était les décaler d'une série. */
      var rec = el('div', 'exo-recompenses');

      /* --- le verdict d'un boss ---------------------------------------- */
      if (S.mode === 'boss' && S.chapitre) {
        var b = MathsProgression.bossFini(S.profil, S.chapitre, justes, total);
        rec.appendChild(el('div', b.reussi ? 'exo-boss-gagne' : 'exo-boss-perdu',
          b.reussi
            ? '🏆 <b>Chapitre validé !</b> ' + justes + ' / ' + total +
              (b.pieces ? ' — gros lot : <b>+' + b.pieces + ' pièces</b>' : '')
            : '🛡️ Le boss résiste : il faut <b>8 bonnes réponses sur 10</b> ' +
              '(tu en as ' + justes + '). Reviens t\'entraîner, puis retente.'));
        if (S.tempsEcoule) {
          rec.appendChild(el('div', 'exo-mot', 'Le temps est écoulé — les questions ' +
            'non atteintes comptent comme ratées.'));
        }
      }

      /* --- le verdict d'un défi ---------------------------------------- */
      if (S.mode === 'defi' && S.defi && global.MathsDefis) {
        var d = MathsDefis.enregistre(S.defi, S.profil, justes, total);
        if (d && d.statut === 'termine') {
          var gagne = d.gagnant === S.profil;
          rec.appendChild(el('div', gagne ? 'exo-boss-gagne' : 'exo-boss-perdu',
            (gagne ? '⚔️ <b>Défi gagné !</b> ' : '⚔️ Défi perdu. ') +
            'Score : ' + Math.round(d.scoreDe * 100) + ' % contre ' +
            Math.round(d.scoreVers * 100) + ' %' +
            (gagne && d.gain ? ' — <b>+' + d.gain + ' pièces</b>' : '')));
        } else if (d) {
          rec.appendChild(el('div', 'exo-mot',
            'Ta série est enregistrée : le défi attend maintenant l\'autre joueuse.'));
        }
      }

      var trophees = global.MathsTrophees ? MathsTrophees.evalue(S.profil) : [];
      var piecesTr = trophees.reduce(function (n, t) { return n + t.pieces; }, 0);

      var gains = el('div', 'exo-gains');
      gains.appendChild(el('span', 'exo-xp', '+' + S.bilan.xp + ' XP'));
      var pieces = S.bilan.pieces + reg.pieces + reg.coffre + piecesTr;
      if (pieces) gains.appendChild(el('span', 'exo-pieces', '+' + pieces + ' pièces'));
      rec.appendChild(gains);
      if (reg.pieces) {
        rec.appendChild(el('div', 'exo-mot',
          'Trois séries cette semaine — la régularité, c\'est ce qui compte le plus.'));
      }
      // Le coffre : imprévisible par construction, et tiré de la graine de la
      // série pour qu'on ne puisse pas le rejouer en rechargeant la page.
      if (reg.coffre) {
        rec.appendChild(el('div', 'exo-coffre',
          '<span class="exo-coffre-icone">🎁</span> Coffre surprise : <b>+' +
          reg.coffre + ' pièces</b> !'));
      }
      trophees.forEach(function (t) {
        rec.appendChild(el('div', 'exo-trophee-neuf',
          '<span class="exo-trophee-emoji">' + t.emoji + '</span>' +
          '<b>' + echappe(t.nom) + '</b> — ' + echappe(t.desc) +
          ' <span class="exo-trophee-pieces">+' + t.pieces + '</span>'));
      });
      S.bilan.ceintures.forEach(function (c) {
        rec.appendChild(el('div', 'exo-ceinture-neuve',
          '🥋 Nouvelle ceinture <b>' + c.ceinture.nom + '</b> en ' +
          echappe(competence(c.comp).libelle) + ' !'));
      });

      // Où en est chaque compétence travaillée, ceinture et score.
      var comps = [];
      S.faites.forEach(function (f) {
        if (comps.indexOf(f.gen.competence) < 0) comps.push(f.gen.competence);
      });
      comps.forEach(function (code) {
        var m = MathsProgression.maitrise(S.profil, code);
        var cei = MathsProgression.ceintureAffichee(m);
        var l = el('div', 'exo-comp-ligne');
        l.innerHTML =
          '<span class="exo-belt" style="background:' + cei.couleur + ';color:' +
            cei.encre + '">' + cei.nom + '</span>' +
          '<span class="exo-comp-nom">' + echappe(competence(code).libelle) + '</span>' +
          '<span class="exo-comp-jauge"><i style="width:' +
            Math.round(m.score) + '%"></i></span>' +
          '<span class="exo-comp-score">' + Math.round(m.score) + '</span>';
        rec.appendChild(l);
      });
      carte.appendChild(rec);
    }

    var rates = S.faites.filter(function (f) { return !f.ok; });
    if (rates.length) {
      var bloc = el('div', 'exo-erreurs');
      bloc.appendChild(el('div', 'props-label', 'Ce qui a coincé'));
      rates.forEach(function (f) {
        var d = el('div', 'exo-erreur');
        d.appendChild(el('div', 'exo-erreur-enonce',
          f.q.enonce + (f.q.tex ? ' \\(' + f.q.tex + '\\)' : '')));
        d.appendChild(el('div', 'exo-erreur-ligne',
          'Ta réponse : <b class="ko">' + echappe(saisieLisible(f)) + '</b> — ' +
          'attendu : <b class="ok">' + attenduLisible(f.q) + '</b>'));
        bloc.appendChild(d);
      });
      carte.appendChild(bloc);
    }

    var actions = el('div', 'exo-actions');
    if (rates.length) {
      var revoir = el('button', 'exo-btn primaire', 'Revoir mes erreurs');
      revoir.onclick = function () {
        monter(racine, {
          generateurs: rates.map(function (f) { return f.gen.id; }),
          nb: rates.length, titre: S.titre, surFin: S.surFin
        });
      };
      actions.appendChild(revoir);
    }
    var encore = el('button', 'exo-btn' + (rates.length ? '' : ' primaire'),
      'Une nouvelle série');
    encore.onclick = function () {
      monter(racine, {
        generateurs: S.gens.map(function (g) { return g.id; }),
        nb: S.nb, titre: S.titre, surFin: S.surFin
      });
    };
    actions.appendChild(encore);

    var sortir = el('button', 'exo-btn', 'Retour à la liste');
    sortir.onclick = function () {
      if (S.surFin) S.surFin(); else location.hash = 'accueil';
    };
    actions.appendChild(sortir);

    carte.appendChild(actions);
    racine.appendChild(carte);
    typeset(carte);
  }

  function saisieLisible(f) {
    if (f.q.type === 'qcm') return f.q.choix[f.saisie] === undefined ? '—' : f.q.choix[f.saisie];
    if (f.q.type === 'vraifaux') return f.saisie === 0 ? 'Vrai' : f.saisie === 1 ? 'Faux' : '—';
    if (f.q.type === 'jsx') return 'position posée sur la figure';
    return f.saisie === '' || f.saisie === null ? '—' : String(f.saisie);
  }
  function attenduLisible(q) {
    if (q.type === 'qcm') return q.choix[q.correct];
    if (q.type === 'vraifaux') return q.correct === 0 ? 'Vrai' : 'Faux';
    if (q.type === 'jsx') return q.solutionTxt || '';
    return String([].concat(q.reponse)[0]);
  }

  /* ===================================================================== */
  var MathsExos = {
    register: register,
    get: get,
    liste: liste,
    parCompetence: parCompetence,
    competence: competence,
    catalogue: [],
    session: session,
    rejoue: rejoue,
    monter: monter,
    typeset: typeset
  };
  global.MathsExos = MathsExos;

})(window);
