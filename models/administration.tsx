export enum EAdministration {
  INPI = 1,
  INSEE,
  CMAFRANCE,
  DILA,
  METI,
}

export const administrationsMetaData = {
  [EAdministration.INPI]: {
    long: 'Institut National de la Propriété Intellectuelle (INPI)',
    short: 'INPI',
  },
  [EAdministration.INSEE]: {
    long:
      'Institut national de la Statistique et des Études Économiques (INSEE)',
    short: 'INSEE',
  },
  [EAdministration.DILA]: {
    long: 'Direction de l’Information Légale et Administrative (DILA)',
    short: 'DILA',
  },
  [EAdministration.METI]: {
    long: 'Ministère du Travail de l’Emploi et de l’Insertion (METI)',
    short: 'METI',
  },
  [EAdministration.CMAFRANCE]: {
    long: 'Chambre des Métiers et de l’Artisnat (CMA-France)',
    short: 'CMA-France',
  },
};
