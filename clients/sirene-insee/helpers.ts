import logErrorInSentry from '../../utils/sentry';

/**
 * Turn letter based etatAdministratif into Boolean. Logs any unkniown value
 * @param etatAdministratifInsee
 * @param siren
 * @param siret
 * @returns
 */
export const estActiveFromEtatAdministratifInsee = (
  etatAdministratifInsee: 'A' | 'C' | 'F' | string = '',
  siren = '',
  siret = ''
) => {
  switch (etatAdministratifInsee) {
    case 'A':
      return true;
    case 'C':
      return false;
    case 'F':
      return false;
    default:
      logErrorInSentry('API Sirene - Unknown Etat Administratif', {
        siren,
        siret,
        details: etatAdministratifInsee,
      });
      return false;
  }
};

/**
 * Turn letter based statut diffusion into Boolean. Logs any unkniown value
 * @param statutDiffusionInsee
 * @param siren
 * @param siret
 * @returns
 */
export const estDiffusibleFromStatutDiffusionInsee = (
  statutDiffusionInsee: 'O' | 'N' | 'P' | string = '',
  siren = '',
  siret = ''
) => {
  switch (statutDiffusionInsee) {
    case 'O':
      return true;
    case 'N':
      return false;
    case 'P':
      return false;
    default:
      logErrorInSentry('API Sirene - Unknown Statut Diffusion', {
        siren,
        siret,
        details: statutDiffusionInsee,
      });
      return false;
  }
};
