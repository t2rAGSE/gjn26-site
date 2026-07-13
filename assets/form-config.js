/************************************************************
 * GJN26 — CONFIGURATION DES POINTS DE SOUMISSION
 *
 * Rempli automatiquement à partir de l'onglet Config_Formulaires
 * (relevé le 13/07/2026). Si un formulaire est un jour recréé (champs
 * ajoutés/retirés), les entry.XXXXXXX changeront : relancer
 * reconstruireConfigFormulaires() puis regénérer ce fichier.
 ************************************************************/
const FORM_CONFIG = {

  ateliers: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfnD-xaSbuxO7mks85UTTvs2byecOmd2un7feHl1-2fJToK5w/formResponse',
    entryIds: {
      CléPatrouille: 'entry.1391428527',
      NumAtelier: 'entry.96547409',
      Résultat: 'entry.2001842195',
    }
  },

  dimanche: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeDKyqpUlZlOCYuVEKvlREH41oJqS0YVGxHxvJYaX4bm6twmQ/formResponse',
    entryIds: {
      CléPatrouille: 'entry.1498011605',
      BalisesPhase1: 'entry.1009504138',
      BalisesPhase2: 'entry.1840038411',
      PrecisionCroquis: 'entry.339511194',
      CleTemplier: 'entry.58700505',
      Vigenere: 'entry.1776738209',
    }
  },

  observation: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSekRKjVmTbjlnB99b26MOrbAspfPJPxEAJM5gBMxKFQ5j-8hw/formResponse',
    entryIds: {
      CléPatrouille: 'entry.25589496',
      BalisesTrouvees: 'entry.1893598611',
      BonnesReponses: 'entry.575082896',
      CodesAdverses: 'entry.392265178',
      NbFoisReperee: 'entry.1232677251',
    }
  },

  katane_postes: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScqJRkszl4DeVJ7iDY-nbi2PuUlY6hyEsY1NjAlN0ZtOeo0Zw/formResponse',
    entryIds: {
      CléPatrouille: 'entry.1088760427',
      PA: 'entry.949907939',
      NiveauEpreuve: 'entry.1077339013',
      Reussi: 'entry.1964222210',
    }
  },

  katane_armurerie: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfZCik0oMARayaCXSMhE9Ff99Z8qA_9BMMEAjVl19TcoMNiOw/formResponse',
    entryIds: {
      CléPatrouille: 'entry.2098217799',
      TypeArmee: 'entry.2048534933',
    }
  },

  combatfinal: {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSezBhdjBlLps7-gmtQp5QZOUiDMqcw7PgJdBqGbJZbflP2uiw/formResponse',
    entryIds: {
      CléPatrouille: 'entry.33258293',
      FormationConservee: 'entry.1117243296',
      BrinsLaineRestants: 'entry.1171295364',
    }
  },

};
