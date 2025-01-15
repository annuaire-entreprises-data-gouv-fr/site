import routes from '#clients/routes';
import { IEffectifsAnnuelsProtected } from '#models/espace-agent/effectifs/annuels';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseRcpEffectifsAnnuels } from './types';

/**
 * GET effectifs from API Entreprise
 */
export async function clientApiEntrepriseEffectifsAnnuels(
  siren: Siren,
  year: number
) {
  return await clientAPIEntreprise<
    IAPIEntrepriseRcpEffectifsAnnuels,
    IEffectifsAnnuelsProtected
  >(
    `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.effectifs.annuels(
      siren,
      year
    )}`,
    mapToDomainObject
  );
}

const mapToDomainObject = ({
  data: { effectifs_annuel, annee },
}: IAPIEntrepriseRcpEffectifsAnnuels): IEffectifsAnnuelsProtected => {
  const trancheEffectif = effectifs_annuel.reduce((sum, item) => {
    return sum + (item.value || 0);
  }, 0);

  return {
    effectif: trancheEffectif, // can be a float
    anneeEffectif: annee,
  };
};
