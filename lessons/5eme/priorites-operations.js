/*
 * Enchaînement d'opérations : les priorités (5ème).
 *
 * Le message clé, dans l'ordre :
 *   1. les PARENTHÈSES d'abord (la plus intérieure en premier) ;
 *   2. puis les × et ÷, DE GAUCHE À DROITE ;
 *   3. puis les + et −, DE GAUCHE À DROITE.
 *
 * Le « de gauche à droite » n'est pas un détail décoratif : c'est le cœur de la
 * leçon. Pour ÷ et − il change le résultat (36 ÷ 6 ÷ 3 vaut 2, pas 18), alors
 * que pour × et + il ne change rien. Chaque fois que le calcul rencontre deux
 * ÷ (ou deux −) à la suite, la leçon affiche le PIÈGE : le résultat qu'on
 * obtiendrait en commençant par la droite, et le fait qu'il est faux.
 *
 * Le calcul se déroule ligne par ligne, comme au tableau : l'opération choisie
 * est encadrée sur la ligne du haut, son résultat apparaît en vert sur la ligne
 * suivante. Les lignes déjà faites gardent leur encadré : on lit d'un coup
 * d'œil l'ordre dans lequel les opérations ont été menées.
 *
 * Tous les calculs sont EXACTS (fractions d'entiers, jamais de flottants) :
 * 10 ÷ 4 donne 2,5 et 10 ÷ 3 donne la fraction 10/3, sans arrondi.
 *
 * Leçon sans figure : mv.hideBoard(), tout est en HTML dans mv.extras, et
 * l'animation est pilotée par le moteur « pas à pas » partagé (une étape = une
 * opération). Les étapes règlent un état ABSOLU (draw(t, p) ne dépend que de t
 * et p), pour que « Précédent » puisse les rejouer.
 */
MathsView.register({
  id: 'priorites-operations',
  title: 'Enchaînement d\'opérations et priorités',
  level: '5eme',
  category: 'calcul',
  subcategory: 'Enchaînement d\'opérations',
  exercices: ['priorites'],
  theme: 'Priorités opératoires — parenthèses, puis × et ÷, puis + et −',
  description:
    'Dans un calcul à plusieurs opérations, on ne calcule <strong>pas</strong> dans ' +
    'l\'ordre où c\'est écrit : il y a des <strong>priorités</strong>.' +
    '<br>D\'abord les <strong>parenthèses</strong>, puis les <strong>× et ÷</strong>, ' +
    'puis les <strong>+ et −</strong> — et, à priorité égale, ' +
    '<strong>de gauche à droite</strong>.' +
    '<br>À droite, les <strong>trois lignes</strong> s\'allument <strong>à tour de rôle</strong> : ' +
    'on fait <em>tous</em> les calculs de la ligne allumée avant de descendre à la suivante ' +
    '— même quand il n\'y a rien à y faire, on vérifie.' +
    '<br>Choisis un calcul (ou écris le tien), puis clique sur <strong>Animer</strong> ' +
    '— ou coche <strong>Pas à pas</strong> et avance d\'une opération à la fois.',
  notes:
    '<ul>' +
    '<li><strong>1. Les parenthèses</strong> : on calcule ce qu\'il y a dedans en premier. ' +
    'S\'il y en a plusieurs emboîtées, on commence par la <strong>plus intérieure</strong>.</li>' +
    '<li><strong>2. Les × et ÷</strong> : ils passent avant les + et −. ' +
    'Ainsi \\(5 + 3 \\times 4 = 5 + 12 = 17\\) (et non 32).</li>' +
    '<li><strong>3. Les + et −</strong> : en dernier.</li>' +
    '<li><strong>À priorité égale, on va de gauche à droite.</strong> C\'est là que ça se joue : ' +
    '\\(36 \\div 6 \\div 3 = 6 \\div 3 = 2\\). En commençant par la droite on trouverait 18 : ' +
    '<strong>c\'est faux</strong>.</li>' +
    '<li>Même piège avec deux soustractions : \\(20 - 8 - 5 = 12 - 5 = 7\\), et non 17.</li>' +
    '<li>En revanche, pour deux <strong>×</strong> (ou deux <strong>+</strong>) l\'ordre n\'a aucune ' +
    'importance : le résultat est le même.</li>' +
    '<li>Une parenthèse sert justement à <strong>forcer</strong> une opération à passer en premier : ' +
    '\\((5 + 3) \\times 4 = 8 \\times 4 = 32\\).</li>' +
    '</ul>',

  setup: function (board, mv) {
    if (mv.hideBoard) mv.hideBoard();   // leçon sans figure

    /* ==================================================================== */
    /* Nombres exacts : des rationnels n/d, jamais de flottants             */
    /* ==================================================================== */
    function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
    function rat(n, d) {
      if (d === undefined) d = 1;
      if (d < 0) { n = -n; d = -d; }
      var g = pgcd(n, d);
      return { n: n / g, d: d / g };
    }
    function rAdd(a, b) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
    function rSub(a, b) { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
    function rMul(a, b) { return rat(a.n * b.n, a.d * b.d); }
    function rDiv(a, b) { return b.n === 0 ? null : rat(a.n * b.d, a.d * b.n); }

    // Le dénominateur ne contient que des 2 et des 5 → écriture décimale finie.
    function decimal(d) { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }

    // Écriture d'un nombre : entier, décimal à la française, ou fraction empilée.
    function numHtml(r) {
      if (r.d === 1) return signe(String(r.n));
      if (decimal(r.d)) return signe(String(r.n / r.d).replace('.', ','));
      var neg = r.n < 0;
      return (neg ? '−' : '') + '<span class="pri-frac"><span class="pri-fn">' + Math.abs(r.n) +
             '</span><span class="pri-fd">' + r.d + '</span></span>';
    }
    function signe(s) { return s.replace('-', '−'); }   // vrai signe moins

    function applique(a, op, b) {
      if (op === '+') return rAdd(a, b);
      if (op === '−') return rSub(a, b);
      if (op === '×') return rMul(a, b);
      return rDiv(a, b);                                 // null si b = 0
    }

    /* ==================================================================== */
    /* Lecture du calcul saisi → liste de jetons                            */
    /* ==================================================================== */
    // Jetons : { t:'num', v:rationnel } | { t:'op', v:'+'|'−'|'×'|'÷' } | { t:'(' } | { t:')' }
    function lire(str) {
      var s = String(str)
        .replace(/\s+/g, '')
        .replace(/[*xX×·]/g, '×')
        .replace(/[/:÷]/g, '÷')
        .replace(/[−–—]/g, '-')
        .replace(/[[{]/g, '(').replace(/[\]}]/g, ')');
      if (!s) return { ok: false, msg: 'Écris un calcul, par exemple 5 + 3 × 4.' };

      var toks = [], i = 0, depth = 0, attendNombre = true;
      while (i < s.length) {
        var c = s.charAt(i);
        if (attendNombre) {
          if (c === '(') { toks.push({ t: '(' }); depth++; i++; continue; }
          var m = /^-?\d+(?:[.,]\d+)?/.exec(s.slice(i));
          if (!m) return { ok: false, msg: 'Il manque un nombre avant « ' + c +' ».' };
          toks.push({ t: 'num', v: versRat(m[0]) });
          i += m[0].length; attendNombre = false; continue;
        }
        if (c === ')') {
          if (!depth) return { ok: false, msg: 'Une parenthèse fermante est en trop.' };
          depth--; toks.push({ t: ')' }); i++; continue;
        }
        if ('+-×÷'.indexOf(c) >= 0) {
          toks.push({ t: 'op', v: c === '-' ? '−' : c });
          i++; attendNombre = true; continue;
        }
        return { ok: false, msg: 'Signe inattendu : « ' + c + ' ».' };
      }
      if (attendNombre) return { ok: false, msg: 'Le calcul n\'est pas terminé.' };
      if (depth) return { ok: false, msg: 'Il manque ' + depth + ' parenthèse' + (depth > 1 ? 's' : '') + ' fermante' + (depth > 1 ? 's' : '') + '.' };
      if (toks.length > 41) return { ok: false, msg: 'Ce calcul est un peu long — essaie plus court.' };
      return { ok: true, toks: toks };
    }

    // "3,5" → 35/10 (exact, sans passer par un flottant approché).
    function versRat(txt) {
      var neg = txt.charAt(0) === '-';
      var body = neg ? txt.slice(1) : txt;
      var p = body.replace(',', '.').split('.');
      var ent = p[0], dec = p[1] || '';
      var n = parseInt(ent + dec, 10);
      var d = Math.pow(10, dec.length);
      return rat(neg ? -n : n, d);
    }

    /* ==================================================================== */
    /* Le choix de la prochaine opération — les priorités, en code           */
    /* ==================================================================== */
    function classe(op) { return (op === '×' || op === '÷') ? 'mul' : 'add'; }

    // Renvoie null si le calcul est fini, sinon la description de l'opération
    // à faire : sa position, sa règle, et ce qu'il faut dire à l'élève.
    function prochaine(toks) {
      if (toks.length === 1) return null;

      // 1) La parenthèse la plus intérieure la plus à gauche : c'est celle qui
      //    se ferme en premier (la première ')' rencontrée).
      var i, close = -1, open = -1, s, e;
      for (i = 0; i < toks.length; i++) if (toks[i].t === ')') { close = i; break; }
      if (close !== -1) {
        for (i = close - 1; i >= 0; i--) if (toks[i].t === '(') { open = i; break; }
        s = open + 1; e = close - 1;
      } else {
        s = 0; e = toks.length - 1;          // pas de parenthèse : tout le calcul
      }

      // Une parenthèse ne contenant plus qu'un nombre : on l'enlève.
      if (s === e) return { kind: 'unparen', open: open, close: close };

      // 2) Dans cette portée (qui n'alterne que nombre / opération), les × et ÷
      //    d'abord, sinon les + et −. À chaque fois : LE PLUS À GAUCHE.
      var idx = -1, aAdd = false;
      for (i = s + 1; i < e; i += 2) {
        if (classe(toks[i].v) === 'mul') { if (idx === -1) idx = i; }
        else aAdd = true;
      }
      if (idx === -1) idx = s + 1;           // que des + et − : le premier

      var op = toks[idx].v, k = classe(op);
      // Y a-t-il une autre opération de MÊME priorité plus à droite ? (c'est le
      // « de gauche à droite » ; et si l'opération est − ou ÷, c'est un piège.)
      var suivante = -1;
      for (i = idx + 2; i < e; i += 2) if (classe(toks[i].v) === k) { suivante = i; break; }

      // Parenthèses emboîtées : reste-t-il une parenthèse ouverte avant celle-ci ?
      var nested = false, prof = 0;
      for (i = 0; i < open; i++) { if (toks[i].t === '(') prof++; else if (toks[i].t === ')') prof--; }
      if (open !== -1 && prof > 0) nested = true;

      return {
        kind: 'calc', i: idx, open: open, close: close, s: s, e: e, nested: nested,
        op: op, k: k, rule: close !== -1 ? 'par' : k,
        muDabord: k === 'mul' && aAdd,       // « × et ÷ avant + et − » a du sens ici
        gauche: suivante !== -1,             // une autre opération de même priorité suit
        colle: suivante === idx + 2 ? suivante : -1
      };
    }

    /* ==================================================================== */
    /* Déroulé complet : la suite des lignes du calcul                       */
    /* ==================================================================== */
    // states[0] = le calcul de départ ; states[t] = { toks, act, resIdx, note,
    // rule, trap, final } où `act` est la portion ENCADRÉE sur la ligne t−1.
    var states = [];

    function construire(toks) {
      states = [{ toks: toks, rule: null }];
      var garde = 0;
      while (garde++ < 40) {
        var cur = states[states.length - 1].toks;
        var info = prochaine(cur);
        if (!info) { states[states.length - 1].final = true; break; }

        if (info.kind === 'unparen') {
          var out0 = cur.filter(function (t, j) { return j !== info.open && j !== info.close; });
          states.push({
            toks: out0, act: [info.open, info.close], resIdx: info.open,
            rule: 'par',
            note: tag('par') + 'Il n\'y a plus rien à calculer dans la parenthèse : on l\'enlève.'
          });
          continue;
        }

        var a = cur[info.i - 1].v, b = cur[info.i + 1].v;
        var res = applique(a, info.op, b);
        if (res === null) {                       // division par zéro : pas de
          states.push({                           // ligne suivante (voir `dead`)
            toks: cur, act: [info.i - 1, info.i + 1], resIdx: -1, rule: info.rule,
            final: true, dead: true,
            note: '<b class="pri-tag stop">Stop</b> On ne peut pas <b>diviser par 0</b> : ce calcul n\'a pas de résultat.'
          });
          break;
        }

        // La parenthèse disparaît en même temps que sa dernière opération.
        var vide = info.close !== -1 && info.s === info.i - 1 && info.e === info.i + 1;
        var out = [], resIdx = -1;
        for (var j = 0; j < cur.length; j++) {
          if (j === info.i - 1) { resIdx = out.length; out.push({ t: 'num', v: res }); }
          else if (j === info.i || j === info.i + 1) continue;
          else if (vide && (j === info.open || j === info.close)) continue;
          else out.push(cur[j]);
        }

        states.push({
          toks: out, resIdx: resIdx, rule: info.rule,
          act: vide ? [info.open, info.close] : [info.i - 1, info.i + 1],
          note: note(info, a, b, res),
          trap: piege(cur, info, a, b, res)
        });
      }
      if (!states[states.length - 1].final) states[states.length - 1].final = true;
    }

    var TAGS = { par: '( )', mul: '× ÷', add: '+ −' };
    function tag(k) { return '<b class="pri-tag ' + k + '">' + TAGS[k] + '</b>'; }

    // Un nombre négatif s'écrit entre parenthèses dès qu'il suit une opération :
    // « 10 + (−9) », jamais « 10 + −9 ».
    function opd(r, premier) {
      var s = numHtml(r);
      return (r.n < 0 && !premier) ? '(' + s + ')' : s;
    }

    // La ligne de priorité allumée à droite dit déjà « c'est le tour des × ÷ » :
    // le commentaire d'une opération ne le répète pas. Il ne garde que ce qui
    // se joue ICI — la parenthèse la plus intérieure, la priorité du × sur le +,
    // et surtout le sens de lecture.
    function note(info, a, b, res) {
      var t = '';
      if (info.rule === 'par' && info.nested) {
        t += 'On commence par la parenthèse la <b>plus intérieure</b>. ';
      }
      if (info.muDabord) {
        t += (info.rule === 'par' ? 'Dans la parenthèse, les' : 'Les') +
             ' <b>× et ÷</b> passent avant les <b>+ et −</b>. ';
      }
      if (info.gauche) {
        t += 'Il y a plusieurs <b>' + (info.k === 'mul' ? '× ÷' : '+ −') +
             '</b> : on calcule <b class="hot">de gauche à droite</b>. ';
      }
      return tag(info.rule) + t + (t ? '<br>' : '') +
             'Je calcule <b>' + opd(a, true) + ' ' + info.op + ' ' + opd(b) +
             ' = ' + numHtml(res) + '</b>.';
    }

    // Le piège du « de gauche à droite » : il n'existe que pour − et ÷, et
    // seulement si l'opération suivante, de même priorité, est collée à celle-ci.
    function piege(cur, info, a, b, res) {
      if (info.colle === -1) return '';
      if (info.op !== '−' && info.op !== '÷') return '';
      var op2 = cur[info.colle].v, c = cur[info.colle + 1].v;
      var dedans = applique(b, op2, c);
      if (dedans === null) return '';
      var faux = applique(a, info.op, dedans);
      if (faux === null) return '';
      if (faux.n * res.d === res.n * faux.d) return '';   // même résultat : pas de piège
      return '<b>⚠️ Le piège :</b> en commençant par la <b>droite</b>, on ferait ' +
        opd(b, true) + ' ' + op2 + ' ' + opd(c) + ' = ' + numHtml(dedans) + ', puis ' +
        opd(a, true) + ' ' + info.op + ' ' + opd(dedans) + ' = <b>' + numHtml(faux) +
        '</b> — et ce serait <b>faux</b>.';
    }

    /* ==================================================================== */
    /* Interface                                                             */
    /* ==================================================================== */
    var EXEMPLES = [
      '5 + 3 × 4',
      '(5 + 3) × 4',
      '36 ÷ 6 ÷ 3',
      '48 ÷ 2 × 3',
      '20 − 8 − 5',
      '100 ÷ (2 × 5) ÷ 2',
      '5 + 3 × (8 − 6) ÷ 2',
      '12 ÷ 4 + 6 × 2 − 5',
      '2 × (3 + 4 × (5 − 3))'
    ];

    var root = document.createElement('div');
    root.className = 'pri-ui';
    root.innerHTML =
      '<div class="pri-entry">' +
        '<span class="pri-entry-lab">A =</span>' +
        '<input class="pri-input" type="text" autocomplete="off" spellcheck="false">' +
        '<button class="pri-rand" type="button" title="Un autre calcul au hasard">🎲 Autre calcul</button>' +
      '</div>' +
      '<div class="pri-ex"></div>' +
      '<div class="pri-msg"></div>' +
      // À gauche le calcul, à droite les trois lignes de priorité : elles
      // s'allument à tour de rôle et pilotent le déroulé.
      '<div class="pri-work">' +
        '<div class="pri-left">' +
          '<div class="pri-stage"><div class="pri-lines"></div></div>' +
          '<div class="pri-note"></div>' +
          '<div class="pri-trap"></div>' +
        '</div>' +
        '<div class="pri-rules">' +
          '<div class="pri-rule par" data-k="par"><span class="pri-rank">1</span>' +
            '<span class="pri-badge par">( )</span>' +
            '<span class="pri-rule-txt">Les <b>parenthèses</b>' +
              '<small>la plus intérieure d\'abord</small></span>' +
            '<span class="pri-count"></span></div>' +
          '<div class="pri-rule mul" data-k="mul"><span class="pri-rank">2</span>' +
            '<span class="pri-badge mul">× ÷</span>' +
            '<span class="pri-rule-txt">Les <b>× et ÷</b>' +
              '<small>de gauche à droite</small></span>' +
            '<span class="pri-count"></span></div>' +
          '<div class="pri-rule add" data-k="add"><span class="pri-rank">3</span>' +
            '<span class="pri-badge add">+ −</span>' +
            '<span class="pri-rule-txt">Les <b>+ et −</b>' +
              '<small>de gauche à droite</small></span>' +
            '<span class="pri-count"></span></div>' +
        '</div>' +
      '</div>';
    mv.extras.appendChild(root);

    var input = root.querySelector('.pri-input');
    var randBtn = root.querySelector('.pri-rand');
    var exBox = root.querySelector('.pri-ex');
    var msgEl = root.querySelector('.pri-msg');
    var linesEl = root.querySelector('.pri-lines');
    var noteEl = root.querySelector('.pri-note');
    var trapEl = root.querySelector('.pri-trap');
    var ruleEls = root.querySelectorAll('.pri-rule');

    var anim = mv.createAnimator();

    EXEMPLES.forEach(function (ex) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = ex;
      b.onclick = function () { input.value = ex; arm(); };
      exBox.appendChild(b);
    });

    /* ==================================================================== */
    /* Rendu d'une ligne                                                     */
    /* ==================================================================== */
    // Un nombre négatif qui suit une opération s'écrit entre parenthèses :
    // « 10 + (−3) × 3 » et non « 10 + −3 × 3 ».
    function unJeton(toks, j, res) {
      var t = toks[j];
      if (t.t === 'op') return '<span class="pri-op ' + classe(t.v) + '">' + t.v + '</span>';
      if (t.t !== 'num') return '<span class="pri-par">' + (t.t === '(' ? '(' : ')') + '</span>';
      var txt = numHtml(t.v);
      if (t.v.n < 0 && j > 0 && toks[j - 1].t === 'op') txt = '(' + txt + ')';
      return '<span class="pri-val' + (j === res ? ' pri-res' : '') + '">' + txt + '</span>';
    }

    // o = { act:[a,b], cls, hot, res } — act est la portion encadrée.
    function ligne(toks, o, style, sol) {
      var html = '', j;
      for (j = 0; j < toks.length; j++) {
        if (o.act && j === o.act[0]) html += '<span class="pri-hl ' + o.cls + (o.hot ? ' hot' : '') + '">';
        html += unJeton(toks, j, o.res);
        if (o.act && j === o.act[1]) html += '</span>';
      }
      if (sol) html += '<span class="pri-done">✔</span>';
      return '<div class="pri-line' + (sol ? ' pri-sol' : '') + '"' + style + '>' +
             '<span class="pri-name">A</span><span class="pri-egal">=</span>' + html + '</div>';
    }

    /* ==================================================================== */
    /* Le fil de l'animation : des MOMENTS                                   */
    /*                                                                       */
    /* On ne déroule pas les opérations une par une dans le vide : on passe   */
    /* les trois lignes de priorité en revue, DANS L'ORDRE. Chaque ligne      */
    /* s'allume à droite (c'est un « moment de phase »), puis on exécute les  */
    /* opérations qui lui correspondent (les « moments d'opération ») avant   */
    /* de descendre à la ligne suivante. Une ligne sans rien à faire s'allume */
    /* quand même : « il n'y en a pas ici, je passe » — c'est le réflexe à    */
    /* installer.                                                            */
    /*                                                                       */
    /* L'ordre des états produits par construire() est déjà par*, puis mul*,  */
    /* puis add* : une parenthèse ne réapparaît jamais, un × non plus. Les    */
    /* phases se lisent donc directement dans la suite des lignes.            */
    /* ==================================================================== */
    var PHASES = ['par', 'mul', 'add'];
    var moments = [];      // { kind:'start'|'phase'|'op', rule, n, sIdx, note }
    var totalPhase = {};   // nombre d'opérations de chaque ligne

    function decouper() {
      moments = [{ kind: 'start', sIdx: 0 }];
      totalPhase = { par: 0, mul: 0, add: 0 };
      var t = 1;
      PHASES.forEach(function (r) {
        var n = 0;
        while (t + n < states.length && states[t + n].rule === r) n++;
        totalPhase[r] = n;
        moments.push({ kind: 'phase', rule: r, n: n, sIdx: t - 1, note: notePhase(r, n) });
        for (var k = 0; k < n; k++) moments.push({ kind: 'op', rule: r, sIdx: t + k });
        t += n;
      });
      // Filet de sécurité : si un état échappait au découpage (division par
      // zéro dans une parenthèse, par exemple), on le joue quand même.
      while (t < states.length) { moments.push({ kind: 'op', rule: states[t].rule, sIdx: t }); t++; }
      // Une fois le calcul réduit à un nombre, il n'y a plus rien à vérifier :
      // on ne passe pas en revue les lignes vides qui suivent — l'animation
      // s'achève sur le résultat. (Sauf s'il n'y avait aucune opération : on
      // garde alors les trois lignes, il faut bien montrer quelque chose.)
      var aCalcule = moments.some(function (mo) { return mo.kind === 'op'; });
      while (aCalcule && moments[moments.length - 1].kind === 'phase') moments.pop();
    }

    var LIGNES = {
      par: { rang: 'Ligne 1', quoi: 'les <b>parenthèses</b>' },
      mul: { rang: 'Ligne 2', quoi: 'les <b>× et ÷</b>' },
      add: { rang: 'Ligne 3', quoi: 'les <b>+ et −</b>' }
    };
    function notePhase(r, n) {
      var t = tag(r) + '<b>' + LIGNES[r].rang + '</b> — ' + LIGNES[r].quoi + '. ';
      if (n === 0) {
        return t + 'Il n\'y en a pas dans ce calcul : je <b>passe à la ligne du dessous</b>.';
      }
      if (r === 'par') {
        return t + (n === 1 ? 'Il y a <b>1 calcul</b> à faire entre parenthèses'
                            : 'Il y a <b>' + n + ' calculs</b> à faire entre parenthèses') +
               ' : c\'est par là qu\'on commence.';
      }
      return t + (n === 1 ? 'Il y a <b>1 opération</b> à faire'
                          : 'Il y a <b>' + n + ' opérations</b> à faire, ' +
                            '<b class="hot">de gauche à droite</b>') + '.';
    }

    /* ==================================================================== */
    /* Dessin d'un moment : draw(m, p) ne dépend QUE de m et p (idempotent)   */
    /* ==================================================================== */
    function draw(m, p) {
      var mo = moments[m];
      var op = (mo.kind === 'op');
      var top = mo.sIdx;                          // dernière ligne écrite ici
      // Sur un moment d'opération : première moitié, on encadre l'opération et
      // la ligne suivante n'est pas encore écrite ; seconde moitié, elle
      // apparaît en fondu.
      var dernier = (op && p < 0.5) ? top - 1 : top;
      if (op && states[top].dead) dernier = top - 1;   // calcul impossible : rien à écrire

      var html = '';
      for (var i = 0; i <= dernier; i++) {
        var st = states[i];
        var o = { res: i >= 1 ? st.resIdx : -1 };
        if (i + 1 <= top && states[i + 1]) {       // cette ligne a servi (ou sert) de source
          o.act = states[i + 1].act;
          o.cls = states[i + 1].rule || 'add';
          o.hot = op && (i === top - 1);
        }
        var style = '';
        if (op && i === top && p < 1) style = ' style="opacity:' + ((p - 0.5) / 0.5).toFixed(3) + '"';
        html += ligne(st.toks, o, style, i === top && st.final && (!op || p >= 1));
      }
      linesEl.innerHTML = html;

      var vu = p > 0.12;
      var st2 = op ? states[top] : null;
      noteEl.innerHTML = !vu ? '' : (op ? (st2.note || '') : (mo.note || ''));
      trapEl.innerHTML = (op && p >= 1 && st2.trap) ? st2.trap : '';
      trapEl.style.display = trapEl.innerHTML ? '' : 'none';
      majRegles(m, p);
    }

    // Les trois lignes de droite : celle en cours en surbrillance, celles déjà
    // passées barrées, et le décompte de ce qu'il reste à y faire.
    function majRegles(m, p) {
      var mo = moments[m];
      var actif = mo.rule || null;
      // Le calcul est terminé : le panneau se referme, y compris les lignes
      // vides qu'on n'a pas eu besoin de visiter.
      var termine = m === moments.length - 1 && mo.kind === 'op' && p >= 1 &&
                    states[mo.sIdx].final;
      for (var i = 0; i < ruleEls.length; i++) {
        var el = ruleEls[i], r = el.dataset.k;
        var reste = restant(r, m);
        var passee = actif && PHASES.indexOf(r) < PHASES.indexOf(actif);
        var finie = termine || passee ||
                    (r === actif && reste === 0 && (mo.kind === 'op' ? p >= 1 : mo.n === 0));
        var enCours = (r === actif) && !finie;
        el.classList.toggle('active', enCours);
        el.classList.toggle('done', !!finie);
        var c = el.querySelector('.pri-count');
        if (c) {
          c.textContent = finie ? (totalPhase[r] === 0 ? '—' : '✔')
            : (enCours ? (reste === 0 ? 'rien' : reste + ' à faire')
                       : (totalPhase[r] === 0 ? '—' : String(totalPhase[r])));
        }
      }
    }
    // Opérations de la ligne r qu'il reste à faire APRÈS le moment m.
    function restant(r, m) {
      var n = 0;
      for (var i = m + 1; i < moments.length; i++) {
        if (moments[i].kind === 'op' && moments[i].rule === r) n++;
      }
      return n;
    }

    /* ==================================================================== */
    /* Armement                                                              */
    /* ==================================================================== */
    var lastKey = null;

    function arm() {
      var brut = input.value;
      var lu = lire(brut);
      if (!lu.ok) {
        lastKey = null;
        msgEl.textContent = lu.msg;
        linesEl.innerHTML = '';
        noteEl.innerHTML = ''; trapEl.innerHTML = ''; trapEl.style.display = 'none';
        videRegles();
        anim.runSteps([], null);
        marqueExemples();
        return;
      }
      msgEl.textContent = '';
      construire(lu.toks);
      decouper();
      marqueExemples();

      function reset() { draw(0, 1); }
      // Une étape = un moment : d'abord la ligne de priorité qui s'allume,
      // puis chacune de ses opérations. Une phase vide passe plus vite.
      var steps = [];
      for (var m = 1; m < moments.length; m++) {
        (function (m) {
          steps.push({
            dur: moments[m].kind === 'phase' ? (moments[m].n === 0 ? 650 : 800) : 950,
            step: function (p) { draw(m, p); },
            after: function () { draw(m, 1); }
          });
        })(m);
      }
      reset();
      anim.runSteps(steps, reset);
    }

    // Calcul illisible : les trois lignes retournent au repos.
    function videRegles() {
      for (var i = 0; i < ruleEls.length; i++) {
        ruleEls[i].classList.remove('active');
        ruleEls[i].classList.remove('done');
        var c = ruleEls[i].querySelector('.pri-count');
        if (c) c.textContent = '';
      }
    }

    function marqueExemples() {
      var v = input.value.replace(/\s+/g, '');
      var btns = exBox.querySelectorAll('button');
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle('active', btns[i].textContent.replace(/\s+/g, '') === v);
      }
    }

    input.oninput = function () {
      var key = input.value.replace(/\s+/g, '');
      if (key === lastKey) return;
      lastKey = key;
      arm();
    };

    /* ---- Tirage au hasard : des calculs qui « tombent juste » ------------ */
    function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    var MODELES = [
      function () { return ri(2, 20) + ' + ' + ri(2, 9) + ' × ' + ri(2, 9); },
      function () { var b = ri(2, 6), c = ri(2, 6); return (b * c * ri(2, 5)) + ' ÷ ' + b + ' ÷ ' + c; },
      function () { var b = ri(2, 6); return (b * ri(2, 9)) + ' ÷ ' + b + ' × ' + ri(2, 6); },
      function () { var b = ri(2, 15), c = ri(2, 15); return (b + c + ri(1, 20)) + ' − ' + b + ' − ' + c; },
      function () { return '(' + ri(2, 15) + ' + ' + ri(2, 15) + ') × ' + ri(2, 9); },
      function () { var c = ri(2, 5), d = ri(2, 6); return ri(2, 20) + ' + ' + (c * d) + ' ÷ ' + c + ' × ' + ri(2, 5); },
      function () { var d = ri(2, 5), k = ri(2, 6); return ri(2, 12) + ' × (' + ri(2, 9) + ' + ' + (d * k) + ' ÷ ' + d + ')'; },
      function () { var b = ri(2, 6), c = ri(2, 5); return (b * c * ri(2, 4)) + ' ÷ (' + b + ' × ' + c + ') + ' + ri(2, 15); },
      function () { var d = ri(2, 6); return ri(2, 9) + ' × (' + ri(2, 9) + ' + ' + ri(2, 6) + ' × (' + (d + ri(1, 6)) + ' − ' + d + '))'; },
      // Le dernier terme reste petit : le résultat ne devient jamais négatif.
      function () { var b = ri(2, 8), c = ri(2, 6); return (b * c) + ' ÷ ' + b + ' + ' + ri(2, 9) + ' × ' + ri(2, 6) + ' − ' + ri(2, 6); }
    ];
    randBtn.onclick = function () {
      var v;
      do { v = MODELES[ri(0, MODELES.length - 1)](); } while (v === input.value);
      input.value = v;
      lastKey = v.replace(/\s+/g, '');
      arm();
    };

    /* ==================================================================== */
    /* Contrôles (le « Pas à pas » est ajouté par le moteur d'animation)      */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: function () { arm(); } }
    ]);

    input.value = '5 + 3 × (8 − 6) ÷ 2';
    lastKey = input.value.replace(/\s+/g, '');
    arm();
  }
});
