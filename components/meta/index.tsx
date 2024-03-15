export const SITE_NAME =
  'Annuaire des Entreprises : le moteur de recherche officiel';
export const SITE_DESCRIPTION =
  'L’administration permet aux particuliers et agents publics de vérifier les informations juridiques officielles d’une entreprise : SIREN, SIRET, TVA Intracommunautaire, code APE/NAF, capital social, justificatif d’immatriculation, dirigeants, convention collective…';

export const SHOULD_NOT_INDEX = process.env.INDEXING_ENABLED !== 'enabled';
export const OPENGRAPH_IMAGES = [
  {
    url: 'https://annuaire-entreprises.data.gouv.fr/images/linkedin.jpg',
    width: 1200,
    height: 627,
    alt: 'annuaire-entreprises.data.gouv.fr',
  },
];
