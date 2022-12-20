import { IETATADMINSTRATIF } from '#models/etat-administratif';
import { ISTATUTDIFFUSION } from '#models/statut-diffusion';
import logErrorInSentry from '../../utils/sentry';

/**
 * Turn letter based etatAdministratif into Boolean. Logs any unkniown value
 * @param etatAdministratifInsee
 * @param siren
 * @param siret
 * @returns
 */
export const etatFromEtatAdministratifInsee = (
  etatAdministratifInsee: 'A' | 'C' | 'F' | string = '',
  sirenOrSiret: string
) => {
  switch (etatAdministratifInsee) {
    case 'A':
      return IETATADMINSTRATIF.ACTIF;
    case 'C':
      return IETATADMINSTRATIF.CESSEE;
    case 'F':
      return IETATADMINSTRATIF.FERME;
    default:
      logErrorInSentry('API Sirene - Unknown Etat Administratif', {
        siret: sirenOrSiret,
        details: etatAdministratifInsee,
      });
      return IETATADMINSTRATIF.INCONNU;
  }
};

/**
 * Turn letter based statut diffusion into Boolean. Logs any unkniown value
 * @param statutDiffusionInsee
 * @param siren
 * @param siret
 * @returns
 */
export const statuDiffusionFromStatutDiffusionInsee = (
  statutDiffusionInsee: 'O' | 'N' | 'P' | string = '',
  sirenOrSiret: string
) => {
  switch (statutDiffusionInsee) {
    case 'O':
      return ISTATUTDIFFUSION.DIFFUSIBLE;
    case 'N':
      return ISTATUTDIFFUSION.NONDIFF;
    case 'P':
      return ISTATUTDIFFUSION.PARTIAL;
    default:
      logErrorInSentry('API Sirene - Unknown Statut Diffusion', {
        siret: sirenOrSiret,
        details: statutDiffusionInsee,
      });
      return ISTATUTDIFFUSION.DIFFUSIBLE;
  }
};
