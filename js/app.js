/*
 * MathsView — moteur du site.
 *
 * Tu n'as normalement PAS besoin de modifier ce fichier pour ajouter un cours.
 * Pour créer une illustration : copie un fichier de lessons/ et appelle
 * MathsView.register({...}). Voir lessons/4eme/pythagore.js comme modèle.
 */
(function (global) {
  'use strict';

  const registry = [];          // toutes les illustrations enregistrées
  let currentBoard = null;      // tableau JSXGraph actuellement affiché
  let activeFilter = 'all';     // 'all' ou une clé de LEVELS
  let activeCat = 'all';        // 'all' ou une clé de CATEGORIES
  let cleanups = [];            // fonctions de nettoyage de la leçon courante
                                // (ex. retirer un écouteur clavier), vidées au
                                // changement de leçon par freeCurrentBoard().

  // Les niveaux, de la 6ème à la Terminale. Cette carte pilote TOUT :
  // l'ordre des clés donne l'ordre des groupes du menu et des filtres,
  // `label` s'affiche dans le menu et sur le badge, `short` sur les pastilles
  // de filtre (la barre en compte 8, il faut des libellés courts), et `badge`
  // est le suffixe de classe CSS (.badge.n6 … .badge.nt).
  const LEVELS = {
    '6eme':      { label: '6ème',      short: '6e',  badge: 'n6' },
    '5eme':      { label: '5ème',      short: '5e',  badge: 'n5' },
    '4eme':      { label: '4ème',      short: '4e',  badge: 'n4' },
    '3eme':      { label: '3ème',      short: '3e',  badge: 'n3' },
    '2nde':      { label: '2nde',      short: '2de', badge: 'n2' },
    '1ere':      { label: '1ère',      short: '1re', badge: 'n1' },
    'terminale': { label: 'Terminale', short: 'Tle', badge: 'nt' }
  };

  // Les grands domaines. Chaque leçon en déclare un via `category`, et peut
  // préciser une SOUS-CATÉGORIE libre via `subcategory` (une simple chaîne,
  // ex. 'Vecteurs' ou 'Fractions') pour regrouper des leçons voisines à
  // l'intérieur d'un domaine et d'un niveau. Pas de liste à tenir à jour :
  // deux leçons qui écrivent la même sous-catégorie se retrouvent ensemble,
  // et une leçon sans sous-catégorie s'affiche directement sous le domaine.
  // L'ordre des clés ci-dessous est celui du menu, des filtres et de l'accueil.
  const CATEGORIES = {
    'calcul':    { label: 'Calcul' },
    'algebre':   { label: 'Algèbre' },
    'geometrie': { label: 'Géométrie' },
    'analyse':   { label: 'Analyse' }
  };
  // Filet de sécurité : une leçon sans domaine connu atterrit ici (et la
  // console prévient) au lieu de disparaître du menu.
  const OTHER_CAT = 'autres';
  const OTHER_DEF = { label: 'Autres' };

  function catKey(lesson) {
    return CATEGORIES[lesson.category] ? lesson.category : OTHER_CAT;
  }
  function catDef(key) { return CATEGORIES[key] || OTHER_DEF; }

  // Range une liste de leçons en [{ key, def, subs: [{ name, lessons }] }].
  // Les domaines suivent l'ordre de CATEGORIES ; à l'intérieur, les leçons
  // SANS sous-catégorie viennent d'abord, puis les sous-catégories dans leur
  // ordre d'apparition dans le catalogue (index.html).
  function groupByCategory(lessons) {
    return Object.keys(CATEGORIES).concat(OTHER_CAT).map(key => {
      const inCat = lessons.filter(l => catKey(l) === key);
      if (!inCat.length) return null;
      const subs = [];
      inCat.forEach(l => {
        const name = l.subcategory || '';
        let sub = subs.find(s => s.name === name);
        if (!sub) { sub = { name: name, lessons: [] }; subs.push(sub); }
        sub.lessons.push(l);
      });
      // Tri stable : seul le groupe « sans sous-catégorie » remonte en tête.
      subs.sort((a, b) => (a.name === '' ? -1 : b.name === '' ? 1 : 0));
      return { key: key, def: catDef(key), subs: subs };
    }).filter(Boolean);
  }

  /* --------------------------------------------------------------------- */
  /* API publique : appelée depuis chaque fichier de cours                 */
  /* --------------------------------------------------------------------- */
  function register(lesson) {
    if (!lesson || !lesson.id) {
      console.error('MathsView.register : il manque un id.', lesson);
      return;
    }
    if (registry.some(l => l.id === lesson.id)) {
      console.warn('MathsView : id déjà utilisé, ignoré :', lesson.id);
      return;
    }
    // Un niveau inconnu ferait disparaître la leçon du menu sans rien dire
    // (buildMenu ne parcourt que les clés de LEVELS) : on prévient.
    if (!LEVELS[lesson.level]) {
      console.warn('MathsView : niveau inconnu « ' + lesson.level + ' » pour', lesson.id,
                   '— attendu :', Object.keys(LEVELS).join(', '));
    }
    // Sans domaine reconnu la leçon reste visible, mais rangée dans « Autres ».
    if (!CATEGORIES[lesson.category]) {
      console.warn('MathsView : catégorie inconnue « ' + lesson.category + ' » pour', lesson.id,
                   '— attendu :', Object.keys(CATEGORIES).join(', '));
    }
    registry.push(lesson);
  }

  /* --------------------------------------------------------------------- */
  /* Démarrage                                                             */
  /* --------------------------------------------------------------------- */
  function start() {
    buildFilters();
    buildMenu();
    buildCards();
    wireSearch();

    window.addEventListener('hashchange', route);
    route();
  }

  /* --------------------------------------------------------------------- */
  /* Construction de l'interface                                           */
  /* --------------------------------------------------------------------- */
  function rebuildLists() { buildFilters(); buildMenu(); buildCards(); }

  function chip(label, active, onClick) {
    const b = document.createElement('button');
    b.textContent = label;
    if (active) b.classList.add('active');
    b.onclick = onClick;
    return b;
  }

  // Deux séries de pastilles : les niveaux, puis les domaines. Les deux
  // filtres se combinent (ex. « 2de » + « Géométrie »).
  function buildFilters() {
    const box = document.getElementById('filters');
    box.innerHTML = '';

    // Dérivé de LEVELS : pas de liste de niveaux en double à maintenir.
    box.appendChild(chip('Tout', activeFilter === 'all',
      () => { activeFilter = 'all'; rebuildLists(); }));
    Object.keys(LEVELS).forEach(k => {
      box.appendChild(chip(LEVELS[k].short, activeFilter === k,
        () => { activeFilter = k; rebuildLists(); }));
    });

    const sep = document.createElement('span');
    sep.className = 'filters-sep';
    box.appendChild(sep);

    const all = chip('Tous domaines', activeCat === 'all',
      () => { activeCat = 'all'; rebuildLists(); });
    all.classList.add('cat');
    box.appendChild(all);
    Object.keys(CATEGORIES).forEach(k => {
      const b = chip(CATEGORIES[k].label, activeCat === k,
        () => { activeCat = k; rebuildLists(); });
      b.classList.add('cat', k);
      box.appendChild(b);
    });
  }

  function visibleLessons() {
    const q = (document.getElementById('search').value || '').trim().toLowerCase();
    return registry.filter(l => {
      const okLevel = activeFilter === 'all' || l.level === activeFilter;
      const okCat = activeCat === 'all' || catKey(l) === activeCat;
      const hay = (l.title + ' ' + (l.theme || '') + ' ' + (l.subcategory || '') + ' ' +
                   catDef(catKey(l)).label + ' ' + (l.description || '')).toLowerCase();
      const okSearch = !q || hay.includes(q);
      return okLevel && okCat && okSearch;
    });
  }

  // Menu à trois niveaux : classe → domaine → (sous-catégorie) → leçons.
  function buildMenu() {
    const menu = document.getElementById('menu');
    menu.innerHTML = '';
    const lessons = visibleLessons();

    Object.keys(LEVELS).forEach(levelKey => {
      const group = lessons.filter(l => l.level === levelKey);
      if (!group.length) return;

      const title = document.createElement('div');
      title.className = 'menu-group-title';
      title.textContent = LEVELS[levelKey].label;
      menu.appendChild(title);

      groupByCategory(group).forEach(cat => {
        const ct = document.createElement('div');
        ct.className = 'menu-cat';
        ct.innerHTML = '<i class="cat-dot ' + cat.key + '"></i>' + escapeHtml(cat.def.label);
        menu.appendChild(ct);

        cat.subs.forEach(sub => {
          if (sub.name) {
            const st = document.createElement('div');
            st.className = 'menu-sub';
            st.textContent = sub.name;
            menu.appendChild(st);
          }
          sub.lessons.forEach(l => {
            const a = document.createElement('a');
            a.textContent = l.title;
            a.href = '#' + l.id;
            a.dataset.id = l.id;
            if (sub.name) a.classList.add('deep');
            menu.appendChild(a);
          });
        });
      });
    });

    if (!lessons.length) {
      const p = document.createElement('p');
      p.style.color = 'var(--ink-soft)';
      p.style.fontSize = '.85rem';
      p.textContent = 'Aucun cours ne correspond.';
      menu.appendChild(p);
    }
    highlightMenu();
  }

  // Accueil : mêmes rubriques que le menu (classe → domaine → sous-catégorie),
  // avec une grille de cartes par rubrique.
  function buildCards() {
    const box = document.getElementById('cards');
    box.innerHTML = '';
    const lessons = visibleLessons();

    Object.keys(LEVELS).forEach(levelKey => {
      const group = lessons.filter(l => l.level === levelKey);
      if (!group.length) return;

      const lt = document.createElement('h3');
      lt.className = 'home-level';
      lt.innerHTML = '<span class="badge ' + LEVELS[levelKey].badge + '">' +
        escapeHtml(LEVELS[levelKey].label) + '</span>';
      box.appendChild(lt);

      groupByCategory(group).forEach(cat => {
        const ct = document.createElement('div');
        ct.className = 'home-cat';
        ct.innerHTML = '<i class="cat-dot ' + cat.key + '"></i>' + escapeHtml(cat.def.label);
        box.appendChild(ct);

        cat.subs.forEach(sub => {
          if (sub.name) {
            const st = document.createElement('div');
            st.className = 'home-sub';
            st.textContent = sub.name;
            box.appendChild(st);
          }
          const grid = document.createElement('div');
          grid.className = 'cards-grid';
          sub.lessons.forEach(l => {
            const card = document.createElement('div');
            card.className = 'card';
            card.onclick = () => { location.hash = l.id; };
            card.innerHTML =
              '<span class="cat-chip ' + cat.key + '">' + escapeHtml(cat.def.label) +
                (sub.name ? ' › ' + escapeHtml(sub.name) : '') + '</span>' +
              '<h3>' + escapeHtml(l.title) + '</h3>' +
              '<p>' + escapeHtml(l.theme || '') + '</p>';
            grid.appendChild(card);
          });
          box.appendChild(grid);
        });
      });
    });

    if (!lessons.length) {
      const p = document.createElement('p');
      p.style.color = 'var(--ink-soft)';
      p.textContent = 'Aucun cours ne correspond à cette recherche.';
      box.appendChild(p);
    }
  }

  function wireSearch() {
    document.getElementById('search').addEventListener('input', () => {
      buildMenu();
      buildCards();
    });
  }

  /* --------------------------------------------------------------------- */
  /* Routage : #id d'une illustration, ou accueil                          */
  /* --------------------------------------------------------------------- */
  function route() {
    const id = location.hash.replace(/^#/, '');
    if (!id) { showHome(); return; }
    const lesson = registry.find(l => l.id === id);
    if (!lesson) { showHome(); return; }
    openLesson(lesson);
  }

  function showHome() {
    freeCurrentBoard();
    document.getElementById('lesson').hidden = true;
    document.getElementById('home').hidden = false;
    highlightMenu();
  }

  function openLesson(lesson) {
    document.getElementById('home').hidden = true;
    const section = document.getElementById('lesson');
    section.hidden = false;

    const badge = document.getElementById('lesson-level');
    badge.textContent = LEVELS[lesson.level] ? LEVELS[lesson.level].label : lesson.level;
    badge.className = 'badge ' + (LEVELS[lesson.level] ? LEVELS[lesson.level].badge : '');

    // Fil d'Ariane du domaine : « Géométrie › Vecteurs ».
    const key = catKey(lesson);
    const chipEl = document.getElementById('lesson-cat');
    chipEl.className = 'cat-chip ' + key;
    chipEl.textContent = catDef(key).label +
      (lesson.subcategory ? ' › ' + lesson.subcategory : '');

    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-desc').innerHTML = lesson.description || '';
    document.getElementById('lesson-notes').innerHTML = lesson.notes || '';

    // (Re)création du tableau JSXGraph
    freeCurrentBoard();
    const boardEl = document.getElementById('board');
    // Réaffiche le repère : une leçon précédente a pu le masquer via mv.hideBoard()
    // (utile pour les leçons sans figure, ex. le tableau de conversion).
    boardEl.style.display = '';
    boardEl.innerHTML = '';
    // Vide les ajouts de la leçon précédente (curseurs, boutons, panneaux…).
    document.getElementById('lesson-extras').innerHTML = '';
    const initOptions = Object.assign({
      boundingbox: [-6, 6, 6, -6],
      axis: true,
      showCopyright: false,
      showNavigation: true,
      keepaspectratio: false,
      pan: { enabled: true, needTwoFingers: true }
    }, lesson.board || {});
    currentBoard = JXG.JSXGraph.initBoard('board', initOptions);

    // Contexte passé au cours : helpers pratiques
    const ctx = {
      board: currentBoard,
      notes: document.getElementById('lesson-notes'),
      desc: document.getElementById('lesson-desc'),
      extras: document.getElementById('lesson-extras'),
      typeset: typeset,
      addControls: addControls,
      // Moteur d'animation partagé + mode « pas à pas » (case à cocher, bouton
      // « Suivante » et barre espace). Voir createAnimator ci-dessous.
      createAnimator: createAnimator,
      // Enregistre une fonction appelée quand on quitte la leçon (nettoyage).
      onCleanup: function (fn) { if (typeof fn === 'function') cleanups.push(fn); },
      // Masque le repère JSXGraph pour une leçon sans figure (tableau, texte…).
      // Il est réaffiché automatiquement au chargement de la leçon suivante.
      hideBoard: function () { boardEl.style.display = 'none'; }
    };

    try {
      if (typeof lesson.setup === 'function') lesson.setup(currentBoard, ctx);
    } catch (e) {
      console.error('Erreur dans le cours « ' + lesson.id + ' » :', e);
    }

    typeset();
    highlightMenu();
    window.scrollTo(0, 0);
  }

  function freeCurrentBoard() {
    // Nettoyages enregistrés par la leçon (écouteurs clavier, timers…).
    cleanups.forEach(fn => { try { fn(); } catch (e) { /* ignore */ } });
    cleanups = [];
    if (currentBoard) {
      try { JXG.JSXGraph.freeBoard(currentBoard); } catch (e) { /* ignore */ }
      currentBoard = null;
    }
  }

  function highlightMenu() {
    const id = location.hash.replace(/^#/, '');
    document.querySelectorAll('#menu a').forEach(a => {
      a.classList.toggle('active', a.dataset.id === id);
    });
  }

  /* --------------------------------------------------------------------- */
  /* Helpers exposés aux cours                                             */
  /* --------------------------------------------------------------------- */

  // Rendu des formules LaTeX (\( ... \) et $$ ... $$) via MathJax.
  function typeset() {
    if (global.MathJax && global.MathJax.typesetPromise) {
      global.MathJax.typesetPromise();
    }
  }

  // Crée une barre de contrôles HTML (curseurs, boutons) sous le tableau.
  // specs : tableau d'objets { type:'slider'|'button'|'checkbox', ... }
  // Renvoie un objet { <id>: element } pour lire les valeurs.
  function addControls(specs) {
    const bar = document.createElement('div');
    bar.className = 'controls';
    const refs = {};

    specs.forEach(s => {
      if (s.type === 'button') {
        const b = document.createElement('button');
        b.textContent = s.label;
        b.onclick = s.onClick;
        bar.appendChild(b);
        refs[s.id] = b;
      } else if (s.type === 'slider') {
        const wrap = document.createElement('label');
        const span = document.createElement('span');
        span.textContent = s.label + ' ';
        const input = document.createElement('input');
        input.type = 'range';
        input.min = s.min; input.max = s.max; input.step = s.step || 1;
        input.value = s.value != null ? s.value : s.min;
        const val = document.createElement('span');
        val.textContent = input.value;
        input.oninput = () => { val.textContent = input.value; if (s.onInput) s.onInput(parseFloat(input.value)); };
        wrap.appendChild(span); wrap.appendChild(input); wrap.appendChild(val);
        bar.appendChild(wrap);
        refs[s.id] = input;
      } else if (s.type === 'checkbox') {
        const wrap = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!s.checked;
        input.onchange = () => { if (s.onChange) s.onChange(input.checked); };
        wrap.appendChild(input);
        wrap.appendChild(document.createTextNode(' ' + s.label));
        bar.appendChild(wrap);
        refs[s.id] = input;
      }
    });

    document.getElementById('lesson-extras').appendChild(bar);
    return refs;
  }

  /* --------------------------------------------------------------------- */
  /* Moteur d'animation partagé + mode « pas à pas »                       */
  /*                                                                       */
  /* Une leçon appelle `var anim = mv.createAnimator();` puis utilise      */
  /* `anim.runSteps(steps, reset)` (steps : liste { dur, step(p), after } ;*/
  /* reset : fonction qui remet la figure à zéro) à la place de son moteur */
  /* local. L'animateur ajoute tout seul la ligne                          */
  /* « ☑ Pas à pas  [◀ Précédent] [Suivante ▶] » (cochée par défaut) : à   */
  /* chaque étape l'animation s'arrête et n'avance qu'au clic sur le bouton*/
  /* ou à la barre espace ; « Précédent » (ou ←) rejoue instantanément les */
  /* étapes précédentes après un reset — pratique pour commenter en direct.*/
  /* --------------------------------------------------------------------- */
  function createAnimator() {
    const board = currentBoard;   // tableau de la leçon courante (au moment de l'appel)
    let raf = null;
    let stepMode = true;          // pas à pas coché PAR DÉFAUT
    let steps = [];
    let resetFn = null;
    let idx = 0;                  // nombre d'étapes déjà jouées (0..steps.length)
    let busy = false;             // une étape est en cours d'animation

    function stopRaf() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    function cancel() { stopRaf(); busy = false; steps = []; idx = 0; refreshUI(); }

    function animate(dur, onStep, onDone) {
      stopRaf();
      let t0 = null;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        try { onStep(p); board.update(); }
        catch (e) { raf = null; return; }   // board libéré (on a quitté la leçon)
        if (p < 1) raf = requestAnimationFrame(frame);
        else { raf = null; if (onDone) onDone(); }
      }
      raf = requestAnimationFrame(frame);
    }

    // Joue l'étape courante (idx) avec animation, puis incrémente idx.
    function playStep(onDone) {
      const s = steps[idx];
      busy = true; refreshUI();
      animate(s.dur, s.step, function () {
        if (s.after) s.after();
        idx++; busy = false; refreshUI();
        if (onDone) onDone();
      });
    }
    function autoRun() {
      if (idx >= steps.length) return;
      playStep(function () { if (!stepMode) autoRun(); });
    }

    function runSteps(newSteps, reset) {
      cancel();
      steps = newSteps || [];
      resetFn = reset || null;
      idx = 0; busy = false;
      refreshUI();
      if (!stepMode) autoRun();   // en pas à pas on attend l'appui (figure vierge)
    }

    function advance() {          // « Suivante » / espace / →
      if (busy || idx >= steps.length) return;
      playStep(function () { if (!stepMode) autoRun(); });
    }

    function back() {             // « Précédent » / ← : reset puis rejoue 0..idx-2
      if (busy || idx <= 0 || !resetFn) return;
      stopRaf();
      idx--;
      try { resetFn(); } catch (e) {}
      for (let j = 0; j < idx; j++) {
        try { steps[j].step(1); if (steps[j].after) steps[j].after(); } catch (e) {}
      }
      try { board.update(); } catch (e) {}
      refreshUI();
    }

    /* Ligne de contrôle « Pas à pas » + « Précédent » + « Suivante » ------ */
    const row = document.createElement('div');
    row.className = 'controls step-controls';
    const cbLabel = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = true;            // coché par défaut
    cb.onchange = function () {
      stepMode = cb.checked;
      const disp = stepMode ? '' : 'none';
      prevBtn.style.display = disp; nextBtn.style.display = disp;
      if (!stepMode) autoRun();   // si on décoche pendant une pause, on reprend en auto
      refreshUI();
    };
    cbLabel.appendChild(cb);
    cbLabel.appendChild(document.createTextNode(' Pas à pas'));

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '◀ Précédent';
    prevBtn.onclick = back;

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Suivante ▶';
    nextBtn.onclick = advance;

    row.appendChild(cbLabel);
    row.appendChild(prevBtn);
    row.appendChild(nextBtn);
    document.getElementById('lesson-extras').appendChild(row);

    function refreshUI() {
      prevBtn.disabled = busy || idx <= 0 || !resetFn;
      nextBtn.disabled = busy || idx >= steps.length;
    }
    refreshUI();

    /* Clavier : espace/→ pour avancer, ← pour reculer -------------------- */
    function onKey(e) {
      if (!stepMode) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === ' ' || e.code === 'Space' || e.key === 'ArrowRight') {
        if (!busy && idx < steps.length) { e.preventDefault(); advance(); }
      } else if (e.key === 'ArrowLeft') {
        if (!busy && idx > 0 && resetFn) { e.preventDefault(); back(); }
      }
    }
    document.addEventListener('keydown', onKey);
    cleanups.push(function () { stopRaf(); document.removeEventListener('keydown', onKey); });

    return {
      runSteps: runSteps,
      animate: animate,
      cancel: cancel,
      advance: advance,
      back: back,
      get stepMode() { return stepMode; }
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* --------------------------------------------------------------------- */
  global.MathsView = { register, start };

})(window);
