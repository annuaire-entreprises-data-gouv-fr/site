import routes from '#clients/routes';
import constants from '#models/constants';
import { httpGet } from '#utils/network';

interface IVIESResponse {
  isValid: boolean;
  requestDate: string; //'2022-08-31T17:46:07.763Z';
  userError: string; //'VALID';
  name: string; //'SASU GANYMEDE';
  address: string; //'OCP BUSINESS CENTER 4\n128 RUE LA BOETIE\n75008 PARIS';
  requestIdentifier: string; //'';
  vatNumber: string; //'09880878145';
  viesApproximate: any;
  // {
  //   name: '---';
  //   street: '---';
  //   postalCode: '---';
  //   city: '---';
  //   companyType: '---';
  //   matchName: 3;
  //   matchStreet: 3;
  //   matchPostalCode: 3;
  //   matchCity: 3;
  //   matchCompanyType: 3;
  // };
}

/**
 * Call VIES to validate a French TVA number
 * @param tva
 * @returns TVA number if valid else null
 */
export const clientTVA = async (
  tva: string,
  useCache = true
): Promise<string | null> => {
  const url = `${routes.tva.vies}${tva}`;

  const response = await httpGet(
    url,
    {
      timeout: constants.timeout.XXL,
    },
    useCache
  );
  const data = response.data as IVIESResponse;
  return data.isValid ? `FR${data.vatNumber}` : null;
};
