/*
 * MathsSyncUI — le peu d'interface que la synchronisation mérite.
 *
 * Elle doit se voir quand ça compte, et disparaître le reste du temps. Trois
 * situations, trois messages :
 *
 *   • hors ligne — le serveur ne répond pas. Un bandeau discret rassure
 *     (« tout est gardé ici ») plutôt qu'il n'alarme : le travail continue,
 *     c'est l'essentiel à dire à un enfant de onze ans.
 *   • profil déjà ouvert ailleurs — une question franche, avec un bouton.
 *     C'est le seul moment où on interrompt vraiment.
 *   • conflit — deux appareils ont écrit la même chose. On dit qu'on a
 *     rechargé, on ne prétend pas que rien ne s'est passé.
 *
 * Ce fichier ne touche pas au stockage : il écoute MathsProfils et parle.
 */
(function (global) {
  'use strict';

  var bandeau = null;
  var premierVerdict = true;   // démarrer connecté est la normale : on se tait

  function element() {
    if (bandeau) return bandeau;
    bandeau = global.document.createElement('div');
    bandeau.className = 'sync-bandeau';
    bandeau.setAttribute('role', 'status');
    global.document.body.appendChild(bandeau);
    return bandeau;
  }

  function cache() { if (bandeau) bandeau.classList.remove('visible'); }

  function montre(texte, ton, bouton) {
    var b = element();
    b.className = 'sync-bandeau visible' + (ton ? ' ' + ton : '');
    b.textContent = '';

    var t = global.document.createElement('span');
    t.textContent = texte;
    b.appendChild(t);

    if (bouton) {
      var btn = global.document.createElement('button');
      btn.textContent = bouton.texte;
      btn.onclick = bouton.action;
      b.appendChild(btn);
    }
    return b;
  }

  function surEvenement(nom, info) {
    if (nom === 'mode') {
      var premier = premierVerdict;
      premierVerdict = false;
      if (info.mode === 'local') {
        montre('Hors ligne — ton travail est gardé ici et repartira tout seul.', 'attente');
      } else if (!premier) {
        montre('Reconnecté — tout est enregistré.', 'ok');
        global.setTimeout(cache, 4000);
      }
      return;
    }

    if (nom === 'bail-refuse') {
      var p = MathsProfils.profil(info.profil);
      var prenom = p ? p.prenom : 'Ce profil';
      montre(prenom + ' travaille déjà sur ' + (info.appareil || 'un autre appareil') + '.',
        'alerte', {
          texte: 'Reprendre ici',
          action: function () {
            MathsProfils.prendBail(info.profil, true).then(function (ok) {
              if (ok) { montre('C\'est bon, tu peux continuer ici.', 'ok'); global.setTimeout(cache, 4000); }
            });
          }
        });
      return;
    }

    if (nom === 'conflit') {
      montre('Ta progression avait changé sur un autre appareil — on l\'a rechargée.', 'attente');
      global.setTimeout(cache, 7000);
    }
  }

  /*
   * Le point d'entrée des pages : on attend la synchronisation, puis on
   * dessine. Jamais rejetée — si le serveur est absent, `suite` est appelée
   * quand même, sur les données locales.
   */
  function demarre(suite) {
    MathsProfils.surEvenement(surEvenement);
    return MathsProfils.demarre().then(function (m) {
      suite();
      return m;
    });
  }

  global.MathsSyncUI = { demarre: demarre, montre: montre, cache: cache };

})(window);
