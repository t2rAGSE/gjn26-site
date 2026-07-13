/************************************************************
 * GJN26 — CONFIGURATION DES POINTS DE SOUMISSION
 *
 * À COMPLÉTER après avoir lancé creerFormulairesSaisie() dans Apps Script :
 * ouvrir l'onglet "Config_Formulaires" du Sheet GJN26 - Notation, et copier
 * pour chaque jeu l'URL formResponse + les entry.XXXXXXX affichés.
 *
 * Tant que ce fichier contient encore "REMPLACER", le site affiche un
 * avertissement au lieu d'essayer d'envoyer les données (voir saisie.js).
 ************************************************************/

const FORM_CONFIG = {

  ateliers: {
    actionUrl: 'REMPLACER_PAR_URL_formResponse',
    entryIds: {
      CléPatrouille: 'REMPLACER_entry.XXXXXXX',
      NumAtelier:    'REMPLACER_entry.XXXXXXX',
      Résultat:      'REMPLACER_entry.XXXXXXX',
    }
  },

  dimanche: {
    actionUrl: 'REMPLACER_PAR_URL_formResponse',
    entryIds: {
      CléPatrouille:    'REMPLACER_entry.XXXXXXX',
      BalisesPhase1:    'REMPLACER_entry.XXXXXXX',
      BalisesPhase2:    'REMPLACER_entry.XXXXXXX',
      PrecisionCroquis: 'REMPLACER_entry.XXXXXXX',
      CleTemplier:      'REMPLACER_entry.XXXXXXX',
      Vigenere:         'REMPLACER_entry.XXXXXXX',
    }
  },

  observation: {
    actionUrl: 'REMPLACER_PAR_URL_formResponse',
    entryIds: {
      CléPatrouille:   'REMPLACER_entry.XXXXXXX',
      BalisesTrouvees: 'REMPLACER_entry.XXXXXXX',
      BonnesReponses:  'REMPLACER_entry.XXXXXXX',
      CodesAdverses:   'REMPLACER_entry.XXXXXXX',
      NbFoisReperee:   'REMPLACER_entry.XXXXXXX',
    }
  },

  katane_postes: {
    actionUrl: 'REMPLACER_PAR_URL_formResponse',
    entryIds: {
      CléPatrouille: 'REMPLACER_entry.XXXXXXX',
      PA:            'REMPLACER_entry.XXXXXXX',
      NiveauEpreuve: 'REMPLACER_entry.XXXXXXX',
      Reussi:        'REMPLACER_entry.XXXXXXX',
    }
  },

  katane_armurerie: {
    actionUrl: 'REMPLACER_PAR_URL_formResponse',
    entryIds: {
      CléPatrouille: 'REMPLACER_entry.XXXXXXX',
      TypeArmee:     'REMPLACER_entry.XXXXXXX',
    }
  },

  combatfinal: {
    actionUrl: 'REMPLACER_PAR_URL_formResponse',
    entryIds: {
      CléPatrouille:       'REMPLACER_entry.XXXXXXX',
      FormationConservee:  'REMPLACER_entry.XXXXXXX',
      BrinsLaineRestants:  'REMPLACER_entry.XXXXXXX',
    }
  },

};
