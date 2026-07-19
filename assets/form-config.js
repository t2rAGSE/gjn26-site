/************************************************************
 * GJN26 — CONFIGURATION DES POINTS DE SOUMISSION
 *
 * Rempli le 16/07/2026 à partir des VRAIS entry.XXXXXXX obtenus via
 * "Obtenir un lien pré-rempli" sur chaque formulaire (source fiable à
 * 100% — item.getId() côté Apps Script s'est révélé ne pas toujours
 * correspondre à l'entry réel utilisé à la soumission, ne plus utiliser
 * reconstruireConfigFormulaires() seul pour regénérer ce fichier).
 ************************************************************/
const FORM_CONFIG = {

  ateliers: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfnD-xaSbuxO7mks85UTTvs2byecOmd2un7feHl1-2fJToK5w/formResponse',
    entryIds: {
      CléPatrouille: 'entry.1135656408',
      NumAtelier: 'entry.1795682552',
      Résultat: 'entry.1974970341',
    }
  },


  dimanche_balises: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfMeYG3JarjSB59-XBfsa5AEW5KBgsdLKEP8OxHzhEgT-Oj3w/formResponse',
    entryIds: {
      CléPatrouille: 'entry.1492364769',
      BalisesPhase1: 'entry.1490126838',
      BalisesPhase2: 'entry.948930006',
      PrecisionCroquis: 'entry.464912131',
    }
  },

  dimanche_dechiffrage: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSelrX5PcByinGZhMLpCuvCcOO_f8BIn3SxQjUw-n9dut6siMA/formResponse',
    entryIds: {
      CléPatrouille: 'entry.1866128105',
      CleTemplier: 'entry.1810365679',
      Vigenere: 'entry.1308893246',
    }
  },

  observation: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSekRKjVmTbjlnB99b26MOrbAspfPJPxEAJM5gBMxKFQ5j-8hw/formResponse',
    entryIds: {
      CléPatrouille: 'entry.167946826',
      BalisesTrouvees: 'entry.1370278533',
      BonnesReponses: 'entry.325025470',
      CodesAdverses: 'entry.1694041563',
      NbFoisReperee: 'entry.834200761',
    }
  },

  katane_postes: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScqJRkszl4DeVJ7iDY-nbi2PuUlY6hyEsY1NjAlN0ZtOeo0Zw/formResponse',
    entryIds: {
      CléPatrouille: 'entry.1800019512',
      PA: 'entry.1404645564',
      NiveauEpreuve: 'entry.2142271501',
      Reussi: 'entry.268236388',
    }
  },

  katane_armurerie: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfZCik0oMARayaCXSMhE9Ff99Z8qA_9BMMEAjVl19TcoMNiOw/formResponse',
    entryIds: {
      CléPatrouille: 'entry.379389619',
      TypeArmee: 'entry.1302340804',
    }
  },

  combatfinal: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSezBhdjBlLps7-gmtQp5QZOUiDMqcw7PgJdBqGbJZbflP2uiw/formResponse',
    entryIds: {
      CléPatrouille: 'entry.566844147',
      FormationConservee: 'entry.675892885',
      BrinsLaineRestants: 'entry.1190811011',
    }
  },

};
