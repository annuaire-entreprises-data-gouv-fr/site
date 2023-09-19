import { useEffect, useState } from "react";
import { IDonneesRestreinteUniteLegale } from '#models/espace-agent/donnees-restreintes-entreprise';
import { IUniteLegale } from "#models/index";

export const useDonneesRestreintes = (uniteLegale: IUniteLegale) => {
  const [isLoading, setIsLoading] = useState(true);
  const [donneesRestreintes, setDonneesRestreintes] = useState<IDonneesRestreinteUniteLegale | null>(null);

  const donneesRestreintesUrl = `/api/espace-agent/conformite/${uniteLegale.siege.siret}`;

  useEffect(() => {
    setIsLoading(true);

    const fetchDonneesRestreintes = async () => {
      const response = await fetch(donneesRestreintesUrl);
      const data = await response.json();
      setDonneesRestreintes(data);
      setIsLoading(false);
    };

    fetchDonneesRestreintes();
  }, [uniteLegale]);

  return { isLoading , donneesRestreintes};
}

export default useDonneesRestreintes;
