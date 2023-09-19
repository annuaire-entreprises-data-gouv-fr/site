import { useEffect, useState } from 'react';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IImmatriculationRNE } from '#models/immatriculation';
import { IUniteLegale } from '#models/index';
import httpFrontClient from '#utils/network/frontend';

const RNE_ROUTE = '/api/rne';
export const useImmmatriculationRNE = (uniteLegale: IUniteLegale) => {
  const [immatriculationRNE, setImmatriculationRNE] = useState<
    IImmatriculationRNE | IAPINotRespondingError | null
  >(null);

  useEffect(() => {
    const fetchDonneesRestreintes = async () => {
      const response = await httpFrontClient<IImmatriculationRNE>(
        RNE_ROUTE + '/' + uniteLegale.siren
      );
      setImmatriculationRNE(response);
    };

    fetchDonneesRestreintes();
  }, [uniteLegale]);

  return immatriculationRNE;
};

export default useImmmatriculationRNE;
