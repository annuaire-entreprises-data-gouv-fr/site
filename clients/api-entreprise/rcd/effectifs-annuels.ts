import routes from '#clients/routes';
import { IRcdEffectifsAnnuelsProtected } from '#models/espace-agent/rcd/effectifs-annuels';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseRcpEffectifsAnnuels } from './types';

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseRcdEffectifsAnnuels(siren: Siren) {
  return await clientAPIEntreprise<
    IAPIEntrepriseRcpEffectifsAnnuels,
    IRcdEffectifsAnnuelsProtected
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.rcd.effectifsAnnuels(
      siren,
      new Date().getFullYear() - 1
    )}`,
    mapToDomainObject
  );
}

const mapToDomainObject = ({
  data: { effectifs_annuel, annee },
}: IAPIEntrepriseRcpEffectifsAnnuels): IRcdEffectifsAnnuelsProtected => {
  const trancheEffectif = effectifs_annuel.reduce((sum, item) => {
    return sum + (item.value || 0);
  }, 0);

  return {
    trancheEffectif: Math.round(trancheEffectif), // Ensure it's an integer if needed
    anneeTrancheEffectif: parseInt(annee, 10),
  };
};
