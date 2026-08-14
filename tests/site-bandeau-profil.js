/* On simule un DOM minimal et le stockage, puis on monte le bandeau et on
   vérifie ce qu'il affiche et où mènent ses entrées. */
var ecoutes = {}, dom = [];
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [], attrs: {}, style: {},
    classList: { add: function(c){ e.className += (e.className?' ':'') + c; },
                 remove: function(){}, toggle: function(){} },
    appendChild: function (c) { e.children.push(c); c.parent = e; },
    remove: function () { if (e.parent) e.parent.children = e.parent.children.filter(function(x){return x!==e;}); },
    setAttribute: function (k, v) { e.attrs[k] = v; },
    contains: function () { return false; },
    querySelector: function (sel) {
      var cls = sel.replace('.', '');
      function ch(n) {
        if (n !== e && n.className && n.className.split(' ').indexOf(cls) >= 0) return n;
        for (var i = 0; i < n.children.length; i++) { var r = ch(n.children[i]); if (r) return r; }
        return null;
      }
      // ce qui vient de innerHTML n'est pas modélisé : on le retrouve par le texte
      if (e._html.indexOf('class="' + cls) >= 0 || e._html.indexOf(cls) >= 0) {
        if (!e._faux) e._faux = {};
        if (!e._faux[cls]) { var f = fauxEl('button'); f.className = cls; e._faux[cls] = f; }
        return e._faux[cls];
      }
      return ch(e);
    } };
  Object.defineProperty(e, 'innerHTML', { get: function(){ return e._html; },
    set: function (v) { e._html = v; e.children = []; e._faux = null; } });
  dom.push(e); return e;
}
var hote = fauxEl('span');
var document = {
  createElement: fauxEl,
  getElementById: function (id) { return id === 'profil-actif' ? hote : null; },
  addEventListener: function (t, f) { ecoutes[t] = f; }
};
var location = { pathname: '/index.html', hash: '', href: '' };
var window = this;
window.addEventListener = function (t, f) { ecoutes[t] = f; };
window.location = location;

/* --- profils et progression simulés --- */
var COURANT = 'lea';
var MathsProfils = {
  courant: function () { return COURANT; },
  profil: function (id) { return id === 'lea' ? { prenom: 'Léa & Co', emoji: '🦊',
                                                  couleur: '#7c3aed' } : null; }
};
var MathsProgression = { resume: function () { return { xp: 1240, pieces: 85 }; } };
window.MathsProfils = MathsProfils; window.MathsProgression = MathsProgression;
load('js/profil-bandeau.js');

var err = []; function ko(m) { err.push(m); }
MathsBandeau.monte();
var h = hote.innerHTML;
if (h.indexOf('1240 XP') < 0) ko('l\'XP n\'apparaît pas');
if (h.indexOf('85 🪙') < 0) ko('les pièces n\'apparaissent pas');
if (h.indexOf('🦊') < 0) ko('l\'emoji n\'apparaît pas');
if (h.indexOf('Léa &amp; Co') < 0) ko('le prénom n\'est pas échappé : ' + h.slice(0, 120));
if (h.indexOf('<script') >= 0) ko('du script dans le bandeau');

/* --- le menu : trois entrées, et leurs destinations --- */
// on rejoue le clic tel que le module l'a posé (même objet que celui qu'il a
// récupéré par querySelector)
var bouton = hote.querySelector('button');
bouton.onclick({ stopPropagation: function () {} });
var menu = hote.children[hote.children.length - 1];
if (!menu || menu.className !== 'exo-profil-menu') ko('le menu ne s\'ouvre pas');
else {
  if (menu.children.length !== 3) ko('menu à ' + menu.children.length + ' entrées');
  var cibles = [];
  menu.children.forEach(function (it) {
    location.href = ''; location.hash = '';
    it.onclick({ stopPropagation: function () {} });
    cibles.push(location.href || ('#' + location.hash));
  });
  ['accueil', 'boutique', 'profils'].forEach(function (f, i) {
    if (cibles[i].indexOf('exercices.html#' + f) < 0)
      ko('entrée ' + i + ' mène à « ' + cibles[i] + ' » au lieu de exercices.html#' + f);
  });
}

/* --- sans profil : on doit proposer d'en choisir un --- */
COURANT = null;
MathsBandeau.maj();
if (hote.innerHTML.indexOf('Choisir un profil') < 0) ko('sans profil, rien n\'est proposé');
COURANT = 'lea';

/* --- depuis TOUTES les adresses possibles, la destination doit être bonne --- */
[['/index.html', 'href'], ['/', 'href'], ['', 'href'],
 ['/MathsView/', 'href'], ['/admin.html', 'href'],
 ['/exercices.html', 'hash']].forEach(function (cas) {
  location.pathname = cas[0]; location.href = ''; location.hash = '';
  MathsBandeau.va('profils');
  if (cas[1] === 'href') {
    if (location.href !== 'exercices.html#profils')
      ko('depuis « ' + cas[0] + ' » : href = « ' + location.href + ' », hash = « ' +
         location.hash + ' » (on reste sur place)');
  } else if (location.href !== '' || location.hash !== 'profils') {
    ko('depuis « ' + cas[0] + ' » : la page est rechargée au lieu de changer de fragment');
  }
});

/* --- depuis la page d'entraînement, on ne recharge pas la page --- */
location.pathname = '/exercices.html';
location.href = ''; location.hash = '';
MathsBandeau.va('boutique');
if (location.href !== '') ko('depuis exercices.html, la page est rechargée au lieu de changer de fragment');
if (location.hash !== 'boutique') ko('fragment : ' + location.hash);

print(err.length ? 'ÉCHECS :\n - ' + err.join('\n - ')
                 : 'BANDEAU CONFORME : profil affiché, prénom échappé, 3 entrées vers le bon endroit,\n' +
                   'invitation quand aucun profil n\'est connecté, et pas de rechargement inutile');
