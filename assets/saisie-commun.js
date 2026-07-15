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
 * Noms lisibles des jeux, pour l'affichage du panneau de file d'attente.
 */
const GJN26_NOMS_JEUX = {
  ateliers: 'Ateliers Permanents',
  dimanche: 'Jeu du Dimanche',
  observation: 'Lundi — Observation',
  katane_postes: 'Lundi — Katane (poste)',
  katane_armurerie: 'Lundi — Katane (armurerie)',
  combatfinal: 'Lundi — Combat Final',
};

/**
 * Injecte une fois le CSS et le HTML du panneau de file d'attente (badge
 * cliquable + détail dépliable), sans avoir besoin de toucher au HTML de
 * chaque page individuelle. Idempotent : ne fait rien si déjà injecté.
 */
function gjn26InjecterPanneauFileAttente_() {
  if (document.getElementById('gjn26-panneau-attente')) return;

  const style = document.createElement('style');
  style.textContent = `
    #gjn26-indicateur-attente{
      display:none; max-width:480px; margin:12px auto 0; cursor:pointer;
      background:var(--ambre-fond,#FBEFD9); color:var(--ambre,#8A5A17); border:1px solid #E4C888; border-radius:10px;
      padding:9px 14px; font-size:.8rem; font-weight:700; text-align:center;
      font-family:var(--font-ui,sans-serif); user-select:none;
    }
    #gjn26-indicateur-attente.visible{ display:block; }
    #gjn26-indicateur-attente::after{ content:' ▾'; font-weight:400; }
    #gjn26-indicateur-attente.ouvert::after{ content:' ▴'; }
    #gjn26-panneau-attente{
      display:none; max-width:480px; margin:6px auto 0; background:#fff; border:1px solid #E4C888;
      border-radius:10px; padding:10px 12px; font-family:var(--font-ui,sans-serif);
    }
    #gjn26-panneau-attente.ouvert{ display:block; }
    .gjn26-item-attente{
      font-size:.78rem; padding:7px 4px; border-bottom:1px solid #F0E6D0; display:flex; justify-content:space-between; gap:8px;
    }
    .gjn26-item-attente:last-child{ border-bottom:none; }
    .gjn26-item-attente .jeu{ font-weight:700; color:var(--encre,#241C10); }
    .gjn26-item-attente .quand{ color:var(--encre-douce,#5B5142); flex-shrink:0; }
    .gjn26-panneau-actions{ display:flex; gap:8px; margin-top:8px; }
    .gjn26-panneau-actions button{
      flex:1; padding:8px; border-radius:8px; border:1px solid var(--ambre,#8A5A17); background:#fff;
      color:var(--ambre,#8A5A17); font-weight:700; font-size:.76rem; cursor:pointer; font-family:var(--font-ui,sans-serif);
    }
    .gjn26-panneau-actions button:active{ background:var(--ambre-fond,#FBEFD9); }
  `;
  document.head.appendChild(style);

  const panneau = document.createElement('div');
  panneau.id = 'gjn26-panneau-attente';
  panneau.innerHTML = `
    <div id="gjn26-liste-attente"></div>
    <div class="gjn26-panneau-actions">
      <button id="gjn26-btn-copier-attente" type="button">📋 Copier en texte</button>
      <button id="gjn26-btn-reessayer-attente" type="button">↻ Réessayer maintenant</button>
    </div>
  `;
  const indicateur = document.getElementById('gjn26-indicateur-attente');
  if (indicateur && indicateur.parentNode) {
    indicateur.parentNode.insertBefore(panneau, indicateur.nextSibling);
    indicateur.addEventListener('click', () => {
      indicateur.classList.toggle('ouvert');
      panneau.classList.toggle('ouvert');
    });
  }

  document.getElementById('gjn26-btn-copier-attente').addEventListener('click', gjn26CopierFileAttente);
  document.getElementById('gjn26-btn-reessayer-attente').addEventListener('click', () => gjn26ViderFileAttente());
}

function gjn26FormaterResumeItem_(item) {
  const cle = item.donnees && item.donnees['CléPatrouille'] ? item.donnees['CléPatrouille'].split('|').pop() : '?';
  const heure = new Date(item.horodatage).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return { nomJeu: GJN26_NOMS_JEUX[item.gameId] || item.gameId, cle, heure };
}

function gjn26RemplirPanneauFileAttente_() {
  const file = gjn26LireFileAttente();
  const liste = document.getElementById('gjn26-liste-attente');
  if (!liste) return;
  liste.innerHTML = file.map(item => {
    const r = gjn26FormaterResumeItem_(item);
    return `<div class="gjn26-item-attente"><span class="jeu">${r.nomJeu} — ${r.cle}</span><span class="quand">${r.heure}</span></div>`;
  }).join('');
}

/**
 * Copie la file d'attente sous forme de texte lisible (presse-papiers) —
 * utile pour qu'un chef bloqué sans réseau puisse dicter/transmettre ses
 * saisies en attente par un autre moyen (talkie, appel...).
 */
function gjn26CopierFileAttente() {
  const file = gjn26LireFileAttente();
  if (file.length === 0) return;
  const lignes = file.map((item, i) => {
    const r = gjn26FormaterResumeItem_(item);
    const detail = Object.entries(item.donnees || {})
      .filter(([k]) => k !== 'CléPatrouille')
      .map(([k, v]) => k + '=' + v).join(', ');
    return (i + 1) + '. [' + r.heure + '] ' + r.nomJeu + ' — ' + r.cle + ' — ' + detail;
  });
  const texte = 'GJN26 — File d\'attente hors-ligne (' + file.length + ' envoi(s))\n' + lignes.join('\n');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(texte).then(() => {
      const btn = document.getElementById('gjn26-btn-copier-attente');
      if (btn) { const orig = btn.textContent; btn.textContent = '✓ Copié !'; setTimeout(() => btn.textContent = orig, 1500); }
    }).catch(() => window.prompt('Copier ce texte :', texte));
  } else {
    window.prompt('Copier ce texte :', texte);
  }
}

/**
 * Met à jour le badge "N envois en attente" + le panneau détaillé, si
 * l'élément #gjn26-indicateur-attente existe sur la page.
 */
function gjn26MajIndicateurFileAttente() {
  const el = document.getElementById('gjn26-indicateur-attente');
  if (!el) return;
  gjn26InjecterPanneauFileAttente_();

  const n = gjn26LireFileAttente().length;
  if (n === 0) {
    el.classList.remove('visible');
    el.classList.remove('ouvert');
    const panneau = document.getElementById('gjn26-panneau-attente');
    if (panneau) panneau.classList.remove('ouvert');
  } else {
    el.textContent = n === 1
      ? '1 envoi en attente de réseau'
      : n + ' envois en attente de réseau';
    el.classList.add('visible');
    gjn26RemplirPanneauFileAttente_();
  }
}

window.addEventListener('online', gjn26ViderFileAttente);
window.addEventListener('load', gjn26ViderFileAttente);
