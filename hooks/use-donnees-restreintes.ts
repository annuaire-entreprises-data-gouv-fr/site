import { useEffect, useState } from 'react';
import { IDonneesRestreinteUniteLegale } from '#models/espace-agent/donnees-restreintes-entreprise';
import { IUniteLegale } from '#models/index';

export const useDonneesRestreintes = (uniteLegale: IUniteLegale) => {
  const [donneesRestreintes, setDonneesRestreintes] =
    useState<IDonneesRestreinteUniteLegale | null>(null);

  const donneesRestreintesUrl = `/api/data-fetching/espace-agent/conformite/${uniteLegale.siege.siret}`;

  useEffect(() => {
    const fetchDonneesRestreintes = async () => {
      const response = await fetch(donneesRestreintesUrl);
      const data = await response.json();
      setDonneesRestreintes(data);
    };

    fetchDonneesRestreintes();
  }, [uniteLegale]);

  return { donneesRestreintes };
};

export default useDonneesRestreintes;
