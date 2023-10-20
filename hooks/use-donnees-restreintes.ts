import { useEffect, useState } from 'react';
import { IDonneesRestreinteUniteLegale } from '#models/espace-agent/donnees-restreintes-entreprise';
import { IUniteLegale } from '#models/index';
import { httpGet } from '#utils/network';

export const useDonneesRestreintes = (uniteLegale: IUniteLegale) => {
  const [donneesRestreintes, setDonneesRestreintes] =
    useState<IDonneesRestreinteUniteLegale | null>(null);

  useEffect(() => {
    const donneesRestreintesUrl = `/api/data-fetching/espace-agent/conformite/${uniteLegale.siege.siret}`;
    const fetchDonneesRestreintes = async () => {
      const data = await httpGet<IDonneesRestreinteUniteLegale>(
        donneesRestreintesUrl
      );
      setDonneesRestreintes(data);
    };

    fetchDonneesRestreintes();
  }, [uniteLegale]);

  return { donneesRestreintes };
};

export default useDonneesRestreintes;
