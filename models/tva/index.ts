import { estActif } from '#models/core/etat-administratif';
import { IEtablissement, IUniteLegale } from '../core/types';
import { tvaNumber } from './utils';

export type ITVAIntracommunautaire = {
  number: string;
  mayHaveMultipleTVANumber: {
    allTime: boolean;
    currentlyActive: boolean;
  };
};

function haveMultipleNafs(etablissementsList: IEtablissement[] = []) {
  return (
    Array.from(new Set(etablissementsList.map((e) => e.activitePrincipale)))
      .length > 1
  );
}

export const getTvaUniteLegale = (
  uniteLegale: IUniteLegale
): ITVAIntracommunautaire | null => {
  if (!estActif(uniteLegale)) {
    return null;
  }
  return {
    number: tvaNumber(uniteLegale.siren),
    mayHaveMultipleTVANumber: {
      allTime: haveMultipleNafs(uniteLegale.etablissements.all),
      currentlyActive: haveMultipleNafs(uniteLegale.etablissements.open),
    },
  };
};
