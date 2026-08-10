/*
 * MathsProfils — les profils et le stockage (SPEC §7).
 *
 * RÈGLE ABSOLUE : personne d'autre que ce fichier ne touche au stockage.
 * Tout passe par lire()/ecrire(). C'est ce qui a permis de basculer vers une
 * API serveur sans rien réécrire ailleurs — et c'est aussi ce qui rend
 * l'export/import possible en une seule fonction.
 *
 * Depuis, justement : la progression vit sur le serveur (serveur/mathsview-api.py),
 * pour qu'un élève retrouve son jardin en changeant d'appareil. localStorage
 * n'est plus qu'un miroir de secours. Les pages doivent attendre demarre()
 * avant de se dessiner ; tout le reste du code n'a pas bougé d'une ligne.
 *
 * Deux précautions qui comptent :
 *   • si le stockage est indisponible (navigation privée, quota plein), on
 *     bascule sur une mémoire de session plutôt que de planter : l'élève perd
 *     sa progression mais peut travailler ;
 *   • le JOURNAL est append-only et plafonné : au-delà de 2000 entrées, les
 *     plus anciennes sont agrégées en compteurs mensuels au lieu d'être jetées
 *     (SPEC §7.3), pour que les statistiques restent justes.
 *
 * L'export/import (§7.5) est traité comme une fonctionnalité de première
 * classe : avec localStorage, une purge de navigateur efface tout.
 */
(function (global) {
  'use strict';

  var VERSION = 1;
  var PLAFOND_JOURNAL = 2000;      // entrées gardées telles quelles
  var LOT_ARCHIVE = 200;           // combien on agrège d'un coup au-delà

  /* ===================================================================== */
  /* Le stockage, et lui seul                                              */
  /* ===================================================================== */
  /*
   * `memoire` est le cache de travail : c'est lui, et lui seul, que lit et
   * écrit le reste du code — toujours de façon synchrone, comme avant. Deux
   * couches l'entourent :
   *
   *   • le SERVEUR (cf. « Synchronisation » plus bas) fait autorité. Le cache
   *     en vient au démarrage, et toute écriture y repart, groupée et différée.
   *     C'est ce qui fait suivre la progression d'un appareil à l'autre.
   *   • localStorage n'est plus qu'un MIROIR. Il permet de démarrer quand le
   *     serveur est éteint, et il garde exactement le format d'avant (les clés
   *     « mv.* ») : les données déjà présentes dans un navigateur sont reprises
   *     telles quelles à la première connexion, et l'export/import ne change pas.
   *
   * Rien de tout ça ne remonte aux appelants : lire() et ecrire() ont la même
   * signature et la même sémantique qu'avant.
   */
  var memoire = {};       // cle → chaîne JSON ; la vérité pour le code appelant
  var versions = {};      // cle → n° de version côté serveur (0 = jamais écrite)
  var attente = {};       // clés modifiées, pas encore acceptées par le serveur

  // Le profil sélectionné est un choix d'appareil, pas une donnée d'élève : si
  // le parent change de profil sur son téléphone, la tablette de l'enfant ne
  // doit pas changer sous ses doigts. Ces clés-là restent purement locales.
  var LOCALES = { 'mv.courant': 1 };

  var STOCKE = (function () {
    try {
      global.localStorage.setItem('mv.test', '1');
      global.localStorage.removeItem('mv.test');
      return true;
    } catch (e) {
      return false;
    }
  })();

  function miroirEcrit(cle, s) {
    if (!STOCKE) return;
    try {
      if (s === null) global.localStorage.removeItem(cle);
      else global.localStorage.setItem(cle, s);
    } catch (e) {
      // Quota dépassé : le miroir sera incomplet, le serveur reste juste.
      console.warn('MathsProfils : miroir local impossible pour « ' + cle + ' » — ' + e.message);
    }
  }

  function miroirCharge() {
    var out = {};
    if (!STOCKE) return out;
    try {
      for (var i = 0; i < global.localStorage.length; i++) {
        var k = global.localStorage.key(i);
        if (k && k.indexOf('mv.') === 0) out[k] = global.localStorage.getItem(k);
      }
    } catch (e) { /* rien à faire */ }
    return out;
  }

  function lire(cle, defaut) {
    var brut = memoire[cle];
    if (brut === null || brut === undefined) return defaut === undefined ? null : defaut;
    try { return JSON.parse(brut); }
    catch (e) {
      console.warn('MathsProfils : données illisibles pour « ' + cle + ' »');
      return defaut === undefined ? null : defaut;
    }
  }

  function ecrire(cle, val) {
    var s = JSON.stringify(val);
    if (memoire[cle] === s) return;      // rien de neuf : pas d'aller-retour réseau
    memoire[cle] = s;
    miroirEcrit(cle, s);
    marque(cle);
  }

  function efface(cle) {
    if (!(cle in memoire)) return;
    delete memoire[cle];
    miroirEcrit(cle, null);
    marque(cle);
  }

  // Toutes les clés « mv.* », pour l'export et pour la remise à zéro.
  function clesMV() {
    return Object.keys(memoire).filter(function (k) {
      return k.indexOf('mv.') === 0;
    }).sort();
  }

  /* ===================================================================== */
  /* Les profils                                                           */
  /* ===================================================================== */
  var COULEURS = ['#7c3aed', '#0d9488', '#e11d48', '#2563eb', '#ea580c', '#c026d3'];
  var EMOJIS = ['🦊', '🐬', '🦉', '🐨', '🦋', '🐙', '🦔', '🐝'];

  function profils() { return lire('mv.profils', []); }

  function profil(id) {
    return profils().filter(function (p) { return p.id === id; })[0] || null;
  }

  function identifiant(prenom) {
    var base = String(prenom).toLowerCase()
      .normalize ? String(prenom).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
                 : String(prenom).toLowerCase();
    base = base.replace(/[^a-z0-9]/g, '') || 'eleve';
    var pris = profils().map(function (p) { return p.id; });
    if (pris.indexOf(base) < 0) return base;
    var n = 2;
    while (pris.indexOf(base + n) >= 0) n++;
    return base + n;
  }

  function creer(infos) {
    infos = infos || {};
    var liste = profils();
    var p = {
      id: identifiant(infos.prenom || 'Élève'),
      prenom: infos.prenom || 'Élève',
      couleur: infos.couleur || COULEURS[liste.length % COULEURS.length],
      emoji: infos.emoji || EMOJIS[liste.length % EMOJIS.length],
      niveau: infos.niveau || '2nde',
      creeLe: Date.now()
    };
    liste.push(p);
    ecrire('mv.profils', liste);
    ecrire('mv.version', VERSION);
    ecrire(cleEtat(p.id), etatNeuf());
    ecrire(cleJournal(p.id), []);
    if (!courant()) setCourant(p.id);
    return p;
  }

  function modifier(id, infos) {
    var liste = profils();
    liste.forEach(function (p) {
      if (p.id !== id) return;
      // Liste blanche : on ne laisse pas un import ou un appel maladroit
      // injecter n'importe quel champ dans un profil.
      ['prenom', 'couleur', 'emoji', 'niveau', 'archive'].forEach(function (k) {
        if (infos[k] !== undefined) p[k] = infos[k];
      });
    });
    ecrire('mv.profils', liste);
  }

  function supprimer(id) {
    ecrire('mv.profils', profils().filter(function (p) { return p.id !== id; }));
    efface(cleEtat(id));
    efface(cleJournal(id));
    efface(cleArchive(id));
    if (courant() === id) {
      var reste = profils();
      setCourant(reste.length ? reste[0].id : null);
    }
  }

  function courant() { return lire('mv.courant', null); }
  function setCourant(id) {
    if (id === null) efface('mv.courant'); else ecrire('mv.courant', id);
    // Changer de profil, c'est rendre le bail de l'ancien et prendre celui du
    // nouveau : deux appareils n'écrivent jamais le même élève en même temps.
    if (bailProfil && bailProfil !== id) { rendBail(bailProfil); bailProfil = null; }
    if (id) prendBail(id);
  }

  /* ===================================================================== */
  /* L'état d'un profil                                                    */
  /* ===================================================================== */
  function cleEtat(id) { return 'mv.profil.' + id + '.etat'; }
  function cleJournal(id) { return 'mv.profil.' + id + '.journal'; }
  function cleArchive(id) { return 'mv.profil.' + id + '.archive'; }

  function etatNeuf() {
    return {
      xp: 0, pieces: 0,
      maitrises: {},          // code de compétence → objet maîtrise (cf. progression.js)
      trophees: [],
      achats: [],
      sessions: [],           // horodatages des séries terminées (régularité)
      reglages: { son: false, clavierMaths: true }
    };
  }

  function etat(id) {
    var e = lire(cleEtat(id), null);
    if (!e) { e = etatNeuf(); ecrire(cleEtat(id), e); }
    // Complète les champs d'une sauvegarde plus ancienne que le code.
    var neuf = etatNeuf();
    Object.keys(neuf).forEach(function (k) { if (e[k] === undefined) e[k] = neuf[k]; });
    return e;
  }
  function setEtat(id, e) { ecrire(cleEtat(id), e); }

  /* ===================================================================== */
  /* Le journal (append-only)                                              */
  /* ===================================================================== */
  function journal(id) { return lire(cleJournal(id), []); }

  // Au-delà du plafond, les plus anciennes entrées ne sont pas jetées : elles
  // sont agrégées par mois, ce qui garde les totaux justes.
  function ajouteJournal(id, evt) {
    var j = journal(id);
    j.push(evt);
    if (j.length > PLAFOND_JOURNAL) {
      var vieilles = j.splice(0, LOT_ARCHIVE);
      var arch = lire(cleArchive(id), {});
      vieilles.forEach(function (e) {
        var d = new Date(e.t);
        var mois = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
        var a = arch[mois] || { tentatives: 0, reussites: 0, duree: 0 };
        a.tentatives++;
        if (e.ok) a.reussites++;
        a.duree += e.duree || 0;
        arch[mois] = a;
      });
      ecrire(cleArchive(id), arch);
    }
    ecrire(cleJournal(id), j);
  }
  function archive(id) { return lire(cleArchive(id), {}); }

  /* ===================================================================== */
  /* Export / import (SPEC §7.5) — la vraie sauvegarde                     */
  /* ===================================================================== */
  function exporte() {
    var donnees = {};
    clesMV().forEach(function (k) { donnees[k] = lire(k); });
    return {
      application: 'MathsView',
      version: VERSION,
      exporteLe: Date.now(),
      profils: profils().map(function (p) { return p.prenom; }),
      donnees: donnees
    };
  }

  function nomFichier() {
    var d = new Date();
    return 'mathsview-sauvegarde-' + d.getFullYear() + '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + '.json';
  }

  // Déclenche le téléchargement, et note la date pour le rappel des 30 jours.
  function telecharge() {
    var contenu = JSON.stringify(exporte(), null, 2);
    var blob = new global.Blob([contenu], { type: 'application/json' });
    var url = global.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nomFichier();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    global.setTimeout(function () { global.URL.revokeObjectURL(url); }, 1000);
    ecrire('mv.dernierExport', Date.now());
  }

  // Analyse un fichier SANS rien écrire : la page peut afficher ce qu'elle
  // s'apprête à remplacer avant que l'utilisateur confirme.
  function analyse(texte) {
    var o;
    try { o = JSON.parse(texte); }
    catch (e) { return { ok: false, erreur: 'Ce fichier n\'est pas un JSON valide.' }; }
    if (!o || o.application !== 'MathsView' || !o.donnees) {
      return { ok: false, erreur: 'Ce fichier n\'est pas une sauvegarde MathsView.' };
    }
    var prof = (o.donnees['mv.profils'] || []);
    return {
      ok: true, objet: o, date: o.exporteLe,
      profils: prof.map(function (p) { return p.prenom + ' (' + p.id + ')'; })
    };
  }

  // Remplace TOUT le contenu mv.* par celui de la sauvegarde.
  function importe(objet) {
    if (!objet || !objet.donnees) return false;
    clesMV().forEach(efface);
    Object.keys(objet.donnees).forEach(function (k) { ecrire(k, objet.donnees[k]); });
    return true;
  }

  // Depuis combien de jours n'a-t-on pas exporté ? (null = jamais)
  function joursDepuisExport() {
    var t = lire('mv.dernierExport', null);
    return t ? Math.floor((Date.now() - t) / 86400000) : null;
  }

  function reinitialise(id) {
    if (id) { ecrire(cleEtat(id), etatNeuf()); ecrire(cleJournal(id), []); efface(cleArchive(id)); }
    else clesMV().forEach(efface);
  }

  // La place occupée, en Ko — le quota tourne autour de 5 Mo (SPEC §9.5).
  function taille() {
    var n = 0;
    clesMV().forEach(function (k) { n += JSON.stringify(lire(k)).length + k.length; });
    return Math.round(n / 102.4) / 10;
  }

  /* ===================================================================== */
  /* Synchronisation avec le serveur                                       */
  /* ===================================================================== */
  /*
   * Trois règles, et tout le reste en découle :
   *
   *   1. On ne bloque JAMAIS l'élève. Serveur éteint, Wi-Fi coupé, Pi en train
   *      de redémarrer : le site fonctionne sur le miroir local et rattrape la
   *      synchronisation tout seul. Le mode dégradé est signalé, pas subi.
   *   2. Les écritures partent groupées et en différé. Une réponse d'exercice
   *      met à jour l'état ET le journal ; on n'envoie qu'une requête.
   *   3. Le conflit s'évite plutôt qu'il ne se fusionne. Un profil est « tenu »
   *      par un appareil à la fois (le bail) ; fusionner deux progressions
   *      divergentes serait de la devinette, et de la devinette sur les pièces
   *      et les trophées d'un enfant, ça se remarque.
   */
  var API = global.MV_API || '/api';
  var DELAI_ENVOI = 1500;      // ms — fenêtre de regroupement des écritures
  var DELAI_REPRISE = 15000;   // ms — rythme des tentatives quand c'est coupé
  var DELAI_BAIL = 30000;      // ms — renouvellement (le serveur accorde 90 s)
  var TIMEOUT = 5000;          // ms — au-delà, on considère le serveur absent

  var mode = null;             // null tant que demarre() n'a pas tranché
  var minuteur = null, repriseTimer = null, bailTimer = null;
  var enVol = false, replanifier = false;
  var ecouteurs = [];
  var appareil = identifiantAppareil();
  var bailProfil = null;

  function surEvenement(fn) { ecouteurs.push(fn); }
  function emet(nom, info) {
    ecouteurs.forEach(function (f) {
      try { f(nom, info || {}); } catch (e) { console.warn('MathsProfils : ' + e.message); }
    });
  }
  function setMode(m) { if (m !== mode) { mode = m; emet('mode', { mode: m }); } }

  function requete(methode, route, corps) {
    var ctrl = global.AbortController ? new global.AbortController() : null;
    var t = ctrl ? global.setTimeout(function () { ctrl.abort(); }, TIMEOUT) : null;
    var opt = { method: methode, headers: { 'Content-Type': 'application/json' } };
    if (corps !== undefined) opt.body = JSON.stringify(corps);
    if (ctrl) opt.signal = ctrl.signal;
    return global.fetch(API + route, opt).then(function (r) {
      if (t) global.clearTimeout(t);
      return r.text().then(function (txt) {
        var o = {};
        try { o = JSON.parse(txt); } catch (e) { /* réponse non JSON */ }
        return { code: r.status, corps: o };
      });
    }, function (e) {
      if (t) global.clearTimeout(t);
      throw e;
    });
  }

  /* --- démarrage ------------------------------------------------------- */
  /*
   * À appeler AVANT de construire la page, et à attendre. La promesse est
   * toujours tenue — jamais rejetée : elle vaut 'serveur' ou 'local', et dans
   * les deux cas le cache est prêt et la page peut se dessiner.
   */
  function demarre() {
    memoire = miroirCharge();
    versions = lireLocal('mv-local.versions') || {};
    attente = lireLocal('mv-local.attente') || {};

    if (!global.fetch) { setMode('local'); return Promise.resolve('local'); }

    return requete('GET', '/instantane').then(function (r) {
      if (r.code !== 200) throw new Error('réponse ' + r.code);
      adopte(r.corps);
      setMode('serveur');
      if (courant()) prendBail(courant());
      envoie();
      return 'serveur';
    }).catch(function () {
      setMode('local');
      programmeReprise();
      return 'local';
    });
  }

  function lireLocal(cle) {
    if (!STOCKE) return null;
    try { return JSON.parse(global.localStorage.getItem(cle)); }
    catch (e) { return null; }
  }

  function noteEtatLocal() {
    if (!STOCKE) return;
    try {
      global.localStorage.setItem('mv-local.versions', JSON.stringify(versions));
      global.localStorage.setItem('mv-local.attente', JSON.stringify(attente));
    } catch (e) { /* quota : on repartira d'une resynchronisation complète */ }
  }

  /*
   * Le serveur fait autorité, à deux exceptions près :
   *   • les clés purement locales (LOCALES) gardent leur valeur d'ici ;
   *   • les clés encore en attente d'envoi gardent leur valeur locale — sinon
   *     une coupure réseau effacerait le travail fait pendant la coupure.
   * Et un cas particulier qui n'arrive qu'une fois : serveur vierge + données
   * dans ce navigateur = première mise en service, on reprend l'existant.
   */
  function adopte(inst) {
    var avant = memoire;
    var garde = {};
    Object.keys(attente).forEach(function (k) { garde[k] = avant[k]; });
    Object.keys(LOCALES).forEach(function (k) {
      if (avant[k] !== undefined) garde[k] = avant[k];
    });

    var recu = inst.donnees || {};
    var serveurVierge = !Object.keys(recu).length;
    var avaitDuLocal = Object.keys(avant).some(function (k) {
      return k.indexOf('mv.') === 0 && !LOCALES[k];
    });

    versions = inst.versions || {};

    if (serveurVierge && avaitDuLocal) {
      memoire = avant;
      Object.keys(memoire).forEach(function (k) { if (!LOCALES[k]) attente[k] = 1; });
      console.info('MathsProfils : première synchronisation — la progression de ce navigateur est envoyée au serveur.');
    } else {
      memoire = {};
      Object.keys(recu).forEach(function (k) { memoire[k] = recu[k]; });
      Object.keys(garde).forEach(function (k) {
        if (garde[k] === undefined) delete memoire[k]; else memoire[k] = garde[k];
      });
    }
    reecritMiroir();
  }

  function reecritMiroir() {
    if (!STOCKE) return;
    try {
      var mortes = [];
      for (var i = 0; i < global.localStorage.length; i++) {
        var k = global.localStorage.key(i);
        if (k && k.indexOf('mv.') === 0 && !(k in memoire)) mortes.push(k);
      }
      mortes.forEach(function (k) { global.localStorage.removeItem(k); });
      Object.keys(memoire).forEach(function (k) { global.localStorage.setItem(k, memoire[k]); });
    } catch (e) { /* quota : miroir partiel, sans conséquence sur le serveur */ }
    noteEtatLocal();
  }

  /* --- envoi ----------------------------------------------------------- */
  function marque(cle) {
    if (LOCALES[cle]) return;          // jamais envoyée : elle n'est qu'à cet appareil
    attente[cle] = 1;
    noteEtatLocal();
    if (mode !== 'serveur') return;
    if (minuteur) global.clearTimeout(minuteur);
    minuteur = global.setTimeout(envoie, DELAI_ENVOI);
  }

  function charge() {
    var envoi = {};
    Object.keys(attente).forEach(function (k) {
      envoi[k] = { valeur: memoire[k] === undefined ? null : memoire[k],
                   version: versions[k] || 0 };
    });
    return envoi;
  }

  function envoie() {
    if (minuteur) { global.clearTimeout(minuteur); minuteur = null; }
    if (mode !== 'serveur') return;
    // Une requête est déjà partie : on ne double pas l'envoi, mais on note
    // qu'il faudra repasser — sinon ce qui vient d'être écrit attendrait le
    // prochain exercice pour partir.
    if (enVol) { replanifier = true; return; }
    var cles = Object.keys(attente);
    if (!cles.length) return;

    var envoi = charge();
    enVol = true;
    requete('PUT', '/donnees', { cles: envoi }).then(function (r) {
      enVol = false;
      if (r.code === 409) return surConflit(r.corps);
      if (r.code !== 200) { programmeReprise(); return; }

      Object.keys(r.corps.versions || {}).forEach(function (k) {
        versions[k] = r.corps.versions[k];
      });
      // Une clé réécrite PENDANT l'envoi reste en attente : sa nouvelle valeur
      // n'a pas encore été vue par le serveur.
      cles.forEach(function (k) {
        var actuelle = memoire[k] === undefined ? null : memoire[k];
        if (actuelle === envoi[k].valeur) delete attente[k];
      });
      noteEtatLocal();
      replanifier = false;
      if (Object.keys(attente).length) minuteur = global.setTimeout(envoie, DELAI_ENVOI);
    }).catch(function () {
      enVol = false;
      replanifier = false;
      setMode('local');
      programmeReprise();
    });
  }

  /*
   * Un autre appareil a écrit ces clés entre-temps. Le bail rend la chose rare
   * (surtout : la page parent et la page élève qui touchent la même chose au
   * même instant). On repart de l'état du serveur, et on le dit — plutôt que
   * d'écraser en silence le travail de quelqu'un.
   */
  function surConflit(corps) {
    var cles = Object.keys(corps.conflits || {});
    attente = {};
    noteEtatLocal();
    return requete('GET', '/instantane').then(function (r) {
      if (r.code === 200) adopte(r.corps);
      emet('conflit', { cles: cles });
    }).catch(function () { setMode('local'); programmeReprise(); });
  }

  function programmeReprise() {
    if (repriseTimer) return;
    repriseTimer = global.setInterval(function () {
      requete('GET', '/instantane').then(function (r) {
        if (r.code !== 200) return;
        global.clearInterval(repriseTimer); repriseTimer = null;
        adopte(r.corps);
        setMode('serveur');
        if (courant()) prendBail(courant());
        envoie();
      }).catch(function () { /* toujours injoignable, on repassera */ });
    }, DELAI_REPRISE);
  }

  /* --- bail ------------------------------------------------------------ */
  function identifiantAppareil() {
    var cle = 'mv-local.appareil', id = null;
    try { id = global.localStorage.getItem(cle); } catch (e) { /* rien */ }
    if (!id) {
      id = 'a' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      try { global.localStorage.setItem(cle, id); } catch (e) { /* rien */ }
    }
    return id;
  }

  function nomAppareil() {
    var nav = global.navigator || {};
    var ua = nav.userAgent || '';
    // iPadOS se fait passer pour un Mac depuis Safari : l'écran tactile trahit.
    if (/iPad/.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1)) return 'un iPad';
    if (/iPhone/.test(ua)) return 'un iPhone';
    if (/Android/.test(ua)) return 'un appareil Android';
    if (/Macintosh/.test(ua)) return 'un Mac';
    if (/Windows/.test(ua)) return 'un PC';
    return 'un autre appareil';
  }

  /*
   * Réserve l'écriture d'un profil pour cet appareil. Refusé si un autre le
   * tient encore : on émet « bail-refuse » et c'est à la page de proposer
   * « reprendre ici », qui rappellera prendBail(id, true).
   */
  function prendBail(id, force) {
    if (mode !== 'serveur' || !id) return Promise.resolve(true);
    return requete('POST', '/bail', {
      profil: id, appareil: appareil, nom: nomAppareil(), force: !!force
    }).then(function (r) {
      if (r.code === 200) {
        bailProfil = id;
        if (!bailTimer) {
          bailTimer = global.setInterval(function () {
            if (bailProfil && mode === 'serveur') prendBail(bailProfil);
          }, DELAI_BAIL);
        }
        return true;
      }
      if (bailProfil === id) bailProfil = null;   // on nous l'a repris
      emet('bail-refuse', { profil: id, appareil: r.corps.appareil });
      return false;
    }).catch(function () {
      setMode('local'); programmeReprise(); return true;
    });
  }

  function rendBail(id) {
    if (mode !== 'serveur' || !id) return;
    requete('DELETE', '/bail', { profil: id, appareil: appareil })
      .catch(function () { /* le bail expirera tout seul en 90 s */ });
  }

  /* --- fermeture de la page -------------------------------------------- */
  /*
   * `keepalive` laisse la requête partir alors que la page se ferme : sans ça,
   * les 1,5 s de regroupement suffisent à perdre le dernier exercice.
   */
  global.addEventListener('pagehide', function () {
    if (mode !== 'serveur') return;
    try {
      if (Object.keys(attente).length) {
        global.fetch(API + '/donnees', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cles: charge() }), keepalive: true
        });
      }
      if (bailProfil) {
        global.fetch(API + '/bail', {
          method: 'DELETE', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profil: bailProfil, appareil: appareil }), keepalive: true
        });
      }
    } catch (e) { /* la page s'en va, il n'y a plus rien à sauver */ }
  });

  // Sur mobile, `pagehide` n'est pas garanti : on pousse aussi dès que la page
  // passe en arrière-plan, ce qui est le moment où l'enfant range la tablette.
  global.addEventListener('visibilitychange', function () {
    if (global.document.visibilityState === 'hidden') envoie();
  });

  /* ===================================================================== */
  global.MathsProfils = {
    // stockage brut (le reste du code ne doit PAS utiliser localStorage)
    lire: lire, ecrire: ecrire, efface: efface, cles: clesMV, disponible: STOCKE,
    // profils
    profils: profils, profil: profil, creer: creer, modifier: modifier,
    supprimer: supprimer, courant: courant, setCourant: setCourant,
    couleurs: COULEURS, emojis: EMOJIS,
    // état et journal
    etat: etat, setEtat: setEtat, etatNeuf: etatNeuf,
    journal: journal, ajouteJournal: ajouteJournal, archive: archive,
    // sauvegarde
    exporte: exporte, telecharge: telecharge, analyse: analyse, importe: importe,
    nomFichier: nomFichier, joursDepuisExport: joursDepuisExport,
    reinitialise: reinitialise, taille: taille, version: VERSION,
    // synchronisation
    demarre: demarre, surEvenement: surEvenement, prendBail: prendBail,
    mode: function () { return mode || 'local'; },
    enAttente: function () { return Object.keys(attente).length; },
    pousse: envoie
  };

})(window);
