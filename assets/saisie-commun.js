/************************************************************
 * GJN26 — SOUMISSION VERS GOOGLE FORMS + FILE D'ATTENTE HORS-LIGNE
 *
 * Principe (cf. décision "Option B") : le formulaire visuel custom du site
 * ne parle jamais à notre propre Apps Script pour l'ÉCRITURE des scores —
 * il poste directement vers l'endpoint natif de soumission d'un Google
 * Form (formResponse), pour profiter de l'infrastructure Google qui
 * encaisse nativement de forts pics de soumissions simultanées.
 *
 * Cet endpoint répond en mode "opaque" (no-cors) : on ne peut jamais lire
 * le code HTTP de retour. On ne peut détecter que les échecs RÉSEAU
 * (pas de signal / avion / DNS), pas les échecs de validation côté Forms.
 * D'où la file d'attente : si l'appareil est hors-ligne, la saisie est
 * conservée localement et renvoyée automatiquement dès que le réseau revient.
 ************************************************************/

const GJN26_QUEUE_KEY = 'gjn26_file_attente_v1';

/**
 * Envoie une saisie vers le Google Form correspondant.
 * @param {string} gameId - clé dans FORM_CONFIG (ex: 'ateliers')
 * @param {Object} donnees - { NomDuChamp: valeur, ... } — les clés doivent
 *        correspondre à celles définies dans FORM_CONFIG.entryIds
 * @param {boolean} [silencieux] - si true, ne modifie pas l'UI (utilisé par la purge de file)
 * @returns {Promise<boolean>} true si l'envoi réseau a réussi (pas de garantie d'écriture serveur)
 */
async function gjn26EnvoyerSaisie(gameId, donnees, silencieux) {
  const conf = (typeof FORM_CONFIG !== 'undefined') ? FORM_CONFIG[gameId] : null;

  if (!conf || !conf.actionUrl || conf.actionUrl.indexOf('REMPLACER') !== -1) {
    console.warn('[GJN26] form-config.js non complété pour "' + gameId + '" — saisie mise en file d\'attente locale, mais ne partira réellement qu\'une fois le formulaire configuré.');
    gjn26AjouterAFileAttente(gameId, donnees);
    if (!silencieux) gjn26MajIndicateurFileAttente();
    return false;
  }

  const body = new URLSearchParams();
  Object.keys(donnees).forEach(champ => {
    const entryId = conf.entryIds[champ];
    if (entryId) body.append(entryId, donnees[champ]);
  });

  try {
    await fetch(conf.actionUrl, { method: 'POST', mode: 'no-cors', body: body });
    return true; // pas de lecture de statut possible en no-cors : succès réseau supposé
  } catch (erreurReseau) {
    // Hors-ligne, DNS injoignable, etc. : on garde la saisie pour plus tard.
    gjn26AjouterAFileAttente(gameId, donnees);
    if (!silencieux) gjn26MajIndicateurFileAttente();
    return false;
  }
}

function gjn26AjouterAFileAttente(gameId, donnees) {
  const file = gjn26LireFileAttente();
  file.push({ gameId: gameId, donnees: donnees, horodatage: new Date().toISOString() });
  localStorage.setItem(GJN26_QUEUE_KEY, JSON.stringify(file));
}

function gjn26LireFileAttente() {
  try {
    return JSON.parse(localStorage.getItem(GJN26_QUEUE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Tente de renvoyer toutes les saisies en attente (à appeler au chargement
 * de la page et sur l'évènement 'online').
 */
async function gjn26ViderFileAttente() {
  let file = gjn26LireFileAttente();
  if (file.length === 0) { gjn26MajIndicateurFileAttente(); return; }

  const restant = [];
  for (const item of file) {
    const ok = await gjn26EnvoyerSaisie(item.gameId, item.donnees, true);
    if (!ok) restant.push(item);
  }
  localStorage.setItem(GJN26_QUEUE_KEY, JSON.stringify(restant));
  gjn26MajIndicateurFileAttente();
}

/**
 * Met à jour un badge visuel "N envois en attente" si l'élément
 * #gjn26-indicateur-attente existe sur la page.
 */
function gjn26MajIndicateurFileAttente() {
  const n = gjn26LireFileAttente().length;
  const el = document.getElementById('gjn26-indicateur-attente');
  if (!el) return;
  if (n === 0) {
    el.classList.remove('visible');
  } else {
    el.textContent = n === 1
      ? '1 envoi en attente de réseau'
      : n + ' envois en attente de réseau';
    el.classList.add('visible');
  }
}

window.addEventListener('online', gjn26ViderFileAttente);
window.addEventListener('load', gjn26ViderFileAttente);
