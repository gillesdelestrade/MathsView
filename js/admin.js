/*
 * MathsAdmin — la page parent (SPEC §9).
 *
 * AVERTISSEMENT, à ne pas perdre de vue : le code à 4 chiffres n'est PAS de la
 * sécurité. Tout est en clair dans localStorage, et n'importe qui sachant ouvrir
 * la console y accède en dix secondes. C'est une porte fermée, pas un coffre —
 * suffisant pour éviter qu'une élève aille se mettre une ceinture noire ou
 * relire ses erreurs par la bande, et rien de plus.
 *
 * Cinq onglets : tableau de bord (§9.2), profils (§9.1), boutique et budget
 * (§9.3), trophées manuels (§9.4) et données (§9.5).
 *
 * Ce qui a le plus de valeur ici, et qu'aucune autre page ne montre : les
 * compétences où ça bloque, et les 20 dernières erreurs REJOUÉES depuis leur
 * graine, avec la réponse qui avait été donnée. On voit *comment* elles se
 * trompent, pas seulement qu'elles se trompent.
 */
(function (global) {
  'use strict';

  var SEMAINE = 7 * 24 * 3600 * 1000;
  var JOUR = 24 * 3600 * 1000;

  var deverrouille = false;
  var onglet = 'bord';
  var profilVu = null;
  var racine = null;

  /* ===================================================================== */
  /* Utilitaires                                                           */
  /* ===================================================================== */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function vide(e) { while (e.firstChild) e.removeChild(e.firstChild); }
  function jour(t) {
    var d = new Date(t);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
  function duree(s) {
    if (s < 60) return s + ' s';
    var m = Math.round(s / 60);
    return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + ('0' + (m % 60)).slice(-2);
  }
  function typeset(n) {
    if (global.MathJax && global.MathJax.typesetPromise) {
      global.MathJax.typesetPromise(n ? [n] : undefined)['catch'](function () {});
    }
  }

  /* ===================================================================== */
  /* Le code parent                                                        */
  /* ===================================================================== */
  function admin() {
    return MathsProfils.lire('mv.admin', {
      code: null, budgetMensuel: 15, tauxPieces: 100,
      boutique: [], defis: [], depenses: []
    });
  }
  function setAdmin(a) { MathsProfils.ecrire('mv.admin', a); }

  // SHA-256 quand le navigateur l'expose (contexte sécurisé, localhost compris) ;
  // sinon un djb2 salé, qui ne vaut pas mieux que la porte qu'il ferme.
  function hache(code, sel) {
    var txt = sel + ':' + code;
    if (global.crypto && global.crypto.subtle && global.TextEncoder) {
      return global.crypto.subtle
        .digest('SHA-256', new global.TextEncoder().encode(txt))
        .then(function (buf) {
          var h = Array.prototype.map.call(new Uint8Array(buf), function (b) {
            return ('0' + b.toString(16)).slice(-2);
          }).join('');
          return { algo: 'sha256', sel: sel, hash: h };
        });
    }
    var v = 5381;
    for (var i = 0; i < txt.length; i++) v = ((v * 33) ^ txt.charCodeAt(i)) >>> 0;
    return global.Promise.resolve({ algo: 'simple', sel: sel, hash: String(v) });
  }
  function selNeuf() {
    return String(Math.floor(Math.random() * 1e9)) + '-' + String(Date.now());
  }

  /* ===================================================================== */
  /* Écran de verrouillage                                                 */
  /* ===================================================================== */
  function rendreVerrou() {
    vide(racine);
    var a = admin();
    var premier = !a.code;

    var carte = el('div', 'adm-verrou');
    carte.innerHTML =
      '<div class="adm-cadenas">🔒</div>' +
      '<h2>Espace parent</h2>' +
      '<p>' + (premier
        ? 'Choisis un code à 4 chiffres. Il protège cette page des regards ' +
          'curieux — ce n\'est pas un coffre-fort, juste une porte fermée.'
        : 'Entre le code à 4 chiffres.') + '</p>';

    var champ = el('input', 'adm-code');
    champ.type = 'password';
    champ.inputMode = 'numeric';
    champ.maxLength = 4;
    champ.autocomplete = 'off';
    carte.appendChild(champ);

    var champ2 = null;
    if (premier) {
      champ2 = el('input', 'adm-code');
      champ2.type = 'password';
      champ2.inputMode = 'numeric';
      champ2.maxLength = 4;
      champ2.placeholder = 'à nouveau';
      carte.appendChild(champ2);
    }

    var msg = el('div', 'adm-msg');
    carte.appendChild(msg);

    var actions = el('div', 'exo-actions');
    var ok = el('button', 'exo-btn primaire', premier ? 'Définir ce code' : 'Entrer');
    ok.onclick = function () {
      var c = (champ.value || '').trim();
      if (!/^\d{4}$/.test(c)) { msg.textContent = 'Il faut exactement 4 chiffres.'; return; }
      if (premier) {
        if (c !== (champ2.value || '').trim()) {
          msg.textContent = 'Les deux codes ne sont pas identiques.'; return;
        }
        hache(c, selNeuf()).then(function (h) {
          var a2 = admin(); a2.code = h; setAdmin(a2);
          deverrouille = true; rendre();
        });
        return;
      }
      hache(c, a.code.sel).then(function (h) {
        if (h.algo === a.code.algo && h.hash === a.code.hash) {
          deverrouille = true; rendre();
        } else {
          msg.textContent = 'Code incorrect.';
          champ.value = ''; champ.focus();
        }
      });
    };
    champ.onkeydown = function (e) { if (e.key === 'Enter') ok.onclick(); };
    if (champ2) champ2.onkeydown = function (e) { if (e.key === 'Enter') ok.onclick(); };
    actions.appendChild(ok);

    var retour = el('a', 'exo-btn', '← Retour');
    retour.href = 'exercices.html';
    actions.appendChild(retour);
    carte.appendChild(actions);

    if (!premier) {
      var oubli = el('p', 'adm-oubli',
        'Code oublié ? Il se réinitialise en effaçant la clé <code>mv.admin</code> ' +
        'dans la console du navigateur — encore une preuve que ce n\'est pas une ' +
        'sécurité.');
      carte.appendChild(oubli);
    }
    racine.appendChild(carte);
    champ.focus();
  }

  /* ===================================================================== */
  /* Cadre général une fois déverrouillé                                   */
  /* ===================================================================== */
  function rendre() {
    if (!deverrouille) { rendreVerrou(); return; }
    vide(racine);

    var profs = MathsProfils.profils();
    if (!profilVu || !profs.some(function (p) { return p.id === profilVu; })) {
      profilVu = profs.length ? profs[0].id : null;
    }

    var enAttente = global.MathsBoutique
      ? MathsBoutique.demandes('en-attente').length : 0;
    var barre = el('div', 'adm-onglets');
    [['bord', 'Tableau de bord'], ['profils', 'Profils'],
     ['boutique', 'Boutique' + (enAttente
        ? ' <span class="adm-badge">' + enAttente + '</span>' : '')],
     ['trophees', 'Trophées'], ['donnees', 'Données']]
      .forEach(function (o) {
        var b = el('button', 'adm-onglet' + (onglet === o[0] ? ' on' : ''), o[1]);
        b.onclick = function () { onglet = o[0]; rendre(); };
        barre.appendChild(b);
      });
    racine.appendChild(barre);

    var corps = el('div', 'adm-corps');
    racine.appendChild(corps);

    if (!profs.length) {
      corps.appendChild(el('div', 'exo-carte',
        '<p>Aucun profil pour l\'instant. Crée-en un depuis l\'onglet ' +
        '<b>Profils</b>, ou depuis la page d\'entraînement.</p>'));
      if (onglet === 'bord') return;
    }

    if (onglet === 'bord') ongletBord(corps);
    else if (onglet === 'profils') ongletProfils(corps);
    else if (onglet === 'boutique') ongletBoutique(corps);
    else if (onglet === 'trophees') ongletTrophees(corps);
    else ongletDonnees(corps);
  }

  /* ===================================================================== */
  /* §9.2 — Tableau de bord                                                */
  /* ===================================================================== */
  function statsGlobales(id) {
    var j = MathsProfils.journal(id);
    var arch = MathsProfils.archive(id);
    var t = 0, r = 0, temps = 0;
    j.forEach(function (e) {
      if (e.type !== 'tentative') return;
      t++; if (e.ok) r++; temps += e.duree || 0;
    });
    Object.keys(arch).forEach(function (m) {
      t += arch[m].tentatives; r += arch[m].reussites; temps += arch[m].duree;
    });
    var maintenant = Date.now();
    return {
      tentatives: t, reussites: r, temps: temps,
      taux: t ? Math.round(100 * r / t) : null,
      semaine: j.filter(function (e) {
        return e.type === 'tentative' && maintenant - e.t < SEMAINE;
      }).length
    };
  }

  function ongletBord(corps) {
    var profs = MathsProfils.profils();

    /* --- la comparaison, en une ligne par profil --------------------- */
    var comp = el('div', 'exo-carte');
    comp.appendChild(el('div', 'props-label', 'Vue d\'ensemble'));
    var tbl = el('table', 'adm-table');
    tbl.innerHTML = '<thead><tr><th>Profil</th><th>XP</th><th>Compétences</th>' +
      '<th>Réussite</th><th>Temps total</th><th>Cette semaine</th></tr></thead>';
    var tb = el('tbody');
    profs.forEach(function (p) {
      var r = MathsProgression.resume(p.id);
      var s = statsGlobales(p.id);
      var tr = el('tr');
      tr.className = p.id === profilVu ? 'on' : '';
      tr.innerHTML =
        '<td><span class="exo-avatar" style="background:' + p.couleur + '">' +
          p.emoji + '</span> ' + esc(p.prenom) +
          (p.archive ? ' <i class="adm-archive">archivé</i>' : '') + '</td>' +
        '<td>' + r.xp + '</td>' +
        '<td>' + r.travaillees + ' / ' + r.total + '</td>' +
        '<td>' + (s.taux === null ? '—' : s.taux + ' %') + '</td>' +
        '<td>' + duree(s.temps) + '</td>' +
        '<td>' + s.semaine + ' question' + (s.semaine > 1 ? 's' : '') + '</td>';
      tr.onclick = function () { profilVu = p.id; rendre(); };
      tb.appendChild(tr);
    });
    tbl.appendChild(tb);
    comp.appendChild(tbl);
    comp.appendChild(el('p', 'adm-note',
      'Les niveaux scolaires diffèrent : ces chiffres ne se comparent pas entre ' +
      'sœurs. Ce qui se compare, c\'est la progression de chacune sur son propre ' +
      'programme.'));
    corps.appendChild(comp);

    if (!profilVu) return;
    var p = MathsProfils.profil(profilVu);

    /* --- le jardin, trié par besoin d'arrosage ----------------------- */
    var jar = el('div', 'exo-carte');
    jar.appendChild(el('div', 'props-label',
      'Le jardin de ' + esc(p.prenom) + ' — qui a le plus besoin d\'arrosage'));
    var jardin = MathsProgression.jardin(profilVu)
      .slice().sort(function (a, b) { return b.besoin - a.besoin; });
    var t2 = el('table', 'adm-table');
    t2.innerHTML = '<thead><tr><th>Compétence</th><th>Ceinture</th><th>Score</th>' +
      '<th>Palier</th><th>Réussite</th><th>Dernière fois</th></tr></thead>';
    var tb2 = el('tbody');
    jardin.forEach(function (c) {
      var taux = c.tentatives ? Math.round(100 * c.reussites / c.tentatives) : null;
      var tr = el('tr', c.jamais ? 'pale' : (c.besoin > 5 ? 'soif' : ''));
      tr.innerHTML =
        '<td>' + esc(c.libelle) + '</td>' +
        '<td><span class="exo-belt" style="background:' + c.ceinture.couleur +
          ';color:' + c.ceinture.encre + '">' + c.ceinture.nom + '</span>' +
          (c.ceinture.aEntretenir ? ' <i title="à entretenir">•</i>' : '') + '</td>' +
        '<td>' + (c.jamais ? '—' : c.score + '/100' +
          (c.meilleur > c.score ? ' <i class="adm-perte">(max ' + c.meilleur + ')</i>' : '')) + '</td>' +
        '<td>' + (c.jamais ? '—' : c.palier) + '</td>' +
        '<td>' + (taux === null ? '—' : taux + ' % <i>(' + c.tentatives + ')</i>') + '</td>' +
        '<td>' + (c.jamais ? 'jamais' :
          c.jours === 0 ? 'aujourd\'hui' : c.jours === 1 ? 'hier' :
          'il y a ' + c.jours + ' j') + '</td>';
      tb2.appendChild(tr);
    });
    t2.appendChild(tb2);
    jar.appendChild(t2);
    corps.appendChild(jar);

    /* --- le temps passé, 12 dernières semaines ----------------------- */
    var hist = el('div', 'exo-carte');
    hist.appendChild(el('div', 'props-label', 'Temps passé (12 dernières semaines)'));
    var j = MathsProfils.journal(profilVu);
    var maintenant = Date.now();
    var sem = [];
    for (var i = 11; i >= 0; i--) {
      var fin = maintenant - i * SEMAINE, debut = fin - SEMAINE;
      var s = 0, n = 0;
      j.forEach(function (e) {
        if (e.type !== 'tentative') return;      // sinon la durée compte double
        if (e.t > debut && e.t <= fin) { s += e.duree || 0; n++; }
      });
      sem.push({ minutes: Math.round(s / 60), n: n, fin: fin });
    }
    var maxi = Math.max(1, Math.max.apply(null, sem.map(function (x) { return x.minutes; })));
    var barres = el('div', 'adm-hist');
    sem.forEach(function (x) {
      var col = el('div', 'adm-barre');
      col.title = x.n + ' question' + (x.n > 1 ? 's' : '') + ' — ' + x.minutes + ' min';
      col.innerHTML = '<i style="height:' + Math.round(100 * x.minutes / maxi) + '%"></i>' +
        '<span>' + jour(x.fin) + '</span>';
      barres.appendChild(col);
    });
    hist.appendChild(barres);
    if (!j.length) hist.appendChild(el('p', 'adm-note', 'Aucune série pour l\'instant.'));
    corps.appendChild(hist);

    /* --- là où ça bloque : l'information la plus utile ---------------- */
    var bloc = el('div', 'exo-carte');
    bloc.appendChild(el('div', 'props-label', 'Les 5 compétences où ça bloque le plus'));
    var difficiles = jardin
      .filter(function (c) { return c.tentatives >= 4; })
      .map(function (c) {
        c.taux = Math.round(100 * c.reussites / c.tentatives);
        return c;
      })
      .sort(function (a, b) { return a.taux - b.taux; })
      .slice(0, 5);
    if (!difficiles.length) {
      bloc.appendChild(el('p', 'adm-note',
        'Pas encore assez de tentatives pour dire quoi que ce soit (il en faut au ' +
        'moins 4 par compétence).'));
    } else {
      difficiles.forEach(function (c) {
        var l = el('div', 'adm-bloc-ligne');
        l.innerHTML =
          '<span class="adm-bloc-nom">' + esc(c.libelle) + '</span>' +
          '<span class="exo-comp-jauge"><i style="width:' + c.taux +
            '%;background:' + (c.taux < 50 ? '#dc2626' : c.taux < 70 ? '#f59e0b' : '#16a34a') +
            '"></i></span>' +
          '<span class="exo-comp-score">' + c.taux + ' % sur ' + c.tentatives + '</span>';
        bloc.appendChild(l);
      });
    }
    corps.appendChild(bloc);

    /* --- les 20 dernières erreurs, rejouées depuis leur graine -------- */
    var err = el('div', 'exo-carte');
    err.appendChild(el('div', 'props-label', 'Les 20 dernières erreurs'));
    var ratees = j.filter(function (e) { return e.ok === false; }).slice(-20).reverse();
    if (!ratees.length) {
      err.appendChild(el('p', 'adm-note', 'Aucune erreur enregistrée.'));
    } else {
      ratees.forEach(function (e) {
        var d = el('div', 'adm-erreur');
        var q = null;
        try { q = MathsExos.rejoue(e.gen, e.seed, e.palier); } catch (ex) { q = null; }
        var enonce = q
          ? q.enonce + (q.tex ? ' \\(' + q.tex + '\\)' : '')
          : '<i>énoncé non rejouable (le générateur « ' + esc(e.gen) + ' » a changé)</i>';
        d.innerHTML =
          '<div class="adm-erreur-tete">' + jour(e.t) + ' · ' +
            esc(MathsExos.competence(e.comp).libelle) + ' · palier ' + e.palier +
            (e.indices ? ' · ' + e.indices + ' indice(s)' : '') + '</div>' +
          '<div class="adm-erreur-enonce">' + enonce + '</div>' +
          '<div class="adm-erreur-rep">Réponse donnée : <b class="ko">' +
            esc(e.saisie || '—') + '</b>' +
            (q ? ' — attendu : <b class="ok">' + esc(attendu(q)) + '</b>' : '') + '</div>';
        err.appendChild(d);
      });
    }
    corps.appendChild(err);
    typeset(err);
  }

  function attendu(q) {
    if (q.type === 'qcm') return String(q.choix[q.correct]).replace(/<[^>]*>/g, '');
    if (q.type === 'vraifaux') return q.correct === 0 ? 'Vrai' : 'Faux';
    if (q.type === 'jsx') return q.solutionTxt || '';
    return String([].concat(q.reponse)[0]);
  }

  /* ===================================================================== */
  /* §9.1 — Profils                                                        */
  /* ===================================================================== */
  function ongletProfils(corps) {
    MathsProfils.profils().forEach(function (p) {
      var c = el('div', 'exo-carte adm-profil');
      c.innerHTML =
        '<div class="adm-profil-tete">' +
          '<span class="exo-avatar grand" style="background:' + p.couleur + '">' +
            p.emoji + '</span>' +
          '<div><b>' + esc(p.prenom) + '</b><br>' +
          '<span class="adm-note">créé le ' + jour(p.creeLe) + ' · identifiant ' +
          esc(p.id) + (p.archive ? ' · <i>archivé</i>' : '') + '</span></div>' +
        '</div>';

      var form = el('div', 'adm-form');
      var prenom = el('input', 'exo-champ');
      prenom.value = p.prenom;
      prenom.maxLength = 20;
      var niveau = el('select', 'exo-select');
      ['6eme', '5eme', '4eme', '3eme', '2nde', '1ere', 'terminale'].forEach(function (k) {
        var o = document.createElement('option');
        o.value = k;
        o.textContent = { '6eme': '6ème', '5eme': '5ème', '4eme': '4ème', '3eme': '3ème',
                          '2nde': '2nde', '1ere': '1ère', 'terminale': 'Terminale' }[k];
        if (k === p.niveau) o.selected = true;
        niveau.appendChild(o);
      });
      var emoji = el('input', 'exo-champ court');
      emoji.value = p.emoji;
      emoji.maxLength = 2;
      var couleur = el('input');
      couleur.type = 'color';
      couleur.value = p.couleur;
      couleur.className = 'adm-couleur';

      [['Prénom', prenom], ['Emoji', emoji], ['Couleur', couleur], ['Niveau', niveau]]
        .forEach(function (x) {
          var l = el('label', 'adm-champ', '<span>' + x[0] + '</span>');
          l.appendChild(x[1]);
          form.appendChild(l);
        });
      c.appendChild(form);

      var actions = el('div', 'exo-actions');
      var maj = el('button', 'exo-btn primaire', 'Enregistrer');
      maj.onclick = function () {
        MathsProfils.modifier(p.id, {
          prenom: prenom.value.trim() || p.prenom, emoji: emoji.value || p.emoji,
          couleur: couleur.value, niveau: niveau.value
        });
        rendre();
      };
      actions.appendChild(maj);

      var arch = el('button', 'exo-btn', p.archive ? 'Réactiver' : 'Archiver');
      arch.onclick = function () {
        MathsProfils.modifier(p.id, { archive: !p.archive });
        rendre();
      };
      actions.appendChild(arch);

      var sup = el('button', 'exo-btn danger', 'Supprimer');
      sup.onclick = function () { confirmerSuppression(c, p); };
      actions.appendChild(sup);
      c.appendChild(actions);
      corps.appendChild(c);
    });

    var ajout = el('div', 'exo-carte');
    ajout.appendChild(el('div', 'props-label', 'Nouveau profil'));
    var np = el('input', 'exo-champ');
    np.placeholder = 'Prénom';
    np.maxLength = 20;
    ajout.appendChild(np);
    var act = el('div', 'exo-actions');
    var creer = el('button', 'exo-btn primaire', 'Créer');
    creer.onclick = function () {
      var v = (np.value || '').trim();
      if (!v) { np.focus(); return; }
      MathsProfils.creer({ prenom: v });
      rendre();
    };
    act.appendChild(creer);
    ajout.appendChild(act);
    corps.appendChild(ajout);
  }

  // On ne supprime jamais sans proposer d'abord la sauvegarde (SPEC §9.1).
  function confirmerSuppression(carte, p) {
    var b = el('div', 'exo-confirm');
    b.innerHTML = '<b>Supprimer ' + esc(p.prenom) + ' ?</b><br>' +
      'Toute sa progression (ceintures, jardin, journal) sera perdue, ' +
      'définitivement. Exporte d\'abord si tu veux pouvoir revenir en arrière.';
    var act = el('div', 'exo-actions');
    var exp = el('button', 'exo-btn', '⬇ Exporter d\'abord');
    exp.onclick = function () { MathsProfils.telecharge(); };
    var oui = el('button', 'exo-btn danger', 'Supprimer définitivement');
    oui.onclick = function () { MathsProfils.supprimer(p.id); rendre(); };
    var non = el('button', 'exo-btn primaire', 'Annuler');
    non.onclick = function () { b.remove(); };
    act.appendChild(non); act.appendChild(exp); act.appendChild(oui);
    b.appendChild(act);
    carte.appendChild(b);
  }

  /* ===================================================================== */
  /* §9.3 — Boutique et budget                                             */
  /* ===================================================================== */
  function ongletBoutique(corps) {
    if (!global.MathsBoutique) {
      corps.appendChild(el('div', 'exo-carte',
        '<p>Le module boutique n\'est pas chargé (js/boutique.js).</p>'));
      return;
    }
    var reg = MathsBoutique.reglages();

    /* --- les demandes en attente : c'est ce qu'on vient voir ----------- */
    var att = MathsBoutique.demandes('en-attente');
    var d1 = el('div', 'exo-carte');
    d1.appendChild(el('div', 'props-label',
      'Demandes en attente' + (att.length ? ' (' + att.length + ')' : '')));
    if (!att.length) {
      d1.appendChild(el('p', 'adm-note', 'Aucune demande en attente.'));
    }
    att.forEach(function (x) {
      var d = x.demande;
      var ligne = el('div', 'adm-demande');
      ligne.innerHTML =
        '<div><span class="exo-avatar" style="background:' + x.profil.couleur + '">' +
          x.profil.emoji + '</span> <b>' + esc(x.profil.prenom) + '</b> — ' +
          esc(d.nom) + '</div>' +
        '<div class="adm-note">' + d.cout + ' pièces' +
          (d.euros ? ' · <b>' + d.euros + ' €</b>' : ' · privilège (0 €)') +
          ' · demandé le ' + new Date(d.date).toLocaleDateString('fr-FR') + '</div>';
      var act = el('div', 'exo-actions');
      var oui = el('button', 'exo-btn primaire', 'Valider');
      oui.onclick = function () { MathsBoutique.valider(x.profil.id, d.id); rendre(); };
      var mot = el('input', 'exo-champ');
      mot.placeholder = 'un mot d\'explication (facultatif)';
      var non = el('button', 'exo-btn danger', 'Refuser');
      non.onclick = function () {
        MathsBoutique.refuser(x.profil.id, d.id, mot.value);
        rendre();
      };
      act.appendChild(oui); act.appendChild(non);
      ligne.appendChild(mot);
      ligne.appendChild(act);
      d1.appendChild(ligne);
    });
    corps.appendChild(d1);

    /* --- budget du mois ------------------------------------------------ */
    var b = el('div', 'exo-carte');
    b.appendChild(el('div', 'props-label', 'Budget du mois'));
    var total = MathsBoutique.totalDuMois();
    var pct = reg.budgetMensuel ? Math.min(100, Math.round(100 * total / reg.budgetMensuel)) : 0;
    b.innerHTML += '<p class="adm-note"><b>' + total.toFixed(2).replace('.', ',') +
      ' €</b> dépensés sur ' + reg.budgetMensuel + ' € — il reste <b>' +
      MathsBoutique.budgetRestant().toFixed(2).replace('.', ',') + ' €</b>.</p>' +
      '<div class="exo-comp-jauge"><i style="width:' + pct + '%;background:' +
      (pct > 90 ? '#dc2626' : pct > 70 ? '#f59e0b' : '#16a34a') + '"></i></div>' +
      '<p class="adm-note">Le plafond ne bloque que l\'argent et les bons. Les ' +
      'privilèges restent toujours accessibles — c\'est voulu : ce sont eux qui ' +
      'ont le meilleur rapport valeur / coût.</p>';

    var form = el('div', 'adm-form');
    var bm = el('input', 'exo-champ'); bm.type = 'number'; bm.min = 0; bm.step = 1;
    bm.value = reg.budgetMensuel;
    var tp = el('input', 'exo-champ'); tp.type = 'number'; tp.min = 1; tp.step = 10;
    tp.value = reg.tauxPieces;
    [['Plafond mensuel (€)', bm], ['Pièces pour 1 €', tp]].forEach(function (x) {
      var l = el('label', 'adm-champ', '<span>' + x[0] + '</span>');
      l.appendChild(x[1]);
      form.appendChild(l);
    });
    b.appendChild(form);
    var act2 = el('div', 'exo-actions');
    var maj = el('button', 'exo-btn primaire', 'Enregistrer');
    maj.onclick = function () {
      MathsBoutique.setReglages({ budgetMensuel: bm.value, tauxPieces: tp.value });
      rendre();
    };
    act2.appendChild(maj);
    b.appendChild(act2);

    var hist = MathsBoutique.depensesDuMois();
    if (hist.length) {
      var t = el('table', 'adm-table');
      t.innerHTML = '<thead><tr><th>Date</th><th>Profil</th><th>Article</th>' +
        '<th>Montant</th></tr></thead>';
      var tb = el('tbody');
      hist.slice().reverse().forEach(function (d) {
        var p = MathsProfils.profil(d.profil);
        tb.innerHTML += '<tr><td>' + jour(d.t) + '</td><td>' +
          esc(p ? p.prenom : d.profil) + '</td><td>' + esc(d.article) + '</td><td>' +
          d.euros + ' €</td></tr>';
      });
      t.appendChild(tb);
      b.appendChild(t);
    }
    corps.appendChild(b);

    /* --- le catalogue --------------------------------------------------- */
    var c = el('div', 'exo-carte');
    c.appendChild(el('div', 'props-label', 'Les articles'));
    var arts = MathsBoutique.articles();
    arts.forEach(function (a, i) {
      var l = el('div', 'adm-article');
      var nom = el('input', 'exo-champ'); nom.value = a.nom;
      var cout = el('input', 'exo-champ court'); cout.type = 'number'; cout.min = 1;
      cout.value = a.cout;
      var eur = el('input', 'exo-champ court'); eur.type = 'number'; eur.min = 0;
      eur.step = '0.5'; eur.value = a.euros === undefined ? '' : a.euros;
      eur.placeholder = '€';
      eur.disabled = a.type === 'privilege';
      var sup = el('button', 'exo-btn danger', '✕');
      sup.title = 'Retirer cet article';
      sup.onclick = function () {
        arts.splice(i, 1); MathsBoutique.setArticles(arts); rendre();
      };
      nom.onchange = cout.onchange = eur.onchange = function () {
        a.nom = nom.value; a.cout = Math.max(1, parseInt(cout.value, 10) || a.cout);
        if (!eur.disabled) a.euros = eur.value === '' ? undefined : Number(eur.value);
        MathsBoutique.setArticles(arts);
      };
      l.appendChild(el('span', 'adm-type', a.type));
      l.appendChild(nom); l.appendChild(cout); l.appendChild(eur); l.appendChild(sup);
      c.appendChild(l);
    });

    var nouveau = el('div', 'adm-article');
    var nn = el('input', 'exo-champ'); nn.placeholder = 'Nouvel article';
    var nc = el('input', 'exo-champ court'); nc.type = 'number'; nc.value = 50;
    var ne = el('input', 'exo-champ court'); ne.type = 'number'; ne.placeholder = '€';
    var nt = el('select', 'exo-select');
    [['privilege', 'privilège'], ['argent', 'argent'], ['bon', 'bon cadeau']]
      .forEach(function (x) {
        var o = document.createElement('option');
        o.value = x[0]; o.textContent = x[1];
        nt.appendChild(o);
      });
    var add = el('button', 'exo-btn primaire', 'Ajouter');
    add.onclick = function () {
      if (!nn.value.trim()) { nn.focus(); return; }
      arts.push({ id: 'a' + Date.now(), nom: nn.value.trim(),
                  cout: Math.max(1, parseInt(nc.value, 10) || 50), type: nt.value,
                  euros: nt.value === 'privilege' ? 0 : Number(ne.value || 0),
                  cooldownJours: 7 });
      MathsBoutique.setArticles(arts);
      rendre();
    };
    nouveau.appendChild(nt); nouveau.appendChild(nn); nouveau.appendChild(nc);
    nouveau.appendChild(ne); nouveau.appendChild(add);
    c.appendChild(nouveau);

    var act3 = el('div', 'exo-actions');
    var reset = el('button', 'exo-btn', 'Rétablir le catalogue par défaut');
    reset.onclick = function () {
      MathsBoutique.setArticles(MathsBoutique.defaut());
      rendre();
    };
    act3.appendChild(reset);
    c.appendChild(act3);
    corps.appendChild(c);
  }

  /* ===================================================================== */
  /* §9.4 — Trophées manuels                                               */
  /* ===================================================================== */
  function ongletTrophees(corps) {
    if (!global.MathsTrophees) {
      corps.appendChild(el('div', 'exo-carte',
        '<p>Le module trophées n\'est pas chargé (js/trophees.js).</p>'));
      return;
    }
    var profs = MathsProfils.profils();

    var c = el('div', 'exo-carte');
    c.appendChild(el('div', 'props-label', 'À attribuer à la main'));
    c.appendChild(el('p', 'adm-note',
      'Ceux-là, aucun algorithme ne peut les voir : il faut être là. ' +
      'Les autres trophées se débloquent tout seuls en fin de série.'));
    MathsTrophees.liste().filter(function (t) { return t.manuel; }).forEach(function (t) {
      var l = el('div', 'adm-demande');
      l.innerHTML = '<div><span class="exo-trophee-emoji">' + t.emoji + '</span> ' +
        '<b>' + esc(t.nom) + '</b> — ' + esc(t.desc) +
        ' <span class="exo-trophee-pieces">+' + t.pieces + '</span></div>';
      var act = el('div', 'exo-actions');
      profs.forEach(function (p) {
        var deja = MathsTrophees.obtenus(p.id).some(function (o) { return o.id === t.id; });
        var b = el('button', 'exo-btn' + (deja ? '' : ' primaire'),
          (deja ? '✓ ' : 'Attribuer à ') + esc(p.prenom));
        b.disabled = deja;
        b.onclick = function () { MathsTrophees.attribue(p.id, t.id); rendre(); };
        act.appendChild(b);
      });
      l.appendChild(act);
      c.appendChild(l);
    });
    corps.appendChild(c);

    /* --- un trophée inventé sur le moment ------------------------------ */
    var f = el('div', 'exo-carte');
    f.appendChild(el('div', 'props-label', 'Inventer un trophée'));
    var form = el('div', 'adm-form');
    var nom = el('input', 'exo-champ'); nom.placeholder = 'Nom';
    var desc = el('input', 'exo-champ'); desc.placeholder = 'Pourquoi ?';
    var pieces = el('input', 'exo-champ court'); pieces.type = 'number';
    pieces.value = 20; pieces.min = 0;
    var qui = el('select', 'exo-select');
    profs.forEach(function (p) {
      var o = document.createElement('option');
      o.value = p.id; o.textContent = p.prenom;
      qui.appendChild(o);
    });
    [['Nom', nom], ['Description', desc], ['Pièces', pieces], ['Pour', qui]]
      .forEach(function (x) {
        var l = el('label', 'adm-champ', '<span>' + x[0] + '</span>');
        l.appendChild(x[1]);
        form.appendChild(l);
      });
    f.appendChild(form);
    var act = el('div', 'exo-actions');
    var ok = el('button', 'exo-btn primaire', 'Attribuer');
    ok.onclick = function () {
      if (!nom.value.trim() || !qui.value) { nom.focus(); return; }
      MathsTrophees.libre(qui.value, { nom: nom.value.trim(), desc: desc.value.trim(),
                                       pieces: pieces.value });
      rendre();
    };
    act.appendChild(ok);
    f.appendChild(act);
    corps.appendChild(f);

    /* --- l'objectif commun de la semaine ------------------------------ */
    if (global.MathsDefis) {
      var o = MathsDefis.etatObjectif();
      var oc = el('div', 'exo-carte');
      oc.appendChild(el('div', 'props-label', 'Objectif commun de la semaine'));
      oc.appendChild(el('p', 'adm-note',
        'Il n\'est atteint que si <b>toutes</b> y arrivent. C\'est la mécanique ' +
        'qui crée de l\'entraide plutôt que de la rivalité — et, d\'expérience, ' +
        'la plus efficace des trois.'));
      o.lignes.forEach(function (l) {
        oc.appendChild(el('div', 'adm-bloc-ligne',
          '<span class="adm-bloc-nom">' + esc(l.profil.prenom) + '</span>' +
          '<span class="exo-comp-jauge"><i style="width:' +
            Math.min(100, Math.round(100 * l.series / o.cible)) + '%;background:' +
            (l.atteint ? '#16a34a' : '#f59e0b') + '"></i></span>' +
          '<span class="exo-comp-score">' + l.series + ' / ' + o.cible + '</span>'));
      });
      if (o.atteint) {
        oc.appendChild(el('div', 'exo-obj-gagne',
          '🎉 Objectif atteint par tout le monde — récompense promise : ' +
          esc(o.recompense)));
      }
      var fo = el('div', 'adm-form');
      var nb = el('input', 'exo-champ court'); nb.type = 'number'; nb.min = 1;
      nb.value = o.cible;
      var rec = el('input', 'exo-champ'); rec.value = o.recompense;
      [['Séries par semaine', nb], ['Récompense', rec]].forEach(function (x) {
        var l = el('label', 'adm-champ', '<span>' + x[0] + '</span>');
        l.appendChild(x[1]);
        fo.appendChild(l);
      });
      oc.appendChild(fo);
      var ao = el('div', 'exo-actions');
      var bo = el('button', 'exo-btn primaire', 'Enregistrer');
      bo.onclick = function () {
        MathsDefis.setObjectif({ series: nb.value, recompense: rec.value });
        rendre();
      };
      ao.appendChild(bo);
      oc.appendChild(ao);
      corps.appendChild(oc);

      /* --- les défis en cours ---------------------------------------- */
      var dfs = MathsDefis.defis().slice().reverse().slice(0, 10);
      if (dfs.length) {
        var dc = el('div', 'exo-carte');
        dc.appendChild(el('div', 'props-label', 'Les défis'));
        dfs.forEach(function (d) {
          var a = MathsProfils.profil(d.de), b2 = MathsProfils.profil(d.vers);
          var ligne = el('div', 'adm-bloc-ligne');
          ligne.innerHTML = '<span class="adm-bloc-nom">' +
            esc(a ? a.prenom : '?') + ' → ' + esc(b2 ? b2.prenom : '?') + '</span>' +
            '<span>' + esc(MathsExos.competence(d.comp).libelle) +
            ' · palier ' + d.palier + ' · mise ' + d.mise + '</span>' +
            '<span class="exo-comp-score">' + (d.statut === 'termine'
              ? 'gagné par ' + esc((MathsProfils.profil(d.gagnant) || {}).prenom || '?')
              : d.statut) + '</span>';
          if (d.statut !== 'termine') {
            var ann = el('button', 'exo-btn danger', 'Annuler');
            ann.onclick = function () { MathsDefis.annuler(d.id); rendre(); };
            ligne.appendChild(ann);
          }
          dc.appendChild(ligne);
        });
        corps.appendChild(dc);
      }
    }

    /* --- ce que chacune a déjà --------------------------------------- */
    profs.forEach(function (p) {
      var eus = MathsTrophees.obtenus(p.id);
      var d = el('div', 'exo-carte');
      d.appendChild(el('div', 'props-label',
        esc(p.prenom) + ' — ' + eus.length + ' trophée' + (eus.length > 1 ? 's' : '')));
      if (!eus.length) {
        d.appendChild(el('p', 'adm-note', 'Aucun pour l\'instant.'));
      }
      eus.slice().reverse().forEach(function (t) {
        d.appendChild(el('div', 'adm-note',
          '<span class="exo-trophee-emoji">' + t.emoji + '</span> <b>' +
          esc(t.nom) + '</b> — ' + esc(t.desc) + ' · ' + jour(t.obtenuLe) +
          (t.manuel ? ' · <i>attribué à la main</i>' : '')));
      });
      corps.appendChild(d);
    });
  }

  /* ===================================================================== */
  /* §9.5 — Données                                                        */
  /* ===================================================================== */
  function ongletDonnees(corps) {
    var jours = MathsProfils.joursDepuisExport();

    var c = el('div', 'exo-carte');
    c.appendChild(el('div', 'props-label', 'Sauvegarde'));
    c.appendChild(el('p', 'adm-note',
      'Tout vit dans le localStorage de ce navigateur. Vider les données du site, ' +
      'changer d\'ordinateur ou de navigateur, et tout disparaît. L\'export est ' +
      'la seule vraie sauvegarde.'));
    if (jours === null) {
      c.appendChild(el('p', 'exo-rappel', '⚠ Aucune sauvegarde exportée pour l\'instant.'));
    } else if (jours > 30) {
      c.appendChild(el('p', 'exo-rappel',
        '⚠ Dernière sauvegarde il y a ' + jours + ' jours — il serait temps.'));
    } else {
      c.appendChild(el('p', 'exo-ok-mini',
        'Dernière sauvegarde il y a ' + jours + ' jour' + (jours > 1 ? 's' : '') + '.'));
    }

    var act = el('div', 'exo-actions');
    var exp = el('button', 'exo-btn primaire', '⬇ Exporter tout');
    exp.onclick = function () { MathsProfils.telecharge(); rendre(); };
    act.appendChild(exp);

    var lab = el('label', 'exo-btn', '⬆ Importer une sauvegarde');
    var inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'application/json,.json';
    inp.style.display = 'none';
    inp.onchange = function () {
      var f = inp.files && inp.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () { confirmerImport(c, String(fr.result)); };
      fr.readAsText(f);
    };
    lab.appendChild(inp);
    act.appendChild(lab);
    c.appendChild(act);
    corps.appendChild(c);

    /* --- remises à zéro ---------------------------------------------- */
    var z = el('div', 'exo-carte');
    z.appendChild(el('div', 'props-label', 'Remise à zéro'));
    MathsProfils.profils().forEach(function (p) {
      var l = el('div', 'adm-bloc-ligne');
      l.innerHTML = '<span class="adm-bloc-nom">' + esc(p.prenom) + '</span>';
      var b = el('button', 'exo-btn', 'Repartir de zéro');
      b.onclick = function () {
        var conf = el('div', 'exo-confirm');
        conf.innerHTML = '<b>Effacer la progression de ' + esc(p.prenom) + ' ?</b> ' +
          'Le profil est conservé, mais ses ceintures, son jardin et son journal ' +
          'repartent à zéro.';
        var a2 = el('div', 'exo-actions');
        var oui = el('button', 'exo-btn danger', 'Effacer sa progression');
        oui.onclick = function () { MathsProfils.reinitialise(p.id); rendre(); };
        var non = el('button', 'exo-btn primaire', 'Annuler');
        non.onclick = function () { conf.remove(); };
        a2.appendChild(non); a2.appendChild(oui);
        conf.appendChild(a2);
        z.appendChild(conf);
      };
      l.appendChild(b);
      z.appendChild(l);
    });

    var tout = el('div', 'exo-actions');
    var bt = el('button', 'exo-btn danger', 'Tout effacer (profils compris)');
    bt.onclick = function () {
      var conf = el('div', 'exo-confirm');
      conf.innerHTML = '<b>Tout effacer ?</b> Les profils, les progressions, les ' +
        'journaux et le code parent. Il ne restera rien. Exporte d\'abord.';
      var a3 = el('div', 'exo-actions');
      var exp2 = el('button', 'exo-btn', '⬇ Exporter d\'abord');
      exp2.onclick = function () { MathsProfils.telecharge(); };
      var oui = el('button', 'exo-btn danger', 'Tout effacer');
      oui.onclick = function () {
        MathsProfils.reinitialise();
        deverrouille = false;
        rendre();
      };
      var non = el('button', 'exo-btn primaire', 'Annuler');
      non.onclick = function () { conf.remove(); };
      a3.appendChild(non); a3.appendChild(exp2); a3.appendChild(oui);
      conf.appendChild(a3);
      z.appendChild(conf);
    };
    tout.appendChild(bt);
    z.appendChild(tout);
    corps.appendChild(z);

    /* --- place occupée ------------------------------------------------ */
    var info = el('div', 'exo-carte');
    info.appendChild(el('div', 'props-label', 'Stockage'));
    var ko = MathsProfils.taille();
    info.appendChild(el('p', 'adm-note',
      'Place occupée : <b>' + ko + ' Ko</b> sur environ 5 000 Ko disponibles ' +
      '(' + Math.max(1, Math.round(ko / 50)) + ' ‰). ' +
      MathsProfils.cles().length + ' clés enregistrées.' +
      (MathsProfils.disponible ? ''
        : ' <b>Attention : ce navigateur refuse le stockage — rien n\'est conservé.</b>')));
    corps.appendChild(info);
  }

  function confirmerImport(carte, texte) {
    var a = MathsProfils.analyse(texte);
    var b = el('div', 'exo-confirm');
    if (!a.ok) {
      b.innerHTML = '<b>Import impossible.</b> ' + esc(a.erreur);
      carte.appendChild(b);
      return;
    }
    var d = new Date(a.date);
    b.innerHTML = '<b>Cette sauvegarde contient :</b><br>' + esc(a.profils.join(', ')) +
      '<br>exportée le ' + d.toLocaleDateString('fr-FR') + ' à ' +
      d.toLocaleTimeString('fr-FR').slice(0, 5) + '.<br>' +
      '<em>L\'importer remplacera tout le contenu actuel, code parent compris.</em>';
    var act = el('div', 'exo-actions');
    var oui = el('button', 'exo-btn danger', 'Remplacer par cette sauvegarde');
    oui.onclick = function () {
      MathsProfils.importe(a.objet);
      deverrouille = false;      // le code parent vient peut-être de changer
      rendre();
    };
    var non = el('button', 'exo-btn primaire', 'Annuler');
    non.onclick = function () { b.remove(); };
    act.appendChild(non); act.appendChild(oui);
    b.appendChild(act);
    carte.appendChild(b);
  }

  /* ===================================================================== */
  global.MathsAdmin = {
    demarre: function (element) { racine = element; rendre(); },
    // exposés pour les tests hors navigateur
    hache: hache, statsGlobales: statsGlobales, attendu: attendu
  };

})(window);
