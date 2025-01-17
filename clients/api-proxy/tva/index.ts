import { clientAPIProxy } from '#clients/api-proxy/client';
import routes from '#clients/routes';
import constants from '#models/constants';
import { TVANumber } from '#utils/helpers';

type IVIESResponse = {
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
};

/**
 * Specific exception raised by VIES endpoint
 */
export class TVAUserException extends Error {
  constructor(public message: string) {
    super(message);
    this.message = message;
    this.name = 'TVAUserException';
  }
}

/**
 * Call VIES to validate a French TVA number
 * @param tva
 * @returns TVA number if valid else null
 */
export const clientTVA = async (tva: TVANumber): Promise<string | null> => {
  const url = routes.proxy.tva(tva);

  const data = await clientAPIProxy<IVIESResponse>(url, {
    timeout: constants.timeout.XXL,
  });

  if (data.userError && ['VALID', 'INVALID'].indexOf(data.userError) === -1) {
    throw new TVAUserException(data.userError);
  }

  return data.isValid ? data.vatNumber : null;
};
