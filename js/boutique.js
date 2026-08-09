/*
 * La boutique (SPEC §8).
 *
 * Trois idées de conception, qui ne sont pas des détails :
 *
 *   • un achat n'est JAMAIS une transaction immédiate : c'est une demande. Les
 *     pièces partent en réserve, le parent valide ou refuse. Ça évite la
 *     surprise du samedi matin, et ça rend le refus possible sans que les
 *     pièces soient perdues ;
 *
 *   • le budget mensuel est PLAFONNÉ, en euros. Sans plafond, le taux de
 *     conversion se renégocie tous les mois — et c'est le parent qui perd. Le
 *     plafond ne bloque que ce qui coûte de l'argent : les privilèges restent
 *     toujours accessibles ;
 *
 *   • les privilèges valent souvent mieux que le cash. « Tu choisis le film du
 *     samedi » coûte zéro euro et se négocie très cher.
 *
 * Le mois est remis à zéro PARESSEUSEMENT, à la lecture : aucun minuteur, et
 * rien à faire tourner le 1er du mois.
 */
(function (global) {
  'use strict';

  var JOUR = 86400000;

  var DEFAUT = [
    /* --- privilèges : le meilleur rapport valeur / coût réel ------------ */
    { id: 'cine',    nom: 'Tu choisis le film du samedi soir',  cout: 60,
      type: 'privilege', cooldownJours: 7 },
    { id: 'corvee',  nom: 'Joker de corvée (une corvée sautée)', cout: 80,
      type: 'privilege', cooldownJours: 14 },
    { id: 'menu',    nom: 'Tu choisis le menu du dimanche',     cout: 50,
      type: 'privilege', cooldownJours: 7 },
    { id: 'coucher', nom: '30 minutes de coucher décalé',       cout: 40,
      type: 'privilege', cooldownJours: 7 },
    { id: 'duo',     nom: 'Un après-midi en tête-à-tête avec papa ou maman',
      cout: 150, type: 'privilege', cooldownJours: 30 },
    { id: 'musique', nom: 'Choix de la musique en voiture pendant une semaine',
      cout: 45, type: 'privilege', cooldownJours: 7 },

    /* --- argent de poche : 100 pièces = 1 €, par paliers de 200 --------- */
    { id: 'argent2',  nom: '2 € d\'argent de poche',  cout: 200,  type: 'argent', euros: 2 },
    { id: 'argent4',  nom: '4 € d\'argent de poche',  cout: 400,  type: 'argent', euros: 4 },
    { id: 'argent10', nom: '10 € d\'argent de poche', cout: 1000, type: 'argent', euros: 10 }
    /* Les bons cadeaux sont à configurer par le parent : les enseignes
       dépendent de la famille, il n'y a pas de valeur par défaut sensée. */
  ];

  /* ===================================================================== */
  /* Réglages et catalogue                                                 */
  /* ===================================================================== */
  function admin() {
    var a = MathsProfils.lire('mv.admin', null) || {};
    if (a.budgetMensuel === undefined) a.budgetMensuel = 15;
    if (a.tauxPieces === undefined) a.tauxPieces = 100;   // pièces pour 1 €
    if (!a.boutique || !a.boutique.length) a.boutique = DEFAUT.slice();
    if (!a.depenses) a.depenses = [];
    return a;
  }
  function setAdmin(a) { MathsProfils.ecrire('mv.admin', a); }

  function articles() { return admin().boutique.slice(); }
  function setArticles(l) { var a = admin(); a.boutique = l; setAdmin(a); }
  function article(id) {
    return articles().filter(function (x) { return x.id === id; })[0] || null;
  }
  function reglages() {
    var a = admin();
    return { budgetMensuel: a.budgetMensuel, tauxPieces: a.tauxPieces };
  }
  function setReglages(r) {
    var a = admin();
    if (r.budgetMensuel !== undefined) a.budgetMensuel = Math.max(0, Number(r.budgetMensuel));
    if (r.tauxPieces !== undefined) a.tauxPieces = Math.max(1, Number(r.tauxPieces));
    setAdmin(a);
  }

  // Ce que vaut un article en euros : explicite pour un article `argent`/`bon`,
  // zéro pour un privilège.
  function eurosDe(art) {
    if (!art) return 0;
    if (art.euros !== undefined) return Number(art.euros);
    if (art.type === 'privilege') return 0;
    return Math.round(100 * art.cout / reglages().tauxPieces) / 100;
  }

  /* ===================================================================== */
  /* Budget du mois (remis à zéro à la lecture)                            */
  /* ===================================================================== */
  function moisCourant() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
  }
  function depensesDuMois() {
    var a = admin();
    var m = moisCourant();
    var duMois = a.depenses.filter(function (d) { return d.mois === m; });
    // On profite de la lecture pour oublier les mois révolus (§8.3), en gardant
    // les douze derniers pour l'historique de l'admin.
    if (a.depenses.length > duMois.length) {
      a.depenses = a.depenses.slice(-200);
      setAdmin(a);
    }
    return duMois;
  }
  function totalDuMois() {
    return depensesDuMois().reduce(function (n, d) { return n + d.euros; }, 0);
  }
  function budgetRestant() {
    return Math.max(0, Math.round(100 * (admin().budgetMensuel - totalDuMois())) / 100);
  }

  /* ===================================================================== */
  /* Demandes d'achat                                                      */
  /* ===================================================================== */
  function achats(id) { return MathsProfils.etat(id).achats || []; }

  function peutDemander(id, articleId) {
    var art = article(articleId);
    if (!art) return { ok: false, raison: 'Cet article n\'existe plus.' };
    var etat = MathsProfils.etat(id);
    var mes = etat.achats || [];

    if ((etat.pieces || 0) < art.cout) {
      return { ok: false, raison: 'Il te manque ' +
        (art.cout - (etat.pieces || 0)) + ' pièces.' };
    }
    // Une demande déjà en attente sur le même article : on n'empile pas.
    var enAttente = mes.filter(function (d) {
      return d.article === articleId && d.statut === 'en-attente';
    }).length;
    var stock = art.stock === undefined ? 1 : art.stock;
    if (enAttente >= stock) {
      return { ok: false, raison: 'Tu as déjà une demande en attente pour ça.' };
    }
    // Délai entre deux demandes du même article.
    if (art.cooldownJours) {
      var dernier = 0;
      mes.forEach(function (d) {
        if (d.article === articleId && d.statut === 'valide') {
          dernier = Math.max(dernier, d.date);
        }
      });
      if (dernier && Date.now() - dernier < art.cooldownJours * JOUR) {
        var reste = Math.ceil((art.cooldownJours * JOUR - (Date.now() - dernier)) / JOUR);
        return { ok: false, raison: 'Encore ' + reste + ' jour' +
          (reste > 1 ? 's' : '') + ' avant de pouvoir le redemander.' };
      }
    }
    // Le plafond mensuel ne s'applique qu'à ce qui coûte de l'argent.
    var e = eurosDe(art);
    if (e > 0 && e > budgetRestant()) {
      return { ok: false, raison: 'Le budget du mois est atteint (' +
        budgetRestant().toFixed(2).replace('.', ',') + ' € restants). ' +
        'Les privilèges, eux, restent disponibles.' };
    }
    return { ok: true };
  }

  // Créer la demande : les pièces partent en réserve tout de suite, sinon
  // elles pourraient être dépensées deux fois en attendant la validation.
  function demander(id, articleId) {
    var v = peutDemander(id, articleId);
    if (!v.ok) return v;
    var art = article(articleId);
    var etat = MathsProfils.etat(id);
    var d = {
      id: 'a' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      article: art.id, nom: art.nom, cout: art.cout, euros: eurosDe(art),
      type: art.type, date: Date.now(), statut: 'en-attente', mot: ''
    };
    etat.achats = (etat.achats || []).concat([d]);
    etat.pieces = (etat.pieces || 0) - art.cout;
    MathsProfils.setEtat(id, etat);
    return { ok: true, demande: d };
  }

  function trouve(id, demandeId) {
    var etat = MathsProfils.etat(id);
    var d = (etat.achats || []).filter(function (x) { return x.id === demandeId; })[0];
    return { etat: etat, demande: d };
  }

  function valider(id, demandeId) {
    var t = trouve(id, demandeId);
    if (!t.demande || t.demande.statut !== 'en-attente') return false;
    t.demande.statut = 'valide';
    t.demande.repondu = Date.now();
    MathsProfils.setEtat(id, t.etat);          // les pièces étaient déjà retirées
    if (t.demande.euros > 0) {
      var a = admin();
      a.depenses.push({ mois: moisCourant(), t: Date.now(), profil: id,
                        article: t.demande.article, euros: t.demande.euros });
      setAdmin(a);
    }
    return true;
  }

  function refuser(id, demandeId, mot) {
    var t = trouve(id, demandeId);
    if (!t.demande || t.demande.statut !== 'en-attente') return false;
    t.demande.statut = 'refuse';
    t.demande.repondu = Date.now();
    t.demande.mot = mot || '';
    t.etat.pieces = (t.etat.pieces || 0) + t.demande.cout;   // rendues
    MathsProfils.setEtat(id, t.etat);
    return true;
  }

  // Toutes les demandes, tous profils confondus — c'est la vue de l'admin.
  function demandes(statut) {
    var out = [];
    MathsProfils.profils().forEach(function (p) {
      achats(p.id).forEach(function (d) {
        if (!statut || d.statut === statut) out.push({ profil: p, demande: d });
      });
    });
    return out.sort(function (a, b) { return b.demande.date - a.demande.date; });
  }

  global.MathsBoutique = {
    defaut: function () { return DEFAUT.slice(); },
    articles: articles, setArticles: setArticles, article: article,
    reglages: reglages, setReglages: setReglages, eurosDe: eurosDe,
    depensesDuMois: depensesDuMois, totalDuMois: totalDuMois,
    budgetRestant: budgetRestant, moisCourant: moisCourant,
    achats: achats, peutDemander: peutDemander, demander: demander,
    valider: valider, refuser: refuser, demandes: demandes
  };

})(window);
