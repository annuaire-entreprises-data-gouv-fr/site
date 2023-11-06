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
        setFinances(await clientBilansFinanciers(siren));
      } catch (e: any) {
        if (!(e instanceof HttpNotFound)) {
          logErrorInSentry(e, {
            errorName: 'Error in API data financieres',
            siren,
          });
        }
        setFinances(
          APINotRespondingFactory(EAdministration.MEF, e.status || 500)
        );
      }
    };

    fetchData();
  }, [uniteLegale]);

  return finances;
};

export default useFinancesSociete;
