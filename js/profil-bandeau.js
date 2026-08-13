/*
 * Le bandeau « qui travaille » — la pastille du profil connecté, en haut à
 * droite, sur TOUTES les pages du site.
 *
 * Jusqu'ici elle n'existait que sur la page d'entraînement, construite en
 * ligne dans exercices.html. Résultat : depuis une leçon, on ne savait plus
 * qui était connecté, et il fallait repasser par l'entraînement pour atteindre
 * son jardin ou sa boutique. Le bandeau est donc sorti de cette page et mis
 * ici, où les trois pages peuvent s'en servir.
 *
 * ---------------------------------------------------------------------------
 * Ce qu'il fait
 * ---------------------------------------------------------------------------
 * Il affiche l'avatar, le prénom, l'XP et les pièces, et ouvre au clic un
 * petit menu vers les trois endroits qui appartiennent à l'élève : son
 * jardin (ses statistiques), sa boutique, et le changement de profil. Les
 * liens pointent vers exercices.html : depuis cette page-là, seul le fragment
 * change et la navigation reste instantanée.
 *
 * Sans profil connecté, il propose simplement d'en choisir un — sur la page
 * des leçons, c'est le seul endroit qui le rappelle.
 *
 * ---------------------------------------------------------------------------
 * Dépendances, et ce qui se passe s'il en manque
 * ---------------------------------------------------------------------------
 * Le module a besoin de MathsProfils, et se sert de MathsProgression quand
 * elle est là (pour l'XP et les pièces). Si l'un ou l'autre manque — une page
 * qui ne les charge pas — le bandeau ne s'affiche pas et ne casse rien. Une
 * page qui n'appelle pas `monte()` ne voit aucune différence.
 */
(function (global) {
  'use strict';

  var ENTRAINEMENT = 'exercices.html';
  var hote = null;          // l'élément où le bandeau est dessiné
  var ouvert = false;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Aller quelque part dans la page d'entraînement. Depuis cette page même,
  // seul le fragment change : pas de rechargement.
  function va(fragment) {
    var ici = location.pathname.replace(/^.*\//, '');
    if (ici === ENTRAINEMENT || ici === '') {
      if (location.hash === '#' + fragment) {
        // Même fragment : le routeur ne serait pas rappelé, on le force.
        location.hash = '';
      }
      location.hash = fragment;
    } else {
      location.href = ENTRAINEMENT + '#' + fragment;
    }
  }

  function ferme() {
    ouvert = false;
    var m = hote && hote.querySelector('.exo-profil-menu');
    if (m) m.remove();
    var b = hote && hote.querySelector('.exo-profil-actif');
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  function bascule() {
    if (ouvert) { ferme(); return; }
    ouvert = true;
    var b = hote.querySelector('.exo-profil-actif');
    if (b) b.setAttribute('aria-expanded', 'true');

    var menu = document.createElement('div');
    menu.className = 'exo-profil-menu';
    [
      { f: 'accueil', ico: '🌱', lib: 'Mon jardin', sous: 'ceintures, progression, trophées' },
      { f: 'boutique', ico: '🪙', lib: 'Ma boutique', sous: 'échanger mes pièces' },
      { f: 'profils', ico: '👤', lib: 'Changer de profil', sous: null }
    ].forEach(function (e) {
      var a = document.createElement('button');
      a.type = 'button';
      a.className = 'exo-profil-item';
      a.innerHTML = '<span class="exo-profil-ico">' + e.ico + '</span>' +
        '<span class="exo-profil-lib">' + e.lib +
        (e.sous ? '<small>' + e.sous + '</small>' : '') + '</span>';
      a.onclick = function (ev) { ev.stopPropagation(); ferme(); va(e.f); };
      menu.appendChild(a);
    });
    hote.appendChild(menu);
  }

  // Un clic ailleurs, ou la touche Échap, referment le menu.
  document.addEventListener('click', function (ev) {
    if (!ouvert || !hote) return;
    if (!hote.contains(ev.target)) ferme();
  });
  document.addEventListener('keydown', function (ev) {
    if (ouvert && ev.key === 'Escape') ferme();
  });

  function maj() {
    if (!hote || !global.MathsProfils) return;
    ferme();
    var id = MathsProfils.courant();
    var p = id && MathsProfils.profil(id);

    if (!p) {
      hote.innerHTML = '<button type="button" class="exo-profil-actif vide">' +
        '<span class="exo-avatar" style="background:#94a3b8">👤</span>Choisir un profil</button>';
      hote.querySelector('button').onclick = function () { va('profils'); };
      return;
    }

    var r = global.MathsProgression ? MathsProgression.resume(id) : { xp: 0, pieces: 0 };
    hote.innerHTML =
      '<button type="button" class="exo-profil-actif" aria-haspopup="true" ' +
        'aria-expanded="false" title="Mon jardin, ma boutique, changer de profil">' +
        '<span class="exo-avatar" style="background:' + p.couleur + '">' + p.emoji + '</span>' +
        esc(p.prenom) +
        '<span class="exo-xp-mini">' + r.xp + ' XP</span>' +
        '<span class="exo-pieces-mini">' + r.pieces + ' 🪙</span>' +
        '<span class="exo-profil-fleche">▾</span>' +
      '</button>';
    hote.querySelector('button').onclick = function (ev) { ev.stopPropagation(); bascule(); };
  }

  /*
   * monte(el) — installe le bandeau dans cet élément (ou dans l'élément
   * d'identifiant « profil-actif » s'il existe). À appeler une fois par page ;
   * `maj()` le rafraîchit ensuite (après une session, un achat…).
   */
  function monte(el) {
    hote = el || document.getElementById('profil-actif');
    if (!hote) return null;
    hote.classList.add('exo-profil-hote');
    maj();
    // Le profil peut changer dans un autre onglet : on suit le stockage.
    global.addEventListener('storage', function (ev) {
      if (!ev.key || ev.key.indexOf('mv.') === 0) maj();
    });
    return hote;
  }

  global.MathsBandeau = { monte: monte, maj: maj, va: va };

})(window);
