/*
 * Critères de divisibilité (6ème) — par 2, 3, 4, 5, 9 et 10.
 *
 * Les six critères ne regardent pas la même chose, et c'est LÀ qu'est la leçon.
 * Ils se rangent en trois familles, chacune avec sa couleur :
 *
 *   unités            (2, 5, 10) → un seul chiffre suffit          (bleu)
 *   deux derniers     (4)        → le nombre formé par 2 chiffres  (ambre)
 *   somme des chiffres (3, 9)    → il faut TOUS les chiffres       (violet)
 *
 * À chaque critère testé, les chiffres concernés s'allument dans le nombre :
 * on voit d'un coup d'œil qu'on regarde le dernier chiffre, les deux derniers,
 * ou le nombre entier. Les critères sont passés en revue un par un (comme les
 * lignes de priorité de la leçon de 5ème) : le critère s'allume, on dit ce
 * qu'on regarde, PUIS le verdict tombe.
 *
 * Le verdict est établi par le critère lui-même (chiffre des unités, somme des
 * chiffres…), pas par une division : c'est tout l'intérêt de la chose. Le reste
 * de la division, lui, sert à écrire l'égalité de conclusion (1234 = 3 × 411 + 1).
 *
 * Leçon sans figure : mv.hideBoard(), tout est en HTML dans mv.extras, et
 * l'animation est pilotée par le moteur « pas à pas » partagé. Chaque étape
 * règle un état ABSOLU (draw(m, p) ne dépend que de m et p) pour que
 * « Précédent » puisse la rejouer.
 */
MathsView.register({
  id: 'divisibilite',
  title: 'Critères de divisibilité',
  level: '6eme',
  category: 'calcul',
  subcategory: 'Nombres entiers',
  exercices: ['divisibilite'],
  theme: 'Nombres entiers — reconnaître les multiples de 2, 3, 4, 5, 9 et 10',
  description:
    'Un <strong>critère de divisibilité</strong>, c\'est un moyen de savoir si un nombre ' +
    'est dans une table <strong>sans poser la division</strong>.' +
    '<br>Certains critères ne regardent que le <strong>dernier chiffre</strong> (2, 5, 10), ' +
    'un regarde les <strong>deux derniers</strong> (4), et deux ont besoin de la ' +
    '<strong>somme de tous les chiffres</strong> (3, 9). Les chiffres utilisés ' +
    's\'allument dans le nombre.' +
    '<br>Écris un nombre (ou clique sur 🎲), puis sur <strong>Animer</strong> ' +
    '— ou coche <strong>Pas à pas</strong> pour tester un critère à la fois.',
  notes:
    '<ul>' +
    '<li><strong>Par 2</strong> : le chiffre des unités est 0, 2, 4, 6 ou 8 (le nombre est <em>pair</em>).</li>' +
    '<li><strong>Par 5</strong> : le chiffre des unités est 0 ou 5. ' +
    '<strong>Par 10</strong> : il est 0.</li>' +
    '<li><strong>Par 4</strong> : le nombre formé par les <strong>deux derniers chiffres</strong> ' +
    'est un multiple de 4 (\\(1\\,236\\) : on regarde \\(36 = 4 \\times 9\\), donc oui).</li>' +
    '<li><strong>Par 3</strong> : la <strong>somme des chiffres</strong> est un multiple de 3. ' +
    '<strong>Par 9</strong> : elle est un multiple de 9.</li>' +
    '<li>Si la somme est encore grande, on peut <strong>recommencer</strong> : ' +
    '\\(9\\,999 \\to 36 \\to 9\\).</li>' +
    '<li>Des critères s\'entraînent : divisible par <strong>10</strong> ⟹ divisible par ' +
    '<strong>2</strong> et par <strong>5</strong> ; divisible par <strong>9</strong> ⟹ ' +
    'divisible par <strong>3</strong> ; divisible par <strong>4</strong> ⟹ divisible par ' +
    '<strong>2</strong>.</li>' +
    '<li><strong>Attention</strong> : divisible par 2 <em>et</em> par 3, c\'est divisible par 6 — ' +
    'mais divisible par 2 <em>et</em> par 4 ne donne rien de plus que 4.</li>' +
    '</ul>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();   // leçon sans figure

    /* ==================================================================== */
    /* Les trois familles : ce qu'un critère a besoin de regarder            */
    /* ==================================================================== */
    var FAM = {
      u:  { nom: 'le chiffre des unités', couleur: 'u' },
      dd: { nom: 'les deux derniers chiffres', couleur: 'dd' },
      s:  { nom: 'la somme de tous les chiffres', couleur: 's' }
    };

    var CRITERES = [
      { d: 2,  fam: 'u',  regle: 'le chiffre des <b>unités</b> est 0, 2, 4, 6 ou 8' },
      { d: 3,  fam: 's',  regle: 'la <b>somme des chiffres</b> est dans la table de 3' },
      { d: 4,  fam: 'dd', regle: 'les <b>deux derniers chiffres</b> forment un multiple de 4' },
      { d: 5,  fam: 'u',  regle: 'le chiffre des <b>unités</b> est 0 ou 5' },
      { d: 9,  fam: 's',  regle: 'la <b>somme des chiffres</b> est dans la table de 9' },
      { d: 10, fam: 'u',  regle: 'le chiffre des <b>unités</b> est 0' }
    ];

    /* ==================================================================== */
    /* Lecture du nombre saisi                                               */
    /* ==================================================================== */
    // On travaille sur la CHAÎNE des chiffres : c'est elle que les critères
    // regardent, et elle évite toute limite de calcul sur les grands nombres.
    function lire(txt) {
      // \s couvre l'espace insécable : « 1 234 » collé depuis le cours passe tel quel.
      var s = String(txt).replace(/[\s.]/g, '');
      if (s === '') return { ok: false, msg: 'Écris un nombre entier, par exemple 1 234.' };
      if (/^[+-]/.test(s)) return { ok: false, msg: 'Les critères s\'appliquent aux nombres entiers positifs.' };
      if (/[,]/.test(s)) return { ok: false, msg: 'Il faut un nombre <b>entier</b> (sans virgule).' };
      if (!/^\d+$/.test(s)) return { ok: false, msg: 'Écris seulement des chiffres.' };
      s = s.replace(/^0+(?=\d)/, '');                   // 007 → 7
      if (s.length > 12) return { ok: false, msg: 'Essaie un nombre plus court (12 chiffres au maximum).' };
      if (s === '0') return { ok: false, msg: 'Prends un nombre supérieur à 0 (le cas de 0 est à part : il est dans toutes les tables).' };
      return { ok: true, chiffres: s };
    }

    function sommeChiffres(s) {
      var t = 0;
      for (var i = 0; i < s.length; i++) t += +s.charAt(i);
      return t;
    }
    // Le nombre formé par les deux derniers chiffres (ou le nombre lui-même
    // s'il n'en a qu'un).
    function deuxDerniers(s) { return parseInt(s.slice(-2), 10); }
    function unites(s) { return +s.charAt(s.length - 1); }

    // Reste de la division par d, calculé sur les chiffres (pas de limite de
    // taille) : sert à écrire n = d × q + r.
    function reste(s, d) {
      var r = 0;
      for (var i = 0; i < s.length; i++) r = (r * 10 + (+s.charAt(i))) % d;
      return r;
    }
    function quotient(s, d) {                 // division posée, chiffre à chiffre
      var q = '', r = 0;
      for (var i = 0; i < s.length; i++) {
        var c = r * 10 + (+s.charAt(i));
        q += Math.floor(c / d);
        r = c % d;
      }
      return q.replace(/^0+(?=\d)/, '');
    }
    // Écriture française : 1234 → « 1 234 » (espaces insécables).
    function fmt(s) {
      var out = '';
      for (var i = 0; i < s.length; i++) {
        if (i > 0 && (s.length - i) % 3 === 0) out += '\u00a0';   // espace insécable
        out += s.charAt(i);
      }
      return out;
    }

    /* ==================================================================== */
    /* Le test d'un critère                                                  */
    /* ==================================================================== */
    // Renvoie ce qu'il faut dire ET le verdict — établi par le critère
    // lui-même. { ok, regarde, valeur, test }
    function tester(c, s) {
      var d = c.d;
      if (c.fam === 'u') {
        var u = unites(s);
        var ok = d === 2 ? (u % 2 === 0) : (d === 5 ? (u === 0 || u === 5) : (u === 0));
        var dit;
        if (d === 2) {
          dit = ok
            ? '<b>' + u + '</b> est l\'un de 0, 2, 4, 6, 8 : le nombre est <b>pair</b>.'
            : '<b>' + u + '</b> n\'est pas l\'un de 0, 2, 4, 6, 8 : le nombre est <b>impair</b>.';
        } else if (d === 5) {
          dit = ok ? '<b>' + u + '</b> est bien 0 ou 5.' : '<b>' + u + '</b> n\'est ni 0 ni 5.';
        } else {
          dit = ok ? 'C\'est bien un <b>0</b>.' : 'Ce n\'est pas un <b>0</b>.';
        }
        return {
          ok: ok,
          regarde: 'Le chiffre des <b>unités</b> est <b class="div-val">' + u + '</b>.',
          test: dit
        };
      }
      if (c.fam === 'dd') {
        var dd = deuxDerniers(s);                 // la valeur : 04 → 4
        var ddTxt = s.length === 1 ? s : s.slice(-2);   // l'écriture : « 04 »
        var okd = dd % 4 === 0;
        var q = Math.floor(dd / 4);
        return {
          ok: okd,
          regarde: s.length === 1
            ? 'Le nombre n\'a qu\'un chiffre : on regarde <b class="div-val">' + ddTxt + '</b>.'
            : 'Les <b>deux derniers chiffres</b> forment <b class="div-val">' + ddTxt + '</b>.',
          // Le cas « 00 » mérite sa phrase : c'est un multiple de 100, donc de 4.
          test: dd === 0
            ? 'Un nombre qui se termine par <b>00</b> est un multiple de 100 — donc de 4.'
            : (okd
              ? '4 × ' + q + ' = <b>' + dd + '</b> : c\'est bien un multiple de 4.'
              : '4 × ' + q + ' = ' + (4 * q) + ' et 4 × ' + (q + 1) + ' = ' + (4 * (q + 1)) +
                ' : <b>' + dd + '</b> tombe entre les deux.')
        };
      }
      // Famille « somme des chiffres » : 3 et 9.
      var som = sommeChiffres(s);
      var oks = som % d === 0;
      var qs = Math.floor(som / d);
      var addition = '';
      for (var i = 0; i < s.length; i++) addition += (i ? ' + ' : '') + s.charAt(i);
      var t = oks
        ? d + ' × ' + qs + ' = <b>' + som + '</b> : la somme est dans la table de ' + d + '.'
        : d + ' × ' + qs + ' = ' + (d * qs) + ' et ' + d + ' × ' + (qs + 1) + ' = ' + (d * (qs + 1)) +
          ' : <b>' + som + '</b> tombe entre les deux.';
      // Si la somme est encore grande, on peut recommencer — c'est le même
      // critère appliqué une seconde fois.
      if (som >= 10) {
        var som2 = sommeChiffres(String(som));
        t += ' <span class="div-again">(on peut recommencer : ' +
             String(som).split('').join(' + ') + ' = ' + som2 + ')</span>';
      }
      return {
        ok: oks,
        regarde: 'Somme des chiffres : <b>' + addition + ' = <span class="div-val">' + som + '</span></b>.',
        test: t
      };
    }

    /* ==================================================================== */
    /* Interface                                                             */
    /* ==================================================================== */
    var EXEMPLES = ['360', '1 234', '2 025', '4 536', '1 000', '891'];

    var root = document.createElement('div');
    root.className = 'div-ui';
    root.innerHTML =
      '<div class="div-entry">' +
        '<span class="div-entry-lab">Le nombre :</span>' +
        '<input class="div-input" type="text" inputmode="numeric" autocomplete="off" spellcheck="false">' +
        '<button class="div-rand" type="button" title="Un autre nombre au hasard">🎲 Autre nombre</button>' +
      '</div>' +
      '<div class="div-ex"></div>' +
      '<div class="div-msg"></div>' +
      '<div class="div-work">' +
        '<div class="div-left">' +
          '<div class="div-look"></div>' +
          '<div class="div-cells"></div>' +
          '<div class="div-detail"></div>' +
          '<div class="div-verdict-big"></div>' +
        '</div>' +
        '<div class="div-rules"></div>' +
      '</div>';
    mv.extras.appendChild(root);

    var input = root.querySelector('.div-input');
    var randBtn = root.querySelector('.div-rand');
    var exBox = root.querySelector('.div-ex');
    var msgEl = root.querySelector('.div-msg');
    var lookEl = root.querySelector('.div-look');
    var cellsEl = root.querySelector('.div-cells');
    var detailEl = root.querySelector('.div-detail');
    var bigEl = root.querySelector('.div-verdict-big');
    var rulesEl = root.querySelector('.div-rules');

    // Les six lignes de critères, à droite.
    CRITERES.forEach(function (c, i) {
      var row = document.createElement('div');
      row.className = 'div-rule fam-' + c.fam;
      row.dataset.i = String(i);
      row.innerHTML =
        '<span class="div-d">' + c.d + '</span>' +
        '<span class="div-txt">' + c.regle + '</span>' +
        '<span class="div-verdict">?</span>';
      rulesEl.appendChild(row);
    });
    var ruleEls = rulesEl.querySelectorAll('.div-rule');

    var anim = mv.createAnimator();

    EXEMPLES.forEach(function (ex) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = ex;
      b.onclick = function () { input.value = ex; lastKey = ex.replace(/\D/g, ''); arm(); };
      exBox.appendChild(b);
    });

    /* ==================================================================== */
    /* État courant                                                          */
    /* ==================================================================== */
    var chiffres = '1234';       // le nombre, en chiffres
    var verdicts = [];           // le résultat de chaque critère

    /* ==================================================================== */
    /* Rendu                                                                 */
    /* ==================================================================== */
    // Les chiffres, en cases. `mis` = indices des chiffres allumés, `fam` = leur
    // couleur. Les cases sont groupées par 3 comme à l'écrit.
    function dessineChiffres(mis, fam) {
      var html = '';
      for (var i = 0; i < chiffres.length; i++) {
        var grp = (i > 0 && (chiffres.length - i) % 3 === 0) ? ' div-grp' : '';
        var on = mis && mis.indexOf(i) !== -1 ? ' on fam-' + fam : '';
        html += '<span class="div-cell' + grp + on + '">' + chiffres.charAt(i) + '</span>';
      }
      cellsEl.innerHTML = html;
    }
    // Les indices des chiffres qu'un critère regarde.
    function regardes(c) {
      var L = chiffres.length, out = [], i;
      if (c.fam === 'u') return [L - 1];
      if (c.fam === 'dd') return L === 1 ? [0] : [L - 2, L - 1];
      for (i = 0; i < L; i++) out.push(i);
      return out;
    }

    function majRegles(actif, jusqua) {
      for (var i = 0; i < ruleEls.length; i++) {
        var el = ruleEls[i];
        var vu = i < jusqua;                       // ce critère a déjà rendu son verdict
        el.classList.toggle('active', i === actif);
        el.classList.toggle('done', vu && i !== actif);
        var v = el.querySelector('.div-verdict');
        v.textContent = vu ? (verdicts[i] ? '✔' : '✘') : '?';
        v.className = 'div-verdict' + (vu ? (verdicts[i] ? ' oui' : ' non') : '');
      }
    }

    /* ==================================================================== */
    /* Le fil de l'animation                                                 */
    /* ==================================================================== */
    // moment 0        : le nombre, rien de testé
    // moments 1..6    : un critère chacun (on regarde, puis le verdict tombe)
    // moment 7        : le bilan
    // Le contenu ne change qu'à deux instants par étape (le début, puis la
    // mi-course où le verdict tombe) : inutile de réécrire le HTML 60 fois par
    // seconde. Le rendu reste entièrement déterminé par (m, p).
    var dernierRendu = null;
    function draw(m, p) {
      var cle = chiffres + '|' + m + '|' + (p >= 0.5 ? 1 : 0);
      if (cle === dernierRendu) return;
      dernierRendu = cle;

      if (m === 0) {
        lookEl.innerHTML = 'On va tester les six critères, l\'un après l\'autre.';
        dessineChiffres(null, null);
        detailEl.innerHTML = '';
        bigEl.innerHTML = ''; bigEl.className = 'div-verdict-big';
        majRegles(-1, 0);
        return;
      }
      if (m > CRITERES.length) { bilan(); return; }

      var c = CRITERES[m - 1];
      var r = tester(c, chiffres);
      var revele = p >= 0.5;                       // le verdict n'apparaît qu'à mi-étape

      lookEl.innerHTML = 'Pour <b>' + c.d + '</b>, on regarde <b class="fam-txt fam-' + c.fam + '">' +
                         FAM[c.fam].nom + '</b>.';
      dessineChiffres(regardes(c), c.fam);
      detailEl.innerHTML = '<div class="div-line">' + r.regarde + '</div>' +
        (revele ? '<div class="div-line">' + r.test + '</div>' : '');

      if (revele) {
        var q = quotient(chiffres, c.d), rr = reste(chiffres, c.d);
        bigEl.className = 'div-verdict-big ' + (r.ok ? 'oui' : 'non');
        bigEl.innerHTML = r.ok
          ? '<b>✔ ' + fmt(chiffres) + ' est divisible par ' + c.d + '</b>' +
            '<span class="div-egal">' + fmt(chiffres) + ' = ' + c.d + ' × ' + fmt(q) + '</span>'
          : '<b>✘ ' + fmt(chiffres) + ' n\'est pas divisible par ' + c.d + '</b>' +
            '<span class="div-egal">' + fmt(chiffres) + ' = ' + c.d + ' × ' + fmt(q) + ' + ' + rr + '</span>';
      } else {
        bigEl.innerHTML = ''; bigEl.className = 'div-verdict-big';
      }
      majRegles(m - 1, revele ? m : m - 1);
    }

    function bilan() {
      var oui = [], non = [];
      CRITERES.forEach(function (c, i) { (verdicts[i] ? oui : non).push(c.d); });
      lookEl.innerHTML = 'Bilan pour <b>' + fmt(chiffres) + '</b>.';
      dessineChiffres(null, null);

      function liste(t) { return t.length > 1 ? t.slice(0, -1).join(', ') + ' et ' + t[t.length - 1] : t[0]; }
      var h = '';
      if (oui.length) h += '<div class="div-line"><b class="div-oui">✔ divisible par ' + liste(oui) + '</b></div>';
      if (non.length) h += '<div class="div-line"><b class="div-non">✘ pas divisible par ' + liste(non) + '</b></div>';
      // Les critères s'entraînent : on le fait remarquer quand ça se voit.
      var rem = [];
      var a = {};
      CRITERES.forEach(function (c, i) { a[c.d] = verdicts[i]; });
      if (a[10]) rem.push('divisible par <b>10</b>, donc forcément par <b>2</b> et par <b>5</b>');
      if (a[9]) rem.push('divisible par <b>9</b>, donc forcément par <b>3</b>');
      if (a[4] && !a[10]) rem.push('divisible par <b>4</b>, donc forcément par <b>2</b>');
      if (a[2] && a[3]) rem.push('divisible par <b>2</b> et par <b>3</b> : il l\'est donc aussi par <b>6</b>');
      if (rem.length) h += '<div class="div-rem">À remarquer : ' + rem.join(' ; ') + '.</div>';
      detailEl.innerHTML = h;
      bigEl.innerHTML = ''; bigEl.className = 'div-verdict-big';
      majRegles(-1, CRITERES.length);
    }

    /* ==================================================================== */
    /* Armement                                                              */
    /* ==================================================================== */
    var lastKey = null;

    function arm() {
      var lu = lire(input.value);
      marqueExemples();
      if (!lu.ok) {
        lastKey = null;
        msgEl.innerHTML = lu.msg;
        lookEl.innerHTML = ''; cellsEl.innerHTML = ''; detailEl.innerHTML = '';
        bigEl.innerHTML = ''; bigEl.className = 'div-verdict-big';
        verdicts = [];
        majRegles(-1, 0);
        anim.runSteps([], null);
        return;
      }
      msgEl.innerHTML = '';
      chiffres = lu.chiffres;
      verdicts = CRITERES.map(function (c) { return tester(c, chiffres).ok; });

      function reset() { draw(0, 1); }
      var steps = [];
      for (var m = 1; m <= CRITERES.length + 1; m++) {
        (function (m) {
          steps.push({
            dur: m > CRITERES.length ? 700 : 950,
            step: function (p) { draw(m, p); },
            after: function () { draw(m, 1); }
          });
        })(m);
      }
      reset();
      anim.runSteps(steps, reset);
    }

    function marqueExemples() {
      var v = input.value.replace(/\D/g, '');
      var btns = exBox.querySelectorAll('button');
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle('active', btns[i].textContent.replace(/\D/g, '') === v);
      }
    }

    input.oninput = function () {
      var key = input.value.replace(/\s/g, '');
      if (key === lastKey) return;
      lastKey = key;
      arm();
    };

    /* ---- Tirage au hasard : des nombres qui font réagir les critères ----- */
    function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    // On tire un multiple d'un « socle » : les critères tombent rarement tous
    // à ✘, et jamais tous à ✔ par hasard.
    var SOCLES = [1, 1, 2, 3, 4, 5, 9, 10, 6, 12, 15, 18, 20, 36, 45, 90];
    randBtn.onclick = function () {
      var v;
      do { v = String(SOCLES[ri(0, SOCLES.length - 1)] * ri(3, 240)); } while (v === chiffres);
      input.value = fmt(v);
      lastKey = v;
      arm();
    };

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: arm }
    ]);

    input.value = '1 234';
    lastKey = '1234';
    arm();
  }
});
