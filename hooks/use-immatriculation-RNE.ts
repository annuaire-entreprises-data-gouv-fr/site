import { useEffect, useState } from 'react';
import { APILoadingFactory, IAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IImmatriculationRNE } from '#models/immatriculation';
import { IUniteLegale } from '#models/index';
import httpFrontClient from '#utils/network/frontend';

const RNE_ROUTE = '/api/rne';
export const useImmmatriculationRNE = (uniteLegale: IUniteLegale) => {
  const [immatriculationRNE, setImmatriculationRNE] = useState<
    IImmatriculationRNE | IAPINotRespondingError | IAPILoading
  >(APILoadingFactory());

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
