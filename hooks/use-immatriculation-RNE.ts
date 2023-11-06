import { useEffect, useState } from 'react';
import routes from '#clients/routes';
import { EAdministration } from '#models/administrations';
import { APILoadingFactory, IAPILoading } from '#models/api-loading';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { IImmatriculationRNE } from '#models/immatriculation';
import { IUniteLegale } from '#models/index';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';

export const useImmmatriculationRNE = (uniteLegale: IUniteLegale) => {
  const [immatriculationRNE, setImmatriculationRNE] = useState<
    IImmatriculationRNE | IAPINotRespondingError | IAPILoading
  >(APILoadingFactory());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpGet<IImmatriculationRNE>(
          routes.api.rne + '/' + uniteLegale.siren
        );
        setImmatriculationRNE(response);
      } catch (e: any) {
        logErrorInSentry(e, {
          errorName: 'RNE API error',
        });
        setImmatriculationRNE(
          APINotRespondingFactory(EAdministration.INPI, 500)
        );
      }
    };

    fetchData();
  }, [uniteLegale]);

  return immatriculationRNE;
};

export default useImmmatriculationRNE;
