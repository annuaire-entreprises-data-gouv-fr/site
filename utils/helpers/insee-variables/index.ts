import { EAdministration } from '#models/administrations/EAdministration';
import { IETATADMINSTRATIF } from '#models/core/etat-administratif';
import { ISTATUTDIFFUSION } from '#models/core/statut-diffusion';
import { Exception } from '#models/exceptions';
import logErrorInSentry from '../../sentry';

/**
 * Turn letter based etatAdministratif into Boolean. Logs any unkniown value
 * @param etatAdministratifInsee
 * @param siren
 * @param siret
 * @returns
 */
export const etatFromEtatAdministratifInsee = (
  etatAdministratifInsee: 'A' | 'C' | 'F' | 'I' | string = '',
  sirenOrSiret: string
) => {
  switch (etatAdministratifInsee) {
    case 'A':
      return IETATADMINSTRATIF.ACTIF;
    case 'C':
      return IETATADMINSTRATIF.CESSEE;
    case 'F':
      return IETATADMINSTRATIF.FERME;
    case 'I':
      // cette valeur est utilisée dans le cas d'entreprise inscrite au RNE mais absente de la base SIRENE
      return IETATADMINSTRATIF.INCONNU;
    default:
      logErrorInSentry(
        new APISireneUnknownParameterException(
          'Unknown Etat Administratif',
          sirenOrSiret,
          etatAdministratifInsee
        )
      );
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
      logErrorInSentry(
        new APISireneUnknownParameterException(
          'Unknown Statut Diffusion',
          sirenOrSiret,
          statutDiffusionInsee
        )
      );
      return ISTATUTDIFFUSION.DIFFUSIBLE;
  }
};

class APISireneUnknownParameterException extends Exception {
  administration = EAdministration.INSEE;
  constructor(message: string, siret: string, details: string) {
    super({
      name: 'APISireneUnknownParameterException',
      message,
      context: {
        siret,
        details,
      },
    });
  }
}

/***
 * Insee's dateCreation is quite weird for unite legale and etablissement
 * this formatter harmonize all creation dates
 *
 * https://www.sirene.fr/static-resources/htm/v_sommaire.htm#8
 *
 * Quote :
 * “si la date de création est au 01/01/1900 dans Sirene,
 * la date est forcée à null. Dans tous les autres cas,
 * la date de création n'est jamais à null. Si elle est non renseignée,
 * elle sera au 01/01/1900. La date de création ne correspond pas
 * obligatoirement à dateDebut de la première période de l'unité légale.
 * Certaines variables historisées peuvent posséder des dates de début
 * soit au 01/01/1900, soit antérieures à la date de création.”
 */
export const parseDateCreationInsee = (
  dateCreation: string | null | undefined
) => {
  if (!dateCreation || dateCreation === '1900-01-01') {
    return '';
  }
  return dateCreation;
};
