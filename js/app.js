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
  function buildFilters() {
    const box = document.getElementById('filters');
    // Dérivé de LEVELS : pas de liste de niveaux en double à maintenir.
    const opts = [{ key: 'all', label: 'Tout' }].concat(
      Object.keys(LEVELS).map(k => ({ key: k, label: LEVELS[k].short }))
    );
    box.innerHTML = '';
    opts.forEach(o => {
      const b = document.createElement('button');
      b.textContent = o.label;
      b.className = o.key === activeFilter ? 'active' : '';
      b.onclick = () => { activeFilter = o.key; buildFilters(); buildMenu(); buildCards(); };
      box.appendChild(b);
    });
  }

  function visibleLessons() {
    const q = (document.getElementById('search').value || '').trim().toLowerCase();
    return registry.filter(l => {
      const okLevel = activeFilter === 'all' || l.level === activeFilter;
      const hay = (l.title + ' ' + (l.theme || '') + ' ' + (l.description || '')).toLowerCase();
      const okSearch = !q || hay.includes(q);
      return okLevel && okSearch;
    });
  }

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

      group.forEach(l => {
        const a = document.createElement('a');
        a.textContent = l.title;
        a.href = '#' + l.id;
        a.dataset.id = l.id;
        menu.appendChild(a);
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

  function buildCards() {
    const box = document.getElementById('cards');
    box.innerHTML = '';
    visibleLessons().forEach(l => {
      const card = document.createElement('div');
      card.className = 'card';
      card.onclick = () => { location.hash = l.id; };
      const badge = LEVELS[l.level] ? LEVELS[l.level].badge : '';
      card.innerHTML =
        '<span class="badge ' + badge + '">' +
          escapeHtml(LEVELS[l.level] ? LEVELS[l.level].label : l.level) + '</span>' +
        '<h3>' + escapeHtml(l.title) + '</h3>' +
        '<p>' + escapeHtml(l.theme || '') + '</p>';
      box.appendChild(card);
    });
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

    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-desc').innerHTML = lesson.description || '';
    document.getElementById('lesson-notes').innerHTML = lesson.notes || '';

    // (Re)création du tableau JSXGraph
    freeCurrentBoard();
    const boardEl = document.getElementById('board');
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
      addControls: addControls
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

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* --------------------------------------------------------------------- */
  global.MathsView = { register, start };

})(window);
