import { useEffect, useState } from 'react';
import { HttpNotFound } from '#clients/exceptions';
import { clientBilansFinanciers } from '#clients/open-data-soft/clients/bilans-financiers';
import { EAdministration } from '#models/administrations';
import { APILoadingFactory, IAPILoading } from '#models/api-loading';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { IFinancesSociete } from '#models/finances-societe/types';
import { IUniteLegale } from '#models/index';
import logErrorInSentry from '#utils/sentry';

export const useFinancesSociete = (uniteLegale: IUniteLegale) => {
  const [finances, setFinances] = useState<
    IFinancesSociete | IAPINotRespondingError | IAPILoading
  >(APILoadingFactory());

  useEffect(() => {
    const fetchData = async () => {
      const { siren } = uniteLegale;
      try {
        const response = await clientBilansFinanciers(siren).catch((e) => {
          if (e instanceof HttpNotFound) {
            return APINotRespondingFactory(EAdministration.MEF, 404);
          }
          logErrorInSentry(e, {
            errorMessage: 'Error in API data financieres',
            siren,
          });
          return APINotRespondingFactory(EAdministration.MEF, e.status || 500);
        });

        setFinances(response);
      } catch (e: any) {
        logErrorInSentry(e, { errorMessage: 'Error in API data financieres' });
        setFinances(APINotRespondingFactory(EAdministration.MEF, 500));
      }
    };

    fetchData();
  }, [uniteLegale]);

  return finances;
};

export default useFinancesSociete;
