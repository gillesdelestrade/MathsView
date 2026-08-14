/*
 * python-console — l'ardoise Python : un script modifiable, un bouton, une
 * console.
 *
 * La leçon « Variations » s'en sert pour montrer le tableau de valeurs, les
 * exercices pour poser des questions dessus. Les deux emploient la MÊME console,
 * pour qu'un script se comporte pareil des deux côtés : mêmes bornes, mêmes
 * messages d'erreur, même façon d'afficher.
 *
 * Elle s'appuie sur MathsPython (js/python-mini.js), qui exécute réellement le
 * script — rien n'est pré-calculé ni rejoué.
 *
 *   var c = MathsConsole.monte(hote, {
 *     script  : le programme de départ,
 *     lignes  : hauteur de la zone de saisie (défaut 9),
 *     titre   : l'étiquette au-dessus du script,
 *     aide    : la phrase sous la console,
 *     auto    : exécuter tout de suite (défaut : non),
 *     surSortie(lignes, erreur, intact) : appelé après chaque exécution.
 *                `intact` dit si le script est encore celui d'origine — une
 *                leçon ne commente que ce qu'elle a elle-même écrit.
 *   });
 *   c.valeur()          le script courant
 *   c.remettre(s)       réécrit le script (celui d'origine si s est absent)
 *   c.executer()        lance, comme le bouton
 *   c.intact()          le script n'a pas été retouché
 */
(function (global) {
  'use strict';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function monte(hote, o) {
    o = o || {};
    var origine = o.script || '';

    var bloc = el('div', 'py-bloc');
    var cols = el('div', 'py-cols');

    var colG = el('div', 'py-col');
    colG.appendChild(el('div', 'py-etiq',
      (o.titre || 'Le script') + ' <span class="py-note">— tu peux le modifier</span>'));
    var code = document.createElement('textarea');
    code.className = 'py-code';
    code.spellcheck = false;
    code.rows = o.lignes || 9;
    code.value = origine;
    colG.appendChild(code);
    var actions = el('div', 'py-actions');
    var bRun = el('button', 'py-run', '▶ Exécuter');
    var bReset = el('button', 'py-reset', '↺ Script d\'origine');
    bRun.type = 'button'; bReset.type = 'button';
    actions.appendChild(bRun); actions.appendChild(bReset);
    colG.appendChild(actions);

    var colD = el('div', 'py-col');
    colD.appendChild(el('div', 'py-etiq', 'Ce que la console affiche'));
    var sortie = el('pre', 'py-sortie');
    colD.appendChild(sortie);

    cols.appendChild(colG); cols.appendChild(colD);
    bloc.appendChild(cols);
    if (o.aide) bloc.appendChild(el('p', 'py-aide', o.aide));
    hote.appendChild(bloc);

    function intact() { return code.value === origine; }

    function executer() {
      var r = MathsPython.executer(code.value);
      var txt = r.lignes.join('\n');
      if (r.tronque) txt += '\n… (affichage interrompu : trop de lignes)';
      if (r.erreur) {
        sortie.textContent = (txt ? txt + '\n\n' : '') + '⚠ ' +
          MathsPython.messageErreur(r.erreur);
        sortie.classList.add('py-ko');
      } else {
        sortie.textContent = txt || '(le script n\'affiche rien)';
        sortie.classList.remove('py-ko');
      }
      if (o.surSortie) o.surSortie(r.lignes, r.erreur, intact());
      return r;
    }

    function remettre(s) {
      if (s !== undefined) origine = s;
      code.value = origine;
      sortie.textContent = '';
      sortie.classList.remove('py-ko');
      if (o.surSortie) o.surSortie([], null, true);
    }

    bRun.onclick = executer;
    bReset.onclick = function () { remettre(); };
    if (o.auto) executer();

    return { bloc: bloc, code: code, sortie: sortie,
             valeur: function () { return code.value; },
             intact: intact, remettre: remettre, executer: executer };
  }

  global.MathsConsole = { monte: monte };

})(typeof window !== 'undefined' ? window : this);
